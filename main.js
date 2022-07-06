import { player } from "/player.js";
import { board } from "/board.js";
import { piece } from "/pieces.js";

export let playerTwoView = true; //for flipping the view <-- would need a variable based on socket api

// labeling each shogi cell with ids and text
const rows = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const rowsKanji = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

let boardArray = [[],[],[],[],[],[],[],[],[]];
let columnCounter;
let rowCounter;

if (playerTwoView) {
    columnCounter = 1;
    rowCounter = 8;
} else { 
    columnCounter = 9;
    rowCounter = 0;
}

let element = document.getElementById('shogiBoard');
let children = element.children;

for (let child of children) {
    let label = columnCounter + rows[rowCounter];
    boardArray[rowCounter][Math.abs(columnCounter-9)] = (columnCounter.toString() + rows[rowCounter].toString());
    let spanText = document.createElement("span");

    spanText.innerHTML = label;
    spanText.setAttribute("class", "cell-label");

    child.setAttribute("id", label);
    child.appendChild(spanText);

    if (playerTwoView) { 
        columnCounter += 1;
        if (columnCounter == 10) {
            columnCounter = 1;
            rowCounter -= 1;
        }
    } else { 
        columnCounter -= 1;
        if (columnCounter == 0) {
            columnCounter = 9;
            rowCounter += 1;
        }
    }
}
console.log(boardArray);


// game initialization
let player1 = new player("sente", false);
let player2 = new player("gote", false);
let lastClicked = ["", []];

let game = new board(player1, player2, playerTwoView, lastClicked);
game.render();
//console.log(player1.pieces);
//console.log(game.gameBoard);


// adding event listener to each piece
export function addEvent(elem) {
    elem.addEventListener("click", function (e) {
        //let pieceObject = game.gameBoard[e.target.getAttribute("pieceName")];
        let pieceObject = game.gameBoard[e.target.parentElement.getAttribute('id')];
        //console.log(e.target.parentElement.getAttribute('id'));
        let possibleMoveCellsArray = pieceObject.getPossibleMoves();
        
        // HERE
        // use this to determine if you can capture that piece OR if it's your own piece that you
        // can't bypass
/*         if (pieceObject.player1orplayer2 == "player1") { 
            let thisPlayerPieces = player1.getPieces(); 
            let otherPlayerPieces = player2.getPieces();
        } else if (pieceObject.player1orplayer2 == "player2") { 
            let thisPlayerPieces = player2.getPieces();
            let otherPlayerPieces = player1.getPieces(); 
        } */

        // if the last piece clicked is not the same as the current piece clicked
        // then reset the cell possible move identifiers
        if (game.lastClicked[0] != pieceObject) { 
            for (let i of game.lastClicked[1]) { 
                let position = document.getElementById(i);
                position.setAttribute("class", "");
                position.setAttribute("click", "false");
            }
        }
        
        game.lastClicked[0] = pieceObject;
        game.lastClicked[1] = possibleMoveCellsArray; 
        
        for (let i of possibleMoveCellsArray) { 
            let position = document.getElementById(i);
            if (position.getAttribute("click") == "true") { 
                position.setAttribute("class", "");
                position.setAttribute("click", "false");
            } else { 
                position.setAttribute("class", "piece-possible-move-position");
                position.setAttribute("click", "true");
            }
            
        }
        let messageString = pieceObject.toString() + " from server!"; 
        //sock.emit('turn', messageString);
    });
}

function moveStop(cellToCheck, gote_sente) {
    if (cellToCheck in tempboard) { 
        if (cellToCheck in game.gameBoard) { 
            let nextCellPieceObj = game.gameBoard[cellToCheck];
            if (nextCellPieceObj.gote_sente === gote_sente) {
                return "samePlayer";
            }
            return "oppositePlayer";
        }
        return "empty";
    }

    // Three return types samePlayer, oppositePlayer, edge, empty
    return "edge";
}


export function getMovementBorder(xPositionInt, yPositionInt, gote_sente) {


    // [up, down, left, right]
    // format pieceObj, piceposition, squaresbetween
/*     let closestPieces = [[], [], [], []];
    for (let piece of game.gameBoard) { 
        let playingPiecePosition = pieceObject.position;
        let playingPiecePositionX = parseInt(playingPiecePosition.substring(0,1));
        let playingPiecePositionY = parseInt(playingPiecePosition.substring(1,2));

        let checkingPiecePoseition = piece.position; 
        let checkingPiecePoseitionX = parseInt(checkingPiecePoseition.substring(0,1));
        let checkingPiecePoseitionY = parseInt(checkingPiecePoseition.substring(1,2));
    } */
    // should include other player's pieces too but not own's pieces
    // have to figure out how multiplayer works first
/*     for (let piece in game.gameBoard) { 
        if (game.gameBoard[piece].position == cellCheck && piece.gote_sente == gote_sente) { 
            but then how do you define only being able to hit this one if it's the opposite player's 
            piece but not the one after it? 
            return true;
        }
    } */
    let xPosString = xPositionInt.toString();
    let yPosString = yPositionInt.toString();

    if (xPositionInt > 9 || xPositionInt < 1 || yPositionInt > 9 || yPositionInt < 1) {
        return "edge";
    }

    let cellToCheck = xPosString + yPosString;
        if (cellToCheck in game.gameBoard) { 
            let nextCellPieceObj = game.gameBoard[cellToCheck];
            if (nextCellPieceObj.gote_sente === gote_sente) {
                return "samePlayer";
            }
            return "oppositePlayer";
        }

    // Three return types samePlayer, oppositePlayer, edge, empty
    return "empty";

}


let tempboard = [["91", "81", "71", "61", "51", "41", "31", "21", "11"],
                ["92", "82", "72", "62", "52", "42", "32", "22", "12"],
                ["93", "83", "73", "63", "53", "43", "33", "23", "13"],
                ["94", "84", "74", "64", "54", "44", "34", "24", "14"],
                ["95", "85", "75", "65", "55", "45", "35", "25", "15"],
                ["96", "86", "76", "66", "56", "46", "36", "26", "16"], 
                ["97", "87", "77", "67", "57", "47", "37", "27", "17"],
                ["98", "88", "78", "68", "58", "48", "38", "28", "18"],
                ["99", "89", "79", "69", "59", "49", "39", "29", "19"]];
                
//const sock = io();
/* sock.on('message', (text) => {
    console.log(text);
}) */
//sock.on('turn', )