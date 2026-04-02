const placesContainer = document.getElementById("placesContainer");
const placesTableBody = document.getElementById("placesTableBody");
const favoritesContainer = document.getElementById("favoritesContainer");
const searchInput = document.getElementById("searchInput");
const postalFilter = document.getElementById("postalFilter");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");

const apiUrl = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=20";

let allPlaces = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

loadTheme();
fetchPlaces();

async function fetchPlaces() {
    placesContainer.innerHTML = '<p class="loading">Loading places...</p>';
    placesTableBody.innerHTML = "";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const data = await response.json();
        allPlaces = data.results || [];

        createPostalOptions(allPlaces);
        updateDisplay();
        displayFavorites();
    } catch (error) {
        console.error("Fetch error:", error);
        placesContainer.innerHTML = '<p class="error">Error loading data.</p>';
    }
}

function getPlaceName(place) {
    return place.translations_fr_name || "Unknown place";
}

function getPlaceAddress(place) {
    return place.translations_fr_address_line1 || "No address available";
}

function getPlacePostalCode(place) {
    return place.translations_fr_address_zip || "No postal code";
}

function getPlacePhone(place) {
    return place.translations_fr_phone_contact || "No phone number";
}

function getPlaceEmail(place) {
    return place.translations_fr_email || "No email";
}

function getPlaceWebsite(place) {
    return place.translations_fr_website || "";
}

function getPlaceCategory(place) {
    if (place.visit_category_en_multi && place.visit_category_en_multi.length > 0) {
        return place.visit_category_en_multi.join(", ");
    }
    return "No category";
}

function isFavorite(placeId) {
    return favorites.some((favorite) => favorite.id === placeId);
    if (selectedSort === "name-asc"){
        filteredPlaces.sort((a, b)) => 
            getPlaceName(a).toLowerCase().localeCompare(getPlaceName(b).toLowerCase());
    }
}

function addToFavorites(place) {
    if (!isFavorite(place.id)) {
        favorites.push(place);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
        updateDisplay();
    }
}

function removeFromFavorites(placeId) {
    favorites = favorites.filter(function(favorite) {
        return favorite.id !== placeId;
    });

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
    updateDisplay();
}

function displayFavorites() {
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="no-favorites">No favorites saved yet.</p>';
        return;
    }

    favorites.forEach(function(place) {
        const card = document.createElement("div");
        card.classList.add("favorite-card");

        const title = document.createElement("h3");
        title.textContent = getPlaceName(place);

        const address = document.createElement("p");
        address.innerHTML = "<strong>Address:</strong> " + getPlaceAddress(place);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-btn");
        removeButton.addEventListener("click", function() {
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

    places.forEach(function(place) {
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

        if (website !== "") {
            websiteCell.innerHTML = "<a href='" + website + "' target='_blank'>Visit website</a>";
        } else {
            websiteCell.textContent = "No website";
        }

        const favoriteCell = document.createElement("td");
        const favoriteButton = document.createElement("button");

        favoriteButton.textContent = isFavorite(place.id) ? "saved" : "Add";

        favoriteButton.classList.add("favorite-btn");
        favoriteButton.addEventListener("click", function() {
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
        placesContainer.innerHTML = '<p class="no-results">No places found.</p>';
        placesTableBody.innerHTML = "";
        return;
    }

    places.forEach(function(place) {
        const name = getPlaceName(place);
        const address = getPlaceAddress(place);
        const postalCode = getPlacePostalCode(place);
        const phone = getPlacePhone(place);
        const email = getPlaceEmail(place);
        const website = getPlaceWebsite(place);
        const category = getPlaceCategory(place);

        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h2");
        title.textContent = name;

        const addressText = document.createElement("p");
        addressText.innerHTML = "<strong>Address:</strong> " + address;

        const postalCodeText = document.createElement("p");
        postalCodeText.innerHTML = "<strong>Postal code:</strong> " + postalCode;

        const categoryText = document.createElement("p");
        categoryText.innerHTML = "<strong>Category:</strong> " + category;

        const phoneText = document.createElement("p");
        phoneText.innerHTML = "<strong>Phone:</strong> " + phone;

        const emailText = document.createElement("p");
        emailText.innerHTML = "<strong>Email:</strong> " + email;

        const websiteText = document.createElement("p");

        if (website !== "") {
            websiteText.innerHTML = "<strong>Website:</strong> <a href='" + website + "' target='_blank'>Visit website</a>";
        } else {
            websiteText.innerHTML = "<strong>Website:</strong> No website";
        }

        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("favorite-btn");

        favoriteButton.textContent = isFavorite(place.id) ? "saved to favorites" : "Add to favorites";

        favoriteButton.addEventListener("click", function() {
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
}

function createPostalOptions(places) {
    postalFilter.innerHTML = '<option value="all">All postal codes</option>';

    const postalCodes = [];

    places.forEach(function(place) {
        const code = getPlacePostalCode(place);

        if (code !== "No postal code" && !postalCodes.includes(code)) {
            postalCodes.push(code);
        }
    });

    postalCodes.sort();

    postalCodes.forEach(function(code) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = code;
        postalFilter.appendChild(option);
    });
}

function updateDisplay() {
    let filteredPlaces = [...allPlaces];

    const searchValue = searchInput.value.toLowerCase();
    const selectedPostalCode = postalFilter.value;
    const selectedSort = sortSelect.value;

    filteredPlaces = filteredPlaces.filter(function(place) {
        const name = getPlaceName(place).toLowerCase();
        const address = getPlaceAddress(place).toLowerCase();
        const postalCode = getPlacePostalCode(place);

        const matchesSearch = name.includes(searchValue) || address.includes(searchValue);
        const matchesPostalCode = selectedPostalCode === "all" || postalCode === selectedPostalCode;

        return matchesSearch && matchesPostalCode;
    });

    if (selectedSort === "name-asc") {
        filteredPlaces.sort(function(a, b) {
            return getPlaceName(a).toLowerCase().localeCompare(getPlaceName(b).toLowerCase());
        });
    }

    if (selectedSort === "name-desc") {
        filteredPlaces.sort(function(a, b) {
            return getPlaceName(b).toLowerCase().localeCompare(getPlaceName(a).toLowerCase());
        });
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

themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

searchInput.addEventListener("input", updateDisplay);
postalFilter.addEventListener("change", updateDisplay);
sortSelect.addEventListener("change", updateDisplay);