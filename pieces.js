import {defultBoardSetup, picesImages} from "/config.js";

// super class
export class piece { 
    constructor(gote_sente, pieceType, position) { 
        this.gote_sente = gote_sente; 
        this.pieceType = pieceType;
        this.position = position;
        this.isPromoted = false; 
        this.inCheck = false;
        
        if (this.gote_sente == "sente") { 
            this.isfacingup = true;
        } else if (this.gote_sente == "gote") { 
            this.isfacingup = false;
        }
        
    }

    render() { 
        let position = document.getElementById(this.position);
        let elem = document.createElement("img");
        elem.setAttribute("src", picesImages[this.pieceType]);
        elem.setAttribute("class", "piece");
        if (this.isfacingup == false) {
            elem.setAttribute("class", "piece piece-rotate");
        }
        position.appendChild(elem);
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
    getPossibleMovments() { 
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

}

export class bishop extends piece { 

}


// knight and lance
export class knight extends piece { 
    
}

export class lance extends piece { 
    
}


// pawn 
export class pawn extends piece { 

}