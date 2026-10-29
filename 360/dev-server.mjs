import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const args = process.argv.slice(2), option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const host = option('--host', '127.0.0.1'), port = Number(option('--port', '18791'));
const types = { '.html':'text/html; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.wav':'audio/wav', '.json':'application/json', '.png':'image/png' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost'), pathname = decodeURIComponent(url.pathname);
    const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(resolve(root) + sep)) { res.writeHead(403); res.end(); return; }
    const data = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-store' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, host, () => process.stdout.write(`Study 1 cue test bed: http://${host}:${port}/\n`)).on('error', error => { process.stderr.write(error.message + '\n'); process.exit(1); });
