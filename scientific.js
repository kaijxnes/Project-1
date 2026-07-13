const historyEl = document.getElementById("history");
const currentEl = document.getElementById("current");

let angleMode = "deg";

const OPERATORS = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => (b === 0 ? NaN : a / b),
  "^": (a, b) => Math.pow(a, b),
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

function setConstant(value) {
  displayValue = formatNumber(value);
  awaitingSecondOperand = false;
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

function inputPercent() {
  displayValue = formatNumber(parseFloat(displayValue) / 100);
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function applyUnary(name) {
  const value = parseFloat(displayValue);
  const angle = angleMode === "deg" ? toRadians(value) : value;
  let result;
  switch (name) {
    case "sin":
      result = Math.sin(angle);
      break;
    case "cos":
      result = Math.cos(angle);
      break;
    case "tan":
      result = Math.tan(angle);
      break;
    case "sqrt":
      result = value < 0 ? NaN : Math.sqrt(value);
      break;
    case "square":
      result = value * value;
      break;
    case "log":
      result = value <= 0 ? NaN : Math.log10(value);
      break;
    case "ln":
      result = value <= 0 ? NaN : Math.log(value);
      break;
  }
  displayValue = formatNumber(result);
  awaitingSecondOperand = false;
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

function setAngleMode(mode) {
  angleMode = mode;
  document.querySelectorAll(".key-mode").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === mode);
  });
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
    case "unary":
      applyUnary(value);
      break;
    case "constant":
      setConstant(value === "pi" ? Math.PI : Math.E);
      break;
    case "angle-mode":
      setAngleMode(value);
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
    case "^":
      handleAction("operator", "^");
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
