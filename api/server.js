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
app.put("/api/favorite1/:id", (req, res) => {
    db.run('UPDATE coiffeurs SET favori = 1 WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Erreur lors de la modification du coiffeur dans la base de données :', err);
            res.status(500).send('Erreur lors de la modification du coiffeur dans la base de données');
        } else {
            res.status(200).send('Coiffeur modifié avec succès');
        }
    });
});
app.put("/api/favorite0/:id", (req, res) => {
    db.run('UPDATE coiffeurs SET favori = 0 WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Erreur lors de la modification du coiffeur dans la base de données :', err);
            res.status(500).send('Erreur lors de la modification du coiffeur dans la base de données');
        } else {
            res.status(200).send('Coiffeur modifié avec succès');
        }
    });
});
app.get('/api/searchHairdressers', (req, res) => {
    const term = req.query.term || ''; // Default value for term
    const OFFSET = parseInt(req.query.offset) || 0;
    const LIMIT = 8;
    const searchBy = req.query.searchBy || 'nom'; // Default value for searchBy
    const sortBy = req.query.sortBy || 'nom'; // Default value for sortBy

    let sqlQuery = 'SELECT id, nom, numero, voie, ville, code_postal, latitude, longitude, favori FROM coiffeurs WHERE ';

    if (searchBy === 'nom') {
        sqlQuery += 'nom LIKE ?';
    } else if (searchBy === 'numero') {
        sqlQuery += 'numero LIKE ?';
    } else if (searchBy === 'rue') {
        sqlQuery += 'voie LIKE ?';
    } else if (searchBy === 'codePostal') {
        sqlQuery += 'code_postal LIKE ?';
    } else if (searchBy === 'ville') {
        sqlQuery += 'ville LIKE ?';
    }

    sqlQuery += ' ORDER BY ';

    if (sortBy === 'nom') {
        sqlQuery += 'nom';
    } else if (sortBy === 'numero') {
        sqlQuery += 'numero';
    } else if (sortBy === 'rue') {
        sqlQuery += 'voie';
    } else if (sortBy === 'codePostal') {
        sqlQuery += 'code_postal';
    } else if (sortBy === 'ville') {
        sqlQuery += 'ville';
    }

    sqlQuery += ' LIMIT ? OFFSET ?';

    db.all(sqlQuery, [`%${term}%`, LIMIT, OFFSET], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la recherche de coiffeurs dans la base de données :', err);
            res.status(500).send('Erreur lors de la recherche de coiffeurs dans la base de données');
        } else {
            res.send(rows);
        }
    });
});
app.get('/api/NbHairDressers', (req, res) => {
    db.get('SELECT COUNT(*) AS count FROM coiffeurs', (err, row) => {
        if (err) {
            console.error('Erreur lors du comptage des coiffeurs dans la base de données :', err);
            res.status(500).send('Erreur lors du comptage des coiffeurs dans la base de données');
        } else {
            res.send({ count: row.count });
        }
    });
})