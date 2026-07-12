const mode = document.getElementById("mode");
const labelX = document.getElementById("label-x");
const labelY = document.getElementById("label-y");
const valueX = document.getElementById("value-x");
const valueY = document.getElementById("value-y");
const calcBtn = document.getElementById("calc-btn");
const result = document.getElementById("result");
const resultValue = document.getElementById("result-value");
const resultLabel = document.getElementById("result-label");

const LABELS = {
  of: ["X (percent)", "Y (number)"],
  isWhatPercent: ["X", "Y"],
  change: ["X (from)", "Y (to)"],
};

function updateLabels() {
  const [xLabel, yLabel] = LABELS[mode.value];
  labelX.textContent = xLabel;
  labelY.textContent = yLabel;
}

mode.addEventListener("change", updateLabels);
updateLabels();

calcBtn.addEventListener("click", () => {
  const x = parseFloat(valueX.value);
  const y = parseFloat(valueY.value);

  if (Number.isNaN(x) || Number.isNaN(y)) {
    resultValue.textContent = "Enter both values";
    resultLabel.textContent = "";
    result.classList.remove("hidden");
    return;
  }

  let value, label;

  if (mode.value === "of") {
    value = (x / 100) * y;
    label = `${x}% of ${y}`;
  } else if (mode.value === "isWhatPercent") {
    value = (x / y) * 100;
    label = `${x} is this percent of ${y}`;
  } else {
    value = ((y - x) / x) * 100;
    label = value >= 0 ? "increase" : "decrease";
  }

  resultValue.textContent =
    (mode.value === "isWhatPercent" || mode.value === "change" ? "" : "") +
    (Math.round(value * 100) / 100) +
    (mode.value === "of" ? "" : "%");
  resultLabel.textContent = label;
  result.classList.remove("hidden");
});
