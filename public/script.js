// Game variables
let username = localStorage.getItem('username'); // Retrieve the username from localStorage
let currentWordIndex = 0;
let wrongGuesses = 0;
let guessedLetters = [];
let score = 0;
let giveUpCounter = 0;
let words = []; // This will be filled with the words from the server upon game start
let hints = [
    "Eye of the camera, controlling light entry.",
    "Amount of light allowed to hit the camera sensor.",
    "Camera's 'eyelid,' opens and closes to let light in.",
    "The camera's 'eye,' focusing light onto the sensor.",
    "Digital equivalent of film, captures the image.",
    "Storage device for digital photos.",
    "Millions of pixels, detailing the photo's resolution.",
    "Close-up photography, capturing small subjects.",
    "Burst of light for illumination in dark settings.",
    "Three-legged stand for camera stability.",
    "Alters light entering the lens, affects images.",
    "Taking multiple shots at different exposures.",
    "Focused on capturing individual or group faces.",
    "Wide scenic shots, often nature or cityscapes.",
    "Long-focus lens, brings distant subjects closer.",
    "Wide, extended field of view in one image.",
    "Hand-held photograph of oneself.",
    "Captures more of the scene, broader field of view.",
    "Adjusting the frame from narrow to wide.",
    "Arrangement or organization of visual elements."
];

// Ensure that the username is set, otherwise redirect to login page
if (!username) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWordsAndStartGame();
});

document.addEventListener('DOMContentLoaded', (event) => {
    const bgMusic = document.getElementById('backgroundMusic');
    bgMusic.play().catch(error => console.log('Playback prevented by the browser.'));
});


function fetchWordsAndStartGame() {
    // Simulate fetching words from a server
    words = ["aperture", "exposure", "shutter", "lens", "sensor", "memorycard", "megapixel", "macro", "flash", "tripod", "filter", "hdr", "portrait", "landscape", "telephoto", "panorama", "selfie", "wideangle", "zoom", "composition"]; 
    initializeGame();
}

function initializeGame() {
    document.getElementById('usernameDisplay').textContent = username || 'Player';
    resetGame();
}

function resetGame() {
    //wrongGuesses = 0;
    guessedLetters = [];
    document.getElementById('wrongGuesses').textContent = wrongGuesses;
    displayHint();
    setupWordView();
}

function displayHint() {
    const hintContainer = document.getElementById('hint');
    hintContainer.textContent = hints[currentWordIndex];
    revealRandomLetters();
}

function revealRandomLetters() {
    const word = words[currentWordIndex].toLowerCase();
    let revealCount = Math.floor(word.length / 4); // Reveal 1/4th of the letters
    while (revealCount > 0) {
        let randomIndex = Math.floor(Math.random() * word.length);
        let char = word[randomIndex];
        if (!guessedLetters.includes(char)) {
            guessedLetters.push(char);
            revealCount--;
        }
    }
}

function setupWordView() {
    const wordContainer = document.getElementById('wordContainer');
    wordContainer.innerHTML = '';
    words[currentWordIndex].split('').forEach((char) => {
        const charElement = document.createElement('span');
        charElement.textContent = guessedLetters.includes(char.toLowerCase()) ? char : '_';
        charElement.classList.add('char');
        wordContainer.appendChild(charElement);
    });
}

function processFullWordGuess(guessedWord) {
    const currentWord = words[currentWordIndex].toLowerCase();
    if (guessedWord === currentWord) {
        score++;
        updateScoreInDatabase(username, score); // Update score in database
        proceedToNextWord();
    } else {
        wrongGuesses++;
        document.getElementById('wrongGuesses').textContent = wrongGuesses.toString();
        alert('Incorrect. Try again!');
    }
    document.getElementById('guessInput').value = ''; // Clear input field after the guess
}

function updateScoreInDatabase(username, score) {
    // Placeholder for database interaction
    console.log(`Updating score for ${username}: ${score}`);
    // Implement server communication here
}

function proceedToNextWord() {
    if (currentWordIndex < words.length - 1) {
        currentWordIndex++;
        resetGame();
    } else {
        displayFinalScore();
    }
}

function showAnswerAndIncrementCounter() {
    const currentWord = words[currentWordIndex];
    alert(`The correct word was: ${currentWord}`);
    giveUpCounter++;
    document.getElementById('giveUpCount').textContent = giveUpCounter;

    if (currentWordIndex < words.length - 1) {
        currentWordIndex++;
        resetGame();
    } else {
        displayFinalScore();
    }
}

function submitWordGuess() {
    const guessedWord = document.getElementById('guessInput').value.toLowerCase();
    processFullWordGuess(guessedWord);
    document.getElementById('guessInput').value = '';
}

function fetchWordsAndStartGame() {
    fetch('words.txt')
        .then(response => response.text())
        .then(text => {
            words = text.split('\n');
            initializeGame();
        })
        .catch(error => console.error('Error fetching words:', error));
}

function processFullWordGuess(guessedWord) {
    const currentWord = words[currentWordIndex].toLowerCase();
    if (guessedWord === currentWord) {
        score++;
        document.getElementById('currentScore').textContent = score;
        updateScoreInDatabase(username, score);
        proceedToNextWord();
    } else {
        wrongGuesses++;
        document.getElementById('wrongGuesses').textContent = wrongGuesses;
        alert('Incorrect. Try again!');
    }
    document.getElementById('guessInput').value = ''; // Clear the input field
}


function displayFinalScore() {
    alert(`Game over! Your final score is: ${score}/${words.length}`);
    // Restart game or redirect options here
}
