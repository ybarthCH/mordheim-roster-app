import { useState } from 'react';
import type { Stats } from '../../types/catalog';
import {
  RECOMPENSES_SEIGNEUR_DES_OMBRES,
  TABLE_MUTATIONS_ITEM_IDS,
  type ResultatSeigneurDesOmbres,
} from '../../data/recompensesSeigneurDesOmbres';
import { getItem } from '../../data/items';
import { STAT_KEYS } from '../../types/catalog';
import { Icon, type IconName } from '../common/Icon';

const ICONE: Partial<Record<string, IconName>> = {
  colere: 'crane',
  mutation: 'goutte',
  armure_chaos: 'bouclier',
  arme_demon: 'epee',
  possede: 'etoile',
};

export type RecompenseResultat = {
  nom: string;
  texte: string;
  // Modification directe des caractéristiques du guerrier (résultats
  // "Mutation" ratée et "Possédé !") — distincte de objetStatsDelta.
  statsDelta: Partial<Record<keyof Stats, number>>;
  // "Possédé !" dépasse les maximums raciaux : appliqué sans passer par le
  // contrôle de plafond habituel d'une avancée normale.
  ignorePlafond: boolean;
  statutMort: boolean;
  // Ids de compétences à retirer (résultat "Possédé !", D3 au choix).
  competencesRetirees: string[];
  // Objet gratuit accordé (mutation choisie, Armure du Chaos, arme démon
  // improvisée) — ajouté à l'inventaire du membre à coût 0.
  objetGratuit?: { item_id: string; nom: string; categorie: string; texte?: string };
  objetStatsDelta?: Partial<Record<keyof Stats, number>>;
};

type Mode =
  | 'liste'
  | 'mutation_d6'
  | 'perte_carac'
  | 'choix_mutation'
  | 'nom_arme'
  | 'roll_d3'
  | 'choix_competences'
  | 'confirmation';

type Props = {
  nomPersonnage: string;
  // Compétences actuellement acquises par le membre (pour le résultat
  // "Possédé !", qui en retire D3 au choix du joueur).
  competencesAcquises: string[];
  nomCompetence: (id: string) => string;
  onAppliquer: (resultat: RecompenseResultat) => void;
  onAnnuler?: () => void;
};

export function RecompenseSeigneurDesOmbresWizard({
  nomPersonnage,
  competencesAcquises,
  nomCompetence,
  onAppliquer,
  onAnnuler,
}: Props) {
  const [mode, setMode] = useState<Mode>('liste');
  const [selectionId, setSelectionId] = useState('');
  const [resultatFinal, setResultatFinal] = useState<RecompenseResultat | null>(null);
  const [nomArmeSaisi, setNomArmeSaisi] = useState('');
  const [nombreCompetencesAPerdre, setNombreCompetencesAPerdre] = useState(0);
  const [competencesChoisies, setCompetencesChoisies] = useState<string[]>([]);

  const selection = RECOMPENSES_SEIGNEUR_DES_OMBRES.find((r) => r.id === selectionId) ?? null;

  const iconePour = (r: ResultatSeigneurDesOmbres): IconName => ICONE[r.id] ?? 'flamme';

  const terminer = (partiel: Partial<RecompenseResultat>) => {
    if (!selection) return;
    setResultatFinal({
      nom: selection.nom,
      texte: selection.texte,
      statsDelta: {},
      ignorePlafond: false,
      statutMort: false,
      competencesRetirees: [],
      ...partiel,
    });
    setMode('confirmation');
  };

  const validerSelection = () => {
    if (!selection) return;
    if (selection.id === 'colere') {
      terminer({ statutMort: true });
    } else if (selection.id === 'rien') {
      terminer({});
    } else if (selection.id === 'mutation') {
      setMode('mutation_d6');
    } else if (selection.id === 'armure_chaos') {
      const item = getItem('armure_du_chaos_market');
      terminer({
        objetGratuit: { item_id: 'armure_du_chaos_market', nom: item?.nom ?? 'Armure du Chaos', categorie: 'armures' },
      });
    } else if (selection.id === 'arme_demon') {
      setMode('nom_arme');
    } else if (selection.id === 'possede') {
      setMode('roll_d3');
    }
  };

  const choisirGraviteMutation = (jet: number) => {
    if (jet === 1) {
      setMode('perte_carac');
    } else {
      setMode('choix_mutation');
    }
  };

  const choisirPerteCarac = (stat: keyof Stats) => {
    terminer({ statsDelta: { [stat]: -1 } });
  };

  const choisirMutation = (itemId: string) => {
    const item = getItem(itemId);
    if (!item) return;
    const statsDelta = 'stats_delta' in item ? item.stats_delta : undefined;
    terminer({
      objetGratuit: { item_id: itemId, nom: item.nom, categorie: 'divers' },
      objetStatsDelta: statsDelta,
    });
  };

  const confirmerNomArme = () => {
    const nom = nomArmeSaisi.trim() || 'Arme démon';
    terminer({
      objetGratuit: {
        item_id: `arme_demon_${Date.now()}`,
        nom,
        categorie: 'special',
        texte: 'Arme démon : +1 en Force au corps à corps et +1 pour toucher avec cette arme.',
      },
    });
  };

  const choisirD3 = (n: number) => {
    setNombreCompetencesAPerdre(n);
    setCompetencesChoisies([]);
    setMode('choix_competences');
  };

  const toggleCompetenceChoisie = (id: string) => {
    setCompetencesChoisies((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= nombreCompetencesAPerdre) return prev;
      return [...prev, id];
    });
  };

  const confirmerPossede = () => {
    terminer({
      statsDelta: { CC: 1, F: 1, A: 1, PV: 1 },
      ignorePlafond: true,
      competencesRetirees: competencesChoisies,
    });
  };

  if (mode === 'liste') {
    return (
      <div>
        <p className="text-sm text-muted" style={{ marginTop: 0 }}>
          Lance 2D6 sur ta table papier, puis sélectionne le résultat obtenu pour {nomPersonnage}.
        </p>
        <div className="field">
          <label>Résultat obtenu</label>
          <select value={selectionId} onChange={(e) => setSelectionId(e.target.value)}>
            <option value="" disabled>
              Choisis un résultat…
            </option>
            {RECOMPENSES_SEIGNEUR_DES_OMBRES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.min === r.max ? r.min : `${r.min}-${r.max}`} — {r.nom}
              </option>
            ))}
          </select>
        </div>
        {selection && <p className="text-sm text-muted">{selection.texte}</p>}
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          {onAnnuler && (
            <button className="btn" onClick={onAnnuler}>
              Annuler
            </button>
          )}
          <button className="btn btn--primary" disabled={!selection} onClick={validerSelection}>
            Continuer
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'mutation_d6') {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name="goutte" style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          Mutation
        </h4>
        <p className="text-sm text-muted">
          Lance 1D6 : sur un 1, une caractéristique diminue ; sur 2 ou plus, choisis une mutation.
        </p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} className="btn" onClick={() => choisirGraviteMutation(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            ‹ Retour
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'perte_carac') {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>Atrophie</h4>
        <p className="text-sm text-muted">Choisis la caractéristique qui perd 1 point.</p>
        <div className="flex flex-wrap gap-sm">
          {STAT_KEYS.map((k) => (
            <button key={k} className="btn" onClick={() => choisirPerteCarac(k)}>
              -1 {k}
            </button>
          ))}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('mutation_d6')}>
            ‹ Retour
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'choix_mutation') {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>Choisis une mutation (gratuite)</h4>
        <div className="skill-list">
          {TABLE_MUTATIONS_ITEM_IDS.map((itemId) => {
            const item = getItem(itemId);
            if (!item) return null;
            return (
              <label key={itemId} className="skill-check" style={{ cursor: 'pointer' }}>
                <input type="radio" name="mutation" onChange={() => choisirMutation(itemId)} />
                <span>
                  <span className="skill-check__name">{item.nom}</span>
                  <br />
                  <span className="skill-check__text">
                    {item.regles_speciales?.map((r) => r.texte).join(' ') ?? item.texte}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('mutation_d6')}>
            ‹ Retour
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'nom_arme') {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name="epee" style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          Arme démon
        </h4>
        <p className="text-sm text-muted">
          +1 en Force au corps à corps et +1 pour toucher avec cette arme. Choisis-en la forme (épée, hache…) — sans
          effet mécanique, juste pour le nom.
        </p>
        <div className="field">
          <label>Nom de l'arme</label>
          <input
            value={nomArmeSaisi}
            onChange={(e) => setNomArmeSaisi(e.target.value)}
            placeholder="ex : Épée démoniaque"
            autoFocus
          />
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            ‹ Retour
          </button>
          <button className="btn btn--primary" onClick={confirmerNomArme}>
            Confirmer
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'roll_d3') {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name="etoile" style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          Possédé !
        </h4>
        <p className="text-sm text-muted">
          +1 CC, +1 F, +1 Attaque, +1 PV (au-delà des maximums). Lance 1D3 : combien de compétences le guerrier
          perd-il ?
        </p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3].map((n) => (
            <button key={n} className="btn" onClick={() => choisirD3(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            ‹ Retour
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'choix_competences') {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          Choisis {nombreCompetencesAPerdre} compétence{nombreCompetencesAPerdre > 1 ? 's' : ''} à perdre
        </h4>
        {competencesAcquises.length === 0 ? (
          <p className="text-sm text-muted">Ce guerrier n'a aucune compétence à perdre.</p>
        ) : (
          <div className="skill-list">
            {competencesAcquises.map((id) => (
              <label key={id} className="skill-check" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={competencesChoisies.includes(id)}
                  onChange={() => toggleCompetenceChoisie(id)}
                  disabled={!competencesChoisies.includes(id) && competencesChoisies.length >= nombreCompetencesAPerdre}
                />
                <span className="skill-check__name">{nomCompetence(id)}</span>
              </label>
            ))}
          </div>
        )}
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('roll_d3')}>
            ‹ Retour
          </button>
          <button className="btn btn--primary" onClick={confirmerPossede}>
            Confirmer
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'confirmation' && resultatFinal && selection) {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePour(selection)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {resultatFinal.nom}
        </h4>
        <p className="text-sm text-muted">{resultatFinal.texte}</p>
        {Object.entries(resultatFinal.statsDelta).length > 0 && (
          <p className="text-sm mb-0">
            <strong>Caractéristiques :</strong>{' '}
            {Object.entries(resultatFinal.statsDelta)
              .map(([k, v]) => `${v! > 0 ? '+' : ''}${v} ${k}`)
              .join(', ')}
            {resultatFinal.ignorePlafond && ' (au-delà des maximums)'}
          </p>
        )}
        {resultatFinal.objetGratuit && (
          <p className="text-sm mb-0">
            <strong>Objet obtenu :</strong> {resultatFinal.objetGratuit.nom}
          </p>
        )}
        {resultatFinal.competencesRetirees.length > 0 && (
          <p className="text-sm mb-0">
            <strong>Compétences perdues :</strong>{' '}
            {resultatFinal.competencesRetirees.map((id) => nomCompetence(id)).join(', ')}
          </p>
        )}
        {resultatFinal.statutMort && <p className="text-danger">⚠ Ce guerrier sera retiré de la bande (Mort).</p>}
        <button className="btn btn--primary btn--block" style={{ marginTop: '0.8rem' }} onClick={() => onAppliquer(resultatFinal)}>
          Appliquer
        </button>
      </div>
    );
  }

  return null;
}
