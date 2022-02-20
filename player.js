class player { 
    constructor(gote_sente, player_bot) { 
        this.gote_sente = gote_sente;
        this.player_bot = player_bot;
        this.pices = new Array(20); //can be changed later in config for custome games
    }

    movePiece(piece, newPosition) {

    }

    getGoteSente() { 
        return this.gote_sente;
    }

}