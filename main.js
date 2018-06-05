/**
 * Fichier créé par Quentin BOUDINOT le 04/06/2018 à 11:32
 */

// ============================================================ DEFINITION DES VARIABLES ============================================================
// Je crée deux tableaux contenant les sessions de A à K (11 lettres)
var tableau_sessions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
var tableau_sessions_copie = tableau_sessions;

// Je crée un tableau contenant les salles n°1/n°2/n°3
var tableau_salles = [1, 2, 3];

// Je crée un tableau contenant les couleurs de 1 à 4 qui matérialise les demi-journées
var tableau_couleurs = [1, 2, 3, 4];

// Je crée une variable nombre d'itérations de base et une variable maximum pour pouvoir itérer dessus lors de mon traitement
var nbIterations = 0;
var nbMaxIterations = 200;

// Je crée un tableau contenant la matrice comprenant les incompatibilités/contraitres. <a remplir plus tard>
var tableau_matrice;

// Je crée le tableau planning
var planning;

// Je crée un string qui contiendra la liste des incompatibilites saisie par l'utilisateur ou par défaut si il ne saisit rien.
var stringIncompatibilites = "AJ,JI,IE,EC,CF,FG,DH,BD,KE,BIHG,AGE,BHK,ABCH,DFJ";

// Je crée un tableau qui contiendra les contraintes saisie par l'utilisateur ou par défaut si il ne saisit rien.
var tableau_contraintes = [['E','J'],['D','K'],['F','K']];

// ============================================================ DECLARATION DES FONCTIONS ============================================================
// Je crée une fonction qui va initialiser la matrice avec les données de l'exercice 2 ou avec les données saisies par l'utilisateur
function initialiserMatrice()
{
    // Je vérifie si il y à des parametres dans l'URL en méthode GET donc si le formulaire à été rempli ou non.
    var urlParams = new URLSearchParams(window.location.search);
    // Si il y en à et que la liste d'incompatibilités est correctement remplie
    if(window.location.search.substr(1) && urlParams.getAll('liste_incompatibilites')[0] !== "")
    {
        // Je récupère les paramètres de l'URL pour liste_incompatibilites
        stringIncompatibilites = urlParams.getAll('liste_incompatibilites')[0];
    }

    // Je découpe la liste des incompatibilités saisies avec le délimiteur "," et je met tout dans un tableau listeIncompatibilites
    var listeIncompatibilites = stringIncompatibilites.split(",");
    // Je crée un tableau listeIncompatibilites_paires qui servira par la suite
    var listeIncompatibilites_paires = [];

    // Pour chaque incompatibilité
    listeIncompatibilites.forEach(function(element) {
        // Je regarde si l'élément est différent de 1 pour pouvoir continuer (vérification pour éviter les incompatibilités seules)
        if(element.length !== 1)
        {
            // Je regarde si l'élément est supérieur à 2 caractère, dans ce cas il faut effectuer une décomposition
            if(element.length > 2)
            {
                switch(element.length)
                {
                    case 3:
                        // Si l'incompatibilité contient 3 caractères (ex : ABC) il faut décomposer en AB,AC,BC
                        var couple1 = element.slice(0,2);
                        var couple2 = element.slice(1,3);
                        var couple3 = element.slice(0,1)+element.slice(-1);
                        // Je stocke les couples décomposés dans le nouveau tableau listeIncompatibilites_paires
                        listeIncompatibilites_paires.push(couple1,couple2,couple3);
                    break;

                    case 4:
                        // Si l'incompatibilité contient 4 caractères (ex : ABCD) il faut décomposer en AB,AC,AD,BC,BD,CD)
                        var couple1 = element.slice(0,2);
                        var couple2 = element.slice(0,1)+element.slice(-2,-1);
                        var couple3 = element.slice(0,1)+element.slice(-1);
                        var couple4 = element.slice(1,3);
                        var couple5 = element.slice(1,2)+element.slice(-1);
                        var couple6 = element.slice(-2);
                        // Je stocke les couples décomposés dans le nouveau tableau listeIncompatibilites_paires
                        listeIncompatibilites_paires.push(couple1,couple2,couple3,couple4,couple5,couple6);
                    break;

                    default:
                        // Si l'incompatibilité contient + de 4 caractères (ex : ABCDE), on ne gère pas dans ce programme.
                        alert('Les incompatibilités ne peuvent contenir plus de 4 lettres');
                }
            }
            // Si l'élement est inférieur est égal à 2 caractères, alors je peux le stocker dans le nouveau tableau listeIncompatibilites_paires
            else
            {
                listeIncompatibilites_paires.push(element);
            }
        }
    });

    // Suppression des doublons
    var i, j, len = listeIncompatibilites_paires.length, listeSansDoublons = [], obj = {};
    for (i = 0; i < len; i++) {
        obj[listeIncompatibilites_paires[i]] = 0;
    }
    for (j in obj) {
        listeSansDoublons.push(j);
    }
    // Je place le contenu du tableau listeSansDoublons dans le tableau listeIncompatibilites_paires
    listeIncompatibilites_paires = listeSansDoublons;

    // J'initialise le tableau matrice à 0
    tableau_matrice = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // Pour finir, pour chaque paire d'incompatibilités dans listeIncompatibilites_paires :
    listeIncompatibilites_paires.forEach(function(element) {
        // Je récupère la lettre1 et la lettre2 (exemple : Couple AB donne lettre1 = A et lettre2 = B)
        var lettre1 = element.slice(0,1);
        var lettre2 = element.slice(1,2);

        // Je génère le nombre correspondant à la lettre1 et à la lettre2 pour pouvoir placer les 1 dans les bonnes cases du tableau tableau_matrice
        var nombrePourLettre1 = lettre1.charCodeAt(0) - 65;
        var nombrePourLettre2 = lettre2.charCodeAt(0) - 65;

        // Je place les 1 dans les cases correspondantes aux couples d'incompatibilités (exemple : Couple AB donnera 1 dans tableau_matrice[0][1] et dans tableau_matrice[1][0])
        tableau_matrice[nombrePourLettre1][nombrePourLettre2] = 1;
        tableau_matrice[nombrePourLettre2][nombrePourLettre1] = 1;
    });

    placerContraintes();
}

// Je crée une fonction qui sert à placer les contraintes
function placerContraintes()
{
    var urlParams = new URLSearchParams(window.location.search);

    // Je place les contraintes si il y en à
    if(window.location.search.substr(1) && urlParams.getAll('c1a')[0] !== "" && urlParams.getAll('c1b')[0] !== "")
    {
        // Je récupère les paramètres de l'URL pour liste_incompatibilites
        var contrainte_1a = urlParams.getAll('c1a')[0];
        var contrainte_1b = urlParams.getAll('c1b')[0];

        tableau_contraintes = [];
        tableau_contraintes.push([contrainte_1a,contrainte_1b]);

        // Je place les contraintes si il y en à
        if(window.location.search.substr(1) && urlParams.getAll('c2a')[0] !== "" && urlParams.getAll('c2b')[0] !== "")
        {
            // Je récupère les paramètres de l'URL pour liste_incompatibilites
            var contrainte_2a = urlParams.getAll('c2a')[0];
            var contrainte_2b = urlParams.getAll('c2b')[0];
            tableau_contraintes.push([contrainte_2a,contrainte_2b]);
        }

        // Je place les contraintes si il y en à
        if(window.location.search.substr(1) && urlParams.getAll('c3a')[0] !== "" && urlParams.getAll('c3b')[0] !== "")
        {
            // Je récupère les paramètres de l'URL pour liste_incompatibilites
            var contrainte_3a = urlParams.getAll('c3a')[0];
            var contrainte_3b = urlParams.getAll('c3b')[0];
            tableau_contraintes.push([contrainte_3a,contrainte_3b]);
        }
    }

    // Pour finir, pour chaque paire d'incompatibilités dans listeIncompatibilites_paires :
    var ite = 1;
    tableau_contraintes.forEach(function(element) {
        // Je récupère la lettre1 et la lettre2 (exemple : Couple AB donne lettre1 = A et lettre2 = B)
        var lettre1 = element[0];
        var lettre2 = element[1];

        // Je génère le nombre correspondant à la lettre1 et à la lettre2 pour pouvoir placer les 1 dans les bonnes cases du tableau tableau_matrice
        var nombrePourLettre1 = lettre1.charCodeAt(0) - 65;
        var nombrePourLettre2 = lettre2.charCodeAt(0) - 65;

        tableau_matrice[nombrePourLettre2][nombrePourLettre1] = 2;

        // J'affiche les contraintes choisies en texte pour faciliter la vision de l'utilisateur
        document.getElementById('contrainte'+ite+'_choisie').innerHTML = 'Contrainte n°'+ite+' : '+lettre1+' avant '+lettre2;
        ite = ite +1 ;
    });
}

// Je crée une fonction qui va vider le planning, c'est à dire vider chaque salle pour chaque demi-journée
function viderPlanning()
{
    planning = [
        [null,null,null],
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ];
}

// Je crée une fonction qui sert à trier les élements d'un tableau dans un ordre aléatoire
function trierTableau(tableau)
{
    // Je fais une copie temporaire du tableau passé en paramètres
    var copie_temporaire = Array.from(tableau);

    var x, iterateur1, iterateur2;

    // Pour iterateur1 allant de la taille du tableau -1 jusqu'à 0, en passant par chaque case on va trier le tableau
    for (iterateur1 = (copie_temporaire.length - 1); iterateur1 > 0; iterateur1--)
    {
        // J'utilise Math.floor(x) qui renvoie le plus grand entier inférieur à x
        // J'utilise Math.random() qui renvoie un nombre flottant aléatoire
        iterateur2 = Math.floor(Math.random() * (iterateur1 + 1));

        // J'effectue le tri
        x = copie_temporaire[iterateur1];
        copie_temporaire[iterateur1] = copie_temporaire[iterateur2];
        copie_temporaire[iterateur2] = x;
    }
    return copie_temporaire;
}

// Je crée une fonction qui sert a verifier qu'il n'y a pas d'incompatibilite
function verifierIncompatibilites(iterateur1, session)
{
    // Je fixe la valeur du booléen à vrai pour dire qu'il n'y à pas d'incompatibilité
    var boolIfIncompatibilite = true;

    // Boucle sur le planning par rapport a une demijournee
    for (var iterateur2 = 0; iterateur2 < planning[iterateur1].length; iterateur2++)
    {
        // Je vérifie si il y à une incompatibilité entre le tableau_sessions et le tableau_sessions_copie.
        if ( !(planning[iterateur1][iterateur2] == null) &&
            (tableau_matrice[tableau_sessions_copie.indexOf(session)][tableau_sessions_copie.indexOf(planning[iterateur1][iterateur2])] === 1))
        {
            // Je fixe la valeur du booléen à faux pour dire qu'il y à une incompatibilité
            boolIfIncompatibilite = false;
            // Je sors directement de la boucle for
            break;
        }
    }
    return boolIfIncompatibilite;
}

// Je crée une fonction qui sert a vérifier si il y à une condition d'antériorité sur une session
function verifierAnteriorite(session, demijour)
{
    // Je fixe la valeur du booléen à vrai pour dire qu'il n'y à pas d'antériorité
    var boolIfAnteriorite = true;

    // Je prend l'index de la premiere occurence de la session et je le stocke dans iterateur1
    var iterateur1 = tableau_sessions_copie.indexOf(session);

    // Je fais une boucle depuis 0 jusqu'à la taille de la premiere occurence de la session du tableau_matrice
    for (var iterateur2 = 0; iterateur2 < tableau_matrice[iterateur1].length; iterateur2++)
    {
        // Je vérifie si il y à un 2 dans la case en question, si oui alors il y à une antériorité
        if (tableau_matrice[iterateur1][iterateur2] === 2)
        {
            // Je fixe la valeur du booléen à faux en fonction de l'état d'antériorité sinon je met le booléen à vrai
            boolIfAnteriorite &= ((tableau_sessions.indexOf(tableau_sessions_copie[iterateur2]) < 0) && (planning[demijour].indexOf(tableau_sessions_copie[iterateur2]) < 0));
        }
    }
    return boolIfAnteriorite;
}

// ============================================================ DEBUT DU PROGRAMME ============================================================
// J'initialise tableau_matrice
initialiserMatrice();

// Je boucle tant que le nombre d'itérations n'a pas atteint le nombre d'itérations maximum et tant que le tableau_sessions n'est pas vide
while (nbIterations < nbMaxIterations && tableau_sessions.length > 0)
{
    // Je trie le tableau_sessions_copie dans un ordre aléatoire et je le place dans tableau_sessions ce qui me permet de mélanger le tableau_sessions
    tableau_sessions = trierTableau(tableau_sessions_copie);

    // Je met le planning à null
    viderPlanning();

    // Je boucle sur chaque couleur (1 à 4)
    for (var it1 = 0; it1 < (tableau_couleurs.length); it1++)
    {
        // Je boucle sur chaque salle (1 à 3)
        for (var it2 = 0; it2 < (tableau_salles.length); it2++)
        {
            // Je boucle sur le nombre de sessions encore libres
            for (var it3 = 0; it3 < (tableau_sessions.length); it3++)
            {
                // Je vérifie si pour la session en question il y à des incompatibilités, une notion d'antériorité et surtout : si la case du planning est vide
                if (verifierIncompatibilites(it1, tableau_sessions[it3])
                    && verifierAnteriorite(tableau_sessions[it3], it1) !== 0
                    && planning[it1][it2] === null)
                {
                    // Je rajoute la session choisie dans le planning
                    planning[it1][it2] = tableau_sessions[it3];

                    // J'enlève la session choisie dans la liste des sessions libres
                    tableau_sessions.splice(it3, 1);
                }
            }
        }
    }
    // J'incrémente de 1 le compteur d'iteration
    nbIterations++;
}

// ============================================================ AFFICHAGE DU RESULTAT EN HTML ============================================================

// Je crée un itérateur qui me servira pour placer le texte dans mon HTML en CSS
var iterateur = 1;

// Je boucle sur chaque élément du planning
planning.forEach(function(element)  {
    // Je vérifie si l'élement est non-vide et je place le nom de la session dans la case du tableau HTML correspondant
    if(element[0]) {
        document.getElementById('creneau'+iterateur).innerHTML = element[0];
    }
    // J'ajoute 1 à l'itérateur pour les sessions suivantes et ainsi de suite pour les 3 sessions de chaque demi-journée.
    iterateur = iterateur+1;
    if(element[1]) {
        document.getElementById('creneau'+iterateur).innerHTML = element[1];
    }
    iterateur = iterateur+1;
    if(element[2]) {
        document.getElementById('creneau'+iterateur).innerHTML = element[2];
    }
    iterateur = iterateur+1;
});

// J'affiche le block planning
document.getElementById('planning').style.display = 'block';
// J'affiche les incompatibilités choisies en texte pour faciliter la vision de l'utilisateur
document.getElementById('incompatibilites_choisies').innerHTML = 'Incompatibilites choisies : '+stringIncompatibilites+'.';

// ============================================================ FIN DU PROGRAMME ============================================================