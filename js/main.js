'use strict'
//Create MineSweeper
var gBoard
const EMPTY = ''
const MINE = '*'
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gGame.isOn = true
    gBoard = createBoard()
    renderBoard(gBoard)
   
}


function createBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            if (i === 0 && j === 0 ||
                i === 2 && j === 3) {
                board[i][j].isMine = true
            }

        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const classStr = cell.isShown ? 'hi' : ''
            const showing = cell.isShown ? cell.minesAroundCount : ''
            strHTML += `\t<td class="hi" onclick="onCellClicked(this, ${i}, ${j})">${showing}</td>\n`

        }
        strHTML += `</tr>\n`
    }
    const elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (currCell.isMine) {
                count++;

            }
        }
    }
    return count;
}

function onCellClicked(elCell, rowIdx, colIdx) {
   
    if (!gGame.isOn || gBoard[rowIdx][colIdx].isShown || gBoard[rowIdx][colIdx].isMarked) return
    if (gBoard[rowIdx][colIdx].isMine) {
        elCell.innerText = '*'
        return onLose(gBoard, elCell, rowIdx, colIdx)
    }
    var minesCount = setMinesNegsCount(gBoard, rowIdx, colIdx)
    elCell.innerText = minesCount
    gBoard[rowIdx][colIdx].isShown = true

}

function onCellMarked(elCell) {
    

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}

function onLose(board, elCell, rowIdx, colIdx) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) { 
            var cell = board[i][j]
            
        }
    }
    
    console.table(board);
}

function test() {
    window.addEventListener('contextmenu', (event) => { 
        console.log('Hi'); })
}