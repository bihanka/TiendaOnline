# Funciones asíncronas y Promesas — closet ONLINE

Este documento describe las **8 funciones asíncronas** implementadas en el proyecto (mínimo requerido: 5). Todas viven en un único módulo de servicios y se consumen desde contextos y páginas de React.

## Archivo principal

| Ruta | Descripción |
|------|-------------|
| `src/services/asyncApi.ts` | Módulo central con Promesas, `async/await` y simulación de latencia de red |

---

## Funciones implementadas

### 1. `delay(ms)` — Utilidad de espera

- **Ubicación:** `src/services/asyncApi.ts`
- **Tipo:** `Promise<void>`
- **Qué hace:** Envuelve `setTimeout` en una Promesa para simular latencia de red.
- **Usada por:** Todas las demás funciones del módulo.

### 2. `authenticateUser(email, password)`

- **Ubicación:** `src/services/asyncApi.ts`
- **Consumida en:** `src/context/AuthContext.tsx` → método `login`
- **Qué hace:** Simula `POST /api/auth/login`. Busca credenciales y devuelve el usuario o `null`.
- **Flujo UI:** `src/pages/LoginPage.tsx`

### 3. `registerUserAccount(name, email, password)`

- **Ubicación:** `src/services/asyncApi.ts`
- **Consumida en:** `src/context/AuthContext.tsx` → método `register`
- **Qué hace:** Simula `POST /api/auth/register`. Valida y persiste la cuenta nueva.
- **Flujo UI:** `src/pages/LoginPage.tsx`

### 4. `checkEmailAvailable(email)`

- **Ubicación:** `src/services/asyncApi.ts`
- **Consumida en:** `registerUserAccount` (internamente)
- **Qué hace:** Simula `GET /api/auth/check-email` con `.then()` sobre una Promesa.
- **Retorno:** `Promise<boolean>`

### 5. `processPayment({ cardName, cardNumber, total })`

- **Ubicación:** `src/services/asyncApi.ts`
- **Consumida en:** `src/components/CheckoutModal.tsx`
- **Qué hace:** Simula pasarela de pago (~1,5 s) y genera `orderId`.
- **Flujo UI:** `src/pages/CartPage.tsx`

### 6. `saveOrderAsync({ orderId, customer, email, ... })`

- **Ubicación:** `src/services/asyncApi.ts`
- **Consumida en:** `src/pages/CartPage.tsx`
- **Qué hace:** Simula `POST /api/orders` y guarda en `localStorage`.

### 7. `loadOrdersAsync()`

- **Ubicación:** `src/services/asyncApi.ts`
- **Consumida en:** `src/admin/AdminOrders.tsx`
- **Qué hace:** Simula `GET /api/orders` para el panel admin.

### 8. `fetchProductById(id)`

- **Ubicación:** `src/services/asyncApi.ts`
- **Consumida en:** `src/pages/ProductDetail.tsx`
- **Qué hace:** Simula `GET /api/products/:id` con estado de carga.

### 9. `submitCommentAsync(data, userId)`

- **Ubicación:** `src/services/asyncApi.ts`
- **Consumida en:** `src/context/CommentsContext.tsx`, `src/pages/CommentsPage.tsx`
- **Qué hace:** Simula `POST /api/comments` con validación y rate limit.

---

## Resumen de integración

| Función async | Archivo que la llama |
|---------------|----------------------|
| `authenticateUser` | `AuthContext.tsx`, `LoginPage.tsx` |
| `registerUserAccount` | `AuthContext.tsx`, `LoginPage.tsx` |
| `processPayment` | `CheckoutModal.tsx` |
| `saveOrderAsync` | `CartPage.tsx` |
| `loadOrdersAsync` | `AdminOrders.tsx` |
| `fetchProductById` | `ProductDetail.tsx` |
| `submitCommentAsync` | `CommentsContext.tsx`, `CommentsPage.tsx` |

## Cómo probar

1. **Login:** `/login` — retardo al iniciar sesión.
2. **Pago:** `/carrito` → pagar (spinner ~1,5 s).
3. **Producto:** abrir `/producto/:id` — estado de carga breve.
4. **Comentarios:** `/comentarios` — publicar opinión.
5. **Admin:** `/admin/pedidos` — carga inicial de pedidos.
