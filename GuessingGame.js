function generateWinningNumber() {
  let winningNumber = Math.floor(Math.random() * 100) + 1;
  if (winningNumber === 0) {
    winningNumber++;
  }
  return winningNumber;
}

function shuffle(arr) {
  //Fisher-Yates Shuffle:
  //shuffles by taking random element from front of the array,
  //moving it to the back of the array, and then taking the
  //un-shuffled item at the back and putting it in the front,
  //waiting to be shuffled.
  let endIndex = arr.length;
  let tempValue;
  let currentIndex;

  // While there remain elements to shuffle…
  while (endIndex) {

    // Pick a remaining element…
    currentIndex = Math.floor(Math.random() * endIndex--);

    // And swap it with the current element.
    tempValue = arr[endIndex];
    arr[endIndex] = arr[currentIndex];
    arr[currentIndex] = tempValue;
  }

  return arr;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
  if (num >= 1 && num <= 100) {
    this.playersGuess = num;
    return this.checkGuess(num);
  } else {
    const errorResponses = {badGuess: "That is an invalid guess."}
    throw errorResponses.badGuess;
  }
}

Game.prototype.checkGuess = function(num) {
  const responses = {
    correct: "You Win!",
    duplicate: "You have already guessed that number.",
    lose: "You Lose.",
    burning: "You're burning up!",
    lukewarm: "You're lukewarm.",
    chilly: "You're a bit chilly.",
    cold: "You're ice cold!"
  };
  if (num === this.winningNumber) {
    return responses.correct;
  } else if (this.pastGuesses.includes(num)) {
    return responses.duplicate;
  } else {
    this.pastGuesses.push(num);
  }

  if (this.pastGuesses.length === 5) {
    return responses.lose;
  } else if (this.difference() < 10) {
    return responses.burning;
  } else if (this.difference() < 25) {
    return responses.lukewarm;
  } else if (this.difference() < 50) {
    return responses.chilly;
  } else {
    return responses.cold;
  }
}

const newGame = () => new Game;

Game.prototype.provideHint = function() {
  const hints = [];
  hints.push(this.winningNumber);
  hints.push(generateWinningNumber());
  hints.push(generateWinningNumber());
  return shuffle(hints);
}
