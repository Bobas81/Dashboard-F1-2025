# AGENTS.md

## Alcance

Estas instrucciones se aplican a todo el repositorio. Conserva el comportamiento actual de la aplicación y realiza cambios pequeños, trazables y fáciles de revisar.

## Fuentes y archivos generados

- Versiona `src/`, `public/`, `scripts/`, la configuración, los documentos y ambos archivos de dependencias.
- No versiones ni edites manualmente `node_modules/` o `dist/`; son dependencias y salida de build.
- `public/data/f1laps-times.json`, `src/data/setupLibrary.ts` y `src/data/realTrackShapes.ts` son datos mantenidos que deben versionarse aunque puedan proceder de procesos de generación.
- No ejecutes los actualizadores de `scripts/` sin autorización: acceden a fuentes externas y sobrescriben datos mantenidos.

## Seguridad y Git

- No añadas secretos, credenciales, tokens, claves privadas ni archivos `.env` reales.
- Usa `.env.example` con valores ficticios si en el futuro se documentan variables de entorno.
- No configures remotos, no hagas push y no publiques el repositorio sin autorización explícita.
- No crees commits sin aprobación y no establezcas identidad Git global.
- Revisa especialmente `.github/workflows/update-f1laps-times.yml`: contiene un commit y push automáticos para su ejecución futura en GitHub.
- No borres archivos ni reescribas historial sin autorización explícita.

## Validación

- Instala dependencias reproducibles con `npm ci` cuando sea necesario.
- Ejecuta `npm run build` después de modificar TypeScript, React, estilos, configuración o datos mantenidos.
- No afirmes que existen tests o lint: actualmente no hay scripts declarados para ellos.
- Comprueba visualmente temporadas 2025 y 2026, MADRING y los tres modos de clima cuando cambie la interfaz o los datos.

## Documentación

- Mantén `00_MASTER.md` como resumen del estado vigente.
- Registra decisiones duraderas en `01_HISTORIAL.md`, inventario en `02_INVENTARIO.md`, pendientes en `05_PENDIENTES.md` y cambios documentales en `06_CHANGELOG.md`.
- Conserva las marcas de provisionalidad de la temporada 2026 y MADRING hasta disponer de evidencia validada.
