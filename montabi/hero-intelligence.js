(() => {
  const panel = document.querySelector(".decision-signal");
  if (!panel) return;

  const tabs = [...panel.querySelectorAll(".signal-tab")];
  const fields = {
    label: panel.querySelector("[data-signal-label]"),
    value: panel.querySelector("[data-signal-value]"),
    unit: panel.querySelector("[data-signal-unit]"),
    change: panel.querySelector("[data-signal-change]"),
    insight: panel.querySelector("[data-signal-insight]"),
    action: panel.querySelector("[data-signal-action]"),
  };
  const bars = [...panel.querySelectorAll(".signal-chart i")];
  const body = panel.querySelector(".signal-body");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      Object.keys(fields).forEach((key) => {
        fields[key].textContent = tab.dataset[key];
      });
      tab.dataset.bars.split(",").forEach((height, index) => {
        bars[index].style.setProperty("--bar", `${height}%`);
      });

      body.classList.remove("is-changing");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => body.classList.add("is-changing"));
      });
    });
  });
})();
