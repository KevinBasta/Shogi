//import {piece, king, goldGeneral, silverGeneral, rook, bishop, knight, lance, pawn} from "/pieces.js";
import {piece} from "/pieces.js";
import {defultBoardSetup, picesImages} from "/config.js";

export class player { 
    constructor(gote_sente, player_bot) { 
        this.gote_sente = gote_sente;
        this.player_bot = player_bot;
        this.pieces = new Array(); //can be changed later in config for custome games
    }

    initpieces() { 
        for (const pieceName in defultBoardSetup) { 
            if (pieceName.substring(0, 4) == this.gote_sente || pieceName.substring(0, 5) == this.gote_sente) { 
                let pieceIndexInObj = defultBoardSetup[pieceName];
                let newPiece = new piece(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0]);
                this.pieces.push(newPiece);
                newPiece.render();
            }
        }
        alert(this.pieces);
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