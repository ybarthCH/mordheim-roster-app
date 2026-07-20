import { HENCHMAN_XP_BOXES, heroGridSize, isPalier } from '../../utils/xp';

type Props = {
  type: 'heros' | 'homme_de_main';
  xp: number;
  onChange: (xp: number) => void;
};

export function XpGrid({ type, xp, onChange }: Props) {
  const toggle = (box: number) => {
    // cliquer une case fixe l'XP totale à cette valeur (ou la décoche si déjà à ce niveau)
    onChange(xp === box ? box - 1 : box);
  };

  if (type === 'homme_de_main') {
    return (
      <div className="xp-grid">
        {HENCHMAN_XP_BOXES.map((box) => (
          <button
            key={box}
            type="button"
            className={`xp-box xp-box--henchman xp-box--palier ${xp >= box ? 'xp-box--checked' : ''}`}
            onClick={() => toggle(box)}
            aria-label={`Case XP ${box}`}
          >
            {box}
          </button>
        ))}
      </div>
    );
  }

  const total = heroGridSize(xp);
  const boxes = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="xp-grid">
      {boxes.map((box) => (
        <button
          key={box}
          type="button"
          className={`xp-box ${isPalier(box) ? 'xp-box--palier' : ''} ${xp >= box ? 'xp-box--checked' : ''}`}
          onClick={() => toggle(box)}
          aria-label={`Case XP ${box}`}
        >
          {isPalier(box) ? box : ''}
        </button>
      ))}
    </div>
  );
}
