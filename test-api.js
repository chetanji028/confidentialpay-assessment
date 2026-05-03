#!/usr/bin/env node

/**
 * ConFiPay - Simple API Test
 * Tests basic endpoints to verify backend functionality
 */

const http = require("http");

const BASE_URL = "http://localhost:4000";

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
          });
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

async function runTests() {
  console.log("🧪 ConFiPay API Test Suite\n");
  console.log("Testing against:", BASE_URL);
  console.log("----------------------------\n");

  try {
    // Test 1: Health check
    console.log("✓ Test 1: Health Check");
    const healthResponse = await makeRequest("GET", "/");
    console.log(`  Status: ${healthResponse.status}`);
    console.log(`  Response:`, healthResponse.body);
    console.log();

    // Test 2: Login endpoint (should fail - no credentials)
    console.log("✓ Test 2: Login Endpoint (validation)");
    const loginResponse = await makeRequest("POST", "/api/auth/login");
    console.log(`  Status: ${loginResponse.status}`);
    console.log(`  Response:`, loginResponse.body);
    console.log();

    console.log("✅ All tests completed!");
    console.log("\n📋 Available API Endpoints:");
    console.log("  Auth: POST /api/auth/login, /api/auth/logout, /api/auth/forgot-password");
    console.log("  Dashboard: GET /api/dashboard/stats, /api/dashboard/transactions");
    console.log("  Payroll: GET/POST /api/payroll/employees, /api/payroll/execute");
    console.log("  Employees: GET/POST /api/employees");
    console.log("  Treasury: GET/POST /api/treasury/balances, /api/treasury/deposit");
    console.log("  Compliance: GET /api/compliance, /api/compliance/score");
    console.log(
      "\nℹ️  Protected endpoints require authentication token in header: Authorization: Bearer <token>"
    );
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

runTests();
