# Configuración de Variables de Entorno en Vercel

Este proyecto ahora usa un **proxy serverless** para conectarse a N8N, lo que permite cambiar la URL sin modificar el código.

## 📋 Pasos para Configurar en Vercel

### 1. Abrir Configuración del Proyecto

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto **interfaz-microbits**
3. Click en **Settings** (pestaña superior)
4. Click en **Environment Variables** (menú lateral)

### 2. Agregar la Variable de Entorno

Click en **Add New** y agrega:

| Campo | Valor |
|-------|-------|
| **Key** | `N8N_WEBHOOK_URL` |
| **Value** | `https://micro-bits-n8n.aejhww.easypanel.host/webhook` |
| **Environments** | ✅ Production ✅ Preview ✅ Development |

Click en **Save**

### 3. Redesplegar (Opcional)

Si el proyecto ya está desplegado, necesitas redesplegar para que las variables tengan efecto:

1. Ve a la pestaña **Deployments**
2. Click en los tres puntos (···) al lado del deployment más reciente
3. Click en **Redeploy**

## 🔧 Cómo Funciona

### Antes (URL Harcodeada)
```javascript
// ❌ Problema: URL fija en el código
baseUrl: 'https://micro-bits-n8n.aejhww.easypanel.host/webhook'
```

### Ahora (Proxy con Variables de Entorno)
```javascript
// ✅ Solución: Proxy que usa variables de entorno
baseUrl: '/api/n8n-proxy?path='
```

El flujo es:
```
Frontend → /api/n8n-proxy → N8N_WEBHOOK_URL (variable de entorno) → N8N
```

## 📁 Archivos Modificados

1. **api/n8n-proxy.js** - Nuevo archivo serverless function
2. **app.js** - Modificado para usar el proxy
3. **vercel.json** - Sin cambios (ya configurado correctamente)

## ✅ Ventajas

- ✅ Sin URL harcodeadas en el código
- ✅ Fácil cambiar de entorno (dev/staging/prod)
- ✅ Mejor seguridad (URL oculta en variables)
- ✅ Evita problemas de CORS
- ✅ Mismos archivos para todos los entornos

## 🐛 Solución de Problemas

### Error: "Cannot GET /api/n8n-proxy"

**Causa:** El deployment no incluye la carpeta `api/`

**Solución:**
1. Verifica que la carpeta `api/` esté en tu repositorio
2. Haz commit de los cambios
3. Redespliega en Vercel

### Error: "Error al conectar con N8N"

**Causa:** La variable `N8N_WEBHOOK_URL` no está configurada o es incorrecta

**Solución:**
1. Verifica que la variable esté configurada en Vercel
2. Verifica que la URL sea correcta
3. Redespliega la aplicación

### Development Local

Para desarrollo local sin Vercel, tienes dos opciones:

**Opción 1: URL directa (no recomendado)**
En `app.js`, cambia:
```javascript
baseUrl: 'https://micro-bits-n8n.aejhww.easypanel.host/webhook',
```

**Opción 2: Configurar CORS en N8N**
En tus workflows de N8N, agrega un nodo al inicio con:
```
Response Headers:
  - Access-Control-Allow-Origin: *
  - Access-Control-Allow-Methods: GET, POST, OPTIONS
```

## 📞 Soporte

Si tienes problemas, contacta al equipo de desarrollo de Microbits Academy.
