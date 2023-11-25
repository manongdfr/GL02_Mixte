const fs = require("fs");
const colors = require("colors");
const CRUParser = require("./CRUParser.js");

const vg = require("vega");
const vegalite = require("vega-lite");

const cli = require("@caporal/core").default;

//import des modules
const readme = require("./specs/readme.js");
const getSalle = require("./specs/spec1.js");

cli
  .version("cru-parser-cli")
  .version("0.01")

  // readme
  .command("readme", "Lecture du fichier README.txt")
  .action(({ args, options, logger }) => readme(logger))

  // afficher les salles associées à un cours
  .command("getSalle", "Détermine l'ensemble des salles où se déroule les cours d'une matière donnée")
  .alias('SPEC1')
	.argument('<ue>', 'Le nom de l\'UE à faire correspondre avec les salles')
	.action(({args,options, logger}) => getSalle(args.ue, logger))

cli.run();
