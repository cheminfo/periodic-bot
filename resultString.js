'use strict';

const CC = require('chemcalc');
const info = require('./info.json');
const sprintf = require('sprintf').sprintf;

module.exports = resultString;

/**
 * Search the object inside the database
 * @param {object} element - Compound to render
 * @return {string} - String to render
 */
function resultString(element) {
  var result = '';
  result += `<b>${element.symbol}</b> : <em>${element.name}</em>\r\n`;
  result += `<b>Z: </b>${element.Z}\r\n`;
  result += `<b>Atomic weight: </b>${element.atomicWeight.toFixed(2)} ${info.atomicWeight.unit}\r\n`;
  result += `<b>Electronegativity: </b>${element.electronegativity}\r\n`;
  result += `<b>Configuration: </b>${element.electronConfiguration}\r\n`;
  result += `<b>In french: </b>${element.nameFR}\r\n`;
  result += `<b>m.p.: </b>${element.melting} ${info.melting.unit}`+' ('+(element.melting-273.15).toPrecision(4)+' °C)\r\n';
  result += `<b>b.p.: </b>${element.boiling} ${info.boiling.unit}`+' ('+(element.boiling-273.15).toPrecision(4)+' °C)\r\n';
  result += `<b>Ionisation energy: </b>${element.firstIonisation} ${info.firstIonisation.unit}\r\n`;
  result += getIsotopes(element.symbol);
  return result;
}

/**
 * List of isotopes for the given element
 * @param {string} symbol - Chemical symbol
 * @return {string} - Stable isotopes list
 */
function getIsotopes(symbol) {
  var elements = CC.getInfo().elements;
  for (var element of elements) {
    if (element.symbol === symbol) {
      var isotopes=element.isotopes.filter(a => a.percentage>0);
      if (! isotopes || isotopes.length === 0) {
        return '<b>No stable isotopes</b>';
      } else {
        return '<b>Stable isotopes: </b>\r\n'+
          '<pre>'+
          isotopes.map(
            i => `${sprintf('%3d',Math.round(i.mass)) + symbol} - ${sprintf('%9s',i.mass.toFixed(5))} (${sprintf('%5s',i.percentage.toFixed(2))}%)`
          ).join('\r\n') +
          '</pre>';
      }
    }
  }
}
