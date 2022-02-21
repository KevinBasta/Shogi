import {player} from "/player.js";
import {defultBoardSetup, picesImages} from "/config.js"; 
import {addEvent} from "/main.js";

export class board { 
    constructor(player1, player2) { 
        this.gameBoard = {};
        this.logTurnNumber = 1;
        this.lastBoardStates = [];
        player1.initpieces();
        player2.initpieces();

        this.gameBoard = player1.getPieces(this.gameBoard);
        this.gameBoard = player2.getPieces(this.gameBoard);
        console.log(this.gameBoard);
    }

    // put render in board.js or player.js, no need for it to be here. Should be able to access all attributes from there anyways.
    render() { 
        for (let i in this.gameBoard) { 
            let position = document.getElementById(this.gameBoard[i].position);
            let elem = document.createElement("img");
            
            elem.setAttribute("src", picesImages[this.gameBoard[i].pieceType]);
            elem.setAttribute("class", "piece");
            if (this.gameBoard[i].isfacingup == false) {
                elem.setAttribute("class", "piece piece-rotate");
            }
            elem.setAttribute("pieceName", this.gameBoard[i].pieceObjectName);

            position.appendChild(elem);
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