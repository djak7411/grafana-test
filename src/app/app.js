const express = require('express');
const metrics = require('./metrics');
const httpContext = require('express-http-context');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const app = express();
const port = 3001;
const fs = require('fs');
const path = require('path');

// Middleware для логирования HTTP запросов
app.use(httpContext.middleware);
app.use((req, res, next) => {
    const requestId = uuidv4();
    httpContext.set('requestId', requestId);
    req.requestId = requestId;

    logger.info('Incoming HTTP request', {
        requestId: requestId,
        method: req.method,
        url: req.url,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type')
    });

    next();
});

// Middleware для сбора метрик
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;

        // Метрики
        metrics.httpRequestDuration
            .labels(req.method, route, res.statusCode, 'development')
            .observe(duration);

        metrics.httpRequestsTotal
            .labels(req.method, route, res.statusCode, 'development')
            .inc();

        // Логирование завершения запроса
        logger.info('HTTP request completed', {
            requestId: req.requestId,
            method: req.method,
            route: route,
            statusCode: res.statusCode,
            duration: duration.toFixed(3),
            contentLength: res.get('Content-Length'),
            environment: 'development'
        });

        // Логирование ошибок
        if (res.statusCode >= 400) {
            logger.warn('HTTP request error', {
            requestId: req.requestId,
            statusCode: res.statusCode,
            route: route
            });
        }

        if (res.statusCode >= 500) {
            metrics.applicationErrors.labels('http_error', route).inc();
            logger.error('Server error occurred', {
            requestId: req.requestId,
            statusCode: res.statusCode,
            route: route
            });
        }
  });
  
  next();
});

// Маршруты для генерации разных типов логов
fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
  if (file.endsWith('.js')) {
    const routePath = `./routes/${file}`;
    const router = require(routePath);

    app.use(router);
  }
});

// Обработчик не найденных маршрутов
app.use('*', (req, res) => {
    logger.warn('Route not found', {
        requestId: req.requestId,
        attemptedUrl: req.originalUrl,
        method: req.method
    });

    metrics.applicationErrors.labels('route_not_found', 'unknown').inc();

    res.status(404).json({
        error: 'Route not found',
        requestId: req.requestId
    });
});

// Обработчик глобальных ошибок
app.use((error, req, res, next) => {
    logger.error('Unhandled error occurred', {
        requestId: req.requestId,
        error: error.message,
        stack: error.stack,
        route: req.path
    });

    metrics.applicationErrors.labels('unhandled_exception', req.path).inc();

    res.status(500).json({
        error: 'Internal Server Error',
        requestId: req.requestId
    });
});

app.listen(port, () => {
    logger.info('Application started successfully', {
        port: port,
        environment: 'development',
        nodeVersion: process.version,
        platform: process.platform
    });

    setInterval(() => {
        const endpoints = ['/', '/users', '/order', '/health', '/slow', '/error'];
        const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
        fetch(`http://localhost:${port}${randomEndpoint}`).catch(() => {});
    }, 5000);
});