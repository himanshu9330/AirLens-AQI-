const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const setupJobs = require('./jobs/cronJobs');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorMiddleware');
const wardRoutes = require('./routes/wardRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
require('dotenv').config({ override: true });

const app = express();

// Connect to Database
connectDB();

// Initialize Background Jobs
setupJobs();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/wards', wardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/aqi', require('./routes/wardAqiRoutes'));
app.use('/api/grid', require('./routes/gridRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Hyper-Local AQI API' });
});

// Error Middleware
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
