import { Screen } from '../common/Screen';
import { useTheme } from '../../state/ThemeContext';
import type { Palette } from '../../state/ThemeContext';

const THEMES = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'system', label: 'Système' },
] as const;

const PALETTES: { value: Palette; label: string }[] = [
  { value: 'rouge', label: 'Rouge' },
  { value: 'noir', label: 'Noir & Gris' },
];

export function ReglagesScreen() {
  const { theme, setTheme, palette, setPalette } = useTheme();

  return (
    <Screen title="Réglages" back>
      <div className="card">
        <h3 className="mt-0">Apparence</h3>

        <div className="field">
          <label>Thème</label>
          <div className="status-select">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`status-pill ${theme === t.value ? 'status-pill--active' : ''}`}
                onClick={() => setTheme(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field" style={{ marginTop: '1rem' }}>
          <label>Couleur d'accent</label>
          <div className="status-select">
            {PALETTES.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`status-pill ${palette === p.value ? 'status-pill--active' : ''}`}
                onClick={() => setPalette(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}
