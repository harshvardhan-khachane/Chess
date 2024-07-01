let selectedPiece = null;
let selectedPieceType = '';
let turn = 'W';
let enPassantTarget = null;
let moveCounter = 0;

document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', handleBoxClick);
    box.addEventListener('dragstart', handleDragStart);
    box.addEventListener('dragover', handleDragOver);
    box.addEventListener('drop', handleDrop);
    box.addEventListener('dragend', handleDragEnd);
});

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
            selectedPiece = null;
            selectedPieceType = '';
            enPassantTarget = validMove.enPassant ? box : null;
            pawnPromotion(box);
            checkGameState();
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
        selectedPiece = null;
        selectedPieceType = '';
        enPassantTarget = validMove.enPassant ? box : null;
        pawnPromotion(box);
        checkGameState();
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
    if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow && fromRow === enPassantRow && enPassantTarget && enPassantTarget.id[1] == toRow) {
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
        return { valid: true, enPassant: false };
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
    if (row === 8 && box.querySelector('img').id[0] === 'W') {
        promotePawn(box, 'W');
    } else if (row === 1 && box.querySelector('img').id[0] === 'B') {
        promotePawn(box, 'B');
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
        alert("Black wins!");
        resetBoard();
    } else if (!blackKing) {
        alert("White wins!");
        resetBoard();
    } else if (moveCounter >= 100) {
        alert("Draw!");
        resetBoard();
    }
}

function resetBoard() {
    // Reset the board to the initial state
    document.querySelectorAll('.box').forEach(box => {
        box.innerHTML = '';
    });
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
    initialPositions.forEach(position => {
        const box = document.getElementById(position.id);
        box.innerHTML = `<img class='all-img' id="${position.piece}" src="${position.piece}.png" alt="" draggable="true">`;
    });
    turn = 'W';
    document.getElementById('toggle').innerText = "White's Turn";
    enPassantTarget = null;
    moveCounter = 0;
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

insertImages();
coloring();
resetBoard();
