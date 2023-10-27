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
    fs.readFile(__dirname + '/bureaux.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const bureaux = JSON.parse(data);
        res.json(bureaux);
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

app.post('/shuffleEmployees', () => {
    // recuperer les employes dans le json
    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const employes = JSON.parse(data);

        // recuperer les bureaux dans le json
        fs.readFile(__dirname + '/bureaux.json', (err, data) => {
            if (err) {
                console.log(err);
                res.json({ success: false });
                return;
            }
            const bureaux = JSON.parse(data);

            //compter le nombre de place dans les bureaux
            let nbPlaces = 0;
            for (let i = 0; i < bureaux.length; i++) {
                nbPlaces += bureaux[i].places;
            }
            // ajouter les employes vides pour completer les places
            for (let i = 0; i < nbPlaces - employes.length; i++) {
                employes.push({ prenom: "", image: "" });
            }

            /*     {
        "id": 1,
        "prenom": "Adele",
        "image": "serveur/images/Adele.png",
        "placeActuelle": 1
    }, */
            // melanger les index de place des employes
            let indexPlace = [];
            for (let i = 0; i < nbPlaces; i++) {
                indexPlace.push(i);
            }

            for (let i = 0; i < indexPlace.length; i++) {
                let randomIndex = Math.floor(Math.random() * indexPlace.length);
                let temp = indexPlace[i];
                indexPlace[i] = indexPlace[randomIndex];
                indexPlace[randomIndex] = temp;
            }

            // affecter les places aux employes
            for (let i = 0; i < employes.length; i++) {
                employes[i].placeActuelle = indexPlace[i];
            }




            // ecrire les employes dans le json
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
}
);


