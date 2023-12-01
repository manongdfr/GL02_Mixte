const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

function spec7(logger) {
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
                    const tab = CRUAFiltrer.map(({ place, salle }) => [salle, place]);

                    // Résoudre la promesse avec le tableau
                    resolve(tab);
                }
            });
        });
    }

    // Tableau qui contiendra les données sans doublons
    let tab1 = [];

    // Créer une promesse pour chaque fichier à traiter
    for (let i = 0; i < tabAlph.length; i++) {
        promises.push(readAndParseFile("SujetA_data/" + tabAlph[i] + "/edt.cru"));
    }

    // Attendre que toutes les promesses soient résolues
    Promise.all(promises)
        .then((results) => {
            // Aplatir le tableau de tableaux en un seul tableau
            tab1 = results.flat();
            
            tab1 = removeDuplicates(tab1);

            // Créer un objet pour stocker le nombre de salles par capacité
            const capacityCount = {};

            // Compter le nombre de salles pour chaque capacité
            tab1.forEach(([salle, capacity]) => {
                if (capacityCount[capacity]) {
                    capacityCount[capacity]++;
                } else {
                    capacityCount[capacity] = 1;
                }
            });
            console.log("Voilà un classement du nombres de salles de classes par capacité maximale : ")
            console.log(capacityCount);
        })
        .catch((error) => {
            console.error(error);
        });
   
}


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

module.exports = spec7;