import type { GameLap, LapRecord } from './types';

// Real references are curated local records/poles. F1 25 times were fetched from F1Laps leaderboard pages on 2026-05-02.
export const realReferenceTimes = {
  melbourne: [
    { rank: 1 as const, time: '1:19.813', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Race lap record, 2024', source: 'F1 real reference: Race lap record, 2024', status: 'verified' },
    { rank: 2 as const, time: '1:15.915', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Pole reference, 2019', source: 'F1 real reference: Pole reference, 2019', status: 'verified' },
    { rank: 3 as const, time: '1:17.868', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Pole reference, 2022', source: 'F1 real reference: Pole reference, 2022', status: 'verified' },
  ],
  shanghai: [
    { rank: 1 as const, time: '1:32.238', driver: 'Michael Schumacher', team: 'Ferrari', year: 'Race lap record, 2004', source: 'F1 real reference: Race lap record, 2004', status: 'verified' },
    { rank: 2 as const, time: '1:31.095', driver: 'Sebastian Vettel', team: 'Ferrari', year: 'Pole reference, 2018', source: 'F1 real reference: Pole reference, 2018', status: 'verified' },
    { rank: 3 as const, time: '1:32.544', driver: 'Fernando Alonso', team: 'Renault', year: 'Pole reference, 2005', source: 'F1 real reference: Pole reference, 2005', status: 'verified' },
  ],
  suzuka: [
    { rank: 1 as const, time: '1:30.983', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Race lap record, 2019', source: 'F1 real reference: Race lap record, 2019', status: 'verified' },
    { rank: 2 as const, time: '1:27.064', driver: 'Sebastian Vettel', team: 'Ferrari', year: 'Pole reference, 2019', source: 'F1 real reference: Pole reference, 2019', status: 'verified' },
    { rank: 3 as const, time: '1:28.197', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2023', source: 'F1 real reference: Pole reference, 2023', status: 'verified' },
  ],
  bahrain: [
    { rank: 1 as const, time: '1:31.447', driver: 'Pedro de la Rosa', team: 'McLaren', year: 'Race lap record, 2005', source: 'F1 real reference: Race lap record, 2005', status: 'verified' },
    { rank: 2 as const, time: '1:27.264', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Pole reference, 2020', source: 'F1 real reference: Pole reference, 2020', status: 'verified' },
    { rank: 3 as const, time: '1:29.179', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2023', source: 'F1 real reference: Pole reference, 2023', status: 'verified' },
  ],
  jeddah: [
    { rank: 1 as const, time: '1:30.734', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Race lap record, 2021', source: 'F1 real reference: Race lap record, 2021', status: 'verified' },
    { rank: 2 as const, time: '1:27.511', driver: 'Sergio Perez', team: 'Red Bull', year: 'Pole reference, 2023', source: 'F1 real reference: Pole reference, 2023', status: 'verified' },
    { rank: 3 as const, time: '1:27.472', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  miami: [
    { rank: 1 as const, time: '1:29.708', driver: 'Max Verstappen', team: 'Red Bull', year: 'Race lap record, 2023', source: 'F1 real reference: Race lap record, 2023', status: 'verified' },
    { rank: 2 as const, time: '1:26.841', driver: 'Sergio Perez', team: 'Red Bull', year: 'Pole reference, 2023', source: 'F1 real reference: Pole reference, 2023', status: 'verified' },
    { rank: 3 as const, time: '1:27.241', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Pole reference, 2022', source: 'F1 real reference: Pole reference, 2022', status: 'verified' },
  ],
  imola: [
    { rank: 1 as const, time: '1:15.484', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Race lap record, 2020', source: 'F1 real reference: Race lap record, 2020', status: 'verified' },
    { rank: 2 as const, time: '1:13.609', driver: 'Valtteri Bottas', team: 'Mercedes', year: 'Pole reference, 2020', source: 'F1 real reference: Pole reference, 2020', status: 'verified' },
    { rank: 3 as const, time: '1:14.746', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  monaco: [
    { rank: 1 as const, time: '1:12.909', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Race lap record, 2021', source: 'F1 real reference: Race lap record, 2021', status: 'verified' },
    { rank: 2 as const, time: '1:10.166', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Pole reference, 2019', source: 'F1 real reference: Pole reference, 2019', status: 'verified' },
    { rank: 3 as const, time: '1:10.270', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  catalunya: [
    { rank: 1 as const, time: '1:16.330', driver: 'Max Verstappen', team: 'Red Bull', year: 'Race lap record, 2023 layout', source: 'F1 real reference: Race lap record, 2023 layout', status: 'verified' },
    { rank: 2 as const, time: '1:11.383', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2023 layout', source: 'F1 real reference: Pole reference, 2023 layout', status: 'verified' },
    { rank: 3 as const, time: '1:12.272', driver: 'Lando Norris', team: 'McLaren', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  montreal: [
    { rank: 1 as const, time: '1:13.078', driver: 'Valtteri Bottas', team: 'Mercedes', year: 'Race lap record, 2019', source: 'F1 real reference: Race lap record, 2019', status: 'verified' },
    { rank: 2 as const, time: '1:10.240', driver: 'Sebastian Vettel', team: 'Ferrari', year: 'Pole reference, 2019', source: 'F1 real reference: Pole reference, 2019', status: 'verified' },
    { rank: 3 as const, time: '1:12.000', driver: 'George Russell', team: 'Mercedes', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  spielberg: [
    { rank: 1 as const, time: '1:05.619', driver: 'Carlos Sainz', team: 'McLaren', year: 'Race lap record, 2020', source: 'F1 real reference: Race lap record, 2020', status: 'verified' },
    { rank: 2 as const, time: '1:02.939', driver: 'Valtteri Bottas', team: 'Mercedes', year: 'Pole reference, 2020', source: 'F1 real reference: Pole reference, 2020', status: 'verified' },
    { rank: 3 as const, time: '1:04.314', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  silverstone: [
    { rank: 1 as const, time: '1:27.097', driver: 'Max Verstappen', team: 'Red Bull', year: 'Race lap record, 2020', source: 'F1 real reference: Race lap record, 2020', status: 'verified' },
    { rank: 2 as const, time: '1:24.303', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Pole reference, 2020', source: 'F1 real reference: Pole reference, 2020', status: 'verified' },
    { rank: 3 as const, time: '1:25.819', driver: 'George Russell', team: 'Mercedes', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  spa: [
    { rank: 1 as const, time: '1:46.286', driver: 'Valtteri Bottas', team: 'Mercedes', year: 'Race lap record, 2018', source: 'F1 real reference: Race lap record, 2018', status: 'verified' },
    { rank: 2 as const, time: '1:41.252', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Pole reference, 2020', source: 'F1 real reference: Pole reference, 2020', status: 'verified' },
    { rank: 3 as const, time: '1:43.665', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  hungaroring: [
    { rank: 1 as const, time: '1:16.627', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Race lap record, 2020', source: 'F1 real reference: Race lap record, 2020', status: 'verified' },
    { rank: 2 as const, time: '1:13.447', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Pole reference, 2020', source: 'F1 real reference: Pole reference, 2020', status: 'verified' },
    { rank: 3 as const, time: '1:15.419', driver: 'Lando Norris', team: 'McLaren', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  zandvoort: [
    { rank: 1 as const, time: '1:11.097', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Race lap record, 2021', source: 'F1 real reference: Race lap record, 2021', status: 'verified' },
    { rank: 2 as const, time: '1:08.885', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2021', source: 'F1 real reference: Pole reference, 2021', status: 'verified' },
    { rank: 3 as const, time: '1:10.567', driver: 'Lando Norris', team: 'McLaren', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  monza: [
    { rank: 1 as const, time: '1:21.046', driver: 'Rubens Barrichello', team: 'Ferrari', year: 'Race lap record, 2004', source: 'F1 real reference: Race lap record, 2004', status: 'verified' },
    { rank: 2 as const, time: '1:18.887', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Pole reference, 2020', source: 'F1 real reference: Pole reference, 2020', status: 'verified' },
    { rank: 3 as const, time: '1:19.327', driver: 'Lando Norris', team: 'McLaren', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  baku: [
    { rank: 1 as const, time: '1:43.009', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Race lap record, 2019', source: 'F1 real reference: Race lap record, 2019', status: 'verified' },
    { rank: 2 as const, time: '1:40.203', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Pole reference, 2023', source: 'F1 real reference: Pole reference, 2023', status: 'verified' },
    { rank: 3 as const, time: '1:41.365', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  singapore: [
    { rank: 1 as const, time: '1:35.867', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Race lap record, 2023 layout', source: 'F1 real reference: Race lap record, 2023 layout', status: 'verified' },
    { rank: 2 as const, time: '1:29.525', driver: 'Carlos Sainz', team: 'Ferrari', year: 'Pole reference, 2023 layout', source: 'F1 real reference: Pole reference, 2023 layout', status: 'verified' },
    { rank: 3 as const, time: '1:29.525', driver: 'Lando Norris', team: 'McLaren', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  cota: [
    { rank: 1 as const, time: '1:36.169', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Race lap record, 2019', source: 'F1 real reference: Race lap record, 2019', status: 'verified' },
    { rank: 2 as const, time: '1:32.029', driver: 'Valtteri Bottas', team: 'Mercedes', year: 'Pole reference, 2019', source: 'F1 real reference: Pole reference, 2019', status: 'verified' },
    { rank: 3 as const, time: '1:32.330', driver: 'Lando Norris', team: 'McLaren', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  mexico: [
    { rank: 1 as const, time: '1:17.774', driver: 'Valtteri Bottas', team: 'Mercedes', year: 'Race lap record, 2021', source: 'F1 real reference: Race lap record, 2021', status: 'verified' },
    { rank: 2 as const, time: '1:14.758', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2023', source: 'F1 real reference: Pole reference, 2023', status: 'verified' },
    { rank: 3 as const, time: '1:15.946', driver: 'Carlos Sainz', team: 'Ferrari', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  interlagos: [
    { rank: 1 as const, time: '1:10.540', driver: 'Valtteri Bottas', team: 'Mercedes', year: 'Race lap record, 2018', source: 'F1 real reference: Race lap record, 2018', status: 'verified' },
    { rank: 2 as const, time: '1:07.281', driver: 'Lewis Hamilton', team: 'Mercedes', year: 'Pole reference, 2018', source: 'F1 real reference: Pole reference, 2018', status: 'verified' },
    { rank: 3 as const, time: '1:23.405', driver: 'Lando Norris', team: 'McLaren', year: 'Wet pole reference, 2024', source: 'F1 real reference: Wet pole reference, 2024', status: 'verified' },
  ],
  vegas: [
    { rank: 1 as const, time: '1:35.490', driver: 'Oscar Piastri', team: 'McLaren', year: 'Race lap record, 2023', source: 'F1 real reference: Race lap record, 2023', status: 'verified' },
    { rank: 2 as const, time: '1:32.312', driver: 'Charles Leclerc', team: 'Ferrari', year: 'Pole reference, 2023', source: 'F1 real reference: Pole reference, 2023', status: 'verified' },
    { rank: 3 as const, time: '1:32.312', driver: 'George Russell', team: 'Mercedes', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
  lusail: [
    { rank: 1 as const, time: '1:24.319', driver: 'Max Verstappen', team: 'Red Bull', year: 'Race lap record, 2023', source: 'F1 real reference: Race lap record, 2023', status: 'verified' },
    { rank: 2 as const, time: '1:23.778', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2023', source: 'F1 real reference: Pole reference, 2023', status: 'verified' },
    { rank: 3 as const, time: '1:20.520', driver: 'Lando Norris', team: 'McLaren', year: 'Sprint shootout reference, 2024', source: 'F1 real reference: Sprint shootout reference, 2024', status: 'verified' },
  ],
  yasmarina: [
    { rank: 1 as const, time: '1:26.103', driver: 'Max Verstappen', team: 'Red Bull', year: 'Race lap record, 2021 layout', source: 'F1 real reference: Race lap record, 2021 layout', status: 'verified' },
    { rank: 2 as const, time: '1:22.109', driver: 'Max Verstappen', team: 'Red Bull', year: 'Pole reference, 2021 layout', source: 'F1 real reference: Pole reference, 2021 layout', status: 'verified' },
    { rank: 3 as const, time: '1:22.595', driver: 'Lando Norris', team: 'McLaren', year: 'Pole reference, 2024', source: 'F1 real reference: Pole reference, 2024', status: 'verified' },
  ],
} satisfies Record<string, LapRecord[]>;

export const f1LapsGameTimes = {
  melbourne: [
    { rank: 1 as const, time: '1:15.974', driver: 'leoncon99', platform: 'PS5' as const, team: 'Aston Martin', condition: 'Time Trial seco - Dec 22, 2025', source: 'F1Laps F1 25 leaderboard (australia), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:16.114', driver: 'woodbassniki', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Apr 19, 2026', source: 'F1Laps F1 25 leaderboard (australia), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:16.121', driver: 'Skylxrd', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Mar 20, 2026', source: 'F1Laps F1 25 leaderboard (australia), consultado 2026-05-02', status: 'verified' },
  ],
  shanghai: [
    { rank: 1 as const, time: '1:32.174', driver: 'dezzali@gmail.', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Apr 12, 2026', source: 'F1Laps F1 25 leaderboard (china), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:32.408', driver: 'ago-1097', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Jan 02, 2026', source: 'F1Laps F1 25 leaderboard (china), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:32.419', driver: 'Skylxrd', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Mar 20, 2026', source: 'F1Laps F1 25 leaderboard (china), consultado 2026-05-02', status: 'verified' },
  ],
  suzuka: [
    { rank: 1 as const, time: '1:27.015', driver: 'itzyliaab', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Apr 24, 2026', source: 'F1Laps F1 25 leaderboard (japan), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:27.345', driver: 'woodbassniki', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Apr 21, 2026', source: 'F1Laps F1 25 leaderboard (japan), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:27.470', driver: 'Skylxrd', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Mar 20, 2026', source: 'F1Laps F1 25 leaderboard (japan), consultado 2026-05-02', status: 'verified' },
  ],
  bahrain: [
    { rank: 1 as const, time: '1:27.964', driver: 'Brazzouz', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Mar 28, 2026', source: 'F1Laps F1 25 leaderboard (bahrain), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:28.170', driver: 'woodbassniki', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Apr 30, 2026', source: 'F1Laps F1 25 leaderboard (bahrain), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:28.446', driver: 'Riku', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Apr 02, 2026', source: 'F1Laps F1 25 leaderboard (bahrain), consultado 2026-05-02', status: 'verified' },
  ],
  jeddah: [
    { rank: 1 as const, time: '1:27.664', driver: 'woodbassniki', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Apr 19, 2026', source: 'F1Laps F1 25 leaderboard (saudi_arabia), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:27.828', driver: 'ago-1097', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Jan 01, 2026', source: 'F1Laps F1 25 leaderboard (saudi_arabia), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:27.972', driver: 'ok1ni', platform: 'PS5' as const, team: 'Racing Bulls', condition: 'Time Trial seco - Dec 01, 2025', source: 'F1Laps F1 25 leaderboard (saudi_arabia), consultado 2026-05-02', status: 'verified' },
  ],
  miami: [
    { rank: 1 as const, time: '1:26.262', driver: 'Joshua Apaya', platform: 'PS5' as const, team: 'Aston Martin', condition: 'Time Trial seco - Jun 06, 2025', source: 'F1Laps F1 25 leaderboard (miami), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:26.580', driver: 'Pixsticax', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Sep 21, 2025', source: 'F1Laps F1 25 leaderboard (miami), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:26.602', driver: 'Ethan24', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Mar 21, 2026', source: 'F1Laps F1 25 leaderboard (miami), consultado 2026-05-02', status: 'verified' },
  ],
  imola: [
    { rank: 1 as const, time: '1:14.472', driver: 'Laurin Senna', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Feb 17, 2026', source: 'F1Laps F1 25 leaderboard (imola), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:15.091', driver: 'ynic222', platform: 'PS5' as const, team: 'Racing Bulls', condition: 'Time Trial seco - Mar 03, 2026', source: 'F1Laps F1 25 leaderboard (imola), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:15.201', driver: 'bryanoliveira', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - May 29, 2025', source: 'F1Laps F1 25 leaderboard (imola), consultado 2026-05-02', status: 'verified' },
  ],
  monaco: [
    { rank: 1 as const, time: '1:10.031', driver: 'woodbassniki', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Apr 26, 2026', source: 'F1Laps F1 25 leaderboard (monaco), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:10.175', driver: 'mm1611889', platform: 'PS5' as const, team: 'Aston Martin', condition: 'Time Trial seco - Mar 15, 2026', source: 'F1Laps F1 25 leaderboard (monaco), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:10.509', driver: 'Goughzi', platform: 'PS5' as const, team: 'Haas F1 Team', condition: 'Time Trial seco - Oct 21, 2025', source: 'F1Laps F1 25 leaderboard (monaco), consultado 2026-05-02', status: 'verified' },
  ],
  catalunya: [
    { rank: 1 as const, time: '1:12.537', driver: 'woodbassniki', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Apr 26, 2026', source: 'F1Laps F1 25 leaderboard (spain), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:12.557', driver: 'MikeyDeBoi', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Jun 19, 2025', source: 'F1Laps F1 25 leaderboard (spain), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:12.566', driver: 'leoelias0610', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Apr 09, 2026', source: 'F1Laps F1 25 leaderboard (spain), consultado 2026-05-02', status: 'verified' },
  ],
  montreal: [
    { rank: 1 as const, time: '1:10.045', driver: 'stefwolterspri', platform: 'PS5' as const, team: 'Kick Sauber', condition: 'Time Trial seco - Mar 28, 2026', source: 'F1Laps F1 25 leaderboard (canada), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:10.314', driver: 'gdunks', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Oct 18, 2025', source: 'F1Laps F1 25 leaderboard (canada), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:10.337', driver: 'igorbrtn09', platform: 'PS5' as const, team: 'Aston Martin', condition: 'Time Trial seco - Sep 11, 2025', source: 'F1Laps F1 25 leaderboard (canada), consultado 2026-05-02', status: 'verified' },
  ],
  spielberg: [
    { rank: 1 as const, time: '1:04.245', driver: 'leoelias0610', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Mar 19, 2026', source: 'F1Laps F1 25 leaderboard (austria), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:04.394', driver: 'gloriusaverett', platform: 'PS5' as const, team: 'Mercedes', condition: 'Time Trial seco - Apr 29, 2026', source: 'F1Laps F1 25 leaderboard (austria), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:04.421', driver: 'Rattlehead', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Feb 21, 2026', source: 'F1Laps F1 25 leaderboard (austria), consultado 2026-05-02', status: 'verified' },
  ],
  silverstone: [
    { rank: 1 as const, time: '1:26.690', driver: 'woodbassniki', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Apr 22, 2026', source: 'F1Laps F1 25 leaderboard (silverstone), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:26.833', driver: 'leoelias0610', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Apr 09, 2026', source: 'F1Laps F1 25 leaderboard (silverstone), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:27.020', driver: 'Vans-Racing', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Aug 29, 2025', source: 'F1Laps F1 25 leaderboard (silverstone), consultado 2026-05-02', status: 'verified' },
  ],
  spa: [
    { rank: 1 as const, time: '1:42.846', driver: 'sebv_5d72', platform: 'PS5' as const, team: 'Haas F1 Team', condition: 'Time Trial seco - Feb 22, 2026', source: 'F1Laps F1 25 leaderboard (spa), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:42.937', driver: 'Riku', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Apr 07, 2026', source: 'F1Laps F1 25 leaderboard (spa), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:42.971', driver: 'Rattlehead', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Feb 22, 2026', source: 'F1Laps F1 25 leaderboard (spa), consultado 2026-05-02', status: 'verified' },
  ],
  hungaroring: [
    { rank: 1 as const, time: '1:15.877', driver: 'AmritoBOGOSS', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Aug 13, 2025', source: 'F1Laps F1 25 leaderboard (hungary), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:15.938', driver: 'gloriusaverett', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Apr 19, 2026', source: 'F1Laps F1 25 leaderboard (hungary), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:16.032', driver: 'Riku', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Apr 08, 2026', source: 'F1Laps F1 25 leaderboard (hungary), consultado 2026-05-02', status: 'verified' },
  ],
  zandvoort: [
    { rank: 1 as const, time: '1:09.024', driver: 'Matex', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Mar 15, 2026', source: 'F1Laps F1 25 leaderboard (netherlands), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:09.500', driver: 'gdunks', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Oct 24, 2025', source: 'F1Laps F1 25 leaderboard (netherlands), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:09.541', driver: 'mohamedviaam', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Dec 02, 2025', source: 'F1Laps F1 25 leaderboard (netherlands), consultado 2026-05-02', status: 'verified' },
  ],
  monza: [
    { rank: 1 as const, time: '1:18.908', driver: 'Ethan24', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Apr 10, 2026', source: 'F1Laps F1 25 leaderboard (monza), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:19.071', driver: 'leoelias0610', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Apr 09, 2026', source: 'F1Laps F1 25 leaderboard (monza), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:19.123', driver: 'MichiWizard', platform: 'PS5' as const, team: 'Kick Sauber', condition: 'Time Trial seco - Sep 15, 2025', source: 'F1Laps F1 25 leaderboard (monza), consultado 2026-05-02', status: 'verified' },
  ],
  baku: [
    { rank: 1 as const, time: '1:39.208', driver: 'nicopost23', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Mar 30, 2026', source: 'F1Laps F1 25 leaderboard (azerbaijan), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:39.463', driver: 'Dondej212', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Nov 09, 2025', source: 'F1Laps F1 25 leaderboard (azerbaijan), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:39.735', driver: 'leoelias0610', platform: 'PS5' as const, team: 'Mercedes', condition: 'Time Trial seco - Mar 19, 2026', source: 'F1Laps F1 25 leaderboard (azerbaijan), consultado 2026-05-02', status: 'verified' },
  ],
  singapore: [
    { rank: 1 as const, time: '1:28.621', driver: 'matimk', platform: 'PS5' as const, team: 'Ferrari', condition: 'Time Trial seco - Jan 16, 2026', source: 'F1Laps F1 25 leaderboard (singapore), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:29.196', driver: 'Riku', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Apr 15, 2026', source: 'F1Laps F1 25 leaderboard (singapore), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:29.276', driver: 'lazr00', platform: 'PS5' as const, team: 'Racing Bulls', condition: 'Time Trial seco - Mar 15, 2026', source: 'F1Laps F1 25 leaderboard (singapore), consultado 2026-05-02', status: 'verified' },
  ],
  cota: [
    { rank: 1 as const, time: '1:32.979', driver: 'miqdadlilani', platform: 'PS5' as const, team: 'Aston Martin', condition: 'Time Trial seco - Feb 17, 2026', source: 'F1Laps F1 25 leaderboard (usa), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:33.048', driver: 'sbinottos', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Mar 29, 2026', source: 'F1Laps F1 25 leaderboard (usa), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:33.066', driver: 'gdunks', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Dec 02, 2025', source: 'F1Laps F1 25 leaderboard (usa), consultado 2026-05-02', status: 'verified' },
  ],
  mexico: [
    { rank: 1 as const, time: '1:15.360', driver: 'germanhotdog123', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Dec 18, 2025', source: 'F1Laps F1 25 leaderboard (mexico), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:15.668', driver: 'Phoenix90_', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Jun 28, 2025', source: 'F1Laps F1 25 leaderboard (mexico), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:15.758', driver: 'Riku', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Apr 17, 2026', source: 'F1Laps F1 25 leaderboard (mexico), consultado 2026-05-02', status: 'verified' },
  ],
  interlagos: [
    { rank: 1 as const, time: '1:08.287', driver: 'leoelias0610', platform: 'PS5' as const, team: 'Haas F1 Team', condition: 'Time Trial seco - Mar 19, 2026', source: 'F1Laps F1 25 leaderboard (brazil), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:08.328', driver: 'shsnugget7', platform: 'PS5' as const, team: 'Williams', condition: 'Time Trial seco - Feb 23, 2026', source: 'F1Laps F1 25 leaderboard (brazil), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:08.405', driver: 'robbbiee96', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Aug 15, 2025', source: 'F1Laps F1 25 leaderboard (brazil), consultado 2026-05-02', status: 'verified' },
  ],
  vegas: [
    { rank: 1 as const, time: '1:32.206', driver: 'leoelias0610', platform: 'PS5' as const, team: 'Mercedes', condition: 'Time Trial seco - Apr 09, 2026', source: 'F1Laps F1 25 leaderboard (las_vegas), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:32.290', driver: 'Riku', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Apr 20, 2026', source: 'F1Laps F1 25 leaderboard (las_vegas), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:32.417', driver: 'Saiyzzo', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Oct 20, 2025', source: 'F1Laps F1 25 leaderboard (las_vegas), consultado 2026-05-02', status: 'verified' },
  ],
  lusail: [
    { rank: 1 as const, time: '1:21.704', driver: '1loveof1', platform: 'PS5' as const, team: 'Mercedes', condition: 'Time Trial seco - Dec 27, 2025', source: 'F1Laps F1 25 leaderboard (qatar), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:22.069', driver: 'Riku', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Apr 21, 2026', source: 'F1Laps F1 25 leaderboard (qatar), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:22.132', driver: 'gdunks', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Oct 23, 2025', source: 'F1Laps F1 25 leaderboard (qatar), consultado 2026-05-02', status: 'verified' },
  ],
  yasmarina: [
    { rank: 1 as const, time: '1:23.602', driver: 'leoelias0610', platform: 'PS5' as const, team: 'McLaren', condition: 'Time Trial seco - Mar 28, 2026', source: 'F1Laps F1 25 leaderboard (abudhabi), consultado 2026-05-02', status: 'verified' },
    { rank: 2 as const, time: '1:23.757', driver: 'Riku', platform: 'PS5' as const, team: 'F1 Custom Team', condition: 'Time Trial seco - Apr 24, 2026', source: 'F1Laps F1 25 leaderboard (abudhabi), consultado 2026-05-02', status: 'verified' },
    { rank: 3 as const, time: '1:23.785', driver: 'jakub08dg', platform: 'PS5' as const, team: 'Red Bull Racing', condition: 'Time Trial seco - Mar 23, 2026', source: 'F1Laps F1 25 leaderboard (abudhabi), consultado 2026-05-02', status: 'verified' },
  ],
} satisfies Record<string, GameLap[]>;
