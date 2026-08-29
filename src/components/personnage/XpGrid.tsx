import { HENCHMAN_XP_MAX, HERO_XP_MAX, isPalierHenchman, isPalierHero } from '../../utils/xp';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  type: 'heros' | 'homme_de_main';
  xp: number;
  xpDepart?: number;
  onChange: (xp: number) => void;
  // Bande à progression ralentie (Mangeurs d'Hommes) : chaque case vaut 2 XP
  // réels — premier clic la remplit à moitié, second clic la complète.
  demiXp?: boolean;
};

export function XpGrid({ type, xp, xpDepart = 0, onChange, demiXp = false }: Props) {
  const { t } = useLanguage();
  const toggle = (box: number) => {
    if (!demiXp) {
      // cliquer une case fixe l'XP totale à cette valeur (ou la décoche si déjà à ce niveau)
      onChange(Math.max(xp === box ? box - 1 : box, xpDepart));
      return;
    }
    const plein = box * 2;
    const moitie = box * 2 - 1;
    let next: number;
    if (xp >= plein) next = plein - 2;
    else if (xp >= moitie) next = plein;
    else next = moitie;
    onChange(Math.max(next, xpDepart));
  };

  const max = type === 'heros' ? HERO_XP_MAX : HENCHMAN_XP_MAX;
  const isPalier = type === 'heros' ? isPalierHero : isPalierHenchman;
  const boxes = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="xp-grid">
      {boxes.map((box) => {
        const seuilPlein = demiXp ? box * 2 : box;
        const seuilMoitie = demiXp ? box * 2 - 1 : box;
        const estPleine = xp >= seuilPlein;
        const estMoitie = !estPleine && demiXp && xp >= seuilMoitie;
        const estDepart = xpDepart >= seuilPlein;
        return (
          <button
            key={box}
            type="button"
            className={`xp-box ${isPalier(box) ? 'xp-box--palier' : ''} ${estPleine ? 'xp-box--checked' : ''} ${
              estMoitie ? 'xp-box--demi' : ''
            } ${estDepart ? 'xp-box--depart' : ''}`}
            onClick={() => toggle(box)}
            aria-label={`${t('xpGrid.boxLabel')} ${box}`}
            title={estDepart ? t('xpGrid.startingXpTitle') : undefined}
          >
            {isPalier(box) ? box : ''}
          </button>
        );
      })}
    </div>
  );
}
