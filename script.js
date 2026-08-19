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
  const h1 = document.querySelector('.hero-copy h1');
  if (!h1) return;

  const mainText = "More Than Dance.";
  const accentText = "It's a Legacy.";

  // Build the headline elements
  const textSpan = document.createElement('span');
  textSpan.id = 'typing-main';
  textSpan.textContent = '';

  const lineBreak = document.createElement('br');

  const accentSpan = document.createElement('span');
  accentSpan.id = 'typing-accent';
  accentSpan.textContent = '';

  const cursorSpan = document.createElement('span');
  cursorSpan.id = 'typing-cursor';
  cursorSpan.className = 'typing-cursor';
  cursorSpan.textContent = '';

  // Clear existing headline content and rebuild
  h1.innerHTML = '';
  h1.appendChild(textSpan);
  h1.appendChild(lineBreak);
  h1.appendChild(accentSpan);
  h1.appendChild(cursorSpan);

  // Start typing on load
  setTimeout(() => {
    let i = 0;
    let j = 0;

    const typeMain = () => {
      if (i < mainText.length) {
        textSpan.textContent += mainText.charAt(i);
        i++;
        setTimeout(typeMain, 55);
      } else {
        // Start accent line after brief pause
        setTimeout(() => {
          let k = 0;
          const typeAccent = () => {
            if (k < accentText.length) {
              accentSpan.textContent += accentText.charAt(k);
              k++;
              setTimeout(typeAccent, 50);
            } else {
              // Hide cursor after typing complete
              setTimeout(() => {
                cursorSpan.style.opacity = '0';
                cursorSpan.style.transition = 'opacity 0.4s ease';
              }, 600);
            }
          };
          typeAccent();
        }, 300);
      }
    };
    typeMain();
  }, 900); // Delay so page load + fade-in has started first
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

    const data = Object.fromEntries(new FormData(form).entries());
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
