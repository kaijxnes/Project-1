const bill = document.getElementById("bill");
const tipPercent = document.getElementById("tip-percent");
const people = document.getElementById("people");
const tipAmount = document.getElementById("tip-amount");
const totalAmount = document.getElementById("total-amount");
const perPerson = document.getElementById("per-person");

function format(value) {
  return "$" + (Number.isFinite(value) ? value.toFixed(2) : "0.00");
}

function calculate() {
  const billValue = parseFloat(bill.value) || 0;
  const tipValue = parseFloat(tipPercent.value) || 0;
  const peopleValue = Math.max(1, parseInt(people.value, 10) || 1);

  const tip = billValue * (tipValue / 100);
  const total = billValue + tip;

  tipAmount.textContent = format(tip);
  totalAmount.textContent = format(total);
  perPerson.textContent = format(total / peopleValue);
}

[bill, tipPercent, people].forEach((el) => el.addEventListener("input", calculate));

calculate();
