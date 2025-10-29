const express = require('express');
const router = express.Router();
const logger = require('../logger');
const metrics = require('../metrics');

router.get('/users', (req, res) => {
    const randomUsers = Math.floor(Math.random() * 100) + 1;
    metrics.activeUsers.set(randomUsers);

    logger.info('Users statistics retrieved', {
        requestId: req.requestId,
        activeUsers: randomUsers,
        source: 'database_simulation'
    });

    res.json({ 
        activeUsers: randomUsers,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
  });
});

module.exports = router;