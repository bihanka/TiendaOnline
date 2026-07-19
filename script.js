document.addEventListener('DOMContentLoaded', () => {
    
    // Sistema SPA: Conmutación de Vistas por atributos de datos
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.view-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const target = btn.getAttribute('data-target');
            sections.forEach(sec => {
                sec.hidden = sec.id !== target;
            });
        });
    });
});

// DISPARADORES DE EVENTOS DE NEGOCIO (Hacia el Backend)
function ejecutarCompra() {
    fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-user': 'eduardo_cliente' },
        body: JSON.stringify({ event_id: "TL-2026", quantity: 2 })
    })
    .then(res => res.json())
    .then(data => alert(`[SISTEMA]: ${data.message} (Verificado en logs como PURCHASE_SUCCESS)`));
}

function ejecutarLoginFallido() {
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-user': 'malicious_user' },
        body: JSON.stringify({ user: "admin", pass: "wrong_password" })
    })
    .then(() => alert("[SISTEMA]: Error 401 simulado. Evento registrado como AUTH_LOGIN_DENIED (HIGH)."));
}

function ejecutarRutaInexistente() {
    fetch('/api/v1/sistema-inseguro-root-path-test')
    .then(() => alert("[SISTEMA]: Código 404 forzado. Registrado automáticamente como DIRECTORY_SCAN_NOT_FOUND (LOW)."));
}

function ejecutarAtaqueSQL() {
    // Forzado explícito de payloads peligrosos detectados por las expresiones regulares del WAF
    fetch('/api/tickets/purchase?id=1%20OR%201=1--', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: "<script>alert('xss')</script>" })
    })
    .then(res => res.json())
    .then(data => {
        alert(`[BLOQUEO WAF]: ${data.error}`);
    });
}

// 1. SOLICITUD Y PROCESAMIENTO DINÁMICO DE LOGS (FRONTEND)
function solicitarLogsServidor() {
    const rol = document.getElementById('current-role').value;
    const errorAlert = document.getElementById('error-alert');
    const tableWrapper = document.getElementById('table-wrapper');
    const tbody = document.getElementById('logs-tbody');

    errorAlert.hidden = true;
    tableWrapper.hidden = true;
    tbody.innerHTML = '';

    // Enviamos simulación de firma digital / control de accesos en los headers de la petición HTTP
    fetch('/api/secure-framework/logs', {
        method: 'GET',
        headers: {
            'x-auth-role': rol,
            'x-auth-user': rol === 'admin' ? 'admin_root' : 'guest_user'
        }
    })
    .then(res => {
        if (!res.ok) {
            if (res.status === 403) throw new Error('CÓDIGO HTTP 403: Acceso Denegado. Tu cuenta carece de privilegios criptográficos de Administrador.');
            throw new Error('Error de comunicación con el Framework del Servidor.');
        }
        return res.json();
    })
    .then(logs => {
        tableWrapper.hidden = false;
        
        // Mostrar los logs más nuevos arriba del todo (Cronología Inversa)
        logs.reverse().forEach(log => {
            const tr = document.createElement('tr');
            
            // Formatear Fecha
            const fecha = new Date(log.timestamp).toLocaleString();
            
            tr.innerHTML = `
                <td>${fecha}</td>
                <td><strong>${log.ip_address}</strong></td>
                <td>${log.user}</td>
                <td><code>${log.event}</code></td>
                <td><span class="sev-${log.severity}">${log.severity}</span></td>
                <td>${log.request_path}</td>
                <td><strong>${log.http_method}</strong></td>
                <td><code>${log.status_code}</code></td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(err => {
        errorAlert.textContent = err.message;
        errorAlert.hidden = false;
    });
}