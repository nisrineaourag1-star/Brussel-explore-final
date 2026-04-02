const placesContainer = document.getElementById("placesContainer");
const placesTableBody = document.getElementById("placesTableBody");
const favoritesContainer = document.getElementById("favoritesContainer");
const searchInput = document.getElementById("searchInput");
const postalFilter = document.getElementById("postalFilter");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");

const suggestForm = document.getElementById("suggestForm");
const suggestName = document.getElementById("suggestName");
const suggestEmail = document.getElementById("suggestEmail");
const formMessage = document.getElementById("formMessage");

const apiUrl = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=20";

let allPlaces = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

loadTheme();
loadSavedSuggestion();
fetchPlaces();

async function fetchPlaces() {
    placesContainer.innerHTML = `<p class="loading">Loading places...</p>`;
    placesTableBody.innerHTML = "";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        allPlaces = data.results || [];

        createPostalOptions(allPlaces);
        updateDisplay();
        displayFavorites();

        wait(500).then(() => {
            console.log("Promise example finished after loading data.");
        });

    } catch (error) {
        console.error("Fetch error:", error);
        placesContainer.innerHTML = `<p class="error">Error loading data.</p>`;
    }
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const getPlaceName = (place) => place.translations_fr_name || "Unknown place";
const getPlaceAddress = (place) => place.translations_fr_address_line1 || "No address available";
const getPlacePostalCode = (place) => place.translations_fr_address_zip || "No postal code";
const getPlacePhone = (place) => place.translations_fr_phone_contact || "No phone number";
const getPlaceEmail = (place) => place.translations_fr_email || "No email";
const getPlaceWebsite = (place) => place.translations_fr_website || "";
const getPlaceCategory = (place) =>
    place.visit_category_en_multi && place.visit_category_en_multi.length > 0
        ? place.visit_category_en_multi.join(", ")
        : "No category";

const isFavorite = (placeId) => favorites.some((favorite) => favorite.id === placeId);

function addToFavorites(place) {
    if (!isFavorite(place.id)) {
        favorites.push(place);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
        updateDisplay();
    }
}

function removeFromFavorites(placeId) {
    favorites = favorites.filter((favorite) => favorite.id !== placeId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
    updateDisplay();
}

function displayFavorites() {
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `<p class="no-favorites">No favorites saved yet.</p>`;
        return;
    }

    favorites.forEach((place) => {
        const card = document.createElement("div");
        card.classList.add("favorite-card");

        const title = document.createElement("h3");
        title.textContent = getPlaceName(place);

        const address = document.createElement("p");
        address.innerHTML = `<strong>Address:</strong> ${getPlaceAddress(place)}`;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-btn");
        removeButton.addEventListener("click", () => {
            removeFromFavorites(place.id);
        });

        card.appendChild(title);
        card.appendChild(address);
        card.appendChild(removeButton);

        favoritesContainer.appendChild(card);
    });
}

function displayTable(places) {
    placesTableBody.innerHTML = "";

    if (places.length === 0) {
        placesTableBody.innerHTML = `
            <tr>
                <td colspan="8">No places found.</td>
            </tr>
        `;
        return;
    }

    places.forEach((place) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = getPlaceName(place);

        const addressCell = document.createElement("td");
        addressCell.textContent = getPlaceAddress(place);

        const postalCodeCell = document.createElement("td");
        postalCodeCell.textContent = getPlacePostalCode(place);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = getPlaceCategory(place);

        const phoneCell = document.createElement("td");
        phoneCell.textContent = getPlacePhone(place);

        const emailCell = document.createElement("td");
        emailCell.textContent = getPlaceEmail(place);

        const websiteCell = document.createElement("td");
        const website = getPlaceWebsite(place);

        websiteCell.innerHTML = website !== ""
            ? `<a href="${website}" target="_blank">Visit website</a>`
            : `No website`;

        const favoriteCell = document.createElement("td");
        const favoriteButton = document.createElement("button");

        favoriteButton.textContent = isFavorite(place.id) ? "Saved" : "Add";
        favoriteButton.classList.add("favorite-btn");

        favoriteButton.addEventListener("click", () => {
            addToFavorites(place);
        });

        favoriteCell.appendChild(favoriteButton);

        row.appendChild(nameCell);
        row.appendChild(addressCell);
        row.appendChild(postalCodeCell);
        row.appendChild(categoryCell);
        row.appendChild(phoneCell);
        row.appendChild(emailCell);
        row.appendChild(websiteCell);
        row.appendChild(favoriteCell);

        placesTableBody.appendChild(row);
    });
}

function displayCards(places) {
    placesContainer.innerHTML = "";

    if (places.length === 0) {
        placesContainer.innerHTML = `<p class="no-results">No places found.</p>`;
        placesTableBody.innerHTML = "";
        return;
    }

    places.forEach((place) => {
        const name = getPlaceName(place);
        const address = getPlaceAddress(place);
        const postalCode = getPlacePostalCode(place);
        const phone = getPlacePhone(place);
        const email = getPlaceEmail(place);
        const website = getPlaceWebsite(place);
        const category = getPlaceCategory(place);

        const card = document.createElement("div");
        card.classList.add("card", "observe-card");

        const title = document.createElement("h2");
        title.textContent = name;

        const addressText = document.createElement("p");
        addressText.innerHTML = `<strong>Address:</strong> ${address}`;

        const postalCodeText = document.createElement("p");
        postalCodeText.innerHTML = `<strong>Postal code:</strong> ${postalCode}`;

        const categoryText = document.createElement("p");
        categoryText.innerHTML = `<strong>Category:</strong> ${category}`;

        const phoneText = document.createElement("p");
        phoneText.innerHTML = `<strong>Phone:</strong> ${phone}`;

        const emailText = document.createElement("p");
        emailText.innerHTML = `<strong>Email:</strong> ${email}`;

        const websiteText = document.createElement("p");
        websiteText.innerHTML = website !== ""
            ? `<strong>Website:</strong> <a href="${website}" target="_blank">Visit website</a>`
            : `<strong>Website:</strong> No website`;

        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("favorite-btn");
        favoriteButton.textContent = isFavorite(place.id) ? "Saved to favorites" : "Add to favorites";

        favoriteButton.addEventListener("click", () => {
            addToFavorites(place);
        });

        card.appendChild(title);
        card.appendChild(addressText);
        card.appendChild(postalCodeText);
        card.appendChild(categoryText);
        card.appendChild(phoneText);
        card.appendChild(emailText);
        card.appendChild(websiteText);
        card.appendChild(favoriteButton);

        placesContainer.appendChild(card);
    });

    activateObserver();
}

function createPostalOptions(places) {
    postalFilter.innerHTML = `<option value="all">All postal codes</option>`;

    const postalCodes = [];

    places.forEach((place) => {
        const code = getPlacePostalCode(place);

        if (code !== "No postal code" && !postalCodes.includes(code)) {
            postalCodes.push(code);
        }
    });

    postalCodes.sort();

    postalCodes.forEach((code) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = code;
        postalFilter.appendChild(option);
    });
}

function updateDisplay() {
    let filteredPlaces = [...allPlaces];

    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedPostalCode = postalFilter.value;
    const selectedSort = sortSelect.value;

    filteredPlaces = filteredPlaces.filter((place) => {
        const name = getPlaceName(place).toLowerCase();
        const address = getPlaceAddress(place).toLowerCase();
        const postalCode = getPlacePostalCode(place);

        const matchesSearch = name.includes(searchValue) || address.includes(searchValue);
        const matchesPostalCode = selectedPostalCode === "all" ? true : postalCode === selectedPostalCode;

        return matchesSearch && matchesPostalCode;
    });

    if (selectedSort === "name-asc") {
        filteredPlaces.sort((a, b) =>
            getPlaceName(a).toLowerCase().localeCompare(getPlaceName(b).toLowerCase())
        );
    }

    if (selectedSort === "name-desc") {
        filteredPlaces.sort((a, b) =>
            getPlaceName(b).toLowerCase().localeCompare(getPlaceName(a).toLowerCase())
        );
    }

    displayTable(filteredPlaces);
    displayCards(filteredPlaces);
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function loadSavedSuggestion() {
    const savedName = localStorage.getItem("suggestName") || "";
    const savedEmail = localStorage.getItem("suggestEmail") || "";

    suggestName.value = savedName;
    suggestEmail.value = savedEmail;
}

function validateForm(name, email) {
    if (name.trim() === "" || email.trim() === "") {
        formMessage.textContent = "Please fill in all fields.";
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        return false;
    }

    formMessage.textContent = "Form submitted successfully.";
    return true;
}

function activateObserver() {
    const cards = document.querySelectorAll(".observe-card");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.2
    });

    cards.forEach((card) => observer.observe(card));
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
});

searchInput.addEventListener("input", updateDisplay);
postalFilter.addEventListener("change", updateDisplay);
sortSelect.addEventListener("change", updateDisplay);

suggestName.addEventListener("input", () => {
    localStorage.setItem("suggestName", suggestName.value);
});

suggestEmail.addEventListener("input", () => {
    localStorage.setItem("suggestEmail", suggestEmail.value);
});

suggestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = suggestName.value;
    const email = suggestEmail.value;

    const isValid = validateForm(name, email);

    if (isValid) {
        localStorage.setItem("suggestName", name);
        localStorage.setItem("suggestEmail", email);
    }
});