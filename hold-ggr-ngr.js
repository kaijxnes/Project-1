function fmtMoney(value) {
  if (!isFinite(value)) return "£0.00";
  return "£" + value.toFixed(2);
}

function fmtPercent(value) {
  if (!isFinite(value)) return "0%";
  return value.toFixed(2) + "%";
}

function num(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function calculate() {
  const stakes = num("stakes");
  const payouts = num("payouts");
  const ggr = stakes - payouts;
  const hold = stakes !== 0 ? (ggr / stakes) * 100 : 0;

  const bonuses = num("bonuses");
  const otherCosts = num("other-costs");
  const dutyRate = num("duty");

  const ngr = ggr - bonuses - otherCosts;
  const dutyAmount = ggr * (dutyRate / 100);
  const netResult = ngr - dutyAmount;

  document.getElementById("ggr").textContent = fmtMoney(ggr);
  document.getElementById("hold").textContent = fmtPercent(hold);
  document.getElementById("ngr").textContent = fmtMoney(ngr);
  document.getElementById("duty-amount").textContent = fmtMoney(dutyAmount);
  document.getElementById("net-result").textContent = fmtMoney(netResult);
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", calculate);
});

calculate();
