import { player } from "/player.js";
import { board } from "/board.js";

// labeling each shogi cell with ids and text
const rows = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const rowsKanji = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
let boardArray = [[],[],[],[],[],[],[],[],[]];
let columnCounter = 9;
let rowCounter = 0;

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

    columnCounter -= 1;
    if (columnCounter == 0) {
        columnCounter = 9;
        rowCounter += 1;
    }
}
console.log(boardArray);

/* for flipping the view <-- would need a variable based on socket api
let columnCounter = 1;
let rowCounter = 8;

    columnCounter += 1;
    if (columnCounter == 10) {
        columnCounter = 1;
        rowCounter -= 1;
    }
*/


// game initialization
let player1 = new player("sente", false);
let player2 = new player("gote", false);

let game = new board(player1, player2);
game.render();
console.log(player1.pieces);
console.log(game.gameBoard);

export function addEvent(elem) {
    elem.addEventListener("click", function (e) {
        
        let pieceObject = game.gameBoard[e.target.getAttribute("pieceName")];
        for (let i of game.gameBoard[e.target.getAttribute("pieceName")].getPossibleMoves()) { 
            
            let position = document.getElementById(i);
            position.setAttribute("class", "piece-possible-move-position")
            position.setAttribute("click", "ture");
        }
        pieceObject.toString(); 
    });
}


let tempboard = [[91, 81, 71, 61, 51, 41, 31, 21, 11],
                [92, 82, 72, 62, 52, 42, 32, 22, 12],
                [93, 83, 73, 63, 53, 43, 33, 23, 13],
                [94, 84, 74, 64, 54, 44, 34, 24, 14],
                [95, 85, 75, 65, 55, 45, 35, 25, 15],
                [96, 86, 76, 66, 56, 46, 36, 26, 16], 
                [97, 87, 77, 67, 57, 47, 37, 27, 17],
                [98, 88, 78, 68, 58, 48, 38, 28, 18],
                [99, 89, 79, 69, 59, 49, 39, 29, 19]];
                