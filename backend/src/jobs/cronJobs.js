const cron = require('node-cron');
const ingestionService = require('../services/IngestionService');
const processingService = require('../services/ProcessingService');
const logger = require('../utils/logger');

const setupJobs = () => {
    // Fetch data every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        logger.info('Cron Job: Starting Hourly Data Ingestion');
        await ingestionService.fetchOpenAQData();
        await processingService.processWardData();
    });

    // Daily alert cleanup at midnight
    cron.schedule('0 0 * * *', () => {
        logger.info('Cron Job: Running Midnight Maintenance');
    });

    logger.info('Background Jobs Initialized');
};

module.exports = setupJobs;
