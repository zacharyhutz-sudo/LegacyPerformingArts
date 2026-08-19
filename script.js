/* ── Mobile Nav Toggle ── */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
}

/* ── Dynamic Copyright Year ── */
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

/* ── Scroll Reveal (Intersection Observer) ── */
(function() {
  const reveals = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* ── Hero Typing Animation ── */
(function() {
  const h1 = document.querySelector('.hero-home .hero-copy h1');
  if (!h1) return;

  const mobileQuery = window.matchMedia('(max-width: 520px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const desktopLines = [
    { text: 'More Than', accent: false },
    { text: 'Dance.', accent: false },
    { text: "It's a Legacy.", accent: true }
  ];
  const mobileLines = [
    { text: 'More Than', accent: false },
    { text: 'Dance.', accent: false },
    { text: "It's a", accent: true },
    { text: 'Legacy.', accent: true }
  ];

  const linesForViewport = () => mobileQuery.matches ? mobileLines : desktopLines;

  const renderStatic = () => {
    const fragment = document.createDocumentFragment();
    linesForViewport().forEach(({ text, accent }) => {
      const line = document.createElement('span');
      line.className = `hero-title-line${accent ? ' hero-title-accent' : ''}`;
      line.textContent = text;
      fragment.appendChild(line);
    });
    h1.replaceChildren(fragment);
  };

  if (reduceMotion) {
    renderStatic();
    return;
  }

  const lines = linesForViewport();
  const sizer = document.createElement('span');
  sizer.className = 'typing-sizer';
  sizer.setAttribute('aria-hidden', 'true');

  const live = document.createElement('span');
  live.className = 'typing-live';
  live.setAttribute('aria-hidden', 'true');

  const liveLines = [];
  lines.forEach(({ text, accent }) => {
    const sizeLine = document.createElement('span');
    sizeLine.className = `typing-line${accent ? ' typing-accent' : ''}`;
    sizeLine.textContent = text;
    sizer.appendChild(sizeLine);

    const liveLine = document.createElement('span');
    liveLine.className = `typing-line${accent ? ' typing-accent' : ''}`;
    live.appendChild(liveLine);
    liveLines.push(liveLine);
  });

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  h1.replaceChildren(sizer, live);
  h1.setAttribute('aria-label', "More Than Dance. It's a Legacy.");

  let lineIndex = 0;
  let charIndex = 0;

  const typeNext = () => {
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        cursor.style.opacity = '0';
        cursor.style.transition = 'opacity 0.4s ease';
      }, 600);
      return;
    }

    const currentLine = liveLines[lineIndex];
    currentLine.appendChild(cursor);
    const currentText = lines[lineIndex].text;

    if (charIndex < currentText.length) {
      currentLine.insertBefore(document.createTextNode(currentText.charAt(charIndex)), cursor);
      charIndex += 1;
      setTimeout(typeNext, lineIndex < 2 ? 55 : 50);
      return;
    }

    lineIndex += 1;
    charIndex = 0;
    setTimeout(typeNext, 180);
  };

  setTimeout(typeNext, 900);

  // Keep the correct line layout if a phone rotates or crosses the breakpoint.
  const handleBreakpointChange = () => renderStatic();
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', handleBreakpointChange);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(handleBreakpointChange);
  }
})();

/* ── Split Section Image Parallax (subtle) ── */
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const splitImages = document.querySelectorAll('.split-section img');
  if (!splitImages.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        splitImages.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const imgCenter = rect.top + rect.height / 2;
          const offset = (imgCenter - viewportCenter) * 0.03;
          img.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── Contact Form / Formspark ── */
(function() {
  const form = document.querySelector('#contact-form');
  if (!form || !form.action.includes('submit-form.com')) return;
  if (!('fetch' in window) || !('FormData' in window)) return;

  const status = document.querySelector('#form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const defaultButtonText = submitButton ? submitButton.textContent : 'Send Inquiry';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (status) {
      status.textContent = '';
      status.classList.remove('confirmed', 'error');
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    const data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = value;
    });
    data._email = {
      subject: 'New Legacy Performing Arts website inquiry'
    };

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error(`Formspark returned ${response.status}`);

      form.reset();
      if (status) {
        status.textContent = 'Thank you! Your message has been sent to Legacy Performing Arts.';
        status.classList.add('confirmed');
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      if (status) {
        status.textContent = 'We couldn’t send your message. Please try again, or email/text the studio directly.';
        status.classList.add('error');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
    }
  });
})();
