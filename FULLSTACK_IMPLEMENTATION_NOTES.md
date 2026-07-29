# Transaction filtering implementation notes

The Treasury transaction history now loads `GET /api/treasury/transactions` and refetches whenever the type dropdown changes. The endpoint accepts `deposit`, `withdraw`, `payroll`, and `bridge`, returns the filtered transactions with an accurate total, and rejects any other value with HTTP 400.

## Verify locally

Start the app with `npm run dev`, sign in with the demo account, then use the Treasury page to select each filter. The table shows loading, error, empty, and total-count states and the filter stacks cleanly on small screens.

With an authenticated token, these requests demonstrate the API:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:4000/api/treasury/transactions
# 200: { "success": true, "data": { "transactions": [8 items], "total": 8 } }

curl -H "Authorization: Bearer <token>" "http://localhost:4000/api/treasury/transactions?type=payroll"
# 200: { "success": true, "data": { "transactions": [4 payroll items], "total": 4 } }

curl -H "Authorization: Bearer <token>" "http://localhost:4000/api/treasury/transactions?type=invalid"
# 400: { "success": false, "error": "Invalid type. Must be: deposit, withdraw, payroll, or bridge" }
```
