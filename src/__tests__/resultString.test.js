import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { resultString } from '../resultString.js';

const data = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'data.json'), 'utf8'),
);

const elementBySymbol = Object.fromEntries(
  data.map((element) => [element.symbol, element]),
);

test('renders Hydrogen with expected core fields', () => {
  const rendered = resultString(elementBySymbol.H);

  expect(rendered).toContain('<b>H</b> : <em>Hydrogen</em>');
  expect(rendered).toContain('<b>Z: </b>1');
  expect(rendered).toContain('<b>In french: </b>Hydrogène');
  expect(rendered).toContain('<b>Electronegativity: </b>2.2');
  expect(rendered).toContain('Open periodic table');
});

test('renders Carbon with stable isotopes block', () => {
  const rendered = resultString(elementBySymbol.C);

  expect(rendered).toContain('<b>C</b> : <em>Carbon</em>');
  expect(rendered).toContain('<b>Stable isotopes: </b>');
  expect(rendered).toMatch(/12C\s+-\s+12\.\d+\s+\(\s*\d+\.\d+%\)/);
  expect(rendered).toMatch(/13C\s+-\s+13\.\d+\s+\(\s*\d+\.\d+%\)/);
});

test('renders Iron snapshot', () => {
  const rendered = resultString(elementBySymbol.Fe);

  expect(rendered).toMatchSnapshot();
});

test('renders Oxygen snapshot', () => {
  const rendered = resultString(elementBySymbol.O);

  expect(rendered).toMatchSnapshot();
});

test('renders Technetium with its radioactive isotope', () => {
  const rendered = resultString(elementBySymbol.Tc);

  expect(rendered).toContain('<b>Tc</b> : <em>Technetium</em>');
  expect(rendered).toMatchSnapshot();
});
