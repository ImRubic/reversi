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
  * Cycles through the entire board to see if any moves can be made with the player's piece.
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
    * Checks all 8 directions of the piece if a move can be made.
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

  /** @function checkR
    * A recursive funciton that determines how many pieces in the given directions
    * need to be changed.
    */
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
      if(square.classList[1] !== 'highlight') {
        square.classList.add('highlight');
        if(state.turn === 'b') square.classList.add('highlight-b');
        else square.classList.add('highlight-w');
        square.onclick = handleHighlightClick;
        state.captures['h']++;
        return 1;
      }

    }
    return 0;
  }

/** @function applyMove
  * Determines what direction the moves need to make and adds the player's peice.
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

  //Adds a piece to the board
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

/** @function applyR
  * Recursive funciton to determine how far in a given direction pieces need to change.
  * Changes the pieces.
  */
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
      var discs = document.getElementById("discs-" + x + "-" + y);
      discs.classList.remove('discs-' + opp);
      discs.classList.add('discs-' + piece);

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
  var turn = document.getElementById('turn-text');
  //If no more pieces can be played.
  if(state.captures['g'] == 0) {
    turn.style.color = "Yellow";
    state.over = true;
    if(state.captures.b > state.captures.w) turn.textContent = "Black Wins!";
    else turn.textContent = "White Wins!";
    return "game over";
  }
  //If a player can no long play any more pieces.
  else if(state.captures['h'] == 0) {
    turn.style.color = "Yellow";
    state.over = true;
    if(state.turn === 'w') turn.textContent = "Black Wins!";
    else turn.textContent = "White Wins!";
    return "game over";
  }
  return null;
}

/** @function nextTurn()
  * Starts the next turn by changing the
  * turn property of state.
  */
function nextTurn() {

  //Changing Scoreboard elements
  var turn = document.getElementById('turn-text');
  var number = document.getElementById('score-b');
  var number2 = document.getElementById('score-w');
  number.textContent = "Black: " + state.captures.b;
  number2.textContent = "White: " + state.captures.w;

  //Changing Turn
  if(state.turn === 'b') {
    state.turn = 'w';
    turn.textContent = "White's Turn";
  }
  else {
  state.turn = 'b';
  turn.textContent = "Black's Turn";
  }
}

/** @function clearHighlights
  * Clears all highligted squares
  */
function clearHighlights() {
  var highlighted = document.querySelectorAll('.highlight');
  highlighted.forEach(function(square){
    square.classList.remove('highlight');
    if(state.turn === 'b') square.classList.remove('highlight-b');
    else square.classList.remove('highlight-w');
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

  //Creates Scoreboard
  var score = document.createElement('section');
  score.id = 'score-board';
  document.body.appendChild(score);

  var turn = document.createElement('div');
  turn.id = 'turn-text';
  turn.classList.add('turn-text');
  turn.textContent = "Black's Turn";
  score.appendChild(turn);

  var number = document.createElement('div');
  number.id = 'score-b';
  number.classList.add('score-b');
  document.body.appendChild(score);
  number.textContent = "Black: " + state.captures.b;
  score.appendChild(number);

  var number2 = document.createElement('div');
  number2.id = 'score-w';
  number2.classList.add('score-w');
  document.body.appendChild(score);
  number2.textContent = "White: " + state.captures.w;
  score.appendChild(number2);


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


  //Checks the initial legal moves.
  getLegalMoves(state.turn);
}

setup();
