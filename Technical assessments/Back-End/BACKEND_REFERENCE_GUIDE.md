# Backend Developer Task: Reference & Architecture Guide

**For Candidates - Refer to This While Working**

---

## Project Structure

```
backend/
├── server.js              # Express app setup
├── routes/
│   └── index.js           # Route registration
├── controllers/
│   ├── authController.js
│   ├── treasuryController.js  ← Your new function goes here
│   └── ...
├── middleware/
│   └── auth.js            # Authentication middleware
└── models/
    └── mockData.js        # Data source (transactions array)
```

---

## Transaction Data Structure

From `backend/models/mockData.js`:

```javascript
const transactions = [
  {
    id: "0x7f3e8a",
    type: "payroll",              // deposit, withdraw, payroll, bridge
    amount: 45230,
    status: "completed",           // completed, processing, failed
    chain: "BNB",
    date: "2024-05-01T09:00:00Z", // ISO 8601 format
    employees: 12,
    fee: 12.5
  },
  // ... 7 more transactions
];
```

---

## Existing Controller Pattern

Look at `backend/controllers/treasuryController.js`:

```javascript
const { treasuryData } = require("../models/mockData.js");

function getBridgeOverview(req, res) {
  // 1. Process
  const data = /* ... process data ... */;
  
  // 2. Respond
  return res.json({
    success: true,
    data: data,
  });
}

function getBalances(req, res) {
  return res.json({
    success: true,
    data: /* ... */
  });
}

module.exports = {
  getBridgeOverview,
  getBalances,
  // Add your new function here
};
```

---

## Authentication Middleware

In `backend/middleware/auth.js`:

```javascript
const { requireAuth } = require("../middleware/auth.js");

// Usage in route:
router.get("/api/protected", requireAuth, controllerFunction);

// The middleware:
// - Checks for Authorization: Bearer <token> header
// - Validates JWT token
// - Passes if valid, returns 401 if not
```

**Protected by default:** All endpoints requiring authentication already check this.

---

## Route Registration

In `backend/routes/index.js`:

```javascript
const router = Router();

// Example existing route:
router.get("/api/dashboard/stats", requireAuth, dashboardController.getStats);

// Register your new route like this:
router.get("/api/treasury/transactions/filtered", requireAuth, treasuryController.getFilteredTransactions);
```

---

## Common Patterns

### Input Validation Pattern

```javascript
function validateFilters(query) {
  const errors = [];
  
  // String to number conversion
  const limit = parseInt(query.limit) || 20;
  const offset = parseInt(query.offset) || 0;
  
  // Validation rules
  if (isNaN(limit) || limit < 1 || limit > 100) {
    errors.push("limit must be between 1 and 100");
  }
  
  if (isNaN(offset) || offset < 0) {
    errors.push("offset must be non-negative");
  }
  
  // Enum validation
  const validTypes = ["deposit", "withdraw", "payroll", "bridge"];
  if (query.type && !validTypes.includes(query.type)) {
    errors.push(`type must be one of: ${validTypes.join(", ")}`);
  }
  
  // Return error if validation failed
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return { valid: true, params: { limit, offset } };
}

// Usage in controller:
const validation = validateFilters(req.query);
if (!validation.valid) {
  return res.status(400).json({ error: "Validation failed", details: validation.errors });
}
```

### Array Filtering Pattern

```javascript
// Filter by single property
let results = transactions;

if (type) {
  results = results.filter(tx => tx.type === type);
}

// Filter by multiple conditions
results = results.filter(tx => 
  tx.status === "completed" && 
  tx.amount > 0
);
```

### Sorting Pattern

```javascript
// Sort by string field
const sorted = [...results].sort((a, b) => {
  if (a.type < b.type) return -1;
  if (a.type > b.type) return 1;
  return 0;
});

// Sort by number field
const sorted = [...results].sort((a, b) => a.amount - b.amount);

// Sort by date
const sorted = [...results].sort((a, b) => {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  return dateA - dateB;
});

// Reverse sort (descending)
const descending = sorted.reverse();

// Or inline with direction
const sorted = [...results].sort((a, b) => {
  const direction = order === "asc" ? 1 : -1;
  return (a.field - b.field) * direction;
});
```

### Pagination Pattern

```javascript
const limit = 20;
const offset = 0;

// Calculate pagination metadata
const total = results.length;
const pages = Math.ceil(total / limit);
const hasMore = offset + limit < total;

// Slice the data
const paginatedData = results.slice(offset, offset + limit);

// Return with metadata
return res.json({
  success: true,
  data: {
    items: paginatedData,
    pagination: {
      total,
      limit,
      offset,
      pages,
      hasMore
    }
  }
});
```

### Error Response Pattern

```javascript
// 400 - Bad Request (validation error)
if (!isValid) {
  return res.status(400).json({
    error: "Validation failed",
    details: ["limit must be positive", "type is invalid"]
  });
}

// 401 - Unauthorized (auth middleware handles this)
// Already protected by requireAuth middleware

// 500 - Internal Server Error
try {
  // processing
} catch (err) {
  console.error(err);
  return res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
}
```

---

## JavaScript/Node Cheat Sheet

### Array Methods You'll Need

```javascript
// Filter
const deposits = transactions.filter(t => t.type === "deposit");

// Map
const amounts = transactions.map(t => t.amount);

// Sort
const sorted = [...transactions].sort((a, b) => a.amount - b.amount);

// Slice (for pagination)
const page = transactions.slice(0, 10); // First 10 items
const page2 = transactions.slice(10, 20); // Next 10 items

// Reduce
const total = transactions.reduce((sum, t) => sum + t.amount, 0);

// Every/Some
const allCompleted = transactions.every(t => t.status === "completed");
const anyFailed = transactions.some(t => t.status === "failed");

// Find
const first = transactions.find(t => t.type === "payroll");

// Spread operator (create copy without mutation)
const copy = [...transactions];
```

### String/Number Conversion

```javascript
// String to number
const num = parseInt("20"); // 20
const float = parseFloat("20.5"); // 20.5

// Check if valid number
const isNum = !isNaN(parseInt("20")); // true
const isNum2 = !isNaN(parseInt("abc")); // false

// Number to string
const str = String(20); // "20"
```

### Date Handling

```javascript
// Parse ISO string
const date = new Date("2024-05-01T09:00:00Z");

// Get timestamp
const timestamp = date.getTime(); // 1714556400000

// Compare dates
const d1 = new Date("2024-05-01T09:00:00Z");
const d2 = new Date("2024-05-02T09:00:00Z");
const isBefore = d1 < d2; // true
```

---

## Common Gotchas

### ❌ Mutating Arrays
```javascript
// Wrong - mutates original
transactions.sort(...);

// Right - uses copy
const sorted = [...transactions].sort(...);
```

### ❌ Query Parameters Are Strings
```javascript
// Wrong - "20" is a string, not a number
if (query.limit > 100) { }

// Right - convert to number first
const limit = parseInt(query.limit);
if (limit > 100) { }
```

### ❌ Inconsistent Date Comparison
```javascript
// Wrong - comparing strings directly
if (a.date > b.date) { } // Lexicographic, not chronological

// Right - convert to timestamps
if (new Date(a.date) > new Date(b.date)) { }
```

### ❌ Missing Edge Cases
```javascript
// Wrong - doesn't handle empty results
const pages = results.length / limit; // Could be 0

// Right - always at least 1 page
const pages = Math.ceil(results.length / limit) || 1;
```

---

## Testing Your Endpoint

### Using cURL

```bash
# Basic test
curl http://localhost:4000/api/treasury/transactions/filtered

# With authorization (get token from login first)
curl -H "Authorization: Bearer <YOUR_TOKEN>" \
  http://localhost:4000/api/treasury/transactions/filtered

# With query parameters
curl "http://localhost:4000/api/treasury/transactions/filtered?type=payroll&limit=10"

# With all parameters
curl "http://localhost:4000/api/treasury/transactions/filtered?type=payroll&limit=10&offset=0&sortBy=amount&order=desc"
```

### Using Node.js

```javascript
const http = require("http");

const options = {
  hostname: "localhost",
  port: 4000,
  path: "/api/treasury/transactions/filtered?type=payroll&limit=5",
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_TOKEN_HERE"
  }
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => console.log(JSON.parse(data)));
});

req.on("error", (e) => console.error(e));
req.end();
```

### Using Postman/Thunder Client
1. GET `http://localhost:4000/api/treasury/transactions/filtered`
2. Add header: `Authorization: Bearer <token>`
3. Add query params: `type=payroll`, `limit=10`
4. Click Send

---

## Step-by-Step Implementation

1. **Review the data**
   - Look at `backend/models/mockData.js`
   - Understand transaction structure

2. **Plan your function**
   - Write pseudocode for validation
   - Plan filtering/sorting logic
   - Sketch pagination calculation

3. **Implement validation**
   - Check each parameter type
   - Convert strings to numbers
   - Return 400 if invalid

4. **Implement logic**
   - Filter array
   - Sort array
   - Slice for pagination

5. **Format response**
   - Include data + pagination info
   - Use consistent structure

6. **Register route**
   - Add to `backend/routes/index.js`
   - Include `requireAuth` middleware

7. **Test thoroughly**
   - Valid parameters
   - Invalid parameters
   - Edge cases (empty results, max pagination)
   - Different sort orders

---

## Quick Reference: HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Request succeeded |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid auth token |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Server Error | Unhandled exception |

---

## Debugging Tips

- Use `console.log()` to inspect values
- Check query parameters: `console.log(req.query)`
- Verify array operations: `console.log(filtered, sorted, paginated)`
- Test API response format: Copy paste into JSON validator
- Use `curl` to isolate backend issues from frontend

---

## Files You'll Modify

- ✏️ `backend/controllers/treasuryController.js` - Add your function
- ✏️ `backend/routes/index.js` - Register your route
- 📖 `backend/models/mockData.js` - Just read (don't modify)

---

**Ready? Start by looking at the transaction data, then plan your validation and filtering logic. Good luck!**
