import { readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs';
import { appLocalDataDir, join } from '@tauri-apps/api/path';

const FILENAME = 'treasury-2025-2026.json';

async function getFilePath() {
  const dir = await appLocalDataDir();
  return await join(dir, FILENAME);
}

function getDefaultData() {
  return {
    financialYear: '2025-2026',
    income: [],
    expenses: [],
    lastUpdated: new Date().toISOString(),
  };
}

export async function loadData() {
  try {
    const path = await getFilePath();
    const fileExists = await exists(path);
    if (!fileExists) {
      const defaults = getDefaultData();
      await saveData(defaults);
      return defaults;
    }
    const content = await readTextFile(path);
    return JSON.parse(content);
  } catch (e) {
    console.error('Load failed:', e);
    return getDefaultData();
  }
}

export async function saveData(data) {
  try {
    const path = await getFilePath();
    const payload = { ...data, lastUpdated: new Date().toISOString() };
    await writeTextFile(path, JSON.stringify(payload, null, 2));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}
