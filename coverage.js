function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
    });
  });
}

function num(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function fmtArea(value) {
  if (!isFinite(value)) return "0 m²";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " m²";
}

const DOOR_AREA = 1.6;
const WINDOW_AREA = 1.4;

function calcFlooring() {
  const length = num("fl-length");
  const width = num("fl-width");
  const waste = num("fl-waste");

  const area = length * width;
  const total = area * (1 + waste / 100);

  document.getElementById("fl-area").textContent = fmtArea(area);
  document.getElementById("fl-total").textContent = fmtArea(total);
}

function calcPaint() {
  const length = num("pt-length");
  const width = num("pt-width");
  const height = num("pt-height");
  const doors = num("pt-doors");
  const windows = num("pt-windows");
  const coverage = num("pt-coverage");
  const coats = num("pt-coats") || 1;

  const grossWallArea = 2 * (length + width) * height;
  const openings = doors * DOOR_AREA + windows * WINDOW_AREA;
  const wallArea = Math.max(0, grossWallArea - openings);
  const litres = coverage !== 0 ? (wallArea * coats) / coverage : 0;

  document.getElementById("pt-area").textContent = fmtArea(wallArea);
  document.getElementById("pt-litres").textContent = litres.toFixed(2) + " L";
}

["fl-length", "fl-width", "fl-waste"].forEach((id) =>
  document.getElementById(id).addEventListener("input", calcFlooring)
);
["pt-length", "pt-width", "pt-height", "pt-doors", "pt-windows", "pt-coverage", "pt-coats"].forEach(
  (id) => document.getElementById(id).addEventListener("input", calcPaint)
);

initTabs();
calcFlooring();
calcPaint();
