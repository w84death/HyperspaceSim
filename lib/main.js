var game = {

    setup:{
        ships:7,
        stars: 50,
    },
    fps: 24,
    loopEnabled: true,
    viewPort: null,
    width: 80,
    height: 40,
    universe: [],
    ASCII: {
        void: '&nbsp;',
        star: '<span class="blue">*</span>',
        ship: '<span class="red">s</span>',
        cargo: '<span class="green">c</span>',
    },
    gameLog: [],
    cursor: {
        x: 40,
        y: 20,
        ASCII: '<span class="cursor">X</span>'
    },

    init: function(){
        this.log('Kosmo:s');
        this.viewPort = document.getElementById('game');
        for (var i = 0; i < this.setup.stars; i++) {
            this.universe.push(new Star());
        };
        for (var i = 0; i < this.setup.ships; i++) {
            this.universe.push(new Ship());
        };

        window.onkeyup = function(e) {
           var key = e.keyCode ? e.keyCode : e.which;
           e.preventDefault();
           switch (key) {
                case 83:
                    //s
                    game.spawnShip();
                break;
                case 32:
                    //space
                    game.loopLock();
                break;
            }

        }
        // START LOOP
        this.loop();
    },

    spawnShip: function(){
        this.universe.push(new Ship());
        if(!this.loopEnabled){
            this.loop();
        }
    },

    loopLock: function(){
        this.loopEnabled = !this.loopEnabled;
        if(this.loopEnabled){
            this.loop();
            this.log('Wznowiono symulacje');
        }else{
          this.log('Wstrzymano symulacje');
        }
    },

    log: function(msg){
        this.gameLog.push(msg);
    },

    showReport: function(data){
        var obj = game.universe[data.id];
        this.log('&#187; RAPORT INFORMACYJNY');
        if(obj.ship){
            this.log('&#187; #'+pad(obj.id,4) + ' Pojazd gwiezdny');
            this.log('&#187; załoga: '+obj.crew);
            this.log('&#187; pozostało paliwa: '+obj.fuel);
            for (var a = 0; a < obj.armament.length; a++) {
                this.log('&#187; uzbrojenie ['+(a+1)+'] '+obj.armament[a].name+', siła ataku 0-'+obj.armament[a].power);
            }
            this.log('&#187; osłony '+obj.shield);
        }
        if(obj.star){
            this.log('&#187; #'+pad(obj.id,4) + ' Gwiazda');
            this.log('&#187; wielkość: '+obj.size);
            this.log('&#187; pozostało surowca: '+obj.material);
        }
        this.log('&#171; KONIEC RAPORTU');
    },

    simulate: function(){
        for (var i = 0; i < game.universe.length; i++) {
            if(game.universe[i]){
                if(game.universe[i].ship){
                    game.universe[i].move();
                    for (var j = 0; j < game.universe.length; j++) {
                        if(game.universe[j].x === game.universe[i].x && game.universe[j].y === game.universe[i].y){
                            if(i!==j){
                                if(game.universe[j].star){
                                    var material = (Math.random()*game.universe[j].material*0.5)<<0;
                                    game.universe[i].fuel += material;
                                    game.universe[j].material -= material;

                                    this.log('#'+pad(game.universe[i].id,4)+' załadunek paliwa +'+material);
                                    game.universe[i].destination();
                                }
                                if(game.universe[j].ship){
                                    this.log('&#187; RAPORT WOJENNY');
                                    // ATTACK
                                    var ship1 = game.universe[i],
                                        ship2 = game.universe[j],
                                        attack1 = 0, attack2 = 0;

                                    for (var a = 0; a < ship1.armament.length; a++) {
                                        attack1 += (Math.random()*ship1.armament[a].power)<<0;
                                    };
                                    ship2.shield -= attack1;
                                    this.log('#'+pad(ship1.id,4)+' atak ('+attack1+') na nieprzyjazny obiekt ('+ship2.shield+')');

                                    if(ship2.shield < 0){
                                        this.log('#'+pad(ship1.id,4)+' nieprzyjazny obiekt zniszczony');
                                        ship2 = false;
                                        game.universe[j] = false;
                                    }else{
                                        for (var a = 0; a < ship2.armament.length; a++) {
                                            attack2 += (Math.random()*ship2.armament[a].power)<<0;
                                        };
                                        ship1.shield -= attack2;
                                        this.log('#'+pad(ship2.id,4)+' atak ('+attack2+') na nieprzyjazny obiekt ('+ship1.shield+')');
                                        if(ship1.shield < 0){
                                            this.log('#'+pad(ship2.id,4)+' nieprzyjazny obiekt zniszczony');
                                            ship1 = false;
                                            game.universe[i] = false;
                                        }else{
                                            this.log('#'+pad(ship1.id,4)+', #'+pad(ship2.id,4)+' nie doszło do zniszczenia');
                                        }
                                    }
                                    this.log('&#171; KONIEC RAPORTU');
                                }
                            }
                        }
                    }
                }
            }
        };
    },

    drawHeader: function(msg){
        var bufferLine = '',
            len = game.width - msg.length - 5;

        bufferLine += '+';
        for (var i = 0; i < len; i++) {
            if(i == (len*0.5)<<0){
                bufferLine += '| ' + msg + ' |';
            }else{
                bufferLine += '-';
            }
        };
        bufferLine += '+<br/>';
        return bufferLine;
    },

    render: function(){
        var bufferLine = '';

        // FRAME
        bufferLine += game.drawHeader('Gwiezdne Przygody');

        // GAME
        for (var y = 0; y < game.height; y++) {
            for (var x = 0; x < game.width; x++) {
                var t = game.ASCII.void;
                for (var i = 0; i < game.universe.length; i++) {
                    if(game.universe[i].x === x && game.universe[i].y === y){
                        t = game.universe[i].ASCII;
                    }
                };
                bufferLine += t;
            }
            bufferLine += '<br/>';
        }

        // FRAME
        bufferLine += game.drawHeader('Raporty');

        // REPORTS
        for (var i = game.gameLog.length-1; (i > game.gameLog.length-12 && i >= 0); i--) {
            bufferLine += '<span class="log">'+pad(i,8)+'| ' + game.gameLog[i] + '</span><br/>';
        };

        // FRAME
        if(game.loopEnabled){
            bufferLine += game.drawHeader('Czas rzeczywisty');
        }else{
            bufferLine += game.drawHeader('Symulacja wstrzymana');
        }

        // RENDER TO SCREEN
        game.viewPort.innerHTML = bufferLine;
    },

    loop: function(){
        /*
        var anchors = game.viewPort.getElementsByClassName("info");
        for (var i = 0; i < anchors.length ; i++) {
            anchors[i].removeEventListener('click');
        }*/
        if(game.loopEnabled){
            window.setTimeout(game.loop, 1000/game.fps);
            game.simulate();
        }
        game.render();

        if(!game.loopEnabled){
            var anchors = game.viewPort.getElementsByClassName("info");
            for (var i = 0; i < anchors.length ; i++) {
                anchors[i].addEventListener('click',function () {
                    game.showReport(this.dataset);
                    game.loop();
                },false);
            }
        }
    },
};

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
game.init();