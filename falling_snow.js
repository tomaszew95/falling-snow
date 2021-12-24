var snowArrey = [];
(function(){
    'use strict';
    require.config({
        paths: {
            CerosSDK: '//sdk.ceros.com/standalone-player-sdk-v5.min'
        }
    });
    require(['CerosSDK'], function (CerosSDK) {
        CerosSDK.findExperience()
            .fail(function (error) {
                console.error(error);
            })
            .done(function (experience) {
                window.myExperience = experience;
                console.log('works0')

                experience.on(CerosSDK.EVENTS.PAGE_CHANGED, snowPageChangedCallback);
                function snowPageChangedCallback(){
                    console.log('works1')
                    snowArrey = []
                    creatingSnow()
                    console.log('works2')
                }
                snowPageChangedCallback()
            })
    });
})();

function creatingSnow(){
    var snowParents = document.getElementsByClassName("snow-parent");
    console.log(snowParents.length)
    for(let i = 0; i < snowParents.length; i++){
        snowArrey.push(new Snow(i));
    }
    console.log(snowArrey)
}

function Snow(num) {
    this.canvas = document.createElement('canvas');
    this.num = num;
    this.canvas.className = 'background snow';
    this.canvas.style.background = "transparent";
    document.getElementsByClassName('snow-parent')[this.num].append(this.canvas);

    this.flakes = [];
    this.ctx = this.canvas.getContext('2d');
    this.flakeCount = 300;
    this.mX = -100,
    this.mY = -100

    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;

    this._init();
}

Snow.prototype._init = function() {
    var self = this;
    window.addEventListener('resize', function() {
        self.width = self.canvas.width = window.innerWidth;
        self.height = self.canvas.height = window.innerHeight;
    });

    for(var i = 0; i < this.flakeCount; ++i) {
        var x = Math.floor(Math.random() * this.width),
            y = Math.floor(Math.random() * this.height),
            size = (Math.random()*3.5) + .5,
            speed = size*.5,
            opacity = (Math.random() * 0.5) + 0.1;

        this.flakes.push({
            speed: speed,
            velY: speed,
            velX: 0,
            x: x,
            y: y,
            size: size,
            stepSize: (Math.random()) / 30,
            step: 0,
            opacity: opacity
        });
    }

    this._snow();
};

Snow.prototype._snow = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for(var i = 0; i < this.flakeCount; ++i) {
        var flake = this.flakes[i],
            x = this.mX,
            y = this.mY,
            minDist = 150,
            x2 = flake.x,
            y2 = flake.y,
            dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
            dx = x2 - x,
            dy = y2 - y;

        if( dist < minDist ) {
            var force = minDist / (dist * dist),
            xcomp = (x - x2) / dist,
            ycomp = (y - y2) / dist,
            deltaV = force / 2;
            flake.velX -= deltaV * xcomp;
            flake.velY -= deltaV * ycomp;
        }
        else {
            flake.velX *= .98;
            if( flake.velY <= flake.speed ) {
                flake.velY = flake.speed
            }
            flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
        }

        this.ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
        flake.y += flake.velY;
        flake.x += flake.velX;

        if( flake.y >= this.height || flake.y <= 0 ) {
            this._reset(flake);
        }

        if( flake.x >= this.width || flake.x <= 0 ) {
            this._reset(flake);
        }

        this.ctx.beginPath();
        this.ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    requestAnimationFrame(this._snow.bind(this));
};

Snow.prototype._reset = function(flake) {
    flake.x = Math.floor(Math.random() * this.width);
    flake.y = 0;
    flake.size = (Math.random() * 3.5) + .5;
    flake.speed = flake.size*.5,
    flake.velY = flake.speed;
    flake.velX = 0;
    flake.opacity = (Math.random() * 0.5) + 0.1;
};

// var backgrounds = document.getElementsByClassName("bg");
// var distances = [0.01, 0.02, 0.05, 0.075, 0.1];

// $('body').mousemove(function(event){
//     for(let i = 0; i<backgrounds.length; i++){
//         var moveX = (($(window).width()/2) - event.pageX)*distances[i];
//         $(backgrounds[i]).css('margin-left',moveX+'px');
//     }
// })
