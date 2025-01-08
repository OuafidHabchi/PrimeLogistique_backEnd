const { sendPushNotification } = require('../../utils/notifications');
const path = require('path');

// Fonction utilitaire pour valider les connexions et modèles
const validateConnection = (connection, modelName) => {
  if (!connection || !connection.models[modelName]) {
    throw new Error(`La connexion ou le modèle ${modelName} est introuvable.`);
  }
};

// Déterminer le contenu du message
const determineMessageContent = (file, content) => {
  if (file) {
    if (file.mimetype.startsWith('video/')) return 'Vidéo partagée';
    if (file.mimetype.startsWith('image/')) return 'Image partagée';
    return 'Média partagé';
  }
  return content || 'Média partagé';
};

// Envoi d'un message avec ou sans fichier
exports.uploadMessage = async (req, res) => {
  try {
    console.log('Début du traitement du message...');
    validateConnection(req.connection, 'Message');

    const Message = req.connection.models.Message;
    const { conversationId, senderId, content, senderName, senderfamilyName, participants } =
      JSON.parse(req.body.messageData);
    const file = req.file;

    console.log('Données reçues :', {
      conversationId,
      senderId,
      content,
      file: file ? file.filename : null,
      participants,
    });

    // Générer l'URL du fichier
    const fileUrl = file ? `/uploads/${file.filename}` : null;
    console.log('URL du fichier générée :', fileUrl);

    const messageContent = determineMessageContent(file, content);
    console.log('Contenu du message déterminé :', messageContent);

    // Créer et sauvegarder le message dans MongoDB
    const message = new Message({
      conversationId,
      senderId,
      content: messageContent,
      fileUrl,
      readBy: [senderId],
    });

    console.log('Tentative de sauvegarde du message...');
    await message.save();
    console.log('Message sauvegardé avec succès.');

    // Émettre le message via Socket.IO
    const io = req.app.get('socketio');
    console.log("Tentative d'émission du message via Socket.IO...");
    io.emit('newMessage', message);
    console.log('Message émis avec succès via Socket.IO.');

    res.status(201).json({ message: 'Message envoyé avec succès', data: message });

    // Envoi des notifications push
    console.log("Tentative d'envoi des notifications push...");
    const notificationPromises = participants.map(async (participant) => {
      if (participant.expoPushToken && participant._id !== senderId) {
        await sendPushNotification(
          participant.expoPushToken,
          `Nouveau message de ${senderName} ${senderfamilyName}`,
          messageContent
        );
      }
    });

    await Promise.all(notificationPromises);
    console.log('Notifications push envoyées avec succès.');
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
  }
};


// Récupération des messages d'une conversation
exports.getMessagesByConversation = async (req, res) => {
  try {
    console.log('Début de récupération des messages...');
    validateConnection(req.connection, 'Message');

    const Message = req.connection.models.Message;
    const { conversationId } = req.params;

    console.log('Conversation ID :', conversationId);

    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
    console.log('Messages récupérés :', messages.length);

    res.status(200).json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
};

// Sauvegarder un message via Socket.IO
exports.saveMessageSocket = async (socket, messageData) => {
  try {
    console.log('Début de sauvegarde du message via Socket.IO...');
    validateConnection(socket.connection, 'Message');

    const Message = socket.connection.models.Message;
    const { conversationId, senderId, content, fileUrl = null } = messageData;

    console.log('Données reçues via Socket.IO :', {
      conversationId,
      senderId,
      content,
      fileUrl,
    });

    const message = new Message({
      conversationId,
      senderId,
      content,
      fileUrl,
    });

    await message.save();
    console.log('Message sauvegardé avec succès via Socket.IO.');
    return message;
  } catch (error) {
    console.error('Erreur dans saveMessageSocket :', error.message);
    throw error;
  }
};

// Marquer les messages comme lus
exports.markMessagesAsRead = async (req, res) => {
  try {
    console.log('Début de marquage des messages comme lus...');
    validateConnection(req.connection, 'Message');

    const Message = req.connection.models.Message;
    const { conversationId, userId } = req.body;

    console.log('Conversation ID :', conversationId);
    console.log('User ID :', userId);

    const result = await Message.updateMany(
      { conversationId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    console.log('Messages mis à jour :', result.nModified);

    res.status(200).json({ message: 'Messages marqués comme lus.' });
  } catch (error) {
    console.error('Erreur lors du marquage des messages comme lus :', error.message);
    res.status(500).json({ error: 'Impossible de marquer les messages comme lus.' });
  }
};
