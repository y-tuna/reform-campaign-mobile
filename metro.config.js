const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

// Check if running in monorepo context
const workspaceRoot = path.resolve(projectRoot, '../..');
const isMonorepo = require('fs').existsSync(path.join(workspaceRoot, 'package.json'));

const config = getDefaultConfig(projectRoot);

if (isMonorepo) {
  // Monorepo configuration
  config.watchFolders = [workspaceRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];
}

module.exports = config;
