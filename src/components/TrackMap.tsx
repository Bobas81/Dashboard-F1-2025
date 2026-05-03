import type { Track } from '../data/types';
import { circuitImages } from '../data/circuitImages';

interface Props {
  track: Track;
}

export function TrackMap({ track }: Props) {
  const circuitImage = circuitImages[track.id];
  const imageSrc = circuitImage?.src.startsWith('/')
    ? `${import.meta.env.BASE_URL}${circuitImage.src.slice(1)}`
    : circuitImage?.src;

  return (
    <div className="track-stage">
      {circuitImage ? (
        <>
          <img className={circuitImage.fit === 'cover-top' ? 'lebalap-map map-cover-top' : 'lebalap-map'} src={imageSrc} alt={`Mapa del circuito ${track.name}`} />
        </>
      ) : (
        <>
          <svg viewBox={track.map.viewBox} role="img" aria-label={`Mapa del circuito ${track.name}`}>
            <defs>
              <filter id="track-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path className="track-shadow" d={track.map.path} />
            <path className="track-base" d={track.map.path} />
            <path className="track-sector sector-one" d={track.map.path} pathLength="100" />
            <path className="track-sector sector-two" d={track.map.path} pathLength="100" />
            <path className="track-sector sector-three" d={track.map.path} pathLength="100" />
            {track.map.drs.map((drs) => (
              <g key={drs.label}>
                <line className="drs-line" x1={drs.x1} y1={drs.y1} x2={drs.x2} y2={drs.y2} />
                <text className="drs-label" x={(drs.x1 + drs.x2) / 2} y={(drs.y1 + drs.y2) / 2 - 10}>
                  {drs.label}
                </text>
              </g>
            ))}
            {track.map.corners.map((corner) => (
              <g key={corner.label}>
                <circle className="corner-dot" cx={corner.x} cy={corner.y} r="12" />
                <text className="corner-label" x={corner.x} y={corner.y + 4}>
                  {corner.label}
                </text>
              </g>
            ))}
            <g>
              <circle className="speed-dot" cx={track.map.speedTrap.x} cy={track.map.speedTrap.y} r="10" />
              <text className="speed-label" x={track.map.speedTrap.x + 16} y={track.map.speedTrap.y + 5}>
                SPEED TRAP
              </text>
            </g>
            <g>
              <rect className="start-box" x={track.map.start.x - 18} y={track.map.start.y - 18} width="36" height="36" rx="4" />
              <text className="start-text" x={track.map.start.x} y={track.map.start.y + 5}>
                S/F
              </text>
            </g>
          </svg>
        </>
      )}
    </div>
  );
}
