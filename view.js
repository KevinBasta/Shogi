import {defultBoardSetup, defultStandSetups, picesImages} from "/config.js"; 
import {addPossibleMovesEvent, removeEmptyCellEvent, playerTwoView} from "/main.js";


/* 
 Function to create new shogi piece image and put it in a cell
 */
 export function renderNewPieceImage(cellCoordinate, gameBoard) {
    // Getting the div spesified and creating the image
    let position = document.getElementById(cellCoordinate);
    let pieceImage = document.createElement("img");
    
    // Adding the image src, classes, name, and then appending it to div
    pieceImage.setAttribute("src", picesImages[gameBoard[cellCoordinate].pieceType]);
    pieceImage.setAttribute("pieceName", gameBoard[cellCoordinate].pieceObjectName);
    pieceImage.setAttribute("class", "piece");

    // If image is facing the opposite way then rotate it and make it unclickable
    if ((gameBoard[cellCoordinate].isfacingup == false && !playerTwoView) || (playerTwoView && gameBoard[cellCoordinate].isfacingup == true)) {
        pieceImage.setAttribute("class", "piece piece-rotate opponent-piece-unclickable");
    }
    position.appendChild(pieceImage);

    // only add click events for the appropriate player pieces
    if (gameBoard[cellCoordinate].gote_sente === "gote" && playerTwoView) {
        addPossibleMovesEvent(pieceImage);
    } else if (gameBoard[cellCoordinate].gote_sente === "sente" && !playerTwoView) {
        addPossibleMovesEvent(pieceImage);
    }
}


/* 
 Showing where a captured piece of a given type would go on the stands
 */
export function renderPlaceholderStandPiece(standPosition, pieceType, pieceName) {
    // Getting the div spesified and creating the image
    let position = document.getElementById(standPosition);
    let pieceImage = document.createElement("img");

    // Setting the image src, name, popsition, and classes
    pieceImage.setAttribute("src", picesImages[pieceType]);
    pieceImage.setAttribute("pieceName", pieceName);
    pieceImage.setAttribute("standpos", standPosition);
    pieceImage.setAttribute("class", "stand-piece-placeholder");

    // If image is facing the opposite way then rotate it and make it unclickable
    if ((standPosition.substring(0, 1) === 'o' && !playerTwoView) || (playerTwoView && standPosition.substring(0, 1) === 'p')) {
        pieceImage.setAttribute("class", "stand-piece-placeholder piece-rotate opponent-piece-unclickable");
    }
    position.appendChild(pieceImage);
}


/* 
 Showing the piece captured in the stand and how many there are
 */
export function renderCapturedPieceInStand(positionInStand) { 
    // Getting the div spesified and selecting the image
    let standCell = document.getElementById(positionInStand);
    let pieceOnStand = standCell.querySelector(`img`);

    // for displaying how many are captured
    //let pieceCounter = standCell.querySelector(`img`);
    console.log(pieceOnStand)

    // Setting classes for the piece based on player two view
    if ((positionInStand.substring(0, 1) === 'o' && !playerTwoView) || (playerTwoView && positionInStand.substring(0, 1) === 'p')) {
        pieceOnStand.setAttribute("class", "piece piece-rotate opponent-piece-unclickable");
    } else { 
        pieceOnStand.setAttribute("class", "piece");
    }
}


/* 
 Remove the spesified child element from the specified parent
 */
export function removeChildElement(parentElementId, querySelector) { 
    let parentCell = document.getElementById(parentElementId);
    let elementChild = parentCell.querySelector(querySelector);
    parentCell.removeChild(elementChild);
}


/* 
 Remove styling from old possible move cells
 */
export function removeOldPossibleMovesStyling(oldPossibleMoves) {
    for (let i of oldPossibleMoves) { 
        let position = document.getElementById(i);
        removeEmptyCellEvent(position);
        position.setAttribute("class", "");
        position.setAttribute("click", "false");
    }
}