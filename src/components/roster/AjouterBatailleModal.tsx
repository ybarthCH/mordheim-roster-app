import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { BattleRecord } from '../../types/roster';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  bataille?: BattleRecord;
  onClose: () => void;
  onConfirm: (bataille: BattleRecord) => void;
  onDelete?: () => void;
};

export function AjouterBatailleModal({ bataille, onClose, onConfirm, onDelete }: Props) {
  const { t } = useLanguage();
  const [date, setDate] = useState(() => bataille?.date ?? new Date().toISOString().slice(0, 10));
  const [resultat, setResultat] = useState<BattleRecord['resultat']>(bataille?.resultat ?? 'victoire');
  const [adversaires, setAdversaires] = useState<string[]>(bataille?.adversaires ?? []);
  const [nouvelAdversaire, setNouvelAdversaire] = useState('');
  const [notes, setNotes] = useState(bataille?.notes ?? '');

  const ajouterAdversaire = () => {
    const nom = nouvelAdversaire.trim();
    if (!nom || adversaires.includes(nom)) return;
    setAdversaires((prev) => [...prev, nom]);
    setNouvelAdversaire('');
  };

  // Cet écran n'expose que quelques champs (date/résultat/adversaires/notes)
  // — le reste de l'enregistrement (notamment `journal`, rempli par
  // l'assistant post-bataille) doit être préservé tel quel, sinon modifier
  // une bataille existante l'écraserait avec une entrée vide.
  const confirmer = () => {
    onConfirm({ ...bataille, id: bataille?.id ?? uuidv4(), date, resultat, adversaires, notes: notes.trim() });
  };

  return (
    <Modal onClose={onClose}>
      <h3>{bataille ? t('bataille.editTitle') : t('bataille.newTitle')}</h3>
      <div className="field-row">
        <div className="field">
          <label>{t('bataille.date')}</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label>{t('bataille.result')}</label>
          <select value={resultat} onChange={(e) => setResultat(e.target.value as BattleRecord['resultat'])}>
            <option value="victoire">{t('bataille.victory')}</option>
            <option value="defaite">{t('bataille.defeat')}</option>
            <option value="nul">{t('bataille.draw')}</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>{t('bataille.opponentBands')}</label>
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.4rem' }}>
          {adversaires.map((nom, i) => (
            <span key={i} className="badge badge--info">
              {nom}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
                onClick={() => setAdversaires((prev) => prev.filter((_, j) => j !== i))}
              >
                <Icon name="croixPack" />
              </button>
            </span>
          ))}
          {adversaires.length === 0 && <span className="text-muted text-sm">{t('bataille.none')}</span>}
        </div>
        <div className="flex gap-sm">
          <input
            value={nouvelAdversaire}
            onChange={(e) => setNouvelAdversaire(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                ajouterAdversaire();
              }
            }}
            placeholder={t('bataille.opponentPlaceholder')}
          />
          <button className="btn" onClick={ajouterAdversaire}>
            {t('bataille.add')}
          </button>
        </div>
      </div>
      <div className="field">
        <label>{t('bataille.notes')}</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {bataille?.journal && (
        <div className="card card--tight" style={{ marginBottom: '0.7rem' }}>
          <p className="text-sm mb-0">
            <strong>{t('bataille.journalTitle')}</strong>
          </p>
          <p className="text-sm mb-0" style={{ marginTop: '0.4rem' }}>
            {t('bataille.wyrdstoneFound')} {bataille.journal.wyrdstoneTrouve} · {t('bataille.sold')}{' '}
            {bataille.journal.quantiteVendue} {t('bataille.for')} {bataille.journal.prixVente} {t('creation.gc')}
          </p>
          <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
            {t('bataille.treasuryAfter')} {bataille.journal.tresorerieApres} {t('creation.gc')}
          </p>
          {bataille.journal.notesExploration && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              {t('bataille.exploration')} {bataille.journal.notesExploration}
            </p>
          )}
          {bataille.journal.soldeFrancsTireurs > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              {t('bataille.hiredSwordBalance')} {bataille.journal.soldeFrancsTireurs} {t('creation.gc')}
            </p>
          )}
          {bataille.journal.blessures.length > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>{t('bataille.seriousInjuries')}</strong>{' '}
              {bataille.journal.blessures.map((b) => `${b.nom} — ${b.description}`).join(' · ')}
            </p>
          )}
          {bataille.journal.survie.length > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>{t('bataille.survival')}</strong>{' '}
              {bataille.journal.survie
                .map((s) => `${s.nom} (${s.survecu ? t('bataille.survived') : t('bataille.notSurvived')})`)
                .join(', ')}
            </p>
          )}
          {bataille.journal.pointsVeteran > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>{t('bataille.veteranPoints')}</strong> {bataille.journal.pointsVeteran}
            </p>
          )}
          {bataille.journal.avancesResolues && bataille.journal.avancesResolues.length > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>{t('bataille.advancesResolved')}</strong>{' '}
              {bataille.journal.avancesResolues.map((a) => `${a.nom} — ${a.detail}`).join(' · ')}
            </p>
          )}
          {bataille.journal.blesses && bataille.journal.blesses.length > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>{t('bataille.stayedAtCamp')}</strong>{' '}
              {bataille.journal.blesses
                .map((b) => `${b.nom} ${t('bataille.spentTurnInjured')}${b.retabli ? t('bataille.recovered') : ''}.`)
                .join(' ')}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          {t('bataille.cancel')}
        </button>
        {onDelete && (
          <button className="btn btn--danger" onClick={onDelete}>
            {t('bataille.delete')}
          </button>
        )}
        <button className="btn btn--primary" onClick={confirmer}>
          {bataille ? t('bataille.save') : t('bataille.add')}
        </button>
      </div>
    </Modal>
  );
}
