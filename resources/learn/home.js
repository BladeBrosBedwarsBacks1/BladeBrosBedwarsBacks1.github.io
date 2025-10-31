// Function to get a query parameter from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to simulate a "login" and display the dashboard
async function login(userId) {
    // Store the user ID in session storage to remember they are logged in
    sessionStorage.setItem('currentUserId', userId); 
    
    // Hide the login section
    document.getElementById('login-section').classList.add('hidden');
    // Show the dashboard
    document.getElementById('dashboard-section').classList.remove('hidden');

    // Fetch user data to display username and weaknesses
    await fetchUserData(userId);
}

// Function to fetch user data (username, weaknesses, etc.)
async function fetchUserData(userId) {
    // This assumes your back-end API /api/user/:userId is running
    const response = await fetch(`/api/user/${userId}`);
    if (response.ok) {
        const user = await response.json();
        // In a real app, you would get the actual username from the Discord API
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
        // Simple display of weaknesses for demonstration
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

    const response = await fetch(`/api/question/${subject}?userId=${userId}`);
    if (response.ok) {
        const questionData = await response.json();
        const questionArea = document.getElementById('question-area');
        document.getElementById('question-text').textContent = `Question for ${subject}: ${questionData.q}`;
        // Store the answer and topic for submission
        sessionStorage.setItem('currentAnswer', questionData.a);
        sessionStorage.setItem('currentTopic', questionData.topic);
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
    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value;
    const subject = document.querySelector('.subject-btn:focus').textContent.split(' ')[0].toLowerCase(); // Hacky way to get subject

    const isCorrect = userAnswer.toLowerCase() === expectedAnswer.toLowerCase().replace(/\$/g, '');

    // Send result to the API
    await fetch('/api/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject, topic, isCorrect })
    });
    
    alert(isCorrect ? 'Correct!' : `Incorrect. The answer was "${expectedAnswer}".`);
    answerInput.value = '';
    document.getElementById('question-area').classList.add('hidden');
    // Refresh weaknesses after submitting
    await fetchUserData(userId);
}

// Function to log out
function logout() {
    sessionStorage.removeItem('currentUserId');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
}

// Main logic to run on page load
document.addEventListener('DOMContentLoaded', (event) => {
    const loginStatus = getQueryParameter('login');
    const storedUserId = sessionStorage.getItem('currentUserId');

    if (loginStatus === '200') {
        // User just logged in via Discord, we would get the real user ID here
        const newUserId = 'discord-user-id-from-auth'; // Placeholder
        login(newUserId);
        // Clean the URL of the query parameter
        window.history.replaceState({}, document.title, "/learn/home");
    } else if (storedUserId) {
        // User is already logged in from a previous session
        login(storedUserId);
    } else {
        // User is not logged in and not coming from the login page
        logout();
    }
});
