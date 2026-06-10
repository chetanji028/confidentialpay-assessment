# ConFiPay - SRE/Infrastructure Engineer Assessment

## Overview

This is a **1-1.5 hour assessment** for a Site Reliability Engineer (SRE) or Infrastructure Engineer. You will design monitoring, alerting, logging, and incident response systems for the ConFiPay platform.

**What you'll deliver:**
- Monitoring and alerting strategy
- Logging framework and log aggregation design
- Incident response runbooks
- Deployment and recovery procedures
- Documentation of infrastructure requirements

**To complete this assessment, you'll need to understand the application architecture and design reliability systems.**

---

## The Assessment

### Context

ConFiPay is moving from prototype to production serving financial payroll transactions. You need to:

1. **Understand application health** - By exploring the running system
2. **Design monitoring** - Metrics to track, thresholds to alert
3. **Plan logging** - What to log, where to store, how to query
4. **Create runbooks** - Procedures for common incidents
5. **Plan deployment** - How to deploy safely with zero downtime
6. **Document recovery** - How to recover from failures

---

## Part 1: Application Assessment (15 min)

### Understand What Needs Monitoring

**Explore the running application:**

1. **Frontend (React on port 3000):**
   - Response time
   - Error rates
   - User sessions
   - Performance (slow page loads)

2. **Backend (Node.js on port 4000):**
   - Request latency
   - Error rates (500s, timeouts)
   - Database query performance
   - Memory usage
   - CPU usage

3. **Data Storage:**
   - Currently: in-memory (will fail on restart)
   - Future: PostgreSQL (need connection pool monitoring)

4. **Authentication:**
   - Failed login attempts
   - Token expiration issues
   - Unauthorized access attempts

5. **Transactions/Payroll:**
   - Failed payments
   - Incomplete transactions
   - Payment processing time

---

## Part 2: Monitoring & Alerting Strategy (20 min)

### Define Key Metrics

**Create monitoring configuration:**

```yaml
# monitoring.yml
metrics:
  backend:
    - request_duration_ms
    - error_rate_5xx
    - active_connections
    - memory_usage_mb
    - cpu_usage_percent
  
  frontend:
    - page_load_time_ms
    - javascript_error_rate
    - user_session_count
    - api_error_rate
  
  application:
    - login_failures_per_minute
    - payroll_success_rate
    - transaction_processing_time_ms

alerts:
  - name: backend_500_error_spike
    condition: error_rate_5xx > 5%
    threshold_duration: 5m
    severity: critical
    action: page_oncall
  
  - name: memory_leak
    condition: memory_usage_mb > 1000
    threshold_duration: 30m
    severity: high
    action: notify_devops
  
  - name: payroll_failure_spike
    condition: payroll_success_rate < 95%
    threshold_duration: 10m
    severity: critical
    action: page_oncall + auto_rollback
```

### Create Dashboard Configuration

```yaml
# dashboard.yml
dashboards:
  - name: SRE Overview
    panels:
      - title: Backend Health
        metrics:
          - request_latency_p99
          - error_rate
          - active_connections
      
      - title: Application Health
        metrics:
          - payroll_success_rate
          - transaction_processing_time
          - failed_authentications
      
      - title: Infrastructure
        metrics:
          - cpu_usage
          - memory_usage
          - disk_free
```

---

## Part 3: Logging Strategy (15 min)

### Design Logging Architecture

**What to log:**

```javascript
// backend/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    // Console (development)
    new winston.transports.Console(),
    
    // File (production)
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log levels: error > warn > info > debug > verbose > silly

// Errors (always log)
logger.error('Payment failed', { 
  userId: 123, 
  amount: 5000, 
  error: err.message 
});

// Authentication events
logger.info('User logged in', { userId: 123, ip: '192.168.1.1' });
logger.warn('Failed login attempt', { email: 'user@example.com' });

// Application events
logger.info('Payroll executed', { 
  cycleId: 1, 
  employeeCount: 12,
  totalAmount: 125000 
});

// Debug (only in development)
logger.debug('Query executed', { query: sql, duration_ms: 45 });
```

**Log aggregation design:**

```
┌─────────────────┐
│  Backend        │
│  - error.log    │
│  - combined.log │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Log Aggregator      │ (Filebeat/Logstash)
│ - Collect logs      │
│ - Parse JSON        │
│ - Add metadata      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────┐
│ Elasticsearch/CloudWatch│
│ - Store indexed logs    │
│ - 7-day retention       │
│ - Search capability     │
└────────┬────────────────┘
         │
         ▼
┌──────────────────┐
│ Kibana/Dashboard │
│ - Query logs     │
│ - Visualize      │
│ - Investigate    │
└──────────────────┘
```

---

## Part 4: Runbooks (20 min)

### Create Incident Response Procedures

**Runbook #1: Backend is Down**

```markdown
# Runbook: Backend Service Down

## Symptoms
- Cannot connect to http://localhost:4000
- Frontend shows "API unavailable" error
- Monitoring alert: "backend_health_check_failed"

## Immediate Actions (5 min)
1. Check if service is running: `systemctl status confipay-backend`
2. If stopped, restart: `systemctl restart confipay-backend`
3. Check logs: `tail -f /var/log/confipay/backend.log`
4. If error loop, check disk space: `df -h`

## Investigation (10 min)
1. Check recent deployments: `git log --oneline -10`
2. Check for dependency issues: `npm list`
3. Check database connectivity: `psql -U user -d confipay -c "SELECT 1"`
4. Check memory: `free -m`

## Recovery
- If recent deploy: `git revert <commit>`
- If database issue: Contact DBA
- If memory issue: Increase instance size or optimize code

## Post-Incident
1. Review logs for root cause
2. Update alerts if needed
3. Document findings in incident report
4. Schedule post-mortem if customer impact
```

**Runbook #2: Payment Processing is Slow**

```markdown
# Runbook: Payroll Processing Slow (>30s per cycle)

## Symptoms
- Payroll execution taking >30 seconds
- API response times >5s
- Monitoring alert: "payroll_processing_slow"

## Immediate Actions
1. Check if database connections are saturated: `psql ... -c "SELECT count(*) FROM pg_stat_activity"`
2. Check for long-running queries: `SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10`
3. Check if indexes are missing: Review query plan
4. Check if cache is working: `redis-cli INFO stats`

## Investigation
1. Profile application: Enable APM (Application Performance Monitoring)
2. Identify slow query
3. Check if N+1 query pattern
4. Check if missing index

## Recovery
- Add index: `CREATE INDEX idx_...`
- Optimize query: Rewrite to avoid N+1
- Clear cache: `redis-cli FLUSHALL`
- Scale database: Add read replicas

## Prevention
- Add performance regression tests
- Monitor query performance in CI/CD
- Set query timeout thresholds
```

**Runbook #3: Disk Space Critical**

```markdown
# Runbook: Disk Space Low (<10% free)

## Immediate Actions
1. Check disk usage: `df -h`
2. Find large files: `du -sh /* | sort -h`
3. Check logs: `du -sh /var/log/*`

## Recovery
1. Archive old logs: `gzip /var/log/confipay/*.log`
2. Clean temporary files: `rm -rf /tmp/*`
3. Rotate logs more aggressively

## Prevention
- Set up log rotation: Rotate daily, keep 7 days
- Monitor disk usage: Alert if >80%
- Delete old database backups: Keep 30 days only
```

---

## Part 5: Deployment Strategy (15 min)

### Design Safe Deployment Process

```markdown
# Deployment Procedure

## Pre-Deployment
1. [ ] Run all tests: `npm test`
2. [ ] Run linter: `npm run lint`
3. [ ] Build: `npm run build`
4. [ ] Create backup: `pg_dump confipay > backup-$(date +%s).sql`
5. [ ] Notify team on Slack

## Deployment (Blue-Green)
1. [ ] Start new "green" instance with new version
2. [ ] Run health check on green instance
3. [ ] Switch load balancer from blue to green
4. [ ] Monitor error rates for 5 minutes
5. [ ] If errors, switch back to blue

## Post-Deployment
1. [ ] Monitor metrics for 30 minutes
2. [ ] Check error logs for new errors
3. [ ] Verify payroll processing works
4. [ ] If issues, trigger rollback

## Rollback
1. [ ] Switch load balancer back to blue
2. [ ] Verify service is healthy
3. [ ] Investigate what went wrong
4. [ ] Document findings
```

---

## Part 6: Documentation (15 min)

### Create Infrastructure Documentation

```markdown
# Infrastructure & Reliability Plan

## System Architecture
[Diagram or description of components]
- Frontend: React, port 3000
- Backend: Node.js/Express, port 4000
- Database: PostgreSQL (TBD)
- Cache: Redis (future)

## SLOs (Service Level Objectives)
- Availability: 99.9% uptime
- Latency: p99 < 500ms
- Error rate: <0.1%
- Recovery time: <15 minutes

## Monitoring Stack
- Metrics: Prometheus/DataDog
- Logs: ELK Stack/CloudWatch
- APM: New Relic/DataDog
- On-call: PagerDuty

## Alerting Policy
- Critical: Immediate page to on-call
- High: Create ticket + notify via Slack
- Medium: Daily digest
- Low: Weekly report

## Incident Response
- SEV1 (Critical): <5 min response, all hands
- SEV2 (High): <30 min response, on-call
- SEV3 (Medium): <4 hour response, during business hours

## Deployment Schedule
- Production: Tuesday/Thursday 2-4 PM UTC
- Hotfixes: Anytime (documented in incident)
- Maintenance windows: Sunday midnight UTC
```

---

## Deliverables

### 1. monitoring.yml
- Metrics to collect
- Alerts with thresholds
- Dashboard configuration

### 2. logging_strategy.md
- What to log
- Log aggregation design
- Retention policy
- Search examples

### 3. runbooks/
- Backend-down.md
- Payment-slow.md
- Database-down.md
- Disk-full.md
- (3-5 critical runbooks)

### 4. deployment.md
- Pre-deployment checklist
- Deployment procedure
- Rollback procedure
- Testing requirements

### 5. INFRASTRUCTURE.md
- Overall reliability plan
- SLOs/SLIs
- On-call schedule
- Incident response

---

## Acceptance Criteria

✅ **Monitoring comprehensive** - Covers backend, frontend, application, infrastructure
✅ **Alerts actionable** - Can follow runbook to resolve
✅ **Runbooks complete** - Cover 5+ common incidents
✅ **Logging strategy clear** - What to log, where, retention
✅ **Deployment safe** - Zero-downtime, easy rollback
✅ **Documentation thorough** - Others can follow procedures
✅ **SLOs defined** - Clear targets for reliability
✅ **Incident response clear** - Escalation paths, timelines

---

## Tips for Success

### ✅ Good Alerting Strategy
```
✅ GOOD ALERT:
- Name: "Backend Error Rate Spike"
- Condition: error_rate > 5% AND duration > 5 minutes
- Action: Page on-call engineer
- Severity: Critical
- Runbook: Link to incident response guide

❌ BAD ALERT:
- "Something went wrong"
- Always triggers (too noisy)
- No context for responder
- No runbook
```

### ✅ Actionable Runbooks
```markdown
✅ GOOD:
## Runbook: Backend Down
1. Check status: `systemctl status confipay`
2. Restart: `systemctl restart confipay`
3. Verify: curl http://localhost:4000
4. If still down, check logs: tail -f /var/log/confipay.log

❌ BAD:
## Runbook: Backend Problem
If something is wrong, restart it.
Or maybe check logs.
```

### ✅ Appropriate SLOs
```
✅ GOOD:
- 99.9% availability (9 hours downtime/year is acceptable)
- <500ms p99 latency
- <0.1% error rate

❌ BAD:
- 100% availability (impossible)
- <100ms latency (unrealistic for network)
- Zero errors (impossible)
```

---

## Time Management

```
0-5 min:   Understand application architecture
5-20 min:  Design monitoring and alerting strategy
20-35 min: Design logging architecture
35-55 min: Create incident response runbooks
55-75 min: Design deployment and rollback procedures
75-90 min: Documentation and review
```

---

**This assessment tests your ability to design reliable, maintainable production systems.**

Good luck! 🚀
