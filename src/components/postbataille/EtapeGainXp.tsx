import { Fragment } from 'react';
import { HENCHMAN_XP_MAX, HERO_XP_MAX, avancesDues, avancesObtenues, isPalierHenchman, isPalierHero, peutGagnerExperience } from '../../utils/xp';
import { grilleXpDuProfil, nomAffiche, resolveProfil } from '../../utils/profil';
import { estLeaderActuel } from '../../utils/leader';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import type { XpDraft, SlotDraft } from './PostBatailleScreen';
import { useLanguage } from '../../state/useLanguage';

// Mini grille XP utilisée dans l'assistant post-bataille : distingue l'XP de
// départ (ne comptait pas), l'XP déjà acquise avant cette bataille, et l'XP
// ajoutée pendant cette session (couleur dédiée), qu'elle vienne d'un clic
// manuel ou de la case "A survécu". Le bonus de chef de bande (victoire) est
// affiché à part, en case non cliquable, dans une 3e couleur dédiée.
function XpBarCompacte({
  type,
  xpDepart,
  xpInitial,
  xpActuel,
  onChange,
  bonusLeader,
  demiXp = false,
}: {
  type: 'heros' | 'homme_de_main';
  xpDepart: number;
  xpInitial: number;
  xpActuel: number;
  onChange: (xp: number) => void;
  bonusLeader?: boolean;
  demiXp?: boolean;
}) {
  const { t } = useLanguage();
  const max = type === 'heros' ? HERO_XP_MAX : HENCHMAN_XP_MAX;
  const isPalier = type === 'heros' ? isPalierHero : isPalierHenchman;
  const boxes = Array.from({ length: max }, (_, i) => i + 1);
  const toggle = (box: number) => {
    if (!demiXp) {
      onChange(xpActuel === box ? box - 1 : box);
      return;
    }
    const plein = box * 2;
    const moitie = box * 2 - 1;
    if (xpActuel >= plein) onChange(plein - 2);
    else if (xpActuel >= moitie) onChange(plein);
    else onChange(moitie);
  };
  // Bonus chef de bande : plutôt qu'ajoutée en toute fin de grille (après la
  // case 90, hors de vue de la progression réelle), la case "V" s'insère
  // juste après la dernière case déjà remplie — là où l'XP actuel de ce
  // guerrier s'arrête vraiment.
  const boiteBonusLeader = (
    <span
      key="bonus-leader"
      className="xp-box xp-box--compact xp-box--leader"
      title={t('gainXp.leaderBonusTitle')}
    >
      V
    </span>
  );

  return (
    <div className="xp-grid">
      {bonusLeader && xpActuel <= 0 && boiteBonusLeader}
      {boxes.map((box) => {
        const seuilPlein = demiXp ? box * 2 : box;
        const seuilMoitie = demiXp ? box * 2 - 1 : box;
        const estPleine = xpActuel >= seuilPlein;
        const estMoitie = !estPleine && demiXp && xpActuel >= seuilMoitie;
        const estDepart = xpDepart >= seuilPlein;
        const estSession = xpInitial < seuilPlein && xpActuel >= seuilPlein;
        return (
          <Fragment key={box}>
            <button
              type="button"
              className={`xp-box xp-box--compact ${isPalier(box) ? 'xp-box--palier' : ''} ${
                estPleine ? 'xp-box--checked' : ''
              } ${estMoitie ? 'xp-box--demi' : ''} ${estDepart ? 'xp-box--depart' : ''} ${
                estSession ? 'xp-box--session' : ''
              }`}
              onClick={() => toggle(box)}
              aria-label={t('gainXp.xpBoxLabel', { n: box })}
            >
              {isPalier(box) ? box : ''}
            </button>
            {bonusLeader && box === xpActuel && boiteBonusLeader}
          </Fragment>
        );
      })}
    </div>
  );
}

type EtapeGainXpProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  resultat: BattleRecord['resultat'];
  demiXp: boolean;
  horsDeCombatIndividuel: Member[];
  groupesHC: Member[];
  participantsAuto: Member[];
  xpDraftDe: (m: Member, xpParDefaut: number) => XpDraft;
  changerXp: (m: Member, xp: number, xpParDefaut: number) => void;
  slotsDe: (m: Member) => SlotDraft[];
  onOuvrirAvancee: (m: Member) => void;
  avancesResolues: { nom: string; detail: string }[];
};

// Affiche le badge "X avancée(s) en attente" + le bouton de résolution pour
// un membre donné, exactement comme sur sa fiche personnage (ExperienceCard)
// — permet de résoudre une avancée sans quitter l'assistant post-bataille.
// `xpActuel` reçoit l'XP en cours d'ajustement dans cette étape (brouillon,
// pas encore enregistrée) plutôt que membre.xp figé : la case s'affiche dès
// qu'un palier est franchi en bougeant la barre, sans attendre la validation
// finale de l'assistant.
function BlocAvanceeDue({
  roster,
  catalogue,
  membre,
  xpActuel,
  demiXp,
  onOuvrirAvancee,
}: {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  membre: Member;
  xpActuel: number;
  demiXp: boolean;
  onOuvrirAvancee: (m: Member) => void;
}) {
  const { t, language } = useLanguage();
  const profil = resolveProfil(roster, membre, catalogue, language);
  if (!profil || !peutGagnerExperience(profil)) return null;
  const dues = avancesDues(grilleXpDuProfil(profil), membre.xp_depart, xpActuel, demiXp);
  const enAttente = Math.max(0, dues - avancesObtenues(membre.historique_avancees));
  if (enAttente === 0) return null;
  return (
    <div className="flex items-center gap-sm" style={{ marginTop: '0.5rem' }}>
      <span className="badge badge--warning">{enAttente} {t('experience.pendingAdvances')}</span>
      <button type="button" className="btn btn--sm" onClick={() => onOuvrirAvancee(membre)}>
        {t('experience.resolveAdvance')}
      </button>
    </div>
  );
}

export function EtapeGainXp({
  roster,
  catalogue,
  resultat,
  demiXp,
  horsDeCombatIndividuel,
  groupesHC,
  participantsAuto,
  xpDraftDe,
  changerXp,
  slotsDe,
  onOuvrirAvancee,
  avancesResolues,
}: EtapeGainXpProps) {
  const { t, language } = useLanguage();
  const membres = [...horsDeCombatIndividuel, ...participantsAuto];
  return (
    <>
      <div className="card">
        <h3>{t('gainXp.title')}</h3>
        <p className="text-sm text-muted">{t('gainXp.intro')}</p>
        {membres.length === 0 && groupesHC.length === 0 && <p className="text-muted">{t('gainXp.noMembers')}</p>}
        {membres.map((m) => {
          const profil = resolveProfil(roster, m, catalogue, language);
          const sansXp = !peutGagnerExperience(profil);
          const estHorsDeCombat = m.statut === 'hors_de_combat';
          // Le sort de chaque Hors de combat (héros via la table des
          // blessures graves, homme de main/franc-tireur seul via le jet 1D6)
          // est déjà résolu à l'étape précédente (voir EtapeBlessuresGraves) :
          // cette étape se contente d'en refléter le résultat.
          const d = xpDraftDe(m, estHorsDeCombat ? m.xp : m.xp + 1);
          const estMort = estHorsDeCombat && d.survecu === 'non';
          const estLeader = estLeaderActuel(roster, catalogue, m);
          const bonusLeader = estLeader && resultat === 'victoire' && d.survecu !== 'non';
          return (
            <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                <strong>
                  {nomAffiche(m)}
                  {estLeader && (
                    <span className="badge badge--info" style={{ marginLeft: '0.4rem' }}>
                      ★ {t('gainXp.leaderBadge')}
                    </span>
                  )}
                </strong>
                <span className="text-sm text-muted">
                  {estMort
                    ? t('gainXp.statusDeadInjury')
                    : estHorsDeCombat
                      ? t('gainXp.statusOoaSurvived')
                      : m.statut === 'blesse'
                        ? t('gainXp.statusInjured')
                        : t('gainXp.statusActive')}
                </span>
              </div>
              {estMort ? (
                <p className="text-sm text-muted mb-0">{t('gainXp.didNotSurvive')}</p>
              ) : sansXp ? (
                <p className="text-sm text-muted mb-0">{t('gainXp.neverGainsXp')}</p>
              ) : (
                <XpBarCompacte
                  type={profil ? grilleXpDuProfil(profil) : 'homme_de_main'}
                  xpDepart={m.xp_depart}
                  xpInitial={m.xp}
                  xpActuel={d.xp}
                  onChange={(xp) => changerXp(m, xp, estHorsDeCombat ? m.xp : m.xp + 1)}
                  bonusLeader={bonusLeader}
                  demiXp={demiXp}
                />
              )}
              {!estMort && (
                <BlocAvanceeDue roster={roster} catalogue={catalogue} membre={m} xpActuel={d.xp} demiXp={demiXp} onOuvrirAvancee={onOuvrirAvancee} />
              )}
            </div>
          );
        })}
        {groupesHC.map((m) => {
          const sansXp = !peutGagnerExperience(resolveProfil(roster, m, catalogue, language));
          const slots = slotsDe(m);
          const morts = slots.filter((s) => s === 'non').length;
          const survivants = m.taille_groupe - morts;
          return (
            <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                <strong>{nomAffiche(m)}</strong>
                <span className="text-sm text-muted">
                  {t('gainXp.outOfActionCount', { hc: m.hors_combat, total: m.taille_groupe })}
                </span>
              </div>
              <p className="text-sm text-muted mb-0">
                {survivants > 0
                  ? t('gainXp.resolvedKeeps', {
                      n: survivants,
                      xp: sansXp ? t('gainXp.resolvedKeepsNoXpSuffix') : t('gainXp.resolvedKeepsXpSuffix'),
                    })
                  : t('gainXp.resolvedWiped')}
              </p>
              {survivants > 0 && (
                <BlocAvanceeDue roster={roster} catalogue={catalogue} membre={m} xpActuel={m.xp} demiXp={demiXp} onOuvrirAvancee={onOuvrirAvancee} />
              )}
            </div>
          );
        })}
      </div>

      {avancesResolues.length > 0 && (
        <div className="card card--tight">
          <h3>{t('gainXp.advancesResolvedTitle')}</h3>
          {avancesResolues.map((a, i) => (
            <p key={i} className="text-sm mb-0">
              {a.nom} — {a.detail}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
