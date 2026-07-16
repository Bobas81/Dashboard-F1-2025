import { curatedSetupLibrary, setupLibraryFetchedAt } from './setupLibrary';
import type { SeasonMode, SetupPreset, Track, WeatherMode } from './types';

const weatherNotes: Record<WeatherMode, string> = {
  dry: 'Seco: base de carrera+volante tomada de F1Laps. Mantiene compromiso de parc ferme sin cerrar demasiado la ventana de neumaticos.',
  intermediate: 'Intermedio: interpolado desde seco/mojado usando la guia oficial de EA para abrir diferencial, subir ala y suavizar el coche.',
  wet: 'Mojado fuerte: base de mojado de F1Laps cuando existe; si faltase muestra, se deriva siguiendo la guia de EA F1 25.',
};

const fetchedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(setupLibraryFetchedAt));

const provisionalMadringSetup: Record<WeatherMode, SetupPreset> = {
  dry: {
    source: 'Base provisional 2026 desde perfiles street/balanced hasta datos F1Laps del pack',
    sourceUrl: 'https://www.ea.com/en/games/f1/f1-25/news/f1-25-2026-season-pack-official-reveal',
    notes: [],
    aero: { frontWing: 28, rearWing: 24 },
    transmission: { differentialOn: 75, differentialOff: 45, engineBraking: 60 },
    suspensionGeometry: { frontCamber: -3.3, rearCamber: -1.8, frontToe: 0.03, rearToe: 0.14 },
    suspension: { frontSuspension: 33, rearSuspension: 12, frontAntiRoll: 10, rearAntiRoll: 8, frontRideHeight: 24, rearRideHeight: 50 },
    brakes: { pressure: 98, bias: 56 },
    tyres: { frontLeft: 25.0, frontRight: 25.0, rearLeft: 22.4, rearRight: 22.4 },
  },
  intermediate: {
    source: 'Base provisional 2026 desde perfiles street/balanced hasta datos F1Laps del pack',
    sourceUrl: 'https://www.ea.com/en/games/f1/f1-25/news/f1-25-2026-season-pack-official-reveal',
    notes: [],
    aero: { frontWing: 31, rearWing: 28 },
    transmission: { differentialOn: 70, differentialOff: 40, engineBraking: 60 },
    suspensionGeometry: { frontCamber: -3.4, rearCamber: -1.9, frontToe: 0.02, rearToe: 0.13 },
    suspension: { frontSuspension: 28, rearSuspension: 9, frontAntiRoll: 8, rearAntiRoll: 6, frontRideHeight: 25, rearRideHeight: 52 },
    brakes: { pressure: 96, bias: 55 },
    tyres: { frontLeft: 26.3, frontRight: 26.3, rearLeft: 23.5, rearRight: 23.5 },
  },
  wet: {
    source: 'Base provisional 2026 desde perfiles street/balanced hasta datos F1Laps del pack',
    sourceUrl: 'https://www.ea.com/en/games/f1/f1-25/news/f1-25-2026-season-pack-official-reveal',
    notes: [],
    aero: { frontWing: 35, rearWing: 33 },
    transmission: { differentialOn: 65, differentialOff: 35, engineBraking: 60 },
    suspensionGeometry: { frontCamber: -3.5, rearCamber: -2.0, frontToe: 0.01, rearToe: 0.12 },
    suspension: { frontSuspension: 22, rearSuspension: 7, frontAntiRoll: 6, rearAntiRoll: 5, frontRideHeight: 27, rearRideHeight: 54 },
    brakes: { pressure: 94, bias: 54 },
    tyres: { frontLeft: 27.6, frontRight: 27.6, rearLeft: 24.6, rearRight: 24.6 },
  },
};

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

const applySeason2026Model = (preset: SetupPreset, track: Track, weather: WeatherMode): SetupPreset => {
  const isWet = weather !== 'dry';
  const downforceBias = track.setupFamily === 'power' ? -2 : track.setupFamily === 'downforce' || track.setupFamily === 'street' ? 2 : 0;
  const tractionBias = track.profile.traction >= 78 || track.setupFamily === 'street' ? -5 : 0;

  return {
    ...preset,
    source: `${preset.source} + modelo provisional 2026`,
    sourceUrl: preset.sourceUrl,
    aero: {
      frontWing: preset.aero.frontWing + downforceBias + (isWet ? 1 : 0),
      rearWing: preset.aero.rearWing + downforceBias + (isWet ? 2 : 0),
    },
    transmission: {
      ...preset.transmission,
      differentialOn: preset.transmission.differentialOn + tractionBias - (isWet ? 5 : 0),
      differentialOff: preset.transmission.differentialOff - 5,
    },
    suspension: {
      frontSuspension: preset.suspension.frontSuspension - 4,
      rearSuspension: preset.suspension.rearSuspension - 2,
      frontAntiRoll: preset.suspension.frontAntiRoll - 2,
      rearAntiRoll: preset.suspension.rearAntiRoll - 2,
      frontRideHeight: preset.suspension.frontRideHeight + 1,
      rearRideHeight: preset.suspension.rearRideHeight + 2,
    },
    brakes: {
      pressure: preset.brakes.pressure - (isWet ? 2 : 1),
      bias: preset.brakes.bias - 1,
    },
  };
};

export const getSetup = (track: Track, weather: WeatherMode, season: SeasonMode = '2025'): SetupPreset => {
  const basePreset = curatedSetupLibrary[track.id]?.[weather] ?? (track.id === 'madring' ? provisionalMadringSetup[weather] : undefined);
  const preset = season === '2026' && basePreset ? applySeason2026Model(basePreset, track, weather) : basePreset;
  if (!preset) {
    throw new Error(`No setup available for ${track.id} in ${weather}`);
  }

  return normalizeSetupForGame({
    ...preset,
    notes: [
      'Compromiso parc ferme: esta base prioriza una sola configuracion util para salida, stint largo y vuelta de qualy razonable.',
      season === '2026'
        ? 'Pack 2026: valores provisionales adaptados a coches mas ligeros, active aero, Overtake Mode y nueva entrega de potencia. Sustituir por datos F1Laps/EA cuando el pack este medido.'
        : 'Temporada 2025: usa la biblioteca F1 25 validada antes del pack 2026.',
      weatherNotes[weather],
      `Fuente base: ${preset.source}. Biblioteca actualizada el ${fetchedDate}.`,
      `Volante: comprueba force feedback, bloqueo de freno y entrega de gas en ${track.shortName} antes de tocar ala o altura.`,
    ],
  });
};
