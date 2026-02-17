# Festivos de Reus en el Calendario

Se han agregado los festivos locales de **Reus (Tarragona)** al calendario del dashboard.

## 🏛️ Festivos Locales de Reus Agregados

### Sant Pere (29 de junio)
- **Fecha**: 29 de junio de cada año
- **Descripción**: Patrón de Reus
- **Icono**: 🏛️ (Landmark)
- **Color**: Morado/Violeta

### Fiesta Mayor de Reus (~25 de junio)
- **Fecha**: Aproximadamente el 25 de junio (última semana de junio)
- **Descripción**: Fiesta Mayor de Reus
- **Nota**: La fecha exacta puede variar según el calendario oficial del ayuntamiento
- **Icono**: 🏛️ (Landmark)
- **Color**: Morado/Violeta

### Santiago Apóstol (25 de julio)
- **Fecha**: 25 de julio
- **Descripción**: Festivo local en Reus
- **Icono**: 🏛️ (Landmark)
- **Color**: Morado/Violeta

### Corpus Christi (Fecha móvil)
- **Fecha**: 60 días después de Pascua
- **Descripción**: Corpus Christi (Reus)
- **Nota**: Fecha móvil que se calcula dinámicamente
- **Icono**: 🏛️ (Landmark)
- **Color**: Morado/Violeta

## 📅 Clasificación de Festivos

### 🇪🇸 Nacionales (España)
- Año Nuevo
- Epifanía del Señor
- Fiesta del Trabajo
- Asunción de la Virgen
- Todos los Santos
- Día de la Constitución
- Inmaculada Concepción
- Natividad del Señor
- Sant Esteve
- Jueves Santo
- Viernes Santo
- **Color**: Dorado (Gold)
- **Icono**: 🚩 (Flag)

### 🏴 Cataluña
- Santa Eulàlia (12 de febrero)
- Sant Joan (24 de junio)
- Diada de Catalunya (11 de septiembre)
- Lunes de Pascua
- **Color**: Verde (Success Green)
- **Icono**: 👑 (Crown)

### 🏛️ Reus (Locales)
- Sant Pere (29 de junio)
- Fiesta Mayor de Reus (~25 de junio)
- Santiago Apóstol (25 de julio)
- Corpus Christi (móvil)
- **Color**: Morado/Violeta (#9b59b6)
- **Icono**: 🏛️ (Landmark)

## 🎨 Códigos de Color en el Calendario

| Tipo | Color | Uso |
|------|-------|-----|
| **Día normal** | Transparente | Días regulares |
| **Hoy** | Azul neón | Día actual |
| **Festivo Nacional** | 🟡 Dorado | Festivos de España |
| **Festivo Cataluña** | 🟢 Verde | Festivos de Cataluña |
| **Festivo Reus** | 🟣 Morado | Festivos locales de Reus |
| **Con evento** | Punto cian | Eventos personalizados |

## ⚠️ Notas Importantes

1. **Fechas móviles**: El cálculo de Pascua, Corpus Christi y otros festivos móviles se realiza automáticamente usando el algoritmo de Gauss.

2. **Verificación**: Se recomienda verificar las fechas exactas de los festivos locales con el calendario oficial del Ayuntamiento de Reus, ya que pueden variar.

3. **Fiesta Mayor**: La fecha de la Fiesta Mayor puede cambiar anualmente. Actualmente está configurada para el 25 de junio, pero puede necesitar ajustes.

4. **Año dinámico**: Los festivos se generan automáticamente para el año actual, por lo que no es necesario actualizar manualmente cada año.

## 🔧 Personalización

Si necesitas agregar o modificar festivos de Reus, edita la función `generarFestivosCatalunya()` en el archivo `app.js`:

```javascript
// ============================================
// FESTIVOS LOCALES DE REUS
// ============================================
festivos.push(
    // Ejemplo: Agregar un nuevo festivo
    { fecha: `${año}-MM-DD`, nombre: 'Nombre del Festivo', tipo: 'reus' }
);
```

## 📞 Ayuntamiento de Reus

Para obtener el calendario oficial actualizado:
- **Web**: https://www.reus.cat/
- **Teléfono**: +34 977 010 010
