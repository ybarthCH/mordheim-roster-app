import type { RosterInstance } from '../types/roster';

export function telechargerJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function nomFichierRoster(roster: RosterInstance): string {
  return `${roster.nom_bande.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.json`;
}

export function exporterRoster(roster: RosterInstance) {
  telechargerJSON(roster, nomFichierRoster(roster));
}

// Web Share API (niveau 2, partage de fichier) : ouvre le menu de partage
// natif du téléphone (Drive, mail, Dropbox...) pour que le joueur choisisse
// lui-même où sauvegarder sa bande — sans compte ni backend côté app.
// Non supporté sur desktop/Safari, d'où la détection avant d'afficher le
// bouton (voir partageDisponible).
export function partageDisponible(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
}

export async function partagerRoster(roster: RosterInstance): Promise<void> {
  const fichier = new File([JSON.stringify(roster, null, 2)], nomFichierRoster(roster), {
    type: 'application/json',
  });
  if (!navigator.canShare({ files: [fichier] })) {
    throw new Error('Le partage de ce fichier n’est pas supporté sur cet appareil.');
  }
  await navigator.share({ files: [fichier], title: roster.nom_bande });
}

function estRosterValide(data: unknown): data is RosterInstance {
  if (!data || typeof data !== 'object') return false;
  const r = data as Record<string, unknown>;
  return (
    typeof r.bande_id === 'string' &&
    typeof r.nom_bande === 'string' &&
    Array.isArray(r.membres)
  );
}

export function lireFichierRoster(file: File): Promise<RosterInstance> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!estRosterValide(data)) {
          reject(new Error("Le fichier ne correspond pas au format d'un roster Mordheim."));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Fichier JSON invalide.'));
      }
    };
    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
    reader.readAsText(file);
  });
}
