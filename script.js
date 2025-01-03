let score = 0;
let gameStarted = false;
let boyPosition = window.innerWidth / 2; // Start in the middle of the screen
let gameTime = 30; // Game duration in seconds
let timerInterval;
let touchStartX = 0;
let touchMoveX = 0;
let isTouching = false;
let moveInterval = null; // For holding down the buttons

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
    window.addEventListener('keydown', moveBoyWithKeyboard);

    // Add touch event listeners for mobile control
    const bowContainer = document.getElementById('bowAndArrow');
    bowContainer.addEventListener('touchstart', onTouchStart, { passive: false });
    bowContainer.addEventListener('touchmove', onTouchMove, { passive: false });
    bowContainer.addEventListener('touchend', onTouchEnd, { passive: false });
}

// Handle touch start
function onTouchStart(event) {
    event.preventDefault(); // Prevent default touch behavior
    touchStartX = event.touches[0].clientX; // Record starting touch position
    isTouching = true;
}

// Handle touch move
function onTouchMove(event) {
    if (isTouching) {
        event.preventDefault(); // Prevent default touch behavior
        touchMoveX = event.touches[0].clientX; // Record current touch position
        moveBoy(touchMoveX);
    }
}

// Handle touch end
function onTouchEnd() {
    isTouching = false;
    clearInterval(moveInterval); // Stop moving when touch ends
}

// Create falling hearts
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

// Collision detection
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

// Move boy with button controls (Move Left and Move Right)
document.getElementById('moveLeft').addEventListener('mousedown', () => {
    startMoving('left');
});

document.getElementById('moveRight').addEventListener('mousedown', () => {
    startMoving('right');
});

document.getElementById('moveLeft').addEventListener('mouseup', stopMoving);
document.getElementById('moveRight').addEventListener('mouseup', stopMoving);

document.getElementById('moveLeft').addEventListener('touchstart', () => {
    startMoving('left');
});

document.getElementById('moveRight').addEventListener('touchstart', () => {
    startMoving('right');
});

document.getElementById('moveLeft').addEventListener('touchend', stopMoving);
document.getElementById('moveRight').addEventListener('touchend', stopMoving);

// Start moving the character in a direction (left or right)
function startMoving(direction) {
    if (moveInterval) clearInterval(moveInterval); // Clear any previous intervals before starting a new one

    moveInterval = setInterval(() => {
        if (direction === 'left') {
            boyPosition -= 10;
            if (boyPosition < 0) boyPosition = 0;
        } else if (direction === 'right') {
            boyPosition += 10;
            const boyWidth = document.getElementById('bowAndArrowImg').offsetWidth;
            const screenWidth = window.innerWidth;
            if (boyPosition > screenWidth - boyWidth) boyPosition = screenWidth - boyWidth;
        }
        updateBoyPosition();
    }, 50); // Move every 50ms while the button is held
}

// Stop moving when mouse/touch is released
function stopMoving() {
    clearInterval(moveInterval);
}

// Update the boy's position on the screen
function updateBoyPosition() {
    const bowContainer = document.getElementById('bowAndArrow');
    bowContainer.style.left = `${boyPosition}px`;
}

// Move boy with keyboard (ArrowLeft and ArrowRight)
function moveBoyWithKeyboard(event) {
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

// Start the game timer
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

// End game function
function endGame() {
    gameStarted = false;

    window.removeEventListener('keydown', moveBoyWithKeyboard);
    alert(`Game Over! Your final score is ${score}`);
    location.reload();
}
