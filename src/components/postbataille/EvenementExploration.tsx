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
import { ResolutionBatimentEcroule } from './ResolutionBatimentEcroule';
import { ResolutionEntreeCatacombes } from './ResolutionEntreeCatacombes';
import { ResolutionArene } from './ResolutionArene';
import { useLanguage } from '../../state/useLanguage';
import { translateEvenementExploration } from '../../i18n/data/explorationEvenements';
import { translateItem } from '../../i18n/data/items';

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
  'batiment_ecroule',
  'entree_catacombes_5',
  'arene',
]);

function evenementAUneResolution(ev: Evenement): boolean {
  if (ev.or || ev.artefactMagique) return true;
  if (ev.sousTable?.some((l) => l.or || l.objets || l.artefactMagique)) return true;
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
  const { t, language } = useLanguage();
  const [palierId, setPalierId] = useState<PalierExploration['id'] | ''>('');
  const [face, setFace] = useState<number | ''>('');
  const [jetSousTable, setJetSousTable] = useState('');

  const palier = TABLE_EXPLORATION_EVENEMENTS.find((p) => p.id === palierId) ?? null;
  const evenement: Evenement | null =
    palier && face !== '' ? (palier.evenements.find((e) => e.face === face) ?? null) : null;
  const evenementAffiche = evenement ? translateEvenementExploration(evenement, language) : null;
  const jetSousTableNombre = Number(jetSousTable);
  const ligneSousTable =
    evenement?.sousTable?.find((l) => jetSousTableNombre >= l.min && jetSousTableNombre <= l.max) ?? null;

  const changerPalier = (id: PalierExploration['id'] | '') => {
    setPalierId(id);
    setFace('');
    setJetSousTable('');
  };

  // Libellé (traduit) d'une ligne de sous-table, pour préfixer une entrée de
  // journal — même principe que `evenementAffiche` : cherché par index dans
  // `evenement.sousTable` plutôt que par référence, `ligneSousTable` pouvant
  // pointer sur l'objet brut (français) trouvé plus haut.
  const resultatAffiche = (ligne: LigneSousTableD6) => {
    const index = evenement?.sousTable?.indexOf(ligne) ?? -1;
    return (index >= 0 ? evenementAffiche?.sousTable?.[index]?.resultat : undefined) ?? ligne.resultat;
  };

  const prefixeJournal = (nomLigne: string) =>
    nomLigne ? `${evenementAffiche?.nom ?? ''} — ${nomLigne}` : (evenementAffiche?.nom ?? '');

  const changerFace = (f: number) => {
    const nouveau = face === f ? '' : f;
    if (nouveau !== '') {
      const ev = palier?.evenements.find((e) => e.face === f);
      // Consigné tout de suite seulement si l'événement n'a aucune action à
      // accomplir ensuite (purement narratif) — sinon, c'est cette dernière
      // action qui inscrit l'entrée de journal (voir ajouterOr/ajouterObjet
      // ci-dessous et les composants de résolution dédiés).
      if (ev && !evenementAUneResolution(ev)) onAjouterAuJournal(translateEvenementExploration(ev, language).nom);
    }
    setFace(nouveau);
    setJetSousTable('');
  };

  const ajouterOr = (notation: string, nomLigne: string, valeur: number) => {
    if (!evenement) return;
    onAjouterOr(valeur);
    onAjouterAuJournal(t('evenement.journalGold', { prefix: prefixeJournal(nomLigne), valeur, notation }));
  };

  const ajouterObjet = (nomLigne: string, item: ShopItem, quantite: number) => {
    if (!evenement) return;
    // Valeur de référence pour une revente future (voir ajouterAuStock dans
    // PostBatailleScreen) : le vrai prix de l'objet (règles optionnelles
    // déjà appliquées par itemVersShopItem), jamais 0 — l'objet est gratuit
    // pour la trésorerie (onAchatStockMultiple ne la touche jamais), pas
    // sans valeur.
    onAchatStockMultiple(item, typeof item.cout === 'number' ? item.cout : 0, quantite);
    onAjouterAuJournal(
      t('evenement.journalItemAdded', {
        prefix: prefixeJournal(nomLigne),
        item: translateItem(item, language).nom,
        quantitySuffix: quantite > 1 ? ` ×${quantite}` : '',
      })
    );
  };

  const ajouterFragments = (nomLigne: string, notation: string, valeur: number) => {
    if (!evenement) return;
    onMajRoster({ wyrdstone: roster.wyrdstone + valeur });
    onAjouterAuJournal(
      t('evenement.journalFragments', {
        prefix: prefixeJournal(nomLigne),
        valeur,
        notation,
        s: valeur > 1 ? 's' : '',
      })
    );
  };

  const selectionnerLigneSousTable = (ligne: LigneSousTableD6) => {
    const deselection = ligneSousTable === ligne;
    setJetSousTable(deselection ? '' : String(ligne.min));
    // Résultat sans aucune action possible (ex : butin narratif à revendre à
    // un prix spécial) : on consigne au moment de la sélection, faute
    // d'autre occasion de le faire.
    if (!deselection && evenement && !ligne.or && !ligne.objets && !ligne.artefactMagique) {
      onAjouterAuJournal(`${evenementAffiche?.nom ?? ''} — ${resultatAffiche(ligne)}`);
    }
  };

  return (
    <div className="card card--tight" style={{ marginBottom: '0.8rem' }}>
      <h3 className="mt-0">{t('evenement.resolveTitle')}</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        {t('evenement.intro')}
      </p>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        {TABLE_EXPLORATION_EVENEMENTS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`btn--pack-pill-sm ${palierId === p.id ? 'btn--pack-pill-sm--primary' : ''}`}
            onClick={() => changerPalier(palierId === p.id ? '' : p.id)}
          >
            {t(`evenement.tier.${p.id}`)}
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
                {translateEvenementExploration(e, language).nom}
              </span>
            </button>
          ))}
        </div>
      )}

      {evenement && evenementAffiche && (
        <div className="card" style={{ marginTop: '0.4rem' }}>
          <h4 className="mt-0 mb-0">{evenementAffiche.nom}</h4>
          <p className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
            {evenementAffiche.texte}
          </p>
          {evenementAffiche.regle.map((paragraphe, i) => (
            <p key={i} className="text-sm">
              {paragraphe}
            </p>
          ))}

          {evenement.or && (
            <JetOrButton
              // Sans clé liée à l'événement affiché, React réutilise la même
              // instance (même position dans l'arbre) d'un événement à
              // l'autre : son verrou « déjà appliqué » resterait affiché à
              // tort sur le prochain événement tiré au lieu de proposer sa
              // propre saisie.
              key={`${palierId}-${face}`}
              label={t('postBataille.rollObtainedNotation', { notation: evenement.or })}
              onValider={(valeur) => ajouterOr(evenement.or!, '', valeur)}
            />
          )}

          {evenement.id === 'puits' && (
            <ResolutionPuits
              roster={roster}
              nomEvenement={evenementAffiche.nom}
              onMajRoster={onMajRoster}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'la_fosse' && (
            <ResolutionLaFosse
              roster={roster}
              date={date}
              nomEvenement={evenementAffiche.nom}
              onMajRoster={onMajRoster}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'vagabond' && (
            <ResolutionVagabond
              roster={roster}
              catalogue={catalogue}
              nomEvenement={evenementAffiche.nom}
              onMajRoster={onMajRoster}
              onAjouterOr={onAjouterOr}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'taverne' && (
            <ResolutionTaverne
              roster={roster}
              catalogue={catalogue}
              nomEvenement={evenementAffiche.nom}
              onAjouterOr={onAjouterOr}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'prisonniers' && (
            <ResolutionPrisonniers
              roster={roster}
              catalogue={catalogue}
              nomEvenement={evenementAffiche.nom}
              onMajRoster={onMajRoster}
              onAjouterOr={onAjouterOr}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'debiteur_reconnaissant' && (
            <ResolutionDebiteurReconnaissant
              roster={roster}
              nomEvenement={evenementAffiche.nom}
              onMajRoster={onMajRoster}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'batiment_ecroule' && (
            <ResolutionBatimentEcroule
              roster={roster}
              catalogue={catalogue}
              nomEvenement={evenementAffiche.nom}
              onMajRoster={onMajRoster}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'entree_catacombes_5' && (
            <ResolutionEntreeCatacombes
              roster={roster}
              nomEvenement={evenementAffiche.nom}
              onMajRoster={onMajRoster}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.id === 'arene' && (
            <ResolutionArene
              nomEvenement={evenementAffiche.nom}
              catalogueId={catalogue.id}
              onAjouterOr={onAjouterOr}
              onAjouterObjet={ajouterObjet}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.artefactMagique && (
            <button className="btn--pack-pill-sm" style={{ marginTop: '0.5rem' }} onClick={onOuvrirArtefacts}>
              {t('postBataille.openMagicArtefactsTable')}
            </button>
          )}

          {evenement.sousTable && (
            <div style={{ marginTop: '0.6rem' }}>
              <p className="text-sm text-muted" style={{ marginBottom: '0.4rem' }}>
                {t('evenement.selectD6Result')}
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
                        <td>{evenementAffiche?.sousTable?.[i]?.resultat ?? ligne.resultat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {ligneSousTable?.or && (
                <JetOrButton
                  // Même raison que ci-dessus : sans clé liée à la ligne de
                  // sous-table sélectionnée, changer de ligne (même sans
                  // changer d'événement) réutiliserait l'instance verrouillée
                  // de la ligne précédente.
                  key={`${palierId}-${face}-${evenement.sousTable?.indexOf(ligneSousTable)}`}
                  label={t('evenement.goldRollNotation', { notation: ligneSousTable.or })}
                  onValider={(valeur) => ajouterOr(ligneSousTable.or!, resultatAffiche(ligneSousTable), valeur)}
                />
              )}
              {ligneSousTable?.objets && (
                <div style={{ marginTop: '0.3rem' }}>
                  {ligneSousTable.objets.map((objet, i) => (
                    <AjouterObjetTrouveButton
                      // Même raison que pour JetOrButton ci-dessus : la clé
                      // doit identifier la ligne de sous-table (pas seulement
                      // la position de l'objet dans cette ligne), sinon
                      // changer de ligne réutilise l'instance verrouillée de
                      // la ligne précédente au même index.
                      key={`${palierId}-${face}-${evenement.sousTable?.indexOf(ligneSousTable)}-${i}`}
                      ligneObjet={objet}
                      catalogueId={catalogue.id}
                      onAjouter={(item, quantite) => ajouterObjet(resultatAffiche(ligneSousTable), item, quantite)}
                    />
                  ))}
                </div>
              )}
              {ligneSousTable?.artefactMagique && (
                <button
                  type="button"
                  className="btn--pack-pill-sm"
                  style={{ marginTop: '0.5rem' }}
                  onClick={onOuvrirArtefacts}
                >
                  {t('postBataille.openMagicArtefactsTable')}
                </button>
              )}
            </div>
          )}

          {evenement.sousTableTresor && (
            <div className="table-scroll" style={{ marginTop: '0.6rem' }}>
              <table className="table-reference">
                <thead>
                  <tr>
                    <th>{t('evenement.elementHeader')}</th>
                    <th>{t('evenement.resultRequiredHeader')}</th>
                    <th>{t('evenement.actionHeader')}</th>
                  </tr>
                </thead>
                <tbody>
                  {evenement.sousTableTresor.map((ligne, i) => (
                    <LigneTresorRow
                      key={ligne.element}
                      ligne={ligne}
                      elementAffiche={evenementAffiche?.sousTableTresor?.[i]?.element}
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
