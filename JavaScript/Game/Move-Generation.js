let MoveGeneration = {
    isValidMove(board_,move_,color_){
        const board = board_;
        if(!board[move_[1]] || (board[move_[1]] && board[move_[1]].color != color_))
        {return(true)}else{return(false)}
    },
    
    specialMoves(code_,square,board){
        let code = code_;
        //pawn double move
        if(square.name == "pawn"){
            if(/x\+0;y\+1c?/.test(code) && square.position[1] == (2 + (code.split(";")[1].includes("c") && square.color == "black")*5).toString()){
                code = code.replaceAll("+","++").replaceAll("1","2");;
            }
        };
        return(code)
        
    },
    
    getKingMoves(board,attacked_squares,square){

        var moves = [];
        pseudo_possible = {"move":[],"capture":[]};
        
        //normal moves
        for (let i = 0; i < Game.rules.pieces[square.name]["move"].length; i++) {
            const code = Game.rules.pieces[square.name]["move"][i];
            pseudo_possible["move"] = pseudo_possible["move"].concat(this.decode(code, square,board));
        };
        //capturing moves
        if(Game.rules.pieces[square.name]["move"].join("") != Game.rules.pieces[square.name]["capture"].join("")){
            for (let i = 0; i < Game.rules.pieces[square.name]["capture"].length; i++) {
                const code = Game.rules.pieces[square.name]["capture"][i];
                pseudo_possible["capture"] = pseudo_possible["capture"].concat(this.decode(code, square,board));
            } 
        }else{
            //if capturing moves are == normal moves
            pseudo_possible["capture"] = pseudo_possible["move"];
        };
        pseudo_possible["all"] = new Set(pseudo_possible["move"].concat(pseudo_possible["capture"]));
        
        // test if moves are legal
        pseudo_possible["all"].forEach(move => {
            let OK = false;
            if(!attacked_squares.includes(move)){
                if(board[move]){
                    if(
                        (board[move].color == Game.player_color && Game.rules.settings.captureOwnPieces) || board[move].color != square.color
                        &&
                        pseudo_possible.capture.includes(move)
                        ){OK = true; }
                }else if(pseudo_possible["move"].includes(move)){
                        OK = true;
                };
                if(OK == true){moves.push(move); };
            }
        });
        
        return(moves)
    },
        
        getPossibleMoves(board_, color){
            const board = board_;
            var possible_moves = {};
            var attacked_squares = this.getAttackedSquares(board, {"white":"black","black":"white"}[color]);
            var check = undefined;
            if(Game.rules.settings.checkEnabled){
                const getKingPos = function(color){for (const square_ in board) {const square = board[square_];if(square){if(square.name == "king" && square.color == color){return(square);break}};}}
                const position = getKingPos(color);
                check = attacked_squares.includes(position.position)*position.position;
                possible_moves[position.position] = this.getKingMoves(board_,attacked_squares,position);
            }
            for (let y = 1; y < 9; y++) {
                for (let x = 1; x < 9; x++) {
                    if(board[`${x}${y}`]){
                        if(color == board[`${x}${y}`].color){
                            const square = board[`${x}${y}`]
                            if(Object.keys(Game.rules.pieces).includes(square.name) && (square.name != "king" || !Game.rules.settings.checkEnabled)){
                                possible_moves[square.position] = [];
                                pseudo_possible = {"move":[],"capture":[]};
                                
                                //pseudo possible moves
                                //normal moves
                                for (let i = 0; i < Game.rules.pieces[square.name]["move"].length; i++) {
                                    const code = Game.rules.pieces[square.name]["move"][i];
                                    pseudo_possible["move"] = pseudo_possible["move"].concat(this.decode(code, square,board));
                                };
                                //capturing moves
                                if(Game.rules.pieces[square.name]["move"].join("") != Game.rules.pieces[square.name]["capture"].join("")){
                                    for (let i = 0; i < Game.rules.pieces[square.name]["capture"].length; i++) {
                                        const code = Game.rules.pieces[square.name]["capture"][i];
                                        pseudo_possible["capture"] = pseudo_possible["capture"].concat(this.decode(code, square,board));
                                    } 
                                }else{
                                    //if capturing moves are == normal moves
                                    pseudo_possible["capture"] = pseudo_possible["move"];
                                };
                                
                                pseudo_possible["all"] = new Set(pseudo_possible["move"].concat(pseudo_possible["capture"]));
                                
                                // test if moves are legal
                                
                                pseudo_possible["all"].forEach(move => {
                                    let OK = false;
                                    if(board[move]){
                                        if(
                                            (board[move].color == color && Game.rules.settings.captureOwnPieces) || board[move].color != square.color
                                            &&
                                            pseudo_possible.capture.includes(move)
                                            ){OK = true; }
                                        }else if(pseudo_possible["move"].includes(move)){
                                            OK = true;
                                        };
                                        
                                        if(OK == true){possible_moves[square.position].push(move); };
                                    });
                                }
                            }
                        }
                    }
                    
                };
            return({"moves":possible_moves,"check":check})
        },
            
        //Oops... 
            plusToMinus(text){
                var a = ["-","+"]
                return(text.replaceAll(/(\+|\-)/g,a[text.includes("-")*1]))
            },
            
            
            decode(code_, square, board_){
                var code = this.specialMoves(code_,square,board_).split(";")
                var a = ["-","+"]//.reverse()
                if(!code[0].includes("++") && !code[0].includes("--")){
                    var posX = code[0].replace("x",square.position[0]);
                    if(posX.includes("c") && square.color == "black"){posX = this.plusToMinus(posX)};
                    var posY = code[1].replace("y",square.position[1]);
                    //console.log(posY,posY.includes("c"))
                    if(posY.includes("c") && square.color == "black"){posY = this.plusToMinus(posY)};
                    var moves = [(eval(posX.replace("c",""))+""+eval(posY.replace("c","")))];
                    if(/^[1-8][1-8]$/.test(moves)){
                        code = moves;
                    }else{
                        code = [];
                    }
                    //.replaceAll("c","").split(";")
                }else{
                    var moves = [];
                    var max = [];
                    var [x,y] = square.position.split("");
                    x = parseInt(x); y = parseInt(y);
                    //preparing...
                    //find max distance & "c" support
                    for (let i = 0; i < 2; i++) {
                        if(code[i].includes("c")){
                            if(square.color == "black"){
                                code[i] = this.plusToMinus(code[i]);
                            };
                            code[i] = code[i].replaceAll("c","");
                        };
                        max.push(parseInt(/\d+/.exec(code[i])[0]));
                        code[i] = code[i].replace(/(\+|\-)\d+/,"#")
                    };
                    max.push(Math.max(...max));
                    
                    var done = false;
                    for (let d = 1; d < Game.rules.setup["names"].length; d++) {
                        var move = "";
                        for (let i = 0; i < 2; i++) {
                            if(d > max[i]){
                                var result = eval(code[i].replace("#",max[i])).toString()
                            }else{
                                var result = eval(code[i].replace("#",d)).toString()
                            };
                            if("12345678".includes(result.toString()) ){
                                move = move+result;
                            }else{
                                done = true;
                                break;
                            }
                        };
                        if(done){break};
                        moves.push(move);
                        if(board_[move]){break};
                    };
                    code = moves;
                }
                return(code)
            },
            
            getAttackedSquares(board_, color){
                const board = board_;
                var attacked = [];
                for (let y = 1; y < 9; y++) {
                    for (let x = 1; x < 9; x++) {
                        if(board[`${x}${y}`]){
                            if(color == board[`${x}${y}`].color){
                                const square = board[`${x}${y}`]
                                if(Object.keys(Game.rules.pieces).includes(square.name)){
                                    
                                    //pseudo possible moves       
                                    for (let i = 0; i < Game.rules.pieces[square.name]["capture"].length; i++) {
                                        const code = Game.rules.pieces[square.name]["capture"][i];
                                        attacked = attacked.concat(this.decode(code, square,board));
                                    } 
                                    
                                }
                            }
                        }
                    }
                    
                };
                return(Array.from(new Set(attacked)))
                
            }
            
        }