const express = require('express');
const sqlite3 = require('sqlite3');

app = express();
app.use(express.static('public'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

const db = new sqlite3.Database('api/data/HairDressers.db');

app.get('/api/HairDressers', (req, res) => {
    const OFFSET = req.query.offset || 0;
    const LIMIT = 8;
    db.all('SELECT id, nom, numero, voie, ville, code_postal, latitude, longitude FROM coiffeurs LIMIT ? OFFSET ?', [LIMIT, OFFSET], (err, rows) => {
        res.send(rows);
        console.log("Appel de 7 nouveaux coiffeurs");
    });
});
app.get('/api/searchHairdressers', (req, res) => {
    const term = req.query.term;
    const OFFSET = parseInt(req.query.offset) || 0;
    const LIMIT = 8;
    db.all('SELECT id, nom, numero, voie, ville, code_postal, latitude, longitude FROM coiffeurs WHERE nom LIKE ? LIMIT ? OFFSET ?', [`%${term}%`, LIMIT, OFFSET], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la recherche de coiffeurs dans la base de données :', err);
            res.status(500).send('Erreur lors de la recherche de coiffeurs dans la base de données');
        } else {
            res.send(rows);
        }
    });
});