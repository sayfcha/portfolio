/* ============================================================
   THEME TOGGLE
   ============================================================ */
const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});


/* ============================================================
   MOBILE NAV
   ============================================================ */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ============================================================
   FOOTER YEAR
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();


/* ============================================================
   SCROLL SPY (active nav link)
   ============================================================ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.25 }
);

sections.forEach(s => spyObserver.observe(s));


/* ============================================================
   FADE-IN ON SCROLL
   ============================================================ */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

function watch(el) {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
}


/* ============================================================
   JSON LOADER
   ============================================================ */
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  } catch (err) {
    console.warn(`Could not load ${path}:`, err.message);
    return null;
  }
}


/* ============================================================
   ESCAPE HELPER (prevent XSS when inserting user data into HTML)
   ============================================================ */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ============================================================
   RENDER: SKILLS
   ============================================================ */
function renderSkills(data) {
  const grid = document.getElementById('skills-grid');
  if (!data || !grid) return;

  grid.innerHTML = data.map(group => `
    <div class="skill-card">
      <p class="skill-card-title">${esc(group.category)}</p>
      <div class="skill-tags">
        ${group.tags.map(tag => `<span class="chip">${esc(tag)}</span>`).join('')}
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.skill-card').forEach(watch);
}


/* ============================================================
   RENDER: PROJECTS
   ============================================================ */
const iconGitHub = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.23 3.44 9.67 8.21 11.23.6.11.82-.26.82-.57 0-.28-.01-1.02-.01-2-.3.06-1.19.26-1.46.26-2.27 0-2.8-1.74-2.8-1.74-.38-.96-.92-1.22-.92-1.22-.75-.51.06-.5.06-.5.83.06 1.27.85 1.27.85.74 1.26 1.93.9 2.4.69.08-.53.29-.9.52-1.1-1.84-.21-3.77-.92-3.77-4.09 0-.9.33-1.64.85-2.22-.09-.21-.37-1.05.08-2.18 0 0 .69-.22 2.25.84A7.9 7.9 0 0 1 12 6.84c.7 0 1.4.09 2.06.27 1.56-1.06 2.25-.84 2.25-.84.45 1.13.17 1.97.08 2.18.53.58.85 1.32.85 2.22 0 3.18-1.94 3.88-3.79 4.08.3.26.56.77.56 1.55 0 1.12-.01 2.02-.01 2.29 0 .31.22.68.83.57C20.57 21.96 24 17.52 24 12.29 24 5.78 18.63.5 12 .5z"/></svg>`;

const iconExternal = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

function isTodo(str) {
  return !str || str.startsWith('TODO');
}

function renderProjects(data) {
  const grid = document.getElementById('projects-grid');
  if (!data || !grid) return;

  grid.innerHTML = data.map(p => {
    const hasRepo = p.repo && !isTodo(p.repo);
    const hasDemo = p.demo && !isTodo(p.demo);
    const hasLinks = hasRepo || hasDemo;

    return `
      <article class="project-card" id="${esc(p.id)}">
        <h3 class="project-title">${esc(p.title)}</h3>
        <p class="project-summary">${esc(p.summary)}</p>
        <div class="project-stack">
          ${p.stack.map(t => `<span class="chip">${esc(t)}</span>`).join('')}
        </div>
        <div class="project-psr">
          <div class="psr-row">
            <p class="psr-label">Problem</p>
            <p class="psr-text">${esc(p.problem)}</p>
          </div>
          <div class="psr-row">
            <p class="psr-label">Solution</p>
            <p class="psr-text">${esc(p.solution)}</p>
          </div>
          <div class="psr-row">
            <p class="psr-label">Result</p>
            <p class="psr-text">${esc(p.result)}</p>
          </div>
        </div>
        ${hasLinks ? `
        <div class="project-links">
          ${hasRepo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Source code for ${esc(p.title)}">${iconGitHub} Source</a>` : ''}
          ${hasDemo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Live demo for ${esc(p.title)}">${iconExternal} Demo</a>` : ''}
        </div>` : ''}
      </article>
    `;
  }).join('');

  grid.querySelectorAll('.project-card').forEach(watch);
}


/* ============================================================
   RENDER: EXPERIENCE
   ============================================================ */
function renderExperience(data) {
  const list = document.getElementById('experience-timeline');
  if (!data || !list) return;

  list.innerHTML = data.map(e => `
    <li class="timeline-item">
      <div class="timeline-header">
        <span class="timeline-role">${esc(e.role)}</span>
        <span class="timeline-sep" aria-hidden="true">at</span>
        ${e.url
          ? `<a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer" class="timeline-org">${esc(e.org)}</a>`
          : `<span class="timeline-org">${esc(e.org)}</span>`
        }
      </div>
      <div class="timeline-meta">
        <time class="timeline-dates">${esc(e.dates)}</time>
        ${e.location ? `<span class="timeline-location">${esc(e.location)}</span>` : ''}
      </div>
      <ul class="timeline-bullets" aria-label="Responsibilities at ${esc(e.org)}">
        ${e.bullets.map(b => `<li class="timeline-bullet">${esc(b)}</li>`).join('')}
      </ul>
    </li>
  `).join('');

  list.querySelectorAll('.timeline-item').forEach(watch);
}


/* ============================================================
   RENDER: ACADEMICS
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
   RENDER: HACKATHONS
   ============================================================ */
function renderHackathons(data) {
  const list = document.getElementById('hackathons-list');
  if (!data || !list) return;

  const entries = data.entries || data;

  list.innerHTML = entries.map(h => `
    <li class="hackathon-item">
      <div class="hackathon-top">
        <span class="hackathon-name">${esc(h.name)}</span>
        ${h.rank ? `<span class="hackathon-rank">${esc(h.rank)}</span>` : ''}
      </div>
      <p class="hackathon-meta">
        <span>${esc(h.organizer)}</span>
        ${h.date     ? `<span>${esc(h.date)}</span>`     : ''}
        ${h.location ? `<span>${esc(h.location)}</span>` : ''}
      </p>
      ${h.what ? `<p class="hackathon-what">${esc(h.what)}</p>` : ''}
      ${h.stack && h.stack.length ? `
      <div class="hackathon-stack">
        ${h.stack.map(t => `<span class="chip">${esc(t)}</span>`).join('')}
      </div>` : ''}
      ${h.link && !isTodo(h.link) ? `
      <a href="${esc(h.link)}" target="_blank" rel="noopener noreferrer" class="hackathon-link" aria-label="View project for ${esc(h.name)}">
        ${iconExternal} View project
      </a>` : ''}
    </li>
  `).join('');

  list.querySelectorAll('.hackathon-item').forEach(watch);
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
      ${s.note ? `<span class="sport-note">${esc(s.note)}</span>` : ''}
    </li>
  `).join('');
}


/* ============================================================
   INIT: LOAD ALL DATA IN PARALLEL
   ============================================================ */
(async function init() {
  const [skills, projects, hackathons, experience, academics, sport] = await Promise.all([
    loadJSON('data/skills.json'),
    loadJSON('data/projects.json'),
    loadJSON('data/hackathons.json'),
    loadJSON('data/experience.json'),
    loadJSON('data/academics.json'),
    loadJSON('data/sport.json'),
  ]);

  renderSkills(skills);
  renderProjects(projects);
  renderHackathons(hackathons);
  renderExperience(experience);
  renderAcademics(academics);
  renderSport(sport);
})();
