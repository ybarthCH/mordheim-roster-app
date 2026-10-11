import { useGameRules } from '../../state/useGameRules';
import { useLanguage } from '../../state/useLanguage';
import { lancerDes, lancerNotation, parserNotationDes } from '../../utils/des';

type Props = {
  /** Notation lue dans les données, ex : « 2D6 », « D6x10 », « 30+2D6 ».
   * Mutuellement exclusif avec `nombre`/`faces`. Si la chaîne n'est pas un
   * jet (« 50 », « Trouvaille unique », « - »), le bouton ne s'affiche pas. */
  notation?: string | number | null;
  /** Jet construit par le code plutôt que lu dans une notation, ex : les
   * dés d'Exploration, dont le nombre dépend de la bande. */
  nombre?: number;
  faces?: number;
  /** Reçoit le total du jet, et le détail dé par dé pour l'afficher au
   * joueur s'il y a plus d'un dé. */
  onResultat: (total: number, des: number[]) => void;
  /** Rend le bouton inopérant (champ déjà appliqué, étape verrouillée...). */
  disabled?: boolean;
};

/**
 * Bouton « Jet auto » affiché à côté d'une saisie de jet du post-bataille.
 *
 * Ne s'affiche QUE si le joueur a coché « Jet de dés virtuel pour le
 * post-bataille » dans les Réglages (GameRules.jetsVirtuels). Par défaut
 * l'app ne lance aucun dé et l'interface reste exactement celle d'avant :
 * c'est la posture historique du projet, affichée noir sur blanc à
 * plusieurs endroits (« L'app ne lance aucun dé »).
 *
 * Le bouton remplit le champ, il ne valide rien : le joueur garde la main
 * pour corriger la valeur, et les boutons d'application existants restent
 * le seul moyen d'acter un résultat.
 */
export function BoutonJetAuto({ notation, nombre, faces = 6, onResultat, disabled }: Props) {
  const { rules } = useGameRules();
  const { t } = useLanguage();

  if (!rules.jetsVirtuels) return null;
  // Une notation non jetable (nombre fixe, texte libre) ne doit pas produire
  // de bouton : il n'y a rien à lancer.
  if (notation !== undefined && nombre === undefined && !parserNotationDes(notation)) return null;
  if (notation === undefined && (!nombre || nombre < 1)) return null;

  const lancer = () => {
    const resultat = nombre !== undefined ? lancerDes(nombre, faces) : lancerNotation(notation);
    if (resultat) onResultat(resultat.total, resultat.des);
  };

  return (
    <button
      type="button"
      className="btn--pack-pill-sm"
      onClick={lancer}
      disabled={disabled}
      title={t('postBataille.autoRollTitle')}
    >
      🎲 {t('postBataille.autoRoll')}
    </button>
  );
}
