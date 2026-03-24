// Event Listeners
document.querySelector("#userInput").addEventListener("keydown", handleEnterKey);
document.querySelector("#searchButton").addEventListener("click", handleSearch);

// Constants
const POKEDEX_API_URL = "https://pokeapi.co/api/v2/pokedex/1/";
const POKEMON_INFO_API_URL = "https://pokeapi.co/api/v2/pokemon/"
const POKEMON_FLAVOR_TEXT_API_URL = "https://pokeapi.co/api/v2/pokemon-species/";


// Global variables
// Cache entire Pokémon list for filtering as user inputs
let pokemonList = [];


// Initialize app
loadPokemonList();

// Helper functions
function formatName(name) {
    let parts = name.split("-");
    let result = [];

    for (word of parts) {
        if (word === "mr") {
            result.push("Mr.");
        }
        else if (word === "jr") {
            result.push("Jr.");
        }
        else {
            result.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
    }

    return result.join(" ");
}

// Raw height values are in decimeters
function decimetersToFeetInches(dm) {
    // 1 decimeter = 0.1 meters
    // 1 meter = 39.3701 inches
    let totalInches = dm * 0.1 * 39.3701;

    let feet = Math.floor(totalInches / 12);
    let inches = Math.round(totalInches % 12);

    // If rounding pushes inches to 12
    if (inches === 12) {
        feet += 1;
        inches = 0;
    }

    return feet + " ft " + inches + " in";
}

// Raw weight values are in hectograms
function hectogramsToPounds(hg) {
    let pounds = hg * 0.1 * 2.20462;
    return pounds.toFixed(1) + " lbs";
}

// Web app functions
async function loadPokemonList() {
    let response = await fetch(POKEDEX_API_URL);
    let data = await response.json();

    populateDatalist(data.pokemon_entries);
}

function populateDatalist(pokemonArray) {
    let datalist = document.querySelector("#pokemonList");

    for (let pokemon of pokemonArray) {
        let name = pokemon.pokemon_species.name;
        let formattedName = formatName(name);
        let pokedexNum = pokemon.entry_number;
        let pokemonUrl = POKEMON_INFO_API_URL + name;

        // Store name, Pokédex number, and URL that has Pokémon info
        pokemonList.push({
            name: name,
            displayName: formattedName,
            pokedexNumber: pokedexNum,
            pokemonUrl: pokemonUrl
        });

        let option = document.createElement("option");
        option.value = formattedName;
        datalist.appendChild(option);
    }
}

function handleEnterKey(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
}

function handleSearch() {
    let userInput = document.querySelector("#userInput").value.trim();

    if (userInput.length == 0) {
        document.querySelector("#searchFeedback").innerHTML = "Cannot leave blank.";
        return;
    }

    clearFeedback();

    let selectedPokemon = findPokemon(userInput);

    if (!selectedPokemon) {
        document.querySelector("#searchFeedback").innerHTML = "Pokémon not found.";
        return;
    }

    fetchPokemon(selectedPokemon);
}

function findPokemon(input) {
    let trimmedInput = input.trim();
    let lowerInput = trimmedInput.toLowerCase();

    for (let pokemon of pokemonList) {
        if (
            pokemon.name === lowerInput ||
            pokemon.displayName.toLowerCase() === lowerInput ||
            pokemon.pokedexNumber === parseInt(trimmedInput)
        ) {
            return pokemon;
        }
    }

    return null;
}

async function fetchPokemon(pokemon) {
    let response = await fetch(pokemon.pokemonUrl);
    let pokemonData = await response.json();

    displayPokemon(pokemonData, pokemon.pokedexNumber);
}

async function fetchFlavorText(name) {
    let url = POKEMON_FLAVOR_TEXT_API_URL + name;
    let response = await fetch(url);
    let data = await response.json();

    // Find first English flavor text
    for (let entry of data.flavor_text_entries) {
        if (entry.language.name === "en") {
            // Clean weird line breaks and form feeds
            return entry.flavor_text
                .replace(/\f/g, " ")
                .replace(/\n/g, " ");
        }
    }

    return "No flavor text available.";
}

async function displayPokemon(pokemonData, pokedexNumber) {
    let resultSection = document.querySelector("#resultSection");

    let name = pokemonData.name;
    let formattedName = formatName(name);

    let artwork = pokemonData.sprites.other["official-artwork"].front_default;
    let fallback = pokemonData.sprites.front_default;
    let image = artwork || fallback;

    let flavorText = await fetchFlavorText(name);
    let types = formatList(pokemonData.types, "type");
    let height = decimetersToFeetInches(pokemonData.height);
    let weight = hectogramsToPounds(pokemonData.weight);
    let abilities = formatList(pokemonData.abilities, "ability");

    resultSection.innerHTML = `
        <h2>${formattedName}</h2>
        <div id="pokedexNumInfo">
            <p><strong>National Pokédex Number:</strong> ${pokedexNumber}</p>
        </div>
        <img src="${image}" alt="${name}">
        <p class="flavor-text">${flavorText}</p>

        <div class="pokemon-details">
            <div class="detail-label">Type:</div>
            <div class="detail-value">${types}</div>

            <div class="detail-label">Height:</div>
            <div class="detail-value">${height}</div>

            <div class="detail-label">Weight:</div>
            <div class="detail-value">${weight}</div>

            <div class="detail-label">Abilities:</div>
            <div class="detail-value">${abilities}</div>
        </div>
    `;

    resultSection.classList.remove("hidden");
}

// Can handle both type and abilities lists
function formatList(array, key) {
    let result = "";

    for (let i = 0; i < array.length; i++) {
        let entry = array[i];
        let name = formatName(entry[key].name);

        result += name;

        if (i < array.length - 1) {
            result += ", ";
        }
    }

    return result;
}

function clearFeedback() {
    let feedback = document.querySelector("#searchFeedback");
    feedback.textContent = "";
    feedback.classList.remove("error");
}