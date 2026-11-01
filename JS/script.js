```javascript
/* PRODUCT SEARCH */

function searchProducts() {
    let searchInput = document.getElementById("productSearch");
    let searchMessage = document.getElementById("searchMessage");

    if (!searchInput || !searchMessage) return;

    let searchText = searchInput.value.toLowerCase().trim();
    let products = document.querySelectorAll("main h3");
    let found = false;

    for (let i = 0; i < products.length; i++) {
        let productName = products[i].textContent.toLowerCase();

        if (searchText !== "" && productName.includes(searchText)) {
            products[i].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            searchMessage.textContent =
                "Category found: " + products[i].textContent;

            found = true;
            break;
        }
    }

    if (!found) {
        searchMessage.textContent =
            "No matching category found. Try Groceries, Fresh Produce, Beverages or Household Products.";
    }
}


/* IMAGE GALLERY LIGHTBOX */

function setupLightbox() {
    let images = document.querySelectorAll("main img");

    images.forEach(function (image) {
        image.style.cursor = "pointer";

        image.onclick = function () {
            if (document.querySelector(".lightbox")) return;

            let lightbox = document.createElement("div");
            lightbox.className = "lightbox";

            let largeImage = document.createElement("img");
            largeImage.src = image.src;
            largeImage.alt = image.alt;

            let closeButton = document.createElement("button");
            closeButton.textContent = "Close X";
            closeButton.className = "lightbox-close";

            lightbox.appendChild(closeButton);
            lightbox.appendChild(largeImage);
            document.body.appendChild(lightbox);

            closeButton.onclick = function () {
                lightbox.remove();
            };

            lightbox.onclick = function (event) {
                if (event.target === lightbox) {
                    lightbox.remove();
                }
            };
        };
    });
}


/* INTERACTIVE MAP */

function setupMap() {
    let mapElement = document.getElementById("map");

    if (!mapElement || typeof L === "undefined") return;
    if (mapElement.dataset.mapLoaded === "true") return;

    mapElement.dataset.mapLoaded = "true";

    let map = L.map("map").setView(
        [-26.2041, 28.0473],
        13
    );

    L.tileLayer(
        "https://{s}.tile.openstreet
        