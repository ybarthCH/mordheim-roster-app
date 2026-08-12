// Petite iconographie maison — traits fins façon gravure sur bois, pensée
// pour accompagner Garamond/Schoensperger plutôt qu'un pack d'icônes RPG
// importé (dont le style bold/plein jurerait avec le rendu manuscrit).
// currentColor partout : suit la couleur du texte parent, donc le thème
// clair/sombre sans configuration supplémentaire.
import type { CSSProperties } from 'react';
import { useTheme } from '../../state/useTheme';

// Icônes peintes du pack UI acheté — utilisées ponctuellement là où l'asset
// colle particulièrement bien (armurerie, héros, règles spéciales, hommes de
// main, cimetière), à la place du trait fin ci-dessus pour ces cas précis.
// Chaque nom résout vers un fichier différent selon le thème ou la palette
// (voir PACK_ICON_SRC) plutôt qu'un seul fichier statique.
export type PackIconName =
  | 'coffrePack'
  | 'etoilePack'
  | 'grimoirePack'
  | 'drapeauxPack'
  | 'cranePack'
  | 'soleilPack'
  | 'lunePack'
  | 'poubellePack'
  | 'croixPack'
  | 'engrenagePack'
  | 'couronnePack'
  | 'epeePack'
  | 'cochePack'
  | 'baguettePack'
  | 'cadenasPack'
  | 'sablierPack'
  | 'zoomAvantPack'
  | 'zoomArrierePack';

// Base des assets décoratifs (public/decor/), préfixée par le base path
// configuré côté Vite (import.meta.env.BASE_URL) plutôt qu'un simple
// '/decor/' en dur : sous GitHub Pages, servi depuis un sous-dossier
// (/mordheim-roster-app/), un chemin absolu commençant par '/' résout vers
// la racine du domaine et 404 — ce qui rendait ces icônes invisibles quel
// que soit le navigateur, pas seulement Edge.
const DECOR_BASE = `${import.meta.env.BASE_URL}decor/`;

const PACK_ICON_SRC: Record<PackIconName, (theme: 'light' | 'dark', palette: 'rouge' | 'noir') => string> = {
  coffrePack: () => `${DECOR_BASE}icon-armurerie-pack.png`,
  // Doré en palette Sang quel que soit le thème — l'argent se noyait sur le
  // fond sombre rouge-brun des cartes ; en Ice Metal le contraste argent
  // marche déjà bien, donc on garde la logique thème pour cette palette.
  etoilePack: (theme, palette) => `${DECOR_BASE}${palette === 'rouge' || theme === 'light' ? 'icon-heroes-gold.png' : 'icon-heroes-silver.png'}`,
  grimoirePack: (theme) => `${DECOR_BASE}${theme === 'dark' ? 'icon-rules-silver.png' : 'icon-rules-brown.png'}`,
  // Blason doré (bouclier + épée), quelle que soit la palette : plus clair
  // que les drapeaux croisés rouge/bleu d'origine, qui se distinguaient mal
  // du fond de carte assorti à la palette.
  drapeauxPack: () => `${DECOR_BASE}icon-henchmen-gold.png`,
  cranePack: (_theme, palette) => `${DECOR_BASE}${palette === 'noir' ? 'icon-graveyard-ice.png' : 'icon-graveyard-bone.png'}`,
  soleilPack: (theme) => `${DECOR_BASE}${theme === 'dark' ? 'icon-sun-silver.png' : 'icon-sun-gold.png'}`,
  lunePack: (theme) => `${DECOR_BASE}${theme === 'dark' ? 'icon-moon-silver.png' : 'icon-moon-gold.png'}`,
  poubellePack: () => `${DECOR_BASE}icon-trash.png`,
  // Toujours rouge, quel que soit le thème/la palette — même logique que
  // .banner-danger : un danger reste rouge (cf. --danger, identique dans
  // les deux palettes), seule la nuance s'ajuste au thème.
  croixPack: (theme) => `${DECOR_BASE}${theme === 'dark' ? 'icon-close-red-dark.png' : 'icon-close-red.png'}`,
  engrenagePack: () => `${DECOR_BASE}icon-settings.png`,
  couronnePack: (theme) => `${DECOR_BASE}${theme === 'dark' ? 'icon-crown-silver.png' : 'icon-crown-gold.png'}`,
  epeePack: () => `${DECOR_BASE}icon-swords-crossed.png`,
  cochePack: () => `${DECOR_BASE}icon-check-green.png`,
  baguettePack: () => `${DECOR_BASE}icon-wand.png`,
  cadenasPack: () => `${DECOR_BASE}icon-lock.png`,
  sablierPack: () => `${DECOR_BASE}icon-hourglass.png`,
  zoomAvantPack: () => `${DECOR_BASE}icon-zoom-in.png`,
  zoomArrierePack: () => `${DECOR_BASE}icon-zoom-out.png`,
};

function isPackIconName(name: IconName | PackIconName): name is PackIconName {
  return name in PACK_ICON_SRC;
}

export type IconName =
  | 'epee'
  | 'arc'
  | 'bouclier'
  | 'gemme'
  | 'crane'
  | 'ossements'
  | 'goutte'
  | 'parchemin'
  | 'flamme'
  | 'cle'
  | 'fiole'
  | 'cible'
  | 'chaine'
  | 'etoile'
  | 'griffe'
  | 'couronne'
  | 'banniere'
  | 'coffre'
  | 'poignee'
  | 'crayon'
  | 'chevrons'
  | 'volets'
  | 'partager'
  | 'accolades'
  | 'document'
  | 'grimoire'
  | 'rune'
  | 'photo'
  | 'coche'
  | 'engrenage'
  | 'soleil'
  | 'lune'
  | 'documentJson'
  | 'documentPdf';

const PATHS: Record<IconName, string> = {
  epee:
    'M12 2 L13 3 L13 15 L12 17 L11 15 L11 3 Z M8 15 L16 15 M12 17 L12 21 M10 21 L14 21 M9.5 15 L7 12.5 M14.5 15 L17 12.5',
  arc: 'M8 3 C13 8 13 16 8 21 M8 3 L8 21 M4 12 L15 12 M15 12 L12 9.5 M15 12 L12 14.5',
  bouclier: 'M12 2 L20 5 L20 11 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 11 L4 5 Z M12 6 L12 18 M8 12 L16 12',
  gemme: 'M6 9 L12 3 L18 9 L12 21 Z M6 9 L18 9 M9 9 L12 3 L15 9 M9 9 L12 21 M15 9 L12 21',
  crane:
    'M12 3 C7 3 4 6.5 4 11 C4 14 5.5 15.8 7 17 L7 20 L9 20 L9 18 L10.5 18 L10.5 20 L13.5 20 L13.5 18 L15 18 L15 20 L17 20 L17 17 C18.5 15.8 20 14 20 11 C20 6.5 17 3 12 3 Z M8.5 11 C8.5 12.1 7.9 13 7.2 13 C6.4 13 6 12.1 6 11 C6 9.9 6.4 9 7.2 9 C7.9 9 8.5 9.9 8.5 11 Z M18 11 C18 12.1 17.6 13 16.8 13 C16.1 13 15.5 12.1 15.5 11 C15.5 9.9 16.1 9 16.8 9 C17.6 9 18 9.9 18 11 Z M11 13 L10 16 L14 16 L13 13 Z',
  ossements: 'M4 4 L18 18 M18 4 L4 18 M3 3 A1 1 0 1 0 3.01 3 M19 3 A1 1 0 1 0 19.01 3 M3 19 A1 1 0 1 0 3.01 19 M19 19 A1 1 0 1 0 19.01 19',
  goutte: 'M12 2 C15 7 18 11 18 15 C18 18.5 15.3 21 12 21 C8.7 21 6 18.5 6 15 C6 11 9 7 12 2 Z',
  parchemin:
    'M6 3 C4.5 3 4 4 4 5.5 L4 18.5 C4 20 4.5 21 6 21 L17 21 C18.5 21 19 20 19 18.5 M6 3 C7.5 3 8 4 8 5.5 L8 21 M6 3 L16 3 C17.5 3 18 4 18 5.5 L18 18.5 M8 7 L14 7 M8 10 L14 10 M8 13 L13 13',
  flamme:
    'M12 2 C12 6 8 7 8 11 C8 14 10 16 12 16 C14 16 16 14 16 11 C16 9.5 15 8.5 14.5 8 C14.7 10 13.5 11 12.5 11 C13 9.5 12.5 8 11.5 6.5 C11 8 9.5 9 9.5 11 C9.5 8 12 6 12 2 Z M9 15 C8 17 8 19.5 10 21 C9 19.5 9.5 18 10.5 17 C10.5 18.5 11.5 19.5 12.5 19.5 C11.5 19 11.5 17.5 12.5 16.5 C14 17.5 15 19 14.5 21 C16.5 19.5 16.5 16.5 15 14.5 C14.5 16.5 13 17.5 12 17.5 C13 16 13 13.5 12 12 C11.5 14 10 14.5 9 15 Z',
  cle: 'M9 14 C6.2 14 4 11.8 4 9 C4 6.2 6.2 4 9 4 C11.8 4 14 6.2 14 9 C14 9.9 13.8 10.7 13.4 11.4 L20 18 L20 21 L17 21 L17 19 L15 19 L15 17 L13.4 17 L11.4 14.6 C10.7 14.8 9.9 14 9 14 Z M9 6.5 C7.6 6.5 6.5 7.6 6.5 9 C6.5 10.4 7.6 11.5 9 11.5',
  fiole:
    'M10 2 L14 2 L14 6 L16 10 C17 12 17 16 16 18 C15 20.5 13 21.5 12 21.5 C11 21.5 9 20.5 8 18 C7 16 7 12 8 10 L10 6 Z M9 13 L15 13 M10 2 L10 6 M14 2 L14 6',
  cible: 'M12 3 A9 9 0 1 0 12.01 3 M12 7 A5 5 0 1 0 12.01 7 M12 11 A1 1 0 1 0 12.01 11',
  chaine: 'M6 2.8 A3.2 3.2 0 1 0 6.01 2.8 M12 8.8 A3.2 3.2 0 1 0 12.01 8.8 M18 14.8 A3.2 3.2 0 1 0 18.01 14.8',
  etoile: 'M12 2 L14.5 8.5 L21 9 L16 13.3 L17.6 20 L12 16.4 L6.4 20 L8 13.3 L3 9 L9.5 8.5 Z',
  griffe:
    'M5 3 C4 6 4 9 6 12 L4 21 L7 20 L8 14 M10 3 C9 6 9 9 11 12 L9 21 L12 20 L13 14 M15 3 C14 6 14 9 16 12 L14 21 L17 20 L18 14',
  couronne: 'M5 19 L5 9 L9 13 L12 6 L15 13 L19 9 L19 19 L5 19',
  banniere: 'M6 2 L6 22 M6 4 L18 7.5 L6 11',
  coffre:
    'M4 9.5 C4 7 7 5.5 12 5.5 C17 5.5 20 7 20 9.5 L20 20 L4 20 Z M4 9.5 L20 9.5 M4 9.5 L4 6.5 M20 9.5 L20 6.5 M10.5 12.5 L13.5 12.5 L13.5 16 L10.5 16 Z',
  poignee:
    'M9 6 A1 1 0 1 0 9.01 6 M15 6 A1 1 0 1 0 15.01 6 M9 12 A1 1 0 1 0 9.01 12 M15 12 A1 1 0 1 0 15.01 12 M9 18 A1 1 0 1 0 9.01 18 M15 18 A1 1 0 1 0 15.01 18',
  crayon:
    'M17 3 L21 7 L8 20 L3 21 L4 16 Z M14 6 L18 10',
  chevrons: 'M6 8 L12 13 L18 8 M6 15 L12 20 L18 15',
  volets: 'M4 5 L20 5 L20 19 L4 19 Z M9.5 5 L9.5 19',
  // Trois nœuds reliés (façon "Share2") plutôt qu'une flèche vers une boîte :
  // cette dernière se lit comme un envoi/export, pas comme un partage.
  partager:
    'M18 2 A3 3 0 1 0 18.01 2 M6 9 A3 3 0 1 0 6.01 9 M18 16 A3 3 0 1 0 18.01 16 M8.6 10.5 L15.4 6.5 M8.6 13.5 L15.4 17.5',
  accolades:
    'M10 4 C8 4 7.5 5 7.5 7 L7.5 9.5 C7.5 10.5 7 11 6 11 C7 11 7.5 11.5 7.5 12.5 L7.5 17 C7.5 19 8 20 10 20 M14 4 C16 4 16.5 5 16.5 7 L16.5 9.5 C16.5 10.5 17 11 18 11 C17 11 16.5 11.5 16.5 12.5 L16.5 17 C16.5 19 16 20 14 20',
  document: 'M6 3 L15 3 L19 7 L19 21 L6 21 Z M15 3 L15 7 L19 7 M9 12 L16 12 M9 15 L16 15 M9 18 L13 18',
  grimoire:
    'M4 6 C4 5 5 4.5 6 4.5 L11 5 L11 19 L6 18.5 C5 18.5 4 18 4 17 Z M20 6 C20 5 19 4.5 18 4.5 L13 5 L13 19 L18 18.5 C19 18.5 20 18 20 17 Z M11 5 L13 5 M11 19 L13 19',
  rune: 'M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z M12 8 L12 16 M8.7 10 L15.3 14 M15.3 10 L8.7 14',
  photo:
    'M4 8 L8 8 L9.5 5.5 L14.5 5.5 L16 8 L20 8 C20.5 8 21 8.5 21 9 L21 18 C21 18.5 20.5 19 20 19 L4 19 C3.5 19 3 18.5 3 18 L3 9 C3 8.5 3.5 8 4 8 Z M12 10.5 A4 4 0 1 0 12.01 10.5',
  coche: 'M4 12 L9.5 17.5 L20 5',
  // Écrou/engrenage simplifié : octogone (corps) + trou central, plus lisible
  // à petite taille qu'une roue dentée à dents fines.
  engrenage: 'M8 4 L16 4 L20 8 L20 16 L16 20 L8 20 L4 16 L4 8 Z M12 9 A3 3 0 1 0 12.01 9',
  soleil:
    'M12 8 A4 4 0 1 0 12.01 8 M12 4.5 L12 6.5 M15.9 8.1 L17.3 6.7 M17.5 12 L19.5 12 M15.9 15.9 L17.3 17.3 M12 17.5 L12 19.5 M8.1 15.9 L6.7 17.3 M6.5 12 L4.5 12 M8.1 8.1 L6.7 6.7',
  lune: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  // Document (coin plié) avec des accolades réduites à l'intérieur — marqueur
  // JSON sans texte, contrairement au PDF ci-dessous.
  documentJson:
    'M6 3 L15 3 L19 7 L19 21 L6 21 Z M15 3 L15 7 L19 7 M11 10 C10 10 9.7 10.5 9.7 11.5 L9.7 13 C9.7 13.5 9.5 13.8 9 13.8 C9.5 13.8 9.7 14.1 9.7 14.6 L9.7 16 C9.7 17 10 17.5 11 17.5 M14 10 C15 10 15.3 10.5 15.3 11.5 L15.3 13 C15.3 13.5 15.5 13.8 16 13.8 C15.5 13.8 15.3 14.1 15.3 14.6 L15.3 16 C15.3 17 15 17.5 14 17.5',
  // Même corps de document que ci-dessus (voir LABELS plus bas pour le
  // repère "PDF" surimprimé) — un simple document à lignes ne suffit pas à
  // le distinguer du JSON une fois les accolades retirées.
  documentPdf: 'M6 3 L15 3 L19 7 L19 21 L6 21 Z M15 3 L15 7 L19 7 M9 12 L16 12 M9 15 L16 15',
};

const VIEWBOX: Record<IconName, string> = {
  epee: '0 0 24 24',
  arc: '0 0 24 24',
  bouclier: '0 0 24 24',
  gemme: '0 0 24 24',
  crane: '0 0 24 24',
  ossements: '0 0 22 24',
  goutte: '0 0 24 24',
  parchemin: '0 0 24 24',
  flamme: '0 0 24 24',
  cle: '0 0 24 24',
  fiole: '0 0 24 24',
  cible: '0 0 24 24',
  chaine: '0 0 24 24',
  etoile: '0 0 24 24',
  griffe: '0 0 24 24',
  couronne: '0 0 24 24',
  banniere: '0 0 24 24',
  coffre: '0 0 24 24',
  poignee: '0 0 24 24',
  crayon: '0 0 24 24',
  chevrons: '0 0 24 24',
  volets: '0 0 24 24',
  partager: '0 0 24 24',
  accolades: '0 0 24 24',
  document: '0 0 24 24',
  grimoire: '0 0 24 24',
  rune: '0 0 24 24',
  photo: '0 0 24 24',
  coche: '0 0 24 24',
  engrenage: '0 0 24 24',
  soleil: '0 0 24 24',
  lune: '0 0 24 24',
  documentJson: '0 0 24 24',
  documentPdf: '0 0 24 24',
};

// Petit repère textuel surimprimé sur certaines icônes (ex : "PDF" sur
// documentPdf) quand le pictogramme seul ne suffit pas à distinguer le type
// de fichier — le texte reste minuscule et dans currentColor, pas un badge
// coloré, pour ne pas jurer avec le style trait fin du reste de l'set.
const LABELS: Partial<Record<IconName, string>> = {
  documentPdf: 'PDF',
};

type Props = {
  name: IconName | PackIconName;
  size?: number | string;
  style?: CSSProperties;
  className?: string;
  title?: string;
};

export function Icon({ name, size = '1em', style, className, title }: Props) {
  const { effectiveTheme, palette } = useTheme();
  if (isPackIconName(name)) {
    return (
      <img
        src={PACK_ICON_SRC[name](effectiveTheme, palette)}
        alt=""
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          verticalAlign: '-0.15em',
          flexShrink: 0,
          objectFit: 'contain',
          ...style,
        }}
      />
    );
  }
  return (
    <svg
      viewBox={VIEWBOX[name]}
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: '-0.15em', flexShrink: 0, ...style }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path
        d={PATHS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {LABELS[name] && (
        <text
          x="21"
          y="19.5"
          textAnchor="end"
          fontSize="6.5"
          fontWeight="700"
          fontFamily="sans-serif"
          fill="currentColor"
          stroke="none"
        >
          {LABELS[name]}
        </text>
      )}
    </svg>
  );
}
