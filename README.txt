Manuel & README | GL02_Mixte - Sujet A
### Description : 

### Requirements

### Installation : 

    $ npm install -i

### Utilisation : 

    $ node caporalCli.js <command> -h
    -f or --help :          afficher l'aide du programme

### Commandes

-----------------------------------------------------------------------------
    readme    : Afficher le manuel dans la console
    $ node caporalCli.js readme
-----------------------------------------------------------------------------
    getSalle  : Afficher les salles d'une matière donnée
    paramètre : ue - nom d'UE (exemple : GL02)

    $ node caporalCli.js getSalle ue
-----------------------------------------------------------------------------
    getSallesLibres  : Afficher les salles libres sur un créneau donné
    paramètre : heureDébut - début du créneau souhaité (exemple : 9:00)
                heureFin - fin du créneau souhaité (exemple : 18:00)
                jour - jour (exemple : L)

    $ node caporalCli.js getSallesLibres heureDébut heureFin jour
-----------------------------------------------------------------------------



