
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let gridSquares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    
    const gridWidth = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        '#FF851B',
        '#FF4136',
        '#85144b',
        '#2ECC40',
        '#0074D9'
    ]

    // Tretrominos shapes //
    const lTretromino = [
        [1, 2, gridWidth + 1, gridWidth * 2 + 1],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 2],
        [1, gridWidth + 1, gridWidth * 2, gridWidth * 2 + 1]
        [gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2]
    ]
    const zTretromino = [
        [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
        [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
        [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
        [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
    ]
    const tTretromino = [
        [1, gridWidth, gridWidth + 1, gridWidth + 2],
        [1, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
        [1, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
    ]
    const oTretromino = [
        [0, 1, gridWidth, gridWidth + 1],
        [0, 1, gridWidth, gridWidth + 1],
        [0, 1, gridWidth, gridWidth + 1],
        [0, 1, gridWidth, gridWidth + 1]
    ]
    const iTretromino = [
        [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
        [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3]
    ]

    const theTetrominoes = [lTretromino, zTretromino, tTretromino, oTretromino, iTretromino]

    let currentPosition = 3
    let currentRotation = 0

    // select a tetrominoes radomly //
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    // to draw the tetromino //
    function draw() {
        current.forEach(index => {
            gridSquares[currentPosition + index].classList.add('tetromino')
            gridSquares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    // to undraw it //
    function undraw() {
        current.forEach(index => {
            gridSquares[currentPosition + index].classList.remove('tetromino')
            gridSquares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // assign functions to keyboard //
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }

    // move down the tetromino //
    function moveDown() {
        undraw()
        currentPosition += gridWidth
        draw()
        freeze()
    }

    // freeze the tetromino //
    function freeze() {
        if (current.some(index => gridSquares[currentPosition + index + gridWidth].classList.contains('taken'))) {
            current.forEach(index => gridSquares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // move the tetromino to the left //
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % gridWidth === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => gridSquares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }


    // move the tetromino to the right // 
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % gridWidth === gridWidth - 1)
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => gridSquares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }


    // Rotate the tetromino //
    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    // Check if it's possible to rotate at the edge
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % gridWidth === 0)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % gridWidth === 0)
    }

    function checkRotatedPosition(P) {
        //get current position.  Then, check if the piece is near the left side.
        P = P || currentPosition       
        if ((P + 1) % gridWidth < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
            if (isAtRight()) {            //use actual position to check if it's flipped over to right side
                currentPosition += 1    //if so, add one to wrap it back around
                checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % gridWidth > 5) {
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }


    // show the next tetromino in the mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    // Defining the tetrominoes we'll display in the mini-grid display
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // Start and stop button //
    startButton.addEventListener('click', () => {
        if (timerId) {
            document.removeEventListener('keyup', control)
            clearInterval(timerId)
            timerId = null
        } else {
            document.addEventListener('keyup', control)
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    // Adding the score //
    function addScore() {
        for (let i = 0; i < 199; i += gridWidth) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => gridSquares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    gridSquares[index].classList.remove('taken')
                    gridSquares[index].classList.remove('tetromino')
                    gridSquares[index].style.backgroundColor = ''
                })
                const squaresRemoved = gridSquares.splice(i, gridWidth)
                gridSquares = squaresRemoved.concat(gridSquares)
                gridSquares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // End of the game //
    function gameOver() {
        if (current.some(index => gridSquares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

    ////// END OF MY FILE //////
})