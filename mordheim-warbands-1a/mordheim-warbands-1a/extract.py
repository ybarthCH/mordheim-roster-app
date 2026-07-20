import xml.etree.ElementTree as ET
import json
import os
import glob

NS = {'bs': 'http://www.battlescribe.net/schema/catalogueSchema'}

STAT_MAP = {
    "M": "M", "WS": "CC", "BS": "CT", "S": "F",
    "T": "E", "W": "PV", "I": "I", "A": "A", "LD": "Cd"
}

SKILL_CATEGORY_MAP = {
    "combat skills": "combat",
    "shooting skills": "tir",
    "strength skills": "force",
    "academic skills": "academique",
    "speed skills": "vitesse",
    "special skills": "special",
}


def local(tag):
    return tag.split('}')[-1]


def get_stats(profile_el):
    stats = {}
    chars = profile_el.find('bs:characteristics', NS)
    if chars is None:
        return None
    for c in chars.findall('bs:characteristic', NS):
        name = c.get('name')
        key = STAT_MAP.get(name)
        if key:
            try:
                stats[key] = int(c.text)
            except (TypeError, ValueError):
                stats[key] = c.text
    return stats if stats else None


def get_cost(entry_el):
    costs = entry_el.find('bs:costs', NS)
    if costs is None:
        return None
    for c in costs.findall('bs:cost', NS):
        if c.get('name', '').strip().lower() in ('pts', 'gc'):
            try:
                return int(float(c.get('value')))
            except (TypeError, ValueError):
                return None
    return None


def get_category(entry_el):
    cats = entry_el.find('bs:categoryLinks', NS)
    if cats is None:
        return None
    for c in cats.findall('bs:categoryLink', NS):
        name = (c.get('name') or '').strip().lower()
        if name == 'heroes':
            return 'heros'
        if name == 'henchmen':
            return 'homme_de_main'
    return None


def get_max_constraint(entry_el):
    constraints = entry_el.find('bs:constraints', NS)
    if constraints is None:
        return None
    for c in constraints.findall('bs:constraint', NS):
        if c.get('type') == 'max':
            try:
                return int(c.get('value'))
            except (TypeError, ValueError):
                return None
    return None


def get_skill_access(entry_el):
    """Find the Skills selectionEntryGroup and list referenced skill categories."""
    accesses = set()
    groups = entry_el.find('bs:selectionEntryGroups', NS)
    if groups is None:
        return []
    for g in groups.findall('bs:selectionEntryGroup', NS):
        if (g.get('name') or '').strip().lower() != 'skills':
            continue
        entrylinks = g.find('bs:entryLinks', NS)
        if entrylinks is None:
            continue
        for link in entrylinks.findall('bs:entryLink', NS):
            name = (link.get('name') or '').strip().lower()
            mapped = SKILL_CATEGORY_MAP.get(name)
            if mapped:
                accesses.add(mapped)
    return sorted(accesses)


def get_top_level_rules(root):
    """Warband-level special rules from the <rules> section."""
    rules_out = []
    rules_el = root.find('bs:rules', NS)
    if rules_el is None:
        return rules_out
    for r in rules_el.findall('bs:rule', NS):
        name = r.get('name')
        desc_el = r.find('bs:description', NS)
        text = desc_el.text.strip() if desc_el is not None and desc_el.text else ""
        rules_out.append({"nom": name, "texte": text})
    return rules_out


def slugify(name):
    return (
        name.strip().lower()
        .replace(" ", "_")
        .replace("'", "")
        .replace("(", "")
        .replace(")", "")
    )


def extract_warband(path):
    tree = ET.parse(path)
    root = tree.getroot()

    catalogue_name = root.get('name', os.path.basename(path))
    warband_id = slugify(catalogue_name.split('(')[0])

    profils = []
    selectionEntries = root.find('bs:selectionEntries', NS)
    if selectionEntries is None:
        return None

    for se in selectionEntries.findall('bs:selectionEntry', NS):
        entry_name = se.get('name')
        category = get_category(se)
        if category is None:
            continue  # skip non hero/henchmen entries (trading post upgrades etc.)

        cost = get_cost(se)
        max_constraint = get_max_constraint(se)
        skill_access = get_skill_access(se)

        if category == 'heros':
            # profile stats are directly under this selectionEntry
            profiles_el = se.find('bs:profiles', NS)
            stats = None
            if profiles_el is not None:
                p = profiles_el.find('bs:profile', NS)
                if p is not None:
                    stats = get_stats(p)
            profils.append({
                "id": slugify(entry_name),
                "nom": entry_name,
                "type": "heros",
                "unique": max_constraint == 1,
                "max": max_constraint,
                "cout": cost,
                "stats": stats,
                "acces_competences": skill_access,
            })
        else:
            # henchmen: unit type. Stats/profile usually live directly on
            # the unit selectionEntry itself (e.g. "Marksmen" unit ->
            # profile named "Marksman"). Fall back to nested model entry
            # if not found there.
            stats = None
            model_cost = cost
            profiles_el = se.find('bs:profiles', NS)
            if profiles_el is not None:
                p = profiles_el.find('bs:profile', NS)
                if p is not None:
                    stats = get_stats(p)

            nested = se.find('bs:selectionEntries', NS)
            if nested is not None:
                for child in nested.findall('bs:selectionEntry', NS):
                    if child.get('type') == 'model':
                        if stats is None:
                            child_profiles_el = child.find('bs:profiles', NS)
                            if child_profiles_el is not None:
                                p = child_profiles_el.find('bs:profile', NS)
                                if p is not None:
                                    stats = get_stats(p)
                        if model_cost is None:
                            model_cost = get_cost(child)
            profils.append({
                "id": slugify(entry_name),
                "nom": entry_name,
                "type": "homme_de_main",
                "cout": model_cost,
                "stats": stats,
                "acces_competences": skill_access,
                "acces_competences_a_verifier": len(skill_access) == 0,
            })

    warband = {
        "id": warband_id,
        "nom": catalogue_name,
        "grade": "1a",
        "source": "BSData",
        "regles_speciales": get_top_level_rules(root),
        "profils": profils,
    }
    return warband


def main():
    out_dir = "output"
    os.makedirs(out_dir, exist_ok=True)

    skip_files = {"Characters.cat", "data.cat"}
    cat_files = sorted(glob.glob("*.cat"))

    all_warbands = []
    for path in cat_files:
        fname = os.path.basename(path)
        if fname in skip_files:
            continue
        try:
            wb = extract_warband(path)
            if wb and wb["profils"]:
                all_warbands.append(wb)
                out_path = os.path.join(out_dir, wb["id"] + ".json")
                with open(out_path, "w", encoding="utf-8") as f:
                    json.dump(wb, f, ensure_ascii=False, indent=2)
                print(f"OK  {fname:35s} -> {out_path}  ({len(wb['profils'])} profils)")
            else:
                print(f"SKIP {fname:35s} (aucun profil héros/homme de main trouvé)")
        except Exception as e:
            print(f"ERR {fname:35s} {e}")

    # combined file
    with open(os.path.join(out_dir, "_all_warbands.json"), "w", encoding="utf-8") as f:
        json.dump(all_warbands, f, ensure_ascii=False, indent=2)
    print(f"\n{len(all_warbands)} bandes extraites -> output/_all_warbands.json")


if __name__ == "__main__":
    main()
