import { useState } from 'react';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveLeader, succederApresMorts } from '../../utils/leader';
import { creerMembre } from '../../utils/factory';
import { equipementPerduALaMort } from '../../utils/shop';
import { nomAffiche } from '../../utils/profil';
import { marquesDisponibles } from '../../utils/magie';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  resultat: BattleRecord['resultat'];
  date: string;
  nbHerosHorsDeCombat: number;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  // Notifie PostBatailleScreen que le test a été résolu (Réussi ou Raté),
  // pour débloquer la validation finale de l'assistant — voir oeilApplicable
  // et oeilResolu dans PostBatailleScreen.
  onResolu: () => void;
  // État persistant côté PostBatailleScreen (oeilResolu) : ce composant est
  // démonté/remonté à chaque fois que l'assistant quitte puis revient à son
  // étape (son `resolu` local repart alors à zéro). Sans ce verrou externe,
  // revenir sur l'étape après une Défaite qui a tué le chef réoffrirait le
  // test contre le nouveau chef (qui n'a pas encore de Marque) — double
  // résolution en cascade. `dejaResolu` bloque tout rendu interactif dès que
  // le test a été résolu une fois, quel que soit l'état de montage local.
  dejaResolu: boolean;
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
// de recevoir une Marque des Dieux Sombres (victoire), sur un jet de 2D6 +
// modificateur comparé au seuil. Le calcul (jet physique + modificateur) se
// fait sur table papier ; l'app ne demande que le résultat du test.
export function ResolutionOeilDesDieuxSombres({
  roster,
  catalogue,
  resultat,
  date,
  nbHerosHorsDeCombat,
  onMajRoster,
  onResolu,
  dejaResolu,
}: Props) {
  const { t } = useLanguage();
  const [marqueChoisie, setMarqueChoisie] = useState('');
  const [succesDeclare, setSuccesDeclare] = useState(false);
  const [resolu, setResolu] = useState<string | null>(null);

  if (dejaResolu || resolu) {
    return (
      <div className="card card--tight" style={{ marginTop: '0.8rem' }}>
        <h3 className="mt-0">Œil des Dieux Sombres</h3>
        <p className="text-sm mb-0">{resolu ?? t('postBataille.eyeOfDarkGods.alreadyResolved')}</p>
      </div>
    );
  }

  const chef = resolveLeader(roster, catalogue);
  if (!chef || resultat === 'nul') return null;
  // "Une fois qu'un chef a reçu une Marque via cette règle, il n'y est plus
  // soumis (sauf s'il décède)" — le profil chef n'a jamais de Marque par un
  // autre biais, donc toute Marque présente vient forcément de ce test.
  if (chef.marque) return null;
  // "La règle Œil des Dieux Sombres ne s'applique pas si le chef de bande
  // n'a pas participé à la bataille" — un chef Blessé reste au camp, seul
  // cas de non-participation que l'app modélise explicitement (voir la
  // même condition dans oeilApplicable, PostBatailleScreen).
  if (chef.statut === 'blesse') return null;

  const seuil = seuilDeclenchement(roster, chef);

  const appliquerDefaite = () => {
    const dejaEnfant = roster.membres.some((m) => m.profil_id === 'enfant_du_chaos' && m.statut !== 'mort');
    const membresMaj = roster.membres.map((m) =>
      m.instance_id === chef.instance_id
        ? { ...m, statut: 'mort' as const, date_mort: date, ...equipementPerduALaMort() }
        : m
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
    onResolu();
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
    onResolu();
  };

  const enregistrerEchec = () => {
    setResolu(`Œil des Dieux Sombres : test raté pour ${nomAffiche(chef)} — aucun effet.`);
    onResolu();
  };

  return (
    <div className="card card--tight" style={{ marginTop: '0.8rem' }}>
      <h3 className="mt-0">Œil des Dieux Sombres</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        {resultat === 'defaite'
          ? t('postBataille.eyeOfDarkGods.defeatPrefix') +
            t('postBataille.eyeOfDarkGods.defeatDescription', { n: nbHerosHorsDeCombat, seuil, chef: nomAffiche(chef) })
          : t('postBataille.eyeOfDarkGods.victoryPrefix') +
            t('postBataille.eyeOfDarkGods.victoryDescription', { seuil, chef: nomAffiche(chef) })}
      </p>

      {!succesDeclare && (
        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn--pack-pill-sm btn--pack-pill-sm--primary"
            onClick={resultat === 'defaite' ? appliquerDefaite : () => setSuccesDeclare(true)}
          >
            {t('postBataille.success')}
          </button>
          <button type="button" className="btn--pack-pill-sm" onClick={enregistrerEchec}>
            {t('postBataille.failure')}
          </button>
        </div>
      )}

      {succesDeclare && resultat === 'victoire' && (
        <div style={{ marginTop: '0.4rem' }}>
          <div className="field">
            <label>{t('postBataille.eyeOfDarkGods.markLabel')}</label>
            <select value={marqueChoisie} onChange={(e) => setMarqueChoisie(e.target.value)}>
              <option value="">{t('postBataille.chooseEllipsis')}</option>
              {marquesDisponibles(catalogue, roster).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn--pack-pill-sm btn--pack-pill-sm--primary" disabled={!marqueChoisie} onClick={appliquerVictoire}>
            {t('postBataille.eyeOfDarkGods.assignMark')}
          </button>
        </div>
      )}
    </div>
  );
}
