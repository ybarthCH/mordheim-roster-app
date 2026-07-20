import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type ScreenProps = {
  title: string;
  back?: boolean | string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Screen({ title, back, actions, children }: ScreenProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (typeof back === 'string') navigate(back);
    else navigate(-1);
  };
  return (
    <div className="app-shell">
      <header className="app-header">
        {back && (
          <button className="app-header__back" onClick={handleBack} aria-label="Retour">
            ‹
          </button>
        )}
        <div className="app-header__title">{title}</div>
        {actions}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
