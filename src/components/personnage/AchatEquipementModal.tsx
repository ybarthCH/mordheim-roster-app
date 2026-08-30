import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { WarbandCatalog, Profile } from '../../types/catalog';
import { Modal } from '../common/Modal';
import {
  getEquipementBande,
  getShopCommun,
  objetsPersonnalisesEnShopItems,
  avecSurcharges,
  libelleCategorie,
  iconeCategorie,
  classeRarete,
  estObjetRare,
  resumeItem,
  traduirePortee,
  formatCoutItem,
  CATEGORIE_ORDRE,
  TRINKETS_LIMITES,
  ITEMS_UNIQUES_BANDE,
  comptePlafondGroupe,
  estItemMateriau,
  basesPourMateriau,
  construireObjetMateriau,
  MATERIAUX,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { STAT_KEYS } from '../../types/catalog';
import { Icon } from '../common/Icon';
import type { InventoryEntry, CustomItem, CustomItemOverride, RosterInstance } from '../../types/roster';
import { useGameRules } from '../../state/useGameRules';
import { CustomItemForm } from './CustomItemForm';
import { useLanguage } from '../../state/useLanguage';
import { translateItem } from '../../i18n/data/items';
import { libelleCaracteristique } from '../../utils/stats';

type Props = {
  catalogue: WarbandCatalog;
  profil: Profile | null;
  tresorerie: number;
  // Compétences acquises par le membre (ex : "Connaissance des Armes"),
  // pour lever la restriction de liste d'équipement le cas échéant.
  competencesAcquises?: string[];
  // Marque du membre (voir Profile.marque_requise), pour les objets
  // equipement_special réservés à une Marque précise (ex : Bénédictions de
  // Nurgle réservées à la Marque d'Onogal chez les Maraudeurs).
  marqueId?: string;
  // Inventaire actuel du membre (ou stock de bande) ciblé par l'achat : sert
  // à détecter les objets déjà possédés d'un même `groupe_prix` (ex :
  // Bénédictions de Nurgle) pour appliquer le doublement de prix.
  inventaireActuel?: InventoryEntry[];
  // Ensemble du stock et des inventaires de tous les membres. Sert aux
  // limites qui s'appliquent à l'échelle de la bande entière.
  inventaireBande?: InventoryEntry[];
  // Roster complet : uniquement nécessaire pour vérifier un
  // `EquipementSpecialRef.plafond_groupe` (ex : le Faucon de chasse tiléen
  // des Pillards de Lustrie, compté avec les Bêtes de guerre recrutées) —
  // voir comptePlafondGroupe dans utils/shop.ts. Omis, ce plafond partagé
  // n'est simplement pas vérifié.
  roster?: RosterInstance;
  // Taille du groupe d'hommes de main ciblé (1 pour un héros ou l'armurerie
  // de bande) : l'équipement d'un groupe doit rester identique entre toutes
  // ses figurines, l'achat porte donc automatiquement sur `tailleGroupe`
  // exemplaires au prix unitaire saisi.
  tailleGroupe?: number;
  // Objet trouvé gratuitement (ex : don de scénario à l'exploration) plutôt
  // qu'acheté : la valeur saisie sert uniquement de référence pour une
  // revente future, elle n'est pas déduite de la trésorerie. Adapte le texte
  // et masque les avertissements liés au coût.
  gratuit?: boolean;
  // Objets homebrew de la bande et surcharges locales d'objets existants
  // (voir types/roster.ts). Le bouton "Personnalisé" n'apparaît que si ces
  // quatre props sont fournies — omis (ex : don de scénario à l'exploration),
  // le modal reste une simple vitrine en lecture seule du catalogue.
  objetsPersonnalises?: CustomItem[];
  objetsSurcharges?: Record<string, CustomItemOverride>;
  onObjetsPersonnalisesChange?: (objets: CustomItem[]) => void;
  onObjetsSurchargesChange?: (surcharges: Record<string, CustomItemOverride>) => void;
  // Ouvre le modal directement filtré sur cette catégorie et sur le shop
  // commun (ex : "artefacts_magiques" depuis un événement d'exploration qui
  // renvoie sur le Tableau des artefacts magiques).
  categorieInitiale?: string;
  // Par défaut, un achat confirmé referme tout le flux (comportement
  // standalone historique). Mis à true depuis un contexte où le shop est
  // intégré directement dans une autre fenêtre (ex : recrutement) : après
  // achat, on revient simplement à la liste du catalogue au lieu de fermer,
  // pour pouvoir enchaîner plusieurs achats sans quitter la vue.
  resterOuvertApresAchat?: boolean;
  // Masque les boutons de fermeture (X) internes à chaque sous-vue du shop.
  // Utilisé depuis le recrutement (voir AjouterMembreModal), où le shop est
  // fusionné dans la fenêtre de recrutement : ce X fermait toute la fenêtre
  // de recrutement (le membre déjà recruté restant, mais le panier en cours
  // perdu) au lieu de simplement fermer une sous-vue du shop — hors de
  // propos dans ce contexte fusionné, qui expose son propre bouton
  // "Annuler" en pied de fenêtre à la place.
  masquerBoutonFermer?: boolean;
  // Masque l'onglet "shop commun" et empêche d'y basculer. Utilisé au
  // recrutement (voir AjouterMembreModal) : le livre de règles (Mordheim
  // Living Rulebook p.46-47, Part 3 - Campaigns & Optional Rules p.102)
  // limite l'équipement disponible à la création d'une bande comme au
  // recrutement d'un nouveau membre en cours de campagne à la seule liste
  // propre à la bande — le shop commun/"Price chart" générique ne s'applique
  // qu'aux guerriers déjà recrutés qui achètent entre deux batailles
  // (fiche personnage, armurerie, exploration), jamais au moment du
  // recrutement lui-même.
  masquerShopCommun?: boolean;
  // Masque les objets "Rare N" (armes/armures/équipement, bande comme
  // commun) — livre de règles : "you may buy rare weapons and armour when
  // starting a warband ... but after playing the first game the only way
  // to get further rare weapons and armour is to roll to see if you can
  // locate them" (Living Rulebook p.47 / Part 3 - Campaigns & Optional
  // Rules p.103). Passé à `true` dès que roster.historique_batailles n'est
  // plus vide — la recherche d'objet rare (RechercheObjetRareModal, étape
  // Commerce du post-bataille) reste alors le seul chemin légitime.
  // Volontairement ignoré quand `gratuit` est vrai (objet trouvé en jeu via
  // l'exploration/une récompense de scénario, pas acheté).
  masquerObjetsRares?: boolean;
  onClose: () => void;
  onAchat: (item: ShopItem, coutPaye: number) => void;
};

const LONGUEUR_SYNOPSIS = 110;

// Première dague d'un profil : gratuite (voir FAQ officielle). Ne s'applique
// qu'à un achat pour un membre précis (profil non nul) — l'armurerie de
// bande (profil === null) n'est pas concernée. Une fois une dague déjà
// possédée, les suivantes reprennent leur prix normal.
const ID_DAGUE = 'dague';

function synopsis(texte: string | null | undefined): string | null {
  if (!texte) return null;
  return texte.length > LONGUEUR_SYNOPSIS ? `${texte.slice(0, LONGUEUR_SYNOPSIS).trimEnd()}…` : texte;
}

function disponibiliteSansRarete(disponibilite: string | undefined, rarete: string | undefined): string | null {
  if (!disponibilite) return null;
  if (!rarete) return disponibilite;

  const prefixe = `Rare ${rarete}`;
  if (disponibilite === prefixe) return null;
  return disponibilite.startsWith(`${prefixe}, `) ? disponibilite.slice(prefixe.length + 2) : disponibilite;
}

// Contenu du shop, sans la coquille modale plein écran — extrait pour
// pouvoir être intégré directement dans une autre fenêtre (voir
// AjouterMembreModal, qui l'affiche à la suite du recrutement au lieu
// d'ouvrir un second écran séparé). AchatEquipementModal ci-dessous reste le
// point d'entrée standalone utilisé partout ailleurs.
export function AchatEquipementContenu({
  catalogue,
  profil,
  tresorerie,
  competencesAcquises = [],
  marqueId,
  inventaireActuel = [],
  inventaireBande = [],
  roster,
  tailleGroupe = 1,
  gratuit = false,
  objetsPersonnalises = [],
  objetsSurcharges = {},
  onObjetsPersonnalisesChange,
  onObjetsSurchargesChange,
  categorieInitiale,
  resterOuvertApresAchat = false,
  masquerBoutonFermer = false,
  masquerShopCommun = false,
  masquerObjetsRares = false,
  onClose,
  onAchat,
}: Props) {
  const { rules } = useGameRules();
  const { t, language } = useLanguage();
  const [source, setSource] = useState<'bande' | 'commun'>(categorieInitiale && !masquerShopCommun ? 'commun' : 'bande');
  const [categorieFiltre, setCategorieFiltre] = useState<string | null>(categorieInitiale ?? null);
  const [recherche, setRecherche] = useState('');
  const [itemId, setItemId] = useState('');
  const [coutSaisi, setCoutSaisi] = useState('');
  const [vuePersonnalise, setVuePersonnalise] = useState<'menu' | 'creer' | 'selection' | 'editer' | null>(null);
  const [rechercheEdition, setRechercheEdition] = useState('');
  const [itemAEditer, setItemAEditer] = useState<ShopItem | null>(null);
  // Objet "matériau" (gromril/ithilmar/obsidienne) sélectionné : demande de
  // choisir une arme/armure de base avant de pouvoir acheter (voir
  // basesPourMateriau/construireObjetMateriau dans utils/shop.ts).
  const [baseMateriauId, setBaseMateriauId] = useState('');
  const [rechercheMateriau, setRechercheMateriau] = useState('');
  const [coutBaseSaisi, setCoutBaseSaisi] = useState('');
  // Résultat du sous-jet d'achat (ex : Carte de Mordheim, résolue par 1D6) —
  // saisi avant de pouvoir finaliser l'achat d'un objet dont l'effet en
  // dépend (voir ShopItem.sous_jet_achat dans utils/shop.ts).
  const [resultatSousJetAchat, setResultatSousJetAchat] = useState<{
    jet: number;
    optionIndex: number;
    label: string;
    texte: string;
  } | null>(null);

  const personnaliseActif = !!(onObjetsPersonnalisesChange && onObjetsSurchargesChange);

  const rareteActive = masquerObjetsRares && !gratuit;

  const itemsBandeBase = useMemo(
    () => [
      ...getEquipementBande(catalogue, profil ?? null, competencesAcquises, inventaireActuel, rules, marqueId),
      ...objetsPersonnalisesEnShopItems(objetsPersonnalises),
    ],
    [catalogue, profil, competencesAcquises, inventaireActuel, rules, marqueId, objetsPersonnalises]
  );
  const itemsBande = useMemo(() => {
    const liste = avecSurcharges(itemsBandeBase, objetsSurcharges);
    return rareteActive ? liste.filter((item) => !estObjetRare(item.rarete)) : liste;
  }, [itemsBandeBase, objetsSurcharges, rareteActive]);
  const itemsCommunBase = useMemo(
    () =>
      getShopCommun(catalogue.id, rules, profil, competencesAcquises, catalogue, !!profil).filter(
        (item) => gratuit || item.categorie !== 'artefacts_magiques'
      ),
    [catalogue, rules, gratuit, profil, competencesAcquises]
  );
  const itemsCommun = useMemo(() => {
    const liste = avecSurcharges(itemsCommunBase, objetsSurcharges);
    return rareteActive ? liste.filter((item) => !estObjetRare(item.rarete)) : liste;
  }, [itemsCommunBase, objetsSurcharges, rareteActive]);
  const items = source === 'bande' ? itemsBande : itemsCommun;

  const itemsPourEdition = useMemo(() => {
    const vus = new Set<string>();
    return [...itemsBande, ...(masquerShopCommun ? [] : itemsCommun)]
      .filter((i) => {
        if (vus.has(i.id)) return false;
        vus.add(i.id);
        return true;
      })
      .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  }, [itemsBande, itemsCommun, masquerShopCommun]);
  const itemsPourEditionFiltres = useMemo(() => {
    const q = rechercheEdition.trim().toLowerCase();
    return q ? itemsPourEdition.filter((i) => i.nom.toLowerCase().includes(q)) : itemsPourEdition;
  }, [itemsPourEdition, rechercheEdition]);

  const categoriesDisponibles = useMemo(() => {
    const presentes = new Set(items.map((i) => i.categorie));
    return CATEGORIE_ORDRE.filter((c) => presentes.has(c));
  }, [items]);

  const itemsFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    let liste = categorieFiltre ? items.filter((i) => i.categorie === categorieFiltre) : items;
    if (q) liste = liste.filter((i) => i.nom.toLowerCase().includes(q));
    return [...liste].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  }, [items, recherche, categorieFiltre]);

  const itemSelectionneBrut = items.find((i) => i.id === itemId) ?? null;
  const itemSelectionne: ShopItem | null =
    itemSelectionneBrut && resultatSousJetAchat
      ? { ...itemSelectionneBrut, resultatSousJetAchat }
      : itemSelectionneBrut;
  const itemSelectionneAffiche = itemSelectionne ? translateItem(itemSelectionne, language) : null;
  const disponibiliteDetail = disponibiliteSansRarete(
    itemSelectionneAffiche?.disponibilite,
    itemSelectionne?.rarete
  );

  const changerSource = (s: 'bande' | 'commun') => {
    if (s === 'commun' && masquerShopCommun) return;
    setSource(s);
    setCategorieFiltre(null);
    setItemId('');
  };

  const dagueDejaPossedee = inventaireActuel.some((e) => e.item_id === ID_DAGUE);
  const estPremiereDagueGratuite = (item: Pick<ShopItem, 'id'>) =>
    !gratuit && !!profil && item.id === ID_DAGUE && !dagueDejaPossedee;

  const choisir = (item: ShopItem) => {
    setItemId(item.id);
    setCoutSaisi(
      estPremiereDagueGratuite(item)
        ? '0'
        : item.cout_fixe && typeof item.cout === 'number'
          ? String(item.cout)
          : ''
    );
    setBaseMateriauId('');
    setRechercheMateriau('');
    setCoutBaseSaisi('');
    setResultatSousJetAchat(null);
  };

  const choisirResultatSousJetAchat = (jet: number) => {
    if (!itemSelectionne?.sous_jet_achat) return;
    const optionIndex = itemSelectionne.sous_jet_achat.options.findIndex((o) => o.valeurs.includes(jet));
    if (optionIndex < 0) return;
    const option = itemSelectionne.sous_jet_achat.options[optionIndex];
    setResultatSousJetAchat({ jet, optionIndex, label: option.label, texte: option.texte });
  };

  const materiauSelectionne = itemId && estItemMateriau(itemId) ? items.find((i) => i.id === itemId) : undefined;
  const basesMateriau = materiauSelectionne ? basesPourMateriau(itemsPourEdition, materiauSelectionne.id) : [];
  const baseMateriauChoisie = basesMateriau.find((b) => b.id === baseMateriauId) ?? null;
  const baseMateriauFiltrees = rechercheMateriau.trim()
    ? basesMateriau.filter((b) => b.nom.toLowerCase().includes(rechercheMateriau.trim().toLowerCase()))
    : basesMateriau;
  const coutBase = Number(coutBaseSaisi);
  const coutBaseValide = coutBaseSaisi.trim() !== '' && !Number.isNaN(coutBase) && coutBase >= 0;
  const objetMateriauCombine =
    materiauSelectionne && baseMateriauChoisie && coutBaseValide
      ? construireObjetMateriau(baseMateriauChoisie, materiauSelectionne, coutBase)
      : null;
  const coutTotalMateriau = objetMateriauCombine ? (objetMateriauCombine.cout as number) * tailleGroupe : 0;
  const budgetMateriauSuffisant = gratuit || coutTotalMateriau <= tresorerie;

  const choisirBaseMateriau = (base: ShopItem) => {
    setBaseMateriauId(base.id);
    setCoutBaseSaisi(base.cout_fixe && typeof base.cout === 'number' ? String(base.cout) : '');
  };

  // Après un achat confirmé : referme tout le flux (comportement standalone),
  // sauf si intégré ailleurs (resterOuvertApresAchat), où l'on revient
  // simplement à la liste pour permettre d'enchaîner un autre achat.
  const finaliserAchat = () => {
    if (!resterOuvertApresAchat) {
      onClose();
      return;
    }
    setItemId('');
    setCoutSaisi('');
    setBaseMateriauId('');
    setRechercheMateriau('');
    setCoutBaseSaisi('');
    setResultatSousJetAchat(null);
  };

  const confirmerMateriau = () => {
    if (!objetMateriauCombine || !budgetMateriauSuffisant) return;
    onAchat(objetMateriauCombine, objetMateriauCombine.cout as number);
    finaliserAchat();
  };

  const cout = Number(coutSaisi);
  const coutValide = coutSaisi.trim() !== '' && !Number.isNaN(cout) && cout >= 0;
  const coutTotal = cout * tailleGroupe;
  const trinketLimite =
    !!itemSelectionne &&
    rules.trinketsLimites &&
    TRINKETS_LIMITES.has(itemSelectionne.id) &&
    (inventaireBande.some((entree) => entree.item_id === itemSelectionne.id) || tailleGroupe > 1);
  const limiteUniqueBande =
    !!itemSelectionne &&
    ITEMS_UNIQUES_BANDE.has(itemSelectionne.id) &&
    (inventaireBande.some((entree) => entree.item_id === itemSelectionne.id) || tailleGroupe > 1);
  const refPlafondGroupe = itemSelectionne
    ? catalogue.equipement_special?.find((ref) => ref.item_id === itemSelectionne.id)?.plafond_groupe
    : undefined;
  const limitePlafondGroupe =
    !!refPlafondGroupe &&
    !!roster &&
    comptePlafondGroupe(catalogue, roster, refPlafondGroupe.id) + tailleGroupe > refPlafondGroupe.max;
  const limiteAtteinte = trinketLimite || limiteUniqueBande || limitePlafondGroupe;

  const confirmer = () => {
    if (!itemSelectionne || !coutValide || limiteAtteinte || (!gratuit && coutTotal > tresorerie)) return;
    onAchat(itemSelectionne, cout);
    finaliserAchat();
  };

  const fermerFlowPersonnalise = () => {
    setVuePersonnalise(null);
    setItemAEditer(null);
    setRechercheEdition('');
  };

  const creerObjetPersonnalise = (valeur: Omit<CustomItem, 'id'>) => {
    onObjetsPersonnalisesChange?.([...objetsPersonnalises, { id: uuidv4(), ...valeur }]);
    fermerFlowPersonnalise();
  };

  const enregistrerEditionObjet = (valeur: Omit<CustomItem, 'id'>) => {
    if (!itemAEditer) return;
    if (itemAEditer.origine === 'personnalise') {
      onObjetsPersonnalisesChange?.(
        objetsPersonnalises.map((o) => (o.id === itemAEditer.id ? { id: o.id, ...valeur } : o))
      );
    } else {
      onObjetsSurchargesChange?.({ ...objetsSurcharges, [itemAEditer.id]: valeur });
    }
    fermerFlowPersonnalise();
  };

  const revertSurcharge = () => {
    if (!itemAEditer || !onObjetsSurchargesChange) return;
    const reste = { ...objetsSurcharges };
    delete reste[itemAEditer.id];
    onObjetsSurchargesChange(reste);
    fermerFlowPersonnalise();
  };

  const ouvrirEditionDepuisDetail = () => {
    if (!itemSelectionne) return;
    setItemAEditer(itemSelectionne);
    setVuePersonnalise('editer');
  };

  const initialEdition: Omit<CustomItem, 'id'> | undefined = itemAEditer
    ? {
        nom: itemAEditer.nom,
        categorie: itemAEditer.categorie,
        cout: itemAEditer.cout,
        cout_fixe: itemAEditer.cout_fixe ?? typeof itemAEditer.cout === 'number',
        rarete: itemAEditer.rarete,
        disponibilite: itemAEditer.disponibilite,
        texte: itemAEditer.texte ?? undefined,
        stats_delta: itemAEditer.stats_delta,
      }
    : undefined;

  return (
      <div className={`achat-equipement${resterOuvertApresAchat ? ' achat-equipement--integre' : ''}`}>
        {vuePersonnalise === 'menu' ? (
          <div className="achat-equipement__contenu">
            <div className="achat-equipement__header-ligne" style={{ marginBottom: '0.5rem' }}>
              <h3 className="mt-0 mb-0">{t('achatEquipement.customItemTitle')}</h3>
              <button className="icon-btn achat-equipement__close" aria-label={t('achatEquipement.close')} onClick={fermerFlowPersonnalise}>
                <Icon name="croixPack" />
              </button>
            </div>
            <p className="text-sm text-muted">{t('achatEquipement.customItemIntro')}</p>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              <button className="btn--pack-pill-sm btn--pack-pill-sm--primary" onClick={() => setVuePersonnalise('creer')}>
                {t('achatEquipement.createItem')}
              </button>
              <button className="btn--pack-pill-sm" onClick={() => setVuePersonnalise('selection')}>
                {t('achatEquipement.editExistingItem')}
              </button>
            </div>
          </div>
        ) : vuePersonnalise === 'creer' ? (
          <CustomItemForm
            titre={t('achatEquipement.createCustomItemTitle')}
            onEnregistrer={creerObjetPersonnalise}
            onAnnuler={() => setVuePersonnalise('menu')}
          />
        ) : vuePersonnalise === 'selection' ? (
          <div className="achat-equipement__contenu">
            <div className="achat-equipement__header-ligne" style={{ marginBottom: '0.5rem' }}>
              <h3 className="mt-0 mb-0">{t('achatEquipement.chooseItemToEditTitle')}</h3>
              <button className="btn--pack-pill-sm" onClick={() => setVuePersonnalise('menu')}>
                {t('achatEquipement.back')}
              </button>
            </div>
            <div className="field">
              <input
                value={rechercheEdition}
                onChange={(e) => setRechercheEdition(e.target.value)}
                placeholder={t('achatEquipement.searchItemPlaceholder')}
              />
            </div>
            <div className="achat-equipement__catalogue">
              {itemsPourEditionFiltres.length === 0 && <p className="text-muted text-sm">{t('achatEquipement.noItem')}</p>}
              {itemsPourEditionFiltres.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="list-item achat-equipement__item"
                  onClick={() => {
                    setItemAEditer(item);
                    setVuePersonnalise('editer');
                  }}
                >
                  <div className="list-item__main">
                    <div className="achat-equipement__item-titre">
                      <span className="list-item__title">{item.nom}</span>
                      {item.origine === 'personnalise' && <span className="badge badge--info">{t('achatEquipement.customBadge')}</span>}
                      {item.surcharge && <span className="badge badge--warning">{t('achatEquipement.modifiedBadge')}</span>}
                    </div>
                    <div className="list-item__subtitle">
                      {libelleCategorie(item.categorie, language)} · {formatCoutItem(item.cout, language)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : vuePersonnalise === 'editer' && itemAEditer ? (
          <CustomItemForm
            titre={`${t('achatEquipement.editPrefix')} ${itemAEditer.nom}`}
            initial={initialEdition}
            onEnregistrer={enregistrerEditionObjet}
            onAnnuler={() => setVuePersonnalise('menu')}
            onRevert={
              itemAEditer.origine !== 'personnalise' && objetsSurcharges[itemAEditer.id] ? revertSurcharge : undefined
            }
          />
        ) : itemSelectionne?.sous_jet_achat && !resultatSousJetAchat ? (
          <div className="achat-equipement__contenu">
            <div className="achat-equipement__header-ligne" style={{ marginBottom: '0.5rem' }}>
              <h3 className="mt-0 mb-0">{itemSelectionneAffiche!.nom}</h3>
              {!masquerBoutonFermer && (
                <button className="icon-btn achat-equipement__close" aria-label={t('achatEquipement.close')} onClick={onClose}>
                  <Icon name="croixPack" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted">{t('achatEquipement.rollResultNote')}</p>
            <button className="btn--pack-pill-sm" style={{ marginBottom: '0.5rem' }} onClick={() => setItemId('')}>
              {t('achatEquipement.rollResultBack')}
            </button>
            <p className="text-sm" style={{ fontWeight: 600 }}>{t('achatEquipement.rollResultTitle')}</p>
            <div className="flex flex-wrap gap-sm">
              {[1, 2, 3, 4, 5, 6].map((valeur) => (
                <button key={valeur} className="btn--pack-pill-sm" onClick={() => choisirResultatSousJetAchat(valeur)}>
                  {valeur}
                </button>
              ))}
            </div>
          </div>
        ) : materiauSelectionne && !baseMateriauChoisie ? (
          <div className="achat-equipement__contenu">
            <div className="achat-equipement__header-ligne" style={{ marginBottom: '0.5rem' }}>
              <h3 className="mt-0 mb-0">
                {translateItem(materiauSelectionne, language).nom} {t('achatEquipement.chooseBaseSuffix')}
              </h3>
              {!masquerBoutonFermer && (
                <button className="icon-btn achat-equipement__close" aria-label={t('achatEquipement.close')} onClick={onClose}>
                  <Icon name="croixPack" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted">{t('achatEquipement.chooseBaseNote')}</p>
            <button className="btn--pack-pill-sm" style={{ marginBottom: '0.5rem' }} onClick={() => setItemId('')}>
              {t('achatEquipement.catalogBack')}
            </button>
            <div className="field">
              <input
                value={rechercheMateriau}
                onChange={(e) => setRechercheMateriau(e.target.value)}
                placeholder={t('achatEquipement.searchBasePlaceholder')}
              />
            </div>
            <div className="achat-equipement__catalogue">
              {baseMateriauFiltrees.length === 0 && <p className="text-muted text-sm">{t('achatEquipement.noBaseAvailable')}</p>}
              {baseMateriauFiltrees.map((base) => (
                <button
                  type="button"
                  key={base.id}
                  className="list-item achat-equipement__item"
                  onClick={() => choisirBaseMateriau(base)}
                >
                  <div className="list-item__main">
                    <span className="list-item__title">{translateItem(base, language).nom}</span>
                    <div className="list-item__subtitle">{formatCoutItem(base.cout, language)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : materiauSelectionne && baseMateriauChoisie ? (
          <>
            <header className="achat-equipement__header achat-equipement__header--selection">
              <div className="achat-equipement__header-ligne">
                <button className="btn--pack-pill-sm" onClick={() => setBaseMateriauId('')}>
                  {t('achatEquipement.chooseOtherBase')}
                </button>
                {!masquerBoutonFermer && (
                  <button className="icon-btn achat-equipement__close" aria-label={t('achatEquipement.close')} onClick={onClose}>
                    <Icon name="croixPack" />
                  </button>
                )}
              </div>
              <div className="achat-equipement__selection-titre">
                <h3 className="mt-0 mb-0">
                  {baseMateriauChoisie.nom} ({materiauSelectionne.nom.replace(/^Arme en |^Armure en /, '')})
                </h3>
                {classeRarete(materiauSelectionne.rarete) && (
                  <span className={`badge ${classeRarete(materiauSelectionne.rarete)} achat-equipement__rarete`}>
                    Rare {materiauSelectionne.rarete}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted mb-0">
                {gratuit
                  ? t('achatEquipement.freeAddNote')
                  : `${t('achatEquipement.treasuryAvailablePrefix')} ${tresorerie} ${t('creation.gc')}.`}
              </p>
            </header>
            <div className="achat-equipement__contenu achat-equipement__detail">
              {baseMateriauChoisie.regles_speciales?.map((r) => (
                <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>{r.nom}</strong> — {r.texte}
                </p>
              ))}
              {materiauSelectionne.regles_speciales?.map((r) => (
                <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>{r.nom}</strong> — {r.texte}
                </p>
              ))}
              <div className="field achat-equipement__cout">
                <label>
                  {t('achatEquipement.baseCostLabel')}{' '}
                  {!baseMateriauChoisie.cout_fixe && (
                    <span className="text-muted">
                      {t('achatEquipement.notationPrefix')} {baseMateriauChoisie.cout}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min={0}
                  value={coutBaseSaisi}
                  onChange={(e) => setCoutBaseSaisi(e.target.value)}
                  placeholder={!baseMateriauChoisie.cout_fixe ? t('achatEquipement.rollResultPlaceholder15') : undefined}
                />
              </div>
              {coutBaseValide && (
                <p className="text-sm">
                  {t('achatEquipement.finalPricePrefix')} (
                  {(() => {
                    const spec = MATERIAUX[materiauSelectionne.id];
                    return spec?.mode === 'addition'
                      ? `${coutBase} ${t('creation.gc')} + ${spec.montant}`
                      : `${coutBase} ${t('creation.gc')} × ${spec?.multiplicateur}`;
                  })()}
                  ) : <strong>{objetMateriauCombine?.cout} {t('creation.gc')}</strong>
                  {tailleGroupe > 1 ? ` ${t('achatEquipement.perModelSuffix')}` : ''}
                </p>
              )}
              {!gratuit && tailleGroupe > 1 && coutBaseValide && (
                <p className="text-sm">
                  {t('achatEquipement.groupOfPrefix')} {tailleGroupe} {t('achatEquipement.identicalModelsMiddle')}{' '}
                  {tailleGroupe} {t('achatEquipement.copiesBoughtForMiddle')} {coutTotalMateriau} {t('creation.gc')}
                </p>
              )}
              {!gratuit && coutBaseValide && !budgetMateriauSuffisant && (
                <p className="text-danger text-sm">{t('achatEquipement.insufficientTreasury', { tresorerie })}</p>
              )}
            </div>
            <footer className="achat-equipement__actions">
              <button className="btn--pack-pill-sm" onClick={onClose}>
                {t('achatEquipement.cancel')}
              </button>
              <button
                className="btn--pack-pill-sm btn--pack-pill-sm--primary"
                disabled={!objetMateriauCombine || !budgetMateriauSuffisant}
                onClick={confirmerMateriau}
              >
                {gratuit ? t('achatEquipement.add') : `${t('achatEquipement.buyForPrefix')} ${coutTotalMateriau} ${t('creation.gc')}`}
              </button>
            </footer>
          </>
        ) : !itemSelectionne ? (
          <>
            <header className="achat-equipement__header">
              <div className="achat-equipement__header-ligne">
                <h3 className="mt-0 mb-0">{gratuit ? t('achatEquipement.addItemTitle') : t('achatEquipement.buyEquipmentTitle')}</h3>
                <div className="flex gap-sm items-center">
                  {personnaliseActif && (
                    <button className="btn--pack-pill-sm" onClick={() => setVuePersonnalise('menu')}>
                      {t('achatEquipement.custom')}
                    </button>
                  )}
                  {!masquerBoutonFermer && (
                    <button className="icon-btn achat-equipement__close" aria-label={t('achatEquipement.close')} onClick={onClose}>
                      <Icon name="croixPack" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.2rem' }}>
                {gratuit
                  ? t('achatEquipement.freeFoundNote')
                  : `${t('achatEquipement.treasuryAvailablePrefix')} ${tresorerie} ${t('creation.gc')}.`}{' '}
                {t('achatEquipement.availabilityRollNote')}
              </p>
            </header>

            <div className="achat-equipement__contenu">
              {/* Intégré dans le recrutement (resterOuvertApresAchat), la
                  variante "primary" (asset éclairci/saturé) de l'onglet actif
                  se confondait avec la véritable action principale de la
                  fenêtre (Annuler/Terminer, juste au-dessus) — l'onglet
                  inactif passe alors en gris (--secondaire) plutôt que
                  l'actif en rouge vif, pour rester lisible sans rivaliser. */}
              {masquerShopCommun && (
                <p className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>
                  {t('achatEquipement.commonShopHiddenAtRecruitment')}
                </p>
              )}
              {masquerObjetsRares && !gratuit && (
                <p className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>
                  {t('achatEquipement.rareItemsHiddenNote')}
                </p>
              )}
              {!masquerShopCommun && (
              <div className="flex gap-sm" style={{ marginBottom: '0.5rem' }}>
                <button
                  className={`btn--pack-pill-sm ${
                    source === 'bande'
                      ? resterOuvertApresAchat
                        ? ''
                        : 'btn--pack-pill-sm--primary'
                      : resterOuvertApresAchat
                      ? 'btn--pack-pill-sm--secondaire'
                      : ''
                  }`}
                  onClick={() => changerSource('bande')}
                >
                  {t('achatEquipement.bandEquipment')}
                </button>
                <button
                  className={`btn--pack-pill-sm ${
                    source === 'commun'
                      ? resterOuvertApresAchat
                        ? ''
                        : 'btn--pack-pill-sm--primary'
                      : resterOuvertApresAchat
                      ? 'btn--pack-pill-sm--secondaire'
                      : ''
                  }`}
                  onClick={() => changerSource('commun')}
                >
                  {t('achatEquipement.commonShop')} ({itemsCommun.length})
                </button>
              </div>
              )}

              {categoriesDisponibles.length > 1 && (
                <div className="tabs" style={{ marginBottom: '0.5rem' }}>
                  <button
                    className={`tabs__btn ${categorieFiltre === null ? 'tabs__btn--active' : ''}`}
                    onClick={() => setCategorieFiltre(null)}
                  >
                    {t('achatEquipement.all')}
                  </button>
                  {categoriesDisponibles.map((cat) => (
                    <button
                      key={cat}
                      className={`tabs__btn ${categorieFiltre === cat ? 'tabs__btn--active' : ''}`}
                      onClick={() => setCategorieFiltre(cat)}
                    >
                      {iconeCategorie(cat) && <Icon name={iconeCategorie(cat)!} style={{ marginRight: '0.35em' }} />}
                      {libelleCategorie(cat, language)}
                    </button>
                  ))}
                </div>
              )}

              <div className="field">
                <input
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder={t('achatEquipement.searchItemPlaceholder')}
                />
              </div>

              <div className="achat-equipement__catalogue">
                {itemsFiltres.length === 0 && <p className="text-muted text-sm">{t('achatEquipement.noItem')}</p>}
                {itemsFiltres.map((item) => {
                  const rareteClasse = classeRarete(item.rarete);
                  const itemAffiche = translateItem(item, language);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className="list-item achat-equipement__item"
                      onClick={() => choisir(item)}
                    >
                      <div className="list-item__main">
                        <div className="achat-equipement__item-titre">
                          <span className="list-item__title">{itemAffiche.nom}</span>
                          {rareteClasse && (
                            <span className={`badge ${rareteClasse} achat-equipement__rarete`}>
                              Rare {item.rarete}
                            </span>
                          )}
                          {item.origine === 'personnalise' && <span className="badge badge--info">{t('achatEquipement.customBadge')}</span>}
                          {item.surcharge && <span className="badge badge--warning">{t('achatEquipement.modifiedBadge')}</span>}
                          {estPremiereDagueGratuite(item) && (
                            <span className="badge badge--gratuit achat-equipement__rarete">{t('achatEquipement.freeBadge')}</span>
                          )}
                        </div>
                        <div className="list-item__subtitle">
                          {iconeCategorie(item.categorie) && (
                            <Icon name={iconeCategorie(item.categorie)!} style={{ marginRight: '0.35em' }} />
                          )}
                          {libelleCategorie(item.categorie, language)} · {formatCoutItem(item.cout, language)}
                        </div>
                        {synopsis(resumeItem(itemAffiche, language)) && (
                          <div className="list-item__subtitle" style={{ marginTop: '0.2rem' }}>
                            {synopsis(resumeItem(itemAffiche, language))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </>
        ) : (
          <>
            <header className="achat-equipement__header achat-equipement__header--selection">
              <div className="achat-equipement__header-ligne">
                <button className="btn--pack-pill-sm" onClick={() => setItemId('')}>
                  {t('achatEquipement.catalogBack')}
                </button>
                {!masquerBoutonFermer && (
                  <button className="icon-btn achat-equipement__close" aria-label={t('achatEquipement.close')} onClick={onClose}>
                    <Icon name="croixPack" />
                  </button>
                )}
              </div>
              <div className="achat-equipement__selection-titre">
                <h3 className="mt-0 mb-0">{itemSelectionneAffiche!.nom}</h3>
                {classeRarete(itemSelectionne.rarete) && (
                  <span className={`badge ${classeRarete(itemSelectionne.rarete)} achat-equipement__rarete`}>
                    Rare {itemSelectionne.rarete}
                  </span>
                )}
                {itemSelectionne.origine === 'personnalise' && (
                  <span className="badge badge--info">{t('achatEquipement.customBadge')}</span>
                )}
                {itemSelectionne.surcharge && <span className="badge badge--warning">{t('achatEquipement.modifiedBadge')}</span>}
                {estPremiereDagueGratuite(itemSelectionne) && (
                  <span className="badge badge--gratuit achat-equipement__rarete">{t('achatEquipement.freeBadge')}</span>
                )}
                {personnaliseActif && (
                  <button
                    className="btn--ghost"
                    style={{ border: 'none', background: 'none', padding: '0.2rem 0.3rem', color: 'var(--text-muted)' }}
                    onClick={ouvrirEditionDepuisDetail}
                    title={t('achatEquipement.editThisItemTitle')}
                  >
                    <Icon name="crayon" size="0.85em" />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted mb-0">
                {gratuit
                  ? t('achatEquipement.freeAddNote')
                  : `${t('achatEquipement.treasuryAvailablePrefix')} ${tresorerie} ${t('creation.gc')}.`}
              </p>
            </header>

            <div className="achat-equipement__contenu achat-equipement__detail">
              {itemSelectionne.stats && (
                <div className="stat-grid" style={{ marginBottom: '0.6rem' }}>
                  {STAT_KEYS.map((k) => (
                    <div key={k} className="stat-grid__cell stat-grid__cell--label">
                      {libelleCaracteristique(k, language)}
                    </div>
                  ))}
                  {STAT_KEYS.map((k) => (
                    <div key={k} className="stat-grid__cell stat-grid__cell--value">
                      {itemSelectionne.stats![k]}
                    </div>
                  ))}
                </div>
              )}
              {(itemSelectionne.portee || itemSelectionne.force || itemSelectionne.sauvegarde) && (
                <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.4rem' }}>
                  {itemSelectionne.portee && <span className="badge badge--info">{t('itemDetail.range')} {traduirePortee(itemSelectionne.portee, language)}</span>}
                  {itemSelectionne.force && <span className="badge badge--info">{t('itemDetail.strength')} {itemSelectionne.force}</span>}
                  {itemSelectionne.sauvegarde && (
                    <span className="badge badge--info">{t('itemDetail.save')} {itemSelectionne.sauvegarde}</span>
                  )}
                </div>
              )}
              {itemSelectionne.stats_delta && (
                <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>{t('achatEquipement.permanentEffect')}</strong> —{' '}
                  {STAT_KEYS.filter((k) => itemSelectionne.stats_delta![k])
                    .map((k) => {
                      const v = itemSelectionne.stats_delta![k]!;
                      return `${v > 0 ? '+' : ''}${v} ${k}`;
                    })
                    .join(', ')}
                </p>
              )}
              {disponibiliteDetail && (
                <p className="text-sm text-muted mb-0">{disponibiliteDetail}</p>
              )}
              {itemSelectionneAffiche!.resultatSousJetAchat ? (
                <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>{itemSelectionneAffiche!.resultatSousJetAchat.label}</strong> —{' '}
                  {itemSelectionneAffiche!.resultatSousJetAchat.texte}
                </p>
              ) : (
                itemSelectionneAffiche!.regles_speciales?.map((r) => (
                  <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                    <strong>{r.nom}</strong> — {r.texte}
                  </p>
                ))
              )}
              {itemSelectionneAffiche!.texte && (
                <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                  {itemSelectionneAffiche!.texte}
                </p>
              )}

              <div className="field achat-equipement__cout">
                <label>
                  {gratuit
                    ? t('achatEquipement.itemValueLabel')
                    : `${t('achatEquipement.costPaidLabelBase')}${tailleGroupe > 1 ? t('achatEquipement.perModelParenSuffix') : ')'}`}
                  {' '}
                  {!itemSelectionne.cout_fixe && (
                    <span className="text-muted">
                      {t('achatEquipement.notationPrefix')} {itemSelectionne.cout}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min={0}
                  value={coutSaisi}
                  onChange={(e) => setCoutSaisi(e.target.value)}
                  placeholder={!itemSelectionne.cout_fixe ? t('achatEquipement.rollResultPlaceholder42') : undefined}
                />
                {gratuit && (
                  <p
                    className="text-sm mb-0"
                    style={{
                      marginTop: '0.4rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius)',
                      background: 'var(--warning-bg)',
                      color: 'var(--warning)',
                      fontWeight: 700,
                    }}
                  >
                    {t('achatEquipement.freeReferenceNote')}
                  </p>
                )}
              </div>
              {!gratuit && tailleGroupe > 1 && coutValide && (
                <p className="text-sm text-muted">
                  {t('achatEquipement.groupOfPrefix')} {tailleGroupe} {t('achatEquipement.identicalModelsMiddle')}{' '}
                  {tailleGroupe} {t('achatEquipement.copiesBoughtForMiddle')} {coutTotal} {t('creation.gc')}{' '}
                  {t('achatEquipement.totalSuffix')}
                </p>
              )}
              {!gratuit && coutValide && coutTotal > tresorerie && (
                <p className="text-danger text-sm">{t('achatEquipement.insufficientTreasury', { tresorerie })}</p>
              )}
              {limitePlafondGroupe && refPlafondGroupe && roster && (
                <p className="text-danger text-sm">
                  {t('achatEquipement.groupLimitReached', {
                    actuel: comptePlafondGroupe(catalogue, roster, refPlafondGroupe.id),
                    max: refPlafondGroupe.max,
                    label: refPlafondGroupe.label ?? itemSelectionneAffiche?.nom ?? '',
                  })}
                </p>
              )}
              {(trinketLimite || limiteUniqueBande) && (
                <p className="text-danger text-sm">
                  {t('achatEquipement.trinketLimitPrefix')}{' '}
                  {tailleGroupe > 1 && !inventaireBande.some((entree) => entree.item_id === itemSelectionne.id)
                    ? t('achatEquipement.trinketLimitAddSuffix', { n: tailleGroupe })
                    : '.'}
                </p>
              )}
            </div>

            <footer className="achat-equipement__actions">
              <button className="btn--pack-pill-sm" onClick={() => setItemId('')}>
                {t('achatEquipement.return')}
              </button>
              <button
                className="btn--pack-pill-sm btn--pack-pill-sm--primary"
                disabled={!coutValide || limiteAtteinte || (!gratuit && coutTotal > tresorerie)}
                onClick={confirmer}
              >
                {gratuit ? t('achatEquipement.add') : t('achatEquipement.buy')}
              </button>
            </footer>
          </>
        )}
      </div>
  );
}

// Point d'entrée standalone (utilisé partout ailleurs) : la même vitrine,
// dans sa propre fenêtre plein écran.
export function AchatEquipementModal(props: Props) {
  return (
    <Modal onClose={props.onClose} variant="fullscreen">
      <AchatEquipementContenu {...props} />
    </Modal>
  );
}
