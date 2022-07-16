import { player } from "/player.js";
import { board } from "/board.js";
import { piece } from "/pieces.js";
import { promotionQuestion, promotionQuestionHide } from "/view.js";

const socket = io();

// Logging on the client from the server
socket.on('log', (n) => {
    console.log(n);
});

// Starting game and checking if client is second player
socket.on('init', (number) => {
    hendleInit(number);
    startGame();
});

function startGame() { 
    labelBoard();
    newGame();
}

export let playerTwoView = false;
function hendleInit(number) {
    if (number === 2) {
        playerTwoView = true;
    }
    console.log(number + " " + playerTwoView);
}

// Creating new game, joining a game, and joining errors
let newgametext = document.getElementById("newgame");
newgametext.addEventListener("click", function (e) {
    socket.emit('newGame');
});

let joingametext = document.getElementById("joingame");
joingametext.addEventListener("click", function (e) {
    socket.emit('joinGame', "234");
    console.log('clcik')
});

socket.on('unknownGame', () => alert('unknowngame'));
socket.on('tooManyPlayers', () => alert('tooManyPlayers'));

// Sending information to other client
socket.on('pieceMove', ([lastposition, currentEmptyCellEmit]) => {
    pieceMoveServerEvent(lastposition, currentEmptyCellEmit);
});

socket.on('pieceDrop', ([lastposition, currentEmptyCellEmit]) => {
    pieceDropServerEvent(lastposition, currentEmptyCellEmit);
});

socket.on('piecePromote', (piecePosition) => {
    promotePieceServerEvent(piecePosition);
});



/* 
 Variables for game initialization
 */
export let boardArray;
let player1;
let player2;
let lastClicked;
let game;

/* 
 Clientside game initialization
 */
function newGame() { 
    player1 = new player("sente", false);
    player2 = new player("gote", false);

    // Format: piece object, possible moves array, current position
    lastClicked = ["", [], 0];
    
    game = new board(player1, player2, playerTwoView, lastClicked);
    game.render();
}

function joinGame() { 
    //socket.emit('joinGame', code);
}


/* 
 Labeling each cell on ui shogi board with ids and text.
 Also labeling and giving ids to cells in piece stands.
 */
// start of game
// Make a funciton to append the divs to html

// right before each client or server move
// make a funciton to erase and reappend divs to html incase elements are edited by user
// make a function to earase and reappend all the pieces on the board and stands
function labelBoard() { 
    boardArray = [[],[],[],[],[],[],[],[],[]];
    const rows = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const rowsKanji = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    let columnCounter;
    let rowCounter;

    // Reversing the board numbering and piece stands if player 2
    if (playerTwoView) {
/*         let pieceStands = document.getElementById('standsId');
        pieceStands.setAttribute('class', "piece-stands-reverse") */
        columnCounter = 1;
        rowCounter = 8;

    } else { 
        columnCounter = 9;
        rowCounter = 0;

    }

    // top and right cell labels based on player view
    let columnsLabelDiv = document.getElementById("columns");
    let rowsLabelDiv = document.getElementById("rows");
    if (playerTwoView) { 
        // gote player labeling
        for (let i = 1; i <= 9; i++) { 
            let newLabelSpan = document.createElement("span");
            newLabelSpan.textContent=i;
            columnsLabelDiv.appendChild(newLabelSpan);
        }
        
        for (let i = 8; i >= 0; i--) { 
            let newLabelSpan = document.createElement("span");
            newLabelSpan.textContent=rowsKanji[i];
            rowsLabelDiv.appendChild(newLabelSpan);
        }
    } else { 
        // sente player labeling
        for (let i = 9; i >= 1; i--) { 
            let newLabelSpan = document.createElement("span");
            newLabelSpan.textContent=i;
            columnsLabelDiv.appendChild(newLabelSpan);
        }
        for (let i = 0; i < 9; i++) { 
            let newLabelSpan = document.createElement("span");
            newLabelSpan.textContent=rowsKanji[i];
            rowsLabelDiv.appendChild(newLabelSpan);
        }
    }

    // Getting the shogi board and its div children 
    let shogiBoard = document.getElementById('shogiBoard');

    // Labeling the shogi board divs
    for (let i = 0; i < 81; i++) {
        // Passing each div to a function that labels it
        let newShogiCell = document.createElement("div");
        formatCell(newShogiCell, columnCounter + rows[rowCounter], "");
        boardArray[rowCounter][Math.abs(columnCounter-9)] = (columnCounter.toString() + rows[rowCounter].toString());
        
        // Changing the column and row based on which players view
        if (playerTwoView) { 
            columnCounter += 1;
            if (columnCounter == 10) {
                columnCounter = 1;
                rowCounter -= 1;
            }
        } else { 
            columnCounter -= 1;
            if (columnCounter == 0) {
                columnCounter = 9;
                rowCounter += 1;
            }
        }
        shogiBoard.appendChild(newShogiCell);
    }

    console.log(boardArray)






    // Labeling the player stands divs
    let standNumbCounter = 0;
    let closePieceStand = document.getElementById('close-piece-stand');
    let farPieceStand = document.getElementById('far-piece-stand');

    if (playerTwoView) { 
        standLabelHandeler("far", "p"); 
        standLabelHandeler("close", "o");
    } else { 
        standLabelHandeler("close", "p");
        standLabelHandeler("far", "o");
    }
    
    // For labeling the stand piece cells
    function standLabelHandeler(closeOrFar, prefix) {
        for (let i = 0; i < 7; i++) {
            let newShogiStandCell = document.createElement("div");
            formatCell(newShogiStandCell, standNumbCounter, prefix);
            standNumbCounter += 1;
            if (closeOrFar === "close") { 
                closePieceStand.appendChild(newShogiStandCell);
            } else if (closeOrFar === "far") { 
                farPieceStand.appendChild(newShogiStandCell);
            }
        }
    }


    // Give stand divs an id and span label
    function formatCell(child, cellNumber, labelPrefix) { 
            // Creating a label and putting it in a span element
            let label = labelPrefix + cellNumber;
            let spanText = document.createElement("span");
            spanText.innerHTML = label;
            spanText.setAttribute("class", "cell-label-stands");
        
            // Giving the div/cell an id with cell number and appending the span element to it
            child.setAttribute("id", label);
            //child.setAttribute("data-id", label);
            child.appendChild(spanText);
    }
}



/*
  Function for letting the user see where the piece they clicked on 
  can move on the board. Handles giving and removing events from 
  the cells where the players piece can possibly move.
 */
export function addPossibleMovesEvent(pieceClicked) {
    pieceClicked.addEventListener("click", pieceClickEvent);
}

export function removePossibleMovesEvent(pieceClicked) {
    pieceClicked.removeEventListener("click", pieceClickEvent);
}

function pieceClickEvent(e) {
    // Other way to do thing using attribute, maybe just use the div order to make more secure?
    //let pieceObject = game.gameBoard[e.target.getAttribute("pieceName")];
    //console.log(e.target.parentElement.getAttribute('id'));
    promotionQuestionHide();
    // Getting the cell in ui, the piece in gameboard, then possible moves
    let currentPieceCell = e.target.parentElement.getAttribute('id');
    let pieceObject;
    let possibleMoveCellsArray;
    
    
    pieceObject = game.gameBoard[currentPieceCell];
    possibleMoveCellsArray = pieceObject.getPossibleMoves(false);
    //console.log(pieceObject);
    
    // If the last piece clicked is not the same as the current piece clicked
    // then get rid of old possible moves cell identifiers and event
    if (game.lastClicked[0] != pieceObject) { 
        for (let i of game.lastClicked[1]) { 
            let position = document.getElementById(i);
            removeEmptyCellEvent(position);
            position.setAttribute("class", "");
            position.setAttribute("click", "false");
        }
    }
    
    // Setting data for the lastclicked array
    game.lastClicked[0] = pieceObject;
    game.lastClicked[1] = possibleMoveCellsArray; 
    game.lastClicked[2] = currentPieceCell;
    
    // For all cells the given piece can move to
    // deactivate if active and activate if deactivated
    for (let i of possibleMoveCellsArray) { 
        let position = document.getElementById(i);
        //console.log(position);
        if (position.getAttribute("click") == "true") { 
            removeEmptyCellEvent(position);
            position.setAttribute("class", "");
            position.setAttribute("click", "false");
        } else { 
            addEmptyCellEvent(position);
            position.setAttribute("class", "piece-possible-move-position");
            position.setAttribute("click", "true");
        }            
    }
}

export function addStandPossibleMovesEvent(pieceClicked) {
    pieceClicked.addEventListener("click", standPieceClickEvent);
}

export function removeStandPossibleMovesEvent(pieceClicked) { 
    pieceClicked.removeEventListener("click", standPieceClickEvent);
}

function standPieceClickEvent(e) {    
    // Getting the cell in ui, the piece in gameboard, then possible moves
    let currentPieceCell = e.target.parentElement.getAttribute('id');
    let pieceObject;
    let possibleMoveCellsArray;
    
    let capturedPieceTypeArray = game.standPieces[currentPieceCell];
    //loc_array.at(-1) instead of the line below to get last element
    pieceObject = capturedPieceTypeArray[capturedPieceTypeArray.length - 1];
    console.log(pieceObject)
    possibleMoveCellsArray = pieceObject.getPossibleDrops(game.gameBoard);
    
    console.log(game);
    console.log(pieceObject);
    
    // If the last piece clicked is not the same as the current piece clicked
    // then get rid of old possible moves cell identifiers and event
    if (game.lastClicked[0] != pieceObject) { 
        for (let i of game.lastClicked[1]) { 
            let position = document.getElementById(i);
            removeEmptyCellEvent(position);
            position.setAttribute("class", "");
            position.setAttribute("click", "false");
        }
    }
    
    // Setting data for the lastclicked array
    game.lastClicked[0] = pieceObject;
    game.lastClicked[1] = possibleMoveCellsArray; 
    game.lastClicked[2] = currentPieceCell;
    
    // For all cells the given piece can move to
    // deactivate if active and activate if deactivated
    for (let i of possibleMoveCellsArray) { 
        let position = document.getElementById(i);
        console.log(position);
        if (position.getAttribute("click") == "true") { 
            removeEmptyCellEvent(position);
            position.setAttribute("class", "");
            position.setAttribute("click", "false");
        } else { 
            addEmptyCellEvent(position);
            position.setAttribute("class", "piece-possible-move-position");
            position.setAttribute("click", "true");
        }            
    }
}


/* 
 Events for possible move cells adding, removing, and the callback
 to move a piece when they are clicked 
 */
function addEmptyCellEvent(cell) {
    cell.addEventListener("click", emptyCellEvent);
}

export function removeEmptyCellEvent(cell) {
    cell.removeEventListener("click", emptyCellEvent);
}

function emptyCellEvent(e) {
    let currentEmptyCell = e.target.getAttribute('id');
    if (game.lastClicked[0].inStand == false) {
        // if in the last three cells, redirect this to somewhere else where
        // they get called after the user picks if they want to promote or not
        if (game.lastClicked[0].checkIfCanPromote(game.lastClicked[2], currentEmptyCell)) {
            askIfWantsToPromote(game.lastClicked[2], currentEmptyCell);
        } else { 
            game.movePiece(game.lastClicked[2], currentEmptyCell);
            socket.emit('pieceMove', [game.lastClicked[2], currentEmptyCell]);
        }
    } else { 
        game.movePieceFromStand(game.lastClicked[2], currentEmptyCell);
        socket.emit('pieceDrop', [game.lastClicked[2], currentEmptyCell]);
    }
}


/* 
 When the server sends the other player's move, this gives info about it
 to have the same effects happen on the other client 
 */
function pieceMoveServerEvent(lastposition, currentEmptyCellEmit)  {
    let currentEmptyCell = currentEmptyCellEmit;
    game.movePiece(lastposition, currentEmptyCell);
}

function pieceDropServerEvent(lastposition, currentEmptyCellEmit) { 
    let currentEmptyCell = currentEmptyCellEmit;
    game.movePieceFromStand(lastposition, currentEmptyCell);    
}


/* 
 Takes x, y, and gote sente. Checks if the cell is an edge, if it has
 a player or opponent piece, and if it's empty. Returns for pieces.js to use 
 */
export function getMovementBorder(xPositionInt, yPositionInt, gote_sente) {
    let xPosString = xPositionInt.toString();
    let yPosString = yPositionInt.toString();

    // Four return types samePlayer, oppositePlayer, edge, empty
    if (xPositionInt > 9 || xPositionInt < 1 || yPositionInt > 9 || yPositionInt < 1) {
        return "edge";
    }

    // Checking if the cell has a piece and whos piece
    let cellToCheck = xPosString + yPosString;
    if (cellToCheck in game.gameBoard) { 
        let nextCellPieceObj = game.gameBoard[cellToCheck];
        if (nextCellPieceObj.gote_sente === gote_sente) {
            return "samePlayer";
        }
        return "oppositePlayer";
    }

    return "empty";
}

// Promotion
export function askIfWantsToPromote(oldPiecePosition, newPiecePosition) { 
    promotionQuestion(oldPiecePosition, newPiecePosition, game.gameBoard, lastClicked[1]);
}

/*
 If user pickes to promote piece when they reach promotion area
 */
export function promotePiece(piecePosition) {
    game.movePiece(game.lastClicked[2], piecePosition);
    game.promotePieceHandle(piecePosition);
    socket.emit('pieceMove', [game.lastClicked[2], piecePosition]);
    socket.emit('piecePromote', piecePosition);
}

/*
 If user pickes to not promote piece when they reach promotion area
 */
export function dontPromotePiece(piecePosition) {
    game.movePiece(game.lastClicked[2], piecePosition);
    socket.emit('pieceMove', [game.lastClicked[2], piecePosition]);
}

export function promotePieceServerEvent(piecePosition) {
    game.promotePieceHandle(piecePosition);
}



// checking and checkmating
export function kingInCheck(gote_sente) { 
    if (gote_sente === "gote") { 
        return game.goteChecked;
    } else if (gote_sente === "sente") { 
        return game.senteChecked;
    }
}

export function willMoveUncheckKing(oldPosition, newPosition) { 
    let result = game.pieceMoveCheckResult(oldPosition, newPosition);
    return !result;
}

export function willPawnDropCheckmateKing(oldStandPosition, newPosition) { 
    let result = game.pawnDropPreventImmediateCheck(oldStandPosition, newPosition);
    return result;
}

// For local testing
//startGame();
