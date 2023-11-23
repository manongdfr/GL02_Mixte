const fs = require("fs");
const colors = require("colors");
const VpfParser = require("./CRUParser.js");

const vg = require("vega");
const vegalite = require("vega-lite");

const cli = require("@caporal/core").default;

//import des modules
const readme = require("./specs/readme.js");

cli
  .version("cru-parser-cli")
  .version("0.01")

  // readme
	.command('readme', 'Read the README.txt file')
	.action(({args,options, logger}) => readme(logger))	
  

cli.run();
