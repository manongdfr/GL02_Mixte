const fs = require("fs");
const CRUParser = require("../CRUParser");
const { Console } = require("console");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

function spec6(args, logger) {
    if (fullDayToNum(args) == -1){
        return;
    }
    var crulist = []
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
                let uniqueCru = [];
        
                for (let j = 0; j < CRUAFiltrer.length; j++) {
                    if(typeof CRUAFiltrer[j].horaire != 'undefined'){
                        let jourCurrent = CRUAFiltrer[j].horaire.matched[0];
                        if (dayToNum(jourCurrent) == fullDayToNum(args)) {
                            filteredCru.push(CRUAFiltrer[j]);
                        }
                    }
                    else{
                        //console.log(`Attention, un CRU contient une horaire vide pour l'UE:${CRUAFiltrer[i].ue} }` )
                    }
                }
                uniqueCru = filteredCru.filter(function (value, index, array) {
                return array.indexOf(value) === index;
                });
                crulist.push(uniqueCru)
        
                resolve();
            });
        }));
    }
    Promise.all(promises).then(() => {
        
        let dailyHoursArray = [0,0,0,0,0]

        let salleMap = new Map()
        for (let i= 0; i< crulist.length; i++){
            for (let j = 0; j< crulist[i].length; j++){
                
                let currentCRU = crulist[i][j]
                let cruDay = currentCRU.horaire.matched[0]
                let startTime = currentCRU.horaire.matched[2];
                let endTime = currentCRU.horaire.matched[4];
                dailyHoursArray[dayToNum(cruDay)] += cruDuration(startTime,endTime);
                
                if(salleMap.has(crulist[i][j].salle)){
                    //console.log(salleMap.get(crulist[i][j].salle))
                    salleMap.set(crulist[i][j].salle, salleMap.get(crulist[i][j].salle) + cruDuration(startTime,endTime))
                }else{
                    salleMap.set(crulist[i][j].salle,cruDuration(startTime,endTime))
                }
            }
        }
        // réarranger le map
        let sortedArray = Array.from(salleMap).sort((a, b) => a[1] > b[1] ? 1 : -1);
        let sortedMapByValue = new Map(sortedArray);

        //montrer le taux d'occupation de la salle
        //8 à 20 heures = 12 heures * 5 jours = 60 heures
        console.log(`Occupation de la salle le ${args}:`)
        sortedMapByValue.forEach((value, key) => {
            console.log(`${key}: ${((value/12)*100).toFixed(1)}%`);
        });
        
        
    });
}

  function cruDuration(startString,endString){
    var start = startString.split(':').map(Number);
    var end = endString.split(':').map(Number);
    let hourCount = end[0]-start[0];
    return hourCount
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
  function fullDayToNum(day){
    switch(day){
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
            console.log(`Veuillez rentrer un jour de la semaine valide (lundi | mardi | mercredi | jeudi | vendredi | samedi)`)
            return -1;
    }
}


  


module.exports = spec6;