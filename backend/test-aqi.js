const aqiService = require('./src/services/aqiService');

async function test() {
    console.log('Fetching live AQI data...');
    const data = await aqiService.fetchNationalAQIData();
    if (data) {
        console.log('Current AQI:', data.currentAqi);
        console.log('History 24h (last 5 points):', data.history24h.slice(-5));
        console.log('History length:', data.history24h.length);
    } else {
        console.log('Failed to fetch data.');
    }
}

test();
