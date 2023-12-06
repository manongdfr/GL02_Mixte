// librairies utilisées
const fs = require("fs").promises;
const ICAL = require("ical.js");
const icalGene = require("ical-generator")
const CRUParser = require("../CRUParser");
const { contains } = require("vega-lite");


// Variables globales 
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];
let counterExterne = 0;
let dateObjectEventStart;
let dateObjectEventEnd;
let listCoursAffectes = [];
let listeCoursExport = [];

// Creation d'un objet calendrier 
const calendar = new icalGene.ICalCalendar({name: "Edt", "scale": "GREGORIAN",})


function readFileAsync(filePath) {
    return fs.readFile(filePath, "utf8");
}

// Fonction d'export des cours en format ICAL 
// On créé un évènement de chaque cours qui nous intéresse
// On convertit ensuite les donnée en chaine de caractère puis on créé un fichier .ics
function createEvent (listCoursAffectes, filePath){
    listCoursAffectes.forEach(event => {
        calendar.createEvent({
            start : event.hD,
            end : event.hF,
            summary : event.typeExport +' de '+event.ueExport, 
            location : event.locationExport 
        })
    })

    data = calendar.toString()
    fs.writeFile(filePath, data, 'utf8');
}

/* Paramètre d'entrées : 
args : Les différentes UE où l'on est inscrit. Sous forme de liste ["UE1", "UE2", "UE3"]
type : la catégorie de cours qui nous intéresse pour l'emploi du temps : C / D / T
jourDebut / jourFin : on recherche les cours compris entre ces 2 jours de la semaine : ("L" / "MA" / "ME" / "J" / "V" / "S")
horaireDebut / horaireFin : on recherche les cours qui se déroulent entre ces 2 heures : "HH: mm" où HH c [8,20] et mm = 30 ou 0
dateDebutEDT / dateFinEDT : on exporte les cours qui nous intéressent entre ces 2 dates. Maximum 1 semaine entre les 2 dates : les cours ne seront pas répétés
*/
function spec5(args, type, jourDebut, horaireDebut, jourFin, horaireFin, dateDebutEDT, dateFinEDT, logger) {

   
    let ueInscrit = args;
    let listCours = [];
    const jours = ["L*", "MA", "ME", "J", "V", "S"];
    const [dayDebut, monthDebut, yearDebut] = dateDebutEDT.split('/');
    const [dayFin, monthFin, yearFin] = dateFinEDT.split('/');
    
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dateObjectDebutEDT = new Date(`${monthDebut}/${dayDebut}/${yearDebut}`);
    const dateObjectFinEDT = new Date(`${monthFin}/${dayFin}/${yearFin}`);
    const dayIndexDebutEDT = dateObjectDebutEDT.getDay();
   

    // verification des inputs
    if (!jours.includes(jourDebut) && !jours.includes(jourFin)) {
        logger.info("Les jours que vous avez entrez ne sont pas valides".red);
        return;
    }

    const horaires = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
    if (
        !(horaires.includes(horaireDebut) && horaires.includes(horaireFin))
    ) {
        logger.info("Les horaires que vous avez entrez ne sont pas valides".red);
        return;
    }

    let jourFinComparer;
    let jourDebutComparer;

    // On associe au jour de début un chiffre correspondant au numéro du jour de la semaine 
    if (jourDebut === "L") {
        jourDebutComparer = 1;
    }
    else if (jourDebut === "MA") {
        jourDebutComparer = 2;
    }
    else if (jourDebut === "ME") {
        jourDebutComparer = 3;
    }
    else if (jourDebut === "J") {
        jourDebutComparer = 4;
    }
    else if (jourDebut === "V") {
        jourDebutComparer = 5;
    }
    else if (jourDebut === "S") {
        jourDebutComparer = 6;
    }
    else { console.error("Invalid date") };

    // On associe au jour de fin un chiffre correspondant au numéro du jour de la semaine 
    if (jourFin === "L") {
        jourFinComparer = 1;
    }
    else if (jourFin === "MA") {
        jourFinComparer = 2;
    }
    else if (jourFin === "ME") {
        jourFinComparer = 3;
    }
    else if (jourFin === "J") {
        jourFinComparer = 4;
    }
    else if (jourFin === "V") {
        jourFinComparer = 5;
    }
    else if (jourFin === "S") {
        jourFinComparer = 6;
    }
    else { console.error("Invalid date") };



    let readFilePromises = [];
    let CRUFiltres = [];

    // On recupere les cours qui nous intéressent
    for (let j = 0; j < ueInscrit.length; j++) {
        // On répète la fonction spec1
        for (let i = 0; i < tabAlph.length; i++) {
            let filePath = "SujetA_data/" + tabAlph[i] + "/edt.cru";
            let readFilePromise = readFileAsync(filePath)
                .then(data => {
                    let analyzer = new CRUParser();
                    analyzer.parse(data);

                    let CRUAFiltrer = analyzer.parsedCRU;


                    // on filtre les cours en fonction du nom de l'ue et de la catégorie du cours
                    for (let k = 0; k < CRUAFiltrer.length; k++) {
                        let ueCurrent = CRUAFiltrer[k].ue;
                        let typeCurrent = CRUAFiltrer[k].type;

                        //comparer jour

                        let dateCurrent = CRUAFiltrer[k].horaire;
                        let jourCurrent;


                        //On associe a chaque jour d'un créneau un chiffre correspondant au numéro du jour de la semaine 

                        if (dateCurrent && dateCurrent.matched[0] === "L") {
                            jourCurrent = 1;

                        }
                        else if (dateCurrent && dateCurrent.matched[0] === "MA") {
                            jourCurrent = 2;

                        }
                        else if (dateCurrent && dateCurrent.matched[0] === "ME") {
                            jourCurrent = 3;

                        }
                        else if (dateCurrent && dateCurrent.matched[0] === "J") {
                            jourCurrent = 4;

                        }
                        else if (dateCurrent && dateCurrent.matched[0] === "V") {
                            jourCurrent = 5;

                        }
                        else if (dateCurrent && dateCurrent.matched[0] === "S") {
                            jourCurrent = 6;

                        }
                       // else { console.error("Invalid date") };

                        // On compare les heures de début et fin
                        // On commance par séparer les heures et les minutes
                        let heureDebut = horaireDebut.split(":");
                        let heureFin = horaireFin.split(":");

                        if (dateCurrent) {
                            heureDebutCurrent = dateCurrent.matched[2].split(":");
                            heureFinCurrent = dateCurrent.matched[4].split(":");
                        }


                        // On filtre de nouveau les cours mais cette fois ci en fonction des horaires, des jours
                        if (ueCurrent === ueInscrit[j] 
                            && typeCurrent 
                            && typeCurrent.includes(type) 
                            && (jourCurrent >= jourDebutComparer && jourCurrent <= jourFinComparer) 
                            && ((parseInt(heureDebutCurrent[0]) >= parseInt(heureDebut) || (parseInt(heureDebutCurrent[0]) === parseInt(heureDebut[0]) && parseInt(heureDebutCurrent[1]) >= parseInt(heureDebut[1])))) 
                            && (parseInt(heureFinCurrent[0]) <= parseInt(heureFin[0]) || (parseInt(heureFinCurrent[0]) === parseInt(heureFin[0]) && parseInt(heureFinCurrent[1]) <= parseInt(heureFin[1])))) 
                            
                            // les cours filtrés sont ajoutés à la liste CRUFiltres
                            {CRUFiltres.push(CRUAFiltrer[k]);}
                    }
                })
                .catch(err => logger.warn(err));
                readFilePromises.push(readFilePromise);

        }

    }

    // Attendre que toutes les promesses soient résolues
    Promise.all(readFilePromises)

        .then(() => {
            
            // On vient reformarter les différents attributs
            listCours = CRUFiltres
         
            let ue = [];
            let type = [];
            let location = [];
            let jour = [];
            let heureDebutICAL = [];
            let heureFinICAL = [];
            let DateICAL = {
                jour,
                heureDebutICAL,
                heureFinICAL,

            };
            let listCoursICAL = {
                ue,
                type,
                location,
                DateICAL
            }

            // Assignation des valeurs 
            listCours.forEach(cours => {
                let coursAffecte = Object.assign({}, listCoursICAL); // Copie indépendante

                // On écrit les jours en toutes lettres
                if (cours.horaire.matched[0] === "L") { day = "Lundi" }
                else if (cours.horaire.matched[0] === "MA") { day = "Mardi" }
                else if (cours.horaire.matched[0] === "ME") { day = "Mercredi" }
                else if (cours.horaire.matched[0] === "J") { day = "Jeudi" }
                else if (cours.horaire.matched[0] === "V") { day = "Vendredi" }
                else if (cours.horaire.matched[0] === "S") { day = "Samedi" }
                else if (cours.horaire.matched[0] === "D") { day = "Dimanche" }
                else { console.error("error") }

                // On transforme les catégories pour plus de clarté
                if (cours.type.includes("D")){ cours.type = "TD"}
                else if (cours.type.includes("C")){ cours.type = "CM"}
                else if (cours.type.includes("T")){ cours.type = "TP"}
                
                
                // Assignation des valeurs spécifiques de chaque élément de listCours
              
                coursAffecte.ue = cours.ue;
                coursAffecte.type = cours.type;
                coursAffecte.location = cours.salle;
                coursAffecte.DateICAL = [day, cours.horaire.matched[2], cours.horaire.matched[4]];


                // Ajout de l'élément affecté à la liste finale
                listCoursAffectes.push(coursAffecte);
            });
        })


        .then(() => {
            
            // Formatage de la date
            listCoursAffectes.forEach(event => {
                
                let indexJour = dayIndexDebutEDT
                let jourComparer = daysOfWeek [dayIndexDebutEDT];
                let counter = 0
                
                let range = false;
                
                // On vérifie si le jour du cours est compris dans la date d'affichage de l'emploi du temps
                // On vient compter le nombre de jour à ajouter à la date de départ pour déterminer la date du cours.


                // Si le jour du cours est le même que le jour de départ de l'emploi du temps alors il sera affiché (boolean range indique si le cours est bien compris entre le début et la fin de l'affichage de l'emploi du temps)
                if (event.DateICAL[0] === jourComparer)
                {
                    if (counter + parseInt(dayDebut) > parseInt(dayFin)){range = false;}
                    else {range = true;}

                }
                else {
                    // Si le jour du cours n'est pas le même que le jour de départ, on change de jours et on compte le nombre de jours d'écarts
                    // Les jours sont des index compris entre 0 et 6 (0 est le dimanche et 1 le lundi, ...)
                    while(event.DateICAL[0] != jourComparer){

                        counter += 1;
                        indexJour = indexJour + 1;
                        if (indexJour === 7){indexJour = 0}
                        jourComparer = daysOfWeek [indexJour];
                        if (event.DateICAL[0] === jourComparer)
                        {
                            indexJour = dayIndexDebutEDT
                            if (counter + parseInt(dayDebut) > parseInt(dayFin)){range = false; }
                            else {range = true; }

                            counterExterne = counter;
                            counter = 0;
                        }
                    }
                }
               
                // Si le cours est bien compris entre le début et la fin d'affichage de l'emploi du temps, on vient formater la date pour qu'elle soit conforme à la norme ICAL
                if (range === true){
                  
                    // on calcule la date du cours en fonction de la date d'affichage de l'emploi du temps, et le nombre de jours d'écart avec le cours
                    let dayEvent = counterExterne + parseInt(dayDebut)
                    counterExterne = 0;

                    let monthEvent = monthDebut
                    let yearEvent = yearDebut;

                    // Prise en compte des changements de mois et des changements d'année. Les mois sont indexés de 0 à 11.
                    if (dayEvent === 31 && (monthEvent === 3 || monthEvent === 5 || monthEvent === 8 || monthEvent === 10)){ dayEvent = 1; monthEvent+=1}
                    else if (dayEvent > 28 && monthEvent === 1){dayEvent = 1; monthEvent +=1}
                    else if (dayEvent === 30 && (monthEvent === 0 || monthEvent === 2 || monthEvent === 4 || monthEvent === 6 || monthEvent === 7 || monthEvent === 9 || monthEvent === 11))
                    {dayEvent = 1; monthEvent +=1}

                    if (monthEvent === 11){monthEvent = 0; yearEvent +=1}
                    
                    // Formatage de l'heure
                    let heureDebutDate = event.DateICAL[1].concat(":00")
                    let heureFinDate = event.DateICAL[2].concat(":00")
                    
                    // Formatage de la date et de l'heure en créant un objet date. Le fuseau d'horaire est réglé sur celui de Paris
                    dateObjectEventStart = new Date(`${dayEvent}, ${monthEvent},${yearEvent},  ${heureDebutDate}`).toLocaleString('fr', { timeZone: 'Europe/Paris' });
                    dateObjectEventEnd = new Date(`${dayEvent},${monthEvent},${yearEvent},   ${heureFinDate}`).toLocaleString('fr', { timeZone: 'Europe/Paris' });

                    // Objet formaté pour être lu dans un objet ICAL
                    let ueExport =[]
                    let typeExport = []
                    let locationExport = []
                    let hD = []
                    let hF = []
                 
                    let coursExport = {
                        ueExport, 
                        typeExport, 
                        locationExport, 
                        hD,
                        hF,
                    };
                    
                    coursExport.ueExport = event.ue;
                    coursExport.typeExport = event.type;
                    coursExport.locationExport = event.location;
                    coursExport.hD = dateObjectEventStart;
                    coursExport.hF = dateObjectEventEnd;

                    listeCoursExport.push(coursExport);
                    console.log(coursExport)
                }
            })


        // Appel de la fonction CreateEvent
        // On fournit la liste des cours filtrés et formaté, ainsi que le nom du fichier ICAL.
        createEvent(listeCoursExport, "edt_ICAL.ics")
        
        })
        .catch(err => logger.warn(err));
}
//spec5(["AP03", "BI01", "MA02"], "D", "MA", "8:00", "V", "14:00", "06/12/2023", "12/12/2023");
module.exports = spec5;


