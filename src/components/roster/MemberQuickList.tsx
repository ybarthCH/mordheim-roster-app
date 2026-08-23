import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { Icon } from '../common/Icon';
import type { IconName, PackIconName } from '../common/Icon';
import { grilleXpDuProfil, nomAffiche, resolveProfil } from '../../utils/profil';
import { avancesDues, avancesObtenues, peutGagnerExperience } from '../../utils/xp';
import { useDragReorder } from '../../utils/useDragReorder';
import { estLeaderActuel } from '../../utils/leader';
import type { Member, RosterInstance } from '../../types/roster';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { STAT_KEYS } from '../../types/catalog';
import { getFrancTireur } from '../../data/hiredSwords';
import { useLanguage } from '../../state/useLanguage';
import { libelleCaracteristique } from '../../utils/stats';
import { sauvegardeArmureMembre } from '../../utils/armure';
import type { GameRules } from '../../types/rules';

type MemberQuickListProps = {
  titre: string;
  icone: IconName | PackIconName;
  preferenceKey: string;
  membres: Member[];
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  rules: GameRules;
  onReordonner: (nouvelOrdre: Member[]) => void;
  onSupprimer: (m: Member) => void;
  selectedInstanceId?: string;
  // Retour à la vue détaillée (groupes séparés) — bouton dans l'en-tête,
  // symétrique de onBasculerVueRapide sur MemberGroupCard.
  onBasculerVueDetaillee: () => void;
};

// Liste fusionnée "Bande complète" (Héros, Hommes de main, Francs-tireurs,
// Dramatis Personae), pensée pour un défilement rapide sur une bande
// nombreuse (~20 membres) plutôt que la consultation détaillée : chaque
// ligne se limite au nom, au profil, au bloc de stats et à une poignée de
// glisser-déposer dédiée (voir demarrerDrag — contrairement au tableau et
// aux lignes compactes de MemberGroupCard, cette liste n'a pas d'autre
// action au clic sur le nom lui-même qui justifierait la disambiguïsation
// appui-long/mouvement de demarrerDragDiffere) — ni équipement, ni contrôle
// de statut ceci dit, en dehors de la croix de suppression.
export function MemberQuickList({
  titre,
  icone,
  preferenceKey,
  membres,
  roster,
  catalogue,
  rules,
  onReordonner,
  onSupprimer,
  selectedInstanceId,
  onBasculerVueDetaillee,
}: MemberQuickListProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { elements, refItem, demarrerDrag, dragVientDeSeProduire, idEnCours, pointerPos } = useDragReorder(
    membres,
    onReordonner
  );

  const estAvanceEnAttente = (profil: Profile | undefined, m: Member) => {
    if (!profil || !peutGagnerExperience(profil)) return false;
    if (getFrancTireur(m.franc_tireur_id)?.gagne_experience === false) return false;
    return (
      avancesDues(grilleXpDuProfil(profil), m.xp_depart, m.xp, !!catalogue?.xp_demi) >
      avancesObtenues(m.historique_avancees)
    );
  };

  const vues = useMemo(
    () =>
      elements.map((m) => ({
        m,
        profil: resolveProfil(roster, m, catalogue, language),
        leader: estLeaderActuel(roster, catalogue, m),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elements, roster, catalogue, language]
  );

  return (
    <CollapsibleCard
      preferenceKey={preferenceKey}
      className="card card--tight roster-groupe-card"
      title={
        <>
          <Icon name={icone} style={{ marginRight: '0.35em' }} />
          {titre}
        </>
      }
      actions={
        <button
          type="button"
          className="collapse-btn"
          onClick={(e) => {
            e.stopPropagation();
            onBasculerVueDetaillee();
          }}
          title={t('roster.quickListOff')}
        >
          <Icon name="liste" size="1.1em" />
        </button>
      }
    >
      <div className="member-condensed">
        {vues.map(({ m, profil, leader }) => {
          const avanceEnAttente = estAvanceEnAttente(profil, m);
          const statsTexte = STAT_KEYS.map(
            (k) => `${libelleCaracteristique(k, language)}${m.stats_variables?.[k] ?? m.stats_actuels[k]}`
          ).join(' ');
          const sv = sauvegardeArmureMembre(m.inventaire, rules.armuresLozheim);
          return (
            <div
              key={m.instance_id}
              ref={refItem('liste', m.instance_id)}
              className={`list-item${idEnCours === m.instance_id ? ' list-item--fantome' : ''}${m.instance_id === selectedInstanceId ? ' list-item--selectionne' : ''}`}
              role="button"
              onClick={() => {
                if (dragVientDeSeProduire()) return;
                navigate(`/roster/${roster.id}/personnage/${m.instance_id}`);
              }}
            >
              <div className="list-item__title">
                <span className="list-item__title-name" title={nomAffiche(m)}>
                  {nomAffiche(m)}
                </span>
                {leader && (
                  <span className="badge badge--leader" title={t('memberGroup.leaderTitle')}>
                    {t('memberGroup.leader')}
                  </span>
                )}
                {avanceEnAttente && (
                  <span className="badge badge--pending" title={t('memberGroup.pendingAdvance')}>
                    {t('memberGroup.pendingAdvance')}
                  </span>
                )}
                <span className="list-item__title-actions">
                  <button
                    className="btn--ghost-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSupprimer(m);
                    }}
                    title={t('memberGroup.removeTitle')}
                  >
                    <Icon name="croixPack" />
                  </button>
                  <span
                    className="drag-handle drag-handle--discret drag-handle--titre"
                    onPointerDown={demarrerDrag(m.instance_id)}
                    onClick={(e) => e.stopPropagation()}
                    title={t('memberGroup.dragHandle')}
                  >
                    <Icon name="poignee" size="1.05em" />
                  </span>
                </span>
              </div>
              <div className="member-condensed__ligne member-condensed__ligne--stats">
                {profil?.nom ? `${profil.nom} · ` : ''}XP {m.xp} · {statsTexte}
                {sv !== null && ` · Sv ${sv}+`}
              </div>
            </div>
          );
        })}
      </div>

      {membres.length === 0 && <p className="text-muted">{t('memberGroup.noMembers')}</p>}

      {idEnCours &&
        pointerPos &&
        (() => {
          const dragged = vues.find((v) => v.m.instance_id === idEnCours);
          if (!dragged) return null;
          return (
            <div className="drag-ghost" style={{ left: pointerPos.x, top: pointerPos.y }}>
              <Icon name="poignee" size="0.85em" style={{ marginRight: '0.4em', color: 'var(--text-muted)' }} />
              <span className="drag-ghost__nom">{nomAffiche(dragged.m)}</span>
              {dragged.profil?.nom && <span className="drag-ghost__profil"> · {dragged.profil.nom}</span>}
            </div>
          );
        })()}
    </CollapsibleCard>
  );
}
