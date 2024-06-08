const google = require('googleapis').google;
const dotenv = require('dotenv');
dotenv.config();
const dayjs = require('dayjs');

const connection = require('../config/db');

const outh2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
const calendar = google.calendar({ version: 'v3', auth: outh2Client });

const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile', 
    'https://www.googleapis.com/auth/userinfo.email'
];

exports.loginGoogle = (req, res) => {
    const url = outh2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
}

exports.redirectGoogle = async (req, res) => {
    try {
        const { tokens } = await outh2Client.getToken(req.query.code);
        outh2Client.setCredentials(tokens);

        console.log('Tokens:', tokens);

        const ticket = await outh2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const userId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];
        const profilePicture = payload['picture']; // Pridobi URL profilne slike

        // Preverite, ali uporabnik že obstaja v bazi
        connection.query('SELECT * FROM users WHERE google_id = ?', [userId], (error, results) => {
            if (error) {
                console.error('Error querying MySQL:', error);
                res.status(500).send('Database query error');
                return;
            }

            if (results.length === 0) {
                // Uporabnik ne obstaja, vstavi novega uporabnika
                connection.query('INSERT INTO users (google_id, email, name, profile_picture) VALUES (?, ?, ?, ?)', [userId, email, name, profilePicture], (error, results) => {
                    if (error) {
                        console.error('Error inserting into MySQL:', error);
                        res.status(500).send('Database insert error');
                        return;
                    }
                    console.log('User inserted into MySQL with id:', results.insertId);
                });
            } else {
                // Uporabnik že obstaja, posodobi podatke
                connection.query('UPDATE users SET email = ?, name = ?, profile_picture = ? WHERE google_id = ?', [email, name, profilePicture, userId], (error, results) => {
                    if (error) {
                        console.error('Error updating MySQL:', error);
                        res.status(500).send('Database update error');
                        return;
                    }
                    console.log('User updated in MySQL with id:', results.insertId);
                });
            }

            res.redirect(`https://home-brewery.vercel.app/login-success?email=${encodeURIComponent(userId)}&token=${tokens.access_token}`);
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).send('Authentication failed');
    }
}

exports.logoutGoogle = (req, res) => {
    // Počistite sejo ali kredenciale
    req.session = null;  // Če uporabljate seje za shranjevanje stanja uporabnika
    outh2Client.revokeCredentials((err, body) => {
        if (err) {
            return res.status(500).send('Failed to revoke credentials');
        }
        res.redirect('https://home-brewery.vercel.app');
    });
}

exports.shraniRecept = async (req, res) => {
    const {
        naziv,
        voda_litrov,
        slad_kg,
        hmelj_g,
        cas_dodajanja_hmelja_min,
        skupni_cas_kuhanja_min,
        temperatura_hlajenja_c,
        kvas_paketov,
        temperatura_fermentacije_c,
        cas_fermentacije_dni,
        priming_sladkor_g,
        cas_karbonizacije_dni,
        cas_zorenja_dni,
        user_id
    } = req.body;
    
    const query = `
        INSERT INTO recept (
            naziv, voda_litrov, slad_kg, hmelj_g, cas_dodajanja_hmelja_min, 
            skupni_cas_kuhanja_min, temperatura_hlajenja_c, kvas_paketov, 
            temperatura_fermentacije_c, cas_fermentacije_dni, priming_sladkor_g, 
            cas_karbonizacije_dni, cas_zorenja_dni, uporabnik_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        naziv,
        voda_litrov,
        slad_kg,
        hmelj_g,
        cas_dodajanja_hmelja_min,
        skupni_cas_kuhanja_min,
        temperatura_hlajenja_c,
        kvas_paketov,
        temperatura_fermentacije_c,
        cas_fermentacije_dni,
        priming_sladkor_g,
        cas_karbonizacije_dni,
        cas_zorenja_dni,
        user_id
    ];
    
    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Napaka pri vstavljanju podatkov:', err);
            res.status(500).json({ error: 'Napaka pri shranjevanju recepta' });
            return;
        }
        res.status(201).json({ message: 'Recept uspešno shranjen', id: results.insertId });
    });
}

exports.dodajDogodek = async (req, res) => {
    konecFermentacije = parseInt(req.query.cas_fermentacije_dni);
    konecKarbonizacije = konecFermentacije + parseInt(req.query.cas_karbonizacije_dni);
    konecZorjenja = konecKarbonizacije + parseInt(req.query.cas_zorenja_dni);
    console.log('Konec fermentacije:', konecFermentacije);
    console.log('Konec karbonizacije:', konecKarbonizacije);
    console.log('Konec zorjenja:', konecZorjenja);
    calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: 'Konec fermentacije',
            start: { dateTime: dayjs().add(konecFermentacije, 'day').format()},
            end: { dateTime: dayjs().add(konecFermentacije, 'day').add(1, 'hour').format()},
            timeZone: 'Europe/Ljubljana'
        }
    }, (err, result) => {
        if (err) {
            console.error('Napaka pri dodajanju dogodka konec fermentacije:', err);
            res.status(500).send('Napaka pri dodajanju dogodka konec fermentacije');
            return;
        }
    });
    calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: 'Konec karbonizacije',
            start: { dateTime: dayjs().add(konecKarbonizacije, 'day').format()},
            end: { dateTime: dayjs().add(konecKarbonizacije, 'day').add(1, 'hour').format()},
            timeZone: 'Europe/Ljubljana'
        }
    }, (err, result) => {
        if (err) {
            console.error('Napaka pri dodajanju dogodka konec karbonizacije:', err);
            res.status(500).send('Napaka pri dodajanju dogodka konec karbonizacije');
            return;
        }
    });
    calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: 'Konec zorjenja',
            start: { dateTime: dayjs().add(konecZorjenja, 'day').format()},
            end: { dateTime: dayjs().add(konecZorjenja, 'day').add(1, 'hour').format()},
            timeZone: 'Europe/Ljubljana'
        }
    }, (err, result) => {
        if (err) {
            console.error('Napaka pri dodajanju dogodka konec zorjenja:', err);
            res.status(500).send('Napaka pri dodajanju dogodka konec zorjenja');
            return;
        }
    });
    res.send('Dogodki dodani v koledar');
}

exports.getUserId = (req, res) => {
    const { google_id } = req.query;

    // Izvedi poizvedbo v bazo za pridobitev uporabnikovega ID-ja glede na Google ID
    const query = "SELECT id FROM users WHERE google_id = ?";

    connection.query(query, [google_id], (error, results) => {
        if (error) {
            console.error('Napaka pri izvajanju poizvedbe:', error);
            return res.status(500).json({ error: 'Napaka pri pridobivanju uporabnikovega ID-ja' });
        }

        // Preveri, ali je bil uporabnik najden
        if (results.length === 0) {
            return res.status(404).json({ error: 'Uporabnik ni bil najden' });
        }

        // Vrne uporabnikov ID kot odgovor
        const userId = results[0].id;
        res.json({ id: userId });
    });
}
exports.getUser = (req, res) => {
    const { google_id } = req.query;

    // Izvedi poizvedbo v bazo za pridobitev uporabnikovega ID-ja glede na Google ID
    const query = "SELECT profile_picture, name, email FROM users WHERE google_id = ?";

    connection.query(query, [google_id], (error, results) => {
        if (error) {
            console.error('Napaka pri izvajanju poizvedbe:', error);
            return res.status(500).json({ error: 'Napaka pri pridobivanju uporabnikovih podatkov' });
        }

        // Preveri, ali je bil uporabnik najden
        if (results.length === 0) {
            return res.status(404).json({ error: 'Uporabnik ni bil najden' });
        }

        // Vrne uporabnikove podatke kot odgovor
        const user = results[0];
        res.json(user);
    });
}

exports.getMojiRecepti = (req, res) => {
    const googleId = req.query.google_id;

    connection.query('SELECT id FROM users WHERE google_id = ?', [googleId], (error, results) => {
        if (error) {
            console.error('Error querying MySQL:', error);
            res.status(500).send('Database query error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
        } else {
            const userId = results[0].id;

            // Pridobite vse recepte uporabnika
            connection.query('SELECT * FROM recept WHERE uporabnik_id = ?', [userId], (error, results) => {
                if (error) {
                    console.error('Error querying MySQL:', error);
                    res.status(500).send('Database query error');
                    return;
                }

                res.json(results);
            });
        }
    });
}