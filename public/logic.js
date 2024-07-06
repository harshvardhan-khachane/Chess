let selectedPiece = null;
let selectedPieceType = '';
let turn = 'W';
let enPassantTarget = null;
let moveCounter = 0;

let whiteTime = 300; 
let blackTime = 300; 
let timerInterval;
let timerStarted = false;

document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', handleBoxClick);
    box.addEventListener('dragstart', handleDragStart);
    box.addEventListener('dragover', handleDragOver);
    box.addEventListener('drop', handleDrop);
    box.addEventListener('dragend', handleDragEnd);
});

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (turn === 'W') {
            whiteTime--;
            updateTimerDisplay('white-timer', whiteTime);
            if (whiteTime <= 0) {
                alert("Time's up! Black wins!");
                resetBoard();
            }
        } else {
            blackTime--;
            updateTimerDisplay('black-timer', blackTime);
            if (blackTime <= 0) {
                alert("Time's up! White wins!");
                resetBoard();
            }
        }
    }, 1000);
}

function updateTimerDisplay(timerId, time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById(timerId).innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function handleBoxClick(event) {
    const box = event.target.closest('.box');
    
    if (!selectedPiece && box.querySelector('img')) {
        if (turn === box.querySelector('img').id[0]) {
            selectedPiece = box;
            selectedPieceType = box.querySelector('img').id;
            box.classList.add('highlight');
            highlightValidMoves(box);
        }
    } else if (selectedPiece) {
        const validMove = isValidMove(selectedPiece, box, selectedPieceType);
        if (validMove.valid) {
            if (box.querySelector('img') && box.querySelector('img').id[0] === turn) {
                // Same color piece; invalid move
                selectedPiece.classList.remove('highlight');
                removeHighlightFromValidMoves();
                selectedPiece = null;
                selectedPieceType = '';
                return;
            }
            box.innerHTML = selectedPiece.innerHTML;
            selectedPiece.innerHTML = '';
            selectedPiece.classList.remove('highlight');
            removeHighlightFromValidMoves();
            enPassantTarget = validMove.enPassant ? box : null;
            selectedPiece = null;
            selectedPieceType = '';
            pawnPromotion(box);
            checkGameState();
            
            if (!timerStarted && turn === 'W') {
                timerStarted = true;
                startTimer();
            }
            
            turn = turn === 'W' ? 'B' : 'W';
            document.getElementById('toggle').innerText = `${turn === 'W' ? "White's Turn" : "Black's Turn"}`;
        } else {
            selectedPiece.classList.remove('highlight');
            removeHighlightFromValidMoves();
            selectedPiece = null;
            selectedPieceType = '';
        }
    }
}

function handleDragStart(event) {
    const box = event.target.closest('.box');
    if (turn === box.querySelector('img').id[0]) {
        selectedPiece = box;
        selectedPieceType = box.querySelector('img').id;
        box.classList.add('highlight');
        highlightValidMoves(box);
    } else {
        event.preventDefault();
    }
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const box = event.target.closest('.box');
    const validMove = isValidMove(selectedPiece, box, selectedPieceType);
    if (selectedPiece && validMove.valid) {
        if (box.querySelector('img') && box.querySelector('img').id[0] === turn) {
            // Same color piece; invalid move
            selectedPiece.classList.remove('highlight');
            removeHighlightFromValidMoves();
            selectedPiece = null;
            selectedPieceType = '';
            return;
        }
        box.innerHTML = selectedPiece.innerHTML;
        selectedPiece.innerHTML = '';
        selectedPiece.classList.remove('highlight');
        removeHighlightFromValidMoves();
        enPassantTarget = validMove.enPassant ? box : null;
        selectedPiece = null;
        selectedPieceType = '';
        pawnPromotion(box);
        checkGameState();
        
        if (!timerStarted && turn === 'W') {
            timerStarted = true;
            startTimer();
        }
        
        turn = turn === 'W' ? 'B' : 'W';
        document.getElementById('toggle').innerText = `${turn === 'W' ? "White's Turn" : "Black's Turn"}`;
    }
}

function handleDragEnd() {
    if (selectedPiece) {
        selectedPiece.classList.remove('highlight');
        removeHighlightFromValidMoves();
        selectedPiece = null;
        selectedPieceType = '';
    }
}

function highlightValidMoves(fromBox) {
    document.querySelectorAll('.box').forEach(toBox => {
        if (isValidMove(fromBox, toBox, selectedPieceType).valid) {
            toBox.classList.add('highlight');
        }
    });
}

function removeHighlightFromValidMoves() {
    document.querySelectorAll('.box').forEach(box => {
        box.classList.remove('highlight');
    });
}

function isValidMove(fromBox, toBox, pieceType) {
    const fromId = fromBox.id;
    const toId = toBox.id;
    const fromRow = parseInt(fromId[1]);
    const fromCol = fromId.charCodeAt(0);
    const toRow = parseInt(toId[1]);
    const toCol = toId.charCodeAt(0);

    if (fromBox === toBox) {
        return { valid: false, enPassant: false };
    }

    switch (pieceType) {
        case 'Wpawn':
            return isValidPawnMove(fromRow, fromCol, toRow, toCol, 'W');
        case 'Bpawn':
            return isValidPawnMove(fromRow, fromCol, toRow, toCol, 'B');
        case 'Wrook':
        case 'Brook':
            return isValidRookMove(fromRow, fromCol, toRow, toCol);
        case 'Wknight':
        case 'Bknight':
            return isValidKnightMove(fromRow, fromCol, toRow, toCol);
        case 'Wbishop':
        case 'Bbishop':
            return isValidBishopMove(fromRow, fromCol, toRow, toCol);
        case 'Wqueen':
        case 'Bqueen':
            return isValidQueenMove(fromRow, fromCol, toRow, toCol);
        case 'Wking':
        case 'Bking':
            return isValidKingMove(fromRow, fromCol, toRow, toCol);
        default:
            return { valid: false, enPassant: false };
    }
}

function isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
    const direction = color === 'W' ? 1 : -1;
    const startRow = color === 'W' ? 2 : 7;
    const enPassantRow = color === 'W' ? 5 : 4;

    // Move forward one step
    if (fromCol === toCol && fromRow + direction === toRow && !document.getElementById(`${String.fromCharCode(fromCol)}${toRow}`).querySelector('img')) {
        return { valid: true, enPassant: false };
    }
    // Move forward two steps from starting position
    if (fromCol === toCol && fromRow === startRow && fromRow + direction * 2 === toRow && !document.getElementById(`${String.fromCharCode(fromCol)}${toRow}`).querySelector('img')) {
        return { valid: true, enPassant: true };
    }
    // Capture diagonally
    if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow && document.getElementById(`${String.fromCharCode(toCol)}${toRow}`).querySelector('img')) {
        return { valid: true, enPassant: false };
    }
    // En passant capture
    if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow && enPassantTarget && enPassantTarget.id === `${String.fromCharCode(toCol)}${toRow}`) {
        document.getElementById(`${String.fromCharCode(toCol)}${fromRow}`).innerHTML = '';
        return { valid: true, enPassant: false };
    }
    return { valid: false, enPassant: false };
}

function isValidRookMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow === toRow || fromCol === toCol) {
        if (!isPathBlocked(fromRow, fromCol, toRow, toCol)) {
            return { valid: true, enPassant: false };
        }
    }
    return { valid: false, enPassant: false };
}

function isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    if ((Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) || (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)) {
        return { valid: true, enPassant: false };
    }
    return { valid: false, enPassant: false };
}

function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
        if (!isPathBlocked(fromRow, fromCol, toRow, toCol)) {
            return { valid: true, enPassant: false };
        }
    }
    return { valid: false, enPassant: false };
}

function isValidQueenMove(fromRow, fromCol, toRow, toCol) {
    if (isValidRookMove(fromRow, fromCol, toRow, toCol).valid || isValidBishopMove(fromRow, fromCol, toRow, toCol).valid) {
        return { valid: true, enPassant: false };
    }
    return { valid: false, enPassant: false };
}

function isValidKingMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) {
        const newBox = document.getElementById(`${String.fromCharCode(toCol)}${toRow}`);
        const pieceColor = document.getElementById(`${String.fromCharCode(fromCol)}${fromRow}`).querySelector('img').id[0];
        if (isSquareSafe(newBox, pieceColor)) {
            return { valid: true, enPassant: false };
        }
    }
    return { valid: false, enPassant: false };
}

function isPathBlocked(fromRow, fromCol, toRow, toCol) {
    const rowStep = fromRow < toRow ? 1 : fromRow > toRow ? -1 : 0;
    const colStep = fromCol < toCol ? 1 : fromCol > toCol ? -1 : 0;
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    while (currentRow !== toRow || currentCol !== toCol) {
        if (document.getElementById(`${String.fromCharCode(currentCol)}${currentRow}`).querySelector('img')) {
            return true;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return false;
}

function pawnPromotion(box) {
    const row = parseInt(box.id[1]);
    const piece = box.querySelector('img').id;
    if ((row === 8 && piece === 'Wpawn') || (row === 1 && piece === 'Bpawn')) {
        promotePawn(box, piece[0]);
    }
}

function promotePawn(box, color) {
    const choice = prompt("Promote pawn to: Q (Queen), R (Rook), B (Bishop), N (Knight)");
    let newPiece = '';
    switch (choice.toUpperCase()) {
        case 'Q':
            newPiece = color === 'W' ? 'Wqueen' : 'Bqueen';
            break;
        case 'R':
            newPiece = color === 'W' ? 'Wrook' : 'Brook';
            break;
        case 'B':
            newPiece = color === 'W' ? 'Wbishop' : 'Bbishop';
            break;
        case 'N':
            newPiece = color === 'W' ? 'Wknight' : 'Bknight';
            break;
        default:
            newPiece = color === 'W' ? 'Wqueen' : 'Bqueen';
    }
    box.innerHTML = `<img class='all-img' id="${newPiece}" src="${newPiece}.png" alt="" draggable="true">`;
}

function checkGameState() {
    const allBoxes = document.querySelectorAll('.box');
    const whiteKing = Array.from(allBoxes).find(box => box.querySelector('img') && box.querySelector('img').id === 'Wking');
    const blackKing = Array.from(allBoxes).find(box => box.querySelector('img') && box.querySelector('img').id === 'Bking');

    if (!whiteKing) {
        alert("Black wins by checkmate!");
        resetBoard();
    } else if (!blackKing) {
        alert("White wins by checkmate!");
        resetBoard();
    } else {
        const kingInCheck = isKingInCheck(turn === 'W' ? 'B' : 'W');
        if (kingInCheck) {
            if (isCheckmate(turn === 'W' ? 'B' : 'W')) {
                alert(`${turn === 'W' ? 'Black' : 'White'} wins by checkmate!`);
                resetBoard();
            } else {
                alert(`${turn === 'W' ? 'Black' : 'White'} is in check!`);
            }
        }
    }
}

function isKingInCheck(kingColor) {
    const allBoxes = document.querySelectorAll('.box');
    const kingBox = Array.from(allBoxes).find(box => box.querySelector('img') && box.querySelector('img').id === `${kingColor}king`);
    return Array.from(allBoxes).some(box => {
        const piece = box.querySelector('img');
        return piece && piece.id[0] !== kingColor && isValidMove(box, kingBox, piece.id).valid;
    });
}

function isCheckmate(kingColor) {
    const allBoxes = document.querySelectorAll('.box');
    const kingBox = Array.from(allBoxes).find(box => box.querySelector('img') && box.querySelector('img').id === `${kingColor}king`);
    const kingMoves = [
        { row: 1, col: 0 },
        { row: -1, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: -1 },
        { row: 1, col: 1 },
        { row: 1, col: -1 },
        { row: -1, col: 1 },
        { row: -1, col: -1 }
    ];

    const fromId = kingBox.id;
    const fromRow = parseInt(fromId[1]);
    const fromCol = fromId.charCodeAt(0);

    const kingEscapeMoves = kingMoves.filter(move => {
        const newRow = fromRow + move.row;
        const newCol = fromCol + move.col;
        const newBox = document.getElementById(`${String.fromCharCode(newCol)}${newRow}`);
        if (newBox && (!newBox.querySelector('img') || newBox.querySelector('img').id[0] !== kingColor)) {
            return isSquareSafe(newBox, kingColor);
        }
        return false;
    });

    if (kingEscapeMoves.length > 0) {
        return false;
    }

    const attackingPieceBox = Array.from(allBoxes).find(box => {
        const piece = box.querySelector('img');
        return piece && piece.id[0] !== kingColor && isValidMove(box, kingBox, piece.id).valid;
    });

    if (!attackingPieceBox) {
        return false;
    }

    const attackingPieceId = attackingPieceBox.id;

    return !Array.from(allBoxes).some(box => {
        const piece = box.querySelector('img');
        return piece && piece.id[0] === kingColor && canPieceBlockCheck(box, attackingPieceBox, kingBox, piece.id);
    });
}

function isSquareSafe(box, kingColor) {
    const allBoxes = document.querySelectorAll('.box');
    return !Array.from(allBoxes).some(opponentBox => {
        const piece = opponentBox.querySelector('img');
        return piece && piece.id[0] !== kingColor && isValidMove(opponentBox, box, piece.id).valid;
    });
}

function canPieceBlockCheck(pieceBox, attackingPieceBox, kingBox, pieceType) {
    const allBoxes = document.querySelectorAll('.box');
    const attackingPiece = attackingPieceBox.querySelector('img').id;
    if (attackingPiece[1] === 'knight') {
        return Array.from(allBoxes).some(box => {
            const validMove = isValidMove(pieceBox, box, pieceType);
            if (validMove.valid) {
                const originalContent = box.innerHTML;
                box.innerHTML = pieceBox.innerHTML;
                pieceBox.innerHTML = '';
                const isKingStillInCheck = isKingInCheck(kingBox.querySelector('img').id[0]);
                box.innerHTML = originalContent;
                pieceBox.innerHTML = `<img class='all-img' id="${pieceType}" src="${pieceType}.png" alt="" draggable="true">`;
                return !isKingStillInCheck;
            }
            return false;
        });
    } else {
        const pathToCheck = getPathBetween(attackingPieceBox, kingBox);
        return Array.from(allBoxes).some(box => {
            const validMove = isValidMove(pieceBox, box, pieceType);
            if (validMove.valid && pathToCheck.includes(box.id)) {
                const originalContent = box.innerHTML;
                box.innerHTML = pieceBox.innerHTML;
                pieceBox.innerHTML = '';
                const isKingStillInCheck = isKingInCheck(kingBox.querySelector('img').id[0]);
                box.innerHTML = originalContent;
                pieceBox.innerHTML = `<img class='all-img' id="${pieceType}" src="${pieceType}.png" alt="" draggable="true">`;
                return !isKingStillInCheck;
            }
            return false;
        });
    }
}

function getPathBetween(fromBox, toBox) {
    const path = [];
    const fromId = fromBox.id;
    const toId = toBox.id;
    const fromRow = parseInt(fromId[1]);
    const fromCol = fromId.charCodeAt(0);
    const toRow = parseInt(toId[1]);
    const toCol = toId.charCodeAt(0);
    const rowStep = fromRow < toRow ? 1 : fromRow > toRow ? -1 : 0;
    const colStep = fromCol < toCol ? 1 : fromCol > toCol ? -1 : 0;
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    while (currentRow !== toRow || currentCol !== toCol) {
        path.push(`${String.fromCharCode(currentCol)}${currentRow}`);
        currentRow += rowStep;
        currentCol += colStep;
    }
    return path;
}

function insertImages() {
    document.querySelectorAll('.box').forEach(image => {
        if (image.innerText.length !== 0) {
            if (image.innerText == 'Wpawn' || image.innerText == 'Bpawn') {
                image.innerHTML = `<img class='all-img all-pawn' id="${image.innerText}" src="${image.innerText}.png" alt="" draggable="true">`
                image.style.cursor = 'pointer';
            } else {
                image.innerHTML = `<img class='all-img' id="${image.innerText}" src="${image.innerText}.png" alt="" draggable="true">`
                image.style.cursor = 'pointer';
            }
        }
    });
}

function coloring() {
    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
        const getId = box.id;
        const a = (getId[0].charCodeAt(0) - 65) + (parseInt(getId[1]));
        if (a % 2 == 0) {
            box.style.background = 'rgb(232 235 239)';
        } else {
            box.style.background = 'rgb(125 135 150)';
        }
    });
}

function resetBoard() {
    const initialPositions = [
        { id: 'H8', piece: 'Brook' },
        { id: 'G8', piece: 'Bknight' },
        { id: 'F8', piece: 'Bbishop' },
        { id: 'E8', piece: 'Bqueen' },
        { id: 'D8', piece: 'Bking' },
        { id: 'C8', piece: 'Bbishop' },
        { id: 'B8', piece: 'Bknight' },
        { id: 'A8', piece: 'Brook' },
        { id: 'H7', piece: 'Bpawn' },
        { id: 'G7', piece: 'Bpawn' },
        { id: 'F7', piece: 'Bpawn' },
        { id: 'E7', piece: 'Bpawn' },
        { id: 'D7', piece: 'Bpawn' },
        { id: 'C7', piece: 'Bpawn' },
        { id: 'B7', piece: 'Bpawn' },
        { id: 'A7', piece: 'Bpawn' },
        { id: 'H2', piece: 'Wpawn' },
        { id: 'G2', piece: 'Wpawn' },
        { id: 'F2', piece: 'Wpawn' },
        { id: 'E2', piece: 'Wpawn' },
        { id: 'D2', piece: 'Wpawn' },
        { id: 'C2', piece: 'Wpawn' },
        { id: 'B2', piece: 'Wpawn' },
        { id: 'A2', piece: 'Wpawn' },
        { id: 'H1', piece: 'Wrook' },
        { id: 'G1', piece: 'Wknight' },
        { id: 'F1', piece: 'Wbishop' },
        { id: 'E1', piece: 'Wqueen' },
        { id: 'D1', piece: 'Wking' },
        { id: 'C1', piece: 'Wbishop' },
        { id: 'B1', piece: 'Wknight' },
        { id: 'A1', piece: 'Wrook' },
    ];
    document.querySelectorAll('.box').forEach(box => {
        box.innerHTML = '';
    });
    initialPositions.forEach(position => {
        const box = document.getElementById(position.id);
        box.innerHTML = `<img class='all-img' id="${position.piece}" src="${position.piece}.png" alt="" draggable="true">`;
    });
    turn = 'W';
    document.getElementById('toggle').innerText = "White's Turn";
    enPassantTarget = null;
    moveCounter = 0;

    whiteTime = 300;
    blackTime = 300;
    updateTimerDisplay('white-timer', whiteTime);
    updateTimerDisplay('black-timer', blackTime);
    timerStarted = false;
}

insertImages();
coloring();
resetBoard();
