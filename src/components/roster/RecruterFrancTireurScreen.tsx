import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { useRosters } from '../../state/useRosters';
import { creerMembreFrancTireurCatalogue } from '../../utils/factory';
import {
  disponibiliteFrancTireur,
  FRANCS_TIREURS,
} from '../../data/hiredSwords';
import { SKILL_CATEGORIES, STAT_KEYS } from '../../types/catalog';
import { sortsMagieMineureDisponibles } from '../../utils/magie';
import { useLanguage } from '../../state/useLanguage';

export function RecruterFrancTireurScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const { t } = useLanguage();
  const roster = getRosterById(id ?? '');
  const [recherche, setRecherche] = useState('');
  const [voirIndisponibles, setVoirIndisponibles] = useState(false);
  const [catalogueOuvert, setCatalogueOuvert] = useState(true);
  const [selectionId, setSelectionId] = useState('');
  const [nomPerso, setNomPerso] = useState('');
  const [coutVariable, setCoutVariable] = useState('');
  const [sacrificeLiche, setSacrificeLiche] = useState(1);
  const [sortsChoisis, setSortsChoisis] = useState<string[]>([]);

  const profils = useMemo(() => {
    if (!roster) return [];
    const terme = recherche.trim().toLocaleLowerCase('fr');
    // Les Dramatis Personae ont leur propre flux de recrutement (recherche
    // post-bataille dédiée, jamais renommables) — exclus de cet écran.
    return FRANCS_TIREURS.filter((profil) => !profil.est_dramatis_personae)
      .map((profil) => ({
        profil,
        disponibilite: disponibiliteFrancTireur(profil, roster),
      }))
      .filter(({ profil, disponibilite }) => {
        if (!voirIndisponibles && !disponibilite.disponible) return false;
        return !terme || `${profil.nom} ${profil.nom_original ?? ''}`.toLocaleLowerCase('fr').includes(terme);
      });
  }, [recherche, roster, voirIndisponibles]);

  if (!roster) {
    return (
      <Screen title={t('roster.notFoundTitle')} back="/">
        <p className="text-muted">{t('francTireur.notFoundBody')}</p>
      </Screen>
    );
  }

  const selection = FRANCS_TIREURS.find((p) => p.id === selectionId);
  const disponibiliteSelection = selection ? disponibiliteFrancTireur(selection, roster) : null;
  const coutRecrutement = selection
    ? selection.recrutement.cout ?? Math.max(0, Number(coutVariable) || 0)
    : 0;
  const budgetSuffisant = coutRecrutement <= roster.tresorerie;
  const coutVariableValide = !selection || selection.recrutement.cout != null || Number(coutVariable) > 0;
  const nombreSortsRequis = selection?.magie?.sorts_depart ?? 0;
  const sortsRenseignes = sortsChoisis.filter(Boolean);
  const sortsValides =
    sortsRenseignes.length === nombreSortsRequis && new Set(sortsRenseignes).size === nombreSortsRequis;
  const peutEngager =
    !!selection && disponibiliteSelection?.disponible && budgetSuffisant && coutVariableValide && sortsValides;

  const choisir = (profilId: string) => {
    const profil = FRANCS_TIREURS.find((p) => p.id === profilId);
    setSelectionId(profilId);
    setNomPerso(profil?.nom ?? '');
    setCoutVariable('');
    setSacrificeLiche(1);
    setSortsChoisis([]);
    setCatalogueOuvert(false);
  };

  const recruter = () => {
    if (!selection || !peutEngager) return;
    const membre = creerMembreFrancTireurCatalogue(selection);
    membre.nom_perso = nomPerso.trim() || selection.nom;
    membre.sorts_connus = [...sortsRenseignes];

    const membres = roster.membres.map((m) => {
      if (!selection.sacrifice_liche || m.profil_id !== 'liche' || m.statut === 'mort') return m;
      return {
        ...m,
        stats_actuels: { ...m.stats_actuels, PV: Math.max(1, m.stats_actuels.PV - sacrificeLiche) },
        stats_modifiees: m.stats_modifiees.includes('PV') ? m.stats_modifiees : [...m.stats_modifiees, 'PV' as const],
      };
    });

    updateRoster({
      ...roster,
      tresorerie: roster.tresorerie - coutRecrutement,
      membres: [...membres, membre],
    });
    navigate(`/roster/${roster.id}`);
  };

  return (
    <Screen title={t('francTireur.title')} back={`/roster/${roster.id}`}>
      <div className="card">
        <p className="text-sm text-muted">{t('francTireur.intro')}</p>
        <div className="field">
          <label>{t('francTireur.search')}</label>
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder={t('francTireur.searchPlaceholder')}
          />
        </div>
        <label className="flex items-center gap-sm text-sm" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={voirIndisponibles}
            onChange={(e) => setVoirIndisponibles(e.target.checked)}
          />
          {t('francTireur.showUnavailable')}
        </label>
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-sm">
          <h3 className="mb-0">{t('francTireur.catalog')}</h3>
          <button
            className="btn btn--sm"
            onClick={() => setCatalogueOuvert((ouvert) => !ouvert)}
            aria-expanded={catalogueOuvert}
          >
            {catalogueOuvert ? t('francTireur.collapse') : t('francTireur.show')}
          </button>
        </div>
        {!catalogueOuvert && selection && (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.5rem' }}>
            {t('francTireur.currentSelection')} <strong>{selection.nom}</strong>
          </p>
        )}
        {catalogueOuvert && (
          <>
            {profils.length === 0 && <p className="text-muted text-sm">{t('francTireur.noMatch')}</p>}
            <div className="skill-list" style={{ marginTop: '0.6rem' }}>
              {profils.map(({ profil, disponibilite }) => (
                <button
                  key={profil.id}
                  className={`list-item${selectionId === profil.id ? ' list-item--selected' : ''}`}
                  style={{ width: '100%', textAlign: 'left', opacity: disponibilite.disponible ? 1 : 0.62 }}
                  onClick={() => choisir(profil.id)}
                >
                  <div className="list-item__main">
                    <div className="list-item__title">{profil.nom}</div>
                    <div className="list-item__subtitle">
                      {t('francTireur.hireCost')} {profil.recrutement.cout ?? profil.recrutement.notation}{' '}
                      {t('francTireur.gc')} · {t('francTireur.upkeep')}{' '}
                      {profil.entretien.type === 'or'
                        ? `${profil.entretien.cout} ${t('francTireur.gc')}`
                        : profil.entretien.type === 'malepierre'
                          ? `${profil.entretien.cout} ${t('francTireur.wyrdstoneFragment')}`
                          : t('francTireur.none')}
                    </div>
                    {!disponibilite.disponible && (
                      <div className="text-danger text-sm" style={{ marginTop: '0.2rem' }}>
                        {disponibilite.raison}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {selection && (
        <>
          <div className="card">
            <h3>{selection.nom}</h3>
            <p className="text-sm text-muted">
              <strong>{t('francTireur.employers')}</strong> {selection.employeurs.texte}
              <br />
              <strong>{t('francTireur.bandValue')}</strong> +{selection.valeur} {t('francTireur.points')}
              {selection.gagne_experience !== false ? ' + XP' : ''}
              <br />
              <strong>{t('francTireur.source')}</strong> page {selection.page_source} {t('francTireur.sourcePdfSuffix')}
            </p>
            <div className="stat-grid">
              {STAT_KEYS.map((k) => (
                <div key={k} className="stat-grid__cell stat-grid__cell--label">
                  {k}
                </div>
              ))}
              {STAT_KEYS.map((k) => (
                <div key={k} className="stat-grid__cell stat-grid__cell--value">
                  {selection.stats[k]}
                </div>
              ))}
            </div>
            {selection.profils_secondaires?.map((secondaire) => (
              <div key={secondaire.nom} style={{ marginTop: '0.8rem' }}>
                <p className="text-sm mb-0">
                  <strong>{secondaire.nom}</strong>
                </p>
                <div className="stat-grid">
                  {STAT_KEYS.map((k) => (
                    <div key={k} className="stat-grid__cell stat-grid__cell--label">
                      {k}
                    </div>
                  ))}
                  {STAT_KEYS.map((k) => (
                    <div key={k} className="stat-grid__cell stat-grid__cell--value">
                      {secondaire.stats[k]}
                    </div>
                  ))}
                </div>
                {secondaire.equipement && (
                  <p className="text-sm text-muted">{t('francTireur.equipmentProvided')} {secondaire.equipement.join(', ')}</p>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <h3>{t('francTireur.equipmentAndProgress')}</h3>
            <p className="text-sm">
              <strong>{t('francTireur.equipmentProvided')}</strong> {selection.equipement.join(', ')}
            </p>
            <p className="text-sm">
              <strong>{t('francTireur.skillTables')}</strong>{' '}
              {selection.acces_competences
                .map((id) => SKILL_CATEGORIES.find((categorie) => categorie.id === id)?.label ?? id)
                .join(', ') || t('francTireur.noneFem')}
            </p>
            <p className="text-sm text-muted mb-0">{t('francTireur.equipmentNote')}</p>
          </div>

          <div className="card">
            <h3>{t('francTireur.rules')}</h3>
            {selection.regles_speciales.map((regle) => (
              <p key={regle.nom} className="text-sm" style={{ whiteSpace: 'pre-line' }}>
                <strong>{regle.nom}</strong> — {regle.texte}
              </p>
            ))}
            {selection.competences_speciales?.map((competence) => (
              <p key={competence.id} className="text-sm">
                <strong>{competence.nom}</strong> — {competence.texte}
              </p>
            ))}
          </div>

          <div className="card">
            <h3>{t('francTireur.contract')}</h3>
            <div className="field">
              <label>{t('francTireur.nameOnSheet')}</label>
              <input value={nomPerso} onChange={(e) => setNomPerso(e.target.value)} />
            </div>
            {selection.recrutement.cout == null && (
              <div className="field">
                <label>{t('francTireur.actualCostObtained', { notation: selection.recrutement.notation ?? '' })}</label>
                <input
                  type="number"
                  min={1}
                  value={coutVariable}
                  onChange={(e) => setCoutVariable(e.target.value)}
                />
              </div>
            )}
            {selection.sacrifice_liche && (
              <div className="field">
                <label>{t('francTireur.d3Result')}</label>
                <select value={sacrificeLiche} onChange={(e) => setSacrificeLiche(Number(e.target.value))}>
                  <option value={1}>1 PV</option>
                  <option value={2}>2 PV</option>
                  <option value={3}>3 PV</option>
                </select>
              </div>
            )}
            {nombreSortsRequis > 0 && (
              <div className="field">
                <label>{t('francTireur.minorMagicSpells', { n: nombreSortsRequis })}</label>
                {Array.from({ length: nombreSortsRequis }, (_, index) => (
                  <select
                    key={index}
                    value={sortsChoisis[index] ?? ''}
                    onChange={(e) => {
                      const prochains = Array.from(
                        { length: nombreSortsRequis },
                        (_, sortIndex) => sortsChoisis[sortIndex] ?? ''
                      );
                      prochains[index] = e.target.value;
                      setSortsChoisis(prochains);
                    }}
                    style={{ marginTop: index > 0 ? '0.45rem' : undefined }}
                  >
                    <option value="">{t('francTireur.chooseSpell', { n: index + 1 })}</option>
                    {sortsMagieMineureDisponibles(
                      sortsChoisis.filter((_, sortIndex) => sortIndex !== index)
                    ).map((sort) => (
                      <option key={sort.nom} value={sort.nom}>
                        {sort.resultat} — {sort.nom} ({t('francTireur.diffAbbrev')} {sort.difficulte})
                      </option>
                    ))}
                  </select>
                ))}
                <p className="text-sm text-muted mb-0">{t('francTireur.mageStartNote')}</p>
              </div>
            )}
            <p className={budgetSuffisant ? 'text-sm text-muted' : 'text-sm text-danger'}>
              {t('francTireur.treasuryDeduction', { cout: coutRecrutement, dispo: roster.tresorerie })}
              {!budgetSuffisant && t('francTireur.insufficientTreasurySuffix')}
            </p>
            {disponibiliteSelection && !disponibiliteSelection.disponible && (
              <p className="text-sm text-danger">{disponibiliteSelection.raison}</p>
            )}
          </div>

          <div className="flex gap-sm">
            <button className="btn" onClick={() => navigate(`/roster/${roster.id}`)}>
              {t('francTireur.cancel')}
            </button>
            <button className="btn btn--primary" disabled={!peutEngager} onClick={recruter}>
              {t('francTireur.hireForPrefix')} {coutRecrutement || '…'} {t('francTireur.gc')}
            </button>
          </div>
        </>
      )}
    </Screen>
  );
}
