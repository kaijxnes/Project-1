const output = document.getElementById("output");
const expression = document.getElementById("expression");
const pad = document.getElementById("pad");

let expr = "";

function render() {
  expression.textContent = expr || " ";
  output.textContent = expr === "" ? "0" : expr;
}

const FUNCTIONS = ["sin", "cos", "tan", "log", "ln", "sqrt"];

// Recursive-descent parser: expr -> term (('+'|'-') term)*
//                            term -> power (('*'|'/') power)*
//                            power -> unary ('^' unary)*
//                            unary -> '-' unary | primary
//                            primary -> number | 'pi' | func '(' expr ')' | '(' expr ')'
function parse(input) {
  let pos = 0;

  function peek() {
    return input[pos];
  }

  function skipNothing() {}

  function matchWord(word) {
    if (input.startsWith(word, pos)) {
      pos += word.length;
      return true;
    }
    return false;
  }

  function parseExpr() {
    let value = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = input[pos++];
      const rhs = parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  function parseTerm() {
    let value = parsePower();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = input[pos++];
      const rhs = parsePower();
      if (op === "*") value *= rhs;
      else if (op === "/") value /= rhs;
      else value = value % rhs;
    }
    return value;
  }

  function parsePower() {
    let value = parseUnary();
    while (peek() === "^") {
      pos++;
      const rhs = parseUnary();
      value = Math.pow(value, rhs);
    }
    return value;
  }

  function parseUnary() {
    if (peek() === "-") {
      pos++;
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary() {
    if (peek() === "(") {
      pos++;
      const value = parseExpr();
      if (peek() === ")") pos++;
      return value;
    }

    for (const fn of FUNCTIONS) {
      if (matchWord(fn + "(")) {
        const arg = parseExpr();
        if (peek() === ")") pos++;
        switch (fn) {
          case "sin":
            return Math.sin((arg * Math.PI) / 180);
          case "cos":
            return Math.cos((arg * Math.PI) / 180);
          case "tan":
            return Math.tan((arg * Math.PI) / 180);
          case "log":
            return Math.log10(arg);
          case "ln":
            return Math.log(arg);
          case "sqrt":
            return Math.sqrt(arg);
        }
      }
    }

    if (matchWord("pi")) return Math.PI;

    const start = pos;
    while (pos < input.length && /[0-9.]/.test(input[pos])) pos++;
    if (pos === start) throw new Error("Unexpected character: " + input[pos]);
    return parseFloat(input.slice(start, pos));
  }

  const result = parseExpr();
  if (pos !== input.length) throw new Error("Unexpected trailing input");
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
  } else if (action === "equals") {
    if (!expr) return;
    try {
      const result = parse(expr);
      expr = Number.isFinite(result) ? String(Math.round(result * 1e10) / 1e10) : "Error";
    } catch {
      expr = "Error";
    }
  } else if (value !== undefined) {
    expr += value;
  }

  render();
});

render();
