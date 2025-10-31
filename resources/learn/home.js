// A real web app would get the SERVER_URL dynamically or via config
const SERVER_URL = 'http://localhost:3000'; // Replace with your Replit/Render/Railway URL

// Function to get a query parameter from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to simulate a "login" and display the dashboard
async function login(userId) {
    sessionStorage.setItem('currentUserId', userId); 
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
    // Set initial text to blank or "fetching..." to remove "Loading..." placeholder
    document.getElementById('username-display').textContent = 'Fetching username...'; 

    await fetchUserData(userId);
}

// Function to fetch user data (username, weaknesses, etc.)
async function fetchUserData(userId) {
    // Cross-origin request to your Node.js API server
    const response = await fetch(`${SERVER_URL}/api/user/${userId}`);
    if (response.ok) {
        const user = await response.json();
        // In a real app, you would get the actual username from the Discord API via your server
        document.getElementById('username-display').textContent = `User ${userId.substring(0, 5)}...`; 
        displayWeaknesses(user.weaknesses);
    } else {
        console.error('Failed to fetch user data');
        displayWeaknesses(null);
    }
}

// Function to display weaknesses
function displayWeaknesses(weaknesses) {
    const weaknessesList = document.getElementById('weaknesses-display');
    weaknessesList.innerHTML = '';
    if (weaknesses && Object.keys(weaknesses).length > 0) {
        for (const subject in weaknesses) {
            for (const topic in weaknesses[subject]) {
                const data = weaknesses[subject][topic];
                const li = document.createElement('li');
                li.textContent = `${subject.toUpperCase()}: ${topic} (Correct: ${data.correct}, Incorrect: ${data.incorrect})`;
                weaknessesList.appendChild(li);
            }
        }
    } else {
        weaknessesList.innerHTML = '<li>You have no recorded weaknesses yet.</li>';
    }
}

// Function to get a question
async function getQuestion(subject) {
    const userId = sessionStorage.getItem('currentUserId');
    if (!userId) return logout();

    // Cross-origin request
    const response = await fetch(`${SERVER_URL}/api/question/${subject}?userId=${userId}`);
    if (response.ok) {
        const questionData = await response.json();
        const questionArea = document.getElementById('question-area');
        document.getElementById('question-text').textContent = `Question for ${subject}: ${questionData.q}`;
        sessionStorage.setItem('currentAnswer', questionData.a);
        sessionStorage.setItem('currentTopic', questionData.topic);
        sessionStorage.setItem('currentSubject', subject); // Store subject
        questionArea.classList.remove('hidden');
    } else {
        alert('Failed to fetch question.');
    }
}

// Function to submit an answer
async function submitAnswer() {
    const userId = sessionStorage.getItem('currentUserId');
    const expectedAnswer = sessionStorage.getItem('currentAnswer');
    const topic = sessionStorage.getItem('currentTopic');
    const subject = sessionStorage.getItem('currentSubject');
    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value;

    const isCorrect = userAnswer.toLowerCase() === expectedAnswer.toLowerCase().replace(/\$/g, '');

    // Cross-origin request
    await fetch(`${SERVER_URL}/api/submit-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject, topic, isCorrect })
    });
    
    alert(isCorrect ? 'Correct!' : `Incorrect. The answer was "${expectedAnswer}".`);
    answerInput.value = '';
    document.getElementById('question-area').classList.add('hidden');
    await fetchUserData(userId);
}

// Function to log out
function logout() {
    sessionStorage.removeItem('currentUserId');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    // Set text back to default
    document.getElementById('title').textContent = "Log in to use Spark Learning";
    document.getElementById('content').textContent = ""; // Clear content div
}

// Main logic to run on page load
document.addEventListener('DOMContentLoaded', (event) => {
    // Update the main placeholders immediately on load
    document.getElementById('title').textContent = "Log in to use Spark Learning";
    document.getElementById('content').textContent = ""; 

    const loginStatus = getQueryParameter('login');
    const storedUserId = sessionStorage.getItem('currentUserId');

    if (loginStatus === '200') {
        const newUserId = 'discord-user-id-from-auth'; // Placeholder for real ID
        login(newUserId);
        // Clean the URL of the query parameter
        window.history.replaceState({}, document.title, "/learn/home");
    } else if (storedUserId) {
        login(storedUserId);
    } else {
        logout();
    }
});
