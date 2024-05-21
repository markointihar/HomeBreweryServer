const nodemailer = require('nodemailer');

// Konfiguracija za pošiljanje e-pošte
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aaaa@gmail.com', // Uporabniško ime e-poštnega računa
        pass: '12345678' // Geslo za e-poštni račun
    }
});

// Funkcija za pošiljanje e-pošte
const sendEmail = async (link) => {
    const mailOptions = {
        from: 'iaaaaa3@gmail.com', // E-poštni naslov pošiljatelja
        to: "ieeeeo@protonmail.com", // E-poštni naslov prejemnika
        subject: "Pomoč", // Naslov e-poštnega sporočila
        html: `idi pomagat na ${link}`  // Vsebina e-poštnega sporočila
    };

    try {
        // Pošlji e-poštno sporočilo
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
