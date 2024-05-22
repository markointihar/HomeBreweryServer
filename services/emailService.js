const nodemailer = require('nodemailer');

// Konfiguracija za pošiljanje e-pošte
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'intihar.marko123@gmail.com', // Uporabniško ime e-poštnega računa
        pass: 'paat gvhj mczw bnqq' // Geslo za e-poštni račun
    }
});

// Funkcija za pošiljanje e-pošte
const sendEmail = async (link) => {
    const mailOptions = {
        from: 'intihar.marko123@gmail.com', // E-poštni naslov pošiljatelja
        to: "intihar.marko@protonmail.com", // E-poštni naslov prejemnika
        subject: "Pomoč", // Naslov e-poštnega sporočila
        html: `<h1>Uporabnik rabi pomoč</h1><p>idi mu pomagat na </p>  <a>${link}</a>`  // Vsebina e-poštnega sporočila
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
