/* ============================================================
   THEME
   ============================================================ */
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}


/* ============================================================
   MOBILE NAV
   ============================================================ */
const navToggle = document.querySelector('.nav-toggle');
const mainNav   = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (mainNav.classList.contains('open') &&
        !mainNav.contains(e.target) &&
        !navToggle.contains(e.target)) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ============================================================
   FOOTER YEAR
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================================
   SCROLL SPY
   ============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.bracket-link');

const spyObs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.25 }
);
sections.forEach(s => spyObs.observe(s));


/* ============================================================
   FADE-IN
   ============================================================ */
const fadeObs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
);

function watch(el) {
  el.classList.add('fade-in');
  fadeObs.observe(el);
}


/* ============================================================
   HELPERS
   ============================================================ */
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  } catch (err) {
    console.warn(`Could not load ${path}:`, err.message);
    return null;
  }
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isTodo(str) {
  return !str || String(str).startsWith('TODO');
}


/* ============================================================
   RENDER: SKILLS
   ============================================================ */
function renderSkills(data) {
  const grid = document.getElementById('skills-groups');
  if (!data || !grid) return;

  grid.innerHTML = data.map(group => `
    <div class="skill-group">
      <p class="skill-group-title">${esc(group.category)}</p>
      <div class="skill-chips">
        ${group.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}


/* ============================================================
   RENDER: PROJECTS (horizontal scroll cards)
   ============================================================ */
function renderProjects(data) {
  const scroll = document.getElementById('projects-scroll');
  const wrap   = document.getElementById('projects-scroll-wrap');
  if (!data || !scroll) return;

  scroll.innerHTML = data.map(p => {
    const hasRepo = p.repo && !isTodo(p.repo);
    const hasDemo = p.demo && !isTodo(p.demo);
    const hasLinks = hasRepo || hasDemo;
    const hasStack = p.stack && p.stack.some(t => !isTodo(t));

    return `
      <div class="project-card" id="${esc(p.id)}">
        ${p.year ? `<p class="project-card-year">${esc(p.year)}</p>` : ''}
        <h3 class="project-card-title">${esc(p.title)}</h3>
        ${!isTodo(p.summary) ? `<p class="project-card-summary">${esc(p.summary)}</p>` : ''}
        <div class="project-card-divider"></div>
        ${hasStack ? `
        <div class="project-card-stack">
          ${p.stack.filter(t => !isTodo(t)).map(t => `<span class="chip">${esc(t)}</span>`).join('')}
        </div>` : ''}
        ${hasLinks ? `
        <div class="project-card-links">
          ${hasRepo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer" class="project-card-link" aria-label="Source code">Source</a>` : ''}
          ${hasDemo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer" class="project-card-link" aria-label="Live demo">Demo</a>` : ''}
        </div>` : ''}
      </div>
    `;
  }).join('');

  if (wrap) {
    document.getElementById('proj-prev')?.addEventListener('click', () => {
      wrap.scrollBy({ left: -320, behavior: 'smooth' });
    });
    document.getElementById('proj-next')?.addEventListener('click', () => {
      wrap.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }
}


/* ============================================================
   RENDER: HACKATHONS (table)
   ============================================================ */
function renderHackathons(data) {
  const tbody = document.getElementById('hackathons-tbody');
  if (!data || !tbody) return;

  const entries = data.entries || data;

  tbody.innerHTML = entries.map((h, i) => `
    <tr>
      <td class="hack-ref">HACK-${String(i + 1).padStart(2, '0')}</td>
      <td class="hack-venue">${esc(h.name)}</td>
      <td class="hack-year">${!isTodo(h.date) ? esc(h.date) : '<span style="color:var(--muted)">—</span>'}</td>
      <td class="hack-result">${!isTodo(h.rank) ? `<span class="chip">${esc(h.rank)}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
      <td class="hack-desc">${!isTodo(h.what) ? esc(h.what) : '<span style="color:var(--muted)">TODO</span>'}</td>
    </tr>
  `).join('');
}


/* ============================================================
   RENDER: EXPERIENCE (zigzag timeline)
   ============================================================ */
function renderExperience(data) {
  const list = document.getElementById('experience-timeline');
  if (!data || !list) return;

  list.innerHTML = data.map(e => {
    const bullets = e.bullets.filter(b => !isTodo(b));
    return `
      <li class="timeline-item">
        <div class="timeline-content">
          <p class="timeline-year">${esc(e.dates)}${e.location ? ` &nbsp;·&nbsp; ${esc(e.location)}` : ''}</p>
          ${e.url
            ? `<a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer" class="timeline-org">${esc(e.org)}</a>`
            : `<span class="timeline-org">${esc(e.org)}</span>`
          }
          <p class="timeline-role">${esc(e.role)}</p>
          ${bullets.length ? `
          <ul class="timeline-bullets" aria-label="Responsibilities at ${esc(e.org)}">
            ${bullets.map(b => `<li class="timeline-bullet"><span class="arrow" aria-hidden="true">→</span>${esc(b)}</li>`).join('')}
          </ul>` : ''}
        </div>
      </li>
    `;
  }).join('');

  list.querySelectorAll('.timeline-item').forEach(watch);
}


/* ============================================================
   RENDER: SPORT
   ============================================================ */
function renderSport(data) {
  const list = document.getElementById('sport-list');
  if (!data || !list) return;

  const entries = data.entries || data;

  list.innerHTML = entries.map(s => `
    <li class="sport-item">
      <span class="sport-discipline">${esc(s.discipline)}</span>
      <span class="sport-detail">${esc(s.detail)}</span>
      ${s.stat ? `<span class="sport-stat">${esc(s.stat)}</span>` : ''}
      ${s.note && !isTodo(s.note) ? `<span class="sport-note">${esc(s.note)}</span>` : ''}
    </li>
  `).join('');
}


/* ============================================================
   RENDER: ACADEMICS (used by academics.html only)
   ============================================================ */
function renderAcademics(data) {
  const container = document.getElementById('academics-list');
  if (!data || !container) return;

  const levels = data.levels || data;

  container.innerHTML = levels.map(level => `
    <li class="academics-level">
      <div class="academics-level-header">
        <span class="academics-level-name">${esc(level.level)}</span>
        <span class="academics-level-institution">${esc(level.institution)}</span>
      </div>
      <ul class="academics-courses">
        ${level.courses.map(c => `
          <li class="academics-item">
            ${c.code ? `<span class="academics-code mono">${esc(c.code)}</span>` : ''}
            <span class="academics-title">${esc(c.title)}</span>
            <p class="academics-desc">${esc(c.description)}</p>
          </li>
        `).join('')}
      </ul>
    </li>
  `).join('');

  container.querySelectorAll('.academics-item').forEach(watch);
}


/* ============================================================
   INIT
   ============================================================ */
(async function init() {
  const [skills, projects, hackathons, experience, sport, academics] = await Promise.all([
    loadJSON('data/skills.json'),
    loadJSON('data/projects.json'),
    loadJSON('data/hackathons.json'),
    loadJSON('data/experience.json'),
    loadJSON('data/sport.json'),
    loadJSON('data/academics.json'),
  ]);

  renderSkills(skills);
  renderProjects(projects);
  renderHackathons(hackathons);
  renderExperience(experience);
  renderSport(sport);
  renderAcademics(academics);
})();
