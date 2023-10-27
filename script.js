


// ######################################################### affichage des employés #########################################################

// definition des variables globales
let bureaux = [];
let employes = [];









// Cette fonction récupère et affiche la liste des employés dans la table
function afficherListeEmployes(employes) {
    const tableau = document.getElementById("tableau");



    employes.forEach((employe, index) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
    <td>${employe.prenom}</td>
    <td><img src="${employe.image}" width="50px" /></td>
    <td><button type="button" class="btn btn-danger" onclick="supprimerEmploye(${index})">Supprimer</button></td>
    `;
        tableau.appendChild(newRow);
    });
}


// Fonction pour remplir le tableau des employés avec des employés vides
function fillEmptyEmployees() {
    const emptyEmployee = {
        "prenom": "",
        "image": ""
    };


    nbplaces = 0;

    for (let i = 0; i < bureaux.length; i++) {
        nbplaces += bureaux[i].places;
    }



    while (employes.length < nbplaces) {
        employes.push(emptyEmployee);
    }


}



function generateTable(bureauIndex) {
    let tableHTML = "<table class='table table-bordered'>";
    let bureau = bureaux[bureauIndex];
    for (let j = 0; j < 2; j++) {
        tableHTML += "<tr>";
        for (let k = 0; k < bureau.places / 2; k++) {
            let employe = employes.pop();
            if (employe.image == "") {
                tableHTML += "<td class=employee-cell height='100px width='100px'></td>";
            } else {
                tableHTML += "<td class=employee-cell><img src='" + employe.image + "' height='100px' /></td>";
            }
        }
        tableHTML += "</tr>";
    }
    tableHTML += "</table>";
    return tableHTML;
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
            console.error("Erreur lors de la requête : ", error);
        });

    // actualiser la page
    location.reload();
}


// Cette fonction est appelée lorsque vous cliquez sur "Ajouter"
document.getElementById("ajout").addEventListener("click", ajouterEmploye);


// Cette fonction est appelée lorsque vous cliquez sur "Supprimer"
function supprimerEmploye(index) {


    console.log("supprimerEmploye");

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
            console.log('Employé supprimé avec succès !');
            // Vous pouvez mettre à jour la liste des employés et les tables ici si nécessaire
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'employé :', error);
        });

    // actualiser la page
    location.reload();

}



// ######################################################### melange des employés #########################################################

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}



// ######################################################### chargement des employés et des bureaux #########################################################


// Chargez la liste des employés existante depuis le serveur
fetch('http://192.168.75.154:3000/getEmployees')
    .then(response => response.json())
    .then(data => {
        console.log('Employés chargés avec succès : ', data);
        afficherListeEmployes(data);

        employes = data;

        // recupere les bureaux
        fetch('http://192.168.75.154:3000/getBureaux')
            .then(response => response.json())
            .then(data => {
                console.log('Bureaux chargés avec succès : ', data);
                bureaux = data;
                // remplir les employés vides
                fillEmptyEmployees();
                // melanger les employés
                shuffle(employes);
                // generer les tables
                for (let i = 0; i < bureaux.length; i++) {
                    let tableHTML = generateTable(i);
                    document.getElementById("bureau" + (i + 1) + "Table").innerHTML = tableHTML;
                }
            })
            .catch(error => {
                console.error('Erreur de chargement des bureaux :', error);
            });



        // Vous pouvez également mettre à jour les tables ici si nécessaire
    })
    .catch(error => {
        console.error('Erreur de chargement des employés :', error);
    });
