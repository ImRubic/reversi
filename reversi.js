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
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings.
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
  * @returns {Array} the legal moves as an array of objects.
  */
  function getLegalMoves(piece) {
    //TODO: Change
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

    if(x < 8 && x > -1 && y-1 < 8 && y-1 > -1 && state.board[y-1][x] == opp) {
      var a = -1;
      var b = 0;
      checkR(x, y, a, b, piece, opp);
    }
    if(x < 8 && x > -1 && y+1 < 8 && y+1 > -1 && state.board[y+1][x] == opp) {
      var a = 1;
      var b = 0;
      checkR(x, y, a, b, piece, opp);
    }
    if(x+1 < 8 && x+1 > -1 && y < 8 && y > -1 && state.board[y][x+1] == opp) {
      var a = 0;
      var b = 1;
      checkR(x, y, a, b, piece, opp);
    }
    if(x-1 < 8 && x-1 > -1 && y < 8 && y > -1 && state.board[y][x-1] == opp) {
      var a = 0;
      var b = -1;
      checkR(x, y, a, b, piece, opp);
    }
    if(x+1 < 8 && x+1 > -1 && y-1 < 8 && y-1 > -1 && state.board[y-1][x+1] == opp) {
      var a = -1;
      var b = 1;
      checkR(x, y, a, b, piece, opp);
    }
    if(x-1 < 8 && x-1 > -1 && y-1 < 8 && y-1 > -1 && state.board[y-1][x-1] == opp) {
      var a = -1;
      var b = -1;
      checkR(x, y, a, b, piece, opp);
    }
    if(x+1 < 8 && x+1 > -1 && y+1 < 8 && y+1 > -1 && state.board[y+1][x+1] == opp) {
      var a = 1;
      var b = 1;
      checkR(x, y, a, b, piece, opp);
    }
    if(x-1 < 8 && x-1 > -1 && y+1 < 8 && y+1 > -1 && state.board[y+1][x-1] == opp) {
      var a = 1;
      var b = -1;
      checkR(x, y, a, b, piece, opp);
    }
  }

  function checkR(x, y, a, b, piece, opp) {
    if((x+b) < 8 && (x+b) > -1 && (y+a) < 8 && (y+a) > -1 && state.board[y+a][x+b] == opp) {
      x = x+b;
      y = y+a;

      if (checkR(x, y, a, b, piece, opp) == 1) {
        return 1;
      }
    }
    else if((x+b) < 8 && (x+b) > -1 && (y+a) < 8 && (y+a) > -1 && state.board[y+a][x+b] == null) {
      var square = document.getElementById('square-' + (x+b) + '-' + (y+a));
      square.classList.add('highlight');
      square.onclick = handleHighlightClick;
      state.captures['h']++;
      return 1;
    }
    return 0;
  }

/** @function applyMove
  * A function to apply the selected move to the game
  * @param {object} move - the move to apply.
  */
function applyMove(x, y, piece) {
  // TODO: Apply the move
  var opp;
  if(piece == 'b') opp = 'w';
  else opp = 'b';

  if(x < 8 && x > -1 && y-1 < 8 && y-1 > -1 && state.board[y-1][x] == opp) {
    var a = -1;
    var b = 0;
    applyR(x, y, a, b, piece, opp);
  }
  if(x < 8 && x > -1 && y+1 < 8 && y+1 > -1 && state.board[y+1][x] == opp) {
    var a = 1;
    var b = 0;
    applyR(x, y, a, b, piece, opp);
  }
  if(x+1 < 8 && x+1 > -1 && y < 8 && y > -1 && state.board[y][x+1] == opp) {
    var a = 0;
    var b = 1;
    applyR(x, y, a, b, piece, opp);
  }
  if(x-1 < 8 && x-1 > -1 && y < 8 && y > -1 && state.board[y][x-1] == opp) {
    var a = 0;
    var b = -1;
    applyR(x, y, a, b, piece, opp);
  }
  if(x+1 < 8 && x+1 > -1 && y-1 < 8 && y-1 > -1 && state.board[y-1][x+1] == opp) {
    var a = -1;
    var b = 1;
    applyR(x, y, a, b, piece, opp);
  }
  if(x-1 < 8 && x-1 > -1 && y-1 < 8 && y-1 > -1 && state.board[y-1][x-1] == opp) {
    var a = -1;
    var b = -1;
    applyR(x, y, a, b, piece, opp);
  }
  if(x+1 < 8 && x+1 > -1 && y+1 < 8 && y+1 > -1 && state.board[y+1][x+1] == opp) {
    var a = 1;
    var b = 1;
    applyR(x, y, a, b, piece, opp);
  }
  if(x-1 < 8 && x-1 > -1 && y+1 < 8 && y+1 > -1 && state.board[y+1][x-1] == opp) {
    var a = 1;
    var b = -1;
    applyR(x, y, a, b, piece, opp);
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
  if((x+b) < 8 && (x+b) > -1 && (y+a) < 8 && (y+a) > -1 && state.board[y+a][x+b] == opp) {
    x = x+b;
    y = y+a;

    if (applyR(x, y, a, b, piece, opp) == 1) {
      state.board[y][x] = piece;

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
  else if((x+b) < 8 && (x+b) > -1 && (y+a) < 8 && (y+a) > -1 && state.board[y+a][x+b] == piece) {
    if(state.board[y][x] == piece) return 0;
    return 1;
  }
  return 0;
}


function checkForVictory() {
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
  //TODO: Add cases where one player can't play.
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

  // TODO: Call function that recursively calls 8 directions
  // Returns bool value to confirm changing discs.
  applyMove(x, y, piece);

  // Clear old highlights
  clearHighlights();
  //TODO: Change turn, check Victory, and check LegalMoves of opp.
  nextTurn();
  // Get legal moves
  getLegalMoves(state.turn);
  if (checkForVictory()) return;
}



/** @function setup
  * Sets up the game environment
  */
function setup() {
  var board = document.createElement('section');
  board.id = 'game-board';
  document.body.appendChild(board);
  for(var y = 0; y < state.board.length; y++){
    for(var x = 0; x < state.board[y].length; x++){
      var square = document.createElement('div');
      square.id = "square-" + x + "-" + y;
      square.classList.add('square');
      //TODO: Click highlight squre.
      //square.onclick = handleHighlightClick;
      board.appendChild(square);
      if(state.board[y][x]) {
        var discs = document.createElement('div');
        discs.id = "discs-" + x + "-" + y;
        discs.classList.add('discs');
        discs.classList.add('discs-' + state.board[y][x]);
        square.appendChild(discs);
      }
    }
  }
  var score = document.createElement('section');
  score.id = 'score-board';
  document.body.appendChild(score);
  score.textContent = "Black's Turn";
  score.style.fontSize = "40px";

  getLegalMoves(state.turn);
}

setup();
