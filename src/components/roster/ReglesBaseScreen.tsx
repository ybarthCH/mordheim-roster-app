import { useMemo, useState } from 'react';
import { useLanguage } from '../../state/useLanguage';
import { Screen } from '../common/Screen';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { REGLES_BASE, type SousRegleBase } from '../../data/reglesBase';
import { translateReglesBase } from '../../i18n/data/reglesBase';
import { echapperRegex, matchMotEntier, sansAccents } from '../../utils/rechercheReference';

const LONGUEUR_MIN_RECHERCHE = 2;

function SousRegleContenu({ sousRegle }: { sousRegle: SousRegleBase }) {
  const { t } = useLanguage();
  return (
    <>
      <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>
        {sousRegle.texte}
      </p>
      {sousRegle.tableau && (
        <div style={{ overflowX: 'auto' }}>
          <table className="table-reference">
            <thead>
              <tr>
                {sousRegle.tableau.entetes.map((entete, i) => (
                  <th key={i}>{entete}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sousRegle.tableau.lignes.map((ligne, i) => (
                <tr key={i}>
                  {ligne.map((cellule, j) => (
                    <td key={j}>{cellule}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {sousRegle.precisionFaq && (
        <p className="text-sm text-muted">
          <strong>{t('reglesBase.faqLabel')}</strong> — {sousRegle.precisionFaq}
        </p>
      )}
    </>
  );
}

// Livre de règles de base (mouvement, tir, corps à corps, blessures,
// commandement et psychologie) — contenu générique indépendant de toute
// bande, donc écran à part plutôt qu'une carte de plus sur
// BandeReferenceScreen (accessible depuis là, voir son bouton d'entrée),
// vu le volume de texte. Voir data/reglesBase.ts pour la source.
export function ReglesBaseScreen() {
  const { t, language } = useLanguage();
  const chapitres = useMemo(() => translateReglesBase(REGLES_BASE, language), [language]);
  const [query, setQuery] = useState('');
  const q = query.trim();
  const actif = q.length >= LONGUEUR_MIN_RECHERCHE;

  // Recherche locale au livre (distincte de la recherche transversale de
  // BandeReferenceScreen, qui indexe ce même contenu via le filtre "Règles"
  // mais sans y naviguer) : mêmes utilitaires de correspondance
  // insensible aux accents/frontières de mot que rechercheReference.ts,
  // réutilisés plutôt que dupliqués.
  const resultats = useMemo(() => {
    if (!actif) return [];
    const qEchappee = echapperRegex(sansAccents(q));
    const trouves: { chapitreTitre: string; sousRegle: SousRegleBase }[] = [];
    for (const chapitre of chapitres) {
      for (const sousRegle of chapitre.sousRegles) {
        if (
          matchMotEntier(sousRegle.titre, qEchappee) ||
          matchMotEntier(sousRegle.texte, qEchappee) ||
          (sousRegle.precisionFaq && matchMotEntier(sousRegle.precisionFaq, qEchappee))
        ) {
          trouves.push({ chapitreTitre: chapitre.titre, sousRegle });
        }
      }
    }
    return trouves;
  }, [chapitres, q, actif]);

  return (
    <Screen title={t('reglesBase.title')} back>
      <p className="text-sm text-muted">{t('reglesBase.intro')}</p>

      <div className="card card--tight" style={{ marginBottom: '1rem' }}>
        <div className="field mb-0">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('reglesBase.searchPlaceholder')}
            aria-label={t('reglesBase.searchPlaceholder')}
          />
        </div>
        {q.length > 0 && !actif && <p className="text-sm text-muted mb-0" style={{ marginTop: '0.4rem' }}>{t('rechercheReference.minLength')}</p>}
      </div>

      {actif ? (
        <>
          {resultats.length === 0 && <p className="text-sm text-muted">{t('rechercheReference.noResults', { q })}</p>}
          {resultats.map(({ chapitreTitre, sousRegle }) => (
            <div key={sousRegle.id} className="card card--tight">
              <p className="text-sm text-muted mb-0" style={{ fontWeight: 600 }}>
                {chapitreTitre}
              </p>
              <h4 className="mb-0">{sousRegle.titre}</h4>
              <SousRegleContenu sousRegle={sousRegle} />
            </div>
          ))}
        </>
      ) : (
        chapitres.map((chapitre) => (
          <CollapsibleCard
            key={chapitre.id}
            preferenceKey={`ui.reglesBase.${chapitre.id}.ouvert`}
            className="card card--tight card--titlebar"
            title={chapitre.titre}
          >
            {chapitre.sousRegles.map((sousRegle) => (
              <div key={sousRegle.id} style={{ marginBottom: '1rem' }}>
                <h4 className="mb-0">{sousRegle.titre}</h4>
                <SousRegleContenu sousRegle={sousRegle} />
              </div>
            ))}
          </CollapsibleCard>
        ))
      )}
    </Screen>
  );
}
