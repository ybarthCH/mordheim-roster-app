import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RostersProvider } from './state/RostersContext';
import { LanguageProvider } from './state/LanguageContext';
import { ThemeProvider } from './state/ThemeContext';
import { GameRulesProvider } from './state/GameRulesContext';
import { WakeLockProvider } from './state/WakeLockContext';
import { UpdateSWProvider } from './state/UpdateSWContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';
import { UpdateToast } from './components/common/UpdateToast';

const ListeBandesScreen = lazy(() =>
  import('./components/bandes/ListeBandesScreen').then((m) => ({ default: m.ListeBandesScreen }))
);
const CreationBandeScreen = lazy(() =>
  import('./components/creation/CreationBandeScreen').then((m) => ({ default: m.CreationBandeScreen }))
);
const RosterRoute = lazy(() =>
  import('./components/roster/RosterRoute').then((m) => ({ default: m.RosterRoute }))
);
const RecruterFrancTireurScreen = lazy(() =>
  import('./components/roster/RecruterFrancTireurScreen').then((m) => ({ default: m.RecruterFrancTireurScreen }))
);
const BandeReferenceScreen = lazy(() =>
  import('./components/roster/BandeReferenceScreen').then((m) => ({ default: m.BandeReferenceScreen }))
);
const PostBatailleScreen = lazy(() =>
  import('./components/postbataille/PostBatailleScreen').then((m) => ({ default: m.PostBatailleScreen }))
);
const ReglagesScreen = lazy(() =>
  import('./components/reglages/ReglagesScreen').then((m) => ({ default: m.ReglagesScreen }))
);
const ChangelogScreen = lazy(() =>
  import('./components/reglages/ChangelogScreen').then((m) => ({ default: m.ChangelogScreen }))
);

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <GameRulesProvider>
          <WakeLockProvider>
            <RostersProvider>
              <UpdateSWProvider>
                <HashRouter>
                  <ScrollToTop />
                  <UpdateToast />
                  <ErrorBoundary>
                    <Suspense fallback={null}>
                      <Routes>
                        <Route path="/" element={<ListeBandesScreen />} />
                        <Route path="/creer" element={<CreationBandeScreen />} />
                        <Route path="/roster/:id/recruter-franc-tireur" element={<RecruterFrancTireurScreen />} />
                        <Route path="/roster/:id/post-bataille" element={<PostBatailleScreen />} />
                        <Route path="/roster/:id/reference" element={<BandeReferenceScreen />} />
                        {/* Un seul Route (au lieu de deux entrées distinctes pour
                            /roster/:id et /roster/:id/personnage/:instanceId) :
                            React Router remonte tout le sous-arbre en changeant
                            d'entrée Route, même vers le même composant — ce qui
                            ferait clignoter tout l'écran (au lieu de ne mettre à
                            jour que le volet détail) à chaque clic sur un membre
                            en mode deux volets. Voir RosterRoute pour le parsing
                            du segment optionnel personnage/:instanceId. */}
                        <Route path="/roster/:id/*" element={<RosterRoute />} />
                        <Route path="/reglages" element={<ReglagesScreen />} />
                        <Route path="/notes-de-mise-a-jour" element={<ChangelogScreen />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </HashRouter>
              </UpdateSWProvider>
            </RostersProvider>
          </WakeLockProvider>
        </GameRulesProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
