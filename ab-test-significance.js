let confidenceLevel = 95;

function num(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

/* Abramowitz & Stegun 7.1.26 approximation, accurate to ~1.5e-7 */
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

function twoTailedPValue(z) {
  return 2 * (1 - normalCdf(Math.abs(z)));
}

function fmtPercent(value, digits = 2) {
  if (!isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return sign + value.toFixed(digits) + "%";
}

function showError(message) {
  const errorEl = document.getElementById("ab-error");
  errorEl.textContent = message;
  errorEl.style.display = message ? "block" : "none";
}

function resetResults() {
  document.getElementById("ab-rate-a").textContent = "—";
  document.getElementById("ab-rate-b").textContent = "—";
  document.getElementById("ab-uplift").textContent = "—";
  document.getElementById("ab-zscore").textContent = "—";
  document.getElementById("ab-pvalue").textContent = "—";
  const verdictEl = document.getElementById("ab-verdict");
  verdictEl.textContent = "—";
  verdictEl.style.color = "";
}

function setConfidence(level) {
  confidenceLevel = level;
  document.querySelectorAll(".tab[data-confidence]").forEach((tab) => {
    tab.classList.toggle("active", Number(tab.dataset.confidence) === level);
  });
  calculate();
}

document.querySelectorAll(".tab[data-confidence]").forEach((tab) => {
  tab.addEventListener("click", () => setConfidence(Number(tab.dataset.confidence)));
});

function calculate() {
  const visitorsA = num("a-visitors");
  const conversionsA = num("a-conversions");
  const visitorsB = num("b-visitors");
  const conversionsB = num("b-conversions");

  document.getElementById("ab-confidence-label").textContent = confidenceLevel + "%";

  if (visitorsA < 0 || conversionsA < 0 || visitorsB < 0 || conversionsB < 0) {
    showError("Values can't be negative.");
    resetResults();
    return;
  }
  if (conversionsA > visitorsA || conversionsB > visitorsB) {
    showError("Conversions can't exceed visitors.");
    resetResults();
    return;
  }
  if (visitorsA === 0 || visitorsB === 0) {
    showError("Enter visitor counts for both variants.");
    resetResults();
    return;
  }

  showError("");

  const rateA = conversionsA / visitorsA;
  const rateB = conversionsB / visitorsB;
  const uplift = rateA !== 0 ? ((rateB - rateA) / rateA) * 100 : rateB > 0 ? Infinity : 0;

  const pooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / visitorsA + 1 / visitorsB));
  const z = se !== 0 ? (rateB - rateA) / se : 0;
  const pValue = twoTailedPValue(z);

  const alpha = 1 - confidenceLevel / 100;
  const significant = pValue < alpha;

  document.getElementById("ab-rate-a").textContent = (rateA * 100).toFixed(2) + "%";
  document.getElementById("ab-rate-b").textContent = (rateB * 100).toFixed(2) + "%";
  document.getElementById("ab-uplift").textContent = isFinite(uplift) ? fmtPercent(uplift) : "—";
  document.getElementById("ab-zscore").textContent = z.toFixed(2);
  document.getElementById("ab-pvalue").textContent = pValue.toFixed(4);

  const verdictEl = document.getElementById("ab-verdict");
  verdictEl.textContent = significant ? "Significant" : "Not significant";
  verdictEl.style.color = significant ? "var(--good)" : "var(--bad)";
}

["a-visitors", "a-conversions", "b-visitors", "b-conversions"].forEach((id) => {
  document.getElementById(id).addEventListener("input", calculate);
});

resetResults();
