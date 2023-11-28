const fs = require("fs");
const CRUParser = require("../CRUParser");
const { Console } = require("console");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

function spec6(args, logger) {
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
                let salleCurrent = analyzer.parsedCRU[j].salle;
                if (salleCurrent == args) {
                    filteredCru.push(CRUAFiltrer[j]);
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
        //console.log(crulist)
        for (let i= 0; i< crulist.length; i++){
            for (let j = 0; j< crulist[i].length; j++){
                let startTime = crulist[i][j].horaire.matched[2];
                let endTime = crulist[i][j].horaire.matched[4];
                console.log(cruDuration(startTime,endTime));
            }
        }
        
        let dailyHoursArray = new Array(5)
                
        for (let j = 0; j< crulist.length; j++){
            let currentCRU = crulist[i];
            //dailyHoursArray[dayToNum(currentCRU)] += cruDuration(currentCRU);
        }
        //montrer le taux d'occupation de la salle
        //8 à 20 heures = 12 heures * 5 jours = 60 heures
        for (j = 0; j < 5; j++){
            console.log(`Occupation de la salle ${args} jour ${j} de la semaine: ${dailyHoursArray[i]/60}`)
        }
    });
}

  function cruDuration(startTime,endTime){
    let start = parseInt(startTime[0])*10+parseInt(startTime[1]);
    let end = console.log(parseInt(endTime[0])*10+parseInt(endTime[1]));
    console.log(`lmao ${startTime} : ${endTime}}`)
    let hourCount = end-start;
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
    }
  }

  function numToDay(num){
    switch(num){
        case 0:
            return "L";
        case 1:
            return "MA";
        case 2:
            return "ME";
        case 3:
            return "J";
        case 4:
            return "V";
    }
  }
  


module.exports = spec6;