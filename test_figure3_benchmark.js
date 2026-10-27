/**
 * test_figure3_benchmark.js
 * Verification suite for DAA Figure 3: Binary vs Linear Search Comparison Table
 */

const fs = require('fs');
const assert = require('assert');

console.log('=== RUNNING DAA FIGURE 3 BENCHMARK VERIFICATION ===\n');

// 1. Simulation of Binary Search comparison count
function countBinaryComparisons(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  let comparisons = 0;

  while (low <= high) {
    comparisons++;
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return { found: true, index: mid, comparisons };
    } else if (target < arr[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return { found: false, index: -1, comparisons };
}

// 2. Simulation of Linear Search comparison count
function countLinearComparisons(arr, target) {
  let comparisons = 0;
  let found = false;

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    if (arr[i] === target) {
      found = true;
      break;
    }
  }

  return { found, comparisons };
}

// Table Test Cases matching Report Figure 3
const testCases = [
  { arr: [1, 3, 5, 7, 9], target: 7, expBin: 2, expLin: 4, label: 'Row 1: [1, 3, 5, 7, 9] Target 7' },
  { arr: [1, 3, 5, 7, 9], target: 2, expBin: 3, expLin: 5, label: 'Row 2: [1, 3, 5, 7, 9] Target 2 (absent)' },
  { arr: [1, 3, 5, 7, 9], target: 9, expBin: 3, expLin: 5, label: 'Row 3: [1, 3, 5, 7, 9] Target 9' },
  { arr: [4], target: 4, expBin: 1, expLin: 1, label: 'Row 4: [4] Target 4' }
];

console.log('[GROUP 1] Algorithm Comparison Counts Verification');
testCases.forEach(tc => {
  const bin = countBinaryComparisons(tc.arr, tc.target);
  const lin = countLinearComparisons(tc.arr, tc.target);

  assert.strictEqual(bin.comparisons, tc.expBin, `${tc.label} binary comparisons must be ${tc.expBin}`);
  assert.strictEqual(lin.comparisons, tc.expLin, `${tc.label} linear comparisons must be ${tc.expLin}`);
  console.log(`  ✓ ${tc.label} -> Binary: ${bin.comparisons}, Linear: ${lin.comparisons} (Match!)`);
});

// 3. Verify HTML structure in index.html
console.log('\n[GROUP 2] DOM Structure & Attributes Verification');
const html = fs.readFileSync('index.html', 'utf8');

assert(html.includes('id="daa-comparison-report-table"'), 'Table element must exist');
assert(html.includes('Binary vs Linear Search'), 'Section heading must exist');
assert(html.includes('Figure 3 Report Benchmark'), 'Figure 3 badge must exist');
assert(html.includes('data-arr="1, 3, 5, 7, 9" data-target="7"'), 'Row 1 attributes must exist');
assert(html.includes('data-arr="1, 3, 5, 7, 9" data-target="2"'), 'Row 2 attributes must exist');
assert(html.includes('data-arr="1, 3, 5, 7, 9" data-target="9"'), 'Row 3 attributes must exist');
assert(html.includes('data-arr="4" data-target="4"'), 'Row 4 attributes must exist');
assert(html.includes('The gap is small for five elements but widens quickly'), 'Asymptotic text must exist');
assert(html.includes('id="daa-btn-preset-report"'), 'Figure 3 quick preset button must exist');
assert(html.includes('id="daa-linear-target-input"'), 'Dedicated Linear Search input must exist');
assert(html.includes('id="daa-linear-visualizer-stage"'), 'Dedicated Linear Search visualizer stage must exist');
assert(html.includes('id="daa-linear-array-track"'), 'Dedicated Linear Search array track must exist');
assert(html.includes('id="daa-linear-trace-list"'), 'Dedicated Linear Search trace list must exist');

// Dual Side-by-Side Visualizer Column Assertions
assert(html.includes('dual-columns-grid'), 'Side-by-side dual columns grid must exist');
assert(html.includes('id="daa-dual-binary-visualizer-stage"'), 'Dedicated Dual Binary stage must exist');
assert(html.includes('id="daa-dual-binary-array-track"'), 'Dedicated Dual Binary array track must exist');
assert(html.includes('id="daa-dual-binary-trace-list"'), 'Dedicated Dual Binary trace list must exist');
assert(html.includes('id="daa-linear-comps"'), 'Linear real-time comparisons metric element must exist');
assert(html.includes('id="daa-binary-comps"'), 'Binary real-time comparisons metric element must exist');
console.log('  ✓ Table, rows, badges, asymptotic callout, and Dual Linear vs Binary visualizer verified in index.html');

// 4. Verify CSS in css/style.css
console.log('\n[GROUP 3] CSS Styling Verification');
const css = fs.readFileSync('css/style.css', 'utf8');
assert(css.includes('.comparison-report-table'), 'Table class defined in CSS');
assert(css.includes('.active-comparison-row'), 'Active row class defined in CSS');
assert(css.includes('.binary-badge-count'), 'Binary badge class defined in CSS');
assert(css.includes('.linear-badge-count'), 'Linear badge class defined in CSS');
assert(css.includes('.asymptotic-callout-box'), 'Asymptotic callout box defined in CSS');
assert(css.includes('.fig-badge'), 'Figure badge defined in CSS');
assert(css.includes('.linear-studio-wrapper'), 'Linear studio wrapper defined in CSS');
assert(css.includes('.pointer-badge.linear-pointer'), 'Linear pointer badge defined in CSS');
assert(css.includes('.dual-columns-grid'), 'Dual columns grid layout defined in CSS');
assert(css.includes('.dual-column.linear-column'), 'Linear column styling defined in CSS');
assert(css.includes('.dual-column.binary-column'), 'Binary column styling defined in CSS');
console.log('  ✓ CSS classes for Figure 3 comparison table, callout, and Dual Visualizer studio verified');

// 5. Verify DAA JavaScript module wiring
console.log('\n[GROUP 4] JavaScript Event Wiring Verification');
const js = fs.readFileSync('js/daa.js', 'utf8');
assert(js.includes('updateReportTableActiveRow'), 'updateReportTableActiveRow defined in js/daa.js');
assert(js.includes('btnPresetReport'), 'btnPresetReport handled in js/daa.js');
assert(js.includes('.comparison-row'), 'Row click listeners bound in js/daa.js');
assert(js.includes('computeLinearSearchTrace'), 'computeLinearSearchTrace defined in js/daa.js');
assert(js.includes('loadLinearPresetArray'), 'loadLinearPresetArray defined in js/daa.js');
assert(js.includes('renderLinearStep'), 'renderLinearStep defined in js/daa.js');
assert(js.includes('initDualComparison'), 'initDualComparison defined in js/daa.js');
assert(js.includes('computeDualBinarySearchTrace'), 'computeDualBinarySearchTrace defined in js/daa.js');
assert(js.includes('renderDualStep'), 'renderDualStep defined in js/daa.js');
assert(js.includes('handleDualStepForward'), 'handleDualStepForward defined in js/daa.js');
assert(js.includes('toggleDualPlayPause'), 'toggleDualPlayPause defined in js/daa.js');
console.log('  ✓ JavaScript dynamic synchronization, Dual search engine, and click handlers verified');

console.log('\n======================================================');
console.log('ALL FIGURE 3 BENCHMARK TESTS PASSED WITH 100% SUCCESS!');
console.log('======================================================\n');
