const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // Connexion statique
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

const app = express();
const server = http.createServer(app);

// Variables d'environnement
const PORT = process.env.PORT || 3004;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ["http://localhost:8081", "http://192.168.12.4:8081"];

// Configuration CORS
app.use(cors({ origin: ALLOWED_ORIGINS, methods: ["GET", "POST"], credentials: true }));
app.use(express.json());

// Connexion MongoDB statique
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://wafid:wafid@ouafid.aihn5iq.mongodb.net/VTRL';
mongoose.connect(MONGO_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
});

const db = mongoose.connection;
db.on('connected', () => console.log('Connecté à la base de données VTRL.'));
db.on('error', (err) => console.error('Erreur de connexion MongoDB :', err.message));
db.on('disconnected', () => console.warn('Déconnecté de la base de données MongoDB.'));

// Configurer Express pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (la connexion MongoDB statique sera directement utilisée dans les modèles)
app.use('/api', messageRoutes);
app.use('/api', conversationRoutes);

// Initialisation de Socket.IO
const io = socketIo(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attacher Socket.IO à l'application
app.set('socketio', io);

// Gestion des connexions Socket.IO
io.on('connection', async (socket) => {
  try {
    console.log(`Nouveau client connecté : ${socket.id}`);

    socket.on('sendMessage', async (messageData) => {
      try {
        const messageController = require('./controllers/messageController');
        const savedMessage = await messageController.saveMessageSocket(socket, messageData);
        io.emit('newMessage', savedMessage); // Diffusion du message à tous les clients
      } catch (err) {
        console.error("Erreur lors de l'envoi du message :", err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket déconnectée : ${socket.id}`);
    });
  } catch (error) {
    console.error("Erreur dans la connexion Socket.IO :", error.message);
    socket.disconnect(true);
  }
});

// Gestion des erreurs globales pour éviter les crashs serveur
io.on('error', (error) => {
  console.error("Erreur globale Socket.IO :", error.message);
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`Messenger en écoute sur le port ${PORT}`);
});
