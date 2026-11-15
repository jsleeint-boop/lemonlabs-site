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
