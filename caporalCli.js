const fs = require("fs");
const colors = require("colors");
const CRUParser = require("./CRUParser.js");
const ICAL = require("ical.js");
const icalGene = require("ical-generator")
const vg = require("vega");
const vegalite = require("vega-lite");

const cli = require("@caporal/core").default;

//import des modules
const readme = require("./specs/readme.js");
const getSalle = require("./specs/spec1.js");
const getSallesLibres = require("./specs/spec2.js");
const getCreneauDispo = require("./specs/spec3.js")
const getCapaciteMax = require("./specs/spec4.js");
const exportEDT = require("./specs/spec5.js");
const getOccupation = require("./specs/spec6.js");
const getNbSalleCapacite = require("./specs/spec7.js")

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
  .alias('SPEC2')
	.argument('<heureDebut>', 'Heure de début pour la recherche de salle avec un interval de 30 minutes.')
	.argument('<heureFin>', 'Heure de début pour la recherche de salle avec interval de 30 minutes.')
	.argument('<jour>', 'Jour de la semaine pour la recherche (L,MA,ME,J,V,S).')
	.action(({ args, logger }) => getSallesLibres(args, logger))

  // afficher les créneaux disponible d'une salle donnée
  .command("getCreneauDispo", "Déterminer les créneaux disponible d'une salle donnée")
  .alias('SPEC3')
  .argument('<needle>', 'L ID de la salle en question')
  .action(({args, options, logger}) => getCreneauDispo(args.needle, logger))

  // afficher la capacité maximale des salles
  .command("getCapaciteMax", "Détermine la capacité maximale d'une salle donnée")
  .alias('SPEC4')
  .argument('<needle>', 'Le nom de la salle à déterminer')
  .action(({args, options, logger}) => getCapaciteMax(args.needle, logger))

  // Exporter les cours en format ICAL
  .command("exportEDT", "Export d'un type de cours de l'utilisateur entre 2 dates données")
  .alias('SPEC5')
  .argument('<ue>', "Liste des UE inscrit : ['UE1','UE2','UE3']")
  .argument('<type>', "Catégorie du cours à exporter : C / D / T")
  .argument('<jourDebut>', "Première balise pour la recherche des jours de la semaine ")
  .argument('<horaireDebut>', "Première balise pour la recherche des heures")
  .argument('<jourFin>', "Deuxième balise pour la recherche des jours de la semaine ")
  .argument('<horaireFin>', "Deuxième balise pour la recherche des heures")
  .argument('<dateDebutEDT', "Première balise pour l'affichage de l'emploi du temps")
  .argument('<dateFinEDT>', " Deuxième balise pour l'affichage de l'emploi du temps")
  .action(({args, logger}) => exportEDT(args, logger))

  // afficher le taux d'occupation des salles selectionnés
  .command("getOccupation", "Détermine le taux d'occupation des salles selectionnés")
  .alias('SPEC6')
  .argument('<file>', "Nom du fichier des taux d'occupation généré (ex : ./resultats.svg)")
  .argument('<needle>',"Le nom de la salle à connaitre le taux d'occupation séparé par des virgules")
  .action(({args, options, logger}) => getOccupation(args.file, args.needle, logger))

  // afficher le nombre de salles de classe pour une capacité d'accueil donnée
  .command("getNbSalleCapacite", "Détermine le nombre de salles par capacité d'accueil maximale")
  .alias('SPEC7')
  .action(({options, logger}) => getNbSalleCapacite(logger))


cli.run();
