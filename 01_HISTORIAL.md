# Formula 1 Dashboard — HISTORIAL

## Evolución conocida

- Se construyó un dashboard local orientado a F1 25, PS5 y conducción con volante, sobre React, TypeScript y Vite.
- Se consolidó un catálogo común de circuitos con perfil técnico, mapa, sistema de adelantamiento por temporada, referencias de frenada y notas de ingeniero.
- Se incorporaron setups para seco y mojado procedentes de muestras de F1Laps; los setups intermedios se interpolaron con apoyo de la guía de EA.
- El 2026-05-06 se generó la primera copia local documentada de leaderboards F1Laps para 24 circuitos. La copia incorporada desde el historial remoto se actualizó el 2026-07-16 y registra cero errores de descarga.
- El 2026-05-10 se generó la biblioteca actual de setups.
- Se añadió selección de temporada: 2025 usa el juego base; 2026 aplica un modelo provisional y añade MADRING en lugar de Imola.
- El 2026-07-17 se separaron los mapas y la normativa visual por temporada: 2025 conserva DRS y 2026 utiliza aerodinámica activa, Straight Mode y Overtake Mode.
- Se incorporaron 24 mapas oficiales de Formula 1 para 2026 como referencia y, el 2026-07-18, se sustituyó su presentación por una colección vectorial homogénea: 23 trazados usan geometría de telemetría FastF1 2025 y posiciones de curva MultiViewer; MADRING usa la geometría y las 22 posiciones publicadas por el circuito. Baréin y Arabia Saudí se conservan como pruebas normales del calendario de producto por decisión expresa.
- Albert Park se corrigió a 14 curvas y su guía se ajustó al trazado vigente; MADRING pasó a 5,416 km y utiliza su mapa oficial.
- Se implementó una estrategia dinámica que combina circuito, clima, posición de parrilla y distancia de carrera.
- El 2026-07-13 se comprobó la compilación de producción sin errores.

## Decisiones vigentes

- La aplicación funciona sin backend y conserva los datos necesarios dentro del proyecto.
- Los tiempos F1Laps se leen primero desde el JSON público local y tienen respaldo en los datos TypeScript integrados.
- Los valores del juego se normalizan a los rangos y pasos admitidos antes de mostrarse.
- El contenido 2026 se etiqueta como provisional hasta disponer de datos medidos del Season Pack.
- La provisionalidad de 2026 se aplica a setups, estrategia y telemetría descriptiva. En MADRING también se mantienen pendientes los sectores hasta disponer de una sesión oficial, sin inventarlos en el mapa.
- La interfaz nunca sustituye un circuito ausente por una geometría generada o genérica.

## Estado de los historiales Git

El repositorio remoto ya existía y conserva 115 commits hasta `e87ebea`. El repositorio local reinicializado creó una raíz independiente en `cb0c93e`. Ambos historiales fueron auditados y la rama `integration/unify-histories` se creó desde `origin/main`, sin merge entre las raíces y sin push. El commit local `cb0c93e` permanece en `main` y `safety/local-main-cb0c93e`; el estado remoto `e87ebea` permanece en `origin/main` y `safety/remote-main-e87ebea`. Los workflows siguen pendientes de decisión.

## Fuentes del proyecto utilizadas

- `src/App.tsx`
- `src/data/setups.ts`, `setupLibrary.ts`, `strategy.ts`, `tracks.ts` y `times.ts`
- `public/data/f1laps-times.json`
- Resultado local de `npm run build` del 2026-07-13
