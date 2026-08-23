import { useState } from 'react';
import { STAT_KEYS } from '../../types/catalog';
import type { Stats } from '../../types/catalog';
import {
  BLESSURES_GRAVES,
  trouverBlessure,
  type ResultatBlessureGrave,
  type SousJetOption,
} from '../../data/blessuresGraves';
import { getFrancTireur } from '../../data/hiredSwords';
import { Icon, type IconName } from '../common/Icon';
import type { SeriousInjuryEffect } from '../../types/roster';
import { useLanguage } from '../../state/useLanguage';
import type { Language } from '../../state/useLanguage';
import { translateBlessure } from '../../i18n/data/blessuresGraves';
import { libelleCaracteristique } from '../../utils/stats';
import { traduireCle, segmentAffiche } from '../../utils/blessures';

// Noms sentinelles des issues spéciales "Gladiateur"/"Capturé", utilisés à la
// fois pour construire le résultat (texte français persisté, voir
// choisirGladiateurIssue/choisirCapturePerdu/choisirCaptureRancon) et pour
// reconnaître ces cas dans l'aperçu de confirmation (voir
// texteIterationAfficheeAvecSpeciaux) — ces issues ne sont pas dans la table
// canonique BLESSURES_GRAVES, `estPersonnalise` les exclurait donc à tort de
// toute traduction sans ce traitement dédié.
const NOM_GLADIATEUR_VICTOIRE = 'Gladiateur (victoire)';
const NOM_CAPTURE_PERDU = 'Capturé — héros perdu';
const NOM_CAPTURE_RANCON = 'Capturé — libéré contre rançon';
const NOM_CAPTURE_ECHANGE = 'Capturé — échangé contre un prisonnier';

// Profil de l'adversaire dans les fosses de combat (résultat "Gladiateur") —
// c'est le franc-tireur "Gladiateur" (Pit Fighter, hiredSwords.ts) que l'on
// affronte, pas le profil homonyme recrutable dans la bande Gladiateurs
// (mêmes stats de base mais équipement/règles différents).
const FRANC_TIREUR_GLADIATEUR_ADVERSAIRE = getFrancTireur('gladiateur');

function BlocStats({
  titre,
  stats,
  equipement,
  reglesSpeciales,
}: {
  titre: string;
  stats: Stats;
  equipement?: string[];
  reglesSpeciales?: { nom: string; texte: string }[];
}) {
  const { t, language } = useLanguage();
  return (
    <div className="card card--tight" style={{ marginBottom: '0.5rem' }}>
      <p className="text-sm mb-0" style={{ fontWeight: 'bold' }}>
        {titre}
      </p>
      <div className="stat-grid" style={{ marginTop: '0.3rem' }}>
        {STAT_KEYS.map((k) => (
          <div key={k} className="stat-grid__cell stat-grid__cell--label">
            {libelleCaracteristique(k, language)}
          </div>
        ))}
        {STAT_KEYS.map((k) => (
          <div key={k} className="stat-grid__cell stat-grid__cell--value">
            {stats[k]}
          </div>
        ))}
      </div>
      {!!equipement?.length && (
        <p className="text-sm mb-0" style={{ marginTop: '0.4rem' }}>
          <strong>{t('blessureGraveWizard.equipmentLabel')}</strong> {equipement.join(', ')}
        </p>
      )}
      {!!reglesSpeciales?.length && (
        <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
          <strong>{t('blessureGraveWizard.specialRulesLabel')}</strong>{' '}
          {reglesSpeciales.map((r) => `${r.nom} — ${r.texte}`).join(' · ')}
        </p>
      )}
    </div>
  );
}

const ICONE_BLESSURE: Partial<Record<string, IconName>> = {
  mort: 'crane',
  capture: 'chaine',
  detrousse: 'cle',
  retablissement_complet: 'etoile',
  endurci: 'bouclier',
  survit_contre_tout: 'etoile',
  gladiateur: 'epee',
  cicatrices_horribles: 'ossements',
};

function iconePourBlessure(r: ResultatBlessureGrave): IconName {
  return ICONE_BLESSURE[r.id] ?? 'goutte';
}

export type BlessureGraveResultat = {
  nom: string;
  texte: string;
  statsDelta: Partial<Record<keyof Stats, number>>;
  notes: string[];
  effets: Omit<SeriousInjuryEffect, 'id'>[];
  perteEquipement: boolean;
  statutMort: boolean;
  xpBonus: number;
  tresorerieBonus: number;
};

type IterationResolue = {
  resultat: ResultatBlessureGrave;
  sousJetChoisi?: SousJetOption;
  dureeD3?: number;
};

type Mode =
  | 'liste'
  | 'sous_jet'
  | 'duree_d3'
  | 'multiples_compte'
  | 'gladiateur_issue'
  | 'capture_issue'
  | 'confirmation';

function fusionnerStats(
  a: Partial<Record<keyof Stats, number>>,
  b: Partial<Record<keyof Stats, number>>
): Partial<Record<keyof Stats, number>> {
  const res = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const key = k as keyof Stats;
    res[key] = (res[key] ?? 0) + (v ?? 0);
  }
  return res;
}

// `language` ne sert qu'aux deux phrases de liaison ci-dessous (voir
// traduireCle) — `it.resultat`/`it.sousJetChoisi` sont déjà dans la bonne
// langue quand cette fonction est appelée depuis texteIterationAffichee
// (voir iterationAffichee), ou toujours en français depuis
// construireResultatBase (texte persisté).
function texteIteration(it: IterationResolue, language: Language = 'fr'): string {
  let t = `${it.resultat.nom} (${it.resultat.code}) — ${it.resultat.texte}`;
  if (it.sousJetChoisi) {
    const prefixe = traduireCle('blessureGraveWizard.subRollResultPrefix', language);
    t += ` ${prefixe} (${it.sousJetChoisi.label}) : ${it.sousJetChoisi.texte}`;
  }
  if (it.dureeD3) {
    t += ` ${traduireCle('blessureGraveWizard.missesNextGamesSuffix', language, { n: it.dureeD3 })}`;
  }
  return t;
}

// Un résultat dont le nom diffère de l'entrée d'origine a été personnalisé
// en cours de résolution (ex : "Capturé — libéré contre rançon", "Gladiateur
// (victoire)") — son texte n'existe alors que dans cette langue (française)
// et ne doit pas être écrasé par la traduction générique de son id.
function estPersonnalise(r: ResultatBlessureGrave): boolean {
  const original = trouverBlessure(r.id);
  return !original || original.nom !== r.nom;
}

// Version traduite d'une itération résolue — n'a plus qu'un seul usage
// restant : extraire les noteTag traduits pour le bloc "À ajouter aux
// notes" de l'aperçu (voir notesTraductionMap plus bas). Le texte affiché de
// la blessure elle-même passe désormais par segmentAffiche (utils/blessures,
// voir texteIterationAfficheeAvecSpeciaux) — même logique de traduction que
// l'affichage persisté, pas de réimplémentation parallèle ici.
function iterationAffichee(it: IterationResolue, language: Language): IterationResolue {
  if (estPersonnalise(it.resultat)) return it;
  const resultat = translateBlessure(it.resultat, language);
  if (!it.sousJetChoisi) return { ...it, resultat };
  const index = it.resultat.sousJet?.options.indexOf(it.sousJetChoisi) ?? -1;
  const sousJetChoisi = index >= 0 ? (resultat.sousJet?.options[index] ?? it.sousJetChoisi) : it.sousJetChoisi;
  return { ...it, resultat, sousJetChoisi };
}

function notesIteration(it: IterationResolue): string[] {
  const notes: string[] = [];
  if (it.resultat.noteTag) notes.push(it.resultat.noteTag);
  if (it.sousJetChoisi?.noteTag) notes.push(it.sousJetChoisi.noteTag);
  if (it.dureeD3) notes.push(`Manque ${it.dureeD3} prochaine(s) partie(s) (${it.resultat.nom})`);
  return notes;
}

function statsIteration(it: IterationResolue): Partial<Record<keyof Stats, number>> {
  return fusionnerStats(it.resultat.stat ?? {}, it.sousJetChoisi?.stat ?? {});
}

// Effet structuré d'une itération résolue — partagé entre construireResultatBase
// (persisté dans SeriousInjuryRecord.effets) et l'aperçu de confirmation (voir
// texteIterationAfficheeAvecSpeciaux), qui appelle sur ce même objet le
// traducteur utils/blessures.segmentAffiche déjà utilisé pour re-traduire
// l'affichage persisté — une seule logique de reconnaissance/traduction des
// résultats, plutôt que deux implémentations parallèles.
function effetDeIteration(it: IterationResolue): Omit<SeriousInjuryEffect, 'id'> {
  return {
    resultat_id: it.resultat.id,
    nom: it.resultat.nom,
    stats_delta: statsIteration(it),
    notes_ajoutees: notesIteration(it),
    sous_jet_id: it.sousJetChoisi?.id,
  };
}

type Props = {
  nomPersonnage: string;
  // Le guerrier a déjà résolu "Aveuglé d'un œil" par le passé (historique
  // blessures_graves) : un second tirage sur ce résultat lui fait perdre son
  // second œil, ce qui force le statut Mort (règle imprimée dans le texte de
  // la blessure elle-même — voir data/blessuresGraves.ts).
  dejaAveugle?: boolean;
  // Trésorerie actuelle de la bande — affichée avant/après le choix d'une
  // rançon pour le résultat "Capturé", purement informatif (le paiement
  // n'est appliqué qu'à la validation finale, via tresorerieBonus négatif).
  tresorerieDisponible?: number;
  // Règle spéciale Éternelle (Liche des Morts Sans Repos) : peut ignorer
  // n'importe quel résultat de Blessure grave sauf Tué, en subissant à la
  // place -1 PV permanent — indisponible s'il ne lui reste qu'1 PV. Un
  // résultat Tué devient automatiquement -D3 PV permanents (mort normale
  // seulement si cela ramène ses PV à 0 ou moins).
  estEternelle?: boolean;
  // PV actuels du profil (Member.stats_actuels.PV) — nécessaire pour
  // appliquer/vérifier la règle Éternelle ci-dessus.
  pvActuelProfil?: number;
  // Caractéristiques, équipement et règles spéciales actuels du combattant —
  // affichés à côté du profil du franc-tireur Gladiateur adverse pendant la
  // résolution du résultat "Gladiateur" (voir BlocStats), pour résoudre le
  // duel sans avoir à quitter l'assistant.
  statsPersonnage?: Stats;
  equipementPersonnage?: string[];
  reglesSpecialesPersonnage?: { nom: string; texte: string }[];
  onAppliquer: (resultat: BlessureGraveResultat) => void;
  onAnnuler?: () => void;
};

const ID_INTERDITS_BOUCLE = ['mort', 'capture', 'blessures_multiples'];

export function BlessureGraveWizard({
  nomPersonnage,
  dejaAveugle = false,
  tresorerieDisponible,
  estEternelle = false,
  pvActuelProfil,
  statsPersonnage,
  equipementPersonnage,
  reglesSpecialesPersonnage,
  onAppliquer,
  onAnnuler,
}: Props) {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<Mode>('liste');
  const [contexte, setContexte] = useState<'racine' | 'boucle'>('racine');
  const [selectionActuelle, setSelectionActuelle] = useState<ResultatBlessureGrave | null>(null);
  const [selectionEnAttente, setSelectionEnAttente] = useState('');
  const [racine, setRacine] = useState<IterationResolue | null>(null);
  const [multiplesCount, setMultiplesCount] = useState<number | null>(null);
  const [multiplesResultats, setMultiplesResultats] = useState<IterationResolue[]>([]);
  const [precision, setPrecision] = useState('');
  // Cas spécial "Gladiateur" perdu : la relance suivante porte sur la table
  // complète (y compris un nouveau "Gladiateur", auquel cas un autre combat
  // s'enchaîne) et entraîne toujours la perte d'équipement, quel que soit le
  // résultat tiré — ce second point ne se déduit pas des données de la table
  // elle-même, d'où ce drapeau appliqué à part dans construireResultatFinal.
  // Si la relance tombe sur Mort, ce résultat porte déjà son propre
  // statutMort/perteEquipement : aucun cas particulier à gérer ici.
  const [enChoixGladiateurPerdu, setEnChoixGladiateurPerdu] = useState(false);
  const [gladiateurForcePerte, setGladiateurForcePerte] = useState(false);
  // Cas spécial "Capturé" : trois issues possibles pour la bande du héros
  // capturé — perdu (vendu/tué/zombifié par les ravisseurs, équipement
  // perdu), échangé contre un prisonnier détenu par sa propre bande (retour
  // immédiat, équipement conservé, sans coût), ou libéré contre rançon
  // (retour immédiat, équipement conservé, coût en po saisi avant de
  // conclure — voir mode 'capture_issue' plus bas).
  const [captureChoix, setCaptureChoix] = useState<'perdu' | 'echange' | 'rancon' | null>(null);
  const [ranconSaisie, setRanconSaisie] = useState('');
  // Règle Éternelle (voir Props.estEternelle) : sur un résultat autre que
  // Tué, la Liche peut choisir d'ignorer ce résultat contre -1 PV permanent.
  const [eternelleIgnorer, setEternelleIgnorer] = useState(false);
  // Sur un résultat Tué, le jet de D3 (perte de PV permanents) qui remplace
  // automatiquement la mort — saisi comme n'importe quel jet papier.
  const [eternelleDeD3Saisi, setEternelleDeD3Saisi] = useState('');

  const enCoursDansBoucle = contexte === 'boucle' && multiplesCount !== null;
  const iterationActuelleIndex = multiplesResultats.length + 1;

  const reinitialiser = () => {
    setMode('liste');
    setContexte('racine');
    setSelectionActuelle(null);
    setSelectionEnAttente('');
    setRacine(null);
    setMultiplesCount(null);
    setMultiplesResultats([]);
    setPrecision('');
    setEnChoixGladiateurPerdu(false);
    setGladiateurForcePerte(false);
    setCaptureChoix(null);
    setRanconSaisie('');
    setEternelleIgnorer(false);
    setEternelleDeD3Saisi('');
  };

  const terminerIteration = (it: IterationResolue) => {
    if (contexte === 'boucle') {
      const nouveaux = [...multiplesResultats, it];
      setMultiplesResultats(nouveaux);
      setSelectionActuelle(null);
      setSelectionEnAttente('');
      if (multiplesCount !== null && nouveaux.length >= multiplesCount) {
        setMode('confirmation');
      } else {
        setMode('liste');
      }
    } else {
      setRacine(it);
      setMode('confirmation');
    }
  };

  const choisirResultat = (r: ResultatBlessureGrave) => {
    setSelectionActuelle(r);
    // Le filtre ne concerne que ce choix précis dans la liste — une éventuelle
    // relance imbriquée (ex : Blessures multiples tiré dans ce lot) repart sur
    // la table complète, conformément à la règle.
    setEnChoixGladiateurPerdu(false);
    if (r.combatGladiateur) {
      setMode('gladiateur_issue');
      return;
    }
    if (r.captureIssue) {
      setCaptureChoix(null);
      setRanconSaisie('');
      setMode('capture_issue');
      return;
    }
    if (r.multiplesInjuries) {
      // Racine posée dès maintenant : la boucle de relance qui suit ne
      // retouche jamais `racine` (voir terminerIteration, branche 'boucle'),
      // donc c'est le seul moment où l'accrocher est possible avant que
      // construireResultatFinal en ait besoin pour agréger le résultat final.
      setRacine({ resultat: r });
      setMode('multiples_compte');
      return;
    }
    if (r.sousJet) {
      setMode('sous_jet');
      return;
    }
    if (r.sousJetDureeD3) {
      setMode('duree_d3');
      return;
    }
    terminerIteration({ resultat: r });
  };

  const choisirGladiateurIssue = (victoire: boolean) => {
    if (!selectionActuelle) return;
    if (victoire) {
      terminerIteration({
        resultat: {
          ...selectionActuelle,
          nom: NOM_GLADIATEUR_VICTOIRE,
          texte:
            "Le guerrier remporte son combat dans les fosses du Repaire des Coupe-Jarrets : il empoche 50 pièces d'or, gagne 2 points d'Expérience et rejoint sa bande avec tout son équipement intact.",
          xpBonus: 2,
          tresorerieBonus: 50,
          perteEquipement: false,
          statutMort: false,
        },
      });
    } else {
      // Défaite : une seule relance, filtrée sur 11-35 (Mort inclus comme
      // résultat possible parmi les autres) — pas de question Mort/Vivant à
      // part, le résultat tiré tranche lui-même.
      setGladiateurForcePerte(true);
      setEnChoixGladiateurPerdu(true);
      setSelectionActuelle(null);
      setSelectionEnAttente('');
      setMode('liste');
    }
  };

  const choisirCapturePerdu = () => {
    if (!selectionActuelle) return;
    terminerIteration({
      resultat: {
        ...selectionActuelle,
        nom: NOM_CAPTURE_PERDU,
        texte:
          "Le prisonnier ne revient pas : vendu à des marchands d'esclaves, exécuté ou transformé par ses ravisseurs, il quitte définitivement la bande. Son équipement reste aux mains de ses ravisseurs.",
        captureIssue: false,
        perteEquipement: true,
        statutMort: true,
      },
    });
  };

  const choisirCaptureEchange = () => {
    if (!selectionActuelle) return;
    terminerIteration({
      resultat: {
        ...selectionActuelle,
        nom: NOM_CAPTURE_ECHANGE,
        texte:
          "Le prisonnier est échangé contre un captif détenu par sa propre bande. Il conserve tout son équipement et rejoint aussitôt la bande.",
        captureIssue: false,
        perteEquipement: false,
        statutMort: false,
      },
    });
  };

  const choisirCaptureRancon = () => {
    if (!selectionActuelle) return;
    const montant = Math.max(0, Math.trunc(Number(ranconSaisie) || 0));
    terminerIteration({
      resultat: {
        ...selectionActuelle,
        nom: NOM_CAPTURE_RANCON,
        texte: `Le prisonnier est libéré contre une rançon de ${montant} po, payée par la bande. Il conserve tout son équipement et rejoint aussitôt la bande.`,
        captureIssue: false,
        perteEquipement: false,
        statutMort: false,
        tresorerieBonus: -montant,
      },
    });
  };

  const choisirSousJet = (option: SousJetOption) => {
    if (!selectionActuelle) return;
    terminerIteration({ resultat: selectionActuelle, sousJetChoisi: option });
  };

  const choisirDureeD3 = (n: number) => {
    if (!selectionActuelle) return;
    terminerIteration({ resultat: selectionActuelle, dureeD3: n });
  };

  const choisirMultiplesCount = (n: number) => {
    setMultiplesCount(n);
    setMultiplesResultats([]);
    setContexte('boucle');
    setSelectionActuelle(null);
    setSelectionEnAttente('');
    setMode('liste');
  };

  const validerSelection = () => {
    const r = BLESSURES_GRAVES.find((b) => b.id === selectionEnAttente);
    if (r) choisirResultat(r);
  };

  const prefixeGladiateur = gladiateurForcePerte ? 'Défaite face à un gladiateur dans les fosses de combat — ' : '';

  const NOTE_SECOND_OEIL = 'Perd son second œil — retiré définitivement de la bande (Mort).';

  const construireResultatBase = (): BlessureGraveResultat => {
    if (racine && racine.resultat.multiplesInjuries) {
      const texte =
        `${prefixeGladiateur}Blessures multiples (16-21) — relance de ${multiplesResultats.length} résultat(s) supplémentaire(s) :\n` +
        multiplesResultats.map((it, i) => `${i + 1}. ${texteIteration(it)}`).join('\n');
      let stats: Partial<Record<keyof Stats, number>> = {};
      let notes: string[] = [];
      let perteEquipement = false;
      let xpBonus = 0;
      let tresorerieBonus = 0;
      let nombreOeilPerdu = dejaAveugle ? 1 : 0;
      for (const it of multiplesResultats) {
        stats = fusionnerStats(stats, statsIteration(it));
        notes = [...notes, ...notesIteration(it)];
        if (it.resultat.perteEquipement) perteEquipement = true;
        if (it.resultat.xpBonus) xpBonus += it.resultat.xpBonus;
        if (it.resultat.tresorerieBonus) tresorerieBonus += it.resultat.tresorerieBonus;
        if (it.resultat.id === 'aveugle_oeil') nombreOeilPerdu += 1;
      }
      const secondOeilPerdu = nombreOeilPerdu >= 2;
      if (secondOeilPerdu) notes = [...notes, NOTE_SECOND_OEIL];
      return {
        nom: `Blessures multiples (${multiplesResultats.map((it) => it.resultat.nom).join(', ')})`,
        texte: precision.trim()
          ? `${texte}\n\nPrécision : ${precision.trim()}`
          : secondOeilPerdu
            ? `${texte}\n\n${NOTE_SECOND_OEIL}`
            : texte,
        statsDelta: stats,
        notes,
        effets: multiplesResultats.map(effetDeIteration),
        perteEquipement: perteEquipement || gladiateurForcePerte,
        statutMort: secondOeilPerdu,
        xpBonus,
        tresorerieBonus,
      };
    }
    if (!racine) {
      return {
        nom: '',
        texte: '',
        statsDelta: {},
        notes: [],
        effets: [],
        perteEquipement: false,
        statutMort: false,
        xpBonus: 0,
        tresorerieBonus: 0,
      };
    }
    const secondOeilPerdu = racine.resultat.id === 'aveugle_oeil' && dejaAveugle;
    const texte = `${prefixeGladiateur}${texteIteration(racine)}`;
    return {
      nom: racine.resultat.nom,
      texte: precision.trim()
        ? `${texte}\n\nPrécision : ${precision.trim()}`
        : secondOeilPerdu
          ? `${texte}\n\n${NOTE_SECOND_OEIL}`
          : texte,
      statsDelta: statsIteration(racine),
      notes: secondOeilPerdu ? [...notesIteration(racine), NOTE_SECOND_OEIL] : notesIteration(racine),
      effets: [effetDeIteration(racine)],
      perteEquipement: !!racine.resultat.perteEquipement || gladiateurForcePerte,
      statutMort: !!racine.resultat.statutMort || secondOeilPerdu,
      xpBonus: racine.resultat.xpBonus ?? 0,
      tresorerieBonus: racine.resultat.tresorerieBonus ?? 0,
    };
  };

  // Une Liche a 1 PV restant : elle ne peut pas ignorer un résultat contre
  // -1 PV (cela la tuerait sans passer par un jet Tué).
  const eternellePeutIgnorer = estEternelle && (pvActuelProfil ?? 0) > 1;

  const construireResultatEternelleIgnore = (base: BlessureGraveResultat): BlessureGraveResultat => ({
    ...base,
    texte: `${base.texte}\n\nÉternelle : ce résultat est ignoré — la Liche subit à la place une perte permanente de -1 Point de Vie.`,
    statsDelta: fusionnerStats(base.statsDelta, { PV: -1 }),
    notes: [...base.notes, 'Éternelle : résultat ignoré, -1 PV permanent'],
    perteEquipement: false,
    statutMort: false,
    xpBonus: 0,
    tresorerieBonus: 0,
  });

  const construireResultatEternelleTue = (base: BlessureGraveResultat): BlessureGraveResultat => {
    const jet = Math.trunc(Number(eternelleDeD3Saisi));
    const perte = Number.isFinite(jet) && jet > 0 ? jet : 0;
    const pvApres = (pvActuelProfil ?? 0) - perte;
    const tue = pvApres <= 0;
    const texte = `${base.texte}\n\nÉternelle : un résultat Tué inflige à la place une perte permanente de -${perte} Point(s) de Vie (jet de 1D3).${
      tue
        ? ' Cette perte ramène ses PV à 0 ou moins : la Liche est tuée normalement.'
        : ` Ses PV passent définitivement à ${pvApres}.`
    }`;
    return {
      ...base,
      texte,
      statsDelta: tue ? {} : { PV: -perte },
      notes: tue ? base.notes : [...base.notes, `Éternelle : -${perte} PV permanent (Tué évité)`],
      perteEquipement: tue,
      statutMort: tue,
    };
  };

  const construireResultatFinal = (): BlessureGraveResultat => {
    const base = construireResultatBase();
    if (!racine) return base;
    if (estEternelle && racine.resultat.id === 'mort') return construireResultatEternelleTue(base);
    if (eternellePeutIgnorer && eternelleIgnorer) return construireResultatEternelleIgnore(base);
    return base;
  };

  if (mode === 'liste') {
    const disponibles = enCoursDansBoucle
      ? BLESSURES_GRAVES.filter((r) => !ID_INTERDITS_BOUCLE.includes(r.id))
      : BLESSURES_GRAVES;
    return (
      <div>
        {enCoursDansBoucle && (
          <p className="text-sm text-muted" style={{ marginTop: 0 }}>
            {t('blessureGraveWizard.loopIntro', { index: iterationActuelleIndex, count: multiplesCount ?? 0 })}
          </p>
        )}
        {enChoixGladiateurPerdu && (
          <p className="text-sm text-muted" style={{ marginTop: 0 }}>
            {t('blessureGraveWizard.gladiatorLostIntro')}
          </p>
        )}
        {!enCoursDansBoucle && !enChoixGladiateurPerdu && (
          <p className="text-sm text-muted" style={{ marginTop: 0 }}>
            {t('blessureGraveWizard.rollInstruction', { nom: nomPersonnage })}
          </p>
        )}
        <div className="field">
          <label>{t('blessureGraveWizard.resultObtained')}</label>
          <select value={selectionEnAttente} onChange={(e) => setSelectionEnAttente(e.target.value)}>
            <option value="" disabled>
              {t('blessureGraveWizard.chooseResult')}
            </option>
            {disponibles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code} — {translateBlessure(r, language).nom}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          {onAnnuler && (
            <button className="btn" onClick={onAnnuler}>
              {t('blessureGraveWizard.cancel')}
            </button>
          )}
          <button className="btn btn--primary" disabled={!selectionEnAttente} onClick={validerSelection}>
            {t('blessureGraveWizard.continue')}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'sous_jet' && selectionActuelle?.sousJet) {
    const spec = selectionActuelle.sousJet;
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePourBlessure(selectionActuelle)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {translateBlessure(selectionActuelle, language).nom}
        </h4>
        <p className="text-sm text-muted">{t('blessureGraveWizard.rerollD6Instructions')}</p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3, 4, 5, 6].map((valeur) => {
            const option = spec.options.find((o) => o.valeurs.includes(valeur));
            return (
              <button key={valeur} className="btn" onClick={() => option && choisirSousJet(option)}>
                {valeur}
              </button>
            );
          })}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            {t('blessureGraveWizard.back')}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'duree_d3' && selectionActuelle) {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePourBlessure(selectionActuelle)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {translateBlessure(selectionActuelle, language).nom}
        </h4>
        <p className="text-sm text-muted">{t('blessureGraveWizard.d3DurationQuestion')}</p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3].map((n) => (
            <button key={n} className="btn" onClick={() => choisirDureeD3(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            {t('blessureGraveWizard.back')}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'multiples_compte') {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name="goutte" style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {t('blessureGraveWizard.multipleInjuriesTitle')}
        </h4>
        <p className="text-sm text-muted">{t('blessureGraveWizard.multipleInjuriesCountQuestion')}</p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} className="btn" onClick={() => choisirMultiplesCount(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            {t('blessureGraveWizard.back')}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'gladiateur_issue' && selectionActuelle) {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePourBlessure(selectionActuelle)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {translateBlessure(selectionActuelle, language).nom}
        </h4>
        <p className="text-sm text-muted">{t('blessureGraveWizard.gladiatorFightQuestion')}</p>
        {(FRANC_TIREUR_GLADIATEUR_ADVERSAIRE?.stats || statsPersonnage) && (
          <p className="text-sm text-muted mb-0">{t('blessureGraveWizard.stackedProfilesNote')}</p>
        )}
        {FRANC_TIREUR_GLADIATEUR_ADVERSAIRE?.stats && (
          <BlocStats
            titre={t('blessureGraveWizard.opposingGladiatorTitle')}
            stats={FRANC_TIREUR_GLADIATEUR_ADVERSAIRE.stats}
            equipement={FRANC_TIREUR_GLADIATEUR_ADVERSAIRE.equipement}
            reglesSpeciales={FRANC_TIREUR_GLADIATEUR_ADVERSAIRE.regles_speciales}
          />
        )}
        {statsPersonnage && (
          <BlocStats
            titre={nomPersonnage}
            stats={statsPersonnage}
            equipement={equipementPersonnage}
            reglesSpeciales={reglesSpecialesPersonnage}
          />
        )}
        <div className="flex flex-wrap gap-sm">
          <button className="btn btn--primary" onClick={() => choisirGladiateurIssue(true)}>
            {t('blessureGraveWizard.yes')}
          </button>
          <button className="btn" onClick={() => choisirGladiateurIssue(false)}>
            {t('blessureGraveWizard.no')}
          </button>
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            {t('blessureGraveWizard.back')}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'capture_issue' && selectionActuelle) {
    const montantRancon = Math.max(0, Math.trunc(Number(ranconSaisie) || 0));
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePourBlessure(selectionActuelle)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {translateBlessure(selectionActuelle, language).nom}
        </h4>
        <p className="text-sm text-muted">{translateBlessure(selectionActuelle, language).texte}</p>
        {typeof tresorerieDisponible === 'number' && (
          <p className="text-sm">
            {t('blessureGraveWizard.currentTreasury', { n: tresorerieDisponible })}
          </p>
        )}
        {captureChoix !== 'rancon' && (
          <div className="flex flex-wrap gap-sm">
            <button className="btn" onClick={choisirCapturePerdu}>
              {t('blessureGraveWizard.heroLost')}
            </button>
            <button className="btn" onClick={choisirCaptureEchange}>
              {t('blessureGraveWizard.exchangedForPrisoner')}
            </button>
            <button className="btn btn--primary" onClick={() => setCaptureChoix('rancon')}>
              {t('blessureGraveWizard.ransomedBack')}
            </button>
          </div>
        )}
        {captureChoix === 'rancon' && (
          <>
            <div className="field">
              <label>{t('blessureGraveWizard.ransomAmountLabel')}</label>
              <input
                type="number"
                min={0}
                value={ranconSaisie}
                onChange={(e) => setRanconSaisie(e.target.value)}
                placeholder="0"
              />
            </div>
            {typeof tresorerieDisponible === 'number' && (
              <p className="text-sm text-muted">
                {t('blessureGraveWizard.treasuryAfterPayment', { n: Math.max(0, tresorerieDisponible - montantRancon) })}
              </p>
            )}
            <div className="flex flex-wrap gap-sm">
              <button className="btn" onClick={() => setCaptureChoix(null)}>
                {t('blessureGraveWizard.back')}
              </button>
              <button className="btn btn--primary" onClick={choisirCaptureRancon}>
                {t('blessureGraveWizard.confirmRansom')}
              </button>
            </div>
          </>
        )}
        {captureChoix !== 'rancon' && (
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setMode('liste')}>
              {t('blessureGraveWizard.back')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // mode === 'confirmation'
  const resultatFinal = construireResultatFinal();
  const statsListe = Object.entries(resultatFinal.statsDelta).filter(([, v]) => v);
  // Traduit le texte de chaque itération (résultat canonique, issue
  // spéciale Gladiateur/Capturé, suffixe sous-jet/durée D3...) via
  // segmentAffiche — la même fonction que utils/blessures.ts utilise pour
  // re-traduire l'affichage persisté (BlessuresGravesCard, RosterScreen...),
  // appliquée ici au texte français que construireResultatBase produirait
  // pour cette itération. Une seule logique de reconnaissance/traduction des
  // résultats, jamais deux qui pourraient diverger.
  const texteIterationAfficheeAvecSpeciaux = (it: IterationResolue): string =>
    segmentAffiche(effetDeIteration(it), texteIteration(it), language);
  const prefixeGladiateurAffiche = gladiateurForcePerte ? t('blessureGraveWizard.gladiatorDefeatPrefix') : '';
  // Traduction best-effort des notes de l'aperçu (voir texteIterationAffichee
  // pour le même principe) : celles construites directement à partir d'un
  // noteTag de la table canonique se re-traduisent via une correspondance
  // texte français -> texte traduit ; le reste (mentions éditoriales fixes
  // comme "Éternelle" ou le second œil perdu) retombe sur le texte français,
  // n'existant que dans cette langue.
  const iterationsPourNotes = racine?.resultat.multiplesInjuries
    ? multiplesResultats
    : racine
      ? [racine]
      : [];
  const notesTraductionMap = new Map<string, string>();
  iterationsPourNotes.forEach((it) => {
    const notesFr = notesIteration(it);
    const notesTraduites = notesIteration(iterationAffichee(it, language));
    notesFr.forEach((noteFr, i) => {
      const noteTraduite = notesTraduites[i];
      if (noteTraduite) notesTraductionMap.set(noteFr, noteTraduite);
    });
  });
  const notesAffichees = resultatFinal.notes.map((n) => notesTraductionMap.get(n) ?? n);
  return (
    <div>
      <h4 style={{ marginTop: 0 }}>
        {racine && <Icon name={iconePourBlessure(racine.resultat)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />}
        {t('blessureGraveWizard.summary')}
      </h4>
      <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
        {racine ? `${prefixeGladiateurAffiche}${texteIterationAfficheeAvecSpeciaux(racine)}` : ''}
      </p>
      {racine?.resultat.multiplesInjuries && multiplesResultats.length > 0 && (
        <ol className="text-sm">
          {multiplesResultats.map((it, i) => (
            <li key={i}>{texteIterationAfficheeAvecSpeciaux(it)}</li>
          ))}
        </ol>
      )}
      {estEternelle && racine?.resultat.id === 'mort' && (
        <div className="card card--tight" style={{ margin: '0.6rem 0', borderColor: 'var(--accent)' }}>
          <p className="text-sm mb-0">
            <strong>{t('blessureGraveWizard.eternalLabel')}</strong> — {t('blessureGraveWizard.eternalDeathNote')}
          </p>
          <div className="flex flex-wrap gap-sm" style={{ marginTop: '0.5rem' }}>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                className={eternelleDeD3Saisi === String(n) ? 'btn btn--primary' : 'btn'}
                onClick={() => setEternelleDeD3Saisi(String(n))}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
      {eternellePeutIgnorer && racine && racine.resultat.id !== 'mort' && (
        <label className="skill-check" style={{ cursor: 'pointer', margin: '0.6rem 0' }}>
          <input
            type="checkbox"
            checked={eternelleIgnorer}
            onChange={(e) => setEternelleIgnorer(e.target.checked)}
          />
          <span className="skill-check__name">
            {t('blessureGraveWizard.eternalIgnoreOption', { pv: pvActuelProfil ?? 0 })}
          </span>
        </label>
      )}
      {statsListe.length > 0 && (
        <p className="text-sm">
          <strong>{t('blessureGraveWizard.modifiedCharacteristics')}</strong>{' '}
          {statsListe.map(([k, v], i) => (
            <span key={k}>
              {i > 0 && ', '}
              <span className={(v ?? 0) < 0 ? 'text-danger' : 'text-success'}>
                {k} {(v ?? 0) > 0 ? '+' : ''}
                {v}
              </span>
            </span>
          ))}
        </p>
      )}
      {resultatFinal.notes.length > 0 && (
        <p className="text-sm">
          <strong>{t('blessureGraveWizard.notesToAdd')}</strong> {notesAffichees.join(' · ')}
        </p>
      )}
      {resultatFinal.xpBonus > 0 && (
        <p className="text-sm">
          <strong>{t('blessureGraveWizard.experienceLabel')}</strong> +{resultatFinal.xpBonus}
        </p>
      )}
      {resultatFinal.tresorerieBonus !== 0 && (
        <p className="text-sm">
          <strong>{t('blessureGraveWizard.warbandTreasury')}</strong> {resultatFinal.tresorerieBonus > 0 ? '+' : ''}
          {resultatFinal.tresorerieBonus} {t('blessureGraveWizard.gcSuffix')}
        </p>
      )}
      {resultatFinal.statutMort && <p className="text-danger">{t('blessureGraveWizard.willBeMarkedDead')}</p>}
      {resultatFinal.perteEquipement && (
        <p className="text-danger">{t('blessureGraveWizard.equipmentLossWarning')}</p>
      )}
      {racine?.resultat.informatifSeulement && (
        <p className="text-sm text-muted">{t('blessureGraveWizard.notAutomatableNote')}</p>
      )}
      <div className="field">
        <label>{t('blessureGraveWizard.precisionLabel')}</label>
        <textarea
          value={precision}
          onChange={(e) => setPrecision(e.target.value)}
          placeholder={
            racine?.resultat.id === 'capture'
              ? t('blessureGraveWizard.precisionPlaceholderCapture')
              : t('blessureGraveWizard.precisionPlaceholderDefault')
          }
        />
      </div>
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={reinitialiser}>
          {t('blessureGraveWizard.restart')}
        </button>
        {onAnnuler && (
          <button className="btn" onClick={onAnnuler}>
            {t('blessureGraveWizard.cancel')}
          </button>
        )}
        <button
          className="btn btn--primary"
          disabled={estEternelle && racine?.resultat.id === 'mort' && !eternelleDeD3Saisi}
          onClick={() => onAppliquer(resultatFinal)}
        >
          {t('blessureGraveWizard.apply')}
        </button>
      </div>
    </div>
  );
}
