# 📱 Panel de Administración E-commerce

Panel de administración moderno desarrollado con Angular 19 y Tailwind CSS 4.

## 🚀 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- MongoDB corriendo en el puerto 27017
- Backend corriendo en el puerto 3000

## 📦 Instalación

1. **Clonar el repositorio**
```bash
cd admin_ecommerce
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Verificar que el backend esté corriendo**
```bash
cd ../backend
npm run dev
```

## 🎯 Ejecución en Desarrollo

```bash
npm start
```

El proyecto se ejecutará en `http://localhost:4200`

## 🔐 Credenciales de Acceso

**Usuario Admin por defecto:**
- Email: admin@admin.com
- Password: 123456

## 📁 Estructura del Proyecto

```
src/app/
├── components/
│   ├── auth/          # Login
│   ├── layout/        # Sidebar, Navbar, Main Layout
│   └── pages/         # Dashboard, Users, Products, etc.
├── services/          # Servicios de API
├── models/            # Interfaces TypeScript
├── core/
│   ├── guards/        # Auth Guard
│   └── interceptors/  # HTTP Interceptor
└── app.routes.ts      # Configuración de rutas
```

## 🎨 Características

- ✅ Autenticación con JWT
- ✅ Dashboard con gráficos (Chart.js)
- ✅ Gestión de Usuarios
- ✅ Gestión de Categorías
- ✅ Gestión de Productos (con galería y variedades)
- ✅ Gestión de Sliders
- ✅ Gestión de Cupones
- ✅ Gestión de Descuentos
- ✅ Diseño responsive
- ✅ Paginación
- ✅ Búsqueda y filtros

## 🛠️ Tecnologías

- Angular 19
- Tailwind CSS 4
- TypeScript 5.7
- Chart.js
- SweetAlert2
- FontAwesome
- ngx-pagination

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en `dist/`

## 🔧 Variables de Entorno

El proyecto se conecta por defecto a:
- Backend: `http://localhost:3000/api`

Para cambiar la URL, modifica los servicios en `src/app/services/`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto.

## 👨‍💻 Autor

Proyecto Full Stack E-commerce
```

## ✅ Paso 26: Checklist Final

Crea un archivo `CHECKLIST.md`:

````markdown
# ✅ Checklist de Implementación

## Backend (Completado ✓)
- [x] MongoDB configurado
- [x] Modelos de datos
- [x] Controladores
- [x] Rutas API
- [x] Middlewares de autenticación
- [x] Upload de imágenes
- [x] Servicio de email

## Frontend Angular

### Configuración Base
- [x] Proyecto Angular 19 creado
- [x] Tailwind CSS 4 configurado
- [x] Rutas configuradas
- [x] HTTP Interceptor
- [x] Auth Guard

### Servicios
- [x] AuthService
- [x] UserService
- [x] CategorieService
- [x] ProductService
- [x] SliderService
- [x] CuponeService
- [x] DiscountService

### Modelos
- [x] User Model
- [x] Categorie Model
- [x] Product Model
- [x] Slider Model
- [x] Cupone Model
- [x] Discount Model

### Componentes de Autenticación
- [x] Login Component

### Componentes de Layout
- [x] Main Layout
- [x] Sidebar
- [x] Navbar

### Páginas
- [x] Dashboard (con gráficos)
- [x] Usuarios (CRUD completo)
- [x] Categorías (CRUD completo)
- [x] Productos (CRUD con galería y variedades)
- [x] Sliders (CRUD completo)
- [x] Cupones (CRUD completo)
- [x] Descuentos (CRUD completo)

### Funcionalidades
- [x] Autenticación JWT
- [x] Protección de rutas
- [x] Upload de imágenes
- [x] Paginación
- [x] Búsqueda
- [x] Filtros
- [x] Validación de formularios
- [x] Alertas (SweetAlert2)
- [x] Diseño responsive

## Testing
- [ ] Pruebas unitarias
- [ ] Pruebas E2E

## Deployment
- [ ] Build de producción
- [ ] Configuración de servidor
- [ ] SSL/HTTPS
- [ ] Variables de entorno de producción
```

## 🎯 Paso 27: Script de Inicio Rápido

Crea `start.bat` en la raíz del proyecto:

````batch
@echo off
echo ========================================
echo   Iniciando E-commerce Admin Panel
echo ========================================
echo.

echo [1/3] Iniciando MongoDB...
start "MongoDB" mongod

timeout /t 3 /nobreak > nul

echo [2/3] Iniciando Backend...
cd backend
start "Backend API" cmd /k "npm run dev"

timeout /t 5 /nobreak > nul

echo [3/3] Iniciando Frontend...
cd ../admin_ecommerce
start "Angular Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   Todos los servicios iniciados!
echo ========================================
echo   - MongoDB: localhost:27017
echo   - Backend: http://localhost:3000
echo   - Frontend: http://localhost:4200
echo ========================================
pause