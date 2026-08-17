import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveProfil } from '../../utils/profil';
import { creerMembre } from '../../utils/factory';
import { JetOrButton } from './JetOrButton';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  // Nom traduit de l'événement (voir evenementAffiche dans EvenementExploration),
  // utilisé comme préfixe des entrées de journal ci-dessous.
  nomEvenement: string;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterOr: (montant: number) => void;
  onAjouterAuJournal: (texte: string) => void;
};

type Branche = 'possedes' | 'morts_vivants' | 'skaven' | 'autres';

// (3 3 3) Prisonniers — l'action possible dépend de la nature de la bande.
export function ResolutionPrisonniers({
  roster,
  catalogue,
  nomEvenement,
  onMajRoster,
  onAjouterOr,
  onAjouterAuJournal,
}: Props) {
  const { t } = useLanguage();
  const [branche, setBranche] = useState<Branche | null>(null);
  const [heroId, setHeroId] = useState('');
  const [jetXp, setJetXp] = useState('');
  const [jetZombies, setJetZombies] = useState('');
  // Se verrouille une fois une branche résolue : sans ça, rien n'indiquait
  // qu'un clic sur « Escorter » (ou une autre branche) avait bien été pris en
  // compte, et rien n'empêchait de recliquer pour appliquer le gain une
  // deuxième fois.
  const [resolu, setResolu] = useState<string | null>(null);

  const heros = roster.membres.filter((m) => m.statut !== 'mort' && resolveProfil(roster, m)?.type === 'heros');
  const zombieProfil = catalogue.profils.find((p) => p.id === 'zombie');
  const estMortsVivants = catalogue.id === 'undead' || catalogue.id === 'morts_sans_repos';

  const appliquerXp = () => {
    const valeur = Number(jetXp);
    const hero = heros.find((m) => m.instance_id === heroId);
    if (!hero || !Number.isFinite(valeur) || valeur <= 0) return;
    onMajRoster({ membres: roster.membres.map((m) => (m.instance_id === hero.instance_id ? { ...m, xp: m.xp + valeur } : m)) });
    const texte = t('postBataille.prisoners.sacrificed', { nom: hero.nom_perso, n: valeur });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const appliquerZombies = () => {
    const valeur = Math.trunc(Number(jetZombies));
    if (!zombieProfil || !Number.isFinite(valeur) || valeur <= 0) return;
    const zombies = Array.from({ length: valeur }, () => creerMembre(zombieProfil, 0));
    onMajRoster({ membres: [...roster.membres, ...zombies] });
    const texte = t('postBataille.prisoners.turnedZombies', { n: valeur });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const vendus = (valeur: number) => {
    onAjouterOr(valeur);
    const texte = t('postBataille.prisoners.soldAsSlaves', { n: valeur });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const escortes = (valeur: number) => {
    onAjouterOr(valeur);
    const texte = t('postBataille.prisoners.escorted', { n: valeur });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        {t('postBataille.prisoners.result', { texte: resolu })}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn--pack-pill-sm ${branche === 'possedes' ? 'btn--pack-pill-sm--primary' : ''}`}
          disabled={catalogue.id !== 'cult_of_the_possessed'}
          title={catalogue.id !== 'cult_of_the_possessed' ? t('postBataille.vagrant.reservedFor', { faction: 'Possédés' }) : undefined}
          onClick={() => setBranche('possedes')}
        >
          {t('postBataille.prisoners.sacrificeForXp')}
        </button>
        <button
          type="button"
          className={`btn--pack-pill-sm ${branche === 'morts_vivants' ? 'btn--pack-pill-sm--primary' : ''}`}
          disabled={!estMortsVivants || !zombieProfil}
          title={!estMortsVivants ? t('postBataille.vagrant.reservedFor', { faction: 'Morts-vivants' }) : undefined}
          onClick={() => setBranche('morts_vivants')}
        >
          {t('postBataille.prisoners.killForZombies')}
        </button>
        <button
          type="button"
          className={`btn--pack-pill-sm ${branche === 'skaven' ? 'btn--pack-pill-sm--primary' : ''}`}
          disabled={catalogue.id !== 'skaven'}
          title={catalogue.id !== 'skaven' ? t('postBataille.vagrant.reservedFor', { faction: 'Skavens' }) : undefined}
          onClick={() => setBranche('skaven')}
        >
          {t('postBataille.prisoners.sellFor3d6')}
        </button>
        <button
          type="button"
          className={`btn--pack-pill-sm ${branche === 'autres' ? 'btn--pack-pill-sm--primary' : ''}`}
          disabled={['cult_of_the_possessed', 'skaven', 'undead', 'morts_sans_repos'].includes(catalogue.id)}
          title={
            ['cult_of_the_possessed', 'skaven', 'undead', 'morts_sans_repos'].includes(catalogue.id)
              ? t('postBataille.vagrant.betterOptionAbove')
              : undefined
          }
          onClick={() => setBranche('autres')}
        >
          {t('postBataille.prisoners.escort')}
        </button>
      </div>

      {branche === 'possedes' && (
        <div style={{ marginTop: '0.5rem' }}>
          <div className="field">
            <label>{t('postBataille.prisoners.heroXpLabel')}</label>
            <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
              <option value="">{t('postBataille.chooseEllipsis')}</option>
              {heros.map((m) => (
                <option key={m.instance_id} value={m.instance_id}>
                  {m.nom_perso}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
            <span className="text-sm text-muted">{t('postBataille.prisoners.rollObtainedD3')}</span>
            <input type="number" min={0} style={{ width: '5rem' }} value={jetXp} onChange={(e) => setJetXp(e.target.value)} />
            <button type="button" className="btn--pack-pill-sm btn--pack-pill-sm--primary" disabled={!heroId || !jetXp} onClick={appliquerXp}>
              {t('postBataille.prisoners.addXp')}
            </button>
          </div>
        </div>
      )}

      {branche === 'morts_vivants' && (
        <div className="flex gap-sm items-center" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <span className="text-sm text-muted">{t('postBataille.prisoners.rollObtainedD3')}</span>
          <input
            type="number"
            min={0}
            style={{ width: '5rem' }}
            value={jetZombies}
            onChange={(e) => setJetZombies(e.target.value)}
          />
          <button type="button" className="btn--pack-pill-sm btn--pack-pill-sm--primary" disabled={!jetZombies} onClick={appliquerZombies}>
            {t('postBataille.prisoners.addZombies')}
          </button>
        </div>
      )}

      {branche === 'skaven' && (
        <JetOrButton
          label={t('postBataille.prisoners.rollObtained3d6')}
          onValider={vendus}
          boutonLabel={t('postBataille.vagrant.sellAddTreasury')}
        />
      )}

      {branche === 'autres' && (
        <JetOrButton label={t('postBataille.vagrant.rollObtained2d6')} onValider={escortes} boutonLabel={t('postBataille.addToTreasury')} />
      )}
    </div>
  );
}
