import { useTheme } from '../../state/ThemeContext';

export function ThemeToggle() {
  const { effectiveTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Basculer le mode sombre"
      title="Mode sombre / clair"
    >
      {effectiveTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
