import { Fragment, useMemo } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { Icon } from '../common/Icon';
import type { IconName, PackIconName } from '../common/Icon';
import { grilleXpDuProfil, nomAffiche, resolveProfil } from '../../utils/profil';
import type { Profile } from '../../types/catalog';
import { avancesDues, avancesObtenues, peutGagnerExperience } from '../../utils/xp';
import { nomCourtBlessureAffiche } from '../../utils/blessures';
import { inventaireGroupeMismatch, resumeInventaireParItem } from '../../utils/shop';
import { useDragReorder } from '../../utils/useDragReorder';
import { estLeaderActuel } from '../../utils/leader';
import type { Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { STAT_KEYS } from '../../types/catalog';
import { getFrancTireur } from '../../data/hiredSwords';
import { useLanguage } from '../../state/useLanguage';
import type { Language } from '../../state/useLanguage';
import { getItem } from '../../data/items';
import { translateItem } from '../../i18n/data/items';
import { libelleCaracteristique, pvAffiche, pvEstCliquable } from '../../utils/stats';
import { sauvegardeArmureMembre } from '../../utils/armure';
import type { GameRules } from '../../types/rules';

// Couleur du sceau de statut (voir .status-switch) : reprend les mêmes
// teintes sémantiques que les .badge--* du reste de l'appli.
const STATUT_COULEUR: Record<string, string> = {
  actif: 'success',
  hors_de_combat: 'warning',
  mort: 'danger',
  blesse: 'neutral',
};

const STATUT_ICONE: Partial<Record<string, IconName | PackIconName>> = {
  actif: 'cochePack',
  hors_de_combat: 'ossements',
  mort: 'crane',
  blesse: 'goutte',
};

type StatutControlProps = {
  m: Member;
  groupeSimplifie: boolean;
  titre: string;
  onToggle: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

// Contrôle de statut (switch groupe simplifié / plaque héros / badge figé
// pour un mort) — partagé entre le tableau desktop et la ligne compacte
// téléphone (voir MemberRowCompact), pour ne pas dupliquer une deuxième
// fois ce même bloc.
function StatutControl({ m, groupeSimplifie, titre, onToggle, t }: StatutControlProps) {
  if (groupeSimplifie) {
    return (
      <button
        type="button"
        className={`status-switch status-switch--${m.hors_combat > 0 ? 'warning' : 'success'}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title={titre}
        aria-label={titre}
      >
        <Icon name={m.hors_combat > 0 ? 'ossements' : 'coche'} />
        <span className="status-switch__label">
          {m.hors_combat}/{m.taille_groupe} {t('memberGroup.hc')}
        </span>
      </button>
    );
  }
  if (m.statut === 'mort') {
    return (
      <span
        className={`status-switch status-switch--${STATUT_COULEUR[m.statut]} status-switch--badge`}
        title={t('memberGroup.deadStatusHint')}
      >
        {STATUT_ICONE[m.statut] && <Icon name={STATUT_ICONE[m.statut]!} />}
        <span className="status-switch__label status-switch__label--fixed">{t(`statut.${m.statut}`)}</span>
      </span>
    );
  }
  return (
    <button
      type="button"
      className={`status-plaque${m.statut === 'actif' ? ' status-plaque--actif' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      title={titre}
      aria-label={`${t(`statut.${m.statut}`)} — ${titre}`}
    >
      <span className="status-plaque__switch">
        <span className="status-plaque__switch-track" />
        <span className="status-plaque__switch-knob">
          <span className="status-plaque__switch-knob-gem status-plaque__switch-knob-gem--green" />
          <span className="status-plaque__switch-knob-gem status-plaque__switch-knob-gem--red" />
        </span>
      </span>
      <span className="status-plaque__label">{t(`memberGroup.statutCourt.${m.statut}`)}</span>
    </button>
  );
}

type MemberRowCompactProps = {
  m: Member;
  profil: Profile | undefined;
  equipement: string;
  blessures: string | null;
  groupeSimplifie: boolean;
  leader: boolean;
  avanceEnAttente: boolean;
  sv: number | null;
  pvCliquable: boolean;
  fantome: boolean;
  selectionne: boolean;
  masquerProfil?: boolean;
  language: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  rowRef: (el: HTMLDivElement | null) => void;
  onSelect: () => void;
  onSupprimer: () => void;
  onBasculerHorsCombat: () => void;
  onBasculerPointsDeVie: () => void;
  onDragPointerDown: (e: ReactPointerEvent) => void;
  titreHorsCombatTexte: string;
  titrePointsDeVieTexte: string;
};

// Ligne compacte téléphone (3 lignes : nom/profil + statut/suppression,
// bloc de caractéristiques, équipement) — remplace le tableau desktop en
// dessous du seuil où il tiendrait sans scroll horizontal (voir
// .roster-compact-list, .roster-table-wrap). Contrairement à l'ancienne
// grande carte par figurine (MemberCardMobile, supprimée), volontairement
// minimale : pas de mesure de repositionnement du badge Chef, pas de
// padding généreux — l'objectif est une ligne courte, pas une fiche.
function MemberRowCompact({
  m,
  profil,
  equipement,
  blessures,
  groupeSimplifie,
  leader,
  avanceEnAttente,
  sv,
  pvCliquable,
  fantome,
  selectionne,
  masquerProfil,
  language,
  t,
  rowRef,
  onSelect,
  onSupprimer,
  onBasculerHorsCombat,
  onBasculerPointsDeVie,
  onDragPointerDown,
  titreHorsCombatTexte,
  titrePointsDeVieTexte,
}: MemberRowCompactProps) {
  return (
    <div
      ref={rowRef}
      className={`roster-compact-row${fantome ? ' roster-compact-row--fantome' : ''}${selectionne ? ' roster-compact-row--selectionnee' : ''}`}
      role="button"
      onClick={onSelect}
    >
      <div className="roster-compact-row__ligne1">
        <span
          className="roster-compact-row__identite"
          onPointerDown={onDragPointerDown}
          title={t('memberGroup.dragHandle')}
        >
          <span className="roster-compact-row__nom">
            {nomAffiche(m)}
            {!masquerProfil && profil?.nom && (
              <span className="roster-compact-row__profil"> · {profil.nom}</span>
            )}
          </span>
          {leader && (
            <span className="badge badge--leader" title={t('memberGroup.leaderTitle')}>
              {t('memberGroup.leader')}
            </span>
          )}
        </span>
        <span className="roster-compact-row__actions">
          <StatutControl
            m={m}
            groupeSimplifie={groupeSimplifie}
            titre={titreHorsCombatTexte}
            onToggle={onBasculerHorsCombat}
            t={t}
          />
          <button
            className="btn--ghost-danger"
            onClick={(e) => {
              e.stopPropagation();
              onSupprimer();
            }}
            title={t('memberGroup.removeTitle')}
          >
            <Icon name="croixPack" />
          </button>
        </span>
      </div>
      <div
        className="stat-grid roster-compact-row__stats"
        style={sv !== null ? { gridTemplateColumns: `repeat(${STAT_KEYS.length + 1}, 1fr)` } : undefined}
      >
        {STAT_KEYS.map((k) => (
          <div key={`lbl-${k}`} className="stat-grid__cell stat-grid__cell--label">
            {libelleCaracteristique(k, language)}
          </div>
        ))}
        {sv !== null && <div className="stat-grid__cell stat-grid__cell--label">Sv</div>}
        {STAT_KEYS.map((k) => {
          if (k === 'PV' && pvCliquable) {
            return (
              <div
                key={`val-${k}`}
                className="stat-grid__cell stat-grid__cell--value stat-grid__cell--pv-cliquable"
                onClick={(e) => {
                  e.stopPropagation();
                  onBasculerPointsDeVie();
                }}
                title={titrePointsDeVieTexte}
              >
                {pvAffiche(m)}
              </div>
            );
          }
          return (
            <div key={`val-${k}`} className="stat-grid__cell stat-grid__cell--value">
              {k === 'PV' ? pvAffiche(m) : (m.stats_variables?.[k] ?? m.stats_actuels[k])}
            </div>
          );
        })}
        {sv !== null && <div className="stat-grid__cell stat-grid__cell--value">{sv}+</div>}
      </div>
      <div className="roster-compact-row__synopsis">
        <span className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
          {equipement}
        </span>
        {avanceEnAttente && (
          <span className="badge badge--pending" title={t('memberGroup.pendingAdvance')}>
            {t('memberGroup.pendingAdvance')}
          </span>
        )}
        {inventaireGroupeMismatch(m) && (
          <span className="badge badge--equipment-warning" title={t('memberGroup.equipmentMismatchTitle')}>
            ⚠ {t('memberGroup.equipmentMismatchBadge')}
          </span>
        )}
        {m.franc_tireur_impaye && <span className="badge badge--warning">{t('memberGroup.absentUnpaid')}</span>}
      </div>
      {blessures && (
        <div className="text-sm text-danger" style={{ marginTop: '0.1rem' }}>
          {blessures}
        </div>
      )}
    </div>
  );
}

type MemberGroupCardProps = {
  titre: string;
  icone: IconName | PackIconName;
  preferenceKey: string;
  membres: Member[];
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  rules: GameRules;
  onReordonner: (nouvelOrdre: Member[]) => void;
  onBasculerHorsCombat: (m: Member) => void;
  onBasculerPointsDeVie: (m: Member) => void;
  onSupprimer: (m: Member) => void;
  // Masque la colonne "Profil" : superflue quand le nom du membre est
  // toujours identique à celui de son profil (ex : Dramatis Personae, jamais
  // renommables).
  masquerProfil?: boolean;
  // Membre actuellement ouvert dans le volet détail (mode deux volets, grands
  // écrans) : surligne sa ligne dans la liste. Voir RosterScreen/RosterRoute.
  selectedInstanceId?: string;
  // Bascule vers la liste rapide "Bande complète" (RosterScreen) : bouton
  // affiché dans l'en-tête si fourni — les groupes qui ne participent pas à
  // la fusion (ex : Cimetière) n'ont pas ce bouton.
  onBasculerVueRapide?: () => void;
};

export function MemberGroupCard({
  titre,
  icone,
  preferenceKey,
  membres,
  roster,
  catalogue,
  rules,
  onReordonner,
  onBasculerHorsCombat,
  onBasculerPointsDeVie,
  onSupprimer,
  masquerProfil,
  selectedInstanceId,
  onBasculerVueRapide,
}: MemberGroupCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { elements, refItem, demarrerDragDiffere, dragVientDeSeProduire, idEnCours, pointerPos } =
    useDragReorder(membres, onReordonner);

  // Synopsis discret de l'équipement d'un membre (ou de son groupe, toujours
  // identique entre figurines) pour l'aperçu du roster global. Affiché sur
  // toute la largeur du tableau (voir la ligne dédiée sous chaque membre) :
  // la limite ici n'est qu'un filet de sécurité contre un inventaire
  // interminable, pas la contrainte principale.
  const resumeEquipement = (m: Member): string => {
    if (m.inventaire.length === 0) return m.equipement || t('memberGroup.noEquipment');
    // Groupe d'hommes de main dont l'équipement est bien réparti à parts
    // égales entre figurines (voir inventaireGroupeMismatch) : n'affiche le
    // paquetage que d'une seule figurine, suivi d'un "×taille_groupe" global,
    // plutôt que de lister chaque exemplaire séparément.
    if (m.taille_groupe > 1 && !inventaireGroupeMismatch(m)) {
      const parFigurine = resumeInventaireParItem(m.inventaire).map(({ entree, quantite }) => {
        const ref = getItem(entree.item_id);
        const nom = ref ? translateItem(ref, language).nom : entree.nom;
        const quantiteParFigurine = quantite / m.taille_groupe;
        return quantiteParFigurine > 1 ? `${nom} ×${quantiteParFigurine}` : nom;
      });
      const noms = `${parFigurine.join(', ')} ×${m.taille_groupe}`;
      return noms.length > 160 ? `${noms.slice(0, 160).trimEnd()}…` : noms;
    }
    const noms = m.inventaire
      .map((e) => {
        const ref = getItem(e.item_id);
        return ref ? translateItem(ref, language).nom : e.nom;
      })
      .join(', ');
    return noms.length > 160 ? `${noms.slice(0, 160).trimEnd()}…` : noms;
  };

  // Idem pour les blessures graves accumulées : juste les titres, pas les
  // descriptions complètes (disponibles sur la fiche personnage).
  const resumeBlessures = (m: Member): string | null => {
    if (m.blessures_graves.length === 0) return null;
    return `${t('memberGroup.injuries')} ${m.blessures_graves.map((b) => nomCourtBlessureAffiche(b, language)).join(' - ')}`;
  };

  const estAvanceEnAttente = (profil: Profile | undefined, m: Member) => {
    if (!profil || !peutGagnerExperience(profil)) return false;
    if (getFrancTireur(m.franc_tireur_id)?.gagne_experience === false) return false;
    return (
      avancesDues(grilleXpDuProfil(profil), m.xp_depart, m.xp, !!catalogue?.xp_demi) >
      avancesObtenues(m.historique_avancees)
    );
  };

  const titreHorsCombat = (m: Member, groupeSimplifie: boolean) =>
    groupeSimplifie
      ? t('memberGroup.hcMarkTitle', { hc: m.hors_combat, taille: m.taille_groupe })
      : t('memberGroup.hcToggleTitle');

  const titrePointsDeVie = (m: Member) => t('memberGroup.pvToggleTitle', { pv: pvAffiche(m) });

  // Calculs dérivés par membre (profil, équipement, statut...) partagés
  // entre le tableau desktop et les cartes mobiles ci-dessous : sans cette
  // mémoïsation, chacun des deux rendus (l'un masqué en CSS selon la
  // largeur d'écran, mais tous deux bel et bien montés) refaisait le même
  // travail indépendamment.
  const vues = useMemo(
    () =>
      elements.map((m) => {
        const profil = resolveProfil(roster, m, catalogue, language);
        // Un homme de main ou animal non promu n'utilise jamais le statut
        // « Hors de combat » (voir PersonnageScreen) : chaque clic marque
        // une figurine de plus via le compteur dédié, jusqu'à ce que tout
        // le groupe soit à terre. Seuls les héros (et hommes de main
        // promus) basculent le statut lui-même.
        const groupeSimplifie = (profil?.type === 'homme_de_main' || profil?.type === 'animal') && !m.promu_heros;
        return {
          m,
          profil,
          equipement: resumeEquipement(m),
          blessures: resumeBlessures(m),
          groupeSimplifie,
          leader: estLeaderActuel(roster, catalogue, m),
          avanceEnAttente: estAvanceEnAttente(profil, m),
          sv: sauvegardeArmureMembre(m.inventaire, rules.armuresLozheim),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elements, roster, catalogue, language, rules.armuresLozheim]
  );

  // Colonne Sv affichée pour tout le groupe dès qu'au moins un de ses
  // membres a une sauvegarde d'armure (voir utils/armure.ts) — même logique
  // "apparition dynamique" que CaracteristiquesCard/MemberCardMobile, mais
  // au niveau de la colonne entière plutôt que par membre : un tableau
  // partagé ne peut pas faire varier son nombre de colonnes ligne par
  // ligne. Les membres sans Sv affichent un tiret dans cette colonne.
  const groupeADuSv = vues.some(({ sv }) => sv !== null);

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
      actions={
        onBasculerVueRapide && (
          <button
            type="button"
            className="collapse-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBasculerVueRapide();
            }}
            title={t('roster.quickListOn')}
          >
            <Icon name="liste" size="1.1em" />
          </button>
        )
      }
    >
      <div className="roster-table-wrap">
        <table className="roster-table">
          <thead>
            <tr>
              <th className="roster-table__col-nom">{t('memberGroup.name')}</th>
              {!masquerProfil && <th className="roster-table__col-profil">{t('memberGroup.profile')}</th>}
              <th className="roster-table__stat roster-table__col-M roster-table__group-start">
                {libelleCaracteristique('M', language)}
              </th>
              <th className="roster-table__stat roster-table__stat--band roster-table__col-CC">
                {libelleCaracteristique('CC', language)}
              </th>
              <th className="roster-table__stat roster-table__col-CT">{libelleCaracteristique('CT', language)}</th>
              <th className="roster-table__stat roster-table__stat--band roster-table__col-F">
                {libelleCaracteristique('F', language)}
              </th>
              <th className="roster-table__stat roster-table__col-E">{libelleCaracteristique('E', language)}</th>
              <th className="roster-table__stat roster-table__stat--band roster-table__col-PV">
                {libelleCaracteristique('PV', language)}
              </th>
              <th className="roster-table__stat roster-table__col-I">{libelleCaracteristique('I', language)}</th>
              <th className="roster-table__stat roster-table__stat--band roster-table__col-A">
                {libelleCaracteristique('A', language)}
              </th>
              <th className="roster-table__stat roster-table__col-Cd">{libelleCaracteristique('Cd', language)}</th>
              {groupeADuSv && <th className="roster-table__stat roster-table__col-Sv">Sv</th>}
              <th className="roster-table__stat roster-table__group-start">XP</th>
              <th>{t('memberGroup.status')}</th>
              <th className="roster-table__col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {vues.map(({ m, profil, equipement, blessures, groupeSimplifie, leader, avanceEnAttente, sv }) => {
              const versPersonnage = () => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`);
              return (
                <Fragment key={m.instance_id}>
                  <tr
                    ref={refItem('table', m.instance_id)}
                    className={`roster-table__row-principale${idEnCours === m.instance_id ? ' roster-table__row--fantome' : ''}${m.instance_id === selectedInstanceId ? ' roster-table__row--selectionnee' : ''}`}
                    onClick={() => {
                      if (dragVientDeSeProduire()) return;
                      versPersonnage();
                    }}
                  >
                    <td
                      className="roster-table__col-nom"
                      onPointerDown={demarrerDragDiffere(m.instance_id)}
                      title={t('memberGroup.dragHandle')}
                    >
                      {nomAffiche(m)}
                      {leader && (
                        <span className="badge badge--leader" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.leaderTitle')}>
                          {t('memberGroup.leader')}
                        </span>
                      )}
                      {avanceEnAttente && (
                        <span className="badge badge--pending" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.pendingAdvance')}>
                          {t('memberGroup.pendingAdvance')}
                        </span>
                      )}
                    </td>
                    {!masquerProfil && <td className="roster-table__col-profil">{profil?.nom ?? m.profil_id}</td>}
                    <td className="roster-table__stat roster-table__col-M roster-table__group-start">
                      {m.stats_variables?.M ?? m.stats_actuels.M}
                    </td>
                    <td className="roster-table__stat roster-table__stat--band roster-table__col-CC">
                      {m.stats_variables?.CC ?? m.stats_actuels.CC}
                    </td>
                    <td className="roster-table__stat roster-table__col-CT">{m.stats_variables?.CT ?? m.stats_actuels.CT}</td>
                    <td className="roster-table__stat roster-table__stat--band roster-table__col-F">
                      {m.stats_variables?.F ?? m.stats_actuels.F}
                    </td>
                    <td className="roster-table__stat roster-table__col-E">{m.stats_variables?.E ?? m.stats_actuels.E}</td>
                    {pvEstCliquable(m, groupeSimplifie) ? (
                      <td
                        className="roster-table__stat roster-table__stat--band roster-table__col-PV roster-table__col-PV--cliquable"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBasculerPointsDeVie(m);
                        }}
                        title={titrePointsDeVie(m)}
                      >
                        {pvAffiche(m)}
                      </td>
                    ) : (
                      <td className="roster-table__stat roster-table__stat--band roster-table__col-PV">{pvAffiche(m)}</td>
                    )}
                    <td className="roster-table__stat roster-table__col-I">{m.stats_variables?.I ?? m.stats_actuels.I}</td>
                    <td className="roster-table__stat roster-table__stat--band roster-table__col-A">
                      {m.stats_variables?.A ?? m.stats_actuels.A}
                    </td>
                    <td className="roster-table__stat roster-table__col-Cd">{m.stats_variables?.Cd ?? m.stats_actuels.Cd}</td>
                    {groupeADuSv && (
                      <td className="roster-table__stat roster-table__col-Sv">{sv !== null ? `${sv}+` : '—'}</td>
                    )}
                    <td className="roster-table__stat roster-table__group-start">{m.xp}</td>
                    <td>
                      <StatutControl
                        m={m}
                        groupeSimplifie={groupeSimplifie}
                        titre={titreHorsCombat(m, groupeSimplifie)}
                        onToggle={() => onBasculerHorsCombat(m)}
                        t={t}
                      />
                      {inventaireGroupeMismatch(m) && (
                        <span
                          className="badge badge--equipment-warning"
                          style={{ marginLeft: '0.3rem' }}
                          title={t('memberGroup.equipmentMismatchTitle')}
                        >
                          ⚠ {t('memberGroup.equipmentMismatchBadge')}
                        </span>
                      )}
                      {m.franc_tireur_impaye && (
                        <span className="badge badge--warning" style={{ marginLeft: '0.3rem' }}>
                          {t('memberGroup.absentUnpaid')}
                        </span>
                      )}
                    </td>
                    <td className="roster-table__col-actions">
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
                    </td>
                  </tr>
                  <tr
                    className="roster-table__row-synopsis"
                    onClick={() => {
                      if (dragVientDeSeProduire()) return;
                      versPersonnage();
                    }}
                  >
                    <td
                      colSpan={(masquerProfil ? 13 : 14) + (groupeADuSv ? 1 : 0)}
                      className="roster-table__synopsis-cell"
                    >
                      <div className="text-sm text-muted roster-table__synopsis" style={{ fontStyle: 'italic' }}>
                        {equipement}
                      </div>
                      {blessures && (
                        <div className="text-sm text-danger roster-table__synopsis" style={{ marginTop: '0.1rem' }}>
                          {blessures}
                        </div>
                      )}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="roster-compact-list">
        {vues.map(({ m, profil, equipement, blessures, groupeSimplifie, leader, avanceEnAttente, sv }) => (
          <MemberRowCompact
            key={m.instance_id}
            m={m}
            profil={profil}
            equipement={equipement}
            blessures={blessures}
            groupeSimplifie={groupeSimplifie}
            leader={leader}
            avanceEnAttente={avanceEnAttente}
            sv={sv}
            pvCliquable={pvEstCliquable(m, groupeSimplifie)}
            fantome={idEnCours === m.instance_id}
            selectionne={m.instance_id === selectedInstanceId}
            masquerProfil={masquerProfil}
            language={language}
            t={t}
            rowRef={refItem('compact', m.instance_id)}
            onSelect={() => {
              if (dragVientDeSeProduire()) return;
              navigate(`/roster/${roster.id}/personnage/${m.instance_id}`);
            }}
            onSupprimer={() => onSupprimer(m)}
            onBasculerHorsCombat={() => onBasculerHorsCombat(m)}
            onBasculerPointsDeVie={() => onBasculerPointsDeVie(m)}
            onDragPointerDown={demarrerDragDiffere(m.instance_id)}
            titreHorsCombatTexte={titreHorsCombat(m, groupeSimplifie)}
            titrePointsDeVieTexte={titrePointsDeVie(m)}
          />
        ))}
      </div>

      {membres.length === 0 && <p className="text-muted">{t('memberGroup.noMembers')}</p>}

      {idEnCours &&
        pointerPos &&
        (() => {
          const dragged = vues.find((v) => v.m.instance_id === idEnCours);
          if (!dragged) return null;
          return (
            <div className="drag-ghost" style={{ left: pointerPos.x, top: pointerPos.y }}>
              <Icon name="poignee" size="0.85em" style={{ marginRight: '0.4em', color: 'var(--text-muted)' }} />
              <span className="drag-ghost__nom">{nomAffiche(dragged.m)}</span>
              {dragged.profil?.nom && <span className="drag-ghost__profil"> · {dragged.profil.nom}</span>}
            </div>
          );
        })()}
    </CollapsibleCard>
  );
}
