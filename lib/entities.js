
var Ship = function(){
    this.ship = true;
    this.id = game.universe.length;
    this.x = (Math.random()*game.width)<<0;
    this.y =  (Math.random()*game.height)<<0;
    this.ASCII = '<span class="info ship" data-id="'+this.id+'">s</span>';
    this.speed = 1;
    this.fuel = 100;
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
    this.destiny = {
        x: (Math.random()*game.width)<<0,
        y: (Math.random()*game.height)<<0
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
Star.prototype.move = function(){
}