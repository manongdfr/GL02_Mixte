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

        if ((analyzer.errorCount = 0)) {
          logger.info("Le fichier .cru contient une erreur".red);
          return;
        }

        //ensemble des salles
        let sallesAFiltrer = analyzer.parsedCRU;
        let sallesFiltres = []

        //tableau salles
        for (let i = 0; i < sallesAFiltrer.length; i++) {
          sallesFiltres.push(sallesAFiltrer[i].salle);

          //!\ filtrer les doubons /!\
          uniqueSalle = sallesFiltres.filter(function (value, index, array) {
            return array.indexOf(value) === index;
          });
        }

        sallesAFiltrer.forEach((e) => {
            if(e.statut !== undefined){
                if (
                //   e.horaire.matched[0] !== undefined &&
                  e.horaire.matched[0] === args.jour &&
                  compareDates(args.heureDebut, e.horaire.matched[2]) >= 0 &&
                  compareDates(args.heureFin, e.horaire.matched[4]) <= 0
                ) {
                let uniqueSalle = sallesFiltres.filter(function (value, index, array) {
                         return array.indexOf(value) === index;
                         });
                  console.log("Salles disponibles à ces horaires : ");
                  logger.info(uniqueSalle.join(', '))
                }
            }
        });
      }
      //   if (
      //     horaire.matched[0] === args.jour &&
      //     compareDates(args.heureDebut, horaire.matched[2]) >= 0 &&
      //     compareDates(args.heureFin, horaire.matched[4]) <= 0
      //   ) {
      //     // sallesDispo = sallesDispo.filter(
      //     //   (salle) => salle !== creneau.salle
      //     // );
      //     console.log(uniqueSalle);
      //   }
      // });
      // logger.info("Salles disponibles à ces horaires: ");
      // logger.info(sallesDispo.join(", "));
      //   }
    );
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
}

module.exports = spec2;