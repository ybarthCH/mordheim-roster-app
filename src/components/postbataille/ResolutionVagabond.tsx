import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveLeader } from '../../utils/leader';
import { creerMembre } from '../../utils/factory';
import { ajouterEffetPersistant, CLE_DE_SUPPLEMENTAIRE_EXPLORATION } from '../../utils/effetsPersistants';
import { JetOrButton } from './JetOrButton';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterOr: (montant: number) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (4 4) Vagabond — l'action possible dépend de la nature de la bande.
export function ResolutionVagabond({ roster, catalogue, onMajRoster, onAjouterOr, onAjouterAuJournal }: Props) {
  const chef = resolveLeader(roster, catalogue);
  const zombieProfil = catalogue.profils.find((p) => p.id === 'zombie');

  const sacrifierPourXp = () => {
    if (!chef) return;
    onMajRoster({ membres: roster.membres.map((m) => (m.instance_id === chef.instance_id ? { ...m, xp: m.xp + 1 } : m)) });
    onAjouterAuJournal(`Vagabond : sacrifié aux dieux du Chaos — ${chef.nom_perso} gagne +1pt d'expérience.`);
  };

  const tuerPourZombie = () => {
    if (!zombieProfil) return;
    const zombie = creerMembre(zombieProfil, 0);
    onMajRoster({ membres: [...roster.membres, zombie] });
    onAjouterAuJournal('Vagabond : tué et transformé en zombie, rejoint la bande gratuitement.');
  };

  const interroger = () => {
    onMajRoster(
      ajouterEffetPersistant(roster, {
        cle: CLE_DE_SUPPLEMENTAIRE_EXPLORATION,
        label: "Vagabond interrogé — +1 dé au prochain jet d'exploration",
        valeur: 1,
      })
    );
    onAjouterAuJournal(
      "Vagabond : interrogé sur la ville — +1 dé (avec annulation d'un résultat au choix) au prochain jet d'exploration."
    );
  };

  const venduPourOr = (valeur: number) => {
    onAjouterOr(valeur);
    onAjouterAuJournal(`Vagabond : vendu aux agents du clan Eshin — +${valeur} po (2D6).`);
  };

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn--sm"
          disabled={catalogue.id !== 'skaven'}
          title={catalogue.id !== 'skaven' ? 'Réservé aux Skavens' : undefined}
        >
          Vendre pour 2D6 CO
        </button>
        <button
          type="button"
          className="btn btn--sm"
          disabled={catalogue.id !== 'cult_of_the_possessed' || !chef}
          title={catalogue.id !== 'cult_of_the_possessed' ? 'Réservé aux Possédés' : undefined}
          onClick={sacrifierPourXp}
        >
          Sacrifier — chef +1 XP
        </button>
        <button
          type="button"
          className="btn btn--sm"
          disabled={(catalogue.id !== 'undead' && catalogue.id !== 'morts_sans_repos') || !zombieProfil}
          title={
            catalogue.id !== 'undead' && catalogue.id !== 'morts_sans_repos' ? 'Réservé aux Morts-vivants' : undefined
          }
          onClick={tuerPourZombie}
        >
          Tuer — zombie gratuit
        </button>
        <button
          type="button"
          className="btn btn--sm"
          disabled={['skaven', 'cult_of_the_possessed', 'undead', 'morts_sans_repos'].includes(catalogue.id)}
          title={
            ['skaven', 'cult_of_the_possessed', 'undead', 'morts_sans_repos'].includes(catalogue.id)
              ? 'Cette bande a une meilleure option ci-dessus'
              : undefined
          }
          onClick={interroger}
        >
          Interroger — dé bonus prochaine exploration
        </button>
      </div>
      {catalogue.id === 'skaven' && (
        <JetOrButton label="Jet obtenu (2D6) :" onValider={venduPourOr} boutonLabel="Vendre — ajouter à la trésorerie" />
      )}
    </div>
  );
}
