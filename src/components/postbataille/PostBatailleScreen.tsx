import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { useRosters } from '../../state/RostersContext';
import { getCatalogue } from '../../data/warbands';
import { resolveProfil, nombreHeros } from '../../utils/profil';
import { STAT_KEYS } from '../../types/catalog';
import type { Stats } from '../../types/catalog';
import type { BattleRecord, JournalPostBataille, Member } from '../../types/roster';
import type { BlessureGraveResultat } from '../personnage/BlessureGraveWizard';
import { creerEntreeInventaire } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { AvanceeModal } from '../personnage/AvanceeModal';
import { EtapeBlessuresGraves } from './EtapeBlessuresGraves';
import { EtapeResultat } from './EtapeResultat';
import { EtapeGainXp } from './EtapeGainXp';
import { EtapeExploration } from './EtapeExploration';
import { EtapeResume } from './EtapeResume';

const ETAPES = ['Blessures graves', 'Bataille', "Gain d'expérience", 'Exploration', 'Résumé'];

export type BlessureDraft = {
  nom: string;
  description: string;
  stats: Stats;
  equipement: string;
  notes: string[];
  perteEquipement: boolean;
  statutMort: boolean;
  xpBonus: number;
  tresorerieBonus: number;
};

export type XpDraft = {
  xp: number;
  survecu: 'oui' | 'non' | null;
};

export type SlotDraft = 'oui' | 'non' | null;

function nomAffiche(m: Member) {
  return `${m.nom_perso}${m.taille_groupe > 1 ? ` × ${m.taille_groupe}` : ''}`;
}

export function PostBatailleScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');
  const catalogue = roster ? getCatalogue(roster.bande_id) : undefined;
  const demiXp = !!catalogue?.xp_demi;

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
  const [pointsVeteran, setPointsVeteran] = useState(0);

  const [blessureDrafts, setBlessureDrafts] = useState<Record<string, BlessureDraft>>({});
  const [xpDrafts, setXpDrafts] = useState<Record<string, XpDraft>>({});
  const [groupeSlotDrafts, setGroupeSlotDrafts] = useState<Record<string, SlotDraft[]>>({});

  // Avancées résolues directement depuis l'étape Gain d'expérience (voir
  // ouvrirAvancee/appliquerAvancee ci-dessous) — journalisées en plus de
  // historique_avancees du membre, pour relecture dans le journal de bataille.
  const [membreEnAvancee, setMembreEnAvancee] = useState<Member | null>(null);
  const [avancesResolues, setAvancesResolues] = useState<{ nom: string; detail: string }[]>([]);

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

  // Gain d'expérience, section « à résoudre » : hommes de main et animaux
  // (seuls ou en groupe) marqués Hors de combat via le compteur dédié —
  // résolution figurine par figurine. Un groupe ne perd son XP que s'il est
  // entièrement éliminé (sans objet pour les animaux, qui n'en gagnent
  // jamais). Remplace le statut « Hors de combat » pour ces profils, qui ne
  // l'utilisent plus (cf. PersonnageScreen).
  const groupesHC = useMemo(
    () =>
      roster?.membres.filter((m) => {
        const t = resolveProfil(roster, m)?.type;
        return (t === 'homme_de_main' || t === 'animal') && m.hors_combat > 0 && m.statut !== 'hors_de_combat';
      }) ?? [],
    [roster]
  );

  // Gain d'expérience, section « reste du roster » : tout le monde de vivant
  // qui n'est pas à résoudre manuellement — gagne 1 XP automatiquement. Les
  // animaux ne gagnent jamais d'expérience et n'apparaissent donc jamais ici.
  const participantsAuto = useMemo(() => {
    const hcIds = new Set([...horsDeCombatIndividuel, ...groupesHC].map((m) => m.instance_id));
    return (
      roster?.membres.filter(
        (m) => m.statut !== 'mort' && !hcIds.has(m.instance_id) && resolveProfil(roster, m)?.type !== 'animal'
      ) ?? []
    );
  }, [roster, horsDeCombatIndividuel, groupesHC]);

  const francTireursActifs = useMemo(
    () => roster?.membres.filter((m) => m.profil_custom && m.statut !== 'mort') ?? [],
    [roster]
  );
  const soldeTotal = francTireursActifs.reduce(
    (acc, m) => acc + (m.profil_custom?.solde ?? 0) * (m.taille_groupe || 1),
    0
  );
  // Gains de trésorerie issus de résultats de blessure grave automatisés
  // (ex : victoire au combat de Gladiateur, +50 po).
  const blessuresTresorerieBonus = Object.values(blessureDrafts).reduce(
    (total, d) => total + d.tresorerieBonus,
    0
  );

  if (!roster) {
    return (
      <Screen title="Bande introuvable" back="/">
        <p className="text-muted">Ce roster n'existe pas (ou plus).</p>
      </Screen>
    );
  }

  // Blessure grave résolue via l'assistant sélectionnable (BlessureGraveWizard) :
  // stats/equipement/notes/statut sont dérivés du résultat choisi, pas saisis à
  // la main. Un résultat « Mort » ou impliquant une survie (tout sauf Mort)
  // pré-remplit directement le choix Oui/Non de l'étape suivante, pour éviter
  // de faire cliquer deux fois la même information.
  const appliquerBlessureWizard = (m: Member, resultat: BlessureGraveResultat) => {
    const stats = { ...m.stats_actuels };
    for (const k of STAT_KEYS) {
      const delta = resultat.statsDelta[k];
      if (delta) stats[k] += delta;
    }
    setBlessureDrafts((prev) => ({
      ...prev,
      [m.instance_id]: {
        nom: resultat.nom,
        description: resultat.texte,
        stats,
        equipement: resultat.perteEquipement ? '' : m.equipement,
        notes: resultat.notes,
        perteEquipement: resultat.perteEquipement,
        statutMort: resultat.statutMort,
        xpBonus: resultat.xpBonus,
        tresorerieBonus: resultat.tresorerieBonus,
      },
    }));
    setXpDrafts((prev) => ({
      ...prev,
      [m.instance_id]: resultat.statutMort
        ? { xp: m.xp, survecu: 'non' }
        : { xp: m.xp + 1 + resultat.xpBonus, survecu: 'oui' },
    }));
  };

  const reinitialiserBlessure = (m: Member) => {
    setBlessureDrafts((prev) => {
      const next = { ...prev };
      delete next[m.instance_id];
      return next;
    });
    setXpDrafts((prev) => {
      const next = { ...prev };
      delete next[m.instance_id];
      return next;
    });
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

  // Objet trouvé gratuitement pendant l'exploration (don de scénario) :
  // rejoint aussitôt le stock de la bande, indépendamment de la validation
  // finale de l'assistant. La valeur saisie sert de référence pour une
  // revente future mais n'est jamais déduite de la trésorerie (voir
  // AchatEquipementModal `gratuit`), contrairement à un achat classique.
  const ajouterAuStock = (item: ShopItem, coutPaye: number) => {
    updateRoster({ ...roster, stock: [...roster.stock, creerEntreeInventaire(item, coutPaye)] });
  };

  const heroCount = nombreHeros(roster);

  // Avancée résolue depuis l'étape Gain d'expérience : même mécanique que
  // sur la fiche personnage (AvanceeModal ne touche jamais `xp`, donc aucun
  // conflit avec les brouillons d'XP de cette étape, appliqués plus tard
  // dans terminer()). Le dernier enregistrement ajouté à historique_avancees
  // du membre ciblé (ou du nouveau héros en cas de promotion) est aussi
  // journalisé ici pour le récapitulatif de bataille.
  const appliquerAvancee = (updated: Member, nouveauMembre?: Member) => {
    const membresMaj = roster.membres.map((m) => (m.instance_id === updated.instance_id ? updated : m));
    updateRoster({ ...roster, membres: nouveauMembre ? [...membresMaj, nouveauMembre] : membresMaj });
    const cible = nouveauMembre ?? updated;
    const dernier = cible.historique_avancees[cible.historique_avancees.length - 1];
    if (dernier) {
      setAvancesResolues((prev) => [...prev, { nom: nomAffiche(cible), detail: dernier.detail }]);
    }
  };

  const terminer = async () => {
    const tresorerieApres = roster.tresorerie + prixVente - soldeTotal + blessuresTresorerieBonus;
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
              { id: uuidv4(), date, description: draft.description.trim(), nom: draft.nom },
            ],
          };
        }
        if (draft.notes.length > 0) {
          membre = { ...membre, notes: [membre.notes, ...draft.notes].filter(Boolean).join('\n') };
        }
        if (draft.perteEquipement) {
          membre = { ...membre, inventaire: [] };
        }
      }

      if (m.statut === 'mort') {
        return membre;
      }

      const estAnimal = profil?.type === 'animal';

      if (m.statut === 'hors_de_combat') {
        const d = xpDrafts[m.instance_id] ?? { xp: m.xp, survecu: null };
        if (d.survecu === 'non') {
          membre = { ...membre, statut: 'mort', date_mort: date };
        } else if (estAnimal) {
          membre = { ...membre, statut: 'actif' };
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
        } else if (estAnimal) {
          membre = { ...membre, statut: 'actif', taille_groupe: survivants, hors_combat: 0 };
        } else {
          let xp = m.xp + 1;
          if (estLeaderVictoire) xp += 1;
          membre = { ...membre, statut: 'actif', taille_groupe: survivants, hors_combat: 0, xp };
        }
        return membre;
      }

      // Un animal resté actif toute la bataille (jamais Hors de combat) ne
      // doit jamais gagner d'XP, comme les deux branches ci-dessus.
      if (estAnimal) {
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
      pointsVeteran,
      avancesResolues,
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
        <EtapeBlessuresGraves
          horsDeCombatHeros={horsDeCombatHeros}
          blessureDrafts={blessureDrafts}
          onAppliquer={appliquerBlessureWizard}
          onReinitialiser={reinitialiserBlessure}
        />
      )}

      {etape === 1 && (
        <EtapeResultat
          date={date}
          onDateChange={setDate}
          resultat={resultat}
          onResultatChange={setResultat}
          adversaires={adversaires}
          onAdversairesChange={setAdversaires}
          nouvelAdversaire={nouvelAdversaire}
          onNouvelAdversaireChange={setNouvelAdversaire}
          notesBataille={notesBataille}
          onNotesBatailleChange={setNotesBataille}
        />
      )}

      {etape === indexGainXp && (
        <EtapeGainXp
          roster={roster}
          resultat={resultat}
          demiXp={demiXp}
          horsDeCombatIndividuel={horsDeCombatIndividuel}
          groupesHC={groupesHC}
          participantsAuto={participantsAuto}
          xpDraftDe={xpDraftDe}
          changerXp={changerXp}
          definirSurvie={definirSurvie}
          slotsDe={slotsDe}
          definirSlot={definirSlot}
          onOuvrirAvancee={setMembreEnAvancee}
          avancesResolues={avancesResolues}
        />
      )}

      {etape === 3 && (
        <EtapeExploration
          roster={roster}
          catalogue={catalogue}
          wyrdstoneTrouve={wyrdstoneTrouve}
          onWyrdstoneTrouveChange={setWyrdstoneTrouve}
          notesExploration={notesExploration}
          onNotesExplorationChange={setNotesExploration}
          quantiteVendue={quantiteVendue}
          onQuantiteVendueChange={setQuantiteVendue}
          prixVente={prixVente}
          onPrixVenteChange={setPrixVente}
          pointsVeteran={pointsVeteran}
          onPointsVeteranChange={setPointsVeteran}
          onAchatStock={ajouterAuStock}
        />
      )}

      {etape === 4 && (
        <EtapeResume
          roster={roster}
          date={date}
          resultat={resultat}
          adversaires={adversaires}
          wyrdstoneTrouve={wyrdstoneTrouve}
          quantiteVendue={quantiteVendue}
          prixVente={prixVente}
          soldeTotal={soldeTotal}
          blessuresTresorerieBonus={blessuresTresorerieBonus}
          francTireursActifsCount={francTireursActifs.length}
          avancesResolues={avancesResolues}
          blessureDrafts={blessureDrafts}
          horsDeCombatIndividuel={horsDeCombatIndividuel}
          xpDraftDe={xpDraftDe}
          groupesHC={groupesHC}
          participantsAuto={participantsAuto}
        />
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

      {membreEnAvancee &&
        catalogue &&
        (() => {
          const profilAvancee = resolveProfil(roster, membreEnAvancee);
          return (
            profilAvancee && (
              <AvanceeModal
                member={membreEnAvancee}
                profil={profilAvancee}
                catalogue={catalogue}
                heroCount={heroCount}
                onClose={() => setMembreEnAvancee(null)}
                onApply={appliquerAvancee}
              />
            )
          );
        })()}
    </Screen>
  );
}
