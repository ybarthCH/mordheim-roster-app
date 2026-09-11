// Intégration Google Drive minimale : OAuth via Google Identity Services
// (script externe chargé au moment de l'affichage de l'écran Réglages,
// jamais empaqueté dans le bundle de l'app) + appels REST directs à l'API
// Drive (fetch, pas de client gapi — cohérent avec le peu de dépendances du
// projet) pour stocker un unique fichier de sauvegarde dans appDataFolder,
// le dossier privé réservé à l'app, invisible dans le Drive normal du
// joueur. Pas de scope email/profile : on n'affiche jamais quel compte est
// connecté, seulement l'état et la date de dernière sauvegarde.
import { getSetting, setSetting } from '../db/db';

// Remplacé par le vrai Client ID OAuth une fois fourni par Yannick. Ce n'est
// pas un secret : un Client ID OAuth "Web application" est un identifiant
// public (contrairement à un client secret), sans risque à committer en
// clair — la sécurité tient aux origines JavaScript autorisées configurées
// côté Google Cloud Console, pas au secret de cette valeur.
const GOOGLE_CLIENT_ID = 'REMPLACER_PAR_LE_CLIENT_ID.apps.googleusercontent.com';

const SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
const NOM_FICHIER = 'musterheim-backup.json';
const CLE_FICHIER_ID = 'google_drive_backup_file_id';
const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';

type ReponseJeton = { access_token?: string; error?: string };
type ClientJeton = { requestAccessToken: (options?: { prompt?: string }) => void };

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (response: ReponseJeton) => void;
          }): ClientJeton;
        };
      };
    };
  }
}

export function googleDriveConfigure(): boolean {
  return GOOGLE_CLIENT_ID !== 'REMPLACER_PAR_LE_CLIENT_ID.apps.googleusercontent.com';
}

let scriptPromise: Promise<void> | null = null;
function chargerScriptGoogle(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error('Impossible de charger le script de connexion Google.'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

// initTokenClient lui-même n'exige pas de geste utilisateur, seul
// requestAccessToken() en a besoin — on prépare donc le client dès que
// possible (voir precharger, appelé au montage de CloudBackupSection) pour
// que le clic réel n'ait plus qu'un travail asynchrone quasi instantané à
// traverser avant requestAccessToken(), et ne se fasse pas bloquer comme
// popup par le navigateur.
let clientJeton: ClientJeton | null = null;
let resoudreJeton: ((token: string) => void) | null = null;
let rejeterJeton: ((err: Error) => void) | null = null;

async function assurerClientPret(): Promise<void> {
  await chargerScriptGoogle();
  if (clientJeton) return;
  clientJeton = window.google!.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPE,
    callback: (response) => {
      if (response.error || !response.access_token) {
        rejeterJeton?.(new Error(response.error ?? 'Connexion Google refusée.'));
      } else {
        resoudreJeton?.(response.access_token);
      }
      resoudreJeton = null;
      rejeterJeton = null;
    },
  });
}

export function precharger(): void {
  if (googleDriveConfigure()) void assurerClientPret();
}

// À appeler directement depuis un gestionnaire de clic (jamais après un
// await intermédiaire autre que assurerClientPret, déjà quasi instantané une
// fois précharger() passé) : Chrome/Safari bloquent sinon la fenêtre de
// consentement Google en la traitant comme une popup non sollicitée.
export async function obtenirJeton(): Promise<string> {
  if (!googleDriveConfigure()) {
    throw new Error('Sauvegarde cloud non configurée sur ce déploiement.');
  }
  await assurerClientPret();
  return new Promise((resolve, reject) => {
    resoudreJeton = resolve;
    rejeterJeton = reject;
    clientJeton!.requestAccessToken();
  });
}

async function trouverFichierExistant(jeton: string): Promise<string | null> {
  const idConnu = await getSetting<string>(CLE_FICHIER_ID);
  if (idConnu) return idConnu;
  const params = new URLSearchParams({
    spaces: 'appDataFolder',
    q: `name='${NOM_FICHIER}' and trashed=false`,
    fields: 'files(id)',
  });
  const res = await fetch(`${DRIVE_FILES_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${jeton}` },
  });
  if (!res.ok) throw new Error(`Recherche du fichier Drive échouée (${res.status}).`);
  const data = (await res.json()) as { files?: { id: string }[] };
  const id = data.files?.[0]?.id ?? null;
  if (id) await setSetting(CLE_FICHIER_ID, id);
  return id;
}

// Écrase le fichier existant s'il y en a un (PATCH), sinon en crée un
// nouveau (POST multipart, seule façon de poser à la fois les métadonnées —
// nom + dossier parent — et le contenu en une requête). Un id caché devenu
// invalide (fichier supprimé côté Drive entretemps, PATCH -> 404) retombe
// silencieusement sur la création, qui réécrit ensuite l'id en cache.
export async function envoyerSauvegarde(jeton: string, contenu: string): Promise<void> {
  const fileId = await trouverFichierExistant(jeton);
  if (fileId) {
    const res = await fetch(`${DRIVE_UPLOAD_URL}/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json' },
      body: contenu,
    });
    if (res.ok) return;
    if (res.status !== 404) {
      throw new Error(`Envoi de la sauvegarde Drive échoué (${res.status}).`);
    }
  }

  const frontiere = 'musterheim_backup_boundary';
  const metadata = JSON.stringify({ name: NOM_FICHIER, parents: ['appDataFolder'] });
  const corps =
    `--${frontiere}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${metadata}\r\n` +
    `--${frontiere}\r\n` +
    'Content-Type: application/json\r\n\r\n' +
    `${contenu}\r\n` +
    `--${frontiere}--`;
  const res = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=multipart`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jeton}`, 'Content-Type': `multipart/related; boundary=${frontiere}` },
    body: corps,
  });
  if (!res.ok) throw new Error(`Création de la sauvegarde Drive échouée (${res.status}).`);
  const data = (await res.json()) as { id: string };
  await setSetting(CLE_FICHIER_ID, data.id);
}

// null = aucune sauvegarde présente sur Drive (pas encore de fichier), à
// distinguer d'une erreur réseau/API (qui rejette la promesse).
export async function recupererSauvegarde(jeton: string): Promise<string | null> {
  const fileId = await trouverFichierExistant(jeton);
  if (!fileId) return null;
  const res = await fetch(`${DRIVE_FILES_URL}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${jeton}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Lecture de la sauvegarde Drive échouée (${res.status}).`);
  return res.text();
}
