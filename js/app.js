(() => {
  const paletteEl = document.getElementById("palette");
  const modeEl = document.getElementById("mode");
  const generateBtn = document.getElementById("generate");
  const toastEl = document.getElementById("toast");

  const ICON_LOCK_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>';
  const ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  const ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';

  let busy = false;
  let toastTimer;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1600);
  }

  function render() {
    paletteEl.innerHTML = "";
    Palette.colors.forEach((color, i) => {
      const strip = document.createElement("section");
      strip.className = "strip";
      strip.style.setProperty("--bg", color.hex);
      strip.style.setProperty("--fg", Palette.textColor(color.hex));

      const hex = document.createElement("button");
      hex.className = "hex";
      hex.type = "button";
      hex.textContent = color.hex.slice(1).toUpperCase();
      hex.title = "클릭하여 복사";
      hex.addEventListener("click", () => copy(color.hex));

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = color.name;

      const tools = document.createElement("div");
      tools.className = "tools";

      const lock = document.createElement("button");
      lock.className = "icon-btn" + (color.locked ? " locked" : "");
      lock.type = "button";
      lock.setAttribute("aria-label", color.locked ? "잠금 해제" : "색상 잠금");
      lock.setAttribute("aria-pressed", String(color.locked));
      lock.innerHTML = color.locked ? ICON_LOCK : ICON_LOCK_OPEN;
      lock.addEventListener("click", () => {
        Palette.toggleLock(i);
        render();
      });

      const copyBtn = document.createElement("button");
      copyBtn.className = "icon-btn";
      copyBtn.type = "button";
      copyBtn.setAttribute("aria-label", "HEX 복사");
      copyBtn.innerHTML = ICON_COPY;
      copyBtn.addEventListener("click", () => copy(color.hex));

      tools.append(copyBtn, lock);
      strip.append(hex, name, tools);
      paletteEl.append(strip);
    });
  }

  async function copy(hex) {
    const text = hex.toUpperCase();
    try {
      await navigator.clipboard.writeText(text);
      toast(`${text} 복사됨`);
    } catch {
      toast("복사에 실패했습니다");
    }
  }

  async function generate() {
    if (busy) return;
    busy = true;
    generateBtn.disabled = true;
    try {
      await Palette.regenerate(modeEl.value);
      render();
    } catch {
      toast("팔레트를 불러오지 못했습니다. 다시 시도해 주세요.");
    } finally {
      busy = false;
      generateBtn.disabled = false;
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space" || e.repeat) return;
    // Let the dropdown and buttons keep their native space behavior.
    if (e.target.closest("select, #generate")) return;
    e.preventDefault();
    generate();
  });

  generateBtn.addEventListener("click", generate);
  modeEl.addEventListener("change", () => {
    modeEl.blur();
    generate();
  });

  render();
  generate();
})();
