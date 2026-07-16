# Formula 1 Dashboard

Dashboard local para consultar setups, estrategia, mapas, referencias de frenada y tiempos de F1 25. La aplicación está construida con React, TypeScript y Vite y no necesita backend.

El contenido de la temporada 2026 y MADRING es provisional hasta que pueda sustituirse por datos medidos y contrastados.

## Requisitos

- Node.js 22 recomendado
- npm
- Python 3 y `requests` solo para regenerar la biblioteca de setups

## Instalación y desarrollo

```bash
npm ci
npm run dev
```

Vite sirve la aplicación en una dirección local y muestra la URL exacta al arrancar.

## Validación y build

```bash
npm run build
npm run preview
```

El proyecto no dispone todavía de pruebas automatizadas ni de scripts de lint. El build ejecuta la comprobación de TypeScript y genera la aplicación de producción en `dist/`.

## Datos mantenidos

- `public/data/f1laps-times.json`: copia local de los tiempos de F1Laps utilizada por la aplicación.
- `public/circuit-maps/`: mapas que se sirven como recursos estáticos.
- `src/data/setupLibrary.ts`: biblioteca generada de setups que forma parte de la fuente reproducible.
- `src/data/realTrackShapes.ts`: geometrías mantenidas para los circuitos.

Aunque algunos de estos archivos se generan mediante scripts, deben versionarse porque son entradas necesarias para ejecutar y reproducir el estado actual de la aplicación. `dist/` y `node_modules/` no se versionan.

## Actualizaciones externas

Los siguientes comandos acceden a Internet y modifican datos mantenidos:

```bash
node scripts/update-f1laps-times.mjs
python3 scripts/generate_setup_library.py
```

Revisa siempre los cambios resultantes y ejecuta `npm run build` antes de aceptarlos. El workflow `.github/workflows/update-f1laps-times.yml` está preparado para actualizar y publicar automáticamente el JSON cuando se ejecute en GitHub; debe revisarse antes de configurar cualquier remoto.

## Documentación

El estado vigente, los procedimientos, el inventario y las validaciones pendientes se encuentran en `00_MASTER.md` a `06_CHANGELOG.md`.
