'use strict'
//Create MineSweeper :)
var gBoard
var gInterval
var gBestTime
var Modes = true
var gTime
var gStartTime = null
var gTimerInterval = null
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame
var gTimesLost = 0
var gLifeCount = 3

function onInit() {
    gTimesLost = 0
    gLifeCount = 3
    gBestTime = parseInt(localStorage.getItem('bestTime')) || Infinity
    document.getElementById('best-time').innerHTML = localStorage.getItem('bestTime')

    clearInterval(gInterval)
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
    flagCount()
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
    var boardSize = gLevel.SIZE * gLevel.SIZE
    expandShown(gBoard, elCell, rowIdx, colIdx)
    if (!gGame.isOn || gBoard[rowIdx][colIdx].isShown || gBoard[rowIdx][colIdx].isMarked) return

    var minesCount = setMinesNegsCount(gBoard, rowIdx, colIdx)
    elCell.innerText = minesCount
    gBoard[rowIdx][colIdx].isShown = true
    if (gLifeCount > 1 && gBoard[rowIdx][colIdx].isMine) {
        gLifeCount--
        gTimesLost++
        gGame.shownCount--
        // console.log('Lifecount', gLifeCount);
        elCell.innerText = '💔'
    } else if (gLifeCount === 1 && gBoard[rowIdx][colIdx].isMine) {
        elCell.innerText = '💣'

        return onLose(gBoard, elCell, rowIdx, colIdx)
    }
    gGame.shownCount++
    lifeCount()
    // console.log('size', boardSize);
    // console.log('timeslost', gTimesLost);
    // console.log('lifecount', gLifeCount);
    // console.log('showcount', gGame.shownCount);
    // console.log('markedcount', gGame.markedCount);
    if (gGame.shownCount === boardSize - gLevel.MINES - gTimesLost
         && gGame.markedCount + gTimesLost === gLevel.MINES 
         || boardSize === gGame.shownCount + gGame.markedCount + gTimesLost) onWin()
    if (gGame.shownCount === 1 && gGame.markedCount === 0 || gGame.shownCount === 0 && gGame.markedCount === 1)
        timer()
    flagCount()

}

function onCellMarked(elCell, event, rowIdx, colIdx) {
    var boardSize = gLevel.SIZE * gLevel.SIZE

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
        //     console.log('showcount', gGame.shownCount);
        // console.log('markedcount', gGame.markedCount);
        if (gGame.shownCount === boardSize - gLevel.MINES - gTimesLost && gGame.markedCount + gTimesLost === gLevel.MINES || boardSize === gGame.shownCount + gGame.markedCount + gTimesLost) onWin()
    if (gGame.shownCount === 1 && gGame.markedCount === 0 || gGame.shownCount === 0 && gGame.markedCount === 1)
        timer()


    flagCount()

}

function expandShown(board, elCell, i, j) {
    if (board[i][j].isShown && elCell.innerHTML === '0') {

    }
}

function onLose() {
    gLifeCount--
    gGame.isOn = false
    var elBtn = document.querySelector('.reset')
    elBtn.innerHTML = `<button class="restart" onclick=onInit()>🤕</button>`
    stopTimer()

}

function onWin() {
    var elBtn = document.querySelector('.reset')
    elBtn.innerHTML = `<button class="restart" onclick=onInit()>😎</button>`


    // console.log('this', gTime);
    if (gGame.secsPassed < gBestTime) {
        gBestTime = gGame.secsPassed
        bestTime()
    }
    // console.log('best', gBestTime);
    gGame.isOn = false
    clearInterval(gInterval)
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

function flagCount() {
    const elFlag = document.querySelector('.flagged')
    elFlag.innerText = `${gLevel.MINES - gGame.markedCount - gTimesLost}`
}

function darkMode() {
    const elBody = document.querySelector('body')
    const elAll = document.querySelector('.all')
    const elEasy = document.querySelector('.easy')
    const elNormal = document.querySelector('.normal')
    const elHard = document.querySelector('.hard')
    const elBtn = document.querySelector('.darkmode')
    if (Modes) {
        elBody.style.backgroundColor = 'rgb(20, 20, 20)'
        elAll.style.color = 'white'
        elEasy.style.backgroundColor = 'green'
        elNormal.style.backgroundColor = 'rgb(35, 114, 163)'
        elHard.style.backgroundColor = 'rgb(175, 35, 35)'
        elBtn.innerText = 'Light Mode'
        Modes = false
    } else {
        elBody.style.backgroundColor = ''
        elAll.style.color = ''
        elEasy.style.backgroundColor = ''
        elNormal.style.backgroundColor = ''
        elHard.style.backgroundColor = ''
        Modes = true
        elBtn.innerText = 'Dark Mode'

    }

}

function bestTime() {
    if (typeof (Storage) !== 'undefined') {
        localStorage.setItem('bestTime', 'Best Time: ' + gBestTime + ' Seconds')
        document.getElementById('best-time').innerHTML = localStorage.getItem('bestTime')
    }
}

function lifeCount() {
    var elLife = document.querySelector('.lives')
    elLife.innerText = `${gLifeCount}`
}

function timer() {
    gInterval = setInterval(timer2, 1000)
}

function timer2() {
    const elDisplayTimer = document.querySelector('.timer-display')
    if (gGame.isOn) {
        gGame.secsPassed++
        elDisplayTimer.innerHTML = gGame.secsPassed
    }
}

