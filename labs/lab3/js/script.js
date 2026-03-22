// Event Listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", function(event) {
    validateForm(event);
});
document.querySelector("#password").addEventListener("click", suggestPassword);


// Constants
HEX_RED = "#ff0000";
HEX_GREEN = "#00ff00";
HEX_YELLOW = "#ffe609";
MIN_PW_LENGTH = 6;
BLANK_FIELD_ERROR_MSG = "* Required"


// Global variables
let isUsernameAvailable = false;


populateStates();


// Populate state dropdown list with two-letter state abbreviations from web API
async function populateStates() {
    let url = "https://csumb.space/api/allStatesAPI.php";
    let response = await fetch(url);
    let data = await response.json();
    let stateList = document.querySelector("#state");

    // Reset state dropdown list before populating
    stateList.innerHTML = `<option> Select One </option>`;

    // Populate state dropdown list with two-letter state abbreviations from web API
    for (let d of data) {
        stateList.innerHTML += `<option value="${d.usps}"> ${d.state} </option>`;
    }
}

// Display city, latitude, and longitude after inputting zip code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();
    let zipError = document.querySelector("#zipError");

    // Display error message if zip code is not found
    if (!data) {
        zipError.innerHTML = "Zip code not found.";
        zipError.style.color = HEX_RED;

        // Don't show "undefined" in city, latitude, and longitude fields
        document.querySelector("#city").innerHTML = "";
        document.querySelector("#latitude").innerHTML = "";
        document.querySelector("#longitude").innerHTML = "";
    }
    else {
        zipError.innerHTML = "";  // Clear error message if exists
        document.querySelector("#city").innerHTML = data.city;
        document.querySelector("#latitude").innerHTML = data.latitude;
        document.querySelector("#longitude").innerHTML = data.longitude;
    }
}

// Display counties from web API based on two-letter state abbreviation
async function displayCounties() {
    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();
    let countyList = document.querySelector("#county");

    // Reset county dropdown list before populating
    countyList.innerHTML = `<option> Select One </option>`;

    // Populate county dropdown list with counties from web API
    for (let d of data) {
        countyList.innerHTML += `<option> ${d.county} </option>`;
    }
}

// Check if username is available and display error message if not
async function checkUsername() {
    let username = document.querySelector("#username").value;
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();
    let usernameError = document.querySelector("#usernameError");

    // Display error message for blank username field
    if (username.length == 0) {
        usernameError.innerHTML = "";
        return;
    }

    if (data.available) {
        usernameError.innerHTML = "Username is available!";
        usernameError.style.color = HEX_GREEN;
        isUsernameAvailable = true;
    }
    else {
        usernameError.innerHTML = "Username is unavailable.";
        usernameError.style.color = HEX_RED;
        isUsernameAvailable = false;
    }
}

function validateForm(e) {
    let isValid = true;

    /* NAME VALIDATION */
    let firstName = document.querySelector("#firstName").value;
    let firstNameError = document.querySelector("#firstNameError");
    firstNameError.innerHTML = "";

    // First name field cannot be blank
    if (firstName.length == 0) {
        firstNameError.innerHTML = BLANK_FIELD_ERROR_MSG
        isValid = false;
    }

    let lastName = document.querySelector("#lastName").value;
    let lastNameError = document.querySelector("#lastNameError");
    lastNameError.innerHTML = "";

    // Last name field cannot be blank
    if (lastName.length == 0) {
        lastNameError.innerHTML = BLANK_FIELD_ERROR_MSG
        isValid = false;
    }

    /* GENDER VALIDATION */
    let gender = document.querySelector("input[name='gender']:checked");
    let genderError = document.querySelector("#genderError");
    genderError.innerHTML = "";

    // Must select a gender
    if (!gender) {
    genderError.innerHTML = BLANK_FIELD_ERROR_MSG
        isValid = false;
    }

    /* ZIP CODE VALIDATION */
    let zipCode = document.querySelector("#zip").value;
    let zipError = document.querySelector("#zipError");
    zipError.innerHTML = "";

    // Zip Code field cannot be blank
    if (zipCode.length == 0) {
        zipError.innerHTML = BLANK_FIELD_ERROR_MSG;
        isValid = false;
    }

    /* STATE VALIDATION */
    let state = document.querySelector("#state").value;
    let stateError = document.querySelector("#stateError");

    stateError.innerHTML = "";

    // User must choose a state
    if (state == "Select One") {
        stateError.innerHTML = BLANK_FIELD_ERROR_MSG;
        isValid = false;
    }

    /* COUNTY VALIDATION */
    let county = document.querySelector("#county").value;
    let countyError = document.querySelector("#countyError");

    countyError.innerHTML = "";

    // User must choose a county
    if (county == "Select One") {
        countyError.innerHTML = BLANK_FIELD_ERROR_MSG;
        isValid = false;
    }

    /* USERNAME VALIDATION */
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");

    // Username field cannot be blank
    if (username.length == 0) {
        usernameError.innerHTML = "Username required!";
        isValid = false;
    }
    else if (!isUsernameAvailable) {
        usernameError.innerHTML = "Username unavailable. Choose a different one."
        isValid = false;
    }

    /* PASSWORD VALIDATION */
    let password = document.querySelector("#password").value;
    let confirmPassword = document.querySelector("#confirmPassword").value;
    let passwordError = document.querySelector("#passwordError");
    let confirmPasswordError = document.querySelector("#confirmPasswordError");

    passwordError.innerHTML = "";

    // Password must be at least MIN_PW_LENGTH (6) characters long
    if (password.length < MIN_PW_LENGTH) {
        passwordError.innerHTML = `Password must be at least ${MIN_PW_LENGTH} characters long.`
        passwordError.style.color = HEX_RED;
        isValid = false;
    }

    confirmPasswordError.innerHTML = "";

    // Password and confirm password fields match
    if (password != confirmPassword) {
        confirmPasswordError.innerHTML = "Passwords must match!";
        confirmPasswordError.style.color = HEX_RED;
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
}

async function suggestPassword() {
    let suggestedPwd = document.querySelector("#passwordError");
    let url = "https://csumb.space/api/suggestedPassword.php?length=8";
    let response = await fetch(url);
    let data = await response.json();

    suggestedPwd.innerHTML = `Suggested Password: ${data.password}`;
    suggestedPwd.style.color = HEX_YELLOW;
}