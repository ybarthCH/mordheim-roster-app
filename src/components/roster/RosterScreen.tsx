import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/useRosters';
import { usePersistentDisclosure } from '../../state/usePersistentDisclosure';
import { getSetting, setSetting } from '../../db/db';
import { Screen } from '../common/Screen';
import { Modal } from '../common/Modal';
import { getCatalogue } from '../../data/warbands';
import { grilleXpDuProfil, resolveProfil } from '../../utils/profil';
import { HENCHMAN_XP_MAX, HERO_XP_MAX, peutGagnerExperience } from '../../utils/xp';
import { pvPerdusPourStatut, pvRestant } from '../../utils/stats';
import { choixLeaderRequis, succederApresMorts } from '../../utils/leader';
import { validerComposition, validerEffectif } from '../../utils/validation';
import { exporterRoster, partageDisponible, partagerRoster } from '../../utils/importExport';
import { AjouterMembreModal } from './AjouterMembreModal';
import { RosterSummaryCard } from './RosterSummaryCard';
import { ArmurerieSection } from './ArmurerieSection';
import { MemberGroupCard } from './MemberGroupCard';
import { MemberQuickList } from './MemberQuickList';
import { HistoriqueBataillesSection } from './HistoriqueBataillesSection';
import { PromotionHerosDechuModal } from './PromotionHerosDechuModal';
import { EquipementReference, MagieReference } from '../common/CatalogueReference';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { AvanceeModal } from '../personnage/AvanceeModal';
import { nombreHeros } from '../../utils/profil';
import { tribuChoisie, equitationGratuitePourTribu } from '../../utils/tribu';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import {
  acheterPourStock,
  retirerDuStock,
  transfererVersMembre,
  creerEntreeInventaire,
  formatEquipementAffiche,
  inventaireComplet,
  prixVente,
  trouverTrinketsLimitesEnTrop,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { Icon } from '../common/Icon';
import { estFrancTireur, getFrancTireur } from '../../data/hiredSwords';
import { estDramatisPersonae } from '../../data/dramatisPersonae';
import { useGameRules } from '../../state/useGameRules';
import { useLanguage } from '../../state/useLanguage';
import { translateWarbandCatalog } from '../../i18n/data/warbands';
import { PersonnageScreen } from '../personnage/PersonnageScreen';

// Largeur de la colonne liste en mode deux volets, mémorisée en fraction de
// la largeur du conteneur (pas en pixels) pour rester cohérente d'un
// appareil à l'autre — voir la poignée de redimensionnement plus bas.
const SPLIT_LIST_WIDTH_KEY = 'ui.roster.splitListWidthPct';
const SPLIT_LIST_WIDTH_DEFAUT = 0.35;
const SPLIT_LIST_WIDTH_MIN_PX = 220;
// Laisse l'utilisateur sacrifier délibérément de la largeur au volet détail
// pour élargir la colonne liste, jusqu'à 75% du conteneur.
const SPLIT_LIST_WIDTH_MAX_PCT = 0.75;

type RosterScreenProps = {
  // Actives le mode deux volets (grands écrans) : le contenu habituel devient
  // la colonne de gauche, à côté d'une colonne de droite affichant la fiche
  // du membre sélectionné. Voir RosterRoute pour le seuil de largeur.
  splitView?: boolean;
  selectedInstanceId?: string;
  // Écran assez large pour proposer le bouton de bascule manuel, même si
  // l'utilisateur a choisi de rester en vue simple colonne (splitView peut
  // alors être false ici tout en étant proposable).
  canToggleSplitView?: boolean;
  onToggleSplitView?: () => void;
};

export function RosterScreen({
  splitView,
  selectedInstanceId,
  canToggleSplitView,
  onToggleSplitView,
}: RosterScreenProps = {}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster, patchRoster } = useRosters();
  const { rules } = useGameRules();
  const { t, language } = useLanguage();
  const roster = getRosterById(id ?? '');
  // Hissé avant le "if (!roster) return" ci-dessous (les Hooks ne peuvent pas
  // être conditionnels) : translateWarbandCatalog reconstruit tout le
  // catalogue (profils, équipement, magie...) en anglais à chaque appel, pas
  // seulement au changement de langue — sans ce useMemo, ce recalcul complet
  // s'exécutait à chaque rendu de cet écran pour un utilisateur en anglais.
  const catalogueBrut = getCatalogue(roster?.bande_id ?? '');
  const catalogue = useMemo(
    () => (catalogueBrut ? translateWarbandCatalog(catalogueBrut, language) : catalogueBrut),
    [catalogueBrut, language]
  );
  const [modalMembre, setModalMembre] = useState(false);
  const [membreASupprimer, setMembreASupprimer] = useState<Member | null>(null);
  const [modalLeader, setModalLeader] = useState(false);
  const [modalPromotion, setModalPromotion] = useState(false);
  const [heroPromuEnAttente, setHeroPromuEnAttente] = useState<Member | null>(null);
  // Piloté ici plutôt que dans ArmurerieSection : le bouton d'ouverture
  // s'affiche maintenant à côté de Recruter/Assistant post-bataille (voir
  // .top-actions plus bas), pas dans l'en-tête de la carte armurerie.
  const [modalAchat, setModalAchat] = useState(false);
  // Liste rapide "Bande complète" (fusion Héros/Hommes de main/Francs-tireurs/
  // Dramatis Personae, nom/profil/stats seulement, voir MemberQuickList)
  // remplaçant ces cartes de groupe détaillées — bouton dans l'en-tête de
  // chacune (voir onBasculerVueRapide) — utile pour défiler vite une bande
  // nombreuse (~20 membres), y compris en split view où le volet liste peut
  // rester étroit sans jamais atteindre les ~950px que réclame le tableau
  // (voir .roster-split__list dans index.css).
  const { open: vueCondensee, toggle: toggleVueCondensee } = usePersistentDisclosure(
    'ui.roster.membres.vueCondensee',
    false
  );

  const splitRef = useRef<HTMLDivElement>(null);
  const [listWidthPct, setListWidthPct] = useState(SPLIT_LIST_WIDTH_DEFAUT);
  const [redimensionnementEnCours, setRedimensionnementEnCours] = useState(false);

  useEffect(() => {
    let actif = true;
    getSetting<number>(SPLIT_LIST_WIDTH_KEY).then((saved) => {
      if (actif && typeof saved === 'number') setListWidthPct(saved);
    });
    return () => {
      actif = false;
    };
  }, []);

  const demarrerRedimensionnement = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setRedimensionnementEnCours(true);
  };

  const redimensionner = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!redimensionnementEnCours || !splitRef.current) return;
    const rect = splitRef.current.getBoundingClientRect();
    const pctMin = Math.min(SPLIT_LIST_WIDTH_MIN_PX / rect.width, SPLIT_LIST_WIDTH_MAX_PCT);
    const pct = Math.min(SPLIT_LIST_WIDTH_MAX_PCT, Math.max(pctMin, (e.clientX - rect.left) / rect.width));
    setListWidthPct(pct);
  };

  const terminerRedimensionnement = () => {
    if (!redimensionnementEnCours) return;
    setRedimensionnementEnCours(false);
    void setSetting(SPLIT_LIST_WIDTH_KEY, listWidthPct);
  };

  if (!roster) {
    return (
      <Screen title={t('roster.notFoundTitle')} back="/">
        <p className="text-muted">{t('roster.notFoundBody')}</p>
      </Screen>
    );
  }

  const tribu = tribuChoisie(catalogue, roster);
  const violations = validerComposition(roster, language);
  const violationsEffectif = validerEffectif(roster);
  const effectifDepasse = violationsEffectif.find((v) => v.type === 'max');
  // Les figurines mortes sont retirées de leur section d'origine et
  // regroupées dans le Cimetière (voir plus bas) — évite d'alourdir/confondre
  // les sections Héros/Hommes de main d'une bande qui a subi des pertes.
  const defunts = roster.membres.filter((m) => m.statut === 'mort');
  const francsTireurs = roster.membres.filter(
    (m) => m.statut !== 'mort' && estFrancTireur(m) && !estDramatisPersonae(m)
  );
  const dramatisPersonae = roster.membres.filter((m) => m.statut !== 'mort' && estDramatisPersonae(m));
  const heros = roster.membres.filter(
    (m) => m.statut !== 'mort' && !estFrancTireur(m) && resolveProfil(roster, m)?.type === 'heros'
  );
  // Sous-ensemble des héros éligibles au poste de chef (voir Profile.
  // ne_peut_jamais_devenir_chef, ex : le Chevalier d'Avant-garde et le
  // Magicien des Caravanes marchandes, "Engagés" payés par le chef) —
  // utilisé uniquement par la modale de choix manuel de chef ci-dessous.
  const herosEligiblesChef = heros.filter((m) => !resolveProfil(roster, m)?.ne_peut_jamais_devenir_chef);
  const hommesDeMain = roster.membres.filter(
    (m) => m.statut !== 'mort' && !estFrancTireur(m) && resolveProfil(roster, m)?.type !== 'heros'
  );
  // Union des quatre filtres ci-dessus, mais dans l'ordre réel de
  // roster.membres plutôt que la concaténation par blocs (héros, puis
  // hommes de main, puis...) — nécessaire pour que le glisser-déposer de
  // MemberQuickList puisse réordonner LIBREMENT, y compris à travers ces
  // catégories (ex : un homme de main déplacé avant un héros) : avec la
  // concaténation par blocs, la position "réelle" dans roster.membres était
  // bien mise à jour par le drag, mais le rendu la reconstruisait aussitôt
  // groupée par type à chaque rendu, annulant silencieusement tout
  // réordonnancement franchissant une frontière de catégorie.
  const membresVivants = roster.membres.filter((m) => m.statut !== 'mort');
  const besoinChoixLeader = choixLeaderRequis(roster, catalogue);
  const trinketsLimitesEnTrop = trouverTrinketsLimitesEnTrop(roster, rules);

  // Lustrian Reavers ("Promotions") : rôles de héros uniques tombés — bannis
  // du recrutement mais toujours vacants (aucun titulaire vivant) — qu'un
  // Prospect vivant peut reprendre. Voir PromotionHerosDechuModal.
  const rolesVacants = catalogue?.bannir_profils_uniques_a_mort
    ? (roster.profils_bannis ?? []).filter(
        (profilId) => !roster.membres.some((m) => m.profil_id === profilId && m.statut !== 'mort')
      )
    : [];
  const prospectsDisponibles = roster.membres.filter(
    (m) => m.statut !== 'mort' && catalogue?.profils.find((p) => p.id === m.profil_id)?.remplace_heros_tombe
  );
  const promotionDisponible = rolesVacants.length > 0 && prospectsDisponibles.length > 0;

  const patch = (partial: Partial<RosterInstance>) => {
    patchRoster(roster.id, (current) => ({ ...current, ...partial }));
  };

  // Ouvre le menu de partage natif (Drive, mail, Dropbox...) pour que le
  // joueur choisisse lui-même où sauvegarder sa bande, sans backend ni
  // compte côté app. Le support de cette API varie beaucoup selon
  // navigateur/OS : en cas d'échec (hors annulation volontaire), on se
  // rabat automatiquement sur le téléchargement JSON classique pour que le
  // joueur reparte toujours avec son fichier, tout en affichant le détail
  // technique de l'échec (utile pour diagnostiquer un appareil précis).
  const partager = async () => {
    try {
      await partagerRoster(roster);
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;
      const detail = e instanceof Error ? e.message : String(e);
      alert(t('roster.shareUnavailable', { detail }));
      exporterRoster(roster);
    }
  };

  const acheterPourArmurerie = (item: ShopItem, coutPaye: number) => {
    patchRoster(roster.id, (current) => acheterPourStock(current, creerEntreeInventaire(item, coutPaye)));
  };

  // Supprime l'objet du stock sans contrepartie (perdu, détruit...).
  const retirerStock = (instanceId: string) => {
    patchRoster(roster.id, (current) => retirerDuStock(current, instanceId));
  };

  // Revend l'objet du stock : moitié du prix payé (arrondi au supérieur) reversée à la trésorerie.
  const vendreStock = (instanceId: string) => {
    const entree = roster.stock.find((e) => e.instance_id === instanceId);
    if (!entree) return;
    patchRoster(roster.id, (current) => {
      const entreeActuelle = current.stock.find((e) => e.instance_id === instanceId);
      if (!entreeActuelle) return current;
      const sansItem = retirerDuStock(current, instanceId);
      return { ...sansItem, tresorerie: sansItem.tresorerie + prixVente(entreeActuelle.cout) };
    });
  };

  const donnerAMembre = (instanceId: string, membreId: string) => {
    patchRoster(roster.id, (current) => {
      const nouveauRoster = transfererVersMembre(current, instanceId, membreId);
      return {
        ...nouveauRoster,
        membres: nouveauRoster.membres.map((m) =>
          m.instance_id === membreId ? { ...m, equipement: formatEquipementAffiche(m.inventaire) } : m
        ),
      };
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
        x.instance_id === m.instance_id
          ? { ...x, statut: nouveauStatut, date_mort: undefined, pv_perdus: pvPerdusPourStatut(x, nouveauStatut) }
          : x
      ),
    });
  };

  // Cycle tactile sur la case PV du tableau/roster compact : décrémente d'un
  // point à chaque tap, puis reboucle à pleine santé une fois à 0 (voir
  // utils/stats.ts pvRestant/pvAffiche). Bascule automatiquement le statut
  // aux deux extrémités du cycle (Hors de combat à 0, Actif au retour à
  // pleine santé) sans jamais écraser un statut Mort ou Blessé au passage —
  // seuls ces deux franchissements ont un sens de statut non ambigu, les
  // valeurs intermédiaires (touché mais pas à terre) ne changent rien au
  // statut.
  const basculerPointsDeVie = (m: Member) => {
    const max = m.stats_actuels.PV;
    const restantActuel = pvRestant(m);
    const restantNouveau = restantActuel > 0 ? restantActuel - 1 : max;
    const perdusNouveau = max - restantNouveau;
    let statutNouveau = m.statut;
    if (restantNouveau === 0 && m.statut !== 'blesse') statutNouveau = 'hors_de_combat';
    else if (restantNouveau === max && m.statut === 'hors_de_combat') statutNouveau = 'actif';
    patch({
      membres: roster.membres.map((x) =>
        x.instance_id === m.instance_id
          ? { ...x, pv_perdus: perdusNouveau || undefined, statut: statutNouveau }
          : x
      ),
    });
  };

  // Ajout rapide de +1 XP (ex : ennemi mis hors de combat) depuis le roster
  // global, sans ouvrir la fiche personnage — équivaut à cocher la case
  // suivante de la grille d'expérience (voir XpGrid/PersonnageScreen).
  // Mêmes exclusions que MemberGroupCard.peutAjouterXp (l'UI ne propose déjà
  // pas l'action sinon, mais on revérifie ici au cas où un état obsolète
  // aurait laissé l'affordance affichée) : reste plafonné au max de la
  // grille du profil, jamais appliqué à un profil qui ne gagne pas d'XP, à
  // un franc-tireur qui en est exclu, ou à un membre mort.
  const ajouterXp = (m: Member) => {
    const profil = resolveProfil(roster, m);
    if (!profil || !peutGagnerExperience(profil) || m.statut === 'mort') return;
    if (getFrancTireur(m.franc_tireur_id)?.gagne_experience === false) return;
    const max = grilleXpDuProfil(profil) === 'heros' ? HERO_XP_MAX : HENCHMAN_XP_MAX;
    patch({
      membres: roster.membres.map((x) => (x.instance_id === m.instance_id ? { ...x, xp: Math.min(x.xp + 1, max) } : x)),
    });
  };

  // Réordonne une section (Héros / Hommes de main) par glisser-déposer : les
  // autres membres du roster gardent leur position, seul le contenu des
  // emplacements de cette section est réarrangé selon `nouvelOrdre`.
  const reordonnerSection = (nouvelOrdre: Member[]) => {
    const idsSection = new Set(nouvelOrdre.map((m) => m.instance_id));
    let i = 0;
    patch({
      membres: roster.membres.map((m) => (idsSection.has(m.instance_id) ? nouvelOrdre[i++] : m)),
    });
  };

  const menuItems = [
    ...(canToggleSplitView
      ? [
          {
            key: 'split-view',
            icon: 'volets' as const,
            label: splitView ? t('roster.splitViewOff') : t('roster.splitViewOn'),
            onClick: () => onToggleSplitView?.(),
            active: splitView,
          },
        ]
      : []),
    {
      key: 'export-json',
      icon: 'documentJson' as const,
      label: t('roster.exportJsonMenu'),
      // Passe par le partage natif (Drive, mail, Dropbox...) quand
      // disponible sur l'appareil — sinon export JSON classique (voir
      // partager() ci-dessus, qui se rabat déjà sur exporterRoster en cas
      // d'échec).
      onClick: () => (partageDisponible() ? partager() : exporterRoster(roster)),
    },
    {
      key: 'export-pdf',
      icon: 'documentPdf' as const,
      label: t('roster.exportPdfMenu'),
      onClick: () => import('../../utils/pdfExport').then((m) => m.exporterRosterPDF(roster, rules)),
    },
  ];

  return (
    <Screen title={roster.nom_bande} back="/" menuItems={menuItems}>
      {roster.dissoute && (
        <div className="banner-danger">
          <span className="banner-danger__icon" aria-hidden="true">
            ⚠
          </span>
          <span>{t('roster.dissoute')}</span>
        </div>
      )}

      {effectifDepasse && (
        <div className="banner-danger">
          <span className="banner-danger__icon" aria-hidden="true">
            ⚠
          </span>
          <span>
            {t('roster.effectifDepasse', { actuel: effectifDepasse.actuel, limite: effectifDepasse.limite })}
          </span>
        </div>
      )}

      {besoinChoixLeader && (
        <div className="banner-danger banner-danger--leader">
          <span className="banner-danger__label">
            <span className="banner-danger__icon" aria-hidden="true">
              <Icon name="couronnePack" />
            </span>
            <span className="banner-danger__full">{t('roster.noLeader')}</span>
            <span className="banner-danger__short">{t('roster.noLeaderShort')}</span>
          </span>
          <button className="btn btn--sm" onClick={() => setModalLeader(true)}>
            {t('roster.chooseLeader')}
          </button>
        </div>
      )}

      {trinketsLimitesEnTrop.length > 0 && (
        <div className="banner-danger">
          <span className="banner-danger__icon" aria-hidden="true">
            ⚠
          </span>
          <span>
            {t('roster.trinketRulePrefix')}{' '}
            {trinketsLimitesEnTrop.map(({ nom, quantite }) => `${nom} ×${quantite}`).join(', ')}. {t('roster.trinketRuleSuffix')}
          </span>
        </div>
      )}

      {promotionDisponible && (
        <div className="card card--tight">
          <div className="flex justify-between items-center">
            <div>
              <strong>
                <Icon name="etoile" style={{ marginRight: '0.35em' }} />
                {t('roster.vacantHeroRole')}
              </strong>
              <p className="text-sm text-muted mb-0">{t('roster.vacantHeroRoleBody')}</p>
            </div>
            <button className="btn btn--sm" onClick={() => setModalPromotion(true)}>
              {t('roster.promote')}
            </button>
          </div>
        </div>
      )}

      <div
        className={splitView ? 'roster-split' : undefined}
        ref={splitRef}
        style={splitView ? { gridTemplateColumns: `${listWidthPct * 100}% 10px 1fr` } : undefined}
        onPointerMove={redimensionner}
        onPointerUp={terminerRedimensionnement}
        onPointerCancel={terminerRedimensionnement}
      >
      <div className={splitView ? 'roster-split__list' : undefined}>
      <RosterSummaryCard roster={roster} catalogue={catalogue} onPatch={patch} />

      <div className="roster-actions">
        <button
          type="button"
          className="btn btn--primary roster-actions__btn"
          disabled={roster.dissoute}
          title={roster.dissoute ? t('roster.dissoluteShort') : undefined}
          onClick={() => setModalMembre(true)}
        >
          {t('roster.recruit')}
        </button>
        <button type="button" className="btn roster-actions__btn" onClick={() => setModalAchat(true)}>
          {t('armurerie.buy')}
        </button>
        <button
          type="button"
          className="btn roster-actions__btn"
          disabled={roster.dissoute}
          title={roster.dissoute ? t('roster.dissoluteShort') : undefined}
          onClick={() => navigate(`/roster/${roster.id}/post-bataille`)}
        >
          {t('roster.postBattleWizard')}
        </button>
      </div>

      <ArmurerieSection
        roster={roster}
        catalogue={catalogue}
        inventaireBande={inventaireComplet(roster)}
        rules={rules}
        onAchat={acheterPourArmurerie}
        onDonner={donnerAMembre}
        onVendre={vendreStock}
        onRetirer={retirerStock}
        onObjetsPersonnalisesChange={(objets) => patch({ objets_personnalises: objets })}
        onObjetsSurchargesChange={(surcharges) => patch({ objets_surcharges: surcharges })}
        modalAchatOuvert={modalAchat}
        onFermerAchat={() => setModalAchat(false)}
      />

      {(violations.length > 0 || violationsEffectif.some((v) => v.type === 'min')) && (
        <div className="card" style={{ borderColor: 'var(--warning)' }}>
          <h3 style={{ color: 'var(--warning)' }}>{t('roster.compositionTitle')}</h3>
          <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
            {t('roster.compositionNote')}
          </p>
          {violationsEffectif
            .filter((v) => v.type === 'min')
            .map((v) => (
              <p key={`effectif-${v.type}`} className="text-sm mb-0">
                {t('roster.bandSize', { actuel: v.actuel, limite: v.limite })}
              </p>
            ))}
          {violations.map((v) => (
            <p key={`${v.profilId}-${v.type}`} className="text-sm mb-0">
              {v.nomProfil} : {v.actuel}/{v.limite} {v.type === 'max' ? t('roster.allowed') : t('roster.requiredMin')}
            </p>
          ))}
        </div>
      )}

      {catalogue && catalogue.regles_speciales.length > 0 && (
        <CollapsibleCard
          preferenceKey="ui.roster.regles_speciales.ouvert"
          className="card card--tight card--titlebar"
          title={
            <>
              <Icon name="grimoirePack" style={{ marginRight: '0.35em' }} />
              {t('roster.specialRules')}
            </>
          }
        >
          {catalogue.regles_speciales.map((r) => (
            <p key={r.nom} className="text-sm" style={{ whiteSpace: 'pre-line' }}>
              <strong>{r.nom}</strong> — {r.texte}
              {r.exception && <span className="text-muted"> ({r.exception})</span>}
            </p>
          ))}
          {catalogue.tribus && catalogue.tribus.length > 0 && (
            <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
              <p className="text-sm mb-0">
                <strong>
                  {t('roster.tribe')} {tribu ? tribu.nom : t('roster.tribeNotSet')}
                </strong>
              </p>
              {tribu ? (
                <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>
                  {tribu.texte}
                </p>
              ) : (
                catalogue.tribus.map((tr) => (
                  <p key={tr.id} className="text-sm" style={{ whiteSpace: 'pre-line' }}>
                    <strong>{tr.nom}</strong> — {tr.texte}
                  </p>
                ))
              )}
            </div>
          )}
        </CollapsibleCard>
      )}

      {vueCondensee ? (
        <MemberQuickList
          titre={t('roster.fullWarband')}
          icone="etoilePack"
          preferenceKey="ui.roster.groupe_liste_rapide.ouvert"
          membres={membresVivants}
          roster={roster}
          catalogue={catalogue}
          rules={rules}
          onReordonner={reordonnerSection}
          onSupprimer={setMembreASupprimer}
          selectedInstanceId={selectedInstanceId}
          onBasculerVueDetaillee={toggleVueCondensee}
        />
      ) : (
        <>
          <MemberGroupCard
            titre={t('roster.heroes')}
            icone="etoilePack"
            preferenceKey="ui.roster.groupe_heros.ouvert"
            membres={heros}
            roster={roster}
            catalogue={catalogue}
            rules={rules}
            onReordonner={reordonnerSection}
            onBasculerHorsCombat={basculerHorsCombat}
            onBasculerPointsDeVie={basculerPointsDeVie}
            onAjouterXp={ajouterXp}
            onSupprimer={setMembreASupprimer}
            selectedInstanceId={selectedInstanceId}
            onBasculerVueRapide={toggleVueCondensee}
          />
          <MemberGroupCard
            titre={t('roster.henchmen')}
            icone="drapeauxPack"
            preferenceKey="ui.roster.groupe_hommes_de_main.ouvert"
            membres={hommesDeMain}
            roster={roster}
            catalogue={catalogue}
            rules={rules}
            onReordonner={reordonnerSection}
            onBasculerHorsCombat={basculerHorsCombat}
            onBasculerPointsDeVie={basculerPointsDeVie}
            onAjouterXp={ajouterXp}
            onSupprimer={setMembreASupprimer}
            selectedInstanceId={selectedInstanceId}
            onBasculerVueRapide={toggleVueCondensee}
          />
          {francsTireurs.length > 0 && (
            <MemberGroupCard
              titre={t('roster.hiredSwordsGroup')}
              icone="bouclier"
              preferenceKey="ui.roster.groupe_francs_tireurs.ouvert"
              membres={francsTireurs}
              roster={roster}
              catalogue={catalogue}
              rules={rules}
              onReordonner={reordonnerSection}
              onBasculerHorsCombat={basculerHorsCombat}
              onBasculerPointsDeVie={basculerPointsDeVie}
              onAjouterXp={ajouterXp}
              onSupprimer={setMembreASupprimer}
              onBasculerVueRapide={toggleVueCondensee}
            />
          )}
          {dramatisPersonae.length > 0 && (
            <MemberGroupCard
              titre={t('roster.dramatisPersonae')}
              icone="bouclier"
              preferenceKey="ui.roster.groupe_dramatis_personae.ouvert"
              membres={dramatisPersonae}
              roster={roster}
              catalogue={catalogue}
              rules={rules}
              onReordonner={reordonnerSection}
              onBasculerHorsCombat={basculerHorsCombat}
              onBasculerPointsDeVie={basculerPointsDeVie}
              onAjouterXp={ajouterXp}
              onSupprimer={setMembreASupprimer}
              masquerProfil
              onBasculerVueRapide={toggleVueCondensee}
            />
          )}
        </>
      )}
      {defunts.length > 0 && (
        <MemberGroupCard
          titre={t('roster.graveyard')}
          icone="cranePack"
          preferenceKey="ui.roster.groupe_cimetiere.ouvert"
          membres={defunts}
          roster={roster}
          catalogue={catalogue}
          rules={rules}
          onReordonner={reordonnerSection}
          onBasculerHorsCombat={basculerHorsCombat}
          onBasculerPointsDeVie={basculerPointsDeVie}
          onAjouterXp={ajouterXp}
          onSupprimer={setMembreASupprimer}
          selectedInstanceId={selectedInstanceId}
        />
      )}

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
      {catalogue &&
        (() => {
          // Si un membre au profil à Marque (ex : le Devin des Maraudeurs)
          // a déjà été recruté, la référence de magie de la bande se cale
          // sur sa Marque plutôt que d'afficher le domaine par défaut.
          const membreMarque = roster.membres.find((m) => resolveProfil(roster, m)?.marque_requise);
          const profilMarque = membreMarque ? resolveProfil(roster, membreMarque, catalogue) : undefined;
          return <MagieReference catalogue={catalogue} profil={profilMarque} marqueId={membreMarque?.marque} />;
        })()}
      </div>
      {splitView && (
        <div
          className="roster-split__resizer"
          onPointerDown={demarrerRedimensionnement}
          role="separator"
          aria-orientation="vertical"
          aria-label={t('roster.splitResizerLabel')}
        />
      )}
      {splitView && (
        <div className="roster-split__detail">
          {selectedInstanceId ? (
            <PersonnageScreen key={selectedInstanceId} embedded instanceId={selectedInstanceId} />
          ) : (
            <div className="roster-split__empty">
              <Icon name="etoile" size="1.6em" />
              <p>{t('roster.splitEmptyHint')}</p>
            </div>
          )}
        </div>
      )}
      </div>

      {modalMembre && (
        <AjouterMembreModal roster={roster} onClose={() => setModalMembre(false)} onUpdateRoster={updateRoster} />
      )}
      {modalLeader && (
        <Modal onClose={() => setModalLeader(false)}>
          <h3>{t('roster.chooseLeaderTitle')}</h3>
          <p className="text-muted text-sm" style={{ marginTop: '-0.4rem' }}>
            {t('roster.chooseLeaderBody')}
          </p>
          {herosEligiblesChef.length === 0 ? (
            <p className="text-muted">{t('roster.noLivingHero')}</p>
          ) : (
            <div className="flex flex-col gap-sm">
              {herosEligiblesChef
                .slice()
                .sort((a, b) => b.stats_actuels.Cd - a.stats_actuels.Cd)
                .map((m) => (
                  <button
                    key={m.instance_id}
                    className="btn btn--block"
                    style={{ justifyContent: 'space-between' }}
                    onClick={() => {
                      patch({ leader_instance_id: m.instance_id });
                      setModalLeader(false);
                    }}
                  >
                    <span>{m.nom_perso}</span>
                    <span className="text-muted">Cd {m.stats_actuels.Cd}</span>
                  </button>
                ))}
            </div>
          )}
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setModalLeader(false)}>
              {t('roster.cancel')}
            </button>
          </div>
        </Modal>
      )}
      {modalPromotion && catalogue && (
        <PromotionHerosDechuModal
          roster={roster}
          catalogue={catalogue}
          rolesVacants={rolesVacants}
          prospects={prospectsDisponibles}
          onClose={() => setModalPromotion(false)}
          onConfirm={(r, nouveauHeros) => {
            updateRoster(r);
            setModalPromotion(false);
            setHeroPromuEnAttente(nouveauHeros);
          }}
        />
      )}
      {heroPromuEnAttente &&
        catalogue &&
        (() => {
          const profilPromu = resolveProfil(roster, heroPromuEnAttente, catalogue, language);
          return (
            profilPromu && (
              <AvanceeModal
                member={heroPromuEnAttente}
                profil={profilPromu}
                catalogue={catalogue}
                roster={roster}
                heroCount={nombreHeros(roster)}
                equitationGratuite={equitationGratuitePourTribu(catalogue, roster)}
                onClose={() => setHeroPromuEnAttente(null)}
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
            )
          );
        })()}
      {membreASupprimer && (
        <Modal onClose={() => setMembreASupprimer(null)}>
          <h3>
            {t('roster.removeConfirmTitlePrefix')} {membreASupprimer.nom_perso} ?
          </h3>
          <p className="text-muted">{t('roster.removeConfirmBody')}</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setMembreASupprimer(null)}>
              {t('roster.cancel')}
            </button>
            <button
              className="btn btn--danger"
              onClick={() => {
                patch({ membres: roster.membres.filter((m) => m.instance_id !== membreASupprimer.instance_id) });
                setMembreASupprimer(null);
              }}
            >
              {t('roster.remove')}
            </button>
          </div>
        </Modal>
      )}
    </Screen>
  );
}
