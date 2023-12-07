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
            logger.info("Voilà un classement du nombres de salles de classes par capacité maximale : ")
            // console.log(capacityCount);
            console.log(tab1)
        })
        .catch((error) => {
            console.error(error);
        });
   
}


function removeDuplicates(matrix) {
    const capacityMap = {};

    matrix.forEach(([salle, capacity]) => {
        const currentCapacity = parseInt(capacity);
        if (!capacityMap[salle] || currentCapacity > capacityMap[salle]) {
            capacityMap[salle] = currentCapacity;
        }
    });
    

    const uniqueMatrix = Object.entries(capacityMap).map(([salle, capacity]) => [
        salle || 'UndefinedSalle',  // Provide a default value for undefined salle
        capacity.toString(),
    ]);
    return uniqueMatrix;
}



module.exports = spec7;