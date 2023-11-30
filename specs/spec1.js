const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

function spec1(args, logger) {
  for (let i = 0; i < tabAlph.length; i++) {
    fs.readFile(
      "SujetA_data/" + tabAlph[i] + "/edt.cru",
      "utf8",
      function (err, data) {
        if (err) {
          return logger.warn(err);
        }
        analyzer = new CRUParser();
        analyzer.parse(data);


        let CRUAFiltrer = analyzer.parsedCRU;
        let CRUFiltres = [];
        let uniqueCru = [];

        //à filtrer
        for (let i = 0; i < CRUAFiltrer.length; i++) {
          let ueCurrent = analyzer.parsedCRU[i].ue;
          if (ueCurrent == args) {
            CRUFiltres.push(CRUAFiltrer[i].salle);
            
            //!\ filtrer les doubons /!\
            uniqueCru = CRUFiltres.filter(function (value, index, array) {
                return array.indexOf(value) === index;
            });
          }
        }
        
        console.log(uniqueCru)

        //answer
        if (uniqueCru.length > 0) {
          for (let i = 0; i < uniqueCru.length; i++) {
            console.log(
              "Les cours de l'UE ",
              args,
              " se déroulent dans les salles suivantes :"
            );
              for (i = 0; i < uniqueCru.length; i++) {
                console.log("---- ", uniqueCru[i], " ----");
              }
          }
        } else {
          //logger.warn("ce cours n'a pas de salle attribuée");
        }
      }
    );
  }
}

module.exports = spec1;
