import { useState } from 'react';
import { STAT_KEYS } from '../../types/catalog';
import type { Stats } from '../../types/catalog';
import type { CustomItem } from '../../types/roster';
import { CATEGORIE_ORDRE, libelleCategorie } from '../../utils/shop';

type CustomItemFormValue = Omit<CustomItem, 'id'>;

type Props = {
  titre: string;
  initial?: CustomItemFormValue;
  onEnregistrer: (item: CustomItemFormValue) => void;
  onAnnuler: () => void;
  // Présent uniquement en édition d'un objet officiel actuellement
  // surchargé pour cette bande : retire la surcharge et revient aux
  // valeurs du catalogue.
  onRevert?: () => void;
};

const VIDE: CustomItemFormValue = {
  nom: '',
  categorie: CATEGORIE_ORDRE[0],
  cout: 0,
  cout_fixe: true,
  rarete: '',
  disponibilite: '',
  texte: '',
  stats_delta: {},
};

export function CustomItemForm({ titre, initial, onEnregistrer, onAnnuler, onRevert }: Props) {
  const depart = initial ?? VIDE;
  const [nom, setNom] = useState(depart.nom);
  const [categorie, setCategorie] = useState(depart.categorie);
  const [coutFixe, setCoutFixe] = useState(depart.cout_fixe);
  const [coutSaisi, setCoutSaisi] = useState(String(depart.cout));
  const [rarete, setRarete] = useState(depart.rarete ?? '');
  const [disponibilite, setDisponibilite] = useState(depart.disponibilite ?? '');
  const [texte, setTexte] = useState(depart.texte ?? '');
  const [statsDelta, setStatsDelta] = useState<Partial<Record<keyof Stats, string>>>(
    Object.fromEntries(STAT_KEYS.map((k) => [k, depart.stats_delta?.[k] ? String(depart.stats_delta[k]) : '']))
  );

  const nomValide = nom.trim() !== '';
  const coutValide =
    coutSaisi.trim() !== '' && (coutFixe ? !Number.isNaN(Number(coutSaisi)) : true);

  const enregistrer = () => {
    if (!nomValide || !coutValide) return;
    const delta: Partial<Record<keyof Stats, number>> = {};
    for (const k of STAT_KEYS) {
      const v = statsDelta[k];
      if (v && v.trim() !== '' && Number(v) !== 0) delta[k] = Number(v);
    }
    onEnregistrer({
      nom: nom.trim(),
      categorie,
      cout: coutFixe ? Number(coutSaisi) : coutSaisi.trim(),
      cout_fixe: coutFixe,
      rarete: rarete.trim() || undefined,
      disponibilite: disponibilite.trim() || undefined,
      texte: texte.trim() || undefined,
      stats_delta: Object.keys(delta).length > 0 ? delta : undefined,
    });
  };

  return (
    <div className="achat-equipement__contenu">
      <h3 className="mt-0">{titre}</h3>

      <div className="field">
        <label>Nom</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom de l'objet" />
      </div>

      <div className="field">
        <label>Catégorie</label>
        <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
          {CATEGORIE_ORDRE.map((c) => (
            <option key={c} value={c}>
              {libelleCategorie(c)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Coût</label>
        <div className="flex gap-sm" style={{ marginBottom: '0.4rem' }}>
          <button
            type="button"
            className={`btn btn--sm ${coutFixe ? 'btn--primary' : ''}`}
            onClick={() => setCoutFixe(true)}
          >
            Prix fixe
          </button>
          <button
            type="button"
            className={`btn btn--sm ${!coutFixe ? 'btn--primary' : ''}`}
            onClick={() => setCoutFixe(false)}
          >
            Notation (dés)
          </button>
        </div>
        <input
          type={coutFixe ? 'number' : 'text'}
          min={coutFixe ? 0 : undefined}
          value={coutSaisi}
          onChange={(e) => setCoutSaisi(e.target.value)}
          placeholder={coutFixe ? 'ex : 25' : 'ex : 2D6+10'}
        />
      </div>

      <div className="field">
        <label>Rareté (optionnel)</label>
        <input value={rarete} onChange={(e) => setRarete(e.target.value)} placeholder="ex : 8" />
      </div>

      <div className="field">
        <label>Disponibilité (optionnel)</label>
        <input
          value={disponibilite}
          onChange={(e) => setDisponibilite(e.target.value)}
          placeholder="ex : Rare 8, jeteurs de sorts uniquement"
        />
      </div>

      <div className="field">
        <label>Effet / description (optionnel)</label>
        <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={3} />
      </div>

      <div className="field">
        <label>Modification permanente des caractéristiques (optionnel)</label>
        <div className="stat-grid">
          {STAT_KEYS.map((k) => (
            <div key={k} className="stat-grid__cell stat-grid__cell--label">
              {k}
            </div>
          ))}
          {STAT_KEYS.map((k) => (
            <div key={k} className="stat-grid__cell">
              <input
                type="number"
                value={statsDelta[k] ?? ''}
                onChange={(e) => setStatsDelta((prev) => ({ ...prev, [k]: e.target.value }))}
                style={{ width: '100%', textAlign: 'center' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-sm" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
        <button className="btn" onClick={onAnnuler}>
          Annuler
        </button>
        {onRevert && (
          <button className="btn btn--danger" onClick={onRevert}>
            Revenir aux valeurs du catalogue
          </button>
        )}
        <button className="btn btn--primary" disabled={!nomValide || !coutValide} onClick={enregistrer}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}
