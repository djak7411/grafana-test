const express = require('express');
const router = express.Router();
const metrics = require('../metrics');
const logger = require('../logger');

router.get('/order', (req, res) => {
    const orderId = `ORD-${Date.now()}`;
    const amount = (Math.random() * 1000).toFixed(2);
    const paymentMethods = ['credit_card', 'paypal', 'crypto'];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    logger.info('Order creation started', {
        requestId: req.requestId,
        orderId: orderId,
        amount: amount,
        paymentMethod: paymentMethod
    });

    // Симуляция бизнес-логики
    if (Math.random() > 0.85) {
        const errorType = Math.random() > 0.5 ? 'payment_failed' : 'insufficient_inventory';

        logger.error('Order creation failed', {
            requestId: req.requestId,
            orderId: orderId,
            errorType: errorType,
            reason: errorType === 'payment_failed' ? 'Insufficient funds' : 'Out of stock',
            amount: amount
        });

        metrics.applicationErrors.labels(errorType, '/order').inc();
        metrics.businessOrdersTotal.labels('failed', paymentMethod).inc();

        return res.status(400).json({ 
            error: 'Order failed',
            orderId: orderId,
            reason: errorType,
            requestId: req.requestId
        });
    }

    // Успешный заказ
    metrics.businessOrdersTotal.labels('success', paymentMethod).inc();

    logger.info('Order created successfully', {
        requestId: req.requestId,
        orderId: orderId,
        amount: amount,
        paymentMethod: paymentMethod,
        status: 'completed'
    });

    res.json({ 
        status: 'success',
        orderId: orderId,
        amount: amount,
        paymentMethod: paymentMethod,
        requestId: req.requestId
    });
});

module.exports = router;