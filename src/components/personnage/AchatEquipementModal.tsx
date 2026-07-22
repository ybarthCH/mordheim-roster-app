import { useMemo, useState } from 'react';
import type { WarbandCatalog, Profile } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { getEquipementBande, getShopCommun, libelleCategorie, CATEGORIE_ORDRE } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';

type Props = {
  catalogue: WarbandCatalog;
  profil: Profile | null;
  tresorerie: number;
  onClose: () => void;
  onAchat: (item: ShopItem, coutPaye: number) => void;
};

const LONGUEUR_SYNOPSIS = 110;

function synopsis(texte: string | null | undefined): string | null {
  if (!texte) return null;
  return texte.length > LONGUEUR_SYNOPSIS ? `${texte.slice(0, LONGUEUR_SYNOPSIS).trimEnd()}…` : texte;
}

export function AchatEquipementModal({ catalogue, profil, tresorerie, onClose, onAchat }: Props) {
  const [source, setSource] = useState<'bande' | 'commun'>('bande');
  const [categorieFiltre, setCategorieFiltre] = useState<string | null>(null);
  const [recherche, setRecherche] = useState('');
  const [itemId, setItemId] = useState('');
  const [coutSaisi, setCoutSaisi] = useState('');

  const itemsBande = useMemo(() => getEquipementBande(catalogue, profil ?? null), [catalogue, profil]);
  const itemsCommun = useMemo(() => getShopCommun(), []);
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

  const confirmer = () => {
    if (!itemSelectionne || !coutValide) return;
    onAchat(itemSelectionne, cout);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', maxHeight: '80vh' }}>
        <div style={{ flexShrink: 0 }}>
          <h3 className="mt-0 mb-0">Acheter de l'équipement</h3>
          <p className="text-sm text-muted" style={{ marginTop: '0.2rem' }}>
            Trésorerie disponible : {tresorerie} po. Pas de gestion de rareté ici — les jets de disponibilité se
            font en jeu.
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
                  {libelleCategorie(item.categorie)} · {typeof item.cout === 'number' ? `${item.cout} po` : item.cout}
                </div>
                {synopsis(item.texte) && (
                  <div className="list-item__subtitle" style={{ marginTop: '0.2rem' }}>
                    {synopsis(item.texte)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {itemSelectionne && (
          <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
            {itemSelectionne.disponibilite && (
              <p className="text-sm text-muted mb-0">{itemSelectionne.disponibilite}</p>
            )}
            <div className="field">
              <label>
                Coût payé (po){' '}
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
            </div>
            {coutValide && cout > tresorerie && (
              <p className="text-danger text-sm">Trésorerie insuffisante ({tresorerie} po disponibles).</p>
            )}
          </div>
        )}

        <div className="flex gap-sm" style={{ marginTop: '0.8rem', flexShrink: 0 }}>
          <button className="btn" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn--primary" disabled={!itemSelectionne || !coutValide} onClick={confirmer}>
            Acheter
          </button>
        </div>
      </div>
    </Modal>
  );
}
