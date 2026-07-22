import { useMemo, useState } from 'react';
import type { WarbandCatalog, Profile } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { getEquipementBande, getShopCommun } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';

type Props = {
  catalogue: WarbandCatalog;
  profil: Profile | null;
  tresorerie: number;
  onClose: () => void;
  onAchat: (item: ShopItem, coutPaye: number) => void;
};

export function AchatEquipementModal({ catalogue, profil, tresorerie, onClose, onAchat }: Props) {
  const [source, setSource] = useState<'bande' | 'commun'>('bande');
  const [recherche, setRecherche] = useState('');
  const [itemId, setItemId] = useState('');
  const [coutSaisi, setCoutSaisi] = useState('');

  const itemsBande = useMemo(() => getEquipementBande(catalogue, profil ?? null), [catalogue, profil]);
  const itemsCommun = useMemo(() => getShopCommun(), []);
  const items = source === 'bande' ? itemsBande : itemsCommun;

  const itemsFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    const liste = q ? items.filter((i) => i.nom.toLowerCase().includes(q)) : items;
    return [...liste].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  }, [items, recherche]);

  const itemSelectionne = items.find((i) => i.id === itemId) ?? null;

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
      <h3>Acheter de l'équipement</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.5rem' }}>
        Trésorerie disponible : {tresorerie} po. Pas de gestion de rareté ici — les jets de disponibilité se font en
        jeu.
      </p>

      <div className="flex gap-sm" style={{ marginBottom: '0.6rem' }}>
        <button
          className={`btn btn--sm ${source === 'bande' ? 'btn--primary' : ''}`}
          onClick={() => {
            setSource('bande');
            setItemId('');
          }}
        >
          Équipement de la bande
        </button>
        <button
          className={`btn btn--sm ${source === 'commun' ? 'btn--primary' : ''}`}
          onClick={() => {
            setSource('commun');
            setItemId('');
          }}
        >
          Shop commun ({itemsCommun.length})
        </button>
      </div>

      <div className="field">
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un objet…"
        />
      </div>

      <div
        style={{
          maxHeight: '11rem',
          overflowY: 'auto',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}
      >
        {itemsFiltres.length === 0 && <p className="text-muted text-sm" style={{ padding: '0.6rem' }}>Aucun objet.</p>}
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
                {item.categorie} · {typeof item.cout === 'number' ? `${item.cout} po` : item.cout}
              </div>
            </div>
          </div>
        ))}
      </div>

      {itemSelectionne && (
        <div style={{ marginTop: '0.8rem' }}>
          {itemSelectionne.disponibilite && (
            <p className="text-sm text-muted mb-0">{itemSelectionne.disponibilite}</p>
          )}
          {itemSelectionne.texte && (
            <p className="text-sm" style={{ marginTop: '0.3rem' }}>
              {itemSelectionne.texte}
            </p>
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

      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          Annuler
        </button>
        <button className="btn btn--primary" disabled={!itemSelectionne || !coutValide} onClick={confirmer}>
          Acheter
        </button>
      </div>
    </Modal>
  );
}
