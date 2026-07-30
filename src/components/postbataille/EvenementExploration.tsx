import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { TABLE_EXPLORATION_EVENEMENTS } from '../../data/tableExplorationEvenements';
import type {
  EvenementExploration as Evenement,
  LigneSousTableD6,
  PalierExploration,
} from '../../data/tableExplorationEvenements';
import type { ShopItem } from '../../utils/shop';
import { JetOrButton } from './JetOrButton';
import { AjouterObjetTrouveButton } from './AjouterObjetTrouveButton';
import { LigneTresorRow } from './LigneTresorRow';
import { ResolutionPuits } from './ResolutionPuits';
import { ResolutionLaFosse } from './ResolutionLaFosse';
import { ResolutionVagabond } from './ResolutionVagabond';
import { ResolutionTaverne } from './ResolutionTaverne';
import { ResolutionPrisonniers } from './ResolutionPrisonniers';
import { ResolutionDebiteurReconnaissant } from './ResolutionDebiteurReconnaissant';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  date: string;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterOr: (montant: number) => void;
  // Ajoute directement un objet trouvé au stock de la bande, gratuitement,
  // sans passer par la liste d'achat (voir LigneSousTableD6.objets).
  onAchatStockMultiple: (item: ShopItem, coutPaye: number, quantite: number) => void;
  onAjouterAuJournal: (texte: string) => void;
  onOuvrirArtefacts: () => void;
};

// Événements ayant leur propre résolution interactive (composant dédié,
// gain d'or/objet automatisable, ou sous-table à seuils) — sert à savoir si
// la sélection d'une face doit attendre l'action finale avant de s'inscrire
// au journal, ou si elle doit s'y inscrire tout de suite faute d'autre
// occasion (événement purement narratif, ex : Catacombes).
const EVENEMENTS_AVEC_COMPOSANT = new Set([
  'puits',
  'la_fosse',
  'vagabond',
  'taverne',
  'prisonniers',
  'debiteur_reconnaissant',
]);

function evenementAUneResolution(ev: Evenement): boolean {
  if (ev.or || ev.artefactMagique) return true;
  if (ev.sousTable?.some((l) => l.or || l.objets)) return true;
  if (ev.sousTableTresor?.length) return true;
  return EVENEMENTS_AVEC_COMPOSANT.has(ev.id);
}

export function EvenementExploration({
  roster,
  catalogue,
  date,
  onMajRoster,
  onAjouterOr,
  onAchatStockMultiple,
  onAjouterAuJournal,
  onOuvrirArtefacts,
}: Props) {
  const [palierId, setPalierId] = useState<PalierExploration['id'] | ''>('');
  const [face, setFace] = useState<number | ''>('');
  const [jetSousTable, setJetSousTable] = useState('');

  const palier = TABLE_EXPLORATION_EVENEMENTS.find((p) => p.id === palierId) ?? null;
  const evenement: Evenement | null =
    palier && face !== '' ? (palier.evenements.find((e) => e.face === face) ?? null) : null;
  const jetSousTableNombre = Number(jetSousTable);
  const ligneSousTable =
    evenement?.sousTable?.find((l) => jetSousTableNombre >= l.min && jetSousTableNombre <= l.max) ?? null;

  const changerPalier = (id: PalierExploration['id'] | '') => {
    setPalierId(id);
    setFace('');
    setJetSousTable('');
  };

  const changerFace = (f: number) => {
    const nouveau = face === f ? '' : f;
    if (nouveau !== '') {
      const ev = palier?.evenements.find((e) => e.face === f);
      // Consigné tout de suite seulement si l'événement n'a aucune action à
      // accomplir ensuite (purement narratif) — sinon, c'est cette dernière
      // action qui inscrit l'entrée de journal (voir ajouterOr/ajouterObjet
      // ci-dessous et les composants de résolution dédiés).
      if (ev && !evenementAUneResolution(ev)) onAjouterAuJournal(ev.nom);
    }
    setFace(nouveau);
    setJetSousTable('');
  };

  const ajouterOr = (notation: string, nomLigne: string, valeur: number) => {
    if (!evenement) return;
    onAjouterOr(valeur);
    onAjouterAuJournal(`${evenement.nom}${nomLigne ? ` — ${nomLigne}` : ''} : +${valeur} po (${notation}).`);
  };

  const ajouterObjet = (nomLigne: string, item: ShopItem, quantite: number) => {
    if (!evenement) return;
    onAchatStockMultiple(item, 0, quantite);
    onAjouterAuJournal(
      `${evenement.nom}${nomLigne ? ` — ${nomLigne}` : ''} : ${item.nom}${quantite > 1 ? ` ×${quantite}` : ''} ajouté(e) au stock.`
    );
  };

  const ajouterFragments = (nomLigne: string, notation: string, valeur: number) => {
    if (!evenement) return;
    onMajRoster({ wyrdstone: roster.wyrdstone + valeur });
    onAjouterAuJournal(
      `${evenement.nom}${nomLigne ? ` — ${nomLigne}` : ''} : +${valeur} fragment${valeur > 1 ? 's' : ''} de pierre magique (${notation}).`
    );
  };

  const selectionnerLigneSousTable = (ligne: LigneSousTableD6) => {
    const deselection = ligneSousTable === ligne;
    setJetSousTable(deselection ? '' : String(ligne.min));
    // Résultat sans aucune action possible (ex : butin narratif à revendre à
    // un prix spécial) : on consigne au moment de la sélection, faute
    // d'autre occasion de le faire.
    if (!deselection && evenement && !ligne.or && !ligne.objets) {
      onAjouterAuJournal(`${evenement.nom} — ${ligne.resultat}`);
    }
  };

  return (
    <div className="card card--tight" style={{ marginBottom: '0.8rem' }}>
      <h3 className="mt-0">Résoudre un événement (double, triple…)</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        Si ton jet d'exploration comporte un double, triple, quadruple, quintuple ou sextuple, sélectionne-le ici
        pour consulter l'événement correspondant sans rouvrir le livret.
      </p>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        {TABLE_EXPLORATION_EVENEMENTS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`btn btn--sm ${palierId === p.id ? 'btn--primary' : ''}`}
            onClick={() => changerPalier(palierId === p.id ? '' : p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {palier && (
        <div className="dice-choice-grid" style={{ marginBottom: '0.6rem' }}>
          {palier.evenements.map((e) => (
            <button
              key={e.face}
              type="button"
              className={`dice-choice${face === e.face ? ' dice-choice--active' : ''}`}
              onClick={() => changerFace(e.face)}
            >
              <span className="dice-choice__range">{Array(palier.nombreDes).fill(e.face).join(' ')}</span>
              <span className="dice-choice__value" style={{ fontSize: '0.8rem' }}>
                {e.nom}
              </span>
            </button>
          ))}
        </div>
      )}

      {evenement && (
        <div className="card" style={{ marginTop: '0.4rem' }}>
          <h4 className="mt-0 mb-0">{evenement.nom}</h4>
          <p className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
            {evenement.texte}
          </p>
          {evenement.regle.map((paragraphe, i) => (
            <p key={i} className="text-sm">
              {paragraphe}
            </p>
          ))}

          {evenement.or && (
            <JetOrButton
              label={`Jet obtenu (${evenement.or}) :`}
              onValider={(valeur) => ajouterOr(evenement.or!, '', valeur)}
            />
          )}

          {evenement.id === 'puits' && (
            <ResolutionPuits roster={roster} onMajRoster={onMajRoster} onAjouterAuJournal={onAjouterAuJournal} />
          )}

          {evenement.id === 'la_fosse' && (
            <ResolutionLaFosse
              roster={roster}
              date={date}
              onMajRoster={onMajRoster}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'vagabond' && (
            <ResolutionVagabond
              roster={roster}
              catalogue={catalogue}
              onMajRoster={onMajRoster}
              onAjouterOr={onAjouterOr}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'taverne' && (
            <ResolutionTaverne
              roster={roster}
              catalogue={catalogue}
              onAjouterOr={onAjouterOr}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'prisonniers' && (
            <ResolutionPrisonniers
              roster={roster}
              catalogue={catalogue}
              onMajRoster={onMajRoster}
              onAjouterOr={onAjouterOr}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'debiteur_reconnaissant' && (
            <ResolutionDebiteurReconnaissant
              roster={roster}
              onMajRoster={onMajRoster}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.artefactMagique && (
            <button className="btn btn--sm" style={{ marginTop: '0.5rem' }} onClick={onOuvrirArtefacts}>
              Ouvrir le Tableau des artefacts magiques
            </button>
          )}

          {evenement.sousTable && (
            <div style={{ marginTop: '0.6rem' }}>
              <p className="text-sm text-muted" style={{ marginBottom: '0.4rem' }}>
                Sélectionne le résultat obtenu sur le D6 :
              </p>
              <div className="table-scroll">
                <table className="table-reference table-reference--clickable">
                  <tbody>
                    {evenement.sousTable.map((ligne, i) => (
                      <tr
                        key={i}
                        className={ligneSousTable === ligne ? 'table-reference__row-active' : undefined}
                        onClick={() => selectionnerLigneSousTable(ligne)}
                      >
                        <td>{ligne.min === ligne.max ? ligne.min : `${ligne.min}-${ligne.max}`}</td>
                        <td>{ligne.resultat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {ligneSousTable?.or && (
                <JetOrButton
                  label={`Jet or (${ligneSousTable.or}) :`}
                  onValider={(valeur) => ajouterOr(ligneSousTable.or!, ligneSousTable.resultat, valeur)}
                />
              )}
              {ligneSousTable?.objets && (
                <div style={{ marginTop: '0.3rem' }}>
                  {ligneSousTable.objets.map((objet, i) => (
                    <AjouterObjetTrouveButton
                      key={i}
                      ligneObjet={objet}
                      catalogueId={catalogue.id}
                      onAjouter={(item, quantite) => ajouterObjet(ligneSousTable.resultat, item, quantite)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {evenement.sousTableTresor && (
            <div className="table-scroll" style={{ marginTop: '0.6rem' }}>
              <table className="table-reference">
                <thead>
                  <tr>
                    <th>Élément</th>
                    <th>Résultat requis</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {evenement.sousTableTresor.map((ligne) => (
                    <LigneTresorRow
                      key={ligne.element}
                      ligne={ligne}
                      catalogueId={catalogue.id}
                      onAjouterOr={ajouterOr}
                      onAjouterObjet={ajouterObjet}
                      onAjouterFragments={ajouterFragments}
                      onOuvrirArtefacts={onOuvrirArtefacts}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
