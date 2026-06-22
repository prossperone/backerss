// ==========================================================================
// 🛠️ CONFIGURACIÓN DE SUPABASE (Reemplaza con tus credenciales del panel)
// ==========================================================================
const SUPABASE_URL = "https://TU_PROYECTO.supabase.co"; 
const SUPABASE_ANON_KEY = "TU_ANON_KEY_PUBLICA";

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Variables de estado local de la Web App móvil
let localBackersCount = 0;
let localTotalCapital = 0;

// ==========================================================================
// 🌌 ANIMACIÓN DEL CANVAS DE PARTÍCULAS DE FONDO (FINANCIAL BACKDROP)
// ==========================================================================
(function () {
  var canvas = document.getElementById('financeCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var symbols = ['$', '↗', '✓', '%'];
  var colors = [
    'rgba(16,185,129,', // Verde suave tecnológico Backerss
    'rgba(201,162,39,',  // Dorado del logo intacto
    'rgba(156,152,141,'  // Color tinta tenue neutral
  ];

  var particles = [];
  var hero, w, h, dpr;

  function resize() {
    hero = canvas.parentElement;
    w = hero.offsetWidth;
    h = hero.offsetHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function seed() {
    var count = w < 640 ? 14 : 26;
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(makeParticle(true));
    }
  }

  function makeParticle(initial) {
    var colorIdx = Math.random() < 0.45 ? 0 : (Math.random() < 0.7 ? 1 : 2);
    return {
      x: rand(0, w),
      y: initial ? rand(0, h) : h + rand(10, 60),
      size: rand(11, 22),
      speed: rand(6, 16) / 100,
      drift: rand(-0.12, 0.12),
      symbol: symbols[Math.floor(rand(0, symbols.length))],
      color: colors[colorIdx],
      alphaBase: rand(0.12, 0.34),
      phase: rand(0, Math.PI * 2),
      flicker: rand(0.002, 0.006)
    };
  }

  var t = 0;
  function tick() {
    t += 1;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y -= p.speed;
      p.x += p.drift;
      var alpha = p.alphaBase + Math.sin(t * p.flicker + p.phase) * 0.08;
      if (alpha < 0) alpha = 0;
      ctx.font = (p.size) + 'px JetBrains Mono, monospace';
      ctx.fillStyle = p.color + alpha.toFixed(3) + ')';
      ctx.fillText(p.symbol, p.x, p.y);

      if (p.y < -30) {
        particles[i] = makeParticle(false);
        particles[i].x = rand(0, w);
      }
    }
    if (!reduceMotion) {
      requestAnimationFrame(tick);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  if (reduceMotion) {
    tick();
  } else {
    requestAnimationFrame(tick);
  }
})();

// ==========================================================================
// 🔑 MÓDULO DE AUTENTICACIÓN (CONEXIÓN AUTOMÁTICA CON SUPABASE)
// ==========================================================================

// Función para registrar un nuevo usuario e inicializar su perfil con el Trigger
async function registrarNuevoProtocolo(email, password, nombreCompleto) {
  if (!supabase) return alert("Supabase no está configurado.");
  
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        nombre_completo: nombreCompleto
      }
    }
  });

  if (error) {
    alert(`Error de Registro: ${error.message}`);
  } else {
    alert("Registro exitoso en el Protocolo. Revisa tu correo de confirmación o inicia sesión.");
    window.location.href = "auth.html";
  }
}

// Función para iniciar sesión
async function iniciarSesionProtocolo(email, password) {
  if (!supabase) return alert("Supabase no está configurado.");

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert(`Error de Acceso: ${error.message}`);
  } else {
    // Éxito: Redirigir al Dashboard de la Web App móvil
    window.location.href = "dashboard.html";
  }
}

// Función para cerrar sesión desde la Web App
async function cerrarSesionProtocolo() {
  if (!supabase) return;
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// Opcional: Escuchar los envíos del formulario en auth.html de forma nativa
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("authEmail").value;
      const password = document.getElementById("authPassword").value;
      await iniciarSesionProtocolo(email, password);
    });
  }
  
  // Cargar datos dinámicos si estamos dentro de dashboard.html
  if (window.location.pathname.includes("dashboard.html")) {
    verificarSesionYCarbargarDashboard();
  }
});

// ==========================================================================
// 📱 INTERACTIVIDAD DE LA WEB APP MÓVIL Y MOTOR DE COMISIONES
// ==========================================================================

// Verificar estado de sesión y descargar datos en tiempo real de la Bóveda RLS
async function verificarSesionYCarbargarDashboard() {
  if (!supabase) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Si no está autenticado, proteger la ruta y regresarlo a la landing
    window.location.href = "auth.html";
    return;
  }

  // 1. Descargar Perfil del Usuario
  const { data: profile, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (profile) {
    document.getElementById("headerCycleBadge").innerText = `${profile.ciclo_actual.toUpperCase().replace('_', ' ')} ACTIVO`;
    if (profile.ciclo_actual === 'ciclo_2') document.getElementById('centerNumber').innerText = '2';
    if (profile.ciclo_actual === 'ciclo_3') document.getElementById('centerNumber').innerText = '3';
  }

  // 2. Descargar Balance Financiero Real de la Bóveda
  const { data: txs, error: tError } = await supabase
    .from('wallet_transactions')
    .select('*')
    .order('fecha_operation', { ascending: false });

  if (txs && txs.length > 0) {
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = ''; // Limpiar mensaje por defecto
    
    let sumCapital = 0;
    txs.forEach(tx => {
      if (tx.tipo_comision !== 'retiro') sumCapital += parseFloat(tx.monto);
      else sumCapital -= parseFloat(tx.monto);

      // Inyectar ítems de historial en la vista de la Bóveda
      const item = document.createElement('div');
      item.className = 'feed-item';
      const labelTx = tx.tipo_comision.toUpperCase().replace('_', ' ');
      const prefix = tx.tipo_comision === 'retiro' ? '-' : '+';
      const cssAmount = tx.tipo_comision === 'retiro' ? 'style="color: var(--ink-dim)"' : 'class="amount"';
      
      item.innerHTML = `<span>${labelTx}</span><span ${cssAmount}>${prefix}$${tx.monto}</span>`;
      feedContainer.appendChild(item);
    });

    localTotalCapital = sumCapital;
    document.getElementById('bovedaAmount').innerHTML = `$${sumCapital.toFixed(2)} <span style="font-size: 0.85rem; color: var(--ink-faint); font-family: 'JetBrains Mono'; font-weight: normal;">USD</span>`;
  }

  // 3. Descargar la Constelación (Referidos directos)
  const { data: refs } = await supabase
    .from('referrals')
    .select('id');

  if (refs && refs.length > 0) {
    localBackersCount = refs.length;
    const grid = document.getElementById('backersGrid');
    grid.innerHTML = '';
    for (let i = 1; i <= refs.length; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'backer-bubble';
      bubble.innerText = 'B' + i;
      grid.appendChild(bubble);
    }
  }
}

// Lógica de simulación local del botón (Mantiene la interactividad visual que aprobamos)
function addSimulatedBacker() {
  localBackersCount++;
  const grid = document.getElementById('backersGrid');
  if (localBackersCount === 1) grid.innerHTML = ''; 
  
  const bubble = document.createElement('div');
  bubble.className = 'backer-bubble';
  bubble.innerText = 'B' + localBackersCount;
  grid.appendChild(bubble);

  // Sistema de comisiones tripartito simulado localmente (+ $10 por Acción Directa)
  localTotalCapital += 10;
  document.getElementById('bovedaAmount').innerHTML = `$${localTotalCapital}.00 <span style="font-size: 0.85rem; color: var(--ink-faint); font-family: 'JetBrains Mono'; font-weight: normal;">USD</span>`;

  const feed = document.getElementById('feedContainer');
  if (localBackersCount === 1) feed.innerHTML = '';
  
  const item = document.createElement('div');
  item.className = 'feed-item';
  item.innerHTML = `<span>Acción Directa (Simulado #${localBackersCount})</span><span class="amount">+$10.00</span>`;
  feed.insertBefore(item, feed.firstChild);

  // Triggers visuales de evolución ascendente basados en la acumulación de la Bóveda
  if (localTotalCapital >= 70 && localTotalCapital < 130) {
    document.getElementById('centerNumber').innerText = '2';
    document.getElementById('headerCycleBadge').innerText = 'CICLO 2 ACTIVO';
  } else if (localTotalCapital >= 130) {
    document.getElementById('centerNumber').innerText = '3';
    document.getElementById('headerCycleBadge').innerText = 'CICLO 3 MAESTRÍA';
  }
}
