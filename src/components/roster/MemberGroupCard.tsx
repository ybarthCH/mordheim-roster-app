import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';
import { grilleXpDuProfil, nomAffiche, resolveProfil } from '../../utils/profil';
import { avancesDues, peutGagnerExperience } from '../../utils/xp';
import { nomCourtBlessure } from '../../utils/blessures';
import { inventaireGroupeMismatch } from '../../utils/shop';
import { useDragReorder } from '../../utils/useDragReorder';
import { estLeaderActuel } from '../../utils/leader';
import { STATUTS } from '../../types/roster';
import type { Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { getFrancTireur } from '../../data/hiredSwords';

const STATUT_BADGE: Record<string, string> = {
  actif: 'badge--success',
  hors_de_combat: 'badge--warning',
  mort: 'badge--danger',
  blesse: 'badge--neutral',
};

const STATUT_ICONE: Partial<Record<string, IconName>> = {
  hors_de_combat: 'ossements',
  mort: 'crane',
  blesse: 'goutte',
};

// Synopsis discret de l'équipement d'un membre (ou de son groupe, toujours
// identique entre figurines) pour l'aperçu du roster global. Affiché sur
// toute la largeur du tableau (voir la ligne dédiée sous chaque membre) :
// la limite ici n'est qu'un filet de sécurité contre un inventaire
// interminable, pas la contrainte principale.
function resumeEquipement(m: Member): string {
  if (m.inventaire.length === 0) return m.equipement || 'Sans équipement';
  const noms = m.inventaire.map((e) => e.nom).join(', ');
  return noms.length > 160 ? `${noms.slice(0, 160).trimEnd()}…` : noms;
}

// Idem pour les blessures graves accumulées : juste les titres, pas les
// descriptions complètes (disponibles sur la fiche personnage).
function resumeBlessures(m: Member): string | null {
  if (m.blessures_graves.length === 0) return null;
  return `Blessures : ${m.blessures_graves.map((b) => nomCourtBlessure(b)).join(' - ')}`;
}

function estHorsCombat(m: Member) {
  return m.statut === 'hors_de_combat' || m.hors_combat > 0;
}

type MemberGroupCardProps = {
  titre: string;
  membres: Member[];
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  onReordonner: (nouvelOrdre: Member[]) => void;
  onBasculerHorsCombat: (m: Member) => void;
  onSupprimer: (m: Member) => void;
};

export function MemberGroupCard({
  titre,
  membres,
  roster,
  catalogue,
  onReordonner,
  onBasculerHorsCombat,
  onSupprimer,
}: MemberGroupCardProps) {
  const navigate = useNavigate();
  const { elements, refItem, demarrerDrag, idEnCours, pointerPos } = useDragReorder(membres, onReordonner);

  const avanceEnAttente = (m: Member) => {
    const profil = resolveProfil(roster, m);
    if (!profil || !peutGagnerExperience(profil)) return false;
    if (getFrancTireur(m.franc_tireur_id)?.gagne_experience === false) return false;
    return (
      avancesDues(grilleXpDuProfil(profil), m.xp_depart, m.xp, !!catalogue?.xp_demi) >
      m.historique_avancees.filter((a) => !a.bonus).length
    );
  };

  // Un homme de main ou animal non promu n'utilise jamais le statut « Hors
  // de combat » (voir PersonnageScreen) : chaque clic marque une figurine de
  // plus via le compteur dédié, jusqu'à ce que tout le groupe soit à terre.
  // Seuls les héros (et hommes de main promus) basculent le statut lui-même.
  const titreHorsCombat = (m: Member) => {
    const profil = resolveProfil(roster, m);
    const estGroupeSimplifie = (profil?.type === 'homme_de_main' || profil?.type === 'animal') && !m.promu_heros;
    return estGroupeSimplifie
      ? `Marquer une figurine Hors de combat (${m.hors_combat}/${m.taille_groupe})`
      : 'Basculer Hors de combat';
  };

  return (
    <div className="card">
      <h3>
        <Icon name={titre === 'Héros' ? 'etoile' : 'bouclier'} style={{ marginRight: '0.35em' }} />
        {titre}
      </h3>
      <div className="roster-table-wrap">
        <table className="roster-table">
          <thead>
            <tr>
              <th style={{ width: '1.6rem' }}></th>
              <th>Nom</th>
              <th>Profil</th>
              <th>M</th>
              <th>CC</th>
              <th>CT</th>
              <th>F</th>
              <th>E</th>
              <th>PV</th>
              <th>I</th>
              <th>A</th>
              <th>Cd</th>
              <th>XP</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {elements.map((m) => {
              const profil = resolveProfil(roster, m);
              const versPersonnage = () => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`);
              return (
                <Fragment key={m.instance_id}>
                  <tr
                    ref={refItem('table', m.instance_id)}
                    className={`roster-table__row-principale${idEnCours === m.instance_id ? ' roster-table__row--fantome' : ''}`}
                    onClick={versPersonnage}
                  >
                    <td className="roster-table__poignee-cell">
                      <span
                        className="drag-handle drag-handle--discret"
                        onPointerDown={demarrerDrag(m.instance_id)}
                        onClick={(e) => e.stopPropagation()}
                        title="Glisser pour réordonner"
                      >
                        <Icon name="poignee" size="0.85em" />
                      </span>
                    </td>
                    <td>
                      {nomAffiche(m)}
                      {estLeaderActuel(roster, catalogue, m) && (
                        <span className="badge badge--info" style={{ marginLeft: '0.4rem' }} title="Chef de bande">
                          <Icon name="etoile" style={{ marginRight: '0.3em' }} /> Leader
                        </span>
                      )}
                      {avanceEnAttente(m) && (
                        <span className="badge badge--warning" style={{ marginLeft: '0.4rem' }} title="Avancée en attente">
                          Avancée en attente
                        </span>
                      )}
                    </td>
                    <td>{profil?.nom ?? m.profil_id}</td>
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
                      <span className={`badge ${STATUT_BADGE[m.statut]}`}>
                        {STATUT_ICONE[m.statut] && (
                          <Icon name={STATUT_ICONE[m.statut]!} style={{ marginRight: '0.35em' }} />
                        )}
                        {STATUTS.find((s) => s.id === m.statut)?.label}
                      </span>
                      {m.hors_combat > 0 && (
                        <span className="badge badge--warning" style={{ marginLeft: '0.3rem' }}>
                          {m.hors_combat}/{m.taille_groupe} HC
                        </span>
                      )}
                      {inventaireGroupeMismatch(m) && (
                        <span
                          className="badge badge--danger"
                          style={{ marginLeft: '0.3rem' }}
                          title="Équipement dépareillé entre les figurines du groupe"
                        >
                          ⚠ Équipement
                        </span>
                      )}
                      {m.franc_tireur_impaye && (
                        <span className="badge badge--warning" style={{ marginLeft: '0.3rem' }}>
                          Absent — solde impayée
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn--ghost"
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '0.2rem 0.4rem',
                            color: estHorsCombat(m) ? 'var(--warning)' : undefined,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBasculerHorsCombat(m);
                          }}
                          title={titreHorsCombat(m)}
                        >
                          HC
                        </button>
                        <button
                          className="btn--ghost"
                          style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSupprimer(m);
                          }}
                          title="Retirer de la bande"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="roster-table__row-synopsis" onClick={versPersonnage}>
                    <td colSpan={15} className="roster-table__synopsis-cell">
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
          const profil = resolveProfil(roster, m);
          return (
            <div
              key={m.instance_id}
              ref={refItem('card', m.instance_id)}
              className={`list-item${idEnCours === m.instance_id ? ' list-item--fantome' : ''}`}
              role="button"
              onClick={() => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`)}
            >
              <span
                className="drag-handle drag-handle--discret"
                onPointerDown={demarrerDrag(m.instance_id)}
                onClick={(e) => e.stopPropagation()}
                title="Glisser pour réordonner"
              >
                <Icon name="poignee" size="0.85em" />
              </span>
              <div className="list-item__main">
                <div className="list-item__title">
                  {nomAffiche(m)}
                  {estLeaderActuel(roster, catalogue, m) && (
                    <span className="badge badge--info" style={{ marginLeft: '0.4rem' }} title="Chef de bande">
                      <Icon name="etoile" style={{ marginRight: '0.3em' }} /> Leader
                    </span>
                  )}
                </div>
                <div className="list-item__subtitle">
                  {profil?.nom} · XP {m.xp} · PV {m.stats_actuels.PV}
                </div>
                <div className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
                  {resumeEquipement(m)}
                </div>
                {resumeBlessures(m) && <div className="text-sm text-danger">{resumeBlessures(m)}</div>}
              </div>
              {avanceEnAttente(m) && (
                <span className="badge badge--warning" title="Avancée en attente">
                  Avancée en attente
                </span>
              )}
              <span className={`badge ${STATUT_BADGE[m.statut]}`}>
                {STATUT_ICONE[m.statut] && <Icon name={STATUT_ICONE[m.statut]!} style={{ marginRight: '0.35em' }} />}
                {STATUTS.find((s) => s.id === m.statut)?.label}
              </span>
              {m.hors_combat > 0 && (
                <span className="badge badge--warning">
                  {m.hors_combat}/{m.taille_groupe} HC
                </span>
              )}
              {inventaireGroupeMismatch(m) && (
                <span className="badge badge--danger" title="Équipement dépareillé entre les figurines du groupe">
                  ⚠ Équipement
                </span>
              )}
              <button
                className="btn--ghost"
                style={{
                  border: 'none',
                  background: 'none',
                  padding: '0.2rem 0.4rem',
                  color: estHorsCombat(m) ? 'var(--warning)' : undefined,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onBasculerHorsCombat(m);
                }}
                title={titreHorsCombat(m)}
              >
                HC
              </button>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSupprimer(m);
                }}
                title="Retirer de la bande"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {membres.length === 0 && <p className="text-muted">Aucun membre recruté.</p>}

      {idEnCours &&
        pointerPos &&
        (() => {
          const dragged = elements.find((x) => x.instance_id === idEnCours);
          if (!dragged) return null;
          const profil = resolveProfil(roster, dragged);
          return (
            <div className="drag-ghost" style={{ left: pointerPos.x, top: pointerPos.y }}>
              <Icon name="poignee" size="0.85em" style={{ marginRight: '0.4em', color: 'var(--text-muted)' }} />
              <span className="drag-ghost__nom">{nomAffiche(dragged)}</span>
              {profil?.nom && <span className="drag-ghost__profil"> · {profil.nom}</span>}
            </div>
          );
        })()}
    </div>
  );
}
