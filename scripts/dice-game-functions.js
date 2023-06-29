/*
@author: Linkun Yao
@version: 1.0
COMP 2132 Dice Game: Functions + Scripts
*/

const gameRulesBtn = document.getElementById("game-rules-btn");
const gameRules = document.getElementById("game-rules");

const closeBtn = document.getElementById("btn-close");

const choosePokemonBtn = document.getElementById("choose-pokemon-btn");
const choosePokemon = document.getElementById("choose-pokemon");

const playGameBtn = document.getElementById("play-game-btn");
const gameWindow = document.getElementById("play-game");

const playerScore = document.getElementById("player-score");
const playerDice = document.getElementById("player-dice");
const playerImage = document.getElementById("player-image");

const computerScore = document.getElementById("computer-score");
const computerDice = document.getElementById("computer-dice");
const computerImage = document.getElementById("computer-image");

const roundCounter = document.getElementById("round-counter");

const rollDiceBtn = document.getElementById("roll-dice-btn");

const gameText = document.getElementById("game-text");

const backgroundAudio = document.getElementById("background-audio");
const muteBtn = document.getElementById("btn-mute");

const FIRST_ROUND = 1;
const FINAL_ROUND = 3;
const USER_DICE_ROLLS = 0;
const COMPUTER_DICE_ROLLS = 1;
const FIRST_DICE_ROLL = 0;
const SECOND_DICE_ROLL = 1;

const diceImageLoopTime = 3000;
let animationHandler;
let timerHandler;
let currentImage = 1;
let imageCounter = 1;
const maxImageCounter = 12;
const finalImage = 6;
const imageDelay = 250;
let animationIsUnderway = false;



/**
 * Initialize a game and set beginning game settings
 */
let currentRound = FIRST_ROUND;
let gameTextHTML = "";

const user = new Player();
const computer = new Player();

let diceGame = new DiceGame();

/**
 * click event to call showRules function
 */
gameRulesBtn.addEventListener("click", showRules);

function showRules() {
   gameRules.style.display = "grid";
}

/**
 * Click event to close game Rules
 */
closeBtn.addEventListener("click", function () {
   gameRules.style.display = "none";
})


/**
 * Click event to play game
 */
playGameBtn.addEventListener("click", playGame);

/**
 * Function that initializes a game of dice
 */
function playGame() {
   // Show the game window
   gameWindow.style.display = "grid";
   rollDiceBtn.addEventListener('click', playaRound);

   //backgroundAudio.play();
   //backgroundAudio.volume = 1.0;
   //backgroundAudio.loop = true;

}

function playaRound() {
   // Array of user dice roll (Array of two dice values) and computer dice roll (Array of two dice values)
   let diceRolls = diceGame.playRound(user, computer);

   // Index and store the first array containing the user's dice rolls
   let userDiceRoll = diceRolls[USER_DICE_ROLLS];

   // Index and store each dice roll value
   let userFirstDiceRoll = userDiceRoll[FIRST_DICE_ROLL];
   let userSecondDiceRoll = userDiceRoll[SECOND_DICE_ROLL];

   // For Computer
   let computerDiceRoll = diceRolls[COMPUTER_DICE_ROLLS];
   let computerFirstDiceRoll = computerDiceRoll[FIRST_DICE_ROLL];
   let computerSecondDiceRoll = computerDiceRoll[SECOND_DICE_ROLL];

   playerDice.innerHTML = `<img src="../images/dice.png" alt="dice">`;
   computerDice.innerHTML = `<img src="../images/dice.png" alt="dice">`;

   console.log(userFirstDiceRoll, userSecondDiceRoll);
   console.log(computerFirstDiceRoll, computerSecondDiceRoll);



   if (!animationIsUnderway) {
      animationIsUnderway = true;
      animationHandler = requestAnimationFrame(diceRollAnimation);

      setTimeout(function () {

         setDiceRollImage(userFirstDiceRoll, userSecondDiceRoll, computerFirstDiceRoll, computerSecondDiceRoll);

         let userRoundScore;
         let computerRoundScore;

         userRoundScore = diceGame.calculateRoundScore(userDiceRoll);
         computerRoundScore = diceGame.calculateRoundScore(computerDiceRoll);

         let userTotalScore;
         let computerTotalScore;

         userTotalScore = user.getTotalScore();
         computerTotalScore = computer.getTotalScore();


         if (currentRound < FINAL_ROUND) {
            currentRound++;
            gameTextHTML = `<p>You used Roll and got a ${userFirstDiceRoll} and a ${userSecondDiceRoll} totalling ${userRoundScore} points.</p>`;
            gameTextHTML += `<p>Rayquaza used Roll and got a ${computerFirstDiceRoll} and a ${computerSecondDiceRoll} totalling ${computerRoundScore} points.</p>`;
         } else {
            gameResults(userTotalScore, computerTotalScore);
            rollDiceBtn.removeEventListener("click", playaRound);
            rollDiceBtn.addEventListener("click", playAgain);
            rollDiceBtn.innerHTML = "Rematch?";
         }
         updateGameInfo(userRoundScore, computerRoundScore);
      }, diceImageLoopTime)
   }
}

/**
 * loops through all dice face images
 */
function diceRollAnimation() {
   currentImage++;
   imageCounter++;
   playerDice.innerHTML = `<img src='../images/dice_${currentImage}.png' alt='user first dice roll'>`;
   playerDice.innerHTML += `<img src='../images/dice_${currentImage}.png' alt='user second dice roll'>`;

   computerDice.innerHTML = `<img src='../images/dice_${currentImage}.png' alt='computer first dice roll'>`;
   computerDice.innerHTML += `<img src='../images/dice_${currentImage}.png' alt='computer second dice roll'>`;

   if (currentImage == finalImage) {
      currentImage = 1;
   }

   timerHandler = setTimeout(function () {
      animationHandler = requestAnimationFrame(diceRollAnimation);
   }, imageDelay);

   if (imageCounter == maxImageCounter) {
      cancelAnimationFrame(animationHandler);
      clearTimeout(timerHandler);
      animationIsUnderway = false;
      imageCounter = 1;
   }

}

/**
 * Updates the score, game text, and round number for each player
 * @param {*} userRoundScore the user's round score
 * @param {*} computerRoundScore the computer's round score
 */
function updateGameInfo(userRoundScore, computerRoundScore) {
   roundCounter.innerHTML = `<p>Round: ${currentRound}</p>`;

   if (currentRound != FIRST_ROUND) {
      playerScore.innerHTML = `<p>Total Score: ${user.getTotalScore()}</p>`;
      playerScore.innerHTML += `<p>Round Score: ${userRoundScore}</p>`;

      computerScore.innerHTML = `<p>Total Score: ${computer.getTotalScore()}</p>`;
      computerScore.innerHTML += `<p>Round Score: ${computerRoundScore}</p>`;
   }

   gameText.innerHTML = gameTextHTML;
}

/**
 * Sets the dice image to the corresponding rolls
 * @param {*} userFirstDiceRoll user's first dice roll
 * @param {*} userSecondDiceRoll user's second dice roll
 * @param {*} computerFirstDiceRoll computer's first dice roll
 * @param {*} computerSecondDiceRoll computer's second dice roll
 */
function setDiceRollImage(userFirstDiceRoll, userSecondDiceRoll, computerFirstDiceRoll, computerSecondDiceRoll) {
   playerDice.innerHTML = `<img src="../images/dice_${userFirstDiceRoll}.png" alt='user first dice roll'>`;
   playerDice.innerHTML += `<img src="../images/dice_${userSecondDiceRoll}.png" alt='user second dice roll'>`;

   computerDice.innerHTML = `<img src="../images/dice_${computerFirstDiceRoll}.png" alt='computer first dice roll'>`;
   computerDice.innerHTML += `<img src="../images/dice_${computerSecondDiceRoll}.png" alt='computer second dice roll'>`;
}

/**
 * Based on final total scores, determines the final winner
 * @param {*} userTotalScore user's total score
 * @param {*} computerTotalScore computer's total score
 */
function gameResults(userTotalScore, computerTotalScore) {
   gameTextHTML = `<p>Your final score is: ${userTotalScore}</p>`;
   gameTextHTML += `<p>Rayquaza's final score is: ${computerTotalScore}</p>`;
   gameTextHTML += diceGame.determineWinner(userTotalScore, computerTotalScore);
   //gameText.innerHTML = gameTextHTML;
}

/**
 * Resets game conditions back to initial conditions
 * Scores back to zero, game text back to original game text;
 * Dice Images back to default
 */
function playAgain() {
   user.setTotalScore(0);
   computer.setTotalScore(0);

   gameTextHTML = "A Wild Rayquaza has appeared!";
   gameText.innerHTML = gameTextHTML;
   currentRound = FIRST_ROUND;
   roundCounter.innerHTML = `<p>Round: ${currentRound}</p>`;
   playerScore.innerHTML = `<p>Total Score: ${user.getTotalScore()}</p>`;
   playerScore.innerHTML += `<p>Round Score: ${ZERO_SCORE}</p>`;

   computerScore.innerHTML = `<p>Total Score: ${computer.getTotalScore()}</p>`;
   computerScore.innerHTML += `<p>Round Score: ${ZERO_SCORE}</p>`;



   playerDice.innerHTML = `<img src="../images/dice.png" alt="dice">`;
   computerDice.innerHTML = `<img src="../images/dice.png" alt="dice">`;

   rollDiceBtn.removeEventListener("click", playAgain);
   rollDiceBtn.innerHTML = "Roll Dice!";
   rollDiceBtn.addEventListener("click", playGame);
}