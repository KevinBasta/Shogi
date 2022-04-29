import {piece, king, goldGeneral, silverGeneral, rook, bishop, knight, lance, pawn} from "/pieces.js";
import {defultBoardSetup, picesImages} from "/config.js";

export class player { 
    constructor(gote_sente, player_bot) { 
        this.gote_sente = gote_sente;
        this.player_bot = player_bot;
        this.pieces = {}; //can be changed later in config for custome games
    }

    // Initializes all the player pices with the appropriate piece subclass
    initpieces() { 
        for (const pieceName in defultBoardSetup) { 
            if (pieceName.substring(0, 4) == this.gote_sente || pieceName.substring(0, 5) == this.gote_sente) { 
                let pieceIndexInObj = defultBoardSetup[pieceName];
                if (pieceIndexInObj[1] == "King" || pieceIndexInObj[1] == "ChallengingKing") { 
                    this.pieces[pieceName] = new king(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
                } else if (pieceIndexInObj[1] == "GoldGeneral") { 
                    this.pieces[pieceName] = new goldGeneral(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
                } else if (pieceIndexInObj[1] == "SilverGeneral") { 
                    this.pieces[pieceName] = new silverGeneral(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
                } else if (pieceIndexInObj[1] == "Rook") { 
                    this.pieces[pieceName] = new rook(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
                } else if (pieceIndexInObj[1] == "Bishop") { 
                    this.pieces[pieceName] = new bishop(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
                } else if (pieceIndexInObj[1] == "Knight") { 
                    this.pieces[pieceName] = new knight(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
                } else if (pieceIndexInObj[1] == "Lance") { 
                    this.pieces[pieceName] = new lance(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
                } else if (pieceIndexInObj[1] == "Pawn") {
                    this.pieces[pieceName] = new pawn(this.gote_sente, pieceIndexInObj[1], pieceIndexInObj[0], pieceName);
                }
            }
        }
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

    givePieceOwnership(pieceObj, otherPlayer) {
/*         if (pieceObj.gote_sente == "gote") { 
            pieceObj.gote_sente = "sente";
        } else if (pieceObj.gote_sente == "sente") { 
            pieceObj.gote_sente = "gote";
        }
        otherPlayer[pieceObj] = this.pieces[pieceObj];
        delete this.pieces[pieceObj]; */
    }

    addPiece(pieceObj) { 
        this.pieces[pieceObj] = pieceObj;
        //pieceObj set direction and gote/sente reset promotion etc..
    }

    movePiece(piece, newPosition) {

    }

    getGoteSente() { 
        return this.gote_sente;
    }

}