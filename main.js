const defultBoard = [];
let logNumber = 1;
let lastBoardState;

let boardLogs = {
    log_1: defultBoard,
}

function logBoard() {
    logNumber += 1;
    lastBoardState = logNumber;
    boardLogs[("log_" + logNumber)] = ['lol'];
}