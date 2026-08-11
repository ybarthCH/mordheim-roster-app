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
    }).catch((err) => {
      // Sans ce catch, un IndexedDB indisponible (navigation privée sur
      // certains navigateurs, profil corrompu) laisse dbPromise résolu sur
      // une promesse rejetée en cache : tout appel suivant à getDb() la
      // réutilise et échoue silencieusement de la même façon. On réinitialise
      // dbPromise pour qu'un futur appel retente l'ouverture au lieu de
      // rester bloqué sur le premier échec.
      dbPromise = null;
      console.error("IndexedDB : échec de l'ouverture de la base", err);
      throw err;
    });
  }
  return dbPromise;
}

export async function listRosters(): Promise<RosterInstance[]> {
  try {
    const db = await getDb();
    const all = await db.getAll('rosters');
    return all.sort((a, b) => a.nom_bande.localeCompare(b.nom_bande));
  } catch (err) {
    console.error('IndexedDB : échec de la lecture des bandes enregistrées', err);
    throw err;
  }
}

export async function getRoster(id: string): Promise<RosterInstance | undefined> {
  try {
    const db = await getDb();
    return await db.get('rosters', id);
  } catch (err) {
    console.error(`IndexedDB : échec de la lecture de la bande ${id}`, err);
    throw err;
  }
}

export async function saveRoster(roster: RosterInstance): Promise<void> {
  try {
    const db = await getDb();
    await db.put('rosters', roster);
  } catch (err) {
    console.error(`IndexedDB : échec de l'enregistrement de la bande ${roster.id} (${roster.nom_bande})`, err);
    throw err;
  }
}

export async function deleteRoster(id: string): Promise<void> {
  try {
    const db = await getDb();
    await db.delete('rosters', id);
  } catch (err) {
    console.error(`IndexedDB : échec de la suppression de la bande ${id}`, err);
    throw err;
  }
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  try {
    const db = await getDb();
    return (await db.get('settings', key)) as T | undefined;
  } catch (err) {
    console.error(`IndexedDB : échec de la lecture du réglage "${key}"`, err);
    throw err;
  }
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  try {
    const db = await getDb();
    await db.put('settings', value, key);
  } catch (err) {
    console.error(`IndexedDB : échec de l'écriture du réglage "${key}"`, err);
    throw err;
  }
}
