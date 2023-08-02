'use strict'
//Create MineSweeper
var gBoard
const EMPTY = ''
const MINE = '💣'
var gStartTime = null;
var gTimerInterval = null;
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame

function createEmptyBoard() {

}




function onInit() {


    clearInterval(gTimerInterval)
    var elBtn = document.querySelector('.reset')
    if (gLevel.SIZE === 4) {
        elBtn.innerHTML = `<button class="restart" onclick=chooseEasy()>😄</button>`
    } else if (gLevel.SIZE === 8) {
        elBtn.innerHTML = `<button class="restart" onclick=chooseNormal()>😄</button>`
    } else {
        (gLevel.SIZE === 12)
        elBtn.innerHTML = `<button class="restart" onclick=chooseHard()>😄</button>`
    }

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    const elBox = document.querySelector('.flagged')
    elBox.innerText = 0
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
            const classStr = cell.isShown ? 'str' : ''
            const showing = cell.isShown ? cell.minesAroundCount : ''
            strHTML += `\t<td class="str"
             onclick="onCellClicked(this, ${i}, ${j})"
             oncontextmenu="onCellMarked(this, event,${i},${j})" >${showing}</td>\n`
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
    console.log('showcount', gGame.shownCount);
    console.log('markedcount', gGame.markedCount);
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES && gGame.markedCount === gLevel.MINES) onWin()
    if (gGame.shownCount === 1 && gGame.markedCount === 0 || gGame.shownCount === 0 && gGame.markedCount === 1)
        startTimer()
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
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES && gGame.markedCount === gLevel.MINES)
        console.log('showcount', gGame.shownCount);
    console.log('markedcount', gGame.markedCount);
    if (gGame.shownCount === 1 && gGame.markedCount === 0 || gGame.shownCount === 0 && gGame.markedCount === 1)
        startTimer()

    flagCount()
}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}

function onLose() {
    gGame.isOn = false
    var elBtn = document.querySelector('.reset')
    elBtn.innerHTML = `<button class="restart" onclick=onInit()>🤕</button>`
    stopTimer()
}

function onWin() {
    var elBtn = document.querySelector('.reset')
    elBtn.innerHTML = `<button class="restart" onclick=onInit()>😎</button>`
    stopTimer()

}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function chooseEasy() {
    var elBtn = document.querySelector('.reset')
    elBtn.innerHTML = `<button class="restart" onclick=chooseEasy()>😄</button>`
    gLevel.SIZE = 4
    gLevel.MINES = 2
    onInit()

}

function chooseNormal() {
    var elBtn = document.querySelector('.reset')
    elBtn.innerHTML = `<button class="restart" onclick=chooseNormal()>😄</button>`
    gLevel.SIZE = 8
    gLevel.MINES = 14
    onInit()
}

function chooseHard() {
    var elBtn = document.querySelector('.reset')
    elBtn.innerHTML = `<button class="restart" onclick=chooseHard()>😄</button>`
    gLevel.SIZE = 12
    gLevel.MINES = 32
    onInit()
}

function startTimer() {
    gStartTime = new Date().getTime();
    gTimerInterval = setInterval(updateTimerDisplay, 10);
}

function updateTimerDisplay() {
    if (!gStartTime) return;

    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - gStartTime;
    displayTimer(elapsedTime);
}

function displayTimer(time) {
    var minutes = Math.floor(time / 60000);
    var seconds = Math.floor((time % 60000) / 1000);
    var milliseconds = (time % 1000).toString().padStart(3, '0');

    var timerDisplay = document.querySelector('.timer-display');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds}`;
}

function stopTimer() {
    clearInterval(gTimerInterval)
    gStartTime = null
}

function flagCount() {
    const elFlag = document.querySelector('.flagged')
    elFlag.innerText = `${gGame.markedCount}`
}

var Modes = true
function darkMode() {
    if (Modes) {
        const elBody = document.querySelector('body')
        const elAll = document.querySelector('.all')
        const elEasy = document.querySelector('.easy')
        const elNormal = document.querySelector('.normal')
        const elHard = document.querySelector('.hard')
        const elBtn = document.querySelector('.darkmode')

        elBody.style.backgroundColor = 'rgb(20, 20, 20)'
        elAll.style.color = 'white'
        elEasy.style.backgroundColor = 'green'
        elNormal.style.backgroundColor = 'rgb(35, 114, 163)'
        elHard.style.backgroundColor = 'rgb(175, 35, 35)'
        elBtn.innerText = 'Light Mode'
        Modes = false
    } else {
        const elBody = document.querySelector('body')
        const elAll = document.querySelector('.all')
        const elEasy = document.querySelector('.easy')
        const elNormal = document.querySelector('.normal')
        const elHard = document.querySelector('.hard')
        const elBtn = document.querySelector('.darkmode')

        elBody.style.backgroundColor = ''
        elAll.style.color = ''
        elEasy.style.backgroundColor = ''
        elNormal.style.backgroundColor = ''
        elHard.style.backgroundColor = ''
        Modes = true
        elBtn.innerText = 'Dark Mode'

    }

}

