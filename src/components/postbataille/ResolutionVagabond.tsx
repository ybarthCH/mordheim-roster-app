import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveLeader } from '../../utils/leader';
import { creerMembre } from '../../utils/factory';
import { ajouterEffetPersistant, CLE_DE_SUPPLEMENTAIRE_EXPLORATION } from '../../utils/effetsPersistants';
import { JetOrButton } from './JetOrButton';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterOr: (montant: number) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (4 4) Vagabond — l'action possible dépend de la nature de la bande.
export function ResolutionVagabond({ roster, catalogue, onMajRoster, onAjouterOr, onAjouterAuJournal }: Props) {
  const { t } = useLanguage();
  const chef = resolveLeader(roster, catalogue);
  const zombieProfil = catalogue.profils.find((p) => p.id === 'zombie');
  // Se verrouille une fois une option choisie : ces trois boutons n'avaient
  // aucun état, ils restaient cliquables indéfiniment — chaque clic
  // supplémentaire rappliquait le gain (XP, zombie, dé bonus) en double.
  const [resolu, setResolu] = useState<string | null>(null);

  const sacrifierPourXp = () => {
    if (!chef) return;
    onMajRoster({ membres: roster.membres.map((m) => (m.instance_id === chef.instance_id ? { ...m, xp: m.xp + 1 } : m)) });
    onAjouterAuJournal(`Vagabond : sacrifié aux dieux du Chaos — ${chef.nom_perso} gagne +1pt d'expérience.`);
    setResolu(t('postBataille.vagrant.sacrificed', { nom: chef.nom_perso }));
  };

  const tuerPourZombie = () => {
    if (!zombieProfil) return;
    const zombie = creerMembre(zombieProfil, 0);
    onMajRoster({ membres: [...roster.membres, zombie] });
    onAjouterAuJournal('Vagabond : tué et transformé en zombie, rejoint la bande gratuitement.');
    setResolu(t('postBataille.vagrant.turnedZombie'));
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
    setResolu(t('postBataille.vagrant.questioned'));
  };

  const venduPourOr = (valeur: number) => {
    onAjouterOr(valeur);
    onAjouterAuJournal(`Vagabond : vendu aux agents du clan Eshin — +${valeur} po (2D6).`);
    setResolu(t('postBataille.vagrant.soldTo', { n: valeur }));
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        {t('postBataille.vagrant.result', { texte: resolu })}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn--sm"
          disabled={catalogue.id !== 'skaven'}
          title={catalogue.id !== 'skaven' ? t('postBataille.vagrant.reservedFor', { faction: 'Skavens' }) : undefined}
        >
          {t('postBataille.vagrant.sellFor2d6')}
        </button>
        <button
          type="button"
          className="btn btn--sm"
          disabled={catalogue.id !== 'cult_of_the_possessed' || !chef}
          title={catalogue.id !== 'cult_of_the_possessed' ? t('postBataille.vagrant.reservedFor', { faction: 'Possédés' }) : undefined}
          onClick={sacrifierPourXp}
        >
          {t('postBataille.vagrant.sacrificeForXp')}
        </button>
        <button
          type="button"
          className="btn btn--sm"
          disabled={(catalogue.id !== 'undead' && catalogue.id !== 'morts_sans_repos') || !zombieProfil}
          title={
            catalogue.id !== 'undead' && catalogue.id !== 'morts_sans_repos'
              ? t('postBataille.vagrant.reservedFor', { faction: 'Morts-vivants' })
              : undefined
          }
          onClick={tuerPourZombie}
        >
          {t('postBataille.vagrant.killForZombie')}
        </button>
        <button
          type="button"
          className="btn btn--sm"
          disabled={['skaven', 'cult_of_the_possessed', 'undead', 'morts_sans_repos'].includes(catalogue.id)}
          title={
            ['skaven', 'cult_of_the_possessed', 'undead', 'morts_sans_repos'].includes(catalogue.id)
              ? t('postBataille.vagrant.betterOptionAbove')
              : undefined
          }
          onClick={interroger}
        >
          {t('postBataille.vagrant.questionForDie')}
        </button>
      </div>
      {catalogue.id === 'skaven' && (
        <JetOrButton
          label={t('postBataille.vagrant.rollObtained2d6')}
          onValider={venduPourOr}
          boutonLabel={t('postBataille.vagrant.sellAddTreasury')}
        />
      )}
    </div>
  );
}
