import React, { useState, useEffect } from 'react';
import { GameMode } from '../App';
import { checkWinner, getBestMove, getMediumMove, getRandomMove, Player, BoardState, WINNING_COMBINATIONS } from '../logic/gameLogic';
import { useStats } from '../hooks/useStats';
import './GameBoard.css';
import clsx from 'clsx';

interface GameBoardProps {
    difficulty: GameMode;
    onBack: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, onBack }) => {
    const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player is always X and goes first
    const [gameResult, setGameResult] = useState<Player | 'DRAW' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);

    const { recordWin, recordLoss, recordDraw } = useStats();

    useEffect(() => {
        if (!isPlayerTurn && !gameResult) {
            // AI Turn
            const timer = setTimeout(() => {
                makeAiMove();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, gameResult]);

    const handleCellClick = (index: number) => {
        if (board[index] || !isPlayerTurn || gameResult) return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);

        checkGameStatus(newBoard);
        setIsPlayerTurn(false);
    };

    const makeAiMove = () => {
        let moveIndex = -1;
        if (difficulty === 'easy') moveIndex = getRandomMove(board);
        else if (difficulty === 'medium') moveIndex = getMediumMove(board, 'O');
        else moveIndex = getBestMove(board, 'O');

        if (moveIndex !== -1) {
            const newBoard = [...board];
            newBoard[moveIndex] = 'O';
            setBoard(newBoard);
            checkGameStatus(newBoard);
            setIsPlayerTurn(true);
        }
    };

    const checkGameStatus = (currentBoard: BoardState) => {
        const result = checkWinner(currentBoard);
        if (result) {
            setGameResult(result);
            if (result !== 'DRAW') {
                const line = WINNING_COMBINATIONS.find(([a, b, c]) =>
                    currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]
                );
                if (line) setWinningLine(line);
                if (result === 'X') recordWin(difficulty);
                else recordLoss(difficulty);
            } else {
                recordDraw(difficulty);
            }
        }
    };

    return (
        <div className="game-screen">
            <div className="game-header">
                <button className="btn-small" onClick={onBack}>← BACK</button>
                <div className="difficulty-badge">{difficulty}</div>
            </div>

            <div className={clsx("board", gameResult && "game-over")}>
                {board.map((cell, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "cell",
                            cell === 'X' ? "cell-x" : cell === 'O' ? "cell-o" : "",
                            winningLine?.includes(idx) && "winning-cell",
                            !cell && !gameResult && isPlayerTurn && "cell-active"
                        )}
                        onClick={() => handleCellClick(idx)}
                    >
                        {cell}
                    </div>
                ))}

                {winningLine && (
                    <div className={`strike-line strike-${WINNING_COMBINATIONS.indexOf(winningLine)}`}></div>
                )}
            </div>

            <div className="status-message">
                {gameResult ? (
                    <div className="result-text">
                        {gameResult === 'DRAW' ? "IT'S A DRAW!" : `${gameResult} WINS!`}
                        <button className="btn-play-again" onClick={() => {
                            setBoard(Array(9).fill(null));
                            setGameResult(null);
                            setWinningLine(null);
                            setIsPlayerTurn(true);
                        }}>PLAY AGAIN</button>
                    </div>
                ) : (
                    <div className="turn-indicator">
                        {isPlayerTurn ? "YOUR TURN" : "AI THINKING..."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameBoard;
