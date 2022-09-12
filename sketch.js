//images
var wpawnImg;
var bpawnImg;
var wbishopImg;
var bbishopImg;
var wknightImg;
var bknightImg;
var wrookImg;
var brookImg;
var wqueenImg;
var bqueenImg;
var wkingImg;
var bkingImg;

var tileLen;
var turn = "w";
let boardLayout = [[],[],[],[],[],[],[],[]];
let defaultLayout = [[],[],[],[],[],[],[],[]];
let eligibleMoves = [[],[],[],[],[],[],[],[]];
let blackAttacking = [[],[],[],[],[],[],[],[]];
let whiteAttacking = [[],[],[],[],[],[],[],[]];
let alt = [[],[],[],[],[],[],[],[]];
var allowClick = false;
var check = false;
var stale = false;
var end = false;
var thing = false;
var x = 0;
var y = 0;
//variables to set screen
var play = false;
var base = true;
var layout = false;

//variables to select pieces for layout screen
var pawncursor = false;
var bishopcursor = false;
var knightcursor = false;
var rookcursor = false;
var queencursor = false;
var kingcursor = false;

//variables for button colors
var topcolor = "green";
var midcolor = "yellow";
var botcolor = "red";

//variables for piece values
var total = 0;
var pawnvalue = 1;
var bishopvalue = 3;
var knightvalue = 3;
var rookvalue = 5;
var queenvalue = 9;
var hasKing = false;
var multiKing = false;
var val;

//variables to change colors
var lightSquares = "#B5651D";
var darkSquares = "#654321";
var moveSquares = "yellow";
var startSquare = "blue";
var backgroundColor = "#A9A9A9";
// var backgroundColor = "black";

//variables to store the starting place for the clicked piece
var startColumn = null;
var startRow = null;
var altColumn = null;
var altRow = null;

function preload() {
  wpawnImg = loadImage("pieces/whitepawn.png");
  bpawnImg = loadImage("pieces/blackpawn.png");
  wbishopImg = loadImage("pieces/whitebishop.png");
  bbishopImg = loadImage("pieces/blackbishop.png");
  wknightImg = loadImage("pieces/whiteknight.png");
  bknightImg = loadImage("pieces/blackknight.png");
  wrookImg = loadImage("pieces/whiterook.png");
  brookImg = loadImage("pieces/blackrook.png");
  wqueenImg = loadImage("pieces/whitequeen.png");
  bqueenImg = loadImage("pieces/blackqueen.png");
  wkingImg = loadImage("pieces/whiteking.png");
  bkingImg = loadImage("pieces/blackking.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(backgroundColor);
  tileLen = height/16;
  rectMode(CORNER);
  boardSetup();
  makeButtons();
}

function boardSetup() {
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(row == 1) {
        boardLayout[column][row] = "bpawn";
      }
      else if(row == 6) {
        boardLayout[column][row] = "wpawn";
      }
      else if(row == 0 && (column == 2 || column == 5)) {
        boardLayout[column][row] = "bbishop";
      }
      else if(row == 7 && (column == 2 || column == 5)) {
        boardLayout[column][row] = "wbishop";
      }
      else if(row == 0 && (column == 1 || column == 6)) {
        boardLayout[column][row] = "bknight";
      }
      else if(row == 7 && (column == 1 || column == 6)) {
        boardLayout[column][row] = "wknight";
      }
      else if(row == 0 && (column == 0 || column == 7)) {
        boardLayout[column][row] = "brook";
      }
      else if(row == 7 && (column == 0 || column == 7)) {
        boardLayout[column][row] = "wrook";
      }
      else if(row == 0 && column == 3) {
        boardLayout[column][row] = "bqueen";
      }
      else if(row == 7 && column == 3) {
        boardLayout[column][row] = "wqueen";
      }
      else if(row == 0 && column == 4) {
        boardLayout[column][row] = "bking";
      }
      else if(row == 7 && column == 4) {
        boardLayout[column][row] = "wking";
      }
      else
        boardLayout[column][row] = null;
    }
  }
}

function tileColor(column, row) {
  if(startColumn != null && startRow != null && startColumn == column && startRow == row) {
    fill(startSquare);
  } else if(eligibleMoves[column][row] == true) {
    fill(moveSquares);
  } else if(layout && row >= 5) {
    if(row == 5) {
      fill(topcolor);
    } else if(row == 6) {
      fill(midcolor);
    } else if(row == 7) {
      fill(botcolor);
    }
  }
  else {
    if(column % 2 == 0 ^ row % 2 == 1) {
      fill(lightSquares);
    }
    else {
      fill(darkSquares);
    }
  }
}

function draw() {
  background(backgroundColor);
  if(base) {
    drawBase();
  } else if(layout) {
    drawLayout();
  } else if(play) {
    drawPlay();
  }
}

function drawPlay() {
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      tileColor(column, row);
      rect(column*tileLen + ((width/2)-height/4), row*tileLen + height/4, tileLen, tileLen);
      if(boardLayout[column][row] != null ) {
        makePiece(column, row);
      }
    }
  }
}

function drawBase() {
  textSize(50);
  fill(0);
  textAlign(CENTER);
  text("Extra Chess", width/2, height/8);
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      tileColor(column, row);
      rect(column*tileLen + ((width/2)-height/4), row*tileLen + height/4, tileLen, tileLen);
      if(boardLayout[column][row] != null && row >= 5) {
        makePiece(column, row);
      }
    }
  }
}

function drawLayout() {
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      tileColor(column, row);
      rect(column*tileLen + ((width/2)-height/4), row*tileLen + height/4, tileLen, tileLen);
      if(boardLayout[column][row] != null && row >= 5) {
        makePiece(column, row);
      }
    }
  }
  textSize(20);
  fill(0);
  textAlign(CENTER);
  text("Total Value: " + total, width/2, height/6);
}

function playTrue() {
  for(var x = 0; x < 8; x++) {
    for(var y = 0; y < 8; y++) {
      defaultLayout[x][y] = boardLayout[x][y];
    }
  }
  resetCursor();
  allowClick = true;
  hidePieceButtons();
  playbutton.hide();
  homebutton.show();
  resetbutton.hide();
  play = true;
  base = false;
  layout = false;
}

function layoutTrue() {
  boardCheck();
  resetCursor();
  showPieceButtons();
  layoutbutton.hide();
  playbutton.hide();
  homebutton.show();
  resetbutton.show();
  play = false;
  base = false;
  layout = true;
}

function baseTrue() {
  if(play == true) {
    for(var x = 0; x < 8; x++) {
      for(var y = 0; y < 8; y++) {
        boardLayout[x][y] = defaultLayout[x][y];
      }
    }
  } else if(layout == true) {
    for(var x = 0; x < 8; x++) {
      for(var y = 0; y < 8; y++) {
        defaultLayout[x][y] = boardLayout[x][y];
      }
    }
  }
  resetCursor();
  hidePieceButtons();
  layoutbutton.show();
  playbutton.show();
  homebutton.hide();
  resetbutton.hide();
  play = false;
  base = true;
  layout = false;
}

function getPieceValue(col, row) {
  if(checkPiece(col, row) == "pawn") {
    total += 1;
  } else if(checkPiece(col, row) == "bishop" || checkPiece(col, row) == "knight") {
    total += 3;
  } else if(checkPiece(col, row) == "rook") {
    total += 5;
  } else if(checkPiece(col, row) == "queen") {
    total += 9;
  } else if(checkPiece(col, row) == "king") {
    if(hasKing == true) {
      multiKing = true;
    } else {
      hasKing = true;
    }
  }
}

function boardCheck() {
  val = total;
  total = 0;
  hasKing = false;
  multiKing = false;
  for(var col = 0; col < 8; col++) {
    for(var row = 0; row < 8; row++) {
      if(row >= 5) {
        getPieceValue(col, row);
      }
    }
  }
}

function checkTotal(piece, column, row) {
  var check = boardLayout[column][row];
  boardLayout[column][row] = piece;
  boardCheck();
  kingCheck();
  boardLayout[column][row] = check;
  if(total > 39) {
    total = val;
    return false;
  }
  return true;
}

function kingCheck() {
  if(hasKing && !multiKing) {
    for(var column = 0; column < 8; column++) {
      for(var row = 0; row < 8; row++) {
        if(checkPiece(column, row) == "king" && checkColor(column, row) == "w") {
          if(column - 1 >= 8 || boardLayout[column - 1][row - 1] != null) {
            if(boardLayout[column][row - 1] != null) {
              if(column + 1 >= 8 || boardLayout[column + 1][row - 1] != null) {
                homebutton.show();
                return;
              }
            }
          }
        }
      }
    }
  } else {
    homebutton.hide();
  }
}

function resetBoard() {
  for(var x = 0; x < 8; x++) {
    for(var y = 0; y < 8; y++) {
      if (y >= 5) {
        boardLayout[x][y] = null;
      }
    }
  }
  homebutton.hide();
  boardCheck();
}

function makeButtons() {
  playbutton = createButton("Play");
  playbutton.position(width/2, 5*(height/6));
  playbutton.size(tileLen*1.5, tileLen);
  playbutton.center('horizontal');
  playbutton.mouseClicked(playTrue);
  layoutbutton = createButton("Layout");
  layoutbutton.position(width/2 - tileLen*2, height/5.5);
  layoutbutton.size(tileLen*1.5, tileLen);
  layoutbutton.mouseClicked(layoutTrue);
  homebutton = createButton("Home");
  homebutton.position(width/2 + tileLen, height/5.5);
  homebutton.size(tileLen*1.5, tileLen);
  homebutton.mouseClicked(baseTrue);
  homebutton.hide();
  resetbutton = createButton("Reset");
  resetbutton.position(width/2, height/5.5);
  resetbutton.size(tileLen*1.5, tileLen);
  resetbutton.center('horizontal');
  resetbutton.mouseClicked(resetBoard);
  resetbutton.hide();
  pawnbutton = createImg("pieces/whitepawn.png");
  pawnbutton.position(0*tileLen + ((width/2)-height/4), 9*tileLen + height/4);
  pawnbutton.size(tileLen, tileLen);
  pawnbutton.style('background-color', topcolor);
  pawnbutton.mouseClicked(pawnCursor);
  pawnbutton.hide();
  bishopbutton = createImg("pieces/whitebishop.png");
  bishopbutton.position(1*tileLen + ((width/2)-height/4), 9*tileLen + height/4);
  bishopbutton.size(tileLen, tileLen);
  bishopbutton.mouseClicked(bishopCursor);
  bishopbutton.style('background-color', midcolor);
  bishopbutton.hide();
  knightbutton = createImg("pieces/whiteknight.png");
  knightbutton.position(2*tileLen + ((width/2)-height/4), 9*tileLen + height/4);
  knightbutton.size(tileLen, tileLen);
  knightbutton.mouseClicked(knightCursor);
  knightbutton.style('background-color', midcolor);
  knightbutton.hide();
  rookbutton = createImg("pieces/whiterook.png");
  rookbutton.position(3*tileLen + ((width/2)-height/4), 9*tileLen + height/4);
  rookbutton.size(tileLen, tileLen);
  rookbutton.mouseClicked(rookCursor);
  rookbutton.style('background-color', botcolor);
  rookbutton.hide();
  queenbutton = createImg("pieces/whitequeen.png");
  queenbutton.position(4*tileLen + ((width/2)-height/4), 9*tileLen + height/4);
  queenbutton.size(tileLen, tileLen);
  queenbutton.mouseClicked(queenCursor);
  queenbutton.style('background-color', botcolor);
  queenbutton.hide();
  kingbutton = createImg("pieces/whiteking.png");
  kingbutton.position(5*tileLen + ((width/2)-height/4), 9*tileLen + height/4);
  kingbutton.size(tileLen, tileLen);
  kingbutton.mouseClicked(kingCursor);
  kingbutton.style('background-color', botcolor);
  kingbutton.hide();
}

function showPieceButtons() {
  pawnbutton.show();
  bishopbutton.show();
  knightbutton.show();
  rookbutton.show();
  queenbutton.show();
  kingbutton.show();
}

function hidePieceButtons() {
  pawnbutton.hide();
  bishopbutton.hide();
  knightbutton.hide();
  rookbutton.hide();
  queenbutton.hide();
  kingbutton.hide();
}

function checkCursor() {
  if(pawncursor == true) {
    return "pawncursor";
  } else if(bishopcursor == true) {
    return "bishopcursor";
  } else if(knightcursor == true) {
    return "knightcursor";
  } else if(rookcursor == true) {
    return "rookcursor";
  } else if(queencursor == true) {
    return "queencursor";
  } else if(kingcursor == true) {
    return "kingcursor";
  }
}

function resetCursor() {
  cursor(ARROW);
  pawncursor = false;
  bishopcursor = false;
  knightcursor = false;
  rookcursor = false;
  queencursor = false;
  kingcursor = false;
}

function pawnCursor() {
  if(pawncursor == true) {
    cursor(ARROW);
    pawncursor = false;
  } else {
    resetCursor();
    cursor("pieces/whitepawn.png", 32, 32);
    pawncursor = true;
  }
}

function bishopCursor() {
  if(bishopcursor == true) {
    cursor(ARROW);
    bishopcursor = false;
  } else {
    resetCursor();
    cursor("pieces/whitebishop.png", 32, 32);
    bishopcursor = true;
  }
}

function knightCursor() {
  if(knightcursor == true) {
    cursor(ARROW);
    knightcursor = false;
  } else {
    resetCursor();
    cursor("pieces/whiteknight.png", 32, 32);
    knightcursor = true;
  }
}

function rookCursor() {
  if(rookcursor == true) {
    cursor(ARROW);
    rookcursor = false;
  } else {
    resetCursor();
    cursor("pieces/whiterook.png", 32, 32);
    rookcursor = true;
  }
}

function queenCursor() {
  if(queencursor == true) {
    cursor(ARROW);
    queencursor = false;
  } else {
    resetCursor();
    cursor("pieces/whitequeen.png", 32, 32);
    queencursor = true;
  }
}

function kingCursor() {
  if(kingcursor == true) {
    cursor(ARROW);
    kingcursor = false;
  } else {
    resetCursor();
    cursor("pieces/whiteking.png", 32, 32);
    kingcursor = true;
  }
}

// function setCookie(name,value,exp_days) {
//   var d = new Date();
//   d.setTime(d.getTime() + (exp_days*24*60*60*1000));
//   var expires = "expires=" + d.toGMTString();
//   document.cookie = boardLayout;
// }

function mouseClicked() {
  if(layout) {
    for(var column = 0; column < 8; column++) {
      for(var row = 0; row < 8; row++) {
        if(row >= 5 && overSquare(column, row)) {
          if(checkCursor() == "pawncursor") {
            if(checkTotal("wpawn", column, row)) {
              boardLayout[column][row] = "wpawn";
            }
          } else if(checkCursor() == "bishopcursor") {
            if(checkTotal("wbishop", column, row)) {
              if(row >= 6) {
                boardLayout[column][row] = "wbishop";
              }
            }
          } else if(checkCursor() == "knightcursor") {
            if(checkTotal("wknight", column, row)) {
              if(row >= 6) {
                boardLayout[column][row] = "wknight";
              }
            }
          } else if(checkCursor() == "rookcursor") {
            if(checkTotal("wrook", column, row)) {
              if(row == 7) {
                boardLayout[column][row] = "wrook";
              }
            }
          } else if(checkCursor() == "queencursor") {
            if(checkTotal("wqueen", column, row)) {
              if(row == 7) {
                boardLayout[column][row] = "wqueen";
              }
            }
          } else if(checkCursor() == "kingcursor") {
            if(checkTotal("wking", column, row)) {
              if(row == 7) {
                boardLayout[column][row] = "wking";
              }
            }
          }
        }
        boardCheck();
      }
    }
  }
  if(allowClick) {
    var backgroundClicked = true;
    for(var column = 0; column < 8; column++) {
      for(var row = 0; row < 8; row++) {
        if(overSquare(column, row)) {
          backgroundClicked = false;
          if(eligibleMoves[column][row] != null) {
            movePiece(column, row);
            changeTurn();
            if(gameEnd()) {
              allowClick = false;
            }
            resetVars();
            return;
          }
          else {
            eligibleMoves = [[],[],[],[],[],[],[],[]];
            resetVars();
            if(checkColor(column, row) != turn) {
              return;
            }
            if(boardLayout[column][row] != null) {
              startColumn = column;
              startRow = row;
              moveAll(column, row);
              return;
            }
          }
        }
      }
    }
    if(backgroundClicked) {
      eligibleMoves = [[],[],[],[],[],[],[],[]];
      resetVars();
    }
  }
}

function makePiece(column, row) {
  if(checkPiece(column, row) == "pawn") {
    makePawn(column, row);
  }
  else if(checkPiece(column, row) == "bishop") {
    makeBishop(column, row);
  }
  else if(checkPiece(column, row) == "knight") {
    makeKnight(column, row);
  }
  else if(checkPiece(column, row) == "rook") {
    makeRook(column, row);
  }
  else if(checkPiece(column, row) == "queen") {
    makeQueen(column, row);
  }
  else if(checkPiece(column, row) == "king") {
    makeKing(column, row);
  }
}

function checkPiece(column, row) {
  if(boardLayout[column][row] != null) {
    if(boardLayout[column][row].substring(1) == "pawn") {
      return "pawn";
    }
    if(boardLayout[column][row].substring(1) == "bishop") {
      return "bishop";
    }
    if(boardLayout[column][row].substring(1) == "knight") {
      return "knight";
    }
    if(boardLayout[column][row].substring(1) == "rook") {
      return "rook";
    }
    if(boardLayout[column][row].substring(1) == "queen") {
      return "queen";
    }
    if(boardLayout[column][row].substring(1) == "king") {
      return "king";
    }
  }
}
//problem is startColumn and startRow are undefined.
function checkColor(column, row) {
  if(boardLayout[column][row] != null && boardLayout[column][row].charAt(0) == "w") {
    return "w";
  }
  else if(boardLayout[column][row] != null && boardLayout[column][row].charAt(0) == "b") {
    return "b";
  }
  else {
    return null;
  }
}

function movePiece(column, row) {
  boardLayout[column][row] = boardLayout[startColumn][startRow];
  boardLayout[startColumn][startRow] = null;
  checkPromotion(column, row);
  eligibleMoves = [[],[],[],[],[],[],[],[]];
  resetVars();
}

function whiteAttacks() {
  check = true;
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(checkColor(column, row) == "w") {
        moveAll(column, row);
      }
    }
  }
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(alt[column][row]) {
        whiteAttacking[column][row] = alt[column][row];
      }
    }
  }
  alt = [[],[],[],[],[],[],[],[]];
  check = false;
}
//change whiteAttacks to thsi format
function blackAttacks() {
  check = true;
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(checkColor(column, row) == "b") {      
        moveAll(column, row);
      }
    }
  }
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(alt[column][row]) {
        blackAttacking[column][row] = alt[column][row];
      }
    }
  }
  alt = [[],[],[],[],[],[],[],[]];
  check = false;
}

function whiteCheck() {
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(checkPiece(column, row) == "king" && checkColor(column, row) == "w") {
        if(blackAttacking[column][row]) {
          return true;
        }
      }
    }
  }
  return false;
}

function blackCheck() {
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(checkPiece(column, row) == "king" && checkColor(column, row) == "b") {
        if(whiteAttacking[column][row]) {
          return true;
        }
      }
    }
  }
  return false;
}
//this works
function checkPinned(column, row) {
  var split = false;
  var pieceStart = boardLayout[column][row];
  boardLayout[column][row] = boardLayout[startColumn][startRow];
  boardLayout[startColumn][startRow] = null;
  if(checkColor(column, row) == "w") {
    blackAttacks();
    if(whiteCheck()) {
      split = true;
    }
  }
  else if(checkColor(column, row) == "b") {
    whiteAttacks();
    if(blackCheck()) {
      split = true;
    }
  }
  blackAttacking = [[],[],[],[],[],[],[],[]];
  whiteAttacking = [[],[],[],[],[],[],[],[]];
  boardLayout[startColumn][startRow] = boardLayout[column][row];
  boardLayout[column][row] = pieceStart;
  return split;
}
//checks if the game is over
function gameEnd() {
  if(mateCheck()) {
    console.log('checkmate');
    return true;
  }
  if(stale) {
    console.log('stalemate');
    return true;
  }
  return false;
}
//checks if the game is over via checkmate
function mateCheck() {
  if(stalemateCheck()){
    stale = true;
    end = true;
    if (turn == "w") {
      blackAttacks();
    } 
    else if (turn == "b") {
      whiteAttacks();
    }
    if(whiteCheck()) {
      return true;
    }
    if(blackCheck()) {
      return true;
    }
  }
  return false;
}
//checks if the game is over via stalemate
function stalemateCheck() {
  thing = true;
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(checkColor(column, row) == turn) {
        moveAll(column, row);
      }
    }
  }
  for(var column = 0; column < 8; column++) {
    for(var row = 0; row < 8; row++) {
      if(eligibleMoves[column][row]) {
        thing = false;
      }
    }
  }
  eligibleMoves = [[],[],[],[],[],[],[],[]];
  resetVars();
  return thing;
}

function moveAll(column, row) {
  if(!check || end) {
    startColumn = column;
    startRow = row;
  }
  if(checkPiece(column, row) == "pawn") {
    pawnMove(column, row);
  }
  else if(checkPiece(column, row) == "bishop") {
    bishopMove(column, row);
  }
  else if(checkPiece(column, row) == "knight") {
    knightMove(column, row);
  }
  else if(checkPiece(column, row) == "rook") {
    rookMove(column, row);
  }
  else if(checkPiece(column, row) == "queen") {
    queenMove(column, row);
  }
  else if(checkPiece(column, row) == "king") {
    kingMove(column, row);
  }
}

function repetitionCheck() {

}

function insufficiencyCheck() {

}

function fiftyCheck() {

}

function inBounds(column, row) {
  if(column >= 0 && column <= 7 && row >= 0 && row <= 7) {
    return true;
  }
  else {
    return false;
  }
}

function changeTurn() {
  if(turn == "w") {
    turn = "b";
  }
  else if(turn == "b") {
    turn = "w";
  }
}

function resetVars() {
  startColumn = null;
  startRow = null;
}

function overSquare(column, row) {
  if((mouseX<((column+1)*tileLen + ((width/2)-height/4)))
  && mouseX>((column)*tileLen + ((width/2)-height/4)) 
  && mouseY<((row+1)*tileLen + height/4) 
  && mouseY>((row)*tileLen + height/4)) {
    return true;
  }
}

function checkPromotion(column, row) {
  if(checkPiece(column, row) == "pawn") {
    if(row == 0 || row == 7) {
      makeQueen(column, row);
    }
  }
}

//pawn functions
function makePawn(column, row) {
  if(checkColor(column, row) == "b") {
    image(bpawnImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "bpawn";
    bpawnImg.resize(tileLen, tileLen);
  }
  else if(checkColor(column, row) == "w") {
    image(wpawnImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "wpawn";
    wpawnImg.resize(tileLen, tileLen);
  }
  else {
    return;
  }
}

function pawnMove(column, row) {
  if(checkColor(column, row) == "w") {
    if(boardLayout[column][row-1] == null) {
      if(!check && !checkPinned(column, row-1)) {
        eligibleMoves[column][row-1] = true;
      }
    }
    if(column+1 < 8 && boardLayout[column+1][row-1] != null && boardLayout[column+1][row-1].charAt(0) == "b") {
      if(check || !checkPinned(column+1, row-1)) {
        if(check) {
          alt[column+1][row-1] = true;
        }
        else {
          eligibleMoves[column+1][row-1] = true;
        }
      }
    }
    if(column-1 > -1 && boardLayout[column-1][row-1] != null && boardLayout[column-1][row-1].charAt(0) == "b") {
      if(check || !checkPinned(column-1, row-1)) {
        if(check) {
          alt[column-1][row-1] = true;
        }
        else {
          eligibleMoves[column-1][row-1] = true;
        }
      }
    }
  }
  else if(checkColor(column, row) == "b") {
    if(boardLayout[column][row+1] == null) {
      if(!check && !checkPinned(column, row+1)) {
        eligibleMoves[column][row+1] = true;
      }
    }
    if(column+1 < 8 && boardLayout[column+1][row+1] != null && boardLayout[column+1][row+1].charAt(0) == "w") {
      if(check || !checkPinned(column+1, row+1)) {
        if(check) {
          alt[column+1][row+1] = true;
        }
        else {
          eligibleMoves[column+1][row+1] = true;
        }
      }
    }
    if(column-1 > -1 && boardLayout[column-1][row+1] != null && boardLayout[column-1][row+1].charAt(0) == "w") {
      if(check || !checkPinned(column-1, row+1)) {
        if(check) {
          alt[column-1][row+1] = true;
        }
        else {
          eligibleMoves[column-1][row+1] = true;
        }
      }
    }
  }
  else {
    return;
  }
  
} 

//bishop functions
function makeBishop(column, row) {
  if(checkColor(column, row) == "b") {
    image(bbishopImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "bbishop";
    bbishopImg.resize(tileLen, tileLen);
  }
  else if(checkColor(column, row) == "w") {
    image(wbishopImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "wbishop";
    wbishopImg.resize(tileLen, tileLen);
  }
  else {
    return;
  }
}

function bishopMove(column, row, max) {
  for(var z = 0; z < 4; z++) {
    var con = true;
    var x = 1;
    var y = 1;
    var a = 1;
    do {
      if(z == 1 && x == 1) {
        x *= -1;
      }
      else if(z == 2 && y == 1) {
        y *= -1;
      }
      else if(z == 3 && x == 1) {
        x *= -1;
        y *= -1;
      }
      if(a > max) {
        con = false;
      }
      else if(inBounds(column + x, row + y)) {
        if(boardLayout[column + x][row + y] == null) {
          if(check || !checkPinned(column + x, row + y)) {
            if(check) {
              alt[column + x][row + y] = true;
            }
            else {
              eligibleMoves[column + x][row + y] = true;
            }
          }
        }
        else if(checkColor(column + x, row + y) != null && checkColor(startColumn, startRow) != checkColor(column + x, row + y)) {
          if(check || !checkPinned(column + x, row + y)) {
            if(check) {
              alt[column + x][row + y] = true;
            }
            else {
              eligibleMoves[column + x][row + y] = true;
            }
          }
          con = false;
        }
        else {
          con = false;
        }
      }
      else {
        con = false;
      }
      if(x < 0) {
        x--;
      }
      else {
        x++;
      }
      if(y < 0) {
        y--;
      }
      else {
        y++;
      }
      a++;
    } while(con);
  }
}

//knight functions
function makeKnight(column, row) {
  if(checkColor(column, row) == "b") {
    image(bknightImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "bknight";
    bknightImg.resize(tileLen, tileLen);
  }
  else if(checkColor(column, row) == "w") {
    image(wknightImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "wknight";
    wknightImg.resize(tileLen, tileLen);
  }
}

function knightMove(column, row) {
  //check left side up and down
  //up
  if(inBounds(column + 2, row + 1)) {
    if(boardLayout[column + 2][row + 1] == null || (checkColor(column + 2, row + 1) != null && (checkColor(startColumn, startRow) != checkColor(column + 2, row + 1)))) {
      if(check || !checkPinned(column + 2, row + 1)) {
        if(check) {
          alt[column + 2][row + 1] = true;
        }
        else {
          eligibleMoves[column + 2][row + 1] = true;
        }
      }
    }
  }
  //down
  if(inBounds(column + 2, row - 1)) {
    if(boardLayout[column + 2][row - 1] == null || (checkColor(column + 2, row - 1) != null && (checkColor(startColumn, startRow) != checkColor(column + 2, row - 1)))) {
      if(check || !checkPinned(column + 2, row  - 1)) {
        if(check) {
          alt[column + 2][row - 1] = true;
        }
        else {
          eligibleMoves[column + 2][row - 1] = true;
        }
      }
    }
  }
  //check right side up and down
  //down
  if(inBounds(column - 2, row + 1)) {
    if(boardLayout[column - 2][row + 1] == null || (checkColor(column - 2, row + 1) != null && (checkColor(startColumn, startRow) != checkColor(column - 2, row + 1)))) {
      if(check || !checkPinned(column - 2, row + 1)) {
        if(check) {
          alt[column - 2][row + 1] = true;
        }
        else {
          eligibleMoves[column - 2][row + 1] = true;
        }
      }
    }
  }
  //up
  if(inBounds(column - 2, row - 1)) {
    if(boardLayout[column - 2][row - 1] == null || (checkColor(column - 2, row - 1) != null && (checkColor(startColumn, startRow) != checkColor(column - 2, row - 1)))) {
      if(check || !checkPinned(column - 2, row  - 1)) {
        if(check) {
          alt[column - 2][row - 1] = true;
        }
        else {
          eligibleMoves[column - 2][row - 1] = true;
        }
      }
    }
  }
  //checks left side of middle up and down
  //down
  if(inBounds(column + 1, row + 2)) {
    if(boardLayout[column + 1][row + 2] == null || (checkColor(column + 1, row + 2) != null && (checkColor(startColumn, startRow) != checkColor(column + 1, row + 2)))) {
      if(check || !checkPinned(column + 1, row + 2)) {
        if(check) {
          alt[column + 1][row + 2] = true;
        }
        else {
          eligibleMoves[column + 1][row + 2] = true;
        }
      }
    }
  }
  //up
  if(inBounds(column + 1, row - 2)) {
    if(boardLayout[column + 1][row - 2] == null || (checkColor(column + 1, row - 2) != null && (checkColor(startColumn, startRow) != checkColor(column + 1, row - 2)))) {
      if(check || !checkPinned(column + 1, row  - 2)) {
        if(check) {
          alt[column + 1][row - 2] = true;
        }
        else {
          eligibleMoves[column + 1][row - 2] = true;
        }
      }
    }
  }
  //checks right side of middle up and down
  //down
  if(inBounds(column - 1, row + 2)) {
    if(boardLayout[column - 1][row + 2] == null || (checkColor(column - 1, row + 2) != null && (checkColor(startColumn, startRow) != checkColor(column - 1, row + 2)))) {
      if(check || !checkPinned(column - 1, row + 2)) {
        if(check) {
          alt[column - 1][row + 2] = true;
        }
        else {
          eligibleMoves[column - 1][row + 2] = true;
        }
      }
    }
  }
  //up
  if(inBounds(column - 1, row - 2)) {
    if(boardLayout[column - 1][row - 2] == null || (checkColor(column - 1, row - 2) != null && (checkColor(startColumn, startRow) != checkColor(column - 1, row - 2)))) {
      if(check || !checkPinned(column - 1, row  - 2)) {
        if(check) {
          alt[column - 1][row - 2] = true;
        }
        else {
          eligibleMoves[column - 1][row - 2] = true;
        }
      }
    }
  }
}

//rook functions
function makeRook(column, row) {
  if(checkColor(column, row) == "b") {
    image(brookImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "brook";
    brookImg.resize(tileLen, tileLen);
  }
  else if(checkColor(column, row) == "w") {
    image(wrookImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "wrook";
    wrookImg.resize(tileLen, tileLen);
  }
  else {
    return;
  }
}

function rookMove(column, row, max) {
  for(var z = 0; z < 4; z++) {
    var con = true;
    var x = 1;
    var y = 0;
    var a = 1;
    if(z == 1) {
      x = -1;
    }
    if(z == 2) {
      y = 1;
      x = 0;
    }
    if(z == 3) {
      y = -1;
      x = 0;
    }
    do { 
      if(a > max) {
        con = false;
      }
      else if(inBounds(column + x, row + y)) {
        if(boardLayout[column + x][row + y] == null) {
          if(check || !checkPinned(column + x, row + y)) {
            if(check) {
              alt[column + x][row + y] = true;
            }
            else {
              eligibleMoves[column + x][row + y] = true;
            }
          }
        }
        else if(checkColor(column + x, row + y) != null && checkColor(startColumn, startRow) != checkColor(column + x, row + y)) {
          if(check || !checkPinned(column + x, row + y)) {
            if(check) {
              alt[column + x][row + y] = true;
            }
            else {
              eligibleMoves[column + x][row + y] = true;
            }
          }
          con = false;
        }
        else {
          con = false;
        }
      }
      else {
        con = false;
      }
      if(x < 0) {
        x--;
      }
      else if(x > 0) {
        x++;
      }
      if(y < 0) {
        y--;
      }
      else if(y > 0) {
        y++;
      }
      a++;
    } while(con);
  }
}

//queen functions
function makeQueen(column, row) {
  if(checkColor(column, row) == "b") {
    image(bqueenImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "bqueen";
    bqueenImg.resize(tileLen, tileLen);
  }
  else if(checkColor(column, row) == "w") {
    image(wqueenImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "wqueen";
    wqueenImg.resize(tileLen, tileLen);
  }
  else {
    return;
  }
}

function queenMove(column, row) {
  bishopMove(column, row, 8);
  rookMove(column, row, 8);
}

//king functions
function makeKing(column, row) {
  if(checkColor(column, row) == "b") {
    image(bkingImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "bking";
    bkingImg.resize(tileLen, tileLen);
  }
  else if(checkColor(column, row) == "w") {
    image(wkingImg, column*tileLen + ((width/2)-height/4), row*tileLen + height/4);
    boardLayout[column][row] = "wking";
    wkingImg.resize(tileLen, tileLen);
  }
  else {
    return;
  }
}

function kingMove(column, row) {
  bishopMove(column, row, 1);
  rookMove(column, row, 1);
}