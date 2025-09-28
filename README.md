# Wordle Clone (Student Implementation)

## Overview
This is a simplified clone of the classic **Wordle** game implemented in JavaScript, HTML, and CSS.  
The project was developed as part of a coursework assignment, following a provided skeleton.  
All core logic is implemented in `student-implementation.js`.

## Implementation Approach
Our approach closely followed the function-by-function requirements in the handout:

- **Game Initialization (`initializeGame`)**  
  Resets all game state, chooses a random word from the provided word list, clears the board, and hides messages.

- **Keyboard Handling (`handleKeyPress`)**  
  Processes user input:
  - A–Z letters update the current guess and tile display.  
  - **Enter** submits a complete guess.  
  - **Backspace** removes the last letter.  
  Input validation ensures guesses are the correct length and the game hasn’t ended.

- **Submitting Guesses (`submitGuess`)**  
  Validates the guess against the dictionary, checks each letter with `checkLetter`, colors the tiles, updates the keyboard, and moves to the next row.  
  Handles win/loss conditions by calling `updateGameState`.

- **Letter Checking (`checkLetter`)**  
  Implements Wordle’s rules for marking letters:
  - **Green (correct):** exact match.  
  - **Yellow (present):** letter exists elsewhere but not in this position.  
  - **Gray (absent):** letter not in the word.  
  Duplicate letters are handled by tracking remaining unmatched letters.

- **Game State (`updateGameState`)**  
  Determines win/loss, triggers end game modal, and updates statistics.

- **Advanced Features**  
  - **Keyboard coloring (`updateKeyboardColors`)** with priority rules (green > yellow > gray).  
  - **Celebration (`processRowReveal`)** for correct rows.  
  - **Modal (`showEndGameModal`)** showing win/lose message, word reveal, and stats.  
  - **Input validation (`validateInput`)** ensuring proper key use.

## Testing
- Verified valid/invalid word entry (`ABOUT` works, `RULES` rejected).  
- Checked tile and keyboard coloring for correct/present/absent letters.  
- Used debug helpers during development to reveal the current word for win testing.  
- Confirmed end game modal and stats update correctly on win/loss.


---
