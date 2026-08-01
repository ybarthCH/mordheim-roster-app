import type { Magie } from '../types/catalog';

export const MAGIE_MINEURE: Magie = {
  nom: 'Magie mineure',
  type: 'Magie',
  de: 'D6',
  utilisateurs: [],
  note: 'Utilisée notamment par les Mages francs-tireurs et accessible grâce au Grimoire de magie.',
  sorts: [
    {
      resultat: 1,
      id: 'flammes_de_u_zhul',
      nom: 'Flammes de U’Zhul',
      difficulte: 7,
      texte:
        'Portée 18 ps. La première figurine sur la trajectoire de la boule de feu subit une touche de Force 4. Les sauvegardes fonctionnent normalement, avec un malus de -1.',
    },
    {
      resultat: 2,
      id: 'vol_de_zimmeran',
      nom: 'Vol de Zimmeran',
      difficulte: 7,
      texte:
        'Le mage peut immédiatement se déplacer n’importe où dans les 12 ps, même au contact d’un ennemi, auquel cas il compte comme ayant chargé. S’il engage un ennemi en fuite, il lui inflige une touche automatique pendant la phase de corps à corps, puis l’adversaire fuit à nouveau s’il survit.',
    },
    {
      resultat: 3,
      id: 'frayeur_d_aramar',
      nom: 'Frayeur d’Aramar',
      difficulte: 7,
      texte:
        'Une seule figurine située à moins de 12 ps du mage doit réussir un test de Commandement ou fuir de 2D6 ps dans la direction opposée. Si elle prend la fuite, elle teste au début de chacune de ses phases de mouvement et continue à fuir jusqu’à réussir. Sans effet sur les morts-vivants et les figurines insensibles à la peur.',
    },
    {
      resultat: 4,
      id: 'fleches_argentees_d_arha',
      nom: 'Flèches Argentées d’Arha',
      difficulte: 7,
      texte:
        'Ne peut pas être lancé si le sorcier est au corps à corps. Crée D6+2 flèches utilisables pour tirer sur une figurine ennemie selon les règles normales de tir. Portée 24 ps, utilise la CT du mage et ignore les pénalités de mouvement, de portée et de couvert. Chaque flèche cause une touche de Force 3.',
    },
    {
      resultat: 5,
      id: 'chance_de_shemtek',
      nom: 'Chance de Shemtek',
      difficulte: 6,
      texte:
        'Le mage peut relancer tous ses jets ratés, mais le second résultat doit toujours être choisi. Les effets durent jusqu’au début de son prochain tour.',
    },
    {
      resultat: 6,
      id: 'lame_de_rehebel',
      nom: 'Lame de Rehebel',
      difficulte: 8,
      texte:
        'Une épée enflammée donne au mage +1 Attaque, +2 en Force et +2 en Capacité de Combat. Le mage doit réussir un test de Commandement au début de chacun de ses tours ; l’épée disparaît en cas d’échec.',
    },
  ],
};
