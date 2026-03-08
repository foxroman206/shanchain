// src/api/client.js  – Frontend API client for GoodChain backend
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('gc_token');
}

async function request(method, path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data });
  return data;
}

const get  = (path)       => request('GET',    path);
const post = (path, body) => request('POST',   path, body);
const patch= (path, body) => request('PATCH',  path, body);
const del  = (path)       => request('DELETE', path);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  register: (data) => post('/auth/register', data),
  login:    (data) => post('/auth/login',    data),
  sendOtp:  (phone) => post('/auth/send-otp', { phone }),
  verifyOtp:(phone, otp) => post('/auth/verify-otp', { phone, otp }),
  me:       () => get('/auth/me'),
  update:   (data) => patch('/auth/me', data),

  saveToken(token) { localStorage.setItem('gc_token', token); },
  clearToken()     { localStorage.removeItem('gc_token'); },
  hasToken()       { return !!getToken(); },
};

// ── Projects ──────────────────────────────────────────────────────────────────
export const projects = {
  list:    (params = {}) => get('/projects?' + new URLSearchParams(params)),
  get:     (id)          => get('/projects/' + id),
  create:  (data)        => post('/projects', data),
  update:  (id, data)    => patch('/projects/' + id, data),
  milestones: (id)       => get('/projects/' + id + '/milestones'),
  completeMilestone: (projectId, msId, data) =>
    post('/projects/' + projectId + '/milestones/' + msId + '/complete', data),
};

// ── Donations ─────────────────────────────────────────────────────────────────
export const donations = {
  create:  (data) => post('/donations', data),
  myHistory: (params = {}) => get('/donations?' + new URLSearchParams(params)),
  forProject: (projectId) => get('/donations/project/' + projectId),
};

// ── DAO ───────────────────────────────────────────────────────────────────────
export const dao = {
  proposals:     (params = {}) => get('/dao/proposals?' + new URLSearchParams(params)),
  getProposal:   (id)          => get('/dao/proposals/' + id),
  createProposal:(data)        => post('/dao/proposals', data),
  vote:          (id, vote)    => post('/dao/proposals/' + id + '/vote', { vote }),
  freeze:        (id)          => post('/dao/proposals/' + id + '/freeze', {}),
};

// ── AI ────────────────────────────────────────────────────────────────────────
export const ai = {
  stats:    () => get('/ai/stats'),
  alerts:   (params = {}) => get('/ai/alerts?' + new URLSearchParams(params)),
  weights:  () => get('/ai/weights'),
  rescore:  (projectId) => post('/ai/score/' + projectId, {}),
  resolveAlert: (id) => post('/ai/alerts/' + id + '/resolve', {}),
  // Python AI service (proxied through Node.js)
  search:       (query, top_k = 5) => post('/ai/search', { query, top_k }),
  chat:         (message, history = []) => post('/ai/chat', { message, history }),
  fraudText:    (text, category = '') => post('/ai/fraud/text', { text, category }),
  fraudProject: (id) => post('/ai/fraud/project/' + id, {}),
  scanNews:     (text) => post('/ai/scan/news', { text }),
  scoreProject: (id) => post('/ai/score/' + id, {}),
  status:       () => get('/ai/status'),
};

// ── WebSocket ─────────────────────────────────────────────────────────────────
export function connectWS(onMessage) {
  const wsUrl = (BASE.replace('http','ws')) + '/ws';
  const ws = new WebSocket(wsUrl);
  ws.onmessage = (e) => { try { onMessage(JSON.parse(e.data)); } catch {} };
  ws.onerror   = (e) => console.warn('[WS] error', e);
  ws.onclose   = ()  => setTimeout(() => connectWS(onMessage), 5000); // auto-reconnect
  return ws;
}
