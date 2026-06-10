# QA/Test Automation - Getting Started

## Welcome! 👋

You're taking the ConFiPay QA/Test Automation assessment. This is a **1-1.5 hour task** where you'll create a comprehensive test suite to ensure the application works reliably.

---

## What You'll Do

1. **Explore the application** - Understand what features need testing
2. **Set up testing framework** - Jest, Cypress, or Playwright
3. **Write test cases** - Happy paths, edge cases, error handling
4. **Run and verify** - Ensure all tests pass
5. **Report bugs** - Document any issues found

---

## Quick Start

### Install Testing Framework

**Option A: Jest (API Testing)**
```bash
npm install --save-dev jest supertest
npx jest --init
```

**Option B: Cypress (UI Testing)**
```bash
npm install --save-dev cypress
npx cypress open
```

### Start the Application

```bash
npm install
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

### Write First Test

```javascript
// tests/auth.test.js
const request = require('supertest');

test('Login with correct credentials', async () => {
  const response = await request('http://localhost:4000')
    .post('/api/auth/login')
    .send({
      email: 'admin@confidentialpay.com',
      password: '00000'
    });

  expect(response.status).toBe(200);
  expect(response.body.data.token).toBeDefined();
});
```

### Run Tests

```bash
npm test
```

---

## What to Test

**Priority 1: Authentication (Must Work)**
- Login with correct credentials ✅
- Login with incorrect credentials ❌
- Logout functionality
- Token management

**Priority 2: Core Operations**
- Get employee list
- Execute payroll
- View transactions
- Filter by type/chain

**Priority 3: Edge Cases**
- Empty input fields
- Negative amounts
- Very large numbers
- Special characters

**Priority 4: Error Handling**
- API errors
- Network failures
- Invalid data
- Missing fields

---

## Time Management

```
0-10 min: Set up framework, start app
10-25 min: Write auth and payroll tests
25-50 min: Write treasury and validation tests
50-65 min: Run tests, capture bugs
65-85 min: Document bug report
85-90 min: Polish and review
```

---

## Deliverables

1. **Test Suite** (12-15 tests minimum)
   - `tests/auth.test.js`
   - `tests/payroll.test.js`
   - `tests/treasury.test.js`
   - `tests/validation.test.js`

2. **Bug Report**
   - Issues found
   - Severity levels
   - Steps to reproduce

3. **Test Coverage Report**
   - Features tested
   - Coverage %

---

See **QA_AUTOMATION_TEST.md** for full requirements.

Good luck! 🚀
