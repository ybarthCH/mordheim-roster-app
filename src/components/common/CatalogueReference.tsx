import type { WarbandCatalog } from '../../types/catalog';

const LISTES_EQUIPEMENT = ['armes_cac', 'armes_tir', 'armures', 'divers'] as const;

// Référence libre du catalogue d'équipement d'une bande — texte indicatif
// uniquement, aucun achat automatisé. Utilisée à la fois sur le roster
// global (résumé de bande) et sur chaque fiche personnage.
export function EquipementReference({ catalogue }: { catalogue: WarbandCatalog }) {
  const aEquipement = !!catalogue.equipement;
  const aObjetsRares = (catalogue.equipement_special?.length ?? 0) > 0;
  if (!aEquipement && !aObjetsRares) return null;

  return (
    <div className="card card--tight">
      <h3>Équipement (référence)</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        Texte libre, à titre indicatif — aucun achat automatisé.
      </p>
      {catalogue.equipement &&
        Object.entries(catalogue.equipement).map(([liste, groupes]) => (
          <div key={liste} style={{ marginBottom: '0.6rem' }}>
            <p className="text-sm mb-0">
              <strong>{liste}</strong>
            </p>
            {LISTES_EQUIPEMENT.map(
              (cat) =>
                groupes[cat] &&
                groupes[cat]!.length > 0 && (
                  <p key={cat} className="text-sm mb-0">
                    {groupes[cat]!
                      .map(
                        (it) =>
                          `${it.nom} (${it.cout}${typeof it.cout === 'number' ? ' po' : ''}${it.note ? `, ${it.note}` : ''}${it.restriction ? `, ${it.restriction}` : ''})`
                      )
                      .join(' · ')}
                  </p>
                )
            )}
          </div>
        ))}
      {aObjetsRares && (
        <div>
          <p className="text-sm mb-0">
            <strong>Objets rares</strong>
          </p>
          {catalogue.equipement_special!.map((it) => (
            <p key={it.id} className="text-sm mb-0">
              <strong>{it.nom}</strong> ({it.cout}
              {typeof it.cout === 'number' ? ' po' : ''}
              {it.disponibilite ? ` — ${it.disponibilite}` : ''}) — {it.texte}
              {it.regles_speciales?.map((r) => ` ${r.nom} : ${r.texte}`).join(' ')}
              {it.note && <span className="text-muted"> ({it.note})</span>}
            </p>
          ))}
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
