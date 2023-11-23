var CRU = function(sc, typ, pl, j, hd, hf, sG, salle){
	this.seance = sc;
	this.type = typ;
	this.places = pl;
	this.jour = j;
	this.heureDebut = hd;
	this.heureFin = hf;
	this.sousGroupe = sG;
	this.numSalle = salle;
}

module.exports = CRU;