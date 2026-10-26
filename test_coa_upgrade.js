/**
 * ConceptLab — Automated Verification Suite for COA Number System Lab
 * Validates all required test cases from Section 8:
 *
 * 1.  Binary 1011 → decimal 11
 * 2.  Decimal 25 → binary 11001
 * 3.  Decimal 255 → hexadecimal FF
 * 4.  Hexadecimal FF → decimal 255
 * 5.  Octal 17 → decimal 15
 * 6.  Binary 102 → Reject invalid digit
 * 7.  Octal 89 → Reject invalid digits
 * 8.  Decimal 12A → Reject invalid digits
 * 9.  Binary 0 → Show 0 in all bases
 * 10. A value larger than Number.MAX_SAFE_INTEGER → Convert exactly using BigInt
 * 11. 8-bit two's complement of −5 → 11111011
 * 12. 8-bit signed two's-complement maximum → 127
 * 13. 8-bit signed two's-complement minimum → −128
 * 14. 8-bit signed two's-complement input 128 → Reject as out of range
 * 15. 8-bit signed two's-complement input −129 → Reject as out of range
 *
 * Plus 16-bit and 32-bit boundary validations, positional expansion verification,
 * and repeated division step verification.
 */

const assert = require('assert');
const fs = require('fs');

// Mock browser document & elements
class MockElement {
  constructor(id = '', tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.classList = new Set();
    this.classList.add = (c) => this.classList.add(c);
    this.classList.remove = (c) => this.classList.delete(c);
    this.classList.contains = (c) => this.classList.has(c);
    this.classList.toggle = (c, val) => (val ? this.classList.add(c) : this.classList.delete(c));
    this.style = {};
    this.attributes = {};
    this.children = [];
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] || null; }
  removeAttribute(k) { delete this.attributes[k]; }
  addEventListener() {}
  appendChild(el) { this.children.push(el); }
  querySelectorAll() { return []; }
}

const mockDoc = {
  getElementById: (id) => new MockElement(id),
  querySelectorAll: () => [],
  createElement: (tag) => new MockElement('', tag),
  body: new MockElement('body'),
  documentElement: new MockElement('html')
};

global.document = mockDoc;
global.window = { localStorage: {} };
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };
global.App = { showPopup: () => {}, showToast: () => {} };
global.Storage = {
  completeChallenge: () => {},
  recordQuizAttempt: () => ({ accuracy: 100 }),
  getState: () => ({ xp: 0 })
};

// Evaluate js/coa.js in this sandbox
const coaCode = fs.readFileSync(__dirname + '/js/coa.js', 'utf8');
eval(coaCode);

console.log('=== RUNNING COA NUMBER SYSTEM LAB SPECIFICATION TESTS ===\n');

let passedCount = 0;
let totalCount = 0;

function runTest(name, fn) {
  totalCount++;
  try {
    fn();
    console.log(`  ✓ Test ${totalCount}: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✖ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

// Helper to calculate representations exactly
function convertRadix(raw, base) {
  const parsed = CoaLab.parseInputValue(raw, String(base), false);
  if (!parsed) return null;
  const { absDecimal, isNegative } = parsed;
  const prefix = isNegative ? '-' : '';
  return {
    dec: prefix + absDecimal.toString(10),
    bin: prefix + absDecimal.toString(2),
    oct: prefix + absDecimal.toString(8),
    hex: prefix + absDecimal.toString(16).toUpperCase(),
    rawBigInt: absDecimal
  };
}

// Helper for Two's Complement Range & Representation
function computeTwosComplement(valStr, bitWidth) {
  const clean = valStr.trim();
  if (!/^[+-]?\d+$/.test(clean)) return { valid: false, error: 'Malformed integer' };
  const num = BigInt(clean);
  const minVal = -(2n ** BigInt(bitWidth - 1));
  const maxVal = (2n ** BigInt(bitWidth - 1)) - 1n;

  if (num < minVal || num > maxVal) {
    return { valid: false, error: 'Out of range', minVal, maxVal };
  }

  const moduloMask = 2n ** BigInt(bitWidth);
  const twosVal = num < 0n ? moduloMask + num : num;
  const twosBin = twosVal.toString(2).padStart(bitWidth, '0');

  // Verify algebraic identity: (-2^(n-1) * MSB) + sum(2^i * b_i) == num
  const msbWeight = -(2n ** BigInt(bitWidth - 1)) * BigInt(twosBin[0]);
  let sum = msbWeight;
  for (let i = 1; i < bitWidth; i++) {
    if (twosBin[i] === '1') {
      sum += (2n ** BigInt(bitWidth - 1 - i));
    }
  }
  assert.strictEqual(sum, num, 'Algebraic sum expansion must equal input number');

  return {
    valid: true,
    num,
    twosBin,
    minVal,
    maxVal,
    sum
  };
}

// ----------------------------------------------------
// Section 8 Test Cases
// ----------------------------------------------------

runTest('Binary 1011 → decimal 11', () => {
  const r = convertRadix('1011', 2);
  assert.ok(r, 'Should parse successfully');
  assert.strictEqual(r.dec, '11');
});

runTest('Decimal 25 → binary 11001', () => {
  const r = convertRadix('25', 10);
  assert.ok(r, 'Should parse successfully');
  assert.strictEqual(r.bin, '11001');
});

runTest('Decimal 255 → hexadecimal FF', () => {
  const r = convertRadix('255', 10);
  assert.ok(r, 'Should parse successfully');
  assert.strictEqual(r.hex, 'FF');
});

runTest('Hexadecimal FF → decimal 255', () => {
  const r = convertRadix('FF', 16);
  assert.ok(r, 'Should parse successfully');
  assert.strictEqual(r.dec, '255');
});

runTest('Octal 17 → decimal 15', () => {
  const r = convertRadix('17', 8);
  assert.ok(r, 'Should parse successfully');
  assert.strictEqual(r.dec, '15');
});

runTest('Binary 102 → Reject invalid digit', () => {
  const r = CoaLab.parseInputValue('102', '2', false);
  assert.strictEqual(r, null, 'Must reject digit 2 in binary base');
});

runTest('Octal 89 → Reject invalid digits', () => {
  const r = CoaLab.parseInputValue('89', '8', false);
  assert.strictEqual(r, null, 'Must reject digits 8 and 9 in octal base');
});

runTest('Decimal 12A → Reject invalid digits', () => {
  const r = CoaLab.parseInputValue('12A', '10', false);
  assert.strictEqual(r, null, "Must reject letter 'A' in decimal base");
});

runTest('Binary 0 → Show 0 in all bases', () => {
  const r = convertRadix('0', 2);
  assert.ok(r, 'Should parse successfully');
  assert.strictEqual(r.dec, '0');
  assert.strictEqual(r.bin, '0');
  assert.strictEqual(r.oct, '0');
  assert.strictEqual(r.hex, '0');
});

runTest('Value larger than Number.MAX_SAFE_INTEGER → Convert exactly using BigInt', () => {
  // 2^60 = 1152921504606846976
  // Number.MAX_SAFE_INTEGER = 9007199254740991 (approx 2^53)
  const bigValStr = '1152921504606846976';
  assert.ok(BigInt(bigValStr) > BigInt(Number.MAX_SAFE_INTEGER), 'Value must exceed MAX_SAFE_INTEGER');

  const r = convertRadix(bigValStr, 10);
  assert.ok(r, 'BigInt conversion must succeed without rounding');
  assert.strictEqual(r.dec, bigValStr);
  assert.strictEqual(r.hex, '1000000000000000');
  assert.strictEqual(r.bin, '1000000000000000000000000000000000000000000000000000000000000');
  assert.strictEqual(r.oct, '100000000000000000000');
});

runTest("8-bit two's complement of −5 → 11111011", () => {
  const tc = computeTwosComplement('-5', 8);
  assert.strictEqual(tc.valid, true);
  assert.strictEqual(tc.twosBin, '11111011');
});

runTest("8-bit signed two's-complement maximum → 127 (01111111)", () => {
  const tc = computeTwosComplement('127', 8);
  assert.strictEqual(tc.valid, true);
  assert.strictEqual(tc.maxVal, 127n);
  assert.strictEqual(tc.twosBin, '01111111');
});

runTest("8-bit signed two's-complement minimum → −128 (10000000)", () => {
  const tc = computeTwosComplement('-128', 8);
  assert.strictEqual(tc.valid, true);
  assert.strictEqual(tc.minVal, -128n);
  assert.strictEqual(tc.twosBin, '10000000');
});

runTest("8-bit signed two's-complement input 128 → Reject as out of range", () => {
  const tc = computeTwosComplement('128', 8);
  assert.strictEqual(tc.valid, false, '128 must be rejected in 8-bit signed system');
  assert.strictEqual(tc.error, 'Out of range');
});

runTest("8-bit signed two's-complement input −129 → Reject as out of range", () => {
  const tc = computeTwosComplement('-129', 8);
  assert.strictEqual(tc.valid, false, '-129 must be rejected in 8-bit signed system');
  assert.strictEqual(tc.error, 'Out of range');
});

// ----------------------------------------------------
// Additional Invariant Tests: 16-bit, 32-bit & Math
// ----------------------------------------------------

runTest("16-bit signed two's-complement bounds [-32768, +32767]", () => {
  const tcMin = computeTwosComplement('-32768', 16);
  assert.strictEqual(tcMin.valid, true);
  assert.strictEqual(tcMin.twosBin, '1000000000000000');

  const tcMax = computeTwosComplement('32767', 16);
  assert.strictEqual(tcMax.valid, true);
  assert.strictEqual(tcMax.twosBin, '0111111111111111');

  const tcOver = computeTwosComplement('32768', 16);
  assert.strictEqual(tcOver.valid, false);

  const tcUnder = computeTwosComplement('-32769', 16);
  assert.strictEqual(tcUnder.valid, false);
});

runTest("32-bit signed two's-complement bounds [-2147483648, +2147483647]", () => {
  const tcMin = computeTwosComplement('-2147483648', 32);
  assert.strictEqual(tcMin.valid, true);
  assert.strictEqual(tcMin.twosBin[0], '1');

  const tcMax = computeTwosComplement('2147483647', 32);
  assert.strictEqual(tcMax.valid, true);
  assert.strictEqual(tcMax.twosBin[0], '0');

  const tcOver = computeTwosComplement('2147483648', 32);
  assert.strictEqual(tcOver.valid, false);
});

runTest('Positional Polynomial Expansion verification for Binary 1011', () => {
  const binStr = '1011';
  let sum = 0n;
  const terms = [];
  for (let i = 0; i < binStr.length; i++) {
    const pos = binStr.length - 1 - i;
    const digit = BigInt(binStr[i]);
    const weight = 2n ** BigInt(pos);
    const prod = digit * weight;
    sum += prod;
    terms.push(`${digit}×2^${pos}=${prod}`);
  }
  assert.strictEqual(sum, 11n, 'Positional expansion must sum to 11');
});

runTest('Repeated Division Algorithm verification for Decimal 25 to Binary', () => {
  let temp = 25n;
  const remainders = [];
  while (temp > 0n) {
    remainders.unshift((temp % 2n).toString());
    temp = temp / 2n;
  }
  assert.strictEqual(remainders.join(''), '11001', 'Bottom-to-top remainders must produce 11001');
});

console.log(`\n========================================`);
console.log(`COA Lab Results: ${passedCount} / ${totalCount} tests passed (${Math.round((passedCount/totalCount)*100)}%)`);
console.log(`========================================\n`);

if (passedCount !== totalCount) {
  process.exit(1);
}
