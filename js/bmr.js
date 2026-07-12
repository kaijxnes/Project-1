const sex = document.getElementById("sex");
const age = document.getElementById("age");
const height = document.getElementById("height");
const weight = document.getElementById("weight");
const activity = document.getElementById("activity");
const bmrValue = document.getElementById("bmr-value");
const tdeeValue = document.getElementById("tdee-value");

function calculate() {
  const ageValue = parseFloat(age.value);
  const heightValue = parseFloat(height.value);
  const weightValue = parseFloat(weight.value);

  if (!ageValue || !heightValue || !weightValue || ageValue <= 0 || heightValue <= 0 || weightValue <= 0) {
    bmrValue.textContent = "—";
    tdeeValue.textContent = "—";
    return;
  }

  const base = 10 * weightValue + 6.25 * heightValue - 5 * ageValue;
  const bmr = sex.value === "male" ? base + 5 : base - 161;
  const tdee = bmr * parseFloat(activity.value);

  bmrValue.textContent = Math.round(bmr) + " kcal/day";
  tdeeValue.textContent = Math.round(tdee) + " kcal/day";
}

[sex, age, height, weight, activity].forEach((el) => {
  el.addEventListener("input", calculate);
  el.addEventListener("change", calculate);
});

calculate();
