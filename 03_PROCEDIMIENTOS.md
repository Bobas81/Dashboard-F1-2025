# Formula 1 Dashboard — PROCEDIMIENTOS

## Instalar y abrir en desarrollo

1. Situarse en la raíz del proyecto.
2. Ejecutar `npm ci` para reproducir las dependencias bloqueadas.
3. Ejecutar `npm run dev`.
4. Abrir la dirección local que muestre Vite.
5. Comprobar temporada, circuito, clima, parrilla y distancia antes de usar las recomendaciones.

## Validar un cambio

1. Revisar que los datos nuevos indiquen fuente, fecha y si son provisionales.
2. Ejecutar `npm run build`.
3. Confirmar que TypeScript y Vite terminan sin errores.
4. Revisar visualmente al menos un circuito de 2025, MADRING en 2026 y los tres modos de clima.
5. Comprobar el comportamiento en anchura de escritorio y móvil.
6. Registrar el cambio en [06_CHANGELOG.md](06_CHANGELOG.md) y cualquier validación pendiente en [05_PENDIENTES.md](05_PENDIENTES.md).

## Actualizar los tiempos de F1Laps

1. Conservar una copia del JSON vigente si se necesita comparar resultados.
2. Ejecutar `node scripts/update-f1laps-times.mjs` con acceso a Internet.
3. Revisar `public/data/f1laps-times.json`.
4. Confirmar que `fetchedAt` es actual, que existen 24 circuitos y que `errors` está vacío.
5. Revisar manualmente una muestra de tiempos, pilotos, equipos, plataforma y condición.
6. Ejecutar `npm run build`.
7. No declarar la actualización completa si el script informa errores parciales.

## Regenerar la biblioteca de setups

1. Confirmar que Python y la dependencia `requests` están disponibles.
2. Revisar las fuentes y filtros definidos en `scripts/generate_setup_library.py`.
3. Ejecutar `python3 scripts/generate_setup_library.py` con acceso a Internet.
4. Revisar los cambios generados en `src/data/setupLibrary.ts`, especialmente muestras pequeñas e interpolaciones.
5. Verificar seco, intermedio y mojado en varios tipos de circuito.
6. Ejecutar `npm run build` antes de aceptar la nueva biblioteca.

## Añadir o modificar un circuito

1. Definir sus datos y perfil en `src/data/tracks.ts`.
2. Añadir tiempos y setup o marcar explícitamente los datos pendientes/provisionales.
3. Incorporar mapa en `public/circuit-maps/` y `src/data/circuitImages.ts`, o asegurar el respaldo SVG.
4. Añadir el identificador a la temporada correspondiente.
5. Comprobar estrategia, notas de ingeniero, frenadas, DRS en 2025, aerodinámica activa en 2026 y selector visual.
6. Ejecutar la validación completa.

## Publicar una versión local

1. Ejecutar `npm ci` en un entorno limpio cuando sea posible.
2. Ejecutar `npm run build`.
3. Servir `dist/` con `npm run preview` para la comprobación final.
4. Confirmar que el JSON de tiempos se carga desde la ruta base y que el respaldo funciona si se simula un fallo.

## Fuentes del proyecto utilizadas

- `package.json`
- `scripts/update-f1laps-times.mjs`
- `scripts/generate_setup_library.py`
- `src/App.tsx` y `src/data/`
