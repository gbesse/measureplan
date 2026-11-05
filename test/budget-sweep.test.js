import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { budgetSweep } from '../src/index.js';
const demo = () => JSON.parse(fs.readFileSync('fixtures/demo.json'));
for (const locale of ['fr', 'en', 'es'])
  test(`budget sweep ${locale}`, () => {
    const d = demo(),
      before = JSON.stringify(d);
    const x = budgetSweep(d, [0, 20, 80, 80], { locale });
    assert.equal(x.length, 3);
    assert.equal(x[0].feasible, false);
    assert.ok(x[2].measurementCost <= 80);
    assert.equal(JSON.stringify(d), before);
  });
test('deterministic cost optimum cannot worsen with larger budget', () => {
  const x = budgetSweep(demo(), [20, 80, 200]).filter((x) => x.feasible);
  for (let i = 1; i < x.length; i++)
    assert.ok(x[i].totalExpectedCost <= x[i - 1].totalExpectedCost + 1e-8);
});
