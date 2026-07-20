export type WeatherMode = 'dry' | 'intermediate' | 'wet';
export type RaceDistance = '25' | '50' | '100';
export type SeasonMode = '2025' | '2026';

export type SessionMode = 'qualifying' | 'race';

export type VerificationStatus = 'verified' | 'pending';

export interface LapRecord {
  rank: 1 | 2 | 3;
  driver: string;
  team: string;
  time: string;
  year: string;
  source: string;
  status: VerificationStatus;
}

export interface GameLap {
  rank: 1 | 2 | 3;
  driver: string;
  platform: 'PS5';
  team: string;
  time: string;
  condition: string;
  source: string;
  status: VerificationStatus;
}

export interface TrackPoint {
  x: number;
  y: number;
}

export interface RealTrackShape {
  sourceName: string;
  points: TrackPoint[];
}

export interface CornerPoint {
  label: string;
}

export interface BrakingReference {
  corner: string;
  reference: string;
  gear: string;
  note: string;
}

export interface TrackMap {
  sourceName: string;
  corners: CornerPoint[];
}

export type OvertakingSystem =
  | { kind: 'drs'; zones: number }
  | { kind: 'active-aero' };

export interface TrackProfile {
  downforce: number;
  tireStress: number;
  braking: number;
  traction: number;
  curbUse: number;
}

export interface EngineerNotes {
  braking: string[];
  criticalCorners: string[];
  ers: string[];
  tyres: string[];
  overtaking: string[];
  commonMistakes: string[];
}

export interface Track {
  id: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  lengthKm: number;
  laps: number;
  corners: number;
  aero: Record<SeasonMode, OvertakingSystem>;
  difficulty: 'Baja' | 'Media' | 'Alta' | 'Extrema';
  setupFamily: 'power' | 'balanced' | 'downforce' | 'street' | 'technical';
  sectorFocus: [string, string, string];
  summary: string;
  profile: TrackProfile;
  map: TrackMap;
  records: LapRecord[];
  gameLaps: GameLap[];
  brakingGuide: BrakingReference[];
  engineer: EngineerNotes;
}

export interface SetupPreset {
  source: string;
  sourceUrl: string;
  aero: {
    frontWing: number;
    rearWing: number;
  };
  transmission: {
    differentialOn: number;
    differentialOff: number;
    engineBraking: number;
  };
  suspensionGeometry: {
    frontCamber: number;
    rearCamber: number;
    frontToe: number;
    rearToe: number;
  };
  suspension: {
    frontSuspension: number;
    rearSuspension: number;
    frontAntiRoll: number;
    rearAntiRoll: number;
    frontRideHeight: number;
    rearRideHeight: number;
  };
  brakes: {
    pressure: number;
    bias: number;
  };
  tyres: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  notes: string[];
}
