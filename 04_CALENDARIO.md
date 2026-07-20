# Formula 1 Dashboard — CALENDARIO

## Antes de cada uso relevante

- Confirmar que la temporada seleccionada coincide con el contenido del juego.
- Revisar circuito, clima, posición de parrilla y distancia de carrera.
- Tratar los setups como punto de partida y validar frenos, gas, neumáticos y estabilidad con el propio volante.

## Revisión mensual mientras el proyecto esté activo

- Comprobar si los leaderboards F1Laps han quedado obsoletos.
- Revisar si EA o F1Laps han publicado datos que permitan reemplazar modelos provisionales.
- Ejecutar la compilación y una comprobación visual básica si hubo cambios de dependencias o datos.

## Tras cambios externos

- Nueva versión o parche de F1 25: revisar rangos de setup, físicas y estrategia.
- Cambio en F1Laps: validar que los scripts siguen interpretando correctamente sus páginas.
- Actualización del Season Pack 2026: revisar todo el modelo 2026 y MADRING.
- Cambio de calendario o trazado: actualizar catálogo, mapas, vueltas, DRS 2025, aerodinámica activa 2026 y referencias.

## Revisión trimestral

- Revisar dependencias y compatibilidad de React, TypeScript y Vite.
- Comprobar enlaces de fuentes y recursos gráficos.
- Depurar pendientes resueltos y registrar decisiones en historial y changelog.

## Fechas pendientes de fijar

- Cadencia definitiva de actualización de tiempos F1Laps.
- Momento de sustitución de la biblioteca de setups del 2026-05-10.
- Validación definitiva del Season Pack 2026 y MADRING.

## Fuentes del proyecto utilizadas

- `package.json`
- `public/data/f1laps-times.json`
- `src/data/setupLibrary.ts` y `src/data/setups.ts`
- `scripts/update-f1laps-times.mjs`
