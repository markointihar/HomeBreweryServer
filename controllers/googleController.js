const google = require('googleapis').google;
const dotenv = require('dotenv');
dotenv.config();
const dayjs = require('dayjs');

const outh2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
const calendar = google.calendar({ version: 'v3', auth: outh2Client });

const scopes = [
    'https://www.googleapis.com/auth/calendar',
];

exports.loginGoogle = (req, res) => {
    const url = outh2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
}

exports.redirectGoogle = async (req, res) => {

    const { tokens } = await outh2Client.getToken(req.query.code);
    outh2Client.setCredentials(tokens);

    res.send('Google login successful');
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