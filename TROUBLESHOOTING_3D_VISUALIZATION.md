# 🛠️ 3D Visualization Troubleshooting Guide

## Common Issues and Solutions

### 1. ❌ "Could not load sprinto-graph-data.json"

**Problem:** The visualization can't find the data file.

**Solutions:**
```bash
# Check if data file exists
ls -la sprinto-graph-data.json

# If missing, generate it:
node prepare-graph-data.js

# Check file content (should show controls data):
head -20 sprinto-graph-data.json
```

### 2. ❌ "THREE.OrbitControls is not a constructor"

**Problem:** Three.js OrbitControls not loading properly from CDN.

**Solutions:**
- ✅ **Use the fixed version:** `sprinto-3d-graph-fixed.html` (includes fallback controls)
- Check internet connection for CDN access
- The fixed version has a built-in simple orbit controls implementation

### 3. ❌ Server Connection Issues

**Problem:** Can't access http://localhost:8080

**Solutions:**
```bash
# Start the server:
node serve-visualization.js

# Check if port is in use:
lsof -i :8080

# Try different port:
# Edit serve-visualization.js and change PORT = 8081
```

### 4. ❌ Blank Screen or No Visualization

**Problem:** Page loads but no 3D graph appears.

**Solutions:**
1. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for JavaScript errors

2. **Test Data Loading:**
   ```bash
   # Open test page:
   http://localhost:8080/test-data-loading.html
   ```

3. **Browser Requirements:**
   - Use modern browser (Chrome, Firefox, Safari, Edge)
   - Enable WebGL support
   - Disable ad blockers that might block scripts

### 5. ❌ Poor Performance or Lag

**Problem:** Visualization is slow or unresponsive.

**Solutions:**
- Use the toggle buttons to hide connections/labels
- Pause auto-rotation
- Close other browser tabs
- Try a different browser

### 6. ❌ Data File Corruption

**Problem:** JSON parsing errors or invalid data.

**Solutions:**
```bash
# Validate JSON syntax:
cat sprinto-graph-data.json | python -m json.tool > /dev/null

# Regenerate data file:
rm sprinto-graph-data.json
node prepare-graph-data.js

# Check source data:
ls -la sprinto-all-controls-detailed-final.json
```

## 🧪 Testing Steps

### Step 1: Verify Files
```bash
# Check all required files exist:
ls -la sprinto-*-graph*.html
ls -la sprinto-graph-data.json
ls -la serve-visualization.js
```

### Step 2: Test Data Generation
```bash
# Regenerate data:
node prepare-graph-data.js

# Should output:
# ✅ Data processing complete!
# 📊 Summary Statistics: Total Controls: 212
```

### Step 3: Test Server
```bash
# Start server:
node serve-visualization.js

# Should show:
# 🚀 Sprinto 3D Visualization Server Started!
# 🌐 Server running at: http://localhost:8080
```

### Step 4: Test Data Loading
```bash
# Open in browser:
http://localhost:8080/test-data-loading.html

# Should show:
# ✅ Data loaded successfully!
# 📊 Data Summary: Total Controls: 212
```

### Step 5: Test Visualization
```bash
# Open main visualization:
http://localhost:8080

# Should show:
# - Loading spinner initially
# - 3D graph with colored nodes
# - Interactive controls panel
```

## 🔧 Advanced Debugging

### Enable Debug Logging
Add this to the HTML file's JavaScript section:
```javascript
// Add after the init() function call
console.log('Debug: Scene objects:', scene.children.length);
console.log('Debug: Nodes created:', nodes.length);
console.log('Debug: Connections created:', connections.length);
```

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check for failed requests (red entries)

### Memory Usage
For large datasets:
```javascript
// Check memory usage in browser console:
console.log('Memory:', performance.memory);
```

## 📱 Browser Compatibility

### ✅ Fully Supported
- **Chrome 80+**: Full WebGL support
- **Firefox 75+**: Full WebGL support  
- **Safari 13+**: WebGL support (may need enabling)
- **Edge 80+**: Full WebGL support

### ⚠️ Limited Support
- **Internet Explorer**: Not supported
- **Mobile browsers**: Limited performance
- **Old browsers**: WebGL may not be available

### Enable WebGL in Safari
1. Safari → Preferences → Advanced
2. Check "Show Develop menu"
3. Develop → Experimental Features → WebGL 2.0

## 🔄 Reset Everything

If all else fails, start fresh:

```bash
# 1. Stop any running servers
pkill -f "node serve"

# 2. Remove generated files
rm sprinto-graph-data.json
rm sprinto-*-progress.json

# 3. Regenerate data
node prepare-graph-data.js

# 4. Start fresh server
node serve-visualization.js

# 5. Clear browser cache and try again
# Ctrl+Shift+R (hard refresh)
```

## 📞 Getting Help

### Check Files Structure
```bash
# Your directory should have:
sprinto-3d-graph-fixed.html      # ✅ Fixed visualization  
sprinto-graph-data.json          # ✅ Processed data
serve-visualization.js           # ✅ Local server
prepare-graph-data.js            # ✅ Data processor
sprinto-all-controls-detailed-final.json  # ✅ Source data

# Optional files:
test-data-loading.html           # Test page
3D_VISUALIZATION_README.md       # Documentation
```

### Log Information to Share
```bash
# System info:
node --version
python --version  # If using JSON validation

# File sizes:
ls -lah sprinto-*.json
ls -lah sprinto-*.html

# Browser console errors (copy from F12 → Console)
```

## 🎯 Quick Fix Checklist

- [ ] **Data file exists:** `ls sprinto-graph-data.json`
- [ ] **Server running:** `node serve-visualization.js`
- [ ] **Correct URL:** `http://localhost:8080`
- [ ] **Use fixed version:** Loads `sprinto-3d-graph-fixed.html`
- [ ] **Modern browser:** Chrome/Firefox recommended
- [ ] **JavaScript enabled:** Check browser settings
- [ ] **WebGL available:** Check browser compatibility
- [ ] **No browser errors:** Check F12 console
- [ ] **Data validates:** Use test page
- [ ] **Files in same directory:** All files together

---

**If issues persist, the fixed HTML file (`sprinto-3d-graph-fixed.html`) includes robust error handling and fallback implementations that should work in most scenarios.**