function diffYMD(start, end) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calculate() {
  const input = document.getElementById("dob").value;
  if (!input) {
    document.getElementById("age-value").textContent = "—";
    document.getElementById("birth-weekday").textContent = "—";
    document.getElementById("days-lived").textContent = "—";
    document.getElementById("days-until").textContent = "—";
    return;
  }

  const [y, m, d] = input.split("-").map(Number);
  const dob = new Date(y, m - 1, d);
  const today = startOfDay(new Date());

  if (dob > today) {
    document.getElementById("age-value").textContent = "Not born yet";
    document.getElementById("birth-weekday").textContent = "—";
    document.getElementById("days-lived").textContent = "—";
    document.getElementById("days-until").textContent = "—";
    return;
  }

  const age = diffYMD(dob, today);
  document.getElementById("age-value").textContent =
    `${age.years}y ${age.months}m ${age.days}d`;

  document.getElementById("birth-weekday").textContent = dob.toLocaleDateString(undefined, {
    weekday: "long",
  });

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLived = Math.round((today - dob) / msPerDay);
  document.getElementById("days-lived").textContent = daysLived.toLocaleString();

  let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }
  const daysUntil = Math.round((nextBirthday - today) / msPerDay);
  document.getElementById("days-until").textContent =
    daysUntil === 0 ? "Today! 🎉" : `${daysUntil.toLocaleString()} day${daysUntil === 1 ? "" : "s"}`;
}

document.getElementById("dob").addEventListener("input", calculate);
calculate();
