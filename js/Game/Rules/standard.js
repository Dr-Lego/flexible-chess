const standardRules = {
  settings: {
    captureOwnPieces: false,
    checkEnabled: true
  },
  setup: {
    names: [
      "rnbqkbnr",
      "pppppppp",
      "--------",
      "--------",
      "--------",
      "--------",
      "PPPPPPPP",
      "RNBQKBNR"
    ]
  },
  pieces: {
    pawn: {
      move: ["x+0;y+1c"],
      capture: ["x-1;y+1c", "x+1;y+1c"]
    },
    knight: {
      move: [
        "x+1;y+2",
        "x-1;y+2",
        "x+1;y-2",
        "x-1;y-2",
        "x+2;y+1",
        "x+2;y-1",
        "x-2;y+1",
        "x-2;y-1"
      ],
      capture: [
        "x+1;y+2",
        "x-1;y+2",
        "x+1;y-2",
        "x-1;y-2",
        "x+2;y+1",
        "x+2;y-1",
        "x-2;y+1",
        "x-2;y-1"
      ]
    },
    bishop: {
      move: ["x++8;y++8", "x++8;y--8", "x--8;y++8", "x--8;y--8"],
      capture: ["x++8;y++8", "x++8;y--8", "x--8;y++8", "x--8;y--8"]
    },
    rook: {
      move: ["x++0;y++8", "x++0;y--8", "x++8;y++0", "x--8;y++0"],
      capture: ["x++0;y++8", "x++0;y--8", "x++8;y++0", "x--8;y++0"]
    },
    queen: {
      move: [
        "x++8;y++8",
        "x++8;y--8",
        "x--8;y++8",
        "x--8;y--8",
        "x++0;y++8",
        "x++0;y--8",
        "x++8;y++0",
        "x--8;y++0"
      ],
      capture: [
        "x++8;y++8",
        "x++8;y--8",
        "x--8;y++8",
        "x--8;y--8",
        "x++0;y++8",
        "x++0;y--8",
        "x++8;y++0",
        "x--8;y++0"
      ]
    },
    king: {
      move: [
        "x+0;y+1",
        "x+1;y+1",
        "x+1;y+0",
        "x+1;y-1",
        "x+0;y-1",
        "x-1;y-1",
        "x-1;y+0",
        "x-1;y+1"
      ],
      capture: [
        "x+0;y+1",
        "x+1;y+1",
        "x+1;y+0",
        "x+1;y-1",
        "x+0;y-1",
        "x-1;y-1",
        "x-1;y+0",
        "x-1;y+1"
      ]
    }
  }
};
