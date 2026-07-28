(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("review") !== "1") return;

  const STORAGE_KEY = "montabi-review-comments-v1";
  const UI_ATTR = "data-montabi-review-ui";
  let selecting = true;
  let selectedElement = null;
  let comments = readComments();

  const style = document.createElement("style");
  style.setAttribute(UI_ATTR, "");
  style.textContent = `
    html.montabi-review-panel-open { margin-right: 380px; }
    [data-montabi-review-ui] { box-sizing: border-box; font-family: Arial, sans-serif; }
    .montabi-review-toolbar {
      position: fixed; z-index: 2147483647; top: 14px; left: 50%; display: flex;
      align-items: center; gap: 8px; padding: 8px; color: #f7efe2; background: #09291f;
      border: 1px solid rgba(247,239,226,.22); border-radius: 999px;
      box-shadow: 0 12px 34px rgba(0,0,0,.25); transform: translateX(-50%);
    }
    .montabi-review-toolbar strong { padding: 0 8px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
    .montabi-review-button {
      min-height: 34px; padding: 0 13px; border: 1px solid rgba(247,239,226,.26);
      border-radius: 999px; color: #f7efe2; background: transparent; cursor: pointer;
      font-size: 12px; font-weight: 700;
    }
    .montabi-review-button:hover, .montabi-review-button.is-active { color: #09291f; background: #f2aa2e; border-color: #f2aa2e; }
    .montabi-review-panel {
      position: fixed; z-index: 2147483646; top: 0; right: 0; width: 380px; height: 100vh;
      padding: 80px 20px 22px; overflow-y: auto; color: #12271f; background: #f7efe2;
      border-left: 1px solid #d8cebd; box-shadow: -18px 0 42px rgba(0,0,0,.13);
    }
    .montabi-review-panel[hidden] { display: none; }
    .montabi-review-panel h2 { margin: 0 0 8px; font-family: Georgia,serif; font-size: 30px; font-weight: 400; }
    .montabi-review-panel-intro { margin: 0 0 22px; color: #50675d; font-size: 13px; line-height: 1.5; }
    .montabi-review-form {
      margin-bottom: 20px; padding: 16px; background: #fffaf1; border: 1px solid #d8cebd;
    }
    .montabi-review-form[hidden] { display: none; }
    .montabi-review-target { margin: 0 0 10px; color: #a84319; font-size: 11px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; }
    .montabi-review-form textarea {
      width: 100%; min-height: 110px; padding: 11px; resize: vertical; color: #12271f;
      background: white; border: 1px solid #bdb3a4; font: 14px/1.45 Arial,sans-serif;
    }
    .montabi-review-form-actions, .montabi-review-export { display: flex; gap: 8px; margin-top: 10px; }
    .montabi-review-form-actions button, .montabi-review-export button {
      min-height: 36px; padding: 0 12px; border: 1px solid #163b2e; color: #163b2e;
      background: transparent; cursor: pointer; font-size: 12px; font-weight: 800;
    }
    .montabi-review-form-actions .primary, .montabi-review-export .primary { color: #09291f; background: #f2aa2e; border-color: #f2aa2e; }
    .montabi-review-list { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
    .montabi-review-card { padding: 13px; background: white; border: 1px solid #d8cebd; }
    .montabi-review-card-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .montabi-review-card-number {
      display: inline-grid; width: 25px; height: 25px; place-items: center; color: #09291f;
      background: #f2aa2e; border-radius: 50%; font-size: 12px; font-weight: 900;
    }
    .montabi-review-card small { color: #68796f; }
    .montabi-review-card p { margin: 10px 0 6px; font-size: 14px; line-height: 1.4; }
    .montabi-review-card .context { color: #68796f; font-size: 11px; word-break: break-word; }
    .montabi-review-delete { padding: 4px 6px; border: 0; color: #a84319; background: none; cursor: pointer; font-size: 12px; }
    .montabi-review-empty { padding: 22px 0; color: #68796f; font-size: 13px; text-align: center; }
    .montabi-review-outline { outline: 3px solid #f2aa2e !important; outline-offset: 3px !important; cursor: crosshair !important; }
    .montabi-review-marker {
      position: absolute; z-index: 2147483645; display: grid; width: 27px; height: 27px;
      place-items: center; color: #09291f; background: #f2aa2e; border: 2px solid white;
      border-radius: 50%; box-shadow: 0 3px 10px rgba(0,0,0,.28); font-size: 12px; font-weight: 900;
      pointer-events: none;
    }
    @media (max-width: 760px) {
      html.montabi-review-panel-open { margin-right: 0; }
      .montabi-review-panel { width: min(92vw,380px); }
      .montabi-review-toolbar { top: 8px; max-width: calc(100vw - 16px); }
      .montabi-review-toolbar strong { display: none; }
    }
  `;
  document.head.appendChild(style);

  const toolbar = element(`
    <div class="montabi-review-toolbar" ${UI_ATTR}>
      <strong>Montabi Review</strong>
      <button class="montabi-review-button is-active" type="button" data-action="select">Comment</button>
      <button class="montabi-review-button" type="button" data-action="browse">Browse</button>
      <button class="montabi-review-button" type="button" data-action="panel">Notes (<span>0</span>)</button>
      <button class="montabi-review-button" type="button" data-action="exit">Exit</button>
    </div>
  `);
  const panel = element(`
    <aside class="montabi-review-panel" ${UI_ATTR} aria-label="Website review notes">
      <h2>Review notes</h2>
      <p class="montabi-review-panel-intro">Choose <b>Comment</b>, then click anything on the page. Use <b>Browse</b> to follow links normally.</p>
      <form class="montabi-review-form" hidden>
        <p class="montabi-review-target"></p>
        <textarea aria-label="Requested change" placeholder="What should change here?"></textarea>
        <div class="montabi-review-form-actions">
          <button class="primary" type="submit">Save comment</button>
          <button type="button" data-action="cancel">Cancel</button>
        </div>
      </form>
      <ol class="montabi-review-list"></ol>
      <p class="montabi-review-empty">No comments yet. Click an area of the page to begin.</p>
      <div class="montabi-review-export">
        <button class="primary" type="button" data-action="copy">Copy for Codex</button>
        <button type="button" data-action="download">Download</button>
      </div>
    </aside>
  `);
  document.body.append(toolbar, panel);
  document.documentElement.classList.add("montabi-review-panel-open");

  const form = panel.querySelector("form");
  const textarea = form.querySelector("textarea");
  const targetLabel = form.querySelector(".montabi-review-target");
  const selectButton = toolbar.querySelector('[data-action="select"]');
  const browseButton = toolbar.querySelector('[data-action="browse"]');
  const panelButton = toolbar.querySelector('[data-action="panel"]');

  preserveReviewMode();
  render();

  toolbar.addEventListener("click", (event) => {
    const action = event.target.closest("button")?.dataset.action;
    if (action === "select") setSelecting(true);
    if (action === "browse") setSelecting(false);
    if (action === "panel") togglePanel();
    if (action === "exit") {
      const url = new URL(window.location.href);
      url.searchParams.delete("review");
      window.location.href = url.toString();
    }
  });

  document.addEventListener(
    "click",
    (event) => {
      if (!selecting || event.target.closest(`[${UI_ATTR}]`)) return;
      event.preventDefault();
      event.stopPropagation();
      selectTarget(event.target);
    },
    true
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = textarea.value.trim();
    if (!selectedElement || !note) return;
    comments.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      page: pagePath(),
      pageTitle: document.title,
      selector: cssPath(selectedElement),
      label: describe(selectedElement),
      comment: note,
      createdAt: new Date().toISOString(),
    });
    writeComments();
    clearSelection();
    render();
  });

  panel.addEventListener("click", async (event) => {
    const action = event.target.closest("button")?.dataset.action;
    if (action === "cancel") clearSelection();
    if (action === "delete") {
      comments = comments.filter((comment) => comment.id !== event.target.closest("button").dataset.id);
      writeComments();
      render();
    }
    if (action === "copy") {
      await navigator.clipboard.writeText(markdownExport());
      event.target.textContent = "Copied";
      setTimeout(() => (event.target.textContent = "Copy for Codex"), 1500);
    }
    if (action === "download") download();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") clearSelection();
  });
  window.addEventListener("resize", renderMarkers);

  function selectTarget(target) {
    clearSelection();
    selectedElement = target;
    selectedElement.classList.add("montabi-review-outline");
    targetLabel.textContent = describe(target);
    form.hidden = false;
    panel.hidden = false;
    document.documentElement.classList.add("montabi-review-panel-open");
    textarea.focus();
  }

  function clearSelection() {
    selectedElement?.classList.remove("montabi-review-outline");
    selectedElement = null;
    form.hidden = true;
    textarea.value = "";
  }

  function setSelecting(value) {
    selecting = value;
    selectButton.classList.toggle("is-active", value);
    browseButton.classList.toggle("is-active", !value);
    clearSelection();
  }

  function togglePanel() {
    panel.hidden = !panel.hidden;
    document.documentElement.classList.toggle("montabi-review-panel-open", !panel.hidden);
  }

  function preserveReviewMode() {
    document.querySelectorAll("a[href]").forEach((link) => {
      try {
        const url = new URL(link.href, window.location.href);
        if (url.origin === window.location.origin) {
          url.searchParams.set("review", "1");
          link.href = url.toString();
        }
      } catch {}
    });
    document.querySelectorAll("iframe[src]").forEach((frame) => {
      try {
        const url = new URL(frame.src, window.location.href);
        if (url.origin === window.location.origin) {
          url.searchParams.set("review", "1");
          frame.src = url.toString();
        }
      } catch {}
    });
  }

  function render() {
    const list = panel.querySelector(".montabi-review-list");
    const empty = panel.querySelector(".montabi-review-empty");
    panelButton.querySelector("span").textContent = comments.length;
    list.innerHTML = "";
    comments.forEach((comment, index) => {
      const item = document.createElement("li");
      item.className = "montabi-review-card";
      item.innerHTML = `
        <div class="montabi-review-card-head">
          <span class="montabi-review-card-number">${index + 1}</span>
          <small>${escapeHtml(comment.page)}</small>
          <button class="montabi-review-delete" type="button" data-action="delete" data-id="${escapeHtml(comment.id)}">Delete</button>
        </div>
        <p>${escapeHtml(comment.comment)}</p>
        <div class="context">${escapeHtml(comment.label)}</div>
      `;
      list.appendChild(item);
    });
    empty.hidden = comments.length > 0;
    renderMarkers();
  }

  function renderMarkers() {
    document.querySelectorAll(".montabi-review-marker").forEach((marker) => marker.remove());
    comments
      .filter((comment) => comment.page === pagePath())
      .forEach((comment) => {
        let target;
        try {
          target = document.querySelector(comment.selector);
        } catch {}
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const marker = document.createElement("span");
        marker.className = "montabi-review-marker";
        marker.setAttribute(UI_ATTR, "");
        marker.textContent = comments.indexOf(comment) + 1;
        marker.style.left = `${window.scrollX + rect.left - 12}px`;
        marker.style.top = `${window.scrollY + rect.top - 12}px`;
        document.body.appendChild(marker);
      });
  }

  function markdownExport() {
    const lines = ["# Montabi website review", ""];
    comments.forEach((comment, index) => {
      lines.push(
        `## ${index + 1}. ${comment.pageTitle}`,
        `- Page: ${comment.page}`,
        `- Area: ${comment.label}`,
        `- Requested change: ${comment.comment}`,
        ""
      );
    });
    return lines.join("\n");
  }

  function download() {
    const blob = new Blob([JSON.stringify({ site: "Montabi", exportedAt: new Date().toISOString(), comments }, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "montabi-review-comments.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function pagePath() {
    return window.location.pathname.replace(/\/index\.html$/, "/");
  }

  function readComments() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeComments() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }

  function cssPath(node) {
    if (node.id) return `#${CSS.escape(node.id)}`;
    const path = [];
    let current = node;
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      const classes = [...current.classList].filter((name) => !name.startsWith("montabi-review"));
      if (classes.length)
        selector += `.${classes
          .slice(0, 2)
          .map((name) => CSS.escape(name))
          .join(".")}`;
      const siblings = current.parentElement ? [...current.parentElement.children].filter((child) => child.tagName === current.tagName) : [];
      if (siblings.length > 1) selector += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      path.unshift(selector);
      current = current.parentElement;
    }
    return `body > ${path.join(" > ")}`;
  }

  function describe(node) {
    const text = (node.innerText || node.alt || node.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 90);
    return `${node.tagName.toLowerCase()}${text ? ` — “${text}”` : ""}`;
  }

  function element(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
})();
