const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];


function spec3(args, logger) {
    let creneauDispo = [];
    let IDsalle=args;
    let promises = [];
    for (let i = 0; i < tabAlph.length; i++) {
        promises.push(new Promise((resolve, reject) => {
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
                    let filteredCru = [];

                

                    for (let i = 0; i < CRUAFiltrer.length; i++) {
                        if (typeof CRUAFiltrer[i].horaire !== 'undefined' &&
                            CRUAFiltrer[i].salle === IDsalle &&
                            creneauEstDisponible(CRUAFiltrer[i], creneauDispo)) {
                            filteredCru.push(CRUAFiltrer[i]);
                        }
                    }
                    creneauDispo = creneauDispo.concat(filteredCru);

                    resolve();
                });
        }));
    }

    Promise.all(promises).then(() => {
        console.log(`Créneaux horaires disponibles pour la salle ${IDsalle}:`);
        creneauDispo.forEach((cru) => {
            let jour = cru.horaire.matched[0];
            let startTime = cru.horaire.matched[2];
            let endTime = cru.horaire.matched[4];
            console.log(`${numToDay(dayToNum(jour))} - ${startTime} - ${endTime}`);
        });
    });
}

function creneauEstDisponible(cru, creneauxOccupes) {
    for (let i = 0; i < creneauxOccupes.length; i++) {
        let creneauOccupe = creneauxOccupes[i];
        if (creneauOccupe.salle === cru.salle &&
            creneauOccupe.horaire.matched[0] === cru.horaire.matched[0] &&
            chevauchementHeures(creneauOccupe.horaire.matched[2], creneauOccupe.horaire.matched[4], cru.horaire.matched[2], cru.horaire.matched[4])) {
            return false; // Le créneau chevauche un créneau déjà occupé
        }
    }
    return true;
}

function chevauchementHeures(heureDebut1, heureFin1, heureDebut2, heureFin2) {
    return (heureDebut1 < heureFin2 && heureFin1 > heureDebut2);
}

function dayToNum(day){
    switch(day){
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
function numToDay(num){
    switch(num){
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
module.exports = spec3;