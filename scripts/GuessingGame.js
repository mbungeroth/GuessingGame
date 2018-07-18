function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
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

function validGuess(num) {
  return num >= 1 && num <= 100;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
  const resultText = document.getElementById('guess-results');
  if (validGuess(num)) {
    this.playersGuess = num;
    resultText.textContent = this.checkGuess(num);
    resultText.style.opacity = 1;
  } else {
    const errorResponses = { badGuess: 'That is an invalid guess.' };
    resultText.textContent = errorResponses.badGuess;
    resultText.style.opacity = 1;
  }
};

Game.prototype.checkGuess = function(num) {
  const guessBox = document.getElementById('guess');
  const responses = {
    correct: 'You Win!',
    duplicate: 'You have already guessed that number.',
    lose: `You Lose. The winning number was ${this.winningNumber}.`,
    burning: "You're burning up!",
    lukewarm: "You're lukewarm.",
    chilly: "You're a bit chilly.",
    cold: "You're ice cold!",
    high: 'Guess higher.',
    low: 'Guess lower.',
  };
  let guessDirection =
    num < this.winningNumber ? responses.high : responses.low;

  if (num === this.winningNumber) {
    this.pastGuesses.push(num);
    guessBox.setAttribute('disabled', true);
    return responses.correct;
  } else if (this.pastGuesses.includes(num)) {
    return responses.duplicate;
  } else {
    this.pastGuesses.push(num);
  }

  let diff = this.difference();
  if (this.pastGuesses.length === 5) {
    guessBox.setAttribute('disabled', true);
    return responses.lose;
  } else if (diff < 10) {
    return `${responses.burning} ${guessDirection}`;
  } else if (diff < 25) {
    return `${responses.lukewarm} ${guessDirection}`;
  } else if (diff < 50) {
    return `${responses.chilly} ${guessDirection}`;
  } else {
    return `${responses.cold} ${guessDirection}`;
  }
};

const newGame = () => new Game();

Game.prototype.provideHint = function() {
  const hints = [];
  hints.push(this.winningNumber);
  hints.push(generateWinningNumber());
  hints.push(generateWinningNumber());
  return shuffle(hints);
};

document.addEventListener('DOMContentLoaded', function() {
  let game = newGame();

  const buttons = {
    go: document.getElementById('submit'),
    reset: document.getElementById('reset'),
    hint: document.getElementById('hint'),
  };

  const textAreas = {
    input: document.getElementById('guess'),
    guesses: document.querySelectorAll('li'),
    guessInfo: document.getElementById('guess-results'),
  };

  const gameBoard = document.querySelector('.container');

  function handleGuess(guess) {
    if (validGuess(guess)) {
      game.playersGuessSubmission(guess);
      textAreas.guesses[game.pastGuesses.length - 1].textContent = guess;
    } else {
      game.playersGuessSubmission(guess);
    }
    textAreas.input.value = '';
  }

  textAreas.input.addEventListener('keypress', function() {
    const acceptableKeys = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      'Enter',
    ];
    if (!acceptableKeys.includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === 'Enter') {
      let guess = Number(event.target.value);
      handleGuess(guess);
    }
  });

  const handleResetClick = function() {
    location.href = './index.html';
  };

  const handleGoClick = function() {
    let guess = Number(textAreas.input.value);
    handleGuess(guess);
  };

  const handleHintClick = function() {
    textAreas.guessInfo.style.opacity = 1;
    const hints = game.provideHint();
    let hintsText = `Look fast! ${hints.join(' ')}`;
    textAreas.guessInfo.textContent = hintsText;
    setTimeout(function() {
      textAreas.guessInfo.style.opacity = 0;
    }, 750);
    buttons.hint.setAttribute('disabled', true);
    buttons.hint.style.boxShadow = 'none';
    buttons.hint.style.color = 'grey';
    buttons.hint.classList.add('no-hover');
  };

  gameBoard.addEventListener('click', function() {
    if (event.target.id === 'submit') {
      handleGoClick();
    } else if (event.target.id === 'reset') {
      handleResetClick();
    } else if (event.target.id === 'hint') {
      handleHintClick();
    }
  });
});
