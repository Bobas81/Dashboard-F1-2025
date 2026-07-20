import type { SeasonMode } from './types';

export const adaptTextForSeason = (text: string, season: SeasonMode) => {
  if (season === '2025') return text;

  return text
    .replace(/DRS detection/gi, 'deteccion de Overtake Mode')
    .replace(/zonas DRS/gi, 'zonas de Straight Mode')
    .replace(/zona DRS/gi, 'zona de Straight Mode')
    .replace(/rectas DRS/gi, 'rectas de Straight Mode')
    .replace(/recta DRS/gi, 'recta de Straight Mode')
    .replace(/tramo DRS/gi, 'tramo de Straight Mode')
    .replace(/abre DRS/gi, 'activa Straight Mode')
    .replace(/abrir DRS/gi, 'activar Straight Mode')
    .replace(/DRS abierto/gi, 'Straight Mode activo')
    .replace(/DRS inmediato/gi, 'Straight Mode inmediato')
    .replace(/con DRS/gi, 'con Overtake Mode')
    .replace(/en DRS/gi, 'con Overtake Mode')
    .replace(/del DRS/gi, 'del Overtake Mode')
    .replace(/\bDRS\b/g, 'Overtake Mode');
};
