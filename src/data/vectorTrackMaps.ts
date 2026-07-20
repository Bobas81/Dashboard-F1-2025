import rawVectorTrackMaps from './vectorTrackMaps.json';

export type VectorPoint = [number, number];

export interface VectorCorner {
  label: string;
  track: VectorPoint;
  text: VectorPoint;
}

export interface VectorTrackMap {
  sourceName: string;
  sourceUrl: string;
  path: VectorPoint[];
  corners: VectorCorner[];
  sectorBreaks: number[];
}

export const vectorTrackMaps = rawVectorTrackMaps as unknown as Record<string, VectorTrackMap>;
