# Sprinto Controls 3D Visualization

An interactive Three.js-based 3D graph visualization showing the relationships between Sprinto controls, compliance frameworks, and criteria.

## 🎯 Overview

This visualization displays all 212 extracted Sprinto controls and their relationships with 7 compliance frameworks (ISO 27001:2013, ISO27001:2022, SOC 2 Security, NIST CSF v2.0, etc.) in an interactive 3D space.

## 🚀 Quick Start

### 1. Ensure Data Files Exist
```bash
# Make sure you have the extracted data
ls -la sprinto-all-controls-detailed-final.json

# Generate the processed graph data
node prepare-graph-data.js
```

### 2. Start the Local Server
```bash
# Start the HTTP server
node serve-visualization.js
```

### 3. Open the Visualization
Open your web browser and navigate to:
```
http://localhost:8080
```

## 🎮 Interactive Features

### Navigation
- **Mouse Drag**: Rotate the 3D scene
- **Mouse Wheel**: Zoom in/out
- **Hover**: Highlight nodes and show details

### Controls Panel
- **⏸️ Pause Rotation**: Stop/start automatic scene rotation
- **📷 Reset View**: Return camera to default position
- **🔗 Hide/Show Connections**: Toggle relationship lines
- **🏷️ Hide/Show Labels**: Toggle node labels
- **🏗️ Filter Framework**: Filter by specific framework (future feature)

### Node Information Panel
- Hover over any node to see detailed information
- **Controls**: Shows name, PK, readiness %, framework count
- **Frameworks**: Shows name, control count, criteria count
- **Criteria**: Shows criteria name, framework, associated controls

## 🎨 Visual Legend

### Node Types and Colors
- 🔴 **Red Spheres**: Regular Controls (3px radius)
- 🟠 **Orange Spheres**: Ready Controls (100% readiness, 4px radius)  
- 🔵 **Cyan Spheres**: Frameworks (8px radius, with glow effect)
- 🔵 **Blue Spheres**: Criteria (2px radius)

### Connection Lines
- **Gray Lines**: Control ↔ Framework relationships
- **Light Gray Lines**: Control ↔ Criteria relationships  
- **White Lines**: Framework ↔ Criteria relationships

## 📊 Data Statistics

Based on the processed dataset:

- **Total Nodes**: ~550+ (212 controls + 7 frameworks + 336 criteria)
- **Total Connections**: ~500+ relationship lines
- **Framework Coverage**: 91.5% of controls have framework mappings
- **Ready Controls**: 52 controls (24.5%) at 100% readiness
- **Average Mappings**: 2.32 frameworks per control

## 🏗️ Framework Distribution

1. **NIST CSF v2.0**: 184 controls (37.4% of mappings)
2. **ISO27001:2022**: 88 controls (17.9% of mappings)
3. **ISO 27001:2013**: 84 controls (17.1% of mappings)  
4. **SOC 2 Security**: 76 controls (15.4% of mappings)
5. **NIST CSF**: 46 controls (9.3% of mappings)
6. **SOC 2 Availability**: 6 controls
7. **SOC 2 Confidentiality**: 8 controls

## 🎯 Key Insights from Visualization

### High-Value Controls (Multi-Framework)
Controls connected to 4+ frameworks represent high-value compliance points:
- **SDC 27**: Management Review of Risks (5 frameworks)
- **SDC 53**: Incident Management Policy & Procedure (5 frameworks)
- **SDC 1**: Code of Business Conduct (5 frameworks)
- **SDC 21**: Third-Party Criticality Assessments (5 frameworks)

### Framework Clusters
The 3D layout shows natural clustering:
- **Core Security**: ISO 27001 variants cluster together
- **Operational**: SOC 2 frameworks form tight groups
- **Strategic**: NIST CSF frameworks span broader areas

### Compliance Density
Areas with dense node connections indicate:
- Critical compliance intersection points
- High-priority controls for multiple frameworks
- Potential optimization opportunities

## 🛠️ Technical Architecture

### Files Structure
```
sprinto-3d-graph.html              # Main visualization HTML
sprinto-graph-data.json            # Processed data for visualization
serve-visualization.js             # Local HTTP server
prepare-graph-data.js              # Data processing script
sprinto-all-controls-detailed-final.json  # Raw extracted data
```

### Technologies Used
- **Three.js**: 3D rendering and scene management
- **WebGL**: Hardware-accelerated graphics
- **OrbitControls**: Camera navigation
- **Raycaster**: Mouse interaction detection
- **Node.js**: Local development server

### 3D Layout Algorithm
1. **Framework Positioning**: Circular arrangement around origin
2. **Control Clustering**: Positioned near related frameworks
3. **Criteria Placement**: Satellite positioning around frameworks
4. **Force Simulation**: Spreads nodes to avoid overlap
5. **Connection Lines**: Direct lines between related entities

## 🎨 Customization Options

### Color Schemes
Modify the `NODE_TYPES` object in the HTML file:
```javascript
const NODE_TYPES = {
    CONTROL: { color: 0xFF6B6B, size: 3 },        // Red
    FRAMEWORK: { color: 0x4ECDC4, size: 8 },      // Cyan
    CRITERIA: { color: 0x45B7D1, size: 2 },       // Blue
    READY_CONTROL: { color: 0xFFA07A, size: 4 }   // Orange
};
```

### Layout Parameters
Adjust positioning in the `processControlsData` function:
- `centerRadius`: Overall graph size
- `frameworkRadius`: Framework circle size
- `spread`: Node distribution randomness

### Performance Settings
- `isRotating`: Enable/disable auto-rotation
- `showConnections`: Show/hide relationship lines
- Batch rendering for large datasets

## 🔧 Troubleshooting

### Common Issues

**"File not found" error**
- Ensure `sprinto-graph-data.json` exists
- Run `node prepare-graph-data.js` to generate it

**Blank screen**
- Check browser console for JavaScript errors
- Ensure server is running on correct port
- Try refreshing the page

**Poor performance**
- Reduce connection line opacity
- Disable auto-rotation
- Use a modern browser with WebGL support

**Data not loading**
- Verify JSON file format
- Check file permissions
- Ensure server has file access

### Browser Compatibility
- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: WebGL support required
- **Edge**: Modern versions supported

## 📈 Future Enhancements

### Planned Features
- **Framework Filtering**: Show/hide specific frameworks
- **Control Search**: Find controls by name or ID
- **Readiness Heatmap**: Color-code by readiness percentage
- **Criteria Grouping**: Cluster related criteria
- **Export Options**: Save as image or 3D model

### Advanced Analytics
- **Compliance Gaps**: Highlight missing framework coverage
- **Risk Scoring**: Size nodes by risk/importance
- **Timeline View**: Show control evolution over time
- **Dependency Mapping**: Identify control dependencies

## 📝 Usage Examples

### Compliance Assessment
1. Filter by specific framework (e.g., ISO 27001:2013)
2. Identify controls lacking in that framework
3. Review criteria mappings for completeness

### Risk Analysis  
1. Focus on high-connection controls
2. Assess readiness levels across frameworks
3. Identify critical control gaps

### Audit Preparation
1. Group controls by framework requirements
2. Verify criteria coverage
3. Plan evidence collection priorities

## 🔗 Related Files

- `SPRINTO_EXTRACTION_SUMMARY.md`: Overall project summary
- `sprinto-controls-comprehensive-analytics.json`: Detailed analytics
- `sprinto-all-controls-detailed-progress.json`: Extraction progress
- Various extraction scripts: `extract-*.js`

---

**🎉 Interactive 3D visualization of 212 Sprinto controls successfully implemented with Three.js!**

The visualization provides comprehensive insights into the complex relationships between compliance controls, frameworks, and criteria in an intuitive 3D space.