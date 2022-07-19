window.onload = function() {
	console.log('entered onload');
	/**
	 * Given a longitude/latitude, make a request to the IslamicFinder Prayer Times API 
	 * to retrieve prayer times. Pass this info to helper function to update webpage.
	 * @param {String} longitude 
	 * @param {String} latitude 
	 */
	async function getPrayerTimes(longitude, latitude) {
		console.log('getPrayerTimes');
		console.log('long: ' + longitude);
		console.log('lat: ' + latitude);
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const baseURL = 'http://www.islamicfinder.us/index.php/api/prayer_times?method=2&timezone=' + timezone;
		const fullURL = baseURL + '&latitude=' + latitude + '&longitude=' + longitude;
		// axios.get('http://www.islamicfinder.us/index.php/api/prayer_times?country=US&zipcode=98030&method=2')
		// axios.get('http://www.islamicfinder.us/index.php/api/prayer_times?latitude=47.358675600000005&longitude=-122.17815519999999&method=2&timezone=America/Los_Angeles')
		await fetch(fullURL)
				.then((response) => response.json())
				.then((prayerTimes) => {
					console.log('prayerTimes:');
					console.log(prayerTimes);
					insertPrayerTimesIntoTable(prayerTimes);
				})
				.catch(function (error) {
					logErrorToConsole(error);
				});   
	}
	
	/**
	 * Given a HTTP response object, insert the prayer times data into the appropriate cells.
	 * @param {HTTP Object} response 
	 */
	function insertPrayerTimesIntoTable(response) {
		console.log('insertDataIntoTable');
		var tableElement = document.getElementById('prayer-times-table');  
		
		var prayerTimes = response.results;

		var fajrTime = prayerTimes.Fajr;
		var fajrRow = tableElement.getElementsByTagName('tr')[1];
		var fajrAthanCell = fajrRow.getElementsByTagName('td')[1];
		fajrAthanCell.innerText = trimPrayerTime(fajrTime);

		var zhuhrTime = prayerTimes.Dhuhr;
		var zhuhrRow = tableElement.getElementsByTagName('tr')[2];
		var zhuhrAthanCell = zhuhrRow.getElementsByTagName('td')[1];
		zhuhrAthanCell.innerText = trimPrayerTime(zhuhrTime);

		var asrTime = prayerTimes.Asr;
		var asrRow = tableElement.getElementsByTagName('tr')[3];
		var asrAthanCell = asrRow.getElementsByTagName('td')[1];
		asrAthanCell.innerText = trimPrayerTime(asrTime);

		var maghribTime = prayerTimes.Maghrib;
		var maghribRow = tableElement.getElementsByTagName('tr')[4];
		var maghribAthanCell = maghribRow.getElementsByTagName('td')[1];
		maghribAthanCell.innerText = trimPrayerTime(maghribTime);

		var ishaTime = prayerTimes.Isha;
		var ishaRow = tableElement.getElementsByTagName('tr')[5];
		var ishaAthanCell = ishaRow.getElementsByTagName('td')[1];
		ishaAthanCell.innerText = trimPrayerTime(ishaTime);
	}

	/**
	 * Given a time in format "4:57 %am%", return trimmed version without '%', 'am', 'pm'.
	 * @param {String} time 
	 */
	function trimPrayerTime(time) {
		var cutoff = time.indexOf('%');
		return time.substring(0, cutoff);
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
			const cityWithState = getCityFromCoordinates(longitude, latitude);
			console.log('You are currently in: ' + cityWithState);
		};
		var userLocationFailure = function(error) {
			console.log('ERROR getting user location');
			console.log('error code: ' + error.code);
			console.log(error);
		};
	
		navigator.geolocation.getCurrentPosition(userLocationSuccess, userLocationFailure);
	}

	/**
	 * Given lat and long, return a string of city, state
	 * @param {string} longitude 
	 * @param {string} latitude 
	 */
	async function getCityFromCoordinates(longitude, latitude) {
		// TODO: Move this to a constants file 
		const API_KEY = 'AIzaSyATl7YnWCDdG76cAH9XfLdvF_L2mMebl-M';
		const url = `https://maps.googleapis.com/maps/api/geocode/json\?latlng\=${latitude},${longitude}\&key\=${API_KEY}`;

		await fetch(url)
		.then((response) => response.json())
		.then((locationData) => {
			console.log('locationData:');
			console.log(locationData);
			const address = locationData.results[0].formatted_address.split(" ");
			updateUserLocation(address[4], address[5]);
		})
		.catch(function (error) {
			logErrorToConsole(error);
		});
	}

	/**
	 * Given a city and state, update the title of the Prayer Times table.
	 * @param {String} city 
	 * @param {String} state 
	 */
	function updateUserLocation(city, state) {
		var locationElement = document.getElementById('user-location');
		locationElement.innerText = city + ' ' + state;
	}

	/**
	 * Using the user's IP address data, retrieve the user's current 
	 * city/state, and pass this data onto the helper function.
	 */
	async function getCity() {
		console.log('entered getCity');
		const url = "http://ipinfo.io";
		const headers = { 
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
		await fetch(url, { headers })
				.then((response) => response.json())
				.then((cityData) => {
					console.log(cityData.city);
					console.log(cityData.region);
					updateUserLocation(cityData.city, cityData.region);
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
		time = getTimeWithoutSeconds(time);

		const date = [dd, mm, yyyy, dayName, monthName];

		updateGregorianDate(date);
		updateTime(time);
		updateImage(monthName);
		updateQuote(dd);

		return date;
	}

	/**
	 * Update the background image to the image for the given month
	 * @param {string} monthName 
	 */
	function updateImage(monthName) {
		document.getElementsByClassName('container')[0].style.backgroundImage = `url('backgrounds/${monthName}.jpg')`
	}

	/**
	 * Given a day of the month, update the quote and author element to that 
	 * index value's content from local txt file
	 * @param {integer} dayOfMonth 
	 */
	function updateQuote(dayOfMonth) {
		fetch('./quotes.txt')
			.then(response => response.text())
			.then(quotesFile => {
				var quotes = quotesFile.split("\n");
				var chosenQuote = quotes[dayOfMonth].split("::");
				var quote = chosenQuote[0];
				var author = chosenQuote[1];
				author = '- ' + author.substring(1, author.length - 1);
				console.log(chosenQuote);
				document.getElementById('quote-content').innerText = quote;
				document.getElementById('quote-author').innerText = author;
			});
	}

	function getTimeWithoutSeconds(time) {
		var endIndex = time.lastIndexOf(':');
		var result = time.substring(0, endIndex) + time.slice(-3);
		return result;
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
		dateElement.innerText = `${dayName}, ${monthName} ${dd}, ${yyyy}`
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
		fetch(fullURL)
		.then((response) => response.json())
		.then(function (response) {
			updateIslamicDate(response.to);
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	function promptUserFirstName() {
		var name = prompt(`What's your first name?`);
		if (name != null && name.trim().length > 0) {
			document.getElementById('first-name').innerHTML = name;
			storeUserFirstName('firstName', name);
		}			
	}

	function storeUserFirstName(key, value) {
		chrome.storage.sync.set({key: value}, function() {
			if (chrome.runtime.error) {
				console.log('ERROR: Chrome storage API runtime error during SET');
			} else {
				console.log('Value is set to ' + value);
			}
		});
	}

	function getUserFirstName(key) {
		chrome.storage.sync.get(key, function(result) {
			if (!chrome.runtime.error) {
				console.log('Found name: ' + result.key);
				const name = result.key;
				if (name) {
					console.log('using stored name');
					document.getElementById('first-name').innerHTML = result.key;
				} else {
					console.log('prompting user for name');
					promptUserFirstName();
				}
			} else {
				console.log('ERROR: Chrome storage API runtime error during GET');
			}
		});
	}

	function resetUserFirstName(key, value) {
		chrome.storage.sync.set({ key: value }, function() {
			console.log('Reseting user first name');
		});
	}

	function setUpEditButton() {
		document.getElementById('change-button').onclick = function() {
			promptUserFirstName();
		};
	}

	setUpEditButton();

	// getCity();

	getCoordinates();
	getIslamicDate();
	getCurrentDate();

	getUserFirstName();
	// Uncomment this line to simulate a new user installing the extension for the first time
	// resetUserFirstName('name', '');
};

// http://www.islamicfinder.us/index.php/api/calendar?day=28&month=4&year=2021
