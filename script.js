const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const setBox = (index, sign) => {
        if(index > board.length) return;
        board[index] = sign;
    }

    const getBox = (index) => {
        if(index > board.length) return;
        return board[index];
    }

    const reset = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = "";
        }
    }

    return {setBox, getBox, reset};
})();

const Player = (sign) => {
    this.sign = sign;

    const getSign = () => {
        return sign;
    }

    return {getSign};
};

const gameControl = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let isOver = false;
    let round = 1;

    const playRound = (boxIndex) => {
        gameBoard.setBox(boxIndex, getCurrentPlayerSign());
        if (checkWinner(boxIndex)) {
          displayControl.setResultMessage(getCurrentPlayerSign());
          isOver = true;
          return;
        }
        if (round === 9) {
          displayControl.setResultMessage("Draw");
          isOver = true;
          return;
        }
        round++;
        displayControl.setMessageElement(
          `Player ${getCurrentPlayerSign()}'s turn`
        );
    }

    const checkWinner = (boxIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winConditions
            .filter((combination) => combination.includes(boxIndex))
            .some((possibleCombination) =>
            possibleCombination.every(
                (index) => gameBoard.getBox(index) === getCurrentPlayerSign()
            )
            );
    }

    const getCurrentPlayerSign = () => {
        if(round % 2 == 1){
            return playerX.getSign();
        }
        else{
            return playerO.getSign();
        }
    }

    const getIsOver = () => {
        return isOver;
    }

    const reset = () => {
        round = 1;
        isOver = false;
    }

    return {playRound, getIsOver, reset};
})();

const displayControl = (() => {
    const boxElements = document.querySelectorAll(".box");
    const messageElement = document.querySelector(".message");
    const restartButton = document.querySelector(".restart-button");

    boxElements.forEach((box) =>
    box.addEventListener("click", (e) => {
      if (gameControl.getIsOver() || e.target.textContent !== "") return;
      gameControl.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
    }));

    restartButton.addEventListener("click", (e) => {
        gameBoard.reset();
        gameControl.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
      });
    
    const updateGameboard = () => {
        for (let i = 0; i < boxElements.length; i++) {
            boxElements[i].textContent = gameBoard.getBox(i);
        }
    };

    const setResultMessage = (winner) => {
        if (winner === "Draw") {
          setMessageElement("It's a draw!");
        } else {
          setMessageElement(`Player ${winner} has won!`);
        }
    }

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    }

    return {setResultMessage, setMessageElement};
})();