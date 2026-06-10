# ConFiPay - Blockchain Developer Guide & Test Suite

## 🏗️ Project Architecture

### Frontend Stack
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Radix UI Components
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

### Backend Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT (12h access, 7d refresh)
- **Rate Limiting:** 240 requests/minute
- **CORS:** Configurable origins

### Current Database
- **Mock Data Mode** (No persistence layer - design choice for flexibility)
- All data hardcoded in `backend/models/mockData.js`
- Ready for blockchain/Web3 integration

---

## 🔐 Authentication Test Credentials

```
Email: admin@confidentialpay.com
Password: 00000
JWT Secret (dev): confidentialpay-dev-secret-change-me
```

---

## 📡 API Endpoints Available

### Authentication
```
POST   /api/auth/login              # Returns token + refreshToken
POST   /api/auth/logout             # Invalidates session
POST   /api/auth/refresh            # Renew JWT token
POST   /api/auth/forgot-password    # Password recovery
POST   /api/auth/reset-password     # Reset with token
GET    /api/auth/me                 # Get current user (requires auth)
```

### Dashboard
```
GET    /api/dashboard/stats         # Overview metrics
GET    /api/dashboard/transactions  # Recent activity
GET    /api/dashboard/payroll-activity
GET    /api/dashboard/upcoming-payrolls
```

### Payroll Management
```
GET    /api/payroll/employees       # List employees for payroll
POST   /api/payroll/execute         # Execute payroll run
POST   /api/payroll/schedule        # Create scheduled payroll
GET    /api/payroll/scheduled       # List scheduled runs
PUT    /api/payroll/scheduled/:id   # Update schedule
DELETE /api/payroll/scheduled/:id   # Cancel schedule
GET    /api/payroll/history         # Payment history
GET    /api/payroll/templates       # List templates
POST   /api/payroll/templates       # Create template
```

### Employee Management
```
GET    /api/employees               # List all employees
GET    /api/employees/:id           # Get employee details
POST   /api/employees               # Add new employee
PUT    /api/employees/:id           # Update employee
DELETE /api/employees/:id           # Remove employee
POST   /api/employees/bulk-import   # Batch import
```

### Treasury Operations
```
GET    /api/bridge                  # Bridge overview
GET    /api/treasury/balances       # Asset balances per chain
GET    /api/treasury/transactions   # Transaction history
POST   /api/treasury/deposit        # Fund treasury
POST   /api/treasury/withdraw       # Withdraw funds
POST   /api/treasury/bridge         # Cross-chain bridge
```

### Compliance
```
GET    /api/compliance              # Compliance summary
GET    /api/compliance/score        # Compliance rating
GET    /api/compliance/status       # Current status
GET    /api/compliance/audit        # Audit trail
POST   /api/compliance/reports/generate  # Generate report
```

### Settings
```
GET    /api/settings                # User settings
PUT    /api/settings                # Update settings
GET    /api/settings/team           # Team configuration
```

---

## 🚀 Running Tests

### Start Backend
```bash
npm run dev:backend
# or
node --watch ./backend/server.js
```

Server listens on: `http://localhost:4000`

### Test with cURL
```bash
# Health check
curl http://localhost:4000

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@confidentialpay.com","password":"00000"}'

# Get protected resource (replace TOKEN with actual JWT)
curl http://localhost:4000/api/dashboard/stats \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 Mock Data Available

### Employees (12 total)
- Alice Johnson (Engineer, $8,500/mo) - BNB Chain, 0x7f3e...
- Bob Smith (Designer, $7,200/mo) - ETH Chain
- Carol White (Manager, $11,000/mo) - BNB Chain
- David Park (Engineer, $9,200/mo) - SOL Chain
- Eva Martinez (PM, $10,500/mo) - BNB Chain (Pending)
- Frank Liu (Engineer, $8,800/mo) - BASE Chain
- Grace Kim (Marketing, $6,800/mo) - ETH Chain
- Henry Yang (Engineer, $9,100/mo) - BNB Chain (Inactive)
- Ivy Chen (Designer, $7,400/mo) - SOL Chain
- Jack Wilson (Sales, $7,900/mo) - BNB Chain
- Kate Brown (Engineer, $9,600/mo) - ETH Chain
- Leo Garcia (DevOps, $10,200/mo) - BNB Chain

### Supported Blockchains
- BNB Chain (Binance Smart Chain)
- Ethereum (ETH)
- Solana (SOL)
- Base (BASE)

### Transaction History (8 sample transactions)
- Total payroll runs: 4 (completed/failed mix)
- Bridge operations: 2 (cross-chain transfers)
- Treasury operations: 2 (deposit/withdraw)

---

## 🔗 Blockchain Integration Opportunities

### 1. Smart Contract Integration
**Task:** Implement smart contract calls for payroll execution
- Replace mock payroll execution with on-chain contract calls
- Support multiple chains simultaneously
- Handle gas fee calculations
- Implement rollback mechanisms

### 2. Multi-Chain Treasury Bridge
**Task:** Build actual cross-chain bridge functionality
- Integrate Stargate, LayerZero, or native bridge protocols
- Real-time balance synchronization
- Bridge fee optimization
- Chain state validation

### 3. Compliance Automation
**Task:** Move audit trails to blockchain
- Immutable transaction history (store on-chain)
- Automated compliance reports via smart contracts
- Real-time audit log generation
- Tamper-proof employee records

### 4. Crypto Payment Rails
**Task:** Enable direct cryptocurrency disbursement
- Wallet address validation
- Chain-specific payment routing
- Slippage protection
- Stablecoin selection logic

### 5. Decentralized Compliance (Web3)
**Task:** On-chain KYC/AML verification
- Integration with Worldcoin or similar
- Employee identity verification on-chain
- Regulatory compliance tokens
- Multi-sig approval workflows

---

## 📈 Development Workflow

### Install Dependencies
```bash
npm install
```

### Run Full Stack (Frontend + Backend)
```bash
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

### Build for Production
```bash
npm run build
```

### Format Code
```bash
npm run format
```

---

## 🛠️ Tech Stack Details

### Dependencies
- **Express.js** - Web framework
- **JWT** - Token-based auth
- **CORS** - Cross-origin requests
- **Rate-Limiter** - Request throttling
- **Dotenv** - Environment config
- **Axios** - HTTP client
- **React Router** - Frontend routing
- **Radix UI** - Accessible components
- **Tailwind CSS** - Utility CSS
- **TypeScript** - Type safety

### Project Configuration
- **Port (Backend):** 4000
- **Port (Frontend):** 3000
- **Rate Limit:** 240 req/min per IP
- **Request Size:** Max 2MB JSON payload
- **CORS:** Configurable via `CORS_ORIGIN` env var

---

## 🔑 Environment Variables

Create a `.env` file:
```
PORT=4000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
JWT_SECRET=your-secure-secret-here
NODE_ENV=development
```

---

## ✅ Blockchain Developer Checklist

- [ ] Understand current mock data structure
- [ ] Set up Web3 provider integration (ethers.js/web3.js)
- [ ] Plan smart contract architecture
- [ ] Choose target chains and bridges
- [ ] Design transaction flow with error handling
- [ ] Implement gas fee estimation
- [ ] Set up testnet deployment
- [ ] Create comprehensive logging
- [ ] Build fallback mechanisms
- [ ] Document integration points

---

## 📝 Notes for Developers

1. **No Database Currently** - All data is in-memory mock data. First step is choosing a persistence layer (MongoDB, PostgreSQL, or on-chain state).

2. **Modular Controllers** - Each domain (auth, payroll, treasury, compliance) has its own controller. Easy to swap mock implementations with blockchain calls.

3. **Middleware-Ready** - Auth middleware is already in place. Easy to extend with additional checks.

4. **Multi-Chain Support** - Mock data already includes `chain` field for employees and transactions. The structure is ready for multi-chain operations.

5. **Error Handling** - Backend has basic error handling. Blockchain operations will need robust error recovery and retry logic.

---

## 🎯 Quick Start for Blockchain Developers

1. Clone/setup the project
2. Run `npm install`
3. Start backend: `npm run dev:backend`
4. Test endpoints with provided credentials
5. Examine the controller files to understand data flow
6. Identify integration points for blockchain calls
7. Plan smart contract requirements
8. Implement Web3 connection layer
9. Create contract interfaces
10. Integrate with existing API endpoints

---

Generated: 2026-07-07
Project: ConFiPay - Privacy-First Payroll & Treasury Platform
