import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/RostersContext';
import { Screen } from '../common/Screen';
import { resolveProfil, nombreHeros } from '../../utils/profil';
import { getCatalogue } from '../../data/warbands';
import { STAT_KEYS } from '../../types/catalog';
import type { Stats } from '../../types/catalog';
import { STATUTS } from '../../types/roster';
import type { Statut, SeriousInjuryRecord } from '../../types/roster';
import { XpGrid } from './XpGrid';
import { CompetencesPanel } from './CompetencesPanel';
import { AvanceeModal } from './AvanceeModal';
import { BlessureGraveModal } from './BlessureGraveModal';
import { AchatEquipementModal } from './AchatEquipementModal';
import { RecruterDansGroupeModal } from './RecruterDansGroupeModal';
import { ItemDetailModal } from './ItemDetailModal';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';
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
  inventaireGroupeMismatch,
  formatEquipementAffiche,
  libelleCategorie,
  iconeCategorie,
  resolveItemDetail,
  resumeItem,
  prixVente,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import type { InventoryEntry } from '../../types/roster';

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

// Compatibilité avec d'anciens enregistrements (roll/resultat/effet) sauvegardés
// avant le passage de la table déroulante à la saisie libre.
function injuryLabel(b: SeriousInjuryRecord): string {
  if (b.description) return b.description;
  const legacy = b as unknown as { resultat?: string; effet?: string };
  return [legacy.resultat, legacy.effet].filter(Boolean).join(' — ') || '(sans description)';
}

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
  const [nouveauSort, setNouveauSort] = useState('');
  const [itemDetail, setItemDetail] = useState<InventoryEntry | null>(null);
  const [venteEnCours, setVenteEnCours] = useState<InventoryEntry | null>(null);

  const membre = roster?.membres.find((m) => m.instance_id === instanceId);
  const profil = roster && membre ? resolveProfil(roster, membre) : undefined;
  const catalogue = roster ? getCatalogue(roster.bande_id) : undefined;

  // Saisie gardée en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper un
  // chiffre) — la conversion/le plancher ne s'appliquent qu'à l'usage, la
  // valeur n'est répercutée sur le membre que si elle est valide.
  const [tailleGroupeSaisie, setTailleGroupeSaisie] = useState(String(membre?.taille_groupe ?? 1));
  // Ne resynchronise qu'au changement de personnage affiché (navigation) :
  // le champ lui-même pilote déjà membre.taille_groupe en écriture (voir
  // onChange plus bas), l'y re-souscrire aussi en lecture court-circuiterait
  // la saisie en cours.
  useEffect(() => {
    if (membre) setTailleGroupeSaisie(String(membre.taille_groupe));
  }, [membre?.instance_id]);

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
  const acheterItem = (item: ShopItem, coutPaye: number) => {
    const entrees = creerEntreesInventaire(item, coutPaye, membre.taille_groupe || 1);
    const nouveauRoster = acheterPourMembre(roster, membre.instance_id, entrees);
    updateRoster(avecEquipementSynchronise(nouveauRoster, [...membre.inventaire, ...entrees]));
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
  const statutsDisponibles = estGroupeSimplifie
    ? STATUTS.filter((s) => s.id === 'actif' || s.id === 'mort')
    : STATUTS;

  const demiXp = !!catalogue.xp_demi;
  const dues = avancesDues(profil.type, membre.xp_depart, membre.xp, demiXp);
  const obtenues = membre.historique_avancees.length;
  const enAttente = Math.max(0, dues - obtenues);
  const rating = ratingMembre(membre, roster);
  const plafond = catalogue.caracteristiques_max?.[0];
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
      <div className="card">
        <div className="flex justify-between items-center">
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={membre.nom_perso}
              onChange={(e) => majMembre({ nom_perso: e.target.value })}
              className="input--heading"
            />
            <p className="text-muted text-sm mb-0">
              {profil.nom} ·{' '}
              {profil.type === 'heros' ? 'Héros' : profil.type === 'animal' ? 'Animal' : 'Homme de main'}
              {membre.promu_heros && ' (promu)'}
              {membre.profil_custom && ' · Franc-tireur'}
            </p>
          </div>
          <span className={`badge ${STATUT_BADGE[membre.statut]}`}>
            {STATUT_ICONE[membre.statut] && (
              <Icon name={STATUT_ICONE[membre.statut]!} style={{ marginRight: '0.35em' }} />
            )}
            {STATUTS.find((s) => s.id === membre.statut)?.label}
            {membre.statut === 'mort' && membre.date_mort ? ` (${membre.date_mort})` : ''}
          </span>
        </div>

        <div className="status-select" style={{ marginTop: '0.7rem' }}>
          {statutsDisponibles.map((s) => (
            <button
              key={s.id}
              className={`status-pill ${membre.statut === s.id ? 'status-pill--active' : ''}`}
              onClick={() => changerStatut(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {membre.statut === 'blesse' && (
          <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
            <span className="text-sm text-muted">Blessé :</span>
            <input
              type="number"
              className="stat-grid__input stat-grid__input--pv"
              value={membre.blesse_tour_actuel}
              onChange={(e) => majMembre({ blesse_tour_actuel: Number(e.target.value) || 0 })}
            />
            <span>/</span>
            <input
              type="number"
              className="stat-grid__input stat-grid__input--pv"
              value={membre.blesse_tour_total}
              onChange={(e) => majMembre({ blesse_tour_total: Number(e.target.value) || 0 })}
            />
            <span className="text-sm text-muted">tour(s)</span>
          </div>
        )}

        <div className="flex items-center gap-sm" style={{ marginTop: '0.7rem' }}>
          <span className="badge badge--info">Rating {rating}</span>
        </div>

        {estGroupeSimplifie && (
          <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
            <span className="text-sm text-muted">Groupe :</span>
            <input
              type="number"
              min={1}
              className="stat-grid__input stat-grid__input--pv"
              value={tailleGroupeSaisie}
              onChange={(e) => {
                const raw = e.target.value;
                setTailleGroupeSaisie(raw);
                const n = parseInt(raw, 10);
                if (raw.trim() !== '' && n >= 1) majMembre({ taille_groupe: n });
              }}
              onBlur={() => setTailleGroupeSaisie(String(membre.taille_groupe))}
            />
            <span className="text-sm text-muted">
              figurine{membre.taille_groupe > 1 ? 's' : ''} identique{membre.taille_groupe > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {estGroupeSimplifie && (
          <div style={{ marginTop: '0.6rem' }}>
            <button className="btn btn--sm" onClick={() => setModalRecruterGroupe(true)}>
              + Recruter un nouveau membre dans ce groupe
            </button>
          </div>
        )}

        {estGroupeSimplifie && (
          <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
            <span className="text-sm text-muted">Hors de combat :</span>
            <button
              className="btn btn--sm"
              onClick={() => majMembre({ hors_combat: Math.max(0, membre.hors_combat - 1) })}
            >
              −
            </button>
            <strong>
              {membre.hors_combat} / {membre.taille_groupe}
            </strong>
            <button
              className="btn btn--sm"
              onClick={() => majMembre({ hors_combat: Math.min(membre.taille_groupe, membre.hors_combat + 1) })}
            >
              +
            </button>
            {membre.hors_combat > 0 && (
              <span className="text-sm text-muted">à résoudre au prochain post-bataille</span>
            )}
          </div>
        )}
      </div>

      {profil.regles_speciales && profil.regles_speciales.length > 0 && (
        <div className="card card--tight">
          <h3>Règles spéciales du profil</h3>
          {profil.regles_speciales.map((r) => (
            <p key={r.nom} className="text-sm mb-0" style={{ whiteSpace: 'pre-line' }}>
              <strong>{r.nom}</strong> — {r.texte}
              {r.exception && <span className="text-muted"> ({r.exception})</span>}
            </p>
          ))}
        </div>
      )}

      <div className="card">
        <h3>Caractéristiques</h3>
        <div className="stat-grid">
          {STAT_KEYS.map((k) => (
            <div key={k} className="stat-grid__cell stat-grid__cell--label">
              {k}
            </div>
          ))}
          {STAT_KEYS.map((k) => (
            <div
              key={k}
              className={`stat-grid__cell stat-grid__cell--value ${
                membre.stats_modifiees.includes(k) ? 'stat-grid__cell--modified' : ''
              }`}
            >
              <input
                type="number"
                className="stat-grid__input"
                value={membre.stats_actuels[k]}
                onChange={(e) => editerStat(k, Number(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
        {plafond && (
          <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            Plafond de caractéristiques ({plafond.profil}) :{' '}
            {plafond.note ??
              STAT_KEYS.map((k) => `${k} ${plafond[k] ?? '—'}`).join(' · ')}
          </p>
        )}
      </div>

      <div className="card">
        {profil.type === 'heros' && (
          <>
            <p className="text-sm mb-0">
              <strong>Compétences</strong>
            </p>
            {membre.competences_acquises.length > 0 ? (
              membre.competences_acquises.map((id) => {
                const s = nomCompetence(id);
                return (
                  <p key={id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                    <strong>{s?.nom ?? id}</strong>
                    {s?.texte && <span className="text-muted"> — {s.texte}</span>}
                  </p>
                );
              })
            ) : (
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                Aucune
              </p>
            )}
          </>
        )}

        <p className="text-sm mb-0" style={{ marginTop: profil.type === 'heros' ? '0.7rem' : 0 }}>
          <strong>Équipement</strong>
        </p>
        {inventaireGroupe.length > 0 ? (
          inventaireGroupe.map(({ entree, quantite }) => {
            const detail = resolveItemDetail(entree);
            const synopsis = resumeItem(detail);
            return (
              <p key={entree.instance_id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                <button className="link-inline" onClick={() => setItemDetail(entree)}>
                  {entree.nom}
                  {quantite > 1 ? ` ×${quantite}` : ''}
                </button>
                {synopsis && (
                  <span className="text-muted">
                    {' '}
                    — {synopsis.length > 70 ? `${synopsis.slice(0, 70).trimEnd()}…` : synopsis}
                  </span>
                )}
              </p>
            );
          })
        ) : (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            Aucun
          </p>
        )}

        <p className="text-sm mb-0" style={{ marginTop: '0.7rem' }}>
          <strong>Règles spéciales / Sorts connus / mutations</strong>
        </p>
        {membre.sorts_connus.length > 0 ? (
          membre.sorts_connus.map((s, i) => (
            <p key={i} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              {s}
            </p>
          ))
        ) : (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            Aucune
          </p>
        )}

        <p className="text-sm mb-0" style={{ marginTop: '0.7rem' }}>
          <strong>Blessures graves</strong>
        </p>
        {membre.blessures_graves.length > 0 ? (
          membre.blessures_graves.map((b) => (
            <p key={b.id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              {b.date} — {injuryLabel(b)}
            </p>
          ))
        ) : (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            Aucune
          </p>
        )}
      </div>

      {profil.type === 'animal' ? (
        <div className="card">
          <h3 className="mt-0">Expérience</h3>
          <p className="text-muted text-sm mb-0">Les animaux ne gagnent jamais d'expérience.</p>
        </div>
      ) : (
        <div className="card">
          <div className="flex justify-between items-center">
            <h3 className="mt-0 mb-0">Expérience</h3>
            <span className="badge badge--info">{membre.xp} XP</span>
          </div>
          <XpGrid
            type={profil.type}
            xp={membre.xp}
            xpDepart={membre.xp_depart}
            onChange={(xp) => majMembre({ xp })}
            demiXp={demiXp}
          />
          <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            XP de départ : {membre.xp_depart} (n'a déclenché aucune avancée).
          </p>
          {enAttente > 0 && (
            <div className="flex justify-between items-center" style={{ marginTop: '0.7rem' }}>
              <span className="badge badge--warning">{enAttente} avancée(s) en attente</span>
              <button className="btn btn--sm btn--primary" onClick={() => setModalAvancee(true)}>
                Résoudre une avancée
              </button>
            </div>
          )}
          {membre.historique_avancees.length > 0 && (
            <div style={{ marginTop: '0.7rem' }}>
              <p className="text-sm text-muted mb-0">Historique des avancées :</p>
              {membre.historique_avancees.map((a) => (
                <p key={a.id} className="text-sm mb-0">
                  {a.date} (jet {a.roll}) — {a.detail}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: '0.7rem' }}>
          <h3 className="mt-0 mb-0">Équipement</h3>
          <button className="btn btn--sm btn--primary" onClick={() => setModalAchat(true)}>
            + Acheter
          </button>
        </div>
        {inventaireGroupeMismatch(membre) && (
          <p className="text-sm text-danger" style={{ marginTop: 0 }}>
            ⚠ Équipement dépareillé : ce groupe de {membre.taille_groupe} figurines ne possède pas les mêmes objets
            en nombre égal pour chacune (probablement un objet donné depuis l'armurerie à une seule figurine).
            Complète les exemplaires manquants ou renvoie les objets en trop au stock.
          </p>
        )}
        {inventaireGroupe.length === 0 && <p className="text-muted text-sm">Aucun objet acheté.</p>}
        {inventaireGroupe.map(({ entree, quantite }) => (
          <div key={entree.instance_id} className="list-item">
            <div
              className="list-item__main"
              role="button"
              style={{ cursor: 'pointer' }}
              onClick={() => setItemDetail(entree)}
            >
              <div className="list-item__title" style={{ textDecoration: 'underline' }}>
                {entree.nom}
                {quantite > 1 ? ` ×${quantite}` : ''}
              </div>
              <div className="list-item__subtitle">
                {iconeCategorie(entree.categorie) && (
                  <Icon name={iconeCategorie(entree.categorie)!} style={{ marginRight: '0.35em' }} />
                )}
                {libelleCategorie(entree.categorie)} · {entree.cout} po
                {quantite > 1 ? ` /figurine (${entree.cout * quantite} po au total)` : ''}
                {entree.cout_notation ? ` (jet : ${entree.cout_notation})` : ''}
              </div>
            </div>
            <div className="flex gap-sm">
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
                onClick={() => renvoyerStockItem(entree.instance_id)}
                title={quantite > 1 ? `Renvoyer les ${quantite} exemplaires au stock de la bande` : 'Renvoyer au stock de la bande'}
              >
                ↩
              </button>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
                onClick={() => setVenteEnCours(entree)}
                title={`Vendre (+${prixVente(entree.cout) * quantite} po à la trésorerie)`}
              >
                Vendre
              </button>
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
                onClick={() => retirerItem(entree.instance_id)}
                title={quantite > 1 ? `Supprimer les ${quantite} exemplaires sans contrepartie (perdu, détruit…)` : 'Supprimer sans contrepartie (perdu, détruit…)'}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Règles spéciales / Sorts connus / mutations</h3>
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.6rem' }}>
          {membre.sorts_connus.map((s, i) => (
            <span key={i} className="badge badge--info">
              {s}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
                onClick={() => majMembre({ sorts_connus: membre.sorts_connus.filter((_, j) => j !== i) })}
              >
                ✕
              </button>
            </span>
          ))}
          {membre.sorts_connus.length === 0 && <span className="text-muted text-sm">Aucun</span>}
        </div>
        <div className="flex gap-sm">
          <input
            value={nouveauSort}
            onChange={(e) => setNouveauSort(e.target.value)}
            placeholder="Ex : Nuages de mouches : -1 pour être touché au corps à corps"
            style={{
              flex: 1,
              background: 'var(--bg-inset)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.6rem',
            }}
          />
          <button
            className="btn"
            onClick={() => {
              if (!nouveauSort.trim()) return;
              majMembre({ sorts_connus: [...membre.sorts_connus, nouveauSort.trim()] });
              setNouveauSort('');
            }}
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
          <h3 className="mt-0 mb-0">Blessures graves</h3>
          <button className="btn btn--sm btn--primary" onClick={() => setModalBlessure(true)}>
            + Enregistrer un résultat
          </button>
        </div>
        {membre.blessures_graves.length === 0 && <p className="text-muted text-sm">Aucune.</p>}
        {membre.blessures_graves.map((b) => (
          <div
            key={b.id}
            className="flex justify-between"
            style={{ alignItems: 'flex-start', gap: '0.4rem', marginTop: '0.3rem' }}
          >
            <p className="text-sm mb-0">
              {b.date} — {injuryLabel(b)}
            </p>
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)', flexShrink: 0 }}
              onClick={() => supprimerBlessure(b.id)}
              title="Supprimer cette entrée de l'historique"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

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
