import {player} from "/player.js";
import {addPossibleMovesEvent, removeEmptyCellEvent, playerTwoView} from "/main.js";
import {defultBoardSetup, defultStandSetups, picesImages} from "/config.js"; 
import {piece, king, goldGeneral, silverGeneral, rook, bishop, knight, lance, pawn} from "/pieces.js";
import {renderNewPieceImage, renderPlaceholderStandPiece, renderCapturedPieceInStand, updateCapturedPieceInStand, removeChildElement, removeOldPossibleMovesStyling, promotionQuestion, winOrLoseDisplay, updatePieceImage, removePieceEventListener, removeStandPieceEventListener } from "/view.js";


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
        this.checked = {"gote": false, "sente": false};
        this.checkmated = {"gote": false, "sente": false};
        this.gotePossibleMovesButter = [];
        this.sentePossibleMovesButter = [];

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

        this.checkAllPiecesForKingCheck(true);
        this.checkAllPiecesForKingCheckMate();
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

        this.checkAllPiecesForKingCheck(true);
        this.checkAllPiecesForKingCheckMate();
    } 


    /*
     Checks if the possible piece move would uncheck the king
     */
     pieceMoveCheckResult(oldPosition, newPosition) { 
        let thisPieceGoteSente; 
        let thisPieceOriginalPromotionStatus;
        let thisPieceNewPromotionStatus;
        let opponentCapturedPiece;

        // If there is a piece in the cell moving to then save and delete it
        let opponentPieceInCell = false;
        if (newPosition in this.gameBoard) {
            opponentPieceInCell = true; 
            opponentCapturedPiece = this.gameBoard[newPosition];
            delete this.gameBoard[newPosition];
        }

        // Putting the piece on the board, setting it's position and getting its promotion
        this.gameBoard[newPosition] = this.gameBoard[oldPosition];
        console.log(this.gameBoard[newPosition]);
        thisPieceOriginalPromotionStatus = this.gameBoard[newPosition].getPromotion();
        this.gameBoard[newPosition].setPosition(newPosition);

        // Getting gote sente and deleting the piece from old position in board
        thisPieceGoteSente = this.gameBoard[newPosition].getGoteSente();
        delete this.gameBoard[oldPosition];

        // Checking if there is a check on the king by moving to this possible move position
        let result = this.checkAllPiecesForKingCheck(false);

        // undoing the temporary movements parameters and deleting from gameboard
        this.gameBoard[oldPosition] = this.gameBoard[newPosition];
        this.gameBoard[oldPosition].setPosition(oldPosition);
        thisPieceNewPromotionStatus = this.gameBoard[oldPosition].getPromotion();
        if (thisPieceOriginalPromotionStatus === false && thisPieceNewPromotionStatus === true) { 
            this.gameBoard[oldPosition].unpromote();
        }
        delete this.gameBoard[newPosition];

        // putting back opponent piece if there was one there
        if (opponentPieceInCell) { 
            this.gameBoard[newPosition] = opponentCapturedPiece;
        }

        return result[thisPieceGoteSente];
    }


    /*
     Checks if a possible pawn drop would checkmate the king
     */
     pawnDropPreventImmediateCheck(oldStandPosition, newPosition) {        
        let thisPieceGoteSente; 
        let thisPieceOriginalPromotionStatus;
        let thisPieceNewPromotionStatus;

        // Getting the piece from the standPieces object, setting its temp position and stand status
        // Getting the pieces promotion and gote sente status
        this.gameBoard[newPosition] = this.standPieces[oldStandPosition][this.standPieces[oldStandPosition].length -1];
        thisPieceOriginalPromotionStatus = this.gameBoard[newPosition].getPromotion();
        this.gameBoard[newPosition].setPosition(newPosition);
        this.gameBoard[newPosition].inStandFalse();
        thisPieceGoteSente = this.gameBoard[newPosition].getGoteSente();
        
        // Checking if the piece is checking the king
        let checkResult = this.pawnCheckIfKingInCheck(newPosition);
        let shouldCheckCheckMate;
        if (thisPieceGoteSente === "gote") { 
            shouldCheckCheckMate = checkResult["sente"];
        } else if (thisPieceGoteSente === "sente") { 
            shouldCheckCheckMate = checkResult["gote"];
        }
        
        // If it is then check for a chekmate
        let checkMateResult = false;
        if (shouldCheckCheckMate) { 
            checkMateResult = this.pawnCheckAllPiecesForKingCheckMate();
        }

        // undoing position, promotion if it changed, and stand status
        this.gameBoard[newPosition].setPosition(oldStandPosition);
        thisPieceNewPromotionStatus = this.gameBoard[newPosition].getPromotion();
        if (thisPieceOriginalPromotionStatus === false && thisPieceNewPromotionStatus === true) { 
            this.gameBoard[newPosition].unpromote();
        }
        this.gameBoard[newPosition].inStandTrue();

        // Deleting it from the gameboard
        delete this.gameBoard[newPosition];

        // Return the appropriate result 
        if (thisPieceGoteSente === "gote") { 
            return checkMateResult["sente"];
        } else if (thisPieceGoteSente === "sente") { 
            return checkMateResult["gote"];
        }
    }


    /*
     Check if king in check by checking if any of the possible moves of any piece
     on the board have a king
     */
     checkAllPiecesForKingCheck(saveCheckResult) { 
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
        
        if (saveCheckResult) { 
            this.checked["sente"] = localSenteCheck;
            this.checked["gote"] = localGoteCheck; 
        }

        console.log("gote: " + this.checked["gote"])
        console.log("sente: " + this.checked["sente"])
        return {"gote": localGoteCheck, "sente": localSenteCheck};
    }


    /*
     Check if king checkmated by checking if a cetrain player has any possible future moves or not
     */
    checkAllPiecesForKingCheckMate() { 
        let localCheckMate = {"gote": true, "sente": true};
        
        for (let shogiPiece in this.gameBoard) { 
            let shogiPieceObj = this.gameBoard[shogiPiece];
            let possibleMoves = shogiPieceObj.getPossibleMoves(false);

            if (possibleMoves.length > 0) { 
                localCheckMate[shogiPieceObj.gote_sente] = false; 
            }

            this.checkmated["sente"] = localCheckMate["sente"];
            this.checkmated["gote"] = localCheckMate["gote"];
        }

        if (this.checkmated["sente"] === true) { 
            if (this.playerTwoView === true) { 
                winOrLoseDisplay(true);
            } else if (this.playerTwoView === false) { 
                winOrLoseDisplay(false);
            }
            this.removeAllEventListeners();
        } else if (this.checkmated["gote"] === true) { 
            if (this.playerTwoView === true) { 
                winOrLoseDisplay(false);
            } else if (this.playerTwoView === false) { 
                winOrLoseDisplay(true);
            }
            this.removeAllEventListeners();
        }

        console.log("checkmate status: ")
        console.log(this.checkmated);
        return {"gote": localCheckMate["gote"], "sente": localCheckMate["sente"]};
    }

    removeAllEventListeners() {
        for (let piecePosition in this.gameBoard) { 
            removePieceEventListener(piecePosition);
        }

        for (let standPiecePosition in this.standPieces) { 
            removeStandPieceEventListener(standPiecePosition);
        }
    }


    /* 
     Checkes if a possible drop of a pawn would check a king
     */
     pawnCheckIfKingInCheck(pieceMovedPosition) { 
        let possibleMoves = this.gameBoard[pieceMovedPosition].getPossibleMoves(false);
        let localSenteCheck = false; 
        let localGoteCheck = false;

        for (let cell of possibleMoves) {
            if (cell in this.gameBoard) {
                if (this.gameBoard[cell].getType() === "King") {
                    localSenteCheck = true;
                } else if (this.gameBoard[cell].getType() === "ChallengingKing") {
                    localGoteCheck = true;
                }
            }
        }

        console.log("gote: " + this.checked["gote"])
        console.log("sente: " + this.checked["sente"])
        return {"gote": localGoteCheck, "sente": localSenteCheck};
    }

    pawnCheckAllPiecesForKingCheckMate() { 
        let localCheckMate = {"gote": true, "sente": true};
        
        for (let shogiPiece in this.gameBoard) { 
            let shogiPieceObj = this.gameBoard[shogiPiece];
            let possibleMoves = shogiPieceObj.getPossibleMoves(false);

            if (possibleMoves.length > 0) { 
                localCheckMate[shogiPieceObj.gote_sente] = false; 
                if (localCheckMate["gote"] === false && localCheckMate["sente"] === false) { 
                    break;
                }
            }
        }

        console.log("checkmate status: ");
        console.log(localCheckMate);
        return {"gote": localCheckMate["gote"], "sente": localCheckMate["sente"]};
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

    // promotes and updates image of a piece
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

