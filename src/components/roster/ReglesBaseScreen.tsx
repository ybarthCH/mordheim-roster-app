import { useMemo } from 'react';
import { useLanguage } from '../../state/useLanguage';
import { Screen } from '../common/Screen';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { REGLES_BASE } from '../../data/reglesBase';
import { translateReglesBase } from '../../i18n/data/reglesBase';

// Livre de règles de base (mouvement, tir, corps à corps, blessures,
// commandement et psychologie) — contenu générique indépendant de toute
// bande, donc écran à part plutôt qu'une carte de plus sur
// BandeReferenceScreen (accessible depuis là, voir son bouton d'entrée),
// vu le volume de texte. Voir data/reglesBase.ts pour la source.
export function ReglesBaseScreen() {
  const { t, language } = useLanguage();
  const chapitres = useMemo(() => translateReglesBase(REGLES_BASE, language), [language]);

  return (
    <Screen title={t('reglesBase.title')} back>
      <p className="text-sm text-muted">{t('reglesBase.intro')}</p>

      {chapitres.map((chapitre) => (
        <CollapsibleCard
          key={chapitre.id}
          preferenceKey={`ui.reglesBase.${chapitre.id}.ouvert`}
          className="card card--tight card--titlebar"
          title={chapitre.titre}
        >
          {chapitre.sousRegles.map((sousRegle) => (
            <div key={sousRegle.id} style={{ marginBottom: '1rem' }}>
              <h4 className="mb-0">{sousRegle.titre}</h4>
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
            </div>
          ))}
        </CollapsibleCard>
      ))}
    </Screen>
  );
}
