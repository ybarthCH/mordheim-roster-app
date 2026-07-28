// Caractéristiques encore variables (notation dé, voir Member.stats_variables
// et Profile.stats_variables) — utilitaire pour leur appliquer un delta
// numérique (mutation, bénédiction...) sans passer par stats_actuels, qui
// n'est qu'un espace réservé ignoré par l'affichage tant que la valeur n'est
// pas fixée via une avancée.

const NOTATION = /^(\d*D\d+)([+-]\d+)?$/i;

// "D6" + 2 -> "D6+2" ; "D6+1" + (-1) -> "D6" ; notation non reconnue -> inchangée.
export function appliquerDeltaSurNotation(notation: string, delta: number): string {
  const correspondance = notation.match(NOTATION);
  if (!correspondance) return notation;
  const base = correspondance[1];
  const nouveauModificateur = (correspondance[2] ? Number(correspondance[2]) : 0) + delta;
  if (nouveauModificateur === 0) return base;
  return `${base}${nouveauModificateur > 0 ? '+' : ''}${nouveauModificateur}`;
}
