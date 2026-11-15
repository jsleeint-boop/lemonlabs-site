// LemonLabs landing page: no build tools or external JavaScript libraries needed.
// Shared by every page: theme toggle, mobile menu, external-link config, contact form, scroll reveal.

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

// Dialog helpers (used for the "coming soon" notice on links that are not connected yet).
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
document.querySelectorAll('.info-dialog').forEach(dialog => {
  dialog.querySelectorAll('.dialog-close, .dialog-confirm').forEach(btn => btn.addEventListener('click', () => closeDialog(dialog)));
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); });
});

// External links come from config.js. An empty value means "not connected yet":
// the link shows a SOON badge and opens a notice instead of navigating.
const config = window.LEMON_CONFIG || {};
const extLinks = config.links || {};
const pendingDialog = document.querySelector('#pending-dialog');
document.querySelectorAll('[data-ext]').forEach(link => {
  const url = extLinks[link.dataset.ext];
  if (url) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.classList.remove('is-pending');
    return;
  }
  if (link.hasAttribute('data-hide-if-empty')) { link.hidden = true; return; }
  link.classList.add('is-pending');
  link.setAttribute('aria-describedby', 'pending-dialog-title');
  link.addEventListener('click', event => {
    event.preventDefault();
    const label = document.querySelector('#pending-dialog-label');
    if (label) label.textContent = link.dataset.extLabel || link.textContent.trim();
    if (pendingDialog) openDialog(pendingDialog);
  });
});

// Contact page: preselect the topic from ?topic=... and show it in the hero.
const topicSelect = document.querySelector('#f-topic');
if (topicSelect) {
  const topic = new URLSearchParams(location.search).get('topic');
  const option = topic && topicSelect.querySelector(`option[value="${CSS.escape(topic)}"]`);
  if (option) {
    topicSelect.value = topic;
    const pill = document.querySelector('#topic-pill');
    const pillLabel = document.querySelector('#topic-pill-label');
    if (pill && pillLabel) { pillLabel.textContent = option.textContent; pill.hidden = false; }
  }
}

// Contact form: posts to config.formEndpoint when set, otherwise opens the visitor's mail app
// with the message prefilled. No server is required for the mail fallback.
const inquiryForm = document.querySelector('#inquiry-form');
if (inquiryForm) {
  const status = document.querySelector('#form-status');
  const submit = inquiryForm.querySelector('.form-submit');
  const setStatus = (text, state) => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('is-error', state === 'error');
    status.classList.toggle('is-ok', state === 'ok');
  };
  inquiryForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!inquiryForm.checkValidity()) {
      inquiryForm.reportValidity();
      setStatus('필수 항목을 확인해 주세요.', 'error');
      return;
    }
    const data = new FormData(inquiryForm);
    if (data.get('website')) return; // honeypot filled by a bot
    const topicLabel = topicSelect?.selectedOptions[0]?.textContent || '일반 문의';
    const name = String(data.get('name') || '').trim();
    const subject = `[LemonLabs 문의] ${topicLabel} - ${name}`;
    const body = [
      `문의 유형: ${topicLabel}`,
      `이름: ${name}`,
      `연락처: ${data.get('phone') || '-'}`,
      `이메일: ${data.get('email')}`,
      '',
      '문의 내용:',
      String(data.get('message') || '').trim(),
      '',
      `보낸 페이지: ${location.href}`
    ].join('\n');

    if (config.formEndpoint) {
      submit && (submit.disabled = true);
      setStatus('전송 중입니다…');
      try {
        data.set('_subject', subject);
        data.set('topic_label', topicLabel);
        const response = await fetch(config.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(String(response.status));
        inquiryForm.reset();
        setStatus('문의가 접수되었습니다. 확인 후 답변드리겠습니다.', 'ok');
      } catch (_) {
        setStatus('전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 보내 주세요.', 'error');
      } finally {
        submit && (submit.disabled = false);
      }
      return;
    }

    const to = config.email || 'jsleeint@gmail.com';
    location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('메일 앱이 열립니다. 열리지 않으면 ' + to + ' 로 직접 보내 주세요.', 'ok');
  });
}

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
