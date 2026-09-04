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
// Usage : npx tsx scripts/checkI18nParity.ts
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

if (problemes.length === 0) {
  console.log('OK — aucune désynchronisation de longueur détectée entre les tableaux FR et EN appariés par index.');
} else {
  console.error(`${problemes.length} désynchronisation(s) détectée(s) :\n`);
  for (const p of problemes) {
    console.error(`  [${p.source}] ${p.id} — ${p.champ} : FR a ${p.frLongueur} entrée(s), EN en a ${p.enLongueur}.`);
  }
  process.exitCode = 1;
}
