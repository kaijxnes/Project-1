const price = document.getElementById("price");
const discount = document.getElementById("discount");
const savings = document.getElementById("savings");
const salePrice = document.getElementById("sale-price");

function format(value) {
  return "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
  const priceValue = parseFloat(price.value);
  const discountValue = parseFloat(discount.value);

  if (!Number.isFinite(priceValue) || !Number.isFinite(discountValue)) {
    savings.textContent = "—";
    salePrice.textContent = "—";
    return;
  }

  const saved = priceValue * (discountValue / 100);
  savings.textContent = format(saved);
  salePrice.textContent = format(priceValue - saved);
}

[price, discount].forEach((el) => el.addEventListener("input", calculate));

calculate();
