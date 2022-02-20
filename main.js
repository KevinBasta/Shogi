import { player } from "/player.js";
import { board } from "/board.js";

// labeling each shogi cell with ids and text
/* to move elsewhere later */
document.addEventListener("DOMContentLoaded", function () {
    const rows = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const rowsKanji = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    let columnCounter = 9;
    let rowCounter = 0;

    let element = document.getElementById('shogiBoard');
    let children = element.children;

    for (let child of children) {
        let label = columnCounter + rows[rowCounter];
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



    let player1 = new player("gote", false);
    let player2 = new player("sente", false);

    let game = new board(player1, player2);

    console.log(player1.pieces);

});

