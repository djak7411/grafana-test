const express = require('express');
const router = express.Router();
const metrics = require('../metrics');
const logger = require('../logger');

router.get('/metrics', async (req,res) => {
    logger.debug('Metrics endpoint accessed', { 
        requestId: req.requestId,
        client: req.get('User-Agent')
      });
      
      res.set('Content-Type', metrics.register.contentType);
      res.end(await metrics.register.metrics());
});

module.exports = router;