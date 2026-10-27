/**
 * ConceptLab — Computer Science Concepts Playground
 * Module 1: DAA — Binary Search Visualizer (js/daa.js)
 * Syllabus Connection: Module 2, Binary Search fundamentals (Divide and Conquer).
 * 
 * Features:
 * - Iterative binary search with standard and left-boundary (first occurrence) modes
 * - Pointer visualization (Low, Mid, High), active range, and eliminated cells
 * - Interactive pseudocode panel with real-time active line highlighting
 * - Real empirical linear search comparison (comparisons count, wall-clock time, speedup)
 * - Multi-speed controls (0.25x to 4.0x), play/pause, step forward/backward, restart, random generator
 * - Strict input validation (safe integers, unsorted array rejection with educational error)
 * - Zero external dependencies. Pure Vanilla JavaScript.
 */

var DaaLab = (() => {
  'use strict';

  // Internal State
  let arrayData = [];
  let targetValue = null;
  let steps = [];
  let currentStepIndex = -1;
  let isPlaying = false;
  let animationTimer = null;
  let animationSpeed = 800; // ms per step
  let searchMode = 'standard'; // 'standard' | 'first'

  // Dual Real-Time Comparison State (Side-by-Side Linear vs Binary Search)
  let dualArrayData = [1, 3, 5, 7, 9];
  let dualTargetValue = 7;
  let dualLinearSteps = [];
  let dualBinarySteps = [];
  let dualMaxSteps = 0;
  let dualCurrentStepIndex = -1;
  let dualIsPlaying = false;
  let dualAnimationTimer = null;
  let dualAnimationSpeed = 800; // ms per step

  // Backward compatibility alias references for linear state
  let linearArrayData = dualArrayData;
  let linearTargetValue = dualTargetValue;
  let linearSteps = dualLinearSteps;
  let linearCurrentStepIndex = -1;
  let linearIsPlaying = false;
  let linearAnimationTimer = null;
  let linearAnimationSpeed = 800;

  // DOM Elements Cache
  let dom = {};

  function init() {
    dom = {
      container: document.getElementById('daa-lab-container'),
      arrayInput: document.getElementById('daa-array-input'),
      targetInput: document.getElementById('daa-target-input'),
      arrayFeedback: document.getElementById('daa-array-feedback'),
      targetFeedback: document.getElementById('daa-target-feedback'),
      btnSortHelper: document.getElementById('daa-btn-sort-helper'),
      btnRandom: document.getElementById('daa-btn-random'),
      btnLoadExample: document.getElementById('daa-btn-load-example'),
      searchModeSelect: document.getElementById('daa-search-mode'),
      speedSelect: document.getElementById('daa-speed-select'),
      btnStart: document.getElementById('daa-btn-start'),
      btnRestart: document.getElementById('daa-btn-restart'),
      btnPlay: document.getElementById('daa-btn-play'),
      btnStepBack: document.getElementById('daa-btn-prev'),
      btnStepForward: document.getElementById('daa-btn-next'),
      btnReset: document.getElementById('daa-btn-reset'),
      stepBadge: document.getElementById('daa-step-badge'),
      progressFraction: document.getElementById('daa-progress-fraction'),
      progressFill: document.getElementById('daa-step-progress-fill'),
      visualizerStage: document.getElementById('daa-visualizer-stage'),
      emptyState: document.getElementById('daa-empty-state'),
      arrayTrack: document.getElementById('daa-array-track'),
      telemetryLow: document.getElementById('daa-tel-low'),
      telemetryMid: document.getElementById('daa-tel-mid'),
      telemetryHigh: document.getElementById('daa-tel-high'),
      telemetryComparison: document.getElementById('daa-tel-comparison'),
      telemetryComparisonsCount: document.getElementById('daa-tel-comparisons-count'),
      telemetryStatus: document.getElementById('daa-tel-status'),
      telemetryComplexity: document.getElementById('daa-tel-complexity'),
      traceLogList: document.getElementById('daa-trace-list'),
      duplicateNotice: document.getElementById('daa-duplicate-notice'),
      // Linear Search Benchmark HUD
      linearComps: document.getElementById('daa-linear-comps'),
      linearTime: document.getElementById('daa-linear-time'),
      binaryComps: document.getElementById('daa-binary-comps'),
      binaryTime: document.getElementById('daa-binary-time'),
      speedupBadge: document.getElementById('daa-speedup-badge'),
      // Linear Search Visualizer Elements
      linearTargetInput: document.getElementById('daa-linear-target-input'),
      linearTargetFeedback: document.getElementById('daa-linear-target-feedback'),
      linearSpeedSelect: document.getElementById('daa-linear-speed-select'),
      linearBtnStart: document.getElementById('daa-linear-btn-start'),
      linearBtnSync: document.getElementById('daa-linear-btn-sync'),
      linearBtnRestart: document.getElementById('daa-linear-btn-restart'),
      linearBtnPlay: document.getElementById('daa-linear-btn-play'),
      linearBtnPrev: document.getElementById('daa-linear-btn-prev'),
      linearBtnNext: document.getElementById('daa-linear-btn-next'),
      linearBtnReset: document.getElementById('daa-linear-btn-reset'),
      linearStepBadge: document.getElementById('daa-linear-step-badge'),
      linearProgressFraction: document.getElementById('daa-linear-progress-fraction'),
      linearProgressFill: document.getElementById('daa-linear-progress-fill'),
      linearVisualizerStage: document.getElementById('daa-linear-visualizer-stage'),
      linearEmptyState: document.getElementById('daa-linear-empty-state'),
      linearArrayTrack: document.getElementById('daa-linear-array-track'),
      linearTelIndex: document.getElementById('daa-linear-tel-index'),
      linearTelVal: document.getElementById('daa-linear-tel-val'),
      linearTelComparison: document.getElementById('daa-linear-tel-comparison'),
      linearTelStatus: document.getElementById('daa-linear-tel-status'),
      linearTraceBadge: document.getElementById('daa-linear-trace-badge'),
      linearTraceList: document.getElementById('daa-linear-trace-list'),
      // Dual Real-Time Visualizer Elements
      dualArrayInput: document.getElementById('daa-dual-array-input'),
      dualArrayFeedback: document.getElementById('daa-dual-array-feedback'),
      dualBtnSortHelper: document.getElementById('daa-dual-btn-sort-helper'),
      dualBtnRandom: document.getElementById('daa-dual-btn-random'),
      dualBinaryTrack: document.getElementById('daa-dual-binary-array-track'),
      dualBinaryStatus: document.getElementById('daa-dual-binary-status'),
      dualBinaryTraceBadge: document.getElementById('daa-dual-binary-trace-badge'),
      dualBinaryTraceList: document.getElementById('daa-dual-binary-trace-list'),
      dualBinaryVisualizerStage: document.getElementById('daa-dual-binary-visualizer-stage'),
      // Pseudocode Panel
      pseudocodeAction: document.getElementById('daa-code-current-action'),
      // Presets
      btnPresetReport: document.getElementById('daa-btn-preset-report'),
      btnPreset1: document.getElementById('daa-btn-preset1'),
      btnPreset2: document.getElementById('daa-btn-preset2'),
      btnPreset3: document.getElementById('daa-btn-preset3'),
      btnPreset4: document.getElementById('daa-btn-preset4'),
      btnPreset5: document.getElementById('daa-btn-preset5'),
      btnPreset6: document.getElementById('daa-btn-preset6')
    };

    if (!dom.container) return;

    bindEvents();
    // Default load preset: Figure 3 canonical array [1, 3, 5, 7, 9], target 7
    loadPresetArray([1, 3, 5, 7, 9], 7);
    initDualComparison([1, 3, 5, 7, 9], 7, false);
  }

  function bindEvents() {
    // Presets
    if (dom.btnPresetReport) dom.btnPresetReport.addEventListener('click', () => {
      loadPresetArray([1, 3, 5, 7, 9], 7);
      handleSearchClick();
    });
    if (dom.btnPreset1) dom.btnPreset1.addEventListener('click', () => loadPresetArray([2, 4, 6, 8, 10], 8));
    if (dom.btnPreset2) dom.btnPreset2.addEventListener('click', () => loadPresetArray([2, 4, 6, 8, 10], 7));
    if (dom.btnPreset3) dom.btnPreset3.addEventListener('click', () => loadPresetArray([5], 5));
    if (dom.btnPreset4) dom.btnPreset4.addEventListener('click', () => loadPresetArray([10, 5, 2], 5));
    if (dom.btnPreset5) dom.btnPreset5.addEventListener('click', () => loadPresetArray([2, 4, 4, 4, 6, 8], 4));
    if (dom.btnPreset6) dom.btnPreset6.addEventListener('click', () => loadPresetArray([-12, -7, -3, 0, 4, 9, 15, 23], -7));

    // Figure 3 Report Benchmark Table Rows & Action Buttons
    const reportRows = document.querySelectorAll('.comparison-row');
    reportRows.forEach(row => {
      row.addEventListener('click', () => {
        const arrRaw = row.getAttribute('data-arr');
        const targetRaw = row.getAttribute('data-target');
        if (!arrRaw || targetRaw === null) return;
        const parsedArr = arrRaw.split(',').map(s => Number(s.trim()));
        const parsedTarget = Number(targetRaw);

        if (dom.dualArrayInput) dom.dualArrayInput.value = parsedArr.join(', ');
        if (dom.linearTargetInput) dom.linearTargetInput.value = parsedTarget;

        // Run solely in the Dual Visualizer without modifying or scrolling to top search playground
        initDualComparison(parsedArr, parsedTarget, true);
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      });
    });

    // Dual Presets Quick Chips
    const dualPresetPills = document.querySelectorAll('.dual-preset-pill');
    dualPresetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const arrRaw = pill.getAttribute('data-arr');
        const targetRaw = pill.getAttribute('data-target');
        if (!arrRaw || targetRaw === null) return;
        const parsedArr = arrRaw.split(',').map(s => Number(s.trim()));
        const parsedTarget = Number(targetRaw);

        if (dom.dualArrayInput) dom.dualArrayInput.value = parsedArr.join(', ');
        if (dom.linearTargetInput) dom.linearTargetInput.value = parsedTarget;

        initDualComparison(parsedArr, parsedTarget, true);
      });
    });

    // Dual Comparison Array & Target Events
    if (dom.dualBtnSortHelper) dom.dualBtnSortHelper.addEventListener('click', handleDualAutoSort);
    if (dom.dualBtnRandom) dom.dualBtnRandom.addEventListener('click', handleDualRandomArray);
    if (dom.dualArrayInput) {
      dom.dualArrayInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleDualSearchClick();
        }
      });
      dom.dualArrayInput.addEventListener('input', () => {
        clearError(dom.dualArrayFeedback);
        dom.dualArrayInput.classList.remove('is-invalid');
      });
    }

    // Dual Visualizer Events
    if (dom.linearBtnStart) dom.linearBtnStart.addEventListener('click', handleDualSearchClick);
    if (dom.linearBtnSync) dom.linearBtnSync.addEventListener('click', handleDualSync);
    if (dom.linearBtnRestart) dom.linearBtnRestart.addEventListener('click', handleDualRestart);
    if (dom.linearBtnPlay) dom.linearBtnPlay.addEventListener('click', toggleDualPlayPause);
    if (dom.linearBtnPrev) dom.linearBtnPrev.addEventListener('click', handleDualStepBack);
    if (dom.linearBtnNext) dom.linearBtnNext.addEventListener('click', handleDualStepForward);
    if (dom.linearBtnReset) dom.linearBtnReset.addEventListener('click', handleDualReset);
    if (dom.linearSpeedSelect) {
      dom.linearSpeedSelect.addEventListener('change', (e) => {
        dualAnimationSpeed = parseInt(e.target.value, 10) || 800;
        linearAnimationSpeed = dualAnimationSpeed;
      });
    }
    if (dom.linearTargetInput) {
      dom.linearTargetInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleDualSearchClick();
        }
      });
      dom.linearTargetInput.addEventListener('input', () => {
        clearError(dom.linearTargetFeedback);
        dom.linearTargetInput.classList.remove('is-invalid');
      });
      dom.linearTargetInput.addEventListener('wheel', (e) => {
        e.preventDefault();
      }, { passive: false });
    }

    // Input clears
    dom.arrayInput.addEventListener('input', () => {
      clearError(dom.arrayFeedback);
      dom.arrayInput.classList.remove('is-invalid');
    });

    dom.targetInput.addEventListener('input', () => {
      clearError(dom.targetFeedback);
      dom.targetInput.classList.remove('is-invalid');
    });

    // Disable mousewheel / trackpad scrolling from incrementing or decrementing target value
    dom.targetInput.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });

    // Speed selector
    if (dom.speedSelect) {
      dom.speedSelect.addEventListener('change', (e) => {
        animationSpeed = parseInt(e.target.value, 10) || 800;
      });
    }

    // Search Mode selector
    if (dom.searchModeSelect) {
      dom.searchModeSelect.addEventListener('change', (e) => {
        searchMode = e.target.value;
        updateDuplicateNotice();
        if (arrayData.length > 0 && targetValue !== null) {
          handleSearchClick();
        }
      });
    }

    // Helper buttons
    if (dom.btnSortHelper) dom.btnSortHelper.addEventListener('click', handleAutoSort);
    if (dom.btnRandom) dom.btnRandom.addEventListener('click', handleRandomArray);
    if (dom.btnLoadExample) dom.btnLoadExample.addEventListener('click', handleLoadExample);

    // Primary search and keyboard Enter
    dom.btnStart.addEventListener('click', handleSearchClick);
    dom.targetInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchClick();
      }
    });

    // Playback controls
    if (dom.btnRestart) dom.btnRestart.addEventListener('click', handleRestart);
    if (dom.btnPlay) dom.btnPlay.addEventListener('click', togglePlayPause);
    dom.btnStepForward.addEventListener('click', handleStepForward);
    dom.btnStepBack.addEventListener('click', handleStepBack);
    dom.btnReset.addEventListener('click', reset);
  }

  function showError(feedbackEl, message) {
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.classList.add('show');
  }

  function clearError(feedbackEl) {
    if (!feedbackEl) return;
    feedbackEl.textContent = '';
    feedbackEl.classList.remove('show');
  }

  function parseArray(inputStr) {
    if (!inputStr || !inputStr.trim()) return [];
    return inputStr
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '')
      .map(item => {
        const num = Number(item);
        return isNaN(num) ? NaN : num;
      });
  }

  function handleAutoSort() {
    const raw = dom.arrayInput.value;
    if (!raw || !raw.trim()) {
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Empty Array Input! ⚠️',
          message: 'Please enter comma-separated numbers before auto-sorting.'
        });
      }
      return;
    }

    const nums = parseArray(raw);
    if (nums.length === 0 || nums.some(n => isNaN(n) || !Number.isInteger(n))) {
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Invalid Elements Found! ⚠️',
          message: 'Cannot sort non-integer values. Please ensure all array items are valid integers.'
        });
      }
      return;
    }

    nums.sort((a, b) => a - b);
    dom.arrayInput.value = nums.join(', ');
    clearError(dom.arrayFeedback);
    dom.arrayInput.classList.remove('is-invalid');

    const target = dom.targetInput.value.trim() !== '' ? Number(dom.targetInput.value) : nums[Math.floor(nums.length / 2)];
    loadPresetArray(nums, target);

    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Auto-Sorted Ascending! ✓',
        message: `Successfully sorted ${nums.length} element(s) in ascending order for binary search.`,
        badges: [
          { label: 'Elements', value: nums.length },
          { label: 'Min', value: nums[0] },
          { label: 'Max', value: nums[nums.length - 1] }
        ]
      });
    }
  }

  function handleRandomArray() {
    pausePlayback();
    // Generate 8-12 unique integers in range -15 to 45
    const len = Math.floor(Math.random() * 5) + 8; // 8 to 12
    const set = new Set();
    while (set.size < len) {
      set.add(Math.floor(Math.random() * 60) - 15);
    }
    const arr = Array.from(set).sort((a, b) => a - b);

    // 65% chance pick existing target, 35% chance pick an absent target
    let target;
    if (Math.random() < 0.65) {
      target = arr[Math.floor(Math.random() * arr.length)];
    } else {
      target = Math.floor(Math.random() * 60) - 15;
      while (arr.includes(target)) {
        target += 1;
      }
    }

    dom.arrayInput.value = arr.join(', ');
    dom.targetInput.value = target;
    clearError(dom.arrayFeedback);
    clearError(dom.targetFeedback);
    dom.arrayInput.classList.remove('is-invalid');
    dom.targetInput.classList.remove('is-invalid');

    loadPresetArray(arr, target);

    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Random Dataset Generated! 🎲',
        message: `Created sorted vector of ${arr.length} integers. Target: ${target}.`,
        badges: [
          { label: 'Size (N)', value: arr.length },
          { label: 'Target', value: target },
          { label: 'Target Exists?', value: arr.includes(target) ? 'Yes' : 'No' }
        ]
      });
    }
  }

  function handleLoadExample() {
    loadPresetArray([2, 4, 6, 8, 10, 14, 18, 22], 14);
    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Standard Example Loaded! 📖',
        message: 'Loaded textbook array [2, 4, 6, 8, 10, 14, 18, 22] with target 14.'
      });
    }
  }

  function updateDuplicateNotice() {
    if (!dom.duplicateNotice) return;
    if (searchMode === 'first') {
      dom.duplicateNotice.innerHTML = `
        <div class="policy-card-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          <span>Left-Boundary (First Occurrence) Search Active</span>
        </div>
        <p>
          In <strong>First Occurrence Mode</strong>, when a matching midpoint is encountered (<code>A[mid] == Target</code>),
          the algorithm records the match index and continues searching the left subarray (<code>high = mid - 1</code>).
          This strictly guarantees returning the <strong>leftmost / first matching index</strong> in the array.
        </p>
      `;
    } else {
      dom.duplicateNotice.innerHTML = `
        <div class="policy-card-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>Standard Duplicate Handling Policy</span>
        </div>
        <p>
          In standard Binary Search, when identical numbers exist in the array (e.g. <code>[2, 4, 4, 4, 6]</code> with target <code>4</code>),
          the algorithm halts immediately upon encountering the first midpoint where <code>A[mid] == Target</code>. Standard Binary Search returns 
          <strong>any valid matching index</strong> rather than guaranteeing the leftmost occurrence.
        </p>
      `;
    }
  }

  function validateArrayInput() {
    const raw = dom.arrayInput.value;
    if (!raw || raw.trim() === '') {
      dom.arrayInput.classList.add('is-invalid');
      const msg = 'Array cannot be empty. Please enter comma-separated integers.';
      showError(dom.arrayFeedback, msg);
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Array Input Missing! ⚠️',
          message: msg
        });
      }
      return null;
    }

    const rawTokens = raw.split(',');
    if (rawTokens.some((t, idx) => t.trim() === '' && (idx < rawTokens.length - 1 || rawTokens.length === 1))) {
      dom.arrayInput.classList.add('is-invalid');
      const msg = 'Malformed input: empty item between commas (e.g. "2,,4").';
      showError(dom.arrayFeedback, msg);
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Malformed Array Syntax! ⚠️',
          message: msg
        });
      }
      return null;
    }

    const nums = parseArray(raw);
    if (nums.length === 0) {
      dom.arrayInput.classList.add('is-invalid');
      const msg = 'Please enter at least 1 valid integer element.';
      showError(dom.arrayFeedback, msg);
      return null;
    }

    if (nums.some(n => isNaN(n) || !Number.isInteger(n) || !Number.isSafeInteger(n))) {
      dom.arrayInput.classList.add('is-invalid');
      const msg = 'Malformed input: all elements must be safe valid integers (within -9007199254740991 to +9007199254740991).';
      showError(dom.arrayFeedback, msg);
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Invalid Number Range! ⚠️',
          message: msg
        });
      }
      return null;
    }

    if (nums.length > 25) {
      dom.arrayInput.classList.add('is-invalid');
      const msg = 'Array size exceeds maximum 25 items for visual clarity.';
      showError(dom.arrayFeedback, msg);
      return null;
    }

    // Check ascending order
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] < nums[i - 1]) {
        dom.arrayInput.classList.add('is-invalid');
        const descMsg = `Array is unsorted! Elements [${nums[i - 1]}, ${nums[i]}] violate ascending order. Binary Search requires a sorted array because it divides the search space based on whether the target is smaller or larger than the midpoint.`;
        showError(dom.arrayFeedback, descMsg);

        if (typeof App !== 'undefined' && App.showPopup) {
          App.showPopup({
            type: 'error',
            title: 'Search Rejected: Array Unsorted! ⚠️',
            message: `Elements [${nums[i - 1]}, ${nums[i]}] violate ascending order. Binary search requires sorted arrays to halve candidate search space. Click "Auto-Sort" to fix!`,
            badges: [
              { label: 'Rule', value: 'Ascending Order' },
              { label: 'Violation', value: `${nums[i - 1]} > ${nums[i]}` }
            ]
          });
        }
        return null;
      }
    }

    dom.arrayInput.classList.remove('is-invalid');
    clearError(dom.arrayFeedback);
    return nums;
  }

  function validateTargetInput() {
    const raw = dom.targetInput.value.trim();
    if (raw === '') {
      dom.targetInput.classList.add('is-invalid');
      const msg = 'Please specify an integer target to search for.';
      showError(dom.targetFeedback, msg);
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Target Required! ⚠️',
          message: msg
        });
      }
      return null;
    }

    const num = Number(raw);
    if (isNaN(num) || !Number.isInteger(num) || !Number.isSafeInteger(num)) {
      dom.targetInput.classList.add('is-invalid');
      const msg = 'Target must be a valid safe integer.';
      showError(dom.targetFeedback, msg);
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Invalid Target Value! ⚠️',
          message: msg
        });
      }
      return null;
    }

    dom.targetInput.classList.remove('is-invalid');
    clearError(dom.targetFeedback);
    return num;
  }

  function loadPresetArray(arr, target) {
    pausePlayback();
    dom.arrayInput.value = arr.join(', ');
    dom.targetInput.value = target !== undefined ? target : '';
    clearError(dom.arrayFeedback);
    clearError(dom.targetFeedback);
    dom.arrayInput.classList.remove('is-invalid');
    dom.targetInput.classList.remove('is-invalid');

    // Check if array is sorted
    let isSorted = true;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) {
        isSorted = false;
        break;
      }
    }

    if (!isSorted) {
      validateArrayInput();
      resetVisualDisplay();
      return;
    }

    arrayData = [...arr];
    targetValue = target;
    steps = [];
    currentStepIndex = -1;

    renderInitialArray(arrayData);
    updateDuplicateNotice();
    resetPseudocode();
    resetProgress();
    runLinearSearchBenchmark(arr, target);
    loadLinearPresetArray(arr, target);
  }

  function updateReportTableActiveRow(arr, target) {
    const rows = document.querySelectorAll('.comparison-row');
    if (!rows || rows.length === 0) return;
    if (!arr || arr.length === 0 || target === null || target === undefined) {
      rows.forEach(r => {
        r.classList.remove('active-comparison-row');
        r.removeAttribute('aria-current');
      });
      return;
    }

    const currentArrStr = arr.map(n => Number(n)).join(',');
    const currentTarget = Number(target);

    rows.forEach(row => {
      const rowArrStr = (row.getAttribute('data-arr') || '').split(',').map(s => Number(s.trim())).join(',');
      const rowTarget = Number(row.getAttribute('data-target'));

      if (rowArrStr === currentArrStr && rowTarget === currentTarget) {
        row.classList.add('active-comparison-row');
        row.setAttribute('aria-current', 'true');
      } else {
        row.classList.remove('active-comparison-row');
        row.removeAttribute('aria-current');
      }
    });
  }

  function resetVisualDisplay() {
    updateReportTableActiveRow([], null);
    handleLinearReset();
    dom.emptyState.style.display = 'flex';
    dom.arrayTrack.style.display = 'none';
    dom.arrayTrack.innerHTML = '';
    dom.telemetryLow.textContent = '-';
    dom.telemetryMid.textContent = '-';
    dom.telemetryHigh.textContent = '-';
    dom.telemetryComparison.innerHTML = 'None';
    dom.telemetryComparisonsCount.textContent = '0';
    dom.telemetryStatus.textContent = 'Ready';
    dom.telemetryComplexity.textContent = 'O(log n)';
    dom.traceLogList.innerHTML = `<li class="trace-log-item">Awaiting valid input...</li>`;
    if (dom.stepBadge) dom.stepBadge.textContent = 'Step: Ready';
    resetProgress();
    resetPseudocode();
    updatePlaybackControls();
  }

  function renderInitialArray(arr) {
    if (!arr || arr.length === 0) {
      resetVisualDisplay();
      return;
    }

    dom.emptyState.style.display = 'none';
    dom.arrayTrack.style.display = 'flex';
    dom.arrayTrack.innerHTML = '';

    arr.forEach((val, idx) => {
      const node = document.createElement('div');
      node.className = 'array-node';
      node.id = `daa-node-${idx}`;

      node.innerHTML = `
        <div class="array-box">${val}</div>
        <div class="array-index">[${idx}]</div>
      `;
      dom.arrayTrack.appendChild(node);
    });

    const maxWorstCase = Math.floor(Math.log2(arr.length)) + 1;
    dom.telemetryLow.textContent = '0';
    dom.telemetryMid.textContent = '-';
    dom.telemetryHigh.textContent = (arr.length - 1).toString();
    dom.telemetryComparison.innerHTML = '<span class="topic-tag">Awaiting Search</span>';
    dom.telemetryComparisonsCount.textContent = '0';
    dom.telemetryStatus.textContent = 'Ready';
    dom.telemetryComplexity.innerHTML = `O(log n) <span style="font-size:0.75rem; color:var(--text-muted);">(Max ${maxWorstCase} comparisons for N=${arr.length})</span>`;

    dom.traceLogList.innerHTML = `
      <li class="trace-log-item">
        Array loaded with ${arr.length} element(s). Target: ${targetValue !== null ? targetValue : 'None'}. Mode: <strong>${searchMode === 'first' ? 'First Occurrence' : 'Standard'}</strong>. Click <strong>"Search Target"</strong> or <strong>"Play"</strong>.
      </li>
    `;

    resetProgress();
    resetPseudocode();
    updatePlaybackControls();
  }

  /**
   * Real Binary Search Algorithm Engine
   * Generates step-by-step trace reflecting exact computation.
   * Supports standard binary search and leftmost (first occurrence) binary search.
   */
  function computeBinarySearchTrace(arr, target, mode = 'standard') {
    const trace = [];
    let low = 0;
    let high = arr.length - 1;
    let comparisonCount = 0;
    let stepNumber = 1;
    let firstFoundIndex = -1;

    while (low <= high) {
      comparisonCount++;
      const mid = Math.floor((low + high) / 2);
      const midVal = arr[mid];

      const stepRecord = {
        stepNum: stepNumber++,
        low,
        high,
        mid,
        midVal,
        target,
        comparisonCount,
        eliminatedIndices: [],
        found: false,
        exhausted: false,
        direction: '',
        directionText: '',
        comparisonExpression: '',
        message: '',
        codeLine: 4
      };

      for (let i = 0; i < arr.length; i++) {
        if (i < low || i > high) {
          stepRecord.eliminatedIndices.push(i);
        }
      }

      if (midVal === target) {
        if (mode === 'first') {
          firstFoundIndex = mid;
          // In leftmost mode, check if there's any identical value to the left
          if (mid > low && arr[mid - 1] === target) {
            stepRecord.found = false;
            stepRecord.direction = 'left';
            stepRecord.directionText = 'Match! Continuing Left ◀';
            stepRecord.comparisonExpression = `A[${mid}] (${midVal}) == Target (${target}) [Left-Search]`;
            stepRecord.message = `Step ${stepRecord.stepNum}: mid = ${mid} (A[${mid}] = ${midVal}). Matched target ${target}, but searching left to verify FIRST occurrence. Setting high = ${mid - 1}.`;
            stepRecord.codeLine = 5;
            trace.push(stepRecord);
            high = mid - 1;
          } else {
            // No identical element to the left — this is definitively the first occurrence
            stepRecord.found = true;
            stepRecord.direction = 'found';
            stepRecord.directionText = 'First Match Found! ★';
            stepRecord.comparisonExpression = `A[${mid}] (${midVal}) == Target (${target}) [Leftmost Verified]`;
            stepRecord.message = `Step ${stepRecord.stepNum}: mid = ${mid} (A[${mid}] = ${midVal}). Verified FIRST occurrence of target ${target} at index [${mid}]!`;
            stepRecord.codeLine = 5;
            trace.push(stepRecord);
            break;
          }
        } else {
          // Standard Binary Search halts immediately on match
          stepRecord.found = true;
          stepRecord.direction = 'found';
          stepRecord.directionText = 'Target Matched! ★';
          stepRecord.comparisonExpression = `A[${mid}] (${midVal}) == Target (${target})`;
          stepRecord.message = `Step ${stepRecord.stepNum}: mid = floor((${low} + ${high}) / 2) = ${mid}. Comparison: A[${mid}] = ${midVal} == Target (${target}). Match found at index [${mid}]!`;
          stepRecord.codeLine = 5;
          trace.push(stepRecord);
          break;
        }
      } else if (target < midVal) {
        stepRecord.direction = 'left';
        stepRecord.directionText = 'Move LEFT ◀';
        stepRecord.comparisonExpression = `Target (${target}) < A[${mid}] (${midVal})`;
        stepRecord.message = `Step ${stepRecord.stepNum}: mid = ${mid} (A[${mid}] = ${midVal}). Target ${target} < ${midVal}. Discarding right half [${mid}..${high}]. Moving LEFT: setting high = mid - 1 (${mid - 1}).`;
        stepRecord.codeLine = 6;
        trace.push(stepRecord);
        high = mid - 1;
      } else {
        stepRecord.direction = 'right';
        stepRecord.directionText = 'Move RIGHT ▶';
        stepRecord.comparisonExpression = `Target (${target}) > A[${mid}] (${midVal})`;
        stepRecord.message = `Step ${stepRecord.stepNum}: mid = ${mid} (A[${mid}] = ${midVal}). Target ${target} > ${midVal}. Discarding left half [${low}..${mid}]. Moving RIGHT: setting low = mid + 1 (${mid + 1}).`;
        stepRecord.codeLine = 7;
        trace.push(stepRecord);
        low = mid + 1;
      }
    }

    if (low > high) {
      if (mode === 'first' && firstFoundIndex !== -1) {
        // If left search ended with low > high, firstFoundIndex is confirmed leftmost
        trace.push({
          stepNum: stepNumber,
          low,
          high,
          mid: firstFoundIndex,
          midVal: arr[firstFoundIndex],
          target,
          comparisonCount,
          eliminatedIndices: arr.map((_, i) => i).filter(i => i !== firstFoundIndex),
          found: true,
          exhausted: false,
          direction: 'found',
          directionText: 'First Occurrence Confirmed ★',
          comparisonExpression: `A[${firstFoundIndex}] is leftmost match`,
          message: `Left Boundary Search Complete: First occurrence of target ${target} definitively confirmed at index [${firstFoundIndex}].`,
          codeLine: 5
        });
      } else {
        trace.push({
          stepNum: stepNumber,
          low,
          high,
          mid: -1,
          midVal: null,
          target,
          comparisonCount,
          eliminatedIndices: arr.map((_, i) => i),
          found: false,
          exhausted: true,
          direction: 'exhausted',
          directionText: 'Search Space Exhausted ✖',
          comparisonExpression: `Interval low (${low}) > high (${high})`,
          message: `Search Exhausted: low (${low}) > high (${high}). Target ${target} does not exist in array after ${comparisonCount} comparison(s).`,
          codeLine: 8
        });
      }
    }

    return trace;
  }

  /**
   * Empirical Linear Search vs Binary Search Benchmark
   * Calculates real comparisons and wall-clock execution time via performance.now().
   */
  function runLinearSearchBenchmark(arr, target) {
    if (!arr || arr.length === 0 || target === null || target === undefined) return;

    // 1. Measure Linear Search
    const t0 = performance.now();
    let linearComps = 0;
    let linearFound = false;
    for (let i = 0; i < arr.length; i++) {
      linearComps++;
      if (arr[i] === target) {
        linearFound = true;
        break;
      }
    }
    const t1 = performance.now();
    const linearDuration = (t1 - t0);

    // 2. Measure Binary Search
    const tb0 = performance.now();
    let binaryComps = 0;
    let bLow = 0;
    let bHigh = arr.length - 1;
    while (bLow <= bHigh) {
      binaryComps++;
      const bMid = Math.floor((bLow + bHigh) / 2);
      if (arr[bMid] === target) {
        break;
      } else if (target < arr[bMid]) {
        bHigh = bMid - 1;
      } else {
        bLow = bMid + 1;
      }
    }
    const tb1 = performance.now();
    const binaryDuration = (tb1 - tb0);

    // 3. Update Benchmark DOM
    if (dom.linearComps) dom.linearComps.textContent = `${linearComps} comparisons`;
    if (dom.linearTime) dom.linearTime.textContent = `${linearDuration.toFixed(4)} ms`;
    if (dom.binaryComps) dom.binaryComps.textContent = `${binaryComps} comparisons`;
    if (dom.binaryTime) dom.binaryTime.textContent = `${binaryDuration.toFixed(4)} ms`;

    // Speedup ratio
    const speedupFactor = (linearComps / Math.max(1, binaryComps)).toFixed(1);
    if (dom.speedupBadge) {
      dom.speedupBadge.textContent = `${speedupFactor}x Efficiency Ratio`;
    }

    // Synchronize Figure 3 canonical report table row highlight
    updateReportTableActiveRow(arr, target);
  }

  // =========================================================================
  // Dual Real-Time Comparison Engine (Linear Search vs Binary Search)
  // =========================================================================

  function computeLinearSearchTrace(arr, target) {
    const trace = [];
    let comps = 0;
    let found = false;

    for (let i = 0; i < arr.length; i++) {
      comps++;
      const val = arr[i];
      const match = (val === target);

      trace.push({
        stepNum: comps,
        index: i,
        val: val,
        target: target,
        comparisonCount: comps,
        found: match,
        exhausted: false,
        scannedIndices: Array.from({ length: i }, (_, k) => k),
        message: match
          ? `Step ${comps}: Inspect [${i}] (A[${i}] = ${val}). Match found! Linear search halts in ${comps} comparison(s).`
          : `Step ${comps}: Inspect [${i}] (A[${i}] = ${val}). ${val} ≠ ${target} → advance pointer to index [${i + 1}].`
      });

      if (match) {
        found = true;
        break;
      }
    }

    if (!found) {
      trace.push({
        stepNum: comps + 1,
        index: arr.length,
        val: null,
        target: target,
        comparisonCount: comps,
        found: false,
        exhausted: true,
        scannedIndices: arr.map((_, k) => k),
        message: `Step ${comps + 1}: Scanned all ${arr.length} elements from left to right. Target ${target} not found after ${comps} comparison(s).`
      });
    }

    return trace;
  }

  function computeDualBinarySearchTrace(arr, target) {
    const trace = [];
    let low = 0;
    let high = arr.length - 1;
    let comps = 0;
    let found = false;

    while (low <= high) {
      comps++;
      const mid = Math.floor((low + high) / 2);
      const midVal = arr[mid];

      const eliminatedIndices = [];
      for (let i = 0; i < arr.length; i++) {
        if (i < low || i > high) eliminatedIndices.push(i);
      }

      if (midVal === target) {
        trace.push({
          stepNum: comps,
          low,
          mid,
          high,
          midVal,
          target,
          comparisonCount: comps,
          found: true,
          exhausted: false,
          eliminatedIndices,
          message: `Step ${comps}: Mid=[${mid}] (${midVal}) == Target (${target}). Match found! Binary search halts in ${comps} comparison(s).`
        });
        found = true;
        break;
      } else if (target < midVal) {
        trace.push({
          stepNum: comps,
          low,
          mid,
          high,
          midVal,
          target,
          comparisonCount: comps,
          found: false,
          exhausted: false,
          eliminatedIndices,
          message: `Step ${comps}: Mid=[${mid}] (${midVal}). Target ${target} < ${midVal} → eliminate right subarray, search left [${low}..${mid - 1}].`
        });
        high = mid - 1;
      } else {
        trace.push({
          stepNum: comps,
          low,
          mid,
          high,
          midVal,
          target,
          comparisonCount: comps,
          found: false,
          exhausted: false,
          eliminatedIndices,
          message: `Step ${comps}: Mid=[${mid}] (${midVal}). Target ${target} > ${midVal} → eliminate left subarray, search right [${mid + 1}..${high}].`
        });
        low = mid + 1;
      }
    }

    if (!found) {
      const eliminatedIndices = arr.map((_, k) => k);
      trace.push({
        stepNum: comps + 1,
        low,
        mid: -1,
        high,
        midVal: null,
        target,
        comparisonCount: comps,
        found: false,
        exhausted: true,
        eliminatedIndices,
        message: `Step ${comps + 1}: low (${low}) > high (${high}). Search interval exhausted. Target ${target} absent after ${comps} comparison(s).`
      });
    }

    return trace;
  }

  function initDualComparison(arr, target, autoStep) {
    pauseDualPlayback();
    dualArrayData = [...arr];
    dualTargetValue = (target !== undefined && target !== null) ? Number(target) : 7;
    dualLinearSteps = computeLinearSearchTrace(dualArrayData, dualTargetValue);
    dualBinarySteps = computeDualBinarySearchTrace(dualArrayData, dualTargetValue);
    dualMaxSteps = Math.max(dualLinearSteps.length, dualBinarySteps.length);
    dualCurrentStepIndex = -1;

    // Sync aliases
    linearArrayData = dualArrayData;
    linearTargetValue = dualTargetValue;
    linearSteps = dualLinearSteps;

    // Synchronize Dual Dataset & Target Inputs
    if (dom.dualArrayInput) {
      dom.dualArrayInput.value = dualArrayData.join(', ');
      dom.dualArrayInput.classList.remove('is-invalid');
    }
    clearError(dom.dualArrayFeedback);

    if (dom.linearTargetInput) {
      dom.linearTargetInput.value = dualTargetValue;
      dom.linearTargetInput.classList.remove('is-invalid');
    }
    clearError(dom.linearTargetFeedback);

    // Update Presets & Table Row Highlight
    updateReportTableActiveRow(dualArrayData, dualTargetValue);
    updateDualPresetPills(dualArrayData, dualTargetValue);

    // Render Initial Tracks for both columns
    renderDualInitialTracks(dualArrayData);

    if (autoStep && dualMaxSteps > 0) {
      handleDualStepForward();
    }
  }

  function updateDualPresetPills(arr, target) {
    const pills = document.querySelectorAll('.dual-preset-pill');
    if (!pills || pills.length === 0) return;
    const currentArrStr = arr.map(Number).join(',');
    const currentTarget = Number(target);

    pills.forEach(pill => {
      const pillArrStr = (pill.getAttribute('data-arr') || '').split(',').map(s => Number(s.trim())).join(',');
      const pillTarget = Number(pill.getAttribute('data-target'));
      if (pillArrStr === currentArrStr && pillTarget === currentTarget) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function renderDualInitialTracks(arr) {
    // 1. Left: Linear Track
    if (dom.linearArrayTrack) {
      if (!arr || arr.length === 0) {
        if (dom.linearEmptyState) dom.linearEmptyState.style.display = 'flex';
        dom.linearArrayTrack.style.display = 'none';
        dom.linearArrayTrack.innerHTML = '';
      } else {
        if (dom.linearEmptyState) dom.linearEmptyState.style.display = 'none';
        dom.linearArrayTrack.style.display = 'flex';
        dom.linearArrayTrack.innerHTML = '';
        arr.forEach((val, idx) => {
          const node = document.createElement('div');
          node.className = 'array-node';
          node.id = `daa-linear-node-${idx}`;
          node.innerHTML = `
            <div class="array-box font-mono">${val}</div>
            <div class="array-index font-mono">[${idx}]</div>
          `;
          dom.linearArrayTrack.appendChild(node);
        });
      }
    }

    // 2. Right: Binary Track
    if (dom.dualBinaryTrack) {
      dom.dualBinaryTrack.innerHTML = '';
      if (arr && arr.length > 0) {
        arr.forEach((val, idx) => {
          const node = document.createElement('div');
          node.className = 'array-node';
          node.id = `daa-dual-binary-node-${idx}`;
          node.innerHTML = `
            <div class="array-box font-mono">${val}</div>
            <div class="array-index font-mono">[${idx}]</div>
          `;
          dom.dualBinaryTrack.appendChild(node);
        });
      }
    }

    // Telemetry Initial State
    if (dom.linearComps) dom.linearComps.textContent = '0';
    if (dom.binaryComps) dom.binaryComps.textContent = '0';
    if (dom.linearTelStatus) dom.linearTelStatus.textContent = 'Ready for execution';
    if (dom.dualBinaryStatus) dom.dualBinaryStatus.textContent = 'Ready for execution';

    if (dom.linearTraceBadge) dom.linearTraceBadge.textContent = '0 Comparisons';
    if (dom.dualBinaryTraceBadge) dom.dualBinaryTraceBadge.textContent = '0 Comparisons';

    if (dom.linearTraceList) {
      dom.linearTraceList.innerHTML = `<li class="trace-log-item">Array loaded (${arr.length} items). Target: ${dualTargetValue}. Click <strong>"Play Both"</strong> or <strong>"Next"</strong>.</li>`;
    }
    if (dom.dualBinaryTraceList) {
      dom.dualBinaryTraceList.innerHTML = `<li class="trace-log-item">Array loaded (${arr.length} items). Target: ${dualTargetValue}. Click <strong>"Play Both"</strong> or <strong>"Next"</strong>.</li>`;
    }

    if (dom.linearStepBadge) dom.linearStepBadge.textContent = 'Step: Ready';
    if (dom.linearProgressFraction) dom.linearProgressFraction.textContent = `0 / ${dualMaxSteps}`;
    if (dom.linearProgressFill) dom.linearProgressFill.style.width = '0%';
    if (dom.speedupBadge) dom.speedupBadge.textContent = 'Speedup: -';

    updateDualPlaybackControls();
  }

  function attachDualBinaryPointer(index, label, typeClass) {
    const node = document.getElementById(`daa-dual-binary-node-${index}`);
    if (!node) return;

    let badge = node.querySelector('.pointer-badge');
    if (badge) {
      badge.textContent += ` & ${label}`;
      badge.className = 'pointer-badge combined';
    } else {
      badge = document.createElement('div');
      badge.className = `pointer-badge ${typeClass}`;
      badge.textContent = label;
      node.appendChild(badge);
    }
  }

  function renderDualStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= dualMaxSteps) return;

    // Determine current steps for both algorithms
    const stepL = (stepIndex < dualLinearSteps.length)
      ? dualLinearSteps[stepIndex]
      : dualLinearSteps[dualLinearSteps.length - 1];

    const stepB = (stepIndex < dualBinarySteps.length)
      ? dualBinarySteps[stepIndex]
      : dualBinarySteps[dualBinarySteps.length - 1];

    // ==========================================
    // 1. Render Left Column (Linear Search)
    // ==========================================
    dualArrayData.forEach((_, idx) => {
      const node = document.getElementById(`daa-linear-node-${idx}`);
      if (node) {
        node.classList.remove('linear-active', 'linear-scanned', 'target-found');
        const oldPointers = node.querySelectorAll('.pointer-badge');
        oldPointers.forEach(p => p.remove());
      }
    });

    stepL.scannedIndices.forEach(idx => {
      const node = document.getElementById(`daa-linear-node-${idx}`);
      if (node) node.classList.add('linear-scanned');
    });

    if (stepL.index < dualArrayData.length) {
      const activeNode = document.getElementById(`daa-linear-node-${stepL.index}`);
      if (activeNode) {
        if (stepL.found) {
          activeNode.classList.add('target-found');
          const badge = document.createElement('div');
          badge.className = 'pointer-badge pointer-found-badge';
          badge.innerHTML = `<span class="pointer-arrow">▼</span> Found [${stepL.index}]`;
          activeNode.appendChild(badge);
        } else {
          activeNode.classList.add('linear-active');
          const badge = document.createElement('div');
          badge.className = 'pointer-badge linear-pointer';
          badge.innerHTML = `<span class="pointer-arrow">▼</span> i = ${stepL.index}`;
          activeNode.appendChild(badge);
        }
      }
    }

    if (dom.linearComps) dom.linearComps.textContent = stepL.comparisonCount;
    if (dom.linearTelStatus) {
      if (stepL.found) {
        dom.linearTelStatus.innerHTML = `<span style="color:var(--status-success); font-weight:700;">✓ Found at [${stepL.index}] (${stepL.comparisonCount} comps)</span>`;
      } else if (stepL.exhausted) {
        dom.linearTelStatus.innerHTML = `<span style="color:var(--status-error); font-weight:700;">✖ Target Absent (${stepL.comparisonCount} comps)</span>`;
      } else {
        dom.linearTelStatus.textContent = `Inspecting A[${stepL.index}] = ${stepL.val}`;
      }
    }

    if (dom.linearTraceList) {
      const li = document.createElement('li');
      li.className = `trace-log-item ${stepL.found ? 'trace-item-found' : (stepL.exhausted ? 'trace-item-exhausted' : 'trace-item-linear-step')}`;
      li.textContent = stepL.message;
      dom.linearTraceList.appendChild(li);
      li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (dom.linearTraceBadge) {
      dom.linearTraceBadge.textContent = `${stepL.comparisonCount} Comparison${stepL.comparisonCount === 1 ? '' : 's'}`;
    }

    // ==========================================
    // 2. Render Right Column (Binary Search)
    // ==========================================
    dualArrayData.forEach((_, idx) => {
      const node = document.getElementById(`daa-dual-binary-node-${idx}`);
      if (node) {
        node.className = 'array-node';
        const oldPointers = node.querySelectorAll('.pointer-badge');
        oldPointers.forEach(p => p.remove());
      }
    });

    stepB.eliminatedIndices.forEach(idx => {
      const node = document.getElementById(`daa-dual-binary-node-${idx}`);
      if (node) node.classList.add('eliminated');
    });

    if (!stepB.exhausted && stepB.low <= stepB.high) {
      for (let i = stepB.low; i <= stepB.high; i++) {
        const node = document.getElementById(`daa-dual-binary-node-${i}`);
        if (node) node.classList.add('active-range');
      }
    }

    if (!stepB.exhausted) {
      attachDualBinaryPointer(stepB.low, 'L', 'low');
      if (stepB.mid >= 0) {
        const midNode = document.getElementById(`daa-dual-binary-node-${stepB.mid}`);
        if (midNode) {
          if (stepB.found) {
            midNode.classList.add('target-found');
            const badge = document.createElement('div');
            badge.className = 'pointer-badge pointer-found-badge';
            badge.innerHTML = `<span class="pointer-arrow">▼</span> Found [${stepB.mid}]`;
            midNode.appendChild(badge);
          } else {
            midNode.classList.add('mid-candidate');
            attachDualBinaryPointer(stepB.mid, 'M', 'mid');
          }
        }
      }
      attachDualBinaryPointer(stepB.high, 'R', 'high');
    }

    if (dom.binaryComps) dom.binaryComps.textContent = stepB.comparisonCount;
    if (dom.dualBinaryStatus) {
      if (stepB.found) {
        dom.dualBinaryStatus.innerHTML = `<span style="color:var(--status-success); font-weight:700;">✓ Found at [${stepB.mid}] (${stepB.comparisonCount} comps)</span>`;
      } else if (stepB.exhausted) {
        dom.dualBinaryStatus.innerHTML = `<span style="color:var(--status-error); font-weight:700;">✖ Target Absent (${stepB.comparisonCount} comps)</span>`;
      } else {
        dom.dualBinaryStatus.textContent = `Mid=[${stepB.mid}] (${stepB.midVal}) in [${stepB.low}..${stepB.high}]`;
      }
    }

    if (dom.dualBinaryTraceList) {
      const li = document.createElement('li');
      li.className = `trace-log-item ${stepB.found ? 'trace-item-found' : (stepB.exhausted ? 'trace-item-exhausted' : '')}`;
      li.textContent = stepB.message;
      dom.dualBinaryTraceList.appendChild(li);
      li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (dom.dualBinaryTraceBadge) {
      dom.dualBinaryTraceBadge.textContent = `${stepB.comparisonCount} Comparison${stepB.comparisonCount === 1 ? '' : 's'}`;
    }

    // ==========================================
    // 3. Telemetry, Progress & Speedup
    // ==========================================
    if (dom.linearStepBadge) {
      dom.linearStepBadge.textContent = `Step ${stepIndex + 1} of ${dualMaxSteps}`;
    }
    if (dom.linearProgressFraction) {
      dom.linearProgressFraction.textContent = `${stepIndex + 1} / ${dualMaxSteps}`;
    }
    if (dom.linearProgressFill) {
      const pct = Math.round(((stepIndex + 1) / dualMaxSteps) * 100);
      dom.linearProgressFill.style.width = `${pct}%`;
    }

    // Calculate Speedup ratio
    const lComps = stepL.comparisonCount;
    const bComps = Math.max(1, stepB.comparisonCount);
    const speedupFactor = (lComps / bComps).toFixed(1);
    if (dom.speedupBadge) {
      dom.speedupBadge.textContent = `Speedup: ${speedupFactor}x (${lComps} vs ${bComps} comps)`;
    }

    updateDualPlaybackControls();
  }

  function handleDualStepForward() {
    if (dualCurrentStepIndex < dualMaxSteps - 1) {
      dualCurrentStepIndex++;
      renderDualStep(dualCurrentStepIndex);
    } else {
      pauseDualPlayback();
    }
  }

  function handleDualStepBack() {
    pauseDualPlayback();
    if (dualCurrentStepIndex > 0) {
      dualCurrentStepIndex--;
      renderDualInitialTracks(dualArrayData);
      if (dom.linearTraceList) dom.linearTraceList.innerHTML = '';
      if (dom.dualBinaryTraceList) dom.dualBinaryTraceList.innerHTML = '';
      for (let i = 0; i <= dualCurrentStepIndex; i++) {
        renderDualStep(i);
      }
    }
  }

  function handleDualRestart() {
    pauseDualPlayback();
    if (dualArrayData.length === 0) return;
    dualCurrentStepIndex = -1;
    renderDualInitialTracks(dualArrayData);
    if (dom.linearTraceList) dom.linearTraceList.innerHTML = '';
    if (dom.dualBinaryTraceList) dom.dualBinaryTraceList.innerHTML = '';
    if (dualMaxSteps > 0) {
      handleDualStepForward();
    }
  }

  function handleDualReset() {
    pauseDualPlayback();
    dualCurrentStepIndex = -1;
    renderDualInitialTracks(dualArrayData);
    if (dom.linearTraceList) dom.linearTraceList.innerHTML = '';
    if (dom.dualBinaryTraceList) dom.dualBinaryTraceList.innerHTML = '';
  }

  function toggleDualPlayPause() {
    if (dualIsPlaying) {
      pauseDualPlayback();
    } else {
      startDualPlayback();
    }
  }

  function startDualPlayback() {
    if (dualCurrentStepIndex >= dualMaxSteps - 1) {
      dualCurrentStepIndex = -1;
      renderDualInitialTracks(dualArrayData);
      if (dom.linearTraceList) dom.linearTraceList.innerHTML = '';
      if (dom.dualBinaryTraceList) dom.dualBinaryTraceList.innerHTML = '';
    }

    dualIsPlaying = true;
    updateDualPlayButton();

    dualAnimationTimer = setInterval(() => {
      if (dualCurrentStepIndex < dualMaxSteps - 1) {
        handleDualStepForward();
      } else {
        pauseDualPlayback();
      }
    }, dualAnimationSpeed);
  }

  function pauseDualPlayback() {
    dualIsPlaying = false;
    if (dualAnimationTimer) {
      clearInterval(dualAnimationTimer);
      dualAnimationTimer = null;
    }
    updateDualPlayButton();
  }

  function updateDualPlayButton() {
    if (!dom.linearBtnPlay) return;
    if (dualIsPlaying) {
      dom.linearBtnPlay.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        <span>Pause</span>
      `;
      dom.linearBtnPlay.classList.add('playing');
    } else {
      dom.linearBtnPlay.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>Play Both</span>
      `;
      dom.linearBtnPlay.classList.remove('playing');
    }
  }

  function updateDualPlaybackControls() {
    const hasSteps = dualMaxSteps > 0;
    const isAtStart = dualCurrentStepIndex <= 0;
    const isAtEnd = dualCurrentStepIndex >= dualMaxSteps - 1;

    if (dom.linearBtnPrev) dom.linearBtnPrev.disabled = !hasSteps || isAtStart;
    if (dom.linearBtnNext) dom.linearBtnNext.disabled = !hasSteps || isAtEnd;
    if (dom.linearBtnRestart) dom.linearBtnRestart.disabled = !hasSteps;
  }

  function validateDualArrayInput() {
    if (!dom.dualArrayInput) return dualArrayData;
    const raw = dom.dualArrayInput.value;
    if (!raw || raw.trim() === '') {
      dom.dualArrayInput.classList.add('is-invalid');
      const msg = 'Array cannot be empty. Please enter comma-separated integers.';
      showError(dom.dualArrayFeedback, msg);
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Comparison Array Missing! ⚠️',
          message: msg
        });
      }
      return null;
    }

    const rawTokens = raw.split(',');
    if (rawTokens.some((t, idx) => t.trim() === '' && (idx < rawTokens.length - 1 || rawTokens.length === 1))) {
      dom.dualArrayInput.classList.add('is-invalid');
      const msg = 'Malformed input: empty item between commas (e.g. "2,,4").';
      showError(dom.dualArrayFeedback, msg);
      return null;
    }

    const nums = parseArray(raw);
    if (nums.length === 0) {
      dom.dualArrayInput.classList.add('is-invalid');
      showError(dom.dualArrayFeedback, 'Please enter at least 1 valid integer element.');
      return null;
    }

    if (nums.some(n => isNaN(n) || !Number.isInteger(n) || !Number.isSafeInteger(n))) {
      dom.dualArrayInput.classList.add('is-invalid');
      showError(dom.dualArrayFeedback, 'All elements must be safe valid integers.');
      return null;
    }

    if (nums.length > 25) {
      dom.dualArrayInput.classList.add('is-invalid');
      showError(dom.dualArrayFeedback, 'Array size exceeds maximum 25 items for visual clarity.');
      return null;
    }

    // Check ascending order
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] < nums[i - 1]) {
        dom.dualArrayInput.classList.add('is-invalid');
        const descMsg = `Array is unsorted! Elements [${nums[i - 1]}, ${nums[i]}] violate ascending order. Binary Search requires sorted elements. Click "Auto-Sort" to sort ascending!`;
        showError(dom.dualArrayFeedback, descMsg);

        if (typeof App !== 'undefined' && App.showPopup) {
          App.showPopup({
            type: 'error',
            title: 'Comparison Array Unsorted! ⚠️',
            message: `Elements [${nums[i - 1]}, ${nums[i]}] violate ascending order. Binary Search requires a sorted dataset to divide search space. Click "Auto-Sort" to fix.`,
            badges: [
              { label: 'Rule', value: 'Ascending Order' },
              { label: 'Violation', value: `${nums[i - 1]} > ${nums[i]}` }
            ]
          });
        }
        return null;
      }
    }

    dom.dualArrayInput.classList.remove('is-invalid');
    clearError(dom.dualArrayFeedback);
    return nums;
  }

  function validateDualTargetInput() {
    if (!dom.linearTargetInput) return dualTargetValue;
    const raw = dom.linearTargetInput.value.trim();
    if (raw === '') {
      dom.linearTargetInput.classList.add('is-invalid');
      const msg = 'Please specify an integer target to compare.';
      showError(dom.linearTargetFeedback, msg);
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Target Required! ⚠️',
          message: msg
        });
      }
      return null;
    }

    const num = Number(raw);
    if (isNaN(num) || !Number.isInteger(num) || !Number.isSafeInteger(num)) {
      dom.linearTargetInput.classList.add('is-invalid');
      const msg = 'Target must be a valid safe integer.';
      showError(dom.linearTargetFeedback, msg);
      return null;
    }

    dom.linearTargetInput.classList.remove('is-invalid');
    clearError(dom.linearTargetFeedback);
    return num;
  }

  function handleDualSearchClick() {
    pauseDualPlayback();

    const arr = validateDualArrayInput();
    const target = validateDualTargetInput();
    if (!arr || target === null) return;

    initDualComparison(arr, target, true);
  }

  function handleDualAutoSort() {
    if (!dom.dualArrayInput) return;
    const raw = dom.dualArrayInput.value;
    if (!raw || !raw.trim()) {
      showError(dom.dualArrayFeedback, 'Please enter comma-separated numbers before auto-sorting.');
      return;
    }

    const nums = parseArray(raw);
    if (nums.length === 0 || nums.some(n => isNaN(n) || !Number.isInteger(n))) {
      showError(dom.dualArrayFeedback, 'Cannot sort non-integer values.');
      return;
    }

    nums.sort((a, b) => a - b);
    dom.dualArrayInput.value = nums.join(', ');
    clearError(dom.dualArrayFeedback);
    dom.dualArrayInput.classList.remove('is-invalid');

    const target = (dom.linearTargetInput && dom.linearTargetInput.value.trim() !== '' && !isNaN(Number(dom.linearTargetInput.value)))
      ? Number(dom.linearTargetInput.value)
      : nums[Math.floor(nums.length / 2)];

    initDualComparison(nums, target, false);

    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Comparison Dataset Auto-Sorted! ✓',
        message: `Sorted ${nums.length} element(s) ascending for comparison.`
      });
    }
  }

  function handleDualRandomArray() {
    pauseDualPlayback();
    const len = Math.floor(Math.random() * 5) + 6; // 6 to 10
    const set = new Set();
    while (set.size < len) {
      set.add(Math.floor(Math.random() * 50) + 1);
    }
    const arr = Array.from(set).sort((a, b) => a - b);

    let target;
    if (Math.random() < 0.65) {
      target = arr[Math.floor(Math.random() * arr.length)];
    } else {
      target = Math.floor(Math.random() * 50) + 1;
      while (arr.includes(target)) {
        target += 1;
      }
    }

    if (dom.dualArrayInput) dom.dualArrayInput.value = arr.join(', ');
    if (dom.linearTargetInput) dom.linearTargetInput.value = target;

    initDualComparison(arr, target, true);

    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Random Dataset Generated! 🎲',
        message: `Generated comparison vector of ${arr.length} integers with target ${target}.`
      });
    }
  }

  function handleDualSync() {
    pauseDualPlayback();
    let arr = [1, 3, 5, 7, 9];
    if (arrayData && arrayData.length > 0) {
      arr = [...arrayData];
    }
    const target = (targetValue !== null && targetValue !== undefined) ? targetValue : (arr[0] || 7);

    if (dom.dualArrayInput) dom.dualArrayInput.value = arr.join(', ');
    if (dom.linearTargetInput) dom.linearTargetInput.value = target;

    initDualComparison(arr, target, true);

    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Dual Visualizer Synced! 🔄',
        message: `Dataset synchronized with active array [${arr.join(', ')}] and target ${target}.`
      });
    }
  }

  // Compatibility Wrappers for Legacy/Test References
  function loadLinearPresetArray(arr, target) {
    initDualComparison(arr, target, false);
  }

  function renderLinearStep(stepIndex) {
    renderDualStep(stepIndex);
  }

  function pauseLinearPlayback() {
    pauseDualPlayback();
  }

  function handleSearchClick() {
    pausePlayback();
    const arr = validateArrayInput();
    const target = validateTargetInput();
    if (!arr || target === null) return;

    arrayData = arr;
    targetValue = target;
    steps = computeBinarySearchTrace(arr, target, searchMode);
    currentStepIndex = -1;

    renderInitialArray(arr);
    runLinearSearchBenchmark(arr, target);

    // Step forward to step 0 immediately
    handleStepForward();
  }

  function handleRestart() {
    pausePlayback();
    if (arrayData.length === 0) return;
    currentStepIndex = -1;
    renderInitialArray(arrayData);
    resetPseudocode();
    resetProgress();
    updatePlaybackControls();
  }

  function togglePlayPause() {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  function startPlayback() {
    if (steps.length === 0) {
      const arr = validateArrayInput();
      const target = validateTargetInput();
      if (!arr || target === null) return;
      arrayData = arr;
      targetValue = target;
      steps = computeBinarySearchTrace(arr, target, searchMode);
      currentStepIndex = -1;
      renderInitialArray(arr);
    }

    if (currentStepIndex >= steps.length - 1) {
      currentStepIndex = -1;
      renderInitialArray(arrayData);
    }

    isPlaying = true;
    updatePlayButtonUI();
    runAnimationLoop();
  }

  function pausePlayback() {
    isPlaying = false;
    if (animationTimer) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }
    updatePlayButtonUI();
  }

  function updatePlayButtonUI() {
    if (!dom.btnPlay) return;
    if (isPlaying) {
      dom.btnPlay.classList.add('is-playing');
      dom.btnPlay.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        <span>Pause</span>
      `;
    } else {
      dom.btnPlay.classList.remove('is-playing');
      dom.btnPlay.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>Play</span>
      `;
    }
  }

  function runAnimationLoop() {
    if (!isPlaying) return;
    if (currentStepIndex < steps.length - 1) {
      handleStepForward();
      animationTimer = setTimeout(runAnimationLoop, animationSpeed);
    } else {
      pausePlayback();
    }
  }

  function handleStepForward() {
    if (steps.length === 0) {
      const arr = validateArrayInput();
      const target = validateTargetInput();
      if (!arr || target === null) return;
      arrayData = arr;
      targetValue = target;
      steps = computeBinarySearchTrace(arr, target, searchMode);
      currentStepIndex = -1;
      renderInitialArray(arr);
    }

    if (currentStepIndex < steps.length - 1) {
      currentStepIndex++;
      applyStepState(steps[currentStepIndex]);
    }

    updatePlaybackControls();
  }

  function handleStepBack() {
    pausePlayback();
    if (currentStepIndex > 0) {
      currentStepIndex--;
      applyStepState(steps[currentStepIndex]);
    } else if (currentStepIndex === 0) {
      currentStepIndex = -1;
      renderInitialArray(arrayData);
    }
    updatePlaybackControls();
  }

  function applyStepState(step) {
    if (!step) return;

    // Reset node styles
    const nodes = dom.arrayTrack.querySelectorAll('.array-node');
    nodes.forEach(node => {
      node.className = 'array-node';
      const existingBadge = node.querySelector('.pointer-badge');
      if (existingBadge) existingBadge.remove();
      const existingFound = node.querySelector('.found-celebration-badge');
      if (existingFound) existingFound.remove();
    });

    // Mark eliminated indices
    step.eliminatedIndices.forEach(idx => {
      const node = document.getElementById(`daa-node-${idx}`);
      if (node) node.classList.add('eliminated');
    });

    // Highlight active interval
    if (!step.exhausted && step.low <= step.high) {
      for (let i = step.low; i <= step.high; i++) {
        const node = document.getElementById(`daa-node-${i}`);
        if (node) node.classList.add('active-range');
      }
    }

    // Attach pointer badges
    if (!step.exhausted) {
      attachPointer(step.low, 'L', 'low');
      if (step.mid >= 0) {
        attachPointer(step.mid, 'M', 'mid');
        const midNode = document.getElementById(`daa-node-${step.mid}`);
        if (midNode) {
          if (step.found) {
            midNode.classList.add('target-found');
            const matchBadge = document.createElement('div');
            matchBadge.className = 'found-celebration-badge';
            matchBadge.innerHTML = '★ MATCH FOUND ★';
            midNode.appendChild(matchBadge);
          } else {
            midNode.classList.add('mid-candidate');
          }
        }
      }
      attachPointer(step.high, 'R', 'high');
    }

    // Update Telemetry Panel
    dom.telemetryLow.textContent = (typeof step.low === 'number' && !isNaN(step.low)) ? step.low.toString() : '-';
    dom.telemetryMid.textContent = (typeof step.mid === 'number' && step.mid >= 0) ? step.mid.toString() : 'None';
    dom.telemetryHigh.textContent = (typeof step.high === 'number' && !isNaN(step.high)) ? step.high.toString() : '-';
    
    // Direction & Comparison Indicator
    if (step.direction) {
      dom.telemetryComparison.innerHTML = `
        <span class="direction-indicator ${step.direction}">
          ${step.directionText}
        </span>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
          ${step.comparisonExpression}
        </div>
      `;
    } else {
      dom.telemetryComparison.textContent = '-';
    }

    dom.telemetryComparisonsCount.textContent = step.comparisonCount.toString();

    // Progress Bar & Step Badge
    updateProgressUI();

    // Active Pseudocode Highlighting
    highlightPseudocode(step.codeLine, step.directionText || `Step ${step.stepNum}`);

    // Final result status & Pop-up Notifications (Green = Success, Red = Not Success)
    if (step.found) {
      dom.telemetryStatus.innerHTML = `<span style="color:var(--status-success); font-weight:700;">Found at index [${step.mid}]</span>`;
      if (dom.stepBadge) {
        dom.stepBadge.innerHTML = `<span class="badge-tag-success">✓ Match at [${step.mid}]</span>`;
      }

      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'success',
          title: 'Target Found Successfully! 🎉',
          message: `Target ${step.target} was discovered at index [${step.mid}] (A[${step.mid}] = ${step.midVal}) after ${step.comparisonCount} comparison(s). Mode: ${searchMode === 'first' ? 'First Occurrence' : 'Standard'}.`,
          badges: [
            { label: 'Found Index', value: `[${step.mid}]` },
            { label: 'Total Comparisons', value: `${step.comparisonCount}` },
            { label: 'Complexity', value: 'O(log n)' }
          ],
          duration: 5000
        });
      }

      // Record verified curriculum challenge completion & award XP
      if (typeof Storage !== 'undefined' && Storage.completeChallenge) {
        Storage.completeChallenge('daa_binary_search_run', 'daa', 'Binary Search Execution', {
          target: step.target,
          comparisons: step.comparisonCount,
          foundIndex: step.mid
        });
      }
    } else if (step.exhausted) {
      dom.telemetryStatus.innerHTML = `<span style="color:var(--status-error); font-weight:700;">Target ${targetValue} Not Found</span>`;
      if (dom.stepBadge) {
        dom.stepBadge.innerHTML = `<span class="badge-tag-error">✖ Search Exhausted</span>`;
      }

      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'error',
          title: 'Target Not Found! ✖',
          message: `Target ${step.target} does not exist in the array. Binary search space exhausted with low (${step.low}) > high (${step.high}).`,
          badges: [
            { label: 'Status', value: 'Target Absent' },
            { label: 'Termination', value: `low (${step.low}) > high (${step.high})` },
            { label: 'Total Comparisons', value: `${step.comparisonCount}` }
          ],
          duration: 5000
        });
      }

      // Record verified curriculum challenge completion & award XP
      if (typeof Storage !== 'undefined' && Storage.completeChallenge) {
        Storage.completeChallenge('daa_binary_search_run', 'daa', 'Binary Search Execution', {
          target: step.target,
          comparisons: step.comparisonCount,
          found: false
        });
      }
    } else {
      dom.telemetryStatus.textContent = `Searching... (Step ${step.stepNum} of ${steps.length})`;
      if (dom.stepBadge) {
        dom.stepBadge.textContent = `Step ${step.stepNum} of ${steps.length}`;
      }
    }

    // Update Trace log view dynamically to reflect steps up to currentStepIndex
    updateTraceLogView(currentStepIndex);
  }

  function attachPointer(index, label, typeClass) {
    const node = document.getElementById(`daa-node-${index}`);
    if (!node) return;

    let badge = node.querySelector('.pointer-badge');
    if (badge) {
      badge.textContent += ` & ${label}`;
      badge.className = 'pointer-badge combined';
    } else {
      badge = document.createElement('div');
      badge.className = `pointer-badge ${typeClass}`;
      badge.textContent = label;
      node.appendChild(badge);
    }
  }

  function updateProgressUI() {
    if (steps.length === 0) {
      resetProgress();
      return;
    }
    const current = currentStepIndex + 1;
    const total = steps.length;
    if (dom.progressFraction) {
      dom.progressFraction.textContent = `${current} / ${total} steps`;
    }
    if (dom.progressFill) {
      const pct = Math.min(100, Math.round((current / total) * 100));
      dom.progressFill.style.width = `${pct}%`;
    }
  }

  function resetProgress() {
    if (dom.progressFraction) dom.progressFraction.textContent = `0 / ${steps.length || 0}`;
    if (dom.progressFill) dom.progressFill.style.width = '0%';
  }

  function highlightPseudocode(lineNum, actionText) {
    for (let i = 1; i <= 8; i++) {
      const lineEl = document.getElementById(`daa-code-line-${i}`);
      if (lineEl) {
        if (i === lineNum) {
          lineEl.classList.add('active');
        } else {
          lineEl.classList.remove('active');
        }
      }
    }

    if (dom.pseudocodeAction && actionText) {
      dom.pseudocodeAction.textContent = actionText;
    }
  }

  function resetPseudocode() {
    for (let i = 1; i <= 8; i++) {
      const lineEl = document.getElementById(`daa-code-line-${i}`);
      if (lineEl) lineEl.classList.remove('active');
    }
    if (dom.pseudocodeAction) {
      dom.pseudocodeAction.textContent = 'Awaiting execution...';
    }
  }

  function updateTraceLogView(currentIdx) {
    if (!dom.traceLogList) return;
    if (currentIdx < 0) {
      dom.traceLogList.innerHTML = `
        <li class="trace-log-item">
          Array initialized with ${arrayData.length} elements. Click "Search Target" or "Next Step".
        </li>
      `;
      return;
    }

    let html = '';
    for (let i = 0; i <= currentIdx; i++) {
      const step = steps[i];
      let cls = 'trace-log-item';
      if (i === currentIdx) {
        cls += step.found ? ' success' : ' current';
      }
      html += `<li class="${cls}"><strong>[Step ${step.stepNum}]</strong> ${step.message}</li>`;
    }
    dom.traceLogList.innerHTML = html;
    dom.traceLogList.scrollTop = dom.traceLogList.scrollHeight;
  }

  function updatePlaybackControls() {
    if (dom.btnStepBack) dom.btnStepBack.disabled = (currentStepIndex < 0);
    if (dom.btnStepForward) dom.btnStepForward.disabled = (steps.length > 0 && currentStepIndex >= steps.length - 1);
  }

  function reset() {
    pausePlayback();
    steps = [];
    currentStepIndex = -1;
    dom.arrayInput.value = '';
    dom.targetInput.value = '';
    arrayData = [];
    targetValue = null;
    clearError(dom.arrayFeedback);
    clearError(dom.targetFeedback);
    dom.arrayInput.classList.remove('is-invalid');
    dom.targetInput.classList.remove('is-invalid');
    resetVisualDisplay();

    if (dom.linearComps) dom.linearComps.textContent = '0';
    if (dom.linearTime) dom.linearTime.textContent = '0.000 ms';
    if (dom.binaryComps) dom.binaryComps.textContent = '0';
    if (dom.binaryTime) dom.binaryTime.textContent = '0.000 ms';
    if (dom.speedupBadge) dom.speedupBadge.textContent = 'Speedup: -';
  }

  function onEnter() {
    if (typeof Animations !== 'undefined') {
      Animations.registerCleanup('daa', () => {
        pausePlayback();
      });
    }
  }

  return {
    init,
    onEnter,
    reset,
    loadPresetArray,
    computeBinarySearchTrace,
    runLinearSearchBenchmark
  };
})();
