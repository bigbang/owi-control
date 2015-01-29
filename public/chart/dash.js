var client = new BigBang.Client();
var channel;
var totalEventCount = 0;


var eventOpens = 0;
var eventCloses = 0;
var eventShoulderUp = 0;
var eventShoulderDown = 0;
var eventBaseCW = 0;
var eventBaseCCW = 0;
var eventElbowUp = 0;
var eventElbowDown = 0;
var eventWristUp = 0;
var eventWristDown = 0;


var userChart = new Keen.Dataviz()
    .el(document.getElementById('users'))
    .parseRawData({ result: totalEventCount })
    .chartType("metric")
    .colors(["#6ab975"])
    .title("Connected Users")
    .height(400)
    .render();


var totalEvents = new Keen.Dataviz()
    .el(document.getElementById('chicken'))
    .parseRawData({ result: totalEventCount })
    .chartType("metric")
    .colors(["#6ab975"])
    .title("Robot Control Events")
    .height(400)
    .render();


var eventData;


buildEventData();


var ctx = document.getElementById("myChart").getContext("2d");

var eventTypeChart = new Chart(ctx).Bar(eventData);

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
                this.channel = c;

                go();

            }
        });
    }
});


function go() {


    channel.on('join', function (joined) {
        userChart.parseRawData({result: channel.getSubscribers().length});
        userChart.render();
    })

    channel.on('leave', function (left) {
        userChart.parseRawData({result: channel.getSubscribers().length});
        userChart.render();
    })

    channel.on('message', function (msg) {
        totalEventCount++;
        totalEvents.parseRawData({ result: totalEventCount });
        totalEvents.render();

        var json = msg.payload.getBytesAsJSON();

        if (json.cmd === 'gripsOpen') {
            eventOpens++;
            eventTypeChart.datasets[0].bars[0].value = eventOpens;
            eventTypeChart.update();
        }
        else if (json.cmd === 'gripsClose') {
            eventCloses++;
            eventTypeChart.datasets[0].bars[1].value = eventCloses;
            eventTypeChart.update();
        }
        else if (json.cmd === 'shoulderUp') {
            eventShoulderUp++;
            eventTypeChart.datasets[0].bars[2].value = eventShoulderUp;
            eventTypeChart.update();
        }
        else if (json.cmd === 'shoulderDown') {
            eventShoulderDown++;
            eventTypeChart.datasets[0].bars[3].value = eventShoulderDown;
            eventTypeChart.update();
        }
        else if (json.cmd === 'baseCW') {
            eventBaseCW++;
            eventTypeChart.datasets[0].bars[4].value = eventBaseCW;
            eventTypeChart.update();
        }
        else if (json.cmd === 'baseCCW') {
            eventBaseCCW++;
            eventTypeChart.datasets[0].bars[5].value = eventBaseCCW;
            eventTypeChart.update();
        }
        else if (json.cmd === 'elbowUp') {
            eventElbowUp++;
            eventTypeChart.datasets[0].bars[6].value = eventElbowUp;
            eventTypeChart.update();
        }
        else if (json.cmd === 'elbowDown') {
            eventElbowDown++;
            eventTypeChart.datasets[0].bars[7].value = eventElbowDown;
            eventTypeChart.update();
        }
        else if (json.cmd === 'wristUp') {
            eventWristUp++;
            eventTypeChart.datasets[0].bars[8].value = eventWristUp;
            eventTypeChart.update();
        }
        else if (json.cmd === 'wristDown') {
            eventWristDown++;
            eventTypeChart.datasets[0].bars[9].value = eventWristDown;
            eventTypeChart.update();
        }


    });
}

function buildEventData() {

    eventData = {
        labels: ["Opens", "Closes", "ShoulderUp", "Shoulder Down", "Base Right", "Base Left", "Elbow Up", "Elbow Down", "Wrist Up", "Wrist Down"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [eventOpens, eventCloses, eventShoulderUp, eventShoulderDown, eventBaseCW, eventBaseCCW, eventElbowUp, eventElbowDown, eventWristUp, eventWristDown]
            }
        ]
    };


}



