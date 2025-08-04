const fs = require('fs');

console.log('📊 Preparing data for 3D graph visualization...');

// Load the final controls data
const finalData = JSON.parse(fs.readFileSync('sprinto-all-controls-detailed-final.json', 'utf8'));
const controls = finalData.controls;

console.log(`📋 Processing ${controls.length} controls...`);

// Process and clean the data for better visualization
const processedData = {
    timestamp: new Date().toISOString(),
    metadata: {
        totalControls: controls.length,
        extractionMethod: 'URL Navigation + DOM Parsing',
        dataProcessedFor: '3D Graph Visualization'
    },
    controls: []
};

let frameworkStats = {};
let criteriaCount = 0;

controls.forEach((control, index) => {
    const processedControl = {
        id: index,
        pk: control.pk,
        displayName: control.displayName || `Control ${control.pk.slice(0, 8)}`,
        readiness: control.readiness,
        domain: control.domain || 'Compliance',
        status: control.status,
        extractedAt: control.extractedAt,
        frameworkMappings: []
    };
    
    // Process framework mappings
    if (control.frameworkMappings && Array.isArray(control.frameworkMappings)) {
        control.frameworkMappings.forEach(mapping => {
            const frameworkName = mapping.framework?.name || mapping.framework?.displayName;
            if (frameworkName) {
                // Update framework stats
                if (!frameworkStats[frameworkName]) {
                    frameworkStats[frameworkName] = {
                        name: frameworkName,
                        controlCount: 0,
                        criteriaCount: 0,
                        references: new Set()
                    };
                }
                frameworkStats[frameworkName].controlCount++;
                
                // Process references (criteria)
                let references = [];
                if (mapping.references) {
                    if (Array.isArray(mapping.references)) {
                        references = mapping.references;
                    } else if (typeof mapping.references === 'string') {
                        // Split by | or comma
                        references = mapping.references.split(/\s*\|\s*|\s*,\s*/).filter(r => r.trim());
                    }
                }
                
                references.forEach(ref => {
                    frameworkStats[frameworkName].references.add(ref.trim());
                });
                
                processedControl.frameworkMappings.push({
                    framework: {
                        name: frameworkName,
                        displayName: frameworkName
                    },
                    references: references,
                    hasEditButton: mapping.hasEditButton || false
                });
                
                criteriaCount += references.length;
            }
        });
    }
    
    processedData.controls.push(processedControl);
});

// Convert Set to Array for framework references
Object.values(frameworkStats).forEach(framework => {
    framework.references = Array.from(framework.references);
    framework.criteriaCount = framework.references.length;
});

// Add summary statistics
processedData.summary = {
    totalControls: processedData.controls.length,
    totalFrameworks: Object.keys(frameworkStats).length,
    totalCriteria: criteriaCount,
    totalUniqueCriteria: Object.values(frameworkStats).reduce((sum, fw) => sum + fw.criteriaCount, 0),
    controlsWithFrameworks: processedData.controls.filter(c => c.frameworkMappings.length > 0).length,
    controlsWithReadiness: processedData.controls.filter(c => c.readiness !== undefined).length,
    readyControls: processedData.controls.filter(c => c.readiness === 100).length,
    averageFrameworksPerControl: (processedData.controls.reduce((sum, c) => sum + c.frameworkMappings.length, 0) / processedData.controls.length).toFixed(2)
};

processedData.frameworks = frameworkStats;

// Save the processed data
fs.writeFileSync('sprinto-graph-data.json', JSON.stringify(processedData, null, 2));

console.log('\n✅ Data processing complete!');
console.log('=====================================');
console.log(`📊 Summary Statistics:`);
console.log(`   Total Controls: ${processedData.summary.totalControls}`);
console.log(`   Total Frameworks: ${processedData.summary.totalFrameworks}`);
console.log(`   Total Criteria Mappings: ${processedData.summary.totalCriteria}`);
console.log(`   Unique Criteria: ${processedData.summary.totalUniqueCriteria}`);
console.log(`   Controls with Frameworks: ${processedData.summary.controlsWithFrameworks}`);
console.log(`   Ready Controls: ${processedData.summary.readyControls}`);
console.log(`   Avg Frameworks per Control: ${processedData.summary.averageFrameworksPerControl}`);

console.log(`\n🏗️ Framework Breakdown:`);
Object.entries(frameworkStats).forEach(([name, stats]) => {
    console.log(`   ${name}: ${stats.controlCount} controls, ${stats.criteriaCount} criteria`);
});

console.log(`\n📁 Files Generated:`);
console.log(`   - sprinto-graph-data.json (optimized for 3D visualization)`);

// Create a sample of high-value connections for demonstration
const sampleConnections = processedData.controls
    .filter(c => c.frameworkMappings.length >= 3)
    .slice(0, 10)
    .map(c => ({
        controlName: c.displayName,
        frameworks: c.frameworkMappings.map(fm => fm.framework.name),
        totalCriteria: c.frameworkMappings.reduce((sum, fm) => sum + fm.references.length, 0)
    }));

console.log(`\n🌐 Sample High-Connection Controls:`);
sampleConnections.forEach((conn, i) => {
    console.log(`   ${i + 1}. ${conn.controlName}`);
    console.log(`      Frameworks: ${conn.frameworks.join(', ')}`);
    console.log(`      Total Criteria: ${conn.totalCriteria}`);
});

console.log(`\n🎮 3D Visualization ready!`);
console.log(`   Open 'sprinto-3d-graph.html' in a web browser to view the interactive graph.`);
console.log(`   Make sure both files are in the same directory.`);