import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { useRosters } from '../../state/useRosters';
import { getCatalogue } from '../../data/warbands';
import { resolveProfil, nombreHeros, nomAffiche } from '../../utils/profil';
import { equitationGratuitePourTribu } from '../../utils/tribu';
import type { Stats } from '../../types/catalog';
import type { BattleRecord, JournalPostBataille, Member, RosterInstance, SeriousInjuryEffect } from '../../types/roster';
import type { BlessureGraveResultat } from '../personnage/BlessureGraveWizard';
import { appliquerDeltaStats } from '../../utils/blessures';
import { creerEntreeInventaire, creerEntreesInventaire } from '../../utils/shop';
import { estLeaderActuel, succederApresMorts } from '../../utils/leader';
import type { ShopItem } from '../../utils/shop';
import { AvanceeModal } from '../personnage/AvanceeModal';
import { EtapeBlessuresGraves } from './EtapeBlessuresGraves';
import { EtapeResultat } from './EtapeResultat';
import { EtapeGainXp } from './EtapeGainXp';
import { EtapeExploration } from './EtapeExploration';
import { EtapeCommerce, type CommerceDraft, type HerosCommerce } from './EtapeCommerce';
import { EtapeResume } from './EtapeResume';
import { ResolutionOeilDesDieuxSombres } from './ResolutionOeilDesDieuxSombres';
import {
  EtapeEntretien,
  type DecisionEntretien,
  type LigneEntretien,
} from './EtapeEntretien';
import {
  coutEntretienFrancTireur,
  estFrancTireur,
  getFrancTireur,
} from '../../data/hiredSwords';
import { useGameRules } from '../../state/useGameRules';
import { resumeExploration } from '../../utils/exploration';
import { COUT_DOCTEUR } from '../../utils/docteur';
import { effectifTotal } from '../../utils/bandeValue';
import { prixVenteWyrdstone } from '../../data/tableVenteWyrdstone';
import {
  CLE_DE_SUPPLEMENTAIRE_EXPLORATION,
  CLE_FRANC_TIREUR_GRATUIT,
  effetsPersistantsAvecCle,
} from '../../utils/effetsPersistants';

const ETAPES = [
  'Bataille',
  'Blessures graves',
  "Gain d'expérience",
  'Exploration',
  'Commerce',
  'Entretien',
  'Résumé',
];

export type BlessureDraft = {
  recordId: string;
  nom: string;
  description: string;
  // Delta (pas snapshot absolu) : appliqué sur les stats du membre au moment
  // de terminer(), pas sur celles figées à l'étape "Blessures graves" — un
  // membre Hors de Combat peut aussi voir une avancée résolue entre-temps à
  // l'étape "Gain d'expérience" (voir appliquerAvancee, qui persiste
  // immédiatement), qu'un snapshot absolu écraserait silencieusement.
  statsDelta: Partial<Record<keyof Stats, number>>;
  equipement: string;
  notes: string[];
  effets: SeriousInjuryEffect[];
  perteEquipement: boolean;
  statutMort: boolean;
  xpBonus: number;
  tresorerieBonus: number;
};

function appliquerBlessureDraft(membre: Member, draft: BlessureDraft | undefined, date: string): Member {
  if (!draft) return { ...membre };
  const { stats_actuels, notes, statsTouchees } = appliquerDeltaStats(
    membre.stats_actuels,
    membre.notes,
    draft.statsDelta,
    draft.notes
  );
  let resultat: Member = {
    ...membre,
    stats_actuels,
    equipement: draft.equipement,
    stats_modifiees: Array.from(new Set([...membre.stats_modifiees, ...statsTouchees])),
    blessures_graves: draft.description.trim()
      ? [
          ...membre.blessures_graves,
          {
            id: draft.recordId,
            date,
            description: draft.description.trim(),
            nom: draft.nom,
            effets: draft.effets,
          },
        ]
      : membre.blessures_graves,
    notes,
  };
  if (draft.perteEquipement) resultat = { ...resultat, inventaire: [] };
  if (draft.statutMort) {
    resultat = { ...resultat, statut: 'mort', date_mort: date };
  }
  return resultat;
}

export type XpDraft = {
  xp: number;
  survecu: 'oui' | 'non' | null;
};

export type SlotDraft = 'oui' | 'non' | null;

export function PostBatailleScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const { rules } = useGameRules();
  const roster = getRosterById(id ?? '');
  const catalogue = roster ? getCatalogue(roster.bande_id) : undefined;
  const demiXp = !!catalogue?.xp_demi;

  const [etape, setEtape] = useState(0);

  // ScrollToTop (common/ScrollToTop.tsx) ne réagit qu'aux changements de
  // route : les étapes de cet assistant sont un state interne sur la même
  // URL, donc sans ceci le scroll de l'étape précédente reste en place et
  // la nouvelle étape s'affiche au milieu de l'écran.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [etape]);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [resultat, setResultat] = useState<BattleRecord['resultat']>('victoire');
  const [adversaires, setAdversaires] = useState<string[]>([]);
  const [nouvelAdversaire, setNouvelAdversaire] = useState('');
  const [notesBataille, setNotesBataille] = useState('');

  const [wyrdstoneTrouve, setWyrdstoneTrouve] = useState(0);
  const [notesExploration, setNotesExploration] = useState('');
  const [quantiteVendue, setQuantiteVendue] = useState(0);
  const [pointsVeteran, setPointsVeteran] = useState(0);

  const [blessureDrafts, setBlessureDrafts] = useState<Record<string, BlessureDraft>>({});
  const [xpDrafts, setXpDrafts] = useState<Record<string, XpDraft>>({});
  const [groupeSlotDrafts, setGroupeSlotDrafts] = useState<Record<string, SlotDraft[]>>({});
  const [entretienDrafts, setEntretienDrafts] = useState<Record<string, DecisionEntretien>>({});
  const [commerceDrafts, setCommerceDrafts] = useState<Record<string, CommerceDraft>>({});

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
        (m) =>
          m.statut === 'hors_de_combat' &&
          !estFrancTireur(m) &&
          resolveProfil(roster, m)?.type === 'heros'
      ) ?? [],
    [roster]
  );

  // Gain d'expérience, section « à résoudre » : héros ET hommes de main seuls
  // (taille_groupe = 1) au statut Hors de combat — résolution individuelle.
  const horsDeCombatIndividuel = useMemo(
    () => roster?.membres.filter((m) => m.statut === 'hors_de_combat') ?? [],
    [roster]
  );

  // Modificateur automatique de la règle spéciale Œil des Dieux Sombres
  // (Maraudeurs du Chaos) en cas de défaite : +1 par Héros hors de combat.
  const nbHerosHorsDeCombat = useMemo(
    () => (roster ? horsDeCombatIndividuel.filter((m) => resolveProfil(roster, m)?.type === 'heros').length : 0),
    [horsDeCombatIndividuel, roster]
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
  // Un guerrier Blessé n'a pas participé à la bataille : pas d'XP non plus
  // (voir terminer(), qui avance seulement son compteur de tours blessé).
  const participantsAuto = useMemo(() => {
    const hcIds = new Set([...horsDeCombatIndividuel, ...groupesHC].map((m) => m.instance_id));
    return (
      roster?.membres.filter(
        (m) =>
          m.statut !== 'mort' &&
          m.statut !== 'blesse' &&
          !m.franc_tireur_impaye &&
          !hcIds.has(m.instance_id) &&
          resolveProfil(roster, m)?.type !== 'animal' &&
          getFrancTireur(m.franc_tireur_id)?.gagne_experience !== false
      ) ?? []
    );
  }, [roster, horsDeCombatIndividuel, groupesHC]);

  const francTireursParticipants = useMemo(
    () =>
      roster?.membres.filter((m) => {
        if (!estFrancTireur(m) || m.statut === 'mort' || m.statut === 'blesse' || m.franc_tireur_impaye) return false;
        if (m.statut === 'hors_de_combat' && xpDrafts[m.instance_id]?.survecu === 'non') return false;
        return true;
      }) ?? [],
    [roster, xpDrafts]
  );

  const exploration = useMemo(
    () =>
      roster
        ? resumeExploration(roster, catalogue, resultat, rules)
        : {
            herosEligibles: [],
            desHeros: 0,
            bonusVictoire: 0,
            bonusFixes: 0,
            totalDesALancer: 0,
            maximumAConserver: 6,
            aides: [],
          },
    [roster, catalogue, resultat, rules]
  );

  const herosCommerce: HerosCommerce[] = useMemo(() => {
    if (!roster) return [];
    return roster.membres.flatMap((membre) => {
      const profil = resolveProfil(roster, membre);
      if (
        profil?.type !== 'heros' ||
        estFrancTireur(membre) ||
        membre.statut === 'mort' ||
        membre.statut === 'blesse' ||
        membre.franc_tireur_impaye
      ) {
        return [];
      }
      const horsDeCombat = membre.statut === 'hors_de_combat';
      if (horsDeCombat && xpDrafts[membre.instance_id]?.survecu !== 'oui') return [];
      const membreApresBlessure = appliquerBlessureDraft(membre, blessureDrafts[membre.instance_id], date);
      if (membreApresBlessure.statut === 'mort') return [];
      return [{ membre, membreApresBlessure, horsDeCombat }];
    });
  }, [roster, xpDrafts, blessureDrafts, date]);

  const coutCommerce = Object.values(commerceDrafts).reduce((total, draft) => {
    if (draft.action === 'docteur') return total + COUT_DOCTEUR;
    if (draft.action === 'rare' && draft.achat) return total + draft.achat.cout;
    return total;
  }, 0);
  const stockCommerce = Object.values(commerceDrafts).flatMap((draft) => {
    if (draft.action === 'rare' && draft.achat) return [draft.achat];
    if (draft.action === 'docteur' && draft.statut === 'termine') return draft.equipementConserve;
    return [];
  });
  const commerceIncomplet = herosCommerce.some((hero) => {
    const draft = commerceDrafts[hero.membre.instance_id];
    return !draft || draft.statut !== 'termine';
  });
  // Résultats du docteur (étape Commerce), pour affichage nominatif dans le
  // résumé final — qui a consulté, quel jet, quel résultat.
  const docteurResultats = Object.entries(commerceDrafts).flatMap(([instanceId, draft]) => {
    if (draft.action !== 'docteur' || draft.statut !== 'termine') return [];
    const nom = roster?.membres.find((m) => m.instance_id === instanceId)?.nom_perso ?? '?';
    return [{ nom, jet: draft.jet, titre: draft.resultatTitre }];
  });
  // Blessures graves enregistrées cette bataille, pour affichage nominatif
  // dans le résumé final — qui a été touché et par quelle blessure.
  const blessuresResume = Object.entries(blessureDrafts)
    .filter(([, d]) => d.description.trim())
    .map(([instanceId, d]) => ({
      nom: roster?.membres.find((m) => m.instance_id === instanceId)?.nom_perso ?? '?',
      blessure: d.nom,
    }));
  // Gains de trésorerie issus de résultats de blessure grave automatisés
  // (ex : victoire au combat de Gladiateur, +50 po).
  const blessuresTresorerieBonus = Object.values(blessureDrafts).reduce(
    (total, d) => total + d.tresorerieBonus,
    0
  );

  const lignesEntretien: LigneEntretien[] = useMemo(() => {
    if (!roster) return [];
    const idsGratuits = new Set(
      effetsPersistantsAvecCle(roster, CLE_FRANC_TIREUR_GRATUIT).map((e) => e.cible)
    );
    return francTireursParticipants.map((m) => {
      // Engagé gratuitement pour une bataille via un événement d'exploration
      // (ex : Débiteur reconnaissant) — exemption ponctuelle, prioritaire sur
      // celle éventuellement définie par le profil lui-même.
      const exemptionGratuite = idsGratuits.has(m.instance_id)
        ? { label: 'Débiteur reconnaissant', texte: "Engagé gratuitement pour cette bataille." }
        : undefined;
      const profil = getFrancTireur(m.franc_tireur_id);
      if (!profil) {
        return {
          membre: m,
          nom: nomAffiche(m),
          type: 'or',
          cout: (m.profil_custom?.solde ?? 0) * (m.taille_groupe || 1),
          texte: 'Ancien profil personnalisé : solde enregistrée lors du recrutement.',
          exemption: exemptionGratuite,
        };
      }
      return {
        membre: m,
        nom: nomAffiche(m),
        type: profil.entretien.type,
        cout: coutEntretienFrancTireur(profil, roster),
        texte: profil.entretien.texte,
        exemption: exemptionGratuite ?? profil.entretien.exemption,
        maintienSansPaiement: profil.entretien.maintien_sans_paiement,
        departAutomatique: profil.depart_apres_bataille,
      };
    });
  }, [francTireursParticipants, roster]);

  const decisionEntretien = (ligne: LigneEntretien): DecisionEntretien =>
    entretienDrafts[ligne.membre.instance_id] ??
    (ligne.departAutomatique ? 'depart_automatique' : ligne.type === 'aucun' ? 'gratuit' : 'payer');

  const soldeTotal = lignesEntretien.reduce(
    (acc, ligne) => acc + (decisionEntretien(ligne) === 'payer' && ligne.type === 'or' ? ligne.cout : 0),
    0
  );
  const entretienMalepierre = lignesEntretien.reduce(
    (acc, ligne) => acc + (decisionEntretien(ligne) === 'payer' && ligne.type === 'malepierre' ? ligne.cout : 0),
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
    setBlessureDrafts((prev) => ({
      ...prev,
      [m.instance_id]: {
        recordId: uuidv4(),
        nom: resultat.nom,
        description: resultat.texte,
        statsDelta: resultat.statsDelta,
        equipement: resultat.perteEquipement ? '' : m.equipement,
        notes: resultat.notes,
        effets: resultat.effets.map((effet) => ({ ...effet, id: uuidv4() })),
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
    setCommerceDrafts((prev) => {
      const next = { ...prev };
      delete next[m.instance_id];
      return next;
    });
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
    setCommerceDrafts((prev) => {
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
    setCommerceDrafts((prev) => {
      const next = { ...prev };
      delete next[m.instance_id];
      return next;
    });
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
  const blessuresIncompletes = horsDeCombatHeros.some((m) => !blessureDrafts[m.instance_id]);

  const indexBlessures = 1;
  const indexGainXp = 2;
  const indexCommerce = 4;
  const indexEntretien = 5;
  // Le prix de vente du wyrdstone est entièrement dérivé de la table
  // officielle (quantité vendue × taille de bande) — jamais saisi à la main,
  // pour ne jamais diverger de ce que le tableau affiche.
  const prixVente = prixVenteWyrdstone(quantiteVendue, effectifTotal(roster));
  const orDisponibleAvantCommerce = roster.tresorerie + prixVente + blessuresTresorerieBonus;
  const orDisponiblePourEntretien = orDisponibleAvantCommerce - coutCommerce;
  const wyrdstoneDisponiblePourEntretien = Math.max(
    0,
    roster.wyrdstone + wyrdstoneTrouve - quantiteVendue
  );
  const entretienInsuffisant =
    soldeTotal > orDisponiblePourEntretien || entretienMalepierre > wyrdstoneDisponiblePourEntretien;

  const suivant = () => {
    if (etape === indexBlessures && blessuresIncompletes) return;
    if (etape === indexGainXp && hcIncomplete) return;
    if (etape === indexCommerce && commerceIncomplet) return;
    if (etape === indexEntretien && entretienInsuffisant) return;
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

  // Variante à quantité multiple (voir LigneObjetTrouve dans
  // tableExplorationEvenements.ts, ex : "D3 Arquebuses") : toutes les
  // instances rejoignent le stock en un seul patch, pour éviter de perdre
  // des exemplaires en rappelant ajouterAuStock plusieurs fois de suite sur
  // le même `roster` capturé par la fermeture.
  const ajouterAuStockMultiple = (item: ShopItem, coutPaye: number, quantite: number) => {
    updateRoster({ ...roster, stock: [...roster.stock, ...creerEntreesInventaire(item, coutPaye, quantite)] });
  };

  // Or trouvé lors d'un événement d'exploration (double/triple/etc., voir
  // tableExplorationEvenements.ts) : appliqué immédiatement à la trésorerie,
  // comme ajouterAuStock ci-dessus, indépendamment de la validation finale
  // de l'assistant.
  const ajouterOrExploration = (montant: number) => {
    updateRoster({ ...roster, tresorerie: roster.tresorerie + montant });
  };

  // Fusion générique d'un patch dans la bande, appliqué immédiatement — pour
  // les résolutions d'événement d'exploration qui touchent autre chose que
  // la trésorerie ou le stock (ex : Puits, Vagabond).
  const majRosterExploration = (patch: Partial<RosterInstance>) => {
    updateRoster({ ...roster, ...patch });
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
    const succession = succederApresMorts(roster, catalogue, membresMaj);
    updateRoster({ ...roster, ...succession, membres: nouveauMembre ? [...membresMaj, nouveauMembre] : membresMaj });
    const cible = nouveauMembre ?? updated;
    const dernier = cible.historique_avancees[cible.historique_avancees.length - 1];
    if (dernier) {
      setAvancesResolues((prev) => [...prev, { nom: nomAffiche(cible), detail: dernier.detail }]);
    }
  };

  const terminer = async () => {
    const tresorerieApres =
      roster.tresorerie + prixVente - soldeTotal + blessuresTresorerieBonus - coutCommerce;
    const groupesHCIds = new Set(groupesHC.map((m) => m.instance_id));

    // Journalisation des guerriers restés au camp car Blessé (voir la
    // branche m.statut === 'blesse' ci-dessous) — remplie en même temps que
    // membresMaj, pour le journal de bataille.
    const blessesAuCamp: { nom: string; retabli: boolean }[] = [];

    const membresMaj: Member[] = roster.membres.map((m) => {
      const commerce = commerceDrafts[m.instance_id];
      const traitementDocteur =
        commerce?.action === 'docteur' && commerce.statut === 'termine'
          ? commerce.membreApresTraitement
          : undefined;
      let membre = {
        ...(traitementDocteur ?? appliquerBlessureDraft(m, blessureDrafts[m.instance_id], date)),
        franc_tireur_impaye: false,
      };
      const profil = resolveProfil(roster, m);
      const profilFrancTireur = getFrancTireur(m.franc_tireur_id);
      const decision = lignesEntretien.find((ligne) => ligne.membre.instance_id === m.instance_id)
        ? entretienDrafts[m.instance_id] ??
          (profilFrancTireur?.depart_apres_bataille
            ? 'depart_automatique'
            : profilFrancTireur?.entretien.type === 'aucun'
              ? 'gratuit'
              : 'payer')
        : undefined;
      const estLeaderVictoire = estLeaderActuel(roster, catalogue, m) && resultat === 'victoire';

      if (membre.statut === 'mort') {
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
          let xp = profilFrancTireur?.gagne_experience === false ? m.xp : d.xp;
          if (estLeaderVictoire) xp += 1;
          membre =
            membre.statut === 'blesse'
              ? { ...membre, xp }
              : { ...membre, statut: 'actif', xp };
        }
        if (decision === 'impaye') membre = { ...membre, franc_tireur_impaye: true };
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

      // Un Geôlier conservé sans solde a manqué cette bataille : pas d’XP,
      // puis sa dette est considérée comme purgée pour la prochaine partie.
      if (m.franc_tireur_impaye) {
        return membre;
      }

      if (profilFrancTireur?.gagne_experience === false) {
        if (decision === 'impaye') membre = { ...membre, franc_tireur_impaye: true };
        return membre;
      }

      // Guerrier Blessé : reste au camp, ne participe pas à la bataille (pas
      // d'XP), mais son compteur de tours blessé avance d'un cran. Rétabli
      // (retour à Actif, compteur remis à 0/0) une fois le total atteint.
      if (m.statut === 'blesse') {
        const tourActuel = m.blesse_tour_actuel + 1;
        const retabli = m.blesse_tour_total > 0 && tourActuel >= m.blesse_tour_total;
        blessesAuCamp.push({ nom: nomAffiche(m), retabli });
        membre = retabli
          ? { ...membre, statut: 'actif', blesse_tour_actuel: 0, blesse_tour_total: 0 }
          : { ...membre, blesse_tour_actuel: tourActuel };
        return membre;
      }

      // Reste du roster : XP de participation automatique (+1), ajustable
      // via la barre pendant l'assistant.
      const d = xpDrafts[m.instance_id];
      let xp = d ? d.xp : m.xp + 1;
      if (estLeaderVictoire) xp += 1;
      membre = { ...membre, xp };
      if (decision === 'impaye') membre = { ...membre, franc_tireur_impaye: true };
      return membre;
    });

    const idsARenvoyer = new Set(
      lignesEntretien
        .filter((ligne) => {
          const decision = decisionEntretien(ligne);
          return decision === 'renvoyer' || decision === 'depart_automatique';
        })
        .map((ligne) => ligne.membre.instance_id)
    );
    const membresConserves = membresMaj.filter((m) => !idsARenvoyer.has(m.instance_id));

    const journal: JournalPostBataille = {
      wyrdstoneTrouve,
      notesExploration: notesExploration.trim(),
      quantiteVendue,
      prixVente,
      soldeFrancsTireurs: soldeTotal,
      entretienFrancsTireurs: lignesEntretien.map((ligne) => {
        const decision = decisionEntretien(ligne);
        const decisionJournal: NonNullable<JournalPostBataille['entretienFrancsTireurs']>[number]['decision'] =
          decision === 'payer'
            ? 'paye'
            : decision === 'renvoyer'
              ? 'renvoye'
              : decision === 'depart_automatique'
                ? 'depart_automatique'
                : decision === 'gratuit'
                  ? 'gratuit'
                  : 'exempte';
        return {
          nom: ligne.nom,
          decision: decisionJournal,
          coutOr: decision === 'payer' && ligne.type === 'or' ? ligne.cout : 0,
          coutMalepierre: decision === 'payer' && ligne.type === 'malepierre' ? ligne.cout : 0,
        };
      }),
      commerce: herosCommerce.map(({ membre }) => {
        const draft = commerceDrafts[membre.instance_id];
        if (!draft || draft.action === 'aucune') {
          return { nom: membre.nom_perso, action: 'aucune' as const, detail: 'Aucune action.', cout: 0 };
        }
        if (draft.action === 'rare') {
          return {
            nom: membre.nom_perso,
            action: 'recherche_rare' as const,
            detail: `${draft.objetNom} (Rare ${draft.rarete}) — ${
              draft.reussi ? (draft.achat ? 'réussie, acheté' : 'réussie, non acheté') : 'ratée'
            }.`,
            cout: draft.achat?.cout ?? 0,
          };
        }
        return {
          nom: membre.nom_perso,
          action: 'docteur' as const,
          detail:
            draft.statut === 'termine'
              ? `2D6 = ${draft.jet} — ${draft.resultatTitre}.`
              : 'Consultation payée, résultat non saisi.',
          cout: COUT_DOCTEUR,
        };
      }),
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
      blesses: blessesAuCamp,
    };

    const bataille: BattleRecord = {
      id: uuidv4(),
      date,
      resultat,
      adversaires,
      notes: notesBataille.trim(),
      journal,
    };

    const succession = succederApresMorts(roster, catalogue, membresConserves);

    // Francs-tireurs dont l'exemption "Débiteur reconnaissant" vient d'être
    // proposée à l'entretien de cette bataille — consommée qu'elle ait été
    // choisie ou non (la gratuité ne couvrait qu'une seule bataille).
    const idsEntretienResolu = new Set(lignesEntretien.map((ligne) => ligne.membre.instance_id));

    await updateRoster({
      ...roster,
      ...succession,
      membres: membresConserves,
      stock: [...roster.stock, ...stockCommerce],
      wyrdstone: Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue - entretienMalepierre),
      tresorerie: tresorerieApres,
      equipement_reserve: notesExploration.trim()
        ? `${roster.equipement_reserve}${roster.equipement_reserve ? '\n' : ''}${notesExploration.trim()}`
        : roster.equipement_reserve,
      historique_batailles: [...roster.historique_batailles, bataille],
      // Le bonus de dé(s) d'exploration en attente (ex : Vagabond interrogé)
      // vient d'être utilisé pour cette phase d'exploration — consommé.
      effets_persistants: (roster.effets_persistants ?? []).filter(
        (e) =>
          e.cle !== CLE_DE_SUPPLEMENTAIRE_EXPLORATION &&
          !(e.cle === CLE_FRANC_TIREUR_GRATUIT && e.cible && idsEntretienResolu.has(e.cible))
      ),
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
        <EtapeResultat
          roster={roster}
          catalogue={catalogue}
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
          onAchatStock={ajouterAuStock}
        />
      )}

      {etape === 1 && (
        <EtapeBlessuresGraves
          roster={roster}
          horsDeCombatHeros={horsDeCombatHeros}
          blessureDrafts={blessureDrafts}
          tresorerieDisponible={roster.tresorerie + blessuresTresorerieBonus}
          onAppliquer={appliquerBlessureWizard}
          onReinitialiser={reinitialiserBlessure}
        />
      )}

      {etape === indexGainXp && (
        <EtapeGainXp
          roster={roster}
          catalogue={catalogue}
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
          date={date}
          wyrdstoneTrouve={wyrdstoneTrouve}
          onWyrdstoneTrouveChange={setWyrdstoneTrouve}
          notesExploration={notesExploration}
          onNotesExplorationChange={setNotesExploration}
          quantiteVendue={quantiteVendue}
          onQuantiteVendueChange={setQuantiteVendue}
          pointsVeteran={pointsVeteran}
          onPointsVeteranChange={setPointsVeteran}
          onAchatStock={ajouterAuStock}
          onAchatStockMultiple={ajouterAuStockMultiple}
          onAjouterOr={ajouterOrExploration}
          onMajRoster={majRosterExploration}
          resumeExploration={exploration}
        />
      )}

      {etape === 4 && (
        <EtapeCommerce
          roster={roster}
          catalogue={catalogue!}
          heros={herosCommerce}
          drafts={commerceDrafts}
          tresorerieDisponible={orDisponibleAvantCommerce - coutCommerce}
          docteurActif={rules.sawbonesDocteur}
          onChanger={(instanceId, draft) =>
            setCommerceDrafts((precedents) => {
              if (draft) return { ...precedents, [instanceId]: draft };
              const suivants = { ...precedents };
              delete suivants[instanceId];
              return suivants;
            })
          }
        />
      )}

      {etape === 5 && (
        <EtapeEntretien
          lignes={lignesEntretien}
          decisions={entretienDrafts}
          onDecision={(instanceId, decision) =>
            setEntretienDrafts((precedents) => ({ ...precedents, [instanceId]: decision }))
          }
          totalOr={soldeTotal}
          totalMalepierre={entretienMalepierre}
          orDisponible={orDisponiblePourEntretien}
          malepierreDisponible={wyrdstoneDisponiblePourEntretien}
        />
      )}

      {etape === 6 && (
        <EtapeResume
          roster={roster}
          catalogue={catalogue}
          date={date}
          resultat={resultat}
          adversaires={adversaires}
          wyrdstoneTrouve={wyrdstoneTrouve}
          quantiteVendue={quantiteVendue}
          prixVente={prixVente}
          soldeTotal={soldeTotal}
          entretienMalepierre={entretienMalepierre}
          blessuresTresorerieBonus={blessuresTresorerieBonus}
          coutCommerce={coutCommerce}
          francTireursPayesCount={lignesEntretien.filter(
            (ligne) => decisionEntretien(ligne) === 'payer' && ligne.type === 'or'
          ).length}
          francsTireursPartants={lignesEntretien
            .filter((ligne) => {
              const decision = decisionEntretien(ligne);
              return decision === 'renvoyer' || decision === 'depart_automatique';
            })
            .map((ligne) => ligne.nom)}
          avancesResolues={avancesResolues}
          blessuresResume={blessuresResume}
          docteurResultats={docteurResultats}
          horsDeCombatIndividuel={horsDeCombatIndividuel}
          xpDraftDe={xpDraftDe}
          groupesHC={groupesHC}
          participantsAuto={participantsAuto}
        />
      )}

      {etape === 6 && catalogue?.id === 'maraudeurs_du_chaos' && (
        <ResolutionOeilDesDieuxSombres
          roster={roster}
          catalogue={catalogue}
          resultat={resultat}
          date={date}
          nbHerosHorsDeCombat={nbHerosHorsDeCombat}
          onMajRoster={majRosterExploration}
        />
      )}

      <div className="flex gap-sm">
        <button className="btn" disabled={etape === 0} onClick={precedent}>
          Précédent
        </button>
        {etape < ETAPES.length - 1 && (
          <button
            className="btn btn--primary"
            disabled={
              (etape === indexBlessures && blessuresIncompletes) ||
              (etape === indexGainXp && hcIncomplete) ||
              (etape === indexCommerce && commerceIncomplet) ||
              (etape === indexEntretien && entretienInsuffisant)
            }
            onClick={suivant}
          >
            Suivant
          </button>
        )}
        {etape === ETAPES.length - 1 && (
          <button className="btn btn--primary" onClick={terminer}>
            Valider et enregistrer
          </button>
        )}
      </div>
      {etape === indexBlessures && blessuresIncompletes && (
        <p className="text-sm text-danger" style={{ marginTop: '0.5rem' }}>
          Résous la blessure grave de chaque Héros Hors de combat avant de continuer.
        </p>
      )}
      {etape === indexGainXp && hcIncomplete && (
        <p className="text-sm text-danger" style={{ marginTop: '0.5rem' }}>
          Résous d'abord le statut (survécu / n'a pas survécu) de tous les Hors de combat avant de continuer.
        </p>
      )}
      {etape === indexCommerce && commerceIncomplet && (
        <p className="text-sm text-danger" style={{ marginTop: '0.5rem' }}>
          Choisis une action de commerce pour chaque Héros et termine toute consultation payée avant de continuer.
        </p>
      )}
      {etape === indexEntretien && entretienInsuffisant && (
        <p className="text-sm text-danger" style={{ marginTop: '0.5rem' }}>
          Les ressources disponibles ne couvrent pas les contrats conservés.
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
                roster={roster}
                heroCount={heroCount}
                equitationGratuite={equitationGratuitePourTribu(catalogue, roster)}
                onClose={() => setMembreEnAvancee(null)}
                onApply={appliquerAvancee}
              />
            )
          );
        })()}
    </Screen>
  );
}
