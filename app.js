var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    colors = require('colors'),
    mongoose = require('mongoose'),
    connectCounter = "0";



server.listen(3000);


// // Database stuff
// mongoose.connect('mongodb://foostable:republica@ds059908.mongolab.com:59908/foosball');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   console.log('Yay connected to DB');
// });

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

function goal() {
    var piezo = new five.Piezo(3);
    piezo.play({
    // song is composed by an array of pairs of notes and beats
    // The first argument is the note (null means "no note")
    // The second argument is the length of time (beat) of the note (or non-note)
        song: [
          
            ["d4", 1/4],
            [null, 1/8],
            ["c#4", 1/4],
            [null, 1/8],
            ["g5", 1.5] 
        ],
        tempo: 150
    });
};

// board = new five.Board();

// board.on("ready", function() {
  
//     var blueSensor = new five.Button(8);
//     var redSensor = new five.Button(10);

//     board.repl.inject({
//         blueSensor: button,
//         redSensor: button
//     });

//     blueSensor.on("up", function() {
//         console.log("up");
//         addpoint("blueplus");
      
//     });

//     redSensor.on("up", function() {
//         console.log("up");
//         addpoint("redplus");
       
//     });

//     goal();
// });