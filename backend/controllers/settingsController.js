const { getSettings, updateSettings } = require("../models/mockData.js");

function getSettingsHandler(_req, res) {
  return res.json(getSettings());
}

function updateSettingsHandler(req, res) {
  return res.json(updateSettings(req.body));
}

function getTeamSettings(_req, res) {
  return res.json({
    items: [
      { id: "u1", name: "Admin User", email: "admin@confidentialpay.com", role: "Owner" },
      { id: "u2", name: "Sara Lopez", email: "sara@confidentialpay.com", role: "Admin" },
      { id: "u3", name: "Mike Tanaka", email: "mike@confidentialpay.com", role: "Viewer" },
    ],
  });
}

module.exports = {
  getSettingsHandler,
  updateSettingsHandler,
  getTeamSettings,
};
