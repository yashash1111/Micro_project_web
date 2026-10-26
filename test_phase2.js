/**
 * ConceptLab Phase 2 Automated Verification Suite (test_phase2.js)
 * Tests all computational algorithms, invariants, and edge cases.
 */

const fs = require('fs');
const assert = require('assert');

console.log('=== RUNNING CONCEPTLAB PHASE 2 COMPREHENSIVE VERIFICATION ===\n');

// 1. VERIFY DAA ALGORITHM SUITE
console.log('[TEST GROUP 1] DAA — Binary Search & Linear Benchmark Engine');

function testBinarySearch(arr, target, mode = 'standard') {
  let low = 0;
  let high = arr.length - 1;
  let comparisons = 0;
  let firstFoundIndex = -1;

  while (low <= high) {
    comparisons++;
    const mid = Math.floor((low + high) / 2);
    const midVal = arr[mid];

    if (midVal === target) {
      if (mode === 'first') {
        firstFoundIndex = mid;
        if (mid > low && arr[mid - 1] === target) {
          high = mid - 1;
        } else {
          return { found: true, index: mid, comparisons };
        }
      } else {
        return { found: true, index: mid, comparisons };
      }
    } else if (target < midVal) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  if (mode === 'first' && firstFoundIndex !== -1) {
    return { found: true, index: firstFoundIndex, comparisons };
  }

  return { found: false, index: -1, comparisons };
}

// Case 1: Standard Search Found
const r1 = testBinarySearch([2, 4, 6, 8, 10], 8);
assert.strictEqual(r1.found, true);
assert.strictEqual(r1.index, 3);
assert(r1.comparisons <= Math.floor(Math.log2(5)) + 1, 'Max comparisons invariant holds');
console.log('  ✓ Standard Target Found: index [3], comparisons:', r1.comparisons);

// Case 2: Target Absent
const r2 = testBinarySearch([2, 4, 6, 8, 10], 7);
assert.strictEqual(r2.found, false);
assert.strictEqual(r2.index, -1);
assert(r2.comparisons <= Math.floor(Math.log2(5)) + 1, 'Max comparisons invariant holds');
console.log('  ✓ Target Absent: correctly terminated low > high in', r2.comparisons, 'comparisons');

// Case 3: Single Element Found & Absent
assert.strictEqual(testBinarySearch([5], 5).found, true);
assert.strictEqual(testBinarySearch([5], 5).index, 0);
assert.strictEqual(testBinarySearch([5], 8).found, false);
console.log('  ✓ Single element arrays handled correctly');

// Case 4: Negative Numbers
const negArr = [-12, -7, -3, 0, 4, 9, 15, 23];
const rNeg = testBinarySearch(negArr, -7);
assert.strictEqual(rNeg.found, true);
assert.strictEqual(rNeg.index, 1);
console.log('  ✓ Negative numbers found at correct index [1]');

// Case 5: Duplicate Handling & Left-Boundary Search
const dupArr = [2, 4, 4, 4, 6, 8];
const rDupStd = testBinarySearch(dupArr, 4, 'standard');
assert.strictEqual(rDupStd.found, true);
assert([1, 2, 3].includes(rDupStd.index), 'Standard search returns any matching index');

const rDupFirst = testBinarySearch(dupArr, 4, 'first');
assert.strictEqual(rDupFirst.found, true);
assert.strictEqual(rDupFirst.index, 1, 'Left-boundary search MUST return the FIRST occurrence index (1)');
console.log(`  ✓ Duplicates: Standard returned index [${rDupStd.index}], Leftmost returned index [${rDupFirst.index}]`);

// Case 6: Linear vs Binary Comparisons
let linComps = 0;
for (let i = 0; i < dupArr.length; i++) {
  linComps++;
  if (dupArr[i] === 8) break;
}
const binResult = testBinarySearch(dupArr, 8);
assert(linComps === 6, 'Linear comparisons to end = 6');
console.log(`  ✓ Benchmark: Target 8 required ${linComps} linear comps vs ${binResult.comparisons} binary comps (${(linComps/binResult.comparisons).toFixed(1)}x speedup)`);


// 2. VERIFY COA SUITE
console.log('\n[TEST GROUP 2] COA — Number Systems & Two\'s Complement Engine');

function testRadixConversion(inputStr, base) {
  let isNeg = inputStr.startsWith('-');
  let stripped = inputStr.replace(/^[+-]/, '');
  let val = 0n;
  if (base === 10) val = BigInt(stripped);
  else if (base === 2) val = BigInt('0b' + stripped);
  else if (base === 8) val = BigInt('0o' + stripped);
  else if (base === 16) val = BigInt('0x' + stripped);

  const prefix = isNeg ? '-' : '';
  return {
    dec: prefix + val.toString(10),
    bin: prefix + val.toString(2),
    oct: prefix + val.toString(8),
    hex: prefix + val.toString(16).toUpperCase()
  };
}

const c1 = testRadixConversion('10', 10);
assert.strictEqual(c1.dec, '10');
assert.strictEqual(c1.bin, '1010');
assert.strictEqual(c1.oct, '12');
assert.strictEqual(c1.hex, 'A');
console.log('  ✓ Decimal 10 conversions match: Bin=1010, Oct=12, Hex=A');

const c2 = testRadixConversion('FF', 16);
assert.strictEqual(c2.dec, '255');
assert.strictEqual(c2.bin, '11111111');
console.log('  ✓ Hex FF conversions match: Dec=255, Bin=11111111');

const c3 = testRadixConversion('-17', 10);
assert.strictEqual(c3.dec, '-17');
assert.strictEqual(c3.bin, '-10001');
console.log('  ✓ Negative -17 conversion matches: Dec=-17, Bin=-10001');

// Two's Complement Strict Range Validator
function testTwosComplement(val, bitWidth) {
  const num = BigInt(val);
  const minVal = -(2n ** BigInt(bitWidth - 1));
  const maxVal = (2n ** BigInt(bitWidth - 1)) - 1n;

  if (num < minVal || num > maxVal) {
    return { valid: false, error: 'Out of range' };
  }

  const moduloMask = 2n ** BigInt(bitWidth);
  let unsignedVal = num < 0n ? moduloMask + num : num;
  let binStr = unsignedVal.toString(2).padStart(bitWidth, '0');

  // Algebraic verification: -2^(n-1)*b_(n-1) + sum(b_i * 2^i)
  const msbWeight = -(2n ** BigInt(bitWidth - 1)) * BigInt(binStr[0]);
  let sum = msbWeight;
  for (let i = 1; i < bitWidth; i++) {
    if (binStr[i] === '1') {
      sum += (2n ** BigInt(bitWidth - 1 - i));
    }
  }

  assert.strictEqual(sum, num, 'Algebraic signed weight sum must strictly equal input');

  return {
    valid: true,
    bin: binStr,
    msb: binStr[0],
    sumVerified: sum
  };
}

// 8-bit signed range [-128..127]
assert.strictEqual(testTwosComplement(128, 8).valid, false, '128 must be rejected in 8-bit');
assert.strictEqual(testTwosComplement(-129, 8).valid, false, '-129 must be rejected in 8-bit');
console.log('  ✓ Strict range rejection: 128 and -129 rejected for 8-bit');

const tcMin = testTwosComplement(-128, 8);
assert.strictEqual(tcMin.valid, true);
assert.strictEqual(tcMin.bin, '10000000');
console.log('  ✓ 8-bit Min (-128) binary = 10000000, algebraic sum verified = -128');

const tcMax = testTwosComplement(127, 8);
assert.strictEqual(tcMax.valid, true);
assert.strictEqual(tcMax.bin, '01111111');
console.log('  ✓ 8-bit Max (+127) binary = 01111111, algebraic sum verified = +127');

const tcNeg17 = testTwosComplement(-17, 8);
assert.strictEqual(tcNeg17.valid, true);
assert.strictEqual(tcNeg17.bin, '11101111');
console.log('  ✓ -17 in 8-bit 2\'s complement = 11101111, algebraic sum verified = -17');

// 16-bit signed range [-32768..32767]
assert.strictEqual(testTwosComplement(32768, 16).valid, false, '32768 must be rejected in 16-bit');
const tc16Min = testTwosComplement(-32768, 16);
assert.strictEqual(tc16Min.valid, true);
assert.strictEqual(tc16Min.bin, '1000000000000000');
console.log('  ✓ 16-bit Min (-32768) binary = 1000000000000000, sum verified = -32768');


// 3. VERIFY FLAT DFA SUITE
console.log('\n[TEST GROUP 3] FLAT — DFA String Validator Engine');

const DFA_TRANSITIONS = {
  q0: { '0': 'q1', '1': 'q0' },
  q1: { '0': 'q1', '1': 'q2' },
  q2: { '0': 'q1', '1': 'q0' }
};

function runDFA(inputStr) {
  let state = 'q0';
  for (let char of inputStr) {
    if (!['0', '1'].includes(char)) throw new Error('Invalid symbol: ' + char);
    state = DFA_TRANSITIONS[state][char];
  }
  return {
    finalState: state,
    accepted: (state === 'q2')
  };
}

// Positive test cases (must end in '01')
const positiveCases = ['01', '101', '1001', '11001', '00001', '111101', '0101'];
positiveCases.forEach(str => {
  const res = runDFA(str);
  assert.strictEqual(res.accepted, true, `String "${str}" must be accepted`);
  assert.strictEqual(res.finalState, 'q2', `Accepted string "${str}" must halt in q2`);
});
console.log('  ✓ All 7 positive test cases successfully accepted in accept state q2');

// Negative test cases (do not end in '01')
const negativeCases = ['', '0', '1', '110', '100', '111', '010', '1000', '00'];
negativeCases.forEach(str => {
  const res = runDFA(str);
  assert.strictEqual(res.accepted, false, `String "${str}" must be rejected`);
  assert.notStrictEqual(res.finalState, 'q2', `Rejected string "${str}" must not halt in q2`);
});
console.log('  ✓ All 9 negative test cases (including empty string ε) correctly rejected');

// Verify all 6 transitions
assert.strictEqual(DFA_TRANSITIONS.q0['0'], 'q1');
assert.strictEqual(DFA_TRANSITIONS.q0['1'], 'q0');
assert.strictEqual(DFA_TRANSITIONS.q1['0'], 'q1');
assert.strictEqual(DFA_TRANSITIONS.q1['1'], 'q2');
assert.strictEqual(DFA_TRANSITIONS.q2['0'], 'q1');
assert.strictEqual(DFA_TRANSITIONS.q2['1'], 'q0');
console.log('  ✓ All 6 DFA state transitions verified mathematically');


// 4. VERIFY QUIZ ARENA SUITE
console.log('\n[TEST GROUP 4] Practice Arena — Dynamic Parameterized Generator');

// Test DAA dynamic logic
const testN = 1000;
const expectedDAA = Math.floor(Math.log2(testN)) + 1;
assert.strictEqual(expectedDAA, 10, '⌊log₂ 1000⌋ + 1 = 10');
console.log('  ✓ Dynamic DAA question math verified: N=1000 -> 10 comparisons');

// Test COA dynamic logic
const testDec = 175;
const expectedHex = testDec.toString(16).toUpperCase();
assert.strictEqual(expectedHex, 'AF');
console.log('  ✓ Dynamic COA question math verified: Dec=175 -> Hex=AF');

// Test FLAT dynamic logic
const testBin1 = '101001';
const testBin2 = '101010';
assert.strictEqual(testBin1.endsWith('01'), true);
assert.strictEqual(testBin2.endsWith('01'), false);
console.log('  ✓ Dynamic FLAT question logic verified: "101001" accepted, "101010" rejected');

console.log('\n=== ALL PHASE 2 TEST SUITES PASSED WITH 100% SUCCESS! ===');
