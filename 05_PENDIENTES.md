# Formula 1 Dashboard — PENDIENTES

## Datos y contenido

- [ ] Mantener actualizados los leaderboards F1Laps; la copia local vigente es del 2026-07-16.
- [ ] Regenerar y revisar la biblioteca de setups; la vigente es del 2026-05-10.
- [ ] Sustituir el modelo provisional 2026 por datos medidos y contrastados del Season Pack.
- [ ] Validar MADRING con telemetría, mapa, referencias de frenada, DRS, estrategia y setups reales.
- [ ] Revalidar las referencias de F1 real y conservar una fuente directa trazable para cada registro.
- [ ] Revisar qué imágenes de circuitos son definitivas y documentar su procedencia/licencia.

## Calidad y mantenimiento

- [ ] Añadir pruebas automatizadas para normalización de setups, selección de temporadas y motor de estrategia.
- [ ] Añadir una comprobación estructural del JSON de F1Laps y detectar circuitos ausentes.
- [ ] Probar explícitamente el modo de respaldo cuando falla la carga de `public/data/f1laps-times.json`.
- [ ] Hacer una revisión visual sistemática en móvil y escritorio.
- [ ] Definir una forma reproducible de ejecutar el generador Python y sus dependencias.
- [x] Inicializar esta carpeta como repositorio Git local independiente.
- [x] Crear el primer commit local `cb0c93e` y conservarlo en `main` y `safety/local-main-cb0c93e`.
- [x] Auditar los 115 commits remotos y conservar `e87ebea` en `origin/main` y `safety/remote-main-e87ebea`.
- [x] Crear `integration/unify-histories` desde `origin/main`.
- [ ] Decidir el tratamiento de los workflows antes de cualquier push.
- [ ] Conectar las dos raíces Git únicamente tras aprobación explícita; todavía no se ha realizado merge.
- [ ] Realizar el primer push únicamente tras aprobación explícita; todavía no se ha realizado.
- [ ] Añadir scripts de actualización de tiempos y setups a `package.json` si se van a usar regularmente.

## Documentación

- [ ] Registrar una cadencia concreta de actualización cuando se decida.
- [ ] Completar el historial con versiones o hitos anteriores si aparece una fuente fiable.

## Fuentes del proyecto utilizadas

- Inspección del proyecto del 2026-07-13
- `package.json`
- `public/data/f1laps-times.json`
- `src/data/setups.ts`, `setupLibrary.ts`, `strategy.ts`, `times.ts` y `tracks.ts`
