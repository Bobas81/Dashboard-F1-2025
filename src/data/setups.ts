import { curatedSetupLibrary, setupLibraryFetchedAt } from './setupLibrary';
import type { SetupPreset, Track, WeatherMode } from './types';

const weatherNotes: Record<WeatherMode, string> = {
  dry: 'Seco: base de carrera+volante tomada de F1Laps. Mantiene compromiso de parc ferme sin cerrar demasiado la ventana de neumaticos.',
  intermediate: 'Intermedio: interpolado desde seco/mojado usando la guia oficial de EA para abrir diferencial, subir ala y suavizar el coche.',
  wet: 'Mojado fuerte: base de mojado de F1Laps cuando existe; si faltase muestra, se deriva siguiendo la guia de EA F1 25.',
};

const fetchedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(setupLibraryFetchedAt));

export const getSetup = (track: Track, weather: WeatherMode): SetupPreset => {
  const preset = curatedSetupLibrary[track.id]?.[weather];
  if (!preset) {
    throw new Error(`No setup available for ${track.id} in ${weather}`);
  }

  return {
    ...preset,
    notes: [
      'Compromiso parc ferme: esta base prioriza una sola configuracion util para salida, stint largo y vuelta de qualy razonable.',
      weatherNotes[weather],
      `Fuente base: ${preset.source}. Biblioteca actualizada el ${fetchedDate}.`,
      `Volante: comprueba force feedback, bloqueo de freno y entrega de gas en ${track.shortName} antes de tocar ala o altura.`,
    ],
  };
};
