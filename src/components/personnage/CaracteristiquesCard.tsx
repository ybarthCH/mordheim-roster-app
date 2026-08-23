import { useEffect, useState } from 'react';
import { STAT_KEYS } from '../../types/catalog';
import type { Profile, Stats } from '../../types/catalog';
import type { Member } from '../../types/roster';
import type { GameRules } from '../../types/rules';
import { plafondPour, estStatAuPlafond, bonusPlafondCC } from '../../utils/plafond';
import { sauvegardeArmureMembre } from '../../utils/armure';
import { useLanguage } from '../../state/useLanguage';
import { libelleCaracteristique } from '../../utils/stats';
import { Icon } from '../common/Icon';

type CaracteristiquesCardProps = {
  membre: Member;
  profil: Profile;
  onEditerStat: (k: keyof Stats, value: number) => void;
  rules: GameRules;
};

function saisiesDepuis(stats: Stats): Record<string, string> {
  return Object.fromEntries(STAT_KEYS.map((k) => [k, String(stats[k])]));
}

export function CaracteristiquesCard({ membre, profil, onEditerStat, rules }: CaracteristiquesCardProps) {
  const { t, language } = useLanguage();
  const plafond = plafondPour(profil, membre.competences_acquises, bonusPlafondCC(membre));
  // Sv : sauvegarde d'armure totale, dérivée de l'équipement — voir
  // utils/armure.ts. N'apparaît qu'en présence d'un objet qui l'accorde
  // réellement (jamais les sauvegardes spéciales/ward).
  const sv = sauvegardeArmureMembre(membre.inventaire, rules.armuresLozheim);

  // Saisie locale par caractéristique : un input contrôlé directement par
  // membre.stats_actuels[k] (un number) empêche de vider le champ pour
  // retaper une valeur — le premier caractère effacé/invalide fait
  // retomber le champ à 0 avant que le chiffre suivant soit tapé. Voir le
  // même motif pour nomSaisi/tresorerieSaisie ailleurs dans l'appli.
  // Resynchronisé au changement de personnage ou de stats_actuels (avancée,
  // blessure grave, achat d'équipement à delta permanent...).
  const [saisies, setSaisies] = useState(() => saisiesDepuis(membre.stats_actuels));
  useEffect(() => {
    setSaisies(saisiesDepuis(membre.stats_actuels));
  }, [membre.instance_id, membre.stats_actuels]);
  return (
    <div className="card">
      <h3>
        <Icon name="bouclier" style={{ marginRight: '0.35em' }} />
        {t('caracteristiques.title')}
      </h3>
      <div className="stat-grid" style={sv !== null ? { gridTemplateColumns: `repeat(${STAT_KEYS.length + 1}, 1fr)` } : undefined}>
        {STAT_KEYS.map((k) => (
          <div key={k} className="stat-grid__cell stat-grid__cell--label">
            {libelleCaracteristique(k, language)}
          </div>
        ))}
        {sv !== null && <div className="stat-grid__cell stat-grid__cell--label">Sv</div>}
        {STAT_KEYS.map((k) => {
          const variable = membre.stats_variables?.[k];
          if (variable) {
            return (
              <div
                key={k}
                className="stat-grid__cell stat-grid__cell--value"
                title={t('caracteristiques.variableTitle')}
              >
                <span className="stat-grid__input stat-grid__input--variable">{variable}</span>
              </div>
            );
          }
          const auPlafond = estStatAuPlafond(
            profil,
            membre.stats_actuels,
            k,
            membre.competences_acquises,
            bonusPlafondCC(membre)
          );
          return (
            <div
              key={k}
              className={`stat-grid__cell stat-grid__cell--value ${
                membre.stats_modifiees.includes(k) ? 'stat-grid__cell--modified' : ''
              }`}
              title={auPlafond ? t('caracteristiques.capTitle') : undefined}
            >
              <input
                type="number"
                className={`stat-grid__input ${auPlafond ? 'stat-grid__input--plafond' : ''}`}
                value={saisies[k] ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  setSaisies((prev) => ({ ...prev, [k]: raw }));
                  const n = Number(raw);
                  if (raw.trim() !== '' && raw.trim() !== '-' && Number.isFinite(n)) onEditerStat(k, n);
                }}
                onBlur={() => setSaisies((prev) => ({ ...prev, [k]: String(membre.stats_actuels[k]) }))}
              />
            </div>
          );
        })}
        {sv !== null && (
          <div className="stat-grid__cell stat-grid__cell--value" title={t('caracteristiques.svTitle')}>
            {sv}+
          </div>
        )}
      </div>
      {plafond && (
        <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          {t('caracteristiques.capLabel')} ({plafond.label}) :{' '}
          {STAT_KEYS.map((k) => `${libelleCaracteristique(k, language)} ${plafond[k]}`).join(' · ')}
          {plafond.note && <> — {plafond.note}</>}
        </p>
      )}
      {profil.type === 'homme_de_main' && (
        <p className="text-sm text-muted" style={{ marginTop: '0.3rem', marginBottom: 0 }}>
          {t('caracteristiques.henchmanCapNote')}
        </p>
      )}
    </div>
  );
}
