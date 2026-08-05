import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { Avatar } from '../common/Avatar';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';
import { grilleXpDuProfil, nomAffiche, resolveProfil } from '../../utils/profil';
import { avancesDues, peutGagnerExperience } from '../../utils/xp';
import { nomCourtBlessureAffiche } from '../../utils/blessures';
import { inventaireGroupeMismatch } from '../../utils/shop';
import { useDragReorder } from '../../utils/useDragReorder';
import { estLeaderActuel } from '../../utils/leader';
import type { Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { getFrancTireur } from '../../data/hiredSwords';
import { useLanguage } from '../../state/useLanguage';
import { getItem } from '../../data/items';
import { translateItem } from '../../i18n/data/items';
import { libelleCaracteristique } from '../../utils/stats';

// Couleur du sceau de statut (voir .status-switch) : reprend les mêmes
// teintes sémantiques que les .badge--* du reste de l'appli.
const STATUT_COULEUR: Record<string, string> = {
  actif: 'success',
  hors_de_combat: 'warning',
  mort: 'danger',
  blesse: 'neutral',
};

const STATUT_ICONE: Partial<Record<string, IconName>> = {
  actif: 'coche',
  hors_de_combat: 'ossements',
  mort: 'crane',
  blesse: 'goutte',
};

type MemberGroupCardProps = {
  titre: string;
  icone: IconName;
  preferenceKey: string;
  membres: Member[];
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  onReordonner: (nouvelOrdre: Member[]) => void;
  onBasculerHorsCombat: (m: Member) => void;
  onSupprimer: (m: Member) => void;
  // Masque la colonne "Profil" : superflue quand le nom du membre est
  // toujours identique à celui de son profil (ex : Dramatis Personae, jamais
  // renommables).
  masquerProfil?: boolean;
  // Membre actuellement ouvert dans le volet détail (mode deux volets, grands
  // écrans) : surligne sa ligne dans la liste. Voir RosterScreen/RosterRoute.
  selectedInstanceId?: string;
};

export function MemberGroupCard({
  titre,
  icone,
  preferenceKey,
  membres,
  roster,
  catalogue,
  onReordonner,
  onBasculerHorsCombat,
  onSupprimer,
  masquerProfil,
  selectedInstanceId,
}: MemberGroupCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { elements, refItem, demarrerDrag, idEnCours, pointerPos } = useDragReorder(membres, onReordonner);

  // Synopsis discret de l'équipement d'un membre (ou de son groupe, toujours
  // identique entre figurines) pour l'aperçu du roster global. Affiché sur
  // toute la largeur du tableau (voir la ligne dédiée sous chaque membre) :
  // la limite ici n'est qu'un filet de sécurité contre un inventaire
  // interminable, pas la contrainte principale.
  const resumeEquipement = (m: Member): string => {
    if (m.inventaire.length === 0) return m.equipement || t('memberGroup.noEquipment');
    const noms = m.inventaire
      .map((e) => {
        const ref = getItem(e.item_id);
        return ref ? translateItem(ref, language).nom : e.nom;
      })
      .join(', ');
    return noms.length > 160 ? `${noms.slice(0, 160).trimEnd()}…` : noms;
  };

  // Idem pour les blessures graves accumulées : juste les titres, pas les
  // descriptions complètes (disponibles sur la fiche personnage).
  const resumeBlessures = (m: Member): string | null => {
    if (m.blessures_graves.length === 0) return null;
    return `${t('memberGroup.injuries')} ${m.blessures_graves.map((b) => nomCourtBlessureAffiche(b, language)).join(' - ')}`;
  };

  const avanceEnAttente = (m: Member) => {
    const profil = resolveProfil(roster, m, catalogue, language);
    if (!profil || !peutGagnerExperience(profil)) return false;
    if (getFrancTireur(m.franc_tireur_id)?.gagne_experience === false) return false;
    return (
      avancesDues(grilleXpDuProfil(profil), m.xp_depart, m.xp, !!catalogue?.xp_demi) >
      m.historique_avancees.filter((a) => !a.bonus && a.type !== 'promotion').length
    );
  };

  // Un homme de main ou animal non promu n'utilise jamais le statut « Hors
  // de combat » (voir PersonnageScreen) : chaque clic marque une figurine de
  // plus via le compteur dédié, jusqu'à ce que tout le groupe soit à terre.
  // Seuls les héros (et hommes de main promus) basculent le statut lui-même.
  const titreHorsCombat = (m: Member) => {
    const profil = resolveProfil(roster, m, catalogue, language);
    const estGroupeSimplifie = (profil?.type === 'homme_de_main' || profil?.type === 'animal') && !m.promu_heros;
    return estGroupeSimplifie
      ? t('memberGroup.hcMarkTitle', { hc: m.hors_combat, taille: m.taille_groupe })
      : t('memberGroup.hcToggleTitle');
  };

  return (
    <CollapsibleCard
      preferenceKey={preferenceKey}
      title={
        <>
          <Icon name={icone} style={{ marginRight: '0.35em' }} />
          {titre}
        </>
      }
    >
      <div className="roster-table-wrap">
        <table className="roster-table">
          <thead>
            <tr>
              <th style={{ width: '1.6rem' }}></th>
              <th>{t('memberGroup.name')}</th>
              {!masquerProfil && <th>{t('memberGroup.profile')}</th>}
              <th>{libelleCaracteristique('M', language)}</th>
              <th>{libelleCaracteristique('CC', language)}</th>
              <th>{libelleCaracteristique('CT', language)}</th>
              <th>{libelleCaracteristique('F', language)}</th>
              <th>{libelleCaracteristique('E', language)}</th>
              <th>{libelleCaracteristique('PV', language)}</th>
              <th>{libelleCaracteristique('I', language)}</th>
              <th>{libelleCaracteristique('A', language)}</th>
              <th>{libelleCaracteristique('Cd', language)}</th>
              <th>XP</th>
              <th>{t('memberGroup.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {elements.map((m) => {
              const profil = resolveProfil(roster, m, catalogue, language);
              const versPersonnage = () => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`);
              return (
                <Fragment key={m.instance_id}>
                  <tr
                    ref={refItem('table', m.instance_id)}
                    className={`roster-table__row-principale${idEnCours === m.instance_id ? ' roster-table__row--fantome' : ''}${m.instance_id === selectedInstanceId ? ' roster-table__row--selectionnee' : ''}`}
                    onClick={versPersonnage}
                  >
                    <td className="roster-table__poignee-cell">
                      <span
                        className="drag-handle drag-handle--discret"
                        onPointerDown={demarrerDrag(m.instance_id)}
                        onClick={(e) => e.stopPropagation()}
                        title={t('memberGroup.dragHandle')}
                      >
                        <Icon name="poignee" size="0.7em" />
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-sm">
                        <Avatar nom={nomAffiche(m)} photo={m.photo} size={28} />
                        <span>
                          {nomAffiche(m)}
                          {estLeaderActuel(roster, catalogue, m) && (
                            <span className="badge badge--info" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.leaderTitle')}>
                              <Icon name="etoile" style={{ marginRight: '0.3em' }} /> {t('memberGroup.leader')}
                            </span>
                          )}
                          {avanceEnAttente(m) && (
                            <span className="badge badge--warning" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.pendingAdvance')}>
                              {t('memberGroup.pendingAdvance')}
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    {!masquerProfil && <td>{profil?.nom ?? m.profil_id}</td>}
                    <td>{m.stats_variables?.M ?? m.stats_actuels.M}</td>
                    <td>{m.stats_variables?.CC ?? m.stats_actuels.CC}</td>
                    <td>{m.stats_variables?.CT ?? m.stats_actuels.CT}</td>
                    <td>{m.stats_variables?.F ?? m.stats_actuels.F}</td>
                    <td>{m.stats_variables?.E ?? m.stats_actuels.E}</td>
                    <td>{m.stats_variables?.PV ?? m.stats_actuels.PV}</td>
                    <td>{m.stats_variables?.I ?? m.stats_actuels.I}</td>
                    <td>{m.stats_variables?.A ?? m.stats_actuels.A}</td>
                    <td>{m.stats_variables?.Cd ?? m.stats_actuels.Cd}</td>
                    <td>{m.xp}</td>
                    <td>
                      <button
                        type="button"
                        className={`status-switch status-switch--${STATUT_COULEUR[m.statut]}${m.statut === 'actif' ? ' status-switch--on' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBasculerHorsCombat(m);
                        }}
                        title={titreHorsCombat(m)}
                        aria-label={`${t(`statut.${m.statut}`)} — ${titreHorsCombat(m)}`}
                      >
                        {STATUT_ICONE[m.statut] && <Icon name={STATUT_ICONE[m.statut]!} />}
                        <span className="status-switch__label">{t(`statut.${m.statut}`)}</span>
                        <span className="status-switch__track">
                          <span className="status-switch__thumb" />
                        </span>
                      </button>
                      {m.hors_combat > 0 && (
                        <span className="badge badge--warning" style={{ marginLeft: '0.3rem' }}>
                          {m.hors_combat}/{m.taille_groupe} {t('memberGroup.hc')}
                        </span>
                      )}
                      {inventaireGroupeMismatch(m) && (
                        <span
                          className="badge badge--danger"
                          style={{ marginLeft: '0.3rem' }}
                          title={t('memberGroup.equipmentMismatchTitle')}
                        >
                          ⚠ {t('memberGroup.equipmentMismatchBadge')}
                        </span>
                      )}
                      {m.franc_tireur_impaye && (
                        <span className="badge badge--warning" style={{ marginLeft: '0.3rem' }}>
                          {t('memberGroup.absentUnpaid')}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn--ghost"
                          style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSupprimer(m);
                          }}
                          title={t('memberGroup.removeTitle')}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="roster-table__row-synopsis" onClick={versPersonnage}>
                    <td colSpan={masquerProfil ? 14 : 15} className="roster-table__synopsis-cell">
                      <div className="text-sm text-muted roster-table__synopsis" style={{ fontStyle: 'italic' }}>
                        {resumeEquipement(m)}
                      </div>
                      {resumeBlessures(m) && (
                        <div className="text-sm text-danger roster-table__synopsis" style={{ marginTop: '0.1rem' }}>
                          {resumeBlessures(m)}
                        </div>
                      )}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="member-cards">
        {elements.map((m) => {
          const profil = resolveProfil(roster, m, catalogue, language);
          return (
            <div
              key={m.instance_id}
              ref={refItem('card', m.instance_id)}
              className={`list-item${idEnCours === m.instance_id ? ' list-item--fantome' : ''}${m.instance_id === selectedInstanceId ? ' list-item--selectionne' : ''}`}
              role="button"
              onClick={() => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`)}
            >
              <span
                className="drag-handle drag-handle--discret"
                onPointerDown={demarrerDrag(m.instance_id)}
                onClick={(e) => e.stopPropagation()}
                title={t('memberGroup.dragHandle')}
              >
                <Icon name="poignee" size="0.7em" />
              </span>
              <Avatar nom={nomAffiche(m)} photo={m.photo} size={32} />
              <div className="list-item__row">
                <div className="list-item__main">
                  <div className="list-item__title">
                    {nomAffiche(m)}
                    {estLeaderActuel(roster, catalogue, m) && (
                      <span className="badge badge--info" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.leaderTitle')}>
                        <Icon name="etoile" style={{ marginRight: '0.3em' }} /> {t('memberGroup.leader')}
                      </span>
                    )}
                    {avanceEnAttente(m) && (
                      <span className="badge badge--warning" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.pendingAdvance')}>
                        {t('memberGroup.pendingAdvance')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className={`status-switch status-switch--${STATUT_COULEUR[m.statut]}${m.statut === 'actif' ? ' status-switch--on' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBasculerHorsCombat(m);
                  }}
                  title={titreHorsCombat(m)}
                  aria-label={`${t(`statut.${m.statut}`)} — ${titreHorsCombat(m)}`}
                >
                  {STATUT_ICONE[m.statut] && <Icon name={STATUT_ICONE[m.statut]!} />}
                  <span className="status-switch__label">{t(`statut.${m.statut}`)}</span>
                  <span className="status-switch__track">
                    <span className="status-switch__thumb" />
                  </span>
                </button>
                <button
                  className="btn--ghost"
                  style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSupprimer(m);
                  }}
                  title={t('memberGroup.removeTitle')}
                >
                  ✕
                </button>
              </div>
              <div className="list-item__details">
                <div className="list-item__subtitle">
                  {!masquerProfil && profil?.nom ? `${profil.nom} · ` : ''}XP {m.xp}
                </div>
                <div className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
                  {resumeEquipement(m)}
                </div>
                {resumeBlessures(m) && <div className="text-sm text-danger">{resumeBlessures(m)}</div>}
                {(m.hors_combat > 0 || inventaireGroupeMismatch(m)) && (
                  <div className="flex flex-wrap gap-sm" style={{ marginTop: '0.15rem' }}>
                    {m.hors_combat > 0 && (
                      <span className="badge badge--warning">
                        {m.hors_combat}/{m.taille_groupe} {t('memberGroup.hc')}
                      </span>
                    )}
                    {inventaireGroupeMismatch(m) && (
                      <span className="badge badge--danger" title={t('memberGroup.equipmentMismatchTitle')}>
                        ⚠ {t('memberGroup.equipmentMismatchBadge')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {membres.length === 0 && <p className="text-muted">{t('memberGroup.noMembers')}</p>}

      {idEnCours &&
        pointerPos &&
        (() => {
          const dragged = elements.find((x) => x.instance_id === idEnCours);
          if (!dragged) return null;
          const profil = resolveProfil(roster, dragged, catalogue, language);
          return (
            <div className="drag-ghost" style={{ left: pointerPos.x, top: pointerPos.y }}>
              <Icon name="poignee" size="0.85em" style={{ marginRight: '0.4em', color: 'var(--text-muted)' }} />
              <span className="drag-ghost__nom">{nomAffiche(dragged)}</span>
              {profil?.nom && <span className="drag-ghost__profil"> · {profil.nom}</span>}
            </div>
          );
        })()}
    </CollapsibleCard>
  );
}
