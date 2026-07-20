import { HashRouter, Routes, Route } from 'react-router-dom';
import { RostersProvider } from './state/RostersContext';
import { ThemeProvider } from './state/ThemeContext';
import { ListeBandesScreen } from './components/bandes/ListeBandesScreen';
import { CreationBandeScreen } from './components/creation/CreationBandeScreen';
import { RosterScreen } from './components/roster/RosterScreen';
import { RecruterFrancTireurScreen } from './components/roster/RecruterFrancTireurScreen';
import { PersonnageScreen } from './components/personnage/PersonnageScreen';
import { PostBatailleScreen } from './components/postbataille/PostBatailleScreen';

function App() {
  return (
    <ThemeProvider>
      <RostersProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<ListeBandesScreen />} />
            <Route path="/creer" element={<CreationBandeScreen />} />
            <Route path="/roster/:id" element={<RosterScreen />} />
            <Route path="/roster/:id/recruter-franc-tireur" element={<RecruterFrancTireurScreen />} />
            <Route path="/roster/:id/personnage/:instanceId" element={<PersonnageScreen />} />
            <Route path="/roster/:id/post-bataille" element={<PostBatailleScreen />} />
          </Routes>
        </HashRouter>
      </RostersProvider>
    </ThemeProvider>
  );
}

export default App;
