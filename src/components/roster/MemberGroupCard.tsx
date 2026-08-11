import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';
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
import { getItem } from '../../data/items';
import { translateItem } from '../../i18n/data/items';
import { libelleCaracteristique } from '../../utils/stats';

// Couleur du sceau de statut (voir .status-switch) : reprend les mêmes
// teintes sémantiques que les .badge--* du reste de l'appli.
const STATUT_COULEUR: Record<string, string> = {
  actif: 'success',
  hors_de_combat: 'warning',
  mort: 'danger',
  blesse: 'neutral',
};

const STATUT_ICONE: Partial<Record<string, IconName>> = {
  actif: 'coche',
  hors_de_combat: 'ossements',
  mort: 'crane',
  blesse: 'goutte',
};

type MemberGroupCardProps = {
  titre: string;
  icone: IconName;
  preferenceKey: string;
  membres: Member[];
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  onReordonner: (nouvelOrdre: Member[]) => void;
  onBasculerHorsCombat: (m: Member) => void;
  onSupprimer: (m: Member) => void;
  // Masque la colonne "Profil" : superflue quand le nom du membre est
  // toujours identique à celui de son profil (ex : Dramatis Personae, jamais
  // renommables).
  masquerProfil?: boolean;
  // Membre actuellement ouvert dans le volet détail (mode deux volets, grands
  // écrans) : surligne sa ligne dans la liste. Voir RosterScreen/RosterRoute.
  selectedInstanceId?: string;
};

export function MemberGroupCard({
  titre,
  icone,
  preferenceKey,
  membres,
  roster,
  catalogue,
  onReordonner,
  onBasculerHorsCombat,
  onSupprimer,
  masquerProfil,
  selectedInstanceId,
}: MemberGroupCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { elements, refItem, demarrerDrag, idEnCours, pointerPos } = useDragReorder(membres, onReordonner);

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
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elements, roster, catalogue, language]
  );

  return (
    <CollapsibleCard
      preferenceKey={preferenceKey}
      title={
        <>
          <Icon name={icone} style={{ marginRight: '0.35em' }} />
          {titre}
        </>
      }
    >
      <div className="roster-table-wrap">
        <table className="roster-table">
          <thead>
            <tr>
              <th style={{ width: '1.6rem' }}></th>
              <th>{t('memberGroup.name')}</th>
              {!masquerProfil && <th>{t('memberGroup.profile')}</th>}
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
              <th className="roster-table__stat roster-table__group-start">XP</th>
              <th>{t('memberGroup.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vues.map(({ m, profil, equipement, blessures, groupeSimplifie, leader, avanceEnAttente }) => {
              const versPersonnage = () => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`);
              return (
                <Fragment key={m.instance_id}>
                  <tr
                    ref={refItem('table', m.instance_id)}
                    className={`roster-table__row-principale${idEnCours === m.instance_id ? ' roster-table__row--fantome' : ''}${m.instance_id === selectedInstanceId ? ' roster-table__row--selectionnee' : ''}`}
                    onClick={versPersonnage}
                  >
                    <td className="roster-table__poignee-cell">
                      <span
                        className="drag-handle drag-handle--discret"
                        onPointerDown={demarrerDrag(m.instance_id)}
                        onClick={(e) => e.stopPropagation()}
                        title={t('memberGroup.dragHandle')}
                      >
                        <Icon name="poignee" size="0.7em" />
                      </span>
                    </td>
                    <td>
                      {nomAffiche(m)}
                      {leader && (
                        <span className="badge badge--info" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.leaderTitle')}>
                          <Icon name="etoile" style={{ marginRight: '0.3em' }} /> {t('memberGroup.leader')}
                        </span>
                      )}
                      {avanceEnAttente && (
                        <span className="badge badge--warning" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.pendingAdvance')}>
                          {t('memberGroup.pendingAdvance')}
                        </span>
                      )}
                    </td>
                    {!masquerProfil && <td>{profil?.nom ?? m.profil_id}</td>}
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
                    <td className="roster-table__stat roster-table__stat--band roster-table__col-PV">
                      {m.stats_variables?.PV ?? m.stats_actuels.PV}
                    </td>
                    <td className="roster-table__stat roster-table__col-I">{m.stats_variables?.I ?? m.stats_actuels.I}</td>
                    <td className="roster-table__stat roster-table__stat--band roster-table__col-A">
                      {m.stats_variables?.A ?? m.stats_actuels.A}
                    </td>
                    <td className="roster-table__stat roster-table__col-Cd">{m.stats_variables?.Cd ?? m.stats_actuels.Cd}</td>
                    <td className="roster-table__stat roster-table__group-start">{m.xp}</td>
                    <td>
                      {groupeSimplifie ? (
                        <button
                          type="button"
                          className={`status-switch status-switch--${m.hors_combat > 0 ? 'warning' : 'success'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBasculerHorsCombat(m);
                          }}
                          title={titreHorsCombat(m, groupeSimplifie)}
                          aria-label={titreHorsCombat(m, groupeSimplifie)}
                        >
                          <Icon name={m.hors_combat > 0 ? 'ossements' : 'coche'} />
                          <span className="status-switch__label">
                            {m.hors_combat}/{m.taille_groupe} {t('memberGroup.hc')}
                          </span>
                        </button>
                      ) : m.statut === 'mort' ? (
                        <span
                          className={`status-switch status-switch--${STATUT_COULEUR[m.statut]} status-switch--badge`}
                          title={t('memberGroup.deadStatusHint')}
                        >
                          {STATUT_ICONE[m.statut] && <Icon name={STATUT_ICONE[m.statut]!} />}
                          <span className="status-switch__label status-switch__label--fixed">{t(`statut.${m.statut}`)}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className={`status-plaque${m.statut === 'actif' ? ' status-plaque--actif' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBasculerHorsCombat(m);
                          }}
                          title={titreHorsCombat(m, groupeSimplifie)}
                          aria-label={`${t(`statut.${m.statut}`)} — ${titreHorsCombat(m, groupeSimplifie)}`}
                        >
                          <span className="status-plaque__switch">
                            <span className="status-plaque__switch-track" />
                            <span className="status-plaque__switch-knob">
                              <span className="status-plaque__switch-knob-gem" />
                            </span>
                          </span>
                          <span className="status-plaque__label">{t(`memberGroup.statutCourt.${m.statut}`)}</span>
                        </button>
                      )}
                      {inventaireGroupeMismatch(m) && (
                        <span
                          className="badge badge--danger"
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
                    <td>
                      <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn--ghost-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSupprimer(m);
                          }}
                          title={t('memberGroup.removeTitle')}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="roster-table__row-synopsis" onClick={versPersonnage}>
                    <td colSpan={masquerProfil ? 14 : 15} className="roster-table__synopsis-cell">
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

      <div className="member-cards">
        {vues.map(({ m, profil, equipement, blessures, groupeSimplifie, leader, avanceEnAttente }) => {
          return (
            <div
              key={m.instance_id}
              ref={refItem('card', m.instance_id)}
              className={`list-item${idEnCours === m.instance_id ? ' list-item--fantome' : ''}${m.instance_id === selectedInstanceId ? ' list-item--selectionne' : ''}`}
              role="button"
              onClick={() => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`)}
            >
              <span
                className="drag-handle drag-handle--discret"
                onPointerDown={demarrerDrag(m.instance_id)}
                onClick={(e) => e.stopPropagation()}
                title={t('memberGroup.dragHandle')}
              >
                <Icon name="poignee" size="0.7em" />
              </span>
              <div className="list-item__row">
                <div className="list-item__main">
                  <div className="list-item__title">
                    {nomAffiche(m)}
                    {leader && (
                      <span className="badge badge--info" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.leaderTitle')}>
                        <Icon name="etoile" style={{ marginRight: '0.3em' }} /> {t('memberGroup.leader')}
                      </span>
                    )}
                    {avanceEnAttente && (
                      <span className="badge badge--warning" style={{ marginLeft: '0.4rem' }} title={t('memberGroup.pendingAdvance')}>
                        {t('memberGroup.pendingAdvance')}
                      </span>
                    )}
                  </div>
                </div>
                {groupeSimplifie ? (
                  <button
                    type="button"
                    className={`status-switch status-switch--${m.hors_combat > 0 ? 'warning' : 'success'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBasculerHorsCombat(m);
                    }}
                    title={titreHorsCombat(m, groupeSimplifie)}
                    aria-label={titreHorsCombat(m, groupeSimplifie)}
                  >
                    <Icon name={m.hors_combat > 0 ? 'ossements' : 'coche'} />
                    <span className="status-switch__label">
                      {m.hors_combat}/{m.taille_groupe} {t('memberGroup.hc')}
                    </span>
                  </button>
                ) : m.statut === 'mort' ? (
                  <span
                    className={`status-switch status-switch--${STATUT_COULEUR[m.statut]} status-switch--badge`}
                    title={t('memberGroup.deadStatusHint')}
                  >
                    {STATUT_ICONE[m.statut] && <Icon name={STATUT_ICONE[m.statut]!} />}
                    <span className="status-switch__label status-switch__label--fixed">{t(`statut.${m.statut}`)}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`status-plaque${m.statut === 'actif' ? ' status-plaque--actif' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBasculerHorsCombat(m);
                    }}
                    title={titreHorsCombat(m, groupeSimplifie)}
                    aria-label={`${t(`statut.${m.statut}`)} — ${titreHorsCombat(m, groupeSimplifie)}`}
                  >
                    <span className="status-plaque__switch">
                      <span className="status-plaque__switch-track" />
                      <span className="status-plaque__switch-knob">
                        <span className="status-plaque__switch-knob-gem" />
                      </span>
                    </span>
                    <span className="status-plaque__label">{t(`memberGroup.statutCourt.${m.statut}`)}</span>
                  </button>
                )}
                <button
                  className="btn--ghost-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSupprimer(m);
                  }}
                  title={t('memberGroup.removeTitle')}
                >
                  ✕
                </button>
              </div>
              <div className="list-item__details">
                <div className="list-item__subtitle">
                  {!masquerProfil && profil?.nom ? `${profil.nom} · ` : ''}XP {m.xp}
                </div>
                <div className="stat-grid" style={{ margin: '0.5rem 0' }}>
                  {STAT_KEYS.map((k) => (
                    <div key={`lbl-${k}`} className="stat-grid__cell stat-grid__cell--label">
                      {libelleCaracteristique(k, language)}
                    </div>
                  ))}
                  {STAT_KEYS.map((k) => (
                    <div key={`val-${k}`} className="stat-grid__cell stat-grid__cell--value">
                      {m.stats_variables?.[k] ?? m.stats_actuels[k]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
                  {equipement}
                </div>
                {blessures && <div className="text-sm text-danger">{blessures}</div>}
                {inventaireGroupeMismatch(m) && (
                  <div className="flex flex-wrap gap-sm" style={{ marginTop: '0.15rem' }}>
                    <span className="badge badge--danger" title={t('memberGroup.equipmentMismatchTitle')}>
                      ⚠ {t('memberGroup.equipmentMismatchBadge')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
