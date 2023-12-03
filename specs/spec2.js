const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

function spec2(args, logger) {
  const jours = ["L", "MA", "ME", "J", "V", "S"];

  if (!jours.includes(args.jour)) {
    logger.info("Les jours que vous avez entrez ne sont pas valides".red);
    return;
  }

  const horaires = [
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ];
  if (
    !(horaires.includes(args.heureDebut) && horaires.includes(args.heureFin))
  ) {
    logger.info("Les horaires que vous avez entrez ne sont pas valides".red);
    return;
  }

  // Tableau de promesses pour chaque fichier à traiter
  let promises = [];

  // Fonction qui lit et analyse un fichier, renvoyant une promesse
  function readAndParseFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          // Initialiser l'analyseur CRU avec les données du fichier
          const analyzer = new CRUParser();
          analyzer.parse(data);

          // Extraire les informations pertinentes du CRU et les mettre dans un tableau
          const CRUAFiltrer = analyzer.parsedCRU;

          const tab = CRUAFiltrer.map(({ horaire }) => [horaire]);

          // Résoudre la promesse avec le tableau
          resolve(tab);
        }
      });
    });
  }

  // Tableau qui contiendra les données sans doublons
  let uniqueSalle = [];

  // Créer une promesse pour chaque fichier à traiter
  for (let i = 0; i < tabAlph.length; i++) {
    promises.push(readAndParseFile("SujetA_data/" + tabAlph[i] + "/edt.cru"));
  }

  Promise.all(promises)
    .then((results) => {
      // Aplatir le tableau de tableaux en un seul tableau
      uniqueSalle = results.flat();

      uniqueSalle = removeDuplicates(uniqueSalle);

      let final = [];

      uniqueSalle.forEach((e) => {
        if (e && e[0] && e[0].matched !== undefined) {
          if (
            //   e.horaire.matched[0] !== undefined &&
            e[0].matched[0] === args.jour &&
            compareDates(args.heureDebut, e[0].matched[2]) >= 0 &&
            compareDates(args.heureFin, e[0].matched[4]) <= 0
          ) {
            final = uniqueSalle.filter(function (value, index, array) {
              return array.indexOf(value) === index;
            });
          }
        }
      });

      // console.log(finalTab);
      console.log("Salles disponibles à ces horaires : ");
      // console.log(final.map(item => item))
      // logger.info(final.map(item => item.nom).join(", "));
    })
    .catch((error) => {
      console.error(error);
    });
}

//prends args hDébut hFin, return 1 si Début > Fin, 0 si équivalent, -1 Début < Fin
function compareDates(hour1, hour2) {
  let d1 = hour1.split(":");
  let d2 = hour2.split(":");

  if (parseInt(d1[0]) < parseInt(d2[0])) {
    return 1;
  } else if (parseInt(d1[0]) > parseInt(d2[0])) {
    return -1;
  } else {
    if (parseInt(d1[1]) < parseInt(d2[1])) {
      return 1;
    } else if (parseInt(d1[1]) > d2[1]) {
      return -1;
    } else {
      return 0;
    }
  }
}

function removeDuplicates(data) {
  const uniqueValues = new Map();

  return data.filter((item) => {
    if (!uniqueValues.has(item)) {
      uniqueValues.set(item, true);
      return true;
    }

    return false;
  });
}

module.exports = spec2;
