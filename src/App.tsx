import { useEffect, useMemo, useRef, useState } from 'react';
import { TrackMap } from './components/TrackMap';
import { getEngineerRadioNotes } from './data/engineerRadio';
import { getSetup } from './data/setups';
import { getStrategyPlan } from './data/strategy';
import { tracks } from './data/tracks';
import type { GameLap, RaceDistance, SetupPreset, Track, WeatherMode } from './data/types';

const weatherLabels: Record<WeatherMode, string> = {
  dry: 'Seco',
  intermediate: 'Lluvia ligera',
  wet: 'Mojado fuerte',
};

const raceDistanceLabels: Record<RaceDistance, string> = {
  '25': '25%',
  '50': '50%',
  '100': '100%',
};

type SetupTabId = 'aero' | 'transmission' | 'geometry' | 'suspension' | 'brakes' | 'tyres';

interface SetupDisplayRow {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  current: number;
  rangeText: string;
}

const setupTabMeta: Record<SetupTabId, { label: string; title: string; description: string }> = {
  aero: {
    label: 'AERODINAMICA',
    title: 'Aerodinamica',
    description: 'Equilibra carga y velocidad punta. Mas ala mejora apoyo, pero penaliza la recta.',
  },
  transmission: {
    label: 'TRANSMISION',
    title: 'Transmision',
    description: 'El diferencial cambia la traccion a la salida. Mas bloqueo ayuda a acelerar, pero gira peor.',
  },
  geometry: {
    label: 'GEOMETRIA',
    title: 'Geometria',
    description: 'Caidas y convergencias definen apoyo y giro inicial. Un ajuste agresivo desgasta mas la goma.',
  },
  suspension: {
    label: 'SUSPENSION',
    title: 'Suspension',
    description: 'Muelles, barras y alturas controlan estabilidad, pianos y respuesta en frenada y aceleracion.',
  },
  brakes: {
    label: 'FRENOS',
    title: 'Frenos',
    description: 'Reparto y presion marcan la mordida inicial. Mas delante bloquea antes; mas atras rota mejor.',
  },
  tyres: {
    label: 'NEUMATICOS',
    title: 'Neumaticos',
    description: 'La presion cambia temperatura y apoyo. Mas presion libera punta; menos presion mejora traccion.',
  },
};

const formatGameValue = (value: number, kind: 'int' | 'percent' | 'degree' | 'psi') => {
  switch (kind) {
    case 'percent':
      return `${value}%`;
    case 'degree':
      return `${value.toFixed(2)}°`;
    case 'psi':
      return `${value.toFixed(1)} psi`;
    default:
      return String(Math.round(value));
  }
};

const getSetupRows = (setup: SetupPreset): Record<SetupTabId, SetupDisplayRow[]> => ({
  aero: [
    {
      label: 'Ala delantera',
      valueLabel: formatGameValue(setup.aero.frontWing, 'int'),
      min: 0,
      max: 50,
      current: setup.aero.frontWing,
      rangeText: 'Min 0 - 50 Max',
    },
    {
      label: 'Ala trasera',
      valueLabel: formatGameValue(setup.aero.rearWing, 'int'),
      min: 0,
      max: 50,
      current: setup.aero.rearWing,
      rangeText: 'Min 0 - 50 Max',
    },
  ],
  transmission: [
    {
      label: 'Diferencial con gas',
      valueLabel: formatGameValue(setup.transmission.differentialOn, 'percent'),
      min: 10,
      max: 100,
      current: setup.transmission.differentialOn,
      rangeText: 'Abierto 10% - 100% Bloqueado',
    },
    {
      label: 'Diferencial sin gas',
      valueLabel: formatGameValue(setup.transmission.differentialOff, 'percent'),
      min: 10,
      max: 100,
      current: setup.transmission.differentialOff,
      rangeText: 'Abierto 10% - 100% Bloqueado',
    },
  ],
  geometry: [
    {
      label: 'Caida delantera',
      valueLabel: formatGameValue(setup.suspensionGeometry.frontCamber, 'degree'),
      min: -3.5,
      max: -2.5,
      current: setup.suspensionGeometry.frontCamber,
      rangeText: 'Min -3.50 - -2.50 Max',
    },
    {
      label: 'Caida trasera',
      valueLabel: formatGameValue(setup.suspensionGeometry.rearCamber, 'degree'),
      min: -2,
      max: -1,
      current: setup.suspensionGeometry.rearCamber,
      rangeText: 'Min -2.00 - -1.00 Max',
    },
    {
      label: 'Toe delantero',
      valueLabel: formatGameValue(setup.suspensionGeometry.frontToe, 'degree'),
      min: 0,
      max: 0.2,
      current: setup.suspensionGeometry.frontToe,
      rangeText: 'Min 0.00 - 0.20 Max',
    },
    {
      label: 'Toe trasero',
      valueLabel: formatGameValue(setup.suspensionGeometry.rearToe, 'degree'),
      min: 0.1,
      max: 0.25,
      current: setup.suspensionGeometry.rearToe,
      rangeText: 'Min 0.10 - 0.25 Max',
    },
  ],
  suspension: [
    {
      label: 'Suspension delantera',
      valueLabel: formatGameValue(setup.suspension.frontSuspension, 'int'),
      min: 1,
      max: 41,
      current: setup.suspension.frontSuspension,
      rangeText: 'Blando 1 - 41 Duro',
    },
    {
      label: 'Suspension trasera',
      valueLabel: formatGameValue(setup.suspension.rearSuspension, 'int'),
      min: 1,
      max: 41,
      current: setup.suspension.rearSuspension,
      rangeText: 'Blando 1 - 41 Duro',
    },
    {
      label: 'Barra delantera',
      valueLabel: formatGameValue(setup.suspension.frontAntiRoll, 'int'),
      min: 1,
      max: 21,
      current: setup.suspension.frontAntiRoll,
      rangeText: 'Blando 1 - 21 Duro',
    },
    {
      label: 'Barra trasera',
      valueLabel: formatGameValue(setup.suspension.rearAntiRoll, 'int'),
      min: 1,
      max: 21,
      current: setup.suspension.rearAntiRoll,
      rangeText: 'Blando 1 - 21 Duro',
    },
    {
      label: 'Altura delantera',
      valueLabel: formatGameValue(setup.suspension.frontRideHeight, 'int'),
      min: 15,
      max: 35,
      current: setup.suspension.frontRideHeight,
      rangeText: 'Min 15 - 35 Max',
    },
    {
      label: 'Altura trasera',
      valueLabel: formatGameValue(setup.suspension.rearRideHeight, 'int'),
      min: 40,
      max: 60,
      current: setup.suspension.rearRideHeight,
      rangeText: 'Min 40 - 60 Max',
    },
  ],
  brakes: [
    {
      label: 'Reparto de freno',
      valueLabel: formatGameValue(setup.brakes.bias, 'percent'),
      min: 50,
      max: 70,
      current: setup.brakes.bias,
      rangeText: 'Delante 70% - 50% Detras',
    },
    {
      label: 'Presion de freno',
      valueLabel: formatGameValue(setup.brakes.pressure, 'percent'),
      min: 80,
      max: 100,
      current: setup.brakes.pressure,
      rangeText: 'Min 80% - 100% Max',
    },
  ],
  tyres: [
    {
      label: 'Presion delantero derecho',
      valueLabel: formatGameValue(setup.tyres.frontRight, 'psi'),
      min: 22.5,
      max: 29.5,
      current: setup.tyres.frontRight,
      rangeText: '22.5 - 29.5 PSI',
    },
    {
      label: 'Presion delantero izquierdo',
      valueLabel: formatGameValue(setup.tyres.frontLeft, 'psi'),
      min: 22.5,
      max: 29.5,
      current: setup.tyres.frontLeft,
      rangeText: '22.5 - 29.5 PSI',
    },
    {
      label: 'Presion trasero derecho',
      valueLabel: formatGameValue(setup.tyres.rearRight, 'psi'),
      min: 20.5,
      max: 26.5,
      current: setup.tyres.rearRight,
      rangeText: '20.5 - 26.5 PSI',
    },
    {
      label: 'Presion trasero izquierdo',
      valueLabel: formatGameValue(setup.tyres.rearLeft, 'psi'),
      min: 20.5,
      max: 26.5,
      current: setup.tyres.rearLeft,
      rangeText: '20.5 - 26.5 PSI',
    },
  ],
});

const timeValue = (time: string) => {
  const [minutes, seconds] = time.split(':');
  return Number(minutes) * 60 + Number(seconds);
};

interface F1LapsCache {
  fetchedAt: string;
  tracks: Record<string, GameLap[]>;
  errors?: Record<string, string>;
}

type F1LapsStatus = 'loading' | 'ready' | 'fallback';

const flagBackgroundFor = (country: string) => {
  switch (country) {
    case 'Australia':
      return 'linear-gradient(135deg, #012169 0%, #012169 65%, #ffffff 65%, #ffffff 66%, #c8102e 66%, #c8102e 100%)';
    case 'China':
      return 'linear-gradient(135deg, #de2910 0%, #de2910 100%)';
    case 'Japon':
      return 'radial-gradient(circle at 50% 50%, #bc002d 0 28%, #ffffff 29% 100%)';
    case 'Bahrain':
      return 'linear-gradient(90deg, #ffffff 0 18%, #ce1126 18% 100%)';
    case 'Arabia Saudi':
      return 'linear-gradient(135deg, #006c35 0%, #006c35 100%)';
    case 'Estados Unidos':
      return 'repeating-linear-gradient(180deg, #b22234 0 10%, #ffffff 10% 20%), linear-gradient(180deg, #3c3b6e 0 55%, transparent 55% 100%)';
    case 'Italia':
      return 'linear-gradient(90deg, #009246 0 33.33%, #ffffff 33.33% 66.66%, #ce2b37 66.66% 100%)';
    case 'Monaco':
      return 'linear-gradient(180deg, #ce1126 0 50%, #ffffff 50% 100%)';
    case 'Espana':
      return 'linear-gradient(180deg, #aa151b 0 25%, #f1bf00 25% 75%, #aa151b 75% 100%)';
    case 'Canada':
      return 'linear-gradient(90deg, #d80621 0 25%, #ffffff 25% 75%, #d80621 75% 100%)';
    case 'Austria':
      return 'linear-gradient(180deg, #ed2939 0 33.33%, #ffffff 33.33% 66.66%, #ed2939 66.66% 100%)';
    case 'Reino Unido':
    case 'Gran Bretana':
      return 'linear-gradient(135deg, #012169 0%, #012169 100%)';
    case 'Belgica':
      return 'linear-gradient(90deg, #000000 0 33.33%, #ffd90c 33.33% 66.66%, #ef3340 66.66% 100%)';
    case 'Hungria':
      return 'linear-gradient(180deg, #ce2939 0 33.33%, #ffffff 33.33% 66.66%, #477050 66.66% 100%)';
    case 'Paises Bajos':
      return 'linear-gradient(180deg, #ae1c28 0 33.33%, #ffffff 33.33% 66.66%, #21468b 66.66% 100%)';
    case 'Singapur':
      return 'linear-gradient(180deg, #ef3340 0 50%, #ffffff 50% 100%)';
    case 'Mexico':
      return 'linear-gradient(90deg, #006847 0 33.33%, #ffffff 33.33% 66.66%, #ce1126 66.66% 100%)';
    case 'Brasil':
      return 'linear-gradient(135deg, #009c3b 0%, #009c3b 100%)';
    case 'Qatar':
      return 'linear-gradient(90deg, #ffffff 0 18%, #8a1538 18% 100%)';
    case 'Abu Dhabi':
      return 'linear-gradient(90deg, #ff0000 0 22%, #00732f 22% 48%, #ffffff 48% 74%, #000000 74% 100%)';
    case 'Azerbaiyan':
      return 'linear-gradient(180deg, #00b5e2 0 33.33%, #ef3340 33.33% 66.66%, #509e2f 66.66% 100%)';
    default:
      return 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))';
  }
};

const flagTextStyleFor = (country: string): React.CSSProperties => {
  const darkTextCountries = new Set(['Japon', 'Monaco', 'Canada', 'Austria', 'Singapur']);
  const color = darkTextCountries.has(country) ? '#141316' : '#fffaf4';
  const shadow = darkTextCountries.has(country)
    ? '0 1px 0 rgba(255,255,255,0.9), 0 0 12px rgba(255,255,255,0.7)'
    : '0 1px 0 rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)';

  return {
    backgroundImage: flagBackgroundFor(country),
    ['--flag-text-color' as never]: color,
    ['--flag-text-shadow' as never]: shadow,
  };
};

function App() {
  const [trackId, setTrackId] = useState(tracks[0].id);
  const [weather, setWeather] = useState<WeatherMode>('dry');
  const [gridPosition, setGridPosition] = useState(10);
  const [raceDistance, setRaceDistance] = useState<RaceDistance>('50');
  const [pickerFontPx, setPickerFontPx] = useState<number | null>(null);
  const [liveTimes, setLiveTimes] = useState<F1LapsCache | null>(null);
  const [liveTimesStatus, setLiveTimesStatus] = useState<F1LapsStatus>('loading');
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const setup = useMemo(() => getSetup(track, weather), [track, weather]);
  const strategy = useMemo(() => getStrategyPlan(track, weather, gridPosition, raceDistance), [track, weather, gridPosition, raceDistance]);
  const gameLaps = liveTimes?.tracks[track.id] ?? track.gameLaps;

  useEffect(() => {
    const element = pickerRef.current;
    if (!element) return;

    const countryNames = tracks.map((item) => item.country);

    const measureAndSet = () => {
      const firstButton = element.querySelector('button');
      if (!(firstButton instanceof HTMLElement)) return;

      // Available inner width for the label inside the tile.
      const available = Math.max(60, firstButton.clientWidth - 16);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const computed = window.getComputedStyle(firstButton);
      const family = computed.fontFamily || 'sans-serif';
      const weight = 800;

      const fits = (px: number) => {
        ctx.font = `${weight} ${px}px ${family}`;
        return countryNames.every((name) => ctx.measureText(name).width <= available);
      };

      let lo = 10;
      let hi = 22;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (fits(mid)) lo = mid;
        else hi = mid - 1;
      }

      setPickerFontPx(lo);
    };

    const observer = new ResizeObserver(() => measureAndSet());
    observer.observe(element);
    measureAndSet();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const dataUrl = `${import.meta.env.BASE_URL}data/f1laps-times.json`;

    fetch(dataUrl, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<F1LapsCache>;
      })
      .then((data) => {
        if (cancelled) return;
        setLiveTimes(data);
        setLiveTimesStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setLiveTimesStatus('fallback');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="topbar panel">
        <div className="title-block">
          <span className="eyebrow">F1 25 Codemasters - PS5 - Volante</span>
          <h1>
            <span>{track.flag}</span>
            {track.name}
          </h1>
          <p>{track.summary}</p>
          <div
            className="track-picker"
            aria-label="Seleccion de circuito"
            ref={pickerRef}
            style={pickerFontPx ? ({ ['--picker-name-size' as never]: `${pickerFontPx}px` } as React.CSSProperties) : undefined}
          >
            {tracks.map((item) => (
              <button
                key={item.id}
                className={trackId === item.id ? 'active' : ''}
                onClick={() => setTrackId(item.id)}
                style={flagTextStyleFor(item.country)}
              >
                <span className="track-picker-name">{item.country}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="race-layout">
        <div className="track-column">
          <section className="center-column panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Mapa activo</span>
                <h2>{track.shortName}</h2>
              </div>
              <div className="badge-row">
                <span>{track.corners} curvas</span>
                <span>{track.drsZones} DRS</span>
                <span>{track.difficulty}</span>
              </div>
            </div>
            <TrackMap track={track} />
            <div className="sector-strip">
              {track.sectorFocus.map((sector, index) => (
                <div key={sector}>
                  <strong>S{index + 1}</strong>
                  <span>{sector}</span>
                </div>
              ))}
            </div>
            <BrakingGuide track={track} />
          </section>

          <section className="bottom-grid">
            <TimesPanel track={track} gameLaps={gameLaps} fetchedAt={liveTimes?.fetchedAt} status={liveTimesStatus} />
            <StatPanel track={track} />
            <TelemetryPanel track={track} />
          </section>
        </div>

        <aside className="strategy-column">
          <section className="panel race-controls">
            <div className="segmented" aria-label="Clima">
              {(Object.keys(weatherLabels) as WeatherMode[]).map((mode) => (
                <button key={mode} className={weather === mode ? 'active' : ''} onClick={() => setWeather(mode)}>
                  {weatherLabels[mode]}
                </button>
              ))}
            </div>
            <div className="grid-control" aria-label="Posicion de parrilla">
              <span className="grid-control-label">Posicion de parrilla</span>
              <div className="grid-stepper">
                <button onClick={() => setGridPosition((current) => Math.max(1, current - 1))} aria-label="Bajar posicion">
                  -
                </button>
                <strong>P{gridPosition}</strong>
                <button onClick={() => setGridPosition((current) => Math.min(22, current + 1))} aria-label="Subir posicion">
                  +
                </button>
              </div>
            </div>
            <div className="grid-control" aria-label="Distancia de carrera">
              <span className="grid-control-label">Distancia</span>
              <div className="segmented segmented-compact">
                {(Object.keys(raceDistanceLabels) as RaceDistance[]).map((distance) => (
                  <button key={distance} className={raceDistance === distance ? 'active' : ''} onClick={() => setRaceDistance(distance)}>
                    {raceDistanceLabels[distance]}
                  </button>
                ))}
              </div>
            </div>
          </section>
          <SetupPanel setup={setup} weather={weather} compact />
          <EngineerSuitePanel
            track={track}
            weather={weather}
            setup={setup}
            gridPosition={gridPosition}
            raceDistance={raceDistance}
            plan={strategy}
          />
        </aside>
      </section>
    </main>
  );
}

function SetupPanel({ setup, weather, compact = false }: { setup: SetupPreset; weather: WeatherMode; compact?: boolean }) {
  const [tab, setTab] = useState<SetupTabId>('aero');
  const rowsByTab = useMemo(() => getSetupRows(setup), [setup]);
  const activeMeta = setupTabMeta[tab];

  return (
    <article className={compact ? 'setup-panel setup-panel-compact' : 'panel setup-panel'}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Setup recomendado</span>
          <h2>Parc ferme - {weatherLabels[weather]}</h2>
        </div>
        <span className="parc-ferme">Qualy + carrera</span>
      </div>
      <div className="setup-game-tabs" role="tablist" aria-label="Categorias del setup">
        {(Object.keys(setupTabMeta) as SetupTabId[]).map((tabId) => (
          <button
            key={tabId}
            type="button"
            role="tab"
            aria-selected={tab === tabId}
            className={tab === tabId ? 'active' : ''}
            onClick={() => setTab(tabId)}
          >
            {setupTabMeta[tabId].label}
          </button>
        ))}
      </div>
      <div className="setup-game-shell">
        <div className="setup-game-rows">
          {rowsByTab[tab].map((row) => {
            const progress = ((row.current - row.min) / (row.max - row.min)) * 100;

            return (
              <div className="setup-game-row" key={row.label}>
                <span className="setup-game-label">{row.label}</span>
                <div className="setup-game-control">
                  <span className="setup-chevrons">&lsaquo; &rsaquo;</span>
                  <div className="setup-slider">
                    <span className="setup-slider-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <strong className="setup-game-value">{row.valueLabel}</strong>
                </div>
                <small className="setup-game-range">{row.rangeText}</small>
              </div>
            );
          })}
        </div>
        <aside className="setup-game-aside">
          <h3>{activeMeta.title}</h3>
          <p>{activeMeta.description}</p>
        </aside>
      </div>
    </article>
  );
}

function StatPanel({ track }: { track: Track }) {
  const stats = [
    ['Longitud', `${track.lengthKm.toFixed(3)} km`],
    ['Vueltas', track.laps],
    ['Curvas', track.corners],
    ['Dificultad', track.difficulty],
  ];

  return (
    <article className="panel stats-panel">
      <span className="eyebrow">Circuito</span>
      <div className="stat-stack">
        {stats.map(([label, value]) => (
          <div className="stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function TelemetryPanel({ track }: { track: Track }) {
  const metrics = [
    ['Carga', track.profile.downforce, 'cyan'],
    ['Neumaticos', track.profile.tireStress, 'amber'],
    ['Frenada', track.profile.braking, 'red'],
    ['Traccion', track.profile.traction, 'green'],
    ['Pianos', track.profile.curbUse, 'violet'],
  ];

  return (
    <article className="panel telemetry-panel">
      <span className="eyebrow">Perfil dinamico</span>
      {metrics.map(([label, value, color]) => (
        <div className="meter" key={label}>
          <div>
            <span>{label}</span>
            <strong>{value}%</strong>
          </div>
          <div className="bar">
            <span className={`fill ${color}`} style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </article>
  );
}

function TimesPanel({
  track,
  gameLaps,
}: {
  track: Track;
  gameLaps: GameLap[];
  fetchedAt?: string;
  status: F1LapsStatus;
}) {
  return (
    <article className="panel times-panel">
      <span className="eyebrow">Tiempos</span>
      <RealRecordPanel track={track} />
      <TimeTable title="F1 2025 PS5" rows={gameLaps} />
    </article>
  );
}

function RealRecordPanel({ track }: { track: Track }) {
  const raceRecord = track.records.find((row) => row.year.toLowerCase().includes('race lap record'));
  const qualifyingRecord = track.records
    .filter((row) => row.year.toLowerCase().includes('pole reference'))
    .sort((a, b) => timeValue(a.time) - timeValue(b.time))[0];

  return (
    <div className="real-records">
      <h3>Histórico real</h3>
      <RecordRow label="Récord carrera" row={raceRecord} />
      <RecordRow label="Récord clasificación" row={qualifyingRecord} />
    </div>
  );
}

function RecordRow({ label, row }: { label: string; row?: { driver: string; team: string; time: string; year: string } }) {
  return (
    <div className="record-row">
      <span>{label}</span>
      <strong>{row?.time ?? '--:--.---'}</strong>
      <small>
        {row ? `${row.driver} · ${row.team} · ${row.year}` : 'Pendiente de verificar'}
      </small>
    </div>
  );
}

function TimeTable({ title, rows }: { title: string; rows: Array<{ rank: number; driver: string; team: string; time: string; source: string; status: string }> }) {
  return (
    <div className="time-table">
      <h3>{title}</h3>
      {rows.map((row) => (
        <div className={row.status === 'pending' ? 'time-row pending' : 'time-row'} key={`${title}-${row.rank}`}>
          <span className="rank">P{row.rank}</span>
          <span>
            <strong>{row.time}</strong>
            <small>{row.driver}</small>
          </span>
          <small>{row.team}</small>
        </div>
      ))}
    </div>
  );
}

function EngineerSuitePanel({
  track,
  weather,
  setup,
  gridPosition,
  raceDistance,
  plan,
}: {
  track: Track;
  weather: WeatherMode;
  setup: SetupPreset;
  gridPosition: number;
  raceDistance: RaceDistance;
  plan: ReturnType<typeof getStrategyPlan>;
}) {
  const notes = getEngineerRadioNotes(track, weather, setup, gridPosition, raceDistance);

  return (
    <article className="panel engineer-suite-panel">
      <section className="engineer-suite-block">
        <span className="eyebrow">Canal ingeniero</span>
        <h2>{weather === 'dry' ? 'Plan en seco' : 'Plan con lluvia'}</h2>
        <div className="radio-lines">
          {notes.map((note, index) => (
            <p key={note}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {note}
            </p>
          ))}
        </div>
      </section>
      <section className="engineer-suite-block engineer-suite-race">
        <span className="eyebrow">Ingeniero de carrera</span>
        <h2>{plan.headline}</h2>
        <p className="strategy-summary">{plan.summary}</p>
        <div className="strategy-sections">
          {plan.sections.map((section) => (
            <section key={section.title} className="strategy-block">
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}

function BrakingGuide({ track }: { track: Track }) {
  return (
    <article className="braking-guide">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Referencias de frenada</span>
          <h2>Curva por curva</h2>
        </div>
        <span className="parc-ferme">Volante</span>
      </div>
      <div className="braking-grid">
        {track.brakingGuide.map((item) => (
          <div className="brake-card" key={item.corner}>
            <span>{item.corner} - {item.reference} - {item.gear}ª marcha.</span>
            <small>{item.note}</small>
          </div>
        ))}
      </div>
    </article>
  );
}

export default App;
