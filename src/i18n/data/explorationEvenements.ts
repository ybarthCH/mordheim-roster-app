import type { Language } from '../../state/useLanguage';
import type { EvenementExploration } from '../../data/tableExplorationEvenements';

type LigneSousTableTraduite = { resultat: string };
type LigneTresorTraduite = { element: string };
type EvenementTraduit = {
  nom?: string;
  texte?: string;
  regle?: string[];
  sousTable?: LigneSousTableTraduite[];
  sousTableTresor?: LigneTresorTraduite[];
};

// Traductions du Tableau d'Exploration (doubles/triples/.../sextuples),
// remplies progressivement — voir translateItem dans i18n/data/items.ts pour
// le même principe de repli. Clé = id de l'événement
// (src/data/tableExplorationEvenements.ts).
export const evenementsEn: Record<string, EvenementTraduit> = {
  // Doubles
  puits: {
    nom: 'Well',
    texte:
      "Public wells - Mordheim had several - were topped with roofs supported by pillars decorated with carvings and fountains. The city was proud of its magnificent water distribution network. Alas, like all the other wells, this one is dilapidated and no doubt polluted by wyrdstone.",
    regle: [
      "Choose one of your Heroes and roll 1D6. If the result is less than or equal to his Toughness, he finds a shard of wyrdstone at the bottom of the well. Otherwise, the Hero drinks tainted water, falls ill, and must miss the next game.",
    ],
  },
  echoppe: {
    nom: 'Stall',
    texte:
      "This merchants' guild stall has already been looted. Even so, a few items still lie scattered among the debris here and there. Some are useful, like iron pots and rolls of cloth. All sorts of small trinkets are also scattered about the room, but their usefulness is limited in a devastated and nearly deserted city.",
    regle: [
      "After a thorough search, you find D6 gc worth of loot. On a 1 you also find a Lucky Charm (see the Equipment chapter page 53).",
    ],
  },
  cadavre: {
    nom: 'Corpse',
    texte:
      "You find a still-warm corpse, a chipped dagger stuck in its back. Surprisingly, its belongings have not been stolen.",
    regle: ['Roll 1D6 to find out what you discover on the corpse when you search it:'],
    sousTable: [
      { resultat: 'D6 gc' },
      { resultat: 'Dagger' },
      { resultat: 'Axe' },
      { resultat: 'Sword' },
      { resultat: 'Light armour' },
    ],
  },
  vagabond: {
    nom: 'Vagrant',
    texte:
      "Your warband encounters one of Mordheim's survivors, who long ago lost his sanity along with all his belongings.",
    regle: [
      "Skaven warbands may sell the vagrant for 2D6 gc to Clan Eshin's agents (who will eat him or make him a slave).",
      "Possessed warbands may sacrifice the poor wretch to the glory of the Chaos gods. The warband leader gains +1 experience point.",
      'Undead warbands may kill him and turn him into a free Zombie.',
      "Other warbands may question the vagrant about the city. On your next roll on the Exploration table, roll one extra die, and cancel one result of your choice. (For example, if you have three Heroes, roll four dice and keep the three results of your choice.)",
    ],
  },
  carrosse_retourne: {
    nom: 'Overturned Carriage',
    texte:
      "An overturned carriage is wedged in a collapsed gateway. It is a covered carriage, the kind used by nobles to travel from the city to their country estate. What is it doing here, since all the important people left long ago?",
    regle: ['Roll 1D6 to find out what you discover:'],
    sousTable: [
      { resultat: 'Map of Mordheim (see Equipment)' },
      { resultat: 'A purse containing 2D6 gc' },
      {
        resultat:
          "A sword and a dagger encrusted with jewels. You may keep them or sell them. You will get 10 gc for the sword and 2 gc for the dagger — double the usual selling price (see the Trading chapter for the rules on selling items).",
      },
    ],
  },
  masures_delabrees: {
    nom: 'Ramshackle Hovels',
    texte:
      "The street is lined with ramshackle, rather unstable-looking hovels. There isn't much to loot in the area.",
    regle: ['You find D6 gc worth of loot amid the ruins.'],
  },
  // Triples
  taverne: {
    nom: 'Tavern',
    texte:
      "You identify the ruins of a tavern by the sign that hasn't yet fallen from the wall. The upper floor has collapsed, but the cellars carved into the rock still hold intact barrels.",
    regle: [
      "You could easily sell the barrels and their contents for a good price, but alas, your men are drunkards! The warband leader must take a Leadership test. If successful, the warband immediately gains 4D6 gc from selling the alcoholic beverages.",
      "If failed, the men empty most of the barrels despite the leader's threats and curses. What little alcohol remains fetches D6 gc once the warband returns to camp.",
      'Undead, Witch Hunters, and Sisters of Sigmar automatically pass the test, as vulgar alcoholic beverages hold no interest for them.',
    ],
  },
  forge: {
    nom: 'Forge',
    texte:
      "The furnace and overturned anvil clearly indicate this place's former function. The iron and tools were stolen long ago, coal and slag litter the floor, but there may still be weapons among the rubble.",
    regle: ['Roll 1D6 to find out what you discover:'],
    sousTable: [
      { resultat: 'Sword' },
      { resultat: 'Two-handed weapon' },
      { resultat: 'Flail' },
      { resultat: 'D3 Halberds' },
      { resultat: 'Cavalry lance' },
      { resultat: "2D6 gc worth of metal (add the value to your warband's treasury)" },
    ],
  },
  prisonniers: {
    nom: 'Prisoners',
    texte:
      "A muffled noise comes from a nearby building, inside which you discover a group of well-dressed individuals locked in a cellar. They may be captives left there by cultists, awaiting sacrifice on Geheimnisnacht.",
    regle: [
      "Possessed warbands may sacrifice the victims (likely finishing the abductors' work). They gain D3 experience points distributed among the warband's Heroes.",
      'Undead warbands may kill the prisoners and gain D3 free Zombies.',
      'Skaven may sell the prisoners as slaves for 3D6 gc.',
      "Other warbands may escort the prisoners out of the city and receive a reward of 2D6 gc. In addition, one of the captives decides to join the warband. If you have the necessary equipment to outfit the recruit, you may add a new Henchman to any human group in your warband (with the same profile as the rest of the group, even if they have already advanced).",
    ],
  },
  atelier_facteur_arc: {
    nom: "Bowyer's Workshop",
    texte:
      "This hovel was once the workshop of a bow and arrow maker. The floor is littered with bundles of yew and willow wood.",
    regle: ['Roll 1D6 to find out what you discover:'],
    sousTable: [
      { resultat: 'D3 Short bows' },
      { resultat: 'D3 Bows' },
      { resultat: 'D3 Long bows' },
      { resultat: 'Quiver of hunting arrows' },
      { resultat: 'D3 Crossbows' },
    ],
  },
  marche_couvert: {
    nom: 'Covered Market',
    texte:
      "The hall where grain trading once took place was built on pillars, above the marketplace. The upper level is heavily damaged but still provides decent shelter. What remains of the last market day, mostly broken pots and iron containers, still covers the stalls.",
    regle: ['You discover several items with a total value of 2D6 gc.'],
  },
  debiteur_reconnaissant: {
    nom: 'Grateful Debtor',
    texte:
      "As you head back to your camp, you run into an old acquaintance. The man has come to repay you for an old favour or debt.",
    regle: [
      "You gain the free services of any Hired Sword (choose from those available to your warband) for the duration of the next battle. Afterwards, he leaves unless you want to keep paying him as usual. See the Hired Swords chapter on page 147.",
    ],
  },
  // Quadruples
  fabrique_armes_a_feu: {
    nom: 'Firearms Workshop',
    texte:
      "You find the workshop of a Dwarf black-powder weapons maker. The doors have been smashed in and the rooms looted, but a few metal chests remain intact.",
    regle: ['Roll 1D6 to find out what you discover:'],
    sousTable: [
      { resultat: 'Blunderbuss' },
      { resultat: 'Pair of pistols' },
      { resultat: 'Pair of duelling pistols' },
      { resultat: 'D3 Handguns' },
      { resultat: 'D3 Superior black powder flasks' },
      { resultat: 'Hochland long rifle' },
    ],
  },
  temple: {
    nom: 'Temple',
    texte:
      "Your warband discovers a temple in such poor condition that it's hard to tell which god was worshipped there. A few patches of frescoes are still visible on the walls, but they have been defaced by heretics. Fragments of broken statues lie among the rubble; some objects seem to have once been covered in gold leaf, most of which has since been scraped off.",
    regle: [
      'Your warband may loot the temple and gain 3D6 gc worth of loot.',
      "Sisters of Sigmar or Witch Hunters may recover a few holy relics from the temple. They then gain 3D6 gc as well as a blessing from the gods. One of their weapons (player's choice) is now blessed and always wounds all Undead models (except Ghouls, Necromancers, and Pariahs) and Possessed models (except Initiates and Beastmen) on a to-wound roll of 2+.",
    ],
  },
  hotel_particulier: {
    nom: 'Townhouse',
    texte:
      "This three-storey house was once part of a row of houses overlooking a narrow alley. The street is now devastated, but this house remains largely intact. As you explore it, you discover that the attic juts out so far above the alley that you can climb out the window to enter the house opposite.",
    regle: ['Your warband finds 3D6 gc worth of loot.'],
  },
  armurerie: {
    nom: 'Armoury',
    texte:
      "A breastplate hanging from a pole draws your attention to this place. The workshop is in ruins and the forge has been destroyed. Searching through the rubble, you find various half-finished pieces of armour.",
    regle: ['Roll 1D6 to find out what you discover:'],
    sousTable: [
      { resultat: 'D3 Shields or bucklers (your choice)' },
      { resultat: 'D3 Helmets' },
      { resultat: 'D3 Light armour' },
      { resultat: 'D3 Heavy armour' },
      { resultat: 'Ithilmar armour' },
    ],
  },
  cimetiere: {
    nom: 'Cemetery',
    texte:
      "You find an old cemetery whose many graves, with their grim, gargoyle-adorned monuments, are overgrown with vegetation. Wrought iron has been torn from some of the tombs and the headstones have been knocked over. It seems some of the crypts have already been visited by grave robbers.",
    regle: [
      'Any warband except Witch Hunters and Sisters of Sigmar may loot the crypts and graves to gain D6x10 gc worth of loot. If you decide to loot the cemetery, the entire enemy warband will hate all your models in the next game you play against Sisters of Sigmar or Witch Hunters. Note this on your warband sheet.',
      "Sisters of Sigmar and Witch Hunters may reseal the graves. They will be rewarded for their piety with D6 experience points distributed among the warband's Heroes.",
    ],
  },
  catacombes: {
    nom: 'Catacombs',
    texte: 'You find an entrance to the catacombs and tunnels that stretch beneath Mordheim.',
    regle: [
      'You may use the new tunnels you have just discovered in the next battle you play. Deploy up to three warriors at ground level (neither Rat Ogres nor Possessed), anywhere on the battlefield. They are placed at the end of the first player turn and cannot start within 8" of an enemy model.',
      'This represents warriors infiltrating through enemy lines and using the tunnels to catch their enemies by surprise.',
    ],
  },
  // Quintuples
  maison_usurier: {
    nom: "Moneylender's House",
    texte:
      "A large manor built of dressed stone has weathered the cataclysm rather well. A coat of arms adorns the gate, but it has been vandalised and is no longer identifiable. The door was smashed in with an axe, and what remains of it still hangs from its hinges.",
    regle: ['Inside, you find D6x10 gc to add to your treasury amid the rubble.'],
  },
  laboratoire_alchimiste: {
    nom: "Alchemist's Laboratory",
    texte:
      "A narrow staircase leads to a sort of crypt that was once an alchemist's laboratory. The sign hangs on by only one of its fittings above the entrance. The building seems to have been in use for centuries but did not weather the cataclysm very well. The floor tiles are engraved with strange symbols, and maps and astrological symbols are painted on the walls.",
    regle: [
      "You find 3D6 gc amid the ruins, as well as an old notebook. One of your Heroes may study it: the knowledge he finds within allows him to choose from the Academic skill list in addition to his usual lists whenever an advance roll grants him a new skill.",
    ],
  },
  joaillerie: {
    nom: "Jeweller's Shop",
    texte:
      "The homes in the jewellers' quarter were thoroughly looted long ago. Even the rubble has been turned over many times in search of scraps of gold and gems. Even so, a few small items of value were overlooked.",
    regle: [
      'Roll 1D6 to find out what you discover:',
      "If your warband does not sell the gems, one of your Heroes may keep them and wear them proudly. He then gains +1 to his rolls to find rare items, as merchants flock around a warrior who appears so wealthy.",
    ],
    sousTable: [
      { resultat: 'Quartz worth D6x5 gc' },
      { resultat: 'Amethyst worth 20 gc' },
      { resultat: 'Necklace worth 50 gc' },
      { resultat: 'Ruby worth D6x15 gc' },
    ],
  },
  maison_marchand: {
    nom: "Merchant's House",
    texte:
      "The merchant's house stands next to the docks. A warehouse beneath a stone vault holds barrels and bundles of cloth. The foodstuffs were looted or eaten long ago, and huge rats infest the mouldy bundles. Stairs lead up to living quarters solidly built from thick beams. Despite the damage, you think you can reach them, though caution is advised!",
    regle: [
      "Inside, you find several valuable items you can sell for 2D6x5 gc. If you roll a double, instead of finding gold, you discover a medallion of the Order of Free Merchants. A Hero in possession of this medallion gains the Haggle skill.",
    ],
  },
  batiment_ecroule: {
    nom: 'Collapsed Building',
    texte:
      "The comet almost completely destroyed this building, making it very dangerous to explore. However, such places are also where you have the best chance of finding shards of wyrdstone.",
    regle: [
      "You find D3 shards of wyrdstone amid the rubble. In addition, make a Leadership test for your warband leader. If successful, a war dog that was guarding the building is adopted by your warband.",
    ],
  },
  entree_catacombes_5: {
    nom: 'Entrance to the Catacombs',
    texte:
      "You find a well-hidden entrance leading to the dark catacombs that stretch beneath Mordheim. Despite the entrance's uninviting look, the tunnels will save you hours during your searches.",
    regle: [
      "You may use these tunnels to explore Mordheim more efficiently. From now on, you may re-roll one die on rolls on the Exploration table. Note this on your warband sheet. If you find another catacomb entrance, you do not gain an additional re-roll, but you may still obtain more through other means.",
    ],
  },
  // Sextuples
  la_fosse: {
    nom: 'The Pit',
    texte:
      "You come within sight of the Pit, the enormous crater carved out by the comet. A black cloud still rises from it, but you can see wyrdstone everywhere. This is the domain of the Lord of Shadows, the Master of the Possessed, and no one is welcome there, not even his own servants!",
    regle: [
      "If you wish, you may send one of your Heroes to search for wyrdstone. Roll 1D6. On a roll of 1 the Hero is devoured by the Pit's guardians and does not return. On a 2 or higher, he returns with D6+1 shards of wyrdstone.",
    ],
  },
  tresor_cache: {
    nom: 'Hidden Treasure',
    texte:
      "Deep within Mordheim, you discover a hidden chest bearing the coat of arms of one of the city's noble families.",
    regle: [
      "You find the following items when you open the chest. Roll separately for each item on the list (except for the Gold Crowns) to see if you find it. For example, you find the Wyrdstone on a roll of 4+.",
    ],
    sousTableTresor: [
      { element: 'D3 shards of wyrdstone' },
      { element: '5D6x5 gc' },
      { element: 'Sacred relic' },
      { element: 'Heavy armour' },
      { element: 'D3 gems worth 10 gc each' },
      { element: 'Elven cloak' },
      { element: 'Holy book' },
      { element: 'Magic item' },
    ],
  },
  forge_naine: {
    nom: 'Dwarf Forge',
    texte:
      "You find a solidly built stone workshop. A runic inscription indicates it was once an ancient Dwarf forge.",
    regle: ['Roll 1D6 to find out what you discover:'],
    sousTable: [
      { resultat: 'D3 Two-handed axes' },
      { resultat: 'D3 Heavy armour' },
      { resultat: 'Gromril axe' },
      { resultat: 'Gromril hammer' },
      { resultat: 'Gromril two-handed axe' },
      { resultat: 'Gromril armour' },
    ],
  },
  bande_massacree: {
    nom: 'Slaughtered Warband',
    texte:
      "You find the bodies of an entire warband. Corpses torn apart by some monstrous creature litter the ruins. A huge silhouette, which appears to be an enormous possessed beast, vanishes into the darkness.",
    regle: [
      "After burying them (Sisters of Sigmar or Witch Hunters), eating them (Skaven or Undead), or robbing them (everyone else!) you find the following items. Roll 1D6 separately for each item (except the gold and daggers) to see if you find it. For example, you find the light armour on a roll of 4+.",
    ],
    sousTableTresor: [
      { element: '3D6x5 gc' },
      { element: 'D3 Light armour' },
      { element: 'Heavy armour' },
      { element: 'D6 Daggers' },
      { element: 'Map of Mordheim (see p.55)' },
      { element: 'D3 Halberds' },
      { element: 'D3 Swords' },
      { element: 'D3 Shields' },
      { element: 'D3 Bows' },
      { element: 'D3 Helmets' },
    ],
  },
  arene: {
    nom: 'Arena',
    texte:
      "There was a time when Mordheim was famous for its duellists and gladiators. You have just found one of the places where these warriors were trained. The place is full of training equipment and weapons.",
    regle: [
      "You find a training manual, which you may sell for 100 gc or give to one of your Heroes. The knowledge he finds within allows him to choose from the Combat skill list in addition to his usual lists whenever an advance roll grants him a new skill, and his Weapon Skill may now advance one point beyond the normal maximum (for example, a human's Weapon Skill with the book may now advance to a maximum of 7).",
    ],
  },
  villa_de_noble: {
    nom: "Noble's Villa",
    texte:
      "You find a beautiful, partially destroyed house. It has already been looted and the furniture stripped of anything valuable. High-quality pottery lies shattered all over the floor.",
    regle: ['Roll 1D6:'],
    sousTable: [
      { resultat: "D6x10 gc worth of items and gold to add to your treasury" },
      { resultat: 'D6 vials of purple shadow' },
      { resultat: 'A magic item hidden in a secret alcove — roll on the Magic Items table.' },
    ],
  },
};

// N'affecte que l'affichage (carte détaillée de l'événement, sous-tables) —
// le texte réellement consigné dans le journal post-bataille reste toujours
// celui de `EvenementExploration` d'origine (français), exactement comme
// pour translateItem vis-à-vis des achats d'équipement.
export function translateEvenementExploration<T extends EvenementExploration>(ev: T, language: Language): T {
  if (language !== 'en') return ev;
  const en = evenementsEn[ev.id];
  if (!en) return ev;
  return {
    ...ev,
    nom: en.nom ?? ev.nom,
    texte: en.texte ?? ev.texte,
    regle: en.regle ?? ev.regle,
    sousTable: ev.sousTable?.map((l, i) => {
      const lEn = en.sousTable?.[i];
      return lEn ? { ...l, resultat: lEn.resultat } : l;
    }),
    sousTableTresor: ev.sousTableTresor?.map((l, i) => {
      const lEn = en.sousTableTresor?.[i];
      return lEn ? { ...l, element: lEn.element } : l;
    }),
  };
}
