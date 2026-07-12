const birthDateInput = document.getElementById("birth-date");
const targetDateInput = document.getElementById("target-date");
const ageResult = document.getElementById("age-result");
const totalDays = document.getElementById("total-days");
const totalWeeks = document.getElementById("total-weeks");
const nextBirthday = document.getElementById("next-birthday");

function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

targetDateInput.value = todayIso();

function diffYmd(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function calculate() {
  if (!birthDateInput.value) {
    ageResult.textContent = "—";
    totalDays.textContent = "—";
    totalWeeks.textContent = "—";
    nextBirthday.textContent = "—";
    return;
  }

  const birth = new Date(birthDateInput.value + "T00:00:00");
  const target = new Date((targetDateInput.value || todayIso()) + "T00:00:00");

  if (birth > target) {
    ageResult.textContent = "Birth date is after target date";
    totalDays.textContent = "—";
    totalWeeks.textContent = "—";
    nextBirthday.textContent = "—";
    return;
  }

  const { years, months, days } = diffYmd(birth, target);
  ageResult.textContent = `${years}y ${months}m ${days}d`;

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysElapsed = Math.round((target - birth) / msPerDay);
  totalDays.textContent = daysElapsed.toLocaleString();
  totalWeeks.textContent = Math.floor(daysElapsed / 7).toLocaleString();

  let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < target) {
    nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntil = Math.round((nextBday - target) / msPerDay);
  nextBirthday.textContent = daysUntil === 0 ? "Today!" : `${daysUntil} days`;
}

[birthDateInput, targetDateInput].forEach((el) => el.addEventListener("input", calculate));

calculate();
