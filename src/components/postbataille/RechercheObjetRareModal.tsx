import { useMemo, useState } from 'react';
import type { Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import {
  classeRarete,
  creerEntreeInventaire,
  getShopCommun,
  inventaireComplet,
  libelleCategorie,
  resumeItem,
  TRINKETS_LIMITES,
  type ShopItem,
} from '../../utils/shop';
import { useGameRules } from '../../state/useGameRules';
import { Modal } from '../common/Modal';

export type ResultatRechercheRare = {
  jet: number;
  rarete: number;
  objetNom: string;
  reussi: boolean;
  achat?: ReturnType<typeof creerEntreeInventaire>;
};

type Props = {
  membre: Member;
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  tresorerieDisponible: number;
  inventaireSupplementaire: ReturnType<typeof creerEntreeInventaire>[];
  onClose: () => void;
  onTerminer: (resultat: ResultatRechercheRare) => void;
};

function niveauRarete(item: ShopItem): number | null {
  const direct = Number(item.rarete);
  if (Number.isInteger(direct)) return direct;
  const trouve = item.disponibilite?.match(/Rare\s+(\d+)/i);
  return trouve ? Number(trouve[1]) : null;
}

export function RechercheObjetRareModal({
  membre,
  roster,
  catalogue,
  tresorerieDisponible,
  inventaireSupplementaire,
  onClose,
  onTerminer,
}: Props) {
  const { rules } = useGameRules();
  const [recherche, setRecherche] = useState('');
  const [itemId, setItemId] = useState('');
  const [jetSaisi, setJetSaisi] = useState('');
  const [coutSaisi, setCoutSaisi] = useState('');

  const items = useMemo(() => {
    const candidats = getShopCommun(catalogue.id, rules);
    const uniques = new Map<string, ShopItem>();
    for (const item of candidats) {
      if (niveauRarete(item) === null || uniques.has(item.id)) continue;
      uniques.set(item.id, item);
    }
    return [...uniques.values()].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  }, [catalogue, rules]);

  const q = recherche.trim().toLocaleLowerCase('fr');
  const itemsFiltres = q ? items.filter((item) => item.nom.toLocaleLowerCase('fr').includes(q)) : items;
  const item = items.find((candidat) => candidat.id === itemId) ?? null;
  const rarete = item ? niveauRarete(item) : null;
  const jet = Number(jetSaisi);
  const jetValide = Number.isInteger(jet) && jet >= 2 && jet <= 12;
  const reussi = jetValide && rarete !== null && jet >= rarete;
  const cout = Number(coutSaisi);
  const coutValide = coutSaisi.trim() !== '' && Number.isFinite(cout) && cout >= 0;
  const inventaireBande = [...inventaireComplet(roster), ...inventaireSupplementaire];
  const trinketBloque =
    !!item &&
    rules.trinketsLimites &&
    TRINKETS_LIMITES.has(item.id) &&
    inventaireBande.some((entree) => entree.item_id === item.id);

  const choisir = (choisi: ShopItem) => {
    setItemId(choisi.id);
    setJetSaisi('');
    setCoutSaisi(choisi.cout_fixe && typeof choisi.cout === 'number' ? String(choisi.cout) : '');
  };

  const resultatSansAchat = () => {
    if (!item || rarete === null || !jetValide) return;
    onTerminer({ jet, rarete, objetNom: item.nom, reussi });
  };

  const acheter = () => {
    if (
      !item ||
      rarete === null ||
      !jetValide ||
      !reussi ||
      !coutValide ||
      cout > tresorerieDisponible ||
      trinketBloque
    ) {
      return;
    }
    onTerminer({
      jet,
      rarete,
      objetNom: item.nom,
      reussi: true,
      achat: creerEntreeInventaire(item, cout),
    });
  };

  return (
    <Modal onClose={onClose} variant="fullscreen">
      <div className="achat-equipement">
        {!item ? (
          <>
            <header className="achat-equipement__header">
              <div className="achat-equipement__header-ligne">
                <h3 className="mt-0 mb-0">Recherche d'un objet rare — {membre.nom_perso}</h3>
                <button className="btn btn--sm" aria-label="Fermer" onClick={onClose}>
                  ✕
                </button>
              </div>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.25rem' }}>
                Choisis l'objet recherché, puis saisis le total des 2D6 lancés devant les joueurs. Ce Héros ne
                dispose que d'un seul jet pendant cette séquence.
              </p>
            </header>
            <div className="achat-equipement__contenu">
              <div className="field">
                <input
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher un objet rare…"
                />
              </div>
              <div className="achat-equipement__catalogue">
                {itemsFiltres.length === 0 && <p className="text-muted">Aucun objet rare correspondant.</p>}
                {itemsFiltres.map((candidat) => {
                  const niveau = niveauRarete(candidat);
                  return (
                    <button
                      key={candidat.id}
                      type="button"
                      className="list-item achat-equipement__item"
                      onClick={() => choisir(candidat)}
                    >
                      <div className="list-item__main">
                        <div className="achat-equipement__item-titre">
                          <span className="list-item__title">{candidat.nom}</span>
                          <span className={`badge ${classeRarete(String(niveau)) ?? ''}`}>Rare {niveau}</span>
                        </div>
                        <div className="list-item__subtitle">
                          {libelleCategorie(candidat.categorie)} ·{' '}
                          {typeof candidat.cout === 'number' ? `${candidat.cout} po` : candidat.cout}
                        </div>
                        {resumeItem(candidat) && (
                          <div className="list-item__subtitle" style={{ marginTop: '0.2rem' }}>
                            {resumeItem(candidat)}
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
                <h3 className="mt-0 mb-0">{item.nom}</h3>
                <span className={`badge ${classeRarete(String(rarete)) ?? ''}`}>Rare {rarete}</span>
              </div>
            </header>

            <div className="achat-equipement__contenu achat-equipement__detail">
              <p className="text-sm text-muted">
                Un résultat total supérieur ou égal à {rarete} rend disponible un seul exemplaire.
              </p>
              {item.disponibilite && <p className="text-sm text-muted">{item.disponibilite}</p>}
              {resumeItem(item) && <p className="text-sm">{resumeItem(item)}</p>}
              <div className="field">
                <label>Résultat total des 2D6</label>
                <select value={jetSaisi} onChange={(e) => setJetSaisi(e.target.value)}>
                  <option value="">Choisis le résultat obtenu…</option>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((valeur) => (
                    <option key={valeur} value={valeur}>{valeur}</option>
                  ))}
                </select>
              </div>

              {jetValide && (
                <div className="card card--tight" style={{ borderColor: reussi ? 'var(--success)' : 'var(--danger)' }}>
                  <strong>{reussi ? 'Objet disponible' : 'Recherche échouée'}</strong>
                  <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                    2D6 = {jet} contre Rare {rarete}.
                  </p>
                </div>
              )}

              {reussi && (
                <>
                  <div className="field">
                    <label>
                      Coût payé (po)
                      {!item.cout_fixe && <span className="text-muted"> — notation : {item.cout}</span>}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={coutSaisi}
                      onChange={(e) => setCoutSaisi(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted">Trésorerie disponible : {tresorerieDisponible} po.</p>
                  {coutValide && cout > tresorerieDisponible && (
                    <p className="text-sm text-danger">Trésorerie insuffisante.</p>
                  )}
                  {trinketBloque && (
                    <p className="text-sm text-danger">
                      Limite atteinte : cet objet est limité à un exemplaire par bande.
                    </p>
                  )}
                </>
              )}
            </div>

            <footer className="achat-equipement__actions">
              <button className="btn" onClick={onClose}>Annuler</button>
              {jetValide && !reussi && (
                <button className="btn btn--primary" onClick={resultatSansAchat}>
                  Enregistrer l'échec
                </button>
              )}
              {reussi && (
                <>
                  <button className="btn" onClick={resultatSansAchat}>
                    Ne pas acheter
                  </button>
                  <button
                    className="btn btn--primary"
                    disabled={!coutValide || cout > tresorerieDisponible || trinketBloque}
                    onClick={acheter}
                  >
                    Acheter et terminer
                  </button>
                </>
              )}
            </footer>
          </>
        )}
      </div>
    </Modal>
  );
}
