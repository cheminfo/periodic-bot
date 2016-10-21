const CC = require('chemcalc');
const info = require('./info.json');

module.exports = resultString;

/**
 * Search the object inside the database
 * @param {object} element - Compound to render
 * @return {string} - String to render
 */
function resultString(element) {
  var result = '';
  result += `<b>${element.symbol}</b> : <em>${element.name}</em>\r\n`;
  result += `<b>Element number: </b>${element.Z}\r\n`;
  result += `<b>French name: </b>${element.nameFR}\r\n`;
  result += `<b>Atomic weight: </b>${element.atomicWeight} ${info.atomicWeight.unit}\r\n`;
  result += `<b>Melting point: </b>${element.melting} ${info.melting.unit}\r\n`;
  result += `<b>Boiling point: </b>${element.boiling} ${info.boiling.unit}\r\n`;
  result += `<b>Electronegativity: </b>${element.electronegativity}\r\n`;
  result += `<b>First ionisation energy: </b>${element.firstIonisation} ${info.firstIonisation.unit}\r\n`;
  result += `<b>Electronic configuration: </b>${element.electronConfiguration}\r\n`;
  result += `<b>First ionisation energy: </b>${element.firstIonisation} ${info.firstIonisation.unit}\r\n`;
  result += getIsotopes(element.symbol) + '\r\n';
  return result;
}

/**
 *
 * @param symbol
 * @return {*}
 */
function getIsotopes(symbol) {
  var elements = CC.getInfo().elements;
  for (var element of elements) {
    if (element.symbol === symbol) {
      if (! element.isotopes || element.isotopes.length === 0) {
        return '<b>No stable isotopes</b>';
      } else {
          return '<b>Stable isotopes: </b>' +
              element.isotopes.map((i) => Math.round(i.mass) + symbol + " (" + i.percentage.toFixed(2) + "%)").join(", ");
      }
    }
  }
}