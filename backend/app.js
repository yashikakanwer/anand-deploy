const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appDir = __dirname;
const nodeModulesDir = path.join(appDir, 'node_modules');
const installFlagFile = path.join(appDir, 'install_flag.txt');
const logFile = path.join(appDir, 'install.log');

if (fs.existsSync(installFlagFile)) {
  fs.writeFileSync(logFile, `=== Startup NPM Install at ${new Date().toISOString()} ===\n`, 'utf-8');
  try {
    if (fs.existsSync(nodeModulesDir)) {
      fs.appendFileSync(logFile, 'Deleting existing node_modules...\n', 'utf-8');
      fs.rmSync(nodeModulesDir, { recursive: true, force: true });
      fs.appendFileSync(logFile, 'Deleted existing node_modules successfully.\n', 'utf-8');
    }
    
    fs.appendFileSync(logFile, 'Running npm install --production...\n', 'utf-8');
    const output = execSync('npm install --production', { cwd: appDir, encoding: 'utf-8' });
    fs.appendFileSync(logFile, `npm install output:\n${output}\n`, 'utf-8');
    fs.appendFileSync(logFile, 'NPM install completed successfully!\n', 'utf-8');
    
    // Remove the flag so we don't repeat on next restart
    fs.unlinkSync(installFlagFile);
  } catch (err) {
    fs.appendFileSync(logFile, `ERROR during npm install: ${err.message}\n${err.stack}\n`, 'utf-8');
  }
}

// Load the actual server
require('./server.js');
