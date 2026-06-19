const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const worker = `export default {
  async fetch(request, env, ctx) {
    return new Response(${JSON.stringify(html)}, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};`;
fs.writeFileSync('worker.js', worker);
console.log('worker.js generated successfully');
