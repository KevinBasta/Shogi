import {player} from "/player.js";
import {defultBoardSetup, picesImages} from "/config.js"; 
import {addEvent, removeEmptyCellEvent} from "/main.js";

export class board { 
    constructor(player1, player2, playerTwoView, lastClicked) { 
        this.gameBoard = {};
        this.logTurnNumber = 1;
        this.lastBoardStates = [];
        this.playerTwoView = playerTwoView;
        this.lastClicked = lastClicked;
        player1.initpieces();
        player2.initpieces();
        this.player1PieceStand = [];
        this.player2PieceStand = [];

        this.gameBoard = player1.getPieces(this.gameBoard);
        this.gameBoard = player2.getPieces(this.gameBoard);
        console.log(this.gameBoard);
    }

    // put render in board.js or player.js, no need for it to be here. Should be able to access all attributes from there anyways.
    render() { 
        for (let i in this.gameBoard) { 
            this.renderNewPieceImage(i);
        }
    }

    movePiece(oldPosition, newPosition) { 
        //needs to move in the ui and in the data

        // If the target position has an opponent piece [can add extra check of gote sente]
        if (newPosition in this.gameBoard) {    
            // Getting rid of opponent piece from ui
            let opponentCell = document.getElementById(newPosition);
            let opponentPieceImage = document.querySelector(`[pieceName=${this.gameBoard[newPosition].pieceObjectName}]`);
            opponentCell.removeChild(opponentPieceImage);

            // Gettind rid of opponent piece from game board object and saving it
            // Maybe pass it to player.js to handle there all the value changes
            let opponentCapturedPiece = this.gameBoard[newPosition];
            /*if (opponentCapturedPiece.getGoteSente() === "gote") { 
                opponentCapturedPiece.setGoteSente("sente");
            } else if (opponentCapturedPiece.getGoteSente() === "sente") { 
                opponentCapturedPiece.setGoteSente("gote");
            } 
            opponentCapturedPiece.position = "00";*/
            delete this.gameBoard[newPosition];
        }


        // Getting rid of the old ui current piece on the board
        let oldCell = document.getElementById(oldPosition);
        let oldPieceImage = document.querySelector(`[pieceName=${this.gameBoard[oldPosition].pieceObjectName}]`);
        oldCell.removeChild(oldPieceImage);
        
        // Adding the new position as a key on the game board & deleting old one
        this.gameBoard[newPosition] = this.gameBoard[oldPosition];
        this.gameBoard[newPosition].position = newPosition;
        delete this.gameBoard[oldPosition];

        // Creating new image element and appending it to new cell
        this.renderNewPieceImage(newPosition);

        // Getting rid of old possible move styling and events
        for (let i of this.lastClicked[1]) { 
            let position = document.getElementById(i);
            removeEmptyCellEvent(position);
            position.setAttribute("class", "");
            position.setAttribute("click", "false");
        }
    }

    // Function to create new shogi piece image and put it somewhere
    renderNewPieceImage(cellCoordinate) {
        // Getting the div spesified and creating the image
        let position = document.getElementById(this.gameBoard[cellCoordinate].position);
        let elem = document.createElement("img");
        
        // Adding the image src, classes, name, and then appending it to div
        elem.setAttribute("src", picesImages[this.gameBoard[cellCoordinate].pieceType]);
        elem.setAttribute("pieceName", this.gameBoard[cellCoordinate].pieceObjectName);
        elem.setAttribute("class", "piece");

        // If image is facing the opposite way then rotate it and make it unclickable
        if ((this.gameBoard[cellCoordinate].isfacingup == false && !this.playerTwoView) || (this.playerTwoView && this.gameBoard[cellCoordinate].isfacingup == true)) {
            elem.setAttribute("class", "piece piece-rotate opponent-piece-unclickable");
        }
        position.appendChild(elem);

        // only add click events for the appropriate player pieces
        if (this.gameBoard[cellCoordinate].gote_sente === "gote" && this.playerTwoView) {
            addEvent(elem);
        } else if (this.gameBoard[cellCoordinate].gote_sente === "sente" && !this.playerTwoView) {
            addEvent(elem);
        }
    }

    getBoard() { 
        return this.gameBoard;
    }
}


// add something to do with an array that gets the objects from both players 
// put in it so that the event listeners can edit the objects through the  array? 
let boardLogs = {
    
}

function logBoard() {
    logNumber += 1;
    lastBoardState = logNumber;
    boardLogs[("log_" + logNumber)] = ['lol'];
}


/* 2 player objects created that have the gote or sente property
   to allow for piece movemnts in online multiplayer, offline multiplayer, 
   and player vs computer. 

   The player class can have the properties of pices in possetion, pices captured, etc..
   
   the second player can have the property of a real player or a bot or 
   it can also be a different computer player object that gets initialized instead
   of a player or maybe it's just inheritance of the class player.
   
   look up the input/output for already existing shogi bots to integrate in design
   */ 

/* game object created at the start of each game that takes the mode and 
   determiens how to set stuff up. */