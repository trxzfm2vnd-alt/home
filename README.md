# Tienda virtual - Sophie

Proyecto de tienda online para Sophie: sitio dinámico para una tienda de regalos con diseños temáticos especiales y panel de administración.

## Características

- **Navegación responsiva** con menú hamburguesa para móviles
- **Carrusel de promociones** en la página de inicio
- **Filtrado de productos** por categoría, precio y búsqueda
- **Temas especiales** para productos de Harry Potter y Snoopy con animaciones
- **Carrito de compras** persistente con localStorage
- **Panel de administración** para gestionar productos
- **Diseño responsivo** adaptado a todos los dispositivos

## Cómo usar

### Tienda
1. Abrir \index.html\ en un navegador (doble clic o arrastrar al navegador)
2. Buscar o filtrar por categorías
3. Hacer clic en una tarjeta para ver detalles del producto
4. Agregar al carrito (almacenado en \localStorage\ del navegador)
5. Proceder al checkout

### Panel de Administración
1. Abrir \dmin.html\ en un navegador
2. Agregar nuevos productos completando el formulario
3. Editar productos existentes haciendo clic en " Editar\
4. Eliminar productos haciendo clic en \Eliminar\
5. Los cambios se guardan automáticamente en localStorage

## Archivos principales

- \index.html\ - Página de inicio con carrusel y best sellers
- \products.html\ - Página de catálogo de productos con filtros
- \checkout.html\ - Página de carrito y proceso de pago
- \dmin.html\ - Panel de administración para gestionar productos
- \script.js\ - Lógica principal de la aplicación
- \styles.css\ - Estilos y diseño responsivo

## Próximas mejoras sugeridas

- Integración con backend real (API REST)
- Persistencia de pedidos en base de datos
- Pasarela de pagos integrada
- Sistema de autenticación de administrador
- Reportes de ventas y análisis
