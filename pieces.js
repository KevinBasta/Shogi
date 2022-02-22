import {defultBoardSetup, picesImages} from "/config.js";
import {board} from "/board.js";
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
       console.log(`${this.pieceObjectName} is of type ${this.pieceType} and belongs to ${this.gote_sente}. Currently it's at position ${this.position}.`);
    }

    getPossibleMoves() { 
        
    }

    movepiece(piece, newPosition) { 

    }

    switchOwner(newOwner) { 
        // pop from old player obj array and add to other player's array
    }
}


/* each class below defines it's own legal movments and promotions */
// king
export class king extends piece { 
    
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
        let xPosition = parseInt(this.position.substring(0, 1));
        let yPosition = parseInt(this.position.substring(1, 2));
        // left
        for(let i = xPosition; i <= 9; i++) { 
            movesArray.push(i.toString() + yPosition.toString());
        }
        // right 
        for (let i = xPosition; i >= 1; i--) { 
            movesArray.push(i.toString() + yPosition.toString());
        }

        // up
        for (let i = yPosition; i <= 9; i++) { 
            movesArray.push(xPosition.toString() + i.toString());
        }
        // down
        for (let i = yPosition; i >= 1; i--) { 
            movesArray.push(xPosition.toString() + i.toString());
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
            movesArray.push(xPositionMove.toString() + yPositionMove.toString());
        }
        // right down 
        xPositionMove = xPosition; 
        yPositionMove = yPosition; 
        while (xPositionMove > 1 && yPositionMove < 9) {
            xPositionMove -= 1; 
            yPositionMove += 1;
            movesArray.push(xPositionMove.toString() + yPositionMove.toString());
        }

        // left up 
        xPositionMove = xPosition; 
        yPositionMove = yPosition; 
        while (xPositionMove < 9 && yPositionMove > 1) {
            xPositionMove += 1; 
            yPositionMove -= 1;
            movesArray.push(xPositionMove.toString() + yPositionMove.toString());
        }
        // left down
        xPositionMove = xPosition; 
        yPositionMove = yPosition; 
        while (xPositionMove < 9 && yPositionMove < 9) {
            xPositionMove += 1; 
            yPositionMove += 1;
            movesArray.push(xPositionMove.toString() + yPositionMove.toString());
        }

        return movesArray;
    }
}


// knight and lance
export class knight extends piece { 
    
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
        movesArray.push(this.position.substring(0,1) + (parseInt(this.position.substring(1, 2))-1).toString());
        return movesArray;
    }
}