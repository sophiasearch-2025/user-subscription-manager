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

  const users = data.users.filter(u => u.email.toLowerCase().includes(q));
  const subs = data.subscriptions.filter(s => users.some(u => u.uid === s.userUid));

  renderUsers(users);
  renderSubs(subs);
}

function setup(data) {
  renderUsers(data.users);
  renderSubs(data.subscriptions);

  document.getElementById('btnFilter').addEventListener('click', () => applyFilter(data));
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
}

(async function() {
  const data = await loadData();
  setup(data);
})();
