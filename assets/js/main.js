const BASE_PATH = '/happily-hued';

function withBasePath(path = '') {
  if (!path.startsWith('/')) {
    return `${BASE_PATH}/${path}`.replace(/\/+/g, '/');
  }
  return `${BASE_PATH}${path}`.replace(/\/+/g, '/');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

function initTheme() {
  const stored = localStorage.getItem('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || preferred;
  applyTheme(theme);

  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

function setFooterYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

async function fetchArtData() {
  const response = await fetch(withBasePath('/data/artworks.json'));
  if (!response.ok) throw new Error('Failed to fetch artworks data.');
  return response.json();
}

window.HH = {
  BASE_PATH,
  withBasePath,
  getUrlParam,
  fetchArtData
};

initTheme();
setFooterYear();
