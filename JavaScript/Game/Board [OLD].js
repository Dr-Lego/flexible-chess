class Board_{
    constructor(){
        this.board = "rnbqkbnrpppppppppppppppprnbqkbnr".split("")//Object.assign(..."11,21,31,41,51,61,71,81,12,22,32,42,52,62,72,82,17,27,37,47,57,67,77,87,18,28,38,48,58,68,78,88".split(",").map((k, i)=>({[k]: "rnbqkbnrpppppppppppppppprnbqkbnr"[i]}) ));
        this.size = HTML.screen_size[1]*0.8-(HTML.screen_size[1]*0.8)%8;
        this.square_size = this.size/8;
        HTML.canvas.width=this.size;
        HTML.canvas.height=this.size;
        this.ctx = HTML.canvas.getContext("2d");
        this.color_scheme = ["#f0d9b5","#b58863"];

        //these two function are neccessary here because they're needed in Images.onload
        this.drawBoard = function(color){
            Board.ctx.fillStyle = this.color_scheme[0];
            Board.ctx.fillRect(0, 0, this.size, this.size);
            var colors = ["black","white"];
            Board.ctx.fillStyle = this.color_scheme[1];
            for (let x = 0; x < 8; x++) {
                for (let y = (colors.indexOf(color)+x%2)%2; y < 8; y+=2) { //(colors.indexOf(color)+x%2)%2
                    Board.ctx.fillRect(x*this.square_size, y*this.square_size, this.square_size,this.square_size);
                };
            };
        };
        this.drawPiece = function(name,color, position){
            var names = ["king","queen","bishop","knight","rook","pawn","k","q","b","n","r","p"];
            var colors = ["white","black","w","b"];
            this.ctx.drawImage(this.Images, names.indexOf(name.toLowerCase())%6*45, colors.indexOf(color.toLowerCase())%2*45,45,45,(position[0]-1)*this.square_size, (8-position[1])*this.square_size,this.square_size,this.square_size);
        };

        this.Images = new Image();

        this.Images.onload=function(){
            if(Game.players.white == "human"){Board.drawBoard("white")}else{Board.drawBoard("black")};
            for (let j = 0; j < Board.Board.length; j++) {
                const piece = Board.Board[j];
                Board.drawPiece(piece,["white","black"][Math.floor(j/16)],[(j%8)+1,[1,2,7,8][Math.floor(j/8)]]);
            };
        };
        this.Images.src= "./Images/ChessPieces5.svg";

    };

    initBoard(){
        this.Images = new Image();
    };

    pos(x,y){
        return([x-1*this.square_size,y-1*this.square_size])
    } 
}


//init
//Board.initBoard();
const Board = new Board_()
