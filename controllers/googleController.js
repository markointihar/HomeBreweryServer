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

        // Preverite, ali uporabnik že obstaja v bazi
        connection.query('SELECT * FROM users WHERE google_id = ?', [userId], (error, results) => {
            if (error) {
                console.error('Error querying MySQL:', error);
                res.status(500).send('Database query error');
                return;
            }

            if (results.length === 0) {
                // Uporabnik ne obstaja, vstavi novega uporabnika
                connection.query('INSERT INTO users (google_id, email, name) VALUES (?, ?, ?)', [userId, email, name], (error, results) => {
                    if (error) {
                        console.error('Error inserting into MySQL:', error);
                        res.status(500).send('Database insert error');
                        return;
                    }
                    console.log('User inserted into MySQL with id:', results.insertId);
                });
            } else {
                // Uporabnik že obstaja, posodobi podatke
                connection.query('UPDATE users SET email = ?, name = ? WHERE google_id = ?', [email, name, userId], (error, results) => {
                    if (error) {
                        console.error('Error updating MySQL:', error);
                        res.status(500).send('Database update error');
                        return;
                    }
                    console.log('User updated in MySQL with id:', results.insertId);
                });
            }

            // Nadaljujte z vašo aplikacijo
            res.redirect(`http://localhost:5173/login-success?token=${tokens.access_token}`);
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
        res.redirect('http://localhost:5173/logout-success');
    });
}

exports.dodajDogodek = async (req, res) => {
    calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: 'Test dogodek',
            start: { dateTime: dayjs().add(1, 'day').format()},
            end: { dateTime: dayjs().add(1, 'day').add(1, 'hour').format()},
            timeZone: 'Europe/Ljubljana'
        }
    }, (err, result) => {
        if (err) {
            console.error('Napaka pri dodajanju dogodka:', err);
            res.status(500).send('Napaka pri dodajanju dogodka');
            return;
        }
        res.send('Dogodek uspešno dodan');
    });
}