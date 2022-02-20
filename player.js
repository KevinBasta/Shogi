class player { 
    constructor(gote_sente, player_bot) { 
        this.gote_sente = gote_sente;
        this.player_bot = player_bot;
        this.pieces = new Array(20); //can be changed later in config for custome games
    }

    givePieceOwnership(pieceObj, otherPlayer) {
        let pieceIndex = this.pices.indexOf(pieceObj);
        let pieceTransfered = this.pieces.splice(pieceIndex);
        otherPlayer.addPiece(pieceTransfered);
    }

    addPiece(pieceObj) { 
        this.pieces.push(pieceObj);
        //pieceObj set direction and gote/sente reset promotion etc..
    }

    movePiece(piece, newPosition) {
        
    }

    getGoteSente() { 
        return this.gote_sente;
    }

}