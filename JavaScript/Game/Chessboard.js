class Chessboard_{
    constructor(){
        //this.board = {}
        //this.convertPieceName = function(name){const names = ["king","queen","bishop","knight","rook","pawn","k","q","b","n","r","p"]; return(names[(names.indexOf(name)+6)%6])}
        //for (let x = 1; x < 9; x++) {for (let y = 1; y < 9; y++) {this.board[`${x}${y}`] = undefined} } //creating board object
        //for (let j = 0; j < 32; j++) {this.board[`${(j%8)+1}${[1,2,7,8][Math.floor(j/8)]}`] = {"name": this.convertPieceName("rnbqkbnrpppppppppppppppprnbqkbnr"[j]),"color": ["white","black"][Math.floor(j/16)]};};
        this.resize(this)
        // HTML.board.style.width="min(70vw,90vh)"//this.size.toString()+"px";
        // HTML.board.style.height="min(70vw,90vh)"//this.size.toString()+"px";
        // this.size = $("#board").height()//HTML.screen_size[0]*parseInt(HTML["board"].style.width)/100;
        // this.square_size = this.size/8;
        // HTML.css.set("square-size",this.square_size+"px")
        //HTML.board.style.marginTop = ((HTML.screen_size[1] - this.size)/2).toString()+"px";
        //HTML.board.style.marginLeft = ((HTML.screen_size[0] - this.size)/2).toString()+"px";
        this.color_scheme = {"brown":["#f0d9b5","#b58863"],"blue":["#dee3e6", "#8ca2ad"], "green":["#ffffdd","#86a666"]};
    };

    createPiece = function(name,color, position,orientation){
        var names = ["king","queen","bishop","knight","rook","pawn","k","q","b","n","r","p"];
        var colors = ["white","black","w","b"];
        var element = document.createElement("piece");
        element.className = colors[colors.indexOf(color)%2]+" "+names[names.indexOf(name)%6];
        element.style.left = `${(this.switchNumber(position[0],orientation)-1)*this.square_size}px`;//12.5}%`;//this.square_size}px`;
        element.style.top = `${(8-this.switchNumber(position[1],orientation))*this.square_size}px`;//12.5}%`;//this.square_size}px`;
        element.setAttribute("position",position.join(""))
        HTML.board.appendChild(element,HTML.board_markers)
    };

    convertPieceName(name){
        const names = ["king","queen","bishop","knight","rook","pawn","k","q","b","n","r","p"]; 
        return(names[(names.indexOf(name)+6)%6])}

    createCoordinates(orientation){
        for (let y = 0; y < 8; y++) {
            var element = document.createElementNS("http://www.w3.org/2000/svg","text");
            element.setAttribute("class",["coordinate-dark","coordinate-light"][y%2]);
            element.setAttribute("x",4);
            element.setAttribute("y",16+y*100);
            element.setAttribute("font-size",12);
            element.innerHTML = "87654321"[Math.abs((orientation=="black")*7-y)];
            HTML.board_coordinates.appendChild(element)
        };
        for (let x = 0; x < 8; x++) {
            var element = document.createElementNS("http://www.w3.org/2000/svg","text");
            element.setAttribute("class",["coordinate-dark","coordinate-light"].reverse()[x%2]);
            element.setAttribute("y",795);
            element.setAttribute("x",88+x*100);
            element.setAttribute("font-size",12);
            element.innerHTML = "abcdefgh"[Math.abs((orientation=="black")*7-x)];
            HTML.board_coordinates.appendChild(element)
        }
    }

    createMarker(x_,y_,type){
        const x = this.switchNumber(x_);
        const y = this.switchNumber(y_);
        const u = this.square_size;
        var element = document.createElement("square");
        element.style.transform = `translate(${(x-1)*u}px, ${(8-y)*u}px)`;
        //element.style.top = `${(8-y)*u}px`;
        element.setAttribute("class",{"selected":"selected","point":"move-dest","check":"check","frame":"move-dest take"}[type]);
        HTML.board_squares.appendChild(element)
        
    };

    //deprecated
    createWorseMarker(x_,y_,type){
        const x = this.switchNumber(x_);
        const y = this.switchNumber(y_);
        if(type=="square"){
            var element = document.createElementNS("http://www.w3.org/2000/svg","rect");
            element.setAttribute("class","move-help");
            element.setAttribute("x",(x-1)*100);
            element.setAttribute("y",(8-y)*100);
            element.setAttribute("width",100);
            element.setAttribute("height",100);
            element.setAttribute("fill","rgba(20, 85, 30, 0.5)");
        }else if(type == "dot"){
            var element = document.createElementNS("http://www.w3.org/2000/svg","rect");
            element.setAttribute("class","move-help");
            element.setAttribute("x",(x-1)*100);
            element.setAttribute("y",(8-y)*100);
            element.setAttribute("width",100);
            element.setAttribute("height",100);
            element.setAttribute("fill","url(#point)");
        }else if(type == "check"){
            var element = document.createElementNS("http://www.w3.org/2000/svg","rect");
            element.setAttribute("class","move-help");
            element.setAttribute("x",(x-1)*100);
            element.setAttribute("y",(8-y)*100);
            element.setAttribute("width",100);
            element.setAttribute("height",100);
            element.setAttribute("fill","url(#check)");
        }else if(type == "frame"){
            var element = document.createElementNS("http://www.w3.org/2000/svg","rect");
            element.setAttribute("class","move-help");
            element.setAttribute("x",(x-1)*100);
            element.setAttribute("y",(8-y)*100);
            element.setAttribute("width",100);
            element.setAttribute("height",100);
            element.setAttribute("fill","url(#capture)");
        };
        HTML.svg_markers.appendChild(element)
        
    };

    deleteAllMarkers(){
        $(".move-dest,.move-dest take,.selected").remove()
    };

    position(pos_){
        const pos = pos_.toString();
        const x = Math.abs((Game.board_orientation == "black")*7-(pos[0]-1))*Chessboard.square_size;
        const y = Math.abs([7,0][(Game.board_orientation == "black")*1]-(pos[1]-1))*Chessboard.square_size;
        return([x,y])
    };

    animateTo(pieces){
        for (let i = 0; i < pieces.length; i++) {
            const piece = $(`piece[position='${pieces[i][0]}']`);
            const move = [this.position(pieces[i][0]),this.position(pieces[i][1])];
            piece.animate({left: `${move[1][0]}px`, top: `${move[1][1]}px`},{duration:350,queue:false});
        }
    };

    switchNumber(num,orientation_){
        let orientation = orientation_;
        if(!orientation){orientation = Game.board_orientation};
        return(Math.abs(((orientation=="black")*9)-parseInt(num)));
    };

    loadPosition(position_,orientation){
        var position = position_;
        this.board = {};
        this.convertPieceName = function(name){const names = ["king","queen","bishop","knight","rook","pawn","k","q","b","n","r","p"]; return(names[(names.indexOf(name)+6)%6])}
        for (let x = 1; x < 9; x++) {for (let y = 1; y < 9; y++) {this.board[`${x}${y}`] = undefined} }
        for (let y = 1; y < 9; y++) {
            const row = position[8-y];
            for (let x = 1; x < 9; x++) {
                const pos = [x,y].join("");
                const name = row[x-1];
                const color = ["white","black"][(name == name.toLowerCase())*1];
                if(name != "-"){
                    this.board[pos] = {"name": this.convertPieceName(name.toLowerCase()), "color": color, "position": pos}
                }  
            }
        };
        
        Object.keys(this.board).forEach(square => {
            if(this.board[square]){
                this.createPiece(this.board[square].name,this.board[square].color,[square[0],square[1]],orientation);
            }
        });
    };

    setupBoard(names_){
        this.loadPosition(names_)
    };

    resize(me){
        //me as reference to the Chessboard_ class
        this.deleteAllMarkers();
        HTML.screen_size = [window.innerWidth,window.innerHeight];
        var rounded_size = Math.min(...[HTML.screen_size[0]*0.7,HTML.screen_size[1]*0.9]);
        rounded_size = Math.round(Math.round(rounded_size/16)*16);
        HTML.css.set("board-size",Math.round(rounded_size)+"px")
        //$("#board").css({"width":Math.round(rounded_size),"height":Math.round(rounded_size)});
        //HTML["board"].style.width = Math.round(rounded_size)+"px";
        //HTML["board"].style.height = Math.round(rounded_size)+"px";
        me.size = $("#board").height()//HTML.screen_size[0]*parseInt(HTML["board"].style.width)/100 //HTML.screen_size[1]*0.9-(HTML.screen_size[1]*0.9)%8;
        me.square_size = Math.round(me.size/8);
        HTML.css.set("square-size",Math.round(parseInt(HTML.css.get("board-size"))/8)+"px")
        $("piece").each(function(index){
            const piece = $(this);
            const position = piece.attr("position");
            piece.css({"left":`${(me.switchNumber(position[0],Game.board_orientation)-1)*me.square_size}px`,"top":`${(8-me.switchNumber(position[1],Game.board_orientation))*me.square_size}px`});
            
        });
        if(Game.check != "0"){
            $("square.check").remove();
            me.createMarker(Game.check[0],Game.check[1],"check")
        }
        //console.log(Chessboard.size)
    };
    
    createBoard(orientation){
        $("#board").empty()

        //activate settings
        HTML["board"].style.backgroundImage = `url(assets/board/${settings.board_style}.svg)`;
        HTML.css.set("light-square",this.color_scheme[settings.board_style][0]);
        HTML.css.set("dark-square",this.color_scheme[settings.board_style][1]);
        $("#PieceStyle").attr("href",`assets/pieces/${settings.piece_style}.css`)

        //creating div for the squares
        let element = document.createElement("div");
        element.id = "squares";
        HTML["board"].appendChild(element);
        HTML["board_squares"] = document.getElementById("squares");

        //creating svg for coordinates
        element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        element.id = "coordinates";
        element.setAttribute("width", "100%");
        element.setAttribute("height", "100%");
        element.setAttribute("viewBox", "0 0 800 800")
        HTML["board"].appendChild(element);
        HTML["board_coordinates"] = document.getElementById("coordinates");

        this.createCoordinates(orientation);
        //new ResizeObserver(function(this){this.resize(this)}).observe(document.body);
        window.addEventListener("resize",function(){Chessboard.resize(Chessboard)})
        
    }
}


