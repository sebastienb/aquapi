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


function getCurrentTime() {
    var date = new Date();
    var current_hour = date.getHours();
    var current_minutes = date.getMinutes();
    console.log(current_minutes);
}


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



}); //end socket connection



// var five = require("johnny-five"),
//     board,
//     button;

// board = new five.Board();

// board.on("ready", function() {
    
//     var nightlights = new five.Relay({
//       pin: 10, 
//       type: "NC"
//     });

//     var daylights = new five.Relay({
//       pin: 9, 
//       type: "NC"
//     });

//     nightlights.off();
//     daylights.off();

//     // this.wait(3000, function() {
//     // console.log('Day Lights On');
//     // daylights.on();

//     // });


//     function lightScheduler(){
        
//         getCurrentTime()

//         // if (current_minutes <= 36) {
//         //     daylights.on();
//         //     nightlights.on();
//         //     console.log(current_minutes);
//         // }else{
//         //     daylights.off();
//         //     console.log("nightlights only")
//         // };

//         // if (true) {
//         //     nightlights.off();
//         // };
//     };

//     setInterval(lightScheduler, 5000);

    
//    console.log("boardready");
//    lightScheduler();

   
   var five = require('johnny-five'), board

// 1-wire devices are on pin 20 on Mega
var pin = 20;
var board = new five.Board();

board.on("ready", function ()
            {
  board.firmata.sendOneWireConfig(pin, true);
  board.firmata.sendOneWireSearch(pin, function(error, devices) {
    if(error) {
      console.error(error);
      return;
    }

    // only interested in the first device
    var device = devices[0];

    var readTemperature = function() {
      // start transmission
      board.firmata.sendOneWireReset(pin);

      // a 1-wire select is done by ConfigurableFirmata
      board.firmata.sendOneWireWrite(pin, device, 0x44);

      // the delay gives the sensor time to do the calculation
      board.firmata.sendOneWireDelay(pin, 1000);

      // start transmission
      board.firmata.sendOneWireReset(pin);

      // tell the sensor we want the result and read it from the scratchpad
      board.firmata.sendOneWireWriteAndRead(pin, device, 0xBE, 9, function(error, data) {
        if(error) {
          console.error(error);
          return;
        }
        var raw = (data[1] << 8) | data[0];
        var celsius = raw / 16.0;
        var fahrenheit = celsius * 1.8 + 32.0;

        console.info("celsius", celsius);
        console.info("fahrenheit", fahrenheit);
      });
    };
    // read the temperature now
    readTemperature();
    // and every five seconds
    setInterval(readTemperature, 5000);
  });
});





