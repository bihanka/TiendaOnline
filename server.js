const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const LOGS_FILE = path.join(__dirname, 'logs.json');

app.use(express.json());
app.use(express.static(__dirname));

// Asegurar archivo JSON con formato correcto
if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, JSON.stringify([], null, 2));
}

// Función de registro con las propiedades exactas en español de tu captura
function registrarLog(ip, usuario, evento, severidad, ruta, metodo, codigo) {
    try {
        const fileData = fs.readFileSync(LOGS_FILE, 'utf8');
        const logs = JSON.parse(fileData);
        
        const nuevoLog = {
            fecha: new Date().toISOString().replace('T', ' ').substring(0, 19), // Formato YYYY-MM-DD HH:mm:ss
            ip: ip.replace('::ffff:', '') || '127.0.0.1',
            usuario: usuario || 'desconocido',
            evento: evento,
            severidad: severidad,
            ruta: ruta,
            metodo: metodo,
            codigo: parseInt(codigo)
        };
        
        logs.push(nuevoLog);
        fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error("Error escribiendo log:", error);
    }
}

// Middleware: Detección automatizada de escaneos y ataques
app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    
    // Simulación de usuario (en producción vendría de la sesión)
    const usuario = req.headers['x-usuario'] || 'desconocido';

    // Patrones comunes de escaneo que se ven en tu captura (.env, wp-admin, phpmyadmin, config)
    const rutasAtaque = /(\/\.env|\/wp-admin|\/phpmyadmin|\/config|\/admin)/i;
    
    if (rutasAtaque.test(req.path)) {
        registrarLog(ip, 'desconocido', 'ESCANEO', 'ALTA', req.path, req.method, 404);
        return res.status(404).json({ error: 'Not Found' });
    }

    res.on('finish', () => {
        // Evitar registrar las llamadas internas que limpian o leen el panel
        if (!req.path.startsWith('/api/logs')) {
            let evento = 'VISITA';
            let severidad = 'INFO';

            if (req.path === '/login' && res.statusCode === 200) evento = 'LOGIN';
            if (res.statusCode === 403) { evento = 'ACCESO DENEGADO'; severidad = 'WARNING'; }
            if (res.statusCode === 404) { evento = 'ESCANEO'; severidad = 'ALTA'; }

            registrarLog(ip, usuario, evento, severidad, req.path, req.method, res.statusCode);
        }
    });
    next();
});

// Rutas de simulación para pruebas rápidas
app.get('/login-simular', (req, res) => {
    registrarLog('192.168.1.25', 'admin', 'LOGIN', 'INFO', '/login', 'POST', 200);
    res.send('Log de Login añadido.');
});

app.get('/escaneo-simular', (req, res) => {
    registrarLog('192.168.1.60', 'desconocido', 'ESCANEO', 'ALTA', '/phpmyadmin', 'GET', 404);
    res.send('Log de Escaneo añadido.');
});

// Endpoint protegido para obtener los logs
app.get('/api/logs', (req, res) => {
    const rol = req.headers['x-rol'];
    const ip = req.ip || req.connection.remoteAddress;
    const usuario = req.headers['x-usuario'] || 'invitado';

    if (rol !== 'admin') {
        registrarLog(ip, usuario, 'ACCESO DENEGADO', 'WARNING', '/admin/logs', 'GET', 403);
        return res.status(403).json({ error: 'Forbidden' });
    }

    const logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
    res.json(logs);
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));