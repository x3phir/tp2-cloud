const API_URL = "/api";

async function loadInfo() {
  try {
    const res  = await fetch(`${API_URL}/info`);
    const data = await res.json();

    document.getElementById('judul').textContent = data.judul_katalog;
    document.getElementById('nama').textContent  = data.pemilik;
    document.getElementById('nim').textContent   = data.nim;

    renderItems(data.items);
  } catch (e) {
    document.getElementById('item-list').innerHTML =
      '<li style="color:#f87171">Gagal terhubung ke backend.</li>';
  }
}

function renderItems(items) {
  const ul = document.getElementById('item-list');
  ul.innerHTML = items.length
    ? items.map(i => `<li>${i}</li>`).join('')
    : '<li style="color:#475569">Belum ada item.</li>';
}

async function addItem() {
  const input = document.getElementById('new-item');
  const msg   = document.getElementById('status-msg');
  const item  = input.value.trim();
  if (!item) return;

  try {
    const res  = await fetch(`${API_URL}/add-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item })
    });
    const data = await res.json();
    if (res.ok) {
      renderItems(data.items);
      msg.style.color = '#4ade80';
      msg.textContent = '✅ ' + data.message;
      input.value = '';
    } else {
      msg.style.color = '#f87171';
      msg.textContent = '❌ ' + data.error;
    }
  } catch {
    msg.style.color = '#f87171';
    msg.textContent = '❌ Gagal menghubungi backend.';
  }

  setTimeout(() => { msg.textContent = ''; }, 3000);
}

loadInfo();
