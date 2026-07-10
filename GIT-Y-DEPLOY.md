# Subir a repositorio Git + desplegar en Hostinger

## 1. Subir código a GitHub

```bash
cd c:\Users\lopez\tiendaOnline
git init
git add .
git commit -m "Tienda closet ONLINE - React + Vite"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tiendaOnline.git
git push -u origin main
```

> **No subas** `node_modules/` ni `dist/` — ya están en `.gitignore`.

## 2. Por qué se veía en blanco

El build genera rutas como `/bihanka_mungarro/assets/...`  
Los archivos debían estar en:

```
public/bihanka_mungarro/
  index.html
  .htaccess
  favicon.svg
  assets/
```

Si los subes a `public/` (raíz), el JS no carga → pantalla en blanco con "Cargando...".

## 3. Desplegar en el servidor

**Opción A — Script automático (Windows):**
```
Doble clic en SUBIR-HOSTINGER.bat
```

**Opción B — Manual:**
```bash
npm run build
scp -r dist/* bihanka_mungarro@2.25.174.243:/home/bihanka_mungarro/public/bihanka_mungarro/
```

## 4. URL de la tienda

```
http://2.25.174.243/bihanka_mungarro/
```

## 5. Configuración clave (no cambiar sin motivo)

| Archivo | Valor |
|---------|-------|
| `vite.config.ts` | `base: '/bihanka_mungarro/'` |
| `App.tsx` | `basename="/bihanka_mungarro/"` |
| Servidor | carpeta `public/bihanka_mungarro/` |
