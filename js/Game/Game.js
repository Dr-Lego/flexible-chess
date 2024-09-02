class Game_ {
  constructor(players_, variant_) {
    // Initialize player information and game settings
    this.players = { white: players_[0], black: players_[1] };
    this.player_color = ["white", "black"][players_.indexOf("human")];
    this.board_orientation = this.player_color;
    this.variant = variant_.toLowerCase();
    this.whose_turn = "white";
    this.rules = undefined;
    this.possible_moves = undefined;
    this.selected_piece = "";
    this.selected_squares = [];
    this.check = false;
  }

  // Make a move on the chessboard
  makeMove(pos) {
    Chessboard.animateTo([[this.selected_piece, pos]]);

    if (Chessboard.board[pos]) {
      const piece = $(`piece[position='${pos}']`);
      const moved_piece = $(`piece[position='${this.selected_piece}']`).css(
        "z-index",
        2
      );
      piece
        .delay(300)
        .animate(
          { opacity: 0, size: "-=25px" },
          { duration: 100, queue: true }
        );
      piece.promise().done(function() {
        piece.remove();
        moved_piece.css("z-index", 0);
      });
    } else {
      $(`piece[position='${this.selected_piece}']`).css("z-index", 0);
    }
    $(`piece[position='${this.selected_piece}']`).attr("position", pos);
    Chessboard.board[pos] = Chessboard.board[this.selected_piece];
    Chessboard.board[pos]["position"] = pos;
    Chessboard.board[this.selected_piece] = undefined;
  }

  // Prepare for the next move
  prepareNextMove() {
    $("square.check").remove();
    console.time("test1");
    const help = MoveGeneration.getPossibleMoves(
      Chessboard.board,
      this.whose_turn
    );
    console.timeEnd("test1");

    this.possible_moves = help["moves"];
    this.check = help["check"].toString();
    if (this.check !== "0") {
      Chessboard.createMarker(this.check[0], this.check[1], "check");
    }
  }

  // Handle click events on the chessboard
  click(e) {
    const rect = HTML["board"].getBoundingClientRect();
    const pos = [
      Chessboard.switchNumber(
        Math.ceil((e.clientX - rect.x) / Chessboard.square_size),
        this.board_orientation
      ),
      Chessboard.switchNumber(
        9 - Math.ceil((e.clientY - rect.y) / Chessboard.square_size),
        this.board_orientation
      )
    ].join("");

    Chessboard.deleteAllMarkers();
    if (this.selected_squares.includes(pos)) {
      // Make move
      this.makeMove(pos);
      this.selected_piece = "";
      this.selected_squares = [];
      this.whose_turn = { white: "black", black: "white" }[this.whose_turn];
      this.prepareNextMove();
    } else if (
      !Chessboard.board[pos] ||
      pos === this.selected_piece ||
      Chessboard.board[pos].color !== this.whose_turn
    ) {
      // Deselect piece
      $(`piece[position='${this.selected_piece}']`).css("z-index", 0);
      this.selected_piece = "";
      this.selected_squares = [];
    } else if (Chessboard.board[pos]) {
      // Select new piece
      $(`piece[position='${this.selected_piece}']`).css("z-index", 0);
      $(`piece[position='${pos}']`).css("z-index", 2);
      this.selected_piece = pos;
      this.selected_squares = this.possible_moves[this.selected_piece];
      if (Chessboard.board[pos]["color"] === this.whose_turn) {
        Chessboard.createMarker(pos[0], pos[1], "selected");
        this.possible_moves[pos].forEach(move => {
          if (!Chessboard.board[move]) {
            Chessboard.createMarker(move[0], move[1], "point");
          } else {
            Chessboard.createMarker(move[0], move[1], "frame");
          }
        });
      }
    }
  }

  // Start the game
  startGame() {
    this.rules = eval(`${this.variant}Rules`);
    Chessboard.createBoard(this.board_orientation);
    Chessboard.loadPosition(this.rules.setup.names, this.board_orientation);
    this.prepareNextMove();

    // Add event listener for clicks on the board
    HTML["board"].addEventListener("click", e => this.click(e));
  }
}
