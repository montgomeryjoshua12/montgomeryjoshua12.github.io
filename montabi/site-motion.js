(() => {
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
