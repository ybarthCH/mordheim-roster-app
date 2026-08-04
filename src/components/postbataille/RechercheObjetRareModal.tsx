import { useMemo, useState } from 'react';
import type { Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import {
  classeRarete,
  creerEntreeInventaire,
  formatCoutItem,
  getShopCommun,
  inventaireComplet,
  libelleCategorie,
  resumeItem,
  TRINKETS_LIMITES,
  type ShopItem,
} from '../../utils/shop';
import { useGameRules } from '../../state/useGameRules';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../state/useLanguage';
import { translateItem } from '../../i18n/data/items';

export type ResultatRechercheRare = {
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
  const { t, language } = useLanguage();
  const { rules } = useGameRules();
  const [recherche, setRecherche] = useState('');
  const [itemId, setItemId] = useState('');
  const [succesDeclare, setSuccesDeclare] = useState(false);
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
  const itemAffiche = item ? translateItem(item, language) : null;
  const rarete = item ? niveauRarete(item) : null;
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
    setSuccesDeclare(false);
    setCoutSaisi('');
  };

  // Le prix pré-rempli est calculé au moment de la déclaration de succès (et
  // non à la sélection dans le catalogue) : entre les deux, le joueur lance
  // le dé sur table papier, ce qui laisse largement le temps aux règles
  // optionnelles de finir de se charger (voir GameRulesProvider) — mieux
  // vaut de toute façon refléter le prix le plus à jour au moment où il
  // compte réellement, plutôt qu'un instantané pris plus tôt.
  const declarerSucces = () => {
    setSuccesDeclare(true);
    if (item?.cout_fixe && typeof item.cout === 'number') {
      setCoutSaisi(String(item.cout));
    }
  };

  const enregistrerEchec = () => {
    if (!item || rarete === null) return;
    onTerminer({ rarete, objetNom: item.nom, reussi: false });
  };

  const neePasAcheter = () => {
    if (!item || rarete === null) return;
    onTerminer({ rarete, objetNom: item.nom, reussi: true });
  };

  const acheter = () => {
    if (!item || rarete === null || !coutValide || cout > tresorerieDisponible || trinketBloque) {
      return;
    }
    onTerminer({
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
                <h3 className="mt-0 mb-0">{t('rareModal.title', { nom: membre.nom_perso })}</h3>
                <button className="btn btn--sm" aria-label={t('rareModal.close')} onClick={onClose}>
                  ✕
                </button>
              </div>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.25rem' }}>
                {t('rareModal.intro')}
              </p>
            </header>
            <div className="achat-equipement__contenu">
              <div className="field">
                <input
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder={t('rareModal.searchPlaceholder')}
                />
              </div>
              <div className="achat-equipement__catalogue">
                {itemsFiltres.length === 0 && <p className="text-muted">{t('rareModal.noMatch')}</p>}
                {itemsFiltres.map((candidat) => {
                  const niveau = niveauRarete(candidat);
                  const candidatAffiche = translateItem(candidat, language);
                  return (
                    <button
                      key={candidat.id}
                      type="button"
                      className="list-item achat-equipement__item"
                      onClick={() => choisir(candidat)}
                    >
                      <div className="list-item__main">
                        <div className="achat-equipement__item-titre">
                          <span className="list-item__title">{candidatAffiche.nom}</span>
                          <span className={`badge ${classeRarete(String(niveau)) ?? ''}`}>{t('rareModal.rareLevel', { n: niveau ?? 0 })}</span>
                        </div>
                        <div className="list-item__subtitle">
                          {libelleCategorie(candidat.categorie, language)} · {formatCoutItem(candidat.cout, language)}
                        </div>
                        {resumeItem(candidatAffiche, language) && (
                          <div className="list-item__subtitle" style={{ marginTop: '0.2rem' }}>
                            {resumeItem(candidatAffiche, language)}
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
                  {t('rareModal.backToCatalogue')}
                </button>
                <button className="btn btn--sm" aria-label={t('rareModal.close')} onClick={onClose}>
                  ✕
                </button>
              </div>
              <div className="achat-equipement__selection-titre">
                <h3 className="mt-0 mb-0">{itemAffiche!.nom}</h3>
                <span className={`badge ${classeRarete(String(rarete)) ?? ''}`}>{t('rareModal.rareLevel', { n: rarete ?? 0 })}</span>
              </div>
            </header>

            <div className="achat-equipement__contenu achat-equipement__detail">
              <p className="text-sm text-muted">{t('rareModal.succeedsOn', { n: rarete ?? 0 })}</p>
              {itemAffiche!.disponibilite && <p className="text-sm text-muted">{itemAffiche!.disponibilite}</p>}
              {resumeItem(itemAffiche!, language) && <p className="text-sm">{resumeItem(itemAffiche!, language)}</p>}

              {!succesDeclare && (
                <div className="flex gap-sm" style={{ marginTop: '0.4rem' }}>
                  <button type="button" className="btn btn--primary" onClick={declarerSucces}>
                    {t('rareModal.success')}
                  </button>
                  <button type="button" className="btn" onClick={enregistrerEchec}>
                    {t('rareModal.failure')}
                  </button>
                </div>
              )}

              {succesDeclare && (
                <>
                  <div className="field">
                    <label>
                      {t('rareModal.costPaidLabel')}
                      {!item.cout_fixe && <span className="text-muted">{t('rareModal.notationSuffix', { notation: item.cout })}</span>}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={coutSaisi}
                      onChange={(e) => setCoutSaisi(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted">{t('rareModal.treasuryAvailable', { n: tresorerieDisponible })}</p>
                  {coutValide && cout > tresorerieDisponible && (
                    <p className="text-sm text-danger">{t('rareModal.insufficientTreasury')}</p>
                  )}
                  {trinketBloque && (
                    <p className="text-sm text-danger">{t('rareModal.trinketLimitReached')}</p>
                  )}
                </>
              )}
            </div>

            <footer className="achat-equipement__actions">
              <button className="btn" onClick={onClose}>{t('rareModal.cancel')}</button>
              {succesDeclare && (
                <>
                  <button className="btn" onClick={neePasAcheter}>
                    {t('rareModal.dontBuy')}
                  </button>
                  <button
                    className="btn btn--primary"
                    disabled={!coutValide || cout > tresorerieDisponible || trinketBloque}
                    onClick={acheter}
                  >
                    {t('rareModal.buyAndFinish')}
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
