// Main WordHurl script

// IMPORTANT Next TODO Items
// =========================
//
// DEVELOPMENT PHASE I - MUST BE COMPLETED BEFORE 02/04/2023
//
// TODO: Fix bug on loading animation on first tile due to default selection. (Add delay?)
// TODO: Fix bug where after midnight (on game started before midnight) guesstiles refresh but previous session for wordtiles remains causing an error
// TODO: Add config variables to allow developer to unlimited play / reload for testing
// TODO: Track score (number of guesses, number of misses, number of hits, number of correct guesses, word length, etc.)
// TODO: Add all variables to win/lose score modal
// TODO: Countdown to next game (Midnight localtime) unlock on score window/modal (see wordle)
// TODO: Move Reset / New game / reload button into win/loss modal
//
// DEVELOPMENT PHASE II - MUST BE COMPLETED BEFORE 02/06/2023
//
// TODO: Track gameplay history
// TODO: Ensure session progress is saved after EACH TURN to prevent cheating / reset mid-game
// TODO: Development variable to disable session tracking/progress saving (for testing)
// TODO: On win modal, (if value returned) pull definition and pronouciation of word from dictionary api and display it (https://api.dictionaryapi.dev/api/v2/entries/en/<word>).
// TODO: Admin/Developer page to show upcoming words and scrambled tiles for next X days (OPTIONAL: with ability to delete word from rotation)
// TODO: Code cleanup, make everything a function where possible.
// TODO: Ensure good comments throughout code and all functions
// TODO: Animate hits and misses (color fade in with increased saturation/alpha and then lower to final color and scale/bounce on hit, shake on miss?)
// TODO: Animate miss remaining count with scale and fade (or whatever looks good)
// TODO: Show quick shake / error animation if guesstile is clicked before a wordtile is selected
// TODO: Animate Win (wave pattern from left to right scaling up and down on completed wordtiles) before showing win/lose modal
// TODO: Animate loss (shake on remaining wordtiles) and have the unguessed ones flip over / uncover from left to right to show winning word. Then open win/lose modal.
// TODO: Ensure random word selection based on day is working and won't duplicate words picked any time soon
// TODO: Rename / separate / split functions into script files to be more modular and give scripts/libs meaningful names.
// TODO: Fix UI scaling across all desktop browsers, and popular mobile browsers including on iOS / Android. Needs to factor in height more than width for scaling purposes.
// TODO: Polish and cleanup css, html, and layout
// TODO: Animate history, prev history should slide down, then deal new history row like page load does
// TODO: Add config variables to allow developer to set custom word and scrambled tiles for testing
// TODO: Add config variables to allow developer to set custom word date for testing
//
// DEVELOPMENT PHASE III
//
// TODO: Possily scramble words.js (especially scrambled tiles) to make it harder to cheat (or just use a server side database)
// TODO: Day/Night Theme based on time of day. E.g. Day theme is light colors (white-ish? bg), night theme is dark colors (current)
// TODO: Create score graph / graphics with hit/miss accuracy, over time, etc. (whatever can be graphed and look cool from current local information.)
// TODO: Display score graph window/modal on win
//
// DEVELOPMENT PHASE IIII
//
// TODO: Send stats to server after game over. Score, etc so we can graph how players compare and track conversions (google analytics / adsense?)
// TODO: To prevent cheating, change game data to server side on backend by having the python and other server script generate one randomWord and scrambleWord at midnight, receive scores, etc. (See wordhurl.sqlite3)
// TODO: In the future, enhance WordHurl by using server side sqlite database for handling words, scores, etc.
// TODO: Admin portal
// TODO: 508 Compliance (Alt text for misses remaining, etc.)
// TODO: Add support for other languages
// TODO: Add configuration variables for things like selecting the first tile by default on load, animation speed tweaks, tween variables, colors (day/night themes), animation types/rates, and other ui/ux things that would be likely to tweek
//
// COMPLETED DEVELOPMENT ITEMS
//
// DONE: Add modifier variable to add or subtract from maximum number of misses
// DONE: Make how to play a separate modal window
// DONE: Add fiverr logo to page
// DONE: Display score modal on game end (see wordle as example)
// DONE: Check if player has already played today and show previously solved game & score if so (must survive browser close / reload)
// DONE: Replace all alerts with modal windows
// DONE: Improve how to play icon/link style
// DONE: Reset / New game / reload button
// DONE: Don't show selection marquee on guesstiles if a wordtile isn't selected
// DONE: Allow guessTile selection via keyboard (A-Z). If multiple guessTiles of same letter, choose the first available
// DONE: When a wordTile is selected, show stored hits and misses unique to that wordTile only
// DONE: To increase fun and risk, add a maximum number of guesses per game based on word length. E.g. 3 guesses for 3 letter words, 4 guesses for 4 letter words, etc.
// DONE: Track remaining misses and update "Misses Remaining" UI and CSS
// DONE: Check if all guesstiles are correct (Win Condition)
// DONE: When a wordTile is matched, the next wordTile to the right should be selected automatically
// DONE: When a guessTile hits (matches), it should prevent additional guesses on it
// DONE: When a guessTile misses, it should become disabled ONLY in the context of the selected wordTile to prevent additional guesses on it while that wordTile is selected
// DONE: Load word and scrambled tiles from data\words.py
// DONE: From words.py Pick word and scrambled from array in order based on date
// DONE: Check guessTile vs selected wordTile as an index of randomWord
// DONE: Store hits and misses mapped from guessTile to wordTile
// DONE: Allow wordTile selection via arrow keys (and number keys?)
// DONE: Fix first tile "deal" animation not showing due to its' automatic selection on load

const GUESS_TILE_CLASS = 'guesstile';
const GUESS_TILE_MATCHED_CLASS = 'matched';
const GUESS_TILE_MISSED_CLASS = 'miss';
const GUESS_TILE_READY_CLASS = 'ready';

const REFRESH_BUTTON_CLASS = 'fa-refresh';

const WORD_TILE_CLASS = 'wordtile';
const WORD_TILE_MATCHED_CLASS = 'matched';
const WORD_TILE_SELECTED_CLASS = 'selected';

// Get Game Over Modal
var gameOverModal = document.getElementById("gameover-modal");

// Word tile selection
wordTilesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains(WORD_TILE_CLASS)) {
    const isUnselected = !e.target.classList.contains(WORD_TILE_SELECTED_CLASS);

    unselectWordTile();
    if (isUnselected) {
      selectWordTile(e.target);
    }
  }
});

// Guess tile selection
guessTilesContainer.addEventListener("click", (e) => {
  const classList = e.target.classList;
  if (!classList.contains(GUESS_TILE_CLASS)) {
    return;
  }
  selectGuessTile(e.target);
});

// If click is not on a wordtile or guess tile then remove the selected class from all word tiles
document.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains(WORD_TILE_CLASS) &&
    !e.target.classList.contains(GUESS_TILE_CLASS)
  ) {
    unselectWordTile();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains(REFRESH_BUTTON_CLASS)) {
    window.location.reload();
  }
});

document.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'ArrowRight':
      selectNextAvailableTile();
      break;
    case 'ArrowLeft':
      selectPreviousAvailableTile();
      break;
    default:
      if (key.match(/[a-z]/i)) { guessLetter(key.toUpperCase()); }
      break;
  }
});

// Track guess mapping to word tile
function addGuessToWordTile(tile, letter) {
  const { guesses } = tile.dataset;
  tile.dataset.guesses = !guesses ? letter : `${guesses},${letter}`;
}

function getGuessTiles() {
  return guessTilesContainer.querySelectorAll(`.${GUESS_TILE_CLASS}`);
}

function getWordTiles() {
  return wordTilesContainer.querySelectorAll(`.${WORD_TILE_CLASS}`);
}

function getSelectedWordTile() {
  return wordTilesContainer.querySelector(`.${WORD_TILE_SELECTED_CLASS}`);
}

function wasLetterAlreadyGuessed(tile, letter) {
  return tile.dataset.guesses.split(",").includes(letter);
}

function selectGuessTile(tile) {
  const selectedWordTile = getSelectedWordTile();

  if (
    !isGameActive ||
    !selectedWordTile ||
    selectedWordTile.classList.contains(WORD_TILE_MATCHED_CLASS) ||
    tile.classList.contains(GUESS_TILE_MATCHED_CLASS) ||
    tile.classList.contains(GUESS_TILE_MISSED_CLASS)
  ) {
    return;
  }

  // Check guess hit / miss
  const { index } = selectedWordTile.dataset;
  const { index: guessIndex, letter } = tile.dataset;
  if (letter === randomWord[index]) {
    tile.classList.add(GUESS_TILE_MATCHED_CLASS);
    selectedWordTile.classList.add(WORD_TILE_MATCHED_CLASS);
    selectedWordTile.innerText = letter;
    selectedWordTile.dataset.guessIndex = guessIndex;

    const wordTiles = [...getWordTiles()];
    if (wordTiles.some((el) => !el.classList.contains(WORD_TILE_MATCHED_CLASS))) {
      selectNextAvailableTile();
    } else {
      triggerGameWin();
    }
  } else {
    addGuessToWordTile(selectedWordTile, letter);
    tile.classList.add(GUESS_TILE_MISSED_CLASS);
    incrementMissCounter();
    if (missCount === maxMisses) {
      triggerGameLoss();
    }
  }
}

function selectWordTile(tile) {
  const { guessIndex, guesses = '' } = tile.dataset;
  const letters = [...getGuessTiles()];
  const previousGuesses = guesses.split(',');

  tile.classList.add(WORD_TILE_SELECTED_CLASS);
  letters.forEach((el, i) => {
    if (previousGuesses.includes(el.dataset.letter)) {
      el.classList.add(GUESS_TILE_MISSED_CLASS);
    }
  });
  guessTilesContainer.classList.add(GUESS_TILE_READY_CLASS);
}

function unselectWordTile() {
  const tile = getSelectedWordTile();
  guessTilesContainer.classList.remove(GUESS_TILE_READY_CLASS);

  if (tile) {
    tile.classList.remove(WORD_TILE_SELECTED_CLASS);

    const letters = [...getGuessTiles()];
    letters.forEach((el) => {
      el.classList.remove(GUESS_TILE_MISSED_CLASS);
    });
  }
}

function selectNextAvailableTile() {
  const allWordTiles = [...getWordTiles()];
  const selectedWordTile = getSelectedWordTile();
  const dataset = selectedWordTile?.dataset;
  unselectWordTile();

  // check for a word tile still available to select
  if (!allWordTiles.some((tile) => !tile.classList.contains(WORD_TILE_MATCHED_CLASS))) {
    return;
  }

  let indexToCheck = (Number(dataset?.index) + 1) % allWordTiles.length;
  if (isNaN(indexToCheck)) { indexToCheck = 0; }
  for (let i = 0; i < allWordTiles.length; i++) {
    if (!allWordTiles[indexToCheck].classList.contains(WORD_TILE_MATCHED_CLASS)) {
      selectWordTile(allWordTiles[indexToCheck]);
      return;
    }
    indexToCheck++;
    if (indexToCheck === allWordTiles.length) {
      indexToCheck = 0;
    };
  }
}

function selectPreviousAvailableTile() {
  const allWordTiles = [...getWordTiles()];
  const selectedWordTile = getSelectedWordTile();
  const dataset = selectedWordTile?.dataset;
  unselectWordTile();

  // check for a word tile still available to select
  if (!allWordTiles.some((tile) => !tile.classList.contains(WORD_TILE_MATCHED_CLASS))) {
    return;
  }

  let indexToCheck = Number(dataset?.index) - 1;
  if (isNaN(indexToCheck) || indexToCheck === -1) { indexToCheck = allWordTiles.length - 1; }
  for (let i = 0; i < allWordTiles.length; i++) {
    if (!allWordTiles[indexToCheck].classList.contains(WORD_TILE_MATCHED_CLASS)) {
      selectWordTile(allWordTiles[indexToCheck]);
      return;
    }
    indexToCheck--;
    if (indexToCheck < 0) {
      indexToCheck = allWordTiles.length - 1;
    };
  }
}

function incrementMissCounter() {
  missCount++;
  missTrackerContainer.children[0].remove();
  
  const missIcon = document.createElement('i');
  missIcon.classList.add('far', 'fa-circle');
  missTrackerContainer.append(missIcon);
}

function triggerGameLoss() {
  endGame();
  updateGameCookies();
  //alert('you have lost D:');
  // Open the Modal
  gameOverModal.style.display = "block";
}

function triggerGameWin() {
  endGame();
  updateGameCookies();
  //alert('you win!');
  // Open the Modal
  gameOverModal.style.display = "block";
}

function endGame() {
  isGameActive = false;
  const refreshButton = document.querySelector(`.${REFRESH_BUTTON_CLASS}`);
  refreshButton?.classList.remove('hidden');
}

function updateGameCookies() {
  setCookie(GUESS_COOKIE, [ ...getWordTiles()].map((t) => t.innerHTML || '_').join(''));
  setCookie(TIME_COOKIE, new Date().toISOString().split('T')[0]);
}

function guessLetter(letter) {
  if (!randomWord.includes(letter)) { return; }

  const tileToGuess = [...getGuessTiles()].find((el) => el.dataset.letter === letter);
  if (tileToGuess) {
    selectGuessTile(tileToGuess);
  }
}