# 🎓 UNAMBA Analytics Dashboard

Dashboard web profesional para análisis de resultados de admisión de la Universidad Nacional Micaela Bastidas de Apurímac (UNAMBA).

## ✨ Características Principales

### 📊 Análisis de Datos
- **Carga de archivos Excel** con múltiples hojas
- **Parser inteligente** que detecta automáticamente las columnas
- **Validación de datos** con reportes de errores
- **Soporte para múltiples hojas** en un solo archivo

### 📈 Visualizaciones Interactivas
- **Top Estudiantes**: Gráfico de barras de mejores puntajes
- **Puntajes por Carrera**: Comparación de promedios por carrera
- **Distribución de Puntajes**: Histograma de distribución estadística
- **Comparación de Carreras**: Gráfico radar para comparar hasta 5 carreras

### 🏆 Rankings y Estadísticas
- **Tabla de ranking** ordenable con búsqueda y filtros
- **Medallas** para los 3 primeros puestos
- **Paginación** para grandes volúmenes de datos
- **Estadísticas detalladas** por carrera

### 🔍 Funciones Avanzadas
- **Búsqueda avanzada** por nombre, DNI o carrera
- **Filtros múltiples** (carrera, rango de puntaje, género, procedencia)
- **Cálculo de percentiles**
- **Análisis por género y región**
- **Identificación del mejor estudiante**

### 🎨 Diseño Premium
- **Tema oscuro** con gradientes vibrantes
- **Efectos glassmorphism** modernos
- **Animaciones suaves** y transiciones
- **Diseño responsive** para todos los dispositivos

## 🚀 Instalación

### Requisitos Previos
- Node.js 14 o superior
- npm o yarn

### Pasos de Instalación

```bash
# 1. Clonar o navegar al directorio del proyecto
cd "UNAMBA PY"

# 2. Instalar dependencias (si no están instaladas)
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

El dashboard estará disponible en `http://localhost:5173`

## 📁 Estructura del Archivo Excel

El sistema es flexible y detecta automáticamente las columnas, pero para mejores resultados, tu archivo Excel debe contener:

### Columnas Esperadas (nombres flexibles)

| Columna | Nombres Alternos Aceptados | Descripción |
|---------|---------------------------|-------------|
| **Nombre** | nombre, nombres, alumno, estudiante, postulante | Nombre del estudiante |
| **Apellido** | apellido, apellidos | Apellido del estudiante |
| **DNI** | dni, documento, cedula, id, codigo | Documento de identidad |
| **Puntaje** | puntaje, puntaje_total, score, nota, calificacion, total | Puntaje total obtenido |
| **Carrera** | carrera, programa, especialidad, career | Carrera/programa al que postula |
| **Facultad** | facultad, faculty, escuela | Facultad (opcional) |
| **Género** | genero, sexo, gender | Género del estudiante (opcional) |
| **Procedencia** | procedencia, origen, ciudad, provincia | Lugar de procedencia (opcional) |

### Ejemplo de Estructura

```
| Nombre | Apellido | DNI | Puntaje | Carrera | Genero |
|--------|----------|-----|---------|---------|--------|
| Juan | Pérez | 12345678 | 95.50 | Ingeniería Civil | M |
| María | García | 87654321 | 98.75 | Medicina | F |
```

### Múltiples Hojas
El sistema puede procesar archivos con múltiples hojas. Puedes:
- Ver cada hoja individualmente
- Combinar datos de todas las hojas automáticamente

## 🎯 Uso del Dashboard

### 1. Cargar Datos
1. Al abrir el dashboard, verás la pantalla de bienvenida
2. Arrastra tu archivo Excel o haz clic para seleccionarlo
3. El sistema procesará el archivo automáticamente

### 2. Navegación
Usa el menú lateral para navegar entre vistas:

- **📊 Resumen General**: Vista general con estadísticas clave y mejores estudiantes
- **📈 Gráficos**: Visualizaciones detalladas de todos los datos
- **🏆 Ranking**: Tabla completa ordenable con búsqueda y filtros
- **⚖️ Comparación**: Comparación interactiva entre carreras

### 3. Filtros y Búsqueda
- Usa el campo de búsqueda para encontrar estudiantes por nombre o DNI
- Selecciona una carrera específica para filtrar resultados
- En la tabla de ranking, puedes ordenar haciendo clic en los encabezados

### 4. Interactividad
- **Hover** sobre los gráficos para ver detalles
- **Click** en los encabezados de tabla para ordenar
- **Selecciona carreras** en el gráfico de comparación (máx. 5)

## 🛠 Tecnologías Utilizadas

- **React 18** - Framework UI
- **Vite** - Build tool y dev server
- **Chart.js 4** - Librería de gráficos
- **react-chartjs-2** - Wrapper de React para Chart.js
- **xlsx** - Parser de archivos Excel
- **CSS moderno** - Variables CSS, Grid, Flexbox

## 📊 Funcionalidades Analíticas

### Estadísticas Calculadas
- Puntaje promedio, máximo y mínimo
- Mediana y desviación estándar
- Distribución de puntajes por rangos
- Percentiles de cada estudiante
- Total de estudiantes por carrera

### Análisis por Carrera
- Puntaje promedio por carrera
- Mejor y peor puntaje por carrera
- Número de postulantes por carrera
- Comparación multi-métrica entre carreras

### Análisis Demográfico
- Distribución por género
- Distribución por región/procedencia
- Análisis de modalidades (si aplica)

## 🎨 Personalización

### Colores y Temas
Los colores principales se definen en `src/index.css` usando variables CSS:
- `--primary`: Color primario (púrpura)
- `--secondary`: Color secundario (morado)
- `--success`: Color de éxito (azul)
- `--warning`: Color de advertencia (amarillo)

### Modificar Rangos de Distribución
En `src/components/charts/DistributionChart.jsx`, ajusta el prop `bins`:
```jsx
<DistributionChart bins={15} /> {/* 15 rangos en lugar de 10 */}
```

### Cambiar Top N Estudiantes
En `src/components/charts/TopStudentsChart.jsx`:
```jsx
<TopStudentsChart count={20} /> {/* Top 20 en lugar de 10 */}
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev       # Inicia servidor de desarrollo

# Producción
npm run build     # Construye para producción
npm run preview   # Vista previa del build de producción

# Utilidades
npm run lint      # Ejecuta el linter
```

## 🐛 Solución de Problemas

### El archivo no se carga
- Verifica que sea un archivo `.xlsx` o `.xls`
- Asegúrate de que el archivo no esté dañado
- Revisa la consola del navegador para errores específicos

### Los datos no se muestran correctamente
- Verifica que las columnas tengan nombres reconocibles
- Asegúrate de que los puntajes sean números válidos
- Revisa que no haya celdas vacías en columnas críticas

### Gráficos no se renderizan
- Asegúrate de tener datos válidos cargados
- Verifica que los puntajes sean numéricos
- Revisa la consola del navegador para errores

## 📄 Licencia

Este proyecto fue creado para la Universidad Nacional Micaela Bastidas de Apurímac (UNAMBA) con fines educativos y administrativos.

## 🤝 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo de UNAMBA.

## 🌟 Características Futuras Planeadas

- [ ] Exportar reportes a PDF
- [ ] Gráficos de tendencias históricas
- [ ] Comparación entre procesos de admisión
- [ ] Dashboard de administración
- [ ] Notificaciones y alertas
- [ ] Integración con base de datos

---

**Desarrollado con ❤️ para UNAMBA** 🎓
