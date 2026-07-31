import { useState } from 'react';
import type { RosterInstance, BattleRecord } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import { inventaireComplet } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { useLanguage } from '../../state/useLanguage';

type EtapeResultatProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  date: string;
  onDateChange: (v: string) => void;
  resultat: BattleRecord['resultat'];
  onResultatChange: (v: BattleRecord['resultat']) => void;
  adversaires: string[];
  onAdversairesChange: (v: string[]) => void;
  nouvelAdversaire: string;
  onNouvelAdversaireChange: (v: string) => void;
  notesBataille: string;
  onNotesBatailleChange: (v: string) => void;
  // Objet de récompense de scénario ajouté gratuitement au stock de la
  // bande (voir ajouterAuStock dans PostBatailleScreen), indépendamment de
  // la validation finale de l'assistant — même mécanisme que les objets
  // trouvés à l'exploration.
  onAchatStock: (item: ShopItem, coutPaye: number) => void;
  // Or de récompense de scénario, ajouté immédiatement à la trésorerie (voir
  // ajouterOrExploration dans PostBatailleScreen) — même mécanisme.
  onArgentGagne: (montant: number) => void;
};

export function EtapeResultat({
  roster,
  catalogue,
  date,
  onDateChange,
  resultat,
  onResultatChange,
  adversaires,
  onAdversairesChange,
  nouvelAdversaire,
  onNouvelAdversaireChange,
  notesBataille,
  onNotesBatailleChange,
  onAchatStock,
  onArgentGagne,
}: EtapeResultatProps) {
  const { t } = useLanguage();
  const [modalRecompense, setModalRecompense] = useState(false);
  const [argentSaisi, setArgentSaisi] = useState('');
  const [objetsRecompense, setObjetsRecompense] = useState<{ nom: string; valeur: number }[]>([]);
  const ajouterObjetRecompense = (item: ShopItem, coutPaye: number) => {
    onAchatStock(item, coutPaye);
    setObjetsRecompense((prev) => [...prev, { nom: item.nom, valeur: coutPaye }]);
  };
  const ajouterAdversaire = () => {
    const nom = nouvelAdversaire.trim();
    if (!nom || adversaires.includes(nom)) return;
    onAdversairesChange([...adversaires, nom]);
    onNouvelAdversaireChange('');
  };
  const ajouterArgent = () => {
    const montant = Math.trunc(Number(argentSaisi));
    if (!Number.isFinite(montant) || montant <= 0) return;
    onArgentGagne(montant);
    setArgentSaisi('');
  };

  return (
    <div className="card">
      <h3>{t('resultat.title')}</h3>
      <div className="field-row">
        <div className="field">
          <label>{t('resultat.dateLabel')}</label>
          <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
        </div>
        <div className="field">
          <label>{t('resultat.resultLabel')}</label>
          <select value={resultat} onChange={(e) => onResultatChange(e.target.value as BattleRecord['resultat'])}>
            <option value="victoire">{t('resultat.victory')}</option>
            <option value="defaite">{t('resultat.defeat')}</option>
            <option value="nul">{t('resultat.draw')}</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>{t('resultat.opponentBands')}</label>
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.4rem' }}>
          {adversaires.map((nom, i) => (
            <span key={i} className="badge badge--info">
              {nom}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
                onClick={() => onAdversairesChange(adversaires.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </span>
          ))}
          {adversaires.length === 0 && <span className="text-muted text-sm">{t('resultat.none')}</span>}
        </div>
        <div className="flex gap-sm">
          <input
            value={nouvelAdversaire}
            onChange={(e) => onNouvelAdversaireChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                ajouterAdversaire();
              }
            }}
            placeholder={t('resultat.opponentNamePlaceholder')}
          />
          <button className="btn" onClick={ajouterAdversaire}>
            {t('resultat.add')}
          </button>
        </div>
      </div>
      <div className="field">
        <label>{t('resultat.notesLabel')}</label>
        <textarea value={notesBataille} onChange={(e) => onNotesBatailleChange(e.target.value)} />
      </div>

      <h3>{t('resultat.scenarioRewardTitle')}</h3>
      <p className="text-sm text-muted">{t('resultat.scenarioRewardIntro')}</p>
      {objetsRecompense.length > 0 && (
        <ul className="text-sm" style={{ margin: '0 0 0.6rem', paddingLeft: '1.1rem' }}>
          {objetsRecompense.map((o, i) => (
            <li key={i}>
              {o.nom} <span className="text-muted">({t('resultat.goldPo', { n: o.valeur })})</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-sm items-end">
        <button className="btn btn--primary" onClick={() => setModalRecompense(true)}>
          {t('resultat.itemButton')}
        </button>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>{t('resultat.goldEarnedLabel')}</label>
          <div className="flex gap-sm">
            <input
              type="number"
              min={0}
              value={argentSaisi}
              onChange={(e) => setArgentSaisi(e.target.value)}
              placeholder="0"
              style={{ maxWidth: '8rem' }}
            />
            <button className="btn" disabled={!argentSaisi.trim()} onClick={ajouterArgent}>
              {t('resultat.add')}
            </button>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted mb-0">{t('resultat.currentTreasury', { n: roster.tresorerie })}</p>

      {modalRecompense && catalogue && (
        <AchatEquipementModal
          catalogue={catalogue}
          profil={null}
          tresorerie={roster.tresorerie}
          inventaireBande={inventaireComplet(roster)}
          gratuit
          onClose={() => setModalRecompense(false)}
          onAchat={ajouterObjetRecompense}
        />
      )}
    </div>
  );
}
