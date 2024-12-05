document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-btn');
  const restartButton = document.getElementById('restart-btn');
  const gameBoard = document.getElementById('game-board');
  const difficultyControls = document.getElementById('difficulty-controls');
  const winPopup = document.getElementById('win-popup');
  const playAgainButton = document.getElementById('play-again-btn');
  const timerElement = document.getElementById('timer');
  const movesElement = document.getElementById('moves');
  let timer, flipCount = 0, matchCount = 0, moves = 0;
  let firstCard, secondCard;
  let lockBoard = false;

  // Emoji values for the cards
  const emojiValues = ['🍎', '🍌', '🍓', '🍇', '🍉', '🍊', '🍍', '🥭']; // Emojis to be used as values
  let shuffledCards = [];

  // Sound elements
  const flipSound = document.getElementById('flip-sound');
  const winSound = document.getElementById('win-sound');

  // Function to initialize the game
  function initializeGame() {
    gameBoard.innerHTML = '';
    shuffledCards = shuffle([...emojiValues, ...emojiValues]); // Double the emojis for pairs
    renderCards(shuffledCards);
    resetGameStats();
  }

  // Start button functionality
  startButton.addEventListener('click', () => {
    startButton.classList.add('hidden');
    difficultyControls.classList.remove('hidden');
  });

  // Difficulty change listener
  document.getElementById('difficulty').addEventListener('change', () => {
    startGame();
  });

  // Start the game with selected difficulty
  function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    setGameDifficulty(difficulty);
    startTimer();
    initializeGame();
    difficultyControls.classList.add('hidden');
    restartButton.classList.remove('hidden');
  }

  // Set game difficulty and layout
  function setGameDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        gameBoard.classList.add('easy');
        gameBoard.classList.remove('medium', 'hard');
        break;
      case 'medium':
        gameBoard.classList.add('medium');
        gameBoard.classList.remove('easy', 'hard');
        break;
      case 'hard':
        gameBoard.classList.add('hard');
        gameBoard.classList.remove('easy', 'medium');
        break;
    }
  }

  // Render cards based on the shuffled array
  function renderCards(cards) {
    cards.forEach((cardValue) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `<span>${cardValue}</span>`;
      card.addEventListener('click', () => flipCard(card));
      gameBoard.appendChild(card);
    });
  }

  // Shuffle the card values
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Flip a card
  function flipCard(card) {
    if (lockBoard || card === firstCard || card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    flipSound.play(); // Play flip sound
    flipCount++;
    if (flipCount === 1) {
      firstCard = card;
    } else if (flipCount === 2) {
      secondCard = card;
      lockBoard = true;
      checkForMatch();
    }
  }

  // Check if the two flipped cards match
  function checkForMatch() {
    const isMatch = firstCard.textContent === secondCard.textContent;
    isMatch ? disableCards() : unflipCards();
    moves++;
    movesElement.textContent = moves;
  }

  // Disable the cards if they match
  function disableCards() {
    matchCount++;
    if (matchCount === shuffledCards.length / 2) {
      endGame();
    }
    resetBoard();
  }

  // Unflip cards if they don't match
  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 1000);
  }

  // Reset the board
  function resetBoard() {
    [flipCount, lockBoard] = [0, false];
    firstCard = null;
    secondCard = null;
  }

  // Start the timer
  function startTimer() {
    let time = 0;
    timer = setInterval(() => {
      time++;
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
  }

  // Stop the timer
  function stopTimer() {
    clearInterval(timer);
  }

  // End the game
  function endGame() {
    stopTimer();
    winPopup.classList.remove('hidden');
    document.getElementById('final-time').textContent = timerElement.textContent;
    document.getElementById('final-moves').textContent = moves;
    winSound.play(); // Play win sound
    playAgainButton.addEventListener('click', () => {
      winPopup.classList.add('hidden');
      startGame();
    });
  }

  // Reset the game stats
  function resetGameStats() {
    flipCount = 0;
    matchCount = 0;
    moves = 0;
    movesElement.textContent = moves;
    timerElement.textContent = '0:00';
  }

  // Restart button functionality
  restartButton.addEventListener('click', () => {
    initializeGame();
  });
});
