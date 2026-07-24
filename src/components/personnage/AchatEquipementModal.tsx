import { useMemo, useState } from 'react';
import type { WarbandCatalog, Profile } from '../../types/catalog';
import { Modal } from '../common/Modal';
import {
  getEquipementBande,
  getShopCommun,
  libelleCategorie,
  iconeCategorie,
  classeRarete,
  resumeItem,
  CATEGORIE_ORDRE,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { STAT_KEYS } from '../../types/catalog';
import { Icon } from '../common/Icon';
import type { InventoryEntry } from '../../types/roster';

type Props = {
  catalogue: WarbandCatalog;
  profil: Profile | null;
  tresorerie: number;
  // Compétences acquises par le membre (ex : "Connaissance des Armes"),
  // pour lever la restriction de liste d'équipement le cas échéant.
  competencesAcquises?: string[];
  // Inventaire actuel du membre (ou stock de bande) ciblé par l'achat : sert
  // à détecter les objets déjà possédés d'un même `groupe_prix` (ex :
  // Bénédictions de Nurgle) pour appliquer le doublement de prix.
  inventaireActuel?: InventoryEntry[];
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
  onClose: () => void;
  onAchat: (item: ShopItem, coutPaye: number) => void;
};

const LONGUEUR_SYNOPSIS = 110;

function synopsis(texte: string | null | undefined): string | null {
  if (!texte) return null;
  return texte.length > LONGUEUR_SYNOPSIS ? `${texte.slice(0, LONGUEUR_SYNOPSIS).trimEnd()}…` : texte;
}

export function AchatEquipementModal({
  catalogue,
  profil,
  tresorerie,
  competencesAcquises = [],
  inventaireActuel = [],
  tailleGroupe = 1,
  gratuit = false,
  onClose,
  onAchat,
}: Props) {
  const [source, setSource] = useState<'bande' | 'commun'>('bande');
  const [categorieFiltre, setCategorieFiltre] = useState<string | null>(null);
  const [recherche, setRecherche] = useState('');
  const [itemId, setItemId] = useState('');
  const [coutSaisi, setCoutSaisi] = useState('');

  const itemsBande = useMemo(
    () => getEquipementBande(catalogue, profil ?? null, competencesAcquises, inventaireActuel),
    [catalogue, profil, competencesAcquises, inventaireActuel]
  );
  const itemsCommun = useMemo(() => getShopCommun(catalogue.id), [catalogue.id]);
  const items = source === 'bande' ? itemsBande : itemsCommun;

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

  const confirmer = () => {
    if (!itemSelectionne || !coutValide) return;
    onAchat(itemSelectionne, cout);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', maxHeight: '80vh' }}>
        <div style={{ flexShrink: 0 }}>
          <h3 className="mt-0 mb-0">{gratuit ? "Ajouter un objet trouvé" : "Acheter de l'équipement"}</h3>
          <p className="text-sm text-muted" style={{ marginTop: '0.2rem' }}>
            {gratuit
              ? "Objet trouvé gratuitement : n'affecte pas la trésorerie de la bande."
              : `Trésorerie disponible : ${tresorerie} po.`}{' '}
            Pas de gestion de rareté ici — les jets de disponibilité se font en jeu.
          </p>

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

          <div className="field" style={{ marginBottom: 0 }}>
            <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un objet…" />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            margin: '0.6rem 0',
          }}
        >
          {itemsFiltres.length === 0 && (
            <p className="text-muted text-sm" style={{ padding: '0.6rem' }}>
              Aucun objet.
            </p>
          )}
          {itemsFiltres.map((item) => (
            <div
              key={item.id}
              className="list-item"
              role="button"
              onClick={() => choisir(item)}
              style={{
                cursor: 'pointer',
                background: itemId === item.id ? 'var(--bg-inset)' : undefined,
              }}
            >
              <div className="list-item__main">
                <div className="list-item__title">{item.nom}</div>
                <div className="list-item__subtitle">
                  {iconeCategorie(item.categorie) && (
                    <Icon name={iconeCategorie(item.categorie)!} style={{ marginRight: '0.35em' }} />
                  )}
                  {libelleCategorie(item.categorie)} · {typeof item.cout === 'number' ? `${item.cout} po` : item.cout}
                </div>
                {synopsis(resumeItem(item)) && (
                  <div className="list-item__subtitle" style={{ marginTop: '0.2rem' }}>
                    {synopsis(resumeItem(item))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {itemSelectionne && (
          <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
            <div style={{ maxHeight: '24vh', overflowY: 'auto' }}>
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
              {classeRarete(itemSelectionne.rarete) && (
                <span className={`badge ${classeRarete(itemSelectionne.rarete)}`} style={{ marginBottom: '0.3rem' }}>
                  Rare {itemSelectionne.rarete}
                </span>
              )}
              {itemSelectionne.stats_delta && (
                <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>Effet permanent</strong> —{' '}
                  {STAT_KEYS.filter((k) => itemSelectionne.stats_delta![k]).map((k) => {
                    const v = itemSelectionne.stats_delta![k]!;
                    return `${v > 0 ? '+' : ''}${v} ${k}`;
                  }).join(', ')}
                </p>
              )}
              {itemSelectionne.disponibilite && (
                <p className="text-sm text-muted mb-0">{itemSelectionne.disponibilite}</p>
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
            </div>
            <div className="field">
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
          </div>
        )}

        <div className="flex gap-sm" style={{ marginTop: '0.8rem', flexShrink: 0 }}>
          <button className="btn" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn--primary" disabled={!itemSelectionne || !coutValide} onClick={confirmer}>
            {gratuit ? 'Ajouter' : 'Acheter'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
