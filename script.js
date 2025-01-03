// script.js

document.getElementById('startButton').addEventListener('click', function() {
    const name = document.getElementById('nameInput').value;
    
    if (name) {
        // Create 10 hearts when the name is entered
        for (let i = 0; i < 10; i++) {
            createHeart(name);
        }
    }
});

function createHeart(name) {
    const heartContainer = document.getElementById('heartContainer');
    
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = `❤️ ${name} ❤️`;  // Heart with the name inside

    // Randomize the starting horizontal position of the heart
    const randomX = Math.random() * window.innerWidth; // Random X position across the screen
    const randomDelay = Math.random() * 1; // Randomize delay for each heart
    const randomSize = Math.random() * (30 - 20) + 20; // Randomize heart size
    const randomDuration = Math.random() * (7 - 4) + 4; // Randomize fall duration between 4 and 7 seconds

    // Apply randomized position and size
    heart.style.left = `${randomX}px`;
    heart.style.fontSize = `${randomSize}px`;
    heart.style.animationDelay = `${randomDelay}s`; // Random delay before animation starts
    heart.style.animationDuration = `${randomDuration}s`; // Randomize animation duration

    heartContainer.appendChild(heart);

    // Remove the heart after the animation completes (max 7 seconds)
    setTimeout(() => {
        heart.remove();
    }, randomDuration * 1000);  // Match the randomized duration
}
