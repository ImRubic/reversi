var state = {
  over: false,
  turn: 'b',
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'w', 'b', null, null, null],
    [null, null, null, 'b', 'w', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ],
  captures: {w: 2, b: 2, g: 60, h: 0}
}

/** @function getLegalMoves
  * returns a list of legal moves for the specified
  * piece to make.
  */
  function getLegalMoves(piece) {
    var opp;
    if(piece == 'b') opp = 'w';
    else opp = 'b';

    for(var y = 0; y < state.board.length; y++){
      for(var x = 0; x < state.board[y].length; x++){
        if(state.board[y][x] == piece) {
          checkMove(x, y, piece, opp);
        }
      }
    }
  }

  /** @function checkMove
    * A function to apply the selected move to the game
    * @param {object} move - the move to apply.
    */
  function checkMove(x, y, piece, opp) {
    //Checks to see if the spot being checked is on the board.
    //Checks 8 directions.
    var max = state.board.length;
    var min = -1;

    for(var i = 1; i > -2; i--) {
      for(var j = 1; j > -2; j--) {
        if(x+i < max && x+i > min && y+j < max && y+j > min && state.board[y+j][x+i] == opp) {
          checkR(x, y, j, i, piece, opp);
        }
      }
    }

  }

  function checkR(x, y, a, b, piece, opp) {
    var max = state.board.length;
    var min = -1;
    //Checks to see if the next piece needs changing.
    if(x+b < max && x+b > min && y+a < max && y+a > min && state.board[y+a][x+b] == opp) {
      if (checkR(x+b, y+a, a, b, piece, opp) == 1) {
        return 1;
      }
    }
    //Checks to see if the next piece is the final piece
    else if(x+b < max && x+b > min && y+a < max && y+a > min && state.board[y+a][x+b] == null) {
      //Highlight Square
      var square = document.getElementById('square-' + (x+b) + '-' + (y+a));
      //Check to see if it's already highlighted
      if(square.classList.value !== 'square highlight') {
        square.classList.add('highlight');
        square.onclick = handleHighlightClick;
        state.captures['h']++;
        return 1;
      }

    }
    return 0;
  }

/** @function applyMove
  * A function to apply the selected move to the game
  * @param {object} move - the move to apply.
  */
function applyMove(x, y, piece) {
  var opp;
  if(piece == 'b') opp = 'w';
  else opp = 'b';

  var max = state.board.length;
  var min = -1;

  for(var i = 1; i > -2; i--) {
    for(var j = 1; j > -2; j--) {
      if(x+i < max && x+i > min && y+j < max && y+j > min && state.board[y+j][x+i] == opp) {
        applyR(x, y, j, i, piece, opp);
      }
    }
  }

  state.board[y][x] = piece;
  var square = document.getElementById("square-" + x + "-" + y);
  var discs = document.createElement('div');
  discs.id = "discs-" + x + "-" + y;
  discs.classList.add('discs');
  discs.classList.add('discs-' + state.board[y][x]);
  square.appendChild(discs);
  state.captures[piece.substring(0,1)]++;
  state.captures['g']--;
}

function applyR(x, y, a, b, piece, opp) {
  var max = state.board.length;
  var min = -1;

  //Checks if the next piece in the direction provided by a & b needs to be changed.
  if(x+b < max && x+b > min && y+a < max && y+a > min && state.board[y+a][x+b] == opp) {
    x += b;
    y += a;
    //Recursively calls function until all pieces are changed.
    if (applyR(x, y, a, b, piece, opp) == 1) {
      //Changes piece type
      state.board[y][x] = piece;

      //Changes piece information
      var square = document.getElementById("square-" + x + "-" + y);
      var elem = document.getElementById("discs-" + x + "-" + y);
      if (elem !== null) elem.parentNode.removeChild(elem);
      var discs = document.createElement('div');
      discs.id = "discs-" + x + "-" + y;
      discs.classList.add('discs');
      discs.classList.add('discs-' + state.board[y][x]);
      square.appendChild(discs);

      state.captures[piece.substring(0,1)]++;
      state.captures[opp.substring(0,1)]--;
      return 1;
    }
  }
  //Checks if the next piece in the direction is the final piece
  else if(x+b < max && x+b > min && y+a < max && y+a > min && state.board[y+a][x+b] == piece) {
    return 1;
  }
  return 0;
}


function checkForVictory() {
  //If no more pieces can be played or a piece's turn can't continue, game ends.
  if(state.captures['g'] == 0 || state.captures['h'] == 0) {
    score = document.getElementById('score-board');
    score.style.color = "Yellow";
    state.over = true;
    if(state.captures.b > state.captures.w) {
      score.textContent = "Black Wins!";
    }
    else {
      score.textContent = "White Wins!";
    }
    return "game over";
  }
  return null;
}

/** @function nextTurn()
  * Starts the next turn by changing the
  * turn property of state.
  */
function nextTurn() {
  score = document.getElementById('score-board');
  if(state.turn === 'b') {
    state.turn = 'w';
    score.textContent = "White's Turn";
  }
  else {
  state.turn = 'b';
  score.textContent = "Black's Turn";
  }
}

/** @function clearHighlights
  * Clears all highligted squares
  */
function clearHighlights() {
  var highlighted = document.querySelectorAll('.highlight');
  highlighted.forEach(function(square){
    square.classList.remove('highlight');
    state.captures['h']--;
  });
}


/** @function handleHighlightClick
  * Click handler for checker
  */
function handleHighlightClick(event) {
  event.preventDefault();
  var id = event.target.id;
  var bool = false;

  var highlighted = document.querySelectorAll('.highlight');
  highlighted.forEach(function(square){
    if(square.id == id) {
      bool = true;
    }
  });

  if(!bool) return;

  var x = parseInt(id.charAt(7));
  var y = parseInt(id.charAt(9));
  var piece = state.turn;

  // Returns bool value to confirm changing discs.
  applyMove(x, y, piece);

  // Clear old highlights
  clearHighlights();

  //Chanegs turns
  nextTurn();
  // Get legal moves
  getLegalMoves(state.turn);
  if (checkForVictory()) return;
}



/** @function setup
  * Sets up the game environment
  */
function setup() {
  //Create board
  var board = document.createElement('section');
  board.id = 'game-board';
  document.body.appendChild(board);

  //Create tiles/squares on board.
  for(var y = 0; y < state.board.length; y++){
    for(var x = 0; x < state.board[y].length; x++){
      var square = document.createElement('div');
      square.id = "square-" + x + "-" + y;
      square.classList.add('square');
      board.appendChild(square);

      //Places the 4 initial pieces on the board.
      if(state.board[y][x]) {
        var discs = document.createElement('div');
        discs.id = "discs-" + x + "-" + y;
        discs.classList.add('discs');
        discs.classList.add('discs-' + state.board[y][x]);
        square.appendChild(discs);
      }

    }
  }

  //Creates Scoreboard
  var score = document.createElement('section');
  score.id = 'score-board';
  document.body.appendChild(score);
  score.textContent = "Black's Turn";
  score.style.fontSize = "40px";

  //Checks the initial legal moves.
  getLegalMoves(state.turn);
}

setup();
