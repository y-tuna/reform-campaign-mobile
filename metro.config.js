const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;                     // apps/mobile
const workspaceRoot = path.resolve(projectRoot, '../..'); // campaign-monorepo

const config = getDefaultConfig(projectRoot);

// 모노레포 루트를 watch
config.watchFolders = [workspaceRoot];

// 의존성 탐색 경로를 mobile, 루트 순으로 지정
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
