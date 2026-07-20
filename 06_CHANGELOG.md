# Formula 1 Dashboard — CHANGELOG

## 2026-07-18 — Colección vectorial homogénea 2026

- Sustituida la presentación desigual de los mapas 2026 por una colección vectorial homogénea de 24 circuitos con numeración completa de curvas.
- Usadas geometrías de telemetría FastF1 2025 y posiciones de curva MultiViewer en 23 trazados; MADRING procede de su SVG y posicionamiento oficial de 22 curvas.
- Añadidos sectores derivados de telemetría cuando existen; MADRING queda deliberadamente neutro y marcado como pendiente de sectores para no inventar divisiones.
- Conservados los mapas 2025 y las 24 imágenes oficiales 2026 como referencias locales; no se ha publicado ni eliminado ningún activo.
- Validada la colección completa contra el catálogo: 24 mapas, numeración consecutiva, coordenadas dentro del lienzo y compilación de producción correcta.

## 2026-07-17 — Mapas oficiales y separación reglamentaria 2025/2026

- Incorporada una colección de 24 mapas oficiales de Formula 1 para 2026, con curvas numeradas y fuente visible por circuito; se documenta que la fuente mezcla dos niveles de detalle visual.
- Eliminados del modo 2026 los indicadores de DRS y sustituidos por aerodinámica activa, Straight Mode y Overtake Mode; 2025 conserva su información DRS.
- Eliminada la geometría generada como respaldo visual: un mapa ausente se declara como pendiente en lugar de inventar un circuito.
- Corregido Albert Park a 14 curvas y actualizada su guía con referencias especializadas de SIM-racing.
- Actualizado MADRING a 5,416 km y a su mapa oficial, manteniendo provisionales sus datos de rendimiento.
- Conservados Baréin y Arabia Saudí como pruebas normales del calendario 2026 de la aplicación.
- Separado el catálogo de imágenes por temporada y añadida trazabilidad de sus URL de procedencia.

## 2026-07-16 — Integración local controlada de historiales

- Auditado el historial remoto preexistente de 115 commits y la raíz local independiente `cb0c93e`.
- Creada `integration/unify-histories` desde `origin/main` en `e87ebea`.
- Conservado `cb0c93e` en `main` y `safety/local-main-cb0c93e`.
- Conservado `e87ebea` en `origin/main` y `safety/remote-main-e87ebea`.
- No se ha realizado merge entre las raíces ni push.
- Los workflows de actualización y GitHub Pages siguen pendientes de decisión.

## 2026-07-16 — Preparación segura del repositorio local

- Auditado el contenido completo antes de inicializar Git.
- Confirmada la ausencia de secretos detectables, archivos `.env` y repositorios anidados.
- Ampliado `.gitignore` para excluir dependencias, builds, cachés, logs, temporales y secretos locales.
- Añadidos `README.md` y `AGENTS.md` con procedimientos, límites de seguridad y reglas de mantenimiento.
- Inicializado un repositorio Git local independiente en la rama `main`; su primer commit se creó posteriormente como `cb0c93e`.
- Confirmada la compilación de producción con `npm run build`.

## 2026-07-13 — Base documental inicial

- Creada la estructura documental `00_MASTER` a `06_CHANGELOG` para Formula 1 Dashboard.
- Documentados alcance, arquitectura, inventario, fuentes y procedimientos operativos.
- Separados datos confirmados, copias externas fechadas y modelos provisionales.
- Registradas las fechas internas de leaderboards y setups.
- Marcados Season Pack 2026 y MADRING como pendientes de validación definitiva.
- Confirmada la compilación de producción con `npm run build`.
- Registrada la ausencia de pruebas automatizadas y de repositorio Git en esta carpeta.

## Criterio de mantenimiento

- Añadir una entrada cuando cambie el comportamiento, la estructura, una fuente de datos o el estado de una validación.
- No registrar como completada una actualización externa si conserva errores parciales.
- Trasladar a [01_HISTORIAL.md](01_HISTORIAL.md) las decisiones duraderas y cerrar en [05_PENDIENTES.md](05_PENDIENTES.md) las tareas resueltas.

## Fuentes del proyecto utilizadas

- [MASTER](00_MASTER.md)
- [HISTORIAL](01_HISTORIAL.md)
- Inspección y compilación local del proyecto el 2026-07-13
