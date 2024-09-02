let MoveGeneration = {
  isValidMove(board_, move_, color_) {
    const board = board_;
    return (
      !board[move_[1]] || (board[move_[1]] && board[move_[1]].color !== color_)
    );
  },

  specialMoves(code_, square, board) {
    let code = code_;
    if (square.name === "pawn") {
      if (
        /x\+0;y\+1c?/.test(code) &&
        square.position[1] ===
          (2 +
            (code.split(";")[1].includes("c") && square.color === "black") *
              5).toString()
      ) {
        code = code.replaceAll("+", "++").replaceAll("1", "2");
      }
    }
    return code;
  },

  getKingMoves(board, attacked_squares, square) {
    let moves = [];
    let pseudo_possible = { move: [], capture: [] };

    Game.rules.pieces[square.name].move.forEach(code => {
      pseudo_possible.move = pseudo_possible.move.concat(
        this.decode(code, square, board)
      );
    });

    if (
      Game.rules.pieces[square.name].move.join("") !==
      Game.rules.pieces[square.name].capture.join("")
    ) {
      Game.rules.pieces[square.name].capture.forEach(code => {
        pseudo_possible.capture = pseudo_possible.capture.concat(
          this.decode(code, square, board)
        );
      });
    } else {
      pseudo_possible.capture = pseudo_possible.move;
    }

    let pseudo_possible_all = new Set([
      ...pseudo_possible.move,
      ...pseudo_possible.capture
    ]);

    pseudo_possible_all.forEach(move => {
      if (!attacked_squares.includes(move)) {
        if (board[move]) {
          if (
            (board[move].color === Game.player_color &&
              Game.rules.settings.captureOwnPieces) ||
            (board[move].color !== square.color &&
              pseudo_possible.capture.includes(move))
          ) {
            moves.push(move);
          }
        } else if (pseudo_possible.move.includes(move)) {
          moves.push(move);
        }
      }
    });

    return moves;
  },

  getPossibleMoves(board_, color) {
    const board = board_;
    let possible_moves = {};
    let attacked_squares = this.getAttackedSquares(
      board,
      { white: "black", black: "white" }[color]
    );
    let check = "0";

    if (Game.rules.settings.checkEnabled) {
      const getKingPos = function(color) {
        for (const square_ in board) {
          const square = board[square_];
          if (square && square.name === "king" && square.color === color) {
            return square;
          }
        }
      };

      const position = getKingPos(color);
      check = attacked_squares.includes(position.position)
        ? position.position
        : "0";
      possible_moves[position.position] = this.getKingMoves(
        board_,
        attacked_squares,
        position
      );
    }

    for (let y = 1; y < 9; y++) {
      for (let x = 1; x < 9; x++) {
        if (board[`${x}${y}`] && color === board[`${x}${y}`].color) {
          const square = board[`${x}${y}`];
          if (
            Object.keys(Game.rules.pieces).includes(square.name) &&
            (square.name !== "king" || !Game.rules.settings.checkEnabled)
          ) {
            possible_moves[square.position] = [];
            let pseudo_possible = { move: [], capture: [] };

            Game.rules.pieces[square.name].move.forEach(code => {
              pseudo_possible.move = pseudo_possible.move.concat(
                this.decode(code, square, board)
              );
            });

            if (
              Game.rules.pieces[square.name].move.join("") !==
              Game.rules.pieces[square.name].capture.join("")
            ) {
              Game.rules.pieces[square.name].capture.forEach(code => {
                pseudo_possible.capture = pseudo_possible.capture.concat(
                  this.decode(code, square, board)
                );
              });
            } else {
              pseudo_possible.capture = pseudo_possible.move;
            }

            let pseudo_possible_all = new Set([
              ...pseudo_possible.move,
              ...pseudo_possible.capture
            ]);

            pseudo_possible_all.forEach(move => {
              if (board[move]) {
                if (
                  (board[move].color === color &&
                    Game.rules.settings.captureOwnPieces) ||
                  (board[move].color !== square.color &&
                    pseudo_possible.capture.includes(move))
                ) {
                  possible_moves[square.position].push(move);
                }
              } else if (pseudo_possible.move.includes(move)) {
                possible_moves[square.position].push(move);
              }
            });
          }
        }
      }
    }

    return { moves: possible_moves, check: check };
  },

  plusToMinus(text) {
    return text.replace(/(\+|\-)/g, match => (match === "+" ? "-" : "+"));
  },

  decode(code_, square, board_) {
    let code = this.specialMoves(code_, square, board_).split(";");

    if (!code[0].includes("++") && !code[0].includes("--")) {
      let posX = code[0].replace("x", square.position[0]);
      if (posX.includes("c") && square.color === "black") {
        posX = this.plusToMinus(posX);
      }
      let posY = code[1].replace("y", square.position[1]);
      if (posY.includes("c") && square.color === "black") {
        posY = this.plusToMinus(posY);
      }
      let move = eval(posX.replace("c", "")) + "" + eval(posY.replace("c", ""));
      return /^[1-8][1-8]$/.test(move) ? [move] : [];
    } else {
      let moves = [];
      let [x, y] = square.position.split("").map(Number);
      let max = code.map(c => parseInt(/\d+/.exec(c)[0]));
      let maxDistance = Math.max(...max);

      for (let d = 1; d <= maxDistance; d++) {
        let move = code
          .map((c, i) => {
            if (c.includes("c") && square.color === "black") {
              c = this.plusToMinus(c);
            }
            return eval(
              c.replace(/(\+|\-)\d+/, d > max[i] ? max[i] : d).replace("c", "")
            ).toString();
          })
          .join("");

        if (/^[1-8][1-8]$/.test(move)) {
          moves.push(move);
          if (board_[move]) break;
        } else {
          break;
        }
      }
      return moves;
    }
  },

  getAttackedSquares(board_, color) {
    const board = board_;
    let attacked = [];

    for (let y = 1; y < 9; y++) {
      for (let x = 1; x < 9; x++) {
        if (board[`${x}${y}`] && color === board[`${x}${y}`].color) {
          const square = board[`${x}${y}`];
          if (Object.keys(Game.rules.pieces).includes(square.name)) {
            Game.rules.pieces[square.name].capture.forEach(code => {
              attacked = attacked.concat(this.decode(code, square, board));
            });
          }
        }
      }
    }

    return Array.from(new Set(attacked));
  }
};
