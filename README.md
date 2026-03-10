# Sistema de Cotizacion - Frontend

## Descripcion

Aplicacion web frontend para la gestion de presupuestos y control de gastos personales. Permite crear multiples presupuestos activos, categorizar gastos, y visualizar reportes detallados con graficos interactivos.

## Tecnologias

- React 18 - Framework de JavaScript
- TypeScript - Tipado estatico
- Vite - Build tool y servidor de desarrollo
- React Router DOM - Navegacion
- Zustand - Gestion de estado global
- Axios - Cliente HTTP
- Recharts - Graficos y visualizaciones
- Tailwind CSS - Framework de estilos
- Lucide React - Iconos
- date-fns - Manejo de fechas
- jsPDF + html2canvas - Generacion de reportes PDF

## Arquitectura

El proyecto sigue los principios de Clean Architecture:

```
src/
  domain/                 Entidades y reglas de negocio
    entities/             Modelos de dominio
    repositories/         Interfaces de repositorios
  infrastructure/         Implementaciones externas
    api/                  Cliente API y repositorios
  presentation/           Capa de presentacion
    components/           Componentes React
    pages/                Paginas de la aplicacion
    store/                Estado global (Zustand)
```

## Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Backend corriendo en http://localhost:3000

## Instalacion

1. Clonar el repositorio e instalar dependencias:

```bash
cd client
npm install
```

2. Configurar variables de entorno:

Crear archivo .env en la raiz del proyecto client:

```env
VITE_API_URL=http://localhost:3000/api
```

## Scripts Disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo en http://localhost:5174

### Produccion

```bash
npm run build
```

Genera la build de produccion en la carpeta dist/

```bash
npm run preview
```

Previsualiza la build de produccion localmente

### Linting

```bash
npm run lint
```

Ejecuta ESLint para verificar el codigo

## Funcionalidades

### Gestion de Presupuestos
- Crear multiples presupuestos activos
- Asignar nombres personalizados a cada presupuesto
- Definir montos y periodos (fecha inicio/fin)
- Editar y eliminar presupuestos

### Registro de Gastos
- Registrar gastos con categoria, monto y descripcion
- Seleccionar el presupuesto del cual descontar
- Visualizar historial de gastos
- Eliminar gastos registrados

### Categorias
- Crear categorias personalizadas
- Asignar colores identificadores
- Editar y eliminar categorias

### Dashboard
- Vista general del presupuesto activo
- Tarjetas con metricas clave (total, gastado, restante)
- Grafico de gastos por dia
- Grafico de distribucion por categoria
- Tabla de gastos recientes

### Reportes y Analisis
- KPIs del presupuesto actual
- Graficos de tendencias
- Top 5 categorias con mas gastos
- Exportacion de reportes a PDF

### Selector de Moneda
- Soporte para multiples monedas:
  - Boliviano (Bs) - por defecto
  - Dolar Estadounidense (USD)
  - Euro (EUR)
  - Peso Argentino (ARS)
  - Sol Peruano (PEN)
  - Peso Chileno (CLP)
  - Peso Colombiano (COP)
  - Peso Mexicano (MXN)
  - Real Brasileno (BRL)
- Configuracion persistente en localStorage

### Sidebar Colapsable
- Boton para colapsar/expandir en desktop
- Menu hamburguesa en dispositivos moviles
- Navegacion intuitiva

### Ayuda
- Modal con guia de uso paso a paso
- Consejos utiles para nuevos usuarios

## Estructura de Componentes

### Paginas
- DashboardPage - Pagina principal con resumen
- ExpensesPage - Gestion de gastos
- CategoriesPage - Gestion de categorias
- BudgetsPage - Gestion de presupuestos
- ReportsPage - Reportes y analisis
- LoginPage - Autenticacion de usuario

### Componentes Comunes
- Layout - Estructura base con sidebar responsive
- Modal - Modal generico responsive
- HelpModal - Guia de uso
- Navbar - Barra de navegacion superior

### Formularios
- BudgetForm - Crear/editar presupuestos
- CategoryForm - Crear/editar categorias
- ExpenseForm - Registrar gastos

### Graficos
- ExpensesByCategoryChart - Grafico circular por categoria
- ExpensesByDayChart - Grafico de barras por dia

## Estado Global (Zustand)

### Stores
- authStore - Autenticacion y usuario
- budgetStore - Presupuestos activos
- categoryStore - Categorias del usuario
- expenseStore - Gastos y reportes
- configStore - Configuracion de moneda y sidebar

## Diseno Responsive

La interfaz es completamente responsive con soporte para:

- Movil (menos de 640px): Tarjetas apiladas, tablas como cards, sidebar oculto con menu hamburguesa
- Tablet (640px - 1024px): Grid de 2 columnas, espaciado intermedio
- Desktop (mayor a 1024px): Layout completo con sidebar, grids de 3-4 columnas

## Despliegue en Netlify

El proyecto incluye archivo _redirects para manejo de rutas SPA:

```
/*    /index.html   200
```

### Pasos para desplegar:

1. Build del proyecto:
```bash
npm run build
```

2. La carpeta dist/ contiene los archivos estaticos

3. Configurar en Netlify:
   - Build command: npm run build
   - Publish directory: dist
   - Variables de entorno: VITE_API_URL

## Integracion con Backend

La aplicacion se comunica con el backend mediante API REST:

- Base URL: http://localhost:3000/api (desarrollo)
- Autenticacion: JWT Bearer Token
- Formato: JSON

### Endpoints principales
- POST /auth/register - Registro de usuario
- POST /auth/login - Inicio de sesion
- GET /budgets/active - Presupuestos activos
- POST /expenses - Crear gasto
- GET /expenses/category/:budgetId - Gastos por categoria
- GET /categories - Lista de categorias

## Notas de Desarrollo

### TypeScript
El proyecto usa TypeScript estricto. Todas las entidades y DTOs estan tipados.

### Tailwind CSS
Se utilizan clases responsivas con breakpoints sm, md, lg, xl para adaptar el diseno a diferentes dispositivos.
