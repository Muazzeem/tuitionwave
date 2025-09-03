#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('Starting development server with SSR...');
execSync('node server.js', { stdio: 'inherit' });