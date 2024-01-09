const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];
outputList = []

function spec1(args,notTesting, logger) {
  let promises = [];
  var existe = 0;
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
                
                //!\ filtrer les doublons /!\
                uniqueCru = CRUFiltres.filter(function (value, index, array) {
                    return array.indexOf(value) === index;
                
                });
                
              }
            }
            resolve();

            //answer
            if (uniqueCru.length > 0) {
              existe = 1;
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
            }
            else {
              
            }
          }
        );
      })
      );
  }

  return Promise.all(promises).then(() => {
    
    if (existe == 0){
      console.log("Ce cours n'a pas de salle attribuée\nVérifiez si l'UE existe bien et si elle a été écrite en majuscule.");
    }

    return outputList
  });
}

module.exports = spec1;
