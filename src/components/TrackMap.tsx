import { circuitImages } from '../data/circuitImages';
import { vectorTrackMaps, type VectorPoint } from '../data/vectorTrackMaps';
import type { SeasonMode, Track } from '../data/types';

interface Props {
  track: Track;
  season: SeasonMode;
}

export function TrackMap({ track, season }: Props) {
  if (season === '2026') {
    const vectorMap = vectorTrackMaps[track.id];

    if (!vectorMap) {
      return (
        <div className="track-stage track-stage-unavailable" role="status">
          <strong>Mapa 2026 pendiente de validar</strong>
          <span>No se muestra una geometria generada ni un circuito de sustitucion.</span>
        </div>
      );
    }

    const points = vectorMap.path.map(([x, y]: VectorPoint) => `${x},${y}`).join(' ');
    const [sectorOne = 0, sectorTwo = 0] = vectorMap.sectorBreaks;
    const sectors = sectorOne && sectorTwo
      ? [
          { start: 0, end: sectorOne, className: 'sector-one' },
          { start: sectorOne, end: sectorTwo, className: 'sector-two' },
          { start: sectorTwo, end: 100, className: 'sector-three' },
        ]
      : [];

    return (
      <figure className="track-map-figure">
        <div className="track-stage vector-track-stage">
          <svg
            className="vector-track-map"
            viewBox="0 0 1000 560"
            role="img"
            aria-label={`Mapa vectorial 2026 del circuito ${track.name}, con ${vectorMap.corners.length} curvas numeradas`}
          >
            <polyline className="vector-track-bed" points={points} />
            {sectors.length > 0 ? (
              sectors.map((sector) => (
                <polyline
                  key={sector.className}
                  className={`vector-track-line ${sector.className}`}
                  points={points}
                  pathLength="100"
                  strokeDasharray={`${sector.end - sector.start} ${100 - (sector.end - sector.start)}`}
                  strokeDashoffset={-sector.start}
                />
              ))
            ) : (
              <polyline className="vector-track-line sector-provisional" points={points} />
            )}
            {vectorMap.corners.map((corner) => {
              const [trackX, trackY] = corner.track;
              const [textX, textY] = corner.text;

              return (
                <g className="vector-corner" key={corner.label}>
                  <line x1={trackX} y1={trackY} x2={textX} y2={textY} />
                  <circle cx={textX} cy={textY} r="14" />
                  <text x={textX} y={textY}>{corner.label}</text>
                </g>
              );
            })}
          </svg>
          <div className="vector-sector-key" aria-label="Colores de los sectores">
            {sectors.length > 0 ? (
              <>
                <span className="sector-one">S1</span>
                <span className="sector-two">S2</span>
                <span className="sector-three">S3</span>
              </>
            ) : (
              <span className="sector-provisional">Sectores pendientes</span>
            )}
          </div>
        </div>
        <figcaption>
          Geometria y curvas:{' '}
          <a href={vectorMap.sourceUrl} target="_blank" rel="noreferrer">
            {vectorMap.sourceName}
          </a>
          {track.id === 'madring' ? ' · Trazado 2026 provisional hasta su primera sesion oficial' : ''}
        </figcaption>
      </figure>
    );
  }

  const circuitImage = circuitImages[season][track.id];

  if (!circuitImage) {
    return (
      <div className="track-stage track-stage-unavailable" role="status">
        <strong>Mapa {season} pendiente de validar</strong>
        <span>No se muestra una geometria generada ni un circuito de sustitucion.</span>
      </div>
    );
  }

  const imageSrc = circuitImage.src.startsWith('/')
    ? `${import.meta.env.BASE_URL}${circuitImage.src.slice(1)}`
    : circuitImage.src;

  return (
    <figure className="track-map-figure">
      <div className="track-stage">
        <img
          className={circuitImage.fit === 'cover-top' ? 'lebalap-map map-cover-top' : 'lebalap-map'}
          src={imageSrc}
          alt={`Mapa ${season} del circuito ${track.name}, con ${track.corners} curvas numeradas`}
        />
      </div>
      <figcaption>
        Fuente cartografica:{' '}
        {circuitImage.sourceUrl ? (
          <a href={circuitImage.sourceUrl} target="_blank" rel="noreferrer">
            {circuitImage.source}
          </a>
        ) : (
          circuitImage.source
        )}
      </figcaption>
    </figure>
  );
}
