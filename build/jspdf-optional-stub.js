// Bouchon de build substitué à `html2canvas` et `dompurify` (voir
// resolve.alias dans vite.config.ts).
//
// jsPDF ne charge ces deux paquets que depuis sa méthode `.html()`
// (HTML -> PDF), via un `import()` dynamique placé dans un try/catch qui
// retombe déjà sur `Promise.reject(new Error("Could not load ..."))` quand la
// résolution échoue — voir jspdf/dist/jspdf.es.js, autour de la ligne 13482.
//
// utils/pdfExport.ts n'appelle jamais `.html()` : il construit ses fiches
// uniquement avec les API texte de jsPDF (setFont/setFontSize/text) et
// jspdf-autotable. Les deux paquets étaient donc embarqués dans le dist sans
// qu'aucun chemin de code puisse les atteindre, pour ~370 Ko (html2canvas
// 195 Ko + dompurify 27 Ko + les polyfills core-js qu'ils entraînent).
//
// Si un jour une fiche doit passer par `jsPDF.html()`, retirer l'alias
// correspondant dans vite.config.ts — rien d'autre à défaire.
const indisponible = () => {
  throw new Error(
    "html2canvas/dompurify sont volontairement exclus du bundle (voir build/jspdf-optional-stub.js) : jsPDF.html() n'est pas utilisé par cette app."
  );
};

export default indisponible;
export const sanitize = indisponible;
