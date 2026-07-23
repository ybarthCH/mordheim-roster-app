import { useNavigate } from 'react-router-dom';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';
import { resolveProfil } from '../../utils/profil';
import { avancesDues } from '../../utils/xp';
import { nomCourtBlessure } from '../../utils/blessures';
import { inventaireGroupeMismatch } from '../../utils/shop';
import { STATUTS } from '../../types/roster';
import type { Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';

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

const nomAffiche = (m: Member) => `${m.nom_perso}${m.taille_groupe > 1 ? ` × ${m.taille_groupe}` : ''}`;

// Synopsis discret de l'équipement d'un membre (ou de son groupe, toujours
// identique entre figurines) pour l'aperçu du roster global.
function resumeEquipement(m: Member): string {
  if (m.inventaire.length === 0) return 'Sans équipement';
  const noms = m.inventaire.map((e) => e.nom).join(', ');
  return noms.length > 90 ? `${noms.slice(0, 90).trimEnd()}…` : noms;
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
  onDeplacer: (section: Member[], m: Member, direction: -1 | 1) => void;
  onBasculerHorsCombat: (m: Member) => void;
  onSupprimer: (m: Member) => void;
};

export function MemberGroupCard({
  titre,
  membres,
  roster,
  catalogue,
  onDeplacer,
  onBasculerHorsCombat,
  onSupprimer,
}: MemberGroupCardProps) {
  const navigate = useNavigate();

  const avanceEnAttente = (m: Member) => {
    const profil = resolveProfil(roster, m);
    if (!profil) return false;
    return avancesDues(profil.type, m.xp_depart, m.xp, !!catalogue?.xp_demi) > m.historique_avancees.length;
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
            {membres.map((m, i) => {
              const profil = resolveProfil(roster, m);
              return (
                <tr key={m.instance_id} onClick={() => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`)}>
                  <td className="roster-table__nom">
                    {nomAffiche(m)}
                    {profil?.est_leader && (
                      <span className="badge badge--info" style={{ marginLeft: '0.4rem' }} title="Chef de bande">
                        <Icon name="etoile" style={{ marginRight: '0.3em' }} /> Leader
                      </span>
                    )}
                    {avanceEnAttente(m) && (
                      <span className="badge badge--warning" style={{ marginLeft: '0.4rem' }} title="Avancée en attente">
                        Avancée en attente
                      </span>
                    )}
                    <div
                      className="text-sm text-muted roster-table__synopsis"
                      style={{ fontStyle: 'italic', marginTop: '0.1rem' }}
                    >
                      {resumeEquipement(m)}
                    </div>
                    {resumeBlessures(m) && (
                      <div className="text-sm text-danger roster-table__synopsis" style={{ marginTop: '0.1rem' }}>
                        {resumeBlessures(m)}
                      </div>
                    )}
                  </td>
                  <td>{profil?.nom ?? m.profil_id}</td>
                  <td>{m.stats_actuels.M}</td>
                  <td>{m.stats_actuels.CC}</td>
                  <td>{m.stats_actuels.CT}</td>
                  <td>{m.stats_actuels.F}</td>
                  <td>{m.stats_actuels.E}</td>
                  <td>{m.stats_actuels.PV}</td>
                  <td>{m.stats_actuels.I}</td>
                  <td>{m.stats_actuels.A}</td>
                  <td>{m.stats_actuels.Cd}</td>
                  <td>{m.xp}</td>
                  <td>
                    <span className={`badge ${STATUT_BADGE[m.statut]}`}>
                      {STATUT_ICONE[m.statut] && <Icon name={STATUT_ICONE[m.statut]!} style={{ marginRight: '0.35em' }} />}
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
                  </td>
                  <td>
                    <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn--ghost"
                        style={{ border: 'none', background: 'none', padding: '0.2rem 0.3rem' }}
                        disabled={i === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeplacer(membres, m, -1);
                        }}
                        title="Monter"
                      >
                        ↑
                      </button>
                      <button
                        className="btn--ghost"
                        style={{ border: 'none', background: 'none', padding: '0.2rem 0.3rem' }}
                        disabled={i === membres.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeplacer(membres, m, 1);
                        }}
                        title="Descendre"
                      >
                        ↓
                      </button>
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
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="member-cards">
        {membres.map((m, i) => {
          const profil = resolveProfil(roster, m);
          return (
            <div
              key={m.instance_id}
              className="list-item"
              role="button"
              onClick={() => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`)}
            >
              <div className="list-item__main">
                <div className="list-item__title">
                  {nomAffiche(m)}
                  {profil?.est_leader && (
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
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.3rem' }}
                disabled={i === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeplacer(membres, m, -1);
                }}
                title="Monter"
              >
                ↑
              </button>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.3rem' }}
                disabled={i === membres.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeplacer(membres, m, 1);
                }}
                title="Descendre"
              >
                ↓
              </button>
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
    </div>
  );
}
