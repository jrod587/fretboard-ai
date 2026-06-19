const fs = require('fs');
const html = fs.readFileSync('fretboard.old.html', 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync('src/index.css', styleMatch[1].trim());
}

const scriptMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  let script = scriptMatch[1].trim();
  // replace ReactDOM.createRoot... with export default GuitarApp
  script = script.replace(/ReactDOM\.createRoot[\s\S]*$/, 'export default GuitarApp;');
  // replace const {useState}=React; with import { useState } from 'react';
  script = `import React, { useState } from 'react';\nimport './index.css';\n\n` + script.replace(/const\s+\{\s*useState\s*\}\s*=\s*React;/, '');
  fs.writeFileSync('src/App.jsx', script);
}
console.log('Extraction complete');
