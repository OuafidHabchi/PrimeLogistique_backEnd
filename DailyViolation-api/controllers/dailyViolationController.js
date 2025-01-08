const { sendPushNotification } = require('../../utils/notifications');

// Créer une nouvelle violation
exports.createViolation = async (req, res) => {
  try {
    const DailyViolation= req.connection.models.DailyViolation;
    const violation = new DailyViolation(req.body);
    await violation.save();

    res.status(201).json(violation);

    if (req.body.expoPushToken) {
      const notificationTitle = "New Violation Recorded";
      const notificationBody = `A violation of type ${req.body.type} has been recorded. Check the details in your app.`;

      sendPushNotification(req.body.expoPushToken, notificationTitle, notificationBody).catch((error) => {
        console.error("Error sending push notification:", error);
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir toutes les violations
exports.getViolations = async (req, res) => {
  try {
    const DailyViolation= req.connection.models.DailyViolation;
    const violations = await DailyViolation.find();
    res.status(200).json(violations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir une violation par ID
exports.getViolationById = async (req, res) => {
  try {
    const DailyViolation= req.connection.models.DailyViolation;
    const violation = await DailyViolation.findById(req.params.id);
    if (!violation) return res.status(404).json({ message: 'Violation not found' });
    res.status(200).json(violation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une violation
exports.updateViolation = async (req, res) => {
  try {
    const DailyViolation= req.connection.models.DailyViolation;
    const violation = await DailyViolation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!violation) return res.status(404).json({ message: 'Violation not found' });
    res.status(200).json(violation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une violation
exports.deleteViolation = async (req, res) => {
  try {
    const DailyViolation= req.connection.models.DailyViolation;
    const violation = await DailyViolation.findByIdAndDelete(req.params.id);
    if (!violation) return res.status(404).json({ message: 'Violation not found' });
    res.status(200).json({ message: 'Violation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir toutes les violations pour une date donnée
exports.getViolationsByDay = async (req, res) => {
  try {
    const { selectedDate } = req.query;
    if (!selectedDate) {
      return res.status(400).json({ message: 'Le paramètre selectedDate est requis.' });
    }

    const DailyViolation= req.connection.models.DailyViolation;
    const violations = await DailyViolation.find({ date: selectedDate });
    res.status(200).json(violations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les violations hebdomadaires
exports.getWeeklyViolations = async (req, res) => {
  try {
    const DailyViolation= req.connection.models.DailyViolation;
    const { startDate } = req.query;
    if (!startDate) {
      return res.status(400).json({ message: 'The startDate parameter is required.' });
    }
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const violations = await DailyViolation.find({
      date: { $gte: start.toISOString().split('T')[0], $lte: end.toISOString().split('T')[0] },
    });

    const groupedData = violations.reduce((acc, violation) => {
      const violationDate = violation.date;
      if (!acc[violationDate]) {
        acc[violationDate] = {};
      }
      acc[violationDate][violation.type] = (acc[violationDate][violation.type] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(groupedData);    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les violations hebdomadaires pour un employé
exports.getEmployeeWeeklyViolations = async (req, res) => {
  try {
    const DailyViolation= req.connection.models.DailyViolation;
    const { startDay, idEmployee } = req.query;
    if (!startDay || !idEmployee) {
      return res.status(400).json({ message: 'Les paramètres startDay et idEmployee sont requis.' });
    }
    const start = new Date(startDay);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const violations = await DailyViolation.find({
      employeeId: idEmployee,
      date: { $gte: start.toISOString().split('T')[0], $lte: end.toISOString().split('T')[0] },
    });
    const groupedData = violations.reduce((acc, violation) => {
      const violationDate = violation.date;
      if (!acc[violationDate]) {
        acc[violationDate] = {};
      }
      acc[violationDate][violation.type] = (acc[violationDate][violation.type] || 0) + 1;
      return acc;
    }, {});
    res.status(200).json(groupedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les détails des violations pour un employé à une date donnée
exports.getEmployeeViolationsByDate = async (req, res) => {
  try {
    const DailyViolation= req.connection.models.DailyViolation;
    const { employeeId, date } = req.query;
    if (!employeeId || !date) {
      return res.status(400).json({ message: 'Les paramètres employeeId et date sont requis.' });
    }
    const violations = await DailyViolation.find({ employeeId, date });

    if (violations.length === 0) {
      return res.status(404).json({ message: 'Aucune violation trouvée pour cet employé à cette date.' });
    }
    res.status(200).json(violations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
