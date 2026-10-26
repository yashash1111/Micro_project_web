/**
 * ConceptLab — Computer Science Concepts Playground
 * Module 2: COA — Number System & Machine Representation Lab (js/coa.js)
 * Syllabus Connection: Module 1, Number Systems & Machine Data Representation.
 * 
 * Features:
 * 1. Base Converter:
 *    - Pure mathematical conversion across Binary (2), Octal (8), Decimal (10), Hexadecimal (16)
 *    - Strict defensive character & radix validation (no silent trims or parseInt leaks)
 *    - Infinite non-negative integer precision using JavaScript BigInt (> Number.MAX_SAFE_INTEGER)
 *    - Uppercase Hexadecimal representation
 *    - Swap-Base capability (swap source & destination bases + load converted value)
 *    - Copy-result buttons with animated feedback
 *    - 4-bit nibble grouping display with 8-4-2-1 positional weights and hex tags
 * 2. Step-by-Step Explanation:
 *    - Positional place-value polynomial weight expansion table: N = sum(d_i * b^i)
 *    - Repeated radix division breakdown (by 2, 8, 16) with bottom-to-top remainder explanation
 *    - Interactive step-by-step playback controls (Play, Pause, Prev, Next, Restart, Show All)
 * 3. Signed Numbers & Two's Complement:
 *    - 8-bit, 16-bit, and 32-bit register widths
 *    - Strict range validation: rejects values outside [-2^(n-1), 2^(n-1) - 1]
 *    - 4 representations compared: Unsigned, Sign-Magnitude, 1's Complement, 2's Complement
 *    - 4-step negative two's complement derivation (magnitude, invert, add 1, result)
 *    - Exact algebraic verification: (-2^(n-1)*b_(n-1)) + sum(2^i * b_i) = Value
 * 4. Number System Practice Arena:
 *    - Interactive questions covering conversions, ranges, invalid inputs, two's complement
 *    - Immediate feedback, retry mechanism, stats tracking (attempted, correct, accuracy, XP)
 *    - Genuine Storage XP and challenge integration without duplicates
 *    - Dynamic procedural challenge generator for unlimited practice
 * 
 * Zero external dependencies. 100% Pure Vanilla JavaScript.
 */

var CoaLab = (() => {
  'use strict';

  let dom = {};
  let debounceTimer = null;

  // Active Tab state: 'converter' | 'steps' | 'signed' | 'practice'
  let currentTab = 'converter';

  // Last successful conversion data
  let lastConversionData = null;

  // Step-by-step animation state
  let stepsAnimation = {
    mode: 'dec', // 'dec' (positional) | 'bin' | 'oct' | 'hex' (repeated division)
    currentStep: 0,
    totalSteps: 0,
    timer: null,
    isPlaying: false,
    speedMs: 750,
    rows: []
  };

  // Practice Arena state
  let practiceState = {
    currentIndex: 0,
    attempted: 0,
    correct: 0,
    answeredQuestions: new Set(),
    selectedOption: null
  };

  /* --- Practice Question Bank (Curated covering all 9 required topics) --- */
  const PRACTICE_QUESTIONS = [
    {
      id: 'coa-p-1',
      topic: 'Binary to Decimal',
      question: 'Convert the binary number 1011₂ to its equivalent decimal value:',
      type: 'input',
      placeholder: 'Enter decimal integer (e.g. 11)...',
      correctAnswer: '11',
      explanation: 'Positional weights: (1×2³) + (0×2²) + (1×2¹) + (1×2⁰) = 8 + 0 + 2 + 1 = 11.'
    },
    {
      id: 'coa-p-2',
      topic: 'Decimal to Binary',
      question: 'Convert decimal integer 25₁₀ to pure binary notation:',
      type: 'input',
      placeholder: 'Enter binary digits (e.g. 11001)...',
      correctAnswer: '11001',
      cleanSpaces: true,
      explanation: 'Repeated division by 2: 25÷2=12(rem 1), 12÷2=6(rem 0), 6÷2=3(rem 0), 3÷2=1(rem 1), 1÷2=0(rem 1). Reading remainders bottom to top gives 11001₂.'
    },
    {
      id: 'coa-p-3',
      topic: 'Decimal to Hexadecimal',
      question: 'Convert decimal integer 255₁₀ into Hexadecimal notation (Base 16):',
      type: 'input',
      placeholder: 'Enter hex characters (e.g. FF)...',
      correctAnswer: 'FF',
      caseInsensitive: true,
      explanation: '255 ÷ 16 = 15 remainder 15 (F). 15 ÷ 16 = 0 remainder 15 (F). Reading bottom to top gives FF₁₆.'
    },
    {
      id: 'coa-p-4',
      topic: 'Hexadecimal to Decimal',
      question: 'What is the decimal equivalent of Hexadecimal FF₁₆?',
      type: 'input',
      placeholder: 'Enter decimal integer...',
      correctAnswer: '255',
      explanation: 'FF₁₆ = (15 × 16¹) + (15 × 16⁰) = 240 + 15 = 255.'
    },
    {
      id: 'coa-p-5',
      topic: 'Octal to Decimal',
      question: 'Convert the octal value 17₈ to its decimal equivalent:',
      type: 'input',
      placeholder: 'Enter decimal integer...',
      correctAnswer: '15',
      explanation: '17₈ = (1 × 8¹) + (7 × 8⁰) = 8 + 7 = 15.'
    },
    {
      id: 'coa-p-6',
      topic: 'Binary to Hexadecimal',
      question: 'Convert 8-bit binary 11110000₂ directly to hexadecimal using 4-bit nibbles:',
      type: 'input',
      placeholder: 'Enter 2 hex characters (e.g. F0)...',
      correctAnswer: 'F0',
      caseInsensitive: true,
      explanation: 'Nibble 1: 1111₂ = 15 = F₁₆. Nibble 2: 0000₂ = 0 = 0₁₆. Combined: F0₁₆.'
    },
    {
      id: 'coa-p-7',
      topic: 'Hexadecimal to Binary',
      question: 'Convert hexadecimal 2A₁₆ into an 8-bit binary byte:',
      type: 'input',
      placeholder: 'Enter 8 binary digits (e.g. 00101010)...',
      correctAnswer: ['00101010', '101010'],
      cleanSpaces: true,
      explanation: 'Hex digit 2 = 0010₂; Hex digit A (10) = 1010₂. Combined: 00101010₂.'
    },
    {
      id: 'coa-p-8',
      topic: 'Invalid Radix Detection',
      question: 'Which of the following is an INVALID octal literal?',
      type: 'mcq',
      options: ['107', '280', '77', '12'],
      correctIndex: 1,
      explanation: "Octal (Base 8) allows only digits 0 through 7. The digit '8' in 280 is invalid."
    },
    {
      id: 'coa-p-9',
      topic: 'Unsigned Range Validation',
      question: 'What is the maximum unsigned decimal integer representable in an 8-bit hardware register?',
      type: 'mcq',
      options: ['127', '255', '256', '512'],
      correctIndex: 1,
      explanation: 'For an n-bit register, unsigned range is 0 to 2ⁿ - 1. For 8 bits: 2⁸ - 1 = 256 - 1 = 255.'
    },
    {
      id: 'coa-p-10',
      topic: "Two's Complement",
      question: "What is the 8-bit Two's Complement representation of decimal integer -5?",
      type: 'input',
      placeholder: 'Enter 8 bits (e.g. 11111011)...',
      correctAnswer: '11111011',
      cleanSpaces: true,
      explanation: '|+5| = 00000101. Inverting bits gives 11111010. Adding 1 yields 11111011₂. (-128 + 64 + 32 + 16 + 8 + 2 + 1 = -5).'
    },
    {
      id: 'coa-p-11',
      topic: 'Signed Range Maximum',
      question: "What is the maximum positive value representable in 8-bit signed Two's Complement?",
      type: 'mcq',
      options: ['+127', '+128', '+255', '+63'],
      correctIndex: 0,
      explanation: 'Signed two\'s complement range is [-2ⁿ⁻¹, 2ⁿ⁻¹ - 1]. For 8-bit: +2⁷ - 1 = +127 (binary 01111111).'
    },
    {
      id: 'coa-p-12',
      topic: 'Signed Range Minimum',
      question: "What is the minimum (most negative) value representable in 8-bit signed Two's Complement?",
      type: 'mcq',
      options: ['-127', '-128', '-256', '0'],
      correctIndex: 1,
      explanation: 'Signed two\'s complement range is [-2ⁿ⁻¹, 2ⁿ⁻¹ - 1]. For 8-bit: -2⁷ = -128 (binary 10000000).'
    },
    {
      id: 'coa-p-13',
      topic: 'Boundary Validation',
      question: "Can decimal integer +128 be represented in an 8-bit signed Two's Complement register?",
      type: 'mcq',
      options: [
        'Yes, because 8 bits hold up to 255 values.',
        'No, because the valid signed 8-bit range is [-128 to +127], causing hardware overflow.',
        'Yes, with sign bit set to 1.',
        'Only in one\'s complement.'
      ],
      correctIndex: 1,
      explanation: 'Because 0 consumes one of the non-negative patterns, the positive range terminates at +127. Input 128 exceeds capacity and triggers overflow.'
    }
  ];

  /* --- Initialization --- */
  function init() {
    dom = {
      container: document.getElementById('coa-lab-container'),
      // Tabs
      tabBtns: document.querySelectorAll('.coa-tab-btn'),
      tabPanes: document.querySelectorAll('.coa-tab-pane'),
      // Converter Elements
      baseSelect: document.getElementById('coa-base-select'),
      bitWidthSelect: document.getElementById('coa-bitwidth-select'),
      inputVal: document.getElementById('coa-value-input'),
      inputFeedback: document.getElementById('coa-input-feedback'),
      btnConvert: document.getElementById('coa-btn-convert'),
      btnSwap: document.getElementById('coa-btn-swap'),
      btnReset: document.getElementById('coa-btn-reset'),
      emptyState: document.getElementById('coa-empty-state'),
      resultsSection: document.getElementById('coa-results-section'),
      outDec: document.getElementById('coa-out-dec'),
      outBin: document.getElementById('coa-out-bin'),
      outOct: document.getElementById('coa-out-oct'),
      outHex: document.getElementById('coa-out-hex'),
      outSignMag: document.getElementById('coa-out-sign-mag') || document.getElementById('coa-out-signmag'),
      outOnesComp: document.getElementById('coa-out-ones-comp') || document.getElementById('coa-out-onescomp'),
      outTwosComp: document.getElementById('coa-out-twos-comp') || document.getElementById('coa-out-twoscomp'),
      bitCellsContainer: document.getElementById('coa-bit-cells'),
      nibbleGroupsContainer: document.getElementById('coa-nibble-groups'),
      // Presets
      presetDec10: document.getElementById('coa-preset-dec10'),
      presetBin1010: document.getElementById('coa-preset-bin1010'),
      presetHexFF: document.getElementById('coa-preset-hexff'),
      presetOct17: document.getElementById('coa-preset-oct17'),
      presetDec25: document.getElementById('coa-preset-dec25'),
      presetZero: document.getElementById('coa-preset-zero'),
      presetBigInt: document.getElementById('coa-preset-bigint'),
      presetNeg17: document.getElementById('coa-preset-neg17'),
      presetInvalidBin: document.getElementById('coa-preset-invalid-bin'),
      presetInvalidOct: document.getElementById('coa-preset-invalid-oct'),
      presetInvalidDec: document.getElementById('coa-preset-invalid-dec'),
      // Step-by-Step Explanation Elements
      stepModeDec: document.getElementById('coa-step-mode-dec'),
      stepModeBin: document.getElementById('coa-step-mode-bin'),
      stepModeOct: document.getElementById('coa-step-mode-oct'),
      stepModeHex: document.getElementById('coa-step-mode-hex'),
      stepsCounter: document.getElementById('coa-steps-counter'),
      btnStepsRestart: document.getElementById('coa-steps-restart'),
      btnStepsPrev: document.getElementById('coa-steps-prev'),
      btnStepsPlay: document.getElementById('coa-steps-play'),
      btnStepsNext: document.getElementById('coa-steps-next'),
      btnStepsShowAll: document.getElementById('coa-steps-showall'),
      placeValueContainer: document.getElementById('coa-placevalue-container'),
      placeValueWrapper: document.getElementById('coa-placevalue-wrapper'),
      stepsContent: document.getElementById('coa-steps-content'),
      stepsWrapper: document.getElementById('coa-steps-wrapper'),
      // Signed Numbers Tool
      twosWidth: document.getElementById('coa-twos-width'),
      twosInput: document.getElementById('coa-twos-input'),
      twosFeedback: document.getElementById('coa-twos-feedback'),
      btnTwosCalc: document.getElementById('coa-btn-twos-calc'),
      btnTwosReset: document.getElementById('coa-btn-twos-reset'),
      twosResults: document.getElementById('coa-twos-results'),
      // Practice Arena Elements
      practiceAttempted: document.getElementById('coa-practice-attempted'),
      practiceCorrect: document.getElementById('coa-practice-correct'),
      practiceAccuracy: document.getElementById('coa-practice-accuracy'),
      practiceXP: document.getElementById('coa-practice-xp'),
      practiceTopic: document.getElementById('coa-practice-topic'),
      practiceCounter: document.getElementById('coa-practice-counter'),
      practiceQuestion: document.getElementById('coa-practice-question'),
      practiceArea: document.getElementById('coa-practice-interactive-area'),
      practiceFeedback: document.getElementById('coa-practice-feedback'),
      btnPracticePrev: document.getElementById('coa-practice-btn-prev'),
      btnPracticeNext: document.getElementById('coa-practice-btn-next'),
      btnPracticeRandom: document.getElementById('coa-practice-btn-random')
    };

    if (!dom.container) return;

    bindTabs();
    bindConverterEvents();
    bindCopyButtons();
    bindSwapButtons();
    bindStepsControls();
    bindTwosComplementTool();
    bindPracticeArena();

    // Default load: Decimal 10
    loadPreset('10', '10', 8);

    // Default load in Signed tab: -5 in 8-bit
    deriveTwosComplement('-5', 8, false);

    // Render initial practice question
    renderPracticeQuestion();
  }

  /* --- Tab Navigation --- */
  function bindTabs() {
    dom.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });
  }

  function switchTab(tabName) {
    currentTab = tabName;
    dom.tabBtns.forEach(btn => {
      const match = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    dom.tabPanes.forEach(pane => {
      const paneTab = pane.id.replace('coa-tab-pane-', '');
      pane.classList.toggle('active', paneTab === tabName);
    });

    // If switching to Step-by-Step, ensure latest steps are refreshed
    if (tabName === 'steps' && lastConversionData) {
      renderExplanationViews(lastConversionData);
    }
  }

  /* --- Base Converter Event Handlers --- */
  function bindConverterEvents() {
    if (dom.baseSelect) dom.baseSelect.addEventListener('change', onBaseOrWidthChange);
    if (dom.bitWidthSelect) dom.bitWidthSelect.addEventListener('change', onBaseOrWidthChange);

    // Live conversion with 150ms debounce
    if (dom.inputVal) {
      dom.inputVal.addEventListener('input', () => {
        clearError();
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (dom.inputVal.value.trim() !== '') {
            handleConvert(false); // live conversion without notification spam
          }
        }, 150);
      });

      dom.inputVal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleConvert(true);
        }
      });
    }

    if (dom.btnConvert) dom.btnConvert.addEventListener('click', () => handleConvert(true));
    if (dom.btnReset) dom.btnReset.addEventListener('click', reset);
    if (dom.btnSwap) dom.btnSwap.addEventListener('click', handleSwapBaseClick);

    // Preset chips
    if (dom.presetDec10) dom.presetDec10.addEventListener('click', () => loadPreset('10', '10', 8));
    if (dom.presetBin1010) dom.presetBin1010.addEventListener('click', () => loadPreset('1010', '2', 8));
    if (dom.presetHexFF) dom.presetHexFF.addEventListener('click', () => loadPreset('FF', '16', 8));
    if (dom.presetOct17) dom.presetOct17.addEventListener('click', () => loadPreset('17', '8', 8));
    if (dom.presetDec25) dom.presetDec25.addEventListener('click', () => loadPreset('25', '10', 8));
    if (dom.presetZero) dom.presetZero.addEventListener('click', () => loadPreset('0', '2', 8));
    if (dom.presetBigInt) dom.presetBigInt.addEventListener('click', () => loadPreset('1152921504606846976', '10', 32)); // 2^60
    if (dom.presetNeg17) dom.presetNeg17.addEventListener('click', () => loadPreset('-17', '10', 8));
    if (dom.presetInvalidBin) dom.presetInvalidBin.addEventListener('click', () => loadPreset('102', '2', 8));
    if (dom.presetInvalidOct) dom.presetInvalidOct.addEventListener('click', () => loadPreset('89', '8', 8));
    if (dom.presetInvalidDec) dom.presetInvalidDec.addEventListener('click', () => loadPreset('12A', '10', 8));
  }

  function bindCopyButtons() {
    const copyBtns = dom.container.querySelectorAll('.btn-copy-card');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy-target');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        const textToCopy = targetEl.textContent.trim();

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            triggerCopySuccess(btn);
          }).catch(() => {
            fallbackCopy(textToCopy, btn);
          });
        } else {
          fallbackCopy(textToCopy, btn);
        }
      });
    });
  }

  function fallbackCopy(text, btn) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      triggerCopySuccess(btn);
    } catch (e) {
      console.warn('Clipboard copy fallback failed:', e);
    }
    document.body.removeChild(tempInput);
  }

  function triggerCopySuccess(btn) {
    const originalHtml = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Copied!</span>
    `;

    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalHtml;
    }, 1500);
  }

  /* --- Swap-Base Feature --- */
  function bindSwapButtons() {
    const swapBtns = dom.container.querySelectorAll('.btn-swap-card');
    swapBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetBase = btn.getAttribute('data-swap-base');
        if (targetBase) swapToTargetBase(targetBase);
      });
    });
  }

  function handleSwapBaseClick() {
    // If we have converted results, swap with the primary alternative base
    if (!lastConversionData) {
      // Toggle between Decimal (10) and Binary (2) if no conversion yet
      const current = dom.baseSelect.value;
      const next = current === '10' ? '2' : '10';
      dom.baseSelect.value = next;
      onBaseOrWidthChange();
      return;
    }

    const currentBase = String(lastConversionData.base);
    let targetBase = '2';
    if (currentBase === '2') targetBase = '10';
    else if (currentBase === '10') targetBase = '2';
    else if (currentBase === '16') targetBase = '10';
    else if (currentBase === '8') targetBase = '10';

    swapToTargetBase(targetBase);
  }

  function swapToTargetBase(targetBase) {
    if (!lastConversionData) {
      dom.baseSelect.value = targetBase;
      onBaseOrWidthChange();
      return;
    }

    // Get the converted output in the target base
    let convertedValue = '';
    if (targetBase === '10') convertedValue = lastConversionData.pureDec;
    else if (targetBase === '2') convertedValue = lastConversionData.pureBin;
    else if (targetBase === '8') convertedValue = lastConversionData.pureOct;
    else if (targetBase === '16') convertedValue = lastConversionData.pureHex;

    // Set targetBase as the new source base
    dom.baseSelect.value = targetBase;
    dom.inputVal.value = convertedValue;
    clearError();
    onBaseOrWidthChange();

    // Trigger conversion
    handleConvert(true);

    if (typeof App !== 'undefined' && App.showPopup) {
      const baseNames = { '2': 'Binary (Base 2)', '8': 'Octal (Base 8)', '10': 'Decimal (Base 10)', '16': 'Hexadecimal (Base 16)' };
      App.showPopup({
        type: 'info',
        title: 'Source Base Swapped ⇄',
        message: `Swapped source base to ${baseNames[targetBase] || targetBase} with value ${convertedValue}.`,
        duration: 2500
      });
    }
  }

  function onBaseOrWidthChange() {
    clearError();
    const base = dom.baseSelect.value;
    if (base === '10') {
      dom.inputVal.placeholder = 'e.g. 10, 25, 255, 0';
    } else if (base === '2') {
      dom.inputVal.placeholder = 'e.g. 1010, 11001, 0';
    } else if (base === '16') {
      dom.inputVal.placeholder = 'e.g. FF, 2A, 1A (uppercase or lowercase)';
    } else if (base === '8') {
      dom.inputVal.placeholder = 'e.g. 17, 31, 70';
    }

    if (dom.inputVal.value.trim() !== '') {
      handleConvert(false);
    }
  }

  function showError(msg, showToast = true) {
    if (!dom.inputFeedback) return;
    dom.inputFeedback.textContent = msg;
    dom.inputFeedback.classList.add('show');
    dom.inputVal.classList.add('is-invalid');

    if (showToast && typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'error',
        title: 'Input Validation Error! ⚠️',
        message: msg
      });
    }
  }

  function clearError() {
    if (!dom.inputFeedback) return;
    dom.inputFeedback.textContent = '';
    dom.inputFeedback.classList.remove('show');
    if (dom.inputVal) dom.inputVal.classList.remove('is-invalid');
  }

  function loadPreset(val, base, bitWidth) {
    dom.baseSelect.value = base;
    if (dom.bitWidthSelect) dom.bitWidthSelect.value = String(bitWidth);
    dom.inputVal.value = String(val);
    clearError();
    onBaseOrWidthChange();
    handleConvert(true);
  }

  /**
   * Strict Defensive Input Validation
   * Validates characters, digits, prefixes according to selected radix.
   * Rejects malformed input, invalid digits, empty strings, unsupported negative signs.
   * Uses BigInt for infinite non-negative integer precision.
   */
  function parseInputValue(raw, base, showToast = true) {
    const clean = raw.trim();
    if (!clean) {
      showError('Please enter a number to convert.', showToast);
      return null;
    }

    let isNegative = false;
    let stripped = clean;

    if (stripped.startsWith('-')) {
      isNegative = true;
      stripped = stripped.substring(1).trim();
    } else if (stripped.startsWith('+')) {
      stripped = stripped.substring(1).trim();
    }

    if (!stripped) {
      showError('Number cannot consist only of a sign operator.', showToast);
      return null;
    }

    let decimalBigInt = 0n;

    if (base === '10') {
      // Decimal: strictly digits 0-9
      if (!/^\d+$/.test(stripped)) {
        showError("Invalid decimal digits! Decimal integers accept only digits '0' through '9'.", showToast);
        return null;
      }
      decimalBigInt = BigInt(stripped);
    } else if (base === '2') {
      // Binary: strictly digits 0 and 1
      const binClean = stripped.replace(/[\s_]+/g, '').replace(/^0b/i, '');
      if (!/^[01]+$/.test(binClean)) {
        showError("Invalid binary digits! Binary numbers accept only digits '0' and '1'.", showToast);
        return null;
      }
      decimalBigInt = BigInt('0b' + binClean);
      stripped = binClean;
    } else if (base === '8') {
      // Octal: strictly digits 0-7
      const octClean = stripped.replace(/[\s_]+/g, '').replace(/^0o/i, '');
      if (!/^[0-7]+$/.test(octClean)) {
        showError("Invalid octal digits! Octal numbers accept only digits '0' through '7'.", showToast);
        return null;
      }
      decimalBigInt = BigInt('0o' + octClean);
      stripped = octClean;
    } else if (base === '16') {
      // Hexadecimal: digits 0-9 and letters A-F / a-f
      const hexClean = stripped.replace(/[\s_]+/g, '').replace(/^0x/i, '');
      if (!/^[0-9a-fA-F]+$/.test(hexClean)) {
        showError("Invalid hexadecimal characters! Hexadecimal accepts only digits '0'-'9' and letters 'A'-'F' (or 'a'-'f').", showToast);
        return null;
      }
      decimalBigInt = BigInt('0x' + hexClean);
      stripped = hexClean.toUpperCase();
    }

    if (decimalBigInt === 0n) {
      isNegative = false;
    }

    const signedDecimal = isNegative ? -decimalBigInt : decimalBigInt;

    return {
      raw: clean,
      digitsOnly: stripped,
      base: parseInt(base, 10),
      isNegative,
      signedDecimal,
      absDecimal: decimalBigInt
    };
  }

  function handleConvert(showToast = true) {
    clearError();
    const base = dom.baseSelect.value;
    const parsed = parseInputValue(dom.inputVal.value, base, showToast);
    if (!parsed) return;

    performFullConversion(parsed, showToast);
  }

  /**
   * Real-Time Conversion & Place-Value Engine
   * Calculates all 4 representations simultaneously using BigInt.
   */
  function performFullConversion(data, showToast = true) {
    const { isNegative, signedDecimal, absDecimal, base, digitsOnly } = data;
    const bitWidth = dom.bitWidthSelect ? parseInt(dom.bitWidthSelect.value, 10) : 8;

    // 1. Compute 4 Pure Mathematical Radix Outputs using BigInt
    // Display zero as '0' in every base; Hex in UPPERCASE
    const prefix = isNegative ? '-' : '';
    const pureDec = prefix + absDecimal.toString(10);
    const pureBin = prefix + absDecimal.toString(2);
    const pureOct = prefix + absDecimal.toString(8);
    const pureHex = prefix + absDecimal.toString(16).toUpperCase();

    // 2. Hardware Register Representation (masked to selected bitWidth)
    const moduloMask = 2n ** BigInt(bitWidth);
    let unsignedHardwareVal = signedDecimal;
    if (signedDecimal < 0n) {
      unsignedHardwareVal = moduloMask + signedDecimal;
      if (unsignedHardwareVal < 0n) unsignedHardwareVal = (unsignedHardwareVal % moduloMask) + moduloMask;
    } else if (signedDecimal >= moduloMask) {
      unsignedHardwareVal = signedDecimal % moduloMask;
    }

    let regBinStr = unsignedHardwareVal.toString(2).padStart(bitWidth, '0');
    if (regBinStr.length > bitWidth) regBinStr = regBinStr.slice(-bitWidth);

    // Formatted 4-bit nibbles
    const nibbles = [];
    for (let i = 0; i < regBinStr.length; i += 4) {
      nibbles.push(regBinStr.slice(i, i + 4));
    }
    const formattedNibbles = nibbles.join(' ');

    // 1's Complement & Sign-Magnitude
    const invertedBits = regBinStr.split('').map(b => (b === '0' ? '1' : '0')).join('');
    const signBit = isNegative ? '1' : '0';
    const magBits = (absDecimal % (2n ** BigInt(bitWidth - 1))).toString(2).padStart(bitWidth - 1, '0');
    const signMagStr = `${signBit} [${magBits}]`;

    // Save state
    lastConversionData = {
      ...data,
      pureDec,
      pureBin,
      pureOct,
      pureHex,
      bitWidth,
      regBinStr,
      formattedNibbles
    };

    // 3. Display in UI
    if (dom.emptyState) dom.emptyState.style.display = 'none';
    if (dom.resultsSection) dom.resultsSection.style.display = 'block';

    if (dom.outDec) dom.outDec.textContent = pureDec;
    if (dom.outBin) dom.outBin.textContent = pureBin;
    if (dom.outOct) dom.outOct.textContent = pureOct;
    if (dom.outHex) dom.outHex.textContent = pureHex;

    if (dom.outSignMag) dom.outSignMag.textContent = signMagStr;
    if (dom.outOnesComp) dom.outOnesComp.textContent = invertedBits.match(/.{1,4}/g)?.join(' ') || invertedBits;
    if (dom.outTwosComp) dom.outTwosComp.textContent = `${formattedNibbles} (${bitWidth}-bit)`;

    // 4. Render Register Bit Matrix
    renderBitMatrix(regBinStr, bitWidth);

    // 5. Render 4-Bit Nibble Grouping View
    renderNibbleGrouping(pureBin.replace('-', ''), regBinStr, bitWidth);

    // 6. Update Step-by-Step Explanation Views
    renderExplanationViews(lastConversionData);

    // 7. Pop-up Notification (for explicit conversion button clicks)
    if (showToast && typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Conversion Complete! ✓',
        message: `Successfully converted ${pureDec} (Decimal) to Binary (${pureBin}₂), Hex (${pureHex}₁₆), and Octal (${pureOct}₈).`,
        badges: [
          { label: 'Decimal', value: pureDec },
          { label: 'Binary', value: pureBin },
          { label: 'Hex', value: pureHex }
        ]
      });
    }

    // Record verified curriculum challenge completion & award XP
    if (typeof Storage !== 'undefined' && Storage.completeChallenge) {
      Storage.completeChallenge('coa_radix_conversion', 'coa', 'Radix Translation', {
        decimal: pureDec,
        binary: pureBin
      });
    }
  }

  function renderBitMatrix(binStr, bitWidth) {
    if (!dom.bitCellsContainer) return;
    dom.bitCellsContainer.innerHTML = '';
    const chars = binStr.split('');

    chars.forEach((bit, idx) => {
      const bitIndex = bitWidth - 1 - idx;
      const cell = document.createElement('div');
      cell.className = 'bit-cell-unit';

      const isSign = bitIndex === bitWidth - 1;
      const isOne = bit === '1';

      cell.innerHTML = `
        <div class="bit-cell-box ${isOne ? 'one' : ''} ${isSign ? 'is-sign' : ''}" title="Bit ${bitIndex} (${isSign ? 'Sign Bit' : 'Weight: 2^' + bitIndex})">
          ${bit}
        </div>
        <span class="bit-cell-idx">${bitIndex}</span>
      `;
      dom.bitCellsContainer.appendChild(cell);
    });
  }

  function renderNibbleGrouping(pureBinDigits, regBinStr, bitWidth) {
    if (!dom.nibbleGroupsContainer) return;
    dom.nibbleGroupsContainer.innerHTML = '';

    const binToGroup = regBinStr;
    const nibbleCount = Math.max(1, Math.ceil(binToGroup.length / 4));
    const padded = binToGroup.padStart(nibbleCount * 4, '0');

    for (let n = 0; n < nibbleCount; n++) {
      const nibbleBits = padded.slice(n * 4, (n + 1) * 4);
      const hexVal = parseInt(nibbleBits, 2).toString(16).toUpperCase();

      const block = document.createElement('div');
      block.className = 'nibble-block';

      let bitsHtml = '<div class="nibble-bits-row">';
      for (let b = 0; b < 4; b++) {
        const bit = nibbleBits[b];
        bitsHtml += `<div class="nibble-bit ${bit === '1' ? 'is-one' : ''}">${bit}</div>`;
      }
      bitsHtml += '</div>';

      const weightsHtml = `
        <div class="nibble-weights-row">
          <span class="nibble-weight-label">8</span>
          <span class="nibble-weight-label">4</span>
          <span class="nibble-weight-label">2</span>
          <span class="nibble-weight-label">1</span>
        </div>
      `;

      const hexHtml = `<div class="nibble-hex-tag">Hex: 0x${hexVal}</div>`;

      block.innerHTML = bitsHtml + weightsHtml + hexHtml;
      dom.nibbleGroupsContainer.appendChild(block);
    }
  }

  /* ==========================================================================
     TAB 2: STEP-BY-STEP EXPLANATION ENGINE
     ========================================================================== */

  function bindStepsControls() {
    // Mode selector pills
    const modePills = [dom.stepModeDec, dom.stepModeBin, dom.stepModeOct, dom.stepModeHex];
    modePills.forEach(pill => {
      if (pill) {
        pill.addEventListener('click', () => {
          modePills.forEach(p => p && p.classList.remove('active'));
          pill.classList.add('active');
          stepsAnimation.mode = pill.getAttribute('data-mode');
          if (lastConversionData) renderExplanationViews(lastConversionData);
        });
      }
    });

    if (dom.btnStepsRestart) dom.btnStepsRestart.addEventListener('click', restartStepsAnimation);
    if (dom.btnStepsPrev) dom.btnStepsPrev.addEventListener('click', prevStep);
    if (dom.btnStepsPlay) dom.btnStepsPlay.addEventListener('click', togglePlayPause);
    if (dom.btnStepsNext) dom.btnStepsNext.addEventListener('click', nextStep);
    if (dom.btnStepsShowAll) dom.btnStepsShowAll.addEventListener('click', showAllSteps);
  }

  function renderExplanationViews(data) {
    if (!data) return;

    if (stepsAnimation.mode === 'dec') {
      // Positional Weight Table
      if (dom.placeValueWrapper) dom.placeValueWrapper.style.display = 'block';
      if (dom.stepsWrapper) dom.stepsWrapper.style.display = 'none';
      renderPlaceValueTable(data);
    } else {
      // Repeated Division
      if (dom.placeValueWrapper) dom.placeValueWrapper.style.display = 'none';
      if (dom.stepsWrapper) dom.stepsWrapper.style.display = 'block';
      renderRepeatedDivision(data, stepsAnimation.mode);
    }
  }

  function renderPlaceValueTable(data) {
    if (!dom.placeValueContainer) return;
    const { base, digitsOnly, absDecimal, isNegative } = data;

    const len = digitsOnly.length;
    let sumTerms = [];
    const rowsData = [];

    for (let i = 0; i < len; i++) {
      const pos = len - 1 - i;
      const char = digitsOnly[i];
      let val = 0n;
      if (base === 16) {
        val = BigInt(parseInt(char, 16));
      } else {
        val = BigInt(char);
      }
      const weight = BigInt(base) ** BigInt(pos);
      const product = val * weight;
      sumTerms.push(product.toString());

      rowsData.push({
        char,
        pos,
        base,
        val,
        weight,
        product
      });
    }

    stepsAnimation.rows = rowsData;
    stepsAnimation.totalSteps = rowsData.length;
    stepsAnimation.currentStep = rowsData.length; // Show all by default

    let html = `
      <div style="margin-bottom: 0.85rem; font-size: 0.88rem; line-height: 1.6;">
        <strong>Positional Place-Value Polynomial Formula:</strong><br>
        <code>N = ∑ (dᵢ × bⁱ) = (dₖ₋₁ · bᵏ⁻¹) + (dₖ₋₂ · bᵏ⁻²) + ... + (d₀ · b⁰)</code>
      </div>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom: 0.75rem;">
        Positional digit weights expansion for Base <strong>${base}</strong> literal <code>${digitsOnly}</code>:
      </p>
      <div style="overflow-x: auto;">
        <table class="table-mini font-mono" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th>Digit (dᵢ)</th>
              <th>Position (i)</th>
              <th>Calculation (dᵢ × bⁱ)</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody id="coa-placevalue-tbody">
    `;

    rowsData.forEach((row, idx) => {
      html += `
        <tr id="coa-pv-row-${idx}" class="step-row-active">
          <td><strong>${row.char}</strong> ${row.base === 16 && row.val >= 10n ? `(=${row.val})` : ''}</td>
          <td>${row.pos}</td>
          <td>${row.val} × ${row.base}<sup>${row.pos}</sup> (${row.weight})</td>
          <td><strong>${row.product}</strong></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
      <div style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-subtle); font-family:var(--font-mono); font-size:0.92rem; color:var(--accent-coa);">
        Sum: ${sumTerms.join(' + ')} = <strong>${absDecimal.toString()}</strong>
        ${isNegative ? ` (With negative sign: <strong>-${absDecimal.toString()}</strong>)` : ''}
      </div>
    `;

    dom.placeValueContainer.innerHTML = html;
    updateStepCounter(stepsAnimation.totalSteps, stepsAnimation.totalSteps);
  }

  function renderRepeatedDivision(data, targetRadixMode) {
    if (!dom.stepsContent) return;
    const { absDecimal, isNegative, raw } = data;

    let targetBase = 2n;
    let targetName = 'Binary (Base 2)';
    let suffix = '₂';
    if (targetRadixMode === 'oct') {
      targetBase = 8n;
      targetName = 'Octal (Base 8)';
      suffix = '₈';
    } else if (targetRadixMode === 'hex') {
      targetBase = 16n;
      targetName = 'Hexadecimal (Base 16)';
      suffix = '₁₆';
    }

    if (absDecimal === 0n) {
      dom.stepsContent.innerHTML = `
        <p>Value <code>0</code> in any base equals <strong>0</strong>.</p>
      `;
      updateStepCounter(1, 1);
      return;
    }

    const hexDigits = '0123456789ABCDEF';
    const divisionSteps = [];
    let temp = absDecimal;
    const remainders = [];

    while (temp > 0n) {
      const quot = temp / targetBase;
      const remBig = temp % targetBase;
      const remNum = Number(remBig);
      const symbol = targetBase === 16n ? hexDigits[remNum] : remNum.toString();
      divisionSteps.push({
        dividend: temp.toString(),
        divisor: targetBase.toString(),
        quotient: quot.toString(),
        remainder: remNum.toString(),
        symbol
      });
      remainders.unshift(symbol);
      temp = quot;
    }

    stepsAnimation.rows = divisionSteps;
    stepsAnimation.totalSteps = divisionSteps.length;
    stepsAnimation.currentStep = divisionSteps.length;

    let html = `
      <div style="margin-bottom: 0.85rem; font-size:0.88rem;">
        Converting Decimal <strong>${absDecimal.toString()}</strong> to <strong>${targetName}</strong> via repeated division by <strong>${targetBase}</strong>:
      </div>
      <div style="overflow-x: auto;">
        <table class="table-mini font-mono" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th>Step</th>
              <th>Division</th>
              <th>Quotient</th>
              <th>Remainder</th>
              <th>Digit/Symbol</th>
            </tr>
          </thead>
          <tbody id="coa-division-tbody">
    `;

    divisionSteps.forEach((step, idx) => {
      html += `
        <tr id="coa-div-row-${idx}" class="step-row-active">
          <td>#${idx + 1}</td>
          <td>${step.dividend} ÷ ${step.divisor}</td>
          <td>${step.quotient}</td>
          <td><strong>${step.remainder}</strong></td>
          <td><strong style="color:var(--accent-coa);">${step.symbol}</strong></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
      <div class="remainder-read-callout">
        <div class="remainder-read-icon">↑</div>
        <div>
          <strong>Bottom-to-Top Reading Rule:</strong><br>
          Read the remainders from the last step (bottom) to the first step (top).
          The last remainder represents the Most Significant Digit (MSD), and the first remainder represents the Least Significant Digit (LSD).<br>
          Result: <code>${remainders.join('')}${suffix}</code>
        </div>
      </div>
    `;

    dom.stepsContent.innerHTML = html;
    updateStepCounter(stepsAnimation.totalSteps, stepsAnimation.totalSteps);
  }

  function updateStepCounter(current, total) {
    if (dom.stepsCounter) {
      dom.stepsCounter.textContent = `Step ${current} of ${total}`;
    }
  }

  function restartStepsAnimation() {
    pauseStepsAnimation();
    stepsAnimation.currentStep = 0;
    applyStepVisibility(0);
  }

  function prevStep() {
    pauseStepsAnimation();
    if (stepsAnimation.currentStep > 0) {
      stepsAnimation.currentStep--;
      applyStepVisibility(stepsAnimation.currentStep);
    }
  }

  function nextStep() {
    pauseStepsAnimation();
    if (stepsAnimation.currentStep < stepsAnimation.totalSteps) {
      stepsAnimation.currentStep++;
      applyStepVisibility(stepsAnimation.currentStep);
    }
  }

  function showAllSteps() {
    pauseStepsAnimation();
    stepsAnimation.currentStep = stepsAnimation.totalSteps;
    applyStepVisibility(stepsAnimation.totalSteps);
  }

  function togglePlayPause() {
    if (stepsAnimation.isPlaying) {
      pauseStepsAnimation();
    } else {
      playStepsAnimation();
    }
  }

  function playStepsAnimation() {
    if (stepsAnimation.currentStep >= stepsAnimation.totalSteps) {
      stepsAnimation.currentStep = 0;
      applyStepVisibility(0);
    }
    stepsAnimation.isPlaying = true;
    if (dom.btnStepsPlay) dom.btnStepsPlay.innerHTML = '⏸ Pause';

    stepsAnimation.timer = setInterval(() => {
      if (stepsAnimation.currentStep < stepsAnimation.totalSteps) {
        stepsAnimation.currentStep++;
        applyStepVisibility(stepsAnimation.currentStep);
      } else {
        pauseStepsAnimation();
      }
    }, stepsAnimation.speedMs);
  }

  function pauseStepsAnimation() {
    stepsAnimation.isPlaying = false;
    if (stepsAnimation.timer) clearInterval(stepsAnimation.timer);
    if (dom.btnStepsPlay) dom.btnStepsPlay.innerHTML = '▶ Play';
  }

  function applyStepVisibility(stepCount) {
    updateStepCounter(stepCount, stepsAnimation.totalSteps);

    // Apply to positional rows or division rows
    for (let i = 0; i < stepsAnimation.totalSteps; i++) {
      const pvRow = document.getElementById(`coa-pv-row-${i}`);
      const divRow = document.getElementById(`coa-div-row-${i}`);
      const isVisible = i < stepCount;
      const isCurrent = i === stepCount - 1;

      if (pvRow) {
        pvRow.style.display = isVisible ? '' : 'none';
        pvRow.classList.toggle('step-row-active', isCurrent);
      }
      if (divRow) {
        divRow.style.display = isVisible ? '' : 'none';
        divRow.classList.toggle('step-row-active', isCurrent);
      }
    }
  }

  /* ==========================================================================
     TAB 3: SIGNED NUMBERS & TWO'S COMPLEMENT ENGINE
     ========================================================================== */

  function bindTwosComplementTool() {
    if (!dom.btnTwosCalc) return;

    dom.btnTwosCalc.addEventListener('click', () => {
      const valStr = dom.twosInput.value.trim();
      const width = parseInt(dom.twosWidth.value, 10);
      deriveTwosComplement(valStr, width, true);
    });

    if (dom.btnTwosReset) {
      dom.btnTwosReset.addEventListener('click', () => {
        dom.twosInput.value = '';
        clearTwosError();
        if (dom.twosResults) dom.twosResults.style.display = 'none';
      });
    }

    if (dom.twosInput) {
      dom.twosInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const valStr = dom.twosInput.value.trim();
          const width = parseInt(dom.twosWidth.value, 10);
          deriveTwosComplement(valStr, width, true);
        }
      });
      dom.twosInput.addEventListener('input', clearTwosError);
    }

    if (dom.twosWidth) {
      dom.twosWidth.addEventListener('change', () => {
        clearTwosError();
        if (dom.twosInput.value.trim() !== '') {
          const valStr = dom.twosInput.value.trim();
          const width = parseInt(dom.twosWidth.value, 10);
          deriveTwosComplement(valStr, width, false);
        }
      });
    }

    // Preset buttons
    const presetBtns = dom.container.querySelectorAll('.btn-twos-preset');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        const width = parseInt(btn.getAttribute('data-width'), 10);
        dom.twosInput.value = val;
        dom.twosWidth.value = String(width);
        clearTwosError();
        deriveTwosComplement(val, width, true);
      });
    });
  }

  function showTwosError(msg, showToast = true) {
    if (!dom.twosFeedback) return;
    dom.twosFeedback.textContent = msg;
    dom.twosFeedback.classList.add('show');
    if (dom.twosInput) dom.twosInput.classList.add('is-invalid');
    if (dom.twosResults) dom.twosResults.style.display = 'none';

    if (showToast && typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'error',
        title: "Signed Range Out of Bounds! ⚠️",
        message: msg
      });
    }
  }

  function clearTwosError() {
    if (!dom.twosFeedback) return;
    dom.twosFeedback.textContent = '';
    dom.twosFeedback.classList.remove('show');
    if (dom.twosInput) dom.twosInput.classList.remove('is-invalid');
  }

  /**
   * Dedicated Two's-Complement Derivation with STRICT Range Validation
   * Valid range for n bits: [-2^(n-1), 2^(n-1) - 1].
   * Strictly rejects out-of-range values!
   * Shows Unsigned, Sign-Magnitude, One's Complement, and Two's Complement.
   */
  function deriveTwosComplement(valStr, bitWidth, showToast = true) {
    clearTwosError();
    if (!valStr || valStr.trim() === '') {
      showTwosError('Please enter a signed integer.', showToast);
      return;
    }

    const clean = valStr.trim();
    if (!/^[+-]?\d+$/.test(clean)) {
      showTwosError('Invalid input! Please enter a valid signed decimal integer (e.g. -5, -128, +127).', showToast);
      return;
    }

    const num = BigInt(clean);
    const minVal = -(2n ** BigInt(bitWidth - 1));
    const maxVal = (2n ** BigInt(bitWidth - 1)) - 1n;
    const unsignedMax = (2n ** BigInt(bitWidth)) - 1n;
    const signMagMax = maxVal;
    const signMagMin = -maxVal;

    // STRICT RANGE ENFORCEMENT: reject if outside [minVal, maxVal]
    if (num < minVal || num > maxVal) {
      const err = `Out of range! For an ${bitWidth}-bit signed system, the valid two's complement range is [${minVal.toString()} to +${maxVal.toString()}]. Value ${num.toString()} cannot be represented and is rejected.`;
      showTwosError(err, showToast);
      return;
    }

    if (!dom.twosResults) return;
    dom.twosResults.style.display = 'block';

    const absVal = num < 0n ? -num : num;
    const isNeg = num < 0n;

    // 1. Unsigned Representation
    let unsignedStr = 'N/A';
    let unsignedNote = 'Negative numbers cannot be represented as standard unsigned values.';
    if (num >= 0n && num <= unsignedMax) {
      unsignedStr = absVal.toString(2).padStart(bitWidth, '0');
      unsignedNote = `Valid unsigned magnitude in [0 .. ${unsignedMax.toString()}].`;
    }

    // 2. Signed Magnitude Representation
    let signMagStr = 'N/A';
    let signMagNote = `Exceeds Signed Magnitude range [${signMagMin.toString()} .. +${signMagMax.toString()}].`;
    if (num >= signMagMin && num <= signMagMax) {
      const sBit = isNeg ? '1' : '0';
      const mBits = absVal.toString(2).padStart(bitWidth - 1, '0');
      signMagStr = `${sBit} ${formatNibbles(mBits)}`;
      signMagNote = `Sign bit = ${sBit}, followed by ${bitWidth - 1} magnitude bits.`;
    }

    // 3. One's Complement Representation
    let onesCompStr = 'N/A';
    let onesCompNote = `Exceeds 1's Complement range [${signMagMin.toString()} .. +${signMagMax.toString()}].`;
    const absBin = absVal.toString(2).padStart(bitWidth, '0');
    if (num >= signMagMin && num <= signMagMax) {
      if (isNeg) {
        onesCompStr = formatNibbles(absBin.split('').map(b => (b === '0' ? '1' : '0')).join(''));
        onesCompNote = 'All bits inverted from positive magnitude (dual zeros +0/-0).';
      } else {
        onesCompStr = formatNibbles(absBin);
        onesCompNote = 'Identical to positive binary representation.';
      }
    }

    // 4. Two's Complement Representation
    const moduloMask = 2n ** BigInt(bitWidth);
    const twosVal = isNeg ? moduloMask + num : num;
    const twosBin = twosVal.toString(2).padStart(bitWidth, '0');
    const twosHex = '0x' + twosVal.toString(16).toUpperCase().padStart(Math.ceil(bitWidth / 4), '0');

    // Build Step-by-Step Derivation HTML
    let stepsHtml = '';
    if (!isNeg) {
      stepsHtml = `
        <div class="twos-step-card">
          <div class="twos-step-header">
            <span>Non-Negative Integer Rule (Value ≥ 0):</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">
            Non-negative numbers have MSB (sign bit) = <strong>0</strong>.
            Their Two's Complement encoding is identical to their positive binary representation padded to ${bitWidth} bits.
          </p>
          <div class="twos-step-math" style="margin-top:0.4rem; font-family:var(--font-mono); font-weight:700; color:var(--accent-coa);">
            +${num.toString()} → <code>${formatNibbles(twosBin)}</code> (${twosHex})
          </div>
        </div>
      `;
    } else {
      const invertedBin = absBin.split('').map(b => (b === '0' ? '1' : '0')).join('');
      stepsHtml = `
        <div class="twos-step-card">
          <div class="twos-step-header">
            <span>Step 1: Write Positive Magnitude |X| in ${bitWidth} Bits</span>
          </div>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin:0;">
            Magnitude |${num.toString()}| = ${absVal.toString()}:
          </p>
          <div class="twos-step-math" style="margin-top:0.3rem; font-family:var(--font-mono);">
            +${absVal.toString()} = <code>${formatNibbles(absBin)}</code>
          </div>
        </div>

        <div class="twos-step-card">
          <div class="twos-step-header">
            <span>Step 2: Bitwise Inversion (1's Complement)</span>
          </div>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin:0;">
            Invert all bits: change 0 to 1, and 1 to 0:
          </p>
          <div class="twos-step-math" style="margin-top:0.3rem; font-family:var(--font-mono);">
            ~(${absBin}) = <code>${formatNibbles(invertedBin)}</code>
          </div>
        </div>

        <div class="twos-step-card">
          <div class="twos-step-header">
            <span>Step 3: Add 1 to Least Significant Bit (LSB)</span>
          </div>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin:0;">
            Add binary 1 to the inverted bits:
          </p>
          <div class="twos-step-math" style="margin-top:0.3rem; font-family:var(--font-mono); font-weight:700; color:var(--accent-coa);">
            ${formatNibbles(invertedBin)} + 1 = <code>${formatNibbles(twosBin)}</code> (${twosHex})
          </div>
        </div>
      `;
    }

    // Algebraic Verification
    const verifySum = computeSignedWeightSum(twosBin, bitWidth);
    const msbTerm = -(2n ** BigInt(bitWidth - 1)) * BigInt(twosBin[0]);
    const posSum = computePositivePartSum(twosBin, bitWidth);

    let html = `
      <!-- Representation Comparison Grid -->
      <h4 style="margin-bottom:0.65rem; font-size:0.92rem;">Machine Representations for ${num.toString()} (${bitWidth}-bit Register):</h4>
      <div class="signed-card-grid">
        <div class="signed-rep-card">
          <span class="signed-rep-label">1. Unsigned Binary</span>
          <span class="signed-rep-val">${unsignedStr}</span>
          <span class="signed-rep-note">${unsignedNote}</span>
        </div>
        <div class="signed-rep-card">
          <span class="signed-rep-label">2. Signed Magnitude</span>
          <span class="signed-rep-val">${signMagStr}</span>
          <span class="signed-rep-note">${signMagNote}</span>
        </div>
        <div class="signed-rep-card">
          <span class="signed-rep-label">3. One's Complement</span>
          <span class="signed-rep-val">${onesCompStr}</span>
          <span class="signed-rep-note">${onesCompNote}</span>
        </div>
        <div class="signed-rep-card highlight">
          <span class="signed-rep-label" style="color:var(--accent-coa);">4. Two's Complement (ALU Standard)</span>
          <span class="signed-rep-val" style="color:#fbbf24;">${formatNibbles(twosBin)}</span>
          <span class="signed-rep-note">Hex: <strong>${twosHex}</strong> • Unique zero & unified adder arithmetic.</span>
        </div>
      </div>

      <!-- Step-by-Step Negative Derivation -->
      <h4 style="margin-top:1.25rem; margin-bottom:0.65rem; font-size:0.92rem;">Hardware Derivation Steps:</h4>
      ${stepsHtml}

      <!-- Algebraic Verification Card -->
      <div class="twos-verification-card" style="margin-top:1rem; padding:0.85rem 1rem; border-radius:var(--radius-sm); background:var(--bg-surface); border:1px solid rgba(16, 185, 129, 0.35);">
        <div style="font-weight:700; color:var(--status-success); font-size:0.88rem; margin-bottom:0.35rem;">
          ✓ Algebraic Verification: Signed Positional Weight Expansion
        </div>
        <div style="font-family:var(--font-mono); font-size:0.85rem; line-height:1.6; color:var(--text-primary);">
          Value = (-2<sup>${bitWidth-1}</sup> × b<sub>${bitWidth-1}</sub>) + ∑ (2ⁱ × bᵢ)<br>
          = (${msbTerm.toString()}) + ${posSum}<br>
          = <strong>${verifySum}</strong> (Strictly equals input <strong>${num.toString()}</strong>)
        </div>
      </div>

      <!-- Range Bounds Table -->
      <div style="margin-top:1.25rem;">
        <h4 style="font-size:0.88rem; margin-bottom:0.4rem; color:var(--text-secondary);">Summary of ${bitWidth}-Bit Representation Ranges:</h4>
        <div style="overflow-x:auto;">
          <table class="range-bounds-table font-mono">
            <thead>
              <tr>
                <th>Representation Type</th>
                <th>Formula</th>
                <th>Decimal Range</th>
                <th>Zero Representation(s)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Unsigned Binary</strong></td>
                <td>0 to 2ⁿ - 1</td>
                <td>[0 to +${unsignedMax.toString()}]</td>
                <td>Single zero (all 0s)</td>
              </tr>
              <tr>
                <td><strong>Signed Two's Complement</strong></td>
                <td>-2ⁿ⁻¹ to 2ⁿ⁻¹ - 1</td>
                <td>[${minVal.toString()} to +${maxVal.toString()}]</td>
                <td>Single zero (all 0s)</td>
              </tr>
              <tr>
                <td><strong>Signed Magnitude</strong></td>
                <td>-(2ⁿ⁻¹ - 1) to +(2ⁿ⁻¹ - 1)</td>
                <td>[${signMagMin.toString()} to +${signMagMax.toString()}]</td>
                <td>Dual zeros (+0 and -0)</td>
              </tr>
              <tr>
                <td><strong>One's Complement</strong></td>
                <td>-(2ⁿ⁻¹ - 1) to +(2ⁿ⁻¹ - 1)</td>
                <td>[${signMagMin.toString()} to +${signMagMax.toString()}]</td>
                <td>Dual zeros (+0 and -0)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    dom.twosResults.innerHTML = html;

    if (showToast && typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: "Two's Complement Calculated! ✓",
        message: `Successfully derived ${bitWidth}-bit Two's Complement for signed integer ${num.toString()}: ${formatNibbles(twosBin)}.`,
        badges: [
          { label: 'Register', value: `${bitWidth}-bit` },
          { label: 'Input', value: num.toString() },
          { label: 'Binary', value: formatNibbles(twosBin) }
        ]
      });
    }

    // Award XP
    if (typeof Storage !== 'undefined' && Storage.completeChallenge) {
      Storage.completeChallenge('coa_twos_complement_calc', 'coa', "Two's Complement Derivation", {
        val: num.toString(),
        bits: bitWidth
      });
    }
  }

  function formatNibbles(binStr) {
    const parts = [];
    for (let i = 0; i < binStr.length; i += 4) {
      parts.push(binStr.slice(i, i + 4));
    }
    return parts.join(' ');
  }

  function computeSignedWeightSum(binStr, bitWidth) {
    const msb = BigInt(binStr[0]);
    const msbWeight = -(2n ** BigInt(bitWidth - 1)) * msb;
    let sum = msbWeight;
    for (let i = 1; i < bitWidth; i++) {
      if (binStr[i] === '1') {
        const pos = bitWidth - 1 - i;
        sum += (2n ** BigInt(pos));
      }
    }
    return sum.toString();
  }

  function computePositivePartSum(binStr, bitWidth) {
    let terms = [];
    let sum = 0n;
    for (let i = 1; i < bitWidth; i++) {
      if (binStr[i] === '1') {
        const pos = bitWidth - 1 - i;
        const val = 2n ** BigInt(pos);
        sum += val;
        terms.push(val.toString());
      }
    }
    return terms.length > 0 ? `${terms.join(' + ')} (= +${sum.toString()})` : '0';
  }

  /* ==========================================================================
     TAB 4: NUMBER SYSTEM PRACTICE ARENA
     ========================================================================== */

  function bindPracticeArena() {
    if (dom.btnPracticePrev) {
      dom.btnPracticePrev.addEventListener('click', prevPracticeQuestion);
    }
    if (dom.btnPracticeNext) {
      dom.btnPracticeNext.addEventListener('click', nextPracticeQuestion);
    }
    if (dom.btnPracticeRandom) {
      dom.btnPracticeRandom.addEventListener('click', generateRandomPracticeChallenge);
    }
  }

  function renderPracticeQuestion() {
    if (!dom.practiceArea || !dom.practiceQuestion) return;

    const q = PRACTICE_QUESTIONS[practiceState.currentIndex];
    if (!q) return;

    if (dom.practiceTopic) dom.practiceTopic.textContent = q.topic;
    if (dom.practiceCounter) dom.practiceCounter.textContent = `Question ${practiceState.currentIndex + 1} of ${PRACTICE_QUESTIONS.length}`;
    if (dom.practiceQuestion) dom.practiceQuestion.textContent = q.question;
    if (dom.practiceFeedback) {
      dom.practiceFeedback.className = 'practice-feedback-banner';
      dom.practiceFeedback.style.display = 'none';
      dom.practiceFeedback.textContent = '';
    }

    practiceState.selectedOption = null;

    let html = '';
    if (q.type === 'mcq') {
      html += '<div class="practice-options-grid two-cols">';
      q.options.forEach((opt, idx) => {
        html += `
          <button class="practice-opt-btn" type="button" data-opt-idx="${idx}">
            <span style="font-weight:700; color:var(--accent-coa);">${String.fromCharCode(65 + idx)}.</span>
            <span>${opt}</span>
          </button>
        `;
      });
      html += '</div>';
      html += `
        <button id="coa-practice-submit-btn" class="btn btn-primary btn-sm" type="button">
          Submit Answer
        </button>
      `;
      dom.practiceArea.innerHTML = html;

      const optBtns = dom.practiceArea.querySelectorAll('.practice-opt-btn');
      optBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          optBtns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          practiceState.selectedOption = parseInt(btn.getAttribute('data-opt-idx'), 10);
        });
      });

      const submitBtn = document.getElementById('coa-practice-submit-btn');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => submitPracticeAnswer());
      }
    } else {
      // Input type
      html += `
        <div class="practice-input-row">
          <input id="coa-practice-text-input" class="input-control font-mono" type="text" placeholder="${q.placeholder || 'Enter answer...'}" autocomplete="off">
          <button id="coa-practice-submit-btn" class="btn btn-primary" type="button">
            Submit Answer
          </button>
        </div>
      `;
      dom.practiceArea.innerHTML = html;

      const input = document.getElementById('coa-practice-text-input');
      const submitBtn = document.getElementById('coa-practice-submit-btn');

      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitPracticeAnswer();
          }
        });
      }

      if (submitBtn) {
        submitBtn.addEventListener('click', () => submitPracticeAnswer());
      }
    }

    updatePracticeStatsDisplay();
  }

  function submitPracticeAnswer() {
    const q = PRACTICE_QUESTIONS[practiceState.currentIndex];
    if (!q || !dom.practiceFeedback) return;

    let isCorrect = false;
    let userAnswerText = '';

    if (q.type === 'mcq') {
      if (practiceState.selectedOption === null) {
        showPracticeFeedback(false, 'Please select one option before submitting.');
        return;
      }
      isCorrect = (practiceState.selectedOption === q.correctIndex);
      userAnswerText = q.options[practiceState.selectedOption];

      // Highlight options
      const optBtns = dom.practiceArea.querySelectorAll('.practice-opt-btn');
      optBtns.forEach((btn, idx) => {
        if (idx === q.correctIndex) btn.classList.add('correct');
        else if (idx === practiceState.selectedOption && !isCorrect) btn.classList.add('incorrect');
      });
    } else {
      const input = document.getElementById('coa-practice-text-input');
      if (!input || input.value.trim() === '') {
        showPracticeFeedback(false, 'Please enter an answer before submitting.');
        return;
      }
      let val = input.value.trim();
      if (q.cleanSpaces) val = val.replace(/\s+/g, '');
      if (q.caseInsensitive) val = val.toUpperCase();

      if (Array.isArray(q.correctAnswer)) {
        isCorrect = q.correctAnswer.some(ans => {
          let expected = ans;
          if (q.cleanSpaces) expected = expected.replace(/\s+/g, '');
          if (q.caseInsensitive) expected = expected.toUpperCase();
          return val === expected;
        });
      } else {
        let expected = q.correctAnswer;
        if (q.cleanSpaces) expected = expected.replace(/\s+/g, '');
        if (q.caseInsensitive) expected = expected.toUpperCase();
        isCorrect = (val === expected);
      }
      userAnswerText = val;
    }

    // Update real stats
    practiceState.attempted++;
    if (isCorrect) {
      practiceState.correct++;
      practiceState.answeredQuestions.add(q.id);

      showPracticeFeedback(true, `✓ Correct! ${q.explanation}`);

      // Award genuine challenge XP if first time correct
      if (typeof Storage !== 'undefined' && Storage.completeChallenge) {
        Storage.completeChallenge(`coa_practice_${q.id}`, 'coa', `Practice: ${q.topic}`, {
          questionId: q.id,
          topic: q.topic
        });
      }
    } else {
      showPracticeFeedback(false, `✖ Not quite. ${q.explanation} Click "Try Again" or retry.`);
    }

    updatePracticeStatsDisplay();
  }

  function showPracticeFeedback(isSuccess, message) {
    if (!dom.practiceFeedback) return;
    dom.practiceFeedback.className = `practice-feedback-banner show ${isSuccess ? 'success' : 'error'}`;
    dom.practiceFeedback.innerHTML = `
      <div style="font-weight:700; margin-bottom:0.25rem;">
        ${isSuccess ? '🎉 Excellent Job! Correct!' : '⚠️ Incorrect Answer'}
      </div>
      <div>${message}</div>
    `;
  }

  function updatePracticeStatsDisplay() {
    if (dom.practiceAttempted) dom.practiceAttempted.textContent = practiceState.attempted;
    if (dom.practiceCorrect) dom.practiceCorrect.textContent = practiceState.correct;
    if (dom.practiceAccuracy) {
      const rate = practiceState.attempted > 0 ? Math.round((practiceState.correct / practiceState.attempted) * 100) : 0;
      dom.practiceAccuracy.textContent = `${rate}%`;
    }
    if (dom.practiceXP) {
      dom.practiceXP.textContent = `${practiceState.correct * 20} XP`;
    }
  }

  function nextPracticeQuestion() {
    practiceState.currentIndex = (practiceState.currentIndex + 1) % PRACTICE_QUESTIONS.length;
    renderPracticeQuestion();
  }

  function prevPracticeQuestion() {
    practiceState.currentIndex = (practiceState.currentIndex - 1 + PRACTICE_QUESTIONS.length) % PRACTICE_QUESTIONS.length;
    renderPracticeQuestion();
  }

  function generateRandomPracticeChallenge() {
    // Generate a procedural dynamic question with real-time computed answer
    const dec = Math.floor(Math.random() * 240) + 10; // 10 to 250
    const bin = dec.toString(2);
    const hex = dec.toString(16).toUpperCase();
    const oct = dec.toString(8);

    const questionTypes = [
      {
        topic: 'Decimal to Binary (Dynamic)',
        question: `Convert decimal integer ${dec} into pure binary notation:`,
        type: 'input',
        correctAnswer: bin,
        cleanSpaces: true,
        explanation: `${dec} ÷ 2 repeatedly gives remainder bits: ${bin}₂.`
      },
      {
        topic: 'Binary to Decimal (Dynamic)',
        question: `Convert binary byte ${bin}₂ into decimal integer:`,
        type: 'input',
        correctAnswer: String(dec),
        explanation: `Sum of powers of 2 for ${bin}₂ equals decimal ${dec}.`
      },
      {
        topic: 'Decimal to Hexadecimal (Dynamic)',
        question: `Convert decimal integer ${dec} into Hexadecimal notation (Base 16):`,
        type: 'input',
        correctAnswer: hex,
        caseInsensitive: true,
        explanation: `${dec} ÷ 16 repeatedly gives remainder digits: 0x${hex}.`
      },
      {
        topic: "Two's Complement (Dynamic)",
        question: `In an 8-bit register, what is the Two's Complement representation of negative integer -${(dec % 120) + 1}?`,
        type: 'input',
        correctAnswer: (256 - ((dec % 120) + 1)).toString(2).padStart(8, '0'),
        cleanSpaces: true,
        explanation: `Invert magnitude and add 1 gives ${(256 - ((dec % 120) + 1)).toString(2).padStart(8, '0')}₂.`
      }
    ];

    const randomQ = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    randomQ.id = `dyn-coa-${Date.now()}`;

    // Add to bank & select it
    PRACTICE_QUESTIONS.push(randomQ);
    practiceState.currentIndex = PRACTICE_QUESTIONS.length - 1;
    renderPracticeQuestion();
  }

  /* --- Reset & Lifecycle --- */
  function reset() {
    if (dom.inputVal) dom.inputVal.value = '';
    clearError();
    if (dom.emptyState) dom.emptyState.style.display = 'flex';
    if (dom.resultsSection) dom.resultsSection.style.display = 'none';
    lastConversionData = null;
  }

  function onEnter() {
    // Called by router when navigating into COA
    if (dom.inputVal && dom.inputVal.value.trim() === '') {
      loadPreset('10', '10', 8);
    }
  }

  return {
    init,
    onEnter,
    reset,
    loadPreset,
    parseInputValue,
    deriveTwosComplement,
    handleConvert,
    swapToTargetBase,
    switchTab,
    nextPracticeQuestion,
    prevPracticeQuestion,
    submitPracticeAnswer
  };
})();
