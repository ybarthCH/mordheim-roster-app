import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RostersProvider } from './state/RostersContext';
import { ThemeProvider } from './state/ThemeContext';
import { LanguageProvider } from './state/LanguageContext';
import { GameRulesProvider } from './state/GameRulesContext';
import { WakeLockProvider } from './state/WakeLockContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';

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
const PostBatailleScreen = lazy(() =>
  import('./components/postbataille/PostBatailleScreen').then((m) => ({ default: m.PostBatailleScreen }))
);
const ReglagesScreen = lazy(() =>
  import('./components/reglages/ReglagesScreen').then((m) => ({ default: m.ReglagesScreen }))
);

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <GameRulesProvider>
          <WakeLockProvider>
            <RostersProvider>
              <HashRouter>
                <ScrollToTop />
                <ErrorBoundary>
                  <Suspense fallback={null}>
                    <Routes>
                      <Route path="/" element={<ListeBandesScreen />} />
                      <Route path="/creer" element={<CreationBandeScreen />} />
                      <Route path="/roster/:id" element={<RosterRoute />} />
                      <Route path="/roster/:id/recruter-franc-tireur" element={<RecruterFrancTireurScreen />} />
                      <Route path="/roster/:id/personnage/:instanceId" element={<RosterRoute />} />
                      <Route path="/roster/:id/post-bataille" element={<PostBatailleScreen />} />
                      <Route path="/reglages" element={<ReglagesScreen />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </HashRouter>
            </RostersProvider>
          </WakeLockProvider>
        </GameRulesProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
