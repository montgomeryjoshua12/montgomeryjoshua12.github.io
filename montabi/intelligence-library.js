(() => {
  const library = document.querySelector(".intelligence-library");
  if (!library) return;

  const filters = [...library.querySelectorAll("[data-library-filter]")];
  const cards = [...library.querySelectorAll("[data-library-card]")];

  const applyFilter = (filter) => {
    filters.forEach((button) => {
      const active = button.dataset.libraryFilter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const visible = filter === "all" || categories.includes(filter);
      card.hidden = !visible;
      if (visible) {
        card.classList.remove("is-filtered-in");
        requestAnimationFrame(() => card.classList.add("is-filtered-in"));
      }
    });
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.libraryFilter));
  });
})();
