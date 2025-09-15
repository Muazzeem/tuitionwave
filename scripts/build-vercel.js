#!/usr/bin/env node

import { spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(spawn);

async function runCommand(command, args, env = {}) {
  console.log(`Running: ${command} ${args.join(' ')}`);
  
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...env }
  });

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function build() {
  try {
    console.log('🏗️  Building client...');
    await runCommand('npx', ['vite', 'build'], { VITE_SSR: 'false' });
    
    console.log('🔧 Building server...');
    await runCommand('npx', ['vite', 'build'], { VITE_SSR: 'true' });
    
    console.log('✅ Build complete!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();