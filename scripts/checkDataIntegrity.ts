// Contrôle d'intégrité référentielle des données de jeu (52 bandes, ~313
// objets, francs-tireurs). Introduit par l'audit technique de septembre 2026 :
// l'activité principale du projet est l'ajout et l'audit de bandes, et rien ne
// vérifiait mécaniquement qu'une bande nouvellement saisie ne référence pas un
// objet, un profil ou une catégorie de compétence qui n'existe pas. Une
// référence morte ne se voit pas à la lecture du JSON — elle se manifeste
// beaucoup plus tard, par une ligne d'équipement absente de la boutique ou une
// catégorie de compétence ignorée à l'avancement.
//
// Ce script ne juge RIEN sur le fond des règles (prix, raretés, profils) —
// c'est le travail de mordheim-rules-auditor contre les PDF officiels. Il ne
// vérifie que la cohérence interne : toute référence pointe-t-elle vers
// quelque chose qui existe.
//
// Usage : npx tsx scripts/checkDataIntegrity.ts
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CATALOGUES } from '../src/data/warbands';
import { ITEMS_PAR_ID } from '../src/data/items';
import { SKILLS } from '../src/data/gameData';
import type { SkillsData } from '../src/types/gameData';

const problemes: string[] = [];
const signaler = (bande: string, message: string) => problemes.push(`[${bande}] ${message}`);

const categoriesConnues = new Set<string>([...Object.keys(SKILLS as SkillsData), 'special']);
const competencesConnues = new Set<string>();
for (const categorie of Object.keys(SKILLS) as (keyof SkillsData)[]) {
  for (const competence of SKILLS[categorie]) competencesConnues.add(competence.id);
}

for (const catalogue of CATALOGUES) {
  const profilIds = new Set(catalogue.profils.map((p) => p.id));

  // --- Unicité des identifiants de profil au sein de la bande
  const vus = new Set<string>();
  for (const profil of catalogue.profils) {
    if (vus.has(profil.id)) signaler(catalogue.id, `profil "${profil.id}" défini plusieurs fois`);
    vus.add(profil.id);
  }

  // --- Mécanisme de chef : soit un profil est_leader, soit leader_libre.
  // Une bande sans ni l'un ni l'autre n'aurait aucun moyen de désigner un
  // chef (voir utils/leader.ts), donc pas de test de Déroute ni de
  // succession.
  const chefsFixes = catalogue.profils.filter((p) => p.est_leader);
  if (chefsFixes.length === 0 && !catalogue.leader_libre) {
    signaler(catalogue.id, 'aucun profil est_leader et leader_libre absent : aucun chef possible');
  }
  if (chefsFixes.length > 1) {
    signaler(catalogue.id, `${chefsFixes.length} profils est_leader : ${chefsFixes.map((p) => p.id).join(', ')}`);
  }

  // --- La bannière déclarée existe-t-elle vraiment dans public/ ?
  if (catalogue.banniere && !existsSync(join('public', catalogue.banniere))) {
    signaler(catalogue.id, `banniere introuvable : public/${catalogue.banniere}`);
  }

  // --- equipement_special : objet et profils référencés
  for (const ref of catalogue.equipement_special ?? []) {
    if (!ITEMS_PAR_ID[ref.item_id]) {
      signaler(catalogue.id, `equipement_special -> objet inconnu "${ref.item_id}"`);
    }
    for (const profilId of ref.profils ?? []) {
      if (!profilIds.has(profilId)) {
        signaler(catalogue.id, `equipement_special "${ref.item_id}" -> profil inconnu "${profilId}"`);
      }
    }
  }

  for (const profil of catalogue.profils) {
    for (const categorie of profil.acces_competences ?? []) {
      if (!categoriesConnues.has(categorie)) {
        signaler(catalogue.id, `profil "${profil.id}" -> catégorie de compétence inconnue "${categorie}"`);
      }
    }
    // Une compétence gratuite peut être générique, spéciale de bande, ou
    // spéciale du profil lui-même.
    const specialesVisibles = new Set<string>([
      ...(catalogue.competences_speciales ?? []).map((s) => s.id),
      ...(profil.competences_speciales ?? []).map((s) => s.id),
    ]);
    for (const id of profil.competences_gratuites ?? []) {
      if (!competencesConnues.has(id) && !specialesVisibles.has(id)) {
        signaler(catalogue.id, `profil "${profil.id}" -> compétence gratuite inconnue "${id}"`);
      }
    }
    if (profil.min !== undefined && profil.max !== undefined && profil.max !== null && profil.min > profil.max) {
      signaler(catalogue.id, `profil "${profil.id}" : min (${profil.min}) > max (${profil.max})`);
    }
  }
}

if (problemes.length === 0) {
  console.log(
    `OK — ${CATALOGUES.length} bandes, ${Object.keys(ITEMS_PAR_ID).length} objets : aucune référence morte.`
  );
} else {
  console.error(`${problemes.length} problème(s) d'intégrité détecté(s) :\n`);
  for (const p of problemes) console.error(`  ${p}`);
  process.exitCode = 1;
}
