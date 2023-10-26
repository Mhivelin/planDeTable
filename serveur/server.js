const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

app.use(cors());
app.use(bodyParser.json());

// Configuration de Multer pour le stockage des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images'); // Répertoire où vous souhaitez stocker les images
    },
    filename: function (req, file, cb) {
        const prenom = req.body.prenom;
        const fileName = prenom + '.png';
        cb(null, fileName);
    },
});
const upload = multer({ storage });

app.get('/', (req, res) => {
    // Serve the HTML file for your front-end here
    res.sendFile(__dirname + '/index.html');
});

app.post('/addEmployee', upload.single('image'), (req, res) => {
    const employee = req.body;
    console.log(employee);

    const nomImage = req.file.filename;
    console.log('Nom du fichier image : ' + nomImage);

    fs.readFile(__dirname + '/employes.json', (err, data) => {
        if (err) {
            console.log(err);
            res.json({ success: false });
            return;
        }
        const employes = JSON.parse(data);
        employes.push(employee);
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
