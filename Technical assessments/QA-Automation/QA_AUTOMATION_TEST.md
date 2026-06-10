# ConFiPay - QA/Test Automation Engineer Assessment

## Overview

This is a **1-1.5 hour assessment** for a QA/Test Automation Engineer. You will create a comprehensive test suite for critical payroll and treasury features, ensuring the application works reliably.

**What you'll deliver:**
- Automated test suite (8-15 tests minimum)
- Coverage of happy paths and edge cases
- Test documentation
- Bug report for any issues found

**To complete this assessment, you'll need to thoroughly explore the application and verify test scenarios work correctly.**

---

## Time Box

**1-1.5 hours total**

Suggested breakdown:
- 15-20 min: Set up testing framework and explore application
- 25-30 min: Write and run happy path tests
- 15-20 min: Write and run edge case tests
- 10-15 min: Document findings and any bugs
- 10-15 min: Verify all tests pass

---

## The Assessment

### Your Role

You're hired as QA Engineer for ConFiPay. The company needs:
- Reliable test coverage for core features
- Ability to catch bugs before production
- Tests that document expected behavior
- Confidence that the app works as designed

**Your task:** Build a test suite that gives the team confidence in the application.

---

## What to Test

### Priority 1: Authentication (Must Work)

**Test scenarios:**
1. ✅ Login with correct credentials
   - Should receive token
   - Should redirect to dashboard
   - Token should be valid for subsequent requests

2. ✅ Login with incorrect credentials
   - Should fail with error message
   - Should NOT receive token
   - Should stay on login page

3. ✅ Logout functionality
   - Token should be cleared
   - Subsequent API calls should fail
   - Should redirect to login

4. ✅ Token expiration
   - JWT tokens have expiration (check)
   - Expired token should trigger re-authentication
   - Old token should not work after expiration

### Priority 2: Payroll Operations (Core Feature)

**Test scenarios:**
1. ✅ Get employee list
   - Should return all employees
   - Data should include: name, email, salary, chain
   - Response should be consistent

2. ✅ Execute payroll
   - Should distribute payments to all employees
   - Each employee should receive correct amount
   - Transaction should be recorded

3. ✅ Verify payroll execution
   - Should be idempotent (running twice shouldn't double-pay)
   - Should handle insufficient funds gracefully
   - Should log all transactions

### Priority 3: Treasury Operations (Financial)

**Test scenarios:**
1. ✅ Get transaction history
   - Should return all transactions
   - Should include: id, type, amount, status, chain, date
   - Should handle pagination when data is large

2. ✅ Get balances per chain
   - Should return balance for each blockchain
   - Balance should be accurate
   - Should handle zero balance

3. ✅ Filter transactions
   - Filter by type (deposit, withdraw, payroll, bridge)
   - Filter by status (completed, processing, failed)
   - Filter by chain (BNB, ETH, SOL, BASE)

### Priority 4: Data Validation (Edge Cases)

**Test scenarios:**
1. ✅ Invalid input handling
   - Negative amounts should fail
   - Empty names should fail
   - Invalid email format should fail
   - Special characters should be handled

2. ✅ Boundary conditions
   - Very large numbers (max uint256)
   - Very small numbers (0)
   - Empty arrays/lists
   - Missing required fields

3. ✅ Error recovery
   - API errors should be handled
   - Network failures should be handled
   - Malformed responses should not crash

---

## Testing Frameworks

### Option A: Jest + Supertest (Recommended)

**Setup:**
```bash
npm install --save-dev jest supertest @testing-library/react
npx jest --init
```

**Example test:**
```javascript
const request = require('supertest');
const api = 'http://localhost:4000';

describe('Authentication', () => {
  test('Login with correct credentials', async () => {
    const response = await request(api)
      .post('/api/auth/login')
      .send({
        email: 'admin@confidentialpay.com',
        password: '00000'
      });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  test('Login with incorrect credentials fails', async () => {
    const response = await request(api)
      .post('/api/auth/login')
      .send({
        email: 'admin@confidentialpay.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.data.token).toBeUndefined();
  });
});
```

### Option B: Cypress (For End-to-End UI Testing)

**Setup:**
```bash
npm install --save-dev cypress
npx cypress open
```

**Example test:**
```javascript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should login successfully', () => {
    cy.get('input[type="email"]').type('admin@confidentialpay.com');
    cy.get('input[type="password"]').type('00000');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Dashboard');
  });
});
```

### Option C: Playwright

**Setup:**
```bash
npm install --save-dev playwright
npx playwright install
```

---

## Deliverables

### 1. Test Suite File

Create test file with at least **12-15 tests**:

```
tests/
├── auth.test.js          # Authentication tests (4-5 tests)
├── payroll.test.js       # Payroll operations (4-5 tests)
├── treasury.test.js      # Treasury/transactions (4-5 tests)
└── validation.test.js    # Edge cases and validation (3-4 tests)
```

### 2. Test Coverage Report

Show which features are tested:
```
Feature Coverage:
- Authentication: 100% (all paths tested)
- Payroll execution: 80% (main flow + edge cases)
- Treasury operations: 60% (basic queries, filters pending)
- Error handling: 50% (some error cases covered)

Lines of Code Coverage: ~45% (decent for 1.5 hour task)
```

### 3. Bug Report (for any issues found)

```markdown
## Bugs Found During Testing

### Bug #1: Login Error Message Doesn't Indicate If Email Exists
- Steps: Try login with non-existent email
- Expected: Generic "Invalid credentials" message
- Actual: Generic "Invalid credentials" message
- Severity: Low (actually good for security)
- Status: Not a bug, by design

### Bug #2: Transaction Filter Doesn't Work With Multiple Types
- Steps: Filter by type=["payroll", "deposit"]
- Expected: Returns both types
- Actual: Returns no results
- Severity: High
- Recommendation: Fix filter logic to support arrays

### Bug #3: Payroll Execution Doesn't Check For Sufficient Balance
- Steps: Execute payroll with 0 balance in treasury
- Expected: Should fail with error
- Actual: Shows success but no transactions created
- Severity: Critical
- Recommendation: Add balance check before execution
```

### 4. Test Execution Report

```markdown
## Test Results

Total Tests: 15
✅ Passed: 12
❌ Failed: 2
⏭️ Skipped: 1

Failed Tests:
- treasury.test.js: "Filter by multiple types" - Query parser doesn't support arrays
- validation.test.js: "Negative amounts rejected" - Backend accepts negative values

Skipped Tests:
- payroll.test.js: "Idempotency check" - Requires checking transaction uniqueness

Coverage by Feature:
- Authentication: 100%
- Payroll: 70%
- Treasury: 60%
- Validation: 80%
```

---

## Test Scenarios to Cover

### Happy Path (Main Flow Works)

```javascript
// Test: Complete payroll cycle
1. Login successfully
2. Get employee list (verify 12 employees)
3. Execute payroll (verify all paid)
4. View transaction history (verify new transactions)
5. Filter by type "payroll" (verify 4 transactions)
```

### Edge Cases (Boundary Conditions)

```javascript
// Test: Extreme values
1. Amount = 0 (should fail)
2. Amount = 999999999 (should succeed)
3. Amount = -100 (should fail)
4. Name = "" (empty string, should fail)
5. Name = "John O'Brien" (special chars, should work)
6. Email = "invalid@" (bad format, should fail)
```

### Error Handling (Failures Handled Gracefully)

```javascript
// Test: Error scenarios
1. Invalid JWT token (should return 401)
2. Non-existent employee ID (should return 404)
3. Malformed request body (should return 400)
4. Missing required fields (should return 400)
5. SQL injection in name field (should be sanitized)
```

### State Management (Data Consistency)

```javascript
// Test: Data stays consistent
1. Create transaction → Verify in list
2. Edit transaction → Verify change reflected
3. Delete transaction → Verify gone from list
4. Logout → Login again → Verify token valid
```

---

## Acceptance Criteria

✅ **Test Count:** 12-15 tests minimum
✅ **Coverage:** At least 3 features with 3+ tests each
✅ **Happy Path:** Tests that verify normal operation
✅ **Edge Cases:** Tests for boundary conditions and invalid input
✅ **Error Handling:** Tests for failure scenarios
✅ **All Tests Pass:** When run against working application
✅ **Tests Are Maintainable:** Clear names, good structure, reusable helpers
✅ **Bug Report:** Any issues found documented

---

## Evaluation Criteria

| Criterion | Score | Notes |
|-----------|-------|-------|
| **Test Coverage** | /5 | How many features tested? How thorough? |
| **Test Quality** | /5 | Are tests well-written? Do they verify real behavior? |
| **Edge Cases** | /5 | Are boundary conditions tested? Error handling? |
| **Bug Detection** | /5 | Did you find real issues? Or miss obvious bugs? |
| **Documentation** | /5 | Clear test structure? Bug report professional? |

**Passing Score:** 3+ on all criteria (minimum 15/25)

---

## Tips for Success

### ✅ Write Good Tests

```javascript
// ❌ BAD - Too vague
test('login works', () => {
  // Some unclear test code
});

// ✅ GOOD - Clear intent and verification
test('Login with correct credentials returns valid JWT token', () => {
  const response = await loginWithCredentials(
    'admin@confidentialpay.com',
    '00000'
  );
  
  expect(response.status).toBe(200);
  expect(response.body.data.token).toBeDefined();
  expect(response.body.data.token).toMatch(/^eyJ/); // JWT format
});
```

### ✅ Test Edge Cases

```javascript
// Test with realistic edge cases
test('Payroll execution handles zero balance', async () => {
  // Setup: Ensure treasury has $0
  await resetTreasuryBalance(0);
  
  // Execute payroll
  const response = await executePayroll();
  
  // Should fail gracefully
  expect(response.status).toBe(400);
  expect(response.body.error).toContain('Insufficient balance');
});
```

### ✅ Test Error Scenarios

```javascript
test('API returns 401 for expired token', async () => {
  const expiredToken = generateExpiredJWT();
  
  const response = await request(api)
    .get('/api/dashboard/stats')
    .set('Authorization', `Bearer ${expiredToken}`);
  
  expect(response.status).toBe(401);
});
```

### ✅ Document Failures

```javascript
// If a test fails, capture why
test('Filter by type parameter', async () => {
  // This might fail - document it!
  const response = await request(api)
    .get('/api/treasury/transactions?type=payroll')
    .set('Authorization', `Bearer ${token}`);
  
  expect(response.status).toBe(200);
  // If response.body is empty, add to bug report
  expect(response.body.data.transactions.length).toBeGreaterThan(0);
});
```

---

## Common Mistakes to Avoid

❌ **Too many tests, not enough depth**
- Don't write 50 tests that all check the same thing
- Better: 15 focused tests covering different scenarios

❌ **Tests that depend on each other**
```javascript
// ❌ BAD - Test 2 depends on Test 1 running first
test('1. Create transaction', ...);
test('2. Verify transaction exists', ...); // Won't work if run alone

// ✅ GOOD - Each test is independent
beforeEach(() => {
  // Set up fresh state for each test
});
```

❌ **Tests that sometimes pass, sometimes fail (flaky)**
- Don't use `setTimeout` (async waits)
- Don't depend on external timing
- Mock time if needed

❌ **Not capturing actual failures**
```javascript
// ❌ BAD - Test passes even if it shouldn't
test('Transaction created', async () => {
  const result = await createTransaction();
  // Forgot to assert result!
});

// ✅ GOOD - Assertion verifies expectation
test('Transaction created', async () => {
  const result = await createTransaction();
  expect(result.id).toBeDefined();
  expect(result.status).toBe('pending');
});
```

---

## Running Your Tests

### Jest
```bash
npm test                    # Run all tests
npm test -- --coverage     # With coverage report
npm test -- auth.test.js   # Specific file
npm test -- --watch       # Watch mode
```

### Cypress
```bash
npx cypress open           # Interactive mode
npx cypress run            # Headless mode
npx cypress run --headed   # Headless but visible
```

### Playwright
```bash
npx playwright test
npx playwright test --ui
```

---

## Time Management

```
0-5 min:   Set up testing framework
5-15 min:  Explore application features to understand what to test
15-30 min: Write happy path tests (authentication, basic operations)
30-50 min: Write edge case and error handling tests
50-65 min: Run tests and capture any failures/bugs
65-80 min: Write bug report and test documentation
80-90 min: Review tests, ensure they all pass, polish
```

---

## Interview Follow-Up

After submitting, expect:

1. "Walk me through your test for authentication. Why did you test this way?"
2. "What bugs did you find? How would you prioritize fixing them?"
3. "How would you test this in CI/CD pipeline?"
4. "What's the difference between unit, integration, and end-to-end tests?"
5. "How would you test a payment flow with external API?"

---

**This assessment tests your ability to think like QA: find edge cases, verify behavior, catch bugs, and ensure quality.**

Good luck! 🚀
