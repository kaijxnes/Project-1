const ZONES = [
  ["UTC", "UTC"],
  ["Europe/London", "London"],
  ["Europe/Dublin", "Dublin"],
  ["Europe/Lisbon", "Lisbon"],
  ["Europe/Paris", "Paris / Berlin / Madrid"],
  ["Europe/Athens", "Athens / Helsinki"],
  ["Europe/Moscow", "Moscow"],
  ["Europe/Istanbul", "Istanbul"],
  ["Africa/Cairo", "Cairo"],
  ["Africa/Johannesburg", "Johannesburg"],
  ["Asia/Dubai", "Dubai"],
  ["Asia/Kolkata", "Mumbai / Delhi"],
  ["Asia/Dhaka", "Dhaka"],
  ["Asia/Bangkok", "Bangkok / Jakarta"],
  ["Asia/Shanghai", "Beijing / Shanghai"],
  ["Asia/Hong_Kong", "Hong Kong"],
  ["Asia/Singapore", "Singapore"],
  ["Asia/Tokyo", "Tokyo"],
  ["Asia/Seoul", "Seoul"],
  ["Australia/Perth", "Perth"],
  ["Australia/Sydney", "Sydney / Melbourne"],
  ["Pacific/Auckland", "Auckland"],
  ["America/Sao_Paulo", "São Paulo"],
  ["America/New_York", "New York (Eastern)"],
  ["America/Chicago", "Chicago (Central)"],
  ["America/Denver", "Denver (Mountain)"],
  ["America/Los_Angeles", "Los Angeles (Pacific)"],
  ["America/Anchorage", "Anchorage"],
  ["Pacific/Honolulu", "Honolulu"],
];

function populateSelects() {
  const fromSel = document.getElementById("tz-from");
  const toSel = document.getElementById("tz-to");
  ZONES.forEach(([value, label]) => {
    fromSel.add(new Option(label, value));
    toSel.add(new Option(label, value));
  });
  fromSel.value = "Europe/London";
  toSel.value = "America/New_York";
}

function offsetMinutesAt(date, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = {};
  dtf.formatToParts(date).forEach((p) => {
    if (p.type !== "literal") parts[p.type] = p.value;
  });
  const asUTC = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
    +parts.second
  );
  return (asUTC - date.getTime()) / 60000;
}

function zonedWallTimeToUtc(localDateTimeStr, timeZone) {
  const [datePart, timePart] = localDateTimeStr.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const offset = offsetMinutesAt(guess, timeZone);
  return new Date(guess.getTime() - offset * 60000);
}

function formatInZone(date, timeZone) {
  return date.toLocaleString("en-GB", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nowInZoneValue(timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = {};
  dtf.formatToParts(new Date()).forEach((p) => {
    if (p.type !== "literal") parts[p.type] = p.value;
  });
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function calculate() {
  const input = document.getElementById("tz-datetime").value;
  const fromZone = document.getElementById("tz-from").value;
  const toZone = document.getElementById("tz-to").value;

  if (!input) {
    document.getElementById("tz-result").textContent = "—";
    document.getElementById("tz-diff").textContent = "—";
    return;
  }

  const utcInstant = zonedWallTimeToUtc(input, fromZone);
  document.getElementById("tz-result").textContent = formatInZone(utcInstant, toZone);
  document.getElementById("tz-result-zone").textContent = "Converted time";

  const fromOffset = offsetMinutesAt(utcInstant, fromZone);
  const toOffset = offsetMinutesAt(utcInstant, toZone);
  const diffMinutes = toOffset - fromOffset;
  const diffHours = diffMinutes / 60;
  const sign = diffHours > 0 ? "+" : "";
  document.getElementById("tz-diff").textContent = `${sign}${diffHours}h`;
}

document.getElementById("tz-now").addEventListener("click", () => {
  const fromZone = document.getElementById("tz-from").value;
  document.getElementById("tz-datetime").value = nowInZoneValue(fromZone);
  calculate();
});

["tz-datetime", "tz-from", "tz-to"].forEach((id) =>
  document.getElementById(id).addEventListener("input", calculate)
);

populateSelects();
document.getElementById("tz-datetime").value = nowInZoneValue(
  document.getElementById("tz-from").value
);
calculate();
