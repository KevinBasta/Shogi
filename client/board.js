import {player} from "/player.js";
import {addPossibleMovesEvent, removeEmptyCellEvent, playerTwoView} from "/main.js";
import {defultBoardSetup, defultStandSetups, picesImages} from "/config.js"; 
import {piece, king, goldGeneral, silverGeneral, rook, bishop, knight, lance, pawn} from "/pieces.js";
import {renderNewPieceImage, renderPlaceholderStandPiece, renderCapturedPieceInStand, updateCapturedPieceInStand, removeChildElement, removeOldPossibleMovesStyling, promotionQuestion, updatePieceImage} from "/view.js";


/*
 Class for controlling most of the game mechanics and logic.
 Changes data representation here and ui with view.js
 */
export class board { 
    constructor(player1, player2, playerTwoView, lastClicked) { 
        this.gameBoard = {};
        this.standPieces = {};

        this.logTurnNumber = 1;
        this.lastBoardStates = [];

        this.playerTwoView = playerTwoView;
        this.lastClicked = lastClicked;
        this.checkingPiece;
        this.goteChecked = false; 
        this.senteChecked = false;

        this.player1 = player1;
        this.player2 = player2;
        
        this.initpieces();

        console.log(this.gameBoard);
    }


    /*
     Renders the initial state of the board and piece stands
     */
    render() { 
        // Rendering game board
        for (let i in this.gameBoard) { 
            renderNewPieceImage(i, this.gameBoard);
        }
        // Rendering stand pieces placeholders
        for (const pieceName in defultStandSetups) { 
            let pieceIndexInObj = defultStandSetups[pieceName];
            renderPlaceholderStandPiece(pieceIndexInObj[0], pieceIndexInObj[1], pieceName);
        }
        console.log(this.standPieces);
    }

    /*
     Rerenders the gameboard ui and data
     */
    rerender(newGameBoard) {
        // Deleting all the old pieces
        for (let i in this.gameBoard) { 
            removeChildElement(i, `img`);
        }
        // Changing current gameboard to the new gamebboard
        this.gameBoard = newGameBoard;
        // Rendering the new gameboard 
        for (let i in this.gameBoard) { 
            renderNewPieceImage(i, this.gameBoard);
        }
    }


    /*
     Moves a piece in the data and ui
     */
    movePiece(oldPosition, newPosition) { 
        // If the target position has an opponent piece [can add extra check of gote sente]
        if (newPosition in this.gameBoard) {    
            // Getting rid of opponent piece from ui
            removeChildElement(newPosition, `[pieceName=${this.gameBoard[newPosition].pieceObjectName}]`);

            // Gettind rid of opponent piece from game board object
            let opponentCapturedPiece = this.gameBoard[newPosition];
            this.capturedPieceParametersChange(opponentCapturedPiece);
            delete this.gameBoard[newPosition];
        }

        // Getting rid of the current piece on the board from its old position in ui
        removeChildElement(oldPosition, `[pieceName=${this.gameBoard[oldPosition].pieceObjectName}]`)
        
        // Adding the new position as a key on the game board & deleting old one
        this.gameBoard[newPosition] = this.gameBoard[oldPosition];
        this.gameBoard[newPosition].setPosition(newPosition);
        delete this.gameBoard[oldPosition];

        // Creating new image element for the piece and appending it to new cell
        renderNewPieceImage(newPosition, this.gameBoard);

        // Getting rid of old possible move styling and events
        removeOldPossibleMovesStyling(this.lastClicked[1]);

        this.checkAllPiecesForKingCheck();
    }

    // Unused
    checkIfKingInCheck(pieceMovedPosition) { 
        let possibleMoves = this.gameBoard[pieceMovedPosition].getPossibleMoves(false);
        let localSenteCheck = false; 
        let localGoteCheck = false;
        console.log(possibleMoves);
        for (let cell of possibleMoves) {
            console.log("bing bong bing bong")
            console.log(cell)
            if (cell in this.gameBoard) {
                if (this.gameBoard[cell].getType() === "King") {
                    console.log("sente checked")
                    this.gameBoard[cell].check();
                    this.checkingPiece = this.gameBoard[pieceMovedPosition];
                    localSenteCheck = true;
                } else if (this.gameBoard[cell].getType() === "ChallengingKing") {
                    console.log("gote checked")
                    this.gameBoard[cell].check();
                    this.checkingPiece = this.gameBoard[pieceMovedPosition];
                    localGoteCheck = true;
                }
            }
        }

        this.senteChecked = localSenteCheck; 
        this.goteChecked = localGoteCheck;
    }

    // check if king in check but check all pieces for one player first
    // then the other player
    checkAllPiecesForKingCheck() { 
        let localSenteCheck = false; 
        let localGoteCheck = false;

        for (let shogiPiece in this.gameBoard) { 
            let possibleMoves = this.gameBoard[shogiPiece].getPossibleMoves(true);
            for (let cell of possibleMoves) { 
                if (cell in this.gameBoard) { 
                    if (this.gameBoard[cell].getType() === "King") { 
                        console.log("sente checked")
                        this.gameBoard[cell].check();
                        this.checkingPiece = this.gameBoard[shogiPiece];
                        localSenteCheck = true;
                    } else if (this.gameBoard[cell].getType() === "ChallengingKing") { 
                        console.log("gote checked")
                        this.gameBoard[cell].check();
                        this.checkingPiece = this.gameBoard[shogiPiece];
                        localGoteCheck = true;
                    }
                }
            }
        }
        
        this.senteChecked = localSenteCheck; 
        this.goteChecked = localGoteCheck;
        console.log("gote: " + this.goteChecked)
        console.log("sente: " + this.senteChecked)
        return {"gote": this.goteChecked, "sente": this.senteChecked};
    }

    pieceMoveCheckResult(oldPosition, newPosition) { 
        let thisPieceGoteSente; 
        let opponentCapturedPiece;
        let opponentPieceInCell = false;
        if (newPosition in this.gameBoard) {
            opponentPieceInCell = true; 
            opponentCapturedPiece = this.gameBoard[newPosition];
            delete this.gameBoard[newPosition];
        }

        this.gameBoard[newPosition] = this.gameBoard[oldPosition];
        console.log(this.gameBoard[newPosition]);
        this.gameBoard[newPosition].setPosition(newPosition);

        thisPieceGoteSente = this.gameBoard[newPosition].getGoteSente();
        delete this.gameBoard[oldPosition];

        let result = this.checkAllPiecesForKingCheck();

        // undoing the temporary movements
        this.gameBoard[oldPosition] = this.gameBoard[newPosition];
        this.gameBoard[oldPosition].setPosition(oldPosition);
        delete this.gameBoard[newPosition];

        if (opponentPieceInCell) { 
            this.gameBoard[newPosition] = opponentCapturedPiece;
        }

        this.checkAllPiecesForKingCheck();
        return result[thisPieceGoteSente];
    }


    /*
     Moves a piece from the stand in the data and ui
     */
    movePieceFromStand(standPosition, positionInBoard) { 
        // Removing the piece from the stand data
        let pieceToDrop = this.removeStandPiece(standPosition);

        // Updating stand ui
        updateCapturedPieceInStand(standPosition, this.standPieces[standPosition].length);

        // Adding piece to gameboard
        this.gameBoard[positionInBoard] = pieceToDrop;
        this.gameBoard[positionInBoard].setPosition(positionInBoard);
        this.gameBoard[positionInBoard].inStandFalse();

        // Creating new image element for the piece and appending it to new cell
        renderNewPieceImage(positionInBoard, this.gameBoard);

        // Getting rid of old possible move styling and events
        removeOldPossibleMovesStyling(this.lastClicked[1]);
    } 

    /*
     Changes the properties of a captured piece 
     */
     capturedPieceParametersChange(opponentCapturedPiece) { 
        // Each piece first array index is the player and second is opponent
        let standPiecesMap = { 
            "Pawn": ["p0", "o7"],
            "Lance": ["p1", "o8"],
            "Knight": ["p2", "o9"],
            "SilverGeneral": ["p3", "o10"],
            "GoldGeneral": ["p4", "o11"],
            "Rook": ["p5", "o12"],
            "Bishop": ["p6", "o13"]
        }
        
        // chaning gote/sente value and finding the piece position in the stands
        if (opponentCapturedPiece.getType() != "King" && opponentCapturedPiece.getType() != "ChallengingKing" ) {
            let positionInStand;

            opponentCapturedPiece.changeGoteSente();
            if (opponentCapturedPiece.getGoteSente() === "gote") { 
                positionInStand = standPiecesMap[opponentCapturedPiece.getType()][1];
            } else if (opponentCapturedPiece.getGoteSente() === "sente") { 
                positionInStand = standPiecesMap[opponentCapturedPiece.getType()][0];           
            }

            opponentCapturedPiece.unpromote();
            opponentCapturedPiece.inStandTrue();
            opponentCapturedPiece.setPosition(positionInStand);
            let opponentCapturedPieceTotal = this.addStandPiece(positionInStand, opponentCapturedPiece);

            // Shows the piece on the appropriate piece stand
            renderCapturedPieceInStand(positionInStand, opponentCapturedPieceTotal);
        }
    }

    promotePieceHandle(piecePosition) {
        //console.log(piecePosition);
        this.gameBoard[piecePosition].promote();
        //console.log(this.gameBoard[piecePosition])
        updatePieceImage(piecePosition, this.gameBoard);
    }

    /*
     Initializes pieces data from config.js
     */
    initpieces() { 
        for (const pieceName in defultBoardSetup) { 
            // Setting sente and gote pices based on piece name
            let gote_sente = "";
            if (pieceName.substring(0, 4) == "gote") { 
                gote_sente = "gote";
            }  else if (pieceName.substring(0, 5) == "sente") {
                gote_sente = "sente";
            }
            
            // Creating a piece object with the appropriate class based on the piece type from config.js
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

        // Giving each player an array for each piece in their piece stand
        for (const pieceName in defultStandSetups) { 
            this.standPieces[defultStandSetups[pieceName][0]] = [];
        }
    }

    // Adds a piece to standPieces obj data
    addStandPiece(piecePosition, pieceCaptured) {
        this.standPieces[piecePosition].push(pieceCaptured);

        return this.standPieces[piecePosition].length;
    }

    // Removes a piece from the standPieces obj data
    removeStandPiece(piecePosition) {
        console.log(this.standPieces[piecePosition]);
        let pieceToDrop = this.standPieces[piecePosition].pop();

        return pieceToDrop;
    }

    /*
     returns gameboard
     */
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

