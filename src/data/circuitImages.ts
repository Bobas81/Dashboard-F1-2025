import type { SeasonMode } from './types';

export interface CircuitImage {
  src: string;
  source: string;
  sourceUrl?: string;
  fit?: 'contain' | 'cover-top';
}

const official2026 = (id: string, sourceUrl: string): CircuitImage => ({
  src: `/circuit-maps/2026-${id}.webp`,
  source: 'Formula 1 - mapa oficial 2026',
  sourceUrl,
});

const circuitImages2025: Record<string, CircuitImage> = {
  melbourne: { src: '/circuit-maps/melbourne-custom.png', source: 'Mapa personalizado - Albert Park' },
  shanghai: { src: '/circuit-maps/shanghai.png', source: 'Lebalap Academy - Shanghai' },
  suzuka: { src: '/circuit-maps/suzuka.png', source: 'Lebalap Academy - Suzuka' },
  bahrain: { src: '/circuit-maps/bahrain-custom.png', source: 'Mapa personalizado - Bahrain' },
  jeddah: { src: '/circuit-maps/jeddah-custom.png', source: 'Mapa personalizado - Jeddah Corniche Circuit' },
  miami: { src: '/circuit-maps/miami-custom.png', source: 'Mapa personalizado - Miami International Autodrome' },
  imola: { src: '/circuit-maps/imola-custom.png', source: 'Mapa personalizado - Imola' },
  monaco: { src: '/circuit-maps/monaco.png', source: 'Lebalap Academy - Monaco' },
  catalunya: { src: '/circuit-maps/catalunya.png', source: 'Lebalap Academy - Barcelona-Catalunya' },
  montreal: { src: '/circuit-maps/montreal.png', source: 'Lebalap Academy - Gilles Villeneuve' },
  spielberg: { src: '/circuit-maps/spielberg.png', source: 'Lebalap Academy - Red Bull Ring' },
  silverstone: { src: '/circuit-maps/silverstone-custom.png', source: 'Mapa personalizado - Silverstone Circuit' },
  spa: { src: '/circuit-maps/spa.png', source: 'Lebalap Academy - Spa-Francorchamps' },
  hungaroring: { src: '/circuit-maps/hungaroring.png', source: 'Lebalap Academy - Hungaroring' },
  zandvoort: { src: '/circuit-maps/zandvoort-custom.png', source: 'Mapa personalizado - Circuit Zandvoort' },
  monza: { src: '/circuit-maps/monza.png', source: 'Lebalap Academy - Monza' },
  baku: { src: '/circuit-maps/baku.png', source: 'Lebalap Academy - Baku' },
  singapore: { src: '/circuit-maps/singapore-custom.png', source: 'Mapa personalizado - Marina Bay Street Circuit' },
  cota: { src: '/circuit-maps/cota.png', source: 'Lebalap Academy - Circuit of the Americas' },
  mexico: { src: '/circuit-maps/mexico.png', source: 'Lebalap Academy - Hermanos Rodriguez' },
  interlagos: { src: '/circuit-maps/interlagos.png', source: 'Lebalap Academy - Interlagos' },
  vegas: { src: '/circuit-maps/vegas-custom.png', source: 'Mapa personalizado - Las Vegas Strip Circuit' },
  lusail: { src: '/circuit-maps/lusail-custom.png', source: 'Mapa personalizado - Lusail International Circuit' },
  yasmarina: { src: '/circuit-maps/yasmarina.png', source: 'Lebalap Academy - Yas Marina' },
};

const circuitImages2026: Record<string, CircuitImage> = {
  melbourne: official2026('melbourne', 'https://www.formula1.com/en/racing/2026/australia'),
  shanghai: official2026('shanghai', 'https://www.formula1.com/en/racing/2026/china'),
  suzuka: official2026('suzuka', 'https://www.formula1.com/en/racing/2026/japan'),
  bahrain: official2026('bahrain', 'https://www.formula1.com/en/racing/2026/pre-season-testing-1'),
  jeddah: official2026(
    'jeddah',
    'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000001/common/f1/2026/track/2026trackjeddahdetailed.webp',
  ),
  miami: official2026('miami', 'https://www.formula1.com/en/racing/2026/miami'),
  montreal: official2026('montreal', 'https://www.formula1.com/en/racing/2026/canada'),
  monaco: official2026('monaco', 'https://www.formula1.com/en/racing/2026/monaco'),
  catalunya: official2026('catalunya', 'https://www.formula1.com/en/racing/2026/barcelona-catalunya'),
  spielberg: official2026('spielberg', 'https://www.formula1.com/en/racing/2026/austria'),
  silverstone: official2026('silverstone', 'https://www.formula1.com/en/racing/2026/great-britain'),
  spa: official2026('spa', 'https://www.formula1.com/en/racing/2026/belgium'),
  hungaroring: official2026('hungaroring', 'https://www.formula1.com/en/racing/2026/hungary'),
  zandvoort: official2026('zandvoort', 'https://www.formula1.com/en/racing/2026/netherlands'),
  monza: official2026('monza', 'https://www.formula1.com/en/racing/2026/italy'),
  madring: official2026('madring', 'https://www.formula1.com/en/racing/2026/spain'),
  baku: official2026('baku', 'https://www.formula1.com/en/racing/2026/azerbaijan'),
  singapore: official2026('singapore', 'https://www.formula1.com/en/racing/2026/singapore'),
  cota: official2026('cota', 'https://www.formula1.com/en/racing/2026/united-states'),
  mexico: official2026('mexico', 'https://www.formula1.com/en/racing/2026/mexico'),
  interlagos: official2026('interlagos', 'https://www.formula1.com/en/racing/2026/brazil'),
  vegas: official2026('vegas', 'https://www.formula1.com/en/racing/2026/las-vegas'),
  lusail: official2026('lusail', 'https://www.formula1.com/en/racing/2026/qatar'),
  yasmarina: official2026('yasmarina', 'https://www.formula1.com/en/racing/2026/united-arab-emirates'),
};

export const circuitImages: Record<SeasonMode, Record<string, CircuitImage>> = {
  '2025': circuitImages2025,
  '2026': circuitImages2026,
};
