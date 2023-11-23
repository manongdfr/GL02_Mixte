const fs = require("fs");
const colors = require("colors");
const CRUParser = require("./CRUParser.js");

const vg = require("vega");
const vegalite = require("vega-lite");

const cli = require("@caporal/core").default;

//import des modules
const readme = require("./specs/readme.js");

cli
  .version("cru-parser-cli")
  .version("0.01")

  // readme
  .command("readme", "Read the README.txt file")
  .action(({ args, options, logger }) => readme(logger))

  // test
  .command("check", "Check if <file> is a valid Cru file")
  .argument("<file>", "The file to check with Cru parser")
  .action(({ args, options, logger }) => {
    fs.readFile(args.file, "utf8", function (err, data) {
      if (err) {
        return logger.warn(err);
      }

      var analyzer = new CRUParser(options.showTokenize, options.showSymbols);
      let x = analyzer.parse(data);

      console.log(x)

      // if (analyzer.errorCount === 0) {
      //   logger.info("The .cru file is a valid CRU file".green);
      // } else {
      //   logger.info("The .cru file contains error".red);
      // }

      // logger.debug(analyzer.parsedPOI);
    });
  });

cli.run();
