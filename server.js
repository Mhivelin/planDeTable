const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importez le module cors

app.use(cors()); // Activez CORS pour toutes les routes

app.use(bodyParser.json());

// Route pour servir la page HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// La route '/addEmployee' pour gérer les ajouts d'employés
app.post('/addEmployee', (req, res) => {
    // On récupère les données envoyées
    const employee = req.body;
    console.log(employee);
    // On lit le fichier JSON
    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        // On parse le fichier JSON
        const employes = JSON.parse(data);
        // On ajoute l'employé
        employes.push(employee);
        // On réécrit le fichier JSON
        fs.writeFile(__dirname + '/employes.json', JSON.stringify(employes), (err) => {
            if (err) {
                console.log(err);
                res.json({ success: false });
                return;
            }
            res.json({ success: true });
        });
    }
    );
}
);



// La route '/getEmployees' pour récupérer la liste des employés
app.get('/getEmployees', (req, res) => {
    // On lit le fichier JSON
    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        // On parse le fichier JSON
        const employes = JSON.parse(data);
        res.json(employes);
    });
}
);


// La route '/getBureaux' pour récupérer la liste des bureaux
app.get('/getBureaux', (req, res) => {
    // On lit le fichier JSON
    fs.readFile(__dirname + '/bureaux.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        // On parse le fichier JSON
        const bureaux = JSON.parse(data);
        res.json(bureaux);
    });
}
);

// La route '/supprimerEmploye' pour supprimer un employé

/* exemple d'appel
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
                });*/
app.post('/supprimerEmploye', (req, res) => {
    // On récupère les données envoyées
    const id = req.body.id;
    // On lit le fichier JSON
    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        // On parse le fichier JSON
        const employes = JSON.parse(data);
        // On supprime l'employé
        employes.splice(id, 1);
        // On réécrit le fichier JSON
        fs.writeFile(__dirname + '/employes.json', JSON.stringify(employes), (err) => {
            if (err) {
                console.log(err);
                res.json({ success: false });
                return;
            }
            res.json({ success: true });
        });
    }
    );
}

);



app.listen(3000, () => {
    console.log('Serveur écoutant sur le port 3000');
});
