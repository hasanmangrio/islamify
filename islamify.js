window.onload = function() {
	console.log('entered onload');
	/**
	 * Given a longitude/latitude, make a request to the IslamicFinder Prayer Times API 
	 * to retrieve prayer times. Pass this info to helper function to update webpage.
	 * @param {String} longitude 
	 * @param {String} latitude 
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
	 * Given a time String in the format HH:MM, add 10 minutes and return the new time.
	 * @param {String} time 
	 */
	function addTenMinutes(time) {
		time = time.trim();
		const dummyDate = 'January 1 1970 ';
		const date = new Date(dummyDate + time);
		date.setMinutes(date.getMinutes() + 10);
		var time = date.toLocaleTimeString();
		var endIndex = time.lastIndexOf(':');
		var newTime = time.substring(0, endIndex);
		return newTime;
	}
	
	/**
	 * Given a HTTP response object, insert the prayer times data into the appropriate cells.
	 * @param {HTTP Object} response 
	 */
	function insertPrayerTimesIntoTable(response) {
		console.log('insertDataIntoTable');
		var tableElement = document.getElementById('prayer-times-table');  
		
		var prayerTimes = response.data.results;
		for (var prayerName in prayerTimes) {
			prayerTimes[prayerName] = trimPrayerTime(prayerTimes[prayerName]);
		}

		var fajrTime = prayerTimes.Fajr;
		var fajrRow = tableElement.getElementsByTagName('tr')[2];
		var fajrAthanCell = fajrRow.getElementsByTagName('td')[1];
		fajrAthanCell.innerText = fajrTime;
		var fajrIqamaCell = fajrRow.getElementsByTagName('td')[2];
		fajrIqamaCell.innerText = addTenMinutes(fajrTime);

		var zhuhrTime = prayerTimes.Dhuhr;
		var zhuhrRow = tableElement.getElementsByTagName('tr')[3];
		var zhuhrAthanCell = zhuhrRow.getElementsByTagName('td')[1];
		zhuhrAthanCell.innerText = zhuhrTime;
		var zhuhrIqamaCell = zhuhrRow.getElementsByTagName('td')[2];
		zhuhrIqamaCell.innerText = addTenMinutes(zhuhrTime);

		var asrTime = prayerTimes.Asr;
		var asrRow = tableElement.getElementsByTagName('tr')[4];
		var asrAthanCell = asrRow.getElementsByTagName('td')[1];
		asrAthanCell.innerText = asrTime;
		var asrIqamaCell = asrRow.getElementsByTagName('td')[2];
		asrIqamaCell.innerText = addTenMinutes(asrTime);

		var maghribTime = prayerTimes.Maghrib;
		var maghribRow = tableElement.getElementsByTagName('tr')[5];
		var maghribAthanCell = maghribRow.getElementsByTagName('td')[1];
		maghribAthanCell.innerText = maghribTime;
		var maghribIqamaCell = maghribRow.getElementsByTagName('td')[2];
		maghribIqamaCell.innerText = maghribTime;

		var ishaTime = prayerTimes.Isha;
		var ishaRow = tableElement.getElementsByTagName('tr')[6];
		var ishaAthanCell = ishaRow.getElementsByTagName('td')[1];
		ishaAthanCell.innerText = ishaTime;
		var ishaIqamaCell = ishaRow.getElementsByTagName('td')[2];
		ishaIqamaCell.innerText = addTenMinutes(ishaTime);
	}

	/**
	 * Given a time in format "4:57 %am%", return trimmed version without '%', 'am', 'pm'.
	 * @param {String} time 
	 */
	function trimPrayerTime(time) {
		var cutoff = time.indexOf('%');
		return time.substring(0, cutoff);
		// returns time without % but with AM/PM
		//var newTime = time.substring(0, time.indexOf('%')) + time.substring(time.indexOf('%') + 1, time.length - 1);
	}

	/**
	 * Given a HTTP error object, logs various error info to the console.
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
	
	/**
	 * Retrieves a user current GPS location, and passes those coordinates off helper function.
	 */
	function getCoordinates() {
		var userLocationSuccess = function(position) {
			const { latitude, longitude } = position.coords;
			console.log('You are located at:');
			getPrayerTimes(longitude, latitude);
		};
		var userLocationFailure = function(error) {
			console.log('ERROR getting user location');
			console.log('error code: ' + error.code);
			console.log(error);
		};
	
		navigator.geolocation.getCurrentPosition(userLocationSuccess, userLocationFailure);
	}

	/**
	 * Given a city and state, update the title of the Prayer Times table.
	 * @param {String} city 
	 * @param {String} state 
	 */
	function updateUserLocation(city, state) {
		var locationElement = document.getElementById('user-location');
		locationElement.innerText = city + ', ' + state;
	}

	/**
	 * Using the user's IP address data, retrieve the user's current 
	 * city/state, and pass this data onto the helper function.
	 */
	async function getCity() {
		console.log('entered getCity');
		const url = "http://ipinfo.io";
		await axios.get(url)
		.then((response) => {
			console.log('response: ');
			console.log(response);
			console.log('city: ' + response.data.city);
			console.log('state: ' + response.data.region);
			updateUserLocation(response.data.city, response.data.region);
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	function getCurrentDate() {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		
		var dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
		var monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today)
		
		var time = today.toLocaleTimeString();
		time = time.substring(0, 5) + time.slice(-3);

		const date = [dd, mm, yyyy, dayName, monthName];

		updateGregorianDate(date);
		updateTime(time);

		return date;
	}

	function getDateWithSuffix(dd) {
		if (dd == 31 || dd == 21 || dd == 1) {
			return dd + "st";
		} else if (dd == 22 || dd == 2) {
			return dd + "nd";
		} else if (dd == 23 || dd == 3) {
			return dd + "rd";
		} else {
			return dd + "th";
		}
	};

	function updateGregorianDate(date) {
		var [ dd, mm, yyyy, dayName, monthName ] = date;
		dd = getDateWithSuffix(dd);
		var dateElement = document.getElementById('date');
		dateElement.innerText = `${dayName} ${monthName} ${dd}, ${yyyy}`
	}

	function updateIslamicDate(islamicDate) {
		const months = [
			"Muharram",
			"Safar",
			"Rabi ul-Awwal",
			"Rabi uth-Thani",
			"Jumada al-Ula", 
			"Jumada al-Thaniyah",
			"Rajab", 
			"Sha'aban",
			"Ramadan",
			"Shawwal",
			"Dhul Qi'dah",
			"Dhul Hijjah",
		];
		const dateArr = islamicDate.split('-');
		if (dateArr.length < 3) {
			console.log('ERROR: Islamic Date not received in expected format');
			return;
		} 

		const year = dateArr[0];
		const index = parseInt(dateArr[1]) - 1;
		console.log('index: ' + index);
		const month = months[index];
		console.log('month: ' + month);
		const day = getDateWithSuffix(dateArr[2]);

		var dateElement = document.getElementById('islamic-date');
		dateElement.innerText = month + ' ' + day + ', ' + year + ' AH';
	}

	function updateTime(time) {
		var timeElement = document.getElementById('current-time');
		timeElement.innerText = time;
	}

	function getIslamicDate() {	
		// var hardcodedURL = 'http://www.islamicfinder.us/index.php/api/calendar?day=28&month=4&year=2021';
		const [ dd, mm, yyyy ] = getCurrentDate();
		console.log('dd: ' + dd);
		console.log('mm: ' + mm);
		console.log('yyyy: ' + yyyy);
		const baseURL = 'http://www.islamicfinder.us/index.php/api/calendar?day=';
		const fullURL = baseURL + dd + '&month=' + mm + '&year=' + yyyy;
		console.log(fullURL);
		axios.get(fullURL)
		.then(function (response) {
			updateIslamicDate(response.data.to);
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	function getUserFirstName() {
		var name = prompt(`What's your first name?`);
		if (name != null && name.trim().length > 0) {
			document.getElementById('first-name').innerHTML = name;
		}
	}

	getCity();
	getCoordinates();
	getIslamicDate();
	getUserFirstName();
};

// http://www.islamicfinder.us/index.php/api/calendar?day=28&month=4&year=2021