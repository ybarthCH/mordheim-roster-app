import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { CATALOGUES } from '../../data/warbands';
import type { CustomItem, CustomItemOverride, Member, RosterInstance } from '../../types/roster';
import { creerRoster } from '../../utils/factory';
import { AjouterMembreModal } from '../roster/AjouterMembreModal';
import { useRosters } from '../../state/useRosters';
import { useLanguage } from '../../state/useLanguage';
import { translateWarbandCatalog } from '../../i18n/data/warbands';

const BUDGET_PAR_DEFAUT = 500;

export function CreationBandeScreen() {
  const navigate = useNavigate();
  const { addRoster } = useRosters();
  const { t, language } = useLanguage();

  const catalogues = useMemo(() => CATALOGUES.map((c) => translateWarbandCatalog(c, language)), [language]);

  const [bandeId, setBandeId] = useState<string>('');
  const [nomBande, setNomBande] = useState('');
  // Saisie gardée en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper
  // un chiffre) — la conversion ne s'applique qu'à l'usage (voir `budget`).
  const [budgetSaisi, setBudgetSaisi] = useState(String(BUDGET_PAR_DEFAUT));
  const [membres, setMembres] = useState<Member[]>([]);
  // Même fenêtre de recrutement que pour une bande déjà créée (voir
  // RosterScreen) : un seul bouton l'ouvre, câblée directement sur le
  // brouillon de roster ci-dessous plutôt que sur un roster persisté.
  const [recruterOuvert, setRecruterOuvert] = useState(false);
  // Objets personnalisés / surcharges créés depuis le shop pendant la
  // création (bouton "Personnalisé" d'AchatEquipementModal) — vides par
  // défaut, portés jusqu'au roster final par handleCreer ci-dessous.
  const [objetsPersonnalises, setObjetsPersonnalises] = useState<CustomItem[]>([]);
  const [objetsSurcharges, setObjetsSurcharges] = useState<Record<string, CustomItemOverride>>({});
  // Bandes à chef libre (ex : Lustrian Reavers) : le joueur choisit le chef
  // parmi les héros recrutés, plutôt qu'un profil fixe (voir Profile.est_leader).
  const [leaderInstanceId, setLeaderInstanceId] = useState<string | null>(null);
  // Tribu choisie pour les bandes qui en proposent (ex : Maraudeurs du
  // Chaos) — voir WarbandCatalog.tribus. Fixée une fois pour toutes.
  const [tribuId, setTribuId] = useState('');

  const budget = Number(budgetSaisi) || 0;

  const catalogue = useMemo(() => catalogues.find((c) => c.id === bandeId), [catalogues, bandeId]);

  // Groupées par grade (1a, 1b, 1c...) puis triées par nom au sein de chaque groupe.
  const catalauguesParGrade = useMemo(() => {
    const groupes = new Map<string, typeof catalogues>();
    for (const c of catalogues) {
      const liste = groupes.get(c.grade) ?? [];
      liste.push(c);
      groupes.set(c.grade, liste);
    }
    for (const liste of groupes.values()) {
      liste.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
    }
    return [...groupes.entries()].sort(([a], [b]) => a.localeCompare(b, 'fr'));
  }, [catalogues]);

  const coutTotal = membres.reduce((acc, m) => {
    const profil = catalogue?.profils.find((p) => p.id === m.profil_id);
    // cout_recrutement : prix réellement payé pour les profils sans prix
    // fixe (ex : chien de guerre, "25+2D6") — posé sur le membre lui-même
    // par AjouterMembreModal, le catalogue n'ayant pas de `cout` numérique
    // pour ces profils.
    const coutUnitaire = profil?.cout ?? m.cout_recrutement ?? 0;
    // + équipement éventuellement acheté juste après le recrutement : chaque
    // entrée porte déjà son coût payé total pour tout le groupe (voir
    // creerEntreesInventaire).
    const coutEquipement = m.inventaire.reduce((a, e) => a + e.cout, 0);
    return acc + coutUnitaire * (m.taille_groupe || 1) + coutEquipement;
  }, 0);
  const restant = budget - coutTotal;

  // roster factice pour vérifier les limites de composition en cours de
  // création, et servir de support à la fenêtre de recrutement partagée
  // (AjouterMembreModal, la même que pour une bande déjà créée) — tresorerie
  // reflète donc le budget réellement restant (recrutement + équipement déjà
  // achetés), pas le budget de départ.
  const rosterFictif = useMemo<RosterInstance>(
    () => ({
      id: 'draft',
      bande_id: bandeId,
      nom_bande: nomBande,
      tresorerie: restant,
      wyrdstone: 0,
      equipement_reserve: '',
      stock: [],
      objets_personnalises: objetsPersonnalises,
      objets_surcharges: objetsSurcharges,
      membres,
      historique_batailles: [],
      createdAt: '',
      updatedAt: '',
      ...(tribuId ? { tribu: tribuId } : {}),
    }),
    [bandeId, nomBande, restant, objetsPersonnalises, objetsSurcharges, membres, tribuId]
  );

  const retirerMembre = (instanceId: string) => {
    setMembres((prev) => prev.filter((m) => m.instance_id !== instanceId));
    setLeaderInstanceId((prev) => (prev === instanceId ? null : prev));
  };

  const herosRecrutes = membres.filter((m) => catalogue?.profils.find((p) => p.id === m.profil_id)?.type === 'heros');

  const renommerMembre = (instanceId: string, nom: string) => {
    setMembres((prev) => prev.map((m) => (m.instance_id === instanceId ? { ...m, nom_perso: nom } : m)));
  };

  const tribuRequise = (catalogue?.tribus?.length ?? 0) > 0;
  const peutCreer =
    bandeId !== '' && nomBande.trim() !== '' && membres.length > 0 && (!tribuRequise || tribuId !== '');
  // Un double-clic/double-tap sur "Créer" (accidentel, ou latence perçue
  // pendant l'écriture IndexedDB) relançait handleCreer une seconde fois
  // avant la navigation loin de cet écran — deux bandes distinctes créées
  // pour une seule intention, la seconde silencieusement invisible tant que
  // l'utilisateur ne regarde pas la liste des bandes.
  const [creationEnCours, setCreationEnCours] = useState(false);

  // Rien de tout ce brouillon n'est persisté avant "Créer la bande"
  // (handleCreer) : un appui de trop sur le retour du bandeau, ou le
  // retour matériel/geste du téléphone, faisait tout perdre en silence
  // (faction choisie, membres recrutés, équipement déjà acheté). On
  // demande donc confirmation dans les deux cas dès qu'un brouillon a
  // été entamé — même garde que l'assistant post-bataille
  // (PostBatailleScreen) pour son propre risque de perte de saisie.
  const enCours = bandeId !== '' || nomBande.trim() !== '' || membres.length > 0;
  const confirmerAbandon = () => !enCours || window.confirm(t('creation.confirmLeaveDraft'));

  useEffect(() => {
    if (!enCours) return;
    window.history.pushState(null, '');
    const onPopState = () => {
      window.history.pushState(null, '');
      if (confirmerAbandon()) {
        navigate('/', { replace: true });
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enCours]);

  const handleCreer = async () => {
    if (!peutCreer || creationEnCours) return;
    setCreationEnCours(true);
    const roster = creerRoster(bandeId, nomBande.trim(), restant);
    roster.membres = membres;
    roster.objets_personnalises = objetsPersonnalises;
    roster.objets_surcharges = objetsSurcharges;
    if (catalogue?.leader_libre && leaderInstanceId) {
      roster.leader_instance_id = leaderInstanceId;
    }
    if (tribuRequise && tribuId) {
      roster.tribu = tribuId;
    }
    await addRoster(roster);
    navigate(`/roster/${roster.id}`);
  };

  return (
    <Screen title={t('creation.title')} back="/" onBeforeBack={confirmerAbandon}>
      <div className="card">
        <div className="field">
          <label>{t('creation.faction')}</label>
          <select
            value={bandeId}
            onChange={(e) => {
              const nouvelleBandeId = e.target.value;
              setBandeId(nouvelleBandeId);
              setMembres([]);
              setTribuId('');
              // "Richesse : les Marienburgers débutent une campagne avec
              // 600 CO au lieu de 500." (Mercenaires Marienburgers,
              // Middenheimers et Reiklanders [GW].pdf p.1) — composition.
              // cout_max_constitution porte déjà cette valeur par bande
              // (600 pour les Marienburgers, 500 pour les autres), mais
              // n'était jamais lu ici : le champ restait figé à 500 quelle
              // que soit la bande choisie.
              const nouveauCatalogue = catalogues.find((c) => c.id === nouvelleBandeId);
              setBudgetSaisi(String(nouveauCatalogue?.composition?.cout_max_constitution ?? BUDGET_PAR_DEFAUT));
            }}
          >
            <option value="">{t('creation.factionPlaceholder')}</option>
            {catalauguesParGrade.map(([grade, liste]) => (
              <optgroup key={grade} label={`${t('creation.grade')} ${grade}`}>
                {liste.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {catalogue?.banniere && (
          <div className="creation-banniere">
            <img src={`${import.meta.env.BASE_URL}${catalogue.banniere}`} alt="" aria-hidden="true" />
          </div>
        )}

        {tribuRequise && (
          <div className="field">
            <label>{t('creation.tribe')}</label>
            <select value={tribuId} onChange={(e) => setTribuId(e.target.value)}>
              <option value="">{t('creation.tribePlaceholder')}</option>
              {catalogue?.tribus?.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.nom}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted mb-0">{t('creation.tribeFixedNote')}</p>
          </div>
        )}

        <div className="field">
          <label>{t('creation.bandName')}</label>
          <input value={nomBande} onChange={(e) => setNomBande(e.target.value)} placeholder={t('creation.bandNamePlaceholder')} />
        </div>

        <div className="field">
          <label>{t('creation.startingTreasury')}</label>
          <input type="number" value={budgetSaisi} onChange={(e) => setBudgetSaisi(e.target.value)} />
        </div>
      </div>

      {catalogue && catalogue.regles_speciales.length > 0 && (
        <div className="card">
          <details className="disclosure">
            <summary>{t('creation.specialRules')}</summary>
            {catalogue.regles_speciales.map((r) => (
              <div key={r.nom} style={{ marginBottom: '0.6rem' }}>
                <strong>{r.nom}</strong>
                <p className="text-sm text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {r.texte}
                </p>
              </div>
            ))}
            {tribuRequise && (
              <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
                <strong>
                  {t('creation.tribe')}{' '}
                  {tribuId
                    ? `${t('creation.tribeChosen')} ${catalogue?.tribus?.find((tr) => tr.id === tribuId)?.nom}`
                    : t('creation.tribeToChoose')}
                </strong>
                {(tribuId ? catalogue?.tribus?.filter((tr) => tr.id === tribuId) : catalogue?.tribus)?.map((tr) => (
                  <div key={tr.id} style={{ marginTop: '0.5rem' }}>
                    {!tribuId && <strong>{tr.nom}</strong>}
                    <p className="text-sm text-muted" style={{ whiteSpace: 'pre-line' }}>
                      {tr.texte}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </details>
        </div>
      )}

      {catalogue && (
        <div className="card">
          <div className="flex justify-between items-center">
            <h3 className="mt-0 mb-0">{t('creation.recruit')}</h3>
            <span className={restant < 0 ? 'badge badge--danger' : 'badge badge--success'}>
              {restant} {t('creation.goldRemaining')}
            </span>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--block"
            style={{ marginTop: '0.6rem' }}
            onClick={() => setRecruterOuvert(true)}
          >
            {t('creation.recruit')}
          </button>
        </div>
      )}

      {membres.length > 0 && (
        <div className="card">
          <h3>
            {t('creation.recruitedMembers')} ({membres.length})
          </h3>
          {membres.map((m) => (
            <div key={m.instance_id} className="list-item" style={{ marginBottom: '0.5rem' }}>
              <div className="list-item__main">
                <input
                  value={m.nom_perso}
                  onChange={(e) => renommerMembre(m.instance_id, e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    width: '100%',
                    padding: 0,
                  }}
                />
                <div className="list-item__subtitle">
                  {catalogue?.profils.find((p) => p.id === m.profil_id)?.nom}
                  {m.taille_groupe > 1 ? ` · × ${m.taille_groupe}` : ''} · XP {m.xp}
                </div>
              </div>
              <button className="btn btn--sm btn--danger" onClick={() => retirerMembre(m.instance_id)}>
                {t('creation.remove')}
              </button>
            </div>
          ))}
        </div>
      )}

      {catalogue?.leader_libre && herosRecrutes.length > 0 && (
        <div className="card">
          <h3>{t('creation.leaderTitle')}</h3>
          <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
            {t('creation.leaderBody')}
          </p>
          <div className="flex flex-col gap-sm">
            {herosRecrutes.map((m) => (
              <label key={m.instance_id} className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="leader"
                  checked={leaderInstanceId === m.instance_id}
                  onChange={() => setLeaderInstanceId(m.instance_id)}
                />
                <span>{m.nom_perso || catalogue.profils.find((p) => p.id === m.profil_id)?.nom}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button className="btn btn--primary btn--block" disabled={!peutCreer || creationEnCours} onClick={handleCreer}>
        {t('creation.createBand')}
      </button>
      {nomBande.trim() === '' && (
        <p className="text-sm text-danger" style={{ marginTop: '0.4rem' }}>
          {t('creation.nameRequiredWarning')}
        </p>
      )}

      {recruterOuvert && catalogue && (
        <AjouterMembreModal
          roster={rosterFictif}
          masquerFrancTireur
          onClose={() => setRecruterOuvert(false)}
          onUpdateRoster={(nouveauRoster) => {
            setMembres(nouveauRoster.membres);
            setObjetsPersonnalises(nouveauRoster.objets_personnalises);
            setObjetsSurcharges(nouveauRoster.objets_surcharges);
          }}
        />
      )}
    </Screen>
  );
}
