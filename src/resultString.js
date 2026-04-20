import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { MF } from 'mf-parser';

const info = JSON.parse(
  readFileSync(join(import.meta.dirname, 'info.json'), 'utf8'),
);

/**
 * Render a Telegram HTML message describing a periodic table element.
 * @param {object} element - Element record from data.json.
 * @returns {string} HTML-formatted string to send to Telegram.
 */
export function resultString(element) {
  const celsiusMelting = (element.melting - 273.15).toPrecision(4);
  const celsiusBoiling = (element.boiling - 273.15).toPrecision(4);
  const encodedSymbol = encodeURIComponent(element.symbol);
  return [
    `<b>${element.symbol}</b> : <em>${element.name}</em>`,
    `<b>Z: </b>${element.Z}`,
    `<b>Atomic weight: </b>${element.atomicWeight.toFixed(2)} ${info.atomicWeight.unit}`,
    `<b>Electronegativity: </b>${element.electronegativity}`,
    `<b>Configuration: </b>${element.electronConfiguration}`,
    `<b>In french: </b>${element.nameFR}`,
    `<b>Density: </b>${element.density} g/cm3`,
    `<b>m.p.: </b>${element.melting} ${info.melting.unit} (${celsiusMelting} °C)`,
    `<b>b.p.: </b>${element.boiling} ${info.boiling.unit} (${celsiusBoiling} °C)`,
    `<b>Ionisation energy: </b>${element.firstIonisation} ${info.firstIonisation.unit}`,
    getIsotopes(element.symbol),
    `\n<a href='http://www.cheminfo.org/index.html?viewURL=https%3A%2F%2Fcouch.cheminfo.org%2Fcheminfo-public%2F3e54b136946b03d66fc7e7e64b63d694%2Fview.json&atom=${encodedSymbol}'>Open periodic table</a>`,
  ].join('\r\n');
}

function getIsotopes(symbol) {
  let distribution;
  try {
    const info = new MF(symbol).getIsotopesInfo();
    distribution = info.isotopes?.[0]?.distribution ?? [];
  } catch {
    return '';
  }
  if (distribution.length === 0) {
    return '<b>No stable isotopes</b>';
  }
  const rows = distribution.map(({ x, y }) => {
    const nominal = String(Math.round(x)).padStart(3, ' ');
    const exactMass = x.toFixed(5).padStart(9, ' ');
    const percentage = (y * 100).toFixed(2).padStart(5, ' ');
    return `${nominal}${symbol} - ${exactMass} (${percentage}%)`;
  });
  return `<b>Stable isotopes: </b>\r\n<pre>${rows.join('\r\n')}</pre>`;
}
