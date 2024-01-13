const fs = require("fs");
const CRUParser = require("../CRUParser");
const { Console } = require("console");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

const vg = require("vega");
const vegalite = require("vega-lite");

// La fonction spec6 prend en entrée un fichier, des arguments et un logger
function spec6(file, args, logger) {
  // Si le jour spécifié n'est pas valide, la fonction s'arrête
  if (fullDayToNum(args) == -1) {
    return;
  }
  // Initialisation de deux listes pour stocker les CRU et les promesses
  var crulist = [];
  let promises = [];
  // Pour chaque lettre de l'alphabet, une nouvelle promesse est créée
  for (let i = 0; i < tabAlph.length; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        // Lecture du fichier 'edt.cru' correspondant à la lettre
        fs.readFile(
          "SujetA_data/" + tabAlph[i] + "/edt.cru",
          "utf8",
          function (err, data) {
            // Si une erreur se produit lors de la lecture, un avertissement est affiché
            if (err) {
              return logger.warn(err);
            }
            // Analyse des données du fichier
            analyzer = new CRUParser();
            analyzer.parse(data);

            // Filtrage des CRU en fonction du jour spécifié
            let CRUAFiltrer = analyzer.parsedCRU;
            let filteredCru = [];
            let uniqueCru = [];

            // Pour chaque CRU, si le jour correspond au jour spécifié, il est ajouté à la liste
            for (let j = 0; j < CRUAFiltrer.length; j++) {
              if (typeof CRUAFiltrer[j].horaire != "undefined") {
                let jourCurrent = CRUAFiltrer[j].horaire.matched[0];
                if (dayToNum(jourCurrent) == fullDayToNum(args)) {
                  filteredCru.push(CRUAFiltrer[j]);
                }
              }
            }
            // Suppression des doublons dans la liste des CRU
            uniqueCru = filteredCru.filter(function (value, index, array) {
              return array.indexOf(value) === index;
            });
            // Ajout des CRU uniques à la liste globale
            crulist.push(uniqueCru);

            // Résolution de la promesse
            resolve();
          }
        );
      })
    );
  }
  // Une fois que toutes les promesses sont résolues, le traitement des données peut commencer
  Promise.all(promises).then(() => {
    // Initialisation des variables pour le calcul des statistiques
    let dailyHoursArray = [0, 0, 0, 0, 0];
    let salleMap = new Map();

    // Pour chaque CRU, calcul de la durée et mise à jour des statistiques
    for (let i = 0; i < crulist.length; i++) {
      for (let j = 0; j < crulist[i].length; j++) {
        let currentCRU = crulist[i][j];
        let cruDay = currentCRU.horaire.matched[0];
        let startTime = currentCRU.horaire.matched[2];
        let endTime = currentCRU.horaire.matched[4];
        dailyHoursArray[dayToNum(cruDay)] += cruDuration(startTime, endTime);

        // Mise à jour de la durée totale pour chaque salle
        if (salleMap.has(crulist[i][j].salle)) {
          salleMap.set(
            crulist[i][j].salle,
            salleMap.get(crulist[i][j].salle) + cruDuration(startTime, endTime)
          );
        } else {
          salleMap.set(crulist[i][j].salle, cruDuration(startTime, endTime));
        }
      }
    }
    // Tri du map par valeur
    let sortedArray = Array.from(salleMap).sort((a, b) =>
      a[1] > b[1] ? 1 : -1
    );
    let sortedMapByValue = new Map(sortedArray);

    // Affichage du taux d'occupation de chaque salle
    console.log(`Occupation de la salle le ${args}:`);
    sortedMapByValue.forEach((value, key) => {
      console.log(`${key}: ${((value / 12) * 100).toFixed(1)}%`);
    });
    // Appel de la fonction de visualisation après un délai
    setTimeout(visualisation, 1000);

    // La fonction de visualisation génère un tableau avec le taux d'occupation de chaque salle
    function visualisation() {
      let taux = [];
      sortedMapByValue.forEach((value, key) => {
        taux.push({ salle: key, taux: value });
      });
      var avgChart = {
        data: {
          values: taux,
        },
        title: `Taux d'occupation des salles de l'UTT les ${args}`,
        mark: "bar",
        encoding: {
          x: {
            field: "salle",
            type: "nominal",
            axis: { title: "Nom des salles" },
          },
          y: {
            field: "taux",
            type: "quantitative",
            axis: { title: `Taux d'occupation` },
          },
        },
        config: {
          style: {
            label: {
              align: "middle",
              baseline: "middle",
            },
          },
        },
      };
      const myChart = vegalite.compile(avgChart).spec;
      analyzer.parse(JSON.stringify(myChart));
      var runtime = vg.parse(myChart);
      var view = new vg.View(runtime).renderer("svg").run();
      var mySvg = view.toSVG();
      mySvg.then(function (res) {
        fs.writeFileSync(file, res);
        view.finalize();
        console.log(
          "Le fichier a bien été enregistré avec le chemin suivant :".blue,
          file.blue
        );
      });
    }
  });
}

function cruDuration(startString, endString) {
  var start = startString.split(":").map(Number);
  var end = endString.split(":").map(Number);
  let hourCount = end[0] - start[0];
  return hourCount;
}

function dayToNum(day) {
  switch (day) {
    case "L":
      return 0;
    case "MA":
      return 1;
    case "ME":
      return 2;
    case "J":
      return 3;
    case "V":
      return 4;
    case "S":
      return 5;
  }
}

function numToDay(num) {
  switch (num) {
    case 0:
      return "lundi";
    case 1:
      return "mardi";
    case 2:
      return "mercredi";
    case 3:
      return "jeudi";
    case 4:
      return "vendredi";
    case 5:
      return "samedi";
  }
}
function fullDayToNum(day) {
  switch (day) {
    case "lundi":
      return 0;
    case "mardi":
      return 1;
    case "mercredi":
      return 2;
    case "jeudi":
      return 3;
    case "vendredi":
      return 4;
    case "samedi":
      return 5;
    default:
      console.log(
        `Veuillez rentrer un jour de la semaine valide (lundi | mardi | mercredi | jeudi | vendredi | samedi)`
      );
      return -1;
  }
}

module.exports = spec6;
