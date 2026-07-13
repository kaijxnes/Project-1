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

function fmtNumber(value) {
  if (!isFinite(value)) return "0";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function fmtPercent(value) {
  if (!isFinite(value)) return "0%";
  const sign = value > 0 ? "+" : "";
  return sign + value.toFixed(2) + "%";
}

function num(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function calcOf() {
  const pct = num("of-pct");
  const value = num("of-value");
  document.getElementById("of-result").textContent = fmtNumber((pct / 100) * value);
}

function calcIsWhat() {
  const x = num("iw-x");
  const y = num("iw-y");
  const result = y !== 0 ? (x / y) * 100 : 0;
  document.getElementById("iw-result").textContent = result.toFixed(2) + "%";
}

function calcChange() {
  const from = num("ch-from");
  const to = num("ch-to");
  const result = from !== 0 ? ((to - from) / from) * 100 : 0;
  document.getElementById("ch-result").textContent = fmtPercent(result);
  document.getElementById("ch-label").textContent =
    result > 0 ? "Increase" : result < 0 ? "Decrease" : "No change";
}

document.getElementById("of-pct").addEventListener("input", calcOf);
document.getElementById("of-value").addEventListener("input", calcOf);
document.getElementById("iw-x").addEventListener("input", calcIsWhat);
document.getElementById("iw-y").addEventListener("input", calcIsWhat);
document.getElementById("ch-from").addEventListener("input", calcChange);
document.getElementById("ch-to").addEventListener("input", calcChange);

initTabs();
calcOf();
calcIsWhat();
calcChange();
