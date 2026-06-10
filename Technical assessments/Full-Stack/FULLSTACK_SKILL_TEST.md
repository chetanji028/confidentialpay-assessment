# Full-Stack Developer Task: ConFiPay Transaction Filtering

## Overview

Build a complete feature for ConFiPay's transaction management system. Implement a simple filtering API and connect it to the UI within 1-1.5 hours. This demonstrates your ability to work full-stack: designing a basic API, handling validation, and integrating it with React.

**Time: 1 to 1.5 hours**

---

## The Problem

The Treasury page shows all transactions at once, but users need to filter by transaction type (deposit, withdraw, payroll, bridge). Currently there's no way to see just payroll transactions or just deposits. Build a simple filtered view that works end-to-end.

This requires one backend endpoint and one frontend update.

---

## Your Task

### Part 1: Backend Endpoint (30-40 minutes)

Create a simple API endpoint that filters transactions by type:

**Endpoint:** `GET /api/treasury/transactions`

**Query Parameters:**
- `type` (optional) - Filter by: `deposit`, `withdraw`, `payroll`, or `bridge`

**Example Requests:**
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

**Requirements:**
1. If `type` query parameter is provided, filter transactions by that type
2. If invalid type provided, return `400` with error message
3. Return all transactions if no filter provided
4. Include total count in response

**Files to Modify:**
- `backend/controllers/treasuryController.js` - Add `getTransactions` function
- `backend/routes/index.js` - Register the route (or modify existing one)

### Part 2: Frontend Integration (20-30 minutes)

Update the Treasury page to use the filtered endpoint:

1. **Add Filter Control** (simple dropdown)
   - Show dropdown with options: "All Types", "Payroll", "Deposit", "Withdraw", "Bridge"
   - When selection changes, fetch filtered data

2. **Display Results**
   - Show list of transactions (use existing table or simple list)
   - Show total count
   - Display loading state while fetching
   - Display error if request fails

3. **Basic Requirements**
   - Dropdown is intuitive and easy to use
   - Loads immediately when you change selection
   - Shows "No transactions" if list is empty
   - Works on mobile (dropdown stacks cleanly)

**Files to Modify:**
- `src/pages/TreasuryPage.tsx` - Add filter dropdown and update data fetching

### Part 3: Testing (10-15 minutes)

Verify the feature works:
1. Load Treasury page - see all transactions
2. Filter by "Payroll" - see only payroll transactions
3. Filter by "Deposit" - see only deposits
4. Select "All Types" - see all again
5. Test that total count is accurate
6. Test on mobile viewport

---

## What You Have to Work With

**Backend:**
- `backend/models/mockData.js` - 8 transactions (types: deposit, withdraw, payroll, bridge)
- `backend/controllers/treasuryController.js` - Add function here
- `backend/routes/index.js` - Register route here
- Already protected by auth middleware

**Frontend:**
- `src/pages/TreasuryPage.tsx` - Add filter dropdown here
- `src/components/ui/` - Button, Select components available
- Tailwind CSS for styling

---

## Technical Guidance

### Simple Backend Implementation

```javascript
// In backend/controllers/treasuryController.js

const { transactions } = require("../models/mockData.js");

function getTransactions(req, res) {
  const { type } = req.query;
  
  // Validate type if provided
  if (type && !['deposit', 'withdraw', 'payroll', 'bridge'].includes(type)) {
    return res.status(400).json({ 
      error: "Invalid type. Must be: deposit, withdraw, payroll, or bridge" 
    });
  }
  
  // Filter by type if provided
  let filtered = transactions;
  if (type) {
    filtered = transactions.filter(tx => tx.type === type);
  }
  
  return res.json({
    success: true,
    data: {
      transactions: filtered,
      total: filtered.length
    }
  });
}

module.exports = { 
  // ... existing exports
  getTransactions 
};
```

```javascript
// In backend/routes/index.js - Add this route:

router.get("/api/treasury/transactions", requireAuth, treasuryController.getTransactions);
```

### Simple Frontend Implementation

```typescript
// In src/pages/TreasuryPage.tsx

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function TreasuryPage() {
  const [selectedType, setSelectedType] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transactions when type filter changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = selectedType 
          ? `/treasury/transactions?type=${selectedType}`
          : "/treasury/transactions";
        const response = await api.get(url);
        setTransactions(response.data.data.transactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedType]);

  return (
    <div className="space-y-4">
      {/* Filter Dropdown */}
      <div>
        <label className="text-sm font-medium">Filter by Type</label>
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="mt-2 w-full max-w-xs rounded-lg border border-border bg-input/40 px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="payroll">Payroll</option>
          <option value="bridge">Bridge</option>
        </select>
      </div>

      {/* Status */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && transactions.length === 0 && <p>No transactions found</p>}

      {/* Results */}
      {!loading && transactions.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Total: {transactions.length} transaction(s)
          </p>
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="rounded border border-border p-3">
                <div className="flex justify-between">
                  <span className="font-semibold capitalize">{tx.type}</span>
                  <span className="font-mono">${tx.amount.toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(tx.date).toLocaleDateString()} • {tx.chain}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Acceptance Criteria

✓ Backend endpoint exists at `/api/treasury/transactions`  
✓ Filtering by type works correctly (returns only matching transactions)  
✓ Invalid type parameter returns 400 error  
✓ Response format includes transactions array and total count  
✓ Frontend has dropdown with transaction type options  
✓ Dropdown filters results (no page reload needed)  
✓ Shows total count of transactions  
✓ Shows "No transactions" when list is empty  
✓ Shows loading state while fetching  
✓ Shows error message if request fails  
✓ Works on mobile (dropdown is usable)  
✓ End-to-end flow is tested and working  

---

## Deliverables

1. **Backend Changes**
   - `backend/controllers/treasuryController.js` (getTransactions function)
   - `backend/routes/index.js` (route registration)

2. **Frontend Changes**
   - `src/pages/TreasuryPage.tsx` (filter dropdown + integration)

3. **Test Results**
   - Show 3 example requests and responses (curl or Postman)
   - Describe what you tested

4. **Brief Note** (2-3 sentences)
   - What the feature does
   - How to test it
   - Any issues encountered

---

## What We're Evaluating

- **End-to-End Thinking** - Do backend and frontend connect properly?
- **Basic Validation** - Proper error handling?
- **User Experience** - Is the UI simple and intuitive?
- **Code Quality** - Clean and follows project patterns?
- **Problem-Solving** - Did you test and verify it works?

---

## Tips

- Keep it simple - just filter by type, no sorting needed
- Start with the backend endpoint first, then frontend
- The useApiData hook can help, but you can also use `fetch()` directly
- Test with cURL before integrating frontend
- Focus on one thing working well rather than multiple incomplete features

---

## Getting Started

1. Review transactions in `backend/models/mockData.js` (note the `type` field)
2. Create the backend endpoint (filter by type only)
3. Register the route
4. Test the endpoint with different type values
5. Add dropdown to Treasury page
6. Wire up the fetch call
7. Test end-to-end
8. Write a brief note about what you built

**Total time: 60-90 minutes**

**Good luck!**
