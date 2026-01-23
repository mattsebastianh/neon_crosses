export type Player = 'X' | 'O' | null;
export type BoardState = Player[];

export const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function checkWinner(board: BoardState): Player | 'DRAW' | null {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (!board.includes(null)) {
        return 'DRAW';
    }
    return null;
}

// AI LOGIC
export function getBestMove(board: BoardState, player: Player): number {
    if (!player) return -1;

    // Simple Minimax
    const opponent = player === 'X' ? 'O' : 'X';

    // 1. Can I win now?
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            const newBoard = [...board];
            newBoard[i] = player;
            if (checkWinner(newBoard) === player) return i;
        }
    }

    // 2. Must I block?
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            const newBoard = [...board];
            newBoard[i] = opponent;
            if (checkWinner(newBoard) === opponent) return i;
        }
    }

    // 3. Strategic center
    if (board[4] === null) return 4;

    // 4. Random available
    const available = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
    return available[Math.floor(Math.random() * available.length)];
}

export function getRandomMove(board: BoardState): number {
    const available = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
    if (available.length === 0) return -1;
    return available[Math.floor(Math.random() * available.length)];
}

export function getMediumMove(board: BoardState, player: Player): number {
    // 60% chance to play best move, 40% random
    return Math.random() > 0.4 ? getBestMove(board, player) : getRandomMove(board);
}
