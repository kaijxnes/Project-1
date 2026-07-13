const LENGTH_FACTORS = { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 };
const WEIGHT_FACTORS = { mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.028349523125, lb: 0.45359237, st: 6.35029318 };
const VOLUME_FACTORS = {
  ml: 0.001,
  l: 1,
  m3: 1000,
  "gal-us": 3.785411784,
  "gal-uk": 4.54609,
  "pt-us": 0.473176473,
  "pt-uk": 0.56826125,
  "cup-us": 0.2365882365,
};

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

function fmt(value) {
  if (!isFinite(value)) return "0";
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function unitLabel(selectEl) {
  return selectEl.selectedOptions[0].text;
}

function convertLinear(value, from, to, factors) {
  return (value * factors[from]) / factors[to];
}

function celsiusFrom(value, unit) {
  if (unit === "F") return ((value - 32) * 5) / 9;
  if (unit === "K") return value - 273.15;
  return value;
}

function celsiusTo(value, unit) {
  if (unit === "F") return (value * 9) / 5 + 32;
  if (unit === "K") return value + 273.15;
  return value;
}

function calcCategory(prefix, factors) {
  const value = parseFloat(document.getElementById(`${prefix}-value`).value) || 0;
  const fromSel = document.getElementById(`${prefix}-from`);
  const toSel = document.getElementById(`${prefix}-to`);
  const result = convertLinear(value, fromSel.value, toSel.value, factors);
  document.getElementById(`${prefix}-result`).textContent = fmt(result);
  document.getElementById(`${prefix}-result-label`).textContent = unitLabel(toSel);
}

function calcTemp() {
  const value = parseFloat(document.getElementById("temp-value").value) || 0;
  const fromSel = document.getElementById("temp-from");
  const toSel = document.getElementById("temp-to");
  const celsius = celsiusFrom(value, fromSel.value);
  const result = celsiusTo(celsius, toSel.value);
  document.getElementById("temp-result").textContent = fmt(result);
  document.getElementById("temp-result-label").textContent = unitLabel(toSel);
}

const calcLength = () => calcCategory("len", LENGTH_FACTORS);
const calcWeight = () => calcCategory("wt", WEIGHT_FACTORS);
const calcVolume = () => calcCategory("vol", VOLUME_FACTORS);

["len-value", "len-from", "len-to"].forEach((id) =>
  document.getElementById(id).addEventListener("input", calcLength)
);
["wt-value", "wt-from", "wt-to"].forEach((id) =>
  document.getElementById(id).addEventListener("input", calcWeight)
);
["temp-value", "temp-from", "temp-to"].forEach((id) =>
  document.getElementById(id).addEventListener("input", calcTemp)
);
["vol-value", "vol-from", "vol-to"].forEach((id) =>
  document.getElementById(id).addEventListener("input", calcVolume)
);

initTabs();
calcLength();
calcWeight();
calcTemp();
calcVolume();
