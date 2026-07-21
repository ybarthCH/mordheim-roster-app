import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/RostersContext';
import { Screen } from '../common/Screen';
import { resolveProfil } from '../../utils/profil';
import { getCatalogue } from '../../data/warbands';
import { STAT_KEYS } from '../../types/catalog';
import type { Stats } from '../../types/catalog';
import { STATUTS } from '../../types/roster';
import type { Statut, SeriousInjuryRecord } from '../../types/roster';
import { XpGrid } from './XpGrid';
import { CompetencesPanel } from './CompetencesPanel';
import { AvanceeModal } from './AvanceeModal';
import { BlessureGraveModal } from './BlessureGraveModal';
import { Modal } from '../common/Modal';
import { EquipementReference, MagieReference } from '../common/CatalogueReference';
import { avancesDues } from '../../utils/xp';
import { ratingMembre } from '../../utils/rating';
import { skillById } from '../../data/gameData';

const STATUT_BADGE: Record<string, string> = {
  actif: 'badge--success',
  hors_de_combat: 'badge--warning',
  mort: 'badge--danger',
  blesse: 'badge--neutral',
};

// Compatibilité avec d'anciens enregistrements (roll/resultat/effet) sauvegardés
// avant le passage de la table déroulante à la saisie libre.
function injuryLabel(b: SeriousInjuryRecord): string {
  if (b.description) return b.description;
  const legacy = b as unknown as { resultat?: string; effet?: string };
  return [legacy.resultat, legacy.effet].filter(Boolean).join(' — ') || '(sans description)';
}

export function PersonnageScreen() {
  const { id, instanceId } = useParams<{ id: string; instanceId: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');
  const [modalAvancee, setModalAvancee] = useState(false);
  const [modalBlessure, setModalBlessure] = useState(false);
  const [modalSuppression, setModalSuppression] = useState(false);
  const [nouveauSort, setNouveauSort] = useState('');

  const membre = roster?.membres.find((m) => m.instance_id === instanceId);
  const profil = roster && membre ? resolveProfil(roster, membre) : undefined;
  const catalogue = roster ? getCatalogue(roster.bande_id) : undefined;

  if (!roster || !membre || !profil || !catalogue) {
    return (
      <Screen title="Personnage introuvable" back={id ? `/roster/${id}` : '/'}>
        <p className="text-muted">Ce personnage n'existe pas (ou plus).</p>
      </Screen>
    );
  }

  const majMembre = (partial: Partial<typeof membre>) => {
    const membresMaj = roster.membres.map((m) =>
      m.instance_id === membre.instance_id ? { ...m, ...partial } : m
    );
    updateRoster({ ...roster, membres: membresMaj });
  };

  const editerStat = (k: keyof Stats, value: number) => {
    const stats_modifiees = membre.stats_modifiees.includes(k)
      ? membre.stats_modifiees
      : [...membre.stats_modifiees, k];
    majMembre({ stats_actuels: { ...membre.stats_actuels, [k]: value }, stats_modifiees });
  };

  const changerStatut = (s: Statut) => {
    if (s === 'mort') {
      majMembre({ statut: s, date_mort: new Date().toISOString().slice(0, 10) });
    } else {
      majMembre({ statut: s, date_mort: undefined });
    }
  };

  const nomCompetence = (skillId: string) =>
    skillById(skillId) ?? catalogue.competences_speciales.find((s) => s.id === skillId);

  // Hommes de main et animaux non promus : le statut Hors de combat / Blessé
  // n'a plus lieu d'être : le nombre de figurines hors combat se suit via le
  // compteur dédié, résolu figurine par figurine au post-bataille. Seuls
  // Actif et Mort restent pertinents pour l'historique.
  const estGroupeSimplifie = (profil.type === 'homme_de_main' || profil.type === 'animal') && !membre.promu_heros;
  const statutsDisponibles = estGroupeSimplifie
    ? STATUTS.filter((s) => s.id === 'actif' || s.id === 'mort')
    : STATUTS;

  const dues = avancesDues(profil.type, membre.xp_depart, membre.xp);
  const obtenues = membre.historique_avancees.length;
  const enAttente = Math.max(0, dues - obtenues);
  const rating = ratingMembre(membre);
  const plafond = catalogue.caracteristiques_max?.[0];

  const supprimerMembre = () => {
    updateRoster({ ...roster, membres: roster.membres.filter((m) => m.instance_id !== membre.instance_id) });
    navigate(`/roster/${roster.id}`);
  };

  return (
    <Screen title={membre.nom_perso} back={`/roster/${roster.id}`}>
      <div className="card">
        <div className="flex justify-between items-center">
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={membre.nom_perso}
              onChange={(e) => majMembre({ nom_perso: e.target.value })}
              className="input--heading"
            />
            <p className="text-muted text-sm mb-0">
              {profil.nom} ·{' '}
              {profil.type === 'heros' ? 'Héros' : profil.type === 'animal' ? 'Animal' : 'Homme de main'}
              {membre.promu_heros && ' (promu)'}
              {membre.profil_custom && ' · Franc-tireur'}
            </p>
          </div>
          <span className={`badge ${STATUT_BADGE[membre.statut]}`}>
            {STATUTS.find((s) => s.id === membre.statut)?.label}
            {membre.statut === 'mort' && membre.date_mort ? ` (${membre.date_mort})` : ''}
          </span>
        </div>

        <div className="status-select" style={{ marginTop: '0.7rem' }}>
          {statutsDisponibles.map((s) => (
            <button
              key={s.id}
              className={`status-pill ${membre.statut === s.id ? 'status-pill--active' : ''}`}
              onClick={() => changerStatut(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {membre.statut === 'blesse' && (
          <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
            <span className="text-sm text-muted">Blessé :</span>
            <input
              type="number"
              className="stat-grid__input stat-grid__input--pv"
              value={membre.blesse_tour_actuel}
              onChange={(e) => majMembre({ blesse_tour_actuel: Number(e.target.value) || 0 })}
            />
            <span>/</span>
            <input
              type="number"
              className="stat-grid__input stat-grid__input--pv"
              value={membre.blesse_tour_total}
              onChange={(e) => majMembre({ blesse_tour_total: Number(e.target.value) || 0 })}
            />
            <span className="text-sm text-muted">tour(s)</span>
          </div>
        )}

        <div className="flex items-center gap-sm" style={{ marginTop: '0.7rem' }}>
          <span className="badge badge--info">Rating {rating}</span>
        </div>

        {estGroupeSimplifie && (
          <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
            <span className="text-sm text-muted">Groupe :</span>
            <input
              type="number"
              min={1}
              className="stat-grid__input stat-grid__input--pv"
              value={membre.taille_groupe}
              onChange={(e) => majMembre({ taille_groupe: Math.max(1, Number(e.target.value) || 1) })}
            />
            <span className="text-sm text-muted">
              figurine{membre.taille_groupe > 1 ? 's' : ''} identique{membre.taille_groupe > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {estGroupeSimplifie && (
          <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
            <span className="text-sm text-muted">Hors de combat :</span>
            <button
              className="btn btn--sm"
              onClick={() => majMembre({ hors_combat: Math.max(0, membre.hors_combat - 1) })}
            >
              −
            </button>
            <strong>
              {membre.hors_combat} / {membre.taille_groupe}
            </strong>
            <button
              className="btn btn--sm"
              onClick={() => majMembre({ hors_combat: Math.min(membre.taille_groupe, membre.hors_combat + 1) })}
            >
              +
            </button>
            {membre.hors_combat > 0 && (
              <span className="text-sm text-muted">à résoudre au prochain post-bataille</span>
            )}
          </div>
        )}
      </div>

      {profil.regles_speciales && profil.regles_speciales.length > 0 && (
        <div className="card card--tight">
          <h3>Règles spéciales du profil</h3>
          {profil.regles_speciales.map((r) => (
            <p key={r.nom} className="text-sm mb-0" style={{ whiteSpace: 'pre-line' }}>
              <strong>{r.nom}</strong> — {r.texte}
              {r.exception && <span className="text-muted"> ({r.exception})</span>}
            </p>
          ))}
        </div>
      )}

      <div className="card">
        <h3>Caractéristiques</h3>
        <div className="stat-grid">
          {STAT_KEYS.map((k) => (
            <div key={k} className="stat-grid__cell stat-grid__cell--label">
              {k}
            </div>
          ))}
          {STAT_KEYS.map((k) => (
            <div
              key={k}
              className={`stat-grid__cell stat-grid__cell--value ${
                membre.stats_modifiees.includes(k) ? 'stat-grid__cell--modified' : ''
              }`}
            >
              <input
                type="number"
                className="stat-grid__input"
                value={membre.stats_actuels[k]}
                onChange={(e) => editerStat(k, Number(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
        {plafond && (
          <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            Plafond de caractéristiques ({plafond.profil}) :{' '}
            {plafond.note ??
              STAT_KEYS.map((k) => `${k} ${plafond[k] ?? '—'}`).join(' · ')}
          </p>
        )}
      </div>

      <div className="card">
        {profil.type === 'heros' && (
          <>
            <p className="text-sm mb-0">
              <strong>Compétences</strong>
            </p>
            {membre.competences_acquises.length > 0 ? (
              membre.competences_acquises.map((id) => {
                const s = nomCompetence(id);
                return (
                  <p key={id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                    <strong>{s?.nom ?? id}</strong>
                    {s?.texte && <span className="text-muted"> — {s.texte}</span>}
                  </p>
                );
              })
            ) : (
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                Aucune
              </p>
            )}
          </>
        )}

        <p className="text-sm mb-0" style={{ marginTop: profil.type === 'heros' ? '0.7rem' : 0 }}>
          <strong>Règles spéciales / Sorts connus / mutations</strong>
        </p>
        {membre.sorts_connus.length > 0 ? (
          membre.sorts_connus.map((s, i) => (
            <p key={i} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              {s}
            </p>
          ))
        ) : (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            Aucune
          </p>
        )}

        <p className="text-sm mb-0" style={{ marginTop: '0.7rem' }}>
          <strong>Blessures graves</strong>
        </p>
        {membre.blessures_graves.length > 0 ? (
          membre.blessures_graves.map((b) => (
            <p key={b.id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              {b.date} — {injuryLabel(b)}
            </p>
          ))
        ) : (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            Aucune
          </p>
        )}
      </div>

      <div className="card">
        <h3>Équipement</h3>
        <textarea
          value={membre.equipement}
          onChange={(e) => majMembre({ equipement: e.target.value })}
          placeholder="Épée, armure légère, pistolet…"
          style={{
            width: '100%',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 0.6rem',
            minHeight: '4em',
          }}
        />
      </div>

      {profil.type === 'animal' ? (
        <div className="card">
          <h3 className="mt-0">Expérience</h3>
          <p className="text-muted text-sm mb-0">Les animaux ne gagnent jamais d'expérience.</p>
        </div>
      ) : (
        <div className="card">
          <div className="flex justify-between items-center">
            <h3 className="mt-0 mb-0">Expérience</h3>
            <span className="badge badge--info">{membre.xp} XP</span>
          </div>
          <XpGrid
            type={profil.type}
            xp={membre.xp}
            xpDepart={membre.xp_depart}
            onChange={(xp) => majMembre({ xp })}
          />
          <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            XP de départ : {membre.xp_depart} (n'a déclenché aucune avancée).
          </p>
          {enAttente > 0 && (
            <div className="flex justify-between items-center" style={{ marginTop: '0.7rem' }}>
              <span className="badge badge--warning">{enAttente} avancée(s) en attente</span>
              <button className="btn btn--sm btn--primary" onClick={() => setModalAvancee(true)}>
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
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {profil.type === 'heros' && (
        <div className="card">
          <h3>Compétences</h3>
          <CompetencesPanel
            member={membre}
            profil={profil}
            catalogue={catalogue}
            onToggleSkill={(skillId) => {
              const acquises = membre.competences_acquises.includes(skillId)
                ? membre.competences_acquises.filter((s) => s !== skillId)
                : [...membre.competences_acquises, skillId];
              majMembre({ competences_acquises: acquises });
            }}
          />
        </div>
      )}

      <div className="card">
        <h3>Règles spéciales / Sorts connus / mutations</h3>
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.6rem' }}>
          {membre.sorts_connus.map((s, i) => (
            <span key={i} className="badge badge--info">
              {s}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
                onClick={() => majMembre({ sorts_connus: membre.sorts_connus.filter((_, j) => j !== i) })}
              >
                ✕
              </button>
            </span>
          ))}
          {membre.sorts_connus.length === 0 && <span className="text-muted text-sm">Aucun</span>}
        </div>
        <div className="flex gap-sm">
          <input
            value={nouveauSort}
            onChange={(e) => setNouveauSort(e.target.value)}
            placeholder="Ex : Nuages de mouches : -1 pour être touché au corps à corps"
            style={{
              flex: 1,
              background: 'var(--bg-inset)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.6rem',
            }}
          />
          <button
            className="btn"
            onClick={() => {
              if (!nouveauSort.trim()) return;
              majMembre({ sorts_connus: [...membre.sorts_connus, nouveauSort.trim()] });
              setNouveauSort('');
            }}
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <h3 className="mt-0 mb-0">Blessures graves</h3>
          <button className="btn btn--sm" onClick={() => setModalBlessure(true)}>
            + Enregistrer un résultat
          </button>
        </div>
        {membre.blessures_graves.length === 0 && <p className="text-muted text-sm">Aucune.</p>}
        {membre.blessures_graves.map((b) => (
          <p key={b.id} className="text-sm">
            {b.date} — {injuryLabel(b)}
          </p>
        ))}
      </div>

      <div className="card">
        <label className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={membre.grande_cible}
            onChange={(e) => majMembre({ grande_cible: e.target.checked })}
          />
          <span>
            <strong>Grande Cible</strong>
            <br />
            <span className="text-sm text-muted">Case manuelle — ajoute +20 au rating de ce personnage.</span>
          </span>
        </label>
      </div>

      <div className="card">
        <h3>Notes</h3>
        <textarea
          value={membre.notes}
          onChange={(e) => majMembre({ notes: e.target.value })}
          style={{
            width: '100%',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 0.6rem',
            minHeight: '3em',
          }}
        />
      </div>

      <EquipementReference catalogue={catalogue} />
      <MagieReference catalogue={catalogue} profilId={profil.id} />

      <button className="btn btn--danger btn--block" onClick={() => setModalSuppression(true)}>
        Retirer ce personnage de la bande
      </button>

      {modalAvancee && (
        <AvanceeModal
          member={membre}
          profil={profil}
          catalogue={catalogue}
          onClose={() => setModalAvancee(false)}
          onApply={(updated, nouveauMembre) => {
            const membresMaj = roster.membres.map((m) => (m.instance_id === updated.instance_id ? updated : m));
            updateRoster({
              ...roster,
              membres: nouveauMembre ? [...membresMaj, nouveauMembre] : membresMaj,
            });
          }}
        />
      )}
      {modalBlessure && (
        <BlessureGraveModal
          member={membre}
          onClose={() => setModalBlessure(false)}
          onApply={(updated) => majMembre(updated)}
        />
      )}
      {modalSuppression && (
        <Modal onClose={() => setModalSuppression(false)}>
          <h3>Retirer {membre.nom_perso} ?</h3>
          <p className="text-muted">Cette action supprime définitivement ce personnage du roster.</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setModalSuppression(false)}>
              Annuler
            </button>
            <button className="btn btn--danger" onClick={supprimerMembre}>
              Retirer
            </button>
          </div>
        </Modal>
      )}
    </Screen>
  );
}
