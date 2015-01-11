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



// On first client connection start a new game
io.sockets.on('connection', function(socket){

    
    connectCounter++;
    console.log("connections: "+connectCounter);
    console.log('New device connected'.green);
    io.emit('status', 'New device connected!');

    
    socket.on('disconnect', function() { 
        connectCounter--; console.log("connections: "+connectCounter);
    });

}); //end socket connection



var five = require("johnny-five"),
    board,
    button;

board = new five.Board();

board.on("ready", function() {
    
    var nightlights = new five.Relay({
      pin: 10, 
      type: "NC"
    });

    var daylights = new five.Relay({
      pin: 9, 
      type: "NC"
    });

    nightlights.off();
    daylights.off();

    // this.wait(3000, function() {
    // console.log('Day Lights On');
    // daylights.on();

    // });


    function lightScheduler(){
        
        var date = new Date();
        var current_hour = date.getHours();
        var current_minutes = date.getMinutes();
        
        

        if (current_minutes <= 36) {
            daylights.on();
            nightlights.on();
            console.log(current_minutes);
        }else{
            daylights.off();
            console.log("nightlights only")
        };

        if (true) {
            nightlights.off();
        };
    };

    setInterval(lightScheduler, 5000);

    
   console.log("boardready");

    // Create a new `motion` hardware instance.
    motion = new five.IR.Motion(7);

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

    });

    // "motionsend" events are fired following a "motionstart event
    // when no movement has occurred in X ms
    motion.on("motionend", function(err, ts) {
        console.log("motionend", ts);

        setTimeout(function(){
            console.log('no more motion lights off in 8 seconds')
            nightlights.off();
        }, 8000);

    });
});





