import {player} from "/player.js";
import {addEvent, removeEmptyCellEvent} from "/main.js";
import {defultBoardSetup, defultStandSetups, picesImages} from "/config.js"; 
import {piece, king, goldGeneral, silverGeneral, rook, bishop, knight, lance, pawn} from "/pieces.js";
// Notes
// sparate game mechanics from ui
// make functions to reload gameboard and standpieces based on objects

export class board { 
    constructor(player1, player2, playerTwoView, lastClicked) { 
        this.gameBoard = {};
        this.logTurnNumber = 1;
        this.lastBoardStates = [];
        this.playerTwoView = playerTwoView;
        this.lastClicked = lastClicked;
        this.player1 = player1;
        this.player2 = player2;
        this.initpieces();
        this.standPieces = {};

        console.log(this.gameBoard);
    }

    // put render in board.js or player.js, no need for it to be here. Should be able to access all attributes from there anyways.
    render() { 
        for (let i in this.gameBoard) { 
            this.renderNewPieceImage(i);
        }

        for (const pieceName in defultStandSetups) { 
            let pieceIndexInObj = defultStandSetups[pieceName];
            this.renderStandPiece(pieceIndexInObj[0], pieceIndexInObj[1], pieceName)
        }
    }

    rerender(newGameBoard) {
        for (let i in this.gameBoard) { 
            let oldCell = document.getElementById(i);
            let oldPieceImage = oldCell.querySelector(`img`);
            oldCell.removeChild(oldPieceImage);
        }
        

        this.gameBoard = newGameBoard;

        
        for (let i in this.gameBoard) { 
            this.renderNewPieceImage(i);
        }
    }

    capturedPieceParametersChange(opponentCapturedPiece) { 
        let standPiecesMap = { 
            "Pawn": ["p0", "o7"],
            "Lance": ["p1", "o8"],
            "Knight": ["p2", "o9"],
            "SilverGeneral": ["p3", "o10"],
            "GoldGeneral": ["p4", "o11"],
            "Rook": ["p5", "o12"],
            "Bishop": ["p6", "o13"]
        }
        
        if (opponentCapturedPiece.getPieceType() != "King" && opponentCapturedPiece.getPieceType() != "ChallengingKing" ) {
            let positionInStand;
            opponentCapturedPiece.changeGoteSente();
            if (opponentCapturedPiece.getGoteSente() === "gote") { 
                positionInStand = standPiecesMap[opponentCapturedPiece.getPieceType()][1];
            } else if (opponentCapturedPiece.getGoteSente() === "sente") { 
                positionInStand = standPiecesMap[opponentCapturedPiece.getPieceType()][0];           
            }
    
            let standCell = document.getElementById(positionInStand);
            let pieceOnStand = standCell.querySelector(`img`);
            // for displaying how many are captured
            //let pieceCounter = standCell.querySelector(`img`);
            console.log(pieceOnStand)
    
            if ((positionInStand.substring(0, 1) === 'o' && !this.playerTwoView) || (this.playerTwoView && positionInStand.substring(0, 1) === 'p')) {
                pieceOnStand.setAttribute("class", "piece piece-rotate opponent-piece-unclickable");
            } else { 
                pieceOnStand.setAttribute("class", "piece");
            }
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
            this.capturedPieceParametersChange(opponentCapturedPiece);
            
            
            

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
        let position = document.getElementById(cellCoordinate);
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

    renderStandPiece(standPosition, pieceType, pieceName) {
        let position = document.getElementById(standPosition);
        let elem = document.createElement("img");
        elem.setAttribute("src", picesImages[pieceType]);
        elem.setAttribute("pieceName", pieceName);
        elem.setAttribute("standpos", standPosition);
        elem.setAttribute("class", "stand-piece-placeholder");

        // If image is facing the opposite way then rotate it and make it unclickable
        if ((standPosition.substring(0, 1) === 'o' && !this.playerTwoView) || (this.playerTwoView && standPosition.substring(0, 1) === 'p')) {
            elem.setAttribute("class", "stand-piece-placeholder piece-rotate opponent-piece-unclickable");
        }
        position.appendChild(elem);
    }

    initpieces() { 
        for (const pieceName in defultBoardSetup) { 
            let gote_sente = "";
            if (pieceName.substring(0, 4) == "gote") { 
                gote_sente = "gote";
            }  else if (pieceName.substring(0, 5) == "sente") {
                gote_sente = "sente";
            }
            
            let pieceIndexInObj = defultBoardSetup[pieceName];
            if (pieceIndexInObj[1] == "King" || pieceIndexInObj[1] == "ChallengingKing") { 
                this.gameBoard[pieceIndexInObj[0]] = new king(gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
            } else if (pieceIndexInObj[1] == "GoldGeneral") { 
                this.gameBoard[pieceIndexInObj[0]] = new goldGeneral(gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
            } else if (pieceIndexInObj[1] == "SilverGeneral") { 
                this.gameBoard[pieceIndexInObj[0]] = new silverGeneral(gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
            } else if (pieceIndexInObj[1] == "Rook") { 
                this.gameBoard[pieceIndexInObj[0]] = new rook(gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
            } else if (pieceIndexInObj[1] == "Bishop") { 
                this.gameBoard[pieceIndexInObj[0]] = new bishop(gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
            } else if (pieceIndexInObj[1] == "Knight") { 
                this.gameBoard[pieceIndexInObj[0]] = new knight(gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
            } else if (pieceIndexInObj[1] == "Lance") { 
                this.gameBoard[pieceIndexInObj[0]] = new lance(gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
            } else if (pieceIndexInObj[1] == "Pawn") {
                this.gameBoard[pieceIndexInObj[0]] = new pawn(gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
            }
        }
    }

    initStandPieces() { 
        
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