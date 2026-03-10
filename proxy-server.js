const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Puerto del servidor
const PORT = 3000;

// Configuración del proxy a n8n
const N8N_WEBHOOK_URL = 'https://micro-bits-n8n.aejhww.easypanel.host/webhook';

// Servidor HTTP con proxy a n8n
const server = http.createServer((req, res) => {
    // Habilitar CORS para todas las peticiones
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Proxy para peticiones al webhook de n8n
    if (req.url.startsWith('/webhook/')) {
        const webhookUrl = N8N_WEBHOOK_URL + req.url.replace('/webhook/', '/');

        // Reenviar la petición a n8n
        const options = {
            hostname: 'micro-bits-n8n.aejhww.easypanel.host',
            port: 443,
            path: '/webhook' + req.url.replace('/webhook/', '/'),
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': req.headers['content-length'] || '0'
            }
        };

        const proxyReq = https.request(options, (proxyRes) => {
            let data = '';
            proxyRes.on('data', chunk => { data += chunk; });
            proxyRes.on('end', () => {
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        });

        proxyReq.on('error', (err) => {
            console.error('Error en proxy a n8n:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error en proxy a n8n' }));
        });

        // Enviar body de la petición
        req.on('data', chunk => {
            proxyReq.write(chunk);
        });

        req.on('end', () => {
            proxyReq.end();
        });

        return;
    }

    // Servir archivos estáticos
    const parsedUrl = url.parse(req.url);
    let filePath = '.' + parsedUrl.pathname;

    // Si es un directorio, servir index.html
    if (filePath === './') {
        filePath = './index.html';
    }

    // Obtener extensión del archivo
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Agregar headers para prevenir cache en archivos JS y CSS
    const headers = {
        'Content-Type': contentType
    };

    if (extname === '.js' || extname === '.css') {
        headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, headers);
            res.end(content, 'utf-8');
        }
    });
});

const https = require('https');

server.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en:`);
    console.log(`   → http://localhost:${PORT}`);
    console.log(`   → http://192.168.0.17:${PORT}`);
    console.log(`\n📡 Proxy a n8n configurado:`);
    console.log(`   → ${N8N_WEBHOOK_URL}`);
    console.log(`\n✅ Listo para usar!\n`);
});
