import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { RosterInstance } from '../types/roster';

interface MordheimDB extends DBSchema {
  rosters: {
    key: string;
    value: RosterInstance;
  };
  settings: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<MordheimDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<MordheimDB>('mordheim-roster-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('rosters')) {
          db.createObjectStore('rosters', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

export async function listRosters(): Promise<RosterInstance[]> {
  const db = await getDb();
  const all = await db.getAll('rosters');
  return all.sort((a, b) => a.nom_bande.localeCompare(b.nom_bande));
}

export async function getRoster(id: string): Promise<RosterInstance | undefined> {
  const db = await getDb();
  return db.get('rosters', id);
}

export async function saveRoster(roster: RosterInstance): Promise<void> {
  const db = await getDb();
  await db.put('rosters', roster);
}

export async function deleteRoster(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('rosters', id);
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  return db.get('settings', key) as Promise<T | undefined>;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  await db.put('settings', value, key);
}
