const fs = require("fs");
const CRUParser = require("../CRUParser");
let tabAlph = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];

function spec4(args, logger) {
    let fini = false;
    let placeMax = 0;
    while (fini === false) {

        // Utilisation du Parser pour récupérer les données. On parcours chaque fichier et on les ajoutes à la variable CRUAFiltrer, 
        // puis on la filtre en fonction de la salle recherchée, on obtient la variable CRUFiltres.
        for (let parcourir = 0; parcourir < tabAlph.length; parcourir++)
            fs.readFile(
                "SujetA_data/" + tabAlph[parcourir] + "/edt.cru",
                "utf8",
                function (err, data) {
                    if (err) {
                        return logger.warn(err);
                    }
                    analyzer = new CRUParser();
                    analyzer.parse(data);

                    CRUAFiltrer = analyzer.parsedCRU;
                    let CRUFiltres = [];

                    for (let i = 0; i < CRUAFiltrer.length; i++) {
                        let salleCurrent = analyzer.parsedCRU[i].salle
                        if (salleCurrent == args) {
                            CRUFiltres.push(CRUAFiltrer[i]);
                        }
                    }
                    // On compare l'attribut 'place' de chaque objet et on affiche le plus grand. 
                    if (CRUFiltres.length > 0) {
                        for (let lire = 0; lire < CRUFiltres.length; lire++) {
                            let placeAComparer = CRUFiltres[lire].place;
                            //console.log('Place max =', placeMax, "\n place a comparer = ", placeAComparer)
                            if (parseInt(placeAComparer) > parseInt(placeMax)) {
                                placeMax = placeAComparer;
                                //console.log('Plus grand')
                            } else {
                                // console.log('Plus petit')
                            }
                            if (parcourir === tabAlph.length - 1 && lire === CRUFiltres.length - 1) { console.log("La capacité maximale de la salle", args, "est", placeMax) }
                        }
                    }
                }
            );
        fini = true;
    }
}
module.exports = spec4;