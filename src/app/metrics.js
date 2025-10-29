const client = require('prom-client');

// Prometheus метрики
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Кастомные метрики
const metrics = {
    httpRequestDuration: new client.Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: ['method', 'route', 'status_code', 'environment'],
        buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
    }),

    httpRequestsTotal: new client.Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status_code', 'environment']
        }),

        activeUsers: new client.Gauge({
        name: 'active_users',
        help: 'Number of active users'
    }),

    businessOrdersTotal: new client.Counter({
        name: 'business_orders_total',
        help: 'Total number of orders',
        labelNames: ['status', 'payment_method']
    }),

    applicationErrors: new client.Counter({
        name: 'errors_total',
        help: 'Total number of application errors',
        labelNames: ['type', 'route']
    }),
}

// Регистрация метрик
for (metric in metrics){
    register.registerMetric(metrics[metric]);
}


module.exports = {
    client,
    register,
    ...metrics
};