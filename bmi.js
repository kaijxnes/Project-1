function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
      calculate();
    });
  });
}

function num(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function activeMode() {
  return document.querySelector(".tab.active").dataset.tab;
}

function categoryFor(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function calculate() {
  const mode = activeMode();
  let bmi = 0;

  if (mode === "metric") {
    const heightCm = num("m-height");
    const weightKg = num("m-weight");
    const heightM = heightCm / 100;
    bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;
  } else {
    const feet = num("i-feet");
    const inches = num("i-inches");
    const weightLb = num("i-weight");
    const totalInches = feet * 12 + inches;
    bmi = totalInches > 0 ? (703 * weightLb) / (totalInches * totalInches) : 0;
  }

  if (bmi > 0) {
    document.getElementById("bmi-value").textContent = bmi.toFixed(1);
    document.getElementById("bmi-category").textContent = categoryFor(bmi);
  } else {
    document.getElementById("bmi-value").textContent = "—";
    document.getElementById("bmi-category").textContent = "Enter your height and weight";
  }
}

["m-height", "m-weight", "i-feet", "i-inches", "i-weight"].forEach((id) =>
  document.getElementById(id).addEventListener("input", calculate)
);

initTabs();
calculate();
