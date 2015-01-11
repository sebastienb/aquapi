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
};


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
// });



var five = require('johnny-five'), board

var pin = 3;
var board = new five.Board();

// Need a place to store the temperatures
var temps = [];

// Dumps the array of temps after converting each to Fahrenheit
var outputFTemps = function() {
    var out = [];
    for (var i = 0, len = temps.length; i < len; i++) {
        var celsius = temps[i] / 16.0;
        out[i] = (celsius * 1.8 + 32.0).toFixed(2);
    }
    console.log(out);
}

// Don't do anything until the board is ready for communication.
board.on("ready", function () {

    // Find all the devices on the 1-wire bus.  Reset, then send command search.
    board.io.sendOneWireConfig(pin, true);
    board.io.sendOneWireSearch(pin, function(error, allDevices) {
        if(error) {
          console.error(error);
          return;
        }

        // Parse out only the temperature probes (DS18B20)
        var devices = [];
        for (var i = 0, len = allDevices.length; i < len; i++) {
            if(allDevices[i][0] == 0x28) {
                devices.push(allDevices[i]);
                }
        }

        // Method to read a single temperature probe and store it in the temps array.
        var readSingle = function(deviceNum) {

            // If we reached the end of the list of devices, then start again by calling readTemperatures in a non-blocking way.
            if(!(deviceNum in devices)) {
                setTimeout(readTemperatures,0);
                return;
            }

            // Send the reset on the bus so it is ready for next command.
            board.io.sendOneWireReset(pin);

            // tell the sensor we want the result and read it from the scratchpad
            board.io.sendOneWireWriteAndRead(pin, devices[deviceNum], 0xBE, 9, function(error, data) {
                if(error) {
                  console.error(error);
                  return;
                }

                // Convert the data into a raw integer.
                var raw = (data[1] << 8) | data[0];
                temps[deviceNum] = raw;

                // We have read this temp, lets read the next one.
                setTimeout(readSingle,0,deviceNum+1);
            }.bind(deviceNum));     
        }

        // Method to sent CONVERT command to all devices and then start the reading chain.
        var readTemperatures = function() {
        console.log('==================== Read Cycle Start ==========================');

            // Reset and start convert on all probes.
            for (var i = 0, len = devices.length; i < len; i++) {
                board.io.sendOneWireReset(pin);
                board.io.sendOneWireWrite(pin, devices[i], 0x44);
            }

            // Read the first device temperature.
            setTimeout(readSingle,0,0);       
        };

        // Output the temps every 1/10 second.
        setInterval(outputFTemps,100);

        // Start the loop to continually read the temps.
        readTemperatures();
    });
});
