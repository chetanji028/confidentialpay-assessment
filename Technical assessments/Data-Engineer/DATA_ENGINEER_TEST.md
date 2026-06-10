# ConFiPay - Data Engineer Assessment

## Overview

This is a **1-1.5 hour assessment** for a Data Engineer. You will design and implement a database schema to replace the current mock data system, and create an optimized data layer for the payroll platform.

**What you'll deliver:**
- PostgreSQL schema design (DDL scripts)
- Data migration from mock data to database
- Optimized queries for common operations
- Documentation of schema and design decisions

**To complete this assessment, you'll need to understand the current data model, then design and test a production-ready database.**

---

## The Assessment

### Context

ConFiPay currently stores all data in-memory (JavaScript arrays). This works for 10 users but fails at 10,000+ users. You need to:

1. **Understand current data model** - By exploring the running application
2. **Design PostgreSQL schema** - Normalized, performant, scalable
3. **Create migration script** - Convert mock data to real database
4. **Write optimized queries** - For critical operations
5. **Document design** - Explain choices and tradeoffs

---

## Part 1: Data Model Analysis (20 min)

### Analyze Current Mock Data

The application uses these entities (in `backend/models/mockData.js`):

**Employees:**
- id, name, email, role, salary, chain, walletAddress, status

**Transactions:**
- id, type (deposit/withdraw/payroll/bridge), amount, status, chain, date, employees

**Other potential entities:**
- Admin users
- Audit logs
- Payroll cycles
- Treasury balances

### Questions to Answer

1. **What data relationships exist?**
   - One admin to many employees?
   - One payroll cycle to many transactions?
   - Many chains to many employees?

2. **What queries are common?**
   - Get all employees for payroll?
   - Get transactions for specific date range?
   - Get balances by chain?
   - Get employee transaction history?

3. **What data consistency is important?**
   - Can an employee exist without a chain?
   - Can transactions exist without employees?
   - Is data immutable (audit trail)?

4. **What about scaling?**
   - How to partition millions of transactions?
   - How to optimize 10k employee lookups?
   - How to ensure referential integrity?

---

## Part 2: Schema Design (25 min)

### Create PostgreSQL Schema

Write SQL DDL statements for:

**1. Core Tables:**
```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  adminId INTEGER REFERENCES admins(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  salary DECIMAL(15,2),
  chain VARCHAR(50),  -- BNB, ETH, SOL, BASE
  walletAddress VARCHAR(255),
  status VARCHAR(50),  -- active, inactive, pending
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, adminId)
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50),  -- deposit, withdraw, payroll, bridge
  amount DECIMAL(18,8),
  status VARCHAR(50),  -- completed, processing, failed
  chain VARCHAR(50),
  date TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  adminId INTEGER REFERENCES admins(id)
);

-- More tables as needed...
```

**2. Indexes for Performance:**
```sql
CREATE INDEX idx_employees_admin ON employees(adminId);
CREATE INDEX idx_employees_chain ON employees(chain);
CREATE INDEX idx_transactions_admin ON transactions(adminId);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
```

**3. Views for Common Queries:**
```sql
CREATE VIEW employee_summary AS
SELECT 
  e.id,
  e.name,
  e.email,
  COUNT(t.id) as transaction_count,
  SUM(t.amount) as total_amount
FROM employees e
LEFT JOIN transactions t ON t.id = e.id
GROUP BY e.id;
```

---

## Part 3: Data Migration (15 min)

### Write Migration Script

Create script to load mock data into real database:

```javascript
// migrate.js
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://user:password@localhost/confipay'
});

async function migrate() {
  try {
    // Load mock data
    const mockData = require('./backend/models/mockData.js');
    
    // Migrate employees
    for (const employee of mockData.employees) {
      await pool.query(
        `INSERT INTO employees (name, email, role, salary, chain, walletAddress, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [employee.name, employee.email, employee.role, employee.salary, 
         employee.chain, employee.walletAddress, employee.status]
      );
    }
    
    // Migrate transactions
    for (const tx of mockData.transactions) {
      await pool.query(
        `INSERT INTO transactions (type, amount, status, chain, date)
         VALUES ($1, $2, $3, $4, $5)`,
        [tx.type, tx.amount, tx.status, tx.chain, tx.date]
      );
    }
    
    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
```

---

## Part 4: Optimized Queries (15 min)

### Write Common Queries

**Query 1: Get employees for payroll**
```sql
SELECT id, name, email, walletAddress, salary, chain
FROM employees
WHERE status = 'active'
ORDER BY id;
```

**Query 2: Get transaction history with filters**
```sql
SELECT id, type, amount, status, chain, date
FROM transactions
WHERE adminId = $1
  AND date >= $2
  AND date <= $3
  AND type = $4
ORDER BY date DESC
LIMIT $5 OFFSET $6;
```

**Query 3: Get balances by chain**
```sql
SELECT 
  chain,
  SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) -
  SUM(CASE WHEN type = 'withdraw' THEN amount ELSE 0 END) as balance
FROM transactions
WHERE status = 'completed'
GROUP BY chain;
```

**Query 4: Audit trail for compliance**
```sql
SELECT id, type, amount, status, date
FROM transactions
WHERE adminId = $1
ORDER BY date DESC;
```

---

## Part 5: Documentation (15 min)

### Create Schema Design Document

```markdown
# Database Schema Design

## Overview
PostgreSQL database to replace in-memory mock data. Designed for:
- 10k+ employees
- 1M+ transactions
- Compliance/audit requirements
- Fast queries for payroll operations

## Tables

### employees
- PK: id
- FK: adminId → admins.id
- Indexes: adminId, chain, email
- Purpose: Employee master data for payroll

### transactions  
- PK: id
- FK: adminId → admins.id
- Indexes: adminId, date, type
- Purpose: Immutable transaction history

### admins
- PK: id
- Purpose: User accounts for platform

## Design Decisions

1. **Normalized schema** - Avoids data duplication
2. **Indexes on foreign keys** - Fast joins
3. **Indexes on filter fields** - Fast queries
4. **Immutable transactions** - Compliance requirement
5. **Date indexing** - Common filter in payroll

## Performance Characteristics

- Get employees: O(1) with index
- Get transactions for date range: O(log n) with index
- Calculate balances: O(n) full table scan (acceptable for nightly batch)
- Payroll execution: Optimized for 10k employees in <1s

## Scaling Considerations

- Partition transactions by date (monthly)
- Archive old transactions (3+ years)
- Read replicas for reporting
- Connection pooling for concurrent access
```

---

## Deliverables

### 1. schema.sql
- CREATE TABLE statements
- CREATE INDEX statements  
- CREATE VIEW statements (optional)

### 2. migrate.js
- Loads mock data into database
- Handles data transformation
- Error handling

### 3. queries.sql
- 5-10 optimized queries
- Comments explaining intent
- Performance notes

### 4. SCHEMA_DESIGN.md
- Schema overview
- Design decisions
- Performance characteristics
- Scaling strategy

---

## Acceptance Criteria

✅ **Schema is normalized** - No redundant data
✅ **All entities covered** - Employees, transactions, admins, audit logs
✅ **Indexes present** - On foreign keys and common filters
✅ **Relationships defined** - Foreign keys with proper constraints
✅ **Migration script works** - Converts mock data to real database
✅ **Queries are optimized** - Use indexes, avoid N+1, reasonable complexity
✅ **Documentation clear** - Design decisions explained
✅ **Scalable design** - Can handle 10k+ employees, 1M+ transactions

---

## Tips for Success

### ✅ Good Schema Design
```sql
-- ✅ GOOD - Normalized, proper relationships
CREATE TABLE payroll_cycles (
  id SERIAL PRIMARY KEY,
  adminId INTEGER REFERENCES admins(id),
  cycleDate DATE,
  status VARCHAR(50),
  createdAt TIMESTAMP
);

CREATE TABLE payroll_transactions (
  id SERIAL PRIMARY KEY,
  cycleId INTEGER REFERENCES payroll_cycles(id),
  employeeId INTEGER REFERENCES employees(id),
  amount DECIMAL(15,2),
  createdAt TIMESTAMP
);

-- ❌ BAD - Denormalized, redundant data
CREATE TABLE payroll_transactions (
  id SERIAL PRIMARY KEY,
  cycleId INTEGER,
  employeeId INTEGER,
  employeeName VARCHAR(255),  -- Redundant!
  employeeEmail VARCHAR(255),  -- Redundant!
  amount DECIMAL(15,2)
);
```

### ✅ Proper Indexing
```sql
-- ✅ GOOD - Index on filter columns
CREATE INDEX idx_transactions_admin_date ON transactions(adminId, date);
CREATE INDEX idx_employees_chain ON employees(chain);

-- ❌ BAD - Index on column that's always full scan
CREATE INDEX idx_transactions_all ON transactions(id, type, amount);
```

### ✅ Write Maintainable Queries
```javascript
// ✅ GOOD - Parameterized, safe from injection
const query = `
  SELECT * FROM employees 
  WHERE chain = $1 AND status = $2
  LIMIT $3
`;
const result = await pool.query(query, [chain, status, limit]);

// ❌ BAD - String concatenation, SQL injection risk
const query = `SELECT * FROM employees WHERE chain = '${chain}'`;
```

---

## Time Management

```
0-5 min:   Set up PostgreSQL and understand task
5-20 min:  Analyze current data model (mockData.js, running app)
20-45 min: Design and write schema (tables, indexes, views)
45-60 min: Write migration script and test it
60-75 min: Write optimized queries
75-90 min: Documentation and review
```

---

**This assessment tests your ability to design scalable, performant databases.**

Good luck! 🚀
