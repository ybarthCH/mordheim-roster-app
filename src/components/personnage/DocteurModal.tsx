import { useState } from 'react';
import type { SeriousInjuryRecord } from '../../types/roster';
import {
  COUT_DOCTEUR,
  effetsTraitablesDocteur,
  estBlessureExplicitementIncurable,
  resultatDocteur,
  type EffetTraitableDocteur,
  type ResultatDocteur,
} from '../../utils/docteur';
import { injuryLabel } from '../../utils/blessures';
import { trouverBlessure } from '../../data/blessuresGraves';
import { translateBlessure } from '../../i18n/data/blessuresGraves';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { useLanguage } from '../../state/useLanguage';
import type { Language } from '../../state/useLanguage';

// Un effet dont le nom diffère de l'entrée d'origine a été personnalisé en
// cours de résolution (voir la même logique dans BlessureGraveWizard) — son
// texte n'existe alors qu'en français et ne doit pas être traduit.
function nomEffetAffiche(effet: EffetTraitableDocteur, language: Language): string {
  const canonique = trouverBlessure(effet.resultatId);
  if (!canonique || canonique.nom !== effet.nom) return effet.nom;
  return translateBlessure(canonique, language).nom;
}

// Traduction best-effort de la description persistée d'une blessure grave :
// ne s'applique que si la blessure est un effet unique, non personnalisé, et
// dont le texte correspond exactement (ou avec un simple suffixe ajouté, ex.
// une précision libre) à celui construit depuis la donnée canonique — sinon
// on retombe sur le texte français d'origine plutôt que de risquer un
// mélange incohérent (voir texteIterationAffichee dans BlessureGraveWizard
// pour le même principe de repli).
function injuryLabelAffiche(blessure: SeriousInjuryRecord, language: Language): string {
  const original = injuryLabel(blessure);
  if (language !== 'en' || blessure.effets?.length !== 1) return original;
  const [effet] = blessure.effets;
  const canonique = trouverBlessure(effet.resultat_id);
  if (!canonique || canonique.nom !== effet.nom) return original;
  const texteCanonique = `${canonique.nom} (${canonique.code}) — ${canonique.texte}`;
  if (!original.startsWith(texteCanonique)) return original;
  const traduit = translateBlessure(canonique, language);
  return `${traduit.nom} (${canonique.code}) — ${traduit.texte}${original.slice(texteCanonique.length)}`;
}

type Props = {
  nomPersonnage: string;
  blessure: SeriousInjuryRecord;
  tresorerie: number;
  estHeros: boolean;
  onClose: () => void;
  onPayer: (effetId: string) => void;
  onAppliquer: (effetId: string, jet: number) => void;
};

export function DocteurModal({
  nomPersonnage,
  blessure,
  tresorerie,
  estHeros,
  onClose,
  onPayer,
  onAppliquer,
}: Props) {
  const { t, language } = useLanguage();
  const effets = effetsTraitablesDocteur(blessure);
  const [effetChoisi, setEffetChoisi] = useState(
    blessure.docteur_effet_en_attente ?? effets[0]?.id ?? ''
  );
  const [jetSaisi, setJetSaisi] = useState('');
  const [applique, setApplique] = useState<ResultatDocteur | null>(null);
  const consultationPayee = !!blessure.docteur_effet_en_attente;
  const effetActif = effets.find(
    (effet) => effet.id === (blessure.docteur_effet_en_attente ?? effetChoisi)
  );
  const jet = Number(jetSaisi);
  const jetValide = Number.isInteger(jet) && jet >= 2 && jet <= 12;
  const resultat = effetActif && jetValide ? resultatDocteur(effetActif.table, jet, effetActif) : null;

  const appliquer = () => {
    if (!effetActif || !jetValide || !resultat) return;
    onAppliquer(effetActif.id, jet);
    setApplique(resultat);
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="mt-0">
        <Icon name="goutte" style={{ marginRight: '0.4em' }} />
        {t('docteurModal.title')}
      </h3>
      <p className="text-sm text-muted" style={{ whiteSpace: 'pre-line' }}>
        <strong>{nomPersonnage}</strong>
        {'\n'}
        {injuryLabelAffiche(blessure, language)}
      </p>

      {applique ? (
        <>
          <div className="card card--tight" style={{ borderColor: 'var(--accent)' }}>
            <h4 className="mt-0 mb-0">{applique.titre}</h4>
            <p className="text-sm mb-0" style={{ marginTop: '0.4rem' }}>
              {applique.texte}
            </p>
          </div>
          <p className="text-success text-sm">{t('docteurModal.appliedNote')}</p>
          <button className="btn btn--primary btn--block" onClick={onClose}>
            {t('docteurModal.close')}
          </button>
        </>
      ) : !estHeros ? (
        <>
          <p className="text-muted">{t('docteurModal.onlyHeroes')}</p>
          <button className="btn btn--block" onClick={onClose}>
            {t('docteurModal.close')}
          </button>
        </>
      ) : effets.length === 0 ? (
        <>
          <p className="text-muted">
            {estBlessureExplicitementIncurable(blessure)
              ? t('docteurModal.incurable')
              : blessure.soignee || blessure.effets?.some((effet) => effet.traitee)
                ? t('docteurModal.alreadyTreated')
                : t('docteurModal.notCovered')}
          </p>
          {blessure.historique_docteur?.map((tentative, index) => (
            <p key={`${tentative.date}-${index}`} className="text-sm mb-0">
              {tentative.date} — 2D6 = {tentative.jet} : <strong>{tentative.titre}</strong> — {tentative.texte}
            </p>
          ))}
          <button className="btn btn--block" style={{ marginTop: '1rem' }} onClick={onClose}>
            {t('docteurModal.close')}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm">
            {t('docteurModal.consultationCostPrefix')} <strong>{COUT_DOCTEUR} {t('creation.gc')}</strong>{t('docteurModal.consultationCostSuffix')}
          </p>
          <p className="text-sm text-muted">{t('docteurModal.rollInputNote')}</p>

          {effets.length > 1 && (
            <div className="field">
              <label>{t('docteurModal.injuryToTreat')}</label>
              <select
                value={blessure.docteur_effet_en_attente ?? effetChoisi}
                disabled={consultationPayee}
                onChange={(e) => setEffetChoisi(e.target.value)}
              >
                {effets.map((effet) => (
                  <option key={effet.id} value={effet.id}>
                    {nomEffetAffiche(effet, language)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!consultationPayee ? (
            <>
              <p className="text-sm text-muted">{t('docteurModal.treasuryAvailable')} {tresorerie} {t('creation.gc')}.</p>
              {tresorerie < COUT_DOCTEUR && (
                <p className="text-danger text-sm">
                  {t('docteurModal.missingFundsPrefix')} {COUT_DOCTEUR - tresorerie} {t('docteurModal.missingFundsSuffix')}
                </p>
              )}
              <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                <button className="btn" onClick={onClose}>
                  {t('docteurModal.cancel')}
                </button>
                <button
                  className="btn btn--primary"
                  disabled={!effetActif || tresorerie < COUT_DOCTEUR}
                  onClick={() => effetActif && onPayer(effetActif.id)}
                >
                  {t('docteurModal.payAndStartPrefix')} {COUT_DOCTEUR} {t('creation.gc')} {t('docteurModal.payAndStartSuffix')}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-success text-sm">{t('docteurModal.paidNote')}</p>
              <div className="field">
                <label>{t('docteurModal.totalRollLabel')}</label>
                <select value={jetSaisi} onChange={(e) => setJetSaisi(e.target.value)}>
                  <option value="">{t('docteurModal.chooseResult')}</option>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((valeur) => (
                    <option key={valeur} value={valeur}>
                      {valeur}
                    </option>
                  ))}
                </select>
              </div>

              {resultat && (
                <div className="card card--tight">
                  <h4 className="mt-0 mb-0">{resultat.titre}</h4>
                  <p className="text-sm mb-0" style={{ marginTop: '0.4rem' }}>
                    {resultat.texte}
                  </p>
                </div>
              )}

              <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                <button className="btn" onClick={onClose}>
                  {t('docteurModal.closeEnterLater')}
                </button>
                <button className="btn btn--primary" disabled={!resultat} onClick={appliquer}>
                  {t('docteurModal.applyResult')}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
