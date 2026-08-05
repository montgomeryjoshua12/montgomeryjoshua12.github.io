(() => {
  const flow = document.querySelector(".bi-flow");
  if (!flow) return;

  const steps = [...flow.querySelectorAll(".bi-flow-step")];
  const detail = flow.querySelector(".bi-flow-detail");
  const fields = {
    phase: flow.querySelector("[data-bi-phase]"),
    title: flow.querySelector("[data-bi-title]"),
    description: flow.querySelector("[data-bi-description]"),
    analyst: flow.querySelector("[data-bi-analyst]"),
    governance: flow.querySelector("[data-bi-governance]"),
  };
  const outputs = flow.querySelector("[data-bi-outputs]");

  const activate = (step, stepIndex, moveFocus = false) => {
    steps.forEach((item) => {
      const active = item === step;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });

    Object.keys(fields).forEach((key) => {
      fields[key].textContent = step.dataset[key];
    });
    outputs.replaceChildren(
      ...step.dataset.outputs.split("|").map((output) => {
        const item = document.createElement("li");
        item.textContent = output;
        return item;
      }),
    );

    flow.style.setProperty("--flow-progress", `${stepIndex * 25}%`);
    detail.classList.remove("is-changing");
    requestAnimationFrame(() => requestAnimationFrame(() => detail.classList.add("is-changing")));
    if (moveFocus) step.focus();
  };

  steps.forEach((step, stepIndex) => {
    step.tabIndex = stepIndex === 0 ? 0 : -1;
    step.addEventListener("click", () => activate(step, stepIndex));
    step.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (stepIndex + 1) % steps.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (stepIndex - 1 + steps.length) % steps.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = steps.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      activate(steps[nextIndex], nextIndex, true);
    });
  });
})();
