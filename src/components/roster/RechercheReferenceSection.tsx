import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../state/useLanguage';
import {
  construireIndexReference,
  rechercherReference,
  type EntreeReference,
  type TypeEntreeReference,
} from '../../utils/rechercheReference';

const ORDRE_TYPES: TypeEntreeReference[] = ['regleSpeciale', 'objet', 'competence', 'francTireur', 'sort'];
const MAX_PAR_SECTION = 30;
const LONGUEUR_MIN_RECHERCHE = 2;
// Certains francs-tireurs sont employables par une vingtaine de bandes
// (ex : Marchand cathayen) — au-delà de ce plafond, le reste est résumé par
// un badge "+N" plutôt que d'aligner tous les noms (mur de texte peu
// scannable, voir mordheim-responsive-reviewer).
const MAX_BADGES_BANDE = 6;

// Les noms de bande portent leur suffixe de grade entre parenthèses (ex :
// "Chasseurs Cornus (1b)", donnée brute de WarbandCatalog.nom, déjà utilisée
// telle quelle dans le <select> de CreationBandeScreen) — utile pour choisir
// une bande à la création, superflu et encombrant une fois répété jusqu'à
// une vingtaine de fois dans une liste de badges de résultat de recherche.
function sansGrade(nomBande: string): string {
  return nomBande.replace(/\s*\([^()]*\)\s*$/, '');
}

function TagsBande({ bandeNoms, generique }: { bandeNoms: string[]; generique: string }) {
  if (bandeNoms.length === 0) {
    return (
      <span className="badge badge--neutral" style={{ marginRight: '0.3rem' }}>
        {generique}
      </span>
    );
  }
  const affiches = bandeNoms.slice(0, MAX_BADGES_BANDE);
  const reste = bandeNoms.length - affiches.length;
  return (
    <span className="flex flex-wrap gap-sm" style={{ gap: '0.3rem' }}>
      {affiches.map((nom) => (
        <span key={nom} className="badge badge--neutral">
          {sansGrade(nom)}
        </span>
      ))}
      {reste > 0 && <span className="badge badge--neutral">+{reste}</span>}
    </span>
  );
}

type Props = {
  // Prévient le parent (BandeReferenceScreen) qu'une recherche est en cours,
  // pour qu'il masque ses propres cartes (règles/équipement/magie/francs-tireurs
  // de la bande courante) plutôt que d'afficher un contenu redondant avec des
  // résultats déjà tagués par bande ci-dessous.
  onActifChange?: (actif: boolean) => void;
};

// Recherche transversale (toutes bandes confondues) affichée en haut de la
// page référence de bande (voir BandeReferenceScreen) — voir
// utils/rechercheReference.ts pour la construction de l'index et le filtrage.
export function RechercheReferenceSection({ onActifChange }: Props) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const q = query.trim();
  const actif = q.length >= LONGUEUR_MIN_RECHERCHE;

  useEffect(() => {
    onActifChange?.(actif);
  }, [actif, onActifChange]);

  // Types affichés : tous par défaut, restreignable via les puces cliquables
  // ci-dessous. Toujours au moins un type actif (basculer le dernier restant
  // ne fait rien) — plus simple que de gérer un état "zéro type sélectionné".
  const [typesActifs, setTypesActifs] = useState<Set<TypeEntreeReference>>(() => new Set(ORDRE_TYPES));
  const toggleType = (type: TypeEntreeReference) => {
    setTypesActifs((precedent) => {
      if (precedent.has(type)) {
        if (precedent.size === 1) return precedent;
        const suivant = new Set(precedent);
        suivant.delete(type);
        return suivant;
      }
      return new Set(precedent).add(type);
    });
  };

  // Index reconstruit seulement quand la langue change (pas à chaque frappe).
  const index = useMemo(() => construireIndexReference(language), [language]);
  const resultats = useMemo(() => (actif ? rechercherReference(index, q, language) : []), [index, q, actif, language]);
  const resultatsFiltres = useMemo(() => resultats.filter((e) => typesActifs.has(e.type)), [resultats, typesActifs]);

  const groupes = useMemo(() => {
    const map = new Map<TypeEntreeReference, EntreeReference[]>();
    for (const entree of resultatsFiltres) {
      if (!map.has(entree.type)) map.set(entree.type, []);
      map.get(entree.type)!.push(entree);
    }
    return map;
  }, [resultatsFiltres]);

  return (
    <div className="card card--tight" style={{ marginBottom: '1rem' }}>
      <p id="recherche-reference-titre" className="text-sm mb-0" style={{ fontWeight: 600 }}>
        {t('rechercheReference.title')}
      </p>
      <p className="text-sm text-muted" style={{ marginTop: '0.2rem' }}>
        {t('rechercheReference.intro')}
      </p>
      <div className="field" style={{ marginTop: '0.4rem' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('rechercheReference.placeholder')}
          aria-labelledby="recherche-reference-titre"
        />
      </div>

      <div className="tabs" style={{ marginTop: '0.5rem', marginBottom: '0.3rem' }}>
        {ORDRE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`tabs__btn ${typesActifs.has(type) ? 'tabs__btn--active' : ''}`}
            onClick={() => toggleType(type)}
            aria-pressed={typesActifs.has(type)}
          >
            {t(`rechercheReference.section.${type}`)}
          </button>
        ))}
      </div>

      {q.length > 0 && !actif && <p className="text-sm text-muted mb-0">{t('rechercheReference.minLength')}</p>}
      {actif && resultatsFiltres.length === 0 && (
        <p className="text-sm text-muted mb-0">{t('rechercheReference.noResults', { q })}</p>
      )}

      {actif && resultatsFiltres.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          {ORDRE_TYPES.filter((type) => groupes.has(type)).map((type) => {
            const entrees = groupes.get(type)!;
            const affichees = entrees.slice(0, MAX_PAR_SECTION);
            return (
              <div key={type} style={{ marginBottom: '0.8rem' }}>
                <p className="text-sm mb-0" style={{ fontWeight: 600 }}>
                  {t(`rechercheReference.section.${type}`)} ({entrees.length})
                </p>
                {affichees.map((entree) => (
                  <div key={entree.id} className="list-item">
                    <div className="list-item__main">
                      <span className="list-item__title">{entree.nom}</span>
                      <div className="list-item__subtitle" style={{ marginTop: '0.25rem' }}>
                        <TagsBande bandeNoms={entree.bandeNoms} generique={t('rechercheReference.generic')} />
                        {entree.meta && <span style={{ marginLeft: '0.4rem' }}>{entree.meta}</span>}
                      </div>
                      {entree.texte && (
                        <p className="text-sm mb-0" style={{ marginTop: '0.3rem', whiteSpace: 'pre-line' }}>
                          {entree.texte}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {entrees.length > MAX_PAR_SECTION && (
                  <p className="text-sm text-muted mb-0">{t('rechercheReference.tooMany')}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
