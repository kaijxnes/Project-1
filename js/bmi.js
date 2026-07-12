const units = document.getElementById("units");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const heightLabel = document.getElementById("height-label");
const weightLabel = document.getElementById("weight-label");
const bmiValue = document.getElementById("bmi-value");
const bmiCategory = document.getElementById("bmi-category");

function updateLabels() {
  if (units.value === "metric") {
    heightLabel.textContent = "Height (cm)";
    weightLabel.textContent = "Weight (kg)";
  } else {
    heightLabel.textContent = "Height (in)";
    weightLabel.textContent = "Weight (lb)";
  }
}

function category(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function calculate() {
  const height = parseFloat(heightInput.value);
  const weight = parseFloat(weightInput.value);

  if (!height || !weight || height <= 0 || weight <= 0) {
    bmiValue.textContent = "—";
    bmiCategory.textContent = "";
    return;
  }

  let bmi;
  if (units.value === "metric") {
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
  } else {
    bmi = (weight / (height * height)) * 703;
  }

  bmiValue.textContent = bmi.toFixed(1);
  bmiCategory.textContent = category(bmi);
}

units.addEventListener("change", () => {
  updateLabels();
  calculate();
});
[heightInput, weightInput].forEach((el) => el.addEventListener("input", calculate));

updateLabels();
calculate();
