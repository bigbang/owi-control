var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: preload, create: create });

//http://opengameart.org/content/onscreen-controls-8-styles
function preload() {
    game.load.image('logo', 'img/logo.png');
    game.load.image('up-dark', 'img/upDark.png');
    game.load.image('left-dark', 'img/leftDark.png');
    game.load.image('right-dark', 'img/rightDark.png');
    game.load.image('down-dark', 'img/downDark.png');
}

var channel;

var OFFSET = 120;

function create() {

    game.stage.backgroundColor = '#736357';
    game.add.text(0, 0, 'OWI Robot Control!', {});


    game.add.text(510,200, 'Base/Shoulder', {});
    // CLOCKWISE
    var keyClockwise = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keyClockwise.onDown.add(onClockwise, this);
    keyClockwise.onUp.add(onStop, this);

    var buttonClockwise = game.add.button(500, game.world.centerY, 'left-dark', null, this);
    buttonClockwise.onInputUp.add(onStop, this);
    buttonClockwise.onInputDown.add(onClockwise, this);

    //COUNTERCLOCKWISE
    var keyCCW = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    keyCCW.onDown.add(onCounterClockwise, this);
    keyCCW.onUp.add(onStop, this);

    var buttonCCW = game.add.button(500 + OFFSET, game.world.centerY, 'right-dark', null, this);
    buttonCCW.onInputUp.add(onStop, this);
    buttonCCW.onInputDown.add(onCounterClockwise, this);

    //SHOULDER UP
    var keyShoulderUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    keyShoulderUp.onDown.add(onShoulderUp, this);
    keyShoulderUp.onUp.add(onStop, this);

    var buttonShoulderUp = game.add.button(500 + (OFFSET / 2), game.world.centerY - 60, 'up-dark', null, this);
    buttonShoulderUp.onInputUp.add(onStop, this);
    buttonShoulderUp.onInputDown.add(onShoulderUp, this);

    //Shoulder DOWN
    var keyShoulderDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    keyShoulderDown.onDown.add(onShoulderDown, this);
    keyShoulderDown.onUp.add(onStop, this);

    var buttonShoulderDown = game.add.button(500 + ( OFFSET / 2 ), game.world.centerY + 60, 'down-dark', null, this);
    buttonShoulderDown.onInputUp.add(onStop, this);
    buttonShoulderDown.onInputDown.add(onShoulderDown, this);


    game.add.text(350,200, 'Elbow', {});
    //Elbow UP
    var keyElbowUp = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keyElbowUp.onDown.add(onElbowUp, this);
    keyElbowUp.onUp.add(onStop, this);

    var buttonElbowUp = game.add.button(350, game.world.centerY - 50, 'up-dark', null, this);
    buttonElbowUp.onInputUp.add(onStop, this);
    buttonElbowUp.onInputDown.add(onElbowUp, this);

    //Elbow DOWN
    var keyElbowDown = game.input.keyboard.addKey(Phaser.Keyboard.D);
    keyElbowDown.onDown.add(onElbowDown, this);
    keyElbowDown.onUp.add(onStop, this);

    var buttonElbowDown = game.add.button(350, game.world.centerY + 50, 'down-dark', null, this);
    buttonElbowDown.onInputUp.add(onStop, this);
    buttonElbowDown.onInputDown.add(onElbowDown, this);

    game.add.text(250,200, 'Wrist', {});
    //Wrist UP
    var keyWristUp = game.input.keyboard.addKey(Phaser.Keyboard.W);
    keyWristUp.onDown.add(onWristUp, this);
    keyWristUp.onUp.add(onStop, this);

    var buttonWristUp = game.add.button(250, game.world.centerY - 50, 'up-dark', null, this);
    buttonWristUp.onInputUp.add(onStop, this);
    buttonWristUp.onInputDown.add(onWristUp, this);

    //Wrist DOWN
    var keyWristDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
    keyWristDown.onDown.add(onWristDown, this);
    keyWristDown.onUp.add(onStop, this);

    var buttonWristDown = game.add.button(250, game.world.centerY + 50, 'down-dark', null, this);
    buttonWristDown.onInputUp.add(onStop, this);
    buttonWristDown.onInputDown.add(onWristDown, this);

    game.add.text(100,200, 'Grips', {});
    //Grips OPEN
    var keyGripsOpen = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    keyGripsOpen.onDown.add(onGripsOpen, this);
    keyGripsOpen.onUp.add(onStop, this);

    var buttonGripsOpen = game.add.button(50, game.world.centerY, 'left-dark', null, this);
    buttonGripsOpen.onInputUp.add(onStop, this);
    buttonGripsOpen.onInputDown.add(onGripsOpen, this);

    //GRIPS CLOSED
    var keyGripsClosed = game.input.keyboard.addKey(Phaser.Keyboard.A);
    keyGripsClosed.onDown.add(onGripsClosed, this);
    keyGripsClosed.onUp.add(onStop, this);

    var buttonGripsClosed = game.add.button(150, game.world.centerY, 'right-dark', null, this);
    buttonGripsClosed.onInputUp.add(onStop, this);
    buttonGripsClosed.onInputDown.add(onGripsClosed, this);


    var client = new BigBang.Client();
    client.connect("http://thegigabots.app.bigbang.io", function (err) {
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
                    channel = c;
                }
            });
        }
    });
}

function addPhaserDude() {
    game.add.sprite(game.world.randomX, game.world.randomY, 'phaser');
}

function addPhaserLogo() {
    game.add.sprite(game.world.randomX, game.world.randomY, 'logo');
}

function addPineapple() {
    game.add.sprite(game.world.randomX, game.world.randomY, 'pineapple');
}

function onClockwise() {
    sendCommand('baseCW');
}

function onCounterClockwise() {
    sendCommand('baseCCW');
}

function onShoulderUp() {
    sendCommand('shoulderUp');
}

function onShoulderDown() {
    sendCommand('shoulderDown');
}

function onElbowUp() {
    sendCommand('elbowUp');
}

function onElbowDown() {
    sendCommand('elbowDown');
}

function onWristUp() {
    sendCommand('wristUp');
}

function onWristDown() {
    sendCommand('wristDown');
}

function onGripsOpen() {
    sendCommand('gripsOpen');
}

function onGripsClosed() {
    sendCommand('gripsClose');
}

function onStop() {
    sendCommand('stop');
}

function sendCommand(command) {
    if (channel) {
        channel.publish({cmd: command});
        console.log("published: " + command);
    }
}