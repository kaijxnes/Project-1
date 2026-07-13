function fmtMoney(value) {
  if (!isFinite(value)) return "£0.00";
  return "£" + value.toFixed(2);
}

function num(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function calculate() {
  const principal = num("principal");
  const annualRate = num("rate");
  const years = num("years");
  const contribution = num("contribution");

  const monthlyRate = annualRate / 100 / 12;
  const periods = Math.round(years * 12);

  let futureValue;
  if (monthlyRate !== 0) {
    futureValue =
      principal * Math.pow(1 + monthlyRate, periods) +
      contribution * ((Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate);
  } else {
    futureValue = principal + contribution * periods;
  }

  const totalContributed = principal + contribution * periods;
  const totalInterest = futureValue - totalContributed;

  document.getElementById("future-value").textContent = fmtMoney(futureValue);
  document.getElementById("total-contributed").textContent = fmtMoney(totalContributed);
  document.getElementById("total-interest").textContent = fmtMoney(totalInterest);
}

document.querySelectorAll("input").forEach((input) => input.addEventListener("input", calculate));
calculate();
