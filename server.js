const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  // Uvoz uuid knjižnice
const sendEmail = require('./services/emailService');
const connection = require('./config/db');
const dataRoutes = require('./routes/izdelekRoute');
const googleRoutes = require('./routes/googleRoute');
const postRoutes = require('./routes/postRoute')
const commentRoutes = require('./routes/commentRoute'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://home-brewery.vercel.app",
        methods: ["GET", "POST"]
    }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://home-brewery.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(cors());  // Omogočanje CORS za vse zahteve
app.use(express.json()); // Za parsiranje JSON telesa zahtevkov

// Serve static files from the uploads directory
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', dataRoutes);
app.use('/', googleRoutes);
app.use('/api', postRoutes); 
app.use('/api', commentRoutes); 

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Dodaj novo pot za generiranje ID-ja sobe in vračanje povezave do sobe
app.get('/create-room', (req, res) => {
    const roomId = uuidv4();  // Generiraj unikatni ID za sobo
    res.send({ roomId, link: `https://home-brewery.vercel.app/room/${roomId}` });
    sendEmail(`http://https://home-brewery.vercel.app/room/${roomId}`)
});

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})


const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
module.exports = io;