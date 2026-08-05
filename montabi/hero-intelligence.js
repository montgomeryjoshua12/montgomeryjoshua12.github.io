(() => {
  const panel = document.querySelector(".decision-signal");
  if (!panel) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  const animateValue = (element, nextValue) => {
    if (!element) return;
    const target = Number.parseFloat(nextValue);
    const start = Number.parseFloat(element.textContent);
    if (reduceMotion.matches || !Number.isFinite(target) || !Number.isFinite(start)) {
      element.textContent = nextValue;
      return;
    }
    const started = performance.now();
    const duration = 520;
    const decimals = String(nextValue).includes(".") ? 1 : 0;
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = (start + (target - start) * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  let activeIndex = 0;
  let signalTimer;

  const selectTab = (tab) => {
      activeIndex = tabs.indexOf(tab);
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      Object.keys(fields).forEach((key) => {
        if (key === "value") animateValue(fields[key], tab.dataset[key]);
        else fields[key].textContent = tab.dataset[key];
      });
      tab.dataset.bars.split(",").forEach((height, index) => {
        bars[index].style.setProperty("--bar", `${height}%`);
      });

      body.classList.remove("is-changing");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => body.classList.add("is-changing"));
      });
  };

  const startSignalRotation = () => {
    window.clearInterval(signalTimer);
    if (reduceMotion.matches) return;
    signalTimer = window.setInterval(() => selectTab(tabs[(activeIndex + 1) % tabs.length]), 6200);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      selectTab(tab);
      startSignalRotation();
    });
  });

  panel.addEventListener("pointerenter", () => window.clearInterval(signalTimer));
  panel.addEventListener("pointerleave", startSignalRotation);
  panel.addEventListener("focusin", () => window.clearInterval(signalTimer));
  panel.addEventListener("focusout", startSignalRotation);
  startSignalRotation();

  const pipeline = document.querySelector(".hero-intelligence-loop");
  const steps = pipeline ? [...pipeline.querySelectorAll("[data-pipeline-step]")] : [];
  let pipelineIndex = 0;
  let pipelineTimer;

  const activateStep = (index) => {
    pipelineIndex = index;
    pipeline.style.setProperty("--pipeline-index", String(index));
    steps.forEach((step, stepIndex) => {
      const active = stepIndex === index;
      step.classList.toggle("is-active", active);
      if (active) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
  };

  const startPipeline = () => {
    window.clearInterval(pipelineTimer);
    if (reduceMotion.matches || steps.length < 2) return;
    pipelineTimer = window.setInterval(() => activateStep((pipelineIndex + 1) % steps.length), 1850);
  };

  steps.forEach((step, index) => {
    step.addEventListener("pointerenter", () => {
      window.clearInterval(pipelineTimer);
      activateStep(index);
    });
    step.addEventListener("pointerleave", startPipeline);
    step.addEventListener("focus", () => {
      window.clearInterval(pipelineTimer);
      activateStep(index);
    });
    step.addEventListener("blur", startPipeline);
  });
  startPipeline();
})();
