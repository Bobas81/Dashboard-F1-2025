# Formula 1 Dashboard — MASTER

> Estado: aplicación compilable y operativa a fecha de 2026-07-18, con colección vectorial homogénea para 2026, mapas históricos conservados para 2025 y contenido de rendimiento 2026 expresamente provisional.

## Vigencia de valores dinámicos

| Elemento | Estado | Última comprobación |
|---|---|---|
| Compilación de producción | Confirmada con `npm run build` | 2026-07-18 |
| Leaderboards F1Laps de F1 25 | Copia local completa para 24 circuitos, sin errores registrados | 2026-07-16 |
| Biblioteca de setups F1 25 | Generada desde F1Laps y la guía de EA | 2026-05-10 |
| Temporada 2025 | Catálogo operativo del juego base | 2026-07-13 |
| Temporada 2026 | Calendario de producto de 24 circuitos y mapas vectoriales homogéneos con curvas numeradas; setups y rendimiento aún provisionales | 2026-07-18 |
| MADRING | Geometría y 22 curvas tomadas del mapa oficial; sectores, setup y recomendaciones provisionales | Pendiente de telemetría contrastada |

## ESTADO OPERATIVO ACTUAL

Dashboard local para F1 25 en PS5 con volante. Permite escoger temporada, circuito, clima, posición de salida y distancia de carrera; a partir de esos datos presenta setup, estrategia, mapa, referencias de frenada, telemetría descriptiva, notas de ingeniero y tiempos de referencia.

La interfaz está construida con React, TypeScript y Vite. No utiliza backend: la lógica y los datos se sirven desde el propio proyecto y el navegador carga una copia JSON local de los leaderboards.

## Alcance funcional vigente

| Área | Contenido |
|---|---|
| Temporadas | 2025 y un escenario provisional 2026 |
| Circuitos | 24 por temporada; 2026 mantiene Baréin y Arabia Saudí como pruebas normales e incluye MADRING en lugar de Imola |
| Clima | Seco, intermedio y mojado |
| Carrera | Estrategia para 25 %, 50 % y 100 %, condicionada por posición de salida |
| Setup | Aero, transmisión, geometría, suspensión, frenos y neumáticos |
| Pilotaje | Mapa con curvas numeradas; 2025 conserva sus imágenes históricas y 2026 usa vectores homogéneos sin zonas DRS, además de frenadas, ERS, neumáticos, adelantamientos y errores comunes |
| Tiempos | Referencias reales curadas y top 3 local de F1Laps para F1 25 |

## Reglas operativas

- No presentar el contenido 2026 como telemetría validada: se deriva de una transformación provisional del setup 2025.
- No presentar el rendimiento ni los sectores de MADRING como medidos hasta sustituir sus datos provisionales por fuentes contrastadas; su geometría y sus 22 curvas oficiales sí están incorporadas.
- Mantener Baréin y Arabia Saudí en el calendario 2026 de la aplicación sin tratamiento diferencial.
- No generar trazados de sustitución: si falta un mapa real validado, mostrar el estado ausente.
- Conservar `public/data/f1laps-times.json` como respaldo: si falla su carga, la aplicación utiliza los datos integrados en el código.
- Ejecutar la compilación después de modificar tipos, circuitos, setups, estrategia o interfaz.
- Revisar `fetchedAt`, errores y número de circuitos después de actualizar F1Laps.
- Mantener las fuentes y las fechas junto a los datos que puedan quedar obsoletos.

## Mapa documental

- [01_HISTORIAL.md](01_HISTORIAL.md): evolución conocida y decisiones ya incorporadas.
- [02_INVENTARIO.md](02_INVENTARIO.md): componentes, datos, recursos y herramientas.
- [03_PROCEDIMIENTOS.md](03_PROCEDIMIENTOS.md): uso, compilación y actualización segura.
- [04_CALENDARIO.md](04_CALENDARIO.md): revisiones periódicas y activadas por cambios.
- [05_PENDIENTES.md](05_PENDIENTES.md): validaciones y mejoras aún abiertas.
- [06_CHANGELOG.md](06_CHANGELOG.md): cambios de esta base documental.

## Fuentes del proyecto utilizadas

- `package.json` y `package-lock.json`
- `src/App.tsx` y `src/components/TrackMap.tsx`
- `src/data/types.ts`, `tracks.ts`, `setups.ts`, `setupLibrary.ts`, `strategy.ts` y `times.ts`
- `public/data/f1laps-times.json`
- `scripts/update-f1laps-times.mjs` y `scripts/generate_setup_library.py`
