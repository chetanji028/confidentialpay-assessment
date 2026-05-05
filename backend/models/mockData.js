const VALID_EMAIL = "admin@confidentialpay.com";
const VALID_PASSWORD = "00000";

const ADMIN_USER = {
  email: VALID_EMAIL,
  name: "Admin User",
  role: "admin",
  company: "ConfidentialPay Inc",
};

const employees = [
  { id: "e1", name: "Alice Johnson", wallet: "0x7f3eA4b21cD9f08B5a6c11E0B23F8a9D4cE7b210", role: "Engineer", salary: 8500, status: "active", lastPaid: "2024-05-01", email: "alice@confidentialpay.com", startDate: "2024-01-15", chain: "BNB" },
  { id: "e2", name: "Bob Smith", wallet: "0x9a1Bd4eF87C3a2B6D9E5fA01237c4D5e6F7890Ab", role: "Designer", salary: 7200, status: "active", lastPaid: "2024-04-28", email: "bob@confidentialpay.com", startDate: "2024-02-10", chain: "ETH" },
  { id: "e3", name: "Carol White", wallet: "0x3e7C2d11AbCDef0123456789abcDEF0123456789", role: "Manager", salary: 11000, status: "active", lastPaid: "2024-05-01", email: "carol@confidentialpay.com", startDate: "2023-11-02", chain: "BNB" },
  { id: "e4", name: "David Park", wallet: "0x4f8DDeAa11223344556677889900AaBbCcDdEeFf", role: "Engineer", salary: 9200, status: "active", lastPaid: "2024-05-01", email: "david@confidentialpay.com", startDate: "2024-03-12", chain: "SOL" },
  { id: "e5", name: "Eva Martinez", wallet: "0x5a9EeBbcc11deeff0011223344556677889900aA", role: "PM", salary: 10500, status: "pending", lastPaid: "—", email: "eva@confidentialpay.com", startDate: "2024-05-10", chain: "BNB" },
  { id: "e6", name: "Frank Liu", wallet: "0x6b0FfCcDD22ee001122334455667788990011BB", role: "Engineer", salary: 8800, status: "active", lastPaid: "2024-04-28", email: "frank@confidentialpay.com", startDate: "2024-01-22", chain: "BASE" },
  { id: "e7", name: "Grace Kim", wallet: "0x7c1AaDDee33ff112233445566778899001122CC", role: "Marketing", salary: 6800, status: "active", lastPaid: "2024-05-01", email: "grace@confidentialpay.com", startDate: "2024-02-28", chain: "ETH" },
  { id: "e8", name: "Henry Yang", wallet: "0x8d2BbEEff44001122334455667788990011223D", role: "Engineer", salary: 9100, status: "inactive", lastPaid: "2024-03-30", email: "henry@confidentialpay.com", startDate: "2023-10-01", chain: "BNB" },
  { id: "e9", name: "Ivy Chen", wallet: "0x9e3CcFf005511223344556677889900112233EE", role: "Designer", salary: 7400, status: "active", lastPaid: "2024-04-28", email: "ivy@confidentialpay.com", startDate: "2024-04-05", chain: "SOL" },
  { id: "e10", name: "Jack Wilson", wallet: "0xae4Dd00116622334455667788990011223344FF", role: "Sales", salary: 7900, status: "active", lastPaid: "2024-05-01", email: "jack@confidentialpay.com", startDate: "2024-01-08", chain: "BNB" },
  { id: "e11", name: "Kate Brown", wallet: "0xbf5Ee11227733445566778899001122334455A0", role: "Engineer", salary: 9600, status: "active", lastPaid: "2024-05-01", email: "kate@confidentialpay.com", startDate: "2023-12-01", chain: "ETH" },
  { id: "e12", name: "Leo Garcia", wallet: "0xc06Ff22338844556677889900112233445566B1", role: "DevOps", salary: 10200, status: "active", lastPaid: "2024-05-01", email: "leo@confidentialpay.com", startDate: "2024-02-14", chain: "BNB" },
];

const transactions = [
  { id: "0x7f3e8a", type: "payroll", amount: 45230, status: "completed", chain: "BNB", date: "2024-05-01T09:00:00Z", employees: 12, fee: 12.5 },
  { id: "0x9a1cd2", type: "bridge", amount: 12000, status: "processing", chain: "ETH", date: "2024-05-01T08:00:00Z", from: "BNB", to: "SOL", fee: 8.2 },
  { id: "0x3e7b91", type: "payroll", amount: 23500, status: "completed", chain: "ETH", date: "2024-04-28T14:30:00Z", employees: 5, fee: 18.4 },
  { id: "0xa12fc4", type: "deposit", amount: 100000, status: "completed", chain: "BNB", date: "2024-04-25T10:00:00Z", fee: 1.2 },
  { id: "0xb84d05", type: "payroll", amount: 38900, status: "completed", chain: "SOL", date: "2024-04-15T09:00:00Z", employees: 8, fee: 4.5 },
  { id: "0xc92e16", type: "withdraw", amount: 5000, status: "completed", chain: "BNB", date: "2024-04-10T11:20:00Z", fee: 2.5 },
  { id: "0xd03f27", type: "payroll", amount: 41200, status: "failed", chain: "BASE", date: "2024-04-05T09:00:00Z", employees: 9, fee: 6.1 },
  { id: "0xe14038", type: "bridge", amount: 8500, status: "completed", chain: "ETH", date: "2024-04-01T15:00:00Z", from: "ETH", to: "BNB", fee: 14.3 },
];

const scheduled = [
  { id: "s1", date: "2024-05-15T09:00:00Z", employees: 12, amount: 45230, chain: "BNB", template: "Monthly Engineering" },
  { id: "s2", date: "2024-05-15T14:00:00Z", employees: 8, amount: 28100, chain: "ETH", template: "Designers Bi-weekly" },
  { id: "s3", date: "2024-05-22T09:00:00Z", employees: 5, amount: 19500, chain: "SOL", template: "Contractors" },
];

const templates = [
  { id: "t1", name: "Monthly Engineering", employees: 12, amount: 45230, chain: "BNB", lastUsed: "2024-05-01" },
  { id: "t2", name: "Designers Bi-weekly", employees: 8, amount: 28100, chain: "ETH", lastUsed: "2024-04-28" },
  { id: "t3", name: "Contractors", employees: 5, amount: 19500, chain: "SOL", lastUsed: "2024-04-15" },
];

let settings = {
  company: "ConfidentialPay Inc",
  defaultChain: "BNB",
  privacyLevel: "high",
  timezone: "UTC-5",
};

function getSettings() {
  return settings;
}

function updateSettings(patch) {
  settings = { ...settings, ...patch };
  return settings;
}

module.exports = {
  VALID_EMAIL,
  VALID_PASSWORD,
  ADMIN_USER,
  employees,
  transactions,
  scheduled,
  templates,
  getSettings,
  updateSettings,
};
