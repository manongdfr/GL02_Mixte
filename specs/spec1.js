const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];
outputList = []

function spec1(args,notTesting, logger) {
  let promises = [];
  for (let i = 0; i < tabAlph.length; i++) {
    promises.push(
      new Promise((resolve, reject) => {
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
            resolve();

            //answer
            if (uniqueCru.length > 0) {
              for (let i = 0; i < uniqueCru.length; i++) {
                if(notTesting){
                  console.log(
                    "Les cours de l'UE".blue,
                    args.blue,
                    "se déroulent dans les salles suivantes :".blue
                  );
                }
                
                  for (i = 0; i < uniqueCru.length; i++) {
                    
                    output = ("---- "+ uniqueCru[i]+ " ----")
                    if(notTesting){
                      console.log(output);
                    }
                    outputList.push(output)
                  }
              }
            } else {
              //logger.warn("ce cours n'a pas de salle attribuée");
            }
          }
        );
      })
      );
  }
  return Promise.all(promises).then(() => {
    //console.log(outputList)
    return outputList
  });
}

module.exports = spec1;
