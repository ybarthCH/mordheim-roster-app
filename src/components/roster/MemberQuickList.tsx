import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { Icon } from '../common/Icon';
import type { IconName, PackIconName } from '../common/Icon';
import { grilleXpDuProfil, nomAffiche, resolveProfil } from '../../utils/profil';
import { avancesDues, avancesObtenues, peutGagnerExperience } from '../../utils/xp';
import { estLeaderActuel } from '../../utils/leader';
import type { Member, RosterInstance } from '../../types/roster';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { STAT_KEYS } from '../../types/catalog';
import { getFrancTireur } from '../../data/hiredSwords';
import { useLanguage } from '../../state/useLanguage';
import { libelleCaracteristique } from '../../utils/stats';

type MemberQuickListProps = {
  titre: string;
  icone: IconName | PackIconName;
  preferenceKey: string;
  membres: Member[];
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  onSupprimer: (m: Member) => void;
  selectedInstanceId?: string;
};

// Liste fusionnée Héros + Hommes de main, pensée pour un défilement rapide
// sur une bande nombreuse (~20 membres) plutôt que la consultation détaillée
// : chaque ligne se limite au nom, au profil et au bloc de stats — ni
// équipement, ni contrôle de statut, ni poignée de glisser-déposer (voir
// RosterScreen, bouton dédié) — seule la croix de suppression subsiste.
export function MemberQuickList({
  titre,
  icone,
  preferenceKey,
  membres,
  roster,
  catalogue,
  onSupprimer,
  selectedInstanceId,
}: MemberQuickListProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const estAvanceEnAttente = (profil: Profile | undefined, m: Member) => {
    if (!profil || !peutGagnerExperience(profil)) return false;
    if (getFrancTireur(m.franc_tireur_id)?.gagne_experience === false) return false;
    return (
      avancesDues(grilleXpDuProfil(profil), m.xp_depart, m.xp, !!catalogue?.xp_demi) >
      avancesObtenues(m.historique_avancees)
    );
  };

  const vues = useMemo(
    () =>
      membres.map((m) => ({
        m,
        profil: resolveProfil(roster, m, catalogue, language),
        leader: estLeaderActuel(roster, catalogue, m),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [membres, roster, catalogue, language]
  );

  return (
    <CollapsibleCard
      preferenceKey={preferenceKey}
      className="card card--tight roster-groupe-card"
      title={
        <>
          <Icon name={icone} style={{ marginRight: '0.35em' }} />
          {titre}
        </>
      }
    >
      <div className="member-condensed">
        {vues.map(({ m, profil, leader }) => {
          const avanceEnAttente = estAvanceEnAttente(profil, m);
          const statsTexte = STAT_KEYS.map(
            (k) => `${libelleCaracteristique(k, language)}${m.stats_variables?.[k] ?? m.stats_actuels[k]}`
          ).join(' ');
          return (
            <div
              key={m.instance_id}
              className={`list-item${m.instance_id === selectedInstanceId ? ' list-item--selectionne' : ''}`}
              role="button"
              onClick={() => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`)}
            >
              <div className="list-item__title">
                <span className="list-item__title-name" title={nomAffiche(m)}>
                  {nomAffiche(m)}
                </span>
                {leader && (
                  <span className="badge badge--leader" title={t('memberGroup.leaderTitle')}>
                    {t('memberGroup.leader')}
                  </span>
                )}
                {avanceEnAttente && (
                  <span className="badge badge--pending" title={t('memberGroup.pendingAdvance')}>
                    {t('memberGroup.pendingAdvance')}
                  </span>
                )}
                <span className="list-item__title-actions">
                  <button
                    className="btn--ghost-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSupprimer(m);
                    }}
                    title={t('memberGroup.removeTitle')}
                  >
                    <Icon name="croixPack" />
                  </button>
                </span>
              </div>
              <div className="member-condensed__ligne member-condensed__ligne--stats">
                {profil?.nom ? `${profil.nom} · ` : ''}XP {m.xp} · {statsTexte}
              </div>
            </div>
          );
        })}
      </div>

      {membres.length === 0 && <p className="text-muted">{t('memberGroup.noMembers')}</p>}
    </CollapsibleCard>
  );
}
