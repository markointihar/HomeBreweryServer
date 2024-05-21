const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');  // Uvoz uuid knjižnice
const sendEmail = require('./services/emailService');
const connection = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());  // Omogočanje CORS za vse zahteve

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Dodaj novo pot za generiranje ID-ja sobe in vračanje povezave do sobe
app.get('/create-room', (req, res) => {
    const roomId = uuidv4();  // Generiraj unikatni ID za sobo
    res.send({ roomId, link: `http://localhost:5173/room/${roomId}` });
    sendEmail(`http://localhost:5173/room/${roomId}`)
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        
    });

    socket.on('message', (data) => {
        io.to(data.room).emit('message', data.message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/test-db-connection', (req, res) => {
    connection.query('SELECT 1', (err, results, fields) => {
      if (err) {
        console.error('Napaka pri izvajanju poizvedbe:', err);
        res.status(500).send('Napaka pri povezovanju z bazo');
        return;
      }
      res.send('Povezava z bazo je uspešna!');
    });
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
