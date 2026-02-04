// ============================================
// GRÁFICOS CHART.JS
// ============================================
let chartTemas = null;
let chartActivos = null;

// Colores del tema Neon Blue
const chartColors = {
    blue: 'rgba(0, 212, 255, 0.8)',
    cyan: 'rgba(0, 255, 255, 0.8)',
    electric: 'rgba(0, 153, 255, 0.8)',
    gradient: ['rgba(0, 212, 255, 0.8)', 'rgba(0, 255, 255, 0.8)', 'rgba(0, 153, 255, 0.8)', 'rgba(102, 204, 255, 0.8)', 'rgba(51, 181, 255, 0.8)'],
    border: 'rgba(0, 212, 255, 1)',
    grid: 'rgba(0, 212, 255, 0.1)',
    text: 'rgba(160, 196, 255, 0.9)'
};

// Configuración global de Chart.js
Chart.defaults.color = chartColors.text;
Chart.defaults.borderColor = chartColors.grid;
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

function inicializarGraficoTemas(datos) {
    const ctx = document.getElementById('chart-temas');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (chartTemas) {
        chartTemas.destroy();
    }

    // Ordenar datos por cantidad
    const datosOrdenados = [...datos].sort((a, b) => b.count - a.count).slice(0, 10);
    const labels = datosOrdenados.map(d => capitalizeFirst(d.tema));
    const valores = datosOrdenados.map(d => d.count);

    chartTemas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Consultas',
                data: valores,
                backgroundColor: chartColors.gradient,
                borderColor: chartColors.border,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: 'rgba(0, 255, 255, 1)',
                hoverBorderColor: 'rgba(255, 255, 255, 0.8)',
                hoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: '📊 Distribución de Temas Más Consultados',
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 20, 35, 0.95)',
                    titleColor: 'rgba(0, 212, 255, 1)',
                    bodyColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(0, 212, 255, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                            return `Consultas: ${context.parsed.y} (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: chartColors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            size: 12
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function inicializarGraficoActivos(datos) {
    const ctx = document.getElementById('chart-activos');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (chartActivos) {
        chartActivos.destroy();
    }

    // Tomar top 10 estudiantes
    const topEstudiantes = [...datos].slice(0, 10);
    const labels = topEstudiantes.map(d => d.Nombre.split(' ')[0]); // Primer nombre
    const valores = topEstudiantes.map(d => d.Contador);

    // Colores para el top 3
    const backgroundColors = valores.map((_, i) => {
        if (i === 0) return 'rgba(255, 215, 0, 0.8)'; // Oro
        if (i === 1) return 'rgba(192, 192, 192, 0.8)'; // Plata
        if (i === 2) return 'rgba(205, 127, 50, 0.8)'; // Bronce
        return chartColors.blue;
    });

    chartActivos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Preguntas',
                data: valores,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(c => c.replace('0.8', '1')),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: backgroundColors.map(c => c.replace('0.8', '1')),
                hoverBorderColor: 'rgba(255, 255, 255, 0.8)',
                hoverBorderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: '🏆 Top 10 Estudiantes Más Activos',
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 20, 35, 0.95)',
                    titleColor: 'rgba(0, 212, 255, 1)',
                    bodyColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(0, 212, 255, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        padding: 8
                    }
                },
                x: {
                    beginAtZero: true,
                    grid: {
                        color: chartColors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            size: 12
                        },
                        padding: 10,
                        precision: 0
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// CONFIGURACIÓN DE WEBHOOKS N8N (CON PROXY LOCAL)
// ============================================
const CONFIG = {
    // Conexión directa a N8N
    baseUrl: 'https://micro-bits-n8n.aejhww.easypanel.host/webhook',
    // baseUrl: window.location.origin + '/api/n8n', // Proxy local (alternativa)
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

// Conexión directa a N8N - sin necesidad de servidor local

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
    inicializarMetricasInteractivas();
    cargarCursos();
});

function inicializarMetricasInteractivas() {
    // Event listeners para las tarjetas de métricas
    document.querySelectorAll('.metrica-card').forEach(card => {
        card.addEventListener('click', () => {
            const metrica = card.dataset.metrica;
            toggleDetalleMetrica(metrica, card);
        });
    });

    // Botón cerrar panel
    document.getElementById('btn-close-detail').addEventListener('click', () => {
        cerrarPanelDetalle();
    });
}

function toggleDetalleMetrica(metrica, card) {
    const panel = document.getElementById('metricas-detail-panel');
    const title = document.getElementById('detail-panel-title');
    const content = document.getElementById('detail-panel-content');

    // Remover clase activa de todas las tarjetas
    document.querySelectorAll('.metrica-card').forEach(c => {
        c.classList.remove('active-detail');
    });

    // Si el panel ya está abierto y es la misma métrica, cerrarlo
    if (!panel.classList.contains('hidden') && panel.dataset.metrica === metrica) {
        cerrarPanelDetalle();
        return;
    }

    // Activar tarjeta actual
    card.classList.add('active-detail');

    // Mostrar panel con contenido específico
    panel.classList.remove('hidden');
    panel.dataset.metrica = metrica;

    // Generar contenido según la métrica
    switch(metrica) {
        case 'estudiantes':
            title.innerHTML = '<i class="fas fa-user-graduate" style="color: var(--neon-blue)"></i> Estudiantes Activos - Detalle';
            content.innerHTML = generarDetalleEstudiantes();
            break;
        case 'preguntas':
            title.innerHTML = '<i class="fas fa-comments" style="color: var(--neon-cyan)"></i> Preguntas Totales - Distribución';
            content.innerHTML = generarDetallePreguntas();
            break;
        case 'promedio':
            title.innerHTML = '<i class="fas fa-chart-line" style="color: #ff9966"></i> Promedio de Preguntas - Estadísticas';
            content.innerHTML = generarDetallePromedio();
            break;
        case 'temas':
            title.innerHTML = '<i class="fas fa-book" style="color: var(--success-green)"></i> Temas Consultados - Lista Completa';
            content.innerHTML = generarDetalleTemas();
            break;
    }
}

function cerrarPanelDetalle() {
    const panel = document.getElementById('metricas-detail-panel');
    panel.classList.add('hidden');
    panel.dataset.metrica = '';
    document.querySelectorAll('.metrica-card').forEach(c => {
        c.classList.remove('active-detail');
    });
}

function generarDetalleEstudiantes() {
    const estudiantes = state.datos.contador
        .filter(e => e.Contador > 0)
        .sort((a, b) => b.Contador - a.Contador);

    if (estudiantes.length === 0) {
        return '<p class="tabla-empty visible" style="display: flex"><i class="fas fa-inbox"></i><p>No hay estudiantes activos</p></p>';
    }

    const total = estudiantes.length;
    const html = `
        <div class="detail-chart-container">
            <div style="flex: 1; max-width: 300px;">
                <canvas id="mini-chart-estudiantes"></canvas>
            </div>
            <div class="detail-chart-info">
                <div class="detail-stat">
                    <div class="detail-stat-value">${total}</div>
                    <div class="detail-stat-label">Total Activos</div>
                </div>
                <div class="detail-stat">
                    <div class="detail-stat-value">${estudiantes.reduce((sum, e) => sum + e.Contador, 0)}</div>
                    <div class="detail-stat-label">Preguntas Realizadas</div>
                </div>
            </div>
        </div>
        <div class="detail-list">
            ${estudiantes.slice(0, 15).map((est, i) => `
                <div class="detail-item">
                    <span class="detail-item-name">
                        <span style="color: var(--neon-cyan); margin-right: 8px;">#${i + 1}</span>
                        ${est.Nombre}
                    </span>
                    <span class="detail-item-value">${est.Contador}</span>
                </div>
            `).join('')}
        </div>
    `;

    // Crear mini gráfico después de insertar HTML
    setTimeout(() => crearMiniChartEstudiantes(estudiantes), 100);

    return html;
}

function generarDetallePreguntas() {
    const estudiantes = state.datos.contador
        .filter(e => e.Contador > 0)
        .sort((a, b) => b.Contador - a.Contador);

    if (estudiantes.length === 0) {
        return '<p class="tabla-empty visible" style="display: flex"><i class="fas fa-inbox"></i><p>No hay datos de preguntas</p></p>';
    }

    const totalPreguntas = estudiantes.reduce((sum, e) => sum + e.Contador, 0);

    const html = `
        <div class="detail-chart-container">
            <div style="flex: 1; max-width: 350px;">
                <canvas id="mini-chart-preguntas"></canvas>
            </div>
            <div class="detail-chart-info">
                <div class="detail-stat">
                    <div class="detail-stat-value">${totalPreguntas}</div>
                    <div class="detail-stat-label">Preguntas Totales</div>
                </div>
                <div class="detail-stat">
                    <div class="detail-stat-value">${estudiantes.length}</div>
                    <div class="detail-stat-label">Estudiantes Participaron</div>
                </div>
            </div>
        </div>
        <div class="detail-list">
            ${estudiantes.slice(0, 15).map(est => {
                const porcentaje = ((est.Contador / totalPreguntas) * 100).toFixed(1);
                return `
                    <div class="detail-item">
                        <span class="detail-item-name">${est.Nombre}</span>
                        <span class="detail-item-value">${est.Contador}</span>
                        <span class="detail-item-percentage">${porcentaje}%</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    setTimeout(() => crearMiniChartPreguntas(estudiantes, totalPreguntas), 100);

    return html;
}

function generarDetallePromedio() {
    const estudiantes = state.datos.contador.filter(e => e.Contador > 0);
    const totalEstudiantes = estudiantes.length;
    const totalPreguntas = estudiantes.reduce((sum, e) => sum + e.Contador, 0);
    const promedio = totalEstudiantes > 0 ? (totalPreguntas / totalEstudiantes).toFixed(1) : 0;

    // Calcular distribución
    const distribucion = {
        bajo: estudiantes.filter(e => e.Contador < 5).length,
        medio: estudiantes.filter(e => e.Contador >= 5 && e.Contador < 15).length,
        alto: estudiantes.filter(e => e.Contador >= 15).length
    };

    const html = `
        <div class="detail-chart-container">
            <div style="flex: 1; max-width: 350px;">
                <canvas id="mini-chart-promedio"></canvas>
            </div>
            <div class="detail-chart-info">
                <div class="detail-stat">
                    <div class="detail-stat-value">${promedio}</div>
                    <div class="detail-stat-label">Promedio General</div>
                </div>
                <div class="detail-stat">
                    <div class="detail-stat-value" style="font-size: 24px;">${totalPreguntas} ÷ ${totalEstudiantes}</div>
                    <div class="detail-stat-label">Cálculo</div>
                </div>
            </div>
        </div>
        <div class="detail-list">
            <div class="detail-item">
                <span class="detail-item-name">
                    <i class="fas fa-arrow-up" style="color: var(--success-green); margin-right: 8px;"></i>
                    Alta Actividad (15+ preguntas)
                </span>
                <span class="detail-item-value">${distribucion.alto}</span>
            </div>
            <div class="detail-item">
                <span class="detail-item-name">
                    <i class="fas fa-minus" style="color: #ff9966; margin-right: 8px;"></i>
                    Media Actividad (5-14 preguntas)
                </span>
                <span class="detail-item-value">${distribucion.medio}</span>
            </div>
            <div class="detail-item">
                <span class="detail-item-name">
                    <i class="fas fa-arrow-down" style="color: var(--text-gray); margin-right: 8px;"></i>
                    Baja Actividad (1-4 preguntas)
                </span>
                <span class="detail-item-value">${distribucion.bajo}</span>
            </div>
        </div>
    `;

    setTimeout(() => crearMiniChartPromedio(distribucion), 100);

    return html;
}

function generarDetalleTemas() {
    const temasAgrupados = {};
    state.datos.temas.forEach(t => {
        const tema = t.Tema.toLowerCase();
        temasAgrupados[tema] = (temasAgrupados[tema] || 0) + 1;
    });

    const temas = Object.entries(temasAgrupados)
        .map(([tema, count]) => ({ tema, count }))
        .sort((a, b) => b.count - a.count);

    if (temas.length === 0) {
        return '<p class="tabla-empty visible" style="display: flex"><i class="fas fa-inbox"></i><p>No hay temas registrados</p></p>';
    }

    const total = temas.reduce((sum, t) => sum + t.count, 0);

    const html = `
        <div class="detail-chart-container">
            <div style="flex: 1; max-width: 350px;">
                <canvas id="mini-chart-temas"></canvas>
            </div>
            <div class="detail-chart-info">
                <div class="detail-stat">
                    <div class="detail-stat-value">${temas.length}</div>
                    <div class="detail-stat-label">Temas Únicos</div>
                </div>
                <div class="detail-stat">
                    <div class="detail-stat-value">${total}</div>
                    <div class="detail-stat-label">Total Consultas</div>
                </div>
            </div>
        </div>
        <div class="detail-list">
            ${temas.map(t => {
                const porcentaje = ((t.count / total) * 100).toFixed(1);
                return `
                    <div class="detail-item">
                        <span class="detail-item-name"><span class="tema-badge" style="font-size: 11px; padding: 4px 10px;">${t.tema}</span></span>
                        <span class="detail-item-value">${t.count}</span>
                        <span class="detail-item-percentage">${porcentaje}%</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    setTimeout(() => crearMiniChartTemas(temas.slice(0, 8)), 100);

    return html;
}

// Mini gráficos para los paneles de detalle
function crearMiniChartEstudiantes(estudiantes) {
    const ctx = document.getElementById('mini-chart-estudiantes');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: estudiantes.slice(0, 6).map(e => e.Nombre.split(' ')[0]),
            datasets: [{
                data: estudiantes.slice(0, 6).map(e => e.Contador),
                backgroundColor: [
                    'rgba(0, 212, 255, 0.8)',
                    'rgba(0, 255, 255, 0.8)',
                    'rgba(0, 153, 255, 0.8)',
                    'rgba(102, 204, 255, 0.8)',
                    'rgba(51, 181, 255, 0.8)',
                    'rgba(0, 128, 255, 0.8)'
                ],
                borderColor: 'rgba(0, 212, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(160, 196, 255, 0.9)',
                        font: { size: 11 },
                        padding: 10
                    }
                }
            }
        }
    });
}

function crearMiniChartPreguntas(estudiantes, total) {
    const ctx = document.getElementById('mini-chart-preguntas');
    if (!ctx) return;

    const top5 = estudiantes.slice(0, 5);
    const otros = total - top5.reduce((sum, e) => sum + e.Contador, 0);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [...top5.map(e => e.Nombre.split(' ')[0]), 'Otros'],
            datasets: [{
                data: [...top5.map(e => e.Contador), otros],
                backgroundColor: [
                    'rgba(0, 212, 255, 0.8)',
                    'rgba(0, 255, 255, 0.8)',
                    'rgba(0, 153, 255, 0.8)',
                    'rgba(102, 204, 255, 0.8)',
                    'rgba(51, 181, 255, 0.8)',
                    'rgba(107, 125, 153, 0.5)'
                ],
                borderColor: 'rgba(0, 212, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(160, 196, 255, 0.9)',
                        font: { size: 11 },
                        padding: 10
                    }
                }
            }
        }
    });
}

function crearMiniChartPromedio(distribucion) {
    const ctx = document.getElementById('mini-chart-promedio');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Alta', 'Media', 'Baja'],
            datasets: [{
                label: 'Estudiantes',
                data: [distribucion.alto, distribucion.medio, distribucion.bajo],
                backgroundColor: [
                    'rgba(0, 255, 136, 0.8)',
                    'rgba(255, 153, 102, 0.8)',
                    'rgba(107, 125, 153, 0.5)'
                ],
                borderColor: [
                    'rgba(0, 255, 136, 1)',
                    'rgba(255, 153, 102, 1)',
                    'rgba(107, 125, 153, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'rgba(160, 196, 255, 0.9)', precision: 0 },
                    grid: { color: 'rgba(0, 212, 255, 0.1)' }
                },
                x: {
                    ticks: { color: 'rgba(160, 196, 255, 0.9)' },
                    grid: { display: false }
                }
            }
        }
    });
}

function crearMiniChartTemas(temas) {
    const ctx = document.getElementById('mini-chart-temas');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: temas.map(t => capitalizeFirst(t.tema)),
            datasets: [{
                data: temas.map(t => t.count),
                backgroundColor: [
                    'rgba(0, 212, 255, 0.7)',
                    'rgba(0, 255, 255, 0.7)',
                    'rgba(0, 153, 255, 0.7)',
                    'rgba(102, 204, 255, 0.7)',
                    'rgba(51, 181, 255, 0.7)',
                    'rgba(0, 128, 255, 0.7)',
                    'rgba(77, 166, 255, 0.7)',
                    'rgba(26, 204, 255, 0.7)'
                ],
                borderColor: 'rgba(0, 212, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(160, 196, 255, 0.9)',
                        font: { size: 10 },
                        padding: 8
                    }
                }
            },
            scales: {
                r: {
                    ticks: { display: false },
                    grid: { color: 'rgba(0, 212, 255, 0.1)' }
                }
            }
        }
    });
}

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

        // Cargar datos independientemente (si uno falla, los otros continúan)
        const resultados = await Promise.allSettled([
            fetchData(CONFIG.endpoints.estudiantes, { curso: state.cursoActual }),
            fetchData(CONFIG.endpoints.preguntas, { curso: state.cursoActual }),
            fetchData(CONFIG.endpoints.temas, { curso: state.cursoActual }),
            fetchData(CONFIG.endpoints.contador, { curso: state.cursoActual })
        ]);

        // Procesar cada resultado independientemente
        state.datos.estudiantes = resultados[0].status === 'fulfilled' ? resultados[0].value : [];
        state.datos.preguntas = resultados[1].status === 'fulfilled' ? resultados[1].value : [];
        state.datos.temas = resultados[2].status === 'fulfilled' ? resultados[2].value : [];
        state.datos.contador = resultados[3].status === 'fulfilled' ? resultados[3].value : [];

        // Mostrar errores individuales si los hay
        resultados.forEach((result, index) => {
            if (result.status === 'rejected') {
                const endpoints = ['estudiantes', 'preguntas', 'temas', 'contador'];
                console.warn(`⚠️ Error cargando ${endpoints[index]}:`, result.reason);
            }
        });

        // Verificar si tenemos al menos algunos datos
        const tieneDatos = state.datos.estudiantes.length > 0 ||
                          state.datos.preguntas.length > 0 ||
                          state.datos.temas.length > 0;

        if (tieneDatos) {
            actualizarMetricas();
            renderizarTablaActual();
            mostrarToast('Datos actualizados correctamente', 'success');
        } else {
            // Si no hay datos de ningún endpoint, cargar ejemplos
            cargarDatosEjemplo();
        }
    } catch (error) {
        console.error('❌ Error general cargando datos:', error);
        mostrarToast(`Error: ${error.message}`, 'error');
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

    // Actualizar textos de detalle en las tarjetas
    actualizarDetalleMetricas(estudiantesActivos, preguntasTotales, promedio, temasUnicos);
}

function actualizarDetalleMetricas(estudiantes, preguntas, promedio, temas) {
    // Estudiantes: mostrar top estudiante
    const topEstudiante = state.datos.contador
        .filter(e => e.Contador > 0)
        .sort((a, b) => b.Contador - a.Contador)[0];

    if (topEstudiante) {
        document.getElementById('estudiantes-detail').textContent =
            `Top: ${topEstudiante.Nombre.split(' ')[0]} (${topEstudiante.Contador} preguntas)`;
    } else {
        document.getElementById('estudiantes-detail').textContent = 'Sin actividad';
    }

    // Preguntas: desglose
    document.getElementById('preguntas-detail').textContent =
        `${preguntas} preguntas realizadas por ${estudiantes} estudiantes`;

    // Promedio: interpretación
    let interpretacion = '';
    if (promedio == 0) interpretacion = 'Sin datos';
    else if (promedio < 5) interpretacion = 'Baja participación';
    else if (promedio < 15) interpretacion = 'Participación media';
    else interpretacion = 'Alta participación';

    document.getElementById('promedio-detail').textContent = interpretacion;

    // Temas: tema más consultado
    const temasAgrupados = {};
    state.datos.temas.forEach(t => {
        const tema = t.Tema.toLowerCase();
        temasAgrupados[tema] = (temasAgrupados[tema] || 0) + 1;
    });

    const temaTop = Object.entries(temasAgrupados)
        .sort((a, b) => b[1] - a[1])[0];

    if (temaTop) {
        document.getElementById('temas-detail').textContent =
            `Top: "${capitalizeFirst(temaTop[0])}" (${temaTop[1]} consultas)`;
    } else {
        document.getElementById('temas-detail').textContent = 'Sin datos';
    }
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

    let datos = state.datos.preguntas.filter(p => {
        const nombre = (p.Nombre || '').toLowerCase();
        const pregunta = (p['Preguntas Frecuentes'] || p.Pregunta || '').toLowerCase();
        return nombre.includes(state.busqueda) || pregunta.includes(state.busqueda);
    });

    // Ordenar por fecha más reciente
    datos.sort((a, b) => {
        const fechaA = new Date(a['Fecha de Pregunta'] || a.fecha || a.Fecha || 0);
        const fechaB = new Date(b['Fecha de Pregunta'] || b.fecha || b.Fecha || 0);
        return fechaB - fechaA;
    });

    if (datos.length === 0) {
        tbody.innerHTML = '';
        empty.classList.add('visible');
        actualizarPaginacion(0);
        return;
    }

    empty.classList.remove('visible');
    const { paginados, total } = paginar(datos);
    actualizarPaginacion(total);

    tbody.innerHTML = paginados.map(preg => {
        // Buscar la fecha en diferentes campos posibles
        const fecha = preg['Fecha de Pregunta'] || preg.fecha || preg.Fecha || '';
        const textoPregunta = preg['Preguntas Frecuentes'] || preg.Pregunta || '';

        return `
            <tr class="fade-in">
                <td><strong>${preg.Nombre}</strong></td>
                <td>${preg.Chat_id}</td>
                <td class="pregunta-text" title="${textoPregunta}">${textoPregunta}</td>
                <td class="fecha-tabla">${formatearFecha(fecha)}</td>
            </tr>
        `;
    }).join('');
}

function renderizarActivos() {
    const tbody = document.getElementById('tbody-activos');
    const empty = document.getElementById('empty-activos');
    const chartContainer = document.getElementById('chart-activos-container');

    let datos = state.datos.contador
        .filter(e => e.Nombre.toLowerCase().includes(state.busqueda))
        .sort((a, b) => b.Contador - a.Contador);

    if (datos.length === 0) {
        tbody.innerHTML = '';
        empty.classList.add('visible');
        chartContainer.classList.add('hidden');
        actualizarPaginacion(0);
        return;
    }

    empty.classList.remove('visible');
    chartContainer.classList.remove('hidden');

    const { paginados, total } = paginar(datos);
    actualizarPaginacion(total);

    // Actualizar gráfico con datos completos (sin paginación)
    inicializarGraficoActivos(datos);

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
    const chartContainer = document.getElementById('chart-temas-container');

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
        chartContainer.classList.add('hidden');
        actualizarPaginacion(0);
        return;
    }

    empty.classList.remove('visible');
    chartContainer.classList.remove('hidden');

    const { paginados, total } = paginar(datos);
    actualizarPaginacion(total);

    // Actualizar gráfico con datos completos (sin paginación)
    inicializarGraficoTemas(datos);

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
    if (!fechaISO) return '-';

    try {
        const fecha = new Date(fechaISO);

        // Verificar si la fecha es válida
        if (isNaN(fecha.getTime())) {
            console.warn('Fecha inválida:', fechaISO);
            return '-';
        }

        const opciones = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        return fecha.toLocaleDateString('es-ES', opciones);
    } catch (error) {
        console.error('Error formateando fecha:', error, 'Input:', fechaISO);
        return '-';
    }
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

    // Limpiar detalles
    document.getElementById('estudiantes-detail').textContent = '';
    document.getElementById('preguntas-detail').textContent = '';
    document.getElementById('promedio-detail').textContent = '';
    document.getElementById('temas-detail').textContent = '';

    // Cerrar panel de detalle si está abierto
    cerrarPanelDetalle();

    renderizarTablaActual();
}
