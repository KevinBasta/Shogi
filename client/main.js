import { board } from "/board.js";
import { promotionQuestion, promotionQuestionHide, thisPlayerTurn, otherPlayerTurn, initPlayerNameAndGoteSente, initOpponentNameAndGoteSente, waitingForSecondPlayer, pieceMoveGameLog, hideHomePage, displayGameCode, removeGameCode, clientDisconnectMessage, clientReconnectMessage, clientConnectMessage, joiningClientConnectMessage, hideReturnHomeButton, showReturnHomeButton, gameLogMessage, removeBoardMovedEffect, preloadAllPieceImages } from "/view.js";

const socket = io();
export let playerTwoView = false;
export let currentTurn = 'sente';
const mobileRemoveEffect = window.matchMedia("only screen and (max-width: 760px)").matches;
let gameOver = false;
let fullGameMovesSoFar = [];
let fullGameLog = [];
let playerName;
let opponentName;
let gameCodeSave;
let reloadingGame = false;
let opponentConnected = false; 

/* turn switiching */
function switchTrunAndRestrictMoves() { 
    if (!game.checkmated["gote"] && !game.checkmated["sente"]) { 
        turnSwitch();
        restrictOrUnrestrictedPlayerPieces();
    }
}

export function turnSwitch() { 
    if (currentTurn === "sente") {
        currentTurn = "gote";
    } else if (currentTurn === "gote") { 
        currentTurn = "sente";
    }
}

function restrictOrUnrestrictedPlayerPieces() { 
    if (!playerTwoView && currentTurn === "sente") { 
        game.notationArray = {"player": "sente", "piece": "none", "location": "0", "destination": "0", "capturedOpponent": false, "promoted": false, "dropped": false, "choseToPromote": "na"};
        game.turnAllowPieceClick();
        thisPlayerTurn();
    } else if (playerTwoView && currentTurn === "gote") { 
        game.notationArray = {"player": "sente", "piece": "none", "location": "0", "destination": "0", "capturedOpponent": false, "promoted": false, "dropped": false, "choseToPromote": "na"};
        game.turnAllowPieceClick();
        thisPlayerTurn();
    } else if (playerTwoView && currentTurn === "sente") { 
        game.turnRestrictPieceClick();
        otherPlayerTurn();
        if (!reloadingGame) { 
            gameLogConcat();
        }
    } else if (!playerTwoView && currentTurn === "gote") { 
        game.turnRestrictPieceClick();
        otherPlayerTurn();
        if (!reloadingGame) { 
            gameLogConcat();
        } 
    }
}

export function gameEnded() { 
    gameOver = true;
}


// Logging on the client from the server
socket.on('log', (n) => {
    console.log(n);
});



// Starting game 
function startGame() { 
    if (!reloadingGame) { 
        if (playerTwoView === false) { 
            initPlayerNameAndGoteSente(playerName, "sente");
        } else if (playerTwoView === true) { 
            initPlayerNameAndGoteSente(playerName, "gote");
        }
    }

    labelBoard();
    newGame();
}


/* 
 Creating new game, joining a game, and joining errors
 */
let newgametext = document.getElementById("newgame");
newgametext.addEventListener("click", function (e) {
    playerName = document.getElementById("newGameName").value;
    let goteSenteChoice = document.getElementById("goteSenteChoice").value;
    //console.log(goteSenteChoice)
    if (goteSenteChoice === "-- Sente or Gote") {
        playerTwoView = false;
    } else if (goteSenteChoice === "sente") { 
        playerTwoView = false;
    } else if (goteSenteChoice === "gote") { 
        playerTwoView = true;
    } 

    socket.emit('newGame');

    labelBoard();
    if (playerTwoView === false) { 
        initPlayerNameAndGoteSente(playerName, "sente");
    } else if (playerTwoView === true) { 
        initPlayerNameAndGoteSente(playerName, "gote");
    }
    sessionStorage.setItem('thisPlayer', JSON.stringify([playerName, playerTwoView]));
    waitingForSecondPlayer();
    hideHomePage();
});

let joingametext = document.getElementById("joingame");
joingametext.addEventListener("click", function (e) {
    let gameCode = document.getElementById("gameCodeInput").value;
    socket.emit('joinGame', gameCode);
    gameCodeSave = gameCode;
    sessionStorage.setItem('gamecode', JSON.stringify(gameCode));
});

socket.on('joinInit', () => {
    playerName = document.getElementById("joinGameName").value;
    socket.emit('requestFirstPlayerInfo', playerName);
    socket.emit('noNewJoiningAllowed');
    labelBoard();
    hideHomePage();
    joiningClientConnectMessage();
});



socket.on('unknownGame', () => alert('unknowngame'));
socket.on('tooManyPlayers', () => alert('tooManyPlayers'));


// Before game starts
socket.on('gamecode', (roomName) => { 
    displayGameCode(roomName);
    sessionStorage.setItem('gamecode', JSON.stringify(roomName));
    gameCodeSave = roomName;
});

socket.on('requestFirstPlayerInfo', (name) => {
    if (playerTwoView === false) { 
        initOpponentNameAndGoteSente(name, "gote");
    } else if (playerTwoView === true) { 
        initOpponentNameAndGoteSente(name, "sente");
    }
    sessionStorage.setItem('otherPlayer', JSON.stringify([name, playerTwoView]));
    opponentName = name; 
    opponentConnected = true;
    sessionStorage.setItem('opponentConnected', JSON.stringify(opponentConnected));
    clientConnectMessage();

    socket.emit('recieveFirstPlayerInfo', [playerTwoView, playerName]);
    removeGameCode();
    startGame();
});

socket.on('recieveFirstPlayerInfo', ([goteOrSente, name]) => {
    playerTwoView = !goteOrSente;
    
    if (playerTwoView === false) { 
        initOpponentNameAndGoteSente(name, "gote");
    } else if (playerTwoView === true) { 
        initOpponentNameAndGoteSente(name, "sente");
    }
    sessionStorage.setItem('thisPlayer', JSON.stringify([playerName, playerTwoView]));
    sessionStorage.setItem('otherPlayer', JSON.stringify([name, playerTwoView]));
    opponentName = name;
    opponentConnected = true;
    sessionStorage.setItem('opponentConnected', JSON.stringify(opponentConnected));

    startGame();
});


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

socket.on('gameNotationLine', (moveLogText) => {
    pieceMoveGameLog(moveLogText);
    fullGameLog.push(moveLogText);
    sessionStorage.setItem('gamelog', JSON.stringify(fullGameLog));
});

socket.on('OpponentDisconnected', () => { 
    clientDisconnectMessage(opponentName);
    opponentConnected = false;
    sessionStorage.setItem('opponentConnected', JSON.stringify(opponentConnected));
    setTimeout(checkIfOpponentReconnected, 7000);
});

socket.on('OpponentReconnect', () => { 
    clientReconnectMessage(opponentName);
    opponentConnected = true;
    sessionStorage.setItem('opponentConnected', JSON.stringify(opponentConnected));
});

function checkIfOpponentReconnected() { 
    console.log("checking")
    if (opponentConnected === false) { 
        if (!gameOver) { 
            game.removeAllEventListeners();
            gameLogMessage("opponent didn't reconnect, return to home page with button");
            showReturnHomeButton();
        }
        console.log("not connected")
    } else { 
        console.log("is connected")
    }
}


/* 
 Variables for game initialization
 */
export let boardArray;
let lastClicked;
let game;

/* 
 Clientside game initialization
 */
function newGame() { 
    // Format: piece object, possible moves array, current position
    lastClicked = ["", [], 0];
    
    game = new board(playerTwoView, lastClicked);
    game.render();

    if (playerTwoView && currentTurn === "sente") { 
        game.turnRestrictPieceClick();
        otherPlayerTurn();
    } else if (!playerTwoView && currentTurn === "sente") { 
        game.turnAllowPieceClick();
        thisPlayerTurn();
    }
}




/* 
 Labeling each cell on ui shogi board with ids and text.
 Also labeling and giving ids to cells in piece stands.
 */
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
    let columnsChildrenArray = [];
    
    let rowTopCornerSpan = document.createElement("span");
    rowTopCornerSpan.setAttribute("class", "hide-corner-cell")
    
    let rowsLabelDiv = document.getElementById("rows");
    let rowsChildrenArray = [rowTopCornerSpan];



    if (playerTwoView) { 
        // gote player labeling
        for (let i = 1; i <= 9; i++) { 
            let newLabelSpan = document.createElement("span");
            newLabelSpan.textContent=i;
            columnsChildrenArray.push(newLabelSpan);
        }
        
        for (let i = 8; i >= 0; i--) { 
            let newLabelSpan = document.createElement("span");
            newLabelSpan.textContent=rowsKanji[i];
            rowsChildrenArray.push(newLabelSpan);
        }
    } else { 
        // sente player labeling
        for (let i = 9; i >= 1; i--) { 
            let newLabelSpan = document.createElement("span");
            newLabelSpan.textContent=i;
            columnsChildrenArray.push(newLabelSpan);
        }
        for (let i = 0; i < 9; i++) { 
            let newLabelSpan = document.createElement("span");
            newLabelSpan.textContent=rowsKanji[i];
            rowsChildrenArray.push(newLabelSpan);
        }
    }
    columnsLabelDiv.replaceChildren(...columnsChildrenArray);
    rowsLabelDiv.replaceChildren(...rowsChildrenArray);


    // Getting the shogi board and its div children 
    let shogiBoard = document.getElementById('shogiBoard');
    let shogiBoardCellsArray = [];
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
        shogiBoardCellsArray.push(newShogiCell);
    }
    shogiBoard.replaceChildren(...shogiBoardCellsArray);

    //console.log(boardArray)



    // Labeling the player stands divs
    let standNumbCounter = 0;
    let closePieceStand = document.getElementById('close-piece-stand');
    let closePieceStandCellsArray = [];
    let farPieceStand = document.getElementById('far-piece-stand');
    let farPieceStandCellsArray = [];

    if (playerTwoView) { 
        standLabelHandeler("far", "p"); 
        standLabelHandeler("close", "o");
    } else { 
        standLabelHandeler("close", "p");
        standLabelHandeler("far", "o");
    }
    closePieceStand.replaceChildren(...closePieceStandCellsArray);
    farPieceStand.replaceChildren(...farPieceStandCellsArray);
    
    // For labeling the stand piece cells
    function standLabelHandeler(closeOrFar, prefix) {
        for (let i = 0; i < 7; i++) {
            let newShogiStandCell = document.createElement("div");
            formatCell(newShogiStandCell, standNumbCounter, prefix);
            standNumbCounter += 1;
            if (closeOrFar === "close") { 
                closePieceStandCellsArray.push(newShogiStandCell);
            } else if (closeOrFar === "far") { 
                farPieceStandCellsArray.push(newShogiStandCell);
            }
        }
    }


    // Give stand divs an id and span label
    function formatCell(child, cellNumber, labelPrefix) { 
            // Creating a label and putting it in a span element
            let label = labelPrefix + cellNumber;
            let spanText = document.createElement("span");
            spanText.innerHTML = label;
            spanText.setAttribute("class", "cell-label");
        
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
    if (mobileRemoveEffect) {
        removeBoardMovedEffect(game.oldMovedForUi);  
    }
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
            position.classList.remove("piece-possible-move-position");
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
            position.classList.remove("piece-possible-move-position");
            position.setAttribute("click", "false");
        } else { 
            addEmptyCellEvent(position);
            position.classList.add("piece-possible-move-position");
            position.setAttribute("click", "true");
        }            
    }
}



/* events for dropping piece on board */
export function addStandPossibleMovesEvent(pieceClicked) {
    pieceClicked.addEventListener("click", standPieceClickEvent);
}

export function removeStandPossibleMovesEvent(pieceClicked) { 
    pieceClicked.removeEventListener("click", standPieceClickEvent);
}

function standPieceClickEvent(e) {  
    if (mobileRemoveEffect) {
        removeBoardMovedEffect(game.oldMovedForUi);  
    }
    // Getting the cell in ui, the piece in gameboard, then possible moves
    let currentPieceCell = e.target.parentElement.getAttribute('id');
    let pieceObject;
    let possibleMoveCellsArray;
    
    let capturedPieceTypeArray = game.standPieces[currentPieceCell];
    //loc_array.at(-1) instead of the line below to get last element
    pieceObject = capturedPieceTypeArray[capturedPieceTypeArray.length - 1];
    //console.log(pieceObject)
    possibleMoveCellsArray = pieceObject.getPossibleDrops(game.gameBoard, false);
    
    //console.log(game);
    //console.log(pieceObject);
    
    // If the last piece clicked is not the same as the current piece clicked
    // then get rid of old possible moves cell identifiers and event
    if (game.lastClicked[0] != pieceObject) { 
        for (let i of game.lastClicked[1]) { 
            let position = document.getElementById(i);
            removeEmptyCellEvent(position);
            position.classList.remove("piece-possible-move-position");
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
            position.classList.remove("piece-possible-move-position");
            position.setAttribute("click", "false");
        } else { 
            addEmptyCellEvent(position);
            position.classList.add("piece-possible-move-position");
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
            switchTrunAndRestrictMoves();
            addGameMove('move', game.lastClicked[2], currentEmptyCell);
            socket.emit('pieceMove', [game.lastClicked[2], currentEmptyCell]);
        }
    } else { 
        game.movePieceFromStand(game.lastClicked[2], currentEmptyCell);
        switchTrunAndRestrictMoves();
        addGameMove('drop', game.lastClicked[2], currentEmptyCell);
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
    switchTrunAndRestrictMoves();
    addGameMove('move', lastposition, currentEmptyCell);
}

function pieceDropServerEvent(lastposition, currentEmptyCellEmit) { 
    let currentEmptyCell = currentEmptyCellEmit;
    game.movePieceFromStand(lastposition, currentEmptyCell);    
    switchTrunAndRestrictMoves();
    addGameMove('drop', lastposition, currentEmptyCell);
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
    game.notationArray["choseToPromote"] = "yes";
    game.movePiece(game.lastClicked[2], piecePosition);
    game.promotePieceHandle(piecePosition);
    switchTrunAndRestrictMoves();
    addGameMove('move', game.lastClicked[2], piecePosition, "yes");
    addGameMove('promote', piecePosition, "n/a");
    socket.emit('pieceMove', [game.lastClicked[2], piecePosition]);
    socket.emit('piecePromote', piecePosition);
}

export function promotePieceServerEvent(piecePosition) {
    game.promotePieceHandle(piecePosition);
    addGameMove('promote', piecePosition, "n/a");
}

/*
 If user pickes to not promote piece when they reach promotion area
 */
export function dontPromotePiece(piecePosition) {
    game.notationArray["choseToPromote"] = "no";
    game.movePiece(game.lastClicked[2], piecePosition);
    switchTrunAndRestrictMoves();
    addGameMove('move', game.lastClicked[2], piecePosition, "no");
    socket.emit('pieceMove', [game.lastClicked[2], piecePosition]);
}



/* checking and checkmating */
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

export function willDropUncheckKing(oldStandPosition, newPosition) { 
    let result = game.pieceDropCheckResult(oldStandPosition, newPosition);
    return !result;
}

export function willPawnDropCheckmateKing(oldStandPosition, newPosition) { 
    let result = game.pawnDropPreventImmediateCheck(oldStandPosition, newPosition);
    return result;
}



/* making the movement notation */
export function gameLogConcat() { 
    let localNotation = game.notationArray;
    let notationLine = "";
    if (localNotation["player"] === "sente") { 
        notationLine += "☖";
    } else if (localNotation["player"] === "gote") { 
        notationLine += "☗";
    }
    
    if (localNotation["promoted"] === true) { 
        notationLine += "+";
    }

    if (localNotation["piece"] == "Knight") {
        notationLine += "N";
    } else if (localNotation["piece"] == "ChallengingKing") {
        notationLine += "K";
    } else { 
        notationLine += localNotation["piece"].substring(0,1);
    }

    if (localNotation["dropped"] === false) { 
        notationLine += localNotation["location"];
    }

     
    if (localNotation["dropped"] === true) { 
        notationLine += "*";
    } else if (localNotation["capturedOpponent"] === true) { 
        notationLine += "x";
    } else {
        notationLine += "-";
    }

    notationLine += localNotation["destination"];

    if (localNotation["choseToPromote"] === "yes") {
        notationLine += "+";
    } else if (localNotation["choseToPromote"] === "no") { 
        notationLine += "=";
    }

    fullGameLog.push(notationLine);
    sessionStorage.setItem('gamelog', JSON.stringify(fullGameLog));
    pieceMoveGameLog(notationLine);
    game.notationArray = {"player": "sente", "piece": "none", "location": "0", "destination": "0", "capturedOpponent": false, "promoted": false, "dropped": false, "choseToPromote": "na"};
    socket.emit("gameNotationLine", notationLine);
}

// For local testing
// startGame();



function addGameMove(moveType, oldPosition, newPosition, notationPromote='n/a') { 
    fullGameMovesSoFar.push([moveType, oldPosition, newPosition, notationPromote]);
    sessionStorage.setItem('game', JSON.stringify(fullGameMovesSoFar));
}

function loadGameMoves() { 
    if (sessionStorage.getItem('game') != null) { 
        hideHomePage();

        let thisPlayer = JSON.parse(sessionStorage.getItem('thisPlayer'));
        let otherPlayer = JSON.parse(sessionStorage.getItem('otherPlayer'));
        playerTwoView = thisPlayer[1];
        if (playerTwoView === false) { 
            initPlayerNameAndGoteSente(thisPlayer[0], "sente");
            initOpponentNameAndGoteSente(otherPlayer[0], "gote");
        } else if (playerTwoView === true) { 
            initPlayerNameAndGoteSente(thisPlayer[0], "gote");
            initOpponentNameAndGoteSente(otherPlayer[0], "sente");
        }
        playerName = thisPlayer[0];
        opponentName = otherPlayer[0]
        console.log(JSON.parse(sessionStorage.getItem('game')))
        console.log(thisPlayer)
        console.log(otherPlayer)
        reloadingGame = true;
        
        startGame();
        fullGameMovesSoFar = JSON.parse(sessionStorage.getItem('game'));

        for (let i = 0; i < fullGameMovesSoFar.length; i++) { 
            let currentMove = fullGameMovesSoFar[i];
            if (currentMove[0] === "move") { 
                game.movePiece(currentMove[1], currentMove[2]);
                switchTrunAndRestrictMoves();
            } else if (currentMove[0] === "drop") { 
                game.movePieceFromStand(currentMove[1], currentMove[2]); 
                switchTrunAndRestrictMoves();
            } else if (currentMove[0] === "promote") { 
                game.promotePieceHandle(currentMove[1]);
            }
        }
        fullGameLog = JSON.parse(sessionStorage.getItem('gamelog'));
        for (let i = 0; i < fullGameLog.length; i++) { 
            pieceMoveGameLog(fullGameLog[i]);
        }

        let gameCode = JSON.parse(sessionStorage.getItem('gamecode'));
        gameCodeSave = gameCode;
        socket.emit("refreshJoinGame", gameCode);
        reloadingGame = false;
        
        opponentConnected = JSON.parse(sessionStorage.getItem('opponentConnected'));
        if (opponentConnected === false) { 
            showReturnHomeButton();
        }

    }
}

window.onload = function() { 
    loadGameMoves();  
}

function clearSessionStorage() { 
    sessionStorage.clear();
}

document.getElementById("returnToHomePage").onclick = function () { 
    clearSessionStorage();
    hideReturnHomeButton();
    socket.emit("deleteRoom", gameCodeSave);
    location.href = "/index.html";
}

preloadAllPieceImages();