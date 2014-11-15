jQuery(function($){
		
	var socket = io.connect();

	
	socket.on('connect', function () {
        console.log("connected!!");
        socket.emit('status', 'Display connected');
	});


	socket.on('disconnect', function () {
        console.log("disconnected!!");
        alertDiv.html("Lost connection to server!");
       
	});

});