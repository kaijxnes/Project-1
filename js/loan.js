const principal = document.getElementById("principal");
const rate = document.getElementById("rate");
const years = document.getElementById("years");
const monthlyPayment = document.getElementById("monthly-payment");
const totalPaid = document.getElementById("total-paid");
const totalInterest = document.getElementById("total-interest");

function format(value) {
  return "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
  const p = parseFloat(principal.value);
  const annualRate = parseFloat(rate.value);
  const termYears = parseFloat(years.value);

  if (!p || !termYears || p <= 0 || termYears <= 0) {
    monthlyPayment.textContent = "—";
    totalPaid.textContent = "—";
    totalInterest.textContent = "—";
    return;
  }

  const n = termYears * 12;
  const monthlyRate = (annualRate || 0) / 100 / 12;

  let payment;
  if (monthlyRate === 0) {
    payment = p / n;
  } else {
    payment = (p * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  }

  const total = payment * n;
  const interest = total - p;

  monthlyPayment.textContent = format(payment);
  totalPaid.textContent = format(total);
  totalInterest.textContent = format(interest);
}

[principal, rate, years].forEach((el) => el.addEventListener("input", calculate));

calculate();
