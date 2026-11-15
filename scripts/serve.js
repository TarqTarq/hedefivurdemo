// Geliştirme sunucusu: www/ klasörünü sunar ve tarayıcıya HİÇBİR ŞEYİ önbelleğe almamasını söyler.
// (python -m http.server önbellek başlığı göndermiyordu; tarayıcı eski index.html'i kullanıp yeni metinleri göstermiyordu.)
//   npm run serve            → http://localhost:8000 (telefondan: http://<Mac'in IP'si>:8000)
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '../www');
const PORT = +process.env.PORT || 8000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Bulunamadı: ' + p); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
}).listen(PORT, () => {
  const ips = Object.values(os.networkInterfaces()).flat().filter(i => i && i.family === 'IPv4' && !i.internal).map(i => i.address);
  console.log(`Hedefi Vur: http://localhost:${PORT}`);
  ips.forEach(ip => console.log(`Telefondan (aynı Wi-Fi): http://${ip}:${PORT}`));
  console.log('Durdurmak için: Ctrl+C');
});
