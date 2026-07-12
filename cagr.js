function num(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function fmtPercent(value) {
  if (!isFinite(value)) return "—";
  return value.toFixed(2) + "%";
}

function calculate() {
  const start = num("start");
  const end = num("end");
  const years = num("years");

  let cagr = NaN;
  if (start > 0 && end >= 0 && years > 0) {
    cagr = (Math.pow(end / start, 1 / years) - 1) * 100;
  }

  const totalGrowth = start !== 0 ? ((end - start) / start) * 100 : NaN;
  const absChange = end - start;

  document.getElementById("cagr").textContent = fmtPercent(cagr);
  document.getElementById("total-growth").textContent = fmtPercent(totalGrowth);
  document.getElementById("abs-change").textContent = isFinite(absChange) ? absChange.toFixed(2) : "—";
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", calculate));
calculate();
