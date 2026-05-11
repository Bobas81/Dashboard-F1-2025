import { curatedSetupLibrary, setupLibraryFetchedAt } from './setupLibrary';
import type { SetupPreset, Track, WeatherMode } from './types';

const weatherNotes: Record<WeatherMode, string> = {
  dry: 'Seco: base de carrera+volante tomada de F1Laps. Mantiene compromiso de parc ferme sin cerrar demasiado la ventana de neumaticos.',
  intermediate: 'Intermedio: interpolado desde seco/mojado usando la guia oficial de EA para abrir diferencial, subir ala y suavizar el coche.',
  wet: 'Mojado fuerte: base de mojado de F1Laps cuando existe; si faltase muestra, se deriva siguiendo la guia de EA F1 25.',
};

const fetchedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(setupLibraryFetchedAt));

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const snap = (value: number, step: number, min: number, max: number, digits = 0) => {
  const snapped = Math.round((value - min) / step) * step + min;
  return Number(clamp(snapped, min, max).toFixed(digits));
};

const normalizeSetupForGame = (preset: SetupPreset): SetupPreset => ({
  ...preset,
  aero: {
    frontWing: snap(preset.aero.frontWing, 1, 0, 50),
    rearWing: snap(preset.aero.rearWing, 1, 0, 50),
  },
  transmission: {
    differentialOn: snap(preset.transmission.differentialOn, 5, 10, 100),
    differentialOff: snap(preset.transmission.differentialOff, 5, 10, 100),
    engineBraking: preset.transmission.engineBraking,
  },
  suspensionGeometry: {
    frontCamber: snap(preset.suspensionGeometry.frontCamber, 0.1, -3.5, -2.5, 2),
    rearCamber: snap(preset.suspensionGeometry.rearCamber, 0.1, -2.0, -1.0, 2),
    frontToe: snap(preset.suspensionGeometry.frontToe, 0.01, 0.0, 0.2, 2),
    rearToe: snap(preset.suspensionGeometry.rearToe, 0.01, 0.1, 0.25, 2),
  },
  suspension: {
    frontSuspension: snap(preset.suspension.frontSuspension, 1, 1, 41),
    rearSuspension: snap(preset.suspension.rearSuspension, 1, 1, 41),
    frontAntiRoll: snap(preset.suspension.frontAntiRoll, 1, 1, 21),
    rearAntiRoll: snap(preset.suspension.rearAntiRoll, 1, 1, 21),
    frontRideHeight: snap(preset.suspension.frontRideHeight, 1, 15, 35),
    rearRideHeight: snap(preset.suspension.rearRideHeight, 1, 40, 60),
  },
  brakes: {
    pressure: snap(preset.brakes.pressure, 1, 80, 100),
    bias: snap(preset.brakes.bias, 1, 50, 70),
  },
  tyres: {
    frontLeft: snap(preset.tyres.frontLeft, 0.1, 22.5, 29.5, 1),
    frontRight: snap(preset.tyres.frontRight, 0.1, 22.5, 29.5, 1),
    rearLeft: snap(preset.tyres.rearLeft, 0.1, 20.5, 26.5, 1),
    rearRight: snap(preset.tyres.rearRight, 0.1, 20.5, 26.5, 1),
  },
});

export const getSetup = (track: Track, weather: WeatherMode): SetupPreset => {
  const preset = curatedSetupLibrary[track.id]?.[weather];
  if (!preset) {
    throw new Error(`No setup available for ${track.id} in ${weather}`);
  }

  return normalizeSetupForGame({
    ...preset,
    notes: [
      'Compromiso parc ferme: esta base prioriza una sola configuracion util para salida, stint largo y vuelta de qualy razonable.',
      weatherNotes[weather],
      `Fuente base: ${preset.source}. Biblioteca actualizada el ${fetchedDate}.`,
      `Volante: comprueba force feedback, bloqueo de freno y entrega de gas en ${track.shortName} antes de tocar ala o altura.`,
    ],
  });
};
