import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RostersProvider } from './state/RostersContext';
import { ThemeProvider } from './state/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';

const ListeBandesScreen = lazy(() =>
  import('./components/bandes/ListeBandesScreen').then((m) => ({ default: m.ListeBandesScreen }))
);
const CreationBandeScreen = lazy(() =>
  import('./components/creation/CreationBandeScreen').then((m) => ({ default: m.CreationBandeScreen }))
);
const RosterScreen = lazy(() =>
  import('./components/roster/RosterScreen').then((m) => ({ default: m.RosterScreen }))
);
const RecruterFrancTireurScreen = lazy(() =>
  import('./components/roster/RecruterFrancTireurScreen').then((m) => ({ default: m.RecruterFrancTireurScreen }))
);
const PersonnageScreen = lazy(() =>
  import('./components/personnage/PersonnageScreen').then((m) => ({ default: m.PersonnageScreen }))
);
const PostBatailleScreen = lazy(() =>
  import('./components/postbataille/PostBatailleScreen').then((m) => ({ default: m.PostBatailleScreen }))
);
const ReglagesScreen = lazy(() =>
  import('./components/reglages/ReglagesScreen').then((m) => ({ default: m.ReglagesScreen }))
);

function App() {
  return (
    <ThemeProvider>
      <RostersProvider>
        <HashRouter>
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<ListeBandesScreen />} />
                <Route path="/creer" element={<CreationBandeScreen />} />
                <Route path="/roster/:id" element={<RosterScreen />} />
                <Route path="/roster/:id/recruter-franc-tireur" element={<RecruterFrancTireurScreen />} />
                <Route path="/roster/:id/personnage/:instanceId" element={<PersonnageScreen />} />
                <Route path="/roster/:id/post-bataille" element={<PostBatailleScreen />} />
                <Route path="/reglages" element={<ReglagesScreen />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </HashRouter>
      </RostersProvider>
    </ThemeProvider>
  );
}

export default App;
