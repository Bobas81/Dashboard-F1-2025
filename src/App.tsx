import { useEffect, useMemo, useRef, useState } from 'react';
import { TrackMap } from './components/TrackMap';
import { getSetup } from './data/setups';
import { tracks } from './data/tracks';
import type { SetupPreset, Track, WeatherMode } from './data/types';

const weatherLabels: Record<WeatherMode, string> = {
  dry: 'Seco',
  intermediate: 'Lluvia ligera',
  wet: 'Mojado fuerte',
};

const setupGroups = (setup: SetupPreset) => [
  { title: 'Aerodinamica', rows: [['Ala del.', setup.aero.frontWing], ['Ala tras.', setup.aero.rearWing]] },
  {
    title: 'Transmision',
    rows: [
      ['Diff ON', `${setup.transmission.differentialOn}%`],
      ['Diff OFF', `${setup.transmission.differentialOff}%`],
      ['Freno motor', `${setup.transmission.engineBraking}%`],
    ],
  },
  {
    title: 'Geometria',
    rows: [
      ['Camber del.', setup.suspensionGeometry.frontCamber],
      ['Camber tras.', setup.suspensionGeometry.rearCamber],
      ['Toe del.', setup.suspensionGeometry.frontToe],
      ['Toe tras.', setup.suspensionGeometry.rearToe],
    ],
  },
  {
    title: 'Suspension',
    rows: [
      ['Susp. del.', setup.suspension.frontSuspension],
      ['Susp. tras.', setup.suspension.rearSuspension],
      ['ARB del.', setup.suspension.frontAntiRoll],
      ['ARB tras.', setup.suspension.rearAntiRoll],
      ['Altura del.', setup.suspension.frontRideHeight],
      ['Altura tras.', setup.suspension.rearRideHeight],
    ],
  },
  {
    title: 'Frenos y presiones',
    rows: [
      ['Presion freno', `${setup.brakes.pressure}%`],
      ['Bias', `${setup.brakes.bias}%`],
      ['FL / FR', `${setup.tyres.frontLeft} / ${setup.tyres.frontRight} psi`],
      ['RL / RR', `${setup.tyres.rearLeft} / ${setup.tyres.rearRight} psi`],
    ],
  },
];

const timeValue = (time: string) => {
  const [minutes, seconds] = time.split(':');
  return Number(minutes) * 60 + Number(seconds);
};

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

function App() {
  const [trackId, setTrackId] = useState(tracks[0].id);
  const [weather, setWeather] = useState<WeatherMode>('dry');
  const [pickerFontPx, setPickerFontPx] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const setup = useMemo(() => getSetup(track, weather), [track, weather]);

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
                style={{ backgroundImage: flagBackgroundFor(item.country) }}
              >
                <span className="track-picker-name">{item.country}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="control-stack">
          <div className="controls" aria-label="Controles del dashboard">
            <div className="segmented" aria-label="Clima">
              {(Object.keys(weatherLabels) as WeatherMode[]).map((mode) => (
                <button key={mode} className={weather === mode ? 'active' : ''} onClick={() => setWeather(mode)}>
                  {weatherLabels[mode]}
                </button>
              ))}
            </div>
          </div>
          <SetupPanel setup={setup} weather={weather} compact />
        </div>
      </section>

      <section className="dashboard-grid">
        <aside className="left-column">
          <StatPanel track={track} />
          <TelemetryPanel track={track} />
        </aside>

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

        <aside className="right-column">
          <TimesPanel track={track} />
          <EngineerPanel track={track} weather={weather} />
        </aside>
      </section>

      <StrategyPanel setup={setup} weather={weather} />
    </main>
  );
}

function SetupPanel({ setup, weather, compact = false }: { setup: SetupPreset; weather: WeatherMode; compact?: boolean }) {
  return (
    <article className={compact ? 'setup-panel setup-panel-compact' : 'panel setup-panel'}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Setup recomendado</span>
          <h2>Parc ferme - {weatherLabels[weather]}</h2>
        </div>
        <span className="parc-ferme">Qualy + carrera</span>
      </div>
      <div className="setup-cards">
        {setupGroups(setup).map((group) => (
          <div className="setup-card" key={group.title}>
            <h3>{group.title}</h3>
            {group.rows.map(([label, value]) => (
              <div className="setup-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        ))}
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

function TimesPanel({ track }: { track: Track }) {
  return (
    <article className="panel times-panel">
      <span className="eyebrow">Tiempos</span>
      <h2>Referencias</h2>
      <RealRecordPanel track={track} />
      <TimeTable title="F1 2025 PS5" rows={track.gameLaps} />
      <p className="source-note">
        PS5: leaderboard F1Laps consultado el 2026-05-02. Real: récord de carrera y referencia de clasificación.
      </p>
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

function EngineerPanel({ track, weather }: { track: Track; weather: WeatherMode }) {
  const notes = [
    ...track.engineer.braking,
    ...track.engineer.criticalCorners,
    ...track.engineer.ers,
    ...track.engineer.tyres,
    ...track.engineer.overtaking,
    ...track.engineer.commonMistakes,
  ];

  return (
    <article className="panel engineer-panel">
      <span className="eyebrow">Canal ingeniero</span>
      <h2>{weather === 'dry' ? 'Plan en seco' : 'Plan con lluvia'}</h2>
      <div className="radio-lines">
        {notes.slice(0, 6).map((note, index) => (
          <p key={note}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {note}
          </p>
        ))}
      </div>
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

function StrategyPanel({ setup, weather }: { setup: SetupPreset; weather: WeatherMode }) {
  return (
    <article className="panel strategy-panel">
      <span className="eyebrow">Ingeniero de carrera</span>
      <h2>Notas para salir a pista</h2>
      <ul>
        {setup.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
        <li>
          {weather === 'dry'
            ? 'En seco puedes atacar pianos si el coche no rebota; ajusta solo si pierdes traccion.'
            : 'Con lluvia, usa marchas mas largas en salidas lentas y evita girar con acelerador brusco.'}
        </li>
      </ul>
    </article>
  );
}

export default App;
