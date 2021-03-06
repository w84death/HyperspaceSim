
var Ship = function(params){
    this.ship = true;
    this.id = game.universe.length;
    this.x = params.x || (Math.random()*game.width)<<0;
    this.y = params.y || (Math.random()*game.height)<<0;

    this.pirate = (Math.random()*10)>7;
    this.ASCII = '<span class="info ship'+(this.pirate? ' pirate':'')+'" data-id="'+this.id+'">s</span>';
    this.speed = 1;
    this.fuel = 100;
    this.material = 0;
    this.shield = 10 + (Math.random()*20)<<0;
    var power = 2 + (Math.random()*4)<<0;
    this.armament = []
    for (var i = 0; i < 1+(Math.random()*5)<<0; i++){
        this.armament.push({
            name: 'Canon',
            power: power
        })
    };
    this.crew = 1 + (Math.random()*6)<<0;
    this.destination();
};

Ship.prototype.destination = function(){
    if(this.fuel < 50){
        var station = game.findStation();
        this.destiny = {
            x: station.x,
            y: station.y
        }
    }else{
        this.destiny = {
            x: (Math.random()*game.width)<<0,
            y: (Math.random()*game.height)<<0
        }
    }
    game.gameLog.push('#'+pad(this.id,4)+' wybrano nowy cel -> '+this.destiny.x+' x '+this.destiny.y);
}
Ship.prototype.move = function(){
    if(this.fuel>0){
        if(this.destiny.x > this.x){
            this.x += this.speed;
        }
        if(this.destiny.x < this.x){
            this.x -= this.speed;
        }
        if(this.destiny.y > this.y){
            this.y += this.speed;
        }
        if(this.destiny.y < this.y){
            this.y -= this.speed;
        }
        this.fuel -= this.speed;
    }

    if(this.destiny.x === this.x && this.destiny.y === this.y){
        this.destination();
    }
}

var Star = function(){
    this.star = true;
    this.id = game.universe.length;
    this.x = (Math.random()*game.width)<<0;
    this.y =  (Math.random()*game.height)<<0;
    this.size = 1+(Math.random()*3)<<0;
    this.material = (100 + (Math.random()*500)<<0)*this.size;
    this.chooseAscii();
};

Star.prototype.chooseAscii = function(){
    var char = '.';
    if(this.size > 1) char = '*';
    if(this.size > 2) char = '@';
    this.ASCII = '<span class="info star-'+this.size+'" data-id="'+this.id+'">'+char+'</span>';
}

var Station = function(){
    this.station = true;
    this.id = game.universe.length;
    this.x = 20+(Math.random()*(game.width-40))<<0;
    this.y =  10+(Math.random()*(game.height-20))<<0;
    this.material = 500;
    this.fuel = 1000;
    this.shield = 100 + (Math.random()*200)<<0;
    this.crew = 10 + (Math.random()*40)<<0;
    this.ASCII = '<span class="info station" data-id="'+this.id+'">&Oslash;</span>'
};

Station.prototype.processMaterial = function(){
    var fuel = (this.material * 0.3)<<0,
        material = this.material;
    this.fuel += fuel;
    this.material = 0;
    game.gameLog.push('#'+pad(this.id,4)+' wyprodukowano +'+fuel+' paliwa z -'+material+' surowca');
    game.gameLog.push('#'+pad(this.id,4)+' pozostalo '+this.fuel+' paliwa na stacji');
};

Station.prototype.buildShip = function(){
    game.universe.push(new Ship({
        x: this.x,
        y: this.y
    }));
    this.material -= 100;
}
