$(document).ready(function() {

    var conWidth = $(".container").width();
    var borderWidth = 8;
    var gameWidth = conWidth > 400 ? 400 : conWidth;
    var cellWidth = Math.floor( (gameWidth-5*borderWidth) / 4);
    gameWidth = 5*borderWidth + 4*cellWidth;
    window.fontsize = Math.floor( cellWidth/2 );
    window.padding = Math.floor( (cellWidth-fontsize)/2 );
    var pos = [];
    for(var i=0; i<16; i++) {
        (function(i) {
            posx = (i%4+1)*borderWidth + (i%4)*cellWidth;
            posy = Math.floor(i/4+1)*borderWidth + Math.floor(i/4)*cellWidth;
            pos.push({x:posx, y:posy});
        })(i);
    }

    var stage, baseLayer, cellLayer, tileLayer, wordLayer;
    var baseRec;
    var cellRects = [];
    var tileRects = [];
    var words = [];
    var numArr = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0];
    window.isEnd = false;
    window.pMove = [true, true, true, true];
    window.color = ["#EEE4DA", "#EDE0C8", "#F2B179", "#F59563", "#F67C5F",
        "#F65E3B", "#EDCF72", "#EDCC61", "#EDC850", "#EDC53F", "#EDC22E"];

    var Game = {
        init: function() {
            stage = new Kinetic.Stage({
                container: "game-container",
                width: gameWidth,
                height: gameWidth,
            });
            baseLayer = new Kinetic.Layer({
                width: gameWidth,
                height: gameWidth,
            });
            cellLayer = new Kinetic.Layer({
                width: gameWidth,
                height: gameWidth,
            });
            tileLayer = new Kinetic.Layer({
                width: gameWidth,
                height: gameWidth,
            });
            wordLayer = new Kinetic.Layer({
                width: gameWidth,
                height: gameWidth,
            });

            baseRec = new Kinetic.Rect({
                fill: "#776e65",
                width: gameWidth,
                height: gameWidth,
            });
            baseLayer.add(baseRec);

            for(var i=0; i<16; i++) {
                var cellRect = new Kinetic.Rect({
                    fill: "#bbada0",
                    cornerRadius: 4,
                    x: pos[i].x,
                    y: pos[i].y,
                    width: cellWidth,
                    height: cellWidth,
                });
                cellRects.push(cellRect);
                var tileRect = new Kinetic.Rect({
                    fill: "#FFF",
                    cornerRadius: 4,
                    x: pos[i].x,
                    y: pos[i].y,
                    width: cellWidth,
                    height: cellWidth,
                    opacity: 0,
                });
                tileRects.push(tileRect);
                var word = new Kinetic.Text({
                    align: "center",
                    width: cellWidth,
                    //height: cellWidth,
                    //padding: window.padding,
                    fontSize: window.fontsize,
                    text: "0",
                    fill: "#000",
                    visible: false,
                    x: pos[i].x,
                    y: pos[i].y+window.padding,
                });
                words.push(word);
            }
            for(var i=0; i<16; i++) {
                cellLayer.add(cellRects[i]);
                tileLayer.add(tileRects[i]);
                wordLayer.add(words[i]);
            }

            this._randomTwocell();

            stage.add(baseLayer);
            stage.add(cellLayer);
            stage.add(tileLayer);
            stage.add(wordLayer);
            this._update();
        },
        _randomTwocell: function() {
            var index1 = Math.floor(Math.random()*16);
            var text1 = Math.round(Math.random())+1;
            numArr[index1] = text1;
            var index2 = Math.floor(Math.random()*15);
            var text2 = Math.round(Math.random())+1;
            if(! (index2<index1)) index2++;
            numArr[index2] = text2;
            this._update();
        },
        _update: function() {
            for(var i=0; i<16; i++) {
                if(numArr[i]==0) {
                    tileRects[i].opacity(0);
                    words[i].visible(false);
                } else {
                    var n = Math.pow(2, numArr[i]);
                    var t = n.toString();
                    tileRects[i].fill(window.color[numArr[i]-1]);
                    words[i].text(t)
                    words[i].visible(true);
                    tileRects[i].opacity(1);
                }
            }
            stage.draw();
        },
        _isEnd: function() {
            this._judgeMethod();
            var a = window.pMove;
            return !(a[0] || a[1] || a[2] || a[3]);
        },
        _judgeMethod: function() {
            window.pMove = [false, false, false, false];
            for(var i=0; i<16; i++) {
                if((i%4!=0) && (numArr[i]!=0) && (numArr[i]==numArr[i-1])) {
                    window.pMove[0] = true; window.pMove[2] = true; break;
                }
            }
            for(var i=0; i<12; i++) {
                if((numArr[i]!=0) && (numArr[i]==numArr[i+4])) {
                    window.pMove[1] = true; window.pMove[3] = true; break;
                }
            }
            if(!window.pMove[0]) {
                for(var i=0; i<16; i++) {
                    if((i%4!=0) && (numArr[i]!=0) && (numArr[i-1]==0)) {
                        window.pMove[0] = true; break;
                    }
                }
            }
            if(!window.pMove[1]) {
                for(var i=4; i<16; i++) {
                    if((numArr[i]!=0) && (numArr[i-4]==0)) {
                        window.pMove[1] = true; break;
                    }
                }
            }
            if(!window.pMove[2]) {
                for(var i=0; i<16; i++) {
                    if((i%4!=0) && (numArr[i-1]!=0) && (numArr[i]==0)) {
                        window.pMove[2] = true; break;
                    }
                }
            }
            if(!window.pMove[3]) {
                for(var i=0; i<12; i++) {
                    if((numArr[i]!=0) && (numArr[i+4]==0)) {
                        window.pMove[3] = true; break;
                    }
                }
            }
        },
        _randomAddOne: function() {
            var a = [];
            for(var i=0; i<16; i++) {
                if(numArr[i]==0) {
                    a.push(i);
                }
            }
            var index = a[Math.floor(Math.random()*a.length)];
            var value = Math.round(Math.random())+1;
            numArr[index] = value;
        },
        _gameOver: function() {
            $("#game-info").text("Game Over");
        },
        _push: function(type) {
            if(type==0){
                for(var j=0; j<4; j++) {
                    for(var i=0; i<4; i++) {
                        if(numArr[4*j+i]==0) {
                            for(var k=i; k<4; k++) {
                                if(numArr[4*j+k]!=0) {
                                    numArr[4*j+i] = numArr[4*j+k];
                                    numArr[4*j+k] = 0;
                                    break;
                                }
                            }
                        }
                        if(numArr[4*j+i]==0)
                            break;
                    }
                }
            } else if(type==1){
                for(var i=0; i<4; i++) {
                    for(var j=0; j<4; j++) {
                        if(numArr[4*j+i]==0) {
                            for(var k=j; k<4; k++) {
                                if(numArr[4*k+i]!=0) {
                                    numArr[4*j+i] = numArr[4*k+i];
                                    numArr[4*k+i] = 0;
                                    break;
                                }
                            }
                        }
                        if(numArr[4*j+i]==0)
                            break;
                    }
                }
            } else if(type==2){
                for(var j=0; j<4; j++) {
                    for(var i=3; i>=0; i--) {
                        if(numArr[4*j+i]==0) {
                            for(var k=i; k>=0; k--) {
                                if(numArr[4*j+k]!=0) {
                                    numArr[4*j+i] = numArr[4*j+k];
                                    numArr[4*j+k] = 0;
                                    break;
                                }
                            }
                        }
                        if(numArr[4*j+i]==0)
                            break;
                    }
                }
            } else if(type==3){
                for(var i=0; i<4; i++) {
                    for(var j=3; j>=0; j--) {
                        if(numArr[4*j+i]==0) {
                            for(var k=j; k>=0; k--) {
                                if(numArr[4*k+i]!=0) {
                                    numArr[4*j+i] = numArr[4*k+i];
                                    numArr[4*k+i] = 0;
                                    break;
                                }
                            }
                        }
                        if(numArr[4*j+i]==0)
                            break;
                    }
                }
            }
        },
        _move: function(type) {
            if(!(window.pMove[type])) return 0;
            console.log("test");
            this._push(type);

            if(type==0){
                for(var i=0; i<16; i++) {
                    if((numArr[i]!=0) && (i%4!=0) && (numArr[i]==numArr[i-1])) {
                        numArr[i-1] ++;
                        numArr[i]=0;
                    }
                }
            } else if(type==1){
                for(var i=0; i<12; i++) {
                    if((numArr[i]!=0) && (numArr[i]==numArr[i+4])) {
                        numArr[i] ++;
                        numArr[i+4]=0;
                    }
                }
            } else if(type==2){
                for(var i=15; i>=0; i--) {
                    if((numArr[i]!=0) && (i%4!=0) && (numArr[i]==numArr[i-1])) {
                        numArr[i] ++;
                        numArr[i-1]=0;
                    }
                }
            } else if(type==3){
                for(var i=11; i>=0; i--) {
                    if((numArr[i]!=0) && (numArr[i]==numArr[i+4])) {
                        numArr[i+4] ++;
                        numArr[i]=0;
                    }
                }
            }

            this._push(type);
            this._randomAddOne();
            this._update();
            if(this._isEnd()) {
                this._gameOver();
                window.isEnd = true;
                return false;
            }
            return true;
        },
        _listen: function() {
            $(document).keydown(function(e) {
                console.log(window.pMove);
                if(window.isEnd) return 0;
                e.preventDefault();
                var k = e.keyCode;
                if(k==37 || k==72) {
                    Game._move(0);
                }
                else if(k==38 || k==75) {
                    Game._move(1);
                }
                else if(k==39 || k==76) {
                    Game._move(2);
                }
                else if(k==40 || k==74) {
                    Game._move(3);
                }
            });
        },
    };

    Game.init();
    Game._listen();

});

