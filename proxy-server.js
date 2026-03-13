// Servidor Proxy Local para N8N
// Redirige peticiones de /webhook a N8N para desarrollo local

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuración de N8N
const N8N_BASE_URL = 'https://micro-bits-n8n.aejhww.easypanel.host/webhook';

// MIME types para archivos estáticos
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Manejar peticiones a /webhook (proxy a N8N)
    if (req.url.startsWith('/webhook')) {
        handleProxy(req, res);
        return;
    }

    // Servir archivos estáticos
    serveStatic(req, res);
});

function serveStatic(req, res) {
    // Parsear la URL para eliminar query parameters (ej: ?v=29)
    const parsedUrl = url.parse(req.url);
    let filePath = '.' + parsedUrl.pathname;

    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                console.log(`❌ Archivo no encontrado: ${filePath}`);
                res.writeHead(404);
                res.end('File not found: ' + filePath);
            } else {
                console.log(`❌ Error leyendo archivo: ${error.code}`);
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            console.log(`📄 Sirviendo: ${filePath} (${contentType})`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

function handleProxy(req, res) {
    // Construir URL de N8N
    const parsedUrl = url.parse(req.url);
    // Extraer solo el path (sin /webhook) y los query params ya están en parsedUrl.search
    const targetPath = parsedUrl.path.replace('/webhook', '');
    const n8nUrl = N8N_BASE_URL + targetPath;

    console.log(`🔍 Proxy: ${req.method} ${req.url} -> ${n8nUrl}`);

    // Hacer petición a N8N
    const options = {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const proxyReq = https.request(n8nUrl, options, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            console.log(`✅ Proxy: ${proxyRes.statusCode} - ${data.length} bytes`);
            res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    });

    proxyReq.on('error', (err) => {
        console.error('❌ Proxy error:', err.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
    });

    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            proxyReq.write(body);
            proxyReq.end();
        });
    } else {
        proxyReq.end();
    }
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Servidor Proxy Local corriendo en:`);
    console.log(`   📱 http://localhost:${PORT}`);
    console.log(`   📱 http://127.0.0.1:${PORT}`);
    console.log(`\n🔗 Redirigiendo /webhook a:`);
    console.log(`   ${N8N_BASE_URL}`);
    console.log(`\n⚠️  Presiona Ctrl+C para detener\n`);
});
