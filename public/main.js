var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: preload, create: create });

//http://opengameart.org/content/onscreen-controls-8-styles
function preload() {
    game.load.image('phaser', 'img/logo.png');
    game.load.image('logo', 'img/logo.png');
    game.load.image('pineapple', 'img/arrow-up.png');
    game.load.image('up-dark', 'img/upDark.png');
    game.load.image('left-dark', 'img/leftDark.png');
}

var key1;
var key2;
var key3;
var buttonClockwise;

function create() {

    game.stage.backgroundColor = '#736357';

    game.add.text(0, 0, 'OWI Robot Control!', {});

    //  Here we create 3 hotkeys, keys 1-3 and bind them all to their own functions

    key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key1.onDown.add(addPhaserDude, this);

    key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key2.onDown.add(addPhaserLogo, this);

    key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key3.onDown.add(addPineapple, this);

    keyLeftArrow = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keyLeftArrow.onDown.add(onClockwise, this);
    keyLeftArrow.onUp.add(onStop, this);


    buttonClockwise = game.add.button(game.world.centerX, game.world.centerY, 'left-dark', null, this);
    buttonClockwise.onInputUp.add(onStop, this);
    buttonClockwise.onInputDown.add(onClockwise, this);


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
    console.log("left!");
}

function onStop() {
    console.log("stop!");
}


function onmoof() {
    console.log('moof');
}

