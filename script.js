const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
