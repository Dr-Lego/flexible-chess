# (Unfinished) Chess Game with Flexible Rule Declaration


This project implements a chess game with a unique, flexible rule declaration system. It allows for easy creation of chess variants by modifying JSON-based rule definitions. The game features a custom board representation and multiple board and piece styles sourced from Lichess. However, this is mostly a proof of concept, not all chess rules are implemented yet and I (probably) won't continue it.

## How It Works

### Rule Definition
- Rules are defined in JSON format (e.g., in `js/Game/Rules/standard.js`)
- Each piece type has "move" and "capture" properties
- These properties contain arrays of movement patterns

### Movement Patterns
- Patterns are strings like "x+0;y+1c" or "x++8;y++8"
- 'x' and 'y' represent horizontal and vertical movement
- '+' or '-' indicate direction
- Numbers represent distance
- 'c' means the move is color-dependent (inverted for black pieces)
- '++' or '--' allow for sliding moves (e.g., for bishops or rooks)

### Decoding
- The `decode` function in `MoveGeneration` interprets these patterns
- It calculates actual board positions based on the piece's current position
- Special cases like pawn double moves are handled in `specialMoves`

### Move Generation
- `getPossibleMoves` uses these rules to generate all legal moves
- It checks for basic move legality and piece capture rules

### Flexibility
- New chess variants can be created by modifying the rule definitions
- No need to change the core game logic

## How to Use

1. Clone the repository
2. Open `index.html` in a web browser
3. To change settings, modify the `settings.js` file:
   ```javascript
   var settings = {
     board_style: "brown", // Options: "brown", "blue", "green"
     piece_style: "Skribble" // Options: "Skribble", "Maestro", "Neo", "Standard"
   };
   ```
4. To create a new chess variant:
   - Define new movement rules in JSON format in a new file under `js/Game/Rules/`
   - Update the game initialization in `js/Game/main.js` to use the new rules

## Current Limitations

- Check detection is not fully implemented
- Some advanced chess rules (e.g., en passant, castling) are not yet available
- This project is currently unfinished and serves primarily as a proof of concept

## Possible Future Development

- Implement complete check and checkmate detection
- Add support for more advanced chess rules
- Develop an AI opponent
- Expand the variety of chess variants available

## Contributing

As this is a proof of concept, contributions are welcome. Please feel free to fork the repository and submit pull requests with improvements or new features.

## Credits

- Board styles and piece designs are sourced from [Lichess](https://lichess.org/), an open-source chess server
- jQuery is used for DOM manipulation