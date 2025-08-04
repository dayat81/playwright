#!/usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');

console.log('🚀 Sprinto 3D Visualization Launcher');
console.log('====================================');

// Check essential files
const essentialFiles = [
    'sprinto-3d-graph-standalone.html',
    'three.min.js',
    'sprinto-graph-data.json',
    'simple-hot-reload-server.js'
];

console.log('🔍 Checking essential files...');
const missing = essentialFiles.filter(file => !fs.existsSync(file));

if (missing.length > 0) {
    console.log('❌ Missing files:');
    missing.forEach(file => console.log(`   - ${file}`));
    console.log('\n📋 To get missing files:');
    console.log('   git checkout HEAD -- ' + missing.join(' '));
    process.exit(1);
}

console.log('✅ All essential files present');

// Start server
console.log('\n🌐 Starting 3D visualization server...');
const server = spawn('node', ['simple-hot-reload-server.js'], { 
    stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    server.kill('SIGTERM');
    process.exit(0);
});

server.on('close', (code) => {
    console.log(`\n🔒 Server stopped with code ${code}`);
    process.exit(code);
});

// Show instructions after brief delay
setTimeout(() => {
    console.log('\n🎯 Open your browser to: http://localhost:8080');
    console.log('⏹️  Press Ctrl+C to stop the server');
}, 2000);