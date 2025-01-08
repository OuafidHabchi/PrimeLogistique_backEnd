const modelsMap = require('../../utils/modelsMap');

// Créer un commentaire
exports.createComment = async (req, res) => {
    try {
        const { idEmploye, date, comment } = req.body;
        const Comment = req.connection.models.Comment // Modèle injecté dynamiquement
        const newComment = new Comment({ idEmploye, date, comment });
        await newComment.save();
        res.status(201).json({ message: 'Comment created successfully', newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les commentaires
exports.getAllComments = async (req, res) => {
    try {
        const Comment = req.connection.models.Comment
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un commentaire par ID d'employé
exports.getCommentsByEmployeId = async (req, res) => {
    try {
        const Comment = req.connection.models.Comment
        const comments = await Comment.find({ idEmploye: req.params.idEmploye });
        if (!comments.length) return res.status(404).json({ message: 'No comments found' });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un commentaire par ID
exports.updateComment = async (req, res) => {
    try {
        const Comment = req.connection.models.Comment
        const { date, comment } = req.body;
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: req.params.id },
            { date, comment },
            { new: true }
        );
        if (!updatedComment) return res.status(404).json({ message: 'Comment not found' });
        res.status(200).json({ message: 'Comment updated successfully', updatedComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un commentaire par ID
exports.deleteComment = async (req, res) => {
    try {
        const Comment = req.connection.models.Comment
        const deletedComment = await Comment.findOneAndDelete({ _id: req.params.id });
        if (!deletedComment) return res.status(404).json({ message: 'Comment not found' });
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer les commentaires par date
exports.getCommentsByDate = async (req, res) => {
    try {
        const Comment = req.connection.models.Comment
        const { date } = req.params;
        const comments = await Comment.find({ date });
        if (!comments.length) return res.status(404).json({ message: 'No comments found for this date' });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
