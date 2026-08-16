import { useState } from 'react';
import type { RosterInstance, BattleRecord } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import { Icon } from '../common/Icon';
import { inventaireComplet } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { getItem } from '../../data/items';
import { translateItem } from '../../i18n/data/items';
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
  const { t, language } = useLanguage();
  const [modalRecompense, setModalRecompense] = useState(false);
  const [argentSaisi, setArgentSaisi] = useState('');
  const [objetsRecompense, setObjetsRecompense] = useState<{ id: string; nom: string; valeur: number }[]>([]);
  const ajouterObjetRecompense = (item: ShopItem, coutPaye: number) => {
    onAchatStock(item, coutPaye);
    setObjetsRecompense((prev) => [...prev, { id: item.id, nom: item.nom, valeur: coutPaye }]);
  };
  // Un objet du catalogue global se re-traduit à l'affichage (voir
  // translateItem) ; un objet personnalisé (texte libre saisi par le joueur)
  // n'existe qu'en français et s'affiche tel quel — même repli que partout
  // ailleurs dans l'app pour ce genre d'objet.
  const nomObjetRecompenseAffiche = (o: { id: string; nom: string }): string => {
    const ref = getItem(o.id);
    return ref ? translateItem(ref, language).nom : o.nom;
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
                <Icon name="croixPack" />
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
          <button className="btn--pack-pill-sm" onClick={ajouterAdversaire}>
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
              {nomObjetRecompenseAffiche(o)} <span className="text-muted">({t('resultat.goldPo', { n: o.valeur })})</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-sm items-end">
        <button className="btn--pack-pill-sm btn--pack-pill-sm--primary" onClick={() => setModalRecompense(true)}>
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
            <button className="btn--pack-pill-sm" disabled={!argentSaisi.trim()} onClick={ajouterArgent}>
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
