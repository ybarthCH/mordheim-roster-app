// Export PDF d'une feuille de bande — mise en page inspirée de la feuille de
// référence "freebooters.org" historiquement utilisée par les joueurs
// Mordheim (un bloc détaillé par Héros : compétences accessibles, tableau de
// caractéristiques + plafond racial, équipement, compétences/sorts,
// blessures graves, jauge d'XP à cases ; un bloc compact par groupe
// d'hommes de main/créatures). Adaptée à notre modèle de données réel
// (caractéristiques variables, Marques, plafonds conditionnels...) plutôt
// qu'une copie pixel pour pixel de la feuille papier d'origine.
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Member, RosterInstance } from '../types/roster';
import { STATUTS } from '../types/roster';
import type { Profile, WarbandCatalog } from '../types/catalog';
import { STAT_KEYS, SKILL_CATEGORIES } from '../types/catalog';
import { getCatalogue } from '../data/warbands';
import { resolveProfil, categoriesAccessibles } from './profil';
import { valeurBande, bilanBatailles } from './bandeValue';
import { ratingTotal } from './rating';
import { plafondPour } from './plafond';
import { skillById } from '../data/gameData';
import { resolveSort } from './magie';
import { injuryLabel } from './blessures';
import { tribuChoisie } from './tribu';
import { HERO_XP_MAX, HENCHMAN_XP_MAX, isPalierHero, isPalierHenchman } from './xp';

const ACCENT: [number, number, number] = [122, 20, 20];
const NOIR: [number, number, number] = [25, 25, 25];
const GRIS: [number, number, number] = [110, 110, 110];
const GRIS_CLAIR: [number, number, number] = [235, 235, 235];
const TRAIT: [number, number, number] = [190, 190, 190];

const MARGE = 8;
const LARGEUR_PAGE = 210;
const HAUTEUR_PAGE = 297;
const LARGEUR_CONTENU = LARGEUR_PAGE - MARGE * 2;
const BAS_PAGE = HAUTEUR_PAGE - 12;

function sautDePageSiNecessaire(doc: jsPDF, y: number, hauteur: number): number {
  if (y + hauteur > BAS_PAGE) {
    doc.addPage();
    return MARGE;
  }
  return y;
}

function nomCompetence(catalogue: WarbandCatalog | undefined, profil: Profile, skillId: string): string {
  const s =
    skillById(skillId) ??
    profil.competences_speciales?.find((c) => c.id === skillId) ??
    catalogue?.competences_speciales.find((c) => c.id === skillId);
  return s?.nom ?? skillId;
}

function texteCompetencesEtSorts(catalogue: WarbandCatalog | undefined, profil: Profile, m: Member): string {
  const competences = m.competences_acquises.map((id) => nomCompetence(catalogue, profil, id));
  const sorts = m.sorts_connus.map((nom) => resolveSort(catalogue, nom, profil, m.marque)?.nom ?? nom);
  return [...competences, ...sorts].join(', ') || '—';
}

function texteReglesEtCompetences(catalogue: WarbandCatalog | undefined, profil: Profile, m: Member): string {
  const regles = (profil.regles_speciales ?? []).map((r) => r.nom);
  const competences = m.competences_acquises.map((id) => nomCompetence(catalogue, profil, id));
  return [...regles, ...competences].join(', ') || '—';
}

// Hauteur (mm) occupée par une jauge d'XP de `nbLignes` rangées — voir
// dessinerJaugeXp, doit rester synchronisée avec sa géométrie interne.
const XP_TAILLE = 2;
const XP_PAS_LIGNE = 4.2;
function hauteurJauge(nbLignes: number): number {
  return nbLignes * XP_PAS_LIGNE + 1;
}

// Cases d'XP façon feuille papier : rangées de `parLigne` cases, numéro
// affiché sous les cases paliers — voir utils/xp.ts (mêmes seuils que la
// jauge affichée dans l'app).
function dessinerJaugeXp(
  doc: jsPDF,
  x: number,
  y: number,
  xp: number,
  max: number,
  parLigne: number,
  estPalier: (n: number) => boolean
): void {
  const pas = XP_TAILLE + 0.3;
  doc.setFontSize(4.5);
  doc.setLineWidth(0.15);
  for (let i = 0; i < max; i++) {
    const numero = i + 1;
    const ligne = Math.floor(i / parLigne);
    const col = i % parLigne;
    const cx = x + col * pas;
    const cy = y + ligne * XP_PAS_LIGNE;
    const pleine = xp >= numero;
    doc.setDrawColor(...NOIR);
    if (pleine) {
      doc.setFillColor(...NOIR);
      doc.rect(cx, cy, XP_TAILLE, XP_TAILLE, 'FD');
    } else {
      doc.rect(cx, cy, XP_TAILLE, XP_TAILLE, 'S');
    }
    if (estPalier(numero)) {
      doc.setTextColor(...GRIS);
      doc.text(String(numero), cx + XP_TAILLE / 2, cy + XP_TAILLE + 1.8, { align: 'center' });
    }
  }
}

// Largeur (mm) de la colonne "caractéristiques" (checkboxes + tableau de
// stats), à gauche du bloc — le reste de la largeur de contenu revient à la
// colonne équipement/compétences/blessures, à droite.
const LARGEUR_COL_STATS = 80;
const LARGEUR_COL_STAT = 8;

// Ligne "M CC CT F E PV I A Cd" + valeurs (avec notation dé pour une
// caractéristique encore variable, ex : Damné) + plafond racial en dessous
// (voir la légende affichée une fois en tête de section plutôt que
// libellée à chaque bloc, pour rester compact).
function dessinerTableauStats(doc: jsPDF, x: number, y: number, m: Member, profil: Profile): number {
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NOIR);
  STAT_KEYS.forEach((k, i) => {
    doc.text(k, x + i * LARGEUR_COL_STAT + LARGEUR_COL_STAT / 2, y, { align: 'center' });
  });
  doc.setDrawColor(...TRAIT);
  doc.line(x, y + 1.2, x + LARGEUR_COL_STAT * STAT_KEYS.length, y + 1.2);

  const plafond = plafondPour(profil, m.competences_acquises);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  STAT_KEYS.forEach((k, i) => {
    const variable = m.stats_variables?.[k];
    doc.setTextColor(...ACCENT);
    doc.text(variable ?? String(m.stats_actuels[k]), x + i * LARGEUR_COL_STAT + LARGEUR_COL_STAT / 2, y + 4.6, {
      align: 'center',
    });
  });

  if (plafond) {
    doc.setFontSize(5.5);
    doc.setTextColor(...GRIS);
    STAT_KEYS.forEach((k, i) => {
      doc.text(String(plafond[k]), x + i * LARGEUR_COL_STAT + LARGEUR_COL_STAT / 2, y + 7.6, { align: 'center' });
    });
  }

  return y + (plafond ? 8.6 : 5.6);
}

function dessinerCasesCompetences(doc: jsPDF, x: number, y: number, profil: Profile): number {
  const accessibles = new Set(categoriesAccessibles(profil));
  let cx = x;
  doc.setFontSize(6);
  for (const cat of SKILL_CATEGORIES) {
    const coche = accessibles.has(cat.id);
    doc.setDrawColor(...NOIR);
    if (coche) {
      doc.setFillColor(...NOIR);
      doc.rect(cx, y - 2.1, 2.1, 2.1, 'FD');
    } else {
      doc.rect(cx, y - 2.1, 2.1, 2.1, 'S');
    }
    doc.setTextColor(...NOIR);
    doc.text(cat.label, cx + 2.8, y);
    cx += 2.8 + doc.getTextWidth(cat.label) + 3;
  }
  return y + 2.8;
}

type BlocPrepare = {
  hauteur: number;
  dessiner: (doc: jsPDF, y: number) => number;
};

const BLOC_PAD = 1.8;

function preparerBlocHeros(
  doc: jsPDF,
  catalogue: WarbandCatalog | undefined,
  m: Member,
  profil: Profile
): BlocPrepare {
  const xCol2 = MARGE + BLOC_PAD + LARGEUR_COL_STATS + 4;
  const largeurCol2 = MARGE + LARGEUR_CONTENU - BLOC_PAD - xCol2;
  doc.setFontSize(7.2);
  const equipementLignes = doc.splitTextToSize(`Équipement : ${m.equipement || 'Aucun'}`, largeurCol2).slice(0, 2);
  const competencesLignes = doc
    .splitTextToSize(`Compétences & Sorts : ${texteCompetencesEtSorts(catalogue, profil, m)}`, largeurCol2)
    .slice(0, 2);
  const blessures = m.blessures_graves.map((b) => injuryLabel(b));
  const blessuresLignes =
    blessures.length > 0
      ? doc.splitTextToSize(`Blessures graves : ${blessures.join(' · ')}`, largeurCol2).slice(0, 2)
      : [];

  const plafond = plafondPour(profil, m.competences_acquises);
  const hauteurCol1 = plafond ? 8.6 : 5.6;
  const hauteurCol2 = (equipementLignes.length + competencesLignes.length + blessuresLignes.length) * 3.1;
  const hauteurLigne2 = Math.max(hauteurCol1, hauteurCol2);
  const hauteurXp = hauteurJauge(Math.ceil(HERO_XP_MAX / 30));
  const hauteur = BLOC_PAD + 4.4 + 1 + 2.8 + 1 + hauteurLigne2 + 1.4 + hauteurXp + BLOC_PAD;

  const marque = m.marque ? catalogue?.marques?.find((mq) => mq.id === m.marque) : undefined;

  const dessiner = (doc: jsPDF, yDepart: number): number => {
    const yHaut = yDepart;
    doc.setDrawColor(...NOIR);
    doc.setLineWidth(0.3);
    doc.rect(MARGE, yHaut, LARGEUR_CONTENU, hauteur, 'S');

    let y = yHaut + BLOC_PAD + 3.5;
    const xTexte = MARGE + BLOC_PAD;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NOIR);
    doc.text(m.nom_perso, xTexte, y);
    let xSuite = xTexte + doc.getTextWidth(m.nom_perso) + 2;
    if (m.statut !== 'actif') {
      const label = STATUTS.find((s) => s.id === m.statut)?.label ?? m.statut;
      doc.setTextColor(...ACCENT);
      doc.setFontSize(8);
      doc.text(`(${label})`, xSuite, y);
      xSuite += doc.getTextWidth(`(${label})`) + 2;
    }
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...GRIS);
    const typeTexte = profil.nom + (marque ? ` — ${marque.nom}` : '');
    doc.text(typeTexte, MARGE + LARGEUR_CONTENU - BLOC_PAD, y, { align: 'right' });
    y += 4.4 + 1;

    dessinerCasesCompetences(doc, xTexte, y, profil);
    y += 2.8 + 1;

    const yLigne2 = y;
    dessinerTableauStats(doc, xTexte, y, m, profil);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...NOIR);
    let yCol2 = yLigne2;
    for (const ligne of equipementLignes) {
      doc.text(ligne, xCol2, yCol2);
      yCol2 += 3.1;
    }
    for (const ligne of competencesLignes) {
      doc.text(ligne, xCol2, yCol2);
      yCol2 += 3.1;
    }
    if (blessuresLignes.length > 0) {
      doc.setTextColor(...ACCENT);
      for (const ligne of blessuresLignes) {
        doc.text(ligne, xCol2, yCol2);
        yCol2 += 3.1;
      }
      doc.setTextColor(...NOIR);
    }
    y = yLigne2 + hauteurLigne2 + 1.4;

    const nbLignesXp = Math.ceil(HERO_XP_MAX / 30);
    dessinerJaugeXp(doc, xTexte, y, m.xp, HERO_XP_MAX, 30, isPalierHero);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...ACCENT);
    doc.text(`XP total : ${m.xp}`, MARGE + LARGEUR_CONTENU - BLOC_PAD, y + 2, { align: 'right' });
    y += hauteurJauge(nbLignesXp);

    return yHaut + hauteur;
  };

  return { hauteur, dessiner };
}

function preparerBlocSuivant(
  doc: jsPDF,
  catalogue: WarbandCatalog | undefined,
  m: Member,
  profil: Profile
): BlocPrepare {
  const xCol2 = MARGE + BLOC_PAD + LARGEUR_COL_STATS + 4;
  const largeurCol2 = MARGE + LARGEUR_CONTENU - BLOC_PAD - xCol2;
  doc.setFontSize(7.2);
  const equipementLignes = doc.splitTextToSize(`Équipement : ${m.equipement || 'Aucun'}`, largeurCol2).slice(0, 2);
  const reglesLignes = doc
    .splitTextToSize(`Règles spéciales & compétences : ${texteReglesEtCompetences(catalogue, profil, m)}`, largeurCol2)
    .slice(0, 2);

  const plafond = plafondPour(profil, m.competences_acquises);
  const hauteurCol1 = plafond ? 8.6 : 5.6;
  const hauteurCol2 = (equipementLignes.length + reglesLignes.length) * 3.1;
  const hauteurLigne2 = Math.max(hauteurCol1, hauteurCol2);
  const hauteurXp = hauteurJauge(1);
  const hauteur = BLOC_PAD + 4 + 1 + hauteurLigne2 + 1.4 + hauteurXp + BLOC_PAD;

  const dessiner = (doc: jsPDF, yDepart: number): number => {
    const yHaut = yDepart;
    doc.setDrawColor(...GRIS);
    doc.setLineWidth(0.3);
    doc.rect(MARGE, yHaut, LARGEUR_CONTENU, hauteur, 'S');

    let y = yHaut + BLOC_PAD + 3;
    const xTexte = MARGE + BLOC_PAD;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...NOIR);
    const groupe = m.taille_groupe > 1 ? ` × ${m.taille_groupe}` : '';
    doc.text(`${m.nom_perso}${groupe}`, xTexte, y);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRIS);
    doc.text(profil.nom, MARGE + LARGEUR_CONTENU - BLOC_PAD, y, { align: 'right' });
    y += 4 + 1;

    const yLigne2 = y;
    dessinerTableauStats(doc, xTexte, y, m, profil);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...NOIR);
    let yCol2 = yLigne2;
    for (const ligne of equipementLignes) {
      doc.text(ligne, xCol2, yCol2);
      yCol2 += 3.1;
    }
    for (const ligne of reglesLignes) {
      doc.text(ligne, xCol2, yCol2);
      yCol2 += 3.1;
    }
    y = yLigne2 + hauteurLigne2 + 1.4;

    dessinerJaugeXp(doc, xTexte, y, m.xp, HENCHMAN_XP_MAX, HENCHMAN_XP_MAX, isPalierHenchman);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...ACCENT);
    doc.text(`Expérience du groupe : ${m.xp}`, MARGE + LARGEUR_CONTENU - BLOC_PAD, y + 2, { align: 'right' });
    y += hauteurJauge(1);

    return yHaut + hauteur;
  };

  return { hauteur, dessiner };
}

function dessinerEntete(doc: jsPDF, roster: RosterInstance, catalogue: WarbandCatalog | undefined, y: number): number {
  doc.setFillColor(...NOIR);
  doc.rect(MARGE, y, LARGEUR_CONTENU, 10, 'F');
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('MORDHEIM', MARGE + 3, y + 6.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(220, 220, 220);
  doc.text('Bande :', MARGE + 55, y + 4.4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(roster.nom_bande, MARGE + 55, y + 8.4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(220, 220, 220);
  doc.text('Liste :', MARGE + 130, y + 4.4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  const nomListe = catalogue?.nom ?? roster.bande_id;
  doc.text(doc.splitTextToSize(nomListe, LARGEUR_CONTENU - 133), MARGE + 130, y + 8.4);

  y += 11.5;
  const tribu = tribuChoisie(catalogue, roster);
  if (tribu) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRIS);
    doc.text(`Tribu : ${tribu.nom}`, MARGE, y);
    y += 3.5;
  }
  return y;
}

function dessinerBoiteResume(
  doc: jsPDF,
  x: number,
  y: number,
  largeur: number,
  hauteur: number,
  titre: string,
  lignes: string[]
) {
  doc.setDrawColor(...NOIR);
  doc.setLineWidth(0.3);
  doc.rect(x, y, largeur, hauteur, 'S');
  doc.setFillColor(...GRIS_CLAIR);
  doc.rect(x, y, largeur, 4, 'F');
  doc.rect(x, y, largeur, 4, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(...NOIR);
  doc.text(titre, x + largeur / 2, y + 2.9, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  let ly = y + 7;
  for (const ligne of lignes) {
    doc.text(ligne, x + 1.8, ly, { maxWidth: largeur - 3.6 });
    ly += 3.1;
  }
}

function dessinerResume(doc: jsPDF, roster: RosterInstance, y: number): number {
  const largeurBoite = (LARGEUR_CONTENU - 4) / 3;
  const hauteurBoite = 16.5;
  const bilan = bilanBatailles(roster);
  const totalXp = roster.membres.reduce((acc, m) => acc + m.xp, 0);
  const heros = roster.membres.filter((m) => resolveProfil(roster, m)?.type === 'heros' && m.statut !== 'mort').length;
  const autres = roster.membres.filter((m) => resolveProfil(roster, m)?.type !== 'heros' && m.statut !== 'mort').length;

  dessinerBoiteResume(doc, MARGE, y, largeurBoite, hauteurBoite, 'TRÉSORERIE', [
    `${roster.tresorerie} po · ${roster.wyrdstone} wyrdstone`,
    `Valeur de bande : ${valeurBande(roster)} po`,
    `Bilan : ${bilan.victoires}V / ${bilan.defaites}D / ${bilan.nuls}N`,
  ]);

  dessinerBoiteResume(doc, MARGE + largeurBoite + 2, y, largeurBoite, hauteurBoite, 'CLASSEMENT DE BANDE', [
    `XP cumulé : ${totalXp} · Rating : ${ratingTotal(roster)}`,
    `${heros} héros, ${autres} suivant(s)`,
  ]);

  const stockLignes =
    roster.stock.length > 0
      ? doc.splitTextToSize(roster.stock.map((e) => e.nom).join(', '), largeurBoite - 3.6).slice(0, 3)
      : ['Aucun'];
  dessinerBoiteResume(
    doc,
    MARGE + (largeurBoite + 2) * 2,
    y,
    largeurBoite,
    hauteurBoite,
    "ÉQUIPEMENT EN RÉSERVE",
    stockLignes
  );

  return y + hauteurBoite + 4;
}

function dessinerPiedDePage(doc: jsPDF, roster: RosterInstance) {
  const nbPages = doc.getNumberOfPages();
  for (let i = 1; i <= nbPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...TRAIT);
    doc.line(MARGE, BAS_PAGE - 3, LARGEUR_PAGE - MARGE, BAS_PAGE - 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRIS);
    doc.text(
      `${roster.nom_bande} — généré le ${new Date().toLocaleDateString('fr-FR')}`,
      MARGE,
      BAS_PAGE
    );
    doc.text(`Page ${i} / ${nbPages}`, LARGEUR_PAGE - MARGE, BAS_PAGE, { align: 'right' });
  }
}

export function exporterRosterPDF(roster: RosterInstance) {
  const catalogue = getCatalogue(roster.bande_id);
  const doc = new jsPDF();
  let y = MARGE;

  y = dessinerEntete(doc, roster, catalogue, y);
  y = dessinerResume(doc, roster, y);

  const actifs = roster.membres.filter((m) => m.statut !== 'mort');
  const morts = roster.membres.filter((m) => m.statut === 'mort');
  const heros = actifs.filter((m) => resolveProfil(roster, m)?.type === 'heros');
  const suivants = actifs.filter((m) => resolveProfil(roster, m)?.type !== 'heros');

  if (heros.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NOIR);
    doc.text('Héros', MARGE, y);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(...GRIS);
    doc.text('(la ligne grisée sous les valeurs indique le plafond racial applicable)', MARGE + 14, y);
    y += 3.5;
    for (const m of heros) {
      const profil = resolveProfil(roster, m);
      if (!profil) continue;
      const bloc = preparerBlocHeros(doc, catalogue, m, profil);
      y = sautDePageSiNecessaire(doc, y, bloc.hauteur);
      y = bloc.dessiner(doc, y) + 2;
    }
  }

  if (suivants.length > 0) {
    doc.addPage();
    y = MARGE;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NOIR);
    doc.text('Hommes de main & créatures', MARGE, y);
    y += 5;
    for (const m of suivants) {
      const profil = resolveProfil(roster, m);
      if (!profil) continue;
      const bloc = preparerBlocSuivant(doc, catalogue, m, profil);
      y = sautDePageSiNecessaire(doc, y, bloc.hauteur);
      y = bloc.dessiner(doc, y) + 2;
    }
  }

  if (morts.length > 0) {
    y = sautDePageSiNecessaire(doc, y + 3, 8);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...ACCENT);
    doc.text(`Morts au combat : ${morts.map((m) => m.nom_perso).join(', ')}`, MARGE, y + 3);
    y += 8;
  }

  if (roster.equipement_reserve) {
    y = sautDePageSiNecessaire(doc, y + 3, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...NOIR);
    doc.text('Notes', MARGE, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const lignes = doc.splitTextToSize(roster.equipement_reserve, LARGEUR_CONTENU);
    doc.text(lignes, MARGE, y);
    y += lignes.length * 3.4 + 4;
  }

  if (roster.historique_batailles.length > 0) {
    y = sautDePageSiNecessaire(doc, y + 2, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NOIR);
    doc.text('Historique des batailles', MARGE, y);
    autoTable(doc, {
      startY: y + 3,
      margin: { left: MARGE, right: MARGE },
      head: [['Date', 'Résultat', 'Adversaire', 'Notes']],
      body: roster.historique_batailles.map((b) => [
        b.date,
        b.resultat,
        b.adversaires.join(', ') || '—',
        b.notes || '—',
      ]),
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: ACCENT as unknown as [number, number, number] },
    });
  }

  dessinerPiedDePage(doc, roster);

  const nomFichier = `${roster.nom_bande.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.pdf`;
  doc.save(nomFichier);
}
