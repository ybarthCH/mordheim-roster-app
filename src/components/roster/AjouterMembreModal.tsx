import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RosterInstance } from '../../types/roster';
import { getCatalogue } from '../../data/warbands';
import { translateWarbandCatalog } from '../../i18n/data/warbands';
import { peutAjouterMembre } from '../../utils/validation';
import { creerMembre } from '../../utils/factory';
import { calculerCoutRejoindreGroupe, formatCoutProfil, rejoindreGroupe, TRINKETS_LIMITES } from '../../utils/shop';
import { estSorcier, resolveSort, sortsDisponiblesPourRoster } from '../../utils/magie';
import { magieMineure } from '../../i18n/data/minorMagic';
import { equitationGratuitePourTribu, SKILL_EQUITATION } from '../../utils/tribu';
import { peutGagnerExperience } from '../../utils/xp';
import { Modal } from '../common/Modal';
import { useGameRules } from '../../state/useGameRules';
import { useLanguage } from '../../state/useLanguage';

const FRANC_TIREUR = '__franc_tireur__';

type Props = {
  roster: RosterInstance;
  onClose: () => void;
  onConfirm: (roster: RosterInstance) => void;
};

export function AjouterMembreModal({ roster, onClose, onConfirm }: Props) {
  const navigate = useNavigate();
  const { rules } = useGameRules();
  const { t, language } = useLanguage();
  const catalogueBrut = getCatalogue(roster.bande_id);
  const catalogue = catalogueBrut ? translateWarbandCatalog(catalogueBrut, language) : catalogueBrut;
  const [profilId, setProfilId] = useState('');
  const [nomPerso, setNomPerso] = useState('');
  // Saisies gardées en texte brut (pas en number) : un input contrôlé par un
  // number forcerait la valeur dès l'effacement (impossible de vider le
  // champ pour retaper un chiffre) — la conversion/le plancher ne s'applique
  // qu'à l'usage (voir xpDepart/quantite ci-dessous).
  const [xpDepartSaisie, setXpDepartSaisie] = useState('0');
  const [quantiteSaisie, setQuantiteSaisie] = useState('1');
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
  const xpDepart = Number(xpDepartSaisie) || 0;
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
    setXpDepartSaisie(String(p?.xp_depart ?? 0));
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
      // d'XP de départ propre.
      onConfirm(
        rejoindreGroupe(roster, groupeCible, quantite, coutTotal, coutManuelRequis ? coutUnitaire : undefined)
      );
      return;
    }

    const membre = creerMembre(profil, xpDepart, quantite);
    if (coutManuelRequis) membre.cout_recrutement = coutUnitaire;
    if (nomPerso.trim()) membre.nom_perso = nomPerso.trim();
    if (marqueRequise && marqueChoisie) membre.marque = marqueChoisie;
    if (premierSortRequis && sortsChoisisValides) {
      membre.sorts_connus = [...(profil.sorts_fixes_depart ?? []), ...sortsChoisis];
    }
    if (profil.type === 'heros' && equitationGratuitePourTribu(catalogue, roster)) {
      membre.competences_acquises = [...membre.competences_acquises, SKILL_EQUITATION];
    }
    onConfirm({
      ...roster,
      tresorerie: roster.tresorerie - coutTotal,
      membres: [...roster.membres, membre],
    });
  };

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
          {profil.rarete && (
            <p className="text-sm text-danger">
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
              <input value={nomPerso} onChange={(e) => setNomPerso(e.target.value)} placeholder={profil.nom} />
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
          ) : gagneExperience ? (
            <div className="field">
              <label>{t('creation.modal.startingXp')}</label>
              <input type="number" value={xpDepartSaisie} onChange={(e) => setXpDepartSaisie(e.target.value)} />
              <p className="text-sm text-muted mb-0">{t('creation.modal.noAdvanceTriggered')}</p>
            </div>
          ) : (
            <p className="text-sm text-muted">{t('creation.modal.neverGainsXp')}</p>
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
        <button className="btn" onClick={onClose}>
          {t('creation.modal.cancel')}
        </button>
        <button
          className="btn btn--primary"
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
