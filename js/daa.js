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

  // Linear Search Dedicated Real-Time State
  let linearArrayData = [1, 3, 5, 7, 9];
  let linearTargetValue = 7;
  let linearSteps = [];
  let linearCurrentStepIndex = -1;
  let linearIsPlaying = false;
  let linearAnimationTimer = null;
  let linearAnimationSpeed = 800; // ms per step

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
    loadLinearPresetArray([1, 3, 5, 7, 9], 7);
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

    // Figure 3 Report Benchmark Table Rows
    const reportRows = document.querySelectorAll('.comparison-row');
    reportRows.forEach(row => {
      row.addEventListener('click', (e) => {
        const arrRaw = row.getAttribute('data-arr');
        const targetRaw = row.getAttribute('data-target');
        if (!arrRaw || targetRaw === null) return;
        const parsedArr = arrRaw.split(',').map(s => Number(s.trim()));
        const parsedTarget = Number(targetRaw);

        loadPresetArray(parsedArr, parsedTarget);
        handleSearchClick();

        loadLinearPresetArray(parsedArr, parsedTarget);
        handleLinearSearchClick();

        if (dom.arrayTrack) {
          dom.arrayTrack.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        if (typeof App !== 'undefined' && App.showPopup) {
          App.showPopup({
            type: 'info',
            title: 'Figure 3 Benchmark Active! 📊',
            message: `Loaded test array [${parsedArr.join(', ')}] with target ${parsedTarget}. Trace and comparison live!`,
            badges: [
              { label: 'Array', value: `[${parsedArr.join(', ')}]` },
              { label: 'Target', value: parsedTarget }
            ]
          });
        }
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      });
    });

    // Linear Search Visualizer Events
    if (dom.linearBtnStart) dom.linearBtnStart.addEventListener('click', handleLinearSearchClick);
    if (dom.linearBtnSync) dom.linearBtnSync.addEventListener('click', handleLinearSync);
    if (dom.linearBtnRestart) dom.linearBtnRestart.addEventListener('click', handleLinearRestart);
    if (dom.linearBtnPlay) dom.linearBtnPlay.addEventListener('click', toggleLinearPlayPause);
    if (dom.linearBtnPrev) dom.linearBtnPrev.addEventListener('click', handleLinearStepBack);
    if (dom.linearBtnNext) dom.linearBtnNext.addEventListener('click', handleLinearStepForward);
    if (dom.linearBtnReset) dom.linearBtnReset.addEventListener('click', handleLinearReset);
    if (dom.linearSpeedSelect) {
      dom.linearSpeedSelect.addEventListener('change', (e) => {
        linearAnimationSpeed = parseInt(e.target.value, 10) || 800;
      });
    }
    if (dom.linearTargetInput) {
      dom.linearTargetInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleLinearSearchClick();
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
  // Linear Search Real-Time Engine, Visualizer & Sequential Tracer
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
          ? `Step ${comps}: Inspect index [${i}] (A[${i}] = ${val}). Comparison: A[${i}] (${val}) == Target (${target}). Match discovered! Sequential scan terminates in ${comps} comparison(s).`
          : `Step ${comps}: Inspect index [${i}] (A[${i}] = ${val}). Comparison: A[${i}] (${val}) != Target (${target}). Advancing pointer to index [${i + 1}]. (Comparisons: ${comps}).`
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
        message: `Step ${comps + 1}: Sequential scan exhausted all ${arr.length} elements from left to right. Target ${target} not found after ${comps} comparison(s).`
      });
    }

    return trace;
  }

  function loadLinearPresetArray(arr, target) {
    pauseLinearPlayback();
    if (dom.linearTargetInput) {
      dom.linearTargetInput.value = target !== undefined && target !== null ? target : '';
    }
    clearError(dom.linearTargetFeedback);
    if (dom.linearTargetInput) dom.linearTargetInput.classList.remove('is-invalid');

    linearArrayData = [...arr];
    linearTargetValue = target;
    linearSteps = [];
    linearCurrentStepIndex = -1;

    renderLinearInitialArray(linearArrayData);
  }

  function renderLinearInitialArray(arr) {
    if (!dom.linearArrayTrack) return;
    if (!arr || arr.length === 0) {
      if (dom.linearEmptyState) dom.linearEmptyState.style.display = 'flex';
      dom.linearArrayTrack.style.display = 'none';
      dom.linearArrayTrack.innerHTML = '';
      return;
    }

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

    if (dom.linearTelIndex) dom.linearTelIndex.textContent = 'i = 0';
    if (dom.linearTelVal) dom.linearTelVal.textContent = arr.length > 0 ? arr[0] : '-';
    if (dom.linearTelComparison) dom.linearTelComparison.textContent = 'Awaiting execution';
    if (dom.linearTelStatus) dom.linearTelStatus.textContent = 'Ready';
    if (dom.linearTraceBadge) dom.linearTraceBadge.textContent = '0 Comparisons';
    if (dom.linearTraceList) {
      dom.linearTraceList.innerHTML = `<li class="trace-log-item">Array loaded with ${arr.length} element(s). Target: ${linearTargetValue !== null ? linearTargetValue : 'None'}. Click <strong>"Scan Target"</strong> or <strong>"Play"</strong>.</li>`;
    }

    resetLinearProgress();
    updateLinearPlaybackControls();
  }

  function renderLinearStep(stepIndex) {
    if (!linearSteps || stepIndex < 0 || stepIndex >= linearSteps.length) return;
    const step = linearSteps[stepIndex];

    // Clear previous highlights
    linearArrayData.forEach((_, idx) => {
      const node = document.getElementById(`daa-linear-node-${idx}`);
      if (node) {
        node.classList.remove('linear-active', 'linear-scanned', 'target-found');
        const oldPointers = node.querySelectorAll('.pointer-badge');
        oldPointers.forEach(p => p.remove());
      }
    });

    // Mark scanned elements
    step.scannedIndices.forEach(idx => {
      const node = document.getElementById(`daa-linear-node-${idx}`);
      if (node) node.classList.add('linear-scanned');
    });

    // Mark current inspecting element
    if (step.index < linearArrayData.length) {
      const activeNode = document.getElementById(`daa-linear-node-${step.index}`);
      if (activeNode) {
        if (step.found) {
          activeNode.classList.add('target-found');
          const badge = document.createElement('div');
          badge.className = 'pointer-badge pointer-found-badge';
          badge.innerHTML = `<span class="pointer-arrow">▼</span> Found [${step.index}]`;
          activeNode.appendChild(badge);
        } else {
          activeNode.classList.add('linear-active');
          const badge = document.createElement('div');
          badge.className = 'pointer-badge linear-pointer';
          badge.innerHTML = `<span class="pointer-arrow">▼</span> i = ${step.index}`;
          activeNode.appendChild(badge);
        }
      }
    }

    // Telemetry
    if (dom.linearTelIndex) {
      dom.linearTelIndex.textContent = step.index < linearArrayData.length ? `i = ${step.index}` : 'Exhausted';
    }
    if (dom.linearTelVal) {
      dom.linearTelVal.textContent = step.val !== null ? step.val : 'None';
    }
    if (dom.linearTelComparison) {
      if (step.found) {
        dom.linearTelComparison.innerHTML = `<span style="color:var(--status-success); font-weight:700;">A[${step.index}] == Target (${step.target}) ★</span>`;
      } else if (step.exhausted) {
        dom.linearTelComparison.innerHTML = `<span style="color:var(--status-error); font-weight:700;">Exhausted (Not Found)</span>`;
      } else {
        dom.linearTelComparison.innerHTML = `<span>A[${step.index}] (${step.val}) &ne; Target (${step.target})</span>`;
      }
    }
    if (dom.linearTelStatus) {
      dom.linearTelStatus.textContent = step.found ? 'Match Discovered ★' : (step.exhausted ? 'Target Absent ✖' : `Inspecting index [${step.index}]`);
    }

    // Trace Log
    if (dom.linearTraceList) {
      const li = document.createElement('li');
      li.className = `trace-log-item ${step.found ? 'trace-item-found' : (step.exhausted ? 'trace-item-exhausted' : 'trace-item-linear-step')}`;
      li.textContent = step.message;
      dom.linearTraceList.appendChild(li);
      li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (dom.linearTraceBadge) {
      dom.linearTraceBadge.textContent = `${step.comparisonCount} Comparison${step.comparisonCount === 1 ? '' : 's'}`;
    }

    // Progress
    if (dom.linearStepBadge) {
      dom.linearStepBadge.textContent = `Step ${stepIndex + 1} of ${linearSteps.length}`;
    }
    if (dom.linearProgressFraction) {
      dom.linearProgressFraction.textContent = `${stepIndex + 1} / ${linearSteps.length}`;
    }
    if (dom.linearProgressFill) {
      const pct = Math.round(((stepIndex + 1) / linearSteps.length) * 100);
      dom.linearProgressFill.style.width = `${pct}%`;
    }

    updateLinearPlaybackControls();
  }

  function handleLinearSearchClick() {
    pauseLinearPlayback();
    if (!dom.linearTargetInput) return;
    const raw = dom.linearTargetInput.value.trim();
    if (raw === '') {
      showError(dom.linearTargetFeedback, 'Please specify an integer target to search for.');
      dom.linearTargetInput.classList.add('is-invalid');
      return;
    }
    const target = Number(raw);
    if (isNaN(target) || !Number.isInteger(target)) {
      showError(dom.linearTargetFeedback, 'Target must be a valid safe integer.');
      dom.linearTargetInput.classList.add('is-invalid');
      return;
    }

    clearError(dom.linearTargetFeedback);
    dom.linearTargetInput.classList.remove('is-invalid');

    linearTargetValue = target;
    linearSteps = computeLinearSearchTrace(linearArrayData, linearTargetValue);
    linearCurrentStepIndex = -1;

    renderLinearInitialArray(linearArrayData);
    if (dom.linearTraceList) dom.linearTraceList.innerHTML = '';
    handleLinearStepForward();
  }

  function handleLinearStepForward() {
    if (linearCurrentStepIndex < linearSteps.length - 1) {
      linearCurrentStepIndex++;
      renderLinearStep(linearCurrentStepIndex);
    } else {
      pauseLinearPlayback();
    }
  }

  function handleLinearStepBack() {
    if (linearCurrentStepIndex > 0) {
      linearCurrentStepIndex--;
      renderLinearInitialArray(linearArrayData);
      if (dom.linearTraceList) dom.linearTraceList.innerHTML = '';
      for (let i = 0; i <= linearCurrentStepIndex; i++) {
        renderLinearStep(i);
      }
    }
  }

  function handleLinearRestart() {
    pauseLinearPlayback();
    if (linearArrayData.length === 0) return;
    linearCurrentStepIndex = -1;
    renderLinearInitialArray(linearArrayData);
    if (dom.linearTraceList) dom.linearTraceList.innerHTML = '';
    if (linearSteps.length > 0) {
      handleLinearStepForward();
    }
  }

  function toggleLinearPlayPause() {
    if (linearIsPlaying) {
      pauseLinearPlayback();
    } else {
      startLinearPlayback();
    }
  }

  function startLinearPlayback() {
    if (linearSteps.length === 0) {
      handleLinearSearchClick();
    }
    if (linearCurrentStepIndex >= linearSteps.length - 1) {
      linearCurrentStepIndex = -1;
      renderLinearInitialArray(linearArrayData);
      if (dom.linearTraceList) dom.linearTraceList.innerHTML = '';
    }

    linearIsPlaying = true;
    updateLinearPlayButton();

    linearAnimationTimer = setInterval(() => {
      if (linearCurrentStepIndex < linearSteps.length - 1) {
        handleLinearStepForward();
      } else {
        pauseLinearPlayback();
      }
    }, linearAnimationSpeed);
  }

  function pauseLinearPlayback() {
    linearIsPlaying = false;
    if (linearAnimationTimer) {
      clearInterval(linearAnimationTimer);
      linearAnimationTimer = null;
    }
    updateLinearPlayButton();
  }

  function updateLinearPlayButton() {
    if (!dom.linearBtnPlay) return;
    if (linearIsPlaying) {
      dom.linearBtnPlay.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        <span>Pause</span>
      `;
      dom.linearBtnPlay.classList.add('playing');
    } else {
      dom.linearBtnPlay.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>Play</span>
      `;
      dom.linearBtnPlay.classList.remove('playing');
    }
  }

  function updateLinearPlaybackControls() {
    const hasSteps = linearSteps.length > 0;
    const isAtStart = linearCurrentStepIndex <= 0;
    const isAtEnd = linearCurrentStepIndex >= linearSteps.length - 1;

    if (dom.linearBtnPrev) dom.linearBtnPrev.disabled = !hasSteps || isAtStart;
    if (dom.linearBtnNext) dom.linearBtnNext.disabled = !hasSteps || isAtEnd;
    if (dom.linearBtnRestart) dom.linearBtnRestart.disabled = !hasSteps;
  }

  function resetLinearProgress() {
    if (dom.linearStepBadge) dom.linearStepBadge.textContent = 'Step: Ready';
    if (dom.linearProgressFraction) dom.linearProgressFraction.textContent = '0 / 0';
    if (dom.linearProgressFill) dom.linearProgressFill.style.width = '0%';
  }

  function handleLinearReset() {
    pauseLinearPlayback();
    linearSteps = [];
    linearCurrentStepIndex = -1;
    renderLinearInitialArray(linearArrayData);
  }

  function handleLinearSync() {
    pauseLinearPlayback();
    if (arrayData && arrayData.length > 0) {
      linearArrayData = [...arrayData];
    }
    if (targetValue !== null && targetValue !== undefined) {
      linearTargetValue = targetValue;
      if (dom.linearTargetInput) dom.linearTargetInput.value = targetValue;
    }
    linearSteps = [];
    linearCurrentStepIndex = -1;
    renderLinearInitialArray(linearArrayData);

    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Dataset Synchronized! 🔄',
        message: `Linear Search dataset synced with active array [${linearArrayData.join(', ')}] and target ${linearTargetValue}.`
      });
    }
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
