# closet ONLINE — Tienda de ropa

Tienda online de ropa con **React**, diseño responsivo (estilo urbano + colores del logo) y **panel de administración**.

## Qué incluye

- Página de inicio con hero, promociones y categorías
- Categorías: Mujer, Hombre, Kids, Malayerba
- Carrito de compras
- Detalle de producto
- **Breadcrumbs** con React Router
- **Admin**: dashboard, productos, pedidos, promociones

## Cómo ejecutarlo (en tu PC)

Abre **PowerShell** o **CMD** en esta carpeta:

```bash
cd c:\Users\lopez\tiendaOnline
npm install
npm run dev
```

Luego abre en el navegador la URL que aparece (normalmente `http://localhost:5173`).

## Logo

Copia tu imagen del logo a:

```
public/images/logo.png
```

Si no existe el archivo, se muestra un logo de texto automático.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/mujer` `/hombre` `/kids` `/malayerba` | Categorías |
| `/carrito` | Carrito |
| `/producto/:id` | Detalle |
| `/admin` | Panel administrador |
| `/admin/productos` | Gestionar productos |
| `/admin/pedidos` | Pedidos |
| `/admin/promociones` | Promociones |

## Colores de marca

- Crema: `#F9F7F0`
- Taupe: `#635A5E`
- Rojo promocional: `#E32B22`

## Build para producción

```bash
npm run build
npm run preview
```
