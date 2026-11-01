
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

    // Example location: central Johannesburg
    let map = L.map("map").setView(
        [-26.2041, 28.0473],
        13
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(map);

    let marker = L.marker([-26.2041, 28.0473]).addTo(map);

    marker.bindPopup(
        "<b>SaveMore Supermarket</b><br>Example location in Johannesburg."
    );
}


/* SEND FORM DATA TO THE BACKEND */

async function submitFormToBackend(endpoint, data, responseElement, form) {
    responseElement.textContent = "Sending your message...";

    try {
        let result = await fetch(
            "http://localhost:3000" + endpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        let resultData = await result.json();

        if (!result.ok) {
            responseElement.textContent =
                resultData.message || "Please check your information and try again.";
            return;
        }

        responseElement.textContent = resultData.message;
        form.reset();

    } catch (error) {
        console.error("Backend connection error:", error);

        responseElement.textContent =
            "Could not connect to SaveMore. Please make sure the backend is running in VS Code and try again.";
    }
}


/* ENQUIRY FORM */

function setupEnquiryForm() {
    let form = document.getElementById("enquiryForm");

    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let name = document.getElementById("enquiryName").value.trim();
        let email = document.getElementById("enquiryEmail").value.trim();
        let type = document.getElementById("enquiryType").value;
        let message = document.getElementById("enquiryMessage").value.trim();
        let response = document.getElementById("enquiryResponse");

        if (
            name.length < 2 ||
            !email ||
            !document.getElementById("enquiryEmail").checkValidity() ||
            type === "" ||
            message.length < 10
        ) {
            response.textContent =
                "Please enter a valid name and email, select an enquiry type, and write at least 10 characters.";
            return;
        }

        await submitFormToBackend(
            "/api/enquiry",
            {
                name: name,
                email: email,
                enquiryType: type,
                message: message
            },
            response,
            form
        );
    });
}


/* CONTACT FORM */

function setupContactForm() {
    let form = document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let name = document.getElementById("contactName").value.trim();
        let email = document.getElementById("contactEmail").value.trim();
        let subject = document.getElementById("contactSubject").value.trim();
        let message = document.getElementById("contactMessage").value.trim();
        let response = document.getElementById("contactResponse");

        if (
            name.length < 2 ||
            !email ||
            !document.getElementById("contactEmail").checkValidity() ||
            subject.length < 3 ||
            message.length < 10
        ) {
            response.textContent =
                "Please enter a valid name and email, a subject of at least 3 characters, and a message of at least 10 characters.";
            return;
        }

        await submitFormToBackend(
            "/api/contact",
            {
                name: name,
                email: email,
                subject: subject,
                message: message
            },
            response,
            form
        );
    });
}


/* START FEATURES WHEN THE PAGE LOADS */

function startWebsiteFeatures() {
    setupLightbox();
    setupMap();
    setupEnquiryForm();
    setupContactForm();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWebsiteFeatures);
} else {
    startWebsiteFeatures();
}
