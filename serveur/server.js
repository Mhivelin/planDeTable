const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/'); // Répertoire de destination
    },
    filename: function (req, file, cb) {
        const employeeName = req.body.prenom; // Utilisez le nom de l'employé depuis le corps de la requête
        const imageExtension = file.originalname.split('.').pop(); // Obtenez l'extension du fichier d'origine
        const imageFileName = `${employeeName}.${imageExtension}`; // Générez le nom du fichier
        cb(null, imageFileName);
    },
});


const upload = multer({ storage: storage });


app.get('/', (req, res) => {
    // Serve the HTML file for your front-end here
    res.sendFile(__dirname + '/index.html');
});




app.post('/addEmployee', upload.single('image'), (req, res) => {
    const prenom = req.body.prenom;
    const imageFileName = req.file.filename; // Le nom du fichier image après avoir été stocké par multer


    console.log(req.body);

    if (!prenom || !imageFileName) {
        return res.json({ success: false, message: "Veuillez fournir un prénom et une image" });
    }

    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: "Erreur lors de la lecture du fichier employes.json" });
        }

        const employes = JSON.parse(data);
        const nouvelEmploye = {
            prenom,
            image: imageFileName
        };

        employes.push(nouvelEmploye);

        fs.writeFile(__dirname + '/employes.json', JSON.stringify(employes, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: "Erreur lors de l'écriture du fichier employes.json" });
            }

            return res.json({ success: true, message: "Employé ajouté avec succès" });
        });
    });
});





app.get('/getEmployees', (req, res) => {
    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const employes = JSON.parse(data);
        res.json(employes);
    });
});

app.get('/getBureaux', (req, res) => {

    // affichage console
    console.log("getBureaux");

    fs.readFile(__dirname + '/bureaux.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const bureaux = JSON.parse(data);



        /*
        [
  {
    '1': { x: 0, y: 0 },
    '2': { x: 0, y: 1 },
    '3': { x: 1, y: 0 },
    '4': { x: 1, y: 1 },
    '5': { x: 0, y: 5 },
    '6': { x: 0, y: 6 },
    '7': { x: 1, y: 5 },
    '8': { x: 1, y: 6 },
    '9': { x: 0, y: 9 },
    '10': { x: 0, y: 10 },
    '11': { x: 1, y: 9 },
    '12': { x: 1, y: 10 },
    '13': { x: 5, y: 9 },
    '14': { x: 5, y: 10 },
    '15': { x: 6, y: 9 },
    '16': { x: 6, y: 10 },
    '17': { x: 7, y: 9 },
    '18': { x: 7, y: 10 },
    '19': { x: 8, y: 9 },
    '20': { x: 8, y: 10 }
  }
]
 */


        xMax = 0;
        yMax = 0;

        // recuperation des valeurs max de x et y
        for (let i = 0; i < bureaux.length; i++) {
            for (const [key, value] of Object.entries(bureaux[i])) {
                if (value.x > xMax) {
                    xMax = value.x;
                }
                if (value.y > yMax) {
                    yMax = value.y;
                }
            }
            yMax++;
            xMax++;
        }


        console.log("xMax : " + xMax);
        console.log("yMax : " + yMax);

        let listeBureaux = [];

        for (let i = 0; i < yMax; i++) {
            listeBureaux.push([]);

            for (let j = 0; j < xMax; j++) {
                console.log("i : " + i);
                console.log("j : " + j);


                // on verifie si le bureau existe
                let bureauExiste = "";
                for (let k = 0; k < bureaux.length; k++) {
                    for (const [key, value] of Object.entries(bureaux[k])) {
                        if (value.x == j && value.y == i) {
                            bureauExiste = key;
                            console.log("bureauExiste : " + bureauExiste);
                        }
                    }
                }

                listeBureaux[i].push(bureauExiste);

            }
        }

        res.json(listeBureaux);

    });
});

app.post('/supprimerEmploye', (req, res) => {
    const id = req.body.id;
    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const employes = JSON.parse(data);
        employes.splice(id, 1);
        fs.writeFile(__dirname + '/employes.json', JSON.stringify(employes), (err) => {
            if (err) {
                console.log(err);
                res.json({ success: false });
                return;
            }
            res.json({ success: true });
        });
    });
});

app.listen(3000, () => {
    console.log('Serveur écoutant sur le port 3000');
});



// /shuffleEmployees

app.post('/shuffleEmployees', (req, res) => { // Ajoutez la requête et la réponse en tant que paramètres

    console.log("shuffleEmployees");

    // Récupérer les employés dans le JSON
    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, error: 'Erreur de lecture des employés' }); // Retournez une réponse avec une indication d'erreur
        }
        const employes = JSON.parse(data);

        // Récupérer les bureaux dans le JSON
        fs.readFile(__dirname + '/bureaux.json', (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, error: 'Erreur de lecture des bureaux' }); // Retournez une réponse avec une indication d'erreur
            }
            const bureaux = JSON.parse(data);

            console.log("bureaux : " + bureaux);
            console.log(bureaux);





            // Melanger les indices de placeActuelle des employes
            let places = [];
            // parcourir les bureaux
            for (const [key, value] of Object.entries(bureaux)) {
                // parcourir les places
                for (const [key2, value] of Object.entries(bureaux[key])) {
                    //console.log("key : " + key);
                    //console.log("value : " + value);
                    places.push(key2);
                }
            }
            for (let i = 0; i < places.length; i++) {
                let randomIndex = Math.floor(Math.random() * places.length);
                let temp = places[i];
                places[i] = places[randomIndex];
                places[randomIndex] = temp;
            }

            // Affecter les employes aux bureaux
            for (let i = 0; i < employes.length; i++) {
                employes[i].placeActuelle = places[i];
            }

            // Écrire les employes dans le JSON
            fs.writeFile(__dirname + '/employes.json', JSON.stringify(employes), (err) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, error: 'Erreur d\'écriture des employés' }); // Retournez une réponse avec une indication d'erreur
                }

                return res.json({ success: true, message: 'Les employés ont été attribués aux bureaux avec succès.' }); // Retournez une réponse de succès
            });
        });
    });
});




// /addBureau

app.post('/toggleBureau', (req, res) => {
    // lire le json des bureaux
    fs.readFile(__dirname + '/bureaux.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const bureaux = JSON.parse(data);

        x = req.body.x;
        y = req.body.y;

        // verifier si le bureau existe
        let bureauExiste = false;

        for (let i = 0; i < bureaux.length; i++) {
            for (const [key, value] of Object.entries(bureaux[i])) {
                if (value.x == x && value.y == y) {
                    bureauExiste = true;
                    break;
                }
            }
        }

        // si le bureau existe, on le supprime
        if (bureauExiste) {
            console.log("bureauExiste");

        } else {
            console.log("bureauExistePas");
        }

        /*
        
                // trouver le plus petit id disponible
                let id = 1;
                for (let i = 0; i < bureaux.length; i++) {
                    if (bureaux[i].id == id) {
                        id++;
                    }
                }
                // ajouter le nouveau bureau
                bureaux.push({ id: id, places: req.body.places, x: req.body.x, y: req.body.y });
                // ecrire le json des bureaux
                fs.writeFile(__dirname + '/bureaux.json', JSON.stringify(bureaux), (err) => {
                    if (err) {
                        console.log(err);
                        res.json({ success: false });
                        return;
                    }
                    res.json({ success: true });
                });*/
    }
    );
}
);





// /deleteBureau

app.post('/deleteBureau', (req, res) => {
    // lire le json des bureaux
    fs.readFile(__dirname + '/bureaux.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const bureaux = JSON.parse(data);
        // supprimer le bureau
        for (let i = 0; i < bureaux.length; i++) {
            if (bureaux[i].id == req.body.id) {
                bureaux.splice(i, 1);
            }
        }
        // ecrire le json des bureaux
        fs.writeFile(__dirname + '/bureaux.json', JSON.stringify(bureaux), (err) => {
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


