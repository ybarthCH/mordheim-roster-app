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
  resumeItem,
  formatCoutItem,
  CATEGORIE_ORDRE,
  TRINKETS_LIMITES,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { STAT_KEYS } from '../../types/catalog';
import { Icon } from '../common/Icon';
import type { InventoryEntry, CustomItem, CustomItemOverride } from '../../types/roster';
import { useGameRules } from '../../state/useGameRules';
import { CustomItemForm } from './CustomItemForm';

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
  onClose: () => void;
  onAchat: (item: ShopItem, coutPaye: number) => void;
};

const LONGUEUR_SYNOPSIS = 110;

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

export function AchatEquipementModal({
  catalogue,
  profil,
  tresorerie,
  competencesAcquises = [],
  marqueId,
  inventaireActuel = [],
  inventaireBande = [],
  tailleGroupe = 1,
  gratuit = false,
  objetsPersonnalises = [],
  objetsSurcharges = {},
  onObjetsPersonnalisesChange,
  onObjetsSurchargesChange,
  categorieInitiale,
  onClose,
  onAchat,
}: Props) {
  const { rules } = useGameRules();
  const [source, setSource] = useState<'bande' | 'commun'>(categorieInitiale ? 'commun' : 'bande');
  const [categorieFiltre, setCategorieFiltre] = useState<string | null>(categorieInitiale ?? null);
  const [recherche, setRecherche] = useState('');
  const [itemId, setItemId] = useState('');
  const [coutSaisi, setCoutSaisi] = useState('');
  const [vuePersonnalise, setVuePersonnalise] = useState<'menu' | 'creer' | 'selection' | 'editer' | null>(null);
  const [rechercheEdition, setRechercheEdition] = useState('');
  const [itemAEditer, setItemAEditer] = useState<ShopItem | null>(null);

  const personnaliseActif = !!(onObjetsPersonnalisesChange && onObjetsSurchargesChange);

  const itemsBandeBase = useMemo(
    () => [
      ...getEquipementBande(catalogue, profil ?? null, competencesAcquises, inventaireActuel, rules, marqueId),
      ...objetsPersonnalisesEnShopItems(objetsPersonnalises),
    ],
    [catalogue, profil, competencesAcquises, inventaireActuel, rules, marqueId, objetsPersonnalises]
  );
  const itemsBande = useMemo(
    () => avecSurcharges(itemsBandeBase, objetsSurcharges),
    [itemsBandeBase, objetsSurcharges]
  );
  const itemsCommunBase = useMemo(
    () =>
      getShopCommun(catalogue.id, rules).filter((item) => gratuit || item.categorie !== 'artefacts_magiques'),
    [catalogue.id, rules, gratuit]
  );
  const itemsCommun = useMemo(
    () => avecSurcharges(itemsCommunBase, objetsSurcharges),
    [itemsCommunBase, objetsSurcharges]
  );
  const items = source === 'bande' ? itemsBande : itemsCommun;

  const itemsPourEdition = useMemo(() => {
    const vus = new Set<string>();
    return [...itemsBande, ...itemsCommun]
      .filter((i) => {
        if (vus.has(i.id)) return false;
        vus.add(i.id);
        return true;
      })
      .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  }, [itemsBande, itemsCommun]);
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

  const itemSelectionne = items.find((i) => i.id === itemId) ?? null;
  const disponibiliteDetail = disponibiliteSansRarete(
    itemSelectionne?.disponibilite,
    itemSelectionne?.rarete
  );

  const changerSource = (s: 'bande' | 'commun') => {
    setSource(s);
    setCategorieFiltre(null);
    setItemId('');
  };

  const choisir = (item: ShopItem) => {
    setItemId(item.id);
    setCoutSaisi(item.cout_fixe && typeof item.cout === 'number' ? String(item.cout) : '');
  };

  const cout = Number(coutSaisi);
  const coutValide = coutSaisi.trim() !== '' && !Number.isNaN(cout) && cout >= 0;
  const coutTotal = cout * tailleGroupe;
  const trinketLimite =
    !!itemSelectionne &&
    rules.trinketsLimites &&
    TRINKETS_LIMITES.has(itemSelectionne.id) &&
    (inventaireBande.some((entree) => entree.item_id === itemSelectionne.id) || tailleGroupe > 1);

  const confirmer = () => {
    if (!itemSelectionne || !coutValide || trinketLimite) return;
    onAchat(itemSelectionne, cout);
    onClose();
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
    <Modal onClose={onClose} variant="fullscreen">
      <div className="achat-equipement">
        {vuePersonnalise === 'menu' ? (
          <div className="achat-equipement__contenu">
            <div className="achat-equipement__header-ligne" style={{ marginBottom: '0.5rem' }}>
              <h3 className="mt-0 mb-0">Objet personnalisé</h3>
              <button className="btn btn--sm" aria-label="Fermer" onClick={fermerFlowPersonnalise}>
                ✕
              </button>
            </div>
            <p className="text-sm text-muted">
              Crée un objet homebrew pour cette bande, ou ajuste un objet existant (prix, effet, caractéristiques…)
              sans affecter les autres bandes.
            </p>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              <button className="btn btn--primary" onClick={() => setVuePersonnalise('creer')}>
                Créer un objet
              </button>
              <button className="btn" onClick={() => setVuePersonnalise('selection')}>
                Éditer un objet existant
              </button>
            </div>
          </div>
        ) : vuePersonnalise === 'creer' ? (
          <CustomItemForm
            titre="Créer un objet personnalisé"
            onEnregistrer={creerObjetPersonnalise}
            onAnnuler={() => setVuePersonnalise('menu')}
          />
        ) : vuePersonnalise === 'selection' ? (
          <div className="achat-equipement__contenu">
            <div className="achat-equipement__header-ligne" style={{ marginBottom: '0.5rem' }}>
              <h3 className="mt-0 mb-0">Choisir un objet à éditer</h3>
              <button className="btn btn--sm" onClick={() => setVuePersonnalise('menu')}>
                ← Retour
              </button>
            </div>
            <div className="field">
              <input
                value={rechercheEdition}
                onChange={(e) => setRechercheEdition(e.target.value)}
                placeholder="Rechercher un objet…"
              />
            </div>
            <div className="achat-equipement__catalogue">
              {itemsPourEditionFiltres.length === 0 && <p className="text-muted text-sm">Aucun objet.</p>}
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
                      {item.origine === 'personnalise' && <span className="badge badge--info">Personnalisé</span>}
                      {item.surcharge && <span className="badge badge--warning">Modifié</span>}
                    </div>
                    <div className="list-item__subtitle">
                      {libelleCategorie(item.categorie)} · {formatCoutItem(item.cout)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : vuePersonnalise === 'editer' && itemAEditer ? (
          <CustomItemForm
            titre={`Éditer ${itemAEditer.nom}`}
            initial={initialEdition}
            onEnregistrer={enregistrerEditionObjet}
            onAnnuler={() => setVuePersonnalise('menu')}
            onRevert={
              itemAEditer.origine !== 'personnalise' && objetsSurcharges[itemAEditer.id] ? revertSurcharge : undefined
            }
          />
        ) : !itemSelectionne ? (
          <>
            <header className="achat-equipement__header">
              <div className="achat-equipement__header-ligne">
                <h3 className="mt-0 mb-0">{gratuit ? "Ajouter un objet trouvé" : "Acheter de l'équipement"}</h3>
                <div className="flex gap-sm items-center">
                  {personnaliseActif && (
                    <button className="btn btn--sm" onClick={() => setVuePersonnalise('menu')}>
                      Personnalisé
                    </button>
                  )}
                  <button className="btn btn--sm" aria-label="Fermer" onClick={onClose}>
                    ✕
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.2rem' }}>
                {gratuit
                  ? "Objet trouvé gratuitement : n'affecte pas la trésorerie de la bande."
                  : `Trésorerie disponible : ${tresorerie} po.`}{' '}
                Les jets de disponibilité se font en jeu.
              </p>
            </header>

            <div className="achat-equipement__contenu">
              <div className="flex gap-sm" style={{ marginBottom: '0.5rem' }}>
                <button
                  className={`btn btn--sm ${source === 'bande' ? 'btn--primary' : ''}`}
                  onClick={() => changerSource('bande')}
                >
                  Équipement de la bande
                </button>
                <button
                  className={`btn btn--sm ${source === 'commun' ? 'btn--primary' : ''}`}
                  onClick={() => changerSource('commun')}
                >
                  Shop commun ({itemsCommun.length})
                </button>
              </div>

              {categoriesDisponibles.length > 1 && (
                <div className="tabs" style={{ marginBottom: '0.5rem' }}>
                  <button
                    className={`tabs__btn ${categorieFiltre === null ? 'tabs__btn--active' : ''}`}
                    onClick={() => setCategorieFiltre(null)}
                  >
                    Toutes
                  </button>
                  {categoriesDisponibles.map((cat) => (
                    <button
                      key={cat}
                      className={`tabs__btn ${categorieFiltre === cat ? 'tabs__btn--active' : ''}`}
                      onClick={() => setCategorieFiltre(cat)}
                    >
                      {iconeCategorie(cat) && <Icon name={iconeCategorie(cat)!} style={{ marginRight: '0.35em' }} />}
                      {libelleCategorie(cat)}
                    </button>
                  ))}
                </div>
              )}

              <div className="field">
                <input
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher un objet…"
                />
              </div>

              <div className="achat-equipement__catalogue">
                {itemsFiltres.length === 0 && <p className="text-muted text-sm">Aucun objet.</p>}
                {itemsFiltres.map((item) => {
                  const rareteClasse = classeRarete(item.rarete);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className="list-item achat-equipement__item"
                      onClick={() => choisir(item)}
                    >
                      <div className="list-item__main">
                        <div className="achat-equipement__item-titre">
                          <span className="list-item__title">{item.nom}</span>
                          {rareteClasse && (
                            <span className={`badge ${rareteClasse} achat-equipement__rarete`}>
                              Rare {item.rarete}
                            </span>
                          )}
                          {item.origine === 'personnalise' && <span className="badge badge--info">Personnalisé</span>}
                          {item.surcharge && <span className="badge badge--warning">Modifié</span>}
                        </div>
                        <div className="list-item__subtitle">
                          {iconeCategorie(item.categorie) && (
                            <Icon name={iconeCategorie(item.categorie)!} style={{ marginRight: '0.35em' }} />
                          )}
                          {libelleCategorie(item.categorie)} · {formatCoutItem(item.cout)}
                        </div>
                        {synopsis(resumeItem(item)) && (
                          <div className="list-item__subtitle" style={{ marginTop: '0.2rem' }}>
                            {synopsis(resumeItem(item))}
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
                <button className="btn btn--sm" onClick={() => setItemId('')}>
                  ← Catalogue
                </button>
                <button className="btn btn--sm" aria-label="Fermer" onClick={onClose}>
                  ✕
                </button>
              </div>
              <div className="achat-equipement__selection-titre">
                <h3 className="mt-0 mb-0">{itemSelectionne.nom}</h3>
                {classeRarete(itemSelectionne.rarete) && (
                  <span className={`badge ${classeRarete(itemSelectionne.rarete)} achat-equipement__rarete`}>
                    Rare {itemSelectionne.rarete}
                  </span>
                )}
                {itemSelectionne.origine === 'personnalise' && (
                  <span className="badge badge--info">Personnalisé</span>
                )}
                {itemSelectionne.surcharge && <span className="badge badge--warning">Modifié</span>}
                {personnaliseActif && (
                  <button
                    className="btn--ghost"
                    style={{ border: 'none', background: 'none', padding: '0.2rem 0.3rem', color: 'var(--text-muted)' }}
                    onClick={ouvrirEditionDepuisDetail}
                    title="Modifier cet objet pour cette bande"
                  >
                    <Icon name="crayon" size="0.85em" />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted mb-0">
                {gratuit ? "Ajouter cet objet à l'inventaire" : `Trésorerie disponible : ${tresorerie} po.`}
              </p>
            </header>

            <div className="achat-equipement__contenu achat-equipement__detail">
              {itemSelectionne.stats && (
                <div className="stat-grid" style={{ marginBottom: '0.6rem' }}>
                  {STAT_KEYS.map((k) => (
                    <div key={k} className="stat-grid__cell stat-grid__cell--label">
                      {k}
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
                  {itemSelectionne.portee && <span className="badge badge--info">Portée {itemSelectionne.portee}</span>}
                  {itemSelectionne.force && <span className="badge badge--info">Force {itemSelectionne.force}</span>}
                  {itemSelectionne.sauvegarde && (
                    <span className="badge badge--info">Save {itemSelectionne.sauvegarde}</span>
                  )}
                </div>
              )}
              {itemSelectionne.stats_delta && (
                <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>Effet permanent</strong> —{' '}
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
              {itemSelectionne.regles_speciales?.map((r) => (
                <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>{r.nom}</strong> — {r.texte}
                </p>
              ))}
              {itemSelectionne.texte && (
                <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                  {itemSelectionne.texte}
                </p>
              )}

              <div className="field achat-equipement__cout">
                <label>
                  {gratuit ? `Valeur de l'objet (po)` : `Coût payé (po${tailleGroupe > 1 ? ' / figurine' : ''})`}{' '}
                  {!itemSelectionne.cout_fixe && (
                    <span className="text-muted">— notation : {itemSelectionne.cout}</span>
                  )}
                </label>
                <input
                  type="number"
                  min={0}
                  value={coutSaisi}
                  onChange={(e) => setCoutSaisi(e.target.value)}
                  placeholder={!itemSelectionne.cout_fixe ? 'Résultat du jet, ex : 42' : undefined}
                />
                {gratuit && (
                  <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                    Sert uniquement de référence pour une revente future — rien n'est déduit de la trésorerie.
                  </p>
                )}
              </div>
              {!gratuit && tailleGroupe > 1 && coutValide && (
                <p className="text-sm text-muted">
                  Groupe de {tailleGroupe} figurines identiques : {tailleGroupe} exemplaires achetés pour {coutTotal} po
                  au total.
                </p>
              )}
              {!gratuit && coutValide && coutTotal > tresorerie && (
                <p className="text-danger text-sm">Trésorerie insuffisante ({tresorerie} po disponibles).</p>
              )}
              {trinketLimite && (
                <p className="text-danger text-sm">
                  Limite atteinte : cet objet est limité à un exemplaire par bande
                  {tailleGroupe > 1 && !inventaireBande.some((entree) => entree.item_id === itemSelectionne.id)
                    ? ` et cet achat en ajouterait ${tailleGroupe}.`
                    : '.'}
                </p>
              )}
            </div>

            <footer className="achat-equipement__actions">
              <button className="btn" onClick={() => setItemId('')}>
                Retour
              </button>
              <button
                className="btn btn--primary"
                disabled={!coutValide || trinketLimite}
                onClick={confirmer}
              >
                {gratuit ? 'Ajouter' : 'Acheter'}
              </button>
            </footer>
          </>
        )}
      </div>
    </Modal>
  );
}
