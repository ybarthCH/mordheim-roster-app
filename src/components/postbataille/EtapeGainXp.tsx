import { HENCHMAN_XP_MAX, HERO_XP_MAX, avancesDues, isPalierHenchman, isPalierHero } from '../../utils/xp';
import { resolveProfil } from '../../utils/profil';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import type { XpDraft, SlotDraft } from './PostBatailleScreen';

function nomAffiche(m: Member) {
  return `${m.nom_perso}${m.taille_groupe > 1 ? ` × ${m.taille_groupe}` : ''}`;
}

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
  return (
    <div className="xp-grid">
      {boxes.map((box) => {
        const seuilPlein = demiXp ? box * 2 : box;
        const seuilMoitie = demiXp ? box * 2 - 1 : box;
        const estPleine = xpActuel >= seuilPlein;
        const estMoitie = !estPleine && demiXp && xpActuel >= seuilMoitie;
        const estDepart = xpDepart >= seuilPlein;
        const estSession = xpInitial < seuilPlein && xpActuel >= seuilPlein;
        return (
          <button
            key={box}
            type="button"
            className={`xp-box xp-box--compact ${isPalier(box) ? 'xp-box--palier' : ''} ${
              estPleine ? 'xp-box--checked' : ''
            } ${estMoitie ? 'xp-box--demi' : ''} ${estDepart ? 'xp-box--depart' : ''} ${
              estSession ? 'xp-box--session' : ''
            }`}
            onClick={() => toggle(box)}
            aria-label={`Case XP ${box}`}
          >
            {isPalier(box) ? box : ''}
          </button>
        );
      })}
      {bonusLeader && (
        <span
          className="xp-box xp-box--compact xp-box--leader"
          title="Bonus chef de bande : +1 XP automatique à la victoire"
        >
          +1
        </span>
      )}
    </div>
  );
}

type EtapeGainXpProps = {
  roster: RosterInstance;
  resultat: BattleRecord['resultat'];
  demiXp: boolean;
  horsDeCombatIndividuel: Member[];
  groupesHC: Member[];
  participantsAuto: Member[];
  xpDraftDe: (m: Member, xpParDefaut: number) => XpDraft;
  changerXp: (m: Member, xp: number, xpParDefaut: number) => void;
  definirSurvie: (m: Member, valeur: 'oui' | 'non') => void;
  slotsDe: (m: Member) => SlotDraft[];
  definirSlot: (m: Member, index: number, valeur: 'oui' | 'non') => void;
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
  membre,
  xpActuel,
  demiXp,
  onOuvrirAvancee,
}: {
  roster: RosterInstance;
  membre: Member;
  xpActuel: number;
  demiXp: boolean;
  onOuvrirAvancee: (m: Member) => void;
}) {
  const profil = resolveProfil(roster, membre);
  if (!profil || profil.type === 'animal') return null;
  const dues = avancesDues(profil.type, membre.xp_depart, xpActuel, demiXp);
  const enAttente = Math.max(0, dues - membre.historique_avancees.length);
  if (enAttente === 0) return null;
  return (
    <div className="flex items-center gap-sm" style={{ marginTop: '0.5rem' }}>
      <span className="badge badge--warning">{enAttente} avancée(s) en attente</span>
      <button type="button" className="btn btn--sm" onClick={() => onOuvrirAvancee(membre)}>
        Résoudre une avancée
      </button>
    </div>
  );
}

export function EtapeGainXp({
  roster,
  resultat,
  demiXp,
  horsDeCombatIndividuel,
  groupesHC,
  participantsAuto,
  xpDraftDe,
  changerXp,
  definirSurvie,
  slotsDe,
  definirSlot,
  onOuvrirAvancee,
  avancesResolues,
}: EtapeGainXpProps) {
  return (
    <>
      <div className="card">
        <h3>Hors de combat — à résoudre</h3>
        <p className="text-sm text-muted">
          Pour chaque héros ou homme de main seul Hors de combat, et pour chaque figurine d'un groupe partiellement
          Hors de combat, indique si elle a survécu ou non. Un survivant gagne 1 XP automatiquement (couleur
          dédiée). Un groupe ne perd son XP que s'il est entièrement éliminé.
        </p>
        {horsDeCombatIndividuel.length === 0 && groupesHC.length === 0 && (
          <p className="text-muted">Personne à résoudre — aucun Hors de combat en attente.</p>
        )}
        {horsDeCombatIndividuel.map((m) => {
          const profil = resolveProfil(roster, m);
          const estAnimal = profil?.type === 'animal';
          const d = xpDraftDe(m, m.xp);
          const bonusLeader = !!profil?.est_leader && resultat === 'victoire' && d.survecu !== 'non';
          return (
            <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                <strong>
                  {nomAffiche(m)}
                  {profil?.est_leader && (
                    <span className="badge badge--info" style={{ marginLeft: '0.4rem' }}>
                      ★ Leader
                    </span>
                  )}
                </strong>
                <span className="text-sm text-muted">Hors de combat</span>
              </div>
              {estAnimal ? (
                <p className="text-sm text-muted mb-0">Ne gagne jamais d'expérience.</p>
              ) : (
                <XpBarCompacte
                  type={profil?.type === 'heros' ? 'heros' : 'homme_de_main'}
                  xpDepart={m.xp_depart}
                  xpInitial={m.xp}
                  xpActuel={d.xp}
                  onChange={(xp) => changerXp(m, xp, m.xp)}
                  bonusLeader={bonusLeader}
                  demiXp={demiXp}
                />
              )}
              <div className="status-select" style={{ marginTop: '0.5rem' }}>
                <button
                  className={`status-pill ${d.survecu === 'oui' ? 'status-pill--active' : ''}`}
                  onClick={() => definirSurvie(m, 'oui')}
                >
                  A survécu{estAnimal ? '' : ' (+1 XP)'}
                </button>
                <button
                  className={`status-pill ${d.survecu === 'non' ? 'status-pill--active' : ''}`}
                  onClick={() => definirSurvie(m, 'non')}
                >
                  N'a pas survécu
                </button>
              </div>
              <BlocAvanceeDue roster={roster} membre={m} xpActuel={d.xp} demiXp={demiXp} onOuvrirAvancee={onOuvrirAvancee} />
            </div>
          );
        })}
        {groupesHC.map((m) => {
          const estAnimal = resolveProfil(roster, m)?.type === 'animal';
          const slots = slotsDe(m);
          const morts = slots.filter((s) => s === 'non').length;
          const enAttente = slots.filter((s) => s === null).length;
          const survivants = m.taille_groupe - morts;
          return (
            <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                <strong>{nomAffiche(m)}</strong>
                <span className="text-sm text-muted">
                  {m.hors_combat} / {m.taille_groupe} hors de combat
                </span>
              </div>
              <div className="flex flex-wrap gap-sm">
                {slots.map((s, i) => (
                  <div key={i} className="flex items-center gap-sm">
                    <span className="text-sm text-muted">#{i + 1}</span>
                    <button className={`btn btn--sm ${s === 'oui' ? 'btn--primary' : ''}`} onClick={() => definirSlot(m, i, 'oui')}>
                      Survécu
                    </button>
                    <button className={`btn btn--sm ${s === 'non' ? 'btn--danger' : ''}`} onClick={() => definirSlot(m, i, 'non')}>
                      Mort
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                {enAttente > 0
                  ? `${enAttente} figurine(s) à résoudre.`
                  : survivants > 0
                    ? `Résolu — le groupe garde ${survivants} figurine(s)${estAnimal ? '.' : ' et gagne +1 XP.'}`
                    : "Résolu — le groupe est entièrement éliminé (passera au statut Mort)."}
              </p>
              <BlocAvanceeDue roster={roster} membre={m} xpActuel={m.xp} demiXp={demiXp} onOuvrirAvancee={onOuvrirAvancee} />
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3>Reste du roster</h3>
        <p className="text-sm text-muted">
          Chaque participant qui n'était pas Hors de combat gagne 1 XP automatiquement (couleur dédiée ci-dessous).
          Ajuste la barre si besoin.
        </p>
        {participantsAuto.length === 0 && <p className="text-muted">Aucun autre membre dans la bande.</p>}
        {participantsAuto.map((m) => {
          const profil = resolveProfil(roster, m);
          const d = xpDraftDe(m, m.xp + 1);
          const bonusLeader = !!profil?.est_leader && resultat === 'victoire';
          return (
            <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                <strong>
                  {nomAffiche(m)}
                  {profil?.est_leader && (
                    <span className="badge badge--info" style={{ marginLeft: '0.4rem' }}>
                      ★ Leader
                    </span>
                  )}
                </strong>
                <span className="text-sm text-muted">{m.statut === 'blesse' ? 'Blessé' : 'Actif'}</span>
              </div>
              <XpBarCompacte
                type={profil?.type === 'heros' ? 'heros' : 'homme_de_main'}
                xpDepart={m.xp_depart}
                xpInitial={m.xp}
                xpActuel={d.xp}
                onChange={(xp) => changerXp(m, xp, m.xp + 1)}
                bonusLeader={bonusLeader}
                demiXp={demiXp}
              />
              <BlocAvanceeDue roster={roster} membre={m} xpActuel={d.xp} demiXp={demiXp} onOuvrirAvancee={onOuvrirAvancee} />
            </div>
          );
        })}
      </div>

      {avancesResolues.length > 0 && (
        <div className="card card--tight">
          <h3>Avancées résolues pendant cette bataille</h3>
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
