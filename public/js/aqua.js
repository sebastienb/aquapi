jQuery(function($){
		
	var socket = io.connect();

	
	socket.on('connect', function () {
        console.log("connected!!");
        socket.emit('status', 'Display connected');
		
		$('#dayLightSlider').on('set', function(){

			console.log('change dude!');
			var testvalue = $('#dayLightSlider').val();
			console.log(testvalue);
			socket.emit('schedule', testvalue);
		});

		$('#day-on').click(function(){
			socket.emit('lights', 'day-on')
		});

		$('#day-off').click(function(){
			socket.emit('lights', 'day-off')
		});

		$('#night-on').click(function(){
			socket.emit('lights', 'night-on')
		});

		$('#night-off').click(function(){
			socket.emit('lights', 'night-off')
		});
	});


	socket.on('disconnect', function () {
        console.log("disconnected!!");
        alertDiv.html("Lost connection to server!");
       
	});

	$("#dayLightSlider").noUiSlider({
		
		behaviour: 'drag',
		connect: true,
		range: {
			'min': 0,
			'4.1666666667%':1,
			'8.33333333348%':2,
			'12.5000000001%':3,
			'16.6666666668%':4,
			'20.8333333335%':5,
			'25.0000000002%':6,
			'29.1666666669%':7,
			'33.3333333336%':8,
			'37.5000000003%':9,
			'41.666666667%':10,
			'45.8333333337%':11,
			'50.0000000004%':12,
			'54.1666666671%':13,
			'58.3333333338%':14,
			'62.5000000005%':15,
			'66.6666666672%':16,
			'70.8333333339%':17,
			'75.0000000006%':18,
			'79.1666666673%':19,
			'83.333333334%':20,
			'87.5000000007%':21,
			'91.6666666674%':22,
			'95.8333333341%':23,
			'max': 24
		},
		start: [ 7, 15 ],
		snap:true
	});

	
	$("#dayLightSlider").Link('lower').to($("#onTime"));

	$("#dayLightSlider").Link('upper').to($("#offTime"));

});