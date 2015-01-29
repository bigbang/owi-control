var client = new BigBang.Client();
var channel;
var totalEventCount = 0;

var userChart = new Keen.Dataviz()
    .el(document.getElementById('users'))
    .parseRawData({ result: totalEventCount })
    .chartType("metric")
    .colors(["#6ab975"])
    .title("Connected Users")
    .height(350)
    .render();


var totalEvents = new Keen.Dataviz()
    .el(document.getElementById('chicken'))
    .parseRawData({ result: totalEventCount })
    .chartType("metric")
    .colors(["#6ab975"])
    .title("Robot Control Events")
    .height(350)
    .render();


var eventData = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
];


var options = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke : true,

        //String - The colour of each segment stroke
        segmentStrokeColor : "#fff",

    //Number - The width of each segment stroke
    segmentStrokeWidth : 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 50, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps : 100,

    //String - Animation easing effect
    animationEasing : "easeOutBounce",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : false,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

}

var ctx = document.getElementById("myChart").getContext("2d");
var eventTypeChart = new Chart(ctx).Pie(data,options);


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
        console.log(json);

    });
}


