// LemonLabs landing page: no build tools or external JavaScript libraries needed.
// Replace the placeholder project copy with your confirmed public information.

const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const yearElement = document.querySelector('#year');

if (yearElement) yearElement.textContent = String(new Date().getFullYear());

// Theme preference is stored locally. The site still works if storage is unavailable.
let savedTheme = null;
try { savedTheme = localStorage.getItem('lemonlabs-theme'); } catch (_) { /* privacy mode */ }
if (savedTheme === 'dark') root.dataset.theme = 'dark';

function updateThemeLabel() {
  const dark = root.dataset.theme === 'dark';
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', dark ? '라이트 모드 켜기' : '다크 모드 켜기');
    themeToggle.setAttribute('aria-pressed', String(dark));
  }
}
updateThemeLabel();
themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('lemonlabs-theme', root.dataset.theme); } catch (_) { /* privacy mode */ }
  updateThemeLabel();
});

// Mobile navigation uses a real button with accessible expanded state.
function setMenuOpen(open) {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  mobileNav.hidden = !open;
}
menuToggle?.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenuOpen(false)));
window.addEventListener('resize', () => { if (innerWidth > 760) setMenuOpen(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') setMenuOpen(false);
});

// Content shown in the details dialog. Edit this map to update the project copy.
const projects = {
  naite: {
    kicker: '01 / AI EDUCATION',
    title: 'nAIté',
    description: '대격변 AI 시대, 나이테와 함께 한겹씩 성장해가며 내가 원하는 미래를 쟁취하세요.',
    tags: 'AI Education · Prompting · Workflow'
  },
  studio: {
    kicker: '02 / COLLEGE',
    title: 'narU',
    description: '나루(narU)는 대학 진학을 준비하는 학생이 건너야 할 강을 함께 건너는 레몬랩스의 입시 교육 브랜드입니다. 나루논술연구소에서는 논술과 글쓰기의 기본기를 다지고, 나루크루즈캠프 SCC에서는 집중 캠프로 실전 감각을 끌어올립니다. 한 사람 한 사람의 진로에 맞춘 안내로 원하는 대학까지 이어 드립니다.',
    tags: 'College · Essay · Camp'
  },
  party: {
    kicker: '03 / PLAY',
    title: 'LEMONori',
    description: '내 손 안에서 나만의 세상을 키워보세요. 장난감, 생활용품 등 특색 넘치는 제품으로 일상에 즐거움을 더하는 레몬랩스의 놀이 브랜드입니다.',
    tags: 'Play · Toys · Lifestyle'
  },
  lab: {
    kicker: '04 / THE NEXT THING',
    title: 'Open Lab',
    description: '아직 완성된 이름이 없어도 괜찮습니다. 문제를 관찰하고, 작은 프로토타입으로 가설을 시험하고, 의미 있는 결과가 보이면 제품과 프로젝트로 발전시킵니다.',
    tags: 'Research · Prototype · Experiment'
  }
};

const projectDialog = document.querySelector('#project-dialog');
const contactDialog = document.querySelector('#contact-dialog');

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}
function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

document.querySelectorAll('[data-open-project]').forEach(button => {
  button.addEventListener('click', () => {
    const item = projects[button.dataset.openProject];
    if (!item || !projectDialog) return;
    document.querySelector('#dialog-kicker').textContent = item.kicker;
    document.querySelector('#dialog-title').textContent = item.title;
    document.querySelector('#dialog-description').textContent = item.description;
    document.querySelector('#dialog-tags').textContent = item.tags;
    openDialog(projectDialog);
  });
});

document.querySelector('#contact-button')?.addEventListener('click', () => openDialog(contactDialog));
document.querySelectorAll('.info-dialog').forEach(dialog => {
  dialog.querySelectorAll('.dialog-close, .dialog-confirm').forEach(btn => btn.addEventListener('click', () => closeDialog(dialog)));
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); });
});

// Progressive enhancement: animations are skipped for users who request less motion.
const revealItems = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Brand pages: enquiry form (no backend yet) and product filter.
document.querySelectorAll('.apply-form').forEach(form => {
  const note = form.querySelector('.form-note');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.querySelector('[name="name"]');
    const phone = form.querySelector('[name="phone"]');
    const agree = form.querySelector('[name="agree"]');
    const missing = [];
    if (!name?.value.trim()) missing.push('이름');
    if (!phone?.value.trim()) missing.push('연락처');
    if (agree && !agree.checked) missing.push('개인정보 동의');
    if (!note) return;
    if (missing.length) {
      note.textContent = `${missing.join(', ')}을(를) 확인해 주세요.`;
      note.classList.add('is-error');
      return;
    }
    note.classList.remove('is-error');
    note.textContent = `${name.value.trim()}님, 신청 내용을 받았습니다. 정식 오픈 전이라 저장되지는 않으니 급한 문의는 전화로 부탁드립니다.`;
    form.reset();
  });
});

const filterChips = document.querySelectorAll('.filter-chip');
filterChips.forEach(chip => chip.addEventListener('click', () => {
  filterChips.forEach(c => c.classList.toggle('is-active', c === chip));
  const want = chip.dataset.filter;
  document.querySelectorAll('.product-card').forEach(card => {
    card.classList.toggle('is-hidden', want !== 'all' && card.dataset.cat !== want);
  });
}));

// Brand pages always open at the very top unless a section hash is given.
if (document.body.classList.contains('brand-page') && (!location.hash || location.hash === '#top')) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  window.addEventListener('load', () => window.scrollTo(0, 0), { once: true });
}

// Brand pages v2: pointer-reactive motion (fine pointers only, respects reduced motion).
(() => {
  const body = document.body;
  if (!body.classList.contains('brand-page')) return;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scrollspy for the desktop nav.
  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  const targets = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    targets.forEach(t => spy.observe(t));
  }

  if (!fine || reduce) return;

  // Hero spotlight follows the pointer.
  document.querySelectorAll('[data-spot]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
    });
  });

  // 3D tilt toward the pointer.
  document.querySelectorAll('[data-tilt]').forEach(el => {
    const max = parseFloat(el.dataset.tilt) || 5;
    const target = el.matches('.brand-art') ? el.querySelector('svg') : el;
    if (!target) return;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      target.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-6px)`;
    });
    el.addEventListener('pointerleave', () => { target.style.transform = ''; });
  });

  // Magnetic buttons.
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${(x * .18).toFixed(1)}px, ${(y * .25).toFixed(1)}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });

  // Cursor ring.
  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    const tick = () => { cx += (tx - cx) * .18; cy += (ty - cy) * .18; ring.style.left = cx + 'px'; ring.style.top = cy + 'px'; raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; ring.classList.add('is-on'); if (!raf) tick(); });
    window.addEventListener('pointerleave', () => ring.classList.remove('is-on'));
    document.addEventListener('pointerover', e => ring.classList.toggle('is-hover', !!e.target.closest('a, button, .filter-chip, .program-card, .product-card')));
  }
})();
