const MS_PER_DAY = 1000 * 60 * 60 * 24;

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


const birthday = new Date(1985, 10, 6);
const codeStart = new Date(2025, 6, 1);

const daysLeft = getDaysLeftUntilAge(birthday, 100);
const daysCoding = getDaysCoding(codeStart);


document.getElementById("days-left").textContent = daysLeft.toLocaleString();
document.getElementById("days-coding").textContent = daysCoding;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll('.fade-up');

  elements.forEach(el => el.classList.add('animate'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15
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

  if (prefersReducedMotion()) return;

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
  document.querySelectorAll('[data-copy-email]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-copy-email');
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(email);
        btn.textContent = 'Copied!';
      } catch (err) {
        btn.textContent = email;
      }
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1600);
    });
  });
}

initRevealOnScroll();
initTypewriter();
initCopyEmail();
