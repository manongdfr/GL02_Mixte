var CRU = require("./CRU");

var CRUParser = function (sTokenize, sParsedSymb) {
  // The list of CRU parsed from the input file.
  this.parsedCRU = [];
  this.symb = ["Seance2 S=4", "+", "//\n", "P", "H", "S", "//", "//\n\n"];
  this.showTokenize = sTokenize;
  this.showParsedSymbols = sParsedSymb;
  this.errorCount = 0;
};

//
// Parser procedure
//

// tokenize : tranform the data input into a list
CRUParser.prototype.tokenize = function (data) {
  var separator = /(\r\n|[+]|=|,|[/][/]\r\n)/;
  data = data.split(separator);

  var separator = /(\r\n|=|,|[/][/]\r\n)/;
  data = data.filter((val, idx) => !val.match(separator));
  //Ignorer les 15 premiers inputs qui correspondent aux phrases d'explication du début de fichier
  for (i = 0; i < 14; i++) {
    this.next(data);
  }

  return data;
};

// parse : analyze data by calling the first non terminal rule of the grammar
CRUParser.prototype.parse = function (data) {
  var tData = this.tokenize(data);
  if (this.showTokenize) {
    console.log(tData);
  }
  this.listCru(tData); 
};

//
// Parser operand
//

CRUParser.prototype.errMsg = function (msg, input) {
  this.errorCount++; 
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

//  check : check whether the arg elt is on the head of the list
CRUParser.prototype.check = function (s, input) {
  if (this.accept(input[0]) == this.accept(s)) {
    //si le mot à analyser est acceptable, et s (symbole entré) aussi. (ou non acceptable et s aussi)
    return true;
  }
  return false;
};

// expect : expect the next symbol to be s.
CRUParser.prototype.expect = function (s, input) {
  if (s == this.next(input)) {
    return true;
  } else {
    this.errMsg("symbol " + s + " doesn't match", input);
  }
  return false;
};

// --------------------------------------------------------
//
//                    Parser rules
//
// --------------------------------------------------------

// listCru
CRUParser.prototype.listCru = function (input) {
  this.cru(input); //analyser le corps du texte (<cru>)
  this.expect("\r\n", input);
};

// CRU
CRUParser.prototype.cru = function (input) {
  if (this.check("", input)) {
    this.expect("", input);
    var args = this.body(input);

    var p = new CRU(
      args.ue,
      args.statut,
      args.type,
      args.place,
      args.horaire,
      args.sousgroupe,
      args.salle
    );
    UE = args.ue;
    //console.log(p);
    this.parsedCRU.push(p);
    if (input.length > 12) {
      if (input[1] === "+") {
        this.cru(input);
      } else {
        this.cru2(input, UE);
      }
    }
    return true;
  } else {
    return false;
  }
};

CRUParser.prototype.cru2 = function (input, UE) {
  if (this.check(1, input)) {
    var args = this.bodySansUe(input);

    var p = new CRU(
      UE,
      args.statut,
      args.type,
      args.place,
      args.horaire,
      args.sousgroupe,
      args.salle
    );

    this.parsedCRU.push(p);
    if (input.length > 12) {
      if (input[1] === "+") {
        this.cru(input);
      } else {
        //cru2 = sans UE needle
        this.cru2(input, UE);
      }
    } else {
    }
    return true;
  } else {
    return false;
  }
};

// contenu cru récupérés
CRUParser.prototype.body = function (input) {
  var ue = this.ue(input);
  var statut = this.statut(input);
  var type = this.type(input);
  var place = this.place(input);
  var horaire = this.horaire(input);
  var sousgroupe = this.sousgroupe(input);
  var salle = this.salle(input);
  return {
    ue: ue,
    statut: statut,
    type: type,
    place: place,
    horaire: horaire,
    sousgroupe: sousgroupe,
    salle: salle,
  };
};

//contenu cru sans UE
CRUParser.prototype.bodySansUe = function (input) {
  var statut = this.statut(input);
  var type = this.type(input);
  var place = this.place(input);
  var horaire = this.horaire(input);
  var sousgroupe = this.sousgroupe(input);
  var salle = this.salle(input);
  return {
    statut: statut,
    type: type,
    place: place,
    horaire: horaire,
    sousgroupe: sousgroupe,
    salle: salle,
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

CRUParser.prototype.horaire = function (input) {
  this.expect("H", input);
  var curS = input[0];
  if (
    (matched = curS.match(
      /([L]|[M][A]|[M][E]|[J]|[V]|[S])([" "])([0-9]{1,2}:[0-9]{1,2})(-)([0-9]{1,2}:[0-9]{1,2})/g
    ))
  ) {
    matched = matched[0].split(/( )|-/);

    return { matched };
  } else {
    this.errMsg("Invalid horaire", input);
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
