const fs = require("fs");
let folderName = fs.readdirSync("SujetA_data");
let tabAlph = [];
folderName.forEach((e) => tabAlph.push(e));
const CRUParser = require("../CRUParser");

function spec1(ue, logger) {
  var filtered = [];
  //loop onto all folders to get all paths
  for (let i = 0; i < tabAlph.length; i++) {
    let dataPath = "./SujetA_data/" + tabAlph[i] + "/edt.cru";

    fs.readFile(dataPath, "utf8", function (err, data) {
      if (err) {
        return logger.warn(err);
      } else {
        analyzer = new CRUParser();

        console.log(analyzer.parse(data));
        var n = new RegExp(ue);
        console.log(n)
        var filt = analyzer.parsedCRU.filter((p) => p.ue.match(n, "i"));
        if (Object.keys(filt).length > 0) {
          filtered = filtered.concat(filt);
        }
      }
    });
  }

  setTimeout(rechercherListeSalle, 2000);
  function rechercherListeSalle() {
    var listeSalle = [];
    for (i = 0; i < Object.keys(filtered).length; i++) {
      var ajouter = true;
      for (j = 0; j < listeSalle.length; j++) {
        if (listeSalle[j] == filtered[i].entree.salle) {
          ajouter = false;
        }
      }
      if (ajouter == true) {
        listeSalle.push(filtered[i].entree.salle);
      }
    }
    if (listeSalle.length == 0) {
      console.log("Ce cours n'existe pas");
    } else {
      listeSalle = listeSalle.sort();
      console.log(
        "Les cours de l'UE " +ue+" se déroulent dans les salles suivantes :"
      );
      for (i = 0; i < listeSalle.length; i++) {
        console.log("- ", listeSalle[i]);
      }
    }
  }
}

module.exports = spec1;
