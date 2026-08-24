import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/useRosters';
import { Screen } from '../common/Screen';
import { grilleXpDuProfil, resolveProfil, nombreHeros } from '../../utils/profil';
import { getCatalogue } from '../../data/warbands';
import type { Magie, Stats } from '../../types/catalog';
import type { AdvanceRecord, Statut } from '../../types/roster';
import { StatutCard } from './StatutCard';
import { CaracteristiquesCard } from './CaracteristiquesCard';
import { ResumeCard } from './ResumeCard';
import { ExperienceCard } from './ExperienceCard';
import { EquipementCard } from './EquipementCard';
import { ReglesSpecialesCard } from './ReglesSpecialesCard';
import { MagieConnueCard } from './MagieConnueCard';
import { BlessuresGravesCard } from './BlessuresGravesCard';
import { CompetencesPanel } from './CompetencesPanel';
import { AvanceeModal } from './AvanceeModal';
import { BlessureGraveModal } from './BlessureGraveModal';
import { AchatEquipementModal } from './AchatEquipementModal';
import { RecruterDansGroupeModal } from './RecruterDansGroupeModal';
import { ItemDetailModal } from './ItemDetailModal';
import { Modal } from '../common/Modal';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { Icon } from '../common/Icon';
import { MagieReference } from '../common/CatalogueReference';
import { avancesDues, avancesObtenues, peutGagnerExperience } from '../../utils/xp';
import { pvPerdusPourStatut } from '../../utils/stats';
import { ratingAfficheMembre } from '../../utils/displayedRating';
import { formatPowerValueTooltip, powerValueDetailMembre } from '../../utils/powerValue';
import { succederApresMorts } from '../../utils/leader';
import { estSorcier, migrerSortsConnus } from '../../utils/magie';
import { equitationGratuitePourTribu, SKILL_EQUITATION } from '../../utils/tribu';
import { skillById } from '../../data/gameData';
import { useLanguage } from '../../state/useLanguage';
import { translateSkill } from '../../i18n/data/skills';
import { translateWarbandCatalog } from '../../i18n/data/warbands';
import { magieMineure } from '../../i18n/data/minorMagic';
import {
  retirerDeMembre,
  transfererVersStock,
  resumeInventaireParItem,
  formatEquipementAffiche,
  inventaireComplet,
  resolveItemDetail,
  prixVente,
  appliquerAchatSurMembre,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import type { InventoryEntry } from '../../types/roster';
import { getFrancTireur } from '../../data/hiredSwords';
import { estDramatisPersonae } from '../../data/dramatisPersonae';
import { useGameRules } from '../../state/useGameRules';
import { annulerEffetsBlessure } from '../../utils/blessures';
import { annulerAvancee, avanceeReversible } from '../../utils/avancees';

const GRIMOIRE_DE_MAGIE_ID = 'grimoire_de_magie';

type PersonnageScreenProps = {
  // Rendu dans le volet détail du mode deux volets (RosterScreen, grands
  // écrans) : pas de chrome Screen (bandeau accent + retour) propre, juste un
  // petit en-tête local avec un bouton de fermeture. Voir RosterRoute.
  embedded?: boolean;
  // Fourni explicitement par RosterRoute/RosterScreen plutôt que relu depuis
  // useParams() : la route est /roster/:id/* (voir App.tsx, nécessaire pour
  // que React Router ne remonte pas ce sous-arbre à chaque changement de
  // membre sélectionné en mode deux volets), donc `instanceId` n'existe plus
  // comme paramètre de route nommé — seul `id` en reste un.
  instanceId?: string;
};

export function PersonnageScreen({ embedded, instanceId }: PersonnageScreenProps = {}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster, patchRoster } = useRosters();
  const { rules } = useGameRules();
  const { language, t } = useLanguage();
  const roster = getRosterById(id ?? '');
  const [modalAvancee, setModalAvancee] = useState(false);
  const [modalBlessure, setModalBlessure] = useState(false);
  const [modalSuppression, setModalSuppression] = useState(false);
  const [modalAchat, setModalAchat] = useState(false);
  const [modalRecruterGroupe, setModalRecruterGroupe] = useState(false);
  const [itemDetail, setItemDetail] = useState<InventoryEntry | null>(null);
  const [venteEnCours, setVenteEnCours] = useState<InventoryEntry | null>(null);
  const [avanceeAModifier, setAvanceeAModifier] = useState<AdvanceRecord | null>(null);

  const membre = roster?.membres.find((m) => m.instance_id === instanceId);
  const catalogueBrut = roster ? getCatalogue(roster.bande_id) : undefined;
  // translateWarbandCatalog reconstruit tout le catalogue en anglais à
  // chaque appel — memoïsé pour ne pas refaire ce travail à chaque rendu
  // (édition de stat, de trésorerie...) pour un utilisateur en anglais.
  const catalogue = useMemo(
    () => (catalogueBrut ? translateWarbandCatalog(catalogueBrut, language) : catalogueBrut),
    [catalogueBrut, language]
  );
  const profil = roster && membre ? resolveProfil(roster, membre, catalogue, language) : undefined;
  const francTireur = getFrancTireur(membre?.franc_tireur_id);

  // sorts_connus stockait autrefois le nom affiché du sort plutôt qu'un id
  // stable (voir MagieSort.id) : un sort choisi pendant que l'interface était
  // en anglais restait affiché en anglais même après repassage en français.
  // À l'ouverture d'une fiche, on tente de réécrire silencieusement toute
  // entrée héritée vers son id, en cherchant dans le catalogue de la bande
  // (français et anglais) et la Magie mineure (français et anglais) — seul
  // endroit où toutes ces données sont déjà chargées sans coût supplémentaire.
  // Une entrée sans correspondance reste en l'état (repli sur l'ancien texte).
  useEffect(() => {
    if (!roster || !membre || !catalogueBrut || membre.sorts_connus.length === 0) return;
    const catalogueEn = translateWarbandCatalog(catalogueBrut, 'en');
    const domaines: Magie[] = [];
    if (catalogueBrut.magie) domaines.push(catalogueBrut.magie);
    if (catalogueBrut.magie_variantes) domaines.push(...Object.values(catalogueBrut.magie_variantes));
    if (catalogueEn.magie) domaines.push(catalogueEn.magie);
    if (catalogueEn.magie_variantes) domaines.push(...Object.values(catalogueEn.magie_variantes));
    domaines.push(magieMineure('fr'), magieMineure('en'));
    const migres = migrerSortsConnus(membre.sorts_connus, domaines);
    if (migres.some((v, i) => v !== membre.sorts_connus[i])) {
      patchRoster(roster.id, (current) => ({
        ...current,
        membres: current.membres.map((m) => (m.instance_id === membre.instance_id ? { ...m, sorts_connus: migres } : m)),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster?.id, membre?.instance_id, membre?.sorts_connus, catalogueBrut]);

  if (!roster || !membre || !profil || !catalogue) {
    const corpsIntrouvable = <p className="text-muted">{t('personnage.notFoundBody')}</p>;
    return embedded ? (
      <div className="personnage-embedded">{corpsIntrouvable}</div>
    ) : (
      <Screen title={t('personnage.notFoundTitle')} back={id ? `/roster/${id}` : '/'}>
        {corpsIntrouvable}
      </Screen>
    );
  }

  const majMembre = (partial: Partial<typeof membre>) => {
    patchRoster(roster.id, (current) => ({
      ...current,
      membres: current.membres.map((m) => (m.instance_id === membre.instance_id ? { ...m, ...partial } : m)),
    }));
  };

  // Résultat de blessure grave "Gladiateur" gagné : la récompense en po
  // s'applique à la trésorerie de bande, pas au personnage — un seul appel à
  // updateRoster pour éviter qu'une mise à jour écrase l'autre. Une blessure
  // grave "Tué" peut aussi faire tomber le chef de bande (voir succession).
  const appliquerBlessureGrave = (updated: typeof membre, tresorerieBonus: number) => {
    patchRoster(roster.id, (current) => {
      const membresMaj = current.membres.map((m) => (m.instance_id === updated.instance_id ? updated : m));
      const succession = succederApresMorts(current, catalogue, membresMaj);
      return {
        ...current,
        ...succession,
        membres: membresMaj,
        tresorerie: current.tresorerie + tresorerieBonus,
      };
    });
  };

  // Correction d'une saisie erronée : annule l'effet sur les stats encore
  // actif (voir annulerEffetsBlessure), mais ne touche ni équipement, ni XP,
  // ni trésorerie déjà appliqués — seuls des effets ponctuels, pas des
  // ajustements permanents réversibles sans ambiguïté.
  const supprimerBlessure = (id: string) => {
    const blessure = membre.blessures_graves.find((b) => b.id === id);
    const annulation = blessure ? annulerEffetsBlessure(membre, blessure) : undefined;
    majMembre({
      ...annulation,
      blessures_graves: membre.blessures_graves.filter((b) => b.id !== id),
    });
  };

  // Corrige une avancée mal saisie : annule son effet (voir annulerAvancee)
  // et la retire de l'historique. L'avancée redevient alors "en attente" et
  // peut être relancée normalement via "Résoudre une avancée".
  const supprimerAvancee = (record: AdvanceRecord) => {
    majMembre(annulerAvancee(membre, record, (skillId) => nomCompetence(skillId)?.nom ?? skillId));
    setAvanceeAModifier(null);
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
    patchRoster(roster.id, (current) => {
      const membreCourant = current.membres.find((m) => m.instance_id === membre.instance_id) ?? membre;
      return appliquerAchatSurMembre(current, membreCourant, item, coutPaye);
    });
  };

  // Supprime un seul exemplaire sans contrepartie (perdu, détruit...) —
  // toujours un exemplaire à la fois, même dans un groupe d'hommes de main
  // (voir note sur transfererVersStock dans utils/shop.ts).
  const retirerItem = (instanceId: string) => {
    patchRoster(roster.id, (current) => {
      const membreCourant = current.membres.find((m) => m.instance_id === membre.instance_id) ?? membre;
      const sansItem = retirerDeMembre(current, membreCourant.instance_id, instanceId);
      const inventaire = membreCourant.inventaire.filter((e) => e.instance_id !== instanceId);
      return avecEquipementSynchronise(sansItem, inventaire);
    });
  };

  // Revend un seul exemplaire : moitié du prix payé (arrondi au supérieur)
  // reversée à la trésorerie.
  const vendreItem = (instanceId: string) => {
    patchRoster(roster.id, (current) => {
      const membreCourant = current.membres.find((m) => m.instance_id === membre.instance_id) ?? membre;
      const entree = membreCourant.inventaire.find((e) => e.instance_id === instanceId);
      if (!entree) return current;
      const remboursement = prixVente(entree.cout);
      const sansItem = retirerDeMembre(current, membreCourant.instance_id, instanceId);
      const inventaire = membreCourant.inventaire.filter((e) => e.instance_id !== instanceId);
      return avecEquipementSynchronise({ ...sansItem, tresorerie: sansItem.tresorerie + remboursement }, inventaire);
    });
  };

  const renvoyerStockItem = (instanceId: string) => {
    patchRoster(roster.id, (current) => {
      const membreCourant = current.membres.find((m) => m.instance_id === membre.instance_id) ?? membre;
      const nouveauRoster = transfererVersStock(current, membreCourant, instanceId);
      const inventaire = membreCourant.inventaire.filter((e) => e.instance_id !== instanceId);
      return avecEquipementSynchronise(nouveauRoster, inventaire);
    });
  };

  const editerStat = (k: keyof Stats, value: number) => {
    const stats_modifiees = membre.stats_modifiees.includes(k)
      ? membre.stats_modifiees
      : [...membre.stats_modifiees, k];
    majMembre({ stats_actuels: { ...membre.stats_actuels, [k]: value }, stats_modifiees });
  };

  const changerStatut = (s: Statut, toursBlesse?: number) => {
    if (s === 'mort') {
      const dateMort = new Date().toISOString().slice(0, 10);
      patchRoster(roster.id, (current) => {
        const membresApres = current.membres.map((m) =>
          m.instance_id === membre.instance_id ? { ...m, statut: s, date_mort: dateMort } : m
        );
        const succession = succederApresMorts(current, catalogue, membresApres);
        return { ...current, ...succession, membres: membresApres };
      });
    } else if (s === 'blesse') {
      majMembre({ statut: s, date_mort: undefined, blesse_tour_actuel: 0, blesse_tour_total: toursBlesse ?? 0 });
    } else {
      majMembre({ statut: s, date_mort: undefined, pv_perdus: pvPerdusPourStatut(membre, s) });
    }
  };

  const nomCompetence = (skillId: string) => {
    const found =
      skillById(skillId) ??
      profil.competences_speciales?.find((s) => s.id === skillId) ??
      catalogue.competences_speciales.find((s) => s.id === skillId);
    const base = found && translateSkill(found, language);
    if (base && skillId === SKILL_EQUITATION && membre.monture_equitation) {
      return { ...base, nom: `${base.nom} — ${membre.monture_equitation}` };
    }
    return base;
  };

  // Hommes de main et animaux non promus : le statut Hors de combat / Blessé
  // n'a plus lieu d'être : le nombre de figurines hors combat se suit via le
  // compteur dédié, résolu figurine par figurine au post-bataille. Seuls
  // Actif et Mort restent pertinents pour l'historique.
  const estGroupeSimplifie = (profil.type === 'homme_de_main' || profil.type === 'animal') && !membre.promu_heros;

  const demiXp = !!catalogue.xp_demi;
  const dues =
    francTireur?.gagne_experience === false || !peutGagnerExperience(profil)
      ? 0
      : avancesDues(grilleXpDuProfil(profil), membre.xp_depart, membre.xp, demiXp);
  const obtenues = avancesObtenues(membre.historique_avancees);
  // Le jet gratuit "Ce gars est doué" annulé (voir annulerAvancee) rouvre la
  // résolution d'avancée même si le compteur XP normal n'a rien à offrir.
  const enAttente = Math.max(0, dues - obtenues) + (membre.bonus_avancee_en_attente ? 1 : 0);
  const rating = ratingAfficheMembre(membre, roster, rules);
  const ratingTooltip = rules.valeurPuissanceActivee
    ? formatPowerValueTooltip(powerValueDetailMembre(membre, roster))
    : undefined;
  const heroCount = nombreHeros(roster);
  const grimoireMembre = membre.inventaire.find((entree) => entree.item_id === GRIMOIRE_DE_MAGIE_ID);
  const grimoireStock = roster.stock.find((entree) => entree.item_id === GRIMOIRE_DE_MAGIE_ID);

  // Regroupe l'inventaire par objet (un groupe d'hommes de main possède
  // toujours autant d'exemplaires identiques que de figurines) pour n'en
  // afficher qu'une ligne par objet, suffixée de la quantité.
  const inventaireGroupe = resumeInventaireParItem(membre.inventaire);

  const utiliserGrimoire = (idSort: string) => {
    if (membre.sorts_connus.includes(idSort)) return;
    if (!grimoireMembre && !grimoireStock) return;

    patchRoster(roster.id, (current) => {
      const membreCourant = current.membres.find((m) => m.instance_id === membre.instance_id) ?? membre;
      if (membreCourant.sorts_connus.includes(idSort)) return current;
      const inventaire = grimoireMembre
        ? membreCourant.inventaire.filter((entree) => entree.instance_id !== grimoireMembre.instance_id)
        : membreCourant.inventaire;
      const stock = !grimoireMembre && grimoireStock
        ? current.stock.filter((entree) => entree.instance_id !== grimoireStock.instance_id)
        : current.stock;

      return {
        ...current,
        stock,
        membres: current.membres.map((m) =>
          m.instance_id === membre.instance_id
            ? {
                ...m,
                inventaire,
                equipement: grimoireMembre ? formatEquipementAffiche(inventaire) : m.equipement,
                sorts_connus: [...m.sorts_connus, idSort],
              }
            : m
        ),
      };
    });
  };

  const supprimerMembre = () => {
    patchRoster(roster.id, (current) => ({
      ...current,
      membres: current.membres.filter((m) => m.instance_id !== membre.instance_id),
    }));
    navigate(`/roster/${roster.id}`);
  };

  return (
    <PersonnageChrome
      embedded={embedded}
      title={membre.nom_perso}
      backTo={`/roster/${roster.id}`}
      onClose={() => navigate(`/roster/${roster.id}`)}
      closeLabel={t('common.close')}
    >
      <StatutCard
        membre={membre}
        profil={profil}
        rating={rating}
        ratingEstPowerValue={rules.valeurPuissanceActivee}
        ratingTooltip={ratingTooltip}
        estGroupeSimplifie={estGroupeSimplifie}
        onMajMembre={majMembre}
        onChangerStatut={changerStatut}
        onOpenRecruterGroupe={() => setModalRecruterGroupe(true)}
      />

      {profil.regles_speciales && profil.regles_speciales.length > 0 && (
        <CollapsibleCard
          preferenceKey="ui.personnage.regles_speciales_profil.ouvert"
          className="card card--tight"
          title={
            <>
              <Icon name="parchemin" style={{ marginRight: '0.35em' }} />
              {t('personnage.profileSpecialRules')}
            </>
          }
        >
          {profil.regles_speciales.map((r) => (
            <p key={r.nom} className="text-sm mb-0" style={{ whiteSpace: 'pre-line' }}>
              <strong>{r.nom}</strong> — {r.texte}
              {r.exception && <span className="text-muted"> ({r.exception})</span>}
            </p>
          ))}
        </CollapsibleCard>
      )}

      <CaracteristiquesCard membre={membre} profil={profil} onEditerStat={editerStat} rules={rules} />

      <ResumeCard
        profil={profil}
        membre={membre}
        catalogue={catalogue}
        rules={rules}
        inventaireGroupe={inventaireGroupe}
        nomCompetence={nomCompetence}
        onItemClick={setItemDetail}
      />

      <ExperienceCard
        type={grilleXpDuProfil(profil)}
        membre={membre}
        demiXp={demiXp}
        enAttente={enAttente}
        onChangeXp={(xp) => majMembre({ xp })}
        onOpenAvancee={() => setModalAvancee(true)}
        onModifierAvancee={setAvanceeAModifier}
        gagneExperience={francTireur?.gagne_experience !== false && peutGagnerExperience(profil)}
      />

      <EquipementCard
        membre={membre}
        inventaireGroupe={inventaireGroupe}
        onOpenAchat={() => setModalAchat(true)}
        onItemClick={setItemDetail}
        onRenvoyer={renvoyerStockItem}
        onVendre={setVenteEnCours}
        onRetirer={retirerItem}
        verrouille={!!francTireur}
      />

      {estSorcier(catalogue, profil, membre.marque) && (
        <MagieConnueCard
          membre={membre}
          profil={profil}
          catalogue={catalogue}
          roster={roster}
          onMajMembre={majMembre}
          grimoireDisponible={!!(grimoireMembre || grimoireStock)}
          onUtiliserGrimoire={utiliserGrimoire}
        />
      )}

      <ReglesSpecialesCard membre={membre} onMajMembre={majMembre} />

      {profil.type === 'heros' && (!francTireur || estDramatisPersonae(membre)) && (
        <BlessuresGravesCard
          membre={membre}
          onOpenAjout={() => setModalBlessure(true)}
          onSupprimer={supprimerBlessure}
        />
      )}

      {profil.type === 'heros' && (
        <CollapsibleCard
          preferenceKey="ui.personnage.competences.ouvert"
          defaultOpen={false}
          title={
            <>
              <Icon name="grimoire" style={{ marginRight: '0.35em' }} />
              {t('personnage.skills')}
            </>
          }
        >
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
        </CollapsibleCard>
      )}

      <CollapsibleCard preferenceKey="ui.personnage.notes.ouvert" title={t('personnage.notes')}>
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
      </CollapsibleCard>

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
                {t('personnage.bigTarget')}
              </strong>
              <br />
              <span className="text-sm text-muted">{t('personnage.bigTargetNote')}</span>
            </span>
          </label>
        </div>
      )}

      <MagieReference catalogue={catalogue} profil={profil} marqueId={membre.marque} />

      <button className="btn btn--danger btn--block" onClick={() => setModalSuppression(true)}>
        {t('personnage.removeButton')}
      </button>

      {modalAvancee && (
        <AvanceeModal
          member={membre}
          profil={profil}
          catalogue={catalogue}
          roster={roster}
          heroCount={heroCount}
          equitationGratuite={equitationGratuitePourTribu(catalogue, roster)}
          onClose={() => setModalAvancee(false)}
          onApply={(updated, nouveauMembre) => {
            const membresMaj = roster.membres.map((m) => (m.instance_id === updated.instance_id ? updated : m));
            const succession = succederApresMorts(roster, catalogue, membresMaj);
            updateRoster({
              ...roster,
              ...succession,
              membres: nouveauMembre ? [...membresMaj, nouveauMembre] : membresMaj,
            });
          }}
        />
      )}
      {modalBlessure && (
        <BlessureGraveModal
          member={membre}
          profil={profil}
          tresorerieDisponible={roster.tresorerie}
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
          marqueId={membre.marque}
          inventaireActuel={membre.inventaire}
          inventaireBande={inventaireComplet(roster)}
          roster={roster}
          tailleGroupe={membre.taille_groupe || 1}
          objetsPersonnalises={roster.objets_personnalises}
          objetsSurcharges={roster.objets_surcharges}
          onObjetsPersonnalisesChange={(objets) => updateRoster({ ...roster, objets_personnalises: objets })}
          onObjetsSurchargesChange={(surcharges) => updateRoster({ ...roster, objets_surcharges: surcharges })}
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
      {itemDetail && (
        <ItemDetailModal
          item={resolveItemDetail(itemDetail, catalogue.id, rules)}
          onClose={() => setItemDetail(null)}
        />
      )}
      {venteEnCours && (
        <Modal onClose={() => setVenteEnCours(null)}>
          {(() => {
            const total = prixVente(venteEnCours.cout);
            return (
              <>
                <h3>
                  {t('personnage.sellTitlePrefix')} {venteEnCours.nom} ?
                </h3>
                <p className="text-muted">
                  {t('personnage.sellBodySingle')} {t('personnage.sellBodySuffix', { total })}
                </p>
                <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                  <button className="btn" onClick={() => setVenteEnCours(null)}>
                    {t('personnage.cancel')}
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={() => {
                      vendreItem(venteEnCours.instance_id);
                      setVenteEnCours(null);
                    }}
                  >
                    {t('personnage.sellForPrefix')} {total} {t('creation.gc')}
                  </button>
                </div>
              </>
            );
          })()}
        </Modal>
      )}
      {modalSuppression && (
        <Modal onClose={() => setModalSuppression(false)}>
          <h3>
            {t('personnage.removeConfirmTitlePrefix')} {membre.nom_perso} ?
          </h3>
          <p className="text-muted">{t('personnage.removeConfirmBody')}</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setModalSuppression(false)}>
              {t('personnage.cancel')}
            </button>
            <button className="btn btn--danger" onClick={supprimerMembre}>
              {t('personnage.remove')}
            </button>
          </div>
        </Modal>
      )}
      {avanceeAModifier && (
        <Modal onClose={() => setAvanceeAModifier(null)}>
          <h3>{t('personnage.editAdvanceTitle')}</h3>
          <p className="text-muted">
            {avanceeAModifier.date} ({t('personnage.editAdvanceRollPrefix')} {avanceeAModifier.roll}) — {avanceeAModifier.detail}
          </p>
          {avanceeReversible(avanceeAModifier) ? (
            <>
              <p className="text-sm text-muted">{t('personnage.editAdvanceReversibleBody')}</p>
              <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                <button className="btn" onClick={() => setAvanceeAModifier(null)}>
                  {t('personnage.cancel')}
                </button>
                <button className="btn btn--danger" onClick={() => supprimerAvancee(avanceeAModifier)}>
                  {t('personnage.cancelAdvance')}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">{t('personnage.editAdvanceIrreversibleBody')}</p>
              <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                <button className="btn" onClick={() => setAvanceeAModifier(null)}>
                  {t('personnage.close')}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </PersonnageChrome>
  );
}

type PersonnageChromeProps = {
  embedded?: boolean;
  title: string;
  backTo: string;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
};

// Bascule entre le chrome plein écran habituel (Screen : bandeau accent +
// retour) et un en-tête local léger pour le volet détail du mode deux volets
// — les données/logique de PersonnageScreen restent identiques dans les deux
// cas, seul l'habillage change.
function PersonnageChrome({ embedded, title, backTo, onClose, closeLabel, children }: PersonnageChromeProps) {
  if (embedded) {
    return (
      <div className="personnage-embedded">
        <div className="personnage-embedded__head">
          <span className="personnage-embedded__title">{title}</span>
          <button className="icon-btn personnage-embedded__close" onClick={onClose} aria-label={closeLabel}>
            ×
          </button>
        </div>
        <div className="personnage-embedded__body personnage-sheet">{children}</div>
      </div>
    );
  }
  return (
    <Screen title={title} back={backTo}>
      <div className="personnage-sheet">{children}</div>
    </Screen>
  );
}
