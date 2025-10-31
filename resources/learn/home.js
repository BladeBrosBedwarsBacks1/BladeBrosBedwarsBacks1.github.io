// This file assumes a user is already "logged in" via the simple input field.
// A real web app would use Discord OAuth2 for secure authentication.

let currentUserId = null;

// Function to simulate a "login" and display the dashboard
function login() {
    // For this simple version, we use a placeholder user ID for demonstration
    currentUserId = '123456789012345678'; 
    
    // Hide the login section
    document.getElementById('login-section').classList.add('hidden');
    // Show the dashboard
    document.getElementById('dashboard-section').classList.remove('hidden');
    // Update the username placeholder
    document.getElementById('username-display').textContent = 'TestUser'; 

    // In a real app, you would now fetch weaknesses from your back-end API
    fetchWeaknesses();
}

// Function to fetch and display weaknesses
function fetchWeaknesses() {
    // This is a placeholder as the API is not yet implemented
    const weaknessesList = document.getElementById('weaknesses-display');
    weaknessesList.innerHTML = '<li>You have no recorded weaknesses yet.</li>';
}

// Function to get a question (placeholder)
function getQuestion(subject) {
    // In a real app, this would make an API call to your server
    const questionArea = document.getElementById('question-area');
    document.getElementById('question-text').textContent = `Placeholder question for ${subject}. Answer is 'correct'.`;
    questionArea.classList.remove('hidden');
}

// Function to submit an answer (placeholder)
function submitAnswer() {
    const answerInput = document.getElementById('answer-input');
    const answer = answerInput.value;

    if (answer.toLowerCase() === 'correct') {
        alert('Correct!');
        // You would then send this result to your back-end API to update weaknesses
    } else {
        alert('Incorrect. The answer was "correct".');
    }
    answerInput.value = '';
    document.getElementById('question-area').classList.add('hidden');
}

// Function to log out
function logout() {
    currentUserId = null;
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
}

// Event listener to trigger a simulated login on page load for testing the dashboard
// document.addEventListener('DOMContentLoaded', (event) => {
//     login(); 
// });
