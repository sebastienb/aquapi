var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    colors = require('colors'),
    mongoose = require('mongoose'),
    connectCounter = "0";

server.listen(3000);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});


// Setting vars

var currentTime = ""
var dayLightStartTime = ""
var dayLightEndTime = ""
var dayLightState = ""

var motionState = ""
var motionCountdown = ""

var waterlevel = ""


function getCurrentTime() {
    var date = new Date();
    var current_hour = date.getHours();
    var current_minutes = date.getMinutes();
    // console.log(current_minutes);
}


var five = require("johnny-five"),
    board,
    button;

board = new five.Board();

board.on("ready", function() {
    
    var nightlights = new five.Relay({
      pin: 4, 
      type: "NO"
    });

    var daylights = new five.Relay({
      pin: 5, 
      type: "NO"
    });

    ping = new five.Ping(9);

    nightlights.off();
    daylights.off();

    
    // "data" get the current reading from the ping
    ping.on("data", function( err, value ) {
        // console.log( "data", value );
    });

    ping.on("change", function( err, value ) {

        // console.log( "Object is " + this.inches + "inches away" );
        waterlevel =  this.inches;

    });



    // this.wait(3000, function() {
    // console.log('Day Lights On');
    // daylights.on();

    // });

    function lightScheduler(){
        
        getCurrentTime();

        // if (current_minutes <= 36) {
        //     daylights.on();
        //     nightlights.on();
        //     console.log(current_minutes);
        // }else{
        //     daylights.off();
        //     console.log("nightlights only")
        // };

        // if (true) {
        //     nightlights.off();
        // };
    };

    setInterval(lightScheduler, 5000);

    
    console.log("boardready");


    // Create a new `motion` hardware instance.
    motion = new five.IR.Motion(8);

    // Inject the `motion` hardware into
    // the Repl instance's context;
    // allows direct command line access
    this.repl.inject({
    motion: motion
    });

    // Pir Event API

    // "calibrated" occurs once, at the beginning of a session,
    motion.on("calibrated", function(err, ts) {
    console.log("calibrated", ts);
    });

    // "motionstart" events are fired when the "calibrated"
    // proximal area is disrupted, generally by some form of movement
    motion.on("motionstart", function(err, ts) {
        console.log("motionstart", ts);
        nightlights.on();
        motionState= "active";
        console.log('Night lights trigered');
    });

    // "motionsend" events are fired following a "motionstart event
    // when no movement has occurred in X ms
    motion.on("motionend", function(err, ts) {
        console.log("no more motion lights off in 1 minute", ts);
        motionState = "none";
        setTimeout(function(){
            if (motionState == "none") {
                console.log('Night Lights Off')
                nightlights.off();
                motionState = "none";
            };
        }, 1200000);

    });

    // setInterval(function(){
    //         console.log(motionState)
    // }, 500);

    // On first client connection start a new game
    io.sockets.on('connection', function(socket){

        
        connectCounter++;
        console.log("connections: "+connectCounter);
        console.log('New device connected'.green);
        io.emit('status', 'New device connected!');

        
        socket.on('disconnect', function() { 
            connectCounter--; console.log("connections: "+connectCounter);
        });

        socket.on('status', function(data){
                    
            console.log(data);
        });

        socket.on('lights', function(data){
                   
            console.log(data);
            if (data == "day-on") {
                console.log('data was dayon!!');
                nightlights.on();
                daylights.on();
            };

            if (data == "day-off") {
                console.log('data was dayon!!');
                nightlights.off();
                daylights.off();
            };

            if (data == "night-on") {
                console.log('data was dayon!!');
                nightlights.on();
                daylights.off();
            };

            if (data == "night-off") {
                console.log('data was dayon!!');
                nightlights.off();
            };
        });


        setInterval(function(){
            io.emit('waterlevel', waterlevel);
        }, 1000);


    }); //end socket connection
});