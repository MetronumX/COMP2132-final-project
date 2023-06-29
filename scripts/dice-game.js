/*
@author: Linkun Yao
@version: 1.0
COMP 2132 Dice Game: Player and DiceGame Objects
*/

/**Constants*/
const ZERO_SCORE              = 0;
const MIN_DICE_ROLL           = 1;
const MAX_DICE_ROLL           = 6;
const ZERO_SCORE_DICE_VALUE   = 1;

const SAME_VALUE_MULTIPLIER   = 2;

/**
 * Defines a Player Object
 * @param name: the name of Pokemon user selects
 * @param image: the matching image of Pokemon selected
 * Default score is 0
 */
class Player{
   constructor(){
      this.totalScore = ZERO_SCORE;
   }

   /**
    * Adds user's round score to total score
    * @param {*} roundScore 
    */
   addScoreToTotal(roundScore){
      this.totalScore += roundScore;
   }

   /**
    * Getter for total score
    * @returns the user's total score
    */
   getTotalScore(){
      return this.totalScore;
   }

   /**
    * Setter for total score
    * @param {*} score a provided score
    */
   setTotalScore(score){
      this.totalScore = score;
   }
}


/**
 * Defines a DiceGame Object between user and computer
 * @param user the user who is a player in the dice game
 * @param computer the player the user is playing against
 */
class DiceGame{
   /**
    * Instantiates and plays a round of dice roll between user and computer
    * @param {*} user the user for the dice game
    * @param {*} computer the computer(opponent) for the dice game
    * @returns array of the user and computer's dice rolls (each are an array themselves)
    */
   playRound(user, computer){
      let userDiceRoll = this.rollDice();
      let userRoundScore = this.calculateRoundScore(userDiceRoll);
      user.addScoreToTotal(userRoundScore);

      let computerDiceRoll = this.rollDice();
      let computerRoundScore = this.calculateRoundScore(computerDiceRoll);
      computer.addScoreToTotal(computerRoundScore);

      let allDiceRolls = [userDiceRoll, computerDiceRoll];

      return allDiceRolls;
   }

   /**
    * Generates a dice roll with a value representing each dice
    * @returns array of two dice rolls to represent one round of dice roll for each player
    */
   rollDice(){
      let firstDiceRoll = generateRandomRoll(MIN_DICE_ROLL, MAX_DICE_ROLL);
      let secondDiceRoll = generateRandomRoll(MIN_DICE_ROLL, MAX_DICE_ROLL);

      let diceRoll = [firstDiceRoll, secondDiceRoll];
      return diceRoll;
   }


   /**
    * Calculates the user/computer's round score based on dice rolls and game rules
    * @param {*} diceRoll array of two dice roll values
    * @returns user/computer's score for the round
    */
   calculateRoundScore(diceRoll){
      const FIRST_DICE_ROLL         = diceRoll[0];
      const SECOND_DICE_ROLL        = diceRoll[1];
      if(diceRoll.includes(ZERO_SCORE_DICE_VALUE)){
         return ZERO_SCORE;
      }else if(FIRST_DICE_ROLL == SECOND_DICE_ROLL){
         let roundScore = (FIRST_DICE_ROLL + SECOND_DICE_ROLL) * SAME_VALUE_MULTIPLIER;
         return roundScore;
      }else{
         let roundScore = FIRST_DICE_ROLL + SECOND_DICE_ROLL;
         return roundScore;
      }
   }

   determineWinner(userScore, computerScore){
      if(userScore > computerScore){
         return `<p>Rayquaza has fainted, You won!</p>`;
      }else if(computerScore > userScore){
         return `<p>Your Pokemon has fainted, Rayquaza won!</p>`;
      }else{
         return `<p>It was a tie!</p>`;
      }
   }
}


/**
    * Generates a random dice roll
    * @param {*} min the minimum integer
    * @param {*} max the maximum integer
    * @returns a random integer that represents a dice roll
    */
function generateRandomRoll(min, max){
   return Math.floor(Math.random() * (max - min + 1) + min);
}