import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;
const ROOT = new URL('.', import.meta.url).pathname;

const htmlPath = path.join(ROOT, 'public.html');
const faviconPath = path.join(ROOT, 'favicon.ico');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  const reply = (statusCode, headers, body) => {
    res.writeHead(statusCode, headers);
    res.end(body);
  };

  if (url === '/') {
    if (method !== 'GET') {
      reply(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET' }, '405 Method Not Allowed');
      return;
    }
    fs.readFile(htmlPath, 'utf8', (err, data) => {
      if (err) {
        reply(500, { 'Content-Type': 'text/plain; charset=utf-8' }, '500 Internal Server Error');
        return;
      }
      reply(200, { 'Content-Type': 'text/html; charset=utf-8' }, data);
    });
    return;
  }

  if (url === '/favicon.ico') {
    if (method !== 'GET') {
      reply(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET' }, '405 Method Not Allowed');
      return;
    }
    fs.readFile(faviconPath, (err, data) => {
      if (err) {
        reply(404, { 'Content-Type': 'text/plain; charset=utf-8' }, '404 Not Found');
        return;
      }
      reply(200, { 'Content-Type': 'image/vnd.microsoft.icon' }, data);
    });
    return;
  }

  reply(404, { 'Content-Type': 'text/plain; charset=utf-8' }, '404 Not Found');
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
