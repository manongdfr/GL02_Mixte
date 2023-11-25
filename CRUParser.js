var CRU = require("./CRU");

//CRU Parser

var CRUParser = function (sTokenize, sParsedSymb) {
  // The list of CRU parsed from the input file.
  this.parsedCRU = [];
  // this.symb = ["Seance2 S=4","+","P","H","S","//", "//\n\n"];
  this.symb = ["Seance2 S=4", "P", "H", "S", "//", "//\n\n"];
  this.showTokenize = sTokenize;
  this.showParsedSymbols = sParsedSymb;
  this.errorCount = 0;
};

// Parser procedure

// tokenize : tranform the data input into a list
CRUParser.prototype.tokenize = function (data) {
  const regexCours = /(^\+([A-Z]{2,10}\d{0,2}[A-Z]?\d?)$)|(^1,.*\/\/$)/;
  const separator = /\r\n/;
  data = data.split(separator);
  data = data.filter((val, idx) => val.match(regexCours));
  data = this.supUVUV(data);
  return data;
};

CRUParser.prototype.supUVUV = function(data){
  const regex = /\+UVUV/;
  data = data.filter((val,idx) => !val.match(regex));
  return data;
}

// parse : analyze data by calling the first non terminal rule of the grammar
CRUParser.prototype.parse = function (data) {
  var tData = this.tokenize(data);
  if (this.showTokenize) {
    console.log(tData);
  }
  this.listCru(tData); //on commence à analyser la liste. c.f. ligne 88
};

// Parser operand

CRUParser.prototype.errMsg = function (msg, input) {
  this.errorCount++; //si error count est 0, le fichier est conforme.
  console.log("Parsing Error ! on " + input + " -- msg : " + msg);
};

// Read and return a symbol from input
CRUParser.prototype.next = function (input) {
  var curS = input.shift();
  if (this.showParsedSymbols) {
    console.log(curS);
  }
  return curS;
};

// accept : verify if the arg s is part of the language symbols.
CRUParser.prototype.accept = function (s) {
  var idx = this.symb.indexOf(s);
  // index 0 exists
  if (idx === -1) {
    this.errMsg("symbol " + s + " unknown", [" "]);
    return false;
  }

  return idx;
};

/*  check : check whether the arg elt is on the head of the list
	entrées: 				s = symbole à vérifier
	input = data */

CRUParser.prototype.check = function (s, input) {
  //accept retourne: 	un int (index). = le premier symbole de input fait partie de la liste de symboles qu'on a défini auparavant. l'index est sa position dans la liste des symboles
  //					un bool (faux)  = pas reconnu dans la liste de symbole
  if (this.accept(input[0]) == this.accept(s)) {
    //si le mot à analyser est acceptable, et s (symbole entré) aussi. (ou non acceptable et s aussi)
    return true;
  }
  return false;
};

// expect : expect the next symbol to be s.
CRUParser.prototype.expect = function (s, input) {
  if (s == this.next(input)) {
    //next retourne le prochain symbole.
    //next utilise "input.shift() sur la liste. important car shift élimine l'élément en tête de la liste."
    return true;
  } else {
    this.errMsg("symbol " + s + " doesn't match", input);
  }
  return false;
};

//
//
// Parser rules
//
//

// listCru
CRUParser.prototype.listCru = function (input) {
  this.cru(input); //analyser le corps du texte (<cru>)
  this.expect("\r\n", input);
};

// CRU
CRUParser.prototype.cru = function (input) {
  if (this.check("", input)) {
    this.expect("", input); //skip un start CRU, lancer une erreur si le start cru n'est pas trouvé
    var args = this.body(input); //contenu CRU
    if (args == undefined) {
      console.log("args undefined".red);
      return true;
    }

    //puis créer un nouveau CRU à partir des données qu'on vient de parser avec this.body(input)

    console.log("kjbqdvkbzlqkbvzlkqbvzl".blue);
    console.log(input[3]);

    var p = new CRU();
    //   args.ue,
    //   args.statut,
    //   args.type,
    //   args.place,
    //   args.jour,
    //   args.heureDebut,
    //   args.heureFin,
    //   args.sousgroupe,
    //   args.salle

    this.note(input, p);
    this.expect("//\n\n", input);
    this.parsedCRU.push(p); //ajouter dans la liste de CRU parsé, l'objet qu'on vient de créer
    if (input.length > 12) {
      //continuer à parser si la liste est tojours pas vide
      if (input[1] === "+") {
        this.cru(input);
      } else {
        console.log("fin de fichier".blue);
      }
    }
    return true;
  } else {
    return false;
  }
};

// contenu cru récupérés
CRUParser.prototype.body = function (input) {
  console.log(input);

  return {
    ue: ue,
    statut: statut,
    typeS: typeS,
    NbPlace: NbPlace,
    jour: jour,
    heureDebut: heureDebut,
    heureFin: heureFin,
    sousGroupe: sousGroupe,
    numSalle: numSalle,
  };
};

//Nom de l'UE
CRUParser.prototype.ue = function (input) {
  this.expect("+", input);
  var curS = this.next(input);
  if ((matched = curS.match(/[A-Z0-9]{2,7}/g))) {
    return matched[0];
  } else {
    this.errMsg("Invalid UE name", input);
  }
};

//Statut de l'UE toujours = 1
CRUParser.prototype.statut = function (input) {
  if (this.expect("1", input) === true) {
    return "1";
  } else {
    this.errMsg("Invalid statut not equal 1", input);
  }
};

//Type de cours
CRUParser.prototype.type = function (input) {
  var curS = input[0];
  if ((matched = curS.match(/([A-Z][0-9])/g))) {
    return matched[0];
  } else {
    this.errMsg("Invalid type", input);
  }
};

//Nombre de places
CRUParser.prototype.place = function (input) {
  this.next(input);
  this.expect("P", input);
  var curS = this.next(input);
  if ((matched = curS.match(/([0-9]{1,3})/))) {
    return matched[0];
  } else {
    this.errMsg("Invalid number places", input);
  }
};

//Horaire
CRUParser.prototype.horaire = function (input) {
  this.expect("H", input);

};

//Sous-groupe (F+ une lettre ou un chiffre)
CRUParser.prototype.sousgroupe = function (input) {
  var curS = this.next(input);
  curS = this.next(input);
  if ((matched = curS.match(/([F][A-Z0-9])/g))) {
    return matched[0];
  } else {
    this.errMsg("Invalid sous groupe", input);
  }
};

//Salle
CRUParser.prototype.salle = function (input) {
  this.expect("S", input);
  var curS = this.next(input);
  if ((matched = curS.match(/[A-Z0-9]{4}/g))) {
    return matched[0];
  } else {
    this.errMsg("Invalid salle", input);
  }
};

module.exports = CRUParser;
