(() => {
  const section = document.querySelector(".approach-interactive");
  if (!section) return;

  const tabs = [...section.querySelectorAll(".approach-stage")];
  const number = section.querySelector("[data-stage-number]");
  const title = section.querySelector("[data-stage-title]");
  const description = section.querySelector("[data-stage-description]");
  const analyst = section.querySelector("[data-stage-analyst]");
  const detail = section.querySelector(".approach-stage-detail");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      number.textContent = tab.dataset.number;
      title.textContent = tab.dataset.title;
      description.textContent = tab.dataset.description;
      analyst.textContent = tab.dataset.analyst;

      detail.classList.remove("is-switching");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => detail.classList.add("is-switching"));
      });
    });
  });
})();
