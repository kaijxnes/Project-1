const UNITS = {
  length: {
    label: "Length",
    units: {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.344,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254,
    },
  },
  weight: {
    label: "Weight",
    units: {
      kilograms: 1,
      grams: 0.001,
      milligrams: 0.000001,
      pounds: 0.45359237,
      ounces: 0.028349523125,
    },
  },
  temperature: {
    label: "Temperature",
    units: {
      celsius: "celsius",
      fahrenheit: "fahrenheit",
      kelvin: "kelvin",
    },
  },
};

const category = document.getElementById("category");
const fromValue = document.getElementById("from-value");
const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const resultValue = document.getElementById("result-value");
const resultLabel = document.getElementById("result-label");

function populateUnits() {
  const units = Object.keys(UNITS[category.value].units);
  fromUnit.innerHTML = units.map((u) => `<option value="${u}">${capitalize(u)}</option>`).join("");
  toUnit.innerHTML = units.map((u) => `<option value="${u}">${capitalize(u)}</option>`).join("");
  toUnit.selectedIndex = units.length > 1 ? 1 : 0;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCelsius(value, unit) {
  if (unit === "celsius") return value;
  if (unit === "fahrenheit") return ((value - 32) * 5) / 9;
  if (unit === "kelvin") return value - 273.15;
}

function fromCelsius(value, unit) {
  if (unit === "celsius") return value;
  if (unit === "fahrenheit") return (value * 9) / 5 + 32;
  if (unit === "kelvin") return value + 273.15;
}

function convert() {
  const value = parseFloat(fromValue.value);
  if (Number.isNaN(value)) {
    resultValue.textContent = "Enter a value";
    resultLabel.textContent = "";
    return;
  }

  let output;
  if (category.value === "temperature") {
    output = fromCelsius(toCelsius(value, fromUnit.value), toUnit.value);
  } else {
    const units = UNITS[category.value].units;
    const baseValue = value * units[fromUnit.value];
    output = baseValue / units[toUnit.value];
  }

  const rounded = Math.round(output * 1e6) / 1e6;
  resultValue.textContent = rounded;
  resultLabel.textContent = `${value} ${fromUnit.value} = ${rounded} ${toUnit.value}`;
}

category.addEventListener("change", () => {
  populateUnits();
  convert();
});
fromValue.addEventListener("input", convert);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);

populateUnits();
convert();
