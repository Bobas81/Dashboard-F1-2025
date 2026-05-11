import type { RaceDistance, SetupPreset, Track, WeatherMode } from './types';

interface TaggedNote {
  text: string;
  score: number;
  topic: string;
}

const uniqueNotes = (notes: TaggedNote[], limit = 6) => {
  const seen = new Set<string>();
  const seenTopics = new Set<string>();
  return notes
    .sort((a, b) => b.score - a.score)
    .filter((note) => {
      if (seen.has(note.text)) return false;
      if (seenTopics.has(note.topic)) return false;
      seen.add(note.text);
      seenTopics.add(note.topic);
      return true;
    })
    .slice(0, limit)
    .map((note) => note.text);
};

export const getEngineerRadioNotes = (
  track: Track,
  weather: WeatherMode,
  setup: SetupPreset,
  gridPosition: number,
  raceDistance: RaceDistance,
) => {
  const notes: TaggedNote[] = [];
  const add = (text: string, score: number, topic: string) => notes.push({ text, score, topic });

  add(track.engineer.braking[0], 100, 'braking');
  add(track.engineer.criticalCorners[0], 98, 'critical');
  add(track.engineer.ers[0], 94, 'ers');
  add(track.engineer.tyres[0], 92, 'tyres');
  add(track.engineer.overtaking[0], 88, 'overtake');
  add(track.engineer.commonMistakes[0], 84, 'mistake');

  if (weather === 'dry') {
    add('En seco, busca primero repetibilidad en frenada y salida; la última décima llega cuando el coche ya no te sorprende.', 70, 'weather-dry');
  }

  if (weather === 'intermediate') {
    add('Con intermedios, frena antes y libera presión con más calma; la pista cambia más de una vuelta a otra que en seco.', 110, 'weather-intermediate');
    add('No abras DRS por rutina si la salida de curva todavía te obliga a corregir con volante.', 96, 'weather-drs');
  }

  if (weather === 'wet') {
    add('En mojado fuerte, prioriza tracción y temperatura de freno; si el coche patina al tocar gas, abre manos antes de acelerar.', 112, 'weather-wet');
    add('Reduce agresividad en pianos y cambios de dirección; perder una salida vale más que apurar un vértice.', 104, 'weather-wet-precision');
  }

  if (track.profile.traction >= 78) {
    add('Este circuito castiga mucho la tracción: short shift y gas progresivo valen más que apurar entrada.', 102, 'track-traction');
  }

  if (track.profile.tireStress >= 82) {
    add('La degradación aquí llega por acumular temperatura, no por una sola curva; cuida la entrada en apoyo largo desde el inicio.', 101, 'track-degradation');
  }

  if (track.profile.curbUse >= 78) {
    add('Los pianos aquí solo compensan si el coche absorbe el golpe recto; si entra cruzado, pierdes más de lo que ganas.', 99, 'track-curbs');
  }

  if (track.drsZones <= 1) {
    add('Con tan pocas zonas claras de adelantamiento, prepara mejor la salida de curva y no gastes neumático peleando sin opción real.', 97, 'track-overtake-limit');
  }

  if (gridPosition <= 4) {
    add('Saliendo delante, la prioridad es controlar temperatura y no dar ventana de undercut por sobrecalentar la goma pronto.', 103, 'grid-front');
  } else if (gridPosition >= 12) {
    add('Saliendo atrás, acepta comprometer algo la primera vuelta si te deja entrar en aire limpio o ganar DRS útil pronto.', 95, 'grid-back');
  }

  if (raceDistance === '25') {
    add('En 25%, el neumático se puede usar con más agresividad; no conviertas la gestión en una carrera demasiado conservadora.', 89, 'distance-25');
  }

  if (raceDistance === '100') {
    add('En 100%, el stint se rompe antes por sobrecalentamiento acumulado que por una sola frenada; mantén la misma técnica bajo combustible alto.', 93, 'distance-100');
  }

  if (setup.transmission.differentialOn >= 80) {
    add('Tu diferencial con gas está bastante cerrado; si aceleras con volante aún cargado, la trasera va a deslizar antes.', 91, 'setup-diff-on');
  } else if (setup.transmission.differentialOn <= 40) {
    add('Tu diferencial con gas está bastante abierto; te dará salida limpia, pero exige paciencia antes de pedir rotación con acelerador.', 83, 'setup-diff-on');
  }

  if (setup.brakes.bias >= 58) {
    add('El reparto de freno va cargado delante; vigila bloqueos en las frenadas largas o con apoyo.', 90, 'setup-brake-bias');
  } else if (setup.brakes.bias <= 53) {
    add('El reparto de freno está más atrás de lo normal; el coche rotará mejor, pero será más nervioso al soltar freno.', 86, 'setup-brake-bias');
  }

  if (setup.aero.rearWing - setup.aero.frontWing >= 6) {
    add('Llevas bastante apoyo trasero relativo; el coche debería salir estable, pero no fuerces una entrada demasiado lenta.', 76, 'setup-aero-balance');
  }

  if (setup.aero.frontWing >= 35 && track.profile.downforce < 60) {
    add('Hay bastante ala para este trazado; asegúrate de convertirla en confianza en curva y no solo en déficit de punta.', 74, 'setup-aero-load');
  }

  if (weather !== 'dry' && setup.brakes.pressure >= 98) {
    add('Con lluvia y presión de freno alta, el primer toque de pedal debe ser más suave de lo habitual.', 109, 'weather-wet-brakes');
  }

  add(track.engineer.braking[1], 52, 'braking');
  add(track.engineer.criticalCorners[1], 50, 'critical');
  add(track.engineer.ers[1], 48, 'ers');
  add(track.engineer.tyres[1], 46, 'tyres');
  add(track.engineer.overtaking[1], 44, 'overtake');
  add(track.engineer.commonMistakes[1], 42, 'mistake');

  return uniqueNotes(notes);
};
