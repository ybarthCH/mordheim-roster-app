import { HENCHMAN_XP_MAX, HERO_XP_MAX, isPalierHenchman, isPalierHero } from '../../utils/xp';

type Props = {
  type: 'heros' | 'homme_de_main';
  xp: number;
  xpDepart?: number;
  onChange: (xp: number) => void;
};

export function XpGrid({ type, xp, xpDepart = 0, onChange }: Props) {
  const toggle = (box: number) => {
    // cliquer une case fixe l'XP totale à cette valeur (ou la décoche si déjà à ce niveau)
    onChange(xp === box ? box - 1 : box);
  };

  const max = type === 'heros' ? HERO_XP_MAX : HENCHMAN_XP_MAX;
  const isPalier = type === 'heros' ? isPalierHero : isPalierHenchman;
  const boxes = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="xp-grid">
      {boxes.map((box) => (
        <button
          key={box}
          type="button"
          className={`xp-box ${isPalier(box) ? 'xp-box--palier' : ''} ${xp >= box ? 'xp-box--checked' : ''} ${
            box <= xpDepart ? 'xp-box--depart' : ''
          }`}
          onClick={() => toggle(box)}
          aria-label={`Case XP ${box}`}
          title={box <= xpDepart ? 'XP de départ — ne comptait pas pour une avancée' : undefined}
        >
          {isPalier(box) ? box : ''}
        </button>
      ))}
    </div>
  );
}
