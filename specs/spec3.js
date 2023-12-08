const fs = require("fs");
const CRUParser = require("../CRUParser");
const { start } = require("repl");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];


function spec3(args, logger) {
    let occupe = [];
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
                            fonctionDePassage(CRUAFiltrer[i], occupe)) {
                            filteredCru.push(CRUAFiltrer[i]);
                        }
                    }
                    occupe = occupe.concat(filteredCru);

                    resolve();
                });
        }));
    }

    Promise.all(promises).then(() => {
        occupe.forEach((cru) => {
            let jour = cru.horaire.matched[0];
            let startTime = cru.horaire.matched[2];
            let endTime = cru.horaire.matched[4];
            creneauOccupe(jour,startTime,endTime);
        });
        console.log(`Liste des créneaux libres concernant la salle ${IDsalle}:`)
        for (const jour of joursSemaine) {
            for (let heure = 8; heure <= 19; heure++) {
                const creneau = `${heure}-${heure + 1}`;
                if (semaine[jour][creneau] == 0){
                    console.log(numToDay(dayToNum(jour)),affichagehorraire(creneau))
                }
            }
        };
    });
}

// Définir les jours de la semaine
const joursSemaine = ['L', 'MA', 'ME', 'J', 'V', 'S'];

// Créer la structure de données pour la semaine
const semaine = {};

// Initialiser les créneaux à 0 pour chaque jour > 0 = salle libre
for (const jour of joursSemaine) {
    semaine[jour] = {};

    for (let heure = 8; heure <= 19; heure++) {
        const creneau = `${heure}-${heure + 1}`;
        semaine[jour][creneau] = 0; // Initialiser la valeur à 0
    }
}

// changer la valeur de creneau en 1 pour marquer le fait que la salle soit occupée à ce moment
function creneauOccupe(jour,startTime,endTime) {
    startTime = parseInt(startTime);
    endTime = parseInt(endTime);
    if (startTime+2==endTime) {
        let end1 = startTime+1;
        const creneau1 = `${startTime}-${end1}`;
        const creneau2 = `${end1}-${endTime}`;
        semaine[jour][creneau1]=1;
        semaine[jour][creneau2]=1;
        
    }
    else {
        const creneau = `${startTime}-${endTime}`;
        semaine[jour][creneau]=1;
    }
}

function fonctionDePassage(cru, creneauxOccupes) {
    for (let i = 0; i < creneauxOccupes.length; i++) {
        let creneauOccupe = creneauxOccupes[i];
        if (creneauOccupe.salle === cru.salle &&
            creneauOccupe.horaire.matched[0] === cru.horaire.matched[0] &&
            chevauchementHeures(creneauOccupe.horaire.matched[2], creneauOccupe.horaire.matched[4], cru.horaire.matched[2], cru.horaire.matched[4])) {
            return false; 
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
  //fonction pour afficher correctement les creneaux
  function affichagehorraire(creneau){
    switch(creneau){
        case "8-9":
            return "8:00-9:00";
        case "9-10":
            return "9:00-10:00";  
        case "10-11":
            return "10:00-11:00"; 
        case "11-12":
            return "11:00-12:00";
        case "12-13":
            return "12:00-13:00"; 
        case "13-14":
            return "13:00-14:00";
        case "14-15":
            return "14:00-15:00";
        case "15-16":
            return "15:00-16:00";
        case "16-17":
            return "16:00-17:00";
        case "17-18":
            return "17:00-18:00";
        case "18-19":
            return "18:00-19:00";
        case "19-20":
            return "19:00-20:00";
    }
  }
module.exports = spec3;