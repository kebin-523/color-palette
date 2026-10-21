const Palette = (() => {
  const SIZE = 5;
  const FALLBACK = [
    { hex: "#264653", name: "Charcoal" },
    { hex: "#2A9D8F", name: "Persian Green" },
    { hex: "#E9C46A", name: "Saffron" },
    { hex: "#F4A261", name: "Sandy Brown" },
    { hex: "#E76F51", name: "Burnt Sienna" },
  ];

  const colors = FALLBACK.map((c) => ({ ...c, locked: false }));

  // Fills unlocked slots with a fresh scheme; locked colors stay untouched.
  async function regenerate(mode) {
    const fresh = await ColorApi.fetchScheme(mode, SIZE);
    let i = 0;
    colors.forEach((slot) => {
      if (!slot.locked) {
        slot.hex = fresh[i].hex;
        slot.name = fresh[i].name;
      }
      i++;
    });
  }

  function toggleLock(index) {
    colors[index].locked = !colors[index].locked;
  }

  // Picks black or white text for readable contrast on `hex`.
  function textColor(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#0d1b2a" : "#ffffff";
  }

  return { colors, regenerate, toggleLock, textColor };
})();
