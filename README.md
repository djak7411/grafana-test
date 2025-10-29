## Grafana test app

#### Run
```
docker-compose up --build
```

#### Configure your grafana datasources

loki address

```
http://loki:3100/
```

prometheus address
```
http://prometheus:9090/
```

use ready dashboard for node.js app from nodedashboard.json for metrics
and logsdashboard.json for logs