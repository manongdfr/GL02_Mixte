Manuel & README | GL02_Mixte - Sujet A
### Description : 
Ce parser doit permettre de traiter les fichiers au format CRU, qui correspondent à des emploi du temps.

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
Salle = *1 (1 ALPHA 3 DIGIT / ‘SPOR’ / ‘EXT1’ / ‘IUT1’) 



### Installation : 

    $ npm install -i

### Utilisation : 

    $ node caporalCli.js <command> -h
    -f or --help :          afficher l'aide du programme

### Commandes

-----------------------------------------------------------------------------
readme
    readme    : Afficher le manuel dans la console
    $ node caporalCli.js readme
-----------------------------------------------------------------------------
    getSalle  : Afficher les salles d'une matière donnée
    paramètres : ue - nom d'UE (exemple : GL02)

    $ node caporalCli.js getSalle <ue>
-----------------------------------------------------------------------------
    getSallesLibres  : Afficher les salles libres sur un créneau donné
    paramètres: heureDébut - début du créneau souhaité (exemple : 9:00)
                heureFin - fin du créneau souhaité (exemple : 18:00)
                jour - jour (exemple : L)

    $ node caporalCli.js getSallesLibres <heureDébut> <heureFin> <jour>
-----------------------------------------------------------------------------
    getCreneauDispo : Déterminer les créneaux disponible d'une salle donnée
    paramètres: salle - L'ID de la salle en question
    
    $ node caporalCli.js getCreneauDispo <salle>
-----------------------------------------------------------------------------
    getCapaciteMax : Détermine la capacité maximale d'une salle donnée
    paramètres: salle - Le nom de la salle à déterminer la camacité maximale
    
    $ node caporalCli.js getCapaciteMax <salle>
-----------------------------------------------------------------------------
    exportEDT: Export d'un type de cours de l'utilisateur entre 2 dates données
    paramètres: ue - Liste des UE inscrit : ['UE1','UE2','UE3']
                type - Catégorie du cours à exporter : C / D / T
                jourDebut - Première balise pour la recherche des jours de la semaine 
                horaireDebut - Première balise pour la recherche des heures
                jourFin - Deuxième balise pour la recherche des jours de la semaine 
                horaireFin - Deuxième balise pour la recherche des heures
                dateDebutEDT - Première balise pour l'affichage de l'emploi du temps
                dateFinEDT -  Deuxième balise pour l'affichage de l'emploi du temps

    $ node caporalCli.js <ue> <type> <jourDebut> <horaireDebut> <jourFin> <horaireFin> <dateDebutEDT> <datefinEDT>
    

### Jeu de données
Les données fournies sont présentes dans le fichier SujetA_data

### Liste des contributeurs 
S. Olgard (sarah.olgard@utt.fr)
A. Pochard (alexis.pochard@utt.fr)
X. Boone (xuan.boone@utt.fr)
M. Godefroy (manon.godefroy@utt.fr)


### Minimum requirements:
512 GB de mémoire
Intel core i9 14900K ou equivalent
2x RTX GeForce 4090
80GB d'espace de stockage