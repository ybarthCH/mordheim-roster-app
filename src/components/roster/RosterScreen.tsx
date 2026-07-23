import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/RostersContext';
import { Screen } from '../common/Screen';
import { Modal } from '../common/Modal';
import { getCatalogue } from '../../data/warbands';
import { resolveProfil } from '../../utils/profil';
import { validerComposition, validerEffectif } from '../../utils/validation';
import { exporterRoster, partageDisponible, partagerRoster } from '../../utils/importExport';
import { AjouterMembreModal } from './AjouterMembreModal';
import { RosterSummaryCard } from './RosterSummaryCard';
import { ArmurerieSection } from './ArmurerieSection';
import { MemberGroupCard } from './MemberGroupCard';
import { HistoriqueBataillesSection } from './HistoriqueBataillesSection';
import { EquipementReference, MagieReference } from '../common/CatalogueReference';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import {
  acheterPourStock,
  retirerDuStock,
  transfererVersMembre,
  creerEntreeInventaire,
  formatEquipementAffiche,
  prixVente,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { Icon } from '../common/Icon';

export function RosterScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');
  const [modalMembre, setModalMembre] = useState(false);
  const [membreASupprimer, setMembreASupprimer] = useState<Member | null>(null);

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
  const effectifDepasse = violationsEffectif.find((v) => v.type === 'max');
  const heros = roster.membres.filter((m) => resolveProfil(roster, m)?.type === 'heros');
  const hommesDeMain = roster.membres.filter((m) => resolveProfil(roster, m)?.type !== 'heros');

  const patch = (partial: Partial<RosterInstance>) => {
    updateRoster({ ...roster, ...partial });
  };

  // Ouvre le menu de partage natif (Drive, mail, Dropbox...) pour que le
  // joueur choisisse lui-même où sauvegarder sa bande, sans backend ni
  // compte côté app. Le support du partage de fichier via cette API varie
  // beaucoup selon navigateur/OS (même quand navigator.share existe) : en
  // cas d'échec (hors annulation volontaire), on se rabat automatiquement
  // sur le téléchargement JSON classique plutôt que de laisser le joueur
  // sans solution.
  const partager = async () => {
    try {
      await partagerRoster(roster);
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;
      exporterRoster(roster);
    }
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

  // Bascule rapide du statut Hors de combat depuis le roster global, sans
  // ouvrir la fiche personnage — utile en cours de partie. Un homme de main
  // ou animal non promu n'utilise jamais le statut « Hors de combat » (voir
  // PersonnageScreen) : chaque clic marque une figurine de plus via le
  // compteur dédié, jusqu'à ce que tout le groupe soit à terre, puis
  // reboucle à 0. Seuls les héros (et hommes de main promus) basculent le
  // statut lui-même.
  const basculerHorsCombat = (m: Member) => {
    const profil = resolveProfil(roster, m);
    const estGroupeSimplifie = (profil?.type === 'homme_de_main' || profil?.type === 'animal') && !m.promu_heros;
    if (estGroupeSimplifie) {
      const nouveauHC = m.hors_combat >= m.taille_groupe ? 0 : m.hors_combat + 1;
      patch({
        membres: roster.membres.map((x) => (x.instance_id === m.instance_id ? { ...x, hors_combat: nouveauHC } : x)),
      });
      return;
    }
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

  return (
    <Screen
      title={roster.nom_bande}
      back="/"
      actions={
        <div className="flex gap-sm">
          {partageDisponible() && (
            <button className="icon-btn" onClick={partager} title="Partager (Drive, mail, Dropbox…)">
              Partager
            </button>
          )}
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
      {effectifDepasse && (
        <div className="banner-danger">
          <span className="banner-danger__icon" aria-hidden="true">
            ⚠
          </span>
          <span>
            Effectif dépassé : {effectifDepasse.actuel} guerriers pour un maximum de {effectifDepasse.limite}.
          </span>
        </div>
      )}

      <RosterSummaryCard roster={roster} catalogue={catalogue} onPatch={patch} />

      <ArmurerieSection
        roster={roster}
        catalogue={catalogue}
        onAchat={acheterPourArmurerie}
        onDonner={donnerAMembre}
        onVendre={vendreStock}
        onRetirer={retirerStock}
      />

      {(violations.length > 0 || violationsEffectif.some((v) => v.type === 'min')) && (
        <div className="card" style={{ borderColor: 'var(--warning)' }}>
          <h3 style={{ color: 'var(--warning)' }}>Composition — à vérifier</h3>
          <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
            Purement indicatif, n'empêche rien.
          </p>
          {violationsEffectif
            .filter((v) => v.type === 'min')
            .map((v) => (
              <p key={`effectif-${v.type}`} className="text-sm mb-0">
                Effectif de la bande : {v.actuel} (min {v.limite})
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
          <h3>
            <Icon name="parchemin" style={{ marginRight: '0.35em' }} />
            Règles spéciales
          </h3>
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

      <MemberGroupCard
        titre="Héros"
        membres={heros}
        roster={roster}
        catalogue={catalogue}
        onDeplacer={deplacerMembre}
        onBasculerHorsCombat={basculerHorsCombat}
        onSupprimer={setMembreASupprimer}
      />
      <MemberGroupCard
        titre="Hommes de main"
        membres={hommesDeMain}
        roster={roster}
        catalogue={catalogue}
        onDeplacer={deplacerMembre}
        onBasculerHorsCombat={basculerHorsCombat}
        onSupprimer={setMembreASupprimer}
      />

      <HistoriqueBataillesSection
        historique={roster.historique_batailles}
        onAjouter={(bataille) => patch({ historique_batailles: [...roster.historique_batailles, bataille] })}
        onModifier={(bataille) =>
          patch({
            historique_batailles: roster.historique_batailles.map((b: BattleRecord) =>
              b.id === bataille.id ? bataille : b
            ),
          })
        }
        onSupprimer={(id) =>
          patch({ historique_batailles: roster.historique_batailles.filter((b) => b.id !== id) })
        }
      />

      {catalogue && <EquipementReference catalogue={catalogue} />}
      {catalogue && <MagieReference catalogue={catalogue} />}

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
    </Screen>
  );
}
