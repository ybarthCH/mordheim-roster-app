import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useLanguage } from '../../state/useLanguage';

type Props = { children: ReactNode };
type State = { hasError: boolean };

function ErrorFallback({ onRetourAccueil }: { onRetourAccueil: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__title">{t('errorBoundary.title')}</div>
      </header>
      <main className="app-main">
        <div className="empty-state">
          <p>{t('errorBoundary.message')}</p>
          <p className="text-sm">{t('errorBoundary.safetyNote')}</p>
          <button
            type="button"
            className="btn btn--primary"
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
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur non gérée :', error, info.componentStack);
  }

  handleRetourAccueil = () => {
    window.location.hash = '/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetourAccueil={this.handleRetourAccueil} />;
    }
    return this.props.children;
  }
}
