(() => {
  document.querySelectorAll('.nav').forEach((nav) => {
    const links = nav.querySelector('.nav-links');
    if (!links || nav.querySelector('.nav-toggle')) return;
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span>';
    nav.append(toggle);
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('nav-open')));
  });

  const items = [...document.querySelectorAll("[data-tech-reveal]")];
  if (!items.length) return;

  document.documentElement.classList.add("motion-ready");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("tech-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("tech-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
  );

  items.forEach((item) => observer.observe(item));
})();
