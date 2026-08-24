import { Fragment } from 'react';
import { Screen } from '../common/Screen';
import { useLanguage } from '../../state/useLanguage';
import { CHANGELOG } from '../../data/changelog';
import type { ChangelogCategorie } from '../../data/changelog';
import { translateChangelog } from '../../i18n/data/changelog';

// new Date('AAAA-MM-JJ') parse en UTC minuit : dans un fuseau à décalage
// négatif, toLocaleDateString peut alors afficher la veille. Construction
// en champs locaux pour éviter ce décalage d'un jour.
function formatDate(iso: string, locale: string): string {
  const [annee, mois, jour] = iso.split('-').map(Number);
  return new Date(annee, mois - 1, jour).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Ordre d'affichage des catégories au sein d'une même journée : les
// nouveautés d'abord (ce qui intéresse le plus le joueur), puis l'interface,
// puis le reste (corrections diverses) — voir data/changelog.ts pour la
// définition des catégories.
const ORDRE_CATEGORIES: ChangelogCategorie[] = ['fonctionnalite', 'interface', 'autre'];

export function ChangelogScreen() {
  const { t, language } = useLanguage();
  const entries = translateChangelog(CHANGELOG, language);
  const locale = language === 'en' ? 'en-GB' : 'fr-FR';

  return (
    <Screen title={t('changelog.title')} back>
      <p className="text-sm text-muted" style={{ marginTop: 0 }}>
        {t('changelog.intro')}
      </p>

      {entries.map((entree) => (
        <div className="card" key={entree.date}>
          <h3 className="mt-0">{formatDate(entree.date, locale)}</h3>
          {ORDRE_CATEGORIES.map((categorie) => {
            const points = entree.points.filter((p) => p.categorie === categorie);
            if (points.length === 0) return null;
            return (
              // Fragment (pas de <div>) : .resume-section__title compte sur
              // :first-child pour n'aplatir sa marge du haut que sur le tout
              // premier titre de la carte (voir ResumeCard, même règle CSS) —
              // un wrapper par catégorie casserait cette cascade en donnant
              // à CHAQUE titre son propre parent, l'aplatissant à chaque
              // fois au lieu de garder l'espacement régulier entre sections.
              <Fragment key={categorie}>
                <span className="resume-section__title">{t(`changelog.category.${categorie}`)}</span>
                <ul style={{ marginBottom: 0 }}>
                  {points.map((point, i) => (
                    <li key={i}>{point.texte}</li>
                  ))}
                </ul>
              </Fragment>
            );
          })}
        </div>
      ))}
    </Screen>
  );
}
