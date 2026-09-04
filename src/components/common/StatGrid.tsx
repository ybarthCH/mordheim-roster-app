import type { CSSProperties } from 'react';
import { STAT_KEYS } from '../../types/catalog';
import type { Stats } from '../../types/catalog';
import { libelleCaracteristique } from '../../utils/stats';
import { useLanguage } from '../../state/useLanguage';

type StatGridProps = {
  // number|string plutôt que Stats strict : couvre aussi bien les stats d'un
  // membre (toujours numériques) que celles d'un objet monture (notations
  // spéciales possibles, ex : Force "3(4)" — voir ShopItem.stats/StatsMonture).
  stats: { [K in keyof Stats]: number | string };
  style?: CSSProperties;
};

// Grille de caractéristiques en LECTURE SEULE (une ligne de libellés, une
// ligne de valeurs) — profil au recrutement, objet monture, franc-tireur,
// Dramatis Personae, blessure grave... Partagée par toutes les fiches où les
// stats ne sont qu'indicatives. Ne couvre pas CaracteristiquesCard (fiche
// personnage), qui reste éditable avec plafond/malus/coloration propres et
// n'a donc pas sa place ici.
export function StatGrid({ stats, style }: StatGridProps) {
  const { language } = useLanguage();
  return (
    <div className="stat-grid" style={style}>
      {STAT_KEYS.map((k) => (
        <div key={`lbl-${k}`} className="stat-grid__cell stat-grid__cell--label">
          {libelleCaracteristique(k, language)}
        </div>
      ))}
      {STAT_KEYS.map((k) => (
        <div key={`val-${k}`} className="stat-grid__cell stat-grid__cell--value">
          {stats[k]}
        </div>
      ))}
    </div>
  );
}
