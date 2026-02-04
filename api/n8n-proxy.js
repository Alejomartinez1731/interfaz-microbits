// Vercel Serverless Function para hacer proxy a N8N
// Esto soluciona el problema de CORS

const N8N_BASE_URL = 'https://micro-bits-n8n.aejhww.easypanel.host/webhook';

export default async function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Obtener la ruta del endpoint de N8N
        const path = req.url.replace('/api/n8n', '');
        const n8nUrl = N8N_BASE_URL + path;

        console.log('Proxying to:', n8nUrl);

        // Hacer la petición a N8N
        const response = await fetch(n8nUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
        });

        // Obtener la respuesta
        const data = await response.json();

        // Enviar la respuesta al cliente
        res.status(response.status).json(data);

    } catch (error) {
        console.error('Error en proxy:', error);
        res.status(500).json({
            error: 'Error al conectar con N8N',
            details: error.message
        });
    }
}
