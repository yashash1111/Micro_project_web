/**
 * ConceptLab — Computer Science Concepts Playground
 * Module 3: FLAT — Deterministic Finite Automaton (DFA) (js/flat.js)
 * Syllabus Connection: Module 1, Deterministic Finite Automata (Regular Languages).
 * Language L = { w ∈ {0, 1}* | w ends in '01' }
 * 
 * Features:
 * - Real transition table δ(state, symbol) -> nextState computation
 * - Interactive SVG State Diagram with curved directed paths and self-loops
 * - Dynamic active node and active transition edge glowing animations
 * - Dynamic active row and active column cell highlighting in the transition matrix
 * - Tape track visualizer with live pointer reading head
 * - Replay console: Validate All, Next Step, Prev Step, Play, Pause, Restart, Reset
 * - Strict acceptance evaluation: verdict shown ONLY after consuming the entire string
 * - Zero external dependencies. Pure Vanilla JavaScript.
 */

var FlatLab = (() => {
  'use strict';

  // Formal DFA Specification: M = (Q, Σ, δ, q0, F)
  const DFA_SPEC = {
    name: "Binary strings ending in '01'",
    description: "L = { w ∈ {0, 1}* | w ends in '01' }",
    alphabet: ['0', '1'],
    states: [
      { id: 'q0', label: 'q0', desc: 'Initial state: no relevant suffix matched', isStart: true, isAccept: false },
      { id: 'q1', label: 'q1', desc: 'Suffix state: most recent character is 0', isStart: false, isAccept: false },
      { id: 'q2', label: 'q2', desc: 'Accept state: string ends in 01', isStart: false, isAccept: true }
    ],
    startState: 'q0',
    acceptStates: ['q2'],
    transitions: {
      q0: { '0': 'q1', '1': 'q0' },
      q1: { '0': 'q1', '1': 'q2' },
      q2: { '0': 'q1', '1': 'q0' }
    }
  };

  // State Variables
  let traceSteps = [];
  let currentTraceIndex = -1;
  let isPlaying = false;
  let animationTimer = null;
  let animationSpeed = 750; // ms per step

  // DOM Elements Cache
  let dom = {};

  function init() {
    dom = {
      container: document.getElementById('flat-lab-container'),
      stringInput: document.getElementById('flat-string-input'),
      inputFeedback: document.getElementById('flat-input-feedback'),
      alphabetBadge: document.getElementById('flat-alphabet-badge'),
      // Presets
      preset01: document.getElementById('flat-preset-01'),
      preset101: document.getElementById('flat-preset-101'),
      preset1001: document.getElementById('flat-preset-1001'),
      preset110: document.getElementById('flat-preset-110'),
      preset0: document.getElementById('flat-preset-0'),
      presetEmpty: document.getElementById('flat-preset-empty'),
      presetInvalid: document.getElementById('flat-preset-invalid'),
      // Controls
      btnValidate: document.getElementById('flat-btn-validate'),
      btnRestart: document.getElementById('flat-btn-restart'),
      btnPlay: document.getElementById('flat-btn-play'),
      btnStepNext: document.getElementById('flat-btn-next') || document.getElementById('flat-btn-step'),
      btnStepPrev: document.getElementById('flat-btn-prev'),
      btnReset: document.getElementById('flat-btn-reset'),
      speedSelect: document.getElementById('flat-speed-select'),
      // Stage & Views
      activeStateView: document.getElementById('flat-visual-stage'),
      tupleQ: document.getElementById('flat-tuple-q'),
      tupleSigma: document.getElementById('flat-tuple-sigma'),
      tupleQ0: document.getElementById('flat-tuple-q0'),
      tupleF: document.getElementById('flat-tuple-f'),
      transitionTableContainer: document.getElementById('flat-transition-table-container'),
      stateNodesRow: document.getElementById('flat-state-nodes-row'),
      currentStateBadge: document.getElementById('flat-current-state-badge'),
      tapeTrack: document.getElementById('flat-tape-track'),
      traceLogTable: document.getElementById('flat-trace-table-body'),
      resultBanner: document.getElementById('flat-result-banner'),
      // SVG Diagram
      svgDiagram: document.getElementById('flat-svg-diagram'),
      svgNodes: {
        q0: document.getElementById('flat-svg-node-q0'),
        q1: document.getElementById('flat-svg-node-q1'),
        q2: document.getElementById('flat-svg-node-q2')
      },
      svgEdges: {
        'q0-0-q1': document.getElementById('flat-edge-q0-0-q1'),
        'q0-1-q0': document.getElementById('flat-edge-q0-1-q0'),
        'q1-0-q1': document.getElementById('flat-edge-q1-0-q1'),
        'q1-1-q2': document.getElementById('flat-edge-q1-1-q2'),
        'q2-0-q1': document.getElementById('flat-edge-q2-0-q1'),
        'q2-1-q0': document.getElementById('flat-edge-q2-1-q0')
      }
    };

    if (!dom.container) return;

    bindEvents();
    renderStaticDFAComponents();
    // Default load test case: "1001" (Accepted) - silent on initial setup without firing popup
    loadStringPreset('1001', false);
  }

  function bindEvents() {
    dom.stringInput.addEventListener('input', () => {
      validateInputChars();
    });

    if (dom.speedSelect) {
      dom.speedSelect.addEventListener('change', (e) => {
        animationSpeed = parseInt(e.target.value, 10) || 750;
      });
    }

    // Presets
    if (dom.preset01) dom.preset01.addEventListener('click', () => loadStringPreset('01', true));
    if (dom.preset101) dom.preset101.addEventListener('click', () => loadStringPreset('101', true));
    if (dom.preset1001) dom.preset1001.addEventListener('click', () => loadStringPreset('1001', true));
    if (dom.preset110) dom.preset110.addEventListener('click', () => loadStringPreset('110', true));
    if (dom.preset0) dom.preset0.addEventListener('click', () => loadStringPreset('0', true));
    if (dom.presetEmpty) dom.presetEmpty.addEventListener('click', () => loadStringPreset('', true));
    if (dom.presetInvalid) dom.presetInvalid.addEventListener('click', () => loadStringPreset('10x1', true));

    // Controls
    dom.btnValidate.addEventListener('click', () => handleValidateAll(true));
    if (dom.btnRestart) dom.btnRestart.addEventListener('click', handleRestart);
    if (dom.btnPlay) dom.btnPlay.addEventListener('click', togglePlayPause);
    if (dom.btnStepNext) dom.btnStepNext.addEventListener('click', handleStepForward);
    if (dom.btnStepPrev) dom.btnStepPrev.addEventListener('click', handleStepBack);
    dom.btnReset.addEventListener('click', reset);

    // Keyboard Enter to validate immediately
    dom.stringInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleValidateAll(true);
      }
    });
  }

  function showError(msg) {
    if (!dom.inputFeedback) return;
    dom.inputFeedback.textContent = msg;
    dom.inputFeedback.classList.add('show');
    dom.stringInput.classList.add('is-invalid');
  }

  function clearError() {
    if (!dom.inputFeedback) return;
    dom.inputFeedback.textContent = '';
    dom.inputFeedback.classList.remove('show');
    dom.stringInput.classList.remove('is-invalid');
  }

  function loadStringPreset(str, showNotification = true) {
    pausePlayback();
    dom.stringInput.value = str;
    clearError();

    if (!validateInputChars()) {
      if (dom.emptyState) dom.emptyState.style.display = 'flex';
      return;
    }

    handleValidateAll(showNotification);
  }

  function renderStaticDFAComponents() {
    // 5-Tuple specs
    dom.tupleQ.textContent = '{ q0, q1, q2 }';
    dom.tupleSigma.textContent = '{ 0, 1 }';
    dom.tupleQ0.textContent = 'q0';
    dom.tupleF.textContent = '{ q2 }';
    dom.alphabetBadge.textContent = 'Alphabet Σ = { 0, 1 }';

    renderTransitionTable();
    renderStateNodes(DFA_SPEC.startState);
    updateSVGStateDisplay(DFA_SPEC.startState, null);
  }

  function renderTransitionTable() {
    let html = `
      <table class="transition-matrix">
        <thead>
          <tr>
            <th>Current State (q)</th>
            <th>Input '0'</th>
            <th>Input '1'</th>
            <th>State Role / Definition</th>
          </tr>
        </thead>
        <tbody>
    `;

    DFA_SPEC.states.forEach(s => {
      const isStart = s.id === DFA_SPEC.startState;
      const isAccept = s.id === 'q2';
      let statePrefix = '';
      if (isStart) statePrefix += '▶ Start ';
      if (isAccept) statePrefix += '★ Accept ';

      html += `
        <tr id="flat-matrix-row-${s.id}">
          <td><strong><code>${s.id}</code></strong> ${statePrefix ? `<span class="topic-tag" style="margin-left:0.35rem;">${statePrefix}</span>` : ''}</td>
          <td id="flat-matrix-cell-${s.id}-0"><code>&delta;(${s.id}, 0) = ${DFA_SPEC.transitions[s.id]['0']}</code></td>
          <td id="flat-matrix-cell-${s.id}-1"><code>&delta;(${s.id}, 1) = ${DFA_SPEC.transitions[s.id]['1']}</code></td>
          <td style="text-align:left; font-size:0.8rem; color:var(--text-secondary);">${s.desc}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    dom.transitionTableContainer.innerHTML = html;
  }

  function renderStateNodes(activeStateId) {
    dom.stateNodesRow.innerHTML = '';
    DFA_SPEC.states.forEach(s => {
      const wrapper = document.createElement('div');
      wrapper.className = 'state-node-wrapper';

      const node = document.createElement('div');
      node.className = 'state-node';
      node.id = `dfa-node-${s.id}`;

      if (s.isStart) node.classList.add('is-start');
      if (s.isAccept) node.classList.add('is-accept');
      if (s.id === activeStateId) node.classList.add('is-current');

      node.textContent = s.label;
      wrapper.appendChild(node);

      const desc = document.createElement('div');
      desc.className = 'state-node-desc';
      desc.innerHTML = `<strong>${s.label}</strong><br>${s.isAccept ? 'Accepting (01)' : s.isStart ? 'Initial (No match)' : 'Last char = 0'}`;
      wrapper.appendChild(desc);

      dom.stateNodesRow.appendChild(wrapper);
    });

    if (dom.currentStateBadge) {
      const activeObj = DFA_SPEC.states.find(s => s.id === activeStateId);
      dom.currentStateBadge.innerHTML = `Current State: <strong>${activeStateId}</strong> (${activeObj ? activeObj.desc : ''})`;
    }
  }

  /**
   * Updates SVG State Diagram
   * Highlights active node and active transition edge.
   */
  function updateSVGStateDisplay(activeStateId, edgeKey) {
    // 1. Update SVG State Nodes
    Object.keys(dom.svgNodes).forEach(id => {
      const nodeEl = dom.svgNodes[id] || document.getElementById(`flat-svg-node-${id}`);
      if (nodeEl) {
        if (id === activeStateId) {
          nodeEl.classList.add('is-active');
        } else {
          nodeEl.classList.remove('is-active');
        }
      }
    });

    // 2. Update SVG Transition Edges
    Object.keys(dom.svgEdges).forEach(key => {
      const edgeEl = dom.svgEdges[key] || document.getElementById(`flat-edge-${key}`);
      if (edgeEl) {
        if (key === edgeKey) {
          edgeEl.classList.add('is-active');
        } else {
          edgeEl.classList.remove('is-active');
        }
      }
    });

    // 3. Update Transition Table Highlighting
    const allRows = dom.transitionTableContainer.querySelectorAll('tr');
    allRows.forEach(r => r.classList.remove('active-row'));
    const allCells = dom.transitionTableContainer.querySelectorAll('td');
    allCells.forEach(c => c.classList.remove('active-cell'));

    if (edgeKey) {
      const parts = edgeKey.split('-');
      const fromState = parts[0];
      const symbol = parts[1];
      const rowEl = document.getElementById(`flat-matrix-row-${fromState}`);
      if (rowEl) rowEl.classList.add('active-row');
      const cellEl = document.getElementById(`flat-matrix-cell-${fromState}-${symbol}`);
      if (cellEl) cellEl.classList.add('active-cell');
    }
  }

  function validateInputChars() {
    const str = dom.stringInput.value.trim();
    if (str === '') {
      clearError();
      return true;
    }

    const allowed = new Set(DFA_SPEC.alphabet);
    for (let char of str) {
      if (!allowed.has(char)) {
        showError(`Validation Error: Symbol '${char}' is invalid! Binary alphabet strictly allows only '0' and '1'.`);
        return false;
      }
    }

    clearError();
    return true;
  }

  /**
   * Real DFA Transition Trace Builder
   * Uses the explicit transition table delta(state, char) -> nextState.
   * Empty string epsilon executes 0 transitions and halts in start state q0.
   */
  function computeDFATrace(inputStr) {
    const trace = [];
    let currentState = DFA_SPEC.startState;

    // Step 0: Initial state before any symbol is consumed
    trace.push({
      step: 0,
      charRead: 'ε (Start)',
      charIndex: -1,
      fromState: '-',
      toState: currentState,
      edgeKey: null,
      isAccept: DFA_SPEC.acceptStates.includes(currentState),
      isFinalStep: inputStr.length === 0,
      explanation: `DFA initialized in start state q0. (No symbols processed yet).`
    });

    if (inputStr.length === 0) {
      return trace;
    }

    // Process each symbol sequentially
    for (let i = 0; i < inputStr.length; i++) {
      const char = inputStr[i];
      const nextState = DFA_SPEC.transitions[currentState][char];
      const isFinal = (i === inputStr.length - 1);
      const edgeKey = `${currentState}-${char}-${nextState}`;

      let ruleExplanation = '';
      if (currentState === 'q0' && char === '0') ruleExplanation = 'δ(q0, 0) = q1 (Read 0: suffix now ends in 0)';
      else if (currentState === 'q0' && char === '1') ruleExplanation = 'δ(q0, 1) = q0 (Read 1: suffix reset, remaining in q0)';
      else if (currentState === 'q1' && char === '0') ruleExplanation = 'δ(q1, 0) = q1 (Read 0: consecutive zeros, still ends in 0)';
      else if (currentState === 'q1' && char === '1') ruleExplanation = 'δ(q1, 1) = q2 (Read 1 after 0: matched target suffix "01"! Moving to Accept state q2)';
      else if (currentState === 'q2' && char === '0') ruleExplanation = 'δ(q2, 0) = q1 (Read 0: broke "01" match, suffix now ends in 0)';
      else if (currentState === 'q2' && char === '1') ruleExplanation = 'δ(q2, 1) = q0 (Read 1: broke "01" match, resetting to q0)';

      trace.push({
        step: i + 1,
        charRead: char,
        charIndex: i,
        fromState: currentState,
        toState: nextState,
        edgeKey: edgeKey,
        isAccept: DFA_SPEC.acceptStates.includes(nextState),
        isFinalStep: isFinal,
        explanation: ruleExplanation
      });

      currentState = nextState;
    }

    return trace;
  }

  function handleValidateAll(showNotification = true) {
    pausePlayback();
    if (!validateInputChars()) return;

    const inputStr = dom.stringInput.value.trim();
    traceSteps = computeDFATrace(inputStr);
    currentTraceIndex = traceSteps.length - 1;

    if (dom.emptyState) dom.emptyState.style.display = 'none';
    if (dom.activeStateView) dom.activeStateView.style.display = 'block';

    renderTape(inputStr, currentTraceIndex - 1);
    renderTraceTable(traceSteps);

    const finalStep = traceSteps[currentTraceIndex];
    applyStepState(finalStep, showNotification);
    updatePlaybackControls();
  }

  function handleRestart() {
    pausePlayback();
    if (!validateInputChars()) return;

    const inputStr = dom.stringInput.value.trim();
    traceSteps = computeDFATrace(inputStr);
    currentTraceIndex = 0; // Rewind to step 0 (initial state)

    renderTape(inputStr, -1);
    renderTraceTable(traceSteps);
    applyStepState(traceSteps[0]);
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
    if (!validateInputChars()) return;

    const inputStr = dom.stringInput.value.trim();
    if (traceSteps.length === 0) {
      traceSteps = computeDFATrace(inputStr);
      currentTraceIndex = -1;
    }

    if (currentTraceIndex >= traceSteps.length - 1) {
      currentTraceIndex = -1;
    }

    if (dom.emptyState) dom.emptyState.style.display = 'none';
    if (dom.activeStateView) dom.activeStateView.style.display = 'block';
    renderTraceTable(traceSteps);

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
    if (currentStepIndexOrNext()) {
      animationTimer = setTimeout(runAnimationLoop, animationSpeed);
    } else {
      pausePlayback();
    }
  }

  function currentStepIndexOrNext() {
    if (currentTraceIndex < traceSteps.length - 1) {
      handleStepForward();
      return true;
    }
    return false;
  }

  function handleStepForward() {
    if (!validateInputChars()) return;

    const inputStr = dom.stringInput.value.trim();
    if (traceSteps.length === 0) {
      traceSteps = computeDFATrace(inputStr);
      currentTraceIndex = -1;
      if (dom.emptyState) dom.emptyState.style.display = 'none';
      if (dom.activeStateView) dom.activeStateView.style.display = 'block';
      renderTraceTable(traceSteps);
    }

    if (currentTraceIndex < traceSteps.length - 1) {
      currentTraceIndex++;
      applyStepState(traceSteps[currentTraceIndex]);
    }

    updatePlaybackControls();
  }

  function handleStepBack() {
    pausePlayback();
    if (currentTraceIndex > 0) {
      currentTraceIndex--;
      applyStepState(traceSteps[currentTraceIndex]);
    }
    updatePlaybackControls();
  }

  function applyStepState(step, showNotification = true) {
    if (!step) return;

    const inputStr = dom.stringInput.value.trim();
    renderTape(inputStr, step.charIndex);
    renderStateNodes(step.toState);
    updateSVGStateDisplay(step.toState, step.edgeKey);
    highlightTraceRow(step.step);

    // Requirement: Display Accepted/Rejected ONLY after consuming the entire string!
    const isAtEnd = (currentTraceIndex === traceSteps.length - 1);

    if (!isAtEnd) {
      dom.resultBanner.className = 'result-banner';
      dom.resultBanner.style.backgroundColor = 'var(--bg-elevated)';
      dom.resultBanner.style.borderColor = 'var(--border-subtle)';
      dom.resultBanner.style.color = 'var(--text-secondary)';
      dom.resultBanner.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div>
          <strong>Processing DFA...</strong> Step ${step.step} of ${traceSteps.length - 1}.
          Current State: <code>${step.toState}</code>. Reading head at symbol <code>${step.charRead}</code>.
          <span style="font-size:0.8rem; color:var(--text-muted); display:block;">
            (Final acceptance verdict is evaluated only after the entire string is consumed).
          </span>
        </div>
      `;
    } else {
      // Entire string has been consumed
      const isAccepted = step.isAccept;
      dom.resultBanner.className = `result-banner ${isAccepted ? 'accepted' : 'rejected'}`;
      dom.resultBanner.style.backgroundColor = '';
      dom.resultBanner.style.borderColor = '';
      dom.resultBanner.style.color = '';

      if (isAccepted) {
        dom.resultBanner.innerHTML = `
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div>
            <span style="font-size:1.15rem; font-weight:800; display:block; margin-bottom:0.25rem;">
              ACCEPTED
            </span>
            String <code>"${inputStr}"</code> ends in <strong>'01'</strong>.
            Computation successfully halts in accept state <code>${step.toState}</code> &isin; F = { q2 }.
          </div>
        `;

        if (showNotification && typeof App !== 'undefined' && App.showPopup) {
          App.showPopup({
            type: 'success',
            title: 'DFA String Accepted! 🎉',
            message: `String "${inputStr}" successfully accepted! Halts in final state q2 ∈ F.`,
            badges: [
              { label: 'Verdict', value: 'ACCEPTED' },
              { label: 'Halting State', value: step.toState },
              { label: 'Length', value: inputStr.length }
            ]
          });
        }

        // Record verified curriculum challenge completion & award XP
        if (showNotification && typeof Storage !== 'undefined' && Storage.completeChallenge) {
          Storage.completeChallenge('flat_string_accepted', 'flat', 'Accepted String Ending in 01', {
            inputStr: inputStr
          });
        }
      } else {
        dom.resultBanner.innerHTML = `
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <div>
            <span style="font-size:1.15rem; font-weight:800; display:block; margin-bottom:0.25rem;">
              REJECTED
            </span>
            ${inputStr === '' ? 'Empty string &epsilon;' : `String <code>"${inputStr}"</code>`} does <strong>not</strong> end in '01'.
            Computation halts in non-accepting state <code>${step.toState}</code> &notin; F.
          </div>
        `;

        if (showNotification && typeof App !== 'undefined' && App.showPopup) {
          App.showPopup({
            type: 'error',
            title: 'DFA String Rejected! ✖',
            message: `String "${inputStr || 'ε'}" is rejected because computation halts in non-accept state ${step.toState}.`,
            badges: [
              { label: 'Verdict', value: 'REJECTED' },
              { label: 'Halting State', value: step.toState },
              { label: 'Suffix', value: inputStr.slice(-2) || 'None' }
            ]
          });
        }

        // Record verified curriculum challenge completion & award XP
        if (showNotification && typeof Storage !== 'undefined' && Storage.completeChallenge) {
          Storage.completeChallenge('flat_dfa_validation', 'flat', 'DFA String Verification', {
            inputStr: inputStr,
            accepted: false
          });
        }
      }
    }
  }

  function renderTape(inputStr, activeIndex) {
    dom.tapeTrack.innerHTML = '';
    if (inputStr.length === 0) {
      dom.tapeTrack.innerHTML = `<div class="tape-cell active-head" title="Empty String (Epsilon)">ε</div>`;
      return;
    }

    for (let i = 0; i < inputStr.length; i++) {
      const cell = document.createElement('div');
      cell.className = 'tape-cell';
      cell.textContent = inputStr[i];

      if (i === activeIndex) {
        cell.classList.add('active-head');
      } else if (i < activeIndex) {
        cell.classList.add('processed');
      }

      dom.tapeTrack.appendChild(cell);
    }
  }

  function renderTraceTable(trace) {
    let html = '';
    trace.forEach(st => {
      html += `
        <tr id="flat-trace-row-${st.step}">
          <td>${st.step}</td>
          <td><code>${st.charRead}</code></td>
          <td><code>${st.fromState}</code></td>
          <td><strong><code>${st.toState}</code></strong></td>
          <td><code>&delta;(${st.fromState === '-' ? 'q0' : st.fromState}, ${st.charRead})</code></td>
          <td>${st.explanation}</td>
        </tr>
      `;
    });
    dom.traceLogTable.innerHTML = html;
  }

  function highlightTraceRow(stepIdx) {
    const rows = dom.traceLogTable.querySelectorAll('tr');
    rows.forEach(r => {
      if (r.id === `flat-trace-row-${stepIdx}`) {
        r.style.backgroundColor = 'rgba(245, 158, 11, 0.25)';
      } else {
        r.style.backgroundColor = '';
      }
    });
  }

  function updatePlaybackControls() {
    if (dom.btnStepPrev) dom.btnStepPrev.disabled = (currentTraceIndex <= 0);
    if (dom.btnStepNext) dom.btnStepNext.disabled = (traceSteps.length > 0 && currentTraceIndex >= traceSteps.length - 1);
  }

  function onEnter() {
    if (typeof Animations !== 'undefined') {
      Animations.registerCleanup('flat', () => {
        pausePlayback();
      });
    }
  }

  function reset() {
    pausePlayback();
    traceSteps = [];
    currentTraceIndex = -1;
    dom.stringInput.value = '';
    clearError();
    if (dom.emptyState) dom.emptyState.style.display = 'flex';
    if (dom.activeStateView) dom.activeStateView.style.display = 'block';
    dom.tapeTrack.innerHTML = '';
    dom.traceLogTable.innerHTML = '';
    renderStateNodes(DFA_SPEC.startState);
    updateSVGStateDisplay(DFA_SPEC.startState, null);

    dom.resultBanner.className = 'result-banner';
    dom.resultBanner.innerHTML = 'Awaiting input validation...';
  }

  return {
    init,
    onEnter,
    reset,
    loadStringPreset,
    computeDFATrace
  };
})();
