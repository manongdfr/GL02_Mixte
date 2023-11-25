var CRU = function(ue, statut, type, place, jour, heureDebut, heureFin, sousGroupe, numSalle){
	this.ue = ue;
	this.statut = statut,
	this.type = type,
	this.place = place,
	this.jour = jour,
	this.heureDebut = heureDebut,
  this.heureFin = heureFin,
	this.sousGroupe = sousGroupe,
	this.numSalle = numSalle;
}


module.exports = CRU;