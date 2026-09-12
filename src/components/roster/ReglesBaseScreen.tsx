import { useMemo, useState } from 'react';
import { useLanguage } from '../../state/useLanguage';
import { Screen } from '../common/Screen';
import { Icon } from '../common/Icon';
import { REGLES_BASE, type SousRegleBase } from '../../data/reglesBase';
import { translateReglesBase } from '../../i18n/data/reglesBase';
import { echapperRegex, matchMotEntier, sansAccents } from '../../utils/rechercheReference';

const LONGUEUR_MIN_RECHERCHE = 2;

function idChapitre(chapitreId: string): string {
  return `regles-base-chapitre-${chapitreId}`;
}
function idSousRegle(chapitreId: string, sousRegleId: string): string {
  return `regles-base-sous-regle-${chapitreId}-${sousRegleId}`;
}

// Compense le bandeau collant (.app-header, position: sticky) pour qu'une
// cible atteinte via la table des matières ne se retrouve pas cachée sous
// lui — même variable CSS que .roster-split__col (--app-header-h, posée par
// Screen.tsx via ResizeObserver).
const DECALAGE_ANCRAGE = { scrollMarginTop: 'calc(var(--app-header-h, 56px) + 0.5rem)' } as const;

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

  // Repli/dépli de chaque chapitre géré ici plutôt que par la persistance
  // habituelle de CollapsibleCard (voir usePersistentDisclosure) : la table
  // des matières doit pouvoir forcer l'ouverture d'un chapitre au clic avant
  // d'y défiler, ce qu'un état persisté de façon asynchrone (IndexedDB) ne
  // permet pas de garantir de façon fiable au même tour de rendu.
  const [ouverts, setOuverts] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(REGLES_BASE.map((c) => [c.id, true]))
  );

  const allerA = (chapitreId: string, sousRegleId?: string) => {
    setOuverts((prev) => (prev[chapitreId] ? prev : { ...prev, [chapitreId]: true }));
    const cibleId = sousRegleId ? idSousRegle(chapitreId, sousRegleId) : idChapitre(chapitreId);
    // Double rAF : laisse React committer l'ouverture du chapitre (et donc
    // monter la cible dans le DOM) avant de défiler vers elle.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(cibleId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

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
      <div className="card card--tight" style={{ marginBottom: '1rem' }}>
        <h3 className="mt-0">{t('reglesBase.tocTitle')}</h3>
        {chapitres.map((chapitre) => (
          <div key={chapitre.id} style={{ marginBottom: '0.6rem' }}>
            <button
              type="button"
              className="link-inline"
              style={{ fontWeight: 700 }}
              onClick={() => allerA(chapitre.id)}
            >
              {chapitre.titre}
            </button>
            <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.1rem' }}>
              {chapitre.sousRegles.map((sousRegle) => (
                <li key={sousRegle.id} style={{ marginTop: '0.15rem' }}>
                  <button
                    type="button"
                    className="link-inline text-sm"
                    onClick={() => allerA(chapitre.id, sousRegle.id)}
                  >
                    {sousRegle.titre}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card card--tight" style={{ marginBottom: '1rem' }}>
        <div className="field mb-0">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('reglesBase.searchPlaceholder')}
            aria-label={t('reglesBase.searchPlaceholder')}
          />
        </div>
        {q.length > 0 && !actif && (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.4rem' }}>
            {t('rechercheReference.minLength')}
          </p>
        )}
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
        chapitres.map((chapitre) => {
          const ouvert = ouverts[chapitre.id];
          return (
            <div
              key={chapitre.id}
              id={idChapitre(chapitre.id)}
              className="card card--tight card--titlebar"
              style={DECALAGE_ANCRAGE}
            >
              <div className="collapsible-card__header flex items-center justify-between gap-sm">
                <h3 className="mb-0">{chapitre.titre}</h3>
                <button
                  type="button"
                  className={`collapse-btn ${ouvert ? '' : 'collapse-btn--replie'}`}
                  onClick={() => setOuverts((prev) => ({ ...prev, [chapitre.id]: !prev[chapitre.id] }))}
                  aria-expanded={ouvert}
                  aria-label={ouvert ? t('common.collapse') : t('common.expand')}
                  title={ouvert ? t('common.collapse') : t('common.expand')}
                >
                  <Icon name="chevrons" size="1.1em" />
                </button>
              </div>
              {ouvert && (
                <div style={{ marginTop: '0.6rem' }}>
                  {chapitre.sousRegles.map((sousRegle) => (
                    <div
                      key={sousRegle.id}
                      id={idSousRegle(chapitre.id, sousRegle.id)}
                      style={{ marginBottom: '1rem', ...DECALAGE_ANCRAGE }}
                    >
                      <h4 className="mb-0">{sousRegle.titre}</h4>
                      <SousRegleContenu sousRegle={sousRegle} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </Screen>
  );
}
