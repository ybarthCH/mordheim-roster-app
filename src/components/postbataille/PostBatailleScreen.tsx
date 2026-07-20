import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { useRosters } from '../../state/RostersContext';
import { resolveProfil } from '../../utils/profil';
import { STAT_KEYS } from '../../types/catalog';
import type { Stats } from '../../types/catalog';
import type { BattleRecord, JournalPostBataille, Member } from '../../types/roster';

const ETAPES = ['Blessures graves', "Gain d'expérience", 'Bataille', 'Exploration', 'Résumé'];

type BlessureDraft = {
  description: string;
  stats: Stats;
  equipement: string;
};

type SlotSurvie = {
  key: string;
  instanceId: string;
  label: string;
  estSlotDeGroupe: boolean;
};

export function PostBatailleScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');

  const [etape, setEtape] = useState(0);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [resultat, setResultat] = useState<BattleRecord['resultat']>('victoire');
  const [adversaires, setAdversaires] = useState<string[]>([]);
  const [nouvelAdversaire, setNouvelAdversaire] = useState('');
  const [notesBataille, setNotesBataille] = useState('');

  const [wyrdstoneTrouve, setWyrdstoneTrouve] = useState(0);
  const [notesExploration, setNotesExploration] = useState('');
  const [quantiteVendue, setQuantiteVendue] = useState(0);
  const [prixVente, setPrixVente] = useState(0);

  const [blessureDrafts, setBlessureDrafts] = useState<Record<string, BlessureDraft>>({});
  const [survieChoisies, setSurvieChoisies] = useState<Record<string, 'oui' | 'non'>>({});

  // Blessures graves : réservé aux héros (taille_groupe = 1) Hors de Combat —
  // seuls les héros roulent sur la table complète des blessures.
  const horsDeCombatHeros = useMemo(
    () =>
      roster?.membres.filter(
        (m) => m.statut === 'hors_de_combat' && resolveProfil(roster, m)?.type === 'heros'
      ) ?? [],
    [roster]
  );

  // Gain d'expérience / survie : hommes de main uniquement, table simple
  // mort-ou-survivant. Un groupe est "éclaté" en autant de jets que de
  // figurines Hors de Combat, chacun clairement rattaché à son groupe.
  const slotsSurvie = useMemo<SlotSurvie[]>(() => {
    if (!roster) return [];
    const slots: SlotSurvie[] = [];
    for (const m of roster.membres) {
      const profil = resolveProfil(roster, m);
      if (profil?.type === 'heros') continue;
      if ((m.taille_groupe || 1) <= 1) {
        if (m.statut === 'hors_de_combat') {
          slots.push({ key: m.instance_id, instanceId: m.instance_id, label: m.nom_perso, estSlotDeGroupe: false });
        }
      } else if (m.hors_combat > 0) {
        for (let i = 0; i < m.hors_combat; i++) {
          slots.push({
            key: `${m.instance_id}__${i}`,
            instanceId: m.instance_id,
            label: `${m.nom_perso} — figurine Hors de Combat (${i + 1}/${m.hors_combat})`,
            estSlotDeGroupe: true,
          });
        }
      }
    }
    return slots;
  }, [roster]);

  const francTireursActifs = useMemo(
    () => roster?.membres.filter((m) => m.profil_custom && m.statut !== 'mort') ?? [],
    [roster]
  );
  const soldeTotal = francTireursActifs.reduce(
    (acc, m) => acc + (m.profil_custom?.solde ?? 0) * (m.taille_groupe || 1),
    0
  );

  if (!roster) {
    return (
      <Screen title="Bande introuvable" back="/">
        <p className="text-muted">Ce roster n'existe pas (ou plus).</p>
      </Screen>
    );
  }

  const draftDe = (m: Member): BlessureDraft =>
    blessureDrafts[m.instance_id] ?? { description: '', stats: m.stats_actuels, equipement: m.equipement };

  const majDraft = (m: Member, partial: Partial<BlessureDraft>) => {
    setBlessureDrafts((prev) => ({ ...prev, [m.instance_id]: { ...draftDe(m), ...partial } }));
  };

  const editerStatDraft = (m: Member, k: keyof Stats, value: number) => {
    const d = draftDe(m);
    majDraft(m, { stats: { ...d.stats, [k]: value } });
  };

  const ajouterAdversaire = () => {
    const nom = nouvelAdversaire.trim();
    if (!nom || adversaires.includes(nom)) return;
    setAdversaires((prev) => [...prev, nom]);
    setNouvelAdversaire('');
  };

  const suivant = () => setEtape((e) => Math.min(ETAPES.length - 1, e + 1));
  const precedent = () => setEtape((e) => Math.max(0, e - 1));

  const terminer = async () => {
    // Résultats de survie des groupes : combien de "non" (morts) et de "oui"
    // (rejoignent le groupe) par entrée de groupe.
    const nonParGroupe: Record<string, number> = {};
    const resolusParGroupe: Record<string, number> = {};
    for (const slot of slotsSurvie) {
      if (!slot.estSlotDeGroupe) continue;
      const v = survieChoisies[slot.key];
      if (!v) continue;
      resolusParGroupe[slot.instanceId] = (resolusParGroupe[slot.instanceId] ?? 0) + 1;
      if (v === 'non') nonParGroupe[slot.instanceId] = (nonParGroupe[slot.instanceId] ?? 0) + 1;
    }

    const membresMaj: Member[] = roster.membres.map((m) => {
      let membre = { ...m };

      const draft = blessureDrafts[m.instance_id];
      if (draft) {
        const statsModifiees = STAT_KEYS.filter((k) => draft.stats[k] !== m.stats_actuels[k]);
        if (statsModifiees.length > 0 || draft.equipement !== m.equipement) {
          membre = {
            ...membre,
            stats_actuels: draft.stats,
            equipement: draft.equipement,
            stats_modifiees: Array.from(new Set([...membre.stats_modifiees, ...statsModifiees])),
          };
        }
        if (draft.description.trim()) {
          membre = {
            ...membre,
            blessures_graves: [
              ...membre.blessures_graves,
              { id: uuidv4(), date, description: draft.description.trim() },
            ],
          };
        }
      }

      if ((m.taille_groupe || 1) <= 1) {
        const survie = survieChoisies[m.instance_id];
        if (survie === 'oui') membre = { ...membre, statut: 'actif' };
        else if (survie === 'non') membre = { ...membre, statut: 'mort', date_mort: date };
      } else {
        const resolus = resolusParGroupe[m.instance_id] ?? 0;
        if (resolus > 0) {
          const morts = nonParGroupe[m.instance_id] ?? 0;
          const nouvelleTaille = Math.max(0, (m.taille_groupe || 1) - morts);
          membre = {
            ...membre,
            taille_groupe: nouvelleTaille,
            hors_combat: Math.max(0, m.hors_combat - resolus),
            ...(nouvelleTaille <= 0 ? { statut: 'mort', date_mort: date } : null),
          };
        }
      }

      return membre;
    });

    const journal: JournalPostBataille = {
      wyrdstoneTrouve,
      notesExploration: notesExploration.trim(),
      quantiteVendue,
      prixVente,
      soldeFrancsTireurs: soldeTotal,
      blessures: Object.entries(blessureDrafts)
        .filter(([, d]) => d.description.trim())
        .map(([instanceId, d]) => ({
          nom: roster.membres.find((m) => m.instance_id === instanceId)?.nom_perso ?? '?',
          description: d.description.trim(),
        })),
      survie: slotsSurvie
        .filter((slot) => survieChoisies[slot.key])
        .map((slot) => ({ nom: slot.label, survecu: survieChoisies[slot.key] === 'oui' })),
    };

    const bataille: BattleRecord = {
      id: uuidv4(),
      date,
      resultat,
      adversaires,
      notes: notesBataille.trim(),
      journal,
    };

    await updateRoster({
      ...roster,
      membres: membresMaj,
      wyrdstone: Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue),
      tresorerie: roster.tresorerie + prixVente - soldeTotal,
      equipement_reserve: notesExploration.trim()
        ? `${roster.equipement_reserve}${roster.equipement_reserve ? '\n' : ''}${notesExploration.trim()}`
        : roster.equipement_reserve,
      historique_batailles: [...roster.historique_batailles, bataille],
    });
    navigate(`/roster/${roster.id}`);
  };

  return (
    <Screen title="Assistant post-bataille" back={`/roster/${roster.id}`}>
      <div className="wizard-steps">
        {ETAPES.map((_, i) => (
          <div key={i} className={`wizard-steps__step ${i <= etape ? 'wizard-steps__step--done' : ''}`} />
        ))}
      </div>
      <p className="text-muted text-sm">
        Étape {etape + 1}/{ETAPES.length} — {ETAPES[etape]}
      </p>

      {etape === 0 && (
        <div className="card">
          <h3>Blessures graves</h3>
          <p className="text-sm text-muted">
            Pour chaque héros Hors de Combat, lance sur ta table papier (table complète des règles), note le
            résultat obtenu, puis ajuste directement ses caractéristiques et/ou son équipement si la blessure les
            affecte. Les hommes de main utilisent la table simple mort-ou-survivant à l'étape suivante.
          </p>
          {horsDeCombatHeros.length === 0 && <p className="text-muted">Aucun héros Hors de Combat.</p>}
          {horsDeCombatHeros.map((m) => {
            const d = draftDe(m);
            return (
              <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
                <strong>{m.nom_perso}</strong>
                <div className="field" style={{ marginTop: '0.5rem' }}>
                  <label>Résultat obtenu</label>
                  <textarea
                    value={d.description}
                    onChange={(e) => majDraft(m, { description: e.target.value })}
                    placeholder="Ex : Jambe estropiée (-1 M définitif)"
                  />
                </div>
                <div className="field">
                  <label>Caractéristiques</label>
                  <div className="stat-grid">
                    {STAT_KEYS.map((k) => (
                      <div key={k} className="stat-grid__cell stat-grid__cell--label">
                        {k}
                      </div>
                    ))}
                    {STAT_KEYS.map((k) => (
                      <div key={k} className="stat-grid__cell stat-grid__cell--value">
                        <input
                          type="number"
                          className="stat-grid__input"
                          value={d.stats[k]}
                          onChange={(e) => editerStatDraft(m, k, Number(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Équipement</label>
                  <textarea value={d.equipement} onChange={(e) => majDraft(m, { equipement: e.target.value })} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {etape === 1 && (
        <div className="card">
          <h3>Gain d'expérience</h3>
          <p className="text-sm text-muted">
            Pour chaque homme de main Hors de Combat (chaque figurine d'un groupe est listée séparément, avec le
            groupe d'origine indiqué), indique s'il a survécu. Les gains d'XP eux-mêmes se gèrent en direct via
            les cases à cocher sur la fiche de chaque personnage/groupe.
          </p>
          {slotsSurvie.length === 0 && <p className="text-muted">Aucun homme de main Hors de Combat.</p>}
          {slotsSurvie.map((slot) => (
            <div key={slot.key} className="flex justify-between items-center" style={{ marginBottom: '0.6rem' }}>
              <span>{slot.label}</span>
              <div className="status-select">
                <button
                  className={`status-pill ${survieChoisies[slot.key] === 'oui' ? 'status-pill--active' : ''}`}
                  onClick={() => setSurvieChoisies((prev) => ({ ...prev, [slot.key]: 'oui' }))}
                >
                  A survécu
                </button>
                <button
                  className={`status-pill ${survieChoisies[slot.key] === 'non' ? 'status-pill--active' : ''}`}
                  onClick={() => setSurvieChoisies((prev) => ({ ...prev, [slot.key]: 'non' }))}
                >
                  N'a pas survécu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {etape === 2 && (
        <div className="card">
          <h3>Résultat de la bataille</h3>
          <div className="field-row">
            <div className="field">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Résultat</label>
              <select value={resultat} onChange={(e) => setResultat(e.target.value as BattleRecord['resultat'])}>
                <option value="victoire">Victoire</option>
                <option value="defaite">Défaite</option>
                <option value="nul">Match nul</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Bande(s) adverse(s)</label>
            <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.4rem' }}>
              {adversaires.map((nom, i) => (
                <span key={i} className="badge badge--info">
                  {nom}
                  <button
                    className="btn--ghost"
                    style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
                    onClick={() => setAdversaires((prev) => prev.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                </span>
              ))}
              {adversaires.length === 0 && <span className="text-muted text-sm">Aucune</span>}
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
                placeholder="Nom d'une bande adverse"
              />
              <button className="btn" onClick={ajouterAdversaire}>
                Ajouter
              </button>
            </div>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea value={notesBataille} onChange={(e) => setNotesBataille(e.target.value)} />
          </div>
        </div>
      )}

      {etape === 3 && (
        <div className="card">
          <h3>Exploration &amp; wyrdstone</h3>
          <p className="text-sm text-muted">
            Reporte ici le résultat de tes jets d'exploration effectués sur table papier.
          </p>
          <div className="field">
            <label>Wyrdstone trouvé (à ajouter à la réserve)</label>
            <input
              type="number"
              value={wyrdstoneTrouve}
              onChange={(e) => setWyrdstoneTrouve(Number(e.target.value) || 0)}
            />
          </div>
          <div className="field">
            <label>Objets / événements d'exploration (texte libre, ajouté à l'équipement en réserve)</label>
            <textarea value={notesExploration} onChange={(e) => setNotesExploration(e.target.value)} />
          </div>
          <h3>Vente de wyrdstone</h3>
          <div className="field-row">
            <div className="field">
              <label>Quantité vendue</label>
              <input
                type="number"
                value={quantiteVendue}
                onChange={(e) => setQuantiteVendue(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label>Prix total obtenu (po)</label>
              <input type="number" value={prixVente} onChange={(e) => setPrixVente(Number(e.target.value) || 0)} />
            </div>
          </div>
          <p className="text-sm text-muted">
            Wyrdstone en réserve après cette étape :{' '}
            {Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue)} · Trésorerie :{' '}
            {roster.tresorerie + prixVente} po
          </p>
        </div>
      )}

      {etape === 4 && (
        <div className="card">
          <h3>Résumé</h3>
          <p>
            {date} — {resultat} {adversaires.length > 0 && `vs ${adversaires.join(', ')}`}
          </p>
          <p className="text-sm">
            Wyrdstone : {roster.wyrdstone} → {Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue)}
            <br />
            Trésorerie : {roster.tresorerie} → {roster.tresorerie + prixVente - soldeTotal} po
          </p>
          {soldeTotal > 0 && (
            <p className="text-sm">
              Solde des francs-tireurs à payer : {soldeTotal} po ({francTireursActifs.length} franc(s)-tireur(s)).
            </p>
          )}
          <p className="text-sm">
            {Object.values(blessureDrafts).filter((d) => d.description.trim()).length} blessure(s) grave(s)
            enregistrée(s).
          </p>
          <p className="text-sm">
            Survie : {Object.values(survieChoisies).filter((v) => v === 'oui').length} survivant(s),{' '}
            {Object.values(survieChoisies).filter((v) => v === 'non').length} mort(s).
          </p>
        </div>
      )}

      <div className="flex gap-sm">
        <button className="btn" disabled={etape === 0} onClick={precedent}>
          Précédent
        </button>
        {etape < ETAPES.length - 1 && (
          <button className="btn btn--primary" onClick={suivant}>
            Suivant
          </button>
        )}
        {etape === ETAPES.length - 1 && (
          <button className="btn btn--primary" onClick={terminer}>
            Valider et enregistrer
          </button>
        )}
      </div>
    </Screen>
  );
}
