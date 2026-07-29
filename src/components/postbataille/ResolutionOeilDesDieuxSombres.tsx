import { useState } from 'react';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveLeader, succederApresMorts } from '../../utils/leader';
import { creerMembre } from '../../utils/factory';
import { nomAffiche } from '../../utils/profil';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  resultat: BattleRecord['resultat'];
  date: string;
  nbHerosHorsDeCombat: number;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
};

// Seuil de déclenchement : 12+ de base, 13+ pour la tribu Norse (Panthéon),
// abaissé à 10+ (11+ pour un chef Norse) avec la compétence Corps tatoué.
function seuilDeclenchement(roster: RosterInstance, chef: Member): number {
  const tatoue = chef.competences_acquises.includes('corps_tatoue');
  const norse = roster.tribu === 'norses';
  if (tatoue) return norse ? 11 : 10;
  return norse ? 13 : 12;
}

// Règle spéciale Œil des Dieux Sombres (Maraudeurs du Chaos) : après chaque
// bataille, le chef risque de se transformer en Enfant du Chaos (défaite) ou
// de recevoir une Marque des Dieux Sombres (victoire). Le jet de 2D6 est
// physique (saisi par le joueur), le modificateur de défaite est déduit
// automatiquement du nombre de Héros hors de combat de cette bataille ; celui
// de victoire (ennemis mis hors de combat par le chef) reste manuel, l'app ne
// suivant pas les pertes adverses.
export function ResolutionOeilDesDieuxSombres({
  roster,
  catalogue,
  resultat,
  date,
  nbHerosHorsDeCombat,
  onMajRoster,
}: Props) {
  const [jet, setJet] = useState('');
  const [ennemisHc, setEnnemisHc] = useState('');
  const [marqueChoisie, setMarqueChoisie] = useState('');
  const [resolu, setResolu] = useState<string | null>(null);

  if (resolu) {
    return (
      <div className="card card--tight" style={{ marginTop: '0.8rem' }}>
        <h3 className="mt-0">Œil des Dieux Sombres</h3>
        <p className="text-sm mb-0">{resolu}</p>
      </div>
    );
  }

  const chef = resolveLeader(roster, catalogue);
  if (!chef || resultat === 'nul') return null;
  // "Une fois qu'un chef a reçu une Marque via cette règle, il n'y est plus
  // soumis (sauf s'il décède)" — le profil chef n'a jamais de Marque par un
  // autre biais, donc toute Marque présente vient forcément de ce test.
  if (chef.marque) return null;

  const jetNombre = Number(jet);
  const jetValide = jet.trim() !== '' && Number.isFinite(jetNombre) && jetNombre > 0;
  const modificateur = resultat === 'defaite' ? nbHerosHorsDeCombat : Math.max(0, Math.trunc(Number(ennemisHc)) || 0);
  const total = jetValide ? jetNombre + modificateur : null;
  const seuil = seuilDeclenchement(roster, chef);
  const succes = total !== null && total >= seuil;

  const appliquerDefaite = () => {
    const dejaEnfant = roster.membres.some((m) => m.profil_id === 'enfant_du_chaos' && m.statut !== 'mort');
    const membresMaj = roster.membres.map((m) =>
      m.instance_id === chef.instance_id ? { ...m, statut: 'mort' as const, date_mort: date } : m
    );
    const succession = succederApresMorts(roster, catalogue, membresMaj, { sansBannirProfilLeader: true });
    const profilEnfant = catalogue.profils.find((p) => p.id === 'enfant_du_chaos');
    const nouveauMembre = !dejaEnfant && profilEnfant ? creerMembre(profilEnfant, 0) : undefined;
    const note = dejaEnfant
      ? `Œil des Dieux Sombres : ${nomAffiche(chef)} aurait dû devenir un Enfant du Chaos, mais la bande en compte déjà un — il est simplement retiré de la bande.`
      : `Œil des Dieux Sombres : ${nomAffiche(chef)} devient un Enfant du Chaos (perd expérience, compétences, blessures et équipement).`;
    onMajRoster({
      ...succession,
      membres: nouveauMembre ? [...membresMaj, nouveauMembre] : membresMaj,
      equipement_reserve: `${roster.equipement_reserve}${roster.equipement_reserve ? '\n' : ''}${note}`,
    });
    setResolu(note);
  };

  const appliquerVictoire = () => {
    if (!marqueChoisie) return;
    const marqueNom = catalogue.marques?.find((m) => m.id === marqueChoisie)?.nom ?? marqueChoisie;
    const note = `Œil des Dieux Sombres : ${nomAffiche(chef)} reçoit la ${marqueNom}.`;
    onMajRoster({
      membres: roster.membres.map((m) => (m.instance_id === chef.instance_id ? { ...m, marque: marqueChoisie } : m)),
      equipement_reserve: `${roster.equipement_reserve}${roster.equipement_reserve ? '\n' : ''}${note}`,
    });
    setResolu(note);
  };

  return (
    <div className="card card--tight" style={{ marginTop: '0.8rem' }}>
      <h3 className="mt-0">Œil des Dieux Sombres</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        {resultat === 'defaite'
          ? `Défaite : jette 2D6 et ajoute +1 par Héros hors de combat (${nbHerosHorsDeCombat} ici). Sur ${seuil}+, ${nomAffiche(chef)} devient un Enfant du Chaos.`
          : `Victoire : jette 2D6 et ajoute +1 par ennemi mis hors de combat par ${nomAffiche(chef)}. Sur ${seuil}+, il reçoit une Marque des Dieux Sombres au choix.`}
      </p>
      <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
        <span className="text-sm text-muted">Jet obtenu (2D6) :</span>
        <input type="number" min={2} max={12} style={{ width: '5rem' }} value={jet} onChange={(e) => setJet(e.target.value)} />
        {resultat === 'victoire' && (
          <>
            <span className="text-sm text-muted">Ennemis mis HC par le chef :</span>
            <input
              type="number"
              min={0}
              style={{ width: '4rem' }}
              value={ennemisHc}
              onChange={(e) => setEnnemisHc(e.target.value)}
            />
          </>
        )}
      </div>
      {jetValide && (
        <p className="text-sm" style={{ marginTop: '0.4rem' }}>
          Total : {total} (seuil {seuil}+) — {succes ? 'déclenché !' : 'aucun effet.'}
        </p>
      )}
      {succes && resultat === 'defaite' && (
        <button type="button" className="btn btn--sm btn--primary" onClick={appliquerDefaite}>
          Appliquer
        </button>
      )}
      {succes && resultat === 'victoire' && (
        <div style={{ marginTop: '0.4rem' }}>
          <div className="field">
            <label>Marque des Dieux Sombres</label>
            <select value={marqueChoisie} onChange={(e) => setMarqueChoisie(e.target.value)}>
              <option value="">— Choisir —</option>
              {catalogue.marques?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn--sm btn--primary" disabled={!marqueChoisie} onClick={appliquerVictoire}>
            Attribuer la Marque
          </button>
        </div>
      )}
    </div>
  );
}
