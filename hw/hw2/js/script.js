// Event Listeners
document.querySelector("button").addEventListener("click", gradeQuiz);

// Global variables
let score = 0;
let attempts = localStorage.getItem("total_attempts");

displayQ4Choices();
displayQ6Choices();

function displayQ4Choices() {
    let q4ChoicesArr = ["Maine", "Rhode Island", "Maryland", "Delaware"];
    q4ChoicesArr = _.shuffle(q4ChoicesArr);

    for (let i=0; i<q4ChoicesArr.length; i++) {
        document.querySelector("#q4Choices").innerHTML += `<input type="radio" name="q4" id="${q4ChoicesArr[i]}"
            value="${q4ChoicesArr[i]}"><label for="${q4ChoicesArr[i]}">${q4ChoicesArr[i]}</label><br>`;
    }
}

function displayQ6Choices() {
    let q6ChoicesArr = ["Anchorage", "San Diego", "Chicago", "Manhattan"];
    q6ChoicesArr = _.shuffle(q6ChoicesArr);

    for (let i=0; i<q6ChoicesArr.length; i++) {
        document.querySelector("#q6Choices").innerHTML += `<input type="radio" name="q6" id="${q6ChoicesArr[i]}"
            value="${q6ChoicesArr[i]}"><label for="${q6ChoicesArr[i]}">${q6ChoicesArr[i]}</label><br>`;
    }
}

function isFormValid() {
    let isValid = true;

    if (document.querySelector("#q1").value == "") {
        isValid = false;
        document.querySelector("#validationFdbk").innerHTML = "Question 1 was not answered.";
    }

    return isValid;
}

function rightAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
    document.querySelector(`#q${index}Feedback`).className = "feedback-box bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
    score += 10;
}

function wrongAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect.";
    document.querySelector(`#q${index}Feedback`).className = "feedback-box bg-warning text-dark";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt='X Mark'>";
}

function gradeQuiz() {
    // Reset validation feedback
    document.querySelector("#validationFdbk").innerHTML = "";

    if (!isFormValid()) {
        return;
    }

    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value;
    let q4Response = document.querySelector("input[name=q4]:checked").value;
    let q5Response = document.querySelector("#q5").value;
    let q6Response = document.querySelector("input[name=q6]:checked").value;
    let q7Response = document.querySelector("#q7").value;
    let q9Response = document.querySelector("#q9").value.toLowerCase();
    let q10Response = document.querySelector("#q10").value;

    // Grade question 1
    if (q1Response == "sacramento") {
        rightAnswer(1);
    }
    else {
        wrongAnswer(1);
    }

    // Grade question 2
    if (q2Response == "mo") {
        rightAnswer(2);
    }
    else {
        wrongAnswer(2);
    }

    // Grade question 3
    if (document.querySelector("#Jefferson").checked && document.querySelector("#Roosevelt").checked &&
        !document.querySelector("#Jackson").checked && !document.querySelector("#Franklin").checked) {
        rightAnswer(3);
    }
    else {
        wrongAnswer(3);
    }

    // Grade question 4
    if (q4Response == "Rhode Island") {
        rightAnswer(4);
    }
    else {
        wrongAnswer(4);
    }

    // Grade question 5
    if (q5Response == "2") {
        rightAnswer(5);
    }
    else {
        wrongAnswer(5);
    }

    // Grade question 6
    if (q6Response == "Chicago") {
        rightAnswer(6);
    }
    else {
        wrongAnswer(6);
    }

    // Grade question 7
    if (q7Response == "nj") {
        rightAnswer(7);
    }
    else {
        wrongAnswer(7);
    }

    // Grade question 8
    if (document.querySelector("#Hartford").checked &&
        document.querySelector("#Denver").checked &&
        !document.querySelector("#Orlando").checked &&
        !document.querySelector("#Miami").checked) {
        rightAnswer(8);
    }
    else {
        wrongAnswer(8);
    }

    // Grade question 9
    if (q9Response == "missouri") {
        rightAnswer(9);
    }
    else {
        wrongAnswer(9);
    }

    // Grade question 10
    if (q10Response == "50") {
        rightAnswer(10);
    }
    else {
        wrongAnswer(10);
    }

    // Change total score color based on value
    if (score >= 80) {
        document.querySelector("#totalScore").className = "text-success";

        // Display congratulatory message
        document.querySelector("#validationFdbk").className = "bg-success text-white";
        document.querySelector("#validationFdbk").innerHTML = "Congratulations! You passed the quiz.";
    }
    else {
        document.querySelector("#totalScore").className = "text-danger";
    }

    // Display total score
    document.querySelector("#totalScore").innerHTML = `Total Score: ${score}`;

    // Display total attempts
    document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${++attempts}`;
    localStorage.setItem("total_attempts", attempts);
}