const mongoose = require('mongoose');
const EmployeeSchema = require('./models/Employee');

console.log('EmployeeSchema is an instance of mongoose.Schema:', EmployeeSchema instanceof mongoose.Schema);

(async () => {
    try {
        // Création de la connexion à MongoDB
        const connection = await mongoose.createConnection('mongodb+srv://wafid:wafid@ouafid.aihn5iq.mongodb.net/TEST_2', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to database: TEST_2');

        // Création du modèle en utilisant le schéma
        const Employee = connection.model('Employee', EmployeeSchema);

        // Insertion d'un document pour forcer la création de la collection
        const testEmployee = new Employee({
            name: 'Test',
            familyName: 'Employee',
            tel: '0123456789',
            email: 'test.employee@example.com',
            password: 'securepassword',
            role: 'Tester',
            scoreCard: 'B+',
        });

        const savedEmployee = await testEmployee.save();
        console.log('Test employee created successfully:', savedEmployee);

        // Fermeture de la connexion après l'opération
        await connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('Error during test:', error.message);
    }
})();
