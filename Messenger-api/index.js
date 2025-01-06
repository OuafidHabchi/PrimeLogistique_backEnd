const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const dbMiddleware = require('./MidleWareMessenger/middlewareMessenger');
const getDatabaseConnection = require('./MidleWareMessenger/databaseMessenger'); // Ajustez le chemin si nécessaire
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

const app = express();
const server = http.createServer(app);

// Configuration CORS
app.use(cors({ origin: '*' }));
app.use(express.json());

// Configurer Express pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', messageRoutes);
app.use('/api', conversationRoutes);

// Initialisation de Socket.IO
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:8081", "http://192.168.12.4:8081"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attacher Socket.IO à l'application
app.set('socketio', io);

// Gestion des connexions Socket.IO
io.on('connection', async (socket) => {
  try {
    const dsp_code = socket.handshake.query?.dsp_code;
    console.log("DSP Code reçu lors de la connexion Messenger:", dsp_code);

    if (!dsp_code) {
      console.error("DSP code manquant dans la requête handshake.");
      socket.disconnect(true); // Déconnecte le client si `dsp_code` est absent
      return;
    }

    const connection = await getDatabaseConnection(dsp_code);
    socket.connection = connection;

    socket.on('sendMessage', async (messageData) => {
      const messageController = require('./controllers/messageController');
      const savedMessage = await messageController.saveMessageSocket(socket, messageData);
      io.emit('newMessage', savedMessage);
    });
  } catch (error) {
    console.error("Erreur dans la connexion Socket.IO :", error);
    socket.disconnect(true);
  }
});



// Démarrer le serveur
server.listen(3004, () => {
  console.log('Messenger en écoute sur le port 3004');
});
