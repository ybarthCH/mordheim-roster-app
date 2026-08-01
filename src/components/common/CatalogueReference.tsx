import type { Profile, WarbandCatalog } from '../../types/catalog';
import { getItem } from '../../data/items';
import { estAccesGenerique, iconeCategorie, prixAvecRegles } from '../../utils/shop';
import { magieDuProfil } from '../../utils/magie';
import { useGameRules } from '../../state/useGameRules';
import { useLanguage } from '../../state/useLanguage';
import type { Language } from '../../state/useLanguage';
import { translateItem } from '../../i18n/data/items';
import { uiDictionary } from '../../i18n/ui';
import { Icon } from './Icon';
import { CollapsibleCard } from './CollapsibleCard';

const LISTES_EQUIPEMENT = ['armes_cac', 'armes_tir', 'armures', 'divers'] as const;

// Libellés lisibles pour les clés internes de `catalogue.equipement` (ex :
// "artilleurs_de_nuln", "tireurs_delite") — ces clés sont des identifiants
// de structuration de données, pas du texte destiné à l'affichage ; leur
// traduction vit dans `catalogueReference.list.*` (voir i18n/ui). PETITS_MOTS
// + humaniserCle() servent de repli français pour toute clé absente du
// dictionnaire (nouvelle bande non encore renseignée) — pas de repli anglais
// possible dans ce cas, la clé structurelle elle-même n'étant pas traduite.
const PETITS_MOTS = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'aux']);

function humaniserCle(cle: string): string {
  return cle
    .split('_')
    .map((mot, i) => (i > 0 && PETITS_MOTS.has(mot) ? mot : mot.charAt(0).toUpperCase() + mot.slice(1)))
    .join(' ');
}

function libelleListe(cle: string, language: Language): string {
  const entry = uiDictionary[`catalogueReference.list.${cle}`];
  if (entry) return entry[language] ?? entry.fr;
  return humaniserCle(cle);
}

// Référence libre du catalogue d'équipement d'une bande — texte indicatif
// uniquement, aucun achat automatisé. Ne garde que les objets propres à la
// bande (mutations, armes à poudre noire exclusives, objets bloqués à une
// liste précise...) : les objets génériques de la base commune sont déjà
// accessibles via le shop intégré et n'ont plus leur place ici.
export function EquipementReference({ catalogue }: { catalogue: WarbandCatalog }) {
  const { rules } = useGameRules();
  const { t, language } = useLanguage();
  const listesFiltrees = Object.entries(catalogue.equipement ?? {})
    .map(([liste, groupes]) => {
      const parCategorie = LISTES_EQUIPEMENT.map((cat) => ({
        cat,
        items: (groupes[cat] ?? []).filter((it) => {
          const ref = getItem(it.item_id);
          return !estAccesGenerique(ref?.acces ?? []);
        }),
      })).filter((g) => g.items.length > 0);
      return { liste, parCategorie };
    })
    .filter((l) => l.parCategorie.length > 0);

  const aEquipement = listesFiltrees.length > 0;
  const aObjetsRares = (catalogue.equipement_special?.length ?? 0) > 0;
  if (!aEquipement && !aObjetsRares) return null;

  return (
    <CollapsibleCard
      preferenceKey="ui.roster.equipement_reference.ouvert"
      title={t('catalogueReference.equipmentTitle')}
    >
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        {t('catalogueReference.equipmentIntro')}
      </p>
      {listesFiltrees.map(({ liste, parCategorie }) => (
        <div key={liste} style={{ marginBottom: '0.6rem' }}>
          <p className="text-sm mb-0">
            <strong>{libelleListe(liste, language)}</strong>
          </p>
          {parCategorie.map(({ cat, items }) => (
            <p key={cat} className="text-sm mb-0">
              {iconeCategorie(cat) && <Icon name={iconeCategorie(cat)!} style={{ marginRight: '0.35em' }} />}
              {items
                .map((it) => {
                  const ref = getItem(it.item_id);
                  const nom = ref ? translateItem(ref, language).nom : it.item_id;
                  const cout = prixAvecRegles(it.item_id, it.cout, catalogue.id, rules, 'bande');
                  return `${nom} (${cout}${typeof cout === 'number' ? ` ${t('catalogueReference.gc')}` : ''}${it.note ? `, ${it.note}` : ''}${it.restriction ? `, ${it.restriction}` : ''})`;
                })
                .join(' · ')}
            </p>
          ))}
        </div>
      ))}
      {aObjetsRares && (
        <div>
          <p className="text-sm mb-0">
            <strong>{t('catalogueReference.rareItems')}</strong>
          </p>
          {catalogue.equipement_special!.map((it) => {
            const refBrut = getItem(it.item_id);
            const ref = refBrut ? translateItem(refBrut, language) : undefined;
            const cout = prixAvecRegles(it.item_id, it.cout, catalogue.id, rules, 'bande');
            return (
              <p key={it.item_id} className="text-sm mb-0">
                <Icon name="etoile" style={{ marginRight: '0.35em', color: 'var(--accent)' }} />
                <strong>{ref?.nom ?? it.item_id}</strong> ({cout}
                {typeof cout === 'number' ? ` ${t('catalogueReference.gc')}` : ''}
                {it.disponibilite ? ` — ${it.disponibilite}` : ''}) — {ref?.texte}
                {ref?.regles_speciales?.map((r) => ` ${r.nom} : ${r.texte}`).join(' ')}
              </p>
            );
          })}
        </div>
      )}
    </CollapsibleCard>
  );
}

// Référence libre du système de magie/prières. Avec un profil, résout son
// domaine et mémorise l'état replié de la carte sur sa fiche. Sans profil,
// affiche le domaine général de la bande dans le résumé du roster.
export function MagieReference({
  catalogue,
  profil,
  marqueId,
}: {
  catalogue: WarbandCatalog;
  profil?: Profile;
  // Marque du membre affiché (voir Profile.marque_requise), pour résoudre le
  // bon domaine de sorts quand la bande en propose plusieurs.
  marqueId?: string;
}) {
  const { t } = useLanguage();
  const magie = profil ? magieDuProfil(catalogue, profil, marqueId) : catalogue.magie;
  if (!magie) return null;

  const titre = (
    <>
      <Icon name="parchemin" style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
      {magie.nom} {t('catalogueReference.magieReferenceSuffix')}
    </>
  );

  const contenu = (
    <>
      <p className="text-sm text-muted">
        {magie.type} · {t('catalogueReference.die')} {magie.de}
        {!profil && magie.utilisateurs.length > 0 && (
          <>
            {' '}
            · {t('catalogueReference.users')}{' '}
            {magie.utilisateurs.map((id) => catalogue.profils.find((p) => p.id === id)?.nom ?? id).join(', ')}
          </>
        )}
        {magie.note && <> · {magie.note}</>}
      </p>
      {magie.sorts.map((s, i) => (
        <p key={i} className="text-sm mb-0">
          <strong>
            {s.resultat} — {s.nom}
          </strong>{' '}
          (diff. {s.difficulte}) : {s.texte}
          {s.note && <span className="text-muted"> — {s.note}</span>}
        </p>
      ))}
    </>
  );

  if (profil) {
    return (
      <CollapsibleCard preferenceKey="ui.personnage.magie_reference.ouvert" title={titre}>
        {contenu}
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard preferenceKey="ui.personnage.magie_reference.ouvert" title={titre}>
      {contenu}
    </CollapsibleCard>
  );
}
