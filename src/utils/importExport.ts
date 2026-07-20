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

export function exporterRoster(roster: RosterInstance) {
  const nomFichier = `${roster.nom_bande.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.json`;
  telechargerJSON(roster, nomFichier);
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
