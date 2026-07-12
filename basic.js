const historyEl = document.getElementById("history");
const currentEl = document.getElementById("current");

const OPERATORS = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => (b === 0 ? NaN : a / b),
};

let firstOperand = null;
let pendingOperator = null;
let displayValue = "0";
let awaitingSecondOperand = false;

function formatNumber(value) {
  if (!isFinite(value)) return "Error";
  const rounded = Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}

function updateDisplay() {
  currentEl.textContent = displayValue;
  historyEl.textContent =
    firstOperand !== null && pendingOperator
      ? `${formatNumber(firstOperand)} ${pendingOperator}`
      : "";
}

function inputNumber(digit) {
  if (awaitingSecondOperand) {
    displayValue = digit;
    awaitingSecondOperand = false;
  } else {
    displayValue = displayValue === "0" ? digit : displayValue + digit;
  }
}

function inputDecimal() {
  if (awaitingSecondOperand) {
    displayValue = "0.";
    awaitingSecondOperand = false;
    return;
  }
  if (!displayValue.includes(".")) {
    displayValue += ".";
  }
}

function clearAll() {
  firstOperand = null;
  pendingOperator = null;
  displayValue = "0";
  awaitingSecondOperand = false;
}

function deleteLast() {
  if (awaitingSecondOperand) return;
  displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : "0";
}

function toggleSign() {
  if (displayValue === "0") return;
  displayValue = displayValue.startsWith("-")
    ? displayValue.slice(1)
    : "-" + displayValue;
}

function inputPercent() {
  displayValue = formatNumber(parseFloat(displayValue) / 100);
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(displayValue);

  if (pendingOperator && awaitingSecondOperand) {
    pendingOperator = nextOperator;
    updateDisplay();
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (pendingOperator) {
    const result = OPERATORS[pendingOperator](firstOperand, inputValue);
    displayValue = formatNumber(result);
    firstOperand = result;
  }

  pendingOperator = nextOperator;
  awaitingSecondOperand = true;
  updateDisplay();
}

function handleEquals() {
  if (pendingOperator === null || awaitingSecondOperand) return;
  const inputValue = parseFloat(displayValue);
  const result = OPERATORS[pendingOperator](firstOperand, inputValue);
  displayValue = formatNumber(result);
  firstOperand = null;
  pendingOperator = null;
  awaitingSecondOperand = false;
}

function handleAction(action, value) {
  switch (action) {
    case "number":
      inputNumber(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "clear":
      clearAll();
      break;
    case "delete":
      deleteLast();
      break;
    case "percent":
      inputPercent();
      break;
    case "operator":
      handleOperator(value);
      break;
    case "equals":
      handleEquals();
      break;
  }
  updateDisplay();
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest(".key");
  if (!button) return;
  handleAction(button.dataset.action, button.dataset.value);
});

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    handleAction("number", key);
    return;
  }

  switch (key) {
    case ".":
      handleAction("decimal");
      break;
    case "+":
      handleAction("operator", "+");
      break;
    case "-":
      handleAction("operator", "−");
      break;
    case "*":
      handleAction("operator", "×");
      break;
    case "/":
      event.preventDefault();
      handleAction("operator", "÷");
      break;
    case "Enter":
    case "=":
      handleAction("equals");
      break;
    case "Backspace":
      handleAction("delete");
      break;
    case "Escape":
      handleAction("clear");
      break;
    case "%":
      handleAction("percent");
      break;
  }
});

updateDisplay();
