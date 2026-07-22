import { HENCHMAN_XP_MAX, HERO_XP_MAX, isPalierHenchman, isPalierHero } from '../../utils/xp';

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
  const toggle = (box: number) => {
    if (!demiXp) {
      // cliquer une case fixe l'XP totale à cette valeur (ou la décoche si déjà à ce niveau)
      onChange(xp === box ? box - 1 : box);
      return;
    }
    const plein = box * 2;
    const moitie = box * 2 - 1;
    if (xp >= plein) onChange(plein - 2);
    else if (xp >= moitie) onChange(plein);
    else onChange(moitie);
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
            aria-label={`Case XP ${box}`}
            title={estDepart ? 'XP de départ — ne comptait pas pour une avancée' : undefined}
          >
            {isPalier(box) ? box : ''}
          </button>
        );
      })}
    </div>
  );
}
