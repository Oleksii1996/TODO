$(document).ready(function() {
	var dimension = 10,
		points = 0,
		seconds = 60,
		timeoutId;

	function initField() {
		var content = '';
		for (var i = 0; i < dimension; i++) {
			content += '<tr>';
			for (var j = 0; j < dimension; j++) {
				if (Math.round(Math.random()) === 0) {
					content += '<td id="' + i.toString() + j.toString() + '" class="nonActive"></td>';
				} else {
					var count = selfRandom(1, 3);
					content += '<td id="' + i.toString() + j.toString() + '" class="active' + count +'"></td>';
				}		
			}
			content += '</tr>';
		}
		$('#field').height($('#field').width());
		$('#field').append(content);
		getResults();
	}

	function selfRandom(min, max) {
  		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function generateNewCubes() {
		var count = selfRandom(0, 3), row, col, count;
		for (var i = 0; i < count; i++) {
			row = selfRandom(0, dimension - 1).toString();
			col = selfRandom(0, dimension - 1).toString();
			count = selfRandom(1, 3);
			if (!$('#' + row + col).hasClass('active3') && !$('#' + row + col).hasClass('active2') && !$('#' + row + col).hasClass('active1')) {
				$('#' + row + col).removeClass('nonActive').addClass('active' + count);
			}
		}
	}

	function timer() {
		if (seconds > 0) {
			seconds--;
			if (seconds < 10) {
				$('#time').text('Time left: 00:0' + seconds);
			} else {
				$('#time').text('Time left: 00:' + seconds);
			}
			timeoutId = setTimeout(timer, 1000);
		} else {
			clearTimeout(timeoutId);
			$('#pause').click();
			document.getElementsByClassName('modal')[0].style.display = 'block';
		}
	}

	function getResults() {
		var request = new XMLHttpRequest();

    	request.onreadystatechange = function () {
      		if (this.readyState === 4 && this.status === 201) {
      			var arr = JSON.parse(this.responseText);
      			
      			$('#results').html('<h3>Results</h3>');
      			for (var i = 0; i < arr.length; i++) {
      				$('#results').append('<p>' + (i+1) + '. ' + arr[i].name + ', points: ' + arr[i].points + '</p>');
      			}
      		}
    	};

    	request.open("GET", "/results");
		request.send();
	}

	initField();
	$('#start').click(function() {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				$('#' + i.toString() + j.toString()).click(function() {
					if ($(this).hasClass('active3')) {
						$(this).removeClass('active3').addClass('nonActive');
						points += 3;
						$('#points').text('Points: ' + points);
						generateNewCubes();
					}
					if ($(this).hasClass('active2')) {
						$(this).removeClass('active2').addClass('nonActive');
						points += 2;
						$('#points').text('Points: ' + points);
						generateNewCubes();
					}
					if ($(this).hasClass('active1')) {
						$(this).removeClass('active1').addClass('nonActive');
						points++;
						$('#points').text('Points: ' + points);
						generateNewCubes();
					}
				});
			}
		}
		timeoutId = setTimeout(timer, 1000);
	});

	$('#pause').click(function() {
		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				$('#' + i.toString() + j.toString()).unbind('click');
			}
		}
		clearTimeout(timeoutId);
	});

	$('#restart').click(function() {
		points = 0;
		$('#points').text('Points: ' + points);
		seconds = 60;
		$('#time').text('Time left: 01:00');
		$('#pause').click();
		$('#field').html('');
		initField();
	});	

	$('#saveResult').click(function() {
		var request = new XMLHttpRequest();

		request.onreadystatechange = function () {
      		if (this.readyState === 4) {
      			getResults();
      		}
    	};

    	request.open("POST", "/");
    	request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify({
			"name": $('#name').val(),
			"points": points
		}));
		$('.modal')[0].style.display = 'none';
	});

	$(window).resize(function(){
  		$('#field').height($('#field').width());
	});
});