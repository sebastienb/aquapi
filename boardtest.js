var SerialPort = require("serialport").SerialPort;
var five = require("johnny-five");
var board = new five.Board({
  port: new SerialPort("COM4", {
    baudrate: 9600,
    buffersize: 1
  })
});

board.on("ready", function() {
  console.log('Board is ready !');
});