import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Sans ce filet, une exception de rendu (donnée corrompue, champ manquant
// sur une vieille bande...) laisse un écran blanc sans aucun indice pour
// l'utilisateur. Composant classe : c'est la seule API React pour intercepter
// une erreur de rendu dans les descendants (pas d'équivalent en hooks).
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
      return (
        <div className="app-shell">
          <header className="app-header">
            <div className="app-header__title">Oups</div>
          </header>
          <main className="app-main">
            <div className="empty-state">
              <p>L'application a rencontré un problème inattendu.</p>
              <p className="text-sm">
                Tes bandes restent en sécurité dans le stockage local de l'appareil — seul
                l'affichage a planté.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={this.handleRetourAccueil}
                style={{ marginTop: '0.8rem' }}
              >
                Retour à l'accueil
              </button>
            </div>
          </main>
        </div>
      );
    }
    return this.props.children;
  }
}
