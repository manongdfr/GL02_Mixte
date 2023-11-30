const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];


function spec7(logger) {
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




           
            for (let i = 0; i < CRUAFiltrer.length; i++) {
                let salleCurrent = analyzer.parsedCRU[i].salle;
                let placeCurrent = analyzer.parsedCRU[i].place;
                console.log(salleCurrent)
               
                let tab1 = [];
                for (let i=0; i < tab1.length; i++){
                    if (salleCurrent!=tab1[i][0]){
                        tab1.push([salleCurrent, placeCurrent])
                    }
                    else{
                        //on ne l'ajoute pas si on a deja rencontré cette salle
                    }
                }
            }
            let classement = [
                [0,0]
            ]
            for (let i=0; i < tab1.length; i++){
                for (let j=0; j<classement.length; i++){
                    if(classement[j][1]!=tab1[i][1]){
                        classement.push(tab1[i])
                    }
                }
            }
           
           
   
        }
        )
    }))
}
