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

// Web Share API : ouvre le menu de partage natif du téléphone (Drive,
// mail, Dropbox...) pour que le joueur choisisse lui-même où sauvegarder
// sa bande — sans compte ni backend côté app. Seul `navigator.share`
// (niveau 1, texte/titre) est requis pour afficher le bouton : le partage
// de fichier (niveau 2, `canShare`) est tenté en priorité mais son support
// réel est très inégal (souvent absent même quand l'API existe), d'où le
// repli sur le partage du contenu en texte brut ci-dessous.
export function partageDisponible(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export async function partagerRoster(roster: RosterInstance): Promise<void> {
  const contenu = JSON.stringify(roster, null, 2);
  const nom = nomFichierRoster(roster);
  const echecs: string[] = [];

  if (typeof navigator.canShare === 'function') {
    // "application/json" est absent de la liste blanche de types
    // partageables sur certains navigateurs (canShare renvoie false),
    // d'où le repli sur "text/plain" — le destinataire (Drive, mail...)
    // se fie au nom de fichier (.json), pas au type MIME déclaré ici.
    const candidats = [
      new File([contenu], nom, { type: 'application/json' }),
      new File([contenu], nom, { type: 'text/plain' }),
    ];
    const fichier = candidats.find((f) => navigator.canShare!({ files: [f] }));
    if (fichier) {
      try {
        await navigator.share({ files: [fichier], title: roster.nom_bande });
        return;
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') throw e;
        echecs.push(`fichier: ${e instanceof Error ? `${e.name} — ${e.message}` : String(e)}`);
      }
    } else {
      echecs.push('fichier: canShare a refusé les deux types MIME testés (json, text/plain)');
    }
  } else {
    echecs.push('fichier: canShare absent (API niveau 2 non supportée)');
  }

  // Repli niveau 1 : partage du JSON en texte brut (bien plus largement
  // supporté que le partage de fichier, y compris là où canShare échoue).
  try {
    await navigator.share({ title: roster.nom_bande, text: contenu });
    return;
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') throw e;
    echecs.push(`texte: ${e instanceof Error ? `${e.name} — ${e.message}` : String(e)}`);
  }

  throw new Error(echecs.join(' | '));
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
