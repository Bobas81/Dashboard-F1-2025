import { mkdir, writeFile } from 'node:fs/promises';

const leaderboardBase = 'https://www.f1laps.com/f1-25/leaderboard';

const tracks = [
  ['melbourne', 'australia'],
  ['shanghai', 'china'],
  ['suzuka', 'japan'],
  ['bahrain', 'bahrain'],
  ['jeddah', 'saudi_arabia'],
  ['miami', 'miami'],
  ['imola', 'imola'],
  ['monaco', 'monaco'],
  ['catalunya', 'spain'],
  ['montreal', 'canada'],
  ['spielberg', 'austria'],
  ['silverstone', 'silverstone'],
  ['spa', 'spa'],
  ['hungaroring', 'hungary'],
  ['zandvoort', 'netherlands'],
  ['monza', 'monza'],
  ['baku', 'azerbaijan'],
  ['singapore', 'singapore'],
  ['cota', 'usa'],
  ['mexico', 'mexico'],
  ['interlagos', 'brazil'],
  ['vegas', 'las_vegas'],
  ['lusail', 'qatar'],
  ['yasmarina', 'abudhabi'],
];

const stripTags = (value) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const parseRows = (html, slug) => {
  const rows = [...html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)];
  const parsed = [];

  for (const rowMatch of rows) {
    const rowHtml = rowMatch[0];
    const rowText = stripTags(rowHtml);
    const rankMatch = rowText.match(/^\s*(\d{1,2})\b/);
    if (!rankMatch) continue;

    const anchors = [...rowHtml.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((match) => stripTags(match[1]));
    const date = anchors.find((value) => /^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}$/.test(value));
    const time = anchors.find((value) => /^\d+:\d{2}\.\d{3}$/.test(value));
    const timeIndex = anchors.findIndex((value) => value === time);
    const driver = timeIndex >= 0 ? anchors[timeIndex + 1] : undefined;
    const team = timeIndex >= 0 ? anchors[timeIndex + 2] : undefined;

    if (!time || !driver || !team) continue;

    const condition = rowText.includes('Wet conditions') ? 'Time Trial mojado' : 'Time Trial seco';

    parsed.push({
      rank: parsed.length + 1,
      time,
      driver,
      platform: 'PS5',
      team,
      condition: `${condition}${date ? ` - ${date}` : ''}`,
      source: `F1Laps F1 25 leaderboard (${slug}), actualizado automaticamente`,
      status: 'verified',
    });

    if (parsed.length === 3) break;
  }

  return parsed;
};

const fetchTrack = async (trackId, slug) => {
  const url = `${leaderboardBase}/${slug}/`;
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Dashboard-F1-2025 updater (+https://github.com/Bobas81/Dashboard-F1-2025)',
      accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const laps = parseRows(html, slug);

  if (laps.length < 3) {
    throw new Error(`Solo se pudieron leer ${laps.length} vueltas para ${trackId}`);
  }

  return { url, laps };
};

const main = async () => {
  const fetchedAt = new Date().toISOString();
  const output = {
    fetchedAt,
    source: leaderboardBase,
    tracks: {},
    errors: {},
  };

  for (const [trackId, slug] of tracks) {
    try {
      const { url, laps } = await fetchTrack(trackId, slug);
      output.tracks[trackId] = laps.map((lap) => ({
        ...lap,
        source: `${lap.source}: ${url}`,
      }));
      console.log(`OK ${trackId}: ${laps.map((lap) => lap.time).join(', ')}`);
    } catch (error) {
      output.errors[trackId] = error instanceof Error ? error.message : String(error);
      console.warn(`WARN ${trackId}: ${output.errors[trackId]}`);
    }
  }

  await mkdir('public/data', { recursive: true });
  await writeFile('public/data/f1laps-times.json', `${JSON.stringify(output, null, 2)}\n`);

  const failed = Object.keys(output.errors).length;
  if (failed === tracks.length) {
    throw new Error('No se pudo actualizar ningun circuito desde F1Laps.');
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
