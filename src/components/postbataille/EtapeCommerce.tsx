import { useState } from 'react';
import type { WarbandCatalog } from '../../types/catalog';
import type { InventoryEntry, Member, RosterInstance } from '../../types/roster';
import {
  appliquerTraitementDocteur,
  COUT_DOCTEUR,
  effetsTraitablesDocteur,
} from '../../utils/docteur';
import { resolveProfil } from '../../utils/profil';
import { injuryLabelAffiche, nomCourtBlessureAffiche } from '../../utils/blessures';
import { Modal } from '../common/Modal';
import { DocteurModal } from '../personnage/DocteurModal';
import {
  RechercheObjetRareModal,
  type ResultatRechercheRare,
} from './RechercheObjetRareModal';
import {
  RechercheDramatisPersonaeModal,
  type ResultatRechercheDramatisPersonae,
} from './RechercheDramatisPersonaeModal';
import { dramatisPersonaeDisponibles, DRAMATIS_PERSONAE } from '../../data/dramatisPersonae';
import { translateHiredSword } from '../../i18n/data/hiredSwords';
import { useLanguage } from '../../state/useLanguage';

export type HerosCommerce = {
  membre: Member;
  membreApresBlessure: Member;
  horsDeCombat: boolean;
};

export type CommerceDraft =
  | { action: 'aucune'; statut: 'termine' }
  | {
      action: 'rare';
      statut: 'termine';
      rarete: number;
      objetNom: string;
      reussi: boolean;
      achat?: InventoryEntry;
    }
  | {
      action: 'dramatis_personae';
      statut: 'termine';
      dramatisPersonaeId: string;
      nom: string;
      reussi: boolean;
      recrute: boolean;
      cout: number;
    }
  | {
      action: 'docteur';
      statut: 'paye';
      blessureId: string;
      effetId: string;
      membreAvantTraitement: Member;
    }
  | {
      action: 'docteur';
      statut: 'termine';
      blessureId: string;
      effetId: string;
      jet: number;
      resultatTitre: string;
      membreApresTraitement: Member;
      equipementConserve: InventoryEntry[];
    };

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  heros: HerosCommerce[];
  drafts: Record<string, CommerceDraft>;
  tresorerieDisponible: number;
  docteurActif: boolean;
  dramatisPersonaeActif: boolean;
  onChanger: (instanceId: string, draft: CommerceDraft | null) => void;
};

function dejaStupide(roster: RosterInstance, membre: Member): boolean {
  const profil = resolveProfil(roster, membre);
  const texte = [
    membre.notes,
    ...(profil?.regles_speciales ?? []).map((regle) => `${regle.nom} ${regle.texte}`),
  ].join('\n');
  return /stupid/i.test(texte);
}

export function EtapeCommerce({
  roster,
  catalogue,
  heros,
  drafts,
  tresorerieDisponible,
  docteurActif,
  dramatisPersonaeActif,
  onChanger,
}: Props) {
  const { t, language } = useLanguage();
  const [rechercheHeroId, setRechercheHeroId] = useState<string | null>(null);
  const [rechercheDPHeroId, setRechercheDPHeroId] = useState<string | null>(null);
  const [docteurHeroId, setDocteurHeroId] = useState<string | null>(null);
  const [blessureChoisieId, setBlessureChoisieId] = useState<string | null>(null);

  const herosRecherche = heros.find((item) => item.membre.instance_id === rechercheHeroId);
  const herosRechercheDP = heros.find((item) => item.membre.instance_id === rechercheDPHeroId);
  // Dramatis Personae déjà ciblés avec succès par un autre Héros dans cette
  // même étape (brouillons non encore appliqués au roster) : à exclure pour
  // éviter que deux Héros ne "trouvent" le même personnage le même soir.
  const dpDejaCibles = new Set(
    Object.entries(drafts).flatMap(([instanceId, draft]) =>
      draft.action === 'dramatis_personae' && draft.recrute && instanceId !== rechercheDPHeroId
        ? [draft.dramatisPersonaeId]
        : []
    )
  );
  const groupesExclusifsDejaCibles = new Set(
    [...dpDejaCibles]
      .map((id) => DRAMATIS_PERSONAE.find((dp) => dp.id === id)?.groupe_exclusif)
      .filter((g): g is string => !!g)
  );
  const dpDisponibles = dramatisPersonaeDisponibles(roster)
    .filter((dp) => !dpDejaCibles.has(dp.id) && !(dp.groupe_exclusif && groupesExclusifsDejaCibles.has(dp.groupe_exclusif)))
    .map((dp) => translateHiredSword(dp, language));
  const herosDocteur = heros.find((item) => item.membre.instance_id === docteurHeroId);
  const draftDocteur = herosDocteur ? drafts[herosDocteur.membre.instance_id] : undefined;
  const membreDocteur =
    draftDocteur?.action === 'docteur' && draftDocteur.statut === 'paye'
      ? draftDocteur.membreAvantTraitement
      : herosDocteur?.membreApresBlessure;
  const blessureId =
    draftDocteur?.action === 'docteur' && draftDocteur.statut === 'paye'
      ? draftDocteur.blessureId
      : blessureChoisieId;
  const blessureDocteur = membreDocteur?.blessures_graves.find((blessure) => blessure.id === blessureId);
  const blessureAffiche =
    blessureDocteur && draftDocteur?.action === 'docteur' && draftDocteur.statut === 'paye'
      ? { ...blessureDocteur, docteur_effet_en_attente: draftDocteur.effetId }
      : blessureDocteur;

  const achatsEnCours = Object.values(drafts).flatMap((draft) =>
    draft.action === 'rare' && draft.achat ? [draft.achat] : []
  );

  const ouvrirDocteur = (hero: HerosCommerce) => {
    setDocteurHeroId(hero.membre.instance_id);
    const draft = drafts[hero.membre.instance_id];
    if (draft?.action === 'docteur' && draft.statut === 'paye') {
      setBlessureChoisieId(draft.blessureId);
    } else {
      setBlessureChoisieId(null);
    }
  };

  const fermerDocteur = () => {
    setDocteurHeroId(null);
    setBlessureChoisieId(null);
  };

  return (
    <>
      <div className="card">
        <h3>
          {t('commerce.title', {
            dp: dramatisPersonaeActif ? t('commerce.dpSuffix') : '',
            docteur: docteurActif ? t('commerce.doctorSuffix') : '',
          })}
        </h3>
        <p className="text-sm">
          {t('commerce.treasuryAvailable', { n: tresorerieDisponible })}
        </p>
        <p className="text-sm text-muted">
          {t('commerce.intro', {
            dp: dramatisPersonaeActif ? t('commerce.introDpSuffix') : '',
            docteur: docteurActif
              ? t('commerce.introDoctorSuffix', {
                  cout: COUT_DOCTEUR,
                  dp: dramatisPersonaeActif ? t('commerce.introDoctorDpSuffix') : '',
                })
              : '',
          })}
        </p>
        <p className="text-sm text-muted">{t('commerce.noAutoRolls')}</p>

        {heros.length === 0 && <p className="text-muted">{t('commerce.noHeroAvailable')}</p>}
        {heros.map((hero) => {
          const id = hero.membre.instance_id;
          const draft = drafts[id];
          const effetsSoignables = hero.membreApresBlessure.blessures_graves.flatMap(effetsTraitablesDocteur);
          return (
            <div key={id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
              <div className="flex justify-between items-center gap-sm">
                <div>
                  <strong>{hero.membre.nom_perso}</strong>
                  {hero.horsDeCombat && <span className="badge badge--warning" style={{ marginLeft: '0.4rem' }}>{t('commerce.outOfAction')}</span>}
                </div>
                {draft && (
                  <button className="btn--pack-pill-sm" onClick={() => onChanger(id, null)}>
                    {t('commerce.modify')}
                  </button>
                )}
              </div>

              {!draft && (
                <div className="flex flex-wrap gap-sm" style={{ marginTop: '0.6rem' }}>
                  <button className="btn--pack-pill-sm" onClick={() => onChanger(id, { action: 'aucune', statut: 'termine' })}>
                    {t('commerce.skip')}
                  </button>
                  <button
                    className="btn--pack-pill-sm btn--pack-pill-sm--primary"
                    disabled={hero.horsDeCombat}
                    onClick={() => setRechercheHeroId(id)}
                  >
                    {t('commerce.searchRareItem')}
                  </button>
                  {dramatisPersonaeActif && (
                    <button
                      className="btn--pack-pill-sm"
                      disabled={hero.horsDeCombat || dpDisponibles.length === 0}
                      onClick={() => setRechercheDPHeroId(id)}
                    >
                      {t('commerce.searchDramatisPersonae')}
                    </button>
                  )}
                  {docteurActif && (
                    <button
                      className="btn--pack-pill-sm"
                      disabled={effetsSoignables.length === 0 || tresorerieDisponible < COUT_DOCTEUR}
                      onClick={() => ouvrirDocteur(hero)}
                    >
                      {t('commerce.seeDoctor', { cout: COUT_DOCTEUR })}
                    </button>
                  )}
                </div>
              )}

              {draft?.action === 'aucune' && <p className="text-sm text-muted mb-0">{t('commerce.noAction')}</p>}
              {draft?.action === 'rare' && (
                <p className={`text-sm mb-0 ${draft.reussi ? 'text-success' : 'text-danger'}`}>
                  {t('commerce.rareSearchLine', {
                    nom: draft.objetNom,
                    rarete: draft.rarete,
                    issue: draft.reussi
                      ? draft.achat
                        ? t('commerce.rareSucceededBought', { cout: draft.achat.cout })
                        : t('commerce.rareSucceededNotBought')
                      : t('commerce.searchFailed'),
                  })}
                </p>
              )}
              {draft?.action === 'dramatis_personae' && (
                <p className={`text-sm mb-0 ${draft.reussi ? 'text-success' : 'text-danger'}`}>
                  {t('commerce.dpSearchLine', {
                    nom: draft.nom,
                    issue: draft.reussi
                      ? draft.recrute
                        ? t('commerce.dpSucceededRecruited', { cout: draft.cout })
                        : t('commerce.dpSucceededNotRecruited')
                      : t('commerce.searchFailed'),
                  })}
                </p>
              )}
              {draft?.action === 'docteur' && draft.statut === 'paye' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p className="text-sm text-warning mb-0">{t('commerce.consultationPaid')}</p>
                  <button className="btn--pack-pill-sm btn--pack-pill-sm--primary" style={{ marginTop: '0.4rem' }} onClick={() => ouvrirDocteur(hero)}>
                    {t('commerce.resumeConsultation')}
                  </button>
                </div>
              )}
              {draft?.action === 'docteur' && draft.statut === 'termine' && (
                <p className="text-sm mb-0">
                  {t('commerce.doctorRoll', { jet: draft.jet, titre: draft.resultatTitre })}
                </p>
              )}

              {!draft && hero.horsDeCombat && docteurActif && (
                <p className="text-sm text-muted mb-0" style={{ marginTop: '0.45rem' }}>
                  {t('commerce.rareSearchForbidden')}
                </p>
              )}
              {!draft && docteurActif && effetsSoignables.length === 0 && (
                <p className="text-sm text-muted mb-0" style={{ marginTop: '0.35rem' }}>
                  {t('commerce.noTreatableInjury')}
                </p>
              )}
            </div>
          );
        })}
        {heros.some((hero) => !drafts[hero.membre.instance_id]) && (
          <button
            type="button"
            className="btn--pack-pill-sm"
            style={{ marginTop: '0.3rem' }}
            onClick={() => {
              heros.forEach((hero) => {
                if (!drafts[hero.membre.instance_id]) {
                  onChanger(hero.membre.instance_id, { action: 'aucune', statut: 'termine' });
                }
              });
            }}
          >
            {t('commerce.skipAll')}
          </button>
        )}
      </div>

      {herosRecherche && (
        <RechercheObjetRareModal
          membre={herosRecherche.membre}
          roster={roster}
          catalogue={catalogue}
          tresorerieDisponible={tresorerieDisponible}
          inventaireSupplementaire={achatsEnCours}
          onClose={() => setRechercheHeroId(null)}
          onTerminer={(resultat: ResultatRechercheRare) => {
            onChanger(herosRecherche.membre.instance_id, {
              action: 'rare',
              statut: 'termine',
              ...resultat,
            });
            setRechercheHeroId(null);
          }}
        />
      )}

      {herosRechercheDP && (
        <RechercheDramatisPersonaeModal
          membre={herosRechercheDP.membre}
          dpDisponibles={dpDisponibles}
          tresorerieDisponible={tresorerieDisponible}
          onClose={() => setRechercheDPHeroId(null)}
          onTerminer={(resultat: ResultatRechercheDramatisPersonae) => {
            onChanger(herosRechercheDP.membre.instance_id, {
              action: 'dramatis_personae',
              statut: 'termine',
              ...resultat,
            });
            setRechercheDPHeroId(null);
          }}
        />
      )}

      {herosDocteur && membreDocteur && !blessureAffiche && (
        <Modal onClose={fermerDocteur}>
          <h3>{t('commerce.chooseInjuryTitle', { nom: herosDocteur.membre.nom_perso })}</h3>
          <p className="text-sm text-muted">{t('commerce.chooseInjuryNote')}</p>
          {membreDocteur.blessures_graves.map((blessure) => {
            const traitable = effetsTraitablesDocteur(blessure).length > 0;
            return (
              <button
                key={blessure.id}
                type="button"
                className="list-item"
                style={{ width: '100%', textAlign: 'left', marginBottom: '0.45rem' }}
                disabled={!traitable}
                onClick={() => setBlessureChoisieId(blessure.id)}
              >
                <div className="list-item__main">
                  <div className="list-item__title">{nomCourtBlessureAffiche(blessure, language)}</div>
                  <div className="list-item__subtitle">{injuryLabelAffiche(blessure, language)}</div>
                  {!traitable && <div className="list-item__subtitle">{t('commerce.notTreatableByDoctor')}</div>}
                </div>
              </button>
            );
          })}
          <button className="btn btn--block" onClick={fermerDocteur}>{t('commerce.cancel')}</button>
        </Modal>
      )}

      {herosDocteur && membreDocteur && blessureAffiche && (
        <DocteurModal
          nomPersonnage={herosDocteur.membre.nom_perso}
          blessure={blessureAffiche}
          tresorerie={tresorerieDisponible}
          estHeros
          onClose={fermerDocteur}
          onPayer={(effetId) =>
            onChanger(herosDocteur.membre.instance_id, {
              action: 'docteur',
              statut: 'paye',
              blessureId: blessureAffiche.id,
              effetId,
              membreAvantTraitement: membreDocteur,
            })
          }
          onAppliquer={(effetId, jet) => {
            const application = appliquerTraitementDocteur(
              membreDocteur,
              blessureAffiche.id,
              effetId,
              jet,
              dejaStupide(roster, membreDocteur)
            );
            onChanger(herosDocteur.membre.instance_id, {
              action: 'docteur',
              statut: 'termine',
              blessureId: blessureAffiche.id,
              effetId,
              jet,
              resultatTitre: application.resultat.titre,
              membreApresTraitement: application.membre,
              equipementConserve: application.equipementConserve,
            });
          }}
        />
      )}
    </>
  );
}
