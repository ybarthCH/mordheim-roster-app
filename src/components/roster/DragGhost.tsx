import { Icon } from '../common/Icon';
import { nomAffiche } from '../../utils/profil';
import type { Member } from '../../types/roster';
import type { Profile } from '../../types/catalog';

type DragGhostProps = {
  pointerPos: { x: number; y: number } | null;
  dragged: { m: Member; profil?: Profile } | undefined;
};

// Aperçu flottant qui suit le pointeur pendant un glisser-déposer (voir
// utils/useDragReorder) — partagé entre MemberGroupCard (tableau + liste
// compacte) et MemberQuickList (vue fusionnée "Bande complète").
export function DragGhost({ pointerPos, dragged }: DragGhostProps) {
  if (!pointerPos || !dragged) return null;
  return (
    <div className="drag-ghost" style={{ left: pointerPos.x, top: pointerPos.y }}>
      <Icon name="poignee" size="0.85em" style={{ marginRight: '0.4em', color: 'var(--text-muted)' }} />
      <span className="drag-ghost__nom">{nomAffiche(dragged.m)}</span>
      {dragged.profil?.nom && <span className="drag-ghost__profil"> · {dragged.profil.nom}</span>}
    </div>
  );
}
