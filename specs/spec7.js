const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];


function spec7(logger) {
    function removeDuplicates(matrix) {
        // Utiliser un ensemble pour stocker les valeurs uniques de la première colonne
        const uniqueFirstColumnValues = new Set();
    
        // Filtrer la matrice pour n'inclure que des lignes où la première colonne est unique
        const uniqueMatrix = matrix.filter(([firstColumnValue]) => {
            // Si la valeur de la première colonne n'est pas déjà dans l'ensemble, l'ajouter et le conserver
            if (!uniqueFirstColumnValues.has(firstColumnValue)) {
                uniqueFirstColumnValues.add(firstColumnValue);
                return true;
            }
    
            // Sinon, la ligne est un doublon, la filtrer
            return false;
        });
    
        return uniqueMatrix;
    } 

    
    let tab1 = [];
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
            
            let CRUAFiltrer = analyzer.parsedCRU;
            let filteredCru = [];
            let uniqueCru = [];
            
           
            for (let i = 0; i < CRUAFiltrer.length; i++) {

                let placeCurrent = analyzer.parsedCRU[i].place;
                let salleCurrent = analyzer.parsedCRU[i].salle;

                tab1.push([salleCurrent,placeCurrent])
                
            }
            
            tab1 = removeDuplicates(tab1);
            console.log(tab1)
           
           
   
        }
        
        )
        
    }
}
module.exports = spec7;