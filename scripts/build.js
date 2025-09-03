#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building for production with SSR...');

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

// Build client
console.log('Building client...');
execSync('vite build', { stdio: 'inherit' });

// Build server
console.log('Building server...');
execSync('VITE_SSR=true vite build', { stdio: 'inherit' });

console.log('Build completed!');
console.log('To start the production server, run: node server.js');