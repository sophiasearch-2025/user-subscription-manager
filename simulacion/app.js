// Simple frontend logic to render sample data from data/sample-data.json
async function loadData() {
  try {
    const res = await fetch('data/sample-data.json');
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Error cargando datos de muestra', err);
    return { users: [], subscriptions: [] };
  }
}

function renderUsers(users) {
  const container = document.getElementById('usersList');
  container.innerHTML = '';
  if (!users || users.length === 0) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = '<em>No se encontraron usuarios</em>';
    container.appendChild(div);
    return;
  }
  users.forEach(u => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${u.name}</strong>
      <div class="meta">${u.email}</div>
      <div class="meta">${u.company || ''} • ${u.role}</div>
    `;
    container.appendChild(div);
  });
}

function renderSubs(subs) {
  const container = document.getElementById('subsList');
  container.innerHTML = '';
  if (!subs || subs.length === 0) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = '<em>No se encontraron suscripciones</em>';
    container.appendChild(div);
    return;
  }
  subs.forEach(s => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${s.plan}</strong>
      <div class="meta">Usuario UID: ${s.userUid}</div>
      <div class="meta">Estado: ${s.status} • Vence: ${new Date(s.expiresAt).toLocaleDateString()}</div>
    `;
    container.appendChild(div);
  });
}

function applyFilter(data) {
  const q = document.getElementById('filterEmail').value.trim().toLowerCase();
  if (!q) {
    renderUsers(data.users);
    renderSubs(data.subscriptions);
    return;
  }

  // Buscar por email, nombre o compañía (case-insensitive)
  const users = data.users.filter(u => {
    return [u.email, u.name, u.company]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(q));
  });

  // Mostrar suscripciones asociadas a los usuarios resultantes
  const subs = data.subscriptions.filter(s => users.some(u => u.uid === s.userUid));

  renderUsers(users);
  renderSubs(subs);
}

function setup(data) {
  renderUsers(data.users);
  renderSubs(data.subscriptions);

  document.getElementById('btnFilter').addEventListener('click', () => applyFilter(data));
  // Permitir filtrar al presionar Enter en el input
  document.getElementById('filterEmail').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyFilter(data);
  });
  document.getElementById('btnReset').addEventListener('click', () => {
    document.getElementById('filterEmail').value = '';
    applyFilter(data);
  });
  document.getElementById('btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulacion-data.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Cargar datos desde la API pública (backend)
  document.getElementById('btnLoadRemote').addEventListener('click', async () => {
    let input = document.getElementById('apiBase').value.trim();
    if (!input) input = window.location.origin;

    // Si el usuario pega una URL completa (empieza con http), la usamos tal cual.
    // Si pega solo host (sin http) o solo host+path base, añadimos /api/public/users cuando corresponda.
    let url = input;
    try {
      if (!/^https?:\/\//i.test(input)) {
        // no empieza con http -> tratar como host y añadir endpoint
        url = input.replace(/\/$/, '') + '/api/public/users?limit=200';
        if (!/^https?:\/\//i.test(url)) {
          // si todavía no tiene esquema, asumir http
          url = 'http://' + url;
        }
      } else {
        // Si el input ya es una URL completa, usar tal cual
        // Si la URL no contiene '/api/' asumimos que el user dio un host y añadimos el path
        if (!/\/api\//i.test(input)) {
          url = input.replace(/\/$/, '') + '/api/public/users?limit=200';
        }
      }

      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success && !Array.isArray(json)) throw new Error(json.message || 'Error cargando datos');

      // json can be either { success, data } or an array
      const usersRaw = Array.isArray(json) ? json : (json.data || json || []);
      const remoteData = { users: usersRaw || [], subscriptions: [] };

      // Renderiza los usuarios remotos y borra subs (no hay endpoint público para subs aún)
      renderUsers(remoteData.users);
      renderSubs(remoteData.subscriptions);

      // bind filter to remote dataset
      document.getElementById('btnFilter').onclick = () => applyFilter(remoteData);
      document.getElementById('filterEmail').onkeydown = (e) => { if (e.key === 'Enter') applyFilter(remoteData); };
    } catch (err) {
      alert('Error cargando datos remotos: ' + err.message + '\nURL: ' + url);
      console.error(err);
    }
  });
}

(async function() {
  const data = await loadData();
  setup(data);
})();
