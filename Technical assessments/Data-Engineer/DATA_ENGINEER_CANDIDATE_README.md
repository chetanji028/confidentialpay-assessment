# Data Engineer - Getting Started

## Welcome! 👋

You're taking the ConFiPay Data Engineer assessment. This is a **1-1.5 hour task** where you'll design a PostgreSQL database to replace the current mock data system.

---

## What You'll Do

1. **Understand current data** - Analyze the mock data structure
2. **Design schema** - Create PostgreSQL tables and indexes
3. **Write migration** - Convert mock data to real database
4. **Optimize queries** - Write fast queries for common operations
5. **Document design** - Explain your decisions

---

## Quick Setup

### Install PostgreSQL

**Mac:**
```bash
brew install postgresql
psql --version
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
```

### Create Database

```bash
psql postgres
CREATE DATABASE confipay;
\c confipay
```

### Start ConFiPay App

```bash
npm install
npm run dev
```

Then explore running app to understand data.

---

## What to Design

### Step 1: Analyze Current Data (20 min)

Review `backend/models/mockData.js`:
- What entities exist? (employees, transactions, etc.)
- What relationships? (one admin to many employees?)
- What data types? (strings, numbers, dates?)
- What constraints? (email unique? salary positive?)

### Step 2: Design Schema (25 min)

Create normalized tables:
```sql
CREATE TABLE admins (...);
CREATE TABLE employees (...);
CREATE TABLE transactions (...);
CREATE INDEX ... ON ...;
```

### Step 3: Migration Script (15 min)

Write script to convert mock data:
```javascript
// Load mockData
// Insert into PostgreSQL
// Verify data integrity
```

### Step 4: Optimized Queries (15 min)

Write 5-10 queries:
- Get employees
- Get transactions
- Filter by date
- Calculate balances

### Step 5: Documentation (15 min)

Explain:
- Why this schema?
- How does it scale?
- Performance characteristics?

---

## Key Concepts

### Normalization

✅ **GOOD** - No redundant data:
```sql
CREATE TABLE employees (id, name, email, chain);
CREATE TABLE transactions (id, employeeId, amount);
```

❌ **BAD** - Redundant data:
```sql
CREATE TABLE transactions (
  id, 
  employeeId,
  employeeName,  -- Redundant! Can get from employees table
  amount
);
```

### Indexes

✅ **GOOD** - Index for performance:
```sql
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_employees_chain ON employees(chain);
```

❌ **BAD** - Index everything:
```sql
CREATE INDEX idx_all_columns ON table(col1, col2, col3, ...);
```

---

## Deliverables

1. **schema.sql** (CREATE TABLE, INDEX statements)
2. **migrate.js** (Migration script)
3. **queries.sql** (5-10 optimized queries)
4. **SCHEMA_DESIGN.md** (Documentation)

---

## Time Management

```
0-5 min:   Set up PostgreSQL
5-20 min:  Analyze current mock data
20-45 min: Write schema (tables, indexes)
45-60 min: Write migration script
60-75 min: Write optimized queries
75-90 min: Documentation and review
```

---

See **DATA_ENGINEER_TEST.md** for full requirements.

Good luck! 🚀
