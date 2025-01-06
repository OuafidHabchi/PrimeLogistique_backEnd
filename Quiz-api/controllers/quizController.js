
// Créer un nouveau quiz
exports.createQuiz = async (req, res) => {
    try {
        const Quiz = req.connection.models.Quiz; // Modèle dynamique
        const { employeeId, result, date } = req.body;
        const quiz = new Quiz({ employeeId, result, date });
        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz', error });
    }
};

// Récupérer tous les quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const Quiz = req.connection.models.Quiz; // Modèle dynamique
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error });
    }
};

// Récupérer un quiz par ID
exports.getQuizById = async (req, res) => {
    try {
        const Quiz = req.connection.models.Quiz; // Modèle dynamique
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz', error });
    }
};

// Mettre à jour un quiz
exports.updateQuiz = async (req, res) => {
    try {
        const Quiz = req.connection.models.Quiz; // Modèle dynamique
        const { employeeId, result, date } = req.body;
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, { employeeId, result, date }, { new: true });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quiz', error });
    }
};

// Supprimer un quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const Quiz = req.connection.models.Quiz; // Modèle dynamique
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz', error });
    }
};
