const CC = require('chemcalc');
const data = require('./data.json');
const info = require('./info.json');

/**
 * Search the object inside the database
 * @param {object} data - Database of elements
 * @param {object} info - Database of extra data
 * @param {string} query - Name of the compound to search
 * @return {{string:string, name:string}} - string to render and the name of the compound
 */

module.exports = function searchAndFormat(query) {
    let element = data[query.toLowerCase()];
    if (! element) {
        return {
            string: `Element ${query} not found`,
            name: 'element not found'
        };
    }

    
    var result = '';
    result += `<b>${element.symbol}</b> : <em>${element.name}</em>\r\n`;
    result += `<b>Z: </b>${element.Z}\r\n`;
    result += `<b>In french: </b>${element.nameFR}\r\n`;
    result += `<b>Atomic weight: </b>${element.atomicWeight} ${info.atomicWeight.unit}\r\n`;
    result += `<b>m.p.: </b>${element.melting} ${info.melting.unit}`+' ('+(element.melting-273.15).toPrecision(4)+' °C)\r\n';
    result += `<b>b.p.: </b>${element.boiling} ${info.boiling.unit}`+' ('+(element.boiling-273.15).toPrecision(4)+' °C)\r\n';
    result += `<b>Electronegativity: </b>${element.electronegativity}\r\n`;
    result += `<b>Ionisation energy: </b>${element.firstIonisation} ${info.firstIonisation.unit}\r\n`;
    result += `<b>Configuration: </b>${element.electronConfiguration}\r\n`;
    result += getIsotopes(element.symbol);
    
    return {
        string: result,
        name: element.name
    };
}

function getIsotopes(symbol) {
    var elements=CC.getInfo().elements;
    for (var element of elements) {
        if (element.symbol === symbol) {
            if (! element.isotopes || element.isotopes.length===0) {
                return '<b>No stable isotopes</b>';
            } else {
                return '<b>Stable isotopes: </b>\r\n'+
                        '<pre>'+
                        element.isotopes.map(
                                i => '  '+Math.round(i.mass)+symbol+" - "+i.mass.toFixed(5)+" - "+i.percentage.toFixed(2)+"%"
                        ).join("\r\n")+
                        '</pre>';
            }
        }
    }
}