import { Icon } from '../common/Icon';
import { XpGrid } from './XpGrid';
import type { AdvanceRecord, Member } from '../../types/roster';
import type { Profile } from '../../types/catalog';

type ExperienceCardProps = {
  type: Profile['type'];
  membre: Member;
  demiXp: boolean;
  enAttente: number;
  onChangeXp: (xp: number) => void;
  onOpenAvancee: () => void;
  onModifierAvancee: (record: AdvanceRecord) => void;
  gagneExperience?: boolean;
};

export function ExperienceCard({
  type,
  membre,
  demiXp,
  enAttente,
  onChangeXp,
  onOpenAvancee,
  onModifierAvancee,
  gagneExperience = true,
}: ExperienceCardProps) {
  if (type === 'animal' || !gagneExperience) {
    return (
      <div className="card">
        <h3 className="mt-0">
          <Icon name="etoile" style={{ marginRight: '0.35em' }} />
          Expérience
        </h3>
        <p className="text-muted text-sm mb-0">Ce profil ne gagne jamais d'expérience.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h3 className="mt-0 mb-0">
          <Icon name="etoile" style={{ marginRight: '0.35em' }} />
          Expérience
        </h3>
        <span className="badge badge--info">{membre.xp} XP</span>
      </div>
      <XpGrid type={type} xp={membre.xp} xpDepart={membre.xp_depart} onChange={onChangeXp} demiXp={demiXp} />
      <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
        XP de départ : {membre.xp_depart} (n'a déclenché aucune avancée).
      </p>
      {enAttente > 0 && (
        <div className="flex justify-between items-center" style={{ marginTop: '0.7rem' }}>
          <span className="badge badge--warning">{enAttente} avancée(s) en attente</span>
          <button className="btn btn--sm btn--primary" onClick={onOpenAvancee}>
            Résoudre une avancée
          </button>
        </div>
      )}
      {membre.historique_avancees.length > 0 && (
        <div style={{ marginTop: '0.7rem' }}>
          <p className="text-sm text-muted mb-0">Historique des avancées :</p>
          {membre.historique_avancees.map((a) => (
            <p key={a.id} className="text-sm mb-0">
              {a.date} (jet {a.roll}) — {a.detail}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0 0 0 0.3rem', color: 'var(--text-muted)' }}
                onClick={() => onModifierAvancee(a)}
                title="Modifier cette avancée"
              >
                <Icon name="crayon" size="0.85em" />
              </button>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
