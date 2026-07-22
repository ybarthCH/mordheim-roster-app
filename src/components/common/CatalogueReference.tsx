import type { WarbandCatalog } from '../../types/catalog';
import { getItem } from '../../data/items';
import { estAccesGenerique } from '../../utils/shop';

const LISTES_EQUIPEMENT = ['armes_cac', 'armes_tir', 'armures', 'divers'] as const;

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
            <strong>{liste}</strong>
          </p>
          {parCategorie.map(({ cat, items }) => (
            <p key={cat} className="text-sm mb-0">
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
      <h3>{magie.nom} (référence)</h3>
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
