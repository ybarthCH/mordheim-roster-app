import { useState } from 'react';
import type { SeriousInjuryRecord } from '../../types/roster';
import {
  COUT_DOCTEUR,
  effetsTraitablesDocteur,
  estBlessureExplicitementIncurable,
  resultatDocteur,
  type ResultatDocteur,
} from '../../utils/docteur';
import { injuryLabel } from '../../utils/blessures';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';

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
        Quoi de neuf, Docteur ?
      </h3>
      <p className="text-sm text-muted" style={{ whiteSpace: 'pre-line' }}>
        <strong>{nomPersonnage}</strong>
        {'\n'}
        {injuryLabel(blessure)}
      </p>

      {applique ? (
        <>
          <div className="card card--tight" style={{ borderColor: 'var(--accent)' }}>
            <h4 className="mt-0 mb-0">{applique.titre}</h4>
            <p className="text-sm mb-0" style={{ marginTop: '0.4rem' }}>
              {applique.texte}
            </p>
          </div>
          <p className="text-success text-sm">Le résultat et ses effets ont été appliqués.</p>
          <button className="btn btn--primary btn--block" onClick={onClose}>
            Fermer
          </button>
        </>
      ) : !estHeros ? (
        <>
          <p className="text-muted">Seuls les Héros peuvent être envoyés chez le docteur.</p>
          <button className="btn btn--block" onClick={onClose}>
            Fermer
          </button>
        </>
      ) : effets.length === 0 ? (
        <>
          <p className="text-muted">
            {estBlessureExplicitementIncurable(blessure)
              ? "Cette blessure fait partie des handicaps que le docteur ne peut pas traiter : ses effets sont permanents."
              : blessure.soignee || blessure.effets?.some((effet) => effet.traitee)
                ? 'Cette blessure a déjà été traitée et ne présente plus aucun effet soignable.'
                : "Cette blessure ne figure pas parmi les traitements prévus par les règles du docteur."}
          </p>
          {blessure.historique_docteur?.map((tentative, index) => (
            <p key={`${tentative.date}-${index}`} className="text-sm mb-0">
              {tentative.date} — 2D6 = {tentative.jet} : <strong>{tentative.titre}</strong> — {tentative.texte}
            </p>
          ))}
          <button className="btn btn--block" style={{ marginTop: '1rem' }} onClick={onClose}>
            Fermer
          </button>
        </>
      ) : (
        <>
          <p className="text-sm">
            Une consultation coûte <strong>{COUT_DOCTEUR} po</strong>, payées avant le jet. Elle remplace la recherche
            d'un objet rare de ce Héros et ne peut viser qu'une seule blessure pendant cette séquence
            d'après-bataille.
          </p>
          <p className="text-sm text-muted">
            L'application ne lance aucun dé : saisis le total de tes 2D6, puis elle appliquera le résultat.
          </p>

          {effets.length > 1 && (
            <div className="field">
              <label>Blessure à traiter</label>
              <select
                value={blessure.docteur_effet_en_attente ?? effetChoisi}
                disabled={consultationPayee}
                onChange={(e) => setEffetChoisi(e.target.value)}
              >
                {effets.map((effet) => (
                  <option key={effet.id} value={effet.id}>
                    {effet.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!consultationPayee ? (
            <>
              <p className="text-sm text-muted">Trésorerie disponible : {tresorerie} po.</p>
              {tresorerie < COUT_DOCTEUR && (
                <p className="text-danger text-sm">Il manque {COUT_DOCTEUR - tresorerie} po pour payer le docteur.</p>
              )}
              <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                <button className="btn" onClick={onClose}>
                  Annuler
                </button>
                <button
                  className="btn btn--primary"
                  disabled={!effetActif || tresorerie < COUT_DOCTEUR}
                  onClick={() => effetActif && onPayer(effetActif.id)}
                >
                  Payer {COUT_DOCTEUR} po et commencer
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-success text-sm">Consultation payée. Le résultat peut être saisi maintenant ou plus tard.</p>
              <div className="field">
                <label>Résultat total des 2D6</label>
                <select value={jetSaisi} onChange={(e) => setJetSaisi(e.target.value)}>
                  <option value="">Choisis le résultat obtenu…</option>
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
                  Fermer et saisir plus tard
                </button>
                <button className="btn btn--primary" disabled={!resultat} onClick={appliquer}>
                  Appliquer le résultat
                </button>
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
