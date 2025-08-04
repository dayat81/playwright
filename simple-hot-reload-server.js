const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

console.log('🔥 Simple Hot Reload Development Server');
console.log('=======================================');

// Store SSE connections
const sseClients = new Set();
let fileWatchTimestamp = Date.now();

// Function to broadcast reload to all clients
function broadcastReload() {
    const message = `data: reload\nid: ${Date.now()}\n\n`;
    sseClients.forEach(res => {
        try {
            res.write(message);
        } catch (e) {
            sseClients.delete(res);
        }
    });
    console.log('🔄 Broadcasted reload to', sseClients.size, 'clients');
}

// Watch files for changes
const watchedFiles = [
    'sprinto-3d-graph-standalone.html',
    'sprinto-graph-data.json',
    'three.min.js'
];

watchedFiles.forEach(file => {
    if (fs.existsSync(file)) {
        fs.watchFile(file, { interval: 1000 }, (curr, prev) => {
            if (curr.mtime > prev.mtime) {
                console.log(`📝 File changed: ${file}`);
                setTimeout(broadcastReload, 100); // Small delay to ensure file write is complete
            }
        });
        console.log(`👀 Watching: ${file}`);
    }
});

// Enhanced HTML with hot reload and debugging
const createDebugHTML = () => {
    let originalHTML = '';
    
    if (fs.existsSync('sprinto-3d-graph-standalone.html')) {
        originalHTML = fs.readFileSync('sprinto-3d-graph-standalone.html', 'utf8');
    } else {
        originalHTML = `
<!DOCTYPE html>
<html><head><title>Debug</title></head>
<body>
    <h1>🚨 Original file not found</h1>
    <p>sprinto-3d-graph-standalone.html is missing</p>
</body></html>`;
    }
    
    // Inject hot reload client and debugging
    const hotReloadScript = `
    <script>
        console.log('🔥 Hot reload system active');
        
        // Server-Sent Events for hot reload
        const eventSource = new EventSource('/sse');
        eventSource.onmessage = function(event) {
            if (event.data === 'reload') {
                console.log('🔄 Hot reload triggered');
                window.location.reload();
            }
        };
        eventSource.onerror = function(error) {
            console.log('❌ Hot reload connection error:', error);
        };
        
        // Enhanced debugging with visual feedback
        window.addEventListener('load', function() {
            console.log('🎬 Page loaded - Enhanced debugging active');
            
            // Create floating debug panel
            const debugPanel = document.createElement('div');
            debugPanel.id = 'debug-panel';
            debugPanel.style.cssText = \`
                position: fixed;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #2d1b69 0%, #11998e 100%);
                color: white;
                padding: 15px;
                border-radius: 12px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                max-width: 320px;
                max-height: 400px;
                overflow-y: auto;
                z-index: 999999;
                border: 2px solid #00ff88;
                box-shadow: 0 4px 20px rgba(0,255,136,0.3);
                backdrop-filter: blur(10px);
            \`;
            
            debugPanel.innerHTML = \`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin:0; color:#00ff88; font-size: 13px;">🔍 Debug Console</h4>
                    <button onclick="toggleDebug()" style="background: #ff4757; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">Hide</button>
                </div>
                <div id="debug-log" style="font-size: 10px; line-height: 1.3;">Starting diagnostics...</div>
                <div style="margin-top: 10px;">
                    <button onclick="clearDebug()" style="background: #3742fa; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; margin-right: 5px;">Clear</button>
                    <button onclick="forceReload()" style="background: #2ed573; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">Reload</button>
                </div>
            \`;
            document.body.appendChild(debugPanel);
            
            let debugVisible = true;
            window.toggleDebug = function() {
                debugVisible = !debugVisible;
                const log = document.getElementById('debug-log');
                log.style.display = debugVisible ? 'block' : 'none';
                debugPanel.querySelector('button').textContent = debugVisible ? 'Hide' : 'Show';
            };
            
            window.debugLog = function(message, color = '#ffffff') {
                const log = document.getElementById('debug-log');
                const timestamp = new Date().toLocaleTimeString();
                log.innerHTML += \`<div style="color:\${color}; margin: 2px 0;"><span style="color:#888; font-size: 9px;">\${timestamp}</span> \${message}</div>\`;
                log.scrollTop = log.scrollHeight;
                console.log('🐛', message);
            };
            
            window.clearDebug = function() {
                document.getElementById('debug-log').innerHTML = '<div style="color:#888;">Debug cleared...</div>';
            };
            
            window.forceReload = function() {
                debugLog('🔄 Force reload triggered', '#ffa502');
                window.location.reload();
            };
            
            // Step 1: Check DOM
            debugLog('✅ DOM loaded and debug panel active', '#2ed573');
            
            // Step 2: Check THREE.js with detailed info
            debugLog('🔍 Checking THREE.js library...', '#3742fa');
            
            if (typeof THREE === 'undefined') {
                debugLog('❌ THREE.js NOT LOADED', '#ff4757');
                debugLog('🔗 Expected path: ./three.min.js', '#ff6b6b');
                debugLog('💡 Check network tab for 404 errors', '#ffa502');
                
                // Try to detect the actual error
                const script = document.querySelector('script[src*="three"]');
                if (script) {
                    debugLog('📜 Found script tag: ' + script.src, '#70a1ff');
                    script.onerror = function() {
                        debugLog('❌ Script failed to load: ' + script.src, '#ff4757');
                    };
                } else {
                    debugLog('❌ No THREE.js script tag found', '#ff4757');
                }
            } else {
                debugLog('✅ THREE.js loaded successfully', '#2ed573');
                debugLog('📦 Version: ' + (THREE.REVISION || 'unknown'), '#70a1ff');
                debugLog('🎯 Available classes: Scene, Camera, Renderer', '#5352ed');
            }
            
            // Step 3: Test WebGL support
            debugLog('🔍 Testing WebGL support...', '#3742fa');
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    debugLog('✅ WebGL is supported', '#2ed573');
                    debugLog('🎮 Renderer: ' + gl.getParameter(gl.RENDERER), '#70a1ff');
                } else {
                    debugLog('❌ WebGL not supported', '#ff4757');
                }
            } catch (e) {
                debugLog('❌ WebGL test failed: ' + e.message, '#ff4757');
            }
            
            // Step 4: Test data loading with detailed feedback
            debugLog('🔍 Testing data fetch...', '#3742fa');
            const startTime = Date.now();
            
            fetch('./sprinto-graph-data.json')
                .then(response => {
                    const loadTime = Date.now() - startTime;
                    debugLog(\`📡 Response: \${response.status} (\${loadTime}ms)\`, response.ok ? '#2ed573' : '#ff4757');
                    
                    if (!response.ok) {
                        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                    }
                    return response.json();
                })
                .then(data => {
                    debugLog('✅ JSON parsed successfully', '#2ed573');
                    debugLog(\`📊 Controls: \${data.controls?.length || 0}\`, '#70a1ff');
                    debugLog(\`🏗️ Frameworks: \${data.frameworks ? Object.keys(data.frameworks).length : 0}\`, '#70a1ff');
                    debugLog(\`📈 Summary present: \${data.summary ? 'Yes' : 'No'}\`, '#70a1ff');
                    
                    // Test a sample control
                    if (data.controls && data.controls[0]) {
                        const sample = data.controls[0];
                        debugLog(\`🎯 Sample control: \${sample.displayName || sample.pk || 'unnamed'}\`, '#5352ed');
                    }
                })
                .catch(error => {
                    debugLog('❌ Data fetch failed: ' + error.message, '#ff4757');
                    debugLog('💡 Check: server running, file exists, JSON valid', '#ffa502');
                });
            
            // Step 5: Monitor initialization
            let initStartTime = Date.now();
            let initStepsCompleted = 0;
            const maxInitTime = 10000; // 10 seconds
            
            // Watch for the loading element to disappear
            const checkLoadingStatus = () => {
                const loading = document.getElementById('loading');
                if (!loading) {
                    debugLog('❌ Loading element not found in DOM', '#ff4757');
                    return;
                }
                
                const isVisible = loading.style.display !== 'none' && 
                                loading.offsetParent !== null;
                                
                if (isVisible) {
                    const elapsed = Date.now() - initStartTime;
                    if (elapsed > maxInitTime) {
                        debugLog('🚨 LOADING STUCK! Still visible after ' + (elapsed/1000).toFixed(1) + 's', '#ff4757');
                        debugLog('💡 This is the root cause of your issue', '#ffa502');
                        debugLog('🔧 Check init() function - it may be failing silently', '#ffa502');
                        
                        // Try to get more info about what's happening
                        debugLog('🔍 Checking for JavaScript errors...', '#3742fa');
                        return; // Stop checking
                    } else {
                        debugLog(\`⏳ Loading still visible (\${(elapsed/1000).toFixed(1)}s)\`, '#70a1ff');
                    }
                } else {
                    debugLog('✅ Loading element hidden - initialization completed!', '#2ed573');
                    return; // Stop checking
                }
                
                // Continue checking
                setTimeout(checkLoadingStatus, 1000);
            };
            
            // Start monitoring after a brief delay
            setTimeout(checkLoadingStatus, 2000);
            
            // Override console methods to capture all output
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalLog = console.log;
            
            console.error = function(...args) {
                debugLog('🚨 ERROR: ' + args.join(' '), '#ff4757');
                originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
                debugLog('⚠️ WARN: ' + args.join(' '), '#ffa502');
                originalWarn.apply(console, args);
            };
            
            // Capture unhandled errors
            window.addEventListener('error', function(e) {
                debugLog('🚨 UNHANDLED ERROR: ' + e.message, '#ff4757');
                debugLog('📍 File: ' + e.filename + ':' + e.lineno, '#ff6b6b');
            });
            
            window.addEventListener('unhandledrejection', function(e) {
                debugLog('🚨 UNHANDLED PROMISE REJECTION: ' + e.reason, '#ff4757');
            });
            
            debugLog('🎬 Debug system fully initialized', '#2ed573');
        });
    </script>
    `;
    
    // Insert hot reload script before closing </body>
    return originalHTML.replace('</body>', hotReloadScript + '</body>');
};

// HTTP Server
const server = http.createServer((req, res) => {
    const url = req.url;
    
    // Handle Server-Sent Events for hot reload
    if (url === '/sse') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.write('data: connected\nid: ' + Date.now() + '\n\n');
        sseClients.add(res);
        
        req.on('close', () => {
            sseClients.delete(res);
        });
        
        return;
    }
    
    let filePath = url === '/' ? '/sprinto-3d-graph-standalone.html' : url;
    filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    
    console.log('📡 ' + req.method + ' ' + url + ' -> ' + filePath);
    
    // Special handling for main HTML file - inject hot reload
    if (filePath === 'sprinto-3d-graph-standalone.html') {
        try {
            const enhancedHTML = createDebugHTML();
            res.writeHead(200, { 
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(enhancedHTML);
            console.log('✅ Served enhanced HTML with hot reload and debugging');
            return;
        } catch (error) {
            console.log('❌ Error creating enhanced HTML: ' + error.message);
        }
    }
    
    // Serve other files normally
    if (!fs.existsSync(filePath)) {
        console.log('❌ File not found: ' + filePath);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found: ' + filePath);
        return;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.css': 'text/css'
    };
    
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        res.end(content);
        console.log('✅ Served: ' + filePath + ' (' + content.length + ' bytes)');
    } catch (error) {
        console.log('❌ Error reading ' + filePath + ': ' + error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error: ' + error.message);
    }
});

server.listen(PORT, () => {
    console.log('🌐 Server running at: http://localhost:' + PORT);
    console.log('');
    console.log('🔥 Hot Reload Features:');
    console.log('   • Automatic refresh on file changes');
    console.log('   • Real-time debug panel (top-right corner)');
    console.log('   • Enhanced error capture and display');
    console.log('   • Step-by-step loading diagnostics');
    console.log('   • WebGL and THREE.js validation');
    console.log('');
    console.log('🎯 What the debug panel shows:');
    console.log('   • THREE.js loading status');
    console.log('   • Data fetching results');
    console.log('   • WebGL support check');
    console.log('   • Loading spinner status monitoring');
    console.log('   • All JavaScript errors in real-time');
    console.log('');
    console.log('🔧 If loading keeps spinning:');
    console.log('   • Check debug panel for red error messages');
    console.log('   • Look for "LOADING STUCK!" message');
    console.log('   • Check browser console (F12) for additional errors');
    console.log('');
    console.log('⏹️  Press Ctrl+C to stop');
});

process.on('SIGINT', () => {
    console.log('\\n🛑 Shutting down hot reload server...');
    
    // Clean up file watchers
    watchedFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unwatchFile(file);
        }
    });
    
    // Close all SSE connections
    sseClients.forEach(res => {
        try {
            res.end();
        } catch (e) {}
    });
    
    server.close(() => {
        console.log('✅ Hot reload server stopped');
        process.exit(0);
    });
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('❌ Port ' + PORT + ' is already in use');
        console.log('💡 Stop other servers first or use a different port');
    } else {
        console.log('❌ Server error: ' + err.message);
    }
    process.exit(1);
});