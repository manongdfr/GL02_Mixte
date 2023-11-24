var CRU = require('./CRU');

//CRU Parser

var CRUParser = function(sTokenize, sParsedSymb){
	// The list of POI parsed from the input file.
	this.parsedCRU = []; // liste d'objets CRU
	this.symb = ["+","","//"];
	this.showTokenize = sTokenize;//booléen initié à l'instantiation. vrai = console.log(liste de ce qu'on a parsé, c.f. ligne 30 ). faux = affiche rien
	this.showParsedSymbols = sParsedSymb;//booléen
	this.errorCount = 0;
}


// Parser procedure

// tokenize : tranform the data input into a list
// <eol> = CRLF
CRUParser.prototype.tokenize = function(data){//data est un string de tout ce qui se trouve dans le fichier
	var separator = /(\r\n|=|, )/;//le separateur est soit "\r\n" (retour à la ligne de windows), soit "=", soit ","
	data = data.split(separator);//on prend le string, on le transforme en liste, avec comme séparateur ce qu'on a défini auparavant
	data = data.filter((val, idx) => !val.match(separator));//on retire les séparateurs de la liste 					
	console.log(data)
	return data;//on retourne la liste de strings, sans les séparateurs.
}

// parse : analyze data by calling the first non terminal rule of the grammar
CRUParser.prototype.parse = function(data){
	var tData = this.tokenize(data);//on appelle tokenize pour transformer le texte en liste
	if(this.showTokenize){//
		console.log(tData);
	}
	this.listPoi(tData);//on commence à analyser la liste. c.f. ligne 88
}

// Parser operand

CRUParser.prototype.errMsg = function(msg, input){
	this.errorCount++;//si error count est 0, le fichier est conforme.
	console.log("Parsing Error ! on "+input+" -- msg : "+msg);
}

// Read and return a symbol from input
CRUParser.prototype.next = function(input){
	var curS = input.shift();
	if(this.showParsedSymbols){
		console.log(curS);
	}
	return curS
}

// accept : verify if the arg s is part of the language symbols.
CRUParser.prototype.accept = function(s){
	var idx = this.symb.indexOf(s);
	// index 0 exists
	if(idx === -1){
		this.errMsg("symbol "+s+" unknown", [" "]);
		return false;
	}

	return idx;
}



// check : check whether the arg elt is on the head of the list
//entrées: 				s = symbole à vérifier
//						input = data

CRUParser.prototype.check = function(s, input){

//accept retourne: 	un int (index). = le premier symbole de input fait partie de la liste de symboles qu'on a défini auparavant. l'index est sa position dans la liste des symboles
//					un bool (faux)  = pas reconnu dans la liste de symbole
	if(this.accept(input[0]) == this.accept(s)){//si le mot à analyser est acceptable, et s (symbole entré) aussi. (ou non acceptable et s aussi)
		return true;	
	}
	return false;
}

// expect : expect the next symbol to be s.
CRUParser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		//next retourne le prochain symbole.
		//next utilise "input.shift() sur la liste. important car shift élimine l'élément en tête de la liste."
		//console.log("Reckognized! "+s)
		return true;
	}else{
		this.errMsg("symbol "+s+" doesn't match", input);
	}
	return false;
}


// Parser rules
// <liste_poi> = *(<poi>) "$$"
CRUParser.prototype.listPoi = function(input){
	this.poi(input);//analyser le corps du texte (<poi>)
	this.expect("$$", input);//lance une erreur si le symbole est pas recconu. "input" est la data / la liste
}

// <poi> = "START_POI" <eol> <body> "END_POI"
// <cru> = "+SEANCE" <eol> <body> "END_POI"
CRUParser.prototype.poi = function(input){

	if(this.check("START_POI", input)){
		this.expect("START_POI", input);//skip un start POI, lancer une erreur si le start poi n'est pas trouvé
		var args = this.body(input);//<body> = <name> <eol> <latlng> <eol> <optional>
		//puis créer un nouveau POI à partir des données qu'on vient de parser avec this.body(input)
		var p = new POI(args.sc, args.typ, args.pl, args.j, args.hd, args.hf, args.pl, args.sG, args.salle);//sc, typ, pl, j, hd, hf, sG, salle
		this.note(input, p);
		this.expect("END_POI",input);
		this.parsedPOI.push(p);//ajouter dans la liste de POI parsé, l'objet qu'on vient de créer
		if(input.length > 0){//continuer à parser si la liste est tojours pas vide
			this.poi(input);
		}
		return true;
	}else{
		return false;
	}

}

// <body> = <name> <eol> <latlng> <eol> <optional>
CRUParser.prototype.body = function(input){
	var nm = this.name(input);
	var ltlg = this.latlng(input);
	return { nm: nm, lt: ltlg.lat, lg: ltlg.lng }; //sc, typ, pl, j, hd, hf, sG, salle
}

// <name> = "name: " 1*WCHAR
CRUParser.prototype.name = function(input){
	this.expect("name",input)
	var curS = this.next(input);
	if(matched = curS.match(/[\wàéèêîù'\s]+/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
	}
}

// <latlng> = "latlng: " ?"-" 1*3DIGIT "." 1*DIGIT", " ?"-" 1*3DIGIT "." 1*DIGIT
CRUParser.prototype.latlng = function(input){
	this.expect("latlng",input)
	var curS = this.next(input);
	if(matched = curS.match(/(-?\d+(\.\d+)?);(-?\d+(\.\d+)?)/)){//format de la longitude/latitude. \d est un double (ou digit, jsp). "\." est un point. "-?" veut dire que "-" est non obligatoire je pense. pour les valeurs négatives
		return { lat: matched[1], lng: matched[3] };
	}else{
		this.errMsg("Invalid latlng", input);
	}
}

// <optional> = *(<note>)
// <note> = "note: " "0"/"1"/"2"/"3"/"4"/"5"
CRUParser.prototype.note = function (input, curPoi){
	if(this.check("note", input)){
		this.expect("note", input);
		var curS = this.next(input);
		if(matched = curS.match(/[12345]/)){
			curPoi.addRating(matched[0]);
			if(input.length > 0){
				this.note(input, curPoi);
			}
		}else{
			this.errMsg("Invalid note");
		}	
	}
}

module.exports = CRUParser;