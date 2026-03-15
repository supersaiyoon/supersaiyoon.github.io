// Global variables
let randomNumber;
let attempts;
let numMaxAttempts;
let wins = 0;
let losses = 0;

// Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    console.log("randomNumber: " + randomNumber);
    attempts = 0;

    // Hide reset button
    document.querySelector("#resetBtn").style.display = "none";

    // Show guess button
    document.querySelector("#guessBtn").style.display = "inline";

    // Clean up textbox by clearing old input then focusing
    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.value = "";
    playerGuess.focus();

    // Clear feedback
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";

    // Clear previous guesses
    document.querySelector("#guesses").textContent = "";

    // Reset number of guesses remaining
    numMaxAttempts = 7;
    document.querySelector("#guessesRemaining").textContent = "Guesses remaining: " + numMaxAttempts;

    // Display wins and losses
    document.querySelector("#wins").textContent = "Wins: " + wins;
    document.querySelector("#losses").textContent = "Losses: " + losses;
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";  // Clear feedback message

    let guess = document.querySelector("#playerGuess").value;

    console.log("Player guess: " + guess);

    if (guess < 1 || guess > 99) {
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }

    attempts++;
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";
    document.querySelector("#guesses").textContent += guess + " ";

    // Display number of guesses remaining
    let guessesRemaining = numMaxAttempts - attempts;
    document.querySelector("#guessesRemaining").textContent = "Guesses remaining: " + guessesRemaining;

    if (guess == randomNumber) {
        wins++;
        feedback.textContent = "You guessed it! You won!!";
        feedback.style.color = "#8fa8ff";
        gameOver();
    }
    else if (attempts == numMaxAttempts) {
        losses++;
        feedback.textContent = "Sorry, you lost! The number was: " + randomNumber;
        feedback.style.color = "red";
        gameOver();
    }
    else if (guess > randomNumber) {
        feedback.textContent = "Guess was high.";
    }
    else {
        feedback.textContent = "Guess was low.";
    }
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");

    guessBtn.style.display = "none";    // Hide button on game over
    resetBtn.style.display = "inline";  // Display reset button
}