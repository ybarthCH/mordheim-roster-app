import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useLanguage } from '../../state/useLanguage';

type Props = { children: ReactNode };
type State = { hasError: boolean; isStaleChunk: boolean };

// Après un déploiement, un onglet resté ouvert référence encore les anciens
// chunks JS (noms hashés) que le nouveau build a remplacés : le prochain
// import() dynamique (changement de route) échoue en 404 et React le
// remonte comme une erreur de rendu classique — ce n'est pas un vrai bug,
// juste une coquille d'app obsolète. Signatures observées selon navigateur.
const RECHARGEMENT_ATTENDU = /dynamically imported module|Importing a module script failed|Loading chunk|error loading dynamically imported module/i;

function estErreurDeChunkObsolete(error: Error): boolean {
  return RECHARGEMENT_ATTENDU.test(error.message) || RECHARGEMENT_ATTENDU.test(error.name);
}

const CLE_RECHARGEMENT_TENTE = 'mordheim_chunk_reload_attempted';

function ErrorFallback({
  isStaleChunk,
  onRetourAccueil,
}: {
  isStaleChunk: boolean;
  onRetourAccueil: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__title">
          {isStaleChunk ? t('errorBoundary.staleChunk.title') : t('errorBoundary.title')}
        </div>
      </header>
      <main className="app-main">
        <div className="empty-state">
          <p>{isStaleChunk ? t('errorBoundary.staleChunk.message') : t('errorBoundary.message')}</p>
          <p className="text-sm">{t('errorBoundary.safetyNote')}</p>
          <button
            type="button"
            className="btn--pack-pill-sm btn--pack-pill-sm--primary"
            onClick={onRetourAccueil}
            style={{ marginTop: '0.8rem' }}
          >
            {t('errorBoundary.backHome')}
          </button>
        </div>
      </main>
    </div>
  );
}

// Sans ce filet, une exception de rendu (donnée corrompue, champ manquant
// sur une vieille bande...) laisse un écran blanc sans aucun indice pour
// l'utilisateur. Composant classe : c'est la seule API React pour intercepter
// une erreur de rendu dans les descendants (pas d'équivalent en hooks) — le
// texte affiché est délégué à ErrorFallback (function component) pour
// pouvoir utiliser useLanguage(), toujours dans l'arbre de LanguageProvider.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isStaleChunk: false };

  static getDerivedStateFromError(): State {
    return { hasError: true, isStaleChunk: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur non gérée :', error, info.componentStack);

    if (estErreurDeChunkObsolete(error)) {
      // Un seul essai automatique par session d'onglet : si le rechargement
      // ne suffit pas (erreur persistante après coup), on affiche un écran
      // avec un bouton de rechargement manuel plutôt que de boucler à l'infini.
      if (!sessionStorage.getItem(CLE_RECHARGEMENT_TENTE)) {
        sessionStorage.setItem(CLE_RECHARGEMENT_TENTE, '1');
        window.location.reload();
        return;
      }
      this.setState({ isStaleChunk: true });
    }
  }

  handleRetourAccueil = () => {
    sessionStorage.removeItem(CLE_RECHARGEMENT_TENTE);
    window.location.hash = '/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback isStaleChunk={this.state.isStaleChunk} onRetourAccueil={this.handleRetourAccueil} />;
    }
    return this.props.children;
  }
}
