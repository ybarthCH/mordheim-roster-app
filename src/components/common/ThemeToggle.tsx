import { Icon } from './Icon';
import { useTheme } from '../../state/useTheme';
import { useLanguage } from '../../state/useLanguage';

export function ThemeToggle() {
  const { effectiveTheme, setTheme } = useTheme();
  const { t } = useLanguage();
  const toDark = effectiveTheme !== 'dark';
  const label = t(toDark ? 'common.theme.toDark' : 'common.theme.toLight');
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => setTheme(toDark ? 'dark' : 'light')}
      aria-label={label}
      title={label}
    >
      <Icon name={toDark ? 'lunePack' : 'soleilPack'} />
    </button>
  );
}
