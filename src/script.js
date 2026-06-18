/* ── DATA ── edit this object to customise everything */
const DATA = {
  heroName: 'SAMSCRIPT',
  skills: [
    { name: 'JavaScript', pct: 90 }, { name: 'HTML / CSS', pct: 95 },
    { name: 'Node.js', pct: 85 }, { name: 'Java', pct: 60 },
    { name: 'C#', pct: 45 }, { name: 'Lua', pct: 85 },
  ],
  projects: [],
  clips: [],
  achievements: [
    { id: 'boot', icon: '&#x1F680;', name: 'FIRST BOOT', desc: 'Launched the portfolio', hint: 'Happens automatically when the site finishes loading.', xp: 50, earn: false, secret: false },
    { id: 'projects', icon: '&#x1F4BE;', name: 'MISSION BOARD', desc: 'Opened a project card to read its brief', hint: 'Go to Projects and click any card.', xp: 75, earn: false, secret: false },
    { id: 'clips', icon: '&#x1F4E1;', name: 'MEDIA ACCESS', desc: 'Watched something in the Media Vault', hint: 'Go to Clips and click any thumbnail.', xp: 60, earn: false, secret: false },
    { id: 'contact', icon: '&#x1F4F6;', name: 'COMM LINK', desc: 'Opened the Contact page', hint: 'Click the Contact tab in the nav bar.', xp: 50, earn: false, secret: false },
    { id: 'allnav', icon: '&#x1F310;', name: 'FULL SCAN', desc: 'Visited every page on the site', hint: 'Click through Home, Projects, Clips, Achievements and Contact.', xp: 150, earn: false, secret: false },
    { id: 'clicker', icon: '&#x1F446;', name: 'CURIOUS MIND', desc: 'Opened every project on the site', hint: 'Click through all the project cards, including the locked one.', xp: 100, earn: false, secret: false },
    { id: 'combo5', icon: '&#x26A1;', name: 'RAPID FIRE', desc: 'Interacted with the site 5 times quickly', hint: 'Click around quickly &mdash; nav links, cards, anything.', xp: 80, earn: false, secret: false },
    { id: 'hacked', icon: '&#x1F513;', name: 'BREACH COMPLETE', desc: 'Solved the hidden hacking mini-game', hint: 'Find the locked project card and try the terminal on it.', xp: 200, earn: false, secret: false },
    { id: 'skilltree', icon: '&#x1F33F;', name: 'SKILL INSPECTOR', desc: 'Inspected a node on the skill tree', hint: 'On Home, click any node in the Skill Tree diagram.', xp: 40, earn: false, secret: false },
    { id: 'streak3', icon: '&#x1F525;', name: 'HOT STREAK', desc: 'Visited on 3 separate days in a row', hint: 'Come back and open the site again tomorrow.', xp: 120, earn: false, secret: false },
    { id: 'social', icon: '&#x1F4E1;', name: 'NETWORK LINKED', desc: 'Clicked through to a social profile', hint: 'On Contact, click Discord, GitHub or Twitch.', xp: 40, earn: false, secret: false },
    { id: 'easter', icon: '&#x1F47B;', name: 'GHOST PROTOCOL', desc: 'Found a hidden easter egg', hint: '???', xp: 200, earn: false, secret: true },
    { id: 'maxrank', icon: '&#x1F451;', name: 'LEGEND STATUS', desc: 'Reached the maximum rank', hint: 'Keep earning XP across the site to rank up.', xp: 0, earn: false, secret: false },
  ],
  socials: [
    { name: 'DISCORD', handle: 'samscript_573777', url: 'https://discord.com/users/samscript_573777', icon: 'discord', sub: 'Send a message' },
    { name: 'GITHUB', handle: 'samscript57377', url: 'https://github.com/samscript57377', icon: 'github', sub: 'View repositories' },
    { name: 'TWITCH', handle: 'samscript_57377', url: 'https://www.twitch.tv/samscript_57377', icon: 'twitch', sub: 'Watch live' },
  ],
  ranks: [
    { name: 'ROOKIE', min: 0 }, { name: 'CODER', min: 150 }, { name: 'HACKER', min: 350 },
    { name: 'ARCHITECT', min: 600 }, { name: 'LEGEND', min: 900 },
  ],
};

/* ── SUPABASE CLIENT ── */
const SUPABASE_URL = 'https://ahcqzyflynyshwkigfvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoY3F6eWZseW55c2h3a2lnZnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MTMxMTQsImV4cCI6MjA5NzI4OTExNH0.Vm2riF8isNVrXHltZ9GlpW0mkq9AqR38MwCLMbtXlqM';
let sb = null;
try {
  if (window.supabase && SUPABASE_URL.indexOf('YOUR_SUPABASE') === -1) {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) { console.error('Supabase init failed:', e); }

/* ── LOAD PROJECTS + CLIPS FROM SUPABASE ── */
function mapDbProject(row) {
  return {
    id: row.id,
    name: row.name,
    tag: row.tag,
    desc: row.short_desc,
    fullDesc: row.full_desc || row.short_desc,
    tech: row.tech || [],
    demo: row.demo_url || '',
    github: row.github_url || '',
    status: row.status || 'LIVE',
    duration: row.duration || '',
    commits: row.commits || '',
    lines: row.lines || '',
    timeline: row.timeline || [],
    xp: row.xp || 50,
    locked: !!row.locked,
  };
}
function mapDbClip(row) {
  return {
    id: row.id,
    title: row.title,
    cat: row.cat || 'VIDEO',
    type: row.type,
    src: row.src,
    thumb: row.thumbnail_url || '',
  };
}

async function loadProjectsFromDb() {
  if (!sb) {
    console.warn('Supabase not configured — showing empty state. Edit SUPABASE_URL / SUPABASE_ANON_KEY in this file.');
    return [];
  }
  try {
    const { data, error } = await sb.from('projects').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    if (error) { console.error('Error loading projects:', error); return []; }
    return (data || []).map(mapDbProject);
  } catch (e) { console.error('Error loading projects:', e); return []; }
}
async function loadClipsFromDb() {
  if (!sb) { return []; }
  try {
    const { data, error } = await sb.from('clips').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    if (error) { console.error('Error loading clips:', error); return []; }
    return (data || []).map(mapDbClip);
  } catch (e) { console.error('Error loading clips:', e); return []; }
}

/* ── AUDIO ── */
let _ac = null;
function AC() { if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)(); return _ac; }
function tone(f, t, d, v = .13, a = .005) {
  try {
    const c = AC(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination); o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(v, c.currentTime + a);
    g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + d);
    o.start(); o.stop(c.currentTime + d);
  } catch (e) { }
}
function noise(d, v = .05) {
  try {
    const c = AC(), b = c.createBuffer(1, c.sampleRate * d, c.sampleRate), da = b.getChannelData(0);
    for (let i = 0; i < da.length; i++)da[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = b;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200;
    const g = c.createGain(); s.connect(f); f.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(v, c.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + d);
    s.start(); s.stop(c.currentTime + d);
  } catch (e) { }
}
const SFX = {
  nav: () => { tone(880, 'square', .1, .08); tone(1100, 'square', .07, .04); },
  click: () => { tone(660, 'square', .07, .07); noise(.04, .03); },
  xp: () => { [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 'sine', .12, .1), i * 60)); },
  ach: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 'sine', .2, .1), i * 80)); },
  combo: () => { tone(440 + (S.combo * 40), 'sawtooth', .07, .06); },
  boot: () => { tone(220, 'sawtooth', .3, .07); setTimeout(() => tone(440, 'square', .2, .05), 200); setTimeout(() => tone(880, 'sine', .15, .04), 400); },
  rank: () => { [262, 330, 392, 523, 659].forEach((f, i) => setTimeout(() => tone(f, 'triangle', .22, .09), i * 55)); },
  glitch: () => { tone(80, 'sawtooth', .08, .12); setTimeout(() => tone(160, 'square', .06, .08), 40); },
  type: () => { tone(1200 + Math.random() * 400, 'square', .04, .025); },
  hack: (ok) => { if (ok) { tone(440, 'sine', .15, .1); setTimeout(() => tone(660, 'sine', .15, .1), 100); } else { tone(150, 'sawtooth', .12, .12); } },
  buy: () => { [660, 880, 1100].forEach((f, i) => setTimeout(() => tone(f, 'sine', .15, .08), i * 70)); },
  streak: () => { [440, 550, 660, 880].forEach((f, i) => setTimeout(() => tone(f, 'triangle', .2, .09), i * 65)); },
};

/* ── STATE ── */
const S = {
  xp: 0, earned: new Set(), visited: new Set(['home']), clickedProjs: new Set(),
  logoClicks: 0, combo: 0, comboTimer: null, filterTag: 'ALL', rankIdx: 0
};

/* ── STORAGE KEYS ── */
const STREAK_KEY = 'ss_streak_v1';

/* ── STREAK SYSTEM ── */
function checkStreak() {
  const today = new Date().toDateString();
  let data;
  try { data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}'); } catch (e) { data = {}; }
  const last = data.last || '';
  const streak = data.streak || 0;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let newStreak;
  if (last === today) { newStreak = streak; }
  else if (last === yesterday) { newStreak = streak + 1; }
  else { newStreak = 1; }
  localStorage.setItem(STREAK_KEY, JSON.stringify({ last: today, streak: newStreak }));
  const badge = document.getElementById('streak-badge');
  if (newStreak >= 2) { badge.style.display = 'flex'; badge.textContent = '\uD83D\uDD25 ' + newStreak + ' DAY STREAK'; }
  if (newStreak >= 3) {
    toast('\uD83D\uDD25 ' + newStreak + '-DAY STREAK! BONUS XP', 'streak'); SFX.streak();
    setTimeout(() => addXP(50 * newStreak, 'STREAK BONUS'), 1000);
    unlockAch('streak3');
  } else if (newStreak >= 1 && last !== today) {
    toast('Welcome back! Day ' + newStreak + ' streak', 'streak');
  }
}

/* ── XP + RANK ── */
function addXP(amt, label, el) {
  S.xp += amt; document.getElementById('sv-xp').textContent = S.xp;
  updateXPBar(); toast('+' + amt + ' XP \u2014 ' + label, 'xp'); SFX.xp();
  if (el) {
    var r = el.getBoundingClientRect(), d = document.createElement('div');
    d.className = 'xp-pop'; d.textContent = '+' + amt + ' XP';
    d.style.left = (r.left + r.width / 2 - 20) + 'px'; d.style.top = (r.top - 10) + 'px';
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1600);
  }
}
function updateXPBar() {
  var ranks = DATA.ranks, rIdx = 0;
  for (var i = 0; i < ranks.length; i++)if (S.xp >= ranks[i].min) rIdx = i;
  var rank = ranks[rIdx], next = ranks[rIdx + 1];
  var pct = next ? Math.min(100, Math.round(((S.xp - rank.min) / (next.min - rank.min)) * 100)) : 100;
  document.getElementById('xp-fill').style.width = pct + '%';
  document.getElementById('xp-txt').textContent = S.xp + (next ? ' / ' + next.min : ' MAX');
  document.getElementById('rank-badge').textContent = rank.name;
  document.getElementById('sv-rank').textContent = 'LVL ' + (rIdx + 1);
  document.getElementById('avatar-lvl').textContent = 'LVL ' + (rIdx + 1);
  if (rIdx > S.rankIdx) { S.rankIdx = rIdx; toast('RANK UP \u2192 ' + rank.name, 'rank'); SFX.rank(); if (rIdx === ranks.length - 1) unlockAch('maxrank'); }
}

/* ── ACHIEVEMENTS ── */
function unlockAch(id, el) {
  if (S.earned.has(id)) return;
  var a = DATA.achievements.find(function (x) { return x.id === id; }); if (!a) return;
  S.earned.add(id); a.earn = true;
  if (a.xp > 0) addXP(a.xp, a.name, el);
  toast('\uD83C\uDFC6 ' + a.name, 'ach'); SFX.ach();
  document.getElementById('sv-ach').textContent = S.earned.size;
  document.getElementById('anotif').textContent = S.earned.size;
  refreshAch();
}
function checkAllNav() {
  if (['home', 'projects', 'clips', 'achievements', 'contact'].every(function (s) { return S.visited.has(s); }))
    unlockAch('allnav');
}

/* ── COMBO ── */
function hitCombo() {
  clearTimeout(S.comboTimer); S.combo++; SFX.combo();
  var cb = document.getElementById('combo-bar'), cd = document.getElementById('combo-display');
  document.getElementById('combo-val').textContent = S.combo;
  if (S.combo > 1) { cb.style.opacity = '1'; cd.style.opacity = '1'; cd.textContent = 'COMBO x' + S.combo; }
  if (S.combo === 5) unlockAch('combo5');
  S.comboTimer = setTimeout(function () { S.combo = 0; cb.style.opacity = '0'; cd.style.opacity = '0'; }, 2200);
}

/* ── TOAST ── */
function toast(msg, type) {
  if (type === undefined) type = '';
  var w = document.getElementById('toasts'), d = document.createElement('div');
  d.className = 'toast' + (type ? ' ' + type : ''); d.textContent = msg;
  w.appendChild(d);
  setTimeout(function () { d.classList.add('tout'); setTimeout(function () { d.remove(); }, 350); }, 3200);
}

/* ── MATRIX RAIN ── */
(function () {
  var cv = document.getElementById('matrix-cv'), ctx = cv.getContext('2d');
  var W, H, cols, drops;
  var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ0123456789ABCDEF<>[]';
  function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; cols = Math.floor(W / 16); drops = Array(cols).fill(1); }
  resize(); addEventListener('resize', resize);
  setInterval(function () {
    ctx.fillStyle = 'rgba(3,12,17,0.06)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#00FFFF'; ctx.font = '13px Share Tech Mono';
    drops.forEach(function (y, i) {
      var c = chars[Math.floor(Math.random() * chars.length)];
      ctx.globalAlpha = Math.random() * .55 + .05; ctx.fillText(c, i * 16, y * 16); ctx.globalAlpha = 1;
      if (y * 16 > H && Math.random() > .975) drops[i] = 0; else drops[i]++;
    });
  }, 55);
})();

/* ── PARTICLE BG ── */
(function () {
  var cv = document.getElementById('bg-cv'), ctx = cv.getContext('2d');
  var W, H, pts = [];
  function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
  resize(); addEventListener('resize', resize);
  for (var i = 0; i < 45; i++)pts.push({ x: Math.random() * 3000, y: Math.random() * 2000, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: Math.random() * .8 + .2, a: Math.random() * .35 + .1 });
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i]; p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,' + p.a * .18 + ')'; ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 85) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = 'rgba(0,255,255,' + (1 - d / 85) * .04 + ')'; ctx.lineWidth = .4; ctx.stroke(); }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── 3D HOLOGRAM WIREFRAMES ── */
function proj3(x, y, z, rx, ry, cx, cy) {
  var fov = 180;
  var x1 = x * Math.cos(ry) - z * Math.sin(ry), z1 = x * Math.sin(ry) + z * Math.cos(ry);
  var y1 = y * Math.cos(rx) - z1 * Math.sin(rx), z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
  var sc = fov / (fov + z2 + 80); return [cx + x1 * sc, cy + y1 * sc];
}
function drawWF(ctx, verts, edges, rx, ry, cx, cy, col, alpha) {
  var p = verts.map(function (v) { return proj3(v[0], v[1], v[2], rx, ry, cx, cy); });
  ctx.strokeStyle = col; ctx.lineWidth = .8;
  edges.forEach(function (e) {
    ctx.beginPath(); ctx.moveTo(p[e[0]][0], p[e[0]][1]); ctx.lineTo(p[e[1]][0], p[e[1]][1]);
    ctx.globalAlpha = alpha; ctx.stroke();
  });
  p.forEach(function (pt) { ctx.beginPath(); ctx.arc(pt[0], pt[1], 1.2, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = alpha * .7; ctx.fill(); });
  ctx.globalAlpha = 1;
}
var SHAPES = [
  {
    verts: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map(function (v) { return v.map(function (x) { return x * 24; }); }),
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
  },
  { verts: [[0, 28, 0], [24, -13, 13], [-24, -13, 13], [0, -13, -28]], edges: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]] },
  {
    verts: [[0, 0, 28], [0, 0, -28], [28, 0, 0], [-28, 0, 0], [0, 28, 0], [0, -28, 0], [19, 19, 0], [-19, -19, 0]],
    edges: [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [3, 4], [2, 5], [3, 5], [6, 0], [6, 2], [6, 4], [7, 1], [7, 3], [7, 5]]
  },
  {
    verts: [[0, 28, 0], [0, -28, 0], [28, 0, 0], [-28, 0, 0], [0, 0, 28], [0, 0, -28]],
    edges: [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [4, 3], [3, 5], [5, 2]]
  },
];
var hAngles = [0, 0, 0, 0], hSpeeds = [.009, .012, -.008, .01];
function animHolos() {
  [0, 1, 2, 3].forEach(function (i) {
    var cv = document.getElementById('hcv' + i); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    var g = ctx.createRadialGradient(W / 2, H / 2, 2, W / 2, H / 2, H / 2);
    g.addColorStop(0, 'rgba(0,255,255,.07)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    hAngles[i] += hSpeeds[i];
    var scan = ((Date.now() / 8) % H);
    ctx.beginPath(); ctx.moveTo(0, scan); ctx.lineTo(W, scan); ctx.strokeStyle = 'rgba(0,255,255,.1)'; ctx.lineWidth = 1; ctx.globalAlpha = 1; ctx.stroke();
    drawWF(ctx, SHAPES[i].verts, SHAPES[i].edges, hAngles[i] * .65, hAngles[i], W / 2, H / 2, '#00FFFF', .55);
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 2.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.globalAlpha = 1; ctx.fill();
  });
  requestAnimationFrame(animHolos);
}
var bootA = 0;
function animBootHolo() {
  var cv = document.getElementById('boot-holo-cv'); if (!cv) return;
  var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H); bootA += .022;
  var g = ctx.createRadialGradient(W / 2, H / 2, 2, W / 2, H / 2, H / 2);
  g.addColorStop(0, 'rgba(0,255,255,.1)'); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  drawWF(ctx, SHAPES[0].verts, SHAPES[0].edges, bootA * .6, bootA, W / 2, H / 2, '#00FFFF', .75);
  ctx.beginPath(); ctx.arc(W / 2, H / 2, 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.globalAlpha = 1; ctx.fill();
  requestAnimationFrame(animBootHolo);
}
animBootHolo();

/* ── SKILL TREE ── */
var TREE_NODES = [
  { id: 'js', label: 'JS', x: .17, y: .22, deps: [], skill: 'JavaScript' },
  { id: 'css', label: 'CSS', x: .15, y: .72, deps: ['js'], skill: 'HTML / CSS' },
  { id: 'java', label: 'JAVA', x: .42, y: .21, deps: ['c#', 'no'], skill: 'Java' },
  { id: 'no', label: 'NODE', x: .38, y: .73, deps: ['js'], skill: 'Node.js' },
  { id: 'c#', label: 'C#', x: .61, y: .33, deps: [], skill: 'C#' },
  { id: 'lua', label: 'LUA', x: .83, y: .47, deps: ['no'], skill: 'Lua' },
];
function buildSkillTree() {
  var cv = document.getElementById('skill-tree-cv'); if (!cv) return;
  cv.width = cv.offsetWidth || 600;
  var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  function getPos(n) { return [n.x * W, n.y * H]; }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,.03)'; ctx.lineWidth = .5;
    for (var x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (var y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    TREE_NODES.forEach(function (n) {
      n.deps.forEach(function (dep) {
        var src = TREE_NODES.find(function (x) { return x.id === dep; });
        var p1 = getPos(src), p2 = getPos(n);
        ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]);
        ctx.strokeStyle = 'rgba(0,255,255,.18)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
      });
    });
    TREE_NODES.forEach(function (n) {
      var sk = DATA.skills.find(function (s) { return s.name === n.skill; }), pct = sk ? sk.pct : 0;
      var pos = getPos(n), x = pos[0], y = pos[1];
      var grd = ctx.createRadialGradient(x, y, 0, x, y, 26);
      grd.addColorStop(0, 'rgba(0,255,255,' + (pct / 700) + ')'); grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(0,255,255,' + (0.2 + pct / 220) + ')'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, 16, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (pct / 100)));
      ctx.fillStyle = 'rgba(0,255,255,' + (0.1 + pct / 400) + ')'; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,255,255,.75)'; ctx.fill();
      ctx.font = 'bold 8px Orbitron,monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = .9;
      ctx.fillText(n.label, x, y + 30); ctx.globalAlpha = 1;
      ctx.font = '8px Share Tech Mono,monospace'; ctx.fillStyle = 'rgba(0,255,255,.65)';
      ctx.fillText(pct + '%', x, y + 41);
    });
  }
  draw();
  cv.addEventListener('click', function (e) {
    var rect = cv.getBoundingClientRect();
    var mx = (e.clientX - rect.left) * (cv.width / rect.width), my = (e.clientY - rect.top) * (cv.height / rect.height);
    TREE_NODES.forEach(function (n) {
      var pos = getPos(n), nx = pos[0], ny = pos[1];
      if (Math.sqrt((mx - nx) * (mx - nx) + (my - ny) * (my - ny)) < 20) {
        SFX.click(); hitCombo(); unlockAch('skilltree');
        var sk = DATA.skills.find(function (s) { return s.name === n.skill; });
        toast(n.skill + ': ' + sk.pct + '% proficiency', '');
      }
    });
  });
  window.addEventListener('resize', function () { cv.width = cv.offsetWidth || 600; draw(); });
}

/* ── HERO NAME TYPING ── */
function typeHeroName() {
  var el = document.getElementById('hero-name-el'), name = DATA.heroName, i = 0;
  el.textContent = '';
  function next() {
    if (i >= name.length) { setTimeout(function () { el.textContent = name; }, 300); return; }
    el.textContent = name.slice(0, i + 1) + '\u2588'; SFX.type(); i++;
    setTimeout(next, 90 + Math.random() * 55);
  }
  next();
}

/* ── HIDDEN TERMINAL COMMANDS ── */
var termHistory = [];
var COMMANDS = {
  help: function () { return '<span style="color:var(--c)">AVAILABLE COMMANDS:</span> help | whoami | ls | status | sudo hack | matrix | clear | xp'; },
  whoami: function () { addXP(10, 'WHOAMI COMMAND'); return '<span style="color:var(--c)">operator: SAMSCRIPT</span> // clearance level: ' + DATA.ranks[S.rankIdx].name; },
  ls: function () { addXP(5, 'LS COMMAND'); return '/home/samscript\n  projects/ (' + DATA.projects.filter(function (p) { return !p.locked; }).length + ' missions)\n  achievements/ (' + S.earned.size + ' unlocked)\n  clips/ (' + DATA.clips.length + ' feeds)\n  classified/ [LOCKED]'; },
  status: function () { addXP(5, 'STATUS CHECK'); return 'XP: ' + S.xp + ' | RANK: ' + DATA.ranks[S.rankIdx].name + ' | STREAK: active | SYSTEMS: nominal'; },
  'sudo hack': function () { openHack(); return '<span style="color:#44FF88">LAUNCHING SECURE TERMINAL...</span>'; },
  matrix: function () { addXP(25, 'MATRIX CODE'); unlockAch('easter'); return '<span style="color:var(--c)">ENTERING THE MATRIX... REALITY IS A CONSTRUCT.</span>'; },
  clear: function () { document.getElementById('feed').innerHTML = ''; termHistory = []; typeTerminal(); return null; },
  xp: function () { addXP(20, 'SECRET XP COMMAND'); return '<span style="color:#FFD700">+20 XP AWARDED. KEEP EXPLORING.</span>'; },
  'cat classified.txt': function () { openHack(); return '<span style="color:#44FF88">ACCESS DENIED \u2014 HACK TERMINAL REQUIRED</span>'; },
  'nmap localhost': function () { addXP(15, 'PORT SCAN'); return 'PORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\n443/tcp open https\n1337/tcp open SAMSCRIPT'; },
  neofetch: function () { addXP(10, 'NEOFETCH'); return 'OS: PortfolioOS v5.0\nKernel: SamScript-5.0\nShell: cyber-zsh\nXP: ' + S.xp + '\nRank: ' + DATA.ranks[S.rankIdx].name; },
  'sudo admin': function () { addXP(50, 'ADMIN ACCESS'); setTimeout(function () { window.location.href = '/admin'; }, 3000); return '<span style="color:#44FF88">ADMINISTRATOR MODE ENABLED. REDIRECTING...</span>'; },
};
function runTermCmd(raw) {
  var cmd = raw.trim().toLowerCase();
  var feed = document.getElementById('feed');
  var line = document.createElement('div'); line.className = 'feed-line';
  line.innerHTML = '<span style="color:var(--c)">samscript@sys:~$</span> ' + escHtml(raw);
  feed.appendChild(line);
  var fn = COMMANDS[cmd];
  if (fn) {
    var result = fn();
    if (result !== null && result !== undefined) {
      var out = document.createElement('div'); out.className = 'feed-line';
      out.innerHTML = result.replace(/\n/g, '<br>'); feed.appendChild(out);
    }
  } else {
    var err = document.createElement('div'); err.className = 'feed-line';
    err.innerHTML = '<span style="color:#FF4444">command not found: ' + escHtml(cmd) + '</span> (try <span style="color:var(--c)">help</span>)';
    feed.appendChild(err); SFX.glitch();
  }
  feed.scrollTop = feed.scrollHeight;
}
function escHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
document.addEventListener('DOMContentLoaded', function () {
  var ti = document.getElementById('term-input');
  if (ti) {
    ti.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var v = this.value; if (v.trim()) { SFX.click(); hitCombo(); runTermCmd(v); } this.value = ''; }
      if (e.key === 'ArrowUp' && termHistory.length) { this.value = termHistory[termHistory.length - 1]; }
    });
  }
  var hi = document.getElementById('hack-in');
  if (hi) { hi.addEventListener('keydown', hackKey); }
  document.getElementById('pmod-close').addEventListener('click', closeProjModal);
  document.getElementById('proj-modal').addEventListener('click', function (e) { if (e.target === this) closeProjModal(); });
  document.getElementById('cmod-close').addEventListener('click', closeClipModal);
  document.getElementById('clip-modal').addEventListener('click', function (e) { if (e.target === this) closeClipModal(); });
});

/* ── TERMINAL FEED ── */
function typeTerminal() {
  var TERM = [
    { t: '> SYSTEM BOOT', v: 'OK' }, { t: '> OPERATOR', v: 'SAMSCRIPT' },
    { t: '> GITHUB', v: 'samscript57377' }, { t: '> TWITCH', v: 'samscript_57377' },
    { t: '> PROJECTS', v: DATA.projects.filter(function (p) { return !p.locked; }).length },
    { t: '> ACHIEVEMENTS', v: DATA.achievements.length },
    { t: '> TIP', v: 'type "help" in terminal below' },
  ];
  var feed = document.getElementById('feed'), i = 0;
  function next() {
    if (i >= TERM.length) {
      var d = document.createElement('div'); d.className = 'feed-line';
      d.innerHTML = '<span class="fc">></span> <span class="feed-cursor"></span>';
      feed.appendChild(d); return;
    }
    var ln = TERM[i++], d = document.createElement('div'); d.className = 'feed-line';
    d.innerHTML = ln.t + ': <span class="fc">' + ln.v + '</span>';
    d.style.opacity = '0'; d.style.transition = 'opacity .3s';
    feed.appendChild(d); requestAnimationFrame(function () { d.style.opacity = '1'; });
    setTimeout(next, 150 + Math.random() * 80);
  }
  next();
}

/* ── NAV ── */
function switchSection(s) {
  SFX.nav(); SFX.glitch();
  document.querySelectorAll('.nb').forEach(function (b) { b.classList.remove('on'); });
  document.querySelectorAll('.sec').forEach(function (x) { x.classList.remove('on', 'glitch-in'); });
  document.querySelectorAll('#nav .nb').forEach(function (b) { if (b.dataset.s === s) b.classList.add('on'); });
  var next = document.getElementById(s);
  if (next) { void next.offsetWidth; next.classList.add('on', 'glitch-in'); }
  S.visited.add(s); hitCombo();
  if (s === 'contact') unlockAch('contact');
  if (s === 'achievements') refreshAch();
  checkAllNav();
}
document.getElementById('nav').addEventListener('click', function (e) {
  var btn = e.target.closest('.nb'); if (!btn || !btn.dataset.s) return;
  switchSection(btn.dataset.s);
});

/* ── AVATAR ── */
document.getElementById('avatar-btn').addEventListener('click', function () {
  S.logoClicks++; SFX.click(); hitCombo(); addXP(5, 'AVATAR CLICK', this);
  if (S.logoClicks === 7) {
    unlockAch('easter', this);
    this.style.borderColor = '#CC88FF';
    this.querySelector('.avatar-txt').style.color = '#CC88FF';
  }
});
document.getElementById('logo').addEventListener('click', function () {
  S.logoClicks++; SFX.click(); hitCombo(); if (S.logoClicks >= 7) unlockAch('easter');
});

/* ── PROJECTS ── */
function buildProjects() {
  var fb = document.getElementById('filter-btns'); fb.innerHTML = '';
  var unlocked = DATA.projects.filter(function (p) { return !p.locked; });
  document.getElementById('pnotif').textContent = unlocked.length;
  document.getElementById('sv-proj').textContent = unlocked.length;
  var tags = ['ALL'];
  unlocked.forEach(function (p) { if (tags.indexOf(p.tag) < 0) tags.push(p.tag); });
  tags.forEach(function (t) {
    var b = document.createElement('button'); b.className = 'ftag' + (t === 'ALL' ? ' on' : ''); b.textContent = t;
    b.addEventListener('click', function () {
      S.filterTag = t; SFX.click();
      document.querySelectorAll('.ftag').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); renderProjects(); hitCombo();
    });
    fb.appendChild(b);
  });
  renderProjects();
}
function renderProjects() {
  var g = document.getElementById('proj-grid'); g.innerHTML = '';
  if (!DATA.projects.length) {
    g.innerHTML = '<div style="grid-column:1/-1;padding:30px;text-align:center;border:1px solid var(--border);background:var(--w05)"><div style="font-size:24px;opacity:.2;margin-bottom:10px">&#x1F4E6;</div><div style="font-family:var(--hud);font-size:10px;letter-spacing:2px;color:var(--w40)">NO PROJECTS YET</div><div style="font-size:10px;color:var(--w20);margin-top:6px">Check back later.</div></div>';
    return;
  }
  DATA.projects.forEach(function (p) {
    if (!p.locked && S.filterTag !== 'ALL' && p.tag !== S.filterTag) return;
    var d = document.createElement('div'); d.className = 'proj-card' + (p.locked ? ' locked' : '');
    if (p.locked) {
      d.innerHTML = '<div style="font-size:9px;letter-spacing:2px;padding:2px 7px;border:1px solid rgba(255,68,68,.3);color:#FF4444;display:inline-block;margin-bottom:7px">CLASSIFIED</div>'
        + '<div class="proj-name" style="opacity:.4">' + p.name + '</div>'
        + '<div class="proj-desc">' + p.desc + '</div>'
        + '<div style="margin-top:9px"><button onclick="openHack()" style="font-family:var(--hud);font-size:8px;letter-spacing:2px;color:#44FF88;border:1px solid rgba(68,255,136,.3);background:rgba(68,255,136,.05);padding:5px 11px;cursor:pointer">HACK TERMINAL</button></div>';
    } else {
      var links = '';
      if (p.demo) links += '<a class="plink" href="' + p.demo + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">LIVE</a>';
      if (p.github) links += '<a class="plink" href="' + p.github + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">CODE</a>';
      d.innerHTML = '<div class="proj-xp">+' + p.xp + 'XP</div>'
        + '<span class="proj-tag">' + p.tag + '</span>'
        + '<div class="proj-name">' + p.name + '</div>'
        + '<div class="proj-desc">' + p.desc + '</div>'
        + '<div class="proj-tech">' + p.tech.map(function (t) { return '<span class="tp">' + t + '</span>'; }).join('') + '</div>'
        + (links ? '<div class="proj-links">' + links + '</div>' : '')
        + '<div class="proj-num">0' + p.id + '</div>';
      (function (proj, card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('.plink')) return;
          SFX.click(); hitCombo(); openProjModal(proj);
          if (!S.clickedProjs.has(proj.id)) {
            S.clickedProjs.add(proj.id); addXP(proj.xp, proj.name, card); unlockAch('projects', card);
            if (S.clickedProjs.size === DATA.projects.filter(function (x) { return !x.locked; }).length) unlockAch('clicker', card);
          }
        });
      })(p, d);
    }
    g.appendChild(d);
  });
}

/* ── PROJECT MODAL ── */
function openProjModal(p) {
  document.getElementById('pmod-title').textContent = p.name;
  document.getElementById('pmod-tag').textContent = p.tag;
  var tlHtml = '';
  if (p.timeline && p.timeline.length) {
    tlHtml = '<div class="pmod-sec"><div class="pmod-sec-title">// BUILD TIMELINE</div><div class="pmod-tl">'
      + p.timeline.map(function (t) {
        return '<div class="pmod-tl-item"><div class="pmod-phase">' + t.phase + '</div>' + t.detail + '</div>';
      }).join('')
      + '</div></div>';
  }
  var linksHtml = '';
  if (p.demo) linksHtml += '<a class="pmod-link" href="' + p.demo + '" target="_blank" rel="noopener">LIVE DEMO</a>';
  if (p.github) linksHtml += '<a class="pmod-link" href="' + p.github + '" target="_blank" rel="noopener">VIEW CODE</a>';
  if (!linksHtml) linksHtml = '<span style="font-size:10px;color:var(--w20)">No public links yet</span>';
  document.getElementById('pmod-body').innerHTML =
    '<div class="pmod-sec"><div class="pmod-sec-title">// MISSION BRIEF</div>'
    + '<div class="pmod-desc">' + (p.fullDesc || p.desc) + '</div>'
    + (p.xp ? '<div class="pmod-xp-award">&#x26A1; +' + p.xp + ' XP AWARDED ON DISCOVERY</div>' : '')
    + '</div>'
    + '<div class="pmod-sec"><div class="pmod-sec-title">// STATS</div>'
    + '<div class="pmod-stat-row">'
    + '<div class="pmod-stat"><div class="pmod-stat-val">' + p.status + '</div><div class="pmod-stat-key">STATUS</div></div>'
    + '<div class="pmod-stat"><div class="pmod-stat-val">' + p.duration + '</div><div class="pmod-stat-key">DURATION</div></div>'
    + '<div class="pmod-stat"><div class="pmod-stat-val">' + p.commits + '</div><div class="pmod-stat-key">COMMITS</div></div>'
    + '</div></div>'
    + '<div class="pmod-sec"><div class="pmod-sec-title">// TECH STACK</div>'
    + '<div class="pmod-tech-row">' + p.tech.map(function (t) { return '<span class="pmod-tp">' + t + '</span>'; }).join('') + '</div></div>'
    + tlHtml
    + '<div class="pmod-sec"><div class="pmod-sec-title">// ACCESS</div>'
    + '<div class="pmod-links">' + linksHtml + '</div></div>';
  document.getElementById('proj-modal').classList.add('open');
}
function closeProjModal() { document.getElementById('proj-modal').classList.remove('open'); }

/* ── CLIPS ── */
function buildClips() {
  var g = document.getElementById('clips-grid'); g.innerHTML = '';
  if (!DATA.clips.length) {
    g.innerHTML = '<div style="grid-column:1/-1;padding:30px;text-align:center;border:1px solid var(--border);background:var(--w05)"><div style="font-size:24px;opacity:.2;margin-bottom:10px">&#x1F4F9;</div><div style="font-family:var(--hud);font-size:10px;letter-spacing:2px;color:var(--w40)">NO CLIPS YET</div><div style="font-size:10px;color:var(--w20);margin-top:6px">Check back later.</div></div>';
    return;
  }
  DATA.clips.forEach(function (clip) {
    var d = document.createElement('div'); d.className = 'clip-card';
    var thumbHtml = clip.thumb ? '<img src="' + clip.thumb + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">' : '';
    d.innerHTML = '<div class="clip-thumb">' + thumbHtml + '<div class="clip-thumb-bg"></div>'
      + '<span class="clip-pi">&#x25BA;</span>'
      + '<div class="clip-ov"><div class="play-ring">&#x25BA;</div></div></div>'
      + '<div class="clip-info"><span class="clip-badge">' + clip.cat + '</span>'
      + '<div class="clip-title">' + clip.title + '</div>'
      + '<div class="clip-sub">' + (clip.type === 'twitch' ? 'Twitch \u2014 Live when online' : 'YouTube Video') + '</div></div>';
    (function (c, el) { el.addEventListener('click', function () { openClip(c, el); }); })(clip, d);
    g.appendChild(d);
  });
}
function openClip(clip, el) {
  var modal = document.getElementById('clip-modal'), mb = document.getElementById('cmod-body');
  document.getElementById('cmod-title').textContent = clip.title;
  if (clip.type === 'twitch') {
    mb.innerHTML = '<iframe class="vframe" src="https://player.twitch.tv/?channel=' + clip.src + '&parent=' + location.hostname + '" allowfullscreen></iframe>';
  } else if (clip.type === 'youtube' && clip.src) {
    mb.innerHTML = '<iframe class="vframe" src="https://www.youtube.com/embed/' + clip.src + '?autoplay=1" allow="autoplay;encrypted-media" allowfullscreen></iframe>';
  } else {
    mb.innerHTML = '<div class="no-src"><span>&#x1F4E1;</span><span>NO SOURCE CONFIGURED</span><span style="font-size:8px;opacity:.4">Add a videoId to DATA.clips</span></div>';
  }
  modal.classList.add('open'); SFX.nav(); unlockAch('clips', el); hitCombo();
}
function closeClipModal() { document.getElementById('clip-modal').classList.remove('open'); document.getElementById('cmod-body').innerHTML = ''; }

/* ── ACHIEVEMENTS ── */
function refreshAch() {
  var g = document.getElementById('ach-grid'); g.innerHTML = '';
  var earned = DATA.achievements.filter(function (a) { return a.earn; }).length, total = DATA.achievements.length;
  document.getElementById('ach-counter').textContent = earned + ' / ' + total + ' UNLOCKED';
  document.getElementById('ach-overall-bar').style.width = Math.round((earned / total) * 100) + '%';
  DATA.achievements.forEach(function (a) {
    var d = document.createElement('div'); d.className = 'ach-card' + (a.earn ? ' earned' : '');
    var bodyText = a.earn ? a.desc : (a.secret ? 'Hidden achievement &mdash; keep exploring to find it' : a.hint);
    d.innerHTML = (a.earn ? '<div class="ach-xp-badge">+' + a.xp + 'XP</div>' : '<div class="ach-lock">&#x1F512;</div>')
      + '<div class="ach-icon">' + (a.earn ? a.icon : (a.secret ? '&#x2753;' : a.icon)) + '</div>'
      + '<div class="ach-name">' + (a.earn || !a.secret ? a.name : '???') + '</div>'
      + '<div class="ach-desc">' + bodyText + '</div>';
    g.appendChild(d);
  });
}

/* ── SOCIALS ── */
var socSVG = {
  discord: '<svg class="soc-svg" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.052a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>',
  github: '<svg class="soc-svg" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
  twitch: '<svg class="soc-svg" viewBox="0 0 24 24"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>',
};
function buildSocials() {
  var g = document.getElementById('soc-grid');
  DATA.socials.forEach(function (s) {
    var a = document.createElement('a'); a.className = 'soc-card'; a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = '<div class="soc-icon">' + (socSVG[s.icon] || '') + '</div>'
      + '<div class="soc-name">' + s.name + '</div>'
      + '<div class="soc-handle">' + s.handle + '</div>'
      + '<div class="soc-action">' + s.sub + '</div>';
    a.addEventListener('click', function () { SFX.click(); hitCombo(); unlockAch('social'); });
    g.appendChild(a);
  });
}

/* ── HACKING TERMINAL ── */
var HACK_STEPS = [
  { cmd: 'help', resp: 'AVAILABLE COMMANDS: <span class="hok">scan</span> | <span class="hok">auth</span> | <span class="hok">decrypt</span> | <span class="hok">help</span>' },
  { cmd: 'scan', resp: 'SCANNING NETWORK... <span class="hok">3 nodes found</span>. Encrypted payload at NODE-4. Run <span class="hok">auth</span> to authenticate.' },
  { cmd: 'auth', resp: 'AUTHENTICATING... <span class="hok">ACCESS GRANTED</span>. Token: <span class="hdim">SS-7F3A-X</span>. Run <span class="hok">decrypt</span> to decode.' },
  { cmd: 'decrypt', resp: '<span class="hok">DECRYPTION COMPLETE. CLASSIFIED PROJECT UNLOCKED.</span>' },
];
var hackStep = 0, hackDone = false;
function openHack() {
  document.getElementById('hack-modal').classList.add('open');
  buildHackDots();
  var out = document.getElementById('hack-out');
  out.innerHTML = '<div class="hdim">SECURE TERMINAL v2.1 \u2014 SAMSCRIPT INFILTRATION SYSTEM</div>'
    + '<div class="hdim">Type <span class="hok">help</span> to begin the breach sequence.</div>';
  document.getElementById('hack-in').focus();
}
function closeHack() { document.getElementById('hack-modal').classList.remove('open'); }
function buildHackDots() {
  var d = document.getElementById('hack-dots'); d.innerHTML = '';
  HACK_STEPS.forEach(function (_, i) {
    var dot = document.createElement('div'); dot.className = 'hack-dot' + (hackStep > i ? ' done' : ''); d.appendChild(dot);
  });
}
function hackKey(e) {
  if (e.key !== 'Enter') return;
  var inp = document.getElementById('hack-in'), cmd = inp.value.trim().toLowerCase(); inp.value = '';
  if (!cmd) return;
  var out = document.getElementById('hack-out');
  var line = document.createElement('div');
  line.innerHTML = '<span class="hinf">root@samscript:~$</span> ' + escHtml(cmd);
  out.appendChild(line);
  if (hackDone) {
    var r = document.createElement('div'); r.className = 'herr'; r.textContent = 'SYSTEM ALREADY COMPROMISED.'; out.appendChild(r);
    out.scrollTop = out.scrollHeight; return;
  }
  var expected = HACK_STEPS[hackStep];
  if (expected && cmd === expected.cmd) {
    SFX.hack(true);
    var r = document.createElement('div'); r.innerHTML = expected.resp; out.appendChild(r);
    hackStep++; buildHackDots();
    if (hackStep >= HACK_STEPS.length) {
      hackDone = true;
      document.getElementById('hack-banner').classList.add('show');
      unlockAch('hacked');
      var proj = DATA.projects.find(function (p) { return p.locked; });
      if (proj) {
        proj.locked = false;
        addXP(proj.xp || 100, proj.name + ' UNLOCKED');
      }
      toast('\uD83D\uDD13 CLASSIFIED PROJECT DECRYPTED', 'hack');
      setTimeout(function () { closeHack(); renderProjects(); }, 2000);
    }
  } else if (cmd === 'help' && hackStep === 0) {
    SFX.hack(true);
    var r = document.createElement('div'); r.innerHTML = HACK_STEPS[0].resp; out.appendChild(r);
  } else {
    SFX.hack(false);
    var r = document.createElement('div'); r.className = 'herr'; r.textContent = 'COMMAND NOT RECOGNISED. Type help.'; out.appendChild(r);
  }
  out.scrollTop = out.scrollHeight;
}

/* ── BOOT ── */
var BOOT_LINES = [
  'LOADING KERNEL MODULES...', 'ESTABLISHING NEURAL LINK...',
  'CONNECTING TO MISSION DATABASE...', 'CALIBRATING HOLOGRAPHIC EMITTERS...',
  'COMPILING SKILL MATRIX...', 'LOADING ACHIEVEMENT VAULT...',
  'OPERATOR: SAMSCRIPT // AUTHENTICATED',
  'ALL SYSTEMS NOMINAL — WELCOME BACK',
];
function runBoot() {
  var fill = document.getElementById('boot-fill'), log = document.getElementById('boot-log'), label = document.getElementById('boot-label');
  var step = 0; SFX.boot();
  function tick() {
    if (step >= BOOT_LINES.length) { setTimeout(endBoot, 400); return; }
    var pct = Math.round(((step + 1) / BOOT_LINES.length) * 100);
    fill.style.width = pct + '%'; log.textContent = '> ' + BOOT_LINES[step];
    label.textContent = pct < 100 ? 'INITIALISING... ' + pct + '%' : 'BOOT COMPLETE';
    step++; setTimeout(tick, 260 + Math.random() * 160);
  }
  tick();
}
function endBoot() {
  document.getElementById('boot').classList.add('boot-hidden');
  document.getElementById('app').classList.add('visible');
  setTimeout(function () {
    unlockAch('boot');
    initSkillBars();
    typeHeroName();
    typeTerminal();
    animHolos();
    buildSkillTree();
    checkStreak();
  }, 800);
}

/* ── SKILLS ── */
function buildSkills() {
  var c = document.getElementById('skill-list');
  DATA.skills.forEach(function (sk) {
    var d = document.createElement('div'); d.className = 'skill-item';
    d.innerHTML = '<div class="skill-top"><span class="skill-name-txt">' + sk.name + '</span><span class="skill-pct">' + sk.pct + '%</span></div>'
      + '<div class="skill-track"><div class="skill-bar" data-w="' + sk.pct + '"></div></div>';
    c.appendChild(d);
  });
}
function initSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(function (b) { setTimeout(function () { b.style.width = b.dataset.w + '%'; }, 120); });
}

/* ── INIT ── */
async function initApp() {
  buildSkills();
  buildSocials();
  refreshAch();
  const [projects, clips] = await Promise.all([loadProjectsFromDb(), loadClipsFromDb()]);
  DATA.projects = projects;
  DATA.clips = clips;
  buildProjects();
  buildClips();
  runBoot();
}
initApp();