import {defultBoardSetup, defultStandSetups, picesImages} from "/config.js"; 
import {addPossibleMovesEvent, removePossibleMovesEvent, addStandPossibleMovesEvent, removeStandPossibleMovesEvent, removeEmptyCellEvent, promotePiece, dontPromotePiece, playerTwoView} from "/main.js";


/* 
 Function to create new shogi piece image and put it in a cell
 */
export function renderNewPieceImage(cellCoordinate, gameBoard) {
    // Getting the div spesified and creating the image
    let position = document.getElementById(cellCoordinate);
    let pieceImage = document.createElement("img");
    
    // Adding the image src, classes, name, and then appending it to div
    if (gameBoard[cellCoordinate].getPromotion()) {
        pieceImage.setAttribute("src", picesImages["promoted" + gameBoard[cellCoordinate].pieceType]);
    } else { 
        pieceImage.setAttribute("src", picesImages[gameBoard[cellCoordinate].pieceType]);
    }
    pieceImage.setAttribute("pieceName", gameBoard[cellCoordinate].pieceObjectName);
    pieceImage.setAttribute("class", "piece");

    // If image is facing the opposite way then rotate it and make it unclickable
    if ((gameBoard[cellCoordinate].isfacingup == false && !playerTwoView) || (playerTwoView && gameBoard[cellCoordinate].isfacingup == true)) {
        pieceImage.setAttribute("class", "piece piece-rotate opponent-piece-unclickable");
    }
    position.appendChild(pieceImage);

    // only add click events for the appropriate player pieces
    if (gameBoard[cellCoordinate].gote_sente === "gote" && playerTwoView) {
        addPossibleMovesEvent(pieceImage, false);
    } else if (gameBoard[cellCoordinate].gote_sente === "sente" && !playerTwoView) {
        addPossibleMovesEvent(pieceImage, false);
    }
}


export function updatePieceImage(cellCoordinate, gameBoard) {
    // Getting the div spesified and creating the image
    let position = document.getElementById(cellCoordinate);
    let pieceImage = position.querySelector(`img`);
    
    // Adding the image src, classes, name, and then appending it to div
    if (gameBoard[cellCoordinate].getPromotion()) {
        pieceImage.setAttribute("src", picesImages["promoted" + gameBoard[cellCoordinate].pieceType]);
    } else { 
        pieceImage.setAttribute("src", picesImages[gameBoard[cellCoordinate].pieceType]);
    }
}


/* 
 Showing where a captured piece of a given type would go on the stands
 */
export function renderPlaceholderStandPiece(standPosition, pieceType, pieceName) {
    // Getting the div spesified, creating the image and piece counter
    let position = document.getElementById(standPosition);
    let pieceImage = document.createElement("img");
    let pieceCounter = document.createElement("span");

    // Setting the image src, name, popsition, and classes
    pieceImage.setAttribute("src", picesImages[pieceType]);
    pieceImage.setAttribute("pieceName", pieceName);
    pieceImage.setAttribute("standpos", standPosition);
    pieceImage.setAttribute("class", "piece stand-piece-placeholder");
    
    // Making the pieceCounter hidden at start of game
    let counterNumb = document.createTextNode("0");
    pieceCounter.setAttribute("pieceCounter", "true");
    pieceCounter.setAttribute("class", "stand-piece-count stand-piece-count-nodisplay");
    pieceCounter.appendChild(counterNumb);

    // If image is facing the opposite way then rotate it and make it unclickable
    if ((standPosition.substring(0, 1) === 'o' && !playerTwoView) || (playerTwoView && standPosition.substring(0, 1) === 'p')) {
        pieceImage.setAttribute("class", "piece stand-piece-placeholder piece-rotate opponent-piece-unclickable");
    }
    position.appendChild(pieceImage);
    position.appendChild(pieceCounter);
}


/* 
 Showing the piece captured in the stand and how many there are
 */
export function renderCapturedPieceInStand(positionInStand, totalOfPiece) { 
    // Getting the div spesified and selecting the image
    let standCell = document.getElementById(positionInStand);
    let pieceOnStand = standCell.querySelector(`img`);
    let pieceCounter = standCell.querySelector('span[pieceCounter="true"]'); 

    // for displaying how many are captured
    let counterNumb = document.createTextNode(totalOfPiece);
    pieceCounter.setAttribute("class", "stand-piece-count");
    pieceCounter.removeChild(pieceCounter.firstChild);
    pieceCounter.appendChild(counterNumb);

    // Setting classes for the piece based on player two view
    if ((positionInStand.substring(0, 1) === 'o' && !playerTwoView) || (playerTwoView && positionInStand.substring(0, 1) === 'p')) {
        pieceOnStand.setAttribute("class", "piece piece-rotate opponent-piece-unclickable");
    } else { 
        pieceOnStand.setAttribute("class", "piece");
    }
    addStandPossibleMovesEvent(pieceOnStand);
}

/* 
 updating the piece captured in the stand and how many there are
 */
 export function updateCapturedPieceInStand(positionInStand, totalOfPiece) { 
     // Getting the div spesified and selecting the image
     let standCell = document.getElementById(positionInStand);
     let pieceOnStand = standCell.querySelector(`img`);
     let classAttributes = "";
    
    // for displaying how many still captured
    let pieceCounter = standCell.querySelector('span[pieceCounter="true"]');
    let counterNumb = document.createTextNode(totalOfPiece);

    if (totalOfPiece > 0) { 
        pieceCounter.setAttribute("class", "stand-piece-count");
    } else { 
        classAttributes += "stand-piece-placeholder ";
        pieceCounter.setAttribute("class", "stand-piece-count stand-piece-count-nodisplay");
        removeStandPossibleMovesEvent(pieceOnStand);
    }

    pieceCounter.removeChild(pieceCounter.firstChild);
    pieceCounter.appendChild(counterNumb);
    
    // Setting classes for the piece based on player two view
    if ((positionInStand.substring(0, 1) === 'o' && !playerTwoView) || (playerTwoView && positionInStand.substring(0, 1) === 'p')) {
        classAttributes += "piece piece-rotate opponent-piece-unclickable ";
    } else { 
        classAttributes += "piece ";
    }

    // adding classes based on the ones in the class Atrtributes variable
    pieceOnStand.setAttribute("class", classAttributes);
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
        position.classList.remove("piece-possible-move-position");
        position.setAttribute("click", "false");
    }
}

/* 
 Displays a div at the top of the screen to ask the user if they want to promote a piece
 */
export function promotionQuestion(oldPiecePosition, newPiecePosition, gameBoard, oldPossibleMoves) { 
    let promotionQuestion = document.getElementById("promotionContainer");
    let overlay = document.getElementById("overlay");
    promotionQuestion.setAttribute("class", "promotionFlex");
    overlay.setAttribute("class", "overlay");
    let unpromotedButton = promotionQuestion.querySelector('div[id="unpromotedButton"');
    let promotedButton = promotionQuestion.querySelector('div[id="promotedButton"');
    unpromotedButton.removeChild(unpromotedButton.firstChild);
    promotedButton.removeChild(promotedButton.firstChild);

    let unpromotedPieceImage = document.createElement("img");
    unpromotedPieceImage.setAttribute("src", picesImages[gameBoard[oldPiecePosition].getType()]);
    //console.log(gameBoard[oldPiecePosition].getType());
    unpromotedPieceImage.setAttribute("class", "piece-promote-question");
    unpromotedButton.appendChild(unpromotedPieceImage);
    unpromotedPieceImage.addEventListener("click", () => { 
        dontPromotePiece(newPiecePosition);
        promotionQuestion.setAttribute("class", "promotionFlex hide");;
        overlay.setAttribute("class", "overlay hide");
    });

    let promotedPieceImage = document.createElement("img");
    promotedPieceImage.setAttribute("src", picesImages["promoted" + gameBoard[oldPiecePosition].getType()]);
    promotedPieceImage.setAttribute("class", "piece-promote-question");
    promotedButton.appendChild(promotedPieceImage);
    promotedPieceImage.addEventListener("click", () => { 
        //gameBoard[piecePosition].promote();
        //gameBoard.promotepiece(piecePosition)
        promotePiece(newPiecePosition);
        promotionQuestion.setAttribute("class", "promotionFlex hide");
        overlay.setAttribute("class", "overlay hide");
    });

    overlay.addEventListener("click", () => { 
        promotionQuestionHide();
        removeOldPossibleMovesStyling(oldPossibleMoves);
    });
}

export function promotionQuestionHide() { 
    let promotionQuestion = document.getElementById("promotionContainer");
    let overlay = document.getElementById("overlay");
    promotionQuestion.setAttribute("class", "promotionFlex hide");
    overlay.setAttribute("class", "overlay hide");
}

export function addPieceEventListener(cellCoordinate) { 
    let position = document.getElementById(cellCoordinate);
    let pieceImage = position.querySelector(`img`);

    addPossibleMovesEvent(pieceImage);
}

export function addStandPieceEventListener(cellCoordinate) { 
    let position = document.getElementById(cellCoordinate);
    let standPieceImage = position.querySelector(`img`);
    
    addStandPossibleMovesEvent(standPieceImage);
}

export function removePieceEventListener(cellCoordinate) { 
    let position = document.getElementById(cellCoordinate);
    let pieceImage = position.querySelector(`img`);

    removePossibleMovesEvent(pieceImage);
}

export function removeStandPieceEventListener(cellCoordinate) { 
    let position = document.getElementById(cellCoordinate);
    let standPieceImage = position.querySelector(`img`);
    
    removeStandPossibleMovesEvent(standPieceImage);
}

export function winOrLoseDisplay(won) { 
    let playerTurnStatus = document.getElementById("closePlayerTurnStatus");
    let opponentTurnStatus = document.getElementById("farPlayerTurnStatus");
    if (won === true) { 
        playerTurnStatus.textContent = "You Won";
        playerTurnStatus.parentElement.classList.add("winBorder");
        opponentTurnStatus.parentElement.classList.add("loseBorderOpponent");
    } else { 
        playerTurnStatus.textContent = "You Lost";
        playerTurnStatus.parentElement.classList.add("loseBorder");
        opponentTurnStatus.parentElement.classList.add("winBorderOpponent");
    }
    opponentTurnStatus.textContent = "";
}

export function thisPlayerTurn() { 
    let playerTurnStatus = document.getElementById("closePlayerTurnStatus");
    let opponentTurnStatus = document.getElementById("farPlayerTurnStatus");

    if (playerTurnStatus.textContent != "You Won" || playerTurnStatus.textContent != "You Lost") {
        playerTurnStatus.textContent = "Your Turn";
        playerTurnStatus.parentElement.classList.add("turnBorder");
        opponentTurnStatus.textContent = "";
        opponentTurnStatus.parentElement.classList.remove("turnBorderOpponent");
    }
}

export function otherPlayerTurn() { 
    let playerTurnStatus = document.getElementById("closePlayerTurnStatus");
    let opponentTurnStatus = document.getElementById("farPlayerTurnStatus");

    if (playerTurnStatus.textContent != "You Won" || playerTurnStatus.textContent != "You Lost") {
        opponentTurnStatus.textContent = "Opponent's Turn";
        opponentTurnStatus.parentElement.classList.add("turnBorderOpponent");
        playerTurnStatus.textContent = "";
        playerTurnStatus.parentElement.classList.remove("turnBorder");
    }
}

let moveNumber = 1;
export function pieceMoveGameLog(moveLogText) { 
    let gameLog = document.getElementById("movesLog");
    let newMoveLi = document.createElement("li");
    newMoveLi.textContent = moveNumber + ". " + moveLogText;
    moveNumber += 1;

    gameLog.appendChild(newMoveLi);
    gameLog.scrollTop = gameLog.scrollHeight;
}


export function initPlayerNameAndGoteSente(playerName, goteSente) { 
    let playerNameDisplay = document.getElementById("closePlayerText");
    playerNameDisplay.textContent = goteSente + " | " + playerName;
}

export function initOpponentNameAndGoteSente(opponentName, goteSente) { 
    let playerNameDisplay = document.getElementById("farPlayerText");
    playerNameDisplay.textContent = goteSente + " | " + opponentName;
}

export function waitingForSecondPlayer() { 
    let playerNameDisplay = document.getElementById("farPlayerText");
    playerNameDisplay.textContent = "waiting...";
}

export function hideHomePage() { 
    let homePage = document.getElementById("homeScreen");
    homePage.setAttribute("class", "hide");
}

export function displayGameCode(gameCode) { 
    let gameLog = document.getElementById("movesLog");
    let gameCodeLi = document.createElement("li");
    gameCodeLi.setAttribute("class", "game-code-text");
    gameCodeLi.setAttribute("id", "game-code-text")
    gameCodeLi.textContent = "Your Game Code is: " + gameCode;
    
    gameLog.appendChild(gameCodeLi);
    gameLog.scrollTop = gameLog.scrollHeight;
}

export function removeGameCode() {
    let gameCodeLi = document.getElementById("game-code-text");
    gameCodeLi.setAttribute("class", "hide");
}

export function addBoardMovedEffect(newMovedForUi) { 
    if (newMovedForUi.length > 0) { 
        let positionOne = document.getElementById(newMovedForUi[0]);
        let positionTwo = document.getElementById(newMovedForUi[1]);

        positionOne.getAnimations().forEach((animation) => {
            animation.cancel();
            animation.play();
        });

        positionTwo.getAnimations().forEach((animation) => {
            animation.cancel();
            animation.play();
        });

        positionOne.classList.add("piece-moved");
        positionTwo.classList.add("piece-moved");
    }
}

export function removeBoardMovedEffect(oldMovedForUi) { 
    if (oldMovedForUi.length > 0) { 
        let positionOne = document.getElementById(oldMovedForUi[0]);
        let positionTwo = document.getElementById(oldMovedForUi[1]);

        positionOne.classList.remove("piece-moved");
        positionTwo.classList.remove("piece-moved");
    }
}