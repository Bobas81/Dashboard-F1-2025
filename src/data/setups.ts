import type { SetupPreset, Track, WeatherMode } from './types';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const baseByFamily: Record<Track['setupFamily'], SetupPreset> = {
  power: {
    aero: { frontWing: 26, rearWing: 22 },
    transmission: { differentialOn: 65, differentialOff: 45, engineBraking: 55 },
    suspensionGeometry: { frontCamber: -3.2, rearCamber: -1.7, frontToe: 0.05, rearToe: 0.14 },
    suspension: { frontSuspension: 30, rearSuspension: 12, frontAntiRoll: 14, rearAntiRoll: 8, frontRideHeight: 28, rearRideHeight: 58 },
    brakes: { pressure: 99, bias: 55 },
    tyres: { frontLeft: 24.0, frontRight: 24.0, rearLeft: 21.5, rearRight: 21.5 },
    notes: [],
  },
  balanced: {
    aero: { frontWing: 36, rearWing: 34 },
    transmission: { differentialOn: 58, differentialOff: 42, engineBraking: 60 },
    suspensionGeometry: { frontCamber: -3.3, rearCamber: -1.8, frontToe: 0.04, rearToe: 0.12 },
    suspension: { frontSuspension: 26, rearSuspension: 10, frontAntiRoll: 12, rearAntiRoll: 7, frontRideHeight: 30, rearRideHeight: 62 },
    brakes: { pressure: 98, bias: 54 },
    tyres: { frontLeft: 23.7, frontRight: 23.7, rearLeft: 21.2, rearRight: 21.2 },
    notes: [],
  },
  downforce: {
    aero: { frontWing: 44, rearWing: 46 },
    transmission: { differentialOn: 54, differentialOff: 38, engineBraking: 64 },
    suspensionGeometry: { frontCamber: -3.4, rearCamber: -1.9, frontToe: 0.03, rearToe: 0.11 },
    suspension: { frontSuspension: 22, rearSuspension: 8, frontAntiRoll: 10, rearAntiRoll: 6, frontRideHeight: 32, rearRideHeight: 66 },
    brakes: { pressure: 97, bias: 54 },
    tyres: { frontLeft: 23.4, frontRight: 23.4, rearLeft: 20.9, rearRight: 20.9 },
    notes: [],
  },
  street: {
    aero: { frontWing: 42, rearWing: 45 },
    transmission: { differentialOn: 50, differentialOff: 35, engineBraking: 68 },
    suspensionGeometry: { frontCamber: -3.25, rearCamber: -1.65, frontToe: 0.04, rearToe: 0.12 },
    suspension: { frontSuspension: 18, rearSuspension: 7, frontAntiRoll: 9, rearAntiRoll: 5, frontRideHeight: 36, rearRideHeight: 70 },
    brakes: { pressure: 96, bias: 53 },
    tyres: { frontLeft: 23.3, frontRight: 23.3, rearLeft: 20.8, rearRight: 20.8 },
    notes: [],
  },
  technical: {
    aero: { frontWing: 40, rearWing: 42 },
    transmission: { differentialOn: 55, differentialOff: 39, engineBraking: 64 },
    suspensionGeometry: { frontCamber: -3.45, rearCamber: -1.85, frontToe: 0.03, rearToe: 0.11 },
    suspension: { frontSuspension: 21, rearSuspension: 8, frontAntiRoll: 10, rearAntiRoll: 6, frontRideHeight: 33, rearRideHeight: 67 },
    brakes: { pressure: 97, bias: 54 },
    tyres: { frontLeft: 23.5, frontRight: 23.5, rearLeft: 21.0, rearRight: 21.0 },
    notes: [],
  },
};

export const getSetup = (track: Track, weather: WeatherMode): SetupPreset => {
  const base = baseByFamily[track.setupFamily];
  const rainBoost = weather === 'intermediate' ? 5 : weather === 'wet' ? 10 : 0;
  const raceSoftening = 2;
  const qualyAggression = 1;
  const tractionNeed = Math.round((track.profile.traction - 65) / 10);
  const brakingNeed = Math.round((track.profile.braking - 70) / 12);

  return {
    aero: {
      frontWing: clamp(base.aero.frontWing + rainBoost + qualyAggression + Math.round((track.profile.downforce - 65) / 12), 15, 50),
      rearWing: clamp(base.aero.rearWing + rainBoost + Math.max(0, tractionNeed) + raceSoftening, 15, 50),
    },
    transmission: {
      differentialOn: clamp(base.transmission.differentialOn - rainBoost - raceSoftening - Math.max(0, tractionNeed), 40, 80),
      differentialOff: clamp(base.transmission.differentialOff - Math.round(rainBoost / 2) - raceSoftening, 30, 60),
      engineBraking: clamp(base.transmission.engineBraking + brakingNeed + rainBoost, 40, 80),
    },
    suspensionGeometry: {
      frontCamber: Number((base.suspensionGeometry.frontCamber + (weather === 'dry' ? 0 : 0.1)).toFixed(2)),
      rearCamber: Number((base.suspensionGeometry.rearCamber + (weather === 'wet' ? 0.1 : 0)).toFixed(2)),
      frontToe: base.suspensionGeometry.frontToe,
      rearToe: base.suspensionGeometry.rearToe,
    },
    suspension: {
      frontSuspension: clamp(base.suspension.frontSuspension - rainBoost - raceSoftening, 10, 41),
      rearSuspension: clamp(base.suspension.rearSuspension - Math.round(rainBoost / 2) - raceSoftening, 4, 30),
      frontAntiRoll: clamp(base.suspension.frontAntiRoll - Math.round(rainBoost / 2) - raceSoftening, 4, 21),
      rearAntiRoll: clamp(base.suspension.rearAntiRoll - Math.round(rainBoost / 3) - raceSoftening, 3, 18),
      frontRideHeight: clamp(base.suspension.frontRideHeight + rainBoost + raceSoftening, 20, 50),
      rearRideHeight: clamp(base.suspension.rearRideHeight + rainBoost + raceSoftening, 45, 85),
    },
    brakes: {
      pressure: clamp(base.brakes.pressure - Math.round(rainBoost / 2) + qualyAggression, 90, 100),
      bias: clamp(base.brakes.bias + brakingNeed - (weather === 'wet' ? 1 : 0), 52, 58),
    },
    tyres: {
      frontLeft: Number((base.tyres.frontLeft - 0.2 - (weather === 'wet' ? 0.3 : 0)).toFixed(1)),
      frontRight: Number((base.tyres.frontRight - 0.2 - (weather === 'wet' ? 0.3 : 0)).toFixed(1)),
      rearLeft: Number((base.tyres.rearLeft - 0.2 - (weather !== 'dry' ? 0.2 : 0)).toFixed(1)),
      rearRight: Number((base.tyres.rearRight - 0.2 - (weather !== 'dry' ? 0.2 : 0)).toFixed(1)),
    },
    notes: [
      'Compromiso parc ferme: una sola base para qualy y carrera, priorizando estabilidad con deposito lleno sin matar la vuelta rapida.',
      weather === 'dry'
        ? 'Seco: puedes cerrar mas diferencial y bajar ala si no compromete la salida de curva.'
        : weather === 'intermediate'
          ? 'Intermedio: sube ala, suaviza barras y abre diferencial para traccion progresiva.'
          : 'Mojado fuerte: prioriza altura, ala trasera y diferencial abierto; la vuelta buena sale de no patinar.',
      `Volante: ajusta el force feedback para notar el limite del tren delantero en ${track.shortName}.`,
    ],
  };
};
