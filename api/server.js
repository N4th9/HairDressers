const express = require('express');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

app = express();
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

const db = new sqlite3.Database('api/data/HairDressers.db');

app.get('/api/HairDressers', (req, res) => {
    const OFFSET = req.query.offset || 0;
    const LIMIT = 8;
    db.all('SELECT id, nom, numero, voie, ville, code_postal, latitude, longitude, favori FROM coiffeurs LIMIT ? OFFSET ?', [LIMIT, OFFSET], (err, rows) => {
        res.send(rows);
        console.log("Appel de 7 nouveaux coiffeurs");
    });
});
app.get('/api/searchHairdressers', (req, res) => {
    const term = req.query.term;
    const OFFSET = parseInt(req.query.offset) || 0;
    const LIMIT = 8;
    db.all('SELECT id, nom, numero, voie, ville, code_postal, latitude, longitude, favori FROM coiffeurs WHERE nom LIKE ? LIMIT ? OFFSET ?', [`%${term}%`, LIMIT, OFFSET], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la recherche de coiffeurs dans la base de données :', err);
            res.status(500).send('Erreur lors de la recherche de coiffeurs dans la base de données');
        } else {
            res.send(rows);
        }
    });
});
app.put('/api/HairDressers/:id', (req, res) => {
    const id = req.params.id;
    const { nom, numero, voie, ville, code_postal, latitude, longitude } = req.body;
    db.run('UPDATE coiffeurs SET nom = ?, numero = ?, voie = ?, ville = ?, code_postal = ?, latitude = ?, longitude = ? WHERE id = ?', [nom, numero, voie, ville, code_postal, latitude, longitude, id], (err) => {
        if (err) {
            console.error('Erreur lors de la modification du coiffeur dans la base de données :', err);
            res.status(500).send('Erreur lors de la modification du coiffeur dans la base de données');
        } else {
            res.status(200).send('Coiffeur modifié avec succès');
        }
    });
});
app.post('/api/HairDressers', (req, res) => {
    const { nom, numero, voie, ville, code_postal, latitude, longitude } = req.body;
    db.run('INSERT INTO coiffeurs (nom, numero, voie, ville, code_postal, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)', [nom, numero, voie, ville, code_postal, latitude, longitude], (err) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du coiffeur dans la base de données :', err);
            res.status(500).send('Erreur lors de l\'ajout du coiffeur dans la base de données');
        } else {
            res.status(201).send('Coiffeur ajouté avec succès');
        }
    });
});

const UserPath = path.resolve(__dirname, 'data/user.json');
let isLoggedIn = false;
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    console.log(isLoggedIn);
});
app.post("/api/Login", (req, res) => {
    const { username, password } = req.body;

    fs.readFile(UserPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            const user = JSON.parse(data);
            bcrypt.compare(password, user.password, function (err, result) {
                if (result && username === user.email) {
                    isLoggedIn = true;
                    res.status(200).send({ message: "Connexion réussie" });
                } else {
                    res.status(401).send({ message: "Mauvais login et/ou mot de passe." });
                }
            });
        }
    });
});
app.get("/api/IsLoggedIn", (req, res) => {
    res.json({ isLoggedIn });
});
app.get("/api/Logout", (req, res) => {
    isLoggedIn = false;
    res.status(200).send({ message: "Déconnexion réussie" });
});
app.put("/api/favorite/:id", (req, res) => {
    const id = req.params.id;
    const favori = req.body.favori;
    db.run('UPDATE coiffeurs SET favori = ? WHERE id = ?', [favori, id], (err) => {
        if (err) {
            console.error('Erreur lors de la modification du coiffeur dans la base de données :', err);
            res.status(500).send('Erreur lors de la modification du coiffeur dans la base de données');
        } else {
            res.status(200).send('Coiffeur modifié avec succès');
        }
    });
});