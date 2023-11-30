const fs = require("fs");
const colors = require("colors");
const CRUParser = require("./CRUParser.js");

const vg = require("vega");
const vegalite = require("vega-lite");

const cli = require("@caporal/core").default;

//import des modules
const readme = require("./specs/readme.js");
const getSalle = require("./specs/spec1.js");
const getSallesLibres = require("./specs/spec2.js");
const getCapaciteMax = require("./specs/spec4.js");
const getOccupation = require("./specs/spec6.js");

cli
  .version("cru-parser-cli")
  .version("0.01")

  // readme
  .command("readme", "Lecture du fichier README.txt")
  .action(({ args, options, logger }) => readme(logger))

  // afficher les salles associées à un cours
  .command("getSalle", "Détermine l'ensemble des salles où se déroule les cours d'une matière donnée")
  .alias('SPEC1')
	.argument('<needle>', 'Le nom de l\'UE à faire correspondre avec les salles')
	.action(({args,options, logger}) => getSalle(args.needle, logger))

  //Permet de trouver quelle(s) salle(s) est/sont libre(s) pour un créneau donné
	.command('getSallesLibres', 'Affiche les salles qui sont libres selon un créneau')
	.argument('<heureDebut>', 'Heure de début pour la recherche de salle avec un interval de 30 minutes (Ex: 10:00 ou 10:30 ou 11:00 ...).')
	.argument('<heureFin>', 'Heure de début pour la recherche de salle avec interval de 30 minutes (Ex: 10:00 ou 10:30 ou 11:00 ...).')
	.argument('<jour>', 'Jour de la semaine pour la recherche (L,MA,ME,J,V,S).')
	.action(({ args, logger }) => getSallesLibres(args, logger))

  // afficher la capacité maximale des salles
  .command("getCapaciteMax", "Détermine la capacité maximale d'une salle donnée")
  .alias('SPEC4')
  .argument('<needle>', 'Le nom de la salle à déterminer')
  .action(({args, options, logger}) => getCapaciteMax(args.needle, logger))

  // afficher le taux d'occupation des salles selectionnés
  .command("getOccupation", "Détermine le taux d'occupation des salles selectionnés")
  .alias('SPEC6')
  .argument('<needle>',"Le nom de la salle à connaitre le taux d'occupation séparé par des virgules")
  .action(({args, options, logger}) => getOccupation(args.needle, logger))

  // afficher le nombre de salles de classe pour une capacité d'accueil donnée
  .command("getNbSalleCapacite", "Détermine le nombre de salles par capacité d'accueil maximale")
  .alias('SPEC7')
  .argument('<needle>',"Pas d'argument car on veut le nb de salles correspondant à chaque capacité")
  .action(({args, options, logger}) => getNbSalleCapacite(args.needle, logger))


cli.run();
