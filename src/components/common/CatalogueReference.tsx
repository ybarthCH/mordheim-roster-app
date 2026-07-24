import type { WarbandCatalog } from '../../types/catalog';
import { getItem } from '../../data/items';
import { estAccesGenerique, iconeCategorie } from '../../utils/shop';
import { Icon } from './Icon';

const LISTES_EQUIPEMENT = ['armes_cac', 'armes_tir', 'armures', 'divers'] as const;

// Libellés lisibles pour les clés internes de `catalogue.equipement` (ex :
// "artilleurs_de_nuln", "tireurs_delite") — ces clés sont des identifiants
// de structuration de données, pas du texte destiné à l'affichage. Complété
// au fil des bandes ; PETITS_MOTS + humaniserCle() servent de repli pour
// toute clé absente de la liste (nouvelle bande non encore renseignée).
const LIBELLES_LISTES: Record<string, string> = {
  artilleurs_de_nuln: 'Artilleurs de Nuln',
  tireurs_delite: "Tireurs d'élite",
  montures_nuln: 'Montures',
  eclaireurs: 'Éclaireurs',
  gardes_des_montagnes: 'Gardes des montagnes',
  hommes_betes: 'Hommes-bêtes',
  kermesse: 'Membres de la Kermesse',
  culte_des_possedes: 'Culte des Possédés',
  damnes: 'Damnés',
  guerriers_nains: 'Guerriers nains',
  tireurs_nains: 'Tireurs nains',
  pelerins: 'Pèlerins',
  paysans_archers: 'Paysans archers',
  style_orque: 'Style Orque',
  style_mort_vivant: 'Style Morts-vivants',
  style_empire: 'Style Empire',
  style_chaos: 'Style Chaos',
  style_skink: 'Style Skink',
  style_furie: 'Style Furie',
  ogres_trolls: 'Ogres et Trolls',
  heros: 'Héros',
  hommes_de_main: 'Hommes de main',
  guerriers_kislevites: 'Guerriers kislévites',
  heroes: 'Héros',
  morts_vivants: 'Morts-vivants',
  nains_du_chaos: 'Nains du Chaos',
  delateurs: 'Délateurs',
  heros_armes: 'Héros (armes)',
  heros_armures: 'Héros (armures)',
  chasseurs_norses: 'Chasseurs norses',
  orques_noirs: 'Orques Noirs',
  pti_meks: "P'tits Meks",
  ding_boyz: 'Ding Boyz',
  jaegers: 'Jägers',
  soeurs_de_sigmar: 'Sœurs de Sigmar',
  heros_skavens: 'Héros skavens',
  hommes_de_main_skavens: 'Hommes de main skavens',
  heros_pestilens: 'Héros Pestilens',
  hommes_de_main_pestilens: 'Hommes de main Pestilens',
  repurgateurs: 'Répurgateurs',
  seides: 'Séides',
};

const PETITS_MOTS = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'aux']);

function humaniserCle(cle: string): string {
  return cle
    .split('_')
    .map((mot, i) => (i > 0 && PETITS_MOTS.has(mot) ? mot : mot.charAt(0).toUpperCase() + mot.slice(1)))
    .join(' ');
}

function libelleListe(cle: string): string {
  return LIBELLES_LISTES[cle] ?? humaniserCle(cle);
}

// Référence libre du catalogue d'équipement d'une bande — texte indicatif
// uniquement, aucun achat automatisé. Ne garde que les objets propres à la
// bande (mutations, armes à poudre noire exclusives, objets bloqués à une
// liste précise...) : les objets génériques de la base commune sont déjà
// accessibles via le shop intégré et n'ont plus leur place ici.
export function EquipementReference({ catalogue }: { catalogue: WarbandCatalog }) {
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
    <div className="card card--tight">
      <h3>Équipement de bande (référence)</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        Objets propres à cette bande uniquement — texte libre, à titre indicatif. Les objets courants s'achètent
        directement depuis la fiche personnage.
      </p>
      {listesFiltrees.map(({ liste, parCategorie }) => (
        <div key={liste} style={{ marginBottom: '0.6rem' }}>
          <p className="text-sm mb-0">
            <strong>{libelleListe(liste)}</strong>
          </p>
          {parCategorie.map(({ cat, items }) => (
            <p key={cat} className="text-sm mb-0">
              {iconeCategorie(cat) && <Icon name={iconeCategorie(cat)!} style={{ marginRight: '0.35em' }} />}
              {items
                .map((it) => {
                  const ref = getItem(it.item_id);
                  const nom = ref?.nom ?? it.item_id;
                  return `${nom} (${it.cout}${typeof it.cout === 'number' ? ' po' : ''}${it.note ? `, ${it.note}` : ''}${it.restriction ? `, ${it.restriction}` : ''})`;
                })
                .join(' · ')}
            </p>
          ))}
        </div>
      ))}
      {aObjetsRares && (
        <div>
          <p className="text-sm mb-0">
            <strong>Objets rares</strong>
          </p>
          {catalogue.equipement_special!.map((it) => {
            const ref = getItem(it.item_id);
            return (
              <p key={it.item_id} className="text-sm mb-0">
                <Icon name="etoile" style={{ marginRight: '0.35em', color: 'var(--accent)' }} />
                <strong>{ref?.nom ?? it.item_id}</strong> ({it.cout}
                {typeof it.cout === 'number' ? ' po' : ''}
                {it.disponibilite ? ` — ${it.disponibilite}` : ''}) — {ref?.texte}
                {ref?.regles_speciales?.map((r) => ` ${r.nom} : ${r.texte}`).join(' ')}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Référence libre du système de magie/prières d'une bande. Si profilId est
// fourni, la carte ne s'affiche que si ce profil fait partie des
// utilisateurs (usage : fiche personnage d'un sorcier précis). Sans
// profilId, s'affiche dès que la bande a un système de magie (usage :
// résumé de roster global).
export function MagieReference({ catalogue, profilId }: { catalogue: WarbandCatalog; profilId?: string }) {
  const magie = catalogue.magie;
  if (!magie) return null;
  if (profilId && !magie.utilisateurs.includes(profilId)) return null;

  return (
    <div className="card card--tight">
      <h3>
        <Icon name="parchemin" style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
        {magie.nom} (référence)
      </h3>
      <p className="text-sm text-muted">
        {magie.type} · dé {magie.de} · utilisateurs :{' '}
        {magie.utilisateurs.map((id) => catalogue.profils.find((p) => p.id === id)?.nom ?? id).join(', ')}
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
    </div>
  );
}
