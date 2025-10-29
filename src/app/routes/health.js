const express = require('express');
const router = express.Router();
const logger = require('../logger');

router.get('/health', (req, res) => {
    const healthStatus = Math.random() > 0.1 ? 'healthy' : 'degraded';
  
    if (healthStatus === 'degraded') {
        logger.warn('Health check degraded', {
            requestId: req.requestId,
            status: healthStatus,
            issues: ['high_memory_usage', 'slow_database']
        });
    } else {
        logger.debug('Health check passed', { 
            requestId: req.requestId,
            status: healthStatus
        });
    }

    res.json({ 
        status: healthStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        requestId: req.requestId
    });
});

module.exports = router;