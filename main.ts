import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

const me = 230474;
const wilhelm = 56689;

const fileExists = async (path) => {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

const getAccessToken = async () => {
  const oldToken = JSON.parse(await fs.readFile('token.json', 'utf-8'));
  const response = await fetch(
    'https://vlatka.vertical-life.info/auth/realms/Vertical-Life/protocol/openid-connect/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&client_id=vertical-life-android-new&refresh_token=${oldToken.refresh_token}`,
    },
  );
  if (!response.ok) {
    console.log(await response.json());
    throw new Error('Failed to get access token');
  }
  return await response.json();
};

const fetchBoulder = async (token: string, id: number) => {
  const response = await fetch(
    `https://vlcapi.vertical-life.info/gym_boulders/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    console.log(await response.json());
    throw new Error('Failed to get gym boulder');
  }

  const result = await response.json();
  return result;
};

const fetchBoulders = async (token: string, ids: number[]) => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    process.stdout?.clearLine?.();
    process.stdout?.cursorTo?.(0);
    process.stdout.write(`Progress: ${i + 1} / ${ids.length}`);

    const gymBoulderPath = `./data/gym_boulders/${id}.json`;

    if (await fileExists(gymBoulderPath)) {
      const boulder = JSON.parse(await fs.readFile(gymBoulderPath, 'utf-8'));

      const stats = await fs.stat(gymBoulderPath);

      if (boulder.archived || Date.now() - stats.mtimeMs < 20 * 60 * 1000) {
        continue;
      }
    }

    const gymBoulder = await fetchBoulder(token, id);

    await fs.writeFile(gymBoulderPath, JSON.stringify(gymBoulder, null, 2));
  }
  process.stdout.write('\n');
};

async function fetchDataForUser(user: number) {
  const newToken = await getAccessToken();
  await fs.writeFile('token.json', JSON.stringify(newToken, null, 2));

  const limit = 150;
  let offset = 0;
  let singleReponse = [];
  const ascents = [];
  do {
    console.log(`Fetching ${offset} to ${offset + limit}`);
    const response = await fetch(
      `https://vlcapi.vertical-life.info/ascent/v1/app/users/${user}/ascents?offset=${offset}&limit=${limit}&zlaggable_filter=gym_bouldering&sorting=grade`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${newToken.access_token}`,
        },
      },
    );
    singleReponse = await response.json();
    offset += limit;
    ascents.push(...singleReponse);
  } while (singleReponse.length > 0);
  const ascentsStream = fsSync.createWriteStream(
    `./data/ascents_${user}.jsonl`,
  );
  for (const ascent of ascents) {
    ascentsStream.write(JSON.stringify(ascent));
    ascentsStream.write('\n');
  }
  ascentsStream.close();

  await fetchBoulders(
    newToken.access_token,
    ascents.map((a) => a.ascendable_id),
  );

  await (async () => {
    const response = await fetch(
      `https://vlcapi.vertical-life.info/gyms/69/zlaggables?zlaggable_type=GymBoulder`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${newToken.access_token}`,
        },
      },
    );
    if (!response.ok) {
      console.log(await response.json());
      throw new Error('Failed to get gym boulder');
    }
    const result = await response.json();
    await fetchBoulders(
      newToken.access_token,
      result.map((b) => b.id),
    );
  })();

  const bouldersStream = fsSync.createWriteStream('./data/gym_boulders.jsonl');
  const allBoulderFiles = await fs.readdir('./data/gym_boulders');
  for (const [i, p] of allBoulderFiles.entries()) {
    process.stdout?.clearLine?.();
    process.stdout?.cursorTo?.(0);
    process.stdout.write(`Progress: ${i + 1} / ${allBoulderFiles.length}`);

    const gymBoulderPath = path.join('./data/gym_boulders', p);
    let gymBoulder = JSON.parse(await fs.readFile(gymBoulderPath, 'utf8'));

    const stats = await fs.stat(gymBoulderPath);

    if (!gymBoulder.archived && Date.now() - stats.mtimeMs > 20 * 60 * 1000) {
      gymBoulder = await fetchBoulder(newToken.access_token, gymBoulder.id);

      await fs.writeFile(gymBoulderPath, JSON.stringify(gymBoulder, null, 2));
    }

    bouldersStream.write(JSON.stringify(gymBoulder));
    bouldersStream.write('\n');
  }

  bouldersStream.close();
  process.stdout.write('\n');
}

(async () => {
  await fetchDataForUser(me);
  await fetchDataForUser(wilhelm);
})();
