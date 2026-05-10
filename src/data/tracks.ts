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

  return {
    ...baseTrack,
    brakingGuide: curatedBrakingGuides[id] ?? makeBrakingGuide(baseTrack, baseTrack.map),
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
