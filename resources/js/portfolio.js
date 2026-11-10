const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getAge(birthDate, today = new Date()) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age;
}

function getDaysLeftUntilAge(birthDate, targetAge = 100) {
  const today = new Date();
  const targetDate = new Date(birthDate);
  targetDate.setFullYear(birthDate.getFullYear() + targetAge);

  return Math.max(0, Math.ceil((targetDate - today) / MS_PER_DAY));
}

function getDaysCoding(startDate) {
  const today = new Date();
  return Math.max(0, Math.floor((today - startDate) / MS_PER_DAY));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function initCounters() {
  const birthday = new Date(1985, 10, 6);
  const codeStart = new Date(2025, 6, 1);

  setText('age', getAge(birthday));
  setText('days-left', getDaysLeftUntilAge(birthday, 100).toLocaleString());
  setText('days-coding', getDaysCoding(codeStart).toLocaleString());
  setText('year', new Date().getFullYear());
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll('.fade-up');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  elements.forEach(el => el.classList.add('animate'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08
  });

  elements.forEach((el) => observer.observe(el));
}

function wrapChars(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    const frag = document.createDocumentFragment();
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'tw-char';
      span.textContent = ch;
      frag.appendChild(span);
    }
    textNode.parentNode.replaceChild(frag, textNode);
  });
}

function runTypewriter(lines, cursor) {
  const charDelay = 22;
  const lineGap = 80;
  let cumulative = 0;

  lines.forEach((line) => {
    const chars = line.querySelectorAll('.tw-char');
    chars.forEach((c, i) => {
      setTimeout(() => c.classList.add('tw-visible'), cumulative + i * charDelay);
    });
    cumulative += chars.length * charDelay + lineGap;
  });

  if (cursor) {
    setTimeout(() => cursor.classList.add('tw-blink'), cumulative);
  }
}

function initTypewriter() {
  const factory = document.querySelector('.java-factory');
  const lines = document.querySelectorAll('.javaaboutme p');
  if (!factory || !lines.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  lines.forEach((line) => {
    const codeSpan = line.querySelector('.code');
    if (codeSpan) wrapChars(codeSpan);
  });

  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  const lastLine = lines[lines.length - 1];
  const lastCode = lastLine.querySelector('.code');
  if (lastCode) lastCode.appendChild(cursor);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runTypewriter(lines, cursor);
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(factory);
}

function initCopyEmail() {
  const status = document.getElementById('copy-status');

  document.querySelectorAll('[data-copy-email]').forEach((btn) => {
    const label = btn.querySelector('[data-copy-label]') || btn;
    const original = label.textContent;
    let resetTimer;

    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-copy-email');
      try {
        await navigator.clipboard.writeText(email);
        label.textContent = 'Copied!';
        if (status) status.textContent = 'Email address copied to clipboard.';
      } catch (err) {
        label.textContent = email;
      }
      btn.classList.add('copied');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        label.textContent = original;
        btn.classList.remove('copied');
        if (status) status.textContent = '';
      }, 1800);
    });
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  const icon = toggle.querySelector('i');

  function setOpen(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (icon) icon.className = open ? 'fas fa-xmark' : 'fas fa-bars';
  }

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('open'));
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

function initActiveNav() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  let ticking = false;

  function update() {
    ticking = false;
    const marker = window.scrollY + window.innerHeight * 0.35;
    let currentId = null;

    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) currentId = sections[sections.length - 1].id;

    links.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);

  update();
}

initCounters();
initRevealOnScroll();
initTypewriter();
initCopyEmail();
initMobileNav();
initActiveNav();
