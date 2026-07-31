import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveProfil } from '../../utils/profil';
import { creerMembre } from '../../utils/factory';
import { JetOrButton } from './JetOrButton';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterOr: (montant: number) => void;
  onAjouterAuJournal: (texte: string) => void;
};

type Branche = 'possedes' | 'morts_vivants' | 'skaven' | 'autres';

// (3 3 3) Prisonniers — l'action possible dépend de la nature de la bande.
export function ResolutionPrisonniers({ roster, catalogue, onMajRoster, onAjouterOr, onAjouterAuJournal }: Props) {
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
    onAjouterAuJournal(`Prisonniers : sacrifiés aux dieux du Chaos — ${hero.nom_perso} gagne +${valeur} XP (D3, réparti à ta discrétion).`);
    setResolu(`Sacrifiés — ${hero.nom_perso} gagne +${valeur} XP.`);
  };

  const appliquerZombies = () => {
    const valeur = Math.trunc(Number(jetZombies));
    if (!zombieProfil || !Number.isFinite(valeur) || valeur <= 0) return;
    const zombies = Array.from({ length: valeur }, () => creerMembre(zombieProfil, 0));
    onMajRoster({ membres: [...roster.membres, ...zombies] });
    onAjouterAuJournal(`Prisonniers : tués et transformés — ${valeur} zombie(s) (D3) rejoignent la bande gratuitement.`);
    setResolu(`Tués et transformés — ${valeur} zombie(s) rejoignent la bande.`);
  };

  const vendus = (valeur: number) => {
    onAjouterOr(valeur);
    onAjouterAuJournal(`Prisonniers : vendus comme esclaves — +${valeur} po (3D6).`);
    setResolu(`Vendus comme esclaves — +${valeur} po.`);
  };

  const escortes = (valeur: number) => {
    onAjouterOr(valeur);
    onAjouterAuJournal(
      `Prisonniers : escortés hors de la cité — +${valeur} po (2D6). Un captif peut rejoindre un groupe d'hommes de main humain existant si tu as le matériel pour l'équiper (à faire manuellement).`
    );
    setResolu(`Escortés hors de la cité — +${valeur} po.`);
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        ✓ Prisonniers : {resolu}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn btn--sm ${branche === 'possedes' ? 'btn--primary' : ''}`}
          disabled={catalogue.id !== 'cult_of_the_possessed'}
          title={catalogue.id !== 'cult_of_the_possessed' ? 'Réservé aux Possédés' : undefined}
          onClick={() => setBranche('possedes')}
        >
          Sacrifier — D3 XP
        </button>
        <button
          type="button"
          className={`btn btn--sm ${branche === 'morts_vivants' ? 'btn--primary' : ''}`}
          disabled={!estMortsVivants || !zombieProfil}
          title={!estMortsVivants ? 'Réservé aux Morts-vivants' : undefined}
          onClick={() => setBranche('morts_vivants')}
        >
          Tuer — D3 zombies gratuits
        </button>
        <button
          type="button"
          className={`btn btn--sm ${branche === 'skaven' ? 'btn--primary' : ''}`}
          disabled={catalogue.id !== 'skaven'}
          title={catalogue.id !== 'skaven' ? 'Réservé aux Skavens' : undefined}
          onClick={() => setBranche('skaven')}
        >
          Vendre pour 3D6 CO
        </button>
        <button
          type="button"
          className={`btn btn--sm ${branche === 'autres' ? 'btn--primary' : ''}`}
          disabled={['cult_of_the_possessed', 'skaven', 'undead', 'morts_sans_repos'].includes(catalogue.id)}
          title={
            ['cult_of_the_possessed', 'skaven', 'undead', 'morts_sans_repos'].includes(catalogue.id)
              ? 'Cette bande a une meilleure option ci-dessus'
              : undefined
          }
          onClick={() => setBranche('autres')}
        >
          Escorter — 2D6 CO + recrue
        </button>
      </div>

      {branche === 'possedes' && (
        <div style={{ marginTop: '0.5rem' }}>
          <div className="field">
            <label>Héros bénéficiaire de l'XP</label>
            <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
              <option value="">— Choisir —</option>
              {heros.map((m) => (
                <option key={m.instance_id} value={m.instance_id}>
                  {m.nom_perso}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
            <span className="text-sm text-muted">Jet obtenu (D3) :</span>
            <input type="number" min={0} style={{ width: '5rem' }} value={jetXp} onChange={(e) => setJetXp(e.target.value)} />
            <button type="button" className="btn btn--sm btn--primary" disabled={!heroId || !jetXp} onClick={appliquerXp}>
              Ajouter l'XP
            </button>
          </div>
        </div>
      )}

      {branche === 'morts_vivants' && (
        <div className="flex gap-sm items-center" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <span className="text-sm text-muted">Jet obtenu (D3) :</span>
          <input
            type="number"
            min={0}
            style={{ width: '5rem' }}
            value={jetZombies}
            onChange={(e) => setJetZombies(e.target.value)}
          />
          <button type="button" className="btn btn--sm btn--primary" disabled={!jetZombies} onClick={appliquerZombies}>
            Ajouter les zombies
          </button>
        </div>
      )}

      {branche === 'skaven' && <JetOrButton label="Jet obtenu (3D6) :" onValider={vendus} boutonLabel="Vendre — ajouter à la trésorerie" />}

      {branche === 'autres' && (
        <JetOrButton label="Jet obtenu (2D6) :" onValider={escortes} boutonLabel="Ajouter à la trésorerie" />
      )}
    </div>
  );
}
