class Chessboard_ {
  constructor() {
    this.resize(this);

    // Define color schemes for different board styles
    this.color_scheme = {
      brown: ["#f0d9b5", "#b58863"],
      blue: ["#dee3e6", "#8ca2ad"],
      green: ["#ffffdd", "#86a666"]
    };

    // Initialize the board first
    this.createBoard(Game.board_orientation || "white");

    // Now it's safe to call resize
    this.resize(this);

    // Bind methods to the instance
    this.createPiece = this.createPiece.bind(this);
    this.convertPieceName = this.convertPieceName.bind(this);
    this.createCoordinates = this.createCoordinates.bind(this);
    this.createMarker = this.createMarker.bind(this);
    this.deleteAllMarkers = this.deleteAllMarkers.bind(this);
    this.position = this.position.bind(this);
    this.animateTo = this.animateTo.bind(this);
    this.switchNumber = this.switchNumber.bind(this);
    this.loadPosition = this.loadPosition.bind(this);
    this.setupBoard = this.setupBoard.bind(this);
    this.resize = this.resize.bind(this);
    this.createBoard = this.createBoard.bind(this);
  }

  // Create a chess piece element
  createPiece(name, color, position, orientation) {
    const names = [
      "king",
      "queen",
      "bishop",
      "knight",
      "rook",
      "pawn",
      "k",
      "q",
      "b",
      "n",
      "r",
      "p"
    ];
    const colors = ["white", "black", "w", "b"];

    const element = document.createElement("piece");
    element.className = `${colors[colors.indexOf(color) % 2]} ${names[
      names.indexOf(name) % 6
    ]}`;
    element.style.left = `${(this.switchNumber(position[0], orientation) - 1) *
      this.square_size}px`;
    element.style.top = `${(8 - this.switchNumber(position[1], orientation)) *
      this.square_size}px`;
    element.setAttribute("position", position.join(""));

    HTML.board.appendChild(element, HTML.board_markers);
  }

  // Convert piece name to standard format
  convertPieceName(name) {
    const names = [
      "king",
      "queen",
      "bishop",
      "knight",
      "rook",
      "pawn",
      "k",
      "q",
      "b",
      "n",
      "r",
      "p"
    ];
    return names[(names.indexOf(name) + 6) % 6];
  }

  // Create coordinate labels on the board
  createCoordinates(orientation) {
    for (let y = 0; y < 8; y++) {
      const element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      element.setAttribute(
        "class",
        ["coordinate-dark", "coordinate-light"][y % 2]
      );
      element.setAttribute("x", 4);
      element.setAttribute("y", 16 + y * 100);
      element.setAttribute("font-size", 12);
      element.innerHTML = "87654321"[
        Math.abs((orientation == "black") * 7 - y)
      ];
      HTML.board_coordinates.appendChild(element);
    }

    for (let x = 0; x < 8; x++) {
      const element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      element.setAttribute(
        "class",
        ["coordinate-dark", "coordinate-light"].reverse()[x % 2]
      );
      element.setAttribute("y", 795);
      element.setAttribute("x", 88 + x * 100);
      element.setAttribute("font-size", 12);
      element.innerHTML = "abcdefgh"[
        Math.abs((orientation == "black") * 7 - x)
      ];
      HTML.board_coordinates.appendChild(element);
    }
  }

  // Create a marker on the board
  createMarker(x_, y_, type) {
    const x = this.switchNumber(x_);
    const y = this.switchNumber(y_);
    const u = this.square_size;
    var element = document.createElement("square");
    element.style.transform = `translate(${(x - 1) * u}px, ${(8 - y) * u}px)`;
    element.setAttribute(
      "class",
      {
        selected: "selected",
        point: "move-dest",
        check: "check",
        frame: "move-dest take"
      }[type]
    );
    HTML.board_squares.appendChild(element);
  }

  deleteAllMarkers() {
    $(".move-dest,.move-dest.take,.selected").remove();
  }

  // Calculate position based on board orientation
  position(pos_) {
    const pos = pos_.toString();
    const x =
      Math.abs((Game.board_orientation == "black") * 7 - (pos[0] - 1)) *
      this.square_size;
    const y =
      Math.abs([7, 0][(Game.board_orientation == "black") * 1] - (pos[1] - 1)) *
      this.square_size;
    return [x, y];
  }

  // Animate pieces to new positions
  animateTo(pieces) {
    for (let i = 0; i < pieces.length; i++) {
      const piece = $(`piece[position='${pieces[i][0]}']`);
      const move = [this.position(pieces[i][0]), this.position(pieces[i][1])];
      piece.animate(
        { left: `${move[1][0]}px`, top: `${move[1][1]}px` },
        { duration: 350, queue: false }
      );
    }
  }

  // Switch number based on orientation
  switchNumber(num, orientation_) {
    let orientation = orientation_;
    if (!orientation) {
      orientation = Game.board_orientation;
    }
    return Math.abs((orientation == "black") * 9 - parseInt(num));
  }

  // Load chess position
  loadPosition(position_, orientation) {
    this.board = {};

    for (let y = 1; y < 9; y++) {
      const row = position_[8 - y];
      for (let x = 1; x < 9; x++) {
        const pos = `${x}${y}`;
        const name = row[x - 1];
        if (name !== "-") {
          this.board[pos] = {
            name: this.convertPieceName(name.toLowerCase()),
            color: name === name.toLowerCase() ? "black" : "white",
            position: pos
          };
        }
      }
    }

    Object.keys(this.board).forEach(square => {
      if (this.board[square]) {
        this.createPiece(
          this.board[square].name,
          this.board[square].color,
          [square[0], square[1]],
          orientation
        );
      }
    });
  }

  // Set up the chess board
  setupBoard(names_) {
    this.loadPosition(names_);
  }

  // Resize the chess board
  setupBoard(names_) {
    this.loadPosition(names_);
  }

  resize(me) {
    this.deleteAllMarkers();
    HTML.screen_size = [window.innerWidth, window.innerHeight];
    var rounded_size = Math.min(
      HTML.screen_size[0] * 0.7,
      HTML.screen_size[1] * 0.9
    );
    rounded_size = Math.round(Math.round(rounded_size / 16) * 16);
    HTML.css.set("board-size", Math.round(rounded_size) + "px");
    me.size = $("#board").height();
    me.square_size = Math.round(me.size / 8);
    HTML.css.set(
      "square-size",
      Math.round(parseInt(HTML.css.get("board-size")) / 8) + "px"
    );
    $("piece").each(function(index) {
      const piece = $(this);
      const position = piece.attr("position");
      piece.css({
        left: `${(me.switchNumber(position[0], Game.board_orientation) - 1) *
          me.square_size}px`,
        top: `${(8 - me.switchNumber(position[1], Game.board_orientation)) *
          me.square_size}px`
      });
    });
    if (Game.check != "0") {
      $("square.check").remove();
      me.createMarker(Game.check[0], Game.check[1], "check");
    }
  }

  createBoard(orientation) {
    $("#board").empty();
    HTML[
      "board"
    ].style.backgroundImage = `url(assets/board/${settings.board_style}.svg)`;
    HTML.css.set("light-square", this.color_scheme[settings.board_style][0]);
    HTML.css.set("dark-square", this.color_scheme[settings.board_style][1]);
    $("#PieceStyle").attr("href", `assets/pieces/${settings.piece_style}.css`);
    let element = document.createElement("div");
    element.id = "squares";
    HTML["board"].appendChild(element);
    HTML["board_squares"] = document.getElementById("squares");
    element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.id = "coordinates";
    element.setAttribute("width", "100%");
    element.setAttribute("height", "100%");
    element.setAttribute("viewBox", "0 0 800 800");
    HTML["board"].appendChild(element);
    HTML["board_coordinates"] = document.getElementById("coordinates");
    this.createCoordinates(orientation);
    window.addEventListener("resize", () => this.resize(this));
  }
}
