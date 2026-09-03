import { useMemo, useState } from 'react';
import type { Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveProfil } from '../../utils/profil';
import { getItem } from '../../data/items';
import {
  basesPourMateriau,
  CATEGORIE_ORDRE,
  classeRarete,
  construireObjetMateriau,
  creerEntreeInventaire,
  estItemMateriau,
  formatCoutItem,
  getShopCommun,
  iconeCategorie,
  inventaireComplet,
  libelleCategorie,
  MATERIAUX,
  resumeItem,
  TRINKETS_LIMITES,
  ITEMS_UNIQUES_BANDE,
  type ShopItem,
} from '../../utils/shop';
import { useGameRules } from '../../state/useGameRules';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
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
  const [categorieFiltre, setCategorieFiltre] = useState<string | null>(null);
  const [itemId, setItemId] = useState('');
  const [succesDeclare, setSuccesDeclare] = useState(false);
  const [coutSaisi, setCoutSaisi] = useState('');
  // "Lors de la recherche d'une armure du Chaos, un guerrier gagne +1 sur le
  // résultat de son jet de recherche pour chaque ennemi qu'il a mis hors de
  // combat lors de la bataille précédente." (armures.json, "Rareté" de
  // l'Armure du Chaos) — donnée que l'app ne trace nulle part (pas de suivi
  // par figurine des ennemis mis hors de combat en bataille), donc saisie
  // manuelle ponctuelle au moment de la recherche, comme le coût ci-dessus.
  const [ennemisHorsDeCombatSaisie, setEnnemisHorsDeCombatSaisie] = useState('');
  // Objet "matériau" (gromril/ithilmar/obsidienne) trouvé : demande de
  // choisir une arme/armure de base existante avant de connaître le prix
  // final (voir basesPourMateriau/construireObjetMateriau dans utils/shop.ts,
  // même mécanique que dans AchatEquipementModal — voir tâche #208).
  const [baseMateriauId, setBaseMateriauId] = useState('');
  const [rechercheMateriau, setRechercheMateriau] = useState('');
  const [coutBaseSaisi, setCoutBaseSaisi] = useState('');

  const profil = useMemo(() => resolveProfil(roster, membre, catalogue, language) ?? null, [roster, membre, catalogue, language]);

  const items = useMemo(() => {
    const candidats = getShopCommun(catalogue.id, rules, profil, membre.competences_acquises, catalogue);
    const uniques = new Map<string, ShopItem>();
    for (const item of candidats) {
      if (niveauRarete(item) === null || uniques.has(item.id)) continue;
      uniques.set(item.id, item);
    }
    return [...uniques.values()].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  }, [catalogue, rules, profil, membre.competences_acquises]);

  // Liste complète (non filtrée par rareté) pour proposer les bases d'un
  // objet matériau : une arme de base courante n'a elle-même aucune rareté.
  const itemsCommunTous = useMemo(
    () => getShopCommun(catalogue.id, rules, profil, membre.competences_acquises, catalogue),
    [catalogue, rules, profil, membre.competences_acquises]
  );

  const categoriesDisponibles = useMemo(() => {
    const presentes = new Set(items.map((i) => i.categorie));
    return CATEGORIE_ORDRE.filter((c) => presentes.has(c));
  }, [items]);

  const q = recherche.trim().toLocaleLowerCase('fr');
  const itemsFiltresParCategorie = categorieFiltre ? items.filter((i) => i.categorie === categorieFiltre) : items;
  const itemsFiltres = q
    ? itemsFiltresParCategorie.filter((item) => item.nom.toLocaleLowerCase('fr').includes(q))
    : itemsFiltresParCategorie;
  const item = items.find((candidat) => candidat.id === itemId) ?? null;
  const itemAffiche = item ? translateItem(item, language) : null;
  const rarete = item ? niveauRarete(item) : null;
  // "The Gunnery School may always use the cheaper price of black powder
  // weapons in their list, and gain a +2 bonus when rolling for rarity to
  // find a black powder weapon, as no one seems to worry about selling
  // faulty weapons!" (Artilleurs de Nuln [GLM].pdf p.1, "Entretien
  // impeccable") — +2 au jet du joueur équivaut à afficher un seuil de
  // réussite 2 points plus bas ; ce seuil n'est jamais simulé par l'app
  // (le joueur lance le dé lui-même sur table), donc seul l'affichage du
  // seuil annoncé doit refléter le bonus. Le badge Rare N ci-dessous reste
  // sur la vraie rareté (classeRarete/rareModal.rareLevel) : c'est
  // toujours objectivement le même objet rare, seule la facilité à le
  // trouver change pour cette bande.
  const bonusRaretePoudreNoire =
    catalogue.id === 'artilleurs_de_nuln' && item && getItem(item.id)?.categorie === 'armes_poudre_noire' ? 2 : 0;
  // "Du fait qu'elles sont en contact avec les guildes de marchands de
  // Marienburg, les bandes reçoivent un bonus de +1 lors des acquisitions
  // d'objets rares." (Mercenaires Marienburgers, Middenheimers et
  // Reiklanders [GW].pdf p.1, "Bonus Rare +1") — contrairement au bonus
  // ciblé des Artilleurs de Nuln (poudre noire uniquement), celui-ci
  // s'applique à toute catégorie d'objet rare.
  const bonusRareteMarienburgers = catalogue.id === 'marienburgers' ? 1 : 0;
  // "Clients Difficiles : Les Héros Ogres subissent un malus de -1 lors des
  // jets pour trouver des objets Rares non exclusivement réservés aux
  // Ogres." (Mangeurs d'Hommes / Border Town Burning) — les objets propres
  // à la bande (Gourdin d'Ogre, Poing de fer, Lance-harpon, Gnoblars...) ont
  // tous `acces: ["maneaters"]` exclusivement ; tout autre objet Rare (y
  // compris un objet partagé avec une autre bande, comme le Mortier
  // portable des Artilleurs de Nuln) subit le malus.
  const itemAccesRare = item ? (getItem(item.id)?.acces ?? []) : [];
  const itemExclusifOgre = itemAccesRare.length > 0 && itemAccesRare.every((a) => a === 'maneaters');
  const malusRareteClientsDifficiles =
    catalogue.id === 'maneaters' && profil?.type === 'heros' && item && !itemExclusifOgre ? 1 : 0;
  // "Pilleurs : ... ils gagnent un +1 à leurs jets de rareté lors de la
  // recherche d'objets rares." (Maraudeurs du Chaos [GLM].pdf p.9, "Les
  // Norses") — s'applique à toute catégorie, comme le bonus Marienburgers.
  const bonusRareteNorses = catalogue.id === 'maraudeurs_du_chaos' && roster.tribu === 'norses' ? 1 : 0;
  // "Clients Difficiles : ... une Bande Kurgan subit un malus de -1 sur les
  // jets pour trouver des articles rares, à l'exception de Grandes Haches et
  // de Fouets Barbelés." (Maraudeurs du Chaos [GLM].pdf p.9, "Les Kurgans")
  const malusRareteKurgans =
    catalogue.id === 'maraudeurs_du_chaos' &&
    roster.tribu === 'kurgans' &&
    item &&
    item.id !== 'grande_hache_du_chaos' &&
    item.id !== 'fouet_barbele'
      ? 1
      : 0;
  const bonusRareteArmureDuChaos =
    item?.id === 'armure_du_chaos_market' ? Math.max(0, Number(ennemisHorsDeCombatSaisie) || 0) : 0;
  const rareteEffective =
    rarete !== null
      ? Math.max(
          2,
          rarete -
            bonusRaretePoudreNoire -
            bonusRareteMarienburgers -
            bonusRareteNorses -
            bonusRareteArmureDuChaos +
            malusRareteClientsDifficiles +
            malusRareteKurgans
        )
      : null;
  const cout = Number(coutSaisi);
  const coutValide = coutSaisi.trim() !== '' && Number.isFinite(cout) && cout >= 0;
  const inventaireBande = [...inventaireComplet(roster), ...inventaireSupplementaire];
  const trinketBloque =
    !!item &&
    ((rules.trinketsLimites && TRINKETS_LIMITES.has(item.id)) || ITEMS_UNIQUES_BANDE.has(item.id)) &&
    inventaireBande.some((entree) => entree.item_id === item.id);

  const materiauSelectionne = item && estItemMateriau(item.id) ? item : undefined;
  const basesMateriau = materiauSelectionne ? basesPourMateriau(itemsCommunTous, materiauSelectionne.id) : [];
  const baseMateriauChoisie = basesMateriau.find((b) => b.id === baseMateriauId) ?? null;
  const baseMateriauFiltrees = rechercheMateriau.trim()
    ? basesMateriau.filter((b) => b.nom.toLowerCase().includes(rechercheMateriau.trim().toLowerCase()))
    : basesMateriau;
  const coutBase = Number(coutBaseSaisi);
  const coutBaseValide = coutBaseSaisi.trim() !== '' && Number.isFinite(coutBase) && coutBase >= 0;
  const objetMateriauCombine =
    materiauSelectionne && baseMateriauChoisie && coutBaseValide
      ? construireObjetMateriau(baseMateriauChoisie, materiauSelectionne, coutBase)
      : undefined;
  const coutFinal = objetMateriauCombine ? (objetMateriauCombine.cout as number) : cout;
  const coutFinalValide = materiauSelectionne ? !!objetMateriauCombine : coutValide;

  const choisir = (choisi: ShopItem) => {
    setItemId(choisi.id);
    setSuccesDeclare(false);
    setCoutSaisi('');
    setBaseMateriauId('');
    setRechercheMateriau('');
    setCoutBaseSaisi('');
    setEnnemisHorsDeCombatSaisie('');
  };

  const choisirBaseMateriau = (base: ShopItem) => {
    setBaseMateriauId(base.id);
    setCoutBaseSaisi(base.cout_fixe && typeof base.cout === 'number' ? String(base.cout) : '');
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
      // "Le coût d'une armure du Chaos est réduit d'1 CO pour chaque point
      // d'expérience possédé par le Héros." (armures.json, "Coût" de
      // l'Armure du Chaos) — même mécanique pour l'Exosquelette (Nains du
      // Chaos, "Coût").
      const reduction = item.id === 'armure_du_chaos_market' || item.id === 'exosquelette' ? membre.xp : 0;
      setCoutSaisi(String(Math.max(0, item.cout - reduction)));
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
    if (!item || rarete === null || !coutFinalValide || coutFinal > tresorerieDisponible || trinketBloque) {
      return;
    }
    const objetAchete = objetMateriauCombine ?? item;
    onTerminer({
      rarete,
      objetNom: objetAchete.nom,
      reussi: true,
      achat: creerEntreeInventaire(objetAchete, coutFinal),
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
                  <Icon name="croixPack" />
                </button>
              </div>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.25rem' }}>
                {t('rareModal.intro')}
              </p>
            </header>
            <div className="achat-equipement__contenu">
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
                <button className="btn--pack-pill-sm" onClick={() => setItemId('')}>
                  {t('rareModal.backToCatalogue')}
                </button>
                <button className="btn btn--sm" aria-label={t('rareModal.close')} onClick={onClose}>
                  <Icon name="croixPack" />
                </button>
              </div>
              <div className="achat-equipement__selection-titre">
                <h3 className="mt-0 mb-0">{itemAffiche!.nom}</h3>
                <span className={`badge ${classeRarete(String(rarete)) ?? ''}`}>{t('rareModal.rareLevel', { n: rarete ?? 0 })}</span>
              </div>
            </header>

            <div className="achat-equipement__contenu achat-equipement__detail">
              <p className="text-sm text-muted">{t('rareModal.succeedsOn', { n: rareteEffective ?? 0 })}</p>
              {bonusRaretePoudreNoire > 0 && (
                <p className="text-sm text-muted">{t('rareModal.blackPowderBonus', { n: bonusRaretePoudreNoire })}</p>
              )}
              {bonusRareteMarienburgers > 0 && (
                <p className="text-sm text-muted">{t('rareModal.marienburgersBonus', { n: bonusRareteMarienburgers })}</p>
              )}
              {malusRareteClientsDifficiles > 0 && (
                <p className="text-sm text-muted">{t('rareModal.maneatersMalus', { n: malusRareteClientsDifficiles })}</p>
              )}
              {bonusRareteNorses > 0 && (
                <p className="text-sm text-muted">{t('rareModal.norsesBonus', { n: bonusRareteNorses })}</p>
              )}
              {malusRareteKurgans > 0 && (
                <p className="text-sm text-muted">{t('rareModal.kurgansMalus', { n: malusRareteKurgans })}</p>
              )}
              {item?.id === 'armure_du_chaos_market' && !succesDeclare && (
                <div className="field">
                  <label>{t('rareModal.chaosArmourEnemiesLabel')}</label>
                  <input
                    type="number"
                    min={0}
                    value={ennemisHorsDeCombatSaisie}
                    onChange={(e) => setEnnemisHorsDeCombatSaisie(e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}
              {itemAffiche!.disponibilite && <p className="text-sm text-muted">{itemAffiche!.disponibilite}</p>}
              {resumeItem(itemAffiche!, language) && <p className="text-sm">{resumeItem(itemAffiche!, language)}</p>}

              {!succesDeclare && (
                <div className="flex gap-sm" style={{ marginTop: '0.4rem' }}>
                  <button type="button" className="btn--pack-pill-sm btn--pack-pill-sm--primary" onClick={declarerSucces}>
                    {t('rareModal.success')}
                  </button>
                  <button type="button" className="btn--pack-pill-sm" onClick={enregistrerEchec}>
                    {t('rareModal.failure')}
                  </button>
                </div>
              )}

              {succesDeclare && materiauSelectionne && !baseMateriauChoisie && (
                <>
                  <p className="text-sm text-muted">{t('achatEquipement.chooseBaseNote')}</p>
                  <div className="field">
                    <input
                      value={rechercheMateriau}
                      onChange={(e) => setRechercheMateriau(e.target.value)}
                      placeholder={t('achatEquipement.searchBasePlaceholder')}
                    />
                  </div>
                  <div className="achat-equipement__catalogue">
                    {baseMateriauFiltrees.length === 0 && (
                      <p className="text-muted text-sm">{t('achatEquipement.noBaseAvailable')}</p>
                    )}
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
                </>
              )}

              {succesDeclare && materiauSelectionne && baseMateriauChoisie && (
                <>
                  <div className="achat-equipement__header-ligne" style={{ marginTop: '0.4rem' }}>
                    <span className="list-item__title">
                      {baseMateriauChoisie.nom} ({materiauSelectionne.nom.replace(/^Arme en |^Armure en /, '')})
                    </span>
                    <button className="btn--pack-pill-sm" onClick={() => setBaseMateriauId('')}>
                      {t('achatEquipement.chooseOtherBase')}
                    </button>
                  </div>
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
                    </p>
                  )}
                  <p className="text-sm text-muted">{t('rareModal.treasuryAvailable', { n: tresorerieDisponible })}</p>
                  {coutBaseValide && coutFinal > tresorerieDisponible && (
                    <p className="text-sm text-danger">{t('rareModal.insufficientTreasury')}</p>
                  )}
                </>
              )}

              {succesDeclare && !materiauSelectionne && (
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
              <button className="btn--pack-pill-sm" onClick={onClose}>{t('rareModal.cancel')}</button>
              {succesDeclare && (
                <>
                  <button className="btn--pack-pill-sm" onClick={neePasAcheter}>
                    {t('rareModal.dontBuy')}
                  </button>
                  <button
                    className="btn--pack-pill-sm btn--pack-pill-sm--primary"
                    disabled={!coutFinalValide || coutFinal > tresorerieDisponible || trinketBloque}
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
