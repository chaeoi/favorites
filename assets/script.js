document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const selectedOption = document.getElementById("selectedOption");
  const optionsList = document.getElementById("optionsList");
  const selectedIcon = document.getElementById("selectedIcon");
  const categoriesContainer = document.getElementById("categoriesContainer");

  let currentSearchUrlBase = "https://www.google.com/search?q=";

  selectedOption.onclick = (event) => {
    optionsList.classList.toggle("show");
    event.stopPropagation();
  };

  optionsList.onclick = (event) => {
    const targetLi = event.target.closest("li");
    if (targetLi) {
      selectedIcon.src = targetLi.querySelector(".select-icon").src;
      currentSearchUrlBase = targetLi.dataset.url;
      optionsList.classList.remove("show");
    }
  };

  document.addEventListener("click", (event) => {
    if (!selectedOption.contains(event.target) && !optionsList.contains(event.target)) {
      optionsList.classList.remove("show");
    }
  });

  form.onsubmit = (event) => {
    event.preventDefault();
    window.location.href = currentSearchUrlBase + encodeURIComponent(searchInput.value);
  };
  function createLinkElement(link) {
    const linkLi = document.createElement("li");
    const linkA = document.createElement("a");
    linkA.href = link.url;
    linkA.textContent = link.text;
    linkLi.appendChild(linkA);
    return linkLi;
  }

  function generateCategoryHTML(categoryData) {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");

    if (categoryData.category) {
      const categoryTitle = document.createElement("h2");
      categoryTitle.textContent = categoryData.category;
      categoryDiv.appendChild(categoryTitle);
    }

    if (categoryData.links) {
      const linksUl = document.createElement("ul");
      linksUl.classList.add("links");
      categoryData.links.forEach((link) => linksUl.appendChild(createLinkElement(link)));
      categoryDiv.appendChild(linksUl);
    }

    if (categoryData.subcategories) {
      categoryData.subcategories.forEach((subcategoryData) => {
        const subcategoryDiv = generateCategoryHTML(subcategoryData);
        if (subcategoryData.name) {
          const subcategoryTitle = document.createElement("h3");
          subcategoryTitle.textContent = subcategoryData.name;
          subcategoryDiv.insertBefore(subcategoryTitle, subcategoryDiv.firstChild);
        }
        categoryDiv.appendChild(subcategoryDiv);
      });
    }
    return categoryDiv;
  }

  fetch("data/data.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((categoryData) => {
        categoriesContainer.appendChild(generateCategoryHTML(categoryData));
      });
    })
    .catch((error) => console.error("Error loading links:", error));
});
