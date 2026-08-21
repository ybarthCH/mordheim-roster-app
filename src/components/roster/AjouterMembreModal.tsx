import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../common/Icon';
import type { Member, RosterInstance } from '../../types/roster';
import { STAT_KEYS } from '../../types/catalog';
import { getCatalogue } from '../../data/warbands';
import { translateWarbandCatalog } from '../../i18n/data/warbands';
import { peutAjouterMembre } from '../../utils/validation';
import { creerMembre } from '../../utils/factory';
import {
  appliquerAchatSurMembre,
  calculerCoutRejoindreGroupe,
  creerEntreesInventaire,
  equipementInclusDepart,
  formatCoutProfil,
  formatCoutItem,
  inventaireComplet,
  profilPeutAcheterEquipement,
  rejoindreGroupe,
  TRINKETS_LIMITES,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { translateItem } from '../../i18n/data/items';
import { estSorcier, resolveSort, sortsDisponiblesPourRoster } from '../../utils/magie';
import { magieMineure } from '../../i18n/data/minorMagic';
import { equitationGratuitePourTribu, SKILL_EQUITATION } from '../../utils/tribu';
import { peutGagnerExperience } from '../../utils/xp';
import { libelleCaracteristique } from '../../utils/stats';
import { Modal } from '../common/Modal';
import { AchatEquipementContenu } from '../personnage/AchatEquipementModal';
import { useGameRules } from '../../state/useGameRules';
import { useLanguage } from '../../state/useLanguage';

const FRANC_TIREUR = '__franc_tireur__';

type Props = {
  roster: RosterInstance;
  onClose: () => void;
  onUpdateRoster: (roster: RosterInstance) => void;
};

export function AjouterMembreModal({ roster, onClose, onUpdateRoster }: Props) {
  const navigate = useNavigate();
  const { rules } = useGameRules();
  const { t, language } = useLanguage();
  const catalogueBrut = getCatalogue(roster.bande_id);
  // Memoïsé : translateWarbandCatalog reconstruit tout le catalogue à
  // chaque appel, et cette modale re-rend à chaque frappe (recherche de
  // sort, quantité, nom du personnage...).
  const catalogue = useMemo(
    () => (catalogueBrut ? translateWarbandCatalog(catalogueBrut, language) : catalogueBrut),
    [catalogueBrut, language]
  );
  const [profilId, setProfilId] = useState('');
  const [nomPerso, setNomPerso] = useState('');
  // Saisie gardée en texte brut (pas en number) : un input contrôlé par un
  // number forcerait la valeur dès l'effacement (impossible de vider le
  // champ pour retaper un chiffre) — la conversion/le plancher ne s'applique
  // qu'à l'usage (voir quantite ci-dessous).
  const [quantiteSaisie, setQuantiteSaisie] = useState('1');
  // Une fois la recrue créée, on affiche son équipement à acheter dans cette
  // même fenêtre modale (fiche + shop intégré, pas un second écran) — null
  // tant que le formulaire de recrutement est actif.
  const [membreRecrute, setMembreRecrute] = useState<Member | null>(null);
  // Objets choisis pendant cette session d'achat, pas encore payés : permet
  // d'en sélectionner plusieurs d'affilée avant de les appliquer tous en une
  // fois au clic sur Terminer (voir panierTotal/appliquerPanier plus bas),
  // plutôt que de déduire la trésorerie item par item.
  const [panier, setPanier] = useState<{ item: ShopItem; coutPaye: number }[]>([]);
  const [groupeCibleId, setGroupeCibleId] = useState<string | null>(null);
  // Coût saisi à la main quand le profil n'a pas de prix fixe (ex : chien de
  // guerre, "25+2D6") — jet à faire sur table papier, comme pour un objet.
  const [coutManuelSaisi, setCoutManuelSaisi] = useState('');
  // Sort(s) connu(s) choisis librement au recrutement, obligatoires pour un
  // profil sorcier — un seul par défaut, davantage si le profil le précise
  // (ex : la Liche des Morts Sans Repos, voir Profile.nombre_sorts_choisis_depart).
  const [sortsChoisis, setSortsChoisis] = useState<string[]>([]);
  // Marque choisie au recrutement pour les profils à `marque_requise` (ex :
  // le Devin des Maraudeurs du Chaos) — détermine le domaine de sorts
  // proposé ensuite (voir utils/magie.ts).
  const [marqueChoisie, setMarqueChoisie] = useState('');

  const profilsHeros = catalogue?.profils.filter((p) => p.type === 'heros') ?? [];
  // Les profils "animal" (chien de guerre...) se recrutent et se suivent
  // comme un groupe d'hommes de main (voir estGroupable plus bas) : classés
  // dans le même optgroup pour ne pas les faire ressembler à un objet à part.
  const profilsHommesDeMain = catalogue?.profils.filter((p) => p.type === 'homme_de_main' || p.type === 'animal') ?? [];

  const profil = catalogue?.profils.find((p) => p.id === profilId);
  const estGroupable = profil?.type === 'homme_de_main' || profil?.type === 'animal';
  // Un profil "animal" ne gagne jamais d'expérience (voir utils/xp.ts) : lui
  // demander une expérience de départ n'aurait aucun sens.
  const gagneExperience = peutGagnerExperience(profil);
  const marqueRequise = !!profil?.marque_requise;
  const marqueChoisieValide = !marqueRequise || marqueChoisie !== '';
  const estSorcierProfil = !!profil && estSorcier(catalogue, profil.id, marqueChoisie || undefined);
  const sortsPossibles = sortsDisponiblesPourRoster(
    catalogue,
    roster,
    [],
    profil,
    marqueChoisie || undefined,
    magieMineure(language)
  );
  const nombreSortsRequis = profil?.nombre_sorts_choisis_depart ?? 1;
  const sortsChoisisValides =
    sortsChoisis.length === nombreSortsRequis && sortsChoisis.every((s) => s !== '');
  const xpDepart = profil?.xp_depart ?? 0;
  const quantite = Math.max(1, parseInt(quantiteSaisie, 10) || 1);
  const coutManuelRequis = !!profil && profil.cout === null;
  const coutManuelValide =
    !coutManuelRequis || (coutManuelSaisi.trim() !== '' && !Number.isNaN(Number(coutManuelSaisi)) && Number(coutManuelSaisi) >= 0);

  // Groupes déjà existants pour ce profil (hors morts) : recruter peut soit
  // former un nouveau groupe, soit rejoindre l'un d'eux (au prix d'une
  // surtaxe liée à l'XP déjà acquise par le groupe — voir plus bas).
  const groupesExistants = estGroupable
    ? roster.membres.filter((m) => m.profil_id === profilId && m.statut !== 'mort' && !m.promu_heros)
    : [];
  const groupeCible = groupeCibleId ? (groupesExistants.find((m) => m.instance_id === groupeCibleId) ?? null) : null;
  // Le choix de la Marque (s'il y en a un) doit être fait avant de proposer
  // un premier sort : le domaine de sorts en dépend, et certaines Marques
  // (ex : Arkhar) retirent tout accès aux sorts.
  const premierSortRequis = estSorcierProfil && !groupeCible && marqueChoisieValide;

  const check = profilId ? peutAjouterMembre(roster, profilId, quantite) : { ok: false };
  const coutUnitaire = profil?.cout ?? (coutManuelRequis ? Number(coutManuelSaisi) || 0 : 0);
  const coutRejoindre = groupeCible ? calculerCoutRejoindreGroupe(groupeCible, coutUnitaire, quantite) : null;
  const coutTotal = coutRejoindre ? coutRejoindre.coutTotal : coutUnitaire * quantite;
  const budgetSuffisant = coutTotal <= roster.tresorerie;
  const dupliqueraitTrinket =
    !!groupeCible &&
    rules.trinketsLimites &&
    groupeCible.inventaire.some((entree) => TRINKETS_LIMITES.has(entree.item_id));

  const choisirProfil = (value: string) => {
    if (value === FRANC_TIREUR) {
      onClose();
      navigate(`/roster/${roster.id}/recruter-franc-tireur`);
      return;
    }
    setProfilId(value);
    const p = catalogue?.profils.find((pr) => pr.id === value);
    setQuantiteSaisie('1');
    setGroupeCibleId(null);
    setCoutManuelSaisi('');
    setSortsChoisis(Array(p?.nombre_sorts_choisis_depart ?? 1).fill(''));
    setMarqueChoisie('');
  };

  const confirmer = () => {
    if (!profil || !check.ok || !coutManuelValide || dupliqueraitTrinket) return;
    if (marqueRequise && !marqueChoisie) return;
    if (premierSortRequis && !sortsChoisisValides) return;

    if (groupeCible) {
      // Rejoint un groupe existant : la figurine hérite immédiatement de
      // l'XP et de l'équipement du groupe (payé séparément ci-dessus), pas
      // d'XP de départ propre. Son équipement est forcément identique au
      // reste du groupe : pas d'étape achat séparée à proposer ensuite.
      onUpdateRoster(
        rejoindreGroupe(roster, groupeCible, quantite, coutTotal, coutManuelRequis ? coutUnitaire : undefined)
      );
      onClose();
      return;
    }

    const membre = creerMembre(profil, xpDepart, quantite);
    membre.inventaire = [...membre.inventaire, ...equipementInclusDepart(catalogue?.id ?? '', profil.id)];
    if (coutManuelRequis) membre.cout_recrutement = coutUnitaire;
    if (nomPerso.trim()) membre.nom_perso = nomPerso.trim();
    if (marqueRequise && marqueChoisie) membre.marque = marqueChoisie;
    if (premierSortRequis && sortsChoisisValides) {
      membre.sorts_connus = [...(profil.sorts_fixes_depart ?? []), ...sortsChoisis];
    }
    if (profil.type === 'heros' && equitationGratuitePourTribu(catalogue, roster)) {
      membre.competences_acquises = [...membre.competences_acquises, SKILL_EQUITATION];
    }
    onUpdateRoster({
      ...roster,
      tresorerie: roster.tresorerie - coutTotal,
      membres: [...roster.membres, membre],
    });

    // On ne propose l'étape équipement que si ce profil peut effectivement
    // acheter quelque chose (les animaux, par ex., n'ont jamais d'équipement
    // personnel) — sinon la recrue est prête, inutile de le demander.
    if (catalogue && profilPeutAcheterEquipement(catalogue, profil)) {
      setMembreRecrute(membre);
    } else {
      onClose();
    }
  };

  if (membreRecrute) {
    // Toujours relire le membre à jour dans le roster (son XP/statut a pu
    // changer entre-temps ailleurs), mais son inventaire n'est modifié
    // qu'au moment de Terminer — voir panier ci-dessous.
    const membreActuel = roster.membres.find((m) => m.instance_id === membreRecrute.instance_id) ?? membreRecrute;
    const tailleGroupeActuelle = membreActuel.taille_groupe || 1;
    const panierTotal = panier.reduce((somme, p) => somme + p.coutPaye * tailleGroupeActuelle, 0);
    const tresorerieProjetee = roster.tresorerie - panierTotal;
    // Vue "et si" de l'inventaire incluant le panier pas encore payé : sans
    // ça, le shop ne verrait pas un objet déjà mis dans le panier (ex :
    // proposerait une 2e dague comme "gratuite" au lieu de la 1re).
    const inventairePanier = panier.flatMap(({ item, coutPaye }) =>
      creerEntreesInventaire(item, coutPaye, tailleGroupeActuelle)
    );

    const terminer = () => {
      if (tresorerieProjetee < 0) return;
      let rosterCourant = roster;
      for (const { item, coutPaye } of panier) {
        const membreCourant =
          rosterCourant.membres.find((m) => m.instance_id === membreActuel.instance_id) ?? membreActuel;
        rosterCourant = appliquerAchatSurMembre(rosterCourant, membreCourant, item, coutPaye);
      }
      if (panier.length > 0) onUpdateRoster(rosterCourant);
      onClose();
    };

    return (
      <Modal onClose={onClose} variant="fullscreen">
        <div style={{ padding: '0.9rem 0.9rem 0' }}>
          <h3 className="mt-0">{t('recrutementEquipement.title', { nom: membreActuel.nom_perso })}</h3>
          {profil?.stats && (
            <div className="stat-grid" style={{ marginBottom: '0.6rem' }}>
              {STAT_KEYS.map((k) => (
                <div key={k} className="stat-grid__cell stat-grid__cell--label">
                  {libelleCaracteristique(k, language)}
                </div>
              ))}
              {STAT_KEYS.map((k) => (
                <div key={k} className="stat-grid__cell stat-grid__cell--value">
                  {profil.stats![k]}
                </div>
              ))}
            </div>
          )}
          {profil?.regles_speciales?.map((r) => (
            <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>{r.nom}</strong> — {r.texte}
            </p>
          ))}
          <div className="card card--tight" style={{ margin: '0.7rem 0' }}>
            <p className="text-sm mb-0">
              <strong>{t('recrutementEquipement.selectedEquipment')}</strong>
            </p>
            {panier.length === 0 ? (
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                {t('recrutementEquipement.noSelectionYet')}
              </p>
            ) : (
              panier.map((p, i) => (
                <div
                  key={`${p.item.id}-${i}`}
                  className="flex items-center justify-between"
                  style={{ marginTop: '0.3rem' }}
                >
                  <span className="text-sm">
                    {tailleGroupeActuelle > 1 ? `${tailleGroupeActuelle}× ` : ''}
                    {translateItem(p.item, language).nom}
                  </span>
                  <span className="flex items-center gap-sm">
                    <span className="text-sm text-muted">
                      {tailleGroupeActuelle > 1
                        ? `${formatCoutItem(p.coutPaye, language)} × ${tailleGroupeActuelle} = ${formatCoutItem(p.coutPaye * tailleGroupeActuelle, language)}`
                        : formatCoutItem(p.coutPaye, language)}
                    </span>
                    <button
                      className="btn--ghost-danger"
                      style={{ padding: '0.1rem 0.35rem' }}
                      onClick={() => setPanier((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label={t('recrutementEquipement.removeItem')}
                    >
                      <Icon name="croixPack" />
                    </button>
                  </span>
                </div>
              ))
            )}
            <p className="text-sm mb-0" style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.4rem' }}>
              {t('recrutementEquipement.treasury')} {roster.tresorerie} {t('creation.gc')}
              {panier.length > 0 && (
                <>
                  {' '}
                  · {t('recrutementEquipement.equipmentCost')} {panierTotal} {t('creation.gc')} ·{' '}
                  <span className={tresorerieProjetee < 0 ? 'text-danger' : ''}>
                    {t('recrutementEquipement.remaining')} {tresorerieProjetee} {t('creation.gc')}
                  </span>
                </>
              )}
            </p>
            {tresorerieProjetee < 0 && (
              <p className="text-danger text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                {t('recrutementEquipement.insufficientTreasury')}
              </p>
            )}
          </div>
          {/* Annuler/Terminer juste après le résumé plutôt qu'en pied de
              fenêtre après tout le catalogue d'équipement (position d'origine)
              : sur un catalogue long, valider obligeait à défiler jusqu'en bas
              en passant par toute la liste d'objets à chaque fois.
              .btn/.btn--primary (cadre plein, plus grand) plutôt que
              .btn--pack-pill-sm comme le reste de cet écran : ce sont les
              actions principales de toute la fenêtre, mais la pilule peinte
              les faisait se fondre parmi les nombreux autres boutons pilule
              du shop juste en dessous (onglets Bande/Commun, catégories,
              Personnalisé...). flex:1 pour qu'elles occupent toute la
              largeur de la rangée, comme une vraie barre d'action. */}
          <div className="flex gap-sm" style={{ marginBottom: '0.9rem' }}>
            <button className="btn" style={{ flex: 1 }} onClick={onClose}>
              {t('achatEquipement.cancel')}
            </button>
            <button
              className="btn btn--primary"
              style={{ flex: 1 }}
              disabled={tresorerieProjetee < 0}
              onClick={terminer}
            >
              {t('recrutementEquipement.finish')}
            </button>
          </div>
        </div>
        {catalogue && (
          <AchatEquipementContenu
            catalogue={catalogue}
            profil={profil ?? null}
            tresorerie={tresorerieProjetee}
            competencesAcquises={membreActuel.competences_acquises}
            marqueId={membreActuel.marque}
            inventaireActuel={[...membreActuel.inventaire, ...inventairePanier]}
            inventaireBande={[...inventaireComplet(roster), ...inventairePanier]}
            roster={roster}
            tailleGroupe={tailleGroupeActuelle}
            objetsPersonnalises={roster.objets_personnalises}
            objetsSurcharges={roster.objets_surcharges}
            onObjetsPersonnalisesChange={(objets) => onUpdateRoster({ ...roster, objets_personnalises: objets })}
            onObjetsSurchargesChange={(surcharges) => onUpdateRoster({ ...roster, objets_surcharges: surcharges })}
            resterOuvertApresAchat
            masquerBoutonFermer
            onClose={onClose}
            onAchat={(item, coutPaye) => setPanier((prev) => [...prev, { item, coutPaye }])}
          />
        )}
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h3>{t('ajouterMembre.title')}</h3>
      <div className="field">
        <label>{t('ajouterMembre.profile')}</label>
        <select value={profilId} onChange={(e) => choisirProfil(e.target.value)}>
          <option value="">{t('ajouterMembre.choose')}</option>
          {profilsHeros.length > 0 && (
            <optgroup label={t('ajouterMembre.heroes')}>
              {profilsHeros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({formatCoutProfil(p.cout, p.cout_notation, language)})
                </option>
              ))}
            </optgroup>
          )}
          {profilsHommesDeMain.length > 0 && (
            <optgroup label={t('ajouterMembre.henchmen')}>
              {profilsHommesDeMain.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({formatCoutProfil(p.cout, p.cout_notation, language)})
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label={t('ajouterMembre.other')}>
            <option value={FRANC_TIREUR}>{t('ajouterMembre.hiredSword')}</option>
          </optgroup>
        </select>
      </div>
      {profil && (
        <>
          <h4 style={{ marginBottom: '0.2rem' }}>
            {profil.nom}
            {gagneExperience && !groupeCible ? ` — ${t('creation.modal.startingXpSuffix', { xp: xpDepart })}` : ''}
          </h4>
          {!gagneExperience && (
            <p className="text-sm text-muted" style={{ marginTop: '-0.3rem' }}>
              {t('creation.modal.notCombatant')}
            </p>
          )}
          {profil.stats && (
            <div className="stat-grid" style={{ marginBottom: '0.6rem' }}>
              {STAT_KEYS.map((k) => (
                <div key={k} className="stat-grid__cell stat-grid__cell--label">
                  {libelleCaracteristique(k, language)}
                </div>
              ))}
              {STAT_KEYS.map((k) => (
                <div key={k} className="stat-grid__cell stat-grid__cell--value">
                  {profil.stats![k]}
                </div>
              ))}
            </div>
          )}
          {profil.regles_speciales?.map((r) => (
            <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>{r.nom}</strong> — {r.texte}
            </p>
          ))}
          {profil.rarete && (
            <p className="text-sm text-danger">
              <Icon name="cadenasPack" style={{ marginRight: '0.3em' }} />
              Rare {profil.rarete} : {t('creation.modal.rareWarning')}
            </p>
          )}
          {coutManuelRequis && (
            <div className="field">
              <label>
                {t('creation.modal.costLabel')}{' '}
                {profil.cout_notation && (
                  <span className="text-muted">
                    {t('creation.modal.costNotation')} {profil.cout_notation}
                  </span>
                )}
              </label>
              <input
                type="number"
                min={0}
                value={coutManuelSaisi}
                onChange={(e) => setCoutManuelSaisi(e.target.value)}
                placeholder={profil.cout_notation ? t('creation.modal.costPlaceholder') : undefined}
              />
            </div>
          )}
          {groupesExistants.length > 0 && (
            <div className="field">
              <label>{t('ajouterMembre.group')}</label>
              <select
                value={groupeCibleId ?? ''}
                onChange={(e) => {
                  setGroupeCibleId(e.target.value || null);
                  setQuantiteSaisie('1');
                }}
              >
                <option value="">{t('ajouterMembre.newGroup')}</option>
                {groupesExistants.map((g) => (
                  <option key={g.instance_id} value={g.instance_id}>
                    {t('ajouterMembre.joinGroupPrefix')} « {g.nom_perso} » (×{g.taille_groupe}, {g.xp} XP)
                  </option>
                ))}
              </select>
            </div>
          )}
          {!groupeCible && (
            <div className="field">
              <label>
                {t('creation.modal.charNameLabel')}
                {estGroupable && quantite > 1 ? t('creation.modal.charNameGroupSuffix') : ''}
              </label>
              <input value={nomPerso} onChange={(e) => setNomPerso(e.target.value)} placeholder={profil.nom} maxLength={20} />
            </div>
          )}
          {marqueRequise && !groupeCible && (
            <div className="field">
              <label>{t('creation.modal.markLabel')}</label>
              <select
                value={marqueChoisie}
                onChange={(e) => {
                  setMarqueChoisie(e.target.value);
                  setSortsChoisis(Array(profil.nombre_sorts_choisis_depart ?? 1).fill(''));
                }}
              >
                <option value="">{t('creation.modal.choose')}</option>
                {catalogue?.marques?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nom}
                  </option>
                ))}
              </select>
              {marqueChoisie && catalogue?.marques?.find((m) => m.id === marqueChoisie)?.texte && (
                <p className="text-sm text-muted mb-0">
                  {catalogue.marques.find((m) => m.id === marqueChoisie)?.texte}
                </p>
              )}
            </div>
          )}
          {premierSortRequis && profil.sorts_fixes_depart && profil.sorts_fixes_depart.length > 0 && (
            <p className="text-sm text-muted">
              {t('creation.modal.knowsAutomatically')}{' '}
              <strong>
                {profil.sorts_fixes_depart
                  .map(
                    (id) =>
                      resolveSort(catalogue, id, profil, marqueChoisie || undefined, magieMineure(language))?.nom ??
                      id
                  )
                  .join(', ')}
              </strong>
              .
            </p>
          )}
          {premierSortRequis &&
            Array.from({ length: nombreSortsRequis }, (_, i) => {
              const sortsRestants = sortsPossibles.filter(
                (s) => !sortsChoisis.some((sel, j) => j !== i && sel === s.id)
              );
              return (
                <div className="field" key={i}>
                  <label>
                    {nombreSortsRequis > 1
                      ? `${t('creation.modal.spellKnownLabel')} (${i + 1}/${nombreSortsRequis})`
                      : t('creation.modal.firstSpellLabel')}
                  </label>
                  <select
                    value={sortsChoisis[i] ?? ''}
                    onChange={(e) => {
                      const copie = [...sortsChoisis];
                      copie[i] = e.target.value;
                      setSortsChoisis(copie);
                    }}
                  >
                    <option value="">{t('creation.modal.choose')}</option>
                    {sortsRestants.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.resultat} — {s.nom}
                      </option>
                    ))}
                  </select>
                  {i === nombreSortsRequis - 1 && (
                    <p className="text-sm text-muted mb-0">{t('creation.modal.spellRequired')}</p>
                  )}
                </div>
              );
            })}
          {marqueChoisieValide && !estSorcierProfil && marqueRequise && !groupeCible && (
            <p className="text-sm text-muted">{t('ajouterMembre.markNoSpellAccess')}</p>
          )}
          {(estGroupable || groupeCible) && (
            <div className="field">
              <label>
                {t('ajouterMembre.figurineCountLabelPrefix')}{' '}
                {groupeCible ? t('ajouterMembre.figurineCountJoining') : t('ajouterMembre.figurineCountIdentical')}
              </label>
              <input
                type="number"
                min={1}
                value={quantiteSaisie}
                onChange={(e) => setQuantiteSaisie(e.target.value)}
              />
            </div>
          )}
          {groupeCible && coutRejoindre ? (
            <div className="card card--tight" style={{ margin: '0.6rem 0' }}>
              <p className="text-sm mb-0">
                <strong>{t('ajouterMembre.experiencedGroupTitle')}</strong>
              </p>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                {t('ajouterMembre.experiencedGroupBody', {
                  xp: coutRejoindre.xpGroupe,
                  surtaxe: coutRejoindre.surtaxeXpUnitaire,
                })}
              </p>
              {groupeCible.inventaire.length > 0 && (
                <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                  {t('ajouterMembre.forcedEquipmentPrefix')} {[...new Set(groupeCible.inventaire.map((e) => e.nom))].join(', ')} (
                  {coutRejoindre.coutEquipementForce} {t('ajouterMembre.totalForPrefix')} {quantite} {t('ajouterMembre.model')}
                  {quantite > 1 ? 's' : ''}).
                </p>
              )}
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                {t('ajouterMembre.vetPointsIndicative', { points: coutRejoindre.vetPointsIndicatifs })}
              </p>
              {dupliqueraitTrinket && (
                <p className="text-danger text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  {t('ajouterMembre.trinketBlocked')}
                </p>
              )}
            </div>
          ) : (
            !gagneExperience && <p className="text-sm text-muted">{t('creation.modal.neverGainsXp')}</p>
          )}
        </>
      )}
      {profilId && !check.ok && <p className="text-danger text-sm">{check.raison}</p>}
      {profil && !budgetSuffisant && (
        <p className="text-danger text-sm">
          {t('ajouterMembre.insufficientTreasury', { disponible: roster.tresorerie, requis: coutTotal })}
        </p>
      )}
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn--pack-pill-sm" onClick={onClose}>
          {t('creation.modal.cancel')}
        </button>
        <button
          className="btn--pack-pill-sm btn--pack-pill-sm--primary"
          disabled={
            !profil ||
            !check.ok ||
            !coutManuelValide ||
            dupliqueraitTrinket ||
            (marqueRequise && !groupeCible && !marqueChoisie) ||
            (premierSortRequis && !sortsChoisisValides)
          }
          onClick={confirmer}
        >
          {t('ajouterMembre.recruitForPrefix')} {coutTotal} {t('creation.gc')}
          {profil && !budgetSuffisant ? ` ${t('creation.modal.anyway')}` : ''}
        </button>
      </div>
    </Modal>
  );
}
