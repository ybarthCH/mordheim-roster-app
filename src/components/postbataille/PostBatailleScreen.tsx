import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { useRosters } from '../../state/RostersContext';
import { resolveProfil } from '../../utils/profil';
import { HENCHMAN_XP_MAX, HERO_XP_MAX, isPalierHenchman, isPalierHero } from '../../utils/xp';
import { STAT_KEYS } from '../../types/catalog';
import type { Stats } from '../../types/catalog';
import type { BattleRecord, JournalPostBataille, Member } from '../../types/roster';

const ETAPES = ['Blessures graves', 'Bataille', "Gain d'expérience", 'Exploration', 'Résumé'];

type BlessureDraft = {
  description: string;
  stats: Stats;
  equipement: string;
};

type XpDraft = {
  xp: number;
  survecu: 'oui' | 'non' | null;
};

type SlotDraft = 'oui' | 'non' | null;

function nomAffiche(m: Member) {
  return `${m.nom_perso}${m.taille_groupe > 1 ? ` × ${m.taille_groupe}` : ''}`;
}

// Mini grille XP utilisée dans l'assistant post-bataille : distingue l'XP de
// départ (ne comptait pas), l'XP déjà acquise avant cette bataille, et l'XP
// ajoutée pendant cette session (couleur dédiée), qu'elle vienne d'un clic
// manuel ou de la case "A survécu". Le bonus de chef de bande (victoire) est
// affiché à part, en case non cliquable, dans une 3e couleur dédiée.
function XpBarCompacte({
  type,
  xpDepart,
  xpInitial,
  xpActuel,
  onChange,
  bonusLeader,
}: {
  type: 'heros' | 'homme_de_main';
  xpDepart: number;
  xpInitial: number;
  xpActuel: number;
  onChange: (xp: number) => void;
  bonusLeader?: boolean;
}) {
  const max = type === 'heros' ? HERO_XP_MAX : HENCHMAN_XP_MAX;
  const isPalier = type === 'heros' ? isPalierHero : isPalierHenchman;
  const boxes = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className="xp-grid">
      {boxes.map((box) => {
        const estDepart = box <= xpDepart;
        const estSession = box > xpInitial && box <= xpActuel;
        return (
          <button
            key={box}
            type="button"
            className={`xp-box xp-box--compact ${isPalier(box) ? 'xp-box--palier' : ''} ${
              xpActuel >= box ? 'xp-box--checked' : ''
            } ${estDepart ? 'xp-box--depart' : ''} ${estSession ? 'xp-box--session' : ''}`}
            onClick={() => onChange(xpActuel === box ? box - 1 : box)}
            aria-label={`Case XP ${box}`}
          >
            {isPalier(box) ? box : ''}
          </button>
        );
      })}
      {bonusLeader && (
        <span
          className="xp-box xp-box--compact xp-box--leader"
          title="Bonus chef de bande : +1 XP automatique à la victoire"
        >
          +1
        </span>
      )}
    </div>
  );
}

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
  const [xpDrafts, setXpDrafts] = useState<Record<string, XpDraft>>({});
  const [groupeSlotDrafts, setGroupeSlotDrafts] = useState<Record<string, SlotDraft[]>>({});

  // Blessures graves : réservé aux héros Hors de Combat — seuls les héros
  // roulent sur la table complète des blessures. Les hommes de main utilisent
  // la table simple mort-ou-survivant à l'étape suivante.
  const horsDeCombatHeros = useMemo(
    () =>
      roster?.membres.filter(
        (m) => m.statut === 'hors_de_combat' && resolveProfil(roster, m)?.type === 'heros'
      ) ?? [],
    [roster]
  );

  // Gain d'expérience, section « à résoudre » : héros ET hommes de main seuls
  // (taille_groupe = 1) au statut Hors de combat — résolution individuelle.
  const horsDeCombatIndividuel = useMemo(
    () => roster?.membres.filter((m) => m.statut === 'hors_de_combat') ?? [],
    [roster]
  );

  // Gain d'expérience, section « à résoudre » : groupes d'hommes de main
  // partiellement Hors de combat (compteur dédié) — résolution figurine par
  // figurine. Un groupe ne perd son XP que s'il est entièrement éliminé.
  const groupesHC = useMemo(
    () =>
      roster?.membres.filter(
        (m) =>
          resolveProfil(roster, m)?.type === 'homme_de_main' &&
          m.taille_groupe > 1 &&
          m.hors_combat > 0 &&
          m.statut !== 'hors_de_combat'
      ) ?? [],
    [roster]
  );

  // Gain d'expérience, section « reste du roster » : tout le monde de vivant
  // qui n'est pas à résoudre manuellement — gagne 1 XP automatiquement.
  const participantsAuto = useMemo(() => {
    const hcIds = new Set([...horsDeCombatIndividuel, ...groupesHC].map((m) => m.instance_id));
    return roster?.membres.filter((m) => m.statut !== 'mort' && !hcIds.has(m.instance_id)) ?? [];
  }, [roster, horsDeCombatIndividuel, groupesHC]);

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

  const xpDraftDe = (m: Member, xpParDefaut: number): XpDraft =>
    xpDrafts[m.instance_id] ?? { xp: xpParDefaut, survecu: null };

  const changerXp = (m: Member, xp: number, xpParDefaut: number) => {
    setXpDrafts((prev) => ({ ...prev, [m.instance_id]: { ...xpDraftDe(m, xpParDefaut), xp } }));
  };

  // Survie individuelle (héros ou homme de main seul Hors de combat) : la
  // référence de calcul est toujours l'XP avant bataille (m.xp).
  const definirSurvie = (m: Member, valeur: 'oui' | 'non') => {
    const d = xpDraftDe(m, m.xp);
    let xp = d.xp;
    if (d.survecu === 'oui') xp -= 1; // annule le bonus précédent avant de recalculer
    const nouveauSurvecu = d.survecu === valeur ? null : valeur;
    if (nouveauSurvecu === 'oui') xp += 1;
    setXpDrafts((prev) => ({ ...prev, [m.instance_id]: { xp, survecu: nouveauSurvecu } }));
  };

  const slotsDe = (m: Member): SlotDraft[] => {
    const existing = groupeSlotDrafts[m.instance_id];
    if (existing && existing.length === m.hors_combat) return existing;
    return Array.from({ length: m.hors_combat }, () => null);
  };

  const definirSlot = (m: Member, index: number, valeur: 'oui' | 'non') => {
    const slots = slotsDe(m).slice();
    slots[index] = slots[index] === valeur ? null : valeur;
    setGroupeSlotDrafts((prev) => ({ ...prev, [m.instance_id]: slots }));
  };

  const ajouterAdversaire = () => {
    const nom = nouvelAdversaire.trim();
    if (!nom || adversaires.includes(nom)) return;
    setAdversaires((prev) => [...prev, nom]);
    setNouvelAdversaire('');
  };

  // Étape Gain d'expérience : impossible de continuer tant que tous les
  // Hors de combat (individuels ou en groupe) n'ont pas été résolus.
  const hcIncomplete =
    horsDeCombatIndividuel.some((m) => xpDraftDe(m, m.xp).survecu === null) ||
    groupesHC.some((m) => slotsDe(m).some((s) => s === null));

  const indexGainXp = 2;

  const suivant = () => {
    if (etape === indexGainXp && hcIncomplete) return;
    setEtape((e) => Math.min(ETAPES.length - 1, e + 1));
  };
  const precedent = () => setEtape((e) => Math.max(0, e - 1));

  const terminer = async () => {
    const tresorerieApres = roster.tresorerie + prixVente - soldeTotal;
    const groupesHCIds = new Set(groupesHC.map((m) => m.instance_id));

    const membresMaj: Member[] = roster.membres.map((m) => {
      let membre = { ...m };
      const profil = resolveProfil(roster, m);
      const estLeaderVictoire = !!profil?.est_leader && resultat === 'victoire';

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

      if (m.statut === 'mort') {
        return membre;
      }

      if (m.statut === 'hors_de_combat') {
        const d = xpDrafts[m.instance_id] ?? { xp: m.xp, survecu: null };
        if (d.survecu === 'non') {
          membre = { ...membre, statut: 'mort', date_mort: date };
        } else {
          let xp = d.xp;
          if (estLeaderVictoire) xp += 1;
          membre = { ...membre, statut: 'actif', xp };
        }
        return membre;
      }

      if (groupesHCIds.has(m.instance_id)) {
        const slots = groupeSlotDrafts[m.instance_id] ?? [];
        const morts = slots.filter((s) => s === 'non').length;
        const survivants = m.taille_groupe - morts;
        if (survivants <= 0) {
          membre = { ...membre, statut: 'mort', date_mort: date, taille_groupe: 0, hors_combat: 0 };
        } else {
          let xp = m.xp + 1;
          if (estLeaderVictoire) xp += 1;
          membre = { ...membre, statut: 'actif', taille_groupe: survivants, hors_combat: 0, xp };
        }
        return membre;
      }

      // Reste du roster : XP de participation automatique (+1), ajustable
      // via la barre pendant l'assistant.
      const d = xpDrafts[m.instance_id];
      let xp = d ? d.xp : m.xp + 1;
      if (estLeaderVictoire) xp += 1;
      membre = { ...membre, xp };
      return membre;
    });

    const journal: JournalPostBataille = {
      wyrdstoneTrouve,
      notesExploration: notesExploration.trim(),
      quantiteVendue,
      prixVente,
      soldeFrancsTireurs: soldeTotal,
      tresorerieApres,
      blessures: Object.entries(blessureDrafts)
        .filter(([, d]) => d.description.trim())
        .map(([instanceId, d]) => ({
          nom: roster.membres.find((m) => m.instance_id === instanceId)?.nom_perso ?? '?',
          description: d.description.trim(),
        })),
      survie: [
        ...horsDeCombatIndividuel.map((m) => {
          const d = xpDrafts[m.instance_id];
          return { nom: nomAffiche(m), survecu: d?.survecu === 'oui' };
        }),
        ...groupesHC.map((m) => {
          const slots = groupeSlotDrafts[m.instance_id] ?? [];
          const morts = slots.filter((s) => s === 'non').length;
          return { nom: nomAffiche(m), survecu: m.taille_groupe - morts > 0 };
        }),
      ],
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
      tresorerie: tresorerieApres,
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

      {etape === indexGainXp && (
        <>
          <div className="card">
            <h3>Hors de combat — à résoudre</h3>
            <p className="text-sm text-muted">
              Pour chaque héros ou homme de main seul Hors de combat, et pour chaque figurine d'un groupe
              partiellement Hors de combat, indique si elle a survécu ou non. Un survivant gagne 1 XP
              automatiquement (couleur dédiée). Un groupe ne perd son XP que s'il est entièrement éliminé.
            </p>
            {horsDeCombatIndividuel.length === 0 && groupesHC.length === 0 && (
              <p className="text-muted">Personne à résoudre — aucun Hors de combat en attente.</p>
            )}
            {horsDeCombatIndividuel.map((m) => {
              const profil = resolveProfil(roster, m);
              const d = xpDraftDe(m, m.xp);
              const bonusLeader = !!profil?.est_leader && resultat === 'victoire' && d.survecu !== 'non';
              return (
                <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                    <strong>
                      {nomAffiche(m)}
                      {profil?.est_leader && (
                        <span className="badge badge--info" style={{ marginLeft: '0.4rem' }}>
                          ★ Leader
                        </span>
                      )}
                    </strong>
                    <span className="text-sm text-muted">Hors de combat</span>
                  </div>
                  <XpBarCompacte
                    type={profil?.type === 'heros' ? 'heros' : 'homme_de_main'}
                    xpDepart={m.xp_depart}
                    xpInitial={m.xp}
                    xpActuel={d.xp}
                    onChange={(xp) => changerXp(m, xp, m.xp)}
                    bonusLeader={bonusLeader}
                  />
                  <div className="status-select" style={{ marginTop: '0.5rem' }}>
                    <button
                      className={`status-pill ${d.survecu === 'oui' ? 'status-pill--active' : ''}`}
                      onClick={() => definirSurvie(m, 'oui')}
                    >
                      A survécu (+1 XP)
                    </button>
                    <button
                      className={`status-pill ${d.survecu === 'non' ? 'status-pill--active' : ''}`}
                      onClick={() => definirSurvie(m, 'non')}
                    >
                      N'a pas survécu
                    </button>
                  </div>
                </div>
              );
            })}
            {groupesHC.map((m) => {
              const slots = slotsDe(m);
              const morts = slots.filter((s) => s === 'non').length;
              const enAttente = slots.filter((s) => s === null).length;
              const survivants = m.taille_groupe - morts;
              return (
                <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                    <strong>{nomAffiche(m)}</strong>
                    <span className="text-sm text-muted">
                      {m.hors_combat} / {m.taille_groupe} hors de combat
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-sm">
                    {slots.map((s, i) => (
                      <div key={i} className="flex items-center gap-sm">
                        <span className="text-sm text-muted">#{i + 1}</span>
                        <button
                          className={`btn btn--sm ${s === 'oui' ? 'btn--primary' : ''}`}
                          onClick={() => definirSlot(m, i, 'oui')}
                        >
                          Survécu
                        </button>
                        <button
                          className={`btn btn--sm ${s === 'non' ? 'btn--danger' : ''}`}
                          onClick={() => definirSlot(m, i, 'non')}
                        >
                          Mort
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                    {enAttente > 0
                      ? `${enAttente} figurine(s) à résoudre.`
                      : survivants > 0
                        ? `Résolu — le groupe garde ${survivants} figurine(s) et gagne +1 XP.`
                        : "Résolu — le groupe est entièrement éliminé (passera au statut Mort, pas d'XP)."}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="card">
            <h3>Reste du roster</h3>
            <p className="text-sm text-muted">
              Chaque participant qui n'était pas Hors de combat gagne 1 XP automatiquement (couleur dédiée
              ci-dessous). Ajuste la barre si besoin.
            </p>
            {participantsAuto.length === 0 && <p className="text-muted">Aucun autre membre dans la bande.</p>}
            {participantsAuto.map((m) => {
              const profil = resolveProfil(roster, m);
              const d = xpDraftDe(m, m.xp + 1);
              const bonusLeader = !!profil?.est_leader && resultat === 'victoire';
              return (
                <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                    <strong>
                      {nomAffiche(m)}
                      {profil?.est_leader && (
                        <span className="badge badge--info" style={{ marginLeft: '0.4rem' }}>
                          ★ Leader
                        </span>
                      )}
                    </strong>
                    <span className="text-sm text-muted">{m.statut === 'blesse' ? 'Blessé' : 'Actif'}</span>
                  </div>
                  <XpBarCompacte
                    type={profil?.type === 'heros' ? 'heros' : 'homme_de_main'}
                    xpDepart={m.xp_depart}
                    xpInitial={m.xp}
                    xpActuel={d.xp}
                    onChange={(xp) => changerXp(m, xp, m.xp + 1)}
                    bonusLeader={bonusLeader}
                  />
                </div>
              );
            })}
          </div>
        </>
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
            Hors de combat :{' '}
            {horsDeCombatIndividuel.filter((m) => xpDraftDe(m, m.xp).survecu === 'oui').length} survivant(s),{' '}
            {horsDeCombatIndividuel.filter((m) => xpDraftDe(m, m.xp).survecu === 'non').length} mort(s).
            {groupesHC.length > 0 && ` ${groupesHC.length} groupe(s) partiellement hors de combat résolu(s).`}
          </p>
          <p className="text-sm">
            {participantsAuto.length} membre(s) du reste du roster gagnent leur XP de participation.
          </p>
          {resultat === 'victoire' && roster.membres.some((m) => resolveProfil(roster, m)?.est_leader) && (
            <p className="text-sm">Le chef de bande gagne en plus son bonus de +1 XP pour la victoire.</p>
          )}
        </div>
      )}

      <div className="flex gap-sm">
        <button className="btn" disabled={etape === 0} onClick={precedent}>
          Précédent
        </button>
        {etape < ETAPES.length - 1 && (
          <button className="btn btn--primary" disabled={etape === indexGainXp && hcIncomplete} onClick={suivant}>
            Suivant
          </button>
        )}
        {etape === ETAPES.length - 1 && (
          <button className="btn btn--primary" onClick={terminer}>
            Valider et enregistrer
          </button>
        )}
      </div>
      {etape === indexGainXp && hcIncomplete && (
        <p className="text-sm text-danger" style={{ marginTop: '0.5rem' }}>
          Résous d'abord le statut (survécu / n'a pas survécu) de tous les Hors de combat avant de continuer.
        </p>
      )}
    </Screen>
  );
}
