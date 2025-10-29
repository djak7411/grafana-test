const express = require('express');
const router = express.Router();
const metrics = require('../metrics');
const logger = require('../logger');

router.get('/error', (res, req) => {
    const errorTypes = ['database_connection', 'authentication_failed', 'timeout_error'];
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];

    logger.error('Manual error triggered for demonstration', {
        requestId: req.requestId,
        errorType: errorType,
        severity: 'high',
        stack_trace: new Error().stack,
        user: 'demo-user',
        action: 'manual_trigger'
    });

    metrics.applicationErrors.labels(errorType, '/error').inc(); //БУДЕТ ИЗ ПРОМ КЛИЕНТА

    res.status(500).json({ 
        error: 'Internal Server Error',
        type: errorType,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;