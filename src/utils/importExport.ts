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

// Horodatage lisible en format européen (jour-mois-année_heureHminute),
// accolé au nom de fichier pour distinguer plusieurs exports d'une même
// bande sans les écraser les uns les autres.
function horodatageFichier(date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(date.getDate())}-${p(date.getMonth() + 1)}-${date.getFullYear()}_${p(date.getHours())}h${p(date.getMinutes())}`;
}

function nomFichierRoster(roster: RosterInstance): string {
  const base = roster.nom_bande.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  return `${base}_${horodatageFichier()}.json`;
}

export function exporterRoster(roster: RosterInstance) {
  telechargerJSON(roster, nomFichierRoster(roster));
}

// Web Share API : ouvre le menu de partage natif du téléphone (Drive,
// mail, Dropbox...) pour que le joueur choisisse lui-même où sauvegarder
// sa bande — sans compte ni backend côté app. Seul `navigator.share`
// (niveau 1, texte/titre) est requis pour afficher le bouton.
export function partageDisponible(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export async function partagerRoster(roster: RosterInstance): Promise<void> {
  const contenu = JSON.stringify(roster, null, 2);
  const nomFichier = nomFichierRoster(roster);

  // Un seul appel à navigator.share() par geste utilisateur : sur au moins
  // un navigateur observé en conditions réelles (Safari iOS), l'activation
  // utilisateur est consommée dès le premier appel même s'il échoue — un
  // deuxième essai échouerait systématiquement avec "Must be handling a
  // user gesture". `canShare()` en revanche ne consomme pas le geste et
  // permet donc de choisir file vs texte AVANT cet unique appel à share().
  // Si le partage fichier choisi ici échoue malgré tout (canShare() accepte
  // parfois un fichier que share() refuse ensuite), l'appelant (RosterScreen)
  // se rabat automatiquement sur le téléchargement JSON classique.
  if (typeof navigator.canShare === 'function') {
    const fichier = new File([contenu], nomFichier, { type: 'application/json' });
    if (navigator.canShare({ files: [fichier] })) {
      await navigator.share({ title: roster.nom_bande, files: [fichier] });
      return;
    }
  }
  await navigator.share({ title: roster.nom_bande, text: contenu });
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
