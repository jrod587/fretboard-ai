const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');
const localCopilot = fs.readFileSync('local_copilot.html', 'utf8');
const landing = fs.readFileSync('landing.html', 'utf8');
const harmony = fs.readFileSync('harmony.html', 'utf8');
const countApp = fs.readFileSync('count-app/index.html', 'utf8');

const worker = `export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    let html = ${JSON.stringify(index)}; // Default to index
    
    if (path === '/local_copilot.html') html = ${JSON.stringify(localCopilot)};
    else if (path === '/landing.html') html = ${JSON.stringify(landing)};
    else if (path === '/harmony.html') html = ${JSON.stringify(harmony)};
    else if (path === '/count-app/index.html') html = ${JSON.stringify(countApp)};
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};`;
fs.writeFileSync('worker.js', worker);
console.log('worker.js generated successfully with multiple routes');
