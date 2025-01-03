let score = 0;
let gameStarted = false;
let boyPosition = window.innerWidth / 2; // Start in the middle of the screen
let gameTime = 30; // Game duration in seconds
let timerInterval;

// Start the game when the button is clicked
document.getElementById('startButton').addEventListener('click', function () {
    const name = document.getElementById('nameInput').value;

    if (name) {
        gameStarted = true;
        document.getElementById('score').style.display = 'block';
        document.getElementById('timer').style.display = 'block';
        startGame(name);
    }
});

function startGame(name) {
    document.querySelector('.container').style.display = 'none';

    const heartInterval = setInterval(() => {
        if (gameStarted) {
            createHeart(name);
        }
    }, 1000);

    startTimer(heartInterval);
    window.addEventListener('keydown', moveBoy);
}

function createHeart(name) {
    const heartContainer = document.getElementById('heartContainer');

    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = `❤️ ${name} ❤️`;

    const randomX = Math.random() * (window.innerWidth - 50); // Avoid overflow
    heart.style.left = `${randomX}px`;
    heart.style.animationDuration = '4s';

    heartContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 4200); // Ensure it's slightly longer than animation duration

    checkCollision(heart);
}

function checkCollision(heart) {
    const interval = setInterval(() => {
        const heartRect = heart.getBoundingClientRect();
        const boyRect = document.getElementById('bowAndArrowImg').getBoundingClientRect();

        if (
            heartRect.top + heartRect.height > boyRect.top &&
            heartRect.left + heartRect.width > boyRect.left &&
            heartRect.left < boyRect.left + boyRect.width
        ) {
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
            heart.remove();
            clearInterval(interval);
        }
    }, 50); // Improved collision detection frequency
}

function moveBoy(event) {
    const boy = document.getElementById('bowAndArrowImg');
    const boyWidth = boy.offsetWidth;
    const screenWidth = window.innerWidth;

    if (event.key === 'ArrowLeft') {
        boyPosition -= 10;
        if (boyPosition < 0) boyPosition = 0;
    } else if (event.key === 'ArrowRight') {
        boyPosition += 10;
        if (boyPosition > screenWidth - boyWidth) boyPosition = screenWidth - boyWidth;
    }

    // Update the position with respect to the parent container's left position
    const bowContainer = document.getElementById('bowAndArrow');
    bowContainer.style.left = `${boyPosition}px`;
}


function startTimer(heartInterval) {
    const timer = document.getElementById('timer');
    timer.innerText = `Time Left: ${gameTime}s`;

    timerInterval = setInterval(() => {
        gameTime--;
        timer.innerText = `Time Left: ${gameTime}s`;

        if (gameTime === 0) {
            clearInterval(timerInterval);
            clearInterval(heartInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameStarted = false;

    window.removeEventListener('keydown', moveBoy);
    alert(`Game Over! Your final score is ${score}`);
    location.reload();
}
