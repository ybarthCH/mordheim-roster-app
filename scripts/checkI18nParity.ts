// Vérifie la parité de longueur entre les tableaux français (source de
// vérité) et leurs équivalents anglais, pour tous les champs traduits par
// APPARIEMENT D'INDEX plutôt que par clé stable (voir le commentaire de
// CLAUDE.md sur ce risque, et translateHiredSword/translateItem/
// translateWarbandCatalog qui appliquent ce pattern). Un tableau EN plus
// COURT que le FR est normal (traduction en cours, repli sur le FR pour les
// entrées restantes) ; un tableau EN plus LONG, ou dont la longueur diffère
// après un ajout/suppression côté FR sans miroir côté EN, indique une
// désynchronisation silencieuse — chaque entrée EN se retrouve alors
// affichée en face du mauvais texte FR.
//
// Ne détecte PAS un simple réordonnancement qui préserverait la longueur :
// seule une revue humaine peut confirmer qu'un tableau resynchronisé en
// longueur reste bien apparié terme à terme. Sert de garde-fou mécanique
// avant/après toute modification des fichiers concernés, pas de garantie
// absolue.
//
// Ce script couvre AUSSI, depuis l'audit technique de septembre 2026, deux
// modes de défaillance du dictionnaire d'interface (src/i18n/ui/) qui
// n'étaient surveillés par rien et ne se voient qu'à l'écran :
//   1. une clé déclarée dans DEUX namespaces : `uiDictionary` étant un simple
//      étalement d'objets (voir i18n/ui/index.ts), la dernière déclaration
//      écrase silencieusement la précédente — l'un des deux écrans affiche
//      alors le libellé de l'autre ;
//   2. une clé passée à t() sans être déclarée nulle part : t() retombe sur
//      la clé elle-même, et l'interface affiche « roster.exportPdf » à la
//      place d'un libellé.
// Ces deux contrôles-là font échouer le script. Les clés déclarées mais
// jamais utilisées sont seulement COMPTÉES (voir plus bas) : elles ne
// cassent rien, et l'app en contient un lot légitime, consommé par
// construction dynamique de la clé.
//
// Usage : npx tsx scripts/checkI18nParity.ts
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FRANCS_TIREURS } from '../src/data/hiredSwords';
import { hiredSwordsEn } from '../src/i18n/data/hiredSwords';
import { TOUS_LES_ITEMS } from '../src/data/items';
import { itemsEn } from '../src/i18n/data/items';
import { CATALOGUES } from '../src/data/warbands';
import { warbandsEn } from '../src/i18n/data/warbands';

type Probleme = { source: string; id: string; champ: string; frLongueur: number; enLongueur: number };

const problemes: Probleme[] = [];

function verifierParite(source: string, id: string, champ: string, fr: unknown[] | undefined, en: unknown[] | undefined) {
  if (!fr || !en) return;
  // EN plus court que FR : traduction partielle normale, pas un problème.
  if (en.length <= fr.length) return;
  problemes.push({ source, id, champ, frLongueur: fr.length, enLongueur: en.length });
}

// --- Francs-tireurs / Dramatis Personae (data/hiredSwords.ts) ---
for (const ft of FRANCS_TIREURS) {
  const en = hiredSwordsEn[ft.id] as Record<string, unknown> | undefined;
  if (!en) continue;
  verifierParite('hiredSwords', ft.id, 'equipement', ft.equipement, en.equipement as unknown[] | undefined);
  verifierParite('hiredSwords', ft.id, 'regles_speciales', ft.regles_speciales, en.regles_speciales as unknown[] | undefined);
  const psEn = en.profils_secondaires as Record<string, unknown>[] | undefined;
  ft.profils_secondaires?.forEach((p, i) => {
    const pEn = psEn?.[i];
    if (!pEn) return;
    verifierParite(
      'hiredSwords',
      `${ft.id}.profils_secondaires[${i}]`,
      'regles_speciales',
      p.regles_speciales,
      pEn.regles_speciales as unknown[] | undefined
    );
  });
}

// --- Objets du catalogue commun (data/items/*.json via data/items.ts) ---
for (const item of TOUS_LES_ITEMS) {
  const en = itemsEn[item.id] as Record<string, unknown> | undefined;
  if (!en) continue;
  verifierParite(
    'items',
    item.id,
    'regles_speciales',
    'regles_speciales' in item ? (item.regles_speciales as unknown[] | undefined) : undefined,
    en.regles_speciales as unknown[] | undefined
  );
  const sousJetAchat = 'sous_jet_achat' in item ? (item.sous_jet_achat as { options: unknown[] } | undefined) : undefined;
  verifierParite('items', item.id, 'sous_jet_achat.options', sousJetAchat?.options, en.sousJetAchatOptions as unknown[] | undefined);
}

// --- Bandes (data/warbands/*.json via data/warbands/index.ts) ---
for (const catalogue of CATALOGUES) {
  const en = warbandsEn[catalogue.id] as Record<string, unknown> | undefined;
  if (!en) continue;
  verifierParite('warbands', catalogue.id, 'regles_speciales', catalogue.regles_speciales, en.regles_speciales as unknown[] | undefined);
  const profilsEn = en.profils as Record<string, Record<string, unknown>> | undefined;
  for (const profil of catalogue.profils) {
    const pEn = profilsEn?.[profil.id];
    if (!pEn || !profil.regles_speciales) continue;
    verifierParite(
      'warbands',
      `${catalogue.id}.profils.${profil.id}`,
      'regles_speciales',
      profil.regles_speciales,
      pEn.regles_speciales as unknown[] | undefined
    );
  }
  if (catalogue.magie) {
    const magieEn = en.magie as Record<string, unknown> | undefined;
    verifierParite('warbands', `${catalogue.id}.magie`, 'sorts', catalogue.magie.sorts, magieEn?.sorts as unknown[] | undefined);
  }
  if (catalogue.magie_variantes) {
    const variantesEn = en.magie_variantes as Record<string, Record<string, unknown>> | undefined;
    for (const [cle, magie] of Object.entries(catalogue.magie_variantes)) {
      verifierParite(
        'warbands',
        `${catalogue.id}.magie_variantes.${cle}`,
        'sorts',
        magie.sorts,
        variantesEn?.[cle]?.sorts as unknown[] | undefined
      );
    }
  }
  const equipEspecialEn = en.equipement_special as unknown[] | undefined;
  verifierParite('warbands', catalogue.id, 'equipement_special', catalogue.equipement_special, equipEspecialEn);
}

// --- Dictionnaire d'interface (src/i18n/ui/) : collisions et clés absentes ---
//
// Analyse textuelle plutôt qu'import du dictionnaire déjà fusionné : une fois
// `uiDictionary` construit, la collision a précisément disparu (la seconde
// déclaration a écrasé la première), donc seule la lecture des fichiers
// sources permet encore de la voir.
const RACINE_I18N = 'src/i18n/ui';
const RACINES_SOURCE = ['src/components', 'src/utils', 'src/state'];

function fichiersSous(dir: string, ext: string[]): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...fichiersSous(p, ext));
    else if (ext.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

const declarations = new Map<string, string[]>();
for (const f of readdirSync(RACINE_I18N).filter((n) => n.endsWith('.ts') && n !== 'index.ts' && n !== 'types.ts')) {
  const contenu = readFileSync(join(RACINE_I18N, f), 'utf-8');
  for (const m of contenu.matchAll(/^\s*'([\w.]+)'\s*:\s*\{/gm)) {
    const liste = declarations.get(m[1]) ?? [];
    liste.push(f);
    declarations.set(m[1], liste);
  }
}

const utilisees = new Set<string>();
// Préfixes de clés construites dynamiquement — t(`statut.${m.statut}`) ou
// uiDictionary[`catalogueReference.list.${cle}`] : toute clé commençant par
// ce préfixe est considérée atteignable.
const prefixesDynamiques = new Set<string>();
for (const f of RACINES_SOURCE.flatMap((d) => fichiersSous(d, ['.ts', '.tsx']))) {
  const contenu = readFileSync(f, 'utf-8');
  for (const m of contenu.matchAll(/\b(?:t|traduireCle)\(\s*'([\w.]+)'/g)) utilisees.add(m[1]);
  for (const m of contenu.matchAll(/(?:\bt|traduireCle)\(\s*`([\w.]+?)\.\$\{/g)) prefixesDynamiques.add(m[1]);
  for (const m of contenu.matchAll(/uiDictionary\[\s*`([\w.]+?)\.\$\{/g)) prefixesDynamiques.add(m[1]);
  // Clés listées telles quelles dans un tableau/objet puis passées à t()
  for (const m of contenu.matchAll(/'([a-z][\w]*(?:\.[\w]+){1,3})'/g)) {
    if (declarations.has(m[1])) utilisees.add(m[1]);
  }
}

const collisions = [...declarations.entries()].filter(([, fichiers]) => fichiers.length > 1);
const absentes = [...utilisees].filter((k) => !declarations.has(k)).sort();
const atteignable = (k: string) => utilisees.has(k) || [...prefixesDynamiques].some((p) => k.startsWith(`${p}.`));
const orphelines = [...declarations.keys()].filter((k) => !atteignable(k));

const echecsUi = collisions.length + absentes.length;

if (problemes.length === 0 && echecsUi === 0) {
  console.log('OK — aucune désynchronisation de longueur détectée entre les tableaux FR et EN appariés par index.');
  console.log(`OK — ${declarations.size} clés d'interface, aucune collision, aucune clé manquante.`);
} else {
  if (problemes.length > 0) {
    console.error(`${problemes.length} désynchronisation(s) détectée(s) :\n`);
    for (const p of problemes) {
      console.error(`  [${p.source}] ${p.id} — ${p.champ} : FR a ${p.frLongueur} entrée(s), EN en a ${p.enLongueur}.`);
    }
  }
  if (collisions.length > 0) {
    console.error(`\n${collisions.length} clé(s) d'interface déclarée(s) dans plusieurs namespaces :\n`);
    for (const [cle, fichiers] of collisions) {
      console.error(`  '${cle}' — ${fichiers.join(', ')} (la dernière fusionnée écrase les autres)`);
    }
  }
  if (absentes.length > 0) {
    console.error(`\n${absentes.length} clé(s) utilisée(s) via t() mais déclarée(s) nulle part :\n`);
    for (const cle of absentes) console.error(`  '${cle}' — t() affichera la clé brute à l'écran`);
  }
  process.exitCode = 1;
}

if (orphelines.length > 0) {
  console.log(
    `\nNote : ${orphelines.length} clé(s) déclarée(s) sans usage détecté (sans gravité — reliquats de refontes d'écran et clés construites dynamiquement hors des motifs reconnus).`
  );
}
