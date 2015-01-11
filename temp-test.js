var board = new firmata.Board("/dev/my/device", function (error) {
  if(error) {
    console.error(error);
    return;
  }

  // 1-wire devices are on pin 3
  var pin = 3;

  board.sendOneWireConfig(pin, true);
  board.sendOneWireSearch(pin, function(error, devices) {
    if(error) {
      console.error(error);
      return;
    }

    // only interested in the first device
    var device = devices[0];

    var readTemperature = function() {
      // start transmission
      board.sendOneWireReset(pin);

      // a 1-wire select is done by ConfigurableFirmata
      board.sendOneWireWrite(pin, device, 0x44);

      // the delay gives the sensor time to do the calculation
      board.sendOneWireDelay(pin, 1000);

      // start transmission
      board.sendOneWireReset(pin);

      // tell the sensor we want the result and read it from the scratchpad
      board.sendOneWireWriteAndRead(pin, device, 0xBE, 9, function(error, data) {
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