const express = require('express');
const router = express.Router();
const logger = require('../logger');

router.get('/slow', async (req, res) => {
    const delay = Math.random() * 4000 + 1000;

    logger.warn('Slow endpoint accessed', {
        requestId: req.requestId,
        expectedDelay: delay,
        warning: 'Performance issue detected'
    });

    await new Promise(resolve => setTimeout(resolve, delay));

    logger.info('Slow request completed', {
        requestId: req.requestId,
        actualDelay: delay,
        performance: 'poor'
    });

    res.json({ 
        message: 'Slow request completed',
        delay: `${delay}ms`,
        requestId: req.requestId,
        performance: 'poor'
    });
});

module.exports = router;