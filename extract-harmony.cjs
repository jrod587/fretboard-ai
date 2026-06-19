const fs = require('fs');

const html = fs.readFileSync('harmony.old.html', 'utf8');

// Extract React Code
const scriptMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  let script = scriptMatch[1].trim();
  // Clean up
  script = script.replace(/const\s+\{\s*useState,\s*useEffect\s*\}\s*=\s*React;/, '');
  script = script.replace(/ReactDOM\.createRoot[\s\S]*$/, 'export default App;');
  
  script = `import React, { useState, useEffect } from 'react';\nimport { Link } from 'react-router-dom';\nimport '../index.css';\n\n` + script;
  
  // replace links
  script = script.replace(/<a href=\"\/\"/g, '<Link to="/"');
  script = script.replace(/<a href=\"\/count-app\/index\.html\"/g, '<Link to="/pulse"');
  script = script.replace(/<\/a>/g, (match, offset, str) => {
    return str.lastIndexOf('<Link', offset) > str.lastIndexOf('<a', offset) ? '</Link>' : '</a>';
  });

  fs.writeFileSync('src/pages/Harmony.jsx', script);
}

// Extract specific styles (not the base ones)
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const styles = styleMatch[1];
  // grab everything after .right-panel
  const specificStylesMatch = styles.match(/\.slice[\s\S]*$/);
  if (specificStylesMatch) {
    fs.appendFileSync('src/index.css', '\n/* Harmony Styles */\n' + specificStylesMatch[0]);
  }
}
console.log("Harmony extracted.");
