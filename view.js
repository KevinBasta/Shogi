import {defultBoardSetup, defultStandSetups, picesImages} from "/config.js"; 
import {addPossibleMovesEvent, removeEmptyCellEvent, playerTwoView} from "/main.js";

/* 
 Function to create new shogi piece image and put it somewhere
 */
 export function renderNewPieceImage(cellCoordinate, gameBoard) {
    // Getting the div spesified and creating the image
    let position = document.getElementById(cellCoordinate);
    let elem = document.createElement("img");
    
    // Adding the image src, classes, name, and then appending it to div
    elem.setAttribute("src", picesImages[gameBoard[cellCoordinate].pieceType]);
    elem.setAttribute("pieceName", gameBoard[cellCoordinate].pieceObjectName);
    elem.setAttribute("class", "piece");

    // If image is facing the opposite way then rotate it and make it unclickable
    if ((gameBoard[cellCoordinate].isfacingup == false && !playerTwoView) || (playerTwoView && gameBoard[cellCoordinate].isfacingup == true)) {
        elem.setAttribute("class", "piece piece-rotate opponent-piece-unclickable");
    }
    position.appendChild(elem);

    // only add click events for the appropriate player pieces
    if (gameBoard[cellCoordinate].gote_sente === "gote" && playerTwoView) {
        addPossibleMovesEvent(elem);
    } else if (gameBoard[cellCoordinate].gote_sente === "sente" && !playerTwoView) {
        addPossibleMovesEvent(elem);
    }
}




export function renderStandPiece(standPosition, pieceType, pieceName) {
    let position = document.getElementById(standPosition);
    let elem = document.createElement("img");
    elem.setAttribute("src", picesImages[pieceType]);
    elem.setAttribute("pieceName", pieceName);
    elem.setAttribute("standpos", standPosition);
    elem.setAttribute("class", "stand-piece-placeholder");

    // If image is facing the opposite way then rotate it and make it unclickable
    if ((standPosition.substring(0, 1) === 'o' && !playerTwoView) || (playerTwoView && standPosition.substring(0, 1) === 'p')) {
        elem.setAttribute("class", "stand-piece-placeholder piece-rotate opponent-piece-unclickable");
    }
    position.appendChild(elem);
}




export function renderCapturedPieceInStand(positionInStand) { 
    let standCell = document.getElementById(positionInStand);
    let pieceOnStand = standCell.querySelector(`img`);
    // for displaying how many are captured
    //let pieceCounter = standCell.querySelector(`img`);
    console.log(pieceOnStand)

    if ((positionInStand.substring(0, 1) === 'o' && !playerTwoView) || (playerTwoView && positionInStand.substring(0, 1) === 'p')) {
        pieceOnStand.setAttribute("class", "piece piece-rotate opponent-piece-unclickable");
    } else { 
        pieceOnStand.setAttribute("class", "piece");
    }
}



export function removeChildElement(parentElementId, querySelector) { 
    let parentCell = document.getElementById(parentElementId);
    let elementChild = parentCell.querySelector(querySelector);
    parentCell.removeChild(elementChild);
}



export function removeOldPossibleMovesStyling(oldPossibleMoves) {
    for (let i of oldPossibleMoves) { 
        let position = document.getElementById(i);
        removeEmptyCellEvent(position);
        position.setAttribute("class", "");
        position.setAttribute("click", "false");
    }
}