const express = require('express');
const cors = require('cors');
const dbMiddleware = require('./utils/middleware'); // Middleware global

// Initialisation de l'application
const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Injecter les middlewares globaux ici

// Import des routes de vos APIs
const clothesRoutes = require('./clothes-api/routes/clothesRoutes');
const assignmentRoutes = require('./clothes-assignment-api/routes/clothesAssignmentRoutes');
const commentRoutes = require('./Comment-api/routes/commentRoutes');
const dailyNoteRoutes = require('./DailyNote/routes/dailyNoteRoutes');
const dailyViolationRoutes = require('./DailyViolation-api/routes/dailyViolationRoutes');
const disponibiliteRoutes = require('./Disponibiltes-api/routes/disponibiliteRoutes');
const employeRoutes = require('./Employes-api/routes/EmployeRoutes');
const eventsRoutes = require('./events-api/routes/eventRoutes');
const roadRoutes = require('./ExtraRoad-api/routes/RoadRoutes');
const vehicleRoutes = require('./Fleet-api/routes/vehicleRoutes');
const inventoryRoutes = require('./Inventory-api-complet/routes/inventoryRoutes');
const phoneRoutes = require('./Phones-api/routes/phoneRoutes');
const powerBankRoutes = require('./PowerBank-api/routes/powerBankRoutes');
const procedureRoutes = require('./Procedures-api/routes/procedureRoutes');
const quizRoutes = require('./Quiz-api/routes/quizRoutes');
const reportIssuesRoutes = require('./ReportIssues/routes/reportIssuesRoutes');
const shiftRoutes = require('./Shifts-api/routes/shiftRoutes');
const statusRoutes = require('./Status/routes/statusRoutes');
const timeCardRoutes = require('./TimeCard-api/routes/timeCardRoutes');
const vanAssignmentRoutes = require('./VanAssignmen-api/routes/vanAssignmentRoutes');
const warningRoutes = require('./Warnings-api/routes/worningRoutes');
const download = require('./Inventory-api/routes/pdfRoutes')
const ScroceCrd = require('./ScoreCard-api/routes/csvRoutes')

// Définir les points d'accès pour chaque API
// app.use('/api/download', download);
app.use('/api/clothes', clothesRoutes);
app.use('/api/clothesAssignment', assignmentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dailyNotes', dailyNoteRoutes);
app.use('/api/dailyViolations', dailyViolationRoutes);
app.use('/api/disponibilites', disponibiliteRoutes);
app.use('/api/employee', employeRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/roads', roadRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/powerbanks', powerBankRoutes);
app.use('/api/procedure', procedureRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/reportIssues', reportIssuesRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/timecards', timeCardRoutes);
app.use('/api/vanAssignments', vanAssignmentRoutes);
app.use('/api/warnings', warningRoutes);
app.use('/api/download', download);
app.use('/api/ScroceCrd', download);

// Démarrer le serveur sur un port unique
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Central API server running on port ${PORT}`);
});
