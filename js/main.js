'use strict'
//Create MineSweeper
var gBoard
const EMPTY = ''
const MINE = '💣'
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

function createEmptyBoard() {

}

function onInit() {
    gGame.isOn = true
    gBoard = createBoard()
    renderBoard(gBoard)
    onCellMarked()


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

        }
    }
    return board
}

function placeRandomMines(board) {
    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        var randI = getRandomIntInclusive(0, gLevel.SIZE - 1)
        var randJ = getRandomIntInclusive(0, gLevel.SIZE - 1)
        if (!board[randI][randJ].isMine) {
            board[randI][randJ].isMine = true
            minesPlaced++
        }
    }

}




function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const classStr = cell.isShown ? 'hi' : ''
            const showing = cell.isShown ? cell.minesAroundCount : ''
            strHTML += `\t<td class="hi"
             onclick="onCellClicked(this, ${i}, ${j})"
             oncontextmenu="onCellMarked(this, event,${i},${j})">${showing}</td>\n`
        }
        strHTML += `</tr>\n`
    }
    placeRandomMines(gBoard)

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
        elCell.innerText = '💣'
        return onLose(gBoard, elCell, rowIdx, colIdx)
    }
    var minesCount = setMinesNegsCount(gBoard, rowIdx, colIdx)
    elCell.innerText = minesCount
    gBoard[rowIdx][colIdx].isShown = true
    gGame.shownCount++
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES  && gGame.markedCount === gLevel.MINES) console.log('Hello');

}


function onCellMarked(elCell, event, rowIdx, colIdx) {
    
    event.preventDefault()
    if (!gGame.isOn || gBoard[rowIdx][colIdx].isShown) return
    var currCell = gBoard[rowIdx][colIdx]
    currCell.isMarked = !currCell.isMarked

    if (currCell.isMarked) {
        gGame.markedCount++
    } else {
        gGame.markedCount--
    }
    if (currCell.isMarked) {
        elCell.innerText = '🚩'
    } else {
        elCell.innerText = ''
    }
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES  && gGame.markedCount === gLevel.MINES) console.log('Hello');
    console.log('showcount', gLevel.shownCount);
    console.log('markedcount', gGame.markedCount);

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}

function onLose() {
    gGame.isOn = false

}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function chooseEasy() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    onInit()

}

function chooseNormal() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    onInit()
}

function chooseHard() {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    onInit()
}