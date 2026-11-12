import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { measurementFrontier } from '../src/index.js';
const input = () => JSON.parse(fs.readFileSync('fixtures/demo.json'));
test('mandatory-cost failures stay visible in all languages', () => {
  for (const locale of ['fr', 'en', 'es']) {
    const base = input(),
      copy = structuredClone(base);
    const x = measurementFrontier(base, [0, 10, 40, 80], { locale });
    assert.ok(x.infeasibleBudgets.includes(0));
    assert.ok(x.frontier.length > 0);
    assert.deepEqual(base, copy);
    for (const a of x.frontier)
      for (const b of x.frontier)
        assert.ok(
          a === b ||
            !(
              b.measurementCost <= a.measurementCost &&
              b.residualLoss <= a.residualLoss &&
              (b.measurementCost < a.measurementCost || b.residualLoss < a.residualLoss)
            ),
        );
  }
});
test('duplicate budgets do not duplicate plans', () => {
  const x = measurementFrontier(input(), [80, 80]);
  assert.equal(x.uniqueFeasiblePlans, 1);
});
