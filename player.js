import {piece, king, goldGeneral, silverGeneral, rook, bishop, knight, lance, pawn} from "/pieces.js";
import {defultBoardSetup, picesImages} from "/config.js";
// Get rid of this class? 
// it does nothing
export class player { 
    constructor(gote_sente, player_bot) { 
        this.gote_sente = gote_sente;
        this.player_bot = player_bot;
        this.pieces = {}; //can be changed later in config for custome games
    }
    
    piecesReturnTest() { 
        return this.pieces;
    }

    getPieces(fullBoard) { 
        // why not just return this.pieces? 
        for (let playerPiece in this.pieces) { 
            fullBoard[playerPiece] = this.pieces[playerPiece]; 
        }
        return fullBoard;
    }

    getPieceMoves(boardPiece) {
        let movePositions = boardPiece.getPossibleMoves(); 
        console.log(movePositions);
    }

    getPieceOwnership(pieceObj, otherPlayer) {
        pieceObj.changeGoteSente();
        pieceObj.changeFacingDirection();
    }

    addPiece(pieceObj) { 
        
        this.pieces[pieceObj] = pieceObj;
        //pieceObj set direction and gote/sente reset promotion etc..
    }

    deletePiece(pieceObj) {
        delete this.pieces[this.pieceObj];
    }

    movePiece(piece, newPosition) {

    }

    getGoteSente() { 
        return this.gote_sente;
    }

}