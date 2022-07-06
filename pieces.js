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
        for (let i = xPosition - 1; i < xPosition + 2; i++) {
            for (let j = yPosition - 1; j < yPosition + 2; j++) {
                let xPosString = i.toString();
                let yPosString = j.toString();

                if (this.position != xPosString + yPosString){
                    let result = getMovementBorder(xPosString, yPosString, this.gote_sente);
                    if (result === "empty" || result === "oppositePlayer") {
                        movesArray.push(xPosString + yPosString);
                    } 
                }

            }
        }        
        return movesArray;
    }
}


// generals
export class goldGeneral extends piece { 
    /* maybe should interact with an array representation of the board */
    getPossibleMoves() { 
        if (isPromoted) { 

        } else if (inCheck) { 
        
        } else { 

        }
    }


}

export class silverGeneral extends piece { 

}


// rook and bishop 
export class rook extends piece { 
    getPossibleMoves() { 
        let movesArray = [];
        let xPosString = this.position.substring(0, 1);
        let yPosString = this.position.substring(1, 2);

        let xPosition = parseInt(xPosString);
        let yPosition = parseInt(yPosString);
        
        
        // left
        for(let nextX = xPosition+1; nextX <= 9; nextX++) { 
            let result = getMovementBorder(nextX.toString(), yPosString, this.gote_sente);
            let processedResult = this.movesHelper(result, nextX, yPosition, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // right 
        for (let nextX = xPosition-1; nextX >= 1; nextX--) { 
            let result = getMovementBorder(nextX.toString(), yPosString, this.gote_sente);
            let processedResult = this.movesHelper(result, nextX, yPosition, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // up
        for (let nextY = yPosition+1; nextY <= 9; nextY++) { 
            let result = getMovementBorder(xPosString, nextY.toString(), this.gote_sente);
            let processedResult = this.movesHelper(result, xPosition, nextY, movesArray);
            movesArray = processedResult[0];
            if (processedResult[1]) break;
        }

        // down
        for (let nextY = yPosition-1; nextY >= 1; nextY--) { 
            let result = getMovementBorder(xPosString, nextY.toString(), this.gote_sente);
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
            let result = getMovementBorder(xPositionMove.toString(), yPositionMove.toString(), this.gote_sente);
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
            let result = getMovementBorder(xPositionMove.toString(), yPositionMove.toString(), this.gote_sente);
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
            let result = getMovementBorder(xPositionMove.toString(), yPositionMove.toString(), this.gote_sente);
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
            let result = getMovementBorder(xPositionMove.toString(), yPositionMove.toString(), this.gote_sente);
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
        movesArray.push((xPosition+1).toString() + (yPosition-2).toString());
        movesArray.push((xPosition-1).toString() + (yPosition-2).toString());
        return movesArray;
    }
}

export class lance extends piece { 
    getPossibleMoves() { 
        let movesArray = [];
        let xPosition = parseInt(this.position.substring(0, 1));
        let yPosition = parseInt(this.position.substring(1, 2));
        for (let i = yPosition; i >= 1; i--) {
            movesArray.push(xPosition.toString() + i.toString());
        }
        return movesArray;
    }
}


// pawn 
export class pawn extends piece { 
    // problem <-- the movemnet would be differnet for the different players? 
    getPossibleMoves() { 
        let movesArray = [];
        //if (playerTwoView) { 
            //movesArray.push(this.position.substring(0,1) + (parseInt(this.position.substring(1, 2))+1).toString());
        //} else { 
            //}
        movesArray.push(this.position.substring(0,1) + (parseInt(this.position.substring(1, 2))-1).toString());
        return movesArray;
    }
}