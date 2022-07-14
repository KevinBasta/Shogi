import {defultBoardSetup, picesImages} from "/config.js";
import {board} from "/board.js";
import { getMovementBorder, askIfWantsToPromote, kingInCheck, playerTwoView, boardArray } from "/main.js";
//import {game} from "/main.js"; 

// Super class
export class piece { 
    constructor(gote_sente, pieceType, position, pieceObjectName) { 
        this.gote_sente = gote_sente; 
        this.pieceType = pieceType;
        this.position = position;
        this.pieceObjectName = pieceObjectName;
        this.isPromoted = false; 
        this.inStand = false;
        
        this.setFacingDirection();
    }


    // Getters and setters
    getGoteSente() { 
        return this.gote_sente;
    }

    changeGoteSente() { 
        if (this.gote_sente == "sente") { 
            this.gote_sente = "gote";
        } else if (this.gote_sente == "gote") { 
            this.gote_sente = "sente";
        }
        this.setFacingDirection();
    }

    setFacingDirection() { 
        if (this.gote_sente == "sente") { 
            this.isfacingup = true;
        } else if (this.gote_sente == "gote") { 
            this.isfacingup = false;
        }
    }
    
    getType() { 
        return this.pieceType;
    }

    getPromotion() { 
        return this.isPromoted;
    }

    promote() { 
        this.isPromoted = true;
    }

    unpromote() { 
        this.isPromoted = false;
    }

    inStandTrue() { 
        this.inStand = true;
    }

    inStandFalse() { 
        this.inStand = false;
    }

    setPosition(newPosition) {
        this.position = newPosition;
    }

    getPosition() {
        return this.position;
    }

    // Analyzes result of getMovementBorder in main.js
    movesHelper(resultStr, xCoordinate, yCoordinate, movesArr) {
        let brakeLoop = false;
        
        if (resultStr == "empty") {
            movesArr.push(xCoordinate.toString() + yCoordinate.toString());
        } else if (resultStr == "oppositePlayer") {
            movesArr.push(xCoordinate.toString() + yCoordinate.toString());
            brakeLoop = true;
        } else if (resultStr == "samePlayer") {
            brakeLoop = true;
        }

        return [movesArr, brakeLoop];
    }

    checkIfCanPromote(oldPosition, newPosition) { 
        let canPromote = false; 
        this.checkFutureMoves(newPosition);
        if (this.isPromoted === false && this.inStand === false && 
            ((playerTwoView && this.gote_sente === "gote") || 
            (!playerTwoView && this.gote_sente === "sente")) && 
            this.pieceType != "King" && this.pieceType != "ChallengingKing" 
            && this.pieceType != "GoldGeneral") {
            let oldrow = oldPosition.substring(1,2);
            let newrow = newPosition.substring(1,2);
            if (this.gote_sente === "gote") {    
                let goteOpposite = ["7", "8", "9"];
                if (goteOpposite.includes(oldrow) || goteOpposite.includes(newrow)) { 
                    canPromote = true;
                }
            } else { 
                let senteOpposite = ["1", "2", "3"];
                if (senteOpposite.includes(oldrow) || senteOpposite.includes(newrow)) { 
                    canPromote = true;
                }
            }
            console.log(canPromote)
        }

        return canPromote;
    }

    promotedPieceGoldGeneralMovement() { 
        let movesArray = [];

        let xPosition = parseInt(this.position.substring(0, 1));
        let yPosition = parseInt(this.position.substring(1, 2));

        let topYPos;
        let botYPos;
        let leftXPos;
        let rightXPos;

        if (this.gote_sente === "gote") { 
            topYPos = yPosition+1;
            botYPos = yPosition-1;
            leftXPos =  xPosition-1;
            rightXPos = xPosition+1;
        } else { 
            topYPos = yPosition-1;
            botYPos = yPosition+1;
            leftXPos =  xPosition+1;
            rightXPos = xPosition-1;
        }

        // Top Three
        for (let nextX = xPosition-1; nextX <= xPosition+1; nextX++) {
            let result = getMovementBorder(nextX, topYPos, this.gote_sente);
            let processedResult = this.movesHelper(result, nextX, topYPos, movesArray);
            movesArray = processedResult[0]; 
        }
        
        // Left and Right
        let resultLeft = getMovementBorder(leftXPos, yPosition, this.gote_sente);
        let processedResultLeft = this.movesHelper(resultLeft, leftXPos, yPosition, movesArray);
        movesArray = processedResultLeft[0]; 
        
        let resultRight = getMovementBorder(rightXPos, yPosition, this.gote_sente);
        let processedResultRight = this.movesHelper(resultRight, rightXPos, yPosition, movesArray);
        movesArray = processedResultRight[0]; 

        // Bottom One
        let resultBottom = getMovementBorder(xPosition, botYPos, this.gote_sente);
        let processedResultBottom = this.movesHelper(resultBottom, xPosition, botYPos, movesArray);
        movesArray = processedResultBottom[0]; 

        return movesArray;
    }

    // Other
    getPossibleMoves() { 
        // Implemented in all subclasses
    }

    checkFutureMoves(newPosition) { 

    }

    getPossibleDrops(gameBoard) { 
        // Changed in pawn, lance, and knight
        // Used for bishop, rook, gold general, and silver general
        let movesArray = []; 
        
        for (let column = 0; column < boardArray[0].length; column++) { 
            for (let row = 0; row < boardArray.length; row++) { 
                let position = boardArray[row][column];
                if (!(position in gameBoard)) {
                    movesArray.push(position);
                }
            }
        }
        return movesArray;
    }

    movepiece(piece, newPosition) { 
        // Keep in board.js?
    }

    filterMoves(movesList, board) {
        // What was this for again?
    }

    toString() { 
        return `${this.pieceObjectName} is of type ${this.pieceType} and belongs to ${this.gote_sente}. Currently it's at position ${this.position}.`;
     }
}



/*
 Each class below defines it's own legal movments and promotions
 king
 */
export class king extends piece { 
    constructor(gote_sente, pieceType, position, pieceObjectName) { 
        super(gote_sente, pieceType, position, pieceObjectName);
        this.inCheck = false;
    }   

    check() { 
        this.inCheck = true;
    }

    uncheck() { 
        this.inCheck = false;
    }

    setPosition(newPosition) {
        this.position = newPosition;
    }

    getPossibleMoves() { 
        let movesArray = [];
        let xPosition = parseInt(this.position.substring(0, 1));
        let yPosition = parseInt(this.position.substring(1, 2));
        
        for (let nextX = xPosition - 1; nextX < xPosition + 2; nextX++) {
            for (let nextY = yPosition - 1; nextY < yPosition + 2; nextY++) {
                let xPosString = nextX.toString();
                let yPosString = nextY.toString();

                if (this.position != xPosString + yPosString){
                    let result = getMovementBorder(nextX, nextY, this.gote_sente);
                    if (result === "empty" || result === "oppositePlayer") {
                        movesArray.push(xPosString + yPosString);
                    } 
                }

            }
        }        
        return movesArray;
    }
    // Have an upper level function that gets the moves of all the pieces 
    // from the other player so that the king doesn't diliberatly die
}


/* 
 generals
 */
 export class goldGeneral extends piece { 
    setPosition(newPosition) {
        this.position = newPosition;
    }

    getPossibleMoves() { 
        let movesArray = [];

        let xPosition = parseInt(this.position.substring(0, 1));
        let yPosition = parseInt(this.position.substring(1, 2));

        let topYPos;
        let botYPos;
        let leftXPos;
        let rightXPos;

        if (this.gote_sente === "gote") { 
            topYPos = yPosition+1;
            botYPos = yPosition-1;
            leftXPos =  xPosition-1;
            rightXPos = xPosition+1;
        } else { 
            topYPos = yPosition-1;
            botYPos = yPosition+1;
            leftXPos =  xPosition+1;
            rightXPos = xPosition-1;
        }

        // Top Three
        for (let nextX = xPosition-1; nextX <= xPosition+1; nextX++) {
            let result = getMovementBorder(nextX, topYPos, this.gote_sente);
            let processedResult = this.movesHelper(result, nextX, topYPos, movesArray);
            movesArray = processedResult[0]; 
        }
        
        // Left and Right
        let resultLeft = getMovementBorder(leftXPos, yPosition, this.gote_sente);
        let processedResultLeft = this.movesHelper(resultLeft, leftXPos, yPosition, movesArray);
        movesArray = processedResultLeft[0]; 
        
        let resultRight = getMovementBorder(rightXPos, yPosition, this.gote_sente);
        let processedResultRight = this.movesHelper(resultRight, rightXPos, yPosition, movesArray);
        movesArray = processedResultRight[0]; 

        // Bottom One
        let resultBottom = getMovementBorder(xPosition, botYPos, this.gote_sente);
        let processedResultBottom = this.movesHelper(resultBottom, xPosition, botYPos, movesArray);
        movesArray = processedResultBottom[0]; 

        return movesArray;
    }
}

export class silverGeneral extends piece { 
        // different moves for promotion and in check?
    /*  if (isPromoted) { 

        } else if (inCheck) { 
        
        } else { 

        } */
    getPossibleMoves() { 
        let movesArray = [];

        if (!this.isPromoted) {
            let xPosition = parseInt(this.position.substring(0, 1));
            let yPosition = parseInt(this.position.substring(1, 2));

            let topYPos;
            let botYPos;
            let leftXPos;
            let rightXPos;

            if (this.gote_sente === "gote") { 
                topYPos = yPosition+1;
                botYPos = yPosition-1;
                leftXPos =  xPosition-1;
                rightXPos = xPosition+1;
            } else { 
                topYPos = yPosition-1;
                botYPos = yPosition+1;
                leftXPos =  xPosition+1;
                rightXPos = xPosition-1;
            }

            // Top Three
            for (let nextX = xPosition-1; nextX <= xPosition+1; nextX++) {
                let result = getMovementBorder(nextX, topYPos, this.gote_sente);
                let processedResult = this.movesHelper(result, nextX, topYPos, movesArray);
                movesArray = processedResult[0]; 
            }

            //Bottom Corners
            let resultLeftCorner = getMovementBorder(leftXPos, botYPos, this.gote_sente);
            let processedResultLeftCorner = this.movesHelper(resultLeftCorner, leftXPos, botYPos, movesArray);
            movesArray = processedResultLeftCorner[0]; 
            
            let resultRightCorner = getMovementBorder(rightXPos, botYPos, this.gote_sente);
            let processedResultRightCorner = this.movesHelper(resultRightCorner, rightXPos, botYPos, movesArray);
            movesArray = processedResultRightCorner[0]; 
        } else { 
            movesArray = this.promotedPieceGoldGeneralMovement();
        }

        return movesArray;
    }
}


/* 
 rook and bishop 
 */
export class rook extends piece { 
    getPossibleMoves() { 
        let movesArray = [];
        let xPosition = parseInt(this.position.substring(0, 1));
        let yPosition = parseInt(this.position.substring(1, 2));
        
        // left
        for(let nextX = xPosition+1; nextX <= 9; nextX++) { 
            let result = getMovementBorder(nextX, yPosition, this.gote_sente);
            let processedResult = this.movesHelper(result, nextX, yPosition, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // right 
        for (let nextX = xPosition-1; nextX >= 1; nextX--) { 
            let result = getMovementBorder(nextX, yPosition, this.gote_sente);
            let processedResult = this.movesHelper(result, nextX, yPosition, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // up
        for (let nextY = yPosition+1; nextY <= 9; nextY++) { 
            let result = getMovementBorder(xPosition, nextY, this.gote_sente);
            let processedResult = this.movesHelper(result, xPosition, nextY, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // down
        for (let nextY = yPosition-1; nextY >= 1; nextY--) { 
            let result = getMovementBorder(xPosition, nextY, this.gote_sente);
            let processedResult = this.movesHelper(result, xPosition, nextY, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        if (this.isPromoted) {
            for (let nextX = xPosition - 1; nextX < xPosition + 2; nextX++) {
                for (let nextY = yPosition - 1; nextY < yPosition + 2; nextY++) {
                    let xPosString = nextX.toString();
                    let yPosString = nextY.toString();
    
                    if (this.position != xPosString + yPosString && !movesArray.includes(xPosString + yPosString)){
                        let result = getMovementBorder(nextX, nextY, this.gote_sente);
                        if (result === "empty" || result === "oppositePlayer") {
                            movesArray.push(xPosString + yPosString);
                        } 
                    }
    
                }
            }   
        }

        return movesArray;
    }
}

export class bishop extends piece { 
    getPossibleMoves() { 
        let movesArray = [];
        let xPosition = parseInt(this.position.substring(0, 1));
        let yPosition = parseInt(this.position.substring(1, 2));

        // right up
        let xPositionMove = xPosition; 
        let yPositionMove = yPosition; 
        while (xPositionMove > 1 && yPositionMove > 1) {
            xPositionMove -= 1; 
            yPositionMove -= 1;
            let result = getMovementBorder(xPositionMove, yPositionMove, this.gote_sente);
            let processedResult = this.movesHelper(result, xPositionMove, yPositionMove, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // right down 
        xPositionMove = xPosition; 
        yPositionMove = yPosition; 
        while (xPositionMove > 1 && yPositionMove < 9) {
            xPositionMove -= 1; 
            yPositionMove += 1;
            let result = getMovementBorder(xPositionMove, yPositionMove, this.gote_sente);
            let processedResult = this.movesHelper(result, xPositionMove, yPositionMove, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // left up 
        xPositionMove = xPosition; 
        yPositionMove = yPosition; 
        while (xPositionMove < 9 && yPositionMove > 1) {
            xPositionMove += 1; 
            yPositionMove -= 1;
            let result = getMovementBorder(xPositionMove, yPositionMove, this.gote_sente);
            let processedResult = this.movesHelper(result, xPositionMove, yPositionMove, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // left down
        xPositionMove = xPosition; 
        yPositionMove = yPosition; 
        while (xPositionMove < 9 && yPositionMove < 9) {
            xPositionMove += 1; 
            yPositionMove += 1;
            let result = getMovementBorder(xPositionMove, yPositionMove, this.gote_sente);
            let processedResult = this.movesHelper(result, xPositionMove, yPositionMove, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        if (this.isPromoted) {
            for (let nextX = xPosition - 1; nextX < xPosition + 2; nextX++) {
                for (let nextY = yPosition - 1; nextY < yPosition + 2; nextY++) {
                    let xPosString = nextX.toString();
                    let yPosString = nextY.toString();
    
                    if (this.position != xPosString + yPosString && !movesArray.includes(xPosString + yPosString)){
                        let result = getMovementBorder(nextX, nextY, this.gote_sente);
                        if (result === "empty" || result === "oppositePlayer") {
                            movesArray.push(xPosString + yPosString);
                        } 
                    }
    
                }
            }   
        }

        return movesArray;
    }
}


/* 
 knight and lance
 */
export class knight extends piece { 
    setPosition(newPosition) {
        this.position = newPosition;

        // If a knight moves into the last two opposit cells it gets promoted
        // due to not having any future moves
        this.checkFutureMoves(this.position);
    }

    checkFutureMoves(newPosition) { 
        if (this.inStand === false) {
            let pieceInLastRank = [];
            if (this.gote_sente === "gote") {
                pieceInLastRank.push(...boardArray[boardArray.length - 1].filter(cell => newPosition == cell));
                pieceInLastRank.push(...boardArray[boardArray.length - 2].filter(cell => newPosition == cell));
            } else { 
                pieceInLastRank.push(...boardArray[0].filter(cell => newPosition == cell));
                pieceInLastRank.push(...boardArray[1].filter(cell => newPosition == cell));
            }
            console.log(pieceInLastRank);
            if (pieceInLastRank.length === 1) {
                this.isPromoted = true;
            } 
        }
    }

    getPossibleMoves() { 
        let movesArray = [];

        if (!this.isPromoted) {
            let xPosition = parseInt(this.position.substring(0, 1));
            let yPosition = parseInt(this.position.substring(1, 2));
            let leftMoveX;
            let leftMoveY;
            let rightMoveX;
            let rightMoveY;

            if (this.gote_sente === "gote") { 
                leftMoveX = xPosition-1;
                leftMoveY = yPosition+2;
                rightMoveX = xPosition+1;
                rightMoveY = yPosition+2;
            } else { 
                leftMoveX = xPosition-1;
                leftMoveY = yPosition-2;
                rightMoveX = xPosition+1;
                rightMoveY = yPosition-2;
            }
            
            // Top left
            let resultLeft = getMovementBorder(leftMoveX, leftMoveY, this.gote_sente);
            let processedResultLeft = this.movesHelper(resultLeft, leftMoveX, leftMoveY, movesArray);
            movesArray = processedResultLeft[0];

            // Top Right
            let resultRight = getMovementBorder(rightMoveX, rightMoveY, this.gote_sente);
            let processedResultRight = this.movesHelper(resultRight, rightMoveX, rightMoveY, movesArray);
            movesArray = processedResultRight[0];
        } else { 
            movesArray = this.promotedPieceGoldGeneralMovement();
        }

        return movesArray;
    }

    getPossibleDrops(gameBoard) {
        let movesArray = []; 
        let dropAllowFutureMovesStart; 
        let dropAllowFutureMovesEnd;
        
        if (this.gote_sente === "gote") {
            dropAllowFutureMovesStart = 0;
            dropAllowFutureMovesEnd = boardArray.length - 2;
        } else { 
            dropAllowFutureMovesStart = 2;
            dropAllowFutureMovesEnd = boardArray.length;
        }

        for (let column = 0; column < boardArray[0].length; column++) { 
            for (let row = dropAllowFutureMovesStart; row < dropAllowFutureMovesEnd; row++) { 
                let position = boardArray[row][column];
                if (!(position in gameBoard)) {
                    movesArray.push(position);
                }
            }
        }
        return movesArray;
    }
}

export class lance extends piece { 
    setPosition(newPosition) {
        this.position = newPosition;

        // If a lance moves into the last opposit cell it gets promoted
        // due to not having any future moves
        this.checkFutureMoves(this.position);
    }

    checkFutureMoves(newPosition) { 
        if (this.inStand === false) {
            let pieceInLastRank;
            if (this.gote_sente === "gote") {
                pieceInLastRank = boardArray[boardArray.length - 1].filter(cell => newPosition == cell);
            } else { 
                pieceInLastRank = boardArray[0].filter(cell => newPosition == cell);
            }
            
            if (pieceInLastRank.length === 1) {
                this.isPromoted = true;
            }
        }
    }

    getPossibleMoves() { 
        let movesArray = [];
        if (!this.isPromoted) {
            let xPosition = parseInt(this.position.substring(0, 1));
            let yPosition = parseInt(this.position.substring(1, 2));

            if (this.gote_sente === "gote") {
                for (let nextY = yPosition + 1; nextY <= 9; nextY++) {
                    let result = getMovementBorder(xPosition, nextY, this.gote_sente);
                    let processedResult = this.movesHelper(result, xPosition, nextY, movesArray);
                    movesArray = processedResult[0];
                    if (processedResult[1]) break;
                }
            } else { 
                for (let nextY = yPosition - 1; nextY >= 1; nextY--) {
                    let result = getMovementBorder(xPosition, nextY, this.gote_sente);
                    let processedResult = this.movesHelper(result, xPosition, nextY, movesArray);
                    movesArray = processedResult[0];
                    if (processedResult[1]) break;
                }
            }
        } else { 
            movesArray = this.promotedPieceGoldGeneralMovement();
        }

        return movesArray;
    }

    getPossibleDrops(gameBoard) {
        let movesArray = []; 
        let dropAllowFutureMovesStart; 
        let dropAllowFutureMovesEnd;
        
        if (this.gote_sente === "gote") {
            dropAllowFutureMovesStart = 0;
            dropAllowFutureMovesEnd = boardArray.length - 1;
        } else { 
            dropAllowFutureMovesStart = 1;
            dropAllowFutureMovesEnd = boardArray.length;
        }

        for (let column = 0; column < boardArray[0].length; column++) { 
            for (let row = dropAllowFutureMovesStart; row < dropAllowFutureMovesEnd; row++) { 
                let position = boardArray[row][column];
                if (!(position in gameBoard)) {
                    movesArray.push(position);
                }
            }
        }
        return movesArray;
    }
}


/*
 pawn
 */ 
export class pawn extends piece { 
    setPosition(newPosition) {
        this.position = newPosition;

        // If a pawn moves into the last opposit cell it gets promoted
        // due to not having any future moves
        this.checkFutureMoves(this.position);
    }

    checkFutureMoves(newPosition) {
        console.log('checking...') 
        if (this.inStand === false) {
            let pieceInLastRank;
            if (this.gote_sente === "gote") {
                pieceInLastRank = boardArray[boardArray.length - 1].filter(cell => newPosition == cell);
            } else { 
                pieceInLastRank = boardArray[0].filter(cell => newPosition == cell);
            }

            if (pieceInLastRank.length === 1) {
                this.isPromoted = true;
            }
        }
    }

    getPossibleMoves() { 
        let movesArray = [];

        let kingInCheckArr = kingInCheck(this.gote_sente);
        if (kingInCheckArr[0] === true) { 
            let opponentPieceMovesArray = kingInCheckArr[1];
            let opponentPosition = kingInCheckArr[2];
            let playerPieceMovesArray = this.standardMovement();

            console.log(opponentPieceMovesArray);
            console.log(playerPieceMovesArray);

            let commonMoves = playerPieceMovesArray.filter(cell => opponentPieceMovesArray.includes(cell));
            console.log(commonMoves)
            movesArray = commonMoves;

        } else { 
            movesArray = this.standardMovement();
        }

        return movesArray;
    }

    standardMovement() { 
        let movesArray = [];
        if (!this.isPromoted) {
            let xPosition = parseInt(this.position.substring(0, 1));
            let yPosition = parseInt(this.position.substring(1, 2));

            if (this.gote_sente === "gote") { 
                let yLocalPosChange = yPosition+1;

                let result = getMovementBorder(xPosition, yLocalPosChange, this.gote_sente);
                let processedResult = this.movesHelper(result, xPosition, yLocalPosChange, movesArray);
                movesArray = processedResult[0];
            } else { 
                let yLocalPosChange = yPosition-1;

                let result = getMovementBorder(xPosition, yLocalPosChange, this.gote_sente);
                let processedResult = this.movesHelper(result, xPosition, yLocalPosChange, movesArray);
                movesArray = processedResult[0];
            }
        } else { 
            movesArray = this.promotedPieceGoldGeneralMovement();
        } 
        
        return movesArray;
    }

    getPossibleDrops(gameBoard) {
        // ***still need to implement: A pawn may not be dropped to give an immediate checkmate
        // No two pawns in one file (unless one is promoted)
        let movesArray = []; 
        let dropAllowFutureMovesStart; 
        let dropAllowFutureMovesEnd;
        
        if (this.gote_sente === "gote") {
            dropAllowFutureMovesStart = 0;
            dropAllowFutureMovesEnd = boardArray.length - 1;
        } else { 
            dropAllowFutureMovesStart = 1;
            dropAllowFutureMovesEnd = boardArray.length;
        }

        for (let column = 0; column < boardArray[0].length; column++) { 
            let tempMovesArray = [];
            for (let row = dropAllowFutureMovesStart; row < dropAllowFutureMovesEnd; row++) { 
                let position = boardArray[row][column];
                if (position in gameBoard) {
                    if (gameBoard[position].getType() == "Pawn" && gameBoard[position].getPromotion() == false && this.gote_sente == gameBoard[position].getGoteSente()) {
                        tempMovesArray = [];
                        break;
                    }
                } else {
                    tempMovesArray.push(position);
                } 
            }
            movesArray.push(...tempMovesArray);
        }
        return movesArray;
    }
}