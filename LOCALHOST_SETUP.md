# 🚀 Guía de Localhost - Interfaz Microbits

## ✅ Configuración Completa

El repositorio ya está configurado y listo para usar en localhost.

## 📋 Archivos Principales

- **index.html** - Página principal con dashboard y calendario
- **app.js** - Lógica de la aplicación (86KB)
- **styles.css** - Estilos (43KB)
- **.env.local** - Variables de entorno para N8N
- **.gitignore** - Archivos ignorados por git
- **package.json** - Scripts para iniciar el servidor

## 🎯 Cómo Usar en Localhost

### Opción 1: Abrir directamente (Más simple)

1. **Abre el archivo `index.html`** en tu navegador:
   - Doble clic en `index.html`
   - O arrastra el archivo a tu navegador

2. ¡Listo! La aplicación se abrirá con:
   - ✅ Pantalla de inicio con cursos
   - ✅ Dashboard completo
   - ✅ Calendario interactivo
   - ✅ Integración con N8N

### Opción 2: Con servidor (Recomendado)

```bash
# Con Node.js (necesitas tener Node instalado)
npm start

# Esto abrirá http://localhost:3000 automáticamente
```

### Opción 3: Con Python (si tienes Python)

```bash
# Python 3
python -m http.server 3000

# Luego abre http://localhost:3000
```

### Opción 4: Con VS Code Live Server

1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🔗 Configuración de N8N

Ya está configurado en `.env.local`:

```bash
VITE_N8N_API_URL=https://micro-bits-n8n.aejhww.easypanel.host
VITE_N8N_WEBHOOK_URL=https://micro-bits-n8n.aejhww.easypanel.host/webhook/Guardar-Evento
```

## 📦 Funcionalidades Incluidas

### ✨ Pantalla de Inicio
- Hero section con información de Microbits Institut
- Badges de valoración, experiencia, SOC, homologación
- Lista de cursos disponibles
- Calendario académico interactivo

### 📊 Dashboard Completo
- Estudiantes habilitados
- Preguntas frecuentes
- Estudiantes más activos
- Temas más consultados
- Gráficos con Chart.js
- Búsqueda y filtros
- Paginación

### 📅 Calendario
- Vista mensual interactiva
- Festivos de Cataluña/Reus
- Crear/editar/eliminar eventos
- Sincronización con Google Sheets vía N8N

## 🔄 Git Configurado

```bash
# Ver remoto configurado
git remote -v

# Output:
# origin	https://github.com/Alejomartinez1731/interfaz-microbits.git (fetch)
# origin	https://github.com/Alejomartinez1731/interfaz-microbits.git (push)
```

## 📤 Subir Cambios a GitHub

```bash
# Agregar cambios
git add .

# Commit
git commit -m "Descripción de los cambios"

# Push
git push -u origin master
```

## 📥 Actualizar desde GitHub

```bash
# Pull para actualizar tu local con cambios de GitHub
git pull origin master
```

## 🛠️ Solución de Problemas

### El calendario no muestra eventos
- Abre la consola del navegador (F12)
- Verifica que no haya errores de JavaScript
- Revisa que la API de N8N esté respondiendo

### Los datos no se cargan
- Verifica que la URL de N8N sea correcta en `.env.local`
- Abre la pestaña Network en DevTools (F12)
- Busca errores 404 o 500 en las peticiones a la API

### Git no funciona
- Verifica que `.git/config` tenga el remoto correcto
- Si necesitas reconectar: `git remote add origin https://github.com/Alejomartinez1731/interfaz-microbits.git`

## 📱 Estructura del Proyecto

```
interfaz-microbits/
├── index.html              # Página principal
├── app.js                  # Lógica de aplicación
├── styles.css              # Estilos
├── .env.local              # Variables de entorno (N8N)
├── .gitignore              # Archivos ignorados
├── package.json            # Scripts de inicio
├── LOCALHOST_SETUP.md      # Esta guía
└── api/                    # API routes para Vercel
```

## ✅ Checklist de Funcionamiento

- [x] Repositorio clonado de GitHub
- [x] Git configurado con remoto
- [x] Variables de entorno configuradas
- [x] Archivos principales presentes
- [x] Servidor local disponible
- [x] Integración N8N configurada

## 🎓 Próximos Pasos

1. **Abrir `index.html`** en tu navegador
2. **Probar la aplicación** creando un evento
3. **Verificar que se sincronice** con Google Sheets vía N8N
4. **Hacer commit** de cualquier cambio que hagas

---

**Estado**: ✅ Listo para usar en localhost

**URL del repositorio**: https://github.com/Alejomartinez1731/interfaz-microbits
