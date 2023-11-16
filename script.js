


// ######################################################### affichage des employés #########################################################
















function generateTable(bureaux) {

    largeur = 0;
    longueur = 0;

    // calculer la largeur et la longueur du tableau

    // largeur = nombre de colonnes
    largeur = bureaux[0].length;

    // longueur = nombre de lignes
    longueur = bureaux.length;

    //console.log("largeur : " + largeur);
    //console.log("longueur : " + longueur);

    // recupere le tableau <table class="table table-bordered">


    let tableau = document.getElementById("tableau");

    // creation des lignes et des colonnes
    for (let i = 0; i < longueur; i++) {
        let ligne = document.createElement("tr");
        for (let j = 0; j < largeur; j++) {
            let colonne = document.createElement("td");

            if (bureaux[i][j] != '') {
                // on ajoute l'id de la place
                colonne.id = "place" + bureaux[i][j];
                // on ajoute la classe place
                colonne.classList.add("place");

            }
            colonne.classList.add("x" + j);
            colonne.classList.add("y" + i);



            ligne.appendChild(colonne);
        }
        tableau.appendChild(ligne);


    }

}



// Cette fonction récupère et affiche la liste des employés dans la table
function placerEmployes(employes) {
    for (let i = 0; i < employes.length; i++) {



        let id = "place" + employes[i].placeActuelle;

        console.log("id : " + id);

        placeTableau = document.getElementById(id);

        console.log("placeTableau : " + placeTableau);

        placeTableau.innerHTML = "<img src=" + employes[i].image + " class='img-fluid' alt='employe' width='100' height='100'>";


    }


}


function afficherEmployes(employes) {
    // ajoute les employés dans la liste des employés
    /* | Prénom	 | Image	| Place actuelle | Action |
    |-----------|-----------|----------------|--------|
    | Adele	 | Adele.png | 1				 | Supprimer |

    */
    /*
        let listeEmployes = document.getElementById("tableauEmploye");
    
        for (let i = 0; i < employes.length; i++) {
    
            let ligne = document.createElement("tr");
    
            let colonnePrenom = document.createElement("td");
            colonnePrenom.innerHTML = employes[i].prenom;
            ligne.appendChild(colonnePrenom);
    
            let colonneImage = document.createElement("td");
            colonneImage.innerHTML = "<img src=" + employes[i].image + " class='img-fluid' alt='employe' width='100' height='100'>";
            ligne.appendChild(colonneImage);
    
            let colonnePlaceActuelle = document.createElement("td");
            colonnePlaceActuelle.innerHTML = employes[i].placeActuelle;
            ligne.appendChild(colonnePlaceActuelle);
    
            let colonneAction = document.createElement("td");
            colonneAction.innerHTML = "<button type='button' class='btn btn-danger' onclick='supprimerEmploye(" + i + ")'>Supprimer</button>";
            ligne.appendChild(colonneAction);
    
            listeEmployes.appendChild(ligne);
    
    
    
        }*/
}


// ######################################################### ajout et suppression des employés #########################################################






// Cette fonction ajoute un employé au serveur

const imageInput = document.getElementById('image');

function ajouterEmploye() {
    const prenom = document.getElementById("prenom").value;
    const imageInput = document.getElementById("image");
    const imageFile = imageInput.files[0];



    if (!prenom || !imageFile) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    const formData = new FormData();
    formData.append("prenom", prenom);
    formData.append("image", imageFile);

    fetch("http://192.168.75.154:3000/addEmployee", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Employé ajouté avec succès !");
                // Réinitialisez les champs du formulaire si nécessaire
                document.getElementById("prenomInput").value = "";
                imageInput.value = "";
            } else {
                alert("Une erreur s'est produite lors de l'ajout de l'employé.");
            }
        })
        .catch(error => {
            //console.error("Erreur lors de la requête : ", error);
        });

    // actualiser la page
    //location.reload();
}


// Cette fonction est appelée lorsque vous cliquez sur "Ajouter"
document.getElementById("ajout").addEventListener("click", ajouterEmploye);


// Cette fonction est appelée lorsque vous cliquez sur "Supprimer"
function supprimerEmploye(index) {


    //console.log("supprimerEmploye");

    // La route '/supprimerEmploye' pour supprimer un employé
    fetch('http://192.168.75.154:3000/supprimerEmploye', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: index }),
    })
        .then(response => response.json())
        .then(result => {
            //console.log('Employé supprimé avec succès !');
            // Vous pouvez mettre à jour la liste des employés et les tables ici si nécessaire
        })
        .catch(error => {
            //console.error('Erreur lors de la suppression de l\'employé :', error);
        });

    // actualiser la page
    location.reload();

}



// ######################################################### melange des employés #########################################################

function shuffle() {
    // appel de l'api pour melanger les employés
    fetch('http://192.168.75.154:3000/shuffleEmployees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employes: employes }),
    })
        .then(response => response.json())
        .then(result => {
            //console.log('Employés mélangés avec succès !');
            // Vous pouvez mettre à jour la liste des employés et les tables ici si nécessaire
        })
        .catch(error => {
            //console.error('Erreur lors du mélange des employés :', error);
        });







}

// Cette fonction est appelée lorsque vous cliquez sur "Mélanger"
document.getElementById("melange").addEventListener("click", shuffle);



// ######################################################### chargement des employés et des bureaux #########################################################


let bureaux = [];

function fetchBureaux() {
    try {
        fetch('http://192.168.75.154:3000/getBureaux')
            .then(response => response.json())
            .then(data => {
                bureaux = data;
                console.log(bureaux);
                generateTable(bureaux);
            });

    } catch (error) {
        console.error("Une erreur s'est produite : ", error);
    }
}

fetchBureaux();






let employes = [];

function fetchEmployees() {
    try {
        fetch('http://192.168.75.154:3000/getEmployees')
            .then(response => response.json())
            .then(data => {
                employes = data;
                console.log(employes);
                placerEmployes(employes);
                afficherEmployes(employes);
            });



        // Vous pouvez effectuer d'autres opérations avec les données ici
    } catch (error) {
        console.error("Une erreur s'est produite : ", error);
    }
}

fetchEmployees();



// ######################################################### ajout et suppression des bureaux #########################################################

// Cette fonction est appelée lorsque vous cliquez sur une case du tableau qui n'est pas un bureau


function toggleBureau(x, y) {



    // La route '/addBureau' pour ajouter un bureau
    fetch('http://192.168.75.154:3000/toggleBureau', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ places: 1, x: x, y: y }),
    })
        .then(response => response.json())
        .then(result => {
            //console.log('Bureau ajouté avec succès !');
            // Vous pouvez mettre à jour la liste des bureaux et les tables ici si nécessaire
        })
        .catch(error => {
            //console.error('Erreur lors de l\'ajout du bureau :', error);
        });

    // actualiser la page
    location.reload();

}

// declanchement de la fonction ajouterBureau

// liste des cases
let cases = document.getElementsByClassName("place");

for (let i = 0; i < cases.length; i++) {
    console.log(cases[i]);
    cases[i].addEventListener("click", function () {



        // recuperation des coordonnées de la case
        let x = this.classList[1].slice(1);
        let y = this.classList[2].slice(1);

        toggleBureau(x, y);

    });
}


