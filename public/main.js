var Robot = function (channel) {
    this.channel = channel;
};

Robot.prototype.clockwise = function () {
    sendToBot(this.channel, 'baseCW');
};

Robot.prototype.counterClockwise = function () {
    sendToBot(this.channel, 'baseCCW');
}

Robot.prototype.shoulderUp = function () {
    sendToBot(this.channel, 'shoulderUp');
};

Robot.prototype.elbowUp = function () {
    sendToBot(this.channel, 'elbowUp');
}

Robot.prototype.elbowDown = function () {
    sendToBot(this.channel, 'elbowDown');
}

Robot.prototype.wristUp = function () {
    sendToBot(this.channel, 'wristUp');
}

Robot.prototype.wristDown = function () {
    sendToBot(this.channel, 'wristDown');
}

Robot.prototype.shoulderDown = function () {
    sendToBot(this.channel, 'shoulderDown');
}

Robot.prototype.stop = function () {
    sendToBot(this.channel, 'stop');
};

Robot.prototype.gripsOpen = function () {
    sendToBot(this.channel, 'gripsOpen');
}

Robot.prototype.gripsClose = function () {
    sendToBot(this.channel, 'gripsClose');
}

function sendToBot(channel, cmd) {
    if (channel) {
        channel.publish({cmd: cmd});
    }
}


BasicGame.Game = function (game) {

    //	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    this.channel;

    this.robot = new Robot(this.channel);

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

    create: function () {
        game.stage.backgroundColor = '#FFFFFF';

        GameController.init({
            left: {
                type: 'dpad',
                position: {
                    left: '24%',
                    bottom: '20%'
                },

                dpad: {
                    up: this.createDpadButton(50, 50, this.robot.shoulderDown, this.robot.stop),
                    down: this.createDpadButton(50, 50, this.robot.shoulderUp, this.robot.stop),
                    left: this.createDpadButton(50, 50, this.robot.clockwise, this.robot.stop),
                    right: this.createDpadButton(50, 50, this.robot.counterClockwise, this.robot.stop)
                }
            },
            right: {
                type: 'dpad',
                position: {
                    left: '24%',
                    bottom: '55%'
                },

                dpad: {
                    up: this.createDpadButton(50, 50, this.robot.elbowDown, this.robot.stop),
                    down: this.createDpadButton(50, 50, this.robot.elbowUp, this.robot.stop),
                    left: this.createDpadButton(50, 50, this.robot.wristDown, this.robot.stop),
                    right: this.createDpadButton(50, 50, this.robot.wristUp, this.robot.stop)
                }
            }

        });


        GameController.init(

            {
                left: false,
                right: {
                    position: {
                        left: '19%',
                        bottom: '85%'
                    },
                    type: 'buttons',
                    buttons: [
                        this.createNormalButton('open', this.robot.gripsOpen, this.robot.stop),
                        false,
                        this.createNormalButton('close', this.robot.gripsClose, this.robot.stop),
                        false
                    ]


                }
            }
        );

        var client = new BigBang.Client();
        client.connect("http://thegigabots.bigbang.io", function (err) {
            if (err) {
                console.error(err);
                return;
            }
            else {
                client.subscribe('owi-arm', function (err, c) {
                    if (err) {
                        console.error("Unable to subscribe!")
                    }
                    else {
                        console.log("Subscribed to owi-arm.");
                        this.channel = c;

                    }
                });
            }
        });

    },
    createDpadButton: function (w, h, beginCallback, endCallback) {
        return {
            width: w,
            height: h,
            touchStart: function () {
                beginCallback();
            },
            touchEnd: function () {
                endCallback();
            }
        }
    },
    createNormalButton: function (label, begin, end) {
        return {
            label: label,
            fontSize: 13,
            touchStart: function () {
                begin();
            },
            touchEnd: function () {
                end();
            }
        }
    }
}