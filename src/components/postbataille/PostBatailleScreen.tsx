import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { useRosters } from '../../state/RostersContext';
import { BLESSURES_GRAVES } from '../../data/gameData';
import type { BattleRecord, Member } from '../../types/roster';

const ETAPES = ['Bataille', 'Exploration', 'Blessures graves', 'Expérience', 'Résumé'];

export function PostBatailleScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');

  const [etape, setEtape] = useState(0);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [resultat, setResultat] = useState<BattleRecord['resultat']>('victoire');
  const [adversaire, setAdversaire] = useState('');
  const [notesBataille, setNotesBataille] = useState('');

  const [wyrdstoneTrouve, setWyrdstoneTrouve] = useState(0);
  const [notesExploration, setNotesExploration] = useState('');
  const [quantiteVendue, setQuantiteVendue] = useState(0);
  const [prixVente, setPrixVente] = useState(0);

  const [blessuresChoisies, setBlessuresChoisies] = useState<Record<string, number>>({});
  const [xpGagne, setXpGagne] = useState<Record<string, number>>({});

  const horsDeCombat = useMemo(
    () => roster?.membres.filter((m) => m.statut === 'hors_de_combat') ?? [],
    [roster]
  );
  const survivants = useMemo(() => roster?.membres.filter((m) => m.statut !== 'mort') ?? [], [roster]);

  if (!roster) {
    return (
      <Screen title="Bande introuvable" back="/">
        <p className="text-muted">Ce roster n'existe pas (ou plus).</p>
      </Screen>
    );
  }

  const suivant = () => setEtape((e) => Math.min(ETAPES.length - 1, e + 1));
  const precedent = () => setEtape((e) => Math.max(0, e - 1));

  const terminer = async () => {
    const membresMaj: Member[] = roster.membres.map((m) => {
      let membre = { ...m };
      const idxBlessure = blessuresChoisies[m.instance_id];
      if (idxBlessure != null) {
        const entry = BLESSURES_GRAVES[idxBlessure];
        membre = {
          ...membre,
          blessures_graves: [
            ...membre.blessures_graves,
            {
              id: uuidv4(),
              date,
              roll: entry.min,
              resultat: entry.resultat,
              effet: entry.effet,
            },
          ],
        };
        if (entry.mort) {
          membre.statut = 'mort';
        } else if (entry.modificateur) {
          const { stat, delta } = entry.modificateur;
          membre.stats_actuels = {
            ...membre.stats_actuels,
            [stat]: Math.max(0, membre.stats_actuels[stat] + delta),
          };
        }
      }
      const gain = xpGagne[m.instance_id];
      if (gain) {
        membre.xp = membre.xp + gain;
      }
      return membre;
    });

    const bataille: BattleRecord = {
      id: uuidv4(),
      date,
      resultat,
      adversaire: adversaire.trim(),
      notes: notesBataille.trim(),
    };

    await updateRoster({
      ...roster,
      membres: membresMaj,
      wyrdstone: Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue),
      tresorerie: roster.tresorerie + prixVente,
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
            <label>Adversaire</label>
            <input value={adversaire} onChange={(e) => setAdversaire(e.target.value)} placeholder="Bande adverse" />
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea value={notesBataille} onChange={(e) => setNotesBataille(e.target.value)} />
          </div>
        </div>
      )}

      {etape === 1 && (
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

      {etape === 2 && (
        <div className="card">
          <h3>Blessures graves</h3>
          <p className="text-sm text-muted">
            Pour chaque personnage Hors de Combat, lance 2D6 sur ta table papier et choisis le résultat obtenu.
          </p>
          {horsDeCombat.length === 0 && <p className="text-muted">Aucun personnage Hors de Combat.</p>}
          {horsDeCombat.map((m) => (
            <div key={m.instance_id} className="field">
              <label>{m.nom_perso}</label>
              <select
                value={blessuresChoisies[m.instance_id] ?? ''}
                onChange={(e) => {
                  const valeur = e.target.value;
                  setBlessuresChoisies((prev) => {
                    if (valeur === '') {
                      const reste = { ...prev };
                      delete reste[m.instance_id];
                      return reste;
                    }
                    return { ...prev, [m.instance_id]: Number(valeur) };
                  });
                }}
              >
                <option value="">— Choisir le résultat obtenu —</option>
                {BLESSURES_GRAVES.map((entry, i) => (
                  <option key={i} value={i}>
                    {entry.min} — {entry.resultat}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {etape === 3 && (
        <div className="card">
          <h3>Gains d'expérience</h3>
          <p className="text-sm text-muted">
            XP à ajouter pour chaque survivant (ex : +1 participation, +1 vainqueur, etc. selon tes règles de
            campagne).
          </p>
          {survivants.map((m) => (
            <div key={m.instance_id} className="field-row" style={{ alignItems: 'center' }}>
              <span style={{ flex: 1 }}>{m.nom_perso}</span>
              <input
                type="number"
                style={{ maxWidth: 90 }}
                value={xpGagne[m.instance_id] ?? 0}
                onChange={(e) =>
                  setXpGagne((prev) => ({ ...prev, [m.instance_id]: Number(e.target.value) || 0 }))
                }
              />
            </div>
          ))}
        </div>
      )}

      {etape === 4 && (
        <div className="card">
          <h3>Résumé</h3>
          <p>
            {date} — {resultat} {adversaire && `vs ${adversaire}`}
          </p>
          <p className="text-sm">
            Wyrdstone : {roster.wyrdstone} → {Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue)}
            <br />
            Trésorerie : {roster.tresorerie} → {roster.tresorerie + prixVente} po
          </p>
          <p className="text-sm">
            {Object.keys(blessuresChoisies).filter((k) => blessuresChoisies[k] != null).length} blessure(s) grave(s)
            à appliquer.
          </p>
          <p className="text-sm">
            {Object.values(xpGagne).filter((v) => v > 0).length} personnage(s) gagnent de l'XP.
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
