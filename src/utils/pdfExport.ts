import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RosterInstance } from '../types/roster';
import { STATUTS } from '../types/roster';
import { getCatalogue } from '../data/warbands';
import { resolveProfil } from './profil';
import { valeurBande, bilanBatailles } from './bandeValue';
import { STAT_KEYS } from '../types/catalog';

export function exporterRosterPDF(roster: RosterInstance) {
  const catalogue = getCatalogue(roster.bande_id);
  const doc = new jsPDF();
  const marge = 14;
  let y = 18;

  doc.setFontSize(18);
  doc.text(roster.nom_bande, marge, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(catalogue?.nom ?? roster.bande_id, marge, y);
  y += 8;

  const bilan = bilanBatailles(roster);
  doc.setFontSize(10);
  doc.text(
    `Valeur de bande : ${valeurBande(roster)} po   Trésorerie : ${roster.tresorerie} po   Wyrdstone : ${roster.wyrdstone}   Bilan : ${bilan.victoires}V / ${bilan.defaites}D / ${bilan.nuls}N`,
    marge,
    y
  );
  y += 6;
  if (roster.equipement_reserve) {
    const lignes = doc.splitTextToSize(`Équipement en réserve : ${roster.equipement_reserve}`, 180);
    doc.text(lignes, marge, y);
    y += lignes.length * 5 + 2;
  }

  const membresActifs = roster.membres.filter((m) => m.statut !== 'mort');
  const membresMorts = roster.membres.filter((m) => m.statut === 'mort');

  autoTable(doc, {
    startY: y + 2,
    head: [['Nom', 'Profil', ...STAT_KEYS, 'XP', 'Statut', 'Équipement']],
    body: membresActifs.map((m) => {
      const profil = resolveProfil(roster, m);
      return [
        m.nom_perso,
        profil?.nom ?? m.profil_id,
        ...STAT_KEYS.map((k) => String(m.stats_actuels[k])),
        String(m.xp),
        STATUTS.find((s) => s.id === m.statut)?.label ?? m.statut,
        m.equipement || '—',
      ];
    }),
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [122, 20, 20] },
  });

  if (membresMorts.length > 0) {
    // @ts-expect-error lastAutoTable est ajouté dynamiquement par jspdf-autotable
    const finTableau = doc.lastAutoTable?.finalY ?? y + 2;
    doc.setFontSize(9);
    doc.text(
      `Morts au combat : ${membresMorts.map((m) => m.nom_perso).join(', ')}`,
      marge,
      finTableau + 8
    );
  }

  if (roster.historique_batailles.length > 0) {
    // @ts-expect-error lastAutoTable est ajouté dynamiquement par jspdf-autotable
    const finTableau2 = doc.lastAutoTable?.finalY ?? y + 2;
    autoTable(doc, {
      startY: finTableau2 + (membresMorts.length > 0 ? 12 : 4),
      head: [['Date', 'Résultat', 'Adversaire', 'Notes']],
      body: roster.historique_batailles.map((b) => [
        b.date,
        b.resultat,
        b.adversaires.join(', ') || '—',
        b.notes || '—',
      ]),
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [122, 20, 20] },
    });
  }

  const nomFichier = `${roster.nom_bande.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.pdf`;
  doc.save(nomFichier);
}
