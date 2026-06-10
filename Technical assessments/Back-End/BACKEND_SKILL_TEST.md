# Backend Developer Task: ConFiPay Transaction Filtering

## Overview

Implement a simple backend API endpoint that filters transactions by type. This demonstrates your ability to work with existing backend patterns, validate input, and return properly formatted responses.

**Time: 1 to 1.5 hours**

---

## The Problem

The Treasury system has 8 transactions stored in mock data, but there's no way to filter them by type (deposit, withdraw, payroll, bridge). Users need an endpoint that returns only the transactions they're interested in.

Build one endpoint that accepts an optional `type` filter and returns the matching transactions.

---

## Your Task

Create a backend endpoint that filters transactions by type:

**Endpoint:** `GET /api/treasury/transactions`

**Query Parameters:**
- `type` (optional) - Filter by: `deposit`, `withdraw`, `payroll`, or `bridge`

**Example Usage:**
```
GET /api/treasury/transactions
GET /api/treasury/transactions?type=payroll
GET /api/treasury/transactions?type=deposit
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "0x7f3e8a",
        "type": "payroll",
        "amount": 45230,
        "status": "completed",
        "chain": "BNB",
        "date": "2024-05-01T09:00:00Z"
      }
    ],
    "total": 4
  }
}
```

**What Your Endpoint Must Do:**

1. **Accept optional type filter**
   - If `type` is provided, filter transactions to only that type
   - If `type` is not provided, return all transactions

2. **Validate the type**
   - Only allow: `deposit`, `withdraw`, `payroll`, `bridge`
   - If invalid type provided, return `400` with error message

3. **Return correct format**
   - Include transactions array
   - Include total count
   - Use `success: true` format

---

## What You Have to Work With

**Data:**
- `backend/models/mockData.js` - Contains `transactions` array with 8 items
- Each transaction has: `id`, `type`, `amount`, `status`, `chain`, `date`, `employees`, `fee`

**Backend Files:**
- `backend/controllers/treasuryController.js` - Add your function here
- `backend/routes/index.js` - Register your route here
- `backend/middleware/auth.js` - Already handles authentication (use `requireAuth`)

**Code Patterns:**
- Look at existing controllers for how to structure responses
- Use the validation pattern shown below

---

## Implementation Guide

### Step 1: Create the Function (20-25 minutes)

In `backend/controllers/treasuryController.js`:

```javascript
const { transactions } = require("../models/mockData.js");

function getTransactions(req, res) {
  const { type } = req.query;
  
  // Step 1: Validate type if provided
  const validTypes = ["deposit", "withdraw", "payroll", "bridge"];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({
      error: "Invalid type. Must be one of: " + validTypes.join(", ")
    });
  }
  
  // Step 2: Filter transactions
  let filtered = transactions;
  if (type) {
    filtered = transactions.filter(tx => tx.type === type);
  }
  
  // Step 3: Return response
  return res.json({
    success: true,
    data: {
      transactions: filtered,
      total: filtered.length
    }
  });
}

module.exports = {
  // ...existing exports...
  getTransactions
};
```

### Step 2: Register the Route (5 minutes)

In `backend/routes/index.js`, add this line with the other treasury routes:

```javascript
router.get("/api/treasury/transactions", requireAuth, treasuryController.getTransactions);
```

### Step 3: Test the Endpoint (25-35 minutes)

Test with cURL or your HTTP client:

```bash
# Get all transactions
curl http://localhost:4000/api/treasury/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by payroll
curl "http://localhost:4000/api/treasury/transactions?type=payroll" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test invalid type (should return 400)
curl "http://localhost:4000/api/treasury/transactions?type=invalid" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Acceptance Criteria

✓ Endpoint exists at `/api/treasury/transactions`  
✓ Returns all transactions when no type filter provided  
✓ Filters correctly by type (returns only matching transactions)  
✓ Rejects invalid type with 400 status code  
✓ Error message is clear and helpful  
✓ Response includes transactions array and total count  
✓ Endpoint is protected by auth middleware  
✓ Returns correct HTTP 200 status for success  

---

## Deliverables

1. **Backend Code**
   - Modified `backend/controllers/treasuryController.js`
   - Modified `backend/routes/index.js`

2. **Test Results** (show these 3 requests + responses)
   - GET all transactions (no filter)
   - GET with type=payroll
   - GET with invalid type (show 400 error)

3. **Brief Note** (2-3 sentences)
   - What the endpoint does
   - How you tested it
   - Any issues you encountered

---

## What We're Looking For

✓ **Correct Logic** - Filtering works as expected  
✓ **Validation** - Invalid input handled properly  
✓ **Error Handling** - Right HTTP status codes  
✓ **Code Quality** - Clean, readable, follows patterns  
✓ **Testing** - Evidence you verified it works  

---

## Quick Reference

### JavaScript Array Methods You'll Need

```javascript
// Filter array
const filtered = transactions.filter(tx => tx.type === "payroll");

// Check if value is in array
const validTypes = ["deposit", "withdraw", "payroll", "bridge"];
const isValid = validTypes.includes("payroll"); // true

// Get count
const count = filtered.length;
```

### Common HTTP Status Codes

```
200 - OK (success)
400 - Bad Request (validation error)
401 - Unauthorized (missing/invalid token - handled by middleware)
500 - Server Error
```

---

## Tips

- Test with and without the type parameter
- Test with invalid type to make sure error handling works
- The middleware already handles auth, so don't worry about that
- Keep the validation message clear so users know what went wrong
- Start simple: get all transactions first, then add filtering

---

## Getting Started

1. Look at the transactions data in `backend/models/mockData.js`
2. Create your function following the template above
3. Register the route
4. Test with cURL or Postman
5. Document your test results
6. Write your brief note

**Time budget: 60-90 minutes**

**Good luck!**
