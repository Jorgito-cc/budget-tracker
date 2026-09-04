# Budget Tracker - Frontend

Aplicacion web para la gestion de presupuestos y control de gastos personales. Permite crear presupuestos activos, categorizar gastos y visualizar reportes con graficos interactivos.

## Demostracion en Linea

- Despliegue Frontend en Netlify: https://budget-tracker-b.netlify.app/login

Nota sobre el entorno: El frontend se encuentra desplegado en Netlify como demostracion interactiva de la interfaz. La API Backend se ejecuta en entorno local junto con la base de datos PostgreSQL para procesar la autenticacion JWT y la persistencia de datos.

## Repositorios del Proyecto

- Repositorio Frontend: https://github.com/Jorgito-cc/budget-tracker.git
- Repositorio Backend: https://github.com/Jorgito-cc/budget-tracker-api.git

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM
- Zustand
- Axios
- Recharts
- Tailwind CSS
- Lucide React
- date-fns
- jsPDF y html2canvas

## Arquitectura

El proyecto sigue Clean Architecture:

```
src/
  domain/                 Entidades y reglas de negocio
    entities/             Modelos de dominio
    repositories/         Interfaces de repositorios
  infrastructure/         Implementaciones externas
    api/                  Cliente API Axios e integraciones
  presentation/           Capa de presentacion
    components/           Componentes reutilizables
    pages/                Paginas de la aplicacion
    store/                Estado global con Zustand
```

## Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Servidor backend corriendo en http://localhost:3000

## Instalacion y Configuracion

1. Clonar el repositorio:

```bash
git clone https://github.com/Jorgito-cc/budget-tracker.git
cd budget-tracker
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crear archivo `.env` en la raiz de `budget-tracker`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Scripts Disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo en http://localhost:5174 (o http://localhost:5173).

### Compilacion para Produccion

```bash
npm run build
```

Genera el paquete optimizado de produccion en la carpeta `dist/`.

### Previsualizacion

```bash
npm run preview
```

### Verificacion de Codigo

```bash
npm run lint
```

## Funcionalidades

### Presupuestos
- Creacion y administracion de multiples presupuestos.
- Definicion de montos totales y periodos de vigencia.
- Visualizacion en tiempo real de monto gastado, saldo restante y porcentaje utilizado.
- Edicion y eliminacion de presupuestos.

### Gastos
- Registro de gastos vinculados a presupuesto y categoria.
- Visualizacion de historial y detalle de transacciones.
- Eliminacion de gastos con actualizacion automatica de saldos.

### Categorias
- Creacion de categorias con codigo de color identificador.
- Calculo del total acumulado por categoria.
- Edicion y eliminacion.

### Dashboard
- Resumen financiero del presupuesto activo.
- Grafico de barras con gastos por dia.
- Grafico circular de distribucion por categoria.
- Tabla con ultimos gastos registrados.

### Reportes
- Metricas consolidadas (Total asignado, Total gastado, Saldo restante).
- Graficos estadisticos y analiticos.
- Exportacion del reporte completo a formato PDF.

### Multi-moneda
- Selector de monedas con persistencia local (BOB, USD, EUR, ARS, PEN, CLP, COP, MXN, BRL).

## Estructura de Paginas

- `/login` - Inicio de sesion y registro de usuario.
- `/dashboard` - Panel principal de control.
- `/expenses` - Registro y tabla de gastos.
- `/categories` - Administracion de categorias.
- `/budgets` - Administracion de presupuestos.
- `/reports` - Analisis detallado y exportacion a PDF.
