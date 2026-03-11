// Serverless Function para Vercel - Proxy a N8N
// Reescribe /webhook/* a /api/webhook/* y extrae el endpoint del path

export default async function handler(req, res) {
    // URL base de n8n
    const N8N_WEBHOOK_URL = 'https://micro-bits-n8n.aejhww.easypanel.host/webhook';

    // Habilitar CORS para todas las respuestas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Obtener la ruta completa de la URL
        let fullPath = req.url;

        console.log('📡 [Vercel Proxy] Original URL:', fullPath);

        // Remover prefijo /api/webhook o /webhook
        let endpoint = fullPath;
        if (endpoint.startsWith('/api/webhook')) {
            endpoint = endpoint.replace('/api/webhook', '');
        } else if (endpoint.startsWith('/webhook')) {
            endpoint = endpoint.replace('/webhook', '');
        }

        // Asegurar que el endpoint comienza con /
        if (!endpoint.startsWith('/')) {
            endpoint = '/' + endpoint;
        }

        // Separar el endpoint de los query params
        const [pathOnly, queryString] = endpoint.split('?');

        // Construir URL completa para n8n
        let fullUrl = N8N_WEBHOOK_URL + pathOnly;

        // Agregar query params si existen
        if (queryString) {
            fullUrl += '?' + queryString;
        }

        console.log('📡 [Vercel Proxy] Request:', {
            method: req.method,
            path: pathOnly,
            query: queryString,
            finalUrl: fullUrl
        });

        // Configurar opciones de fetch
        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Agregar body si es POST/PUT
        if (req.method === 'POST' || req.method === 'PUT') {
            options.body = JSON.stringify(req.body);
        }

        // Hacer petición a n8n
        const response = await fetch(fullUrl, options);

        // Obtener respuesta como texto primero para debug
        const text = await response.text();
        console.log('📡 [Vercel Proxy] Response:', {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type')
        });

        // Intentar parsear como JSON
        let data;
        try {
            data = JSON.parse(text);
            console.log('✅ [Vercel Proxy] JSON parsed successfully');
        } catch (e) {
            // Si no es JSON, devolver el texto tal cual
            console.log('⚠️ [Vercel Proxy] Not JSON, returning text:', text.substring(0, 100));
            data = text || { success: true };
        }

        // Devolver respuesta con CORS
        res.status(response.status).json(data);

    } catch (error) {
        console.error('❌ [Vercel Proxy] Error:', error);
        res.status(500).json({
            error: 'Error en proxy a n8n',
            message: error.message,
            stack: error.stack
        });
    }
}
