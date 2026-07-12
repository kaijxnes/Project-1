const searchInput = document.getElementById("calc-search");
const cards = Array.from(document.querySelectorAll(".card"));
const categories = Array.from(document.querySelectorAll(".category"));
const noResults = document.getElementById("no-results");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let anyVisible = false;

    categories.forEach((section) => {
      let categoryHasMatch = false;
      section.querySelectorAll(".card").forEach((card) => {
        const haystack = (card.dataset.name || "") + " " + card.textContent;
        const match = haystack.toLowerCase().includes(query);
        card.classList.toggle("hidden", !match);
        if (match) categoryHasMatch = true;
      });
      section.classList.toggle("hidden", !categoryHasMatch);
      if (categoryHasMatch) anyVisible = true;
    });

    noResults.classList.toggle("hidden", anyVisible);
  });
}
