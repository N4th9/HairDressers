const express = require('express');
const sqlite3 = require('sqlite3');

app = express();
app.use(express.static('public'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

const db = new sqlite3.Database('api/data/HairDressers.db');

app.get('/api/HairDressers', (req, res) => {
    const OFFSET = req.query.offset || 0;
    const LIMIT = 8;
    db.all('SELECT id, nom, voie, ville, code_postal FROM coiffeurs LIMIT ? OFFSET ?', [LIMIT, OFFSET], (err, rows) => {
        res.send(rows);
        console.log("Appel de 7 nouveaux coiffeurs");
    });
});