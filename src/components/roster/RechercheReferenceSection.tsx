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

  // Index reconstruit seulement quand la langue change (pas à chaque frappe).
  const index = useMemo(() => construireIndexReference(language), [language]);
  const resultats = useMemo(() => (actif ? rechercherReference(index, q, language) : []), [index, q, actif, language]);

  const groupes = useMemo(() => {
    const map = new Map<TypeEntreeReference, EntreeReference[]>();
    for (const entree of resultats) {
      if (!map.has(entree.type)) map.set(entree.type, []);
      map.get(entree.type)!.push(entree);
    }
    return map;
  }, [resultats]);

  return (
    <div className="card card--tight" style={{ marginBottom: '1rem' }}>
      <p className="text-sm mb-0" style={{ fontWeight: 600 }}>
        {t('rechercheReference.title')}
      </p>
      <p className="text-sm text-muted" style={{ marginTop: '0.2rem' }}>
        {t('rechercheReference.intro')}
      </p>
      <div className="field" style={{ marginTop: '0.4rem' }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('rechercheReference.placeholder')} />
      </div>

      {q.length > 0 && !actif && <p className="text-sm text-muted mb-0">{t('rechercheReference.minLength')}</p>}
      {actif && resultats.length === 0 && (
        <p className="text-sm text-muted mb-0">{t('rechercheReference.noResults', { q })}</p>
      )}

      {actif && resultats.length > 0 && (
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
                      <div className="list-item__subtitle">
                        {entree.bandeNoms.length > 0 ? entree.bandeNoms.join(' · ') : t('rechercheReference.generic')}
                        {entree.meta ? ` · ${entree.meta}` : ''}
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
