/**
 * WORDLE CLONE - STUDENT IMPLEMENTATION
 * 
 * Complete the functions below to create a working Wordle game.
 * Each function has specific requirements and point values.
 * 
 * GRADING BREAKDOWN:
 * - Core Game Functions (60 points): initializeGame, handleKeyPress, submitGuess, checkLetter, updateGameState
 * - Advanced Features (30 points): updateKeyboardColors, processRowReveal, showEndGameModal, validateInput
 */

// ========================================
// CORE GAME FUNCTIONS (60 POINTS TOTAL)
// ========================================

/**
 * Initialize a new game
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Reset all game state variables
 * - Get a random word from the word list
 * - Clear the game board
 * - Hide any messages or modals
 */
function initializeGame() {
    // TODO: Reset game state variables
    currentWord = WordleWords.getRandomWord().toUpperCase();
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    
    // TODO: Get a random word from the word list
    // HINT: Use WordleWords.getRandomWord()
    
    // TODO: Reset the game board
    // HINT: Use resetBoard()
    
    // TODO: Hide any messages
    // HINT: Use hideModal() and ensure message element is hidden
    
    resetBoard();

    hideModal();
    messageElement.textContent = '';
    messageElement.classList.add('hidden');
}

/**
 * Handle keyboard input
 * POINTS: 15
 * 
 * TODO: Complete this function to:
 * - Process letter keys (A-Z)
 * - Handle ENTER key for word submission
 * - Handle BACKSPACE for letter deletion
 * - Update the display when letters are added/removed
 */

function handleKeyPress(key) {
    // TODO: Check if game is over - if so, return early
    
    // TODO: Handle letter keys (A-Z)
    // HINT: Use regex /^[A-Z]$/ to test if key is a letter
    // HINT: Check if currentGuess.length < WORD_LENGTH before adding
    // HINT: Use getTile() and updateTileDisplay() to show the letter
    
    // TODO: Handle ENTER key
    // HINT: Check if guess is complete using isGuessComplete()
    // HINT: Call submitGuess() if complete, show error message if not
    
    // TODO: Handle BACKSPACE key  
    // HINT: Check if there are letters to remove
    // HINT: Clear the tile display and remove from currentGuess
    if (gameOver || currentRow >= MAX_GUESSES) return;

    const K = (key || '').toUpperCase();

    // Enforce input rules
    if (!validateInput(K, currentGuess)) {
        // Gentle feedback when Enter is pressed too early
        if (K === 'ENTER' && currentGuess.length < WORD_LENGTH) {
            showMessage('Not enough letters', 'error');
            shakeRow(currentRow);
        }
        return;
    }

    // LETTER KEYS
    if (/^[A-Z]$/.test(K)) {
        const col = currentGuess.length;
        currentGuess += K;

        const tile = getTile(currentRow, col);
        updateTileDisplay(tile, K);
        return;
    }

    // ENTER
    if (K === 'ENTER') {
        submitGuess();
        return;
    }

    // BACKSPACE
    if (K === 'BACKSPACE') {
        const col = currentGuess.length - 1;
        currentGuess = currentGuess.slice(0, -1);

        const tile = getTile(currentRow, col);
        updateTileDisplay(tile, '');
        setTileState(tile, '');
        return;
    }
}


/**
 * Submit and process a complete guess
 * POINTS: 20
 * 
 * TODO: Complete this function to:
 * - Validate the guess is a real word
 * - Check each letter against the target word
 * - Update tile colors and keyboard
 * - Handle win/lose conditions
 */
function submitGuess() {
    // TODO: Validate guess is complete
    // HINT: Use isGuessComplete()
    
    // TODO: Validate guess is a real word
    // HINT: Use WordleWords.isValidWord()
    // HINT: Show error message and shake row if invalid
    
    // TODO: Check each letter and get results
    // HINT: Use checkLetter() for each position
    // HINT: Store results in an array
    
    // TODO: Update tile colors immediately
    // HINT: Loop through results and use setTileState()
    
    // TODO: Update keyboard colors
    // HINT: Call updateKeyboardColors()
    
    // TODO: Check if guess was correct
    // HINT: Compare currentGuess with currentWord
    
    // TODO: Update game state
    // HINT: Call updateGameState()
    
    // TODO: Move to next row if game continues
    // HINT: Increment currentRow and reset currentGuess

    if (!isGuessComplete()) {
        showMessage('Not enough letters', 'error');
        shakeRow(currentRow);
        return;
    }

    const guess = getCurrentGuess();  
    const target = getTargetWord();   


    if (!WordleWords.isValidWord(guess)) {
        showMessage('Not in word list', 'error');
        shakeRow(currentRow);
        return;
    }

 
    const results = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guess[i];
        const status = checkLetter(letter, i, target);
        results.push(status);
    }


    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = getTile(currentRow, i);
        setTileState(tile, results[i]);
    }


    updateKeyboardColors(guess, results);


    processRowReveal(currentRow, results);


    const isCorrect = (guess === target);
    updateGameState(isCorrect);


    if (!gameOver) {
        currentRow += 1;
        currentGuess = '';
    }    
    
}

/**
 * Check a single letter against the target word
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Return 'correct' if letter matches position exactly
 * - Return 'present' if letter exists but wrong position
 * - Return 'absent' if letter doesn't exist in target
 * - Handle duplicate letters correctly (this is the tricky part!)
 */
function checkLetter(guessLetter, position, targetWord) {
    // TODO: Convert inputs to uppercase for comparison
    
    // TODO: Check if letter is in correct position
    // HINT: Compare targetWord[position] with guessLetter
    
    // TODO: Check if letter exists elsewhere in target
    // HINT: Use targetWord.includes() or indexOf()
    
    // TODO: Handle duplicate letters correctly
    // This is the most challenging part - you may want to implement
    // a more sophisticated algorithm that processes the entire word
    
    const letter = guessLetter.toUpperCase();
    const target = targetWord.toUpperCase();

    if (target[position] === letter) return 'correct';


    const guess = getCurrentGuess(); 
    const remaining = {};

    for (let i = 0; i < WORD_LENGTH; i++) {
        const t = target[i];
        const g = guess[i];
        if (t !== g) {
            remaining[t] = (remaining[t] || 0) + 1;
        }
    }


    for (let i = 0; i < position; i++) {
        const g = guess[i];
        if (g === letter && target[i] !== g && remaining[letter] > 0) {
            remaining[letter]--;
        }
    }

    if ((remaining[letter] || 0) > 0) return 'present';
    return 'absent';

}

/**
 * Update game state after a guess
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if player won (guess matches target)
 * - Check if player lost (used all attempts)
 * - Show appropriate end game modal
 */
function updateGameState(isCorrect) {
    // TODO: Handle win condition
    // HINT: Set gameWon and gameOver flags, call showEndGameModal
    
    // TODO: Handle lose condition  
    // HINT: Check if currentRow >= MAX_GUESSES - 1
    
    if (isCorrect) {
        gameWon = true;
        gameOver = true;
        showEndGameModal(true, currentWord);
        return;
    }

    if (currentRow >= MAX_GUESSES - 1) {
        gameOver = true;
        gameWon = false;
        showEndGameModal(false, currentWord);
        return;
    }    
}

// ========================================
// ADVANCED FEATURES (30 POINTS TOTAL)
// ========================================

/**
 * Update keyboard key colors based on guessed letters
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Update each key with appropriate color
 * - Maintain color priority (green > yellow > gray)
 * - Don't downgrade key colors
 */
function updateKeyboardColors(guess, results) {
    // TODO: Loop through each letter in the guess
    
    // TODO: Get the keyboard key element
    // HINT: Use document.querySelector with [data-key="LETTER"]
    
    // TODO: Apply color with priority system
    // HINT: Don't change green keys to yellow or gray
    // HINT: Don't change yellow keys to gray
    
    if (!guess || !results || results.length !== guess.length) return;

    const rank = { absent: 0, present: 1, correct: 2 };
    const bestForLetter = {};

    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i].toUpperCase();
        const state  = results[i];

        if (!bestForLetter[letter] || rank[state] > rank[bestForLetter[letter]]) {
            bestForLetter[letter] = state;
        }
    }

    Object.keys(bestForLetter).forEach(letter => {
        updateKeyboardKey(letter, bestForLetter[letter]);
    });
}

/**
 * Process row reveal (simplified - no animations needed)
 * POINTS: 5 (reduced from 15 since animations removed)
 * 
 * TODO: Complete this function to:
 * - Check if all letters were correct
 * - Trigger celebration if player won this round
 */
function processRowReveal(rowIndex, results) {
    // TODO: Check if all results are 'correct'
    // HINT: Use results.every() method
    
    // TODO: If all correct, trigger celebration
    // HINT: Use celebrateRow() function
    
    if (Array.isArray(results) && results.length === WORD_LENGTH) {
        const allCorrect = results.every(r => r === 'correct');
        if (allCorrect) {
            celebrateRow(rowIndex);
        }
    }
}

/**
 * Show end game modal with results
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Display appropriate win/lose message
 * - Show the target word
 * - Update game statistics
 */
function showEndGameModal(won, targetWord) {
    // TODO: Create appropriate message based on won parameter
    // HINT: For wins, include number of guesses used
    // HINT: For losses, reveal the target word
    
    // TODO: Update statistics
    // HINT: Use updateStats() function
    
    // TODO: Show the modal
    // HINT: Use showModal() function
    
    const guessesUsed = won ? (currentRow + 1) : 0;
    updateStats(won);
    showModal(won, targetWord.toUpperCase(), guessesUsed);
}

/**
 * Validate user input before processing
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if game is over
 * - Validate letter keys (only if guess not full)
 * - Validate ENTER key (only if guess complete)
 * - Validate BACKSPACE key (only if letters to remove)
 */
function validateInput(key, currentGuess) {
    // TODO: Return false if game is over
    
    // TODO: Handle letter keys
    // HINT: Check if currentGuess.length < WORD_LENGTH
    
    // TODO: Handle ENTER key
    // HINT: Check if currentGuess.length === WORD_LENGTH
    
    // TODO: Handle BACKSPACE key
    // HINT: Check if currentGuess.length > 0
    
    
    if (gameOver) return false;

    if (/^[A-Z]$/.test(key)) {
        return currentGuess.length < WORD_LENGTH;
    }

    if (key === 'ENTER') {
        return currentGuess.length === WORD_LENGTH;
    }

    if (key === 'BACKSPACE') {
        return currentGuess.length > 0;
    }

    return false;
}

// ========================================
// DEBUGGING HELPERS (REMOVE BEFORE SUBMISSION)
// ========================================






console.log('Student implementation template loaded. Start implementing the functions above!'); 