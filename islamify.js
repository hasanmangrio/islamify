/**
 * Make request to Islamic Finder Prayer Times API to retrieve prayer times
 */
function getPrayerTimes() {
    console.log('getPrayerTimes');
    axios.get('http://www.islamicfinder.us/index.php/api/prayer_times?country=US&zipcode=98030&method=2')
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

getPrayerTimes();