# Configuración de N8N para Gestión de Eventos del Calendario

Esta guía explica cómo configurar los workflows en N8N para que los eventos del calendario se guarden en la base de datos y se compartan entre todos los docentes.

## 📋 Resumen

Los docentes pueden crear eventos en el calendario (parciales, exámenes, reuniones, etc.) y estos se guardarán en N8N para que todos los docentes puedan verlos.

## 🔌 Endpoints Necesarios en N8N

Necesitas crear **3 workflows** en N8N:

### 1. `/calendar-listar-eventos` - Obtener todos los eventos

**Método**: GET
**Propósito**: Retornar todos los eventos del calendario

#### Estructura del Workflow:

```
Webhook (GET) → Buscar en Google Sheets/Supabase → Return Response
```

#### Webhook Configuration:
- **Path**: `calendar-listar-eventos`
- **Method**: GET
- **Response Mode**: responseNode

#### Nodos:

1. **Webhook** (Trigger)
   - HTTP Method: GET
   - Path: calendar-listar-eventos

2. **Google Sheets** (o Supabase/MySQL)
   - Operation: Lookup
   - Sheet ID: (tu hoja de cálculo de eventos)
   - Range: A:Z (todas las columnas)

3. **Return Response**
   ```json
   {
     "eventos": [
       {
         "id": "1234567890",
         "titulo": "Parcial de Informática",
         "fecha": "2026-03-15",
         "tipo": "exam",
         "descripcion": "Parcial del primer parcial",
         "curso": "Informática 101",
         "creado_por": "docente",
         "fecha_creacion": "2026-02-17T10:00:00.000Z"
       }
     ]
   }
   ```

---

### 2. `/calendar-guardar-evento` - Crear o actualizar evento

**Método**: POST
**Propósito**: Guardar un nuevo evento o actualizar uno existente

#### Estructura del Workflow:

```
Webhook (POST) → Validar Datos → Verificar si existe → Guardar/Actualizar → Return Response
```

#### Webhook Configuration:
- **Path**: `calendar-guardar-evento`
- **Method**: POST
- **Response Mode**: lastNode

#### Cuerpo de la petición (JSON):
```json
{
  "id": "1234567890",
  "titulo": "Parcial de Informática",
  "fecha": "2026-03-15",
  "tipo": "exam",
  "descripcion": "Parcial del primer parcial",
  "curso": "Informática 101",
  "creado_por": "docente",
  "fecha_creacion": "2026-02-17T10:00:00.000Z"
}
```

#### Nodos:

1. **Webhook** (Trigger)
   - HTTP Method: POST
   - Path: calendar-guardar-evento

2. **Set** (Validar y preparar datos)
   ```javascript
   return {
     json: {
       id: $json.id || Date.now().toString(),
       titulo: $json.titulo,
       fecha: $json.fecha,
       tipo: $json.tipo,
       descripcion: $json.descripcion || '',
       curso: $json.curso || '',
       creado_por: $json.creado_por || 'docente',
       fecha_creacion: $json.fecha_creacion || new Date().toISOString(),
       actualizado: new Date().toISOString()
     }
   }
   ```

3. **Google Sheets** (Upsert)
   - Operation: Upsert
   - Sheet ID: (tu hoja de cálculo de eventos)
   - Key Column: id (buscar por ID)
   - Columns to Update: todas las columnas

4. **Return Response**
   ```json
   {
     "success": true,
     "id": "1234567890",
     "message": "Evento guardado correctamente"
   }
   ```

---

### 3. `/calendar-eliminar-evento` - Eliminar evento

**Método**: POST
**Propósito**: Eliminar un evento existente

#### Estructura del Workflow:

```
Webhook (POST) → Validar ID → Eliminar → Return Response
```

#### Webhook Configuration:
- **Path**: `calendar-eliminar-evento`
- **Method**: POST
- **Response Mode**: lastNode

#### Cuerpo de la petición (JSON):
```json
{
  "id": "1234567890"
}
```

#### Nodos:

1. **Webhook** (Trigger)
   - HTTP Method: POST
   - Path: calendar-eliminar-evento

2. **Google Sheets** (Delete)
   - Operation: Delete
   - Sheet ID: (tu hoja de cálculo de eventos)
   - Key Column: id

3. **Return Response**
   ```json
   {
     "success": true,
     "message": "Evento eliminado correctamente"
   }
   ```

---

## 📊 Estructura de Datos (Google Sheets)

Crea una nueva hoja de cálculo llamada **"Calendario Eventos"** con las siguientes columnas:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | Text | ID único del evento |
| titulo | Text | Título del evento |
| fecha | Date | Fecha del evento (YYYY-MM-DD) |
| tipo | Text | Tipo: exam, practice, meeting, holiday, other |
| descripcion | Text | Descripción detallada |
| curso | Text | Curso relacionado (opcional) |
| creado_por | Text | Quién creó el evento |
| fecha_creacion | DateTime | Fecha de creación |
| actualizado | DateTime | Última actualización |

### Tipos de Eventos (tipo):

| Valor | Nombre | Icono | Color |
|-------|--------|-------|-------|
| `exam` | Examen/Parcial | 📄 file-alt | Rojo |
| `practice` | Práctica | 💻 laptop-code | Azul |
| `meeting` | Reunión | 👥 users | Celeste |
| `holiday` | Festivo | 🏖️ umbrella-beach | Verde |
| `other` | Otro | 📌 thumbtack | Gris |

---

## 🔐 Seguridad (Opcional)

Si quieres que solo los docentes autenticados puedan crear eventos, agrega:

### Validación de Token

Antes de procesar el evento, verifica que el usuario esté autenticado:

```javascript
// En el nodo Set del workflow calendar-guardar-evento
const authToken = $headers.authorization;

if (!authToken || !authToken.startsWith('Bearer ')) {
  return {
    json: {
      error: 'No autorizado',
      message: 'Se requiere token de autenticación'
    },
    status: 401
  };
}

// Continuar con el flujo normal...
```

---

## 🧪 Testing

### Probar el Workflow de Listar:

```bash
curl "https://micro-bits-n8n.aejhww.easypanel.host/webhook/calendar-listar-eventos"
```

**Respuesta esperada:**
```json
{
  "eventos": []
}
```

### Probar el Workflow de Guardar:

```bash
curl -X POST "https://micro-bits-n8n.aejhww.easypanel.host/webhook/calendar-guardar-evento" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Parcial de Prueba",
    "fecha": "2026-03-20",
    "tipo": "exam",
    "descripcion": "Parcial de testing",
    "curso": "Informática 101"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "id": "1234567890",
  "message": "Evento guardado correctamente"
}
```

---

## 🚀 Una vez Configurado

1. **Configura CORS** en N8N si es necesario
2. **Testea** los workflows con curl o Postman
3. **Verifica** que los eventos se guardan en Google Sheets
4. **Prueba** en el dashboard creando un evento

---

## 📞 Soporte

Si tienes problemas:
1. Verifica los logs de N8N
2. Revisa que los webhooks estén activos
3. Confirma las URLs en el dashboard
4. Verifica CORS si usas desarrollo local

---

## ✅ Checklist

- [ ] Crear hoja de Google Sheets "Calendario Eventos"
- [ ] Crear workflow `/calendar-listar-eventos`
- [ ] Crear workflow `/calendar-guardar-evento`
- [ ] Crear workflow `/calendar-eliminar-evento`
- [ ] Configurar CORS en N8N
- [ ] Testear con curl/Postman
- [ ] Probar en el dashboard
- [ ] Verificar que se comparten entre docentes
