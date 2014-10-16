#!/usr/bin/env node

var RobotArm = require('owi-robot-arm');
var bigbang = require('bigbang.io');
var client = new bigbang.Client();

client.connect("http://thegigabots.app.bigbang.io", function (err) {

    if (err) {
        console.log("connection failed " + err);
        return;
    }

    console.log("Robot connected.")
    client.subscribe('owi-arm', function (err, channel) {
        if (err) {
            console.error("Unable to subscribe!")
        }
        else {
            console.log("Subscribed to owi-arm.");
            startTheArm(channel)
        }
    });

});

function startTheArm(channel) {

    var arm = new RobotArm();
    var lastMessage = new Date();

    channel.on('join', function (joined) {
        console.log("Client %s joined", joined);
    });

    channel.on('leave', function (leave) {
        console.log("Client %s left the building.", leave);
    })

    setInterval(function () {
        var elapsed = new Date() - lastMessage;

        if (elapsed > 10000) {
            arm.stop();
        }
    }, 10000);

    channel.on('message', function (m) {

        var msg = m.payload.getBytesAsJSON();
        lastMessage = new Date();

        console.log(JSON.stringify(msg));

        if (msg.cmd === 'ledOn') {
            arm.ledOn();
        }
        else if (msg.cmd === 'ledOff') {
            arm.ledOff();
        }
        else if (msg.cmd === 'stop') {
            arm.stop();
        }
        else if (msg.cmd === 'gripsOpen') {
            arm.gripsOpen();

        }
        else if (msg.cmd === 'gripsClose') {
            arm.gripsClose();

        }
        else if (msg.cmd === 'baseCW') {
            arm.baseClockwise();
        }
        else if (msg.cmd === 'baseCCW') {
            arm.baseCounterClockwise();
        }
        else if (msg.cmd === 'wristUp') {
            arm.wristUp();

        }
        else if (msg.cmd === 'wristDown') {
            arm.wristDown();

        }
        else if (msg.cmd === 'elbowUp') {
            arm.elbowUp();
        }
        else if (msg.cmd === 'elbowDown') {
            arm.elbowDown();
        }
        else if (msg.cmd === 'shoulderUp') {
            arm.shoulderUp();
        }
        else if (msg.cmd === 'shoulderDown') {
            arm.shoulderDown();
        }
    });
}