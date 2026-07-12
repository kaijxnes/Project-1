const principal = document.getElementById("principal");
const contribution = document.getElementById("contribution");
const rate = document.getElementById("rate");
const years = document.getElementById("years");
const frequency = document.getElementById("frequency");
const totalContributed = document.getElementById("total-contributed");
const totalInterest = document.getElementById("total-interest");
const finalBalance = document.getElementById("final-balance");

function format(value) {
  return "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
  const p = parseFloat(principal.value);
  const monthlyContribution = parseFloat(contribution.value) || 0;
  const annualRate = parseFloat(rate.value);
  const termYears = parseFloat(years.value);
  const periodsPerYear = parseFloat(frequency.value);

  if (!Number.isFinite(p) || p < 0 || !annualRate || !termYears || termYears <= 0) {
    totalContributed.textContent = "—";
    totalInterest.textContent = "—";
    finalBalance.textContent = "—";
    return;
  }

  const monthlyRate = Math.pow(1 + annualRate / 100 / periodsPerYear, periodsPerYear / 12) - 1;
  const months = Math.round(termYears * 12);

  let balance = p;
  let contributed = p;

  for (let i = 0; i < months; i++) {
    balance += monthlyContribution;
    contributed += monthlyContribution;
    balance *= 1 + monthlyRate;
  }

  totalContributed.textContent = format(contributed);
  totalInterest.textContent = format(balance - contributed);
  finalBalance.textContent = format(balance);
}

[principal, contribution, rate, years, frequency].forEach((el) => {
  el.addEventListener("input", calculate);
  el.addEventListener("change", calculate);
});

calculate();
