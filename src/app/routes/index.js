const express = require('express');
const router = express.Router();
const logger = require('../logger');

router.get('/', (req, res) => {
    logger.info('Home page accessed successfully', { 
        requestId: req.requestId,
        userType: 'anonymous'
    });

    res.json({ 
        message: 'Full Monitoring Demo with Loki!', 
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
        features: ['prometheus', 'loki', 'grafana', 'structured-logging']
    });
});

module.exports = router;