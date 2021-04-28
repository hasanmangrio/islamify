window.onload = function() {
	console.log('entered onload');
	/**
	 * Make request to Islamic Finder Prayer Times API to retrieve prayer times
	 */
	function getPrayerTimes(longitude, latitude) {
		console.log('getPrayerTimes');
		console.log('long: ' + longitude);
		console.log('lat: ' + latitude);
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const baseURL = 'http://www.islamicfinder.us/index.php/api/prayer_times?method=2&timezone=' + timezone;
		const fullURL = baseURL + '&latitude=' + latitude + '&longitude=' + longitude;
		// axios.get('http://www.islamicfinder.us/index.php/api/prayer_times?country=US&zipcode=98030&method=2')
		// axios.get('http://www.islamicfinder.us/index.php/api/prayer_times?latitude=47.358675600000005&longitude=-122.17815519999999&method=2&timezone=America/Los_Angeles')
		axios.get(fullURL)
		.then(function (response) {
			insertPrayerTimesIntoTable(response);
		})
		.catch(function (error) {
			logErrorToConsole(error);
		});   
	}
	
	/**
	 * Given a HTTP response object, insert the prayer times data into the appropriate cells
	 * @param {HTTP Object} response 
	 */
	function insertPrayerTimesIntoTable(response) {
		console.log('insertDataIntoTable');
		var tableElement = document.getElementById('prayer-times-table');  
		// console.log(response.data.results);
		// console.log(response.data.results.fajr);

		var prayerTimes = response.data.results;

		var fajrTime = prayerTimes.Fajr;
		var fajrRow = tableElement.getElementsByTagName('tr')[2];
		var fajrAthanCell = fajrRow.getElementsByTagName('td')[1];
		fajrAthanCell.innerText = trimPrayerTime(fajrTime);

		var zhuhrTime = prayerTimes.Dhuhr;
		var zhuhrRow = tableElement.getElementsByTagName('tr')[3];
		var zhuhrAthanCell = zhuhrRow.getElementsByTagName('td')[1];
		zhuhrAthanCell.innerText = trimPrayerTime(zhuhrTime);

		var asrTime = prayerTimes.Asr;
		var asrRow = tableElement.getElementsByTagName('tr')[4];
		var asrAthanCell = asrRow.getElementsByTagName('td')[1];
		asrAthanCell.innerText = trimPrayerTime(asrTime);

		var maghribTime = prayerTimes.Maghrib;
		var maghribRow = tableElement.getElementsByTagName('tr')[5];
		var maghribAthanCell = maghribRow.getElementsByTagName('td')[1];
		maghribAthanCell.innerText = trimPrayerTime(maghribTime);

		var ishaTime = prayerTimes.Isha;
		var ishaRow = tableElement.getElementsByTagName('tr')[6];
		var ishaAthanCell = ishaRow.getElementsByTagName('td')[1];
		ishaAthanCell.innerText = trimPrayerTime(ishaTime);
	}

	/**
	 * Given a time in format "4:57 %am%", return trimmed version without '%', 'am', 'pm'
	 * @param {String} time 
	 */
	function trimPrayerTime(time) {
		var cutoff = time.indexOf('%');
		return time.substring(0, cutoff);
	}

	/**
	 * Given a HTTP error object, logs various error info to the console 
	 * @param {Object} error 
	 */
	function logErrorToConsole(error) {
		console.log('Message: ');
		console.log(error.message);

		console.log('Status: ');
		console.log(error.response.status + ' ' + error.response.statusText);

		console.log('Headers: ');
		console.log(JSON.stringify(error.response.headers, null, '\t'));

		console.log('Data: ');
		console.log(JSON.stringify(error.response.data, null, '\t'));
	}
	
	function getCoordinates() {
		var userLocationSuccess = function(position) {
			const { latitude, longitude } = position.coords;
			console.log('You are located at:');
			// console.log('Latitude: ' + latitude);
			// console.log('Longitude: ' + longitude);
			getPrayerTimes(longitude, latitude);
		};
		var userLocationFailure = function(error) {
			console.log('ERROR getting user location');
			console.log('error code: ' + error.code);
			console.log(error);
		};
	
		navigator.geolocation.getCurrentPosition(userLocationSuccess, userLocationFailure);
	}

	getCoordinates();


};