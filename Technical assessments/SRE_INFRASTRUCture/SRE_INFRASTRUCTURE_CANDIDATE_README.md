# SRE/Infrastructure Engineer - Getting Started

## Welcome! 👋

You're taking the ConFiPay SRE/Infrastructure assessment. This is a **1-1.5 hour task** where you'll design monitoring, logging, and incident response systems for production reliability.

---

## What You'll Do

1. **Understand the app** - Explore ConFiPay architecture
2. **Design monitoring** - What metrics, thresholds, alerts?
3. **Plan logging** - What to log, how to store, search?
4. **Create runbooks** - How to handle common incidents?
5. **Plan deployment** - Safe, zero-downtime releases
6. **Document strategy** - SLOs, recovery, scaling

---

## Quick Start

### Start the Application

```bash
npm install
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

### Explore Architecture

Understand:
- Frontend (React on port 3000)
- Backend (Node.js on port 4000)
- Current data storage (mock in-memory)
- What could fail?

---

## What to Design

### 1. Monitoring & Alerts (20 min)

**Key metrics to monitor:**
- Backend response time
- Error rates (5xx errors)
- Login failures
- Payroll success rate
- Transaction processing time
- Memory usage
- CPU usage
- Disk space

**Alert thresholds:**
```yaml
- error_rate > 5%: Alert (backend broken)
- response_time_p99 > 1s: Alert (slow)
- payroll_success_rate < 95%: Alert (payments failing)
- memory_usage > 80%: Alert (running out)
- disk_free < 10%: Alert (critical)
```

### 2. Logging Strategy (15 min)

**What to log:**
- All errors (with context)
- Authentication events
- Transaction processing
- Performance metrics
- Deployment events

**Log levels:**
- ERROR: Failures (always log)
- WARN: Unusual but handled
- INFO: Important events
- DEBUG: Development only

### 3. Incident Runbooks (20 min)

Create procedures for:
- Backend is down
- Payroll processing is slow
- Database connection lost
- Disk space critical
- Memory leak

**Format for each:**
```markdown
# Runbook: [Issue Name]

## Symptoms
[How do I know this is happening?]

## Immediate Actions
[Quick diagnostic steps]

## Investigation
[Deep dive if quick actions don't work]

## Recovery
[How to fix it]

## Prevention
[How to prevent next time]
```

### 4. Deployment Strategy (15 min)

**Safe deployment:**
1. Pre-deploy: Tests, linting, backups
2. Deploy: Start new version alongside old
3. Switch: Route traffic to new version
4. Monitor: Watch for 5+ minutes
5. Rollback: If issues, switch back

### 5. SLOs & Documentation (15 min)

**Define:**
- Uptime target (e.g., 99.9%)
- Response time target (e.g., <500ms p99)
- Error rate target (e.g., <0.1%)
- Recovery time (e.g., <15 minutes)

---

## Key Concepts

### Good Alert vs Bad Alert

❌ **BAD:**
```
Alerts when: error_rate > 0% (too sensitive)
Name: "Something went wrong"
Action: "Check logs" (vague)
```

✅ **GOOD:**
```
Alerts when: error_rate > 5% for 5 minutes (reasonable threshold)
Name: "Backend Error Rate Spike"
Action: Trigger runbook → "Backend Error Rate Spike"
```

### Good Runbook vs Bad Runbook

❌ **BAD:**
```
If there's a problem, restart the service.
Or maybe check if it's a database issue.
```

✅ **GOOD:**
```
1. Check status: systemctl status confipay-backend
2. If down, restart: systemctl restart confipay-backend
3. If still down, check logs: tail -f /var/log/confipay.log
4. Look for: Connection refused, OOM, or specific errors
5. If DB connection error, contact DBA
```

---

## Deliverables

1. **monitoring.yml** - Metrics, alerts, thresholds
2. **logging_strategy.md** - What, where, how to store logs
3. **runbooks/** - 5+ incident procedures
4. **deployment.md** - Safe deployment procedure
5. **INFRASTRUCTURE.md** - Overall plan and SLOs

---

## Time Management

```
0-5 min:   Understand application
5-20 min:  Design monitoring
20-35 min: Design logging
35-55 min: Create runbooks
55-75 min: Design deployment
75-90 min: Document and review
```

---

See **SRE_INFRASTRUCTURE_TEST.md** for full requirements.

Good luck! 🚀
