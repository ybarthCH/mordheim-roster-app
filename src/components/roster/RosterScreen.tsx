import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/RostersContext';
import { Screen } from '../common/Screen';
import { Modal } from '../common/Modal';
import { getCatalogue } from '../../data/warbands';
import { resolveProfil } from '../../utils/profil';
import { valeurBande, effectifTotal } from '../../utils/bandeValue';
import { ratingTotal } from '../../utils/rating';
import { validerComposition, validerEffectif } from '../../utils/validation';
import { exporterRoster } from '../../utils/importExport';
import { AjouterMembreModal } from './AjouterMembreModal';
import { AjouterBatailleModal } from './AjouterBatailleModal';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import { ItemDetailModal } from '../personnage/ItemDetailModal';
import { EquipementReference, MagieReference } from '../common/CatalogueReference';
import { STATUTS } from '../../types/roster';
import type { BattleRecord, Member, RosterInstance, InventoryEntry } from '../../types/roster';
import { avancesDues } from '../../utils/xp';
import {
  acheterPourStock,
  retirerDuStock,
  transfererVersMembre,
  creerEntreeInventaire,
  formatEquipementAffiche,
  libelleCategorie,
  resolveItemDetail,
  prixVente,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';

const STATUT_BADGE: Record<string, string> = {
  actif: 'badge--success',
  hors_de_combat: 'badge--warning',
  mort: 'badge--danger',
  blesse: 'badge--neutral',
};

export function RosterScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');
  const [modalMembre, setModalMembre] = useState(false);
  const [modalBataille, setModalBataille] = useState(false);
  const [batailleEnEdition, setBatailleEnEdition] = useState<BattleRecord | null>(null);
  const [membreASupprimer, setMembreASupprimer] = useState<Member | null>(null);
  const [batailleASupprimer, setBatailleASupprimer] = useState<BattleRecord | null>(null);
  const [modalAchatStock, setModalAchatStock] = useState(false);
  const [itemDetail, setItemDetail] = useState<InventoryEntry | null>(null);
  const [venteEnCours, setVenteEnCours] = useState<InventoryEntry | null>(null);

  if (!roster) {
    return (
      <Screen title="Bande introuvable" back="/">
        <p className="text-muted">Ce roster n'existe pas (ou plus) dans le stockage local.</p>
      </Screen>
    );
  }

  const catalogue = getCatalogue(roster.bande_id);
  const violations = validerComposition(roster);
  const violationsEffectif = validerEffectif(roster);
  const heros = roster.membres.filter((m) => resolveProfil(roster, m)?.type === 'heros');
  const hommesDeMain = roster.membres.filter((m) => resolveProfil(roster, m)?.type !== 'heros');

  const patch = (partial: Partial<RosterInstance>) => {
    updateRoster({ ...roster, ...partial });
  };

  const acheterPourArmurerie = (item: ShopItem, coutPaye: number) => {
    updateRoster(acheterPourStock(roster, creerEntreeInventaire(item, coutPaye)));
  };

  // Supprime l'objet du stock sans contrepartie (perdu, détruit...).
  const retirerStock = (instanceId: string) => {
    updateRoster(retirerDuStock(roster, instanceId));
  };

  // Revend l'objet du stock : moitié du prix payé (arrondi au supérieur) reversée à la trésorerie.
  const vendreStock = (instanceId: string) => {
    const entree = roster.stock.find((e) => e.instance_id === instanceId);
    if (!entree) return;
    const sansItem = retirerDuStock(roster, instanceId);
    updateRoster({ ...sansItem, tresorerie: sansItem.tresorerie + prixVente(entree.cout) });
  };

  const donnerAMembre = (instanceId: string, membreId: string) => {
    const nouveauRoster = transfererVersMembre(roster, instanceId, membreId);
    updateRoster({
      ...nouveauRoster,
      membres: nouveauRoster.membres.map((m) =>
        m.instance_id === membreId ? { ...m, equipement: formatEquipementAffiche(m.inventaire) } : m
      ),
    });
  };

  const nomAffiche = (m: Member) => `${m.nom_perso}${m.taille_groupe > 1 ? ` × ${m.taille_groupe}` : ''}`;

  // Synopsis discret de l'équipement d'un membre (ou de son groupe, toujours
  // identique entre figurines) pour l'aperçu du roster global.
  const resumeEquipement = (m: Member): string => {
    if (m.inventaire.length === 0) return 'Sans équipement';
    const noms = m.inventaire.map((e) => e.nom).join(', ');
    return noms.length > 90 ? `${noms.slice(0, 90).trimEnd()}…` : noms;
  };

  const avanceEnAttente = (m: Member) => {
    const profil = resolveProfil(roster, m);
    if (!profil) return false;
    return avancesDues(profil.type, m.xp_depart, m.xp) > m.historique_avancees.length;
  };

  // Bascule rapide du statut Hors de combat depuis le roster global, sans
  // ouvrir la fiche personnage — utile en cours de partie.
  const basculerHorsCombat = (m: Member) => {
    const nouveauStatut = m.statut === 'hors_de_combat' ? 'actif' : 'hors_de_combat';
    patch({
      membres: roster.membres.map((x) =>
        x.instance_id === m.instance_id ? { ...x, statut: nouveauStatut, date_mort: undefined } : x
      ),
    });
  };

  // Réordonne un membre au sein de sa section (Héros / Hommes de main),
  // en échangeant sa position avec son voisin dans la liste affichée.
  const deplacerMembre = (section: Member[], m: Member, direction: -1 | 1) => {
    const idx = section.findIndex((x) => x.instance_id === m.instance_id);
    const idxVoisin = idx + direction;
    if (idx < 0 || idxVoisin < 0 || idxVoisin >= section.length) return;
    const voisin = section[idxVoisin];
    patch({
      membres: roster.membres.map((x) => {
        if (x.instance_id === m.instance_id) return voisin;
        if (x.instance_id === voisin.instance_id) return m;
        return x;
      }),
    });
  };

  const renderGroupe = (titre: string, membres: Member[]) => (
    <div className="card">
      <h3>{titre}</h3>
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
                  <td>
                    {nomAffiche(m)}
                    {profil?.est_leader && (
                      <span className="badge badge--info" style={{ marginLeft: '0.4rem' }} title="Chef de bande">
                        ★ Leader
                      </span>
                    )}
                    {avanceEnAttente(m) && (
                      <span className="badge badge--warning" style={{ marginLeft: '0.4rem' }} title="Avancée en attente">
                        Avancée en attente
                      </span>
                    )}
                    <div className="text-sm text-muted" style={{ fontStyle: 'italic', marginTop: '0.1rem' }}>
                      {resumeEquipement(m)}
                    </div>
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
                      {STATUTS.find((s) => s.id === m.statut)?.label}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn--ghost"
                        style={{ border: 'none', background: 'none', padding: '0.2rem 0.3rem' }}
                        disabled={i === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          deplacerMembre(membres, m, -1);
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
                          deplacerMembre(membres, m, 1);
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
                          color: m.statut === 'hors_de_combat' ? 'var(--warning)' : undefined,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          basculerHorsCombat(m);
                        }}
                        title="Basculer Hors de combat"
                      >
                        HC
                      </button>
                      <button
                        className="btn--ghost"
                        style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMembreASupprimer(m);
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
                      ★ Leader
                    </span>
                  )}
                </div>
                <div className="list-item__subtitle">
                  {profil?.nom} · XP {m.xp} · PV {m.stats_actuels.PV}
                </div>
                <div className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
                  {resumeEquipement(m)}
                </div>
              </div>
              {avanceEnAttente(m) && (
                <span className="badge badge--warning" title="Avancée en attente">
                  Avancée en attente
                </span>
              )}
              <span className={`badge ${STATUT_BADGE[m.statut]}`}>
                {STATUTS.find((s) => s.id === m.statut)?.label}
              </span>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.3rem' }}
                disabled={i === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  deplacerMembre(membres, m, -1);
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
                  deplacerMembre(membres, m, 1);
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
                  color: m.statut === 'hors_de_combat' ? 'var(--warning)' : undefined,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  basculerHorsCombat(m);
                }}
                title="Basculer Hors de combat"
              >
                HC
              </button>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setMembreASupprimer(m);
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

  return (
    <Screen
      title={roster.nom_bande}
      back="/"
      actions={
        <div className="flex gap-sm">
          <button className="icon-btn" onClick={() => exporterRoster(roster)} title="Export JSON">
            JSON
          </button>
          <button
            className="icon-btn"
            onClick={() => import('../../utils/pdfExport').then((m) => m.exporterRosterPDF(roster))}
            title="Export PDF"
          >
            PDF
          </button>
        </div>
      }
    >
      <div className="card">
        <div className="flex justify-between items-center">
          <h2 className="mt-0 mb-0">{catalogue?.nom ?? roster.bande_id}</h2>
        </div>
        <div className="summary-grid" style={{ marginTop: '0.7rem' }}>
          <div className="summary-tile">
            <div className="summary-tile__value">{valeurBande(roster)}</div>
            <div className="summary-tile__label">Valeur (po)</div>
          </div>
          <div className="summary-tile">
            <div className="summary-tile__value">{effectifTotal(roster)}</div>
            <div className="summary-tile__label">Membres</div>
          </div>
          <div className="summary-tile">
            <div className="summary-tile__value">{ratingTotal(roster)}</div>
            <div className="summary-tile__label">Rating</div>
          </div>
          <div className="summary-tile">
            <input
              type="number"
              value={roster.tresorerie}
              onChange={(e) => patch({ tresorerie: Number(e.target.value) || 0 })}
              style={{
                width: '100%',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'inherit',
              }}
            />
            <div className="summary-tile__label">Trésorerie (po)</div>
          </div>
          <div className="summary-tile">
            <input
              type="number"
              value={roster.wyrdstone}
              onChange={(e) => patch({ wyrdstone: Number(e.target.value) || 0 })}
              style={{
                width: '100%',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'inherit',
              }}
            />
            <div className="summary-tile__label">Wyrdstone</div>
          </div>
        </div>
        <div className="field" style={{ marginTop: '0.7rem' }}>
          <label>Équipement en réserve</label>
          <textarea
            value={roster.equipement_reserve}
            onChange={(e) => patch({ equipement_reserve: e.target.value })}
            placeholder="Objets non attribués, réserve de la bande…"
          />
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <h3 className="mt-0 mb-0">Armurerie de la bande</h3>
          <button className="btn btn--sm" onClick={() => setModalAchatStock(true)}>
            + Acheter
          </button>
        </div>
        {roster.stock.length === 0 && <p className="text-muted text-sm">Stock vide.</p>}
        {roster.stock.map((entree) => (
          <div key={entree.instance_id} className="list-item">
            <div
              className="list-item__main"
              role="button"
              style={{ cursor: 'pointer' }}
              onClick={() => setItemDetail(entree)}
            >
              <div className="list-item__title" style={{ textDecoration: 'underline' }}>
                {entree.nom}
              </div>
              <div className="list-item__subtitle">
                {libelleCategorie(entree.categorie)} · {entree.cout} po
                {entree.cout_notation ? ` (jet : ${entree.cout_notation})` : ''}
              </div>
            </div>
            <div className="flex gap-sm items-center">
              <select value="" onChange={(e) => e.target.value && donnerAMembre(entree.instance_id, e.target.value)}>
                <option value="">Donner à…</option>
                {roster.membres.map((m) => (
                  <option key={m.instance_id} value={m.instance_id}>
                    {nomAffiche(m)}
                  </option>
                ))}
              </select>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
                onClick={() => setVenteEnCours(entree)}
                title={`Vendre (+${prixVente(entree.cout)} po à la trésorerie)`}
              >
                Vendre
              </button>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                onClick={() => retirerStock(entree.instance_id)}
                title="Supprimer sans contrepartie (perdu, détruit…)"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {(violations.length > 0 || violationsEffectif.length > 0) && (
        <div className="card" style={{ borderColor: 'var(--warning)' }}>
          <h3 style={{ color: 'var(--warning)' }}>Composition — à vérifier</h3>
          <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
            Purement indicatif, n'empêche rien.
          </p>
          {violationsEffectif.map((v) => (
            <p key={`effectif-${v.type}`} className="text-sm mb-0">
              Effectif de la bande : {v.actuel} ({v.type === 'max' ? `max ${v.limite}` : `min ${v.limite}`})
            </p>
          ))}
          {violations.map((v) => (
            <p key={`${v.profilId}-${v.type}`} className="text-sm mb-0">
              {v.nomProfil} : {v.actuel}/{v.limite} {v.type === 'max' ? 'autorisés' : 'requis (minimum)'}
            </p>
          ))}
        </div>
      )}

      {catalogue && catalogue.regles_speciales.length > 0 && (
        <div className="card card--tight">
          <h3>Règles spéciales</h3>
          {catalogue.regles_speciales.map((r) => (
            <p key={r.nom} className="text-sm" style={{ whiteSpace: 'pre-line' }}>
              <strong>{r.nom}</strong> — {r.texte}
              {r.exception && <span className="text-muted"> ({r.exception})</span>}
            </p>
          ))}
        </div>
      )}

      <div className="top-actions">
        <button className="btn btn--primary" onClick={() => setModalMembre(true)}>
          + Recruter
        </button>
        <button className="btn" onClick={() => navigate(`/roster/${roster.id}/post-bataille`)}>
          Assistant post-bataille
        </button>
      </div>

      {renderGroupe('Héros', heros)}
      {renderGroupe('Hommes de main', hommesDeMain)}

      <div className="card">
        <div className="flex justify-between items-center">
          <h3 className="mt-0 mb-0">Historique des batailles</h3>
          <button className="btn btn--sm" onClick={() => setModalBataille(true)}>
            + Ajouter
          </button>
        </div>
        {roster.historique_batailles.length === 0 && (
          <p className="text-muted text-sm">Aucune bataille enregistrée.</p>
        )}
        {roster.historique_batailles
          .slice()
          .reverse()
          .map((b) => (
            <div
              key={b.id}
              className="list-item"
              role="button"
              style={{ marginBottom: '0.5rem' }}
              onClick={() => setBatailleEnEdition(b)}
            >
              <div className="list-item__main">
                <div className="list-item__title">
                  {b.date} —{' '}
                  <span
                    className={
                      b.resultat === 'victoire'
                        ? 'text-success'
                        : b.resultat === 'defaite'
                          ? 'text-danger'
                          : ''
                    }
                  >
                    {b.resultat}
                  </span>
                </div>
                <div className="list-item__subtitle">
                  {b.adversaires.length > 0 && `vs ${b.adversaires.join(', ')}`} {b.notes}
                </div>
              </div>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setBatailleASupprimer(b);
                }}
                title="Supprimer cette bataille"
              >
                ✕
              </button>
            </div>
          ))}
      </div>

      {catalogue && <EquipementReference catalogue={catalogue} />}
      {catalogue && <MagieReference catalogue={catalogue} />}

      {modalAchatStock && catalogue && (
        <AchatEquipementModal
          catalogue={catalogue}
          profil={null}
          tresorerie={roster.tresorerie}
          onClose={() => setModalAchatStock(false)}
          onAchat={acheterPourArmurerie}
        />
      )}
      {itemDetail && <ItemDetailModal item={resolveItemDetail(itemDetail)} onClose={() => setItemDetail(null)} />}
      {venteEnCours && (
        <Modal onClose={() => setVenteEnCours(null)}>
          <h3>Vendre {venteEnCours.nom} ?</h3>
          <p className="text-muted">
            L'objet sera retiré de l'armurerie et {prixVente(venteEnCours.cout)} po seront ajoutées à la trésorerie
            de la bande.
          </p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setVenteEnCours(null)}>
              Annuler
            </button>
            <button
              className="btn btn--primary"
              onClick={() => {
                vendreStock(venteEnCours.instance_id);
                setVenteEnCours(null);
              }}
            >
              Vendre pour {prixVente(venteEnCours.cout)} po
            </button>
          </div>
        </Modal>
      )}
      {modalMembre && (
        <AjouterMembreModal
          roster={roster}
          onClose={() => setModalMembre(false)}
          onConfirm={(r) => {
            updateRoster(r);
            setModalMembre(false);
          }}
        />
      )}
      {modalBataille && (
        <AjouterBatailleModal
          onClose={() => setModalBataille(false)}
          onConfirm={(bataille) => {
            patch({ historique_batailles: [...roster.historique_batailles, bataille] });
            setModalBataille(false);
          }}
        />
      )}
      {batailleEnEdition && (
        <AjouterBatailleModal
          bataille={batailleEnEdition}
          onClose={() => setBatailleEnEdition(null)}
          onConfirm={(bataille) => {
            patch({
              historique_batailles: roster.historique_batailles.map((b) => (b.id === bataille.id ? bataille : b)),
            });
            setBatailleEnEdition(null);
          }}
          onDelete={() => {
            patch({
              historique_batailles: roster.historique_batailles.filter((b) => b.id !== batailleEnEdition.id),
            });
            setBatailleEnEdition(null);
          }}
        />
      )}
      {membreASupprimer && (
        <Modal onClose={() => setMembreASupprimer(null)}>
          <h3>Retirer {membreASupprimer.nom_perso} ?</h3>
          <p className="text-muted">Cette action supprime définitivement ce personnage (ou groupe) du roster.</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setMembreASupprimer(null)}>
              Annuler
            </button>
            <button
              className="btn btn--danger"
              onClick={() => {
                patch({ membres: roster.membres.filter((m) => m.instance_id !== membreASupprimer.instance_id) });
                setMembreASupprimer(null);
              }}
            >
              Retirer
            </button>
          </div>
        </Modal>
      )}
      {batailleASupprimer && (
        <Modal onClose={() => setBatailleASupprimer(null)}>
          <h3>Supprimer la bataille du {batailleASupprimer.date} ?</h3>
          <p className="text-muted">Cette action supprime définitivement cette entrée de l'historique.</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setBatailleASupprimer(null)}>
              Annuler
            </button>
            <button
              className="btn btn--danger"
              onClick={() => {
                patch({
                  historique_batailles: roster.historique_batailles.filter(
                    (b) => b.id !== batailleASupprimer.id
                  ),
                });
                setBatailleASupprimer(null);
              }}
            >
              Supprimer
            </button>
          </div>
        </Modal>
      )}
    </Screen>
  );
}
