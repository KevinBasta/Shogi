import {player} from "/player.js";

export class board { 
    constructor(player1, player2, localStorage) { 
        this.gameBoard = {};
        this.logTurnNumber = 1;
        this.lastBoardStates = [];
        this.localStorage = localStorage;
        player1.initpieces();
        player2.initpieces();

        this.gameBoard = player1.getPieces(this.gameBoard);
        this.gameBoard = player2.getPieces(this.gameBoard);
        localStorage.setItem('board', JSON.stringify(this.gameBoard));
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