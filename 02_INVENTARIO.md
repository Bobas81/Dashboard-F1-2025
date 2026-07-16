# Formula 1 Dashboard — INVENTARIO

| Elemento | Estado |
|---|---|
| Aplicación React + TypeScript + Vite | Operativa; compilación confirmada el 2026-07-13 |
| `src/App.tsx` | Interfaz principal, selectores y composición de paneles |
| `src/components/TrackMap.tsx` | Mapas mediante imagen y respaldo SVG |
| Catálogo de circuitos | 25 definiciones totales; 24 visibles en cada temporada |
| Temporada 2025 | 24 circuitos, incluido Imola |
| Temporada 2026 | 24 circuitos, incluido MADRING y sin Imola; modelo provisional |
| Biblioteca de setups | Seco, intermedio y mojado; actualizada el 2026-05-10 |
| Motor de estrategia | Planes por clima, parrilla y distancias de 25 %, 50 % y 100 % |
| Referencias reales | Registros y poles curados en `src/data/times.ts` |
| Leaderboards F1 25 | Top 3 de 24 circuitos en JSON local; captura del 2026-07-16 |
| Mapas de circuitos | Imágenes PNG/JPG y geometrías de respaldo en TypeScript |
| Actualizador de tiempos | `scripts/update-f1laps-times.mjs` |
| Generador de setups | `scripts/generate_setup_library.py`; requiere Python y `requests` |
| Dependencias | Declaradas y bloqueadas mediante `package.json` y `package-lock.json` |
| Pruebas automatizadas | No existen scripts de test declarados |
| Historial Git remoto | 115 commits hasta `e87ebea`, conservado en `origin/main` y `safety/remote-main-e87ebea` |
| Historial Git local reinicializado | Raíz independiente `cb0c93e`, conservada en `main` y `safety/local-main-cb0c93e` |
| Integración Git | `integration/unify-histories` creada desde `origin/main`; historiales auditados, sin merge entre raíces y sin push |
| Workflows de GitHub | Conservados sin cambios y pendientes de decisión antes de cualquier push |

## Datos externos identificados

| Fuente | Uso | Tratamiento local |
|---|---|---|
| F1Laps | Leaderboards y muestras de setup | Se generan archivos locales fechados |
| EA F1 25 | Guía de setup y referencia del Season Pack 2026 | Apoya interpolaciones y el modelo provisional |
| Referencias de F1 real | Vueltas rápidas y poles históricas | Curadas directamente en TypeScript |

## Fuentes del proyecto utilizadas

- `package.json` y `package-lock.json`
- `src/`, `public/` y `scripts/`
- `public/data/f1laps-times.json`
