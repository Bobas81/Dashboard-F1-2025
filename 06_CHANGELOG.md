# Formula 1 Dashboard — CHANGELOG

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
