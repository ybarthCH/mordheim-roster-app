import type { CSSProperties } from 'react';

// Teinte dérivée du nom (hash simple, stable) : donne une variété de
// couleurs aux avatars sans figer une palette fixe — cohérent avec
// n'importe quel thème/palette puisqu'on ne touche qu'à hsl(hue, ...).
function teinteDepuisNom(nom: string): number {
  let h = 0;
  for (let i = 0; i < nom.length; i++) {
    h = (h * 31 + nom.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function initiales(nom: string): string {
  const mots = nom.trim().split(/\s+/).filter(Boolean);
  if (mots.length === 0) return '?';
  if (mots.length === 1) return mots[0].slice(0, 2).toUpperCase();
  return (mots[0][0] + mots[1][0]).toUpperCase();
}

type AvatarProps = {
  nom: string;
  photo?: string;
  size?: number | string;
  className?: string;
  onClick?: () => void;
  title?: string;
};

export function Avatar({ nom, photo, size = 36, className, onClick, title }: AvatarProps) {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  const classe = `avatar${photo ? '' : ' avatar--initials'}${onClick ? ' avatar--clickable' : ''}${className ? ` ${className}` : ''}`;
  const style: CSSProperties = photo
    ? { width: dimension, height: dimension }
    : { width: dimension, height: dimension, ['--avatar-hue' as string]: teinteDepuisNom(nom) };

  return (
    <span
      className={classe}
      style={style}
      onClick={onClick}
      title={title}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {photo ? <img src={photo} alt="" className="avatar__img" /> : initiales(nom)}
    </span>
  );
}
