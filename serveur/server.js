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
    const prenom = req.body.prenom; // Récupérez le prénom de l'employé depuis le corps de la requête
    const nomImage = req.file.filename; // Récupérez le nom du fichier image depuis req.file.filename

    console.log(req);

    console.log('Prénom de l\'employé : ' + prenom);
    console.log('Nom du fichier image : ' + nomImage);

    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const employes = JSON.parse(data);

        // Créez un nouvel employé avec le prénom et le nom du fichier image
        const CheminNouvelleImage = "serveur/images/" + nomImage;
        const newEmployee = {
            prenom: prenom,
            image: CheminNouvelleImage
        };

        employes.push(newEmployee); // Ajoutez le nouvel employé

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
