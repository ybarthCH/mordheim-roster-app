import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/RostersContext';
import { Screen } from '../common/Screen';
import { resolveProfil, nombreHeros } from '../../utils/profil';
import { getCatalogue } from '../../data/warbands';
import type { Stats } from '../../types/catalog';
import { STAT_KEYS } from '../../types/catalog';
import type { Statut } from '../../types/roster';
import { StatutCard } from './StatutCard';
import { CaracteristiquesCard } from './CaracteristiquesCard';
import { ResumeCard } from './ResumeCard';
import { ExperienceCard } from './ExperienceCard';
import { EquipementCard } from './EquipementCard';
import { SortsConnusCard } from './SortsConnusCard';
import { BlessuresGravesCard } from './BlessuresGravesCard';
import { CompetencesPanel } from './CompetencesPanel';
import { AvanceeModal } from './AvanceeModal';
import { BlessureGraveModal } from './BlessureGraveModal';
import { AchatEquipementModal } from './AchatEquipementModal';
import { RecruterDansGroupeModal } from './RecruterDansGroupeModal';
import { ItemDetailModal } from './ItemDetailModal';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { MagieReference } from '../common/CatalogueReference';
import { avancesDues } from '../../utils/xp';
import { ratingMembre } from '../../utils/rating';
import { skillById } from '../../data/gameData';
import {
  acheterPourMembre,
  retirerDeMembre,
  transfererVersStock,
  creerEntreesInventaire,
  entreesLieesAuGroupe,
  resumeInventaireParItem,
  formatEquipementAffiche,
  resolveItemDetail,
  prixVente,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import type { InventoryEntry } from '../../types/roster';

export function PersonnageScreen() {
  const { id, instanceId } = useParams<{ id: string; instanceId: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');
  const [modalAvancee, setModalAvancee] = useState(false);
  const [modalBlessure, setModalBlessure] = useState(false);
  const [modalSuppression, setModalSuppression] = useState(false);
  const [modalAchat, setModalAchat] = useState(false);
  const [modalRecruterGroupe, setModalRecruterGroupe] = useState(false);
  const [itemDetail, setItemDetail] = useState<InventoryEntry | null>(null);
  const [venteEnCours, setVenteEnCours] = useState<InventoryEntry | null>(null);

  const membre = roster?.membres.find((m) => m.instance_id === instanceId);
  const profil = roster && membre ? resolveProfil(roster, membre) : undefined;
  const catalogue = roster ? getCatalogue(roster.bande_id) : undefined;

  if (!roster || !membre || !profil || !catalogue) {
    return (
      <Screen title="Personnage introuvable" back={id ? `/roster/${id}` : '/'}>
        <p className="text-muted">Ce personnage n'existe pas (ou plus).</p>
      </Screen>
    );
  }

  const majMembre = (partial: Partial<typeof membre>) => {
    const membresMaj = roster.membres.map((m) =>
      m.instance_id === membre.instance_id ? { ...m, ...partial } : m
    );
    updateRoster({ ...roster, membres: membresMaj });
  };

  // Résultat de blessure grave "Gladiateur" gagné : la récompense en po
  // s'applique à la trésorerie de bande, pas au personnage — un seul appel à
  // updateRoster pour éviter qu'une mise à jour écrase l'autre.
  const appliquerBlessureGrave = (updated: typeof membre, tresorerieBonus: number) => {
    const membresMaj = roster.membres.map((m) => (m.instance_id === updated.instance_id ? updated : m));
    updateRoster({ ...roster, membres: membresMaj, tresorerie: roster.tresorerie + tresorerieBonus });
  };

  // Correction d'une saisie erronée : ne modifie ni stats, ni équipement, ni
  // trésorerie déjà appliqués — juste l'entrée d'historique elle-même.
  const supprimerBlessure = (id: string) => {
    majMembre({ blessures_graves: membre.blessures_graves.filter((b) => b.id !== id) });
  };

  // Recale la textbox "Équipement" (utilisée telle quelle par le post-bataille
  // et l'export PDF) sur l'inventaire structuré, à chaque achat/retrait.
  const avecEquipementSynchronise = (nouveauRoster: typeof roster, inventaire: typeof membre.inventaire) => ({
    ...nouveauRoster,
    membres: nouveauRoster.membres.map((m) =>
      m.instance_id === membre.instance_id ? { ...m, equipement: formatEquipementAffiche(inventaire) } : m
    ),
  });

  // Un groupe d'hommes de main ne peut pas mélanger son équipement : acheter
  // un objet l'équipe d'un coup pour toutes ses figurines (prix unitaire ×
  // taille du groupe).
  // Certains objets (ex : Bénédictions de Nurgle de la Kermesse du Chaos)
  // modifient en permanence les caractéristiques du membre à l'achat — un
  // seul ajustement même pour un groupe (taille_groupe), les figurines d'un
  // même groupe partageant un unique jeu de caractéristiques.
  const acheterItem = (item: ShopItem, coutPaye: number) => {
    const entrees = creerEntreesInventaire(item, coutPaye, membre.taille_groupe || 1);
    const nouveauRoster = acheterPourMembre(roster, membre.instance_id, entrees);
    const inventaire = [...membre.inventaire, ...entrees];
    let stats_actuels = membre.stats_actuels;
    let stats_modifiees = membre.stats_modifiees;
    if (item.stats_delta) {
      stats_actuels = { ...stats_actuels };
      stats_modifiees = [...stats_modifiees];
      for (const k of STAT_KEYS) {
        const delta = item.stats_delta[k];
        if (!delta) continue;
        stats_actuels[k] += delta;
        if (!stats_modifiees.includes(k)) stats_modifiees.push(k);
      }
    }
    updateRoster({
      ...nouveauRoster,
      membres: nouveauRoster.membres.map((m) =>
        m.instance_id === membre.instance_id
          ? { ...m, equipement: formatEquipementAffiche(inventaire), stats_actuels, stats_modifiees }
          : m
      ),
    });
  };

  // Supprime l'objet sans contrepartie (perdu, détruit...) — pour un groupe,
  // retire tous les exemplaires identiques (voir entreesLieesAuGroupe).
  const retirerItem = (instanceId: string) => {
    const aRetirer = new Set(entreesLieesAuGroupe(membre, instanceId).map((e) => e.instance_id));
    const sansItem = retirerDeMembre(roster, membre.instance_id, instanceId);
    const inventaire = membre.inventaire.filter((e) => !aRetirer.has(e.instance_id));
    updateRoster(avecEquipementSynchronise(sansItem, inventaire));
  };

  // Revend l'objet (et tous ses exemplaires identiques pour un groupe) :
  // moitié du prix payé (arrondi au supérieur), par exemplaire, reversée à
  // la trésorerie.
  const vendreItem = (instanceId: string) => {
    const aVendre = entreesLieesAuGroupe(membre, instanceId);
    if (aVendre.length === 0) return;
    const remboursement = aVendre.reduce((acc, e) => acc + prixVente(e.cout), 0);
    const aVendreIds = new Set(aVendre.map((e) => e.instance_id));
    const sansItem = retirerDeMembre(roster, membre.instance_id, instanceId);
    const inventaire = membre.inventaire.filter((e) => !aVendreIds.has(e.instance_id));
    updateRoster(
      avecEquipementSynchronise({ ...sansItem, tresorerie: sansItem.tresorerie + remboursement }, inventaire)
    );
  };

  const renvoyerStockItem = (instanceId: string) => {
    const aRenvoyer = new Set(entreesLieesAuGroupe(membre, instanceId).map((e) => e.instance_id));
    const nouveauRoster = transfererVersStock(roster, membre, instanceId);
    const inventaire = membre.inventaire.filter((e) => !aRenvoyer.has(e.instance_id));
    updateRoster(avecEquipementSynchronise(nouveauRoster, inventaire));
  };

  const editerStat = (k: keyof Stats, value: number) => {
    const stats_modifiees = membre.stats_modifiees.includes(k)
      ? membre.stats_modifiees
      : [...membre.stats_modifiees, k];
    majMembre({ stats_actuels: { ...membre.stats_actuels, [k]: value }, stats_modifiees });
  };

  const changerStatut = (s: Statut) => {
    if (s === 'mort') {
      majMembre({ statut: s, date_mort: new Date().toISOString().slice(0, 10) });
    } else {
      majMembre({ statut: s, date_mort: undefined });
    }
  };

  const nomCompetence = (skillId: string) =>
    skillById(skillId) ?? catalogue.competences_speciales.find((s) => s.id === skillId);

  // Hommes de main et animaux non promus : le statut Hors de combat / Blessé
  // n'a plus lieu d'être : le nombre de figurines hors combat se suit via le
  // compteur dédié, résolu figurine par figurine au post-bataille. Seuls
  // Actif et Mort restent pertinents pour l'historique.
  const estGroupeSimplifie = (profil.type === 'homme_de_main' || profil.type === 'animal') && !membre.promu_heros;

  const demiXp = !!catalogue.xp_demi;
  const dues = avancesDues(profil.type, membre.xp_depart, membre.xp, demiXp);
  const obtenues = membre.historique_avancees.length;
  const enAttente = Math.max(0, dues - obtenues);
  const rating = ratingMembre(membre, roster);
  const heroCount = nombreHeros(roster);

  // Regroupe l'inventaire par objet (un groupe d'hommes de main possède
  // toujours autant d'exemplaires identiques que de figurines) pour n'en
  // afficher qu'une ligne par objet, suffixée de la quantité.
  const inventaireGroupe = resumeInventaireParItem(membre.inventaire);

  const supprimerMembre = () => {
    updateRoster({ ...roster, membres: roster.membres.filter((m) => m.instance_id !== membre.instance_id) });
    navigate(`/roster/${roster.id}`);
  };

  return (
    <Screen title={membre.nom_perso} back={`/roster/${roster.id}`}>
      <StatutCard
        membre={membre}
        profil={profil}
        rating={rating}
        estGroupeSimplifie={estGroupeSimplifie}
        onMajMembre={majMembre}
        onChangerStatut={changerStatut}
        onOpenRecruterGroupe={() => setModalRecruterGroupe(true)}
      />

      {profil.regles_speciales && profil.regles_speciales.length > 0 && (
        <div className="card card--tight">
          <h3>
            <Icon name="parchemin" style={{ marginRight: '0.35em' }} />
            Règles spéciales du profil
          </h3>
          {profil.regles_speciales.map((r) => (
            <p key={r.nom} className="text-sm mb-0" style={{ whiteSpace: 'pre-line' }}>
              <strong>{r.nom}</strong> — {r.texte}
              {r.exception && <span className="text-muted"> ({r.exception})</span>}
            </p>
          ))}
        </div>
      )}

      <CaracteristiquesCard membre={membre} profil={profil} onEditerStat={editerStat} />

      <ResumeCard
        profil={profil}
        membre={membre}
        inventaireGroupe={inventaireGroupe}
        nomCompetence={nomCompetence}
        onItemClick={setItemDetail}
      />

      <ExperienceCard
        type={profil.type}
        membre={membre}
        demiXp={demiXp}
        enAttente={enAttente}
        onChangeXp={(xp) => majMembre({ xp })}
        onOpenAvancee={() => setModalAvancee(true)}
      />

      <EquipementCard
        membre={membre}
        inventaireGroupe={inventaireGroupe}
        onOpenAchat={() => setModalAchat(true)}
        onItemClick={setItemDetail}
        onRenvoyer={renvoyerStockItem}
        onVendre={setVenteEnCours}
        onRetirer={retirerItem}
      />

      <SortsConnusCard membre={membre} onMajMembre={majMembre} />

      <BlessuresGravesCard membre={membre} onOpenAjout={() => setModalBlessure(true)} onSupprimer={supprimerBlessure} />

      {profil.type === 'heros' && (
        <div className="card">
          <h3>Compétences</h3>
          <CompetencesPanel
            member={membre}
            profil={profil}
            catalogue={catalogue}
            onToggleSkill={(skillId) => {
              const acquises = membre.competences_acquises.includes(skillId)
                ? membre.competences_acquises.filter((s) => s !== skillId)
                : [...membre.competences_acquises, skillId];
              majMembre({ competences_acquises: acquises });
            }}
          />
        </div>
      )}

      <div className="card">
        <h3>Notes</h3>
        <textarea
          value={membre.notes}
          onChange={(e) => majMembre({ notes: e.target.value })}
          style={{
            width: '100%',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 0.6rem',
            minHeight: '3em',
          }}
        />
      </div>

      {membre.profil_custom && (
        <div className="card">
          <label className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={membre.grande_cible}
              onChange={(e) => majMembre({ grande_cible: e.target.checked })}
            />
            <span>
              <strong>
                <Icon name="cible" style={{ marginRight: '0.35em' }} />
                Grande Cible
              </strong>
              <br />
              <span className="text-sm text-muted">Case manuelle — ajoute +20 au rating de ce personnage.</span>
            </span>
          </label>
        </div>
      )}

      <MagieReference catalogue={catalogue} profilId={profil.id} />

      <button className="btn btn--danger btn--block" onClick={() => setModalSuppression(true)}>
        Retirer ce personnage de la bande
      </button>

      {modalAvancee && (
        <AvanceeModal
          member={membre}
          profil={profil}
          catalogue={catalogue}
          heroCount={heroCount}
          onClose={() => setModalAvancee(false)}
          onApply={(updated, nouveauMembre) => {
            const membresMaj = roster.membres.map((m) => (m.instance_id === updated.instance_id ? updated : m));
            updateRoster({
              ...roster,
              membres: nouveauMembre ? [...membresMaj, nouveauMembre] : membresMaj,
            });
          }}
        />
      )}
      {modalBlessure && (
        <BlessureGraveModal
          member={membre}
          onClose={() => setModalBlessure(false)}
          onApply={(updated, tresorerieBonus) => appliquerBlessureGrave(updated, tresorerieBonus)}
        />
      )}
      {modalAchat && (
        <AchatEquipementModal
          catalogue={catalogue}
          profil={profil}
          tresorerie={roster.tresorerie}
          competencesAcquises={membre.competences_acquises}
          inventaireActuel={membre.inventaire}
          tailleGroupe={membre.taille_groupe || 1}
          onClose={() => setModalAchat(false)}
          onAchat={acheterItem}
        />
      )}
      {modalRecruterGroupe && (
        <RecruterDansGroupeModal
          roster={roster}
          groupe={membre}
          coutUnitaire={profil.cout ?? 0}
          onClose={() => setModalRecruterGroupe(false)}
          onConfirm={updateRoster}
        />
      )}
      {itemDetail && <ItemDetailModal item={resolveItemDetail(itemDetail)} onClose={() => setItemDetail(null)} />}
      {venteEnCours && (
        <Modal onClose={() => setVenteEnCours(null)}>
          {(() => {
            const quantiteVente = entreesLieesAuGroupe(membre, venteEnCours.instance_id).length;
            const total = prixVente(venteEnCours.cout) * quantiteVente;
            return (
              <>
                <h3>
                  Vendre {venteEnCours.nom}
                  {quantiteVente > 1 ? ` ×${quantiteVente}` : ''} ?
                </h3>
                <p className="text-muted">
                  {quantiteVente > 1
                    ? `Les ${quantiteVente} exemplaires seront retirés de l'inventaire du groupe et`
                    : "L'objet sera retiré de l'inventaire et"}{' '}
                  {total} po seront ajoutées à la trésorerie de la bande.
                </p>
                <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                  <button className="btn" onClick={() => setVenteEnCours(null)}>
                    Annuler
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={() => {
                      vendreItem(venteEnCours.instance_id);
                      setVenteEnCours(null);
                    }}
                  >
                    Vendre pour {total} po
                  </button>
                </div>
              </>
            );
          })()}
        </Modal>
      )}
      {modalSuppression && (
        <Modal onClose={() => setModalSuppression(false)}>
          <h3>Retirer {membre.nom_perso} ?</h3>
          <p className="text-muted">Cette action supprime définitivement ce personnage du roster.</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setModalSuppression(false)}>
              Annuler
            </button>
            <button className="btn btn--danger" onClick={supprimerMembre}>
              Retirer
            </button>
          </div>
        </Modal>
      )}
    </Screen>
  );
}
