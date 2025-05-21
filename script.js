//This code adds a toggle functionality to a dropdown menu 
// when clicking on an element with the class .dropdown-toggle.
document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.classList.toggle('open');
    });
  });
  // Initialize an empty array to store all products
let allProducts = [];
// Function to render product cards in the gallery
function renderProducts(products) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  products.forEach((item) => {
   // Generate a unique ID for the main image
    const mainImgId = `main-img-${Math.random().toString(36)}`;

    // Create the card container for each product
    const card = document.createElement("div");
    card.className = "card";

    const mainImage = document.createElement("img");
    mainImage.className = "main-img";
    mainImage.id = mainImgId;
    mainImage.src = item.mainImage;
    mainImage.alt = item.title;

    const thumbnailRow = document.createElement("div");
    thumbnailRow.className = "thumbnail-row";

    item.thumbnails.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.className = "thumbnails-img";
      thumb.src = img;
      thumb.dataset.target = mainImgId;
      thumbnailRow.appendChild(thumb);
      
     // Change the main image when hovering over the thumbnail
      thumb.addEventListener("mouseenter", () => {
         mainImage.src = thumb.src;
      });
      thumb.addEventListener("mouseleave", () => {
        mainImage.src = item.mainImage;
      });
    });

    if (item.hasMoreOptions) {
      const moreBtn = document.createElement("button");
      moreBtn.className = "more-btn";
      moreBtn.textContent = "More";
      thumbnailRow.appendChild(moreBtn);
    }

    const title = document.createElement("div");
    title.className = "imgTitle";
    title.textContent = item.title;

    const oldPrice = document.createElement("div");
    oldPrice.className = "old-price";
    oldPrice.textContent = item.originalPrice;

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = item.salePrice;
    card.appendChild(mainImage);
    card.appendChild(thumbnailRow);
    card.appendChild(title);
    card.appendChild(oldPrice);
    card.appendChild(price);
    gallery.appendChild(card);
  });
  document.querySelector(".results-count").textContent = `${products.length} Results`;
}
function filterByPrice() {
  const selectedRanges = Array.from(document.querySelectorAll('#price-filter input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  if (selectedRanges.length === 0) {
    renderProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter(product => {
    const prices = product.salePrice
      .replace(/[^\d\.\-]/g, '')   // Remove non-numeric characters except dot and hyphen
      .split('-')
      .map(str => parseFloat(str.trim()))
      .filter(n => !isNaN(n));

    if (prices.length === 0) return false;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return selectedRanges.some(range => {
      const [rangeMin, rangeMax] = range.split('-').map(Number);
      return maxPrice >= rangeMin && minPrice <= rangeMax;
    });
  });

  renderProducts(filtered);
}
///////
function updateActiveFilters() {
  const container = document.getElementById('active-filters');
  container.innerHTML = '';

  const selectedPriceRanges = Array.from(document.querySelectorAll('#price-filter input[type="checkbox"]:checked'));

  if (selectedPriceRanges.length > 0) {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'reset-button';
    resetBtn.textContent = 'Reset Filters  X';
    resetBtn.onclick = () => {
      selectedPriceRanges.forEach(cb => cb.checked = false);
      filterByPrice();
      updateActiveFilters();
    };
    container.appendChild(resetBtn);
  }

  selectedPriceRanges.forEach(cb => {
    const badge = document.createElement('div');
    badge.className = 'filter-badge';
    badge.textContent = `$${cb.value.replace('-', ' - $')}`;
    badge.textContent = cb.value;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.onclick = () => {
      cb.checked = false;
      filterByPrice();
      updateActiveFilters();
    };

    badge.appendChild(closeBtn);
    container.appendChild(badge);
  });
}
/////////

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    renderProducts(allProducts);

    const priceCheckboxes = document.querySelectorAll('#price-filter input[type="checkbox"]');
    priceCheckboxes.forEach(cb => cb.addEventListener('change', () => {
  filterByPrice();
  updateActiveFilters();
}));

  })
  .catch((err) => {
    console.error("Failed to load product data.", err);
  });