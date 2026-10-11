// Lancer de dés virtuel, utilisé uniquement quand le joueur a activé
// l'option « Jet de dés virtuel pour le post-bataille » (voir
// GameRules.jetsVirtuels). Par défaut l'app ne lance aucun dé : le joueur
// lance sur sa table et saisit le résultat, et c'est toujours le cas si
// l'option reste décochée.
//
// Les notations viennent des données de jeu telles qu'elles sont écrites
// (data/tableExplorationEvenements.ts, data/items/*.json...) et suivent
// toutes la même grammaire :
//
//     [constante +] [nombre]D<faces> [x multiplicateur]
//
// soit, concrètement : « D6 », « 2D6 », « D3 », « D6x10 », « 5D6x5 »,
// « 30+2D6 », « 100+1D6x10 », « 70+3D6 ». Certaines valeurs du même champ
// ne sont pas des jets du tout (« 50 », « Trouvaille unique », « - ») :
// elles ne doivent pas produire de bouton, d'où un parseur qui rend null
// plutôt que de deviner.

export type NotationDes = {
  /** Partie fixe ajoutée au total, ex : 30 dans « 30+2D6 ». */
  constante: number;
  /** Nombre de dés lancés, ex : 2 dans « 2D6 ». */
  nombre: number;
  /** Nombre de faces, ex : 6 dans « 2D6 ». Seuls D3 et D6 existent ici. */
  faces: number;
  /** Multiplicateur appliqué à la somme des dés, ex : 10 dans « D6x10 ». */
  multiplicateur: number;
};

// « x » peut être la lettre x, le × typographique ou le * ; la casse du D
// varie aussi selon les fiches de données.
const MOTIF = /^(?:(\d+)\s*\+\s*)?(\d*)\s*[dD]\s*(\d+)(?:\s*[x×*]\s*(\d+))?$/;

/**
 * Analyse une notation de dés. Retourne null si la chaîne n'est pas un jet
 * (nombre fixe, texte libre, tiret...) — l'appelant n'affiche alors pas de
 * bouton de jet automatique.
 */
export function parserNotationDes(notation: string | number | null | undefined): NotationDes | null {
  if (typeof notation !== 'string') return null;
  const m = MOTIF.exec(notation.trim());
  if (!m) return null;
  const faces = Number(m[3]);
  // D3 et D6 sont les seuls dés du jeu ; tout autre nombre de faces signale
  // une chaîne mal formée plutôt qu'une notation qu'on saurait lancer.
  if (faces !== 3 && faces !== 6) return null;
  const nombre = m[2] === '' ? 1 : Number(m[2]);
  if (nombre < 1 || nombre > 20) return null;
  return {
    constante: m[1] ? Number(m[1]) : 0,
    nombre,
    faces,
    multiplicateur: m[4] ? Number(m[4]) : 1,
  };
}

/** Un dé, via crypto quand c'est disponible — Math.random suffirait, mais
 * autant ne pas donner de biais à un jet qui décide de la vie d'un guerrier. */
export function lancerDe(faces: number): number {
  const crypto = globalThis.crypto;
  if (crypto?.getRandomValues) {
    const max = Math.floor(0xffffffff / faces) * faces;
    const buf = new Uint32Array(1);
    let v = 0;
    do {
      crypto.getRandomValues(buf);
      v = buf[0];
    } while (v >= max);
    return (v % faces) + 1;
  }
  return Math.floor(Math.random() * faces) + 1;
}

export type ResultatJet = {
  /** Valeur de chaque dé, dans l'ordre — affichée pour que le joueur voie le détail. */
  des: number[];
  /** Total final, constante et multiplicateur appliqués. */
  total: number;
};

/** Lance la notation donnée. Retourne null si ce n'est pas un jet. */
export function lancerNotation(notation: string | number | null | undefined): ResultatJet | null {
  const spec = parserNotationDes(notation);
  if (!spec) return null;
  return lancerSpec(spec);
}

export function lancerSpec(spec: NotationDes): ResultatJet {
  const des: number[] = [];
  for (let i = 0; i < spec.nombre; i++) des.push(lancerDe(spec.faces));
  const somme = des.reduce((a, b) => a + b, 0);
  return { des, total: spec.constante + somme * spec.multiplicateur };
}

/** Lance `nombre` dés à `faces` faces et rend le détail + la somme — pour les
 * jets construits par le code plutôt que lus dans une notation (dés
 * d'Exploration, jet de survie 1D6, 2D6 d'avancée...). */
export function lancerDes(nombre: number, faces = 6): ResultatJet {
  return lancerSpec({ constante: 0, nombre, faces, multiplicateur: 1 });
}

/** Jet de D66 : deux dés, le premier donne les dizaines, le second les
 * unités — 11, 12, … 65, 66, soit 36 résultats équiprobables. C'est le dé
 * de la table des Blessures Graves, dont les codes vont bien de 11 à 66
 * (le texte « 2D6 » affiché par l'assistant est une formulation impropre :
 * 2D6 ne produirait que 2 à 12). */
export function lancerD66(): ResultatJet {
  const dizaines = lancerDe(6);
  const unites = lancerDe(6);
  return { des: [dizaines, unites], total: dizaines * 10 + unites };
}
