// super class
class piece { 
    constructor() { 
        let isPromoted = false; 
        let inCheck = false;
        
    }

    movepiece(piece, newPosition) { 

    }

    switchOwner(newOwner) { 
        // pop from old player obj array and add to other player's array
    }
}


/* each class below defines it's own legal movments and promotions */
// king
class king extends piece { 
    
}


// generals
class goldGeneral extends piece { 
    /* maybe should interact with an array representation of the board */
    getPossibleMovments() { 
        if (isPromoted) { 

        } else if (inCheck) { 
        
        } else { 

        }
    }


}

class silverGeneral extends piece { 

}


// rook and bishop 
class rook extends piece { 

}

class bishop extends piece { 

}


// knight and lance
class knight extends piece { 
    
}

class lance extends piece { 
    
}


// pawn 
class pawn extends piece { 

}