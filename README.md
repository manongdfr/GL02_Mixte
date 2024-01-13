Manuel & README | GL02_Mixte - Sujet A

### Description :

Ce parser doit permettre de traiter les fichiers au format CRU, qui correspondent à des emplois du temps.

### Requirements

Les fichiers data.edt doivent respecter la grammaire suivante :

UE = ‘+’ NomUE CRLF 1* Séance
FichierDonnees = 1* UE
NomUE = 2*7 ALPHA *2 DIGIT *1 ALPHA *1 ( 'A' / 'T1' / 'F' / 'R' )
Séance = ‘1,’ Type ’, P=’ 1*3DIGIT ‘, H=’ 1*2 Cours ‘/’ CRLF
Type = (‘T’/’D’/’C’) (‘1’/’2’/’3’/’4’/’5’/’6’/’7’/’8’/’9’/’10’/’11’/’12’/’13’/’14’/’15’)
Cours = CreneauCours ‘, F’ (‘ ’/‘1’/’2’/’A’/’B’) ‘, S=’ *1 Salle ‘/’
CreneauCours = Jour WSP Horaire
Jour = ‘L’/ ’MA’ / ‘ME’ / ‘J’/ ‘V’ / ‘S’
Horaire = *1 (Heure ‘ :’ Minute) ‘-‘ Heure ‘ :’ Minute
Heure= ‘8’ / ‘9’ / ‘10’ / ‘11’ / ‘12’ / ‘13’ / ‘14’ / ‘15’ / ‘16’ / ‘17’ / ‘18’ / ‘19’ / ‘20’ Minute= ‘00’ / ‘30’
Salle = \*1 (1 ALPHA 3 DIGIT / ‘SPOR’ / ‘EXT1’ / ‘IUT1’)

### Installation :

    $ npm install -i

### Utilisation :

    $ node caporalCli.js <command> -h
    -f or --help :          afficher l'aide du programme

### Commandes

---

    readme : Afficher le manuel dans la console.
    $ node caporalCli.js readme

---

    getSalle : Afficher les salles d'une matière donnée.
    paramètres : ue - nom d'UE (exemple : GL02)

    $ node caporalCli.js getSalle <ue>

---

    getSallesLibres : Afficher les salles libres sur un créneau donné.
    paramètres: heureDébut - début du créneau souhaité (exemple : 9:00)
                heureFin - fin du créneau souhaité (exemple : 18:00)
                jour - jour (Notations des jours : L MA ME J V S)

    $ node caporalCli.js getSallesLibres <heureDébut> <heureFin> <jour>

---

    getCreneauDispo : Déterminer les créneaux disponibles d'une salle donnée.
    paramètres: salle - L'ID de la salle en question

    $ node caporalCli.js getCreneauDispo <salle>

---

    getCapaciteMax : Détermine la capacité maximale d'une salle donnée.
    paramètres: salle - Le nom de la salle à déterminer la capacité maximale

    $ node caporalCli.js getCapaciteMax <salle>

---

    getNbSalleCapacite : Détermine le nombre de salles par capacités d'accueil maximales.
    paramètres: néant 

    $ node caporalCli.js getNbSalleCapacite

---
    exportEDT: Export d'un type de cours de l'utilisateur entre 2 dates données.
    paramètres: ue - Liste des UE inscrit : ['UE1','UE2','UE3']
                type - Catégorie du cours à exporter : C / D / T
                jourDebut - Première balise pour la recherche des jours de la semaine (sous la forme : L, MA, ME, J, V, S)
                horaireDebut - Première balise pour la recherche des heures (sous la forme : 8:00)
                jourFin - Deuxième balise pour la recherche des jours de la semaine(sous la forme : L, MA, ME, J, V, S)
                horaireFin - Deuxième balise pour la recherche des heures(sous la forme : 8:00)
                dateDebutEDT - Première balise pour l'affichage de l'emploi du temps(sous la forme : 06/12/2023 )
                dateFinEDT -  Deuxième balise pour l'affichage de l'emploi du temps(sous la forme : 06/12/2023 )
                

    $ node caporalCli.js <ue> <type> <jourDebut> <horaireDebut> <jourFin> <horaireFin> <dateDebutEDT> <datefinEDT>

### Jeu de données

Les données fournies sont présentes dans le fichier SujetA_data

### Test Unitaires

    npm test

Test_semantic :
"can create a new CRU"
"should return an array with different room"

Test_syntactic :
"can read a 'ue' from a simulated input"
"can read a 'place' from a simulated input"
"can read a 'salle' from a simulated input"
"can read a 'statut' from a simulated input"
"can read a 'type' from a simulated input"
"can read a 'sousgroupe' from a simulated input"

### Liste des contributeurs

S. Olgard (sarah.olgard@utt.fr)
A. Pochard (alexis.pochard@utt.fr)
X. Boone (xuan.boone@utt.fr)
M. Godefroy (manon.godefroy@utt.fr)
