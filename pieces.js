import {defultBoardSetup, picesImages} from "/config.js";
import {board} from "/board.js";
import { getMovementBorder, playerTwoView } from "/main.js";

//import {game} from "/main.js"; 
// super class
export class piece { 
    constructor(gote_sente, pieceType, position, pieceObjectName) { 
        this.gote_sente = gote_sente; 
        this.pieceType = pieceType;
        this.position = position;
        this.pieceObjectName = pieceObjectName;
        this.isPromoted = false; 
        this.inCheck = false;
        
        if (this.gote_sente == "sente") { 
            this.isfacingup = true;
        } else if (this.gote_sente == "gote") { 
            this.isfacingup = false;
        }
        
    }
    
    toString() { 
       return `${this.pieceObjectName} is of type ${this.pieceType} and belongs to ${this.gote_sente}. Currently it's at position ${this.position}.`;
    }

    getPossibleMoves() { 
        
    }

    movepiece(piece, newPosition) { 

    }

    switchOwner(newOwner) { 
        // pop from old player obj array and add to other player's array
    }

    filterMoves(movesList, board) {
        
    }

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
}


/* each class below defines it's own legal movments and promotions */
// king
export class king extends piece { 
/*  don't need a constructor since the piece one would be used instead
    constructor(gote_sente, pieceType, position, pieceObjectName) { 
        super(gote_sente, pieceType, position, pieceObjectName);
    }  */
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

    // Have an upper level function that gets the moves of all the pieces from the other player so that the king doesn't diliberatly die
}


// generals
export class goldGeneral extends piece { 
    /* maybe should interact with an array representation of the board */
    getPossibleMoves() { 
        // different moves for promotion and in check?
    /*  if (isPromoted) { 

        } else if (inCheck) { 
        
        } else { 

        } */
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

        //Bottom Corners
        let resultLeftCorner = getMovementBorder(leftXPos, botYPos, this.gote_sente);
        let processedResultLeftCorner = this.movesHelper(resultLeftCorner, leftXPos, botYPos, movesArray);
        movesArray = processedResultLeftCorner[0]; 
        
        let resultRightCorner = getMovementBorder(rightXPos, botYPos, this.gote_sente);
        let processedResultRightCorner = this.movesHelper(resultRightCorner, rightXPos, botYPos, movesArray);
        movesArray = processedResultRightCorner[0]; 

        return movesArray;
    }
}


// rook and bishop 
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

        return movesArray;
    }
    
}


// knight and lance
export class knight extends piece { 
    getPossibleMoves() { 
        let movesArray = [];
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
        
        let resultLeft = getMovementBorder(leftMoveX, leftMoveY, this.gote_sente);
        let processedResultLeft = this.movesHelper(resultLeft, leftMoveX, leftMoveY, movesArray);
        movesArray = processedResultLeft[0];

        let resultRight = getMovementBorder(rightMoveX, rightMoveY, this.gote_sente);
        let processedResultRight = this.movesHelper(resultRight, rightMoveX, rightMoveY, movesArray);
        movesArray = processedResultRight[0];

        return movesArray;
    }
}

export class lance extends piece { 
    getPossibleMoves() { 
        let movesArray = [];
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
        return movesArray;
    }
}


// pawn 
export class pawn extends piece { 
    getPossibleMoves() { 
        let movesArray = [];
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
        return movesArray;
    }
}