// ============================================
// CONFIGURACIÓN DE WEBHOOKS N8N (CON PROXY LOCAL)
// ============================================
const CONFIG = {
    // Usar proxy local para evitar problemas de CORS
    baseUrl: window.location.origin + '/api/n8n',
    // baseUrl: 'https://micro-bits-n8n.aejhww.easypanel.host/webhook', // URL directa (no funciona por CORS)
    endpoints: {
        estudiantes: '/dashboard-estudiantes',
        preguntas: '/dashboard-preguntas',
        temas: '/dashboard-temas',
        contador: '/dashboard-contador',
        cursos: '/dashboard-cursos',
        toggleEstudiante: '/toggle-estudiante'
    },
    itemsPerPage: 10
};

// Verificar que estamos usando el servidor local (no file:// ni Live Server)
function verificarServidorLocal() {
    const currentHost = window.location.hostname;
    const isLocal = currentHost === 'localhost' || currentHost === '127.0.0.1';
    const isNotFile = window.location.protocol !== 'file:';
    const isNotLiveServer = !window.location.port || window.location.port !== '5500';

    if (!isLocal || !isNotFile || window.location.port === '5500') {
        console.warn('⚠️ ADVERTENCIA: No estás usando el servidor local correcto.');
        console.warn('Por favor inicia el servidor con: node server.js o node server-alt.js');
        console.warn('Y navega a: http://localhost:3000 o http://127.0.0.1:8080');
    }
}

// Ejecutar verificación al cargar
verificarServidorLocal();

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================
let state = {
    cursoActual: '',
    tabActual: 'estudiantes',
    datos: {
        estudiantes: [],
        preguntas: [],
        temas: [],
        contador: []
    },
    paginacion: {
        pagina: 1,
        totalPaginas: 1
    },
    busqueda: ''
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarFecha();
    inicializarEventos();
    cargarCursos();
});

function inicializarFecha() {
    const fechaEl = document.getElementById('fecha-actual');
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    fechaEl.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

function inicializarEventos() {
    // Selector de curso
    document.getElementById('curso-select').addEventListener('change', (e) => {
        state.cursoActual = e.target.value;
        document.getElementById('curso-titulo').textContent =
            e.target.value ? e.target.options[e.target.selectedIndex].text : 'Seleccione un curso';
        if (e.target.value) {
            cargarTodosDatos();
        } else {
            limpiarDashboard();
        }
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            cambiarTab(tab.dataset.tab);
        });
    });

    // Búsqueda
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.busqueda = e.target.value.toLowerCase();
        state.paginacion.pagina = 1;
        renderizarTablaActual();
    });

    // Botón refrescar
    document.getElementById('btn-refresh').addEventListener('click', () => {
        if (state.cursoActual) {
            cargarTodosDatos();
        }
    });

    // Paginación
    document.getElementById('btn-anterior').addEventListener('click', () => {
        if (state.paginacion.pagina > 1) {
            state.paginacion.pagina--;
            renderizarTablaActual();
        }
    });

    document.getElementById('btn-siguiente').addEventListener('click', () => {
        if (state.paginacion.pagina < state.paginacion.totalPaginas) {
            state.paginacion.pagina++;
            renderizarTablaActual();
        }
    });
}

// ============================================
// FUNCIONES DE CARGA DE DATOS
// ============================================
async function cargarCursos() {
    try {
        // Por ahora, cursos de ejemplo. Después se cargará desde n8n
        const cursos = await fetchData(CONFIG.endpoints.cursos);

        const select = document.getElementById('curso-select');
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id || curso.nombre;
            option.textContent = curso.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando cursos:', error);
        // Cursos de ejemplo para desarrollo
        const cursosEjemplo = [
            { id: 'informatica-101', nombre: 'Informática 101' },
            { id: 'programacion-basica', nombre: 'Programación Básica' },
            { id: 'bases-datos', nombre: 'Bases de Datos' }
        ];
        const select = document.getElementById('curso-select');
        cursosEjemplo.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.nombre;
            select.appendChild(option);
        });
    }
}

async function cargarTodosDatos() {
    mostrarLoading(true);

    try {
        console.log('🔄 Cargando datos para curso:', state.cursoActual);

        // Cargar todos los datos en paralelo
        const [estudiantes, preguntas, temas, contador] = await Promise.all([
            fetchData(CONFIG.endpoints.estudiantes, { curso: state.cursoActual }),
            fetchData(CONFIG.endpoints.preguntas, { curso: state.cursoActual }),
            fetchData(CONFIG.endpoints.temas, { curso: state.cursoActual }),
            fetchData(CONFIG.endpoints.contador, { curso: state.cursoActual })
        ]);

        state.datos.estudiantes = estudiantes || [];
        state.datos.preguntas = preguntas || [];
        state.datos.temas = temas || [];
        state.datos.contador = contador || [];

        actualizarMetricas();
        renderizarTablaActual();

        mostrarToast('Datos actualizados correctamente', 'success');
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        mostrarToast(`Error: ${error.message}`, 'error');

        // Datos de ejemplo para desarrollo
        cargarDatosEjemplo();
    } finally {
        mostrarLoading(false);
    }
}

async function fetchData(endpoint, params = {}) {
    const url = new URL(CONFIG.baseUrl + endpoint);
    Object.keys(params).forEach(key => {
        if (params[key]) url.searchParams.append(key, params[key]);
    });

    console.log('🔍 Fetching:', url.toString());

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Data received:', data);
    return data;
}

function cargarDatosEjemplo() {
    // Datos de ejemplo para desarrollo/pruebas
    state.datos.estudiantes = [
        { Nombre: 'Juan Pérez', Chat_id: '573001234567', habilitado: true },
        { Nombre: 'María García', Chat_id: '573009876543', habilitado: true },
        { Nombre: 'Carlos López', Chat_id: '573005551234', habilitado: false },
        { Nombre: 'Ana Martínez', Chat_id: '573007778899', habilitado: true },
        { Nombre: 'Pedro Sánchez', Chat_id: '573003334455', habilitado: true }
    ];

    state.datos.contador = [
        { Nombre: 'Juan Pérez', Chat_id: '573001234567', Contador: 25 },
        { Nombre: 'María García', Chat_id: '573009876543', Contador: 18 },
        { Nombre: 'Ana Martínez', Chat_id: '573007778899', Contador: 15 },
        { Nombre: 'Pedro Sánchez', Chat_id: '573003334455', Contador: 12 },
        { Nombre: 'Carlos López', Chat_id: '573005551234', Contador: 8 }
    ];

    state.datos.preguntas = [
        { Nombre: 'Juan Pérez', Chat_id: '573001234567', 'Preguntas Frecuentes': '¿Qué es una base de datos relacional?', 'Fecha de Pregunta': '2026-01-30T14:30:00.000Z' },
        { Nombre: 'María García', Chat_id: '573009876543', 'Preguntas Frecuentes': '¿Cómo se crea una tabla en SQL?', 'Fecha de Pregunta': '2026-01-30T10:15:00.000Z' },
        { Nombre: 'Juan Pérez', Chat_id: '573001234567', 'Preguntas Frecuentes': '¿Qué es un archivo binario?', 'Fecha de Pregunta': '2026-01-29T16:45:00.000Z' },
        { Nombre: 'Ana Martínez', Chat_id: '573007778899', 'Preguntas Frecuentes': '¿Cómo funciona la digitalización?', 'Fecha de Pregunta': '2026-01-29T09:20:00.000Z' },
        { Nombre: 'Pedro Sánchez', Chat_id: '573003334455', 'Preguntas Frecuentes': '¿Qué es un disco duro SSD?', 'Fecha de Pregunta': '2026-01-28T11:00:00.000Z' }
    ];

    state.datos.temas = [
        { Chat_id: '573001234567', Nombre: 'Juan Pérez', Tema: 'basededatos' },
        { Chat_id: '573009876543', Nombre: 'María García', Tema: 'basededatos' },
        { Chat_id: '573001234567', Nombre: 'Juan Pérez', Tema: 'archivo' },
        { Chat_id: '573007778899', Nombre: 'Ana Martínez', Tema: 'digitalizacion' },
        { Chat_id: '573003334455', Nombre: 'Pedro Sánchez', Tema: 'disco duro' },
        { Chat_id: '573009876543', Nombre: 'María García', Tema: 'tabla' },
        { Chat_id: '573001234567', Nombre: 'Juan Pérez', Tema: 'software' },
        { Chat_id: '573007778899', Nombre: 'Ana Martínez', Tema: 'basededatos' }
    ];

    actualizarMetricas();
    renderizarTablaActual();
}

// ============================================
// MÉTRICAS
// ============================================
function actualizarMetricas() {
    // Estudiantes activos (aquellos con Contador > 0)
    const estudiantesActivos = state.datos.contador.filter(e => e.Contador > 0).length;
    document.getElementById('estudiantes-activos').textContent = estudiantesActivos;

    // Preguntas totales (suma de todos los contadores)
    const preguntasTotales = state.datos.contador.reduce((sum, e) => sum + (e.Contador || 0), 0);
    document.getElementById('preguntas-totales').textContent = preguntasTotales;

    // Promedio de preguntas
    const promedio = estudiantesActivos > 0 ? (preguntasTotales / estudiantesActivos).toFixed(1) : 0;
    document.getElementById('promedio-preguntas').textContent = promedio;

    // Temas únicos consultados
    const temasUnicos = new Set(state.datos.temas.map(t => t.Tema)).size;
    document.getElementById('temas-consultados').textContent = temasUnicos;
}

// ============================================
// TABS Y NAVEGACIÓN
// ============================================
function cambiarTab(tab) {
    state.tabActual = tab;
    state.paginacion.pagina = 1;
    state.busqueda = '';
    document.getElementById('search-input').value = '';

    // Actualizar UI de tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Ocultar todas las tablas
    document.querySelectorAll('.tabla-content').forEach(t => t.classList.add('hidden'));

    // Mostrar tabla correspondiente
    const tablaId = {
        'estudiantes': 'tabla-estudiantes',
        'preguntas': 'tabla-preguntas',
        'activos': 'tabla-activos',
        'temas': 'tabla-temas'
    };
    document.getElementById(tablaId[tab]).classList.remove('hidden');

    renderizarTablaActual();
}

// ============================================
// RENDERIZADO DE TABLAS
// ============================================
function renderizarTablaActual() {
    switch (state.tabActual) {
        case 'estudiantes':
            renderizarEstudiantes();
            break;
        case 'preguntas':
            renderizarPreguntas();
            break;
        case 'activos':
            renderizarActivos();
            break;
        case 'temas':
            renderizarTemas();
            break;
    }
}

function renderizarEstudiantes() {
    const tbody = document.getElementById('tbody-estudiantes');
    const empty = document.getElementById('empty-estudiantes');

    let datos = state.datos.estudiantes.filter(e =>
        e.Nombre.toLowerCase().includes(state.busqueda)
    );

    if (datos.length === 0) {
        tbody.innerHTML = '';
        empty.classList.add('visible');
        actualizarPaginacion(0);
        return;
    }

    empty.classList.remove('visible');
    const { paginados, total } = paginar(datos);
    actualizarPaginacion(total);

    tbody.innerHTML = paginados.map(est => `
        <tr class="fade-in">
            <td><strong>${est.Nombre}</strong></td>
            <td>${est.Chat_id}</td>
            <td>
                <span class="badge ${est.habilitado !== false ? 'badge-active' : 'badge-inactive'}">
                    ${est.habilitado !== false ? 'Habilitado' : 'Deshabilitado'}
                </span>
            </td>
            <td>
                <div class="toggle-container">
                    <div class="toggle ${est.habilitado !== false ? 'active' : ''}"
                         data-chatid="${est.Chat_id}"
                         onclick="toggleEstudiante('${est.Chat_id}', ${est.habilitado !== false})">
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderizarPreguntas() {
    const tbody = document.getElementById('tbody-preguntas');
    const empty = document.getElementById('empty-preguntas');

    let datos = state.datos.preguntas.filter(p =>
        p.Nombre.toLowerCase().includes(state.busqueda) ||
        p['Preguntas Frecuentes'].toLowerCase().includes(state.busqueda)
    );

    // Ordenar por fecha más reciente
    datos.sort((a, b) => new Date(b['Fecha de Pregunta']) - new Date(a['Fecha de Pregunta']));

    if (datos.length === 0) {
        tbody.innerHTML = '';
        empty.classList.add('visible');
        actualizarPaginacion(0);
        return;
    }

    empty.classList.remove('visible');
    const { paginados, total } = paginar(datos);
    actualizarPaginacion(total);

    tbody.innerHTML = paginados.map(preg => `
        <tr class="fade-in">
            <td><strong>${preg.Nombre}</strong></td>
            <td>${preg.Chat_id}</td>
            <td class="pregunta-text" title="${preg['Preguntas Frecuentes']}">${preg['Preguntas Frecuentes']}</td>
            <td class="fecha-tabla">${formatearFecha(preg['Fecha de Pregunta'])}</td>
        </tr>
    `).join('');
}

function renderizarActivos() {
    const tbody = document.getElementById('tbody-activos');
    const empty = document.getElementById('empty-activos');

    let datos = state.datos.contador
        .filter(e => e.Nombre.toLowerCase().includes(state.busqueda))
        .sort((a, b) => b.Contador - a.Contador);

    if (datos.length === 0) {
        tbody.innerHTML = '';
        empty.classList.add('visible');
        actualizarPaginacion(0);
        return;
    }

    empty.classList.remove('visible');
    const { paginados, total } = paginar(datos);
    actualizarPaginacion(total);

    // Calcular offset para posiciones correctas en paginación
    const offset = (state.paginacion.pagina - 1) * CONFIG.itemsPerPage;

    tbody.innerHTML = paginados.map((est, idx) => {
        const posicion = offset + idx + 1;
        let posicionClass = '';
        if (posicion === 1) posicionClass = 'gold';
        else if (posicion === 2) posicionClass = 'silver';
        else if (posicion === 3) posicionClass = 'bronze';

        return `
            <tr class="fade-in">
                <td><span class="badge-position ${posicionClass}">${posicion}</span></td>
                <td><strong>${est.Nombre}</strong></td>
                <td>${est.Chat_id}</td>
                <td><span class="contador-badge">${est.Contador}</span></td>
            </tr>
        `;
    }).join('');
}

function renderizarTemas() {
    const tbody = document.getElementById('tbody-temas');
    const empty = document.getElementById('empty-temas');

    // Agrupar y contar temas
    const temasAgrupados = {};
    state.datos.temas.forEach(t => {
        const tema = t.Tema.toLowerCase();
        temasAgrupados[tema] = (temasAgrupados[tema] || 0) + 1;
    });

    let datos = Object.entries(temasAgrupados)
        .map(([tema, count]) => ({ tema, count }))
        .filter(t => t.tema.includes(state.busqueda))
        .sort((a, b) => b.count - a.count);

    if (datos.length === 0) {
        tbody.innerHTML = '';
        empty.classList.add('visible');
        actualizarPaginacion(0);
        return;
    }

    empty.classList.remove('visible');
    const { paginados, total } = paginar(datos);
    actualizarPaginacion(total);

    const totalConsultas = datos.reduce((sum, t) => sum + t.count, 0);

    tbody.innerHTML = paginados.map(tema => {
        const porcentaje = ((tema.count / totalConsultas) * 100).toFixed(1);
        return `
            <tr class="fade-in">
                <td><span class="tema-badge">${tema.tema}</span></td>
                <td><span class="contador-badge">${tema.count}</span></td>
                <td>
                    <div class="tema-stats">
                        <span class="tema-porcentaje">${porcentaje}%</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${porcentaje}%"></div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// ACCIONES
// ============================================
async function toggleEstudiante(chatId, estadoActual) {
    const toggleEl = document.querySelector(`[data-chatid="${chatId}"]`);
    toggleEl.classList.add('loading');

    try {
        await fetch(CONFIG.baseUrl + CONFIG.endpoints.toggleEstudiante, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                habilitado: !estadoActual,
                curso: state.cursoActual
            })
        });

        // Actualizar estado local
        const estudiante = state.datos.estudiantes.find(e => e.Chat_id === chatId);
        if (estudiante) {
            estudiante.habilitado = !estadoActual;
        }

        renderizarEstudiantes();
        mostrarToast(
            `Estudiante ${!estadoActual ? 'habilitado' : 'deshabilitado'} correctamente`,
            'success'
        );
    } catch (error) {
        console.error('Error toggling estudiante:', error);
        mostrarToast('Error al cambiar estado del estudiante', 'error');
    } finally {
        toggleEl.classList.remove('loading');
    }
}

// ============================================
// UTILIDADES
// ============================================
function paginar(datos) {
    const total = Math.ceil(datos.length / CONFIG.itemsPerPage);
    state.paginacion.totalPaginas = total || 1;

    const inicio = (state.paginacion.pagina - 1) * CONFIG.itemsPerPage;
    const fin = inicio + CONFIG.itemsPerPage;

    return {
        paginados: datos.slice(inicio, fin),
        total
    };
}

function actualizarPaginacion(totalPaginas) {
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const pagInfo = document.getElementById('pag-info');

    btnAnterior.disabled = state.paginacion.pagina <= 1;
    btnSiguiente.disabled = state.paginacion.pagina >= totalPaginas;
    pagInfo.textContent = `Página ${state.paginacion.pagina} de ${totalPaginas || 1}`;
}

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function mostrarLoading(mostrar) {
    document.getElementById('loading').classList.toggle('hidden', !mostrar);
}

function mostrarToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toast-container');
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `
        <i class="fas ${iconos[tipo]}"></i>
        <span class="toast-message">${mensaje}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function limpiarDashboard() {
    state.datos = {
        estudiantes: [],
        preguntas: [],
        temas: [],
        contador: []
    };

    document.getElementById('estudiantes-activos').textContent = '0';
    document.getElementById('preguntas-totales').textContent = '0';
    document.getElementById('promedio-preguntas').textContent = '0';
    document.getElementById('temas-consultados').textContent = '0';

    renderizarTablaActual();
}
