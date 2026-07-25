import { Screen } from '../common/Screen';
import { useTheme } from '../../state/useTheme';
import type { Palette } from '../../state/useTheme';
import { useGameRules } from '../../state/useGameRules';

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
  const { rules, setRule } = useGameRules();

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

      <div className="card">
        <h3 className="mt-0">Règles optionnelles</h3>
        <p className="text-sm text-muted">
          Ces choix sont mémorisés sur cet appareil et s'appliquent à toutes les bandes.
        </p>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={rules.poudreNoireAvancee}
            onChange={(e) => setRule('poudreNoireAvancee', e.target.checked)}
          />
          <span>
            <strong>Règles avancées de poudre noire</strong>
            <br />
            <span className="text-sm text-muted">
              Réduit d'environ 33 % le prix des armes à poudre noire, arrondi au multiple de 5 le plus proche. Les
              Artilleurs de Nuln utilisent toujours ces prix réduits, même si cette option est désactivée.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={rules.armuresLozheim}
            onChange={(e) => setRule('armuresLozheim', e.target.checked)}
          />
          <span>
            <strong>Règle Maison Lozheim</strong>
            <br />
            <span className="text-sm text-muted">
              Les armures sont à 50 % du prix normal et donnent +1 à la sauvegarde d'armure. Les boucliers, casques,
              cuirs durcis, pavois et rondaches ne sont pas concernés ; les caparaçons le sont.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={rules.trinketsLimites}
            onChange={(e) => setRule('trinketsLimites', e.target.checked)}
          />
          <span>
            <strong>Règle Maison Trinket limité</strong>
            <br />
            <span className="text-sm text-muted">
              Porte-bonheur, Herbes de soin, Patte de lapin et leurs variantes, Familiers et Reliques sacrées ou
              impies sont limités à un exemplaire de chaque par bande, afin que les relances et sécurités restent
              rares et que les échecs conservent leur poids.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={rules.sawbonesDocteur}
            onChange={(e) => setRule('sawbonesDocteur', e.target.checked)}
          />
          <span>
            <strong>Quoi de neuf, docteur ? (Sawbones)</strong>
            <br />
            <span className="text-sm text-muted">
              Active le supplément du médecin pendant l'étape Commerce de la séquence post-bataille. Un Héros peut
              payer 20 po pour tenter de soigner une blessure au lieu de rechercher un objet rare.
            </span>
          </span>
        </label>
      </div>
    </Screen>
  );
}
