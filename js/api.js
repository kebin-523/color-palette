const ColorApi = (() => {
  const BASE = "https://www.thecolorapi.com";

  function randomHex() {
    return Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  }

  // Returns [{ hex: "#RRGGBB", name: "Color Name" }, ...] with `count` items.
  async function fetchScheme(mode, count) {
    const url = `${BASE}/scheme?hex=${randomHex()}&mode=${mode}&count=${count}&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Color API ${res.status}`);
    const data = await res.json();
    return data.colors.map((c) => ({ hex: c.hex.value, name: c.name.value }));
  }

  return { fetchScheme };
})();
