import { realTrackShapes } from './realTrackShapes';
import { f1LapsGameTimes, realReferenceTimes } from './times';
import type { BrakingReference, EngineerNotes, GameLap, LapRecord, Track, TrackMap, TrackPoint } from './types';

const pendingRecords = (track: string): LapRecord[] =>
  ([1, 2, 3] as const).map((rank) => ({
    rank,
    driver: 'Pendiente de verificar',
    team: 'Dato local no cargado',
    time: '--:--.---',
    year: 'Pendiente',
    source: `Formula1.com / archivo oficial del circuito: ${track}`,
    status: 'pending',
  }));

const pendingGameLaps = (track: string): GameLap[] =>
  ([1, 2, 3] as const).map((rank) => ({
    rank,
    driver: 'Pendiente de verificar',
    platform: 'PS5',
    team: 'F1 25',
    time: '--:--.---',
    condition: 'Time Trial seco',
    source: `F1Laps / EA Racenet: ${track}`,
    status: 'pending',
  }));

const timeValue = (time: string) => {
  const [minutes, rest] = time.split(':');
  const seconds = Number(rest);
  return Number(minutes) * 60 + seconds;
};

const sortRecords = (records: LapRecord[]): LapRecord[] =>
  [...records]
    .sort((a, b) => timeValue(a.time) - timeValue(b.time))
    .map((record, index) => ({ ...record, rank: (index + 1) as 1 | 2 | 3 }));

const makeEngineerNotes = (
  brakingFocus: string,
  critical: string,
  ers: string,
  tyre: string,
  overtake: string,
  mistake: string,
): EngineerNotes => ({
  braking: [
    brakingFocus,
    'Con volante, prioriza frenar recto al inicio y soltar presion de forma progresiva antes del vertice.',
  ],
  criticalCorners: [
    critical,
    'Si el eje trasero empieza a flotar, abre 1 punto el diferencial en off-throttle antes de tocar alerones.',
  ],
  ers: [
    ers,
    'Guarda bateria para la recta mas larga y evita gastar ERS mientras el coche aun esta limitado por traccion.',
  ],
  tyres: [
    tyre,
    'En carrera, protege la rueda exterior de las curvas largas con una entrada menos agresiva durante las primeras vueltas.',
  ],
  overtaking: [
    overtake,
    'Prepara la salida de la curva anterior al punto de DRS, aunque eso sacrifique una decima en el vertice.',
  ],
  commonMistakes: [
    mistake,
    'No persigas un setup de qualy demasiado bajo si despues vas a sufrir con deposito lleno por parc ferme.',
  ],
});

const shapes = realTrackShapes;
type TrackId = keyof typeof shapes;

// Curated from OverTake's F1 25 track guides for circuits with reliable turn-by-turn references.
const curatedBrakingGuides: Partial<Record<TrackId, BrakingReference[]>> = {
  melbourne: [
    { corner: 'T1', reference: '100 m', gear: '5', note: 'Entra desde la izquierda, toca piano interior y prioriza la salida.' },
    { corner: 'T2', reference: 'sin frenar', gear: '6', note: 'Mantente limpio en la salida para preparar la frenada de T3.' },
    { corner: 'T3', reference: '100 m', gear: '3', note: 'Es la horquilla lenta; no abras gas pronto o patina el eje trasero.' },
    { corner: 'T4', reference: 'toque de freno', gear: '3', note: 'Recorta un poco el piano interior para enderezar el coche hacia T5.' },
    { corner: 'T5', reference: 'plano', gear: '6', note: 'Llega bien colocado desde T4; un volante brusco te quita apoyo.' },
    { corner: 'T6', reference: 'frenada suave', gear: '4', note: 'Curva de confianza; no te pases porque la salida se cierra.' },
    { corner: 'T7', reference: 'plano', gear: '7', note: 'Tras el reprofilado se hace a fondo si el coche esta estable.' },
    { corner: 'T8', reference: 'plano', gear: '7', note: 'Mantén el coche suelto y no pelees con el volante.' },
    { corner: 'T9', reference: '50 m', gear: '6', note: 'Cancela el DRS justo antes, monta piano con decisión y cambia rápido de apoyo.' },
    { corner: 'T10', reference: 'sin frenar', gear: '6', note: 'Segundo cambio de dirección del complejo rápido; precisión antes que agresividad.' },
    { corner: 'T11', reference: 'frenada suave', gear: '4', note: 'Noventa grados importante para la siguiente zona DRS; salida limpia.' },
    { corner: 'T12', reference: 'frena pronto', gear: '3', note: 'Es fácil irte largo cuesta abajo; paciencia con el gas en el vértice.' },
    { corner: 'T13', reference: 'frenada fuerte', gear: '2', note: 'Prioriza rotación y no abuses del piano interior si el coche rebota.' },
    { corner: 'T14', reference: 'ligero lift', gear: '4', note: 'Mantente pegado dentro para alinear T15.' },
    { corner: 'T15', reference: 'sin pausa tras T14', gear: '3', note: 'Última salida crítica; abre gas pronto para lanzar el coche a meta.' },
  ],
  bahrain: [
    { corner: 'T1', reference: 'justo después de 100 m', gear: '2', note: 'Frena recto y no montes demasiado el piano interior.' },
    { corner: 'T2', reference: 'sin frenar', gear: '3', note: 'Cambio rápido de dirección; tracción delicada con depósito lleno.' },
    { corner: 'T3', reference: 'plano con DRS', gear: '6', note: 'Acelera limpio desde T2 para no mover la zaga cuesta arriba.' },
    { corner: 'T4', reference: '100 m', gear: '3', note: 'Recorta bastante el piano, pero sin descolocar el coche.' },
    { corner: 'T5', reference: 'ligero lift', gear: '5', note: 'Empieza la secuencia rápida; la clave es no castigar la trasera.' },
    { corner: 'T6', reference: 'ligero lift', gear: '5', note: 'Flick izquierda; evita clavar demasiada dirección.' },
    { corner: 'T7', reference: 'ligero toque de freno', gear: '5', note: 'Ajusta el coche para salir bien hacia la horquilla.' },
    { corner: 'T8', reference: '100 m', gear: '2', note: 'Horquilla lenta; apex tardío y short shift a 3ª si patina.' },
    { corner: 'T9', reference: 'frena pronto', gear: '2', note: 'Empiezas frenando recto antes del apoyo; no bloquees la delantera izquierda.' },
    { corner: 'T10', reference: 'sin soltar del todo', gear: '2', note: 'Continúa la frenada en apoyo y sé progresivo al volver al gas.' },
    { corner: 'T11', reference: 'frenada suave', gear: '4', note: 'Curva de apoyo donde el coche puede insinuar sobreviraje al salir.' },
    { corner: 'T12', reference: 'plano o lift corto', gear: '6', note: 'Depende del agarre y del desgaste; colócate bien para T13.' },
    { corner: 'T13', reference: 'frenada fuerte', gear: '3', note: 'Apex tardío y salida vital para la siguiente zona DRS.' },
    { corner: 'T14', reference: '100 m', gear: '2', note: 'Empieza la última frenada; rota pronto para enderezar el coche.' },
    { corner: 'T15', reference: 'sin pausa tras T14', gear: '3', note: 'DRS detection antes del último apex; cuenta la salida a recta.' },
  ],
  miami: [
    { corner: 'T1', reference: '100 m', gear: '3', note: 'Apex tardío; no te tires demasiado dentro o matas la salida.' },
    { corner: 'T2', reference: 'sin frenar', gear: '4', note: 'Enlazada rápida; el coche premia la línea limpia.' },
    { corner: 'T3', reference: 'sin frenar', gear: '4', note: 'Evita usar demasiado el piano interior; desestabiliza fácil.' },
    { corner: 'T4', reference: 'plano', gear: '6', note: 'Primer curvón rápido del sector; volante suave y coche libre.' },
    { corner: 'T5', reference: 'plano', gear: '6', note: 'No ataques los pianos si el coche ya viene cargado.' },
    { corner: 'T6', reference: 'plano', gear: '5', note: 'Último apoyo de la secuencia antes del sector más técnico.' },
    { corner: 'T7', reference: 'frena pronto', gear: '3', note: 'Rota el coche con calma y abre dirección para preparar T8.' },
    { corner: 'T8', reference: 'frenada fuerte', gear: '2', note: 'Parte más lenta y rara del circuito; mantente pegado dentro.' },
    { corner: 'T9', reference: 'sin pausa tras T8', gear: '2', note: 'Flick inmediato a izquierdas; la tracción aquí es limitada.' },
    { corner: 'T10', reference: 'salida de T9', gear: '3', note: 'No pidas demasiado gas antes de enderezar el volante.' },
    { corner: 'T11', reference: 'justo después de 100 m', gear: '3', note: 'Frenada fuerte y clara opción de adelantamiento; cuidado con los bloqueos.' },
    { corner: 'T12', reference: 'sin frenar', gear: '5', note: 'Cambio rápido de apoyo; manda la colocación del coche.' },
    { corner: 'T13', reference: 'sin frenar', gear: '4', note: 'Ritmo de sector; una corrección aquí te penaliza toda la recta.' },
    { corner: 'T14', reference: 'entrada de curva', gear: '3', note: 'Derecha-izquierda crítica para salir bien a la recta DRS.' },
    { corner: 'T15', reference: 'frenada fuerte', gear: '2', note: 'Último punto lento; short shift si la trasera empieza a patinar.' },
  ],
  imola: [
    { corner: 'T1', reference: '100 m', gear: '4', note: 'Abraza el piano interior y cambia rápido la dirección hacia T2.' },
    { corner: 'T2', reference: 'sin pausa tras T1', gear: '4', note: 'Usa ambos pianos, pero no demasiados o pierdes estabilidad aerodinámica.' },
    { corner: 'T3', reference: 'justo antes de 50 m', gear: '4', note: 'Ataca con decisión, pero el piano interior es alto.' },
    { corner: 'T4', reference: 'sin pausa tras T3', gear: '3', note: 'Piensa en ritmo; salida limpia antes que agresividad.' },
    { corner: 'T7', reference: '50 m', gear: '2', note: 'Tosa es gran punto de adelantamiento; apex tardío y gas temprano.' },
    { corner: 'T9', reference: 'ligero lift', gear: '5', note: 'Piratella es ciega y rápida; deja margen si el coche flota.' },
    { corner: 'T11', reference: 'frenando con carga', gear: '4', note: 'Primera parte de Acque Minerali; no te subas a los pianos altos.' },
    { corner: 'T12', reference: 'segunda frenada del complejo', gear: '3', note: 'Paciencia al volver al gas, la tracción sale cara si la fuerzas.' },
    { corner: 'T14', reference: '50 m', gear: '3', note: 'Variante Alta exige atacar el primer piano y modular en el segundo.' },
    { corner: 'T15', reference: 'sin pausa tras T14', gear: '2', note: 'Si aceleras pronto, el coche patina fácil con poca ala trasera.' },
    { corner: 'T17', reference: '50 m', gear: '2', note: 'Rivazza 1 cuesta abajo; entra tarde para cuadrar Rivazza 2.' },
    { corner: 'T18', reference: 'recoloca el coche', gear: '2', note: 'Última curva real de salida; importa más la tracción que el vértice.' },
    { corner: 'T19', reference: 'plano', gear: '7', note: 'Curva a fondo en recta; abre DRS en cuanto el coche esté recto.' },
  ],
  suzuka: [
    { corner: 'T1', reference: 'justo después de 100 m', gear: '4', note: 'Entra con el coche recto y deja que la curva se abra antes de soltar freno.' },
    { corner: 'T2', reference: 'trail braking', gear: '3', note: 'La segunda parte se cierra mucho; no la sobrefrenes o pierdes salida a las Eses.' },
    { corner: 'T3-T7', reference: 'lift y toques de gas', gear: '5', note: 'Las Eses viven del flujo; mínimo ángulo de volante y no mates velocidad.' },
    { corner: 'T8', reference: 'casi plano', gear: '5', note: 'Dunlop es de compromiso; si giras tarde, te expulsa a la hierba.' },
    { corner: 'T9', reference: 'frenada ligera', gear: '5', note: 'Degner 1 es una curva de confianza, usa piano interior sin violentar el coche.' },
    { corner: 'T10', reference: 'frenada fuerte inmediata', gear: '3', note: 'Degner 2 castiga cualquier salida larga; grava esperando fuera.' },
    { corner: 'T11', reference: 'frenada fuerte cuesta arriba', gear: '2', note: 'Horquilla clara de adelantamiento; apex tardío y gas con mucha progresión.' },
    { corner: 'T12', reference: 'plano', gear: '6', note: 'Mantén lateralidad limpia para llegar colocado a Spoon.' },
    { corner: 'T13', reference: '50 m', gear: '4', note: 'Primer apex de Spoon; deja respirar el coche en mitad de curva.' },
    { corner: 'T14', reference: 'lift o ligero toque de freno', gear: '3', note: 'Segundo apex de Spoon; la tracción aquí manda toda la recta.' },
    { corner: 'T15', reference: 'plano en qualy', gear: '7', note: '130R requiere colocación perfecta; con desgaste quizá pida un lift mínimo.' },
    { corner: 'T16-T17', reference: 'justo antes de 100 m', gear: '2', note: 'La chicane final exige atacar pianos sin subirte entero; la salida decide la recta.' },
  ],
  silverstone: [
    { corner: 'T1', reference: 'gira en 50 m', gear: '7', note: 'Abbey es prácticamente a fondo; importa más el turn-in que la frenada.' },
    { corner: 'T3', reference: 'entre los dos carteles', gear: '3', note: 'Village es frenada grande; rota el coche y prepara bien T4.' },
    { corner: 'T4', reference: 'sin pausa tras T3', gear: '2', note: 'The Loop pide línea ancha y paciencia para volver al gas.' },
    { corner: 'T6', reference: 'frenada fuerte', gear: '4', note: 'Brooklands necesita apex tardío para quedar bien colocado en Luffield.' },
    { corner: 'T7', reference: 'mantén velocidad', gear: '3', note: 'Luffield es largo; no cierres dirección de más o matas la salida.' },
    { corner: 'T8', reference: 'plano', gear: '6', note: 'Woodcote se hace con el coche ya lanzado; usa toda la pista.' },
    { corner: 'T9', reference: 'toque mínimo de freno', gear: '7', note: 'Copse casi a fondo; si el coche se mueve, has entrado demasiado agresivo.' },
    { corner: 'T10-T11', reference: 'lift y cambio rápido', gear: '7', note: 'Entrada a Maggotts; evita el sausage interior para no romper la secuencia.' },
    { corner: 'T12', reference: 'sin frenar largo', gear: '6', note: 'Becketts medio; el coche debe cambiar de apoyo sin correcciones.' },
    { corner: 'T13-T14', reference: 'modula con paciencia', gear: '6', note: 'Chapel manda la salida a Hangar; si la zaga se va, pierdes media recta.' },
    { corner: 'T15', reference: 'justo antes de 50 m', gear: '6', note: 'Stowe tiene apex tardío; entra con calma y deja correr el coche.' },
    { corner: 'T16-T17', reference: 'justo después de 100 m', gear: '3', note: 'Vale y Club necesitan coche recto en la primera frenada y gas muy progresivo.' },
    { corner: 'T18', reference: 'sal de T17 recto', gear: '4', note: 'La última parte de Club cuenta por la salida a meta, no por la mínima velocidad.' },
  ],
  spa: [
    { corner: 'T1', reference: '100 m', gear: '2', note: 'La Source exige un giro temprano y limpio para salir muy recto cuesta abajo.' },
    { corner: 'T2-T4', reference: 'plano', gear: '7', note: 'Eau Rouge y Raidillon van a fondo; coloca el coche junto al muro y evita correcciones.' },
    { corner: 'T5-T7', reference: 'entre 100 m y 50 m', gear: '4', note: 'Les Combes pide trail braking y atacar el primer piano con decisión.' },
    { corner: 'T8', reference: 'coloca el coche a la izquierda', gear: '3', note: 'Malmedy es de salida; si entras pasado, arruinas la siguiente recta.' },
    { corner: 'T9', reference: 'frenada fuerte', gear: '2', note: 'Hairpin clara de adelantamiento; mantente pegado dentro y no abras gas pronto.' },
    { corner: 'T10-11', reference: 'lift mínimo', gear: '6', note: 'Speakers y el apoyo siguiente son de mucha confianza; no sobreconduzcas.' },
    { corner: 'T12-T13', reference: 'final del piano rojo', gear: '4', note: 'La chicane derecha-izquierda necesita suavidad; evita montar demasiado el piano izquierdo.' },
    { corner: 'T14-T15', reference: 'mantén momento', gear: '5', note: 'Esta secuencia vive del ritmo; perder velocidad aquí arruina todo el sector 3.' },
    { corner: 'T16-T17', reference: 'plano', gear: '7', note: 'Blanchimont es a fondo en F1; la colocación del coche importa más que el valor.' },
    { corner: 'T18-T19', reference: '100 m', gear: '2', note: 'Bus Stop en línea recta: primera frenada tardía, apex muy tardío y salida enderezada.' },
  ],
  monza: [
    { corner: 'T1', reference: 'justo después de 150 m', gear: '2', note: 'Frenada muy fuerte; modula presión y usa piano interior sin saltarlo entero.' },
    { corner: 'T2', reference: 'sin pausa tras T1', gear: '2', note: 'Flick rápido a izquierdas; short shift a la salida para no encender la trasera.' },
    { corner: 'T4-T5', reference: 'justo antes de 100 m', gear: '3', note: 'Segunda chicane rápida, pero delicada sobre sausage kerbs.' },
    { corner: 'T6', reference: 'frenada breve', gear: '4', note: 'Lesmo 1 pide entrada ancha y gas temprano; evita el piano interior.' },
    { corner: 'T7', reference: 'frenada un poco más larga', gear: '4', note: 'Lesmo 2 se decide por la tracción; salida limpia para toda la recta DRS.' },
    { corner: 'T8-T10', reference: '100 m', gear: '4', note: 'Ascari exige equilibrio sobre pianos y una salida muy limpia a fondo.' },
    { corner: 'T11', reference: '75 m', gear: '4', note: 'Parabolica con apex tardío; vuelve al gas pronto porque aquí se define la vuelta.' },
  ],
  catalunya: [
    { corner: 'T1', reference: '100 m', gear: '4', note: 'Usa algo de piano a la izquierda, frena recto y deja que el coche fluya hacia T2.' },
    { corner: 'T2', reference: 'sin pausa tras T1', gear: '5', note: 'Short shift y gas progresivo para que el coche no subvire en la salida larga.' },
    { corner: 'T3', reference: 'plano', gear: '6', note: 'Renault va a fondo; mantente dentro y abre volante poco a poco.' },
    { corner: 'T4', reference: '75 m', gear: '3', note: 'Repsol pide apex tardío y un coche asentado atrás.' },
    { corner: 'T5', reference: 'entrada limpia', gear: '3', note: 'Puedes volver al gas antes de lo que parece, pero vigila wheelspin.' },
    { corner: 'T7', reference: 'inicio del piano derecho', gear: '4', note: 'Würth no tiene carteles; manda la referencia visual del piano.' },
    { corner: 'T9', reference: 'plano o lift corto', gear: '7', note: 'Campsa depende del combustible; con carga quizá pida un toque de freno.' },
    { corner: 'T10', reference: 'ligeramente antes de 100 m', gear: '3', note: 'La Caixa necesita paciencia total al volver al gas.' },
    { corner: 'T11', reference: 'toque corto de freno', gear: '4', note: 'Banc Sabadell es de colocación para el último sector.' },
    { corner: 'T12', reference: 'coast', gear: '4', note: 'No aceleres pronto o te empuja fuera y compromete Europcar.' },
    { corner: 'T13', reference: 'plano', gear: '7', note: 'Europcar se toma usando el segundo apex correcto, no el del antiguo sector lento.' },
    { corner: 'T14', reference: 'plano o lift mínimo', gear: '6', note: 'New Holland vale por la salida a meta; mejor conservador que ancho.' },
  ],
  montreal: [
    { corner: 'T1', reference: 'marca naranja en el muro', gear: '4', note: 'Monta el piano izquierdo para dejar el coche recto hacia T2.' },
    { corner: 'T2', reference: 'sin pausa tras T1', gear: '3', note: 'Apex tardío y gas con mucha mesura; es fácil encender la trasera.' },
    { corner: 'T3-T4', reference: '50 m', gear: '4', note: 'Chicane agresiva, usa bien los pianos sin rozar el muro a la salida.' },
    { corner: 'T5', reference: 'plano', gear: '6', note: 'Curvón a fondo pegado al muro; importa la línea, no la frenada.' },
    { corner: 'T6-T7', reference: 'justo antes de 100 m', gear: '3', note: 'Gran zona de adelantamiento; frena fuerte y endereza pronto el coche.' },
    { corner: 'T8-T9', reference: 'labio del túnel o cartel previo con DRS', gear: '4', note: 'La chicane rápida cambia mucho con DRS abierto; sé conservador con el piano.' },
    { corner: 'T10', reference: '100 m', gear: '2', note: 'Hairpin lenta con apex muy tardío; toda la prioridad está en la salida.' },
    { corner: 'T13-T14', reference: 'frenada fuerte final', gear: '6', note: 'Última chicane rápida; usa piano con decisión, pero no te acerques de más al muro.' },
  ],
  spielberg: [
    { corner: 'T1', reference: '100 m', gear: '4', note: 'Niki Lauda Kurve pide gas temprano pero cuidado con el bulto del piano interior.' },
    { corner: 'T3', reference: '110 m', gear: '2', note: 'Remus es la curva más lenta; no te subas al piano del apex si quieres estabilidad.' },
    { corner: 'T4', reference: '100 m', gear: '3', note: 'Schlossgold engaña por la bajada; frena antes y sé paciente con el gas.' },
    { corner: 'T6', reference: '50 m', gear: '5', note: 'Rauch es rápida; puede valer una línea más tardía si quieres mejor salida.' },
    { corner: 'T7', reference: 'toque corto de freno', gear: '5', note: 'Würth es de ritmo y track limits; no abuses del verde exterior.' },
    { corner: 'T9', reference: '50 m', gear: '5', note: 'Rindt admite frenada tardía pese a la bajada; piano interior con decisión.' },
    { corner: 'T10', reference: 'a la altura del pit entry', gear: '4', note: 'Última curva abierta; es fácil que el coche te arrastre demasiado fuera.' },
  ],
  hungaroring: [
    { corner: 'T1', reference: 'justo después de 100 m', gear: '2', note: 'Gran frenada y mejor punto de ataque; la salida manda toda la subida.' },
    { corner: 'T2', reference: 'apex tardío', gear: '2', note: 'Off-camber y cuesta abajo; si entras pronto, sacrificas T3.' },
    { corner: 'T3', reference: 'plano', gear: '5', note: 'Rápida derechas donde el coche debe cambiar apoyo sin scrub.' },
    { corner: 'T4', reference: 'frenada ligera', gear: '5', note: 'Curva ciega y rápida; toca piano interior sin subirte encima.' },
    { corner: 'T5', reference: 'frena antes de lo que parece', gear: '4', note: 'La bajada engaña mucho; evita el piano interior para no desordenar el coche.' },
    { corner: 'T6-T7', reference: 'frenada fuerte', gear: '3', note: 'Chicane bacheada; usa el primer piano como referencia y no lances el coche en el segundo.' },
    { corner: 'T8-T9', reference: 'lift o toque corto', gear: '4', note: 'Secuencia de ritmo donde cuenta más no sobreconducir que apurar la entrada.' },
    { corner: 'T11', reference: 'frenada suave', gear: '5', note: 'Curva rápida de compromiso; el piano de salida es bacheado.' },
    { corner: 'T12', reference: 'frenada fuerte cuesta abajo', gear: '3', note: 'Apex tardío y coche estable; fácil pasarse aquí.' },
    { corner: 'T13', reference: 'frenada fuerte', gear: '2', note: 'Horquilla larga; paciencia total con el acelerador para preparar la última.' },
    { corner: 'T14', reference: 'freno tardío y suave', gear: '4', note: 'La última curva debe priorizar la velocidad de salida a la recta principal.' },
  ],
  shanghai: [
    { corner: 'T1-T3', reference: '100 m progresivo', gear: '2', note: 'Frena suave al inicio y aumenta presión mientras la espiral se cierra; la trazada ancha importa más que el último metro.' },
    { corner: 'T4', reference: 'lift o toque corto', gear: '3', note: 'Kink a izquierdas de salida; vuelve al gas pronto y usa un poco de piano exterior.' },
    { corner: 'T6', reference: 'frenada fuerte y tardía', gear: '2', note: 'Noventa grados clara; apex tardío y paciencia en tracción.' },
    { corner: 'T7', reference: 'entrada limpia', gear: '5', note: 'Curva larga de ritmo; no golpees el piano interior.' },
    { corner: 'T8', reference: 'cambio inmediato', gear: '4', note: 'Derecha más cerrada; deja que el coche cambie de apoyo sin scrub.' },
    { corner: 'T9', reference: 'frenada con apoyo', gear: '3', note: 'Usa trail braking para rotar sin matar la salida.' },
    { corner: 'T10', reference: 'sin pausa tras T9', gear: '3', note: 'Segunda derecha corta; modula gas para no encender la trasera.' },
    { corner: 'T11-T13', reference: 'apertura progresiva', gear: '4', note: 'Barrido largo donde manda la salida de T13; sacrifica medio vértice si hace falta.' },
    { corner: 'T14', reference: '100 m', gear: '2', note: 'Hairpin final muy lenta; fácil bloquear delante si llegas con demasiado sesgo.' },
    { corner: 'T16', reference: 'frenada suave girando', gear: '3', note: 'Última curva real antes de meta; evita usar demasiado piano.' },
  ],
  jeddah: [
    { corner: 'T1-T3', reference: '100 m', gear: '3', note: 'Corta bien el primer apex, abraza T2 y no pidas gas agresivo hasta tener tracción clara.' },
    { corner: 'T4-T8', reference: 'plano o casi plano', gear: '6', note: 'Secuencia de confianza entre muros; pequeñas correcciones, nunca volantazos.' },
    { corner: 'T9-T13', reference: 'ligero lift', gear: '5', note: 'Zona de ritmo; es mejor levantar un poco que frenar y romper la velocidad mínima.' },
    { corner: 'T14-T16', reference: 'toque corto en T14', gear: '6', note: 'Prepara bien la colocación para T16, que exige más apoyo y más volante.' },
    { corner: 'T17-T20', reference: 'casi plano', gear: '6', note: 'La visibilidad manda; modula gas antes si el coche empieza a moverse.' },
    { corner: 'T21-T23', reference: 'sin frenar largo', gear: '6', note: 'Último encadenado previo a la recta; usa toda la pista sin tocar el muro.' },
    { corner: 'T24', reference: 'plano', gear: '7', note: 'Curva rápida con DRS; pega el coche al muro pero sin raspar.' },
    { corner: 'T27', reference: '100 m', gear: '2', note: 'Única gran frenada real del trazado; salida crítica para toda la recta principal.' },
  ],
  monaco: [
    { corner: 'T1', reference: 'justo antes de 100 m', gear: '2', note: 'Mantente pegado a la barrera izquierda y no montes demasiado el piano interior.' },
    { corner: 'T3', reference: 'plano subida', gear: '5', note: 'Massenet es ciega y rápida; una corrección pequeña aquí te manda al muro.' },
    { corner: 'T4', reference: 'lift corto', gear: '4', note: 'Casino pide precisión absoluta junto a la barrera interior.' },
    { corner: 'T5', reference: 'justo tras la cresta', gear: '2', note: 'Mirabeau requiere mucha rotación y coche muy recogido.' },
    { corner: 'T6', reference: 'frena pronto', gear: '1', note: 'Horquilla más lenta del calendario; olvida velocidad mínima y busca soltar volante pronto.' },
    { corner: 'T8', reference: 'freno con pluma', gear: '2', note: 'Mirabeau Bas cuesta abajo; mantén el coche pegado a la derecha.' },
    { corner: 'T9', reference: 'salida limpia', gear: '3', note: 'Portier decide la entrada al túnel; tracción antes que vértice bonito.' },
    { corner: 'T10', reference: 'plano', gear: '7', note: 'Túnel a fondo; coloca el coche recto antes de la gran frenada.' },
    { corner: 'T11-T12', reference: 'justo después de 100 m', gear: '2', note: 'Nouvelle Chicane con coche comprimido; sé suave con downshifts y usa poco piano.' },
    { corner: 'T13', reference: 'ligero lift', gear: '5', note: 'Tabac sigue siendo de mucha fe; ni al muro interior ni al exterior.' },
    { corner: 'T14-T15', reference: 'dab de freno', gear: '4', note: 'Piscina rápida; ataca pianos sin saltarlos entero o la trasera rebota.' },
    { corner: 'T17', reference: 'frenada fuerte', gear: '1', note: 'Rascasse parece más abierta de lo que es; no la sobrefrenes.' },
    { corner: 'T18', reference: 'frenada corta', gear: '2', note: 'Última curva muy cerrada a muro; deja un poco de margen y abre DRS al cruzar meta.' },
  ],
  zandvoort: [
    { corner: 'T1', reference: '100 m', gear: '2', note: 'Gran frenada con apoyo; usa todo el ancho de salida, pero sin tocar la hierba artificial.' },
    { corner: 'T3', reference: 'frena recto antes del peralte', gear: '2', note: 'Hugenholtz pide línea baja; la parte alta parece tentadora y da peor salida.' },
    { corner: 'T5', reference: 'ligero lift', gear: '5', note: 'Curva de preparación para T7; no maltrates el eje delantero aquí.' },
    { corner: 'T7', reference: 'frenada suave', gear: '4', note: 'Scheivlak requiere compromiso temprano con el vértice interior.' },
    { corner: 'T8', reference: 'lift o dab', gear: '4', note: 'Izquierda rápida tras la caída; usa poco piano para no descolocar el coche.' },
    { corner: 'T9', reference: 'frenada clara', gear: '3', note: 'Parte más lenta del sector; si sales mal, arrastras la pérdida hasta la chicane.' },
    { corner: 'T10', reference: 'frenada fuerte', gear: '3', note: 'Noventa grados a derechas; entra limpio para enlazar con la chicane.' },
    { corner: 'T11-T12', reference: 'frena recto', gear: '2', note: 'Chicane lenta; ataca piano con moderación para no botar.' },
    { corner: 'T13', reference: 'casi plano', gear: '6', note: 'Kink de alineación para la última; deja el coche listo a la izquierda.' },
    { corner: 'T14', reference: 'plano o lift mínimo', gear: '7', note: 'Peralte final de confianza; línea media-baja para salir con mejor velocidad al DRS.' },
  ],
  baku: [
    { corner: 'T1', reference: 'justo antes de 100 m', gear: '2', note: 'Noventa grados a izquierdas contra muro; punto grande de adelantamiento.' },
    { corner: 'T2', reference: '75 m', gear: '2', note: 'Otra frenada corta; tracción clave para la primera zona DRS.' },
    { corner: 'T3', reference: '100 m', gear: '2', note: 'Mantente pegado a la pared izquierda y no abuses del piano interior.' },
    { corner: 'T4', reference: 'frenada ligera', gear: '2', note: 'Mis misma lógica que T3; si te abres, el muro te espera.' },
    { corner: 'T5-T6', reference: 'freno suave', gear: '3', note: 'Chicane rápida donde manda no sobre-rotar la entrada.' },
    { corner: 'T7', reference: 'frena pronto', gear: '2', note: 'Entrada al castillo; rota el coche antes y no toques el piano interior.' },
    { corner: 'T8-T11', reference: 'mínimo gas', gear: '2', note: 'Secuencia ultraestrecha cuesta arriba; guía el coche, no lo lances.' },
    { corner: 'T12-T14', reference: 'plano con confianza', gear: '4', note: 'Chicane rápida entre muros; deja correr el coche sin corregir de más.' },
    { corner: 'T15', reference: '80 m', gear: '2', note: 'Derecha delicada, cuesta abajo y off-camber; fácil subvirar al muro exterior.' },
    { corner: 'T16', reference: '100 m', gear: '3', note: 'Curva que manda toda la recta principal; sacrifica entrada si hace falta.' },
    { corner: 'T17-T20', reference: 'plano', gear: '8', note: 'Son prácticamente recta; ERS y DRS aquí, sin tocar el muro.' },
  ],
  singapore: [
    { corner: 'T1', reference: '100 m', gear: '3', note: 'Clava el primer apex y deja fluir el coche a T2 sin cortar demasiado.' },
    { corner: 'T3', reference: 'frenada corta', gear: '2', note: 'Salida importante hacia la pequeña recta; controla wheelspin.' },
    { corner: 'T4-T5', reference: 'lift breve', gear: '4', note: 'Pégate al muro interior y prepara la zona DRS con el coche recto.' },
    { corner: 'T6', reference: '75 m', gear: '2', note: 'Noventa grados de adelantamiento; frena pronto para no desordenar la zaga.' },
    { corner: 'T7-T9', reference: 'dab y frenada fuerte final', gear: '2', note: 'Secuencia de posición; T9 castiga mucho si llegas pasado.' },
    { corner: 'T10', reference: 'frenada rápida', gear: '2', note: 'Gira el coche pronto y ten cuidado con los baches del apoyo.' },
    { corner: 'T13', reference: 'frena temprano', gear: '2', note: 'Izquierda off-camber; paciencia total con el gas en la salida.' },
    { corner: 'T14', reference: 'justo después de 100 m', gear: '2', note: 'Otra frenada grande; usa poco piano y sal lo más recto posible.' },
    { corner: 'T15-T17', reference: 'freno suave y precisión', gear: '3', note: 'Bajo el paso cubierto no conviene tocar sausage kerbs ni liberar gas de golpe.' },
    { corner: 'T18', reference: 'frena pronto', gear: '3', note: 'Zona deslizante bajo la grada y el puente; el coche se aligera.' },
    { corner: 'T19-T21', reference: 'frenada ligera', gear: '3', note: 'Último bloque rítmico; muros cerca y salida casi a fondo hacia meta.' },
  ],
  cota: [
    { corner: 'T1', reference: '100 m', gear: '1', note: 'Subida ciega; apunta pronto al apex y no abras gas hasta que el coche se asiente.' },
    { corner: 'T2-T6', reference: 'plano con lifts puntuales', gear: '6', note: 'Eses de mucho ritmo; si fallas un apex, arrastras el error toda la secuencia.' },
    { corner: 'T7-T9', reference: 'lift y cambios rápidos', gear: '5', note: 'El coche debe seguir la dirección sin scrub; prima el flow.' },
    { corner: 'T11', reference: '100 m', gear: '1', note: 'Horquilla lenta que abre la recta larga; tracción por encima de todo.' },
    { corner: 'T12', reference: '100 m', gear: '2', note: 'Gran punto de adelantamiento; no te fíes de la escapatoria y no llegues pasado.' },
    { corner: 'T13-T15', reference: 'freno suave y rotación', gear: '2', note: 'Complejo lento de estadio; usa poco piano y vuelve al gas con calma.' },
    { corner: 'T16', reference: 'entrada amplia', gear: '3', note: 'Doble apex largo a izquierdas; puedes jugar con la línea, pero sin castigar traseras.' },
    { corner: 'T17-T18', reference: 'lift de entrada', gear: '5', note: 'Derecha triple ápice de mucha carga; estabilidad y paciencia en el gas.' },
    { corner: 'T19', reference: 'freno corto', gear: '4', note: 'Izquierda media donde es fácil exceder track limits.' },
    { corner: 'T20', reference: '75 m', gear: '2', note: 'Última curva; salida decisiva y DRS inmediato.' },
  ],
  mexico: [
    { corner: 'T1', reference: '100 m', gear: '2', note: 'Llegas con mucha velocidad y poca carga real por altitud; no gires brusco o bloqueas.' },
    { corner: 'T2-T3', reference: 'short shift y paciencia', gear: '2', note: 'Flick rápido seguido de derecha lenta; no mates el impulso antes del DRS.' },
    { corner: 'T4-T6', reference: '100 m en T4', gear: '2', note: 'Complejo de ritmo donde T6 pide trail braking y buena salida.' },
    { corner: 'T7-T8', reference: 'ligero lift', gear: '4', note: 'Eses medias; el coche debe sentirse plantado o perderás toda la secuencia.' },
    { corner: 'T10-T11', reference: 'plano en TT / limpio en carrera', gear: '5', note: 'Últimos apoyos rápidos antes del estadio; prioriza colocación para la recta corta.' },
    { corner: 'T12', reference: 'frenada fuerte', gear: '2', note: 'Entrada al estadio; parece abierta pero la visión engaña y castiga la salida.' },
    { corner: 'T13-T15', reference: 'mínimo gas y short shift', gear: '1', note: 'Bloque más lento del circuito; evita saltar al acelerador sobre el bache.' },
    { corner: 'T16-T17', reference: 'salida progresiva', gear: '3', note: 'Doble apex final a derechas; abre gas pronto y deja correr el coche hasta meta.' },
  ],
  interlagos: [
    { corner: 'T1', reference: 'justo después de 100 m', gear: '2', note: 'Frenada en bajada y apoyo; sé suave o bloquearás muy fácil.' },
    { corner: 'T2-T3', reference: 'sin pausa tras T1', gear: '3', note: 'La salida de Curva do Sol decide toda la recta con DRS.' },
    { corner: 'T4', reference: 'justo después de 100 m', gear: '3', note: 'Descenso a izquierdas claro para adelantar; no te pases porque pierdes el sector.' },
    { corner: 'T6', reference: 'freno ligero', gear: '4', note: 'Curva larga de apoyo; entra ancho y vuelve al vértice abajo.' },
    { corner: 'T8', reference: 'frenada corta', gear: '2', note: 'Izquierda lenta donde manda la rotación, no el ataque.' },
    { corner: 'T10', reference: 'frena pronto', gear: '2', note: 'Hairpin a derechas con tracción muy delicada al salir.' },
    { corner: 'T11', reference: 'frenada fuerte', gear: '1', note: 'Izquierda muy lenta y algo off-camber; short shift a la salida.' },
    { corner: 'T12', reference: 'freno suave', gear: '3', note: 'Derecha en bajada; no te lances o llegas mal a Juncao.' },
    { corner: 'T13', reference: '50 m', gear: '3', note: 'Juncao es la curva clave; salida limpia para toda la subida y la recta.' },
    { corner: 'T14-T15', reference: 'plano', gear: '8', note: 'Kinks de subida a fondo; abre DRS y convierte ERS aquí.' },
  ],
  vegas: [
    { corner: 'T1-T3', reference: '100 m en T1', gear: '2', note: 'Bloque inicial de baja velocidad; si recalientas traseras aquí, arrastras el problema media vuelta.' },
    { corner: 'T4-T7', reference: 'entrada media y limpia', gear: '3', note: 'Flicks de sector 1; evita los pianos agresivos y deja el coche estable.' },
    { corner: 'T9-T11', reference: 'frenada fuerte previa', gear: '2', note: 'Chicane delicada de acceso al Strip; tocar sausage kerbs te lanza al muro.' },
    { corner: 'T12', reference: 'frenada máxima al final del Strip', gear: '2', note: 'Gran punto de adelantamiento tras más de 330 km/h; fácil bloquear o subvirar.' },
    { corner: 'T13-T14', reference: 'cambio de apoyo fluido', gear: '3', note: 'Zona estrecha donde el coche tiene que girar sin apoyarse demasiado en los pianos.' },
    { corner: 'T15-T16', reference: 'frenada estable', gear: '2', note: 'Combo lento antes de la última; si entras agresivo pierdes toda la tracción final.' },
    { corner: 'T17', reference: 'salida progresiva', gear: '3', note: 'Última izquierda algo abierta; la prioridad es salir limpio al DRS.' },
  ],
  lusail: [
    { corner: 'T1', reference: '100 m', gear: '4', note: 'Izquierda rápida de apex tardío; usa toda la pista de salida para mantener momento.' },
    { corner: 'T2-T3', reference: 'plano o lift mínimo', gear: '5', note: 'Curvas fluidas donde lo peor es sobreconducir y calentar neumático.' },
    { corner: 'T4', reference: 'freno suave', gear: '4', note: 'Kink rápido aparentemente menor, pero crítico para no perder velocidad.' },
    { corner: 'T5-T6', reference: 'ligero toque antes de T5', gear: '5', note: 'Doble apex muy sensible al balance; si el coche subvira, rompes toda la línea.' },
    { corner: 'T7-T9', reference: 'plano en T7 y frenada ligera en T8', gear: '4', note: 'Pequeño bloque de dirección rápida; cualquier sobreviraje mata el impulso.' },
    { corner: 'T11', reference: 'frenada breve', gear: '4', note: 'Derecha rápida con límites ajustados; mantén velocidad mínima sin mover la zaga.' },
    { corner: 'T12-T13', reference: 'casi plano y lift', gear: '5', note: 'Parte más rápida del circuito; T13 pide mucha confianza aerodinámica.' },
    { corner: 'T14', reference: 'freno suave', gear: '4', note: 'Derecha media donde hay que salir muy ordenado para la última frenada.' },
    { corner: 'T15', reference: '75 m', gear: '3', note: 'Late-braking corner que se abre; paciencia con el gas para no irte largo.' },
    { corner: 'T16', reference: '100 m', gear: '4', note: 'Última derecha; salida enorme a recta y DRS inmediato.' },
  ],
  yasmarina: [
    { corner: 'T1', reference: 'justo antes de 100 m', gear: '4', note: 'Apex que se cierra; salida limpia para el pequeño lanzamiento siguiente.' },
    { corner: 'T2-T4', reference: 'plano con lift en T3', gear: '6', note: 'Bloque rápido inicial donde importa la colocación para la gran frenada de T5.' },
    { corner: 'T5', reference: '100 m', gear: '2', note: 'Izquierda lenta que abre la primera recta DRS; evita atacar demasiado el piano.' },
    { corner: 'T6', reference: 'late apex', gear: '2', note: 'Hairpin abierta; toda la prioridad está en la salida a la recta más larga.' },
    { corner: 'T9', reference: '100 m', gear: '2', note: 'Segundo gran punto de adelantamiento; frena recto y no te subas a los pianos duros.' },
    { corner: 'T10', reference: 'plano', gear: '7', note: 'Kink rápido de colocación; buen sitio para gestionar ERS.' },
    { corner: 'T11', reference: 'frena pronto', gear: '3', note: 'Curva peraltada larga a izquierdas; deja que el banking te ayude a rotar.' },
    { corner: 'T12', reference: 'ritmo y apoyo', gear: '4', note: 'Secuencia rápida a derechas donde vale más no arrastrar rueda delantera.' },
    { corner: 'T13', reference: 'frenada corta', gear: '3', note: 'Esquina breve y técnica; no la sobrefrenes.' },
    { corner: 'T14-T16', reference: 'frena pronto en T14', gear: '2', note: 'Último bloque bajo el hotel; controla bien el cambio de dirección y la salida final.' },
  ],
};

const curatedEngineerNotes: Partial<Record<TrackId, EngineerNotes>> = {
  melbourne: makeEngineerNotes(
    'T1 y T3 usan 100 m como referencia clara; en T9-T10 la frenada cae al 50 m y exige precisión.',
    'T9-T10 y la salida de T11-T12 condicionan buena parte de la velocidad punta en las dos zonas DRS.',
    'Gasta ERS al salir de T15 y protege batería para el segundo y tercer sector, donde hay recta real para convertirla.',
    'Las traseras se encienden rápido en T3 y T13 si pides gas con volante todavía cruzado.',
    'T1 y T3 son los puntos más limpios si llegas bien colocado en DRS.',
    'Entrar brusco en T4-T5 o pasarte en T12 rompe completamente el ritmo del tercer sector.',
  ),
  bahrain: makeEngineerNotes(
    'T1, T4, T8 y T14 tienen referencia sólida en 100 m; T9-T10 requiere frenar antes de lo que pide la vista.',
    'T9-T10 es la secuencia clave: si bloqueas delante, pierdes toda la recta hacia T11.',
    'Usa ERS a la salida de T10 y T15; ahí conviertes de verdad la tracción en tiempo.',
    'Bahrain castiga mucho las traseras; short shift en T8 y al salir de T10 si empiezas a patinar.',
    'T1 y T4 son las maniobras principales; T14 funciona si preparas bien el run anterior.',
    'Un coche demasiado agresivo de diferencial te da una vuelta buena y una carrera muy mala aquí.',
  ),
  miami: makeEngineerNotes(
    'T1 y T11 son las referencias grandes con 100 m; en T7-T9 importa más frenar pronto y rotar que clavar el último metro.',
    'El complejo T8-T10 y la salida de T14-T15 son donde más tiempo se regala si fuerzas la entrada.',
    'Guarda ERS para la recta de atrás y la principal; el resto del trazado está más limitado por tracción que por potencia.',
    'Las salidas lentas del estadio castigan la goma trasera; si patina, sube marcha antes y abre manos.',
    'T11 es el adelantamiento de libro; T1 funciona si llegas bien colocado desde meta.',
    'Atacar pianos en T2-T3 o T14-T15 como si fuese un circuito permanente suele desordenar el coche de más.',
  ),
  imola: makeEngineerNotes(
    'T1-T2 tienen 100 m; T3-T4, T7 y Variante Alta bajan al entorno de 50 m y exigen coche recto antes de atacar piano.',
    'Tosa, Acque Minerali y Rivazza mandan la vuelta; son las tres zonas donde un error cuesta una recta completa.',
    'ERS vale más en meta y tras Rivazza; el resto del circuito está lleno de apoyo y cambios de rasante.',
    'Los pianos altos de Imola castigan una suspensión seca; si rebota, pierdes tracción durante medio sector.',
    'Tosa es la opción clara; una maniobra secundaria puede salir en la llegada a Rivazza si el otro sale mal de Variante Alta.',
    'Rivazza mal hecha te hace perder desde la salida hasta la línea; no sacrifiques salida por entrar dos km/h más rápido.',
  ),
  suzuka: makeEngineerNotes(
    'T1 cae justo después de 100 m y la chicane final vuelve a pedir esa referencia; el resto va más de lift y ritmo que de frenadas grandes.',
    'Las Eses y Spoon mandan la vuelta; si el coche no cambia apoyo limpio, no hay vuelta rápida posible.',
    'ERS merece la pena desde Spoon hasta 130R y en la salida de la chicane; en el primer sector no lo conviertes igual.',
    'Suzuka castiga delantero y también la tracción al salir de Spoon y horquilla; sé progresivo con gas.',
    'La horquilla T11 y la chicane final son los dos puntos realistas de ataque.',
    'Querer ganar tiempo forzando las Eses suele hacerte perder desde T3 hasta Degner 2.',
  ),
  silverstone: makeEngineerNotes(
    'Solo hay dos frenadas grandes de verdad, pero Copse, Maggotts y Stowe exigen referencias muy finas de lift y colocación.',
    'Copse, Becketts y Chapel deciden la vuelta; una corrección en mitad de apoyo se paga durante varios segundos.',
    'ERS vale sobre todo desde Chapel hacia Hangar y a la salida de Club; el resto del tiempo manda la carga aerodinámica.',
    'El lateral delantero sufre mucho; no conviertas las curvas rápidas en una pelea de dirección.',
    'Stowe y Village son los sitios donde se puede terminar una maniobra con sentido.',
    'Con poco ala trasera el coche parece rápido en recta, pero te castiga mucho más de lo que compensa en sector 2.',
  ),
  spa: makeEngineerNotes(
    'La Source y Bus Stop tienen 100 m claros; Les Combes cae entre 100 y 50 m y pide trail braking real.',
    'Raidillon, Pouhon y la secuencia previa a Blanchimont viven de momento y colocación, no de frenar tarde.',
    'ERS se convierte muy bien desde La Source y desde Stavelot; no lo gastes donde el coche ya va cargado por apoyo.',
    'Spa castiga mucho cuando abres gas pronto en la hairpin y en la salida de Bus Stop.',
    'La Source, Les Combes y Bus Stop son las tres zonas de adelantamiento útiles.',
    'Perder velocidad en la salida de La Source o en la secuencia T14-T15 te arruina sectores enteros, no solo una curva.',
  ),
  monza: makeEngineerNotes(
    'Monza sí tiene referencias claras: 150 m en T1, 100 m en la segunda chicane y Ascari, y 75 m en Parabolica.',
    'Las dos Lesmo y, sobre todo, la salida de Ascari mandan la vuelta porque alimentan las rectas largas.',
    'ERS se usa en las rectas grandes; aquí no tiene sentido vaciar batería en sitios donde aún estás limitado por tracción.',
    'La trasera se va fácil en salidas lentas con poca ala; short shift es más rentable que patinar bonito.',
    'T1 es la maniobra principal; la segunda chicane también sirve si el otro llega desordenado.',
    'Subirte demasiado a los pianos de chicanes y Ascari te da más inestabilidad que tiempo real.',
  ),
  catalunya: makeEngineerNotes(
    'T1 está en 100 m, Repsol cae a 75 m y Würth usa el inicio del piano derecho como referencia visual clara.',
    'Renault, Campsa y la secuencia La Caixa-Banc Sabadell son donde el balance del coche se nota de verdad.',
    'ERS vale mucho en meta y en la salida de La Caixa; en curvas largas manda más el apoyo que la potencia.',
    'Barcelona castiga mucho el neumático delantero si intentas girar demasiado el coche en apoyo largo.',
    'T1 y La Caixa son los puntos más lógicos de adelantamiento.',
    'El error típico es acelerar demasiado pronto en La Caixa o tomar el apex equivocado en Europcar.',
  ),
  montreal: makeEngineerNotes(
    'Montreal mezcla referencias fijas con visuales: muro naranja en T1, 50 m en T3 y 100 m en T6 y la horquilla.',
    'T6-T7, la horquilla y la última chicane mandan la vuelta porque alimentan las dos rectas grandes.',
    'ERS hay que convertirlo en las rectas; no tiene sentido vaciarlo donde el coche aún va botando sobre piano.',
    'Las traseras sufren muchísimo en T2 y T10 si pides gas con el volante aún cerrado.',
    'T6, T10 y la última chicane son las maniobras de verdad.',
    'Cortar demasiado piano o acercarte de más al Wall of Champions es perder una vuelta o una carrera entera.',
  ),
  spielberg: makeEngineerNotes(
    'Austria tiene marcas muy claras: 100 m en T1, 110 m en Remus, 100 m en Schlossgold y 50 m en Rauch y Rindt.',
    'T3 y T4 deciden media vuelta; si sales mal, vas a la defensiva durante todo el siguiente sector.',
    'ERS se usa sobre todo cuesta arriba a T3 y en la salida de T10 hacia meta.',
    'La tracción en Austria castiga mucho porque hay muchas salidas lentas o semi-lentas en pendiente.',
    'T3 y T4 son las mejores zonas; T1 también funciona si llegas muy bien en rebufo.',
    'El gran riesgo aquí no es solo el trompo, son los track limits; no conviertas la última curva en una lotería.',
  ),
  hungaroring: makeEngineerNotes(
    'Hungaroring mezcla T1 muy clara tras 100 m con muchas curvas de compromiso donde manda más el timing que la distancia.',
    'T2, la chicane y T12-T14 son las partes donde más tiempo se pierde por precipitarse.',
    'ERS casi todo merece la pena en meta; fuera de ahí cuesta mucho convertirlo porque siempre vas girando.',
    'Es un circuito que castiga la goma delantera y la tracción al salir de la horquilla larga del final.',
    'T1 sigue siendo la mejor opción de adelantamiento con bastante diferencia.',
    'El error más caro es querer atacar demasiado la chicane y salir mal colocado para toda la secuencia siguiente.',
  ),
  shanghai: makeEngineerNotes(
    'Shanghai arranca con una referencia real en 100 m, pero la dificultad está en aumentar presión mientras T1-T3 se cierra hasta 2ª.',
    'La salida de T13 y la hairpin de T14 son los dos puntos que más tiempo mueven en toda la vuelta.',
    'Guarda ERS para la recta trasera; es donde más lo conviertes y donde más se defiende o ataca.',
    'El gran desgaste aquí no viene solo del freno, viene de pedir gas demasiado pronto en la espiral y en la hairpin.',
    'T14 es la maniobra principal; T6 también puede abrirse si el otro sale mal de T4.',
    'El error típico es entrar demasiado rápido a T1-T3 y pasar tres curvas enteras peleando contra el subviraje.',
  ),
  jeddah: makeEngineerNotes(
    'Jeddah solo tiene dos frenadas grandes de verdad, T1 y T27; el resto se gana con lifts milimétricos y colocación entre muros.',
    'T17-T24 es donde más confianza necesitas; si el coche se mueve ahí, no hay vuelta.',
    'ERS se usa sobre todo en la recta final y en el gran tramo DRS previo a T24.',
    'La trasera tiende a calentarse si corriges mucho en las curvas ciegas rápidas; mejor levantar antes que salvar tarde.',
    'T1 y T27 son las opciones reales; fuera de ahí casi todo depende del error rival.',
    'El fallo más caro es tocar un muro interior en zona rápida y perder toda la secuencia, no solo una curva.',
  ),
  monaco: makeEngineerNotes(
    'Monaco sí tiene puntos claros: T1 antes de 100 m, la chicane tras túnel después de 100 m y Rascasse como frenada grande a 1ª.',
    'Portier, la chicane y la salida de Anthony Noghès mandan más tiempo del que parece porque conectan las pocas rectas reales.',
    'ERS solo merece la pena en túnel y recta principal; en el resto del circuito manda más la tracción y la confianza.',
    'Con depósito lleno, cualquier agresividad extra en 1ª y 2ª marcha sobrecalienta traseras muy rápido.',
    'T1 y la Nouvelle Chicane son las únicas maniobras que tienen sentido sin regalo del rival.',
    'El error clásico es intentar hacer girar el coche con freno dentro del hairpin y Rascasse como si hubiese escapatoria.',
  ),
  zandvoort: makeEngineerNotes(
    'Las referencias fuertes están en T1 y la chicane; el resto del tiempo Zandvoort se conduce más por apoyo y peralte que por gran frenada.',
    'Hugenholtz, Scheivlak y la curva final peraltada son donde se define la vuelta.',
    'ERS vale de verdad saliendo de la última curva hacia meta; el resto del trazado está demasiado condicionado por apoyo.',
    'El neumático delantero sufre si insistes en la línea alta de los peraltes o giras de más en las rápidas.',
    'T1 sigue siendo la maniobra clara con DRS.',
    'El gran error aquí es querer usar demasiado piano en la chicane o entrar alto a T3 y quedarte sin salida.',
  ),
  baku: makeEngineerNotes(
    'Baku mezcla referencias muy claras de 100 m y 75 m con una zona de castillo donde la distancia importa menos que colocar el coche recto.',
    'T15 y, sobre todo, T16 deciden toda la recta más larga del campeonato.',
    'ERS se reserva para la recta principal y para defender o atacar en la primera zona DRS.',
    'Con poca ala, las salidas de 2ª marcha en T2, T3 y T15 castigan muchísimo la trasera.',
    'T1 es la maniobra principal; T3 también existe si sales mejor de T2.',
    'El error grande es llegar al castillo aún queriendo ganar tiempo; allí primero sobrevives y luego aceleras.',
  ),
  singapore: makeEngineerNotes(
    'Singapur sí tiene varias referencias fijas, como 100 m en T1 y T14 y 75 m en T6, pero se gana con disciplina más que con valentía.',
    'T6, T13 y el bloque final T19-T21 mandan la vuelta porque son las zonas donde más fácil es romper la tracción.',
    'ERS compensa en la recta corta tras T5 y en la zona principal de meta; fuera de ahí no convierte tanto.',
    'El calor y la baja velocidad castigan mucho la goma trasera; cualquier wheelspin se multiplica en carrera.',
    'T6 y T14 son los puntos razonables de adelantamiento con ayuda de DRS.',
    'El error típico es atacar demasiado los sausage kerbs del paso inferior y perder el coche contra el muro.',
  ),
  cota: makeEngineerNotes(
    'COTA mezcla dos grandes 100 m en T1, T11 y T12 con muchos apoyos donde manda el ritmo más que la frenada final.',
    'La subida a T1, la salida de T11 y la última curva T20 son las tres zonas que más condicionan el tiempo total.',
    'ERS vale sobre todo desde T11 por toda la recta larga y al salir de T20 hacia meta.',
    'Las delanteras sufren mucho en las eses del primer sector si corriges de más o persigues cada piano.',
    'T12 y T1 son los mejores puntos; T11 abre opción si el rival sale mal del sector 1.',
    'El error clásico es entrar demasiado pasado a T12 y arruinar el estadio entero intentando recuperar ahí mismo.',
  ),
  mexico: makeEngineerNotes(
    'En México las referencias grandes vuelven a ser 100 m en T1 y T4, pero la altitud hace que el coche parezca tener menos carga de la que esperas.',
    'T3, T6 y todo el estadio T12-T16 son donde más vuelta regalas si no priorizas salida.',
    'ERS se convierte muy bien en la recta principal y hacia T4; también es buen sitio para recargar antes del estadio.',
    'La tracción en 1ª y 2ª dentro del estadio es crítica; short shift vale más que una salida espectacular a una sola vuelta.',
    'T1 es el adelantamiento principal y T4 funciona si llegas bien emparejado.',
    'El error típico es bajar demasiado ala por las rectas y terminar sin apoyo ni confianza en las eses y el estadio.',
  ),
  interlagos: makeEngineerNotes(
    'Interlagos tiene dos referencias limpias tras 100 m en T1 y T4, y un 50 m decisivo en Juncao.',
    'La salida de Curva do Sol y, sobre todo, Juncao mandan toda la vuelta porque alimentan las dos rectas largas con DRS.',
    'ERS se usa saliendo de Juncao y por la subida hasta meta; es donde más renta.',
    'Al ser antihorario, la fatiga del delantero y la tracción en las hairpins del sector 2 se notan antes de lo que parece.',
    'T1 y T4 son los dos puntos buenos de adelantamiento.',
    'El error más caro es frenar demasiado tarde en T4 o salir mal de Juncao e ir vendido toda la subida.',
  ),
  vegas: makeEngineerNotes(
    'Las Vegas tiene frenadas muy claras por distancia, pero la clave real es la estabilidad con gomas frías y poco apoyo.',
    'La salida de la chicane previa al Strip y la última curva T17 son las dos zonas que más velocidad gratis dan o quitan.',
    'ERS se gasta en el Strip y en la recta principal; fuera de ahí casi todo está limitado por frenada y tracción.',
    'El warm-up aquí importa más que en otros circuitos; las traseras frías castigan mucho las salidas de 2ª.',
    'T12 es la maniobra principal y T1 también funciona con rebufo.',
    'El error típico es conducir la chicane de acceso al Strip como si hubiese escapatoria: tocar sausage kerb aquí suele terminar mal.',
  ),
  lusail: makeEngineerNotes(
    'Lusail casi no se gana frenando tardísimo; se gana manteniendo velocidad mínima y usando bien las pocas referencias reales, como 100 m en T1 y T16 y 75 m en T15.',
    'T5-T6, T12-T13 y la salida de T16 son las partes que más delatan si el coche está equilibrado.',
    'ERS casi todo merece la pena en meta; el resto del circuito castiga más por apoyo y neumático que por falta de potencia.',
    'Es un trazado muy duro para las gomas: cualquier volante de más en curvas largas se paga varias vueltas.',
    'T1 es la maniobra principal; T15 puede abrirse si el rival sale peor de T14.',
    'El error más caro es pelear contra el coche en las rápidas y llegar a la última frenada con el neumático ya cocido.',
  ),
  yasmarina: makeEngineerNotes(
    'Yas Marina concentra las frenadas reales en T1, T5, T6 y T9, todas con referencias bastante claras alrededor de 100 m.',
    'Las salidas de T6 y T9 y el último bloque bajo el hotel son donde realmente se hace el tiempo.',
    'ERS se convierte en ambas rectas DRS; fuera de ahí puede compensar más guardar batería y coche estable.',
    'La tracción a baja velocidad sigue siendo crítica aquí, sobre todo con depósito lleno en T6 y en la salida final.',
    'T5/T6 y T9 son las zonas lógicas para adelantar.',
    'El error clásico es sobreconducir el peralte de T11 o la secuencia final y llegar sin salida a la recta principal.',
  ),
};

const angleDelta = (previous: TrackPoint, current: TrackPoint, next: TrackPoint) => {
  const incoming = Math.atan2(current.y - previous.y, current.x - previous.x);
  const outgoing = Math.atan2(next.y - current.y, next.x - current.x);
  let delta = Math.abs(outgoing - incoming);
  if (delta > Math.PI) delta = Math.PI * 2 - delta;
  return delta;
};

const makeMap = (shapeId: keyof typeof shapes, corners: number, drsZones: number): TrackMap => {
  const shape = shapes[shapeId];
  const closedPoints = [...shape.points, shape.points[0]];
  const segmentLengths = closedPoints.slice(0, -1).map((point, index) => {
    const next = closedPoints[index + 1];
    return Math.hypot(next.x - point.x, next.y - point.y);
  });
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);

  const pointAt = (progress: number): TrackPoint => {
    let distance = progress * totalLength;

    for (let index = 0; index < segmentLengths.length; index += 1) {
      const segment = segmentLengths[index];
      if (distance <= segment) {
        const start = closedPoints[index];
        const end = closedPoints[index + 1];
        const ratio = segment === 0 ? 0 : distance / segment;
        return {
          x: Math.round(start.x + (end.x - start.x) * ratio),
          y: Math.round(start.y + (end.y - start.y) * ratio),
        };
      }
      distance -= segment;
    }

    return shape.points[0];
  };

  const cornerCandidates = shape.points
    .slice(1, -1)
    .map((point, index) => {
      const realIndex = index + 1;
      const previous = shape.points[Math.max(realIndex - 4, 0)];
      const next = shape.points[Math.min(realIndex + 4, shape.points.length - 1)];
      const progress = realIndex / shape.points.length;
      return { point, progress, score: angleDelta(previous, point, next) };
    })
    .filter((candidate) => candidate.score > 0.16)
    .sort((a, b) => b.score - a.score);

  const clustered: typeof cornerCandidates = [];
  for (const candidate of cornerCandidates) {
    if (clustered.every((corner) => Math.abs(corner.progress - candidate.progress) > 0.025)) {
      clustered.push(candidate);
    }
    if (clustered.length >= corners) break;
  }

  const selected = clustered
    .sort((a, b) => a.progress - b.progress)
    .map((candidate, index) => ({ ...candidate.point, label: String(index + 1).padStart(2, '0') }));

  while (selected.length < corners) {
    const point = pointAt(selected.length / corners);
    selected.push({ ...point, label: String(selected.length + 1).padStart(2, '0') });
  }

  return {
    viewBox: '0 0 700 430',
    path: `M ${shape.points.map((point) => `${point.x} ${point.y}`).join(' L ')} Z`,
    sourceName: shape.sourceName,
    start: shape.points[0],
    corners: selected,
    drs: Array.from({ length: drsZones }, (_, index) => {
      const progress = [0.1, 0.42, 0.68, 0.84][index] ?? index / Math.max(drsZones, 1);
      const start = pointAt(progress);
      const end = pointAt(Math.min(progress + 0.08, 0.98));
      return { x1: start.x, y1: start.y, x2: end.x, y2: end.y, label: `DRS ${index + 1}` };
    }),
    speedTrap: pointAt(0.62),
  };
};

const brakingReferencesByFamily: Record<Track['setupFamily'], string[]> = {
  power: ['150 m', '120 m', '100 m', '75 m', '50 m'],
  balanced: ['125 m', '100 m', '90 m', '75 m', '60 m'],
  downforce: ['110 m', '90 m', '75 m', '60 m', '50 m'],
  street: ['150 m', '125 m', '100 m', '80 m', '60 m'],
  technical: ['120 m', '100 m', '85 m', '70 m', '55 m'],
};

const makeBrakingGuide = (track: Pick<Track, 'profile' | 'setupFamily'>, map: TrackMap): BrakingReference[] => {
  const references = brakingReferencesByFamily[track.setupFamily];
  const heavyEvery = track.profile.braking > 82 ? 2 : track.profile.braking > 70 ? 3 : 4;

  return map.corners.map((corner, index) => {
    const turn = index + 1;
    const isHeavy = turn === 1 || turn % heavyEvery === 0;
    const isFast = track.profile.downforce > 72 && turn % 3 === 0;
    const reference = isHeavy ? references[0] : isFast ? references[4] : references[(index + Math.round(track.profile.traction / 20)) % references.length];
    const gear = isHeavy
      ? 2
      : isFast
        ? 5
        : track.setupFamily === 'street'
          ? 3
          : track.setupFamily === 'power'
            ? 3
            : track.setupFamily === 'downforce'
              ? 4
              : 4;
    const note = isHeavy
      ? 'Frena recto, baja presion al girar y prioriza salida.'
      : isFast
        ? 'Levanta antes de girar; evita corregir en apoyo.'
        : 'Trail braking corto para rotar sin bloquear delante.';

    return {
      corner: `T${turn}`,
      reference,
      gear: `${gear}`,
      note,
    };
  });
};

const hasDistanceOrVisualReference = (reference: string) =>
  /\d+\s*m/.test(reference.toLowerCase()) ||
  [
    'cartel',
    'marca',
    'muro',
    'piano',
    'pit entry',
    'túnel',
    'tunel',
    'cresta',
    'puente',
    'grada',
    'hotel',
    'labio',
    'drs',
    'recta',
  ].some((token) => reference.toLowerCase().includes(token));

const approximateBrakePoint = (reference: string, family: Track['setupFamily']) => {
  const text = reference.toLowerCase();

  if (text.includes('fuerte') || text.includes('máxima') || text.includes('maxima')) {
    return family === 'street' || family === 'power' ? '100 m aprox.' : '90 m aprox.';
  }
  if (text.includes('pronto') || text.includes('temprano')) {
    return family === 'street' ? '120 m aprox.' : '100 m aprox.';
  }
  if (text.includes('suave') || text.includes('ligera') || text.includes('breve') || text.includes('corta')) {
    return family === 'street' ? '75 m aprox.' : '60 m aprox.';
  }
  if (text.includes('toque') || text.includes('dab') || text.includes('trail') || text.includes('coast')) {
    return '50 m aprox.';
  }

  return family === 'street' ? '80 m aprox.' : '70 m aprox.';
};

const normalizeBrakingReference = (entry: BrakingReference, family: Track['setupFamily']): BrakingReference => {
  const reference = entry.reference.trim();
  const text = reference.toLowerCase();

  if (hasDistanceOrVisualReference(reference)) {
    return entry;
  }

  if (text.includes('plano') || text.includes('sin frenar')) {
    return {
      ...entry,
      reference: `${reference}; gira al inicio del piano`,
    };
  }

  if (text.includes('sin pausa')) {
    return {
      ...entry,
      reference: `${reference}; cambia al piano siguiente`,
    };
  }

  if (text.includes('lift')) {
    return {
      ...entry,
      reference: `${reference} al inicio del piano`,
    };
  }

  if (
    text.includes('fren') ||
    text.includes('freno') ||
    text.includes('toque') ||
    text.includes('dab') ||
    text.includes('trail') ||
    text.includes('coast')
  ) {
    return {
      ...entry,
      reference: `${approximateBrakePoint(reference, family)} (${reference})`,
    };
  }

  return {
    ...entry,
    reference: `inicio del piano de entrada (${reference})`,
  };
};

const makeTrack = (
  id: TrackId,
  name: string,
  shortName: string,
  country: string,
  flag: string,
  lengthKm: number,
  laps: number,
  corners: number,
  drsZones: number,
  difficulty: Track['difficulty'],
  setupFamily: Track['setupFamily'],
  profile: Track['profile'],
  sectorFocus: [string, string, string],
  summary: string,
  notes: EngineerNotes,
): Track => {
  const baseTrack = {
    id,
    name,
    shortName,
    country,
    flag,
    lengthKm,
    laps,
    corners,
    drsZones,
    difficulty,
    setupFamily,
    profile,
    sectorFocus,
    summary,
    map: makeMap(id, corners, drsZones),
    records: sortRecords(realReferenceTimes[id] ?? pendingRecords(name)),
    gameLaps: f1LapsGameTimes[id] ?? pendingGameLaps(name),
    engineer: curatedEngineerNotes[id] ?? notes,
  } satisfies Omit<Track, 'brakingGuide'>;

  const brakingGuide = (curatedBrakingGuides[id] ?? makeBrakingGuide(baseTrack, baseTrack.map)).map((entry) =>
    normalizeBrakingReference(entry, setupFamily),
  );

  return {
    ...baseTrack,
    brakingGuide,
  };
};

export const tracks: Track[] = [
  makeTrack('melbourne', 'Melbourne Grand Prix Circuit', 'Australia', 'Australia', '🇦🇺', 5.278, 58, 16, 4, 'Media', 'balanced', { downforce: 68, tireStress: 58, braking: 66, traction: 62, curbUse: 74 }, ['Cambios rapidos', 'Traccion media', 'Salida a recta DRS'], 'Circuito fluido y sensible al ritmo: el coche debe rotar bien sin perder estabilidad en cambios de direccion.', makeEngineerNotes('Frena con margen en T1 y T3; el bloqueo delantero aparece si giras pronto.', 'T11-T12 decide gran parte de la vuelta, evita tocar demasiado piano interior.', 'Activa ERS fuerte al salir de la ultima curva y en la recta principal.', 'Delantero izquierdo sufre si atacas las enlazadas con volante cerrado.', 'T1 y T3 son los puntos naturales si sales pegado de la zona DRS.', 'Entrar demasiado rapido en T13 deja el coche sin apoyo para la salida.')),
  makeTrack('shanghai', 'Shanghai International Circuit', 'China', 'China', '🇨🇳', 5.451, 56, 16, 2, 'Alta', 'balanced', { downforce: 62, tireStress: 72, braking: 70, traction: 74, curbUse: 48 }, ['Espiral larga', 'Traccion lenta', 'Recta extrema'], 'Exige paciencia con acelerador y mucha traccion al final de curvas largas.', makeEngineerNotes('T1-T2 es una frenada en apoyo: reduce velocidad sin matar la rotacion.', 'T13 es la curva clave; salir mal arruina toda la recta trasera.', 'Guarda ERS para la recta larga y no lo vacies antes de la frenada de T14.', 'Traseras suben temperatura si abres gas antes de enderezar volante.', 'T14 es el adelantamiento principal con rebufo y DRS.', 'Sobreconducir la espiral degrada gomas y abre la trazada.')),
  makeTrack('suzuka', 'Suzuka Circuit', 'Japon', 'Japon', '🇯🇵', 5.807, 53, 18, 1, 'Extrema', 'technical', { downforce: 76, tireStress: 84, braking: 52, traction: 58, curbUse: 62 }, ['Eses', 'Degner/Spoon', '130R y chicane'], 'Circuito de precision: el volante debe ir suave y el setup no puede castigar el tren delantero.', makeEngineerNotes('Solo hay frenadas grandes en horquilla y chicane; lo demas es velocidad minima.', 'Las Eses premian levantar un poco antes antes que corregir tarde.', 'Usa ERS al salir de Spoon y hasta 130R, no en mitad de la secuencia inicial.', 'Carga lateral altisima; protege delanteras en tandas largas.', 'Chicane final si llegas con bateria y buen rebufo.', 'Atacar demasiado Degner 1 suele terminar en perdida de suelo o excursion.')),
  makeTrack('bahrain', 'Bahrain International Circuit', 'Bahrain', 'Bahrain', '🇧🇭', 5.412, 57, 15, 3, 'Alta', 'power', { downforce: 54, tireStress: 78, braking: 86, traction: 82, curbUse: 42 }, ['Frenadas fuertes', 'Traccion T10', 'Gestion trasera'], 'Stop-and-go con mucha traccion; el parc ferme debe favorecer estabilidad con combustible.', makeEngineerNotes('T1, T4 y T10 son las referencias: frena recto y baja presion al girar.', 'T10 bloquea facil la delantera izquierda si entras con demasiado angulo.', 'Despliega ERS saliendo de T10 y en recta principal.', 'Traseras son la vida de la carrera; no patines en segunda marcha.', 'T1 y T4 con DRS son oportunidades claras.', 'Subvirar en T11 por entrar pasado destruye la salida de sector.')),
  makeTrack('jeddah', 'Jeddah Corniche Circuit', 'Arabia Saudi', 'Arabia Saudi', '🇸🇦', 6.174, 50, 27, 3, 'Extrema', 'street', { downforce: 58, tireStress: 66, braking: 60, traction: 68, curbUse: 36 }, ['Alta velocidad', 'Muros cercanos', 'Recta final'], 'Urbano rapidisimo: estabilidad y confianza pesan mas que el ultimo km/h.', makeEngineerNotes('Frena con una referencia conservadora en T1 porque el rebufo cambia la velocidad punta.', 'Las secuencias ciegas castigan correcciones bruscas; deja respirar el volante.', 'ERS en la recta final y para defender despues del ultimo sector.', 'Evita derrapar al salir de curvas lentas, las traseras se calientan rapido.', 'T1 es el punto principal; prepara la ultima curva.', 'Rozar muros interiores en alta velocidad rompe ritmo y confianza.')),
  makeTrack('miami', 'Miami International Autodrome', 'Miami', 'Estados Unidos', '🇺🇸', 5.412, 57, 19, 3, 'Alta', 'balanced', { downforce: 60, tireStress: 70, braking: 78, traction: 76, curbUse: 50 }, ['Rectas', 'Sector trabado', 'Frenada T11'], 'Necesita buena punta sin perder traccion en el estadio lento.', makeEngineerNotes('T11 llega con mucha velocidad: frena recto y evita pisar piano interior.', 'El sector lento necesita diferencial docil para no romper traccion.', 'ERS fuerte en recta larga y salida de la ultima curva.', 'Cuida traseras en el sector trabado para llegar vivo al final.', 'T11 es la maniobra mas clara con DRS.', 'Montar demasiado piano en chicanes lentas descoloca el coche.')),
  makeTrack('imola', 'Autodromo Enzo e Dino Ferrari', 'Imola', 'Italia', '🇮🇹', 4.909, 63, 19, 1, 'Alta', 'technical', { downforce: 70, tireStress: 66, braking: 72, traction: 70, curbUse: 82 }, ['Pianos', 'Cambios de apoyo', 'Traccion final'], 'Vieja escuela: pianos utiles, pero el coche debe absorberlos sin rebotar.', makeEngineerNotes('Tosa y Rivazza requieren soltar freno con calma para rotar sin bloquear.', 'Acque Minerali decide el sector medio; no ataques el segundo piano a ciegas.', 'ERS para la recta principal porque hay pocas oportunidades de recuperarlo en lucha.', 'Traseras sufren en salidas lentas con deposito lleno.', 'T1 si sales cerca de Rivazza y activas DRS temprano.', 'Suspension demasiado dura te hace perder contacto en Variante Alta.')),
  makeTrack('monaco', 'Circuit de Monaco', 'Monaco', 'Monaco', '🇲🇨', 3.337, 78, 19, 1, 'Extrema', 'street', { downforce: 95, tireStress: 48, braking: 74, traction: 92, curbUse: 58 }, ['Traccion lenta', 'Precision', 'Clasificacion'], 'La vuelta vive de confianza, traccion y direccion estable a baja velocidad.', makeEngineerNotes('Frena antes de Casino, Mirabeau y Nouvelle Chicane; no bloquees porque no hay escapatoria.', 'Loews y Portier importan mas por salida que por velocidad minima.', 'ERS en tunel y recta principal; en trafico, guardalo para defender.', 'Baja degradacion, pero sobrecalentar traseras hace imposible traccionar.', 'Solo T1 o chicane tras tunel si el rival falla.', 'Un setup de carrera demasiado bajo o duro golpea el suelo y toca muros.')),
  makeTrack('catalunya', 'Circuit de Barcelona-Catalunya', 'Espana', 'Espana', '🇪🇸', 4.657, 66, 14, 2, 'Alta', 'technical', { downforce: 74, tireStress: 86, braking: 62, traction: 66, curbUse: 54 }, ['Curvas largas', 'Carga lateral', 'Ultimo sector'], 'Circuito de balance: revela rapido si el coche subvira o castiga gomas.', makeEngineerNotes('T1 y T10 son frenadas de ataque, pero no comprometas salida.', 'T3 y T9 miden apoyo; si subvira, perderas mucho tiempo de neumatico.', 'ERS principal en recta meta, conserva antes del ultimo sector.', 'Delanteras sufren mucho en T3, T4 y T9.', 'T1 con DRS es la oportunidad principal.', 'Entrar agresivo al ultimo sector mata traccion y aumenta temperatura.')),
  makeTrack('montreal', 'Circuit Gilles Villeneuve', 'Canada', 'Canada', '🇨🇦', 4.361, 70, 14, 3, 'Alta', 'power', { downforce: 48, tireStress: 60, braking: 90, traction: 82, curbUse: 88 }, ['Chicanes', 'Frenadas', 'Muro campeones'], 'Baja carga y pianos: el coche debe frenar fuerte y salir recto.', makeEngineerNotes('Frena siempre recto antes de las chicanes; evita girar con freno maximo.', 'La ultima chicane da o quita la recta entera.', 'ERS en recta trasera y meta, sin gastar al salir torcido.', 'Traseras sufren en traccion si usas demasiado piano.', 'Ultima chicane y T1 son zonas fuertes de adelantamiento.', 'Cortar pianos de mas genera rebotes y penalizaciones.')),
  makeTrack('spielberg', 'Red Bull Ring', 'Austria', 'Austria', '🇦🇹', 4.318, 71, 10, 3, 'Media', 'power', { downforce: 46, tireStress: 62, braking: 88, traction: 78, curbUse: 54 }, ['Subida', 'Frenadas DRS', 'Sector rapido'], 'Vuelta corta donde cada frenada grande pesa mucho.', makeEngineerNotes('T1, T3 y T4 son todo: frena fuerte, coche recto y traccion limpia.', 'T3 es facil de bloquear por pendiente y rebufo.', 'ERS en la subida hacia T3 y para defender antes de T4.', 'Traseras reciben torque en salidas lentas; no abuses del diferencial cerrado.', 'T3 y T4 con DRS encadenado.', 'Pasarte de frenada abre la puerta en la siguiente recta.')),
  makeTrack('silverstone', 'Silverstone Circuit', 'Gran Bretana', 'Reino Unido', '🇬🇧', 5.891, 52, 18, 2, 'Extrema', 'technical', { downforce: 72, tireStress: 88, braking: 58, traction: 54, curbUse: 44 }, ['Maggotts/Becketts', 'Copse', 'Stowe'], 'Alta velocidad pura: volante suave y plataforma aerodinamica estable.', makeEngineerNotes('Village y Vale son las frenadas de verdad; no sacrifiques velocidad en Maggotts.', 'Copse y Becketts requieren confianza, no correcciones en mitad de apoyo.', 'ERS desde Chapel hacia Hangar y al salir de Club.', 'Delanteras y laterales sufren con aire sucio.', 'Stowe y Brooklands son puntos realistas.', 'Un aleron trasero demasiado bajo hace inestable el coche en cambios rapidos.')),
  makeTrack('spa', 'Circuit de Spa-Francorchamps', 'Spa', 'Belgica', '🇧🇪', 7.004, 44, 19, 2, 'Extrema', 'balanced', { downforce: 62, tireStress: 78, braking: 70, traction: 68, curbUse: 58 }, ['Eau Rouge', 'Recta Kemmel', 'Sector 2'], 'Compromiso total entre punta y apoyo en sector medio.', makeEngineerNotes('La Source y Bus Stop son frenadas lentas; no sacrifiques la subida.', 'Eau Rouge/Raidillon exige coche estable con deposito y lluvia.', 'ERS desde La Source hasta Kemmel y desde Stavelot.', 'Carga larga y cambios de altitud elevan temperaturas si fuerzas demasiado.', 'Kemmel y Bus Stop.', 'Quitar demasiado aleron para recta deja vendido el sector 2.')),
  makeTrack('hungaroring', 'Hungaroring', 'Hungria', 'Hungria', '🇭🇺', 4.381, 70, 14, 1, 'Alta', 'downforce', { downforce: 86, tireStress: 80, braking: 64, traction: 74, curbUse: 70 }, ['Traccion', 'Ritmo continuo', 'Aire sucio'], 'Circuito ratonero: prioriza rotacion, estabilidad y salida de curvas medias.', makeEngineerNotes('T1 es la gran frenada; despues todo depende de ritmo y paciencia.', 'T4 y T11 son curvas de compromiso, no las conviertas en lucha contra el volante.', 'Guarda ERS para meta; adelantar fuera de T1 es dificil.', 'Temperaturas suben en trafico, cuida delanteras.', 'T1 es casi la unica opcion clara.', 'Setup demasiado rigido pierde traccion y no permite atacar pianos.')),
  makeTrack('zandvoort', 'Circuit Zandvoort', 'Paises Bajos', 'Paises Bajos', '🇳🇱', 4.259, 72, 14, 2, 'Alta', 'downforce', { downforce: 82, tireStress: 76, braking: 58, traction: 64, curbUse: 46 }, ['Peraltes', 'Rotacion', 'Salida final'], 'Peraltes y viento: necesitas confianza en apoyo y traccion progresiva.', makeEngineerNotes('Frena T1 con volante recto; el peralte ayuda, pero no corrige bloqueo.', 'Hugenholtz y curvas rapidas castigan entradas impacientes.', 'ERS en recta principal y salida de la curva final peraltada.', 'Delanteras sufren si fuerzas el coche en apoyo largo.', 'T1 es el punto mas claro con DRS.', 'Entrar tarde a las curvas peraltadas te deja sin salida.')),
  makeTrack('monza', 'Autodromo Nazionale Monza', 'Monza', 'Italia', '🇮🇹', 5.793, 53, 11, 2, 'Alta', 'power', { downforce: 34, tireStress: 54, braking: 94, traction: 74, curbUse: 86 }, ['Velocidad punta', 'Chicanes', 'Parabolica'], 'Templo de baja carga: frena estable y usa pianos sin descolocar el coche.', makeEngineerNotes('T1 y Ascari demandan frenar recto; la baja carga alarga todo.', 'Lesmo 2 y Parabolica definen las rectas siguientes.', 'ERS en recta principal y antes de Ascari si atacas.', 'Cuida traseras saliendo de chicanes con poco aleron.', 'T1 es el adelantamiento mas potente.', 'Subir demasiado pianos con suspension dura provoca trompos lentos.')),
  makeTrack('baku', 'Baku City Circuit', 'Azerbaiyan', 'Azerbaiyan', '🇦🇿', 6.003, 51, 20, 2, 'Extrema', 'street', { downforce: 42, tireStress: 56, braking: 88, traction: 82, curbUse: 34 }, ['Recta enorme', 'Castillo', 'Traccion urbana'], 'Urbano de baja carga: toca sobrevivir en zona lenta sin perder recta.', makeEngineerNotes('T1, T3 y T15 tienen frenadas faciles de bloquear por baja carga.', 'La zona del castillo pide paciencia y no tocar muros interiores.', 'Guarda ERS para la recta principal, es la defensa y ataque del circuito.', 'Traseras se calientan en traccion de segunda y tercera.', 'T1 despues de rebufo largo.', 'Aleron demasiado alto te deja expuesto; demasiado bajo arruina castillo.')),
  makeTrack('singapore', 'Marina Bay Street Circuit', 'Singapur', 'Singapur', '🇸🇬', 4.94, 62, 19, 3, 'Extrema', 'street', { downforce: 92, tireStress: 70, braking: 82, traction: 90, curbUse: 62 }, ['Traccion', 'Muros', 'Calor'], 'Largo, lento y fisico: estabilidad trasera y traccion son prioritarias.', makeEngineerNotes('Frena con margen porque el calor y el deposito cambian distancias vuelta a vuelta.', 'Curvas de 90 grados: busca salida, no vertice agresivo.', 'ERS en recta meta y recta trasera, guardando para defensa.', 'Temperatura trasera y presiones importan mucho en tandas largas.', 'T1 y T7 son opciones con DRS.', 'Acelerar antes de enderezar volante provoca sobreviraje constante.')),
  makeTrack('cota', 'Circuit of The Americas', 'Austin', 'Estados Unidos', '🇺🇸', 5.513, 56, 20, 2, 'Alta', 'balanced', { downforce: 68, tireStress: 74, braking: 76, traction: 70, curbUse: 58 }, ['Subida T1', 'Eses', 'Recta larga'], 'Combina sectores de Suzuka y recta larga: setup de compromiso real.', makeEngineerNotes('T1 en subida permite frenar tarde, pero no cierres demasiado la salida.', 'Las Eses requieren volante limpio y no perseguir cada piano.', 'ERS desde la salida de T11 por toda la recta larga.', 'Delanteras sufren si atacas demasiado el primer sector.', 'T12 tras recta larga y T1.', 'Llegar pasado a T12 arruina toda la secuencia lenta.')),
  makeTrack('mexico', 'Autodromo Hermanos Rodriguez', 'Mexico', 'Mexico', '🇲🇽', 4.304, 71, 17, 3, 'Alta', 'power', { downforce: 58, tireStress: 68, braking: 84, traction: 78, curbUse: 50 }, ['Recta larga', 'Altitud', 'Estadio'], 'La altitud reduce carga efectiva: necesitas mas ala de lo que parece.', makeEngineerNotes('T1 llega muy rapido; no juzgues frenada solo por velocidad punta.', 'El estadio pide traccion y paciencia, no agresividad.', 'ERS en recta principal y para defender hacia T4.', 'Traseras se degradan con patinaje en estadio.', 'T1 es el punto principal.', 'Bajar demasiado ala por la recta hace lento el sector medio.')),
  makeTrack('interlagos', 'Autodromo Jose Carlos Pace', 'Sao Paulo', 'Brasil', '🇧🇷', 4.309, 71, 15, 2, 'Alta', 'balanced', { downforce: 66, tireStress: 74, braking: 70, traction: 78, curbUse: 58 }, ['Senna S', 'Subida final', 'Cambios nivel'], 'Corto e intenso: traccion final y estabilidad en apoyo son decisivas.', makeEngineerNotes('Senna S exige frenar recto y apuntar pronto a la segunda parte.', 'Ferradura y Pinheirinho castigan subviraje.', 'ERS desde Juncao por la subida y meta.', 'Traseras sufren en subida si abres gas demasiado pronto.', 'T1 con DRS y T4.', 'Salir mal de Juncao cuesta tiempo durante toda la recta.')),
  makeTrack('vegas', 'Las Vegas Strip Circuit', 'Las Vegas', 'Estados Unidos', '🇺🇸', 6.201, 50, 17, 2, 'Alta', 'power', { downforce: 36, tireStress: 50, braking: 86, traction: 72, curbUse: 32 }, ['Rectas frias', 'Baja carga', 'Frenadas lentas'], 'Muchisima recta y baja temperatura: calentar gomas y frenar estable es clave.', makeEngineerNotes('Frenadas al final de recta son largas por baja carga y gomas frias.', 'Las curvas lentas no perdonan patinaje con volante aun abierto.', 'ERS en la Strip y para defender en rectas largas.', 'Presiones y warm-up importan mas que en otros circuitos.', 'Final de recta principal y horquillas lentas.', 'Llegar con gomas frias y frenar como en seco caliente bloquea facil.')),
  makeTrack('lusail', 'Lusail International Circuit', 'Qatar', 'Qatar', '🇶🇦', 5.419, 57, 16, 1, 'Alta', 'downforce', { downforce: 78, tireStress: 92, braking: 46, traction: 54, curbUse: 48 }, ['Curvas medias', 'Neumaticos', 'Recta meta'], 'Circuito abrasivo y rapido: cuidar neumaticos es rendimiento puro.', makeEngineerNotes('Hay pocas frenadas grandes; gestiona levantadas suaves y linea limpia.', 'Curvas largas encadenadas destruyen delanteras si giras de mas.', 'ERS en recta principal, no lo malgastes en curvas limitadas por apoyo.', 'Es de los circuitos mas duros para neumaticos: conduce redondo.', 'T1 con DRS es la opcion principal.', 'Forzar angulo de volante calienta gomas y pierde velocidad minima.')),
  makeTrack('yasmarina', 'Yas Marina Circuit', 'Abu Dhabi', 'Abu Dhabi', '🇦🇪', 5.281, 58, 16, 2, 'Media', 'balanced', { downforce: 60, tireStress: 62, braking: 78, traction: 76, curbUse: 44 }, ['Rectas', 'Sector tecnico', 'Traccion final'], 'Equilibrio entre rectas y traccion lenta; facil perder carrera por desgaste trasero.', makeEngineerNotes('T6 y T9 son las frenadas grandes; suelta freno antes de girar fuerte.', 'El ultimo sector necesita traccion y paciencia en pianos.', 'ERS en las dos rectas largas y para defender T6/T9.', 'Cuida traseras en aceleraciones lentas con deposito lleno.', 'T6 y T9 con DRS.', 'Entrar demasiado agresivo al ultimo sector destruye salidas.')),
];
