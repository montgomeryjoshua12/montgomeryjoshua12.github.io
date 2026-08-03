document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

const source = document.querySelector('main')?.dataset.reportSource;
if (source) fetch(source).then(response => response.json()).then(data => {
  document.documentElement.dataset.reportStatus = data.status || 'loaded';
}).catch(() => {
  document.documentElement.dataset.reportStatus = 'static-fallback';
});

const observer = new IntersectionObserver(
  entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
