
let player1 = new player(gote, false);



const defultBoard = [];
let logNumber = 1;
let lastBoardState;

let boardLogs = {
    log_1: defultBoard,
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