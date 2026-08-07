// Point d'entrée UNIQUE pour toute valeur de "Rating" affichée dans l'app :
// bascule entre le Rating officiel (utils/rating.ts, inchangé) et la Power
// Value (utils/powerValue.ts) selon le réglage global optionnel
// GameRules.valeurPuissanceActivee (Réglages > Règles optionnelles). Évite
// de disperser des `rules.valeurPuissanceActivee ? ... : ...` dans chaque
// composant d'affichage — voir RosterSummaryCard, StatutCard,
// ListeBandesScreen, pdfExport.
import type { Member, RosterInstance } from '../types/roster';
import type { GameRules } from '../types/rules';
import { ratingMembre, ratingTotal } from './rating';
import { powerValueMembre, powerValueTotal } from './powerValue';

export function ratingAffiche(roster: RosterInstance, rules: GameRules): number {
  return rules.valeurPuissanceActivee ? powerValueTotal(roster) : ratingTotal(roster);
}

export function ratingAfficheMembre(m: Member, roster: RosterInstance, rules: GameRules): number {
  return rules.valeurPuissanceActivee ? powerValueMembre(m, roster) : ratingMembre(m, roster);
}
