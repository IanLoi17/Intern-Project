//USING BROWSER DATE TIME FOR DISPLAY ONLY....TIMESTAMP WILL USE SERVER DATE TIME
var tmonth = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sept',
	'Oct',
	'Nov',
	'Dec'
];

function GetClock() {
	var d = new Date();
	var nmonth = d.getMonth(),
		ndate = d.getDate(),
		nyear = d.getFullYear();

	var nhour = d.getHours(),
		nmin = d.getMinutes(),
		nsec = d.getSeconds(),
		ap;

	if (nhour == 0) {
		ap = ' AM';
		nhour = 12;
	} else if (nhour < 12) {
		ap = ' AM';
	} else if (nhour == 12) {
		ap = ' PM';
	} else if (nhour > 12) {
		ap = ' PM';
		nhour -= 12;
	}

	if (nmin <= 9) nmin = '0' + nmin;
	if (nsec <= 9) nsec = '0' + nsec;

	var clocktext =
		'' +
		tmonth[nmonth] +
		' ' +
		ndate +
		', ' +
		nyear +
		' ' +
		nhour +
		':' +
		nmin +
		':' +
		nsec +
		ap +
		'';
	document.getElementById('clockbox').innerHTML = clocktext;
}

GetClock();
setInterval(GetClock, 1000);

//Server Time
var xmlHttp;
function srvTime() {
	try {
		//FF, Opera, Safari, Chrome
		xmlHttp = new XMLHttpRequest();
	} catch (err1) {
		//IE
		try {
			xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
		} catch (err2) {
			try {
				xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
			} catch (eerr3) {
				//AJAX not supported, use CPU time.
				alert('AJAX not supported');
			}
		}
	}
	xmlHttp.open('HEAD', window.location.href.toString(), false);
	xmlHttp.setRequestHeader('Content-Type', 'text/html');
	xmlHttp.send('');
	return xmlHttp.getResponseHeader('Date');
}

	// CLOCKING IN
	var x = document.getElementById('myBtnIN');
	function getLocationConstantIN() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPositionIN, showError);
		} else {
			x.innerHTML = 'Geolocation is not supported by this browser.';
		}
	}

	function showPositionIN(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		displayLocationIN(lat, lon);
	}

	function showError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				x.innerHTML = 'User denied the request for Geolocation.';
				break;
			case error.POSITION_UNAVAILABLE:
				x.innerHTML = 'Location information is unavailable.';
				break;
			case error.TIMEOUT:
				x.innerHTML = 'The request to get user location timed out.';
				break;
			case error.UNKNOWN_ERROR:
				x.innerHTML = 'An unknown error occurred.';
				break;
		}
	}

	function displayLocationIN(latitude, longitude) {
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(latitude, longitude);

		geocoder.geocode({ latLng: latlng }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					var add = results[0].formatted_address;
					var value = add.split(',');

					count = value.length;
					country = value[count - 1];
					state = value[count - 2];
					document.getElementById('locationIN').value =
						'Location In: ' + state + ', ' + country;

					const st = srvTime();
					const date = new Date(st);
					document.getElementById('datetimeIN').value =
						'Time In: ' + date.toLocaleString();
				} else {
					x.alert = 'address not found';
				}
			} else {
				x.innerHTML = 'Geocoder failed due to: ' + status;
			}
		});
	}

	// CLOCKING OUT
	var y = document.getElementById('myBtnOUT');
	function getLocationConstantOUT() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		} else {
			y.innerHTML = 'Geolocation is not supported by this browser.';
		}
	}

	function showPosition(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		displayLocationOUT(lat, lon);
	}

	function showError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				y.innerHTML = 'User denied the request for Geolocation.';
				break;
			case error.POSITION_UNAVAILABLE:
				y.innerHTML = 'Location information is unavailable.';
				break;
			case error.TIMEOUT:
				y.innerHTML = 'The request to get user location timed out.';
				break;
			case error.UNKNOWN_ERROR:
				y.innerHTML = 'An unknown error occurred.';
				break;
		}
	}

	function displayLocationOUT(latitude, longitude) {
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(latitude, longitude);

		geocoder.geocode({ latLng: latlng }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					var add = results[0].formatted_address;
					var value = add.split(',');

					count = value.length;
					country = value[count - 1];
					state = value[count - 2];
					document.getElementById('locationIN').value =
						'Location Out: ' + state + ', ' + country;

					const st = srvTime();
					const date = new Date(st);
					document.getElementById('datetimeIN').value =
						'Time Out: ' + date.toLocaleString();
				} else {
					y.alert = 'address not found';
				}
			} else {
				y.innerHTML = 'Geocoder failed due to: ' + status;
			}
		});
	}
