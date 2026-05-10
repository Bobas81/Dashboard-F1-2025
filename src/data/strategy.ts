import type { RaceDistance, Track, WeatherMode } from './types';

export interface StrategySection {
  title: string;
  items: string[];
}

export interface StrategyPlan {
  headline: string;
  summary: string;
  sections: StrategySection[];
}

const distanceMultiplier: Record<RaceDistance, number> = {
  "25": 0.25,
  "50": 0.5,
  "100": 1,
};

const distanceLabel: Record<RaceDistance, string> = {
  "25": "25%",
  "50": "50%",
  "100": "100%",
};

const difficultyPenalty: Record<Track['difficulty'], number> = {
  Baja: 0,
  Media: 4,
  Alta: 9,
  Extrema: 14,
};

const overtakeRating = (track: Track) => {
  const score = track.drsZones * 16 + track.profile.braking * 0.32 + (track.lengthKm - 4) * 7 - difficultyPenalty[track.difficulty];
  if (score >= 58) return 'alta';
  if (score >= 44) return 'media';
  return 'baja';
};

const pitWindow = (laps: number, startPct: number, endPct: number) =>
  `Vuelta ${Math.max(2, Math.round(laps * startPct))}-${Math.max(3, Math.round(laps * endPct))}`;

const dryPlan = (track: Track, gridPosition: number, raceDistance: RaceDistance): StrategyPlan => {
  const raceLaps = Math.max(5, Math.round(track.laps * distanceMultiplier[raceDistance]));
  const overtake = overtakeRating(track);
  const tyreStress = track.profile.tireStress;
  const frontHalf = gridPosition <= 10;
  const topFour = gridPosition <= 4;
  const sprintish = raceDistance === '25';
  const fullLength = raceDistance === '100';
  const conservativeBase = frontHalf || overtake === 'baja';
  const oneStopBase = sprintish
    ? true
    : fullLength
      ? tyreStress < 78 || conservativeBase
      : tyreStress < 84 || conservativeBase;
  const needsTwoStops = !sprintish && (!oneStopBase || (fullLength && tyreStress >= 82 && overtake !== 'baja'));

  const primaryCompounds = sprintish
    ? topFour
      ? 'Blando -> Medio'
      : frontHalf
        ? 'Blando -> Medio'
        : overtake === 'alta'
          ? 'Medio -> Blando'
          : 'Blando -> Medio'
    : needsTwoStops
      ? topFour
        ? 'Medio -> Duro -> Medio'
        : 'Duro -> Medio -> Medio'
      : topFour
        ? 'Medio -> Duro'
        : frontHalf
          ? 'Medio -> Duro'
          : overtake === 'alta'
            ? 'Duro -> Medio'
            : 'Medio -> Duro';

  const primaryWindow = sprintish
    ? pitWindow(raceLaps, 0.38, 0.52)
    : needsTwoStops
      ? `${pitWindow(raceLaps, 0.2, 0.28)} y ${pitWindow(raceLaps, 0.56, 0.7)}`
      : pitWindow(raceLaps, topFour ? 0.42 : 0.38, topFour ? 0.54 : 0.5);

  const undercutBias =
    overtake === 'baja'
      ? 'prioriza cubrir undercut y defender pista; perder posicion aqui cuesta mucho recuperarla'
      : overtake === 'media'
        ? 'puedes jugar a undercut si sales del primer stint atascado, pero sin romper el neumatico delantero'
        : 'si sales fuera de posicion, merece la pena abrir ventana y atacar con aire limpio';

  const safetyCarCall =
    sprintish
      ? 'Con Safety Car temprana, parar suele tener sentido si no te mete en trafico: en 25% cada vuelta verde vale mucho.'
      : !needsTwoStops
      ? 'Con Safety Car temprana, solo para si puedes convertir a una sola parada larga sin meterte en trafico.'
      : 'Con Safety Car temprana, evita gastar los dos compuestos de carrera demasiado pronto; este plan necesita flexibilidad.';

  return {
    headline: `Plan base ${distanceLabel[raceDistance]} P${gridPosition} - ${primaryCompounds}`,
    summary:
      sprintish
        ? 'Distancia corta: prioriza track position, salida agresiva y una sola parada limpia.'
        : needsTwoStops
          ? 'Distancia larga o circuito agresivo con la goma: el plan necesita ritmo estable y reaccion a Safety Car.'
          : 'Estrategia centrada en pista y degradacion estable. Mejor para parc ferme y salida con deposito lleno.',
    sections: [
      {
        title: 'Stint base',
        items: [
          `Distancia estimada: ${raceLaps} vueltas (${distanceLabel[raceDistance]}).`,
          `Compuestos: ${primaryCompounds}.`,
          `Ventana principal: ${primaryWindow}.`,
          `Lectura de parrilla: desde P${gridPosition}, ${undercutBias}.`,
        ],
      },
      {
        title: 'Primeras vueltas',
        items: [
          topFour
            ? 'Salida: protege posicion y temperatura de neumatico; no abras hueco a costa de castigar el eje trasero.'
            : frontHalf
              ? 'Salida: si no ganas posicion clara en la arrancada, entra rapido en ritmo y prepara undercut.'
              : 'Salida: busca aire limpio y evita pelear de mas en el primer stint; la estrategia gana mas que la agresion inmediata.',
          sprintish
            ? 'En 25% no merece tanto guardar goma: si hay hueco real, ataca antes de que la carrera se comprima.'
            : overtake === 'alta'
            ? 'El circuito permite recuperar; si el ritmo real aparece, alarga una o dos vueltas para salir libre.'
            : 'No regales neumatico en batalla larga; en trazados con poco adelantamiento conviene priorizar salida de curva.',
        ],
      },
      {
        title: 'Safety Car',
        items: [
          safetyCarCall,
          'Con VSC en mitad de ventana, inclinate por parar: el ahorro de tiempo suele valer mas que una vuelta extra en trafico.',
        ],
      },
    ],
  };
};

const wetPlan = (track: Track, weather: WeatherMode, gridPosition: number, raceDistance: RaceDistance): StrategyPlan => {
  const raceLaps = Math.max(5, Math.round(track.laps * distanceMultiplier[raceDistance]));
  const overtake = overtakeRating(track);
  const cautious = gridPosition <= 6 || overtake === 'baja';

  return {
    headline: `Plan ${weather === 'wet' ? 'mojado fuerte' : 'intermedio'} ${distanceLabel[raceDistance]} P${gridPosition}`,
    summary:
      weather === 'wet'
        ? 'La prioridad es cruzar bien de full wet a intermedio o mantener temperatura si la pista no evoluciona.'
        : 'Con intermedios, la carrera gira alrededor del cruce correcto a slicks o a full wet si la pista empeora.',
    sections: [
      {
        title: 'Base',
        items: [
          `Distancia estimada: ${raceLaps} vueltas (${distanceLabel[raceDistance]}).`,
          weather === 'wet'
            ? 'Salida en full wet y conduce una fase de temperatura estable antes de buscar ritmo puro.'
            : 'Salida en intermedio con entrega de gas larga y freno mas recto; evita castigar demasiado el eje trasero.',
          cautious
            ? 'Desde delante o con poco adelantamiento, espera confirmacion clara antes de cruzar de compuesto.'
            : 'Desde mitad o fondo, puedes anticipar el crossover una vuelta si necesitas track position.',
          raceDistance === '25'
            ? 'En distancia corta, si el crossover aparece claro, merece la pena anticiparlo incluso con algo de riesgo.'
            : 'En 50% o 100%, protege mas el neumatico equivocado en fase de transicion; un stop de mas cuesta mucho.',
        ],
      },
      {
        title: 'Cruce de compuestos',
        items: [
          weather === 'wet'
            ? 'Pasa a intermedio cuando la pista ya te deje acelerar sin aquaplaning continuado y el ritmo de full wet caiga varias decimas por sector.'
            : 'Pasa a slick cuando puedas encadenar dos sectores con linea seca y el intermedio empiece a sobrecalentarse.',
          overtake === 'alta'
            ? 'Si el circuito adelanta bien, prima el neumatico correcto antes que la posicion puntual en la salida de boxes.'
            : 'Si cuesta adelantar, protege la posicion incluso si eso implica retrasar una vuelta el crossover.',
        ],
      },
      {
        title: 'Riesgo',
        items: [
          'En lluvia, el primer error grande suele llegar por temperatura de frenos o por diferencial demasiado cerrado, no por falta de ala.',
          'Si hay Safety Car cerca del crossover, para salvo que te devuelva a trafico muy lento o a otro compuesto equivocado.',
        ],
      },
    ],
  };
};

export const getStrategyPlan = (track: Track, weather: WeatherMode, gridPosition: number, raceDistance: RaceDistance): StrategyPlan => {
  if (weather === 'dry') {
    return dryPlan(track, gridPosition, raceDistance);
  }
  return wetPlan(track, weather, gridPosition, raceDistance);
};
