const bcrypt = require('bcrypt');
const fs = require('fs');

const EmailAdmin = 'admin@admin.com';
const PasswordAdmin = 'admin';

bcrypt.hash(PasswordAdmin, 10, function(err, hash) {
    if (err) {
        console.error('Erreur lors du hachage du mot de passe', err);
        return;
    }

    const adminData = {
        email: EmailAdmin,
        password: hash
    };

    fs.writeFile('./api/data/user.json', JSON.stringify(adminData), (err) => {
        if (err) {
            console.error('Erreur lors de enregistrement des données admin', err);
        } else {
            console.log('Compte admin enregistré avec succès');
        }
    });
});