const output = document.getElementById("output");
const expression = document.getElementById("expression");
const pad = document.getElementById("pad");

let expr = "";

function render() {
  expression.textContent = expr || " ";
  output.textContent = expr === "" ? "0" : expr;
}

function lastCharIsOperator() {
  return /[+\-*/]$/.test(expr);
}

function tokenize(input) {
  const tokens = [];
  let numberBuffer = "";
  for (const char of input) {
    if (/[0-9.]/.test(char)) {
      numberBuffer += char;
    } else if ("+-*/".includes(char)) {
      if (numberBuffer) {
        tokens.push(parseFloat(numberBuffer));
        numberBuffer = "";
      }
      tokens.push(char);
    }
  }
  if (numberBuffer) tokens.push(parseFloat(numberBuffer));
  return tokens;
}

function evaluate(tokens) {
  // First pass: * and /
  const pass1 = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === "*" || token === "/") {
      const prev = pass1.pop();
      const next = tokens[i + 1];
      pass1.push(token === "*" ? prev * next : prev / next);
      i += 2;
    } else {
      pass1.push(token);
      i += 1;
    }
  }
  // Second pass: + and -
  let result = pass1[0];
  for (let j = 1; j < pass1.length; j += 2) {
    const op = pass1[j];
    const value = pass1[j + 1];
    result = op === "+" ? result + value : result - value;
  }
  return result;
}

pad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { action, value } = button.dataset;

  if (action === "clear") {
    expr = "";
  } else if (action === "delete") {
    expr = expr.slice(0, -1);
  } else if (action === "percent") {
    if (expr && !lastCharIsOperator()) {
      const tokens = tokenize(expr);
      const lastNumber = tokens[tokens.length - 1];
      const newLast = lastNumber / 100;
      expr = expr.replace(/[0-9.]+$/, String(newLast));
    }
  } else if (action === "equals") {
    if (!expr || lastCharIsOperator()) return;
    try {
      const tokens = tokenize(expr);
      const result = evaluate(tokens);
      expr = Number.isFinite(result) ? String(Math.round(result * 1e10) / 1e10) : "Error";
    } catch {
      expr = "Error";
    }
  } else if (value !== undefined) {
    if (value === "." ) {
      const parts = expr.split(/[+\-*/]/);
      if (parts[parts.length - 1].includes(".")) return;
      if (expr === "" || lastCharIsOperator()) expr += "0";
    }
    if ("+-*/".includes(value)) {
      if (expr === "" && value !== "-") return;
      if (lastCharIsOperator()) {
        expr = expr.slice(0, -1) + value;
        render();
        return;
      }
    }
    expr += value;
  }

  render();
});

document.addEventListener("keydown", (event) => {
  if (/[0-9.+\-*/]/.test(event.key)) {
    const button = pad.querySelector(`button[data-value="${CSS.escape(event.key)}"]`);
    if (button) button.click();
  } else if (event.key === "Enter" || event.key === "=") {
    pad.querySelector('[data-action="equals"]').click();
  } else if (event.key === "Backspace") {
    pad.querySelector('[data-action="delete"]').click();
  } else if (event.key === "Escape") {
    pad.querySelector('[data-action="clear"]').click();
  }
});

render();
