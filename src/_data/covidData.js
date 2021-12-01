const fetch = require('node-fetch');

const API_BASE_URL = 'https://api.corona-zahlen.org/';

async function getRkiApiData(endpoint) {
    const response = await fetch(API_BASE_URL + endpoint);

    // The API call was successful!
    if (response.ok) {
        return await response.json();
    } else {
        console.warn('API call to api.corona-zahlen.org failed.');
    }

    return null;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function getColorFromIncidence(colorRanges, incidence) {
    let range = colorRanges
        .filter(obj => obj.max > incidence)
        .filter(obj => obj.min < incidence);

    if (range.length === 1) {
        return range[0].color;
    } else {
        console.log('Could not determine a definitive range');
    }
}

/*!
 * Get the contrasting color for any hex color
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
function getContrast(hexcolor) {
    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === '#') {
        hexcolor = hexcolor.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(function (hex) {
            return hex + hex;
        }).join('');
    }

    // Convert to RGB value
    let r = parseInt(hexcolor.substr(0,2),16);
    let g = parseInt(hexcolor.substr(2,2),16);
    let b = parseInt(hexcolor.substr(4,2),16);

    // Get YIQ ratio
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)';
}


module.exports = async function() {
    const dataGermany = await getRkiApiData('germany');
    const incidentColorRangesStates = await getRkiApiData('map/states/legend');

    const covidData = {
        incidenceColor: '#fff', // fallback for body background-color
        textColor: '#000',      // fallback for text colors
    }

    if (dataGermany) {
        covidData.weekIncidence = roundToTwo(dataGermany.weekIncidence);
        covidData.lastUpdate = dataGermany.meta.lastUpdate;
    }

    if (incidentColorRangesStates) {
        let backgroundColor = getColorFromIncidence(incidentColorRangesStates.incidentRanges, dataGermany.weekIncidence);

        covidData.incidenceColor = backgroundColor;
        covidData.textColor = getContrast(backgroundColor);
    }

    return covidData;
};
