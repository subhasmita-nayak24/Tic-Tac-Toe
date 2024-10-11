import React, { useState, useEffect } from 'react';
import './TicTacToe.css'; 

// This function checks if there's a winner
const checkWinner = (board) => {
  // All possible winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ];

  // Loop through all combinations to see if a player has won
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return 'X' (User) or 'O' (Computer)
    }
  }
  return null; // No winner yet
};

// Function to help computer find the best move
const getBestMove = (board, player) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  // Look for either a winning move or a blocking move
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] === player && board[b] === player && !board[c]) return c;
    if (board[a] === player && board[c] === player && !board[b]) return b;
    if (board[b] === player && board[c] === player && !board[a]) return a;
  }
  return null; // No special move found
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null)); // 9 squares, all empty initially
  const [isUserTurn, setIsUserTurn] = useState(true); // User plays first
  const [winner, setWinner] = useState(null); // To track if someone has won
  const [isDraw, setIsDraw] = useState(false); // Track if the game is a draw
  const [userScore, setUserScore] = useState(0); // User's score
  const [computerScore, setComputerScore] = useState(0); // Computer's score

  // Function to handle when a user clicks on a square
  const handleClick = (index) => {
    if (board[index] || winner || isDraw) return; // Don't do anything if square is filled, game is over, or draw

    const newBoard = [...board];
    newBoard[index] = 'X'; // User plays 'X'
    setBoard(newBoard);
    setIsUserTurn(false); // Switch to computer's turn
  };

  // Computer makes a move
  const computerMove = () => {
    const emptySquares = board.map((square, index) => square === null ? index : null).filter(val => val !== null);

    // Computer tries to find a winning move, block the user, or picks a random square
    const bestMove = getBestMove(board, 'O') || getBestMove(board, 'X');
    const randomMove = bestMove !== null ? bestMove : emptySquares[Math.floor(Math.random() * emptySquares.length)];

    const newBoard = [...board];
    newBoard[randomMove] = 'O'; // Computer plays 'O'
    setBoard(newBoard);
    setIsUserTurn(true); // Switch back to user's turn
  };

  // Check if there's a winner, draw, or computer's turn
  useEffect(() => {
    const result = checkWinner(board); // Check if someone won
    if (result) {
      setWinner(result); // Update the winner state
      if (result === 'X') {
        setUserScore(userScore + 1); // Update user score if user wins
      } else {
        setComputerScore(computerScore + 1); // Update computer score if computer wins
      }
    } else if (!board.includes(null) && !result) {
      // If no more empty squares and no winner, it's a draw
      setIsDraw(true);
    } else if (!isUserTurn && !winner && !isDraw) {
      setTimeout(computerMove, 500); // Computer moves after a short delay
    }
  }, [board, isUserTurn, winner, isDraw]);

  // Reset the game for a new round
  const resetGame = () => {
    setBoard(Array(9).fill(null)); // Clear the board
    setIsUserTurn(true); // User goes first again
    setWinner(null); // Clear the winner
    setIsDraw(false); // Clear the draw state
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-500">
      <h1 className="font-bold text-6xl text-black mb-4">Tic-Tac-Toe</h1>

      {/* Scoreboard */}
      <div className="text-black font-bold text-lg mb-6">
        <p>User (X): {userScore}</p>
        <p>Computer (O): {computerScore}</p>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-4">
        {board.map((square, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`w-20 h-20 bg-white text-2xl font-bold animate-move ${square ? 'filled' : ''}`}
          >
            {square}
          </button>
        ))}
      </div>


      {/* Display winner, draw, or current turn */}
      {winner ? (
        <div className="mt-4 text-2xl font-bold text-black">
          {winner} wins!
        </div>
      ) : isDraw ? (
        <div className="mt-4 text-2xl font-bold text-black">
          It's a draw!
        </div>
      ) : (
        <div className="mt-4 text-2xl font-bold text-black">
          {isUserTurn ? "Your turn (X)" : "Computer's turn (O)"}
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={resetGame}
        className="mt-4 bg-black text-lg text-purple-500 px-6 py-2 rounded"
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
