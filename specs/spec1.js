const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

function spec1(args, logger) {
  // for (let i = 0; i < tabAlph.length; i++) {
  fs.readFile(
    "SujetA_data/" + tabAlph[0] + "/edt.cru",
    "utf8",
    function (err, data) {
      if (err) {
        return logger.warn(err);
      }
      analyzer = new CRUParser();
      analyzer.parse(data);
      // console.log(data)

      let CRUAFiltrer = analyzer.parsedCRU;
      let CRUFiltres = [];

      // filtered = analyzer.parsedCRU.filter((p) =>

      for (let i = 0; i < CRUAFiltrer.length - 1; i++) {
        if (analyzer.parsedCRU[i].ue === args) {
          CRUFiltres.pushCRUAFiltrer[i];
        } else {
          console.log("pas la même ue")
        }

        console.log(analyzer.parsedCRU[i].ue)
      }
      // console.log(CRUFiltres);
      // console.log(filtered);

      // var listeSalle = [];
      // for (i = 0; i < Object.keys(filtered).length; i++) {
      //   var ajouter = true;
      //   for (j = 0; j < listeSalle.length; j++) {
      //     if (listeSalle[j] == filtered[i].entree.salle) {
      //       ajouter = false;
      //     }
      //   }
      //   if (ajouter == true) {
      //     listeSalle.push(filtered[i].entree.salle);
      //   }
      // }
      // console.log(listeSalle)
      // if (listeSalle.length == 0) {
      //   console.log("Ce cours n'existe pas");
      // } else {
      //   console.log(
      //     "Les cours de l'UE ",
      //     args.needle,
      //     " se déroulent dans les salles suivantes :"
      //   );
      //   for (i = 0; i < listeSalle.length; i++) {
      //     console.log("- ", listeSalle[i]);
      //   }
      // }
    }
  );
}

module.exports = spec1;
