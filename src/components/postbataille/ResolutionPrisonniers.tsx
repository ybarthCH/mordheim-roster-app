import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveProfil } from '../../utils/profil';
import { creerMembre } from '../../utils/factory';
import { rejoindreGroupe, groupeDupliqueraitObjetLimite } from '../../utils/shop';
import { JetOrButton } from './JetOrButton';
import { useLanguage } from '../../state/useLanguage';
import { useGameRules } from '../../state/useGameRules';
import { BANDES_TRAITEES_COMME_POSSEDES } from '../../data/bandeCategories';

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

type Branche = 'possedes' | 'morts_vivants' | 'skaven' | 'destin_cruel' | 'gloutonnerie' | 'autres';

// Voir BANDES_TRAITEES_COMME_POSSEDES (data/bandeCategories.ts) pour la
// source de chaque bande listée ici.
const BANDES_SACRIFICE_PRISONNIERS = BANDES_TRAITEES_COMME_POSSEDES;

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
  const { rules } = useGameRules();
  const [branche, setBranche] = useState<Branche | null>(null);
  const [heroId, setHeroId] = useState('');
  const [jetXp, setJetXp] = useState('');
  const [jetZombies, setJetZombies] = useState('');
  // Branche « Escorter » : le gain d'or (2D6) et la recrue gratuite sont deux
  // gains indépendants du même résultat — on ne verrouille (voir `resolu`)
  // qu'une fois les deux réglés, mais l'or est appliqué dès son propre jet.
  const [orEscorteValeur, setOrEscorteValeur] = useState<number | null>(null);
  const [groupeRecrueId, setGroupeRecrueId] = useState('');
  // Se verrouille une fois une branche résolue : sans ça, rien n'indiquait
  // qu'un clic sur « Escorter » (ou une autre branche) avait bien été pris en
  // compte, et rien n'empêchait de recliquer pour appliquer le gain une
  // deuxième fois.
  const [resolu, setResolu] = useState<string | null>(null);

  const heros = roster.membres.filter((m) => m.statut !== 'mort' && resolveProfil(roster, m)?.type === 'heros');
  const zombieProfil = catalogue.profils.find((p) => p.id === 'zombie');
  const estMortsVivants = catalogue.id === 'undead' || catalogue.id === 'morts_sans_repos';
  // "Destin Cruel" (Cour des Plaisirs Profanes) : "Tout captif obtenu par la
  // bande (résultat de combat ou exploration) peut être transformé en
  // Souffre-douleur sans frais, par lobotomie, torture et autres actes de
  // dépravité." Seule la voie "résultat d'exploration" (cet événement 3.3.3)
  // a un point d'accroche dans l'app — aucune mécanique n'y modélise
  // "capturer un Héros ennemi en combat" (le roster adverse n'est jamais
  // suivi), donc ce volet reste hors de portée, comme pour les autres
  // bandes déjà traitées ici (Morts-Vivants : Zombie, uniquement via cet
  // événement).
  const souffreDouleurProfil = catalogue.profils.find((p) => p.id === 'souffre_douleur');
  // "Gloutonnerie" (Mangeurs d'Hommes) : "Les figurines capturées (via
  // Blessures Graves ou Exploration) peuvent être dévorées [...]. Un Héros
  // Ogre qui dévore des captifs gagne autant d'expérience que de figurines
  // consommées." Seule la voie "Exploration" (cet événement 3.3.3) a un
  // point d'accroche — la voie "Blessures Graves" capture un Héros ENNEMI en
  // combat, jamais modélisée ici (roster adverse non suivi), même limite
  // documentée pour "Destin Cruel" ci-dessus. Le captif de cet événement
  // n'est jamais matérialisé comme figurine dans l'app (contrairement au
  // Zombie/Souffre-douleur) : pas de possessions à transférer, un seul
  // captif consommé ici (comme pour Destin Cruel) -> +1 XP fixe, pas de jet.
  const herosOgres = heros.filter((m) => resolveProfil(roster, m)?.groupe_caracteristiques === 'ogre_garde_mangeur');
  // « n'importe quel groupe humain » de la bande : les groupes d'hommes de
  // main (hors profils "animal", ex : Chien de guerre — ce n'est pas un
  // captif humain qui pourrait les rejoindre).
  const groupesHumains = roster.membres.filter(
    (m) => m.statut !== 'mort' && resolveProfil(roster, m)?.type === 'homme_de_main'
  );

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

  const appliquerDestinCruel = () => {
    if (!souffreDouleurProfil) return;
    const souffreDouleur = creerMembre(souffreDouleurProfil, 0);
    onMajRoster({ membres: [...roster.membres, souffreDouleur] });
    const texte = t('postBataille.prisoners.turnedTormented');
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const appliquerGloutonnerie = () => {
    const hero = herosOgres.find((m) => m.instance_id === heroId);
    if (!hero) return;
    onMajRoster({ membres: roster.membres.map((m) => (m.instance_id === hero.instance_id ? { ...m, xp: m.xp + 1 } : m)) });
    const texte = t('postBataille.prisoners.devoured', { nom: hero.nom_perso });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const vendus = (valeur: number) => {
    onAjouterOr(valeur);
    const texte = t('postBataille.prisoners.soldAsSlaves', { n: valeur });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const validerOrEscorte = (valeur: number) => {
    onAjouterOr(valeur);
    onAjouterAuJournal(`${nomEvenement} : ${t('postBataille.prisoners.escorted', { n: valeur })}`);
    setOrEscorteValeur(valeur);
  };

  const finaliserEscorte = (texteRecrue: string) => {
    onAjouterAuJournal(`${nomEvenement} : ${texteRecrue}`);
    setResolu(`${t('postBataille.prisoners.escorted', { n: orEscorteValeur ?? 0 })} ${texteRecrue}`);
  };

  const groupeRecrue = groupesHumains.find((m) => m.instance_id === groupeRecrueId);
  const dupliqueraitObjetLimite = !!groupeRecrue && groupeDupliqueraitObjetLimite(groupeRecrue, rules);

  const ajouterRecrue = () => {
    if (!groupeRecrue || dupliqueraitObjetLimite) return;
    onMajRoster(rejoindreGroupe(roster, groupeRecrue, 1, 0));
    finaliserEscorte(t('postBataille.prisoners.recruitJoined', { groupe: groupeRecrue.nom_perso }));
  };

  const ignorerRecrue = () => {
    finaliserEscorte(t('postBataille.prisoners.recruitSkipped'));
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
          disabled={!BANDES_SACRIFICE_PRISONNIERS.includes(catalogue.id)}
          title={
            !BANDES_SACRIFICE_PRISONNIERS.includes(catalogue.id)
              ? t('postBataille.vagrant.reservedFor', { faction: 'Possédés, Amazones' })
              : undefined
          }
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
          className={`btn--pack-pill-sm ${branche === 'destin_cruel' ? 'btn--pack-pill-sm--primary' : ''}`}
          disabled={catalogue.id !== 'cour_des_plaisirs_profanes' || !souffreDouleurProfil}
          title={
            catalogue.id !== 'cour_des_plaisirs_profanes'
              ? t('postBataille.vagrant.reservedFor', { faction: 'Cour des Plaisirs Profanes' })
              : undefined
          }
          onClick={() => setBranche('destin_cruel')}
        >
          {t('postBataille.prisoners.turnTormented')}
        </button>
        <button
          type="button"
          className={`btn--pack-pill-sm ${branche === 'gloutonnerie' ? 'btn--pack-pill-sm--primary' : ''}`}
          disabled={catalogue.id !== 'maneaters' || herosOgres.length === 0}
          title={catalogue.id !== 'maneaters' ? t('postBataille.vagrant.reservedFor', { faction: 'Mangeurs d’Hommes' }) : undefined}
          onClick={() => setBranche('gloutonnerie')}
        >
          {t('postBataille.prisoners.devour')}
        </button>
        <button
          type="button"
          className={`btn--pack-pill-sm ${branche === 'autres' ? 'btn--pack-pill-sm--primary' : ''}`}
          disabled={[
            ...BANDES_SACRIFICE_PRISONNIERS,
            'skaven',
            'undead',
            'morts_sans_repos',
            'cour_des_plaisirs_profanes',
            'maneaters',
          ].includes(catalogue.id)}
          title={
            [
              ...BANDES_SACRIFICE_PRISONNIERS,
              'skaven',
              'undead',
              'morts_sans_repos',
              'cour_des_plaisirs_profanes',
              'maneaters',
            ].includes(catalogue.id)
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

      {branche === 'destin_cruel' && (
        <div style={{ marginTop: '0.5rem' }}>
          <button
            type="button"
            className="btn--pack-pill-sm btn--pack-pill-sm--primary"
            disabled={!souffreDouleurProfil}
            onClick={appliquerDestinCruel}
          >
            {t('postBataille.prisoners.addTormented')}
          </button>
        </div>
      )}

      {branche === 'gloutonnerie' && (
        <div style={{ marginTop: '0.5rem' }}>
          <div className="field">
            <label>{t('postBataille.prisoners.heroXpLabel')}</label>
            <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
              <option value="">{t('postBataille.chooseEllipsis')}</option>
              {herosOgres.map((m) => (
                <option key={m.instance_id} value={m.instance_id}>
                  {m.nom_perso}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn--pack-pill-sm btn--pack-pill-sm--primary"
            disabled={!heroId}
            onClick={appliquerGloutonnerie}
          >
            {t('postBataille.prisoners.confirmDevour')}
          </button>
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

      {branche === 'autres' && orEscorteValeur === null && (
        <JetOrButton
          label={t('postBataille.vagrant.rollObtained2d6')}
          onValider={validerOrEscorte}
          boutonLabel={t('postBataille.addToTreasury')}
        />
      )}

      {branche === 'autres' && orEscorteValeur !== null && (
        <div style={{ marginTop: '0.5rem' }}>
          {groupesHumains.length > 0 ? (
            <div className="field">
              <label>{t('postBataille.prisoners.recruitGroupLabel')}</label>
              <select value={groupeRecrueId} onChange={(e) => setGroupeRecrueId(e.target.value)}>
                <option value="">{t('postBataille.chooseEllipsis')}</option>
                {groupesHumains.map((g) => (
                  <option key={g.instance_id} value={g.instance_id}>
                    {g.nom_perso} (×{g.taille_groupe})
                  </option>
                ))}
              </select>
              {dupliqueraitObjetLimite && (
                <p className="text-danger text-sm">{t('recruterDansGroupe.trinketBlocked')}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">{t('postBataille.prisoners.recruitNoGroup')}</p>
          )}
          <div className="flex gap-sm" style={{ marginTop: '0.4rem', flexWrap: 'wrap' }}>
            {groupesHumains.length > 0 && (
              <button
                type="button"
                className="btn--pack-pill-sm btn--pack-pill-sm--primary"
                disabled={!groupeRecrueId || dupliqueraitObjetLimite}
                onClick={ajouterRecrue}
              >
                {t('postBataille.prisoners.recruitJoinButton')}
              </button>
            )}
            <button type="button" className="btn--pack-pill-sm" onClick={ignorerRecrue}>
              {t('postBataille.prisoners.recruitSkip')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
