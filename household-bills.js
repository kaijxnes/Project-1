const peopleRowsEl = document.getElementById("people-rows");
const billRowsEl = document.getElementById("bill-rows");

function fmtMoney(value) {
  if (!isFinite(value)) return "£0.00";
  return "£" + value.toFixed(2);
}

function fmtPercent(value) {
  if (!isFinite(value)) return "0%";
  return value.toFixed(1) + "%";
}

/* ---------- People ---------- */
function addPersonRow(name = "", pct = "") {
  const row = document.createElement("div");
  row.className = "dyn-row";
  row.innerHTML = `
    <span class="row-index">${peopleRowsEl.children.length + 1}</span>
    <input class="grow" type="text" placeholder="Name" value="${name}" data-field="name">
    <input class="fixed-sm" type="number" placeholder="0" step="any" value="${pct}" data-field="pct">
    <button class="btn-remove" type="button" title="Remove">✕</button>
  `;
  row.querySelector(".btn-remove").addEventListener("click", () => {
    row.remove();
    renumber(peopleRowsEl);
    calculate();
  });
  peopleRowsEl.appendChild(row);
}

/* ---------- Bills ---------- */
function addBillRow(name = "", amount = "") {
  const row = document.createElement("div");
  row.className = "dyn-row";
  row.innerHTML = `
    <span class="row-index">${billRowsEl.children.length + 1}</span>
    <input class="grow" type="text" placeholder="e.g. Rent" value="${name}" data-field="name">
    <input class="fixed-sm" type="number" placeholder="0.00" step="any" value="${amount}" data-field="amount">
    <button class="btn-remove" type="button" title="Remove">✕</button>
  `;
  row.querySelector(".btn-remove").addEventListener("click", () => {
    row.remove();
    renumber(billRowsEl);
    calculate();
  });
  billRowsEl.appendChild(row);
}

function renumber(container) {
  [...container.children].forEach((row, i) => {
    row.querySelector(".row-index").textContent = i + 1;
  });
}

function calculate() {
  const people = [...peopleRowsEl.children].map((row, i) => ({
    name: row.querySelector('[data-field="name"]').value || `Person ${i + 1}`,
    pct: parseFloat(row.querySelector('[data-field="pct"]').value) || 0,
  }));

  const bills = [...billRowsEl.children].map((row) => ({
    name: row.querySelector('[data-field="name"]').value,
    amount: parseFloat(row.querySelector('[data-field="amount"]').value) || 0,
  }));

  const totalPct = people.reduce((sum, p) => sum + p.pct, 0);
  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);

  document.getElementById("people-total-pct").textContent = fmtPercent(totalPct);
  document.getElementById("bills-total").textContent = fmtMoney(totalBills);

  const outBody = document.getElementById("split-out-body");
  outBody.innerHTML = "";
  people.forEach((p) => {
    const share = totalPct !== 0 ? p.pct / totalPct : 0;
    const owed = share * totalBills;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${fmtPercent(share * 100)}</td>
      <td>${fmtMoney(owed)}</td>
    `;
    outBody.appendChild(tr);
  });
}

document.getElementById("add-person").addEventListener("click", () => {
  addPersonRow();
  calculate();
});
document.getElementById("add-bill").addEventListener("click", () => {
  addBillRow();
  calculate();
});
peopleRowsEl.addEventListener("input", calculate);
billRowsEl.addEventListener("input", calculate);

addPersonRow("Person 1", "50");
addPersonRow("Person 2", "50");
addBillRow("Rent", "");
addBillRow("Utilities", "");

calculate();
