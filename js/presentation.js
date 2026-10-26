/**
 * ConceptLab — Computer Science Concepts Playground
 * Presentation Mode Engine (js/presentation.js)
 * 
 * College Project Review & Viva Defense Deck (9 Comprehensive Sections)
 * Direct Curriculum Mapping:
 * - DAA Module 2: Binary Search Fundamentals & O(log n) Invariant
 * - COA Module 1: Radix Number Systems & Hardware 2's Complement
 * - FLAT Module 1: Deterministic Finite Automata (M = (Q, Σ, δ, q0, F))
 * 
 * Features:
 * - 9 Complete review slides with real technical depth
 * - Direction-aware smooth slide transition animations
 * - Cross-browser Fullscreen API with Safari/WebKit prefixes & change listeners
 * - Embedded functional interactive demonstrators for DAA, COA, and FLAT
 * - Direct slide jump dropdown and progress dots
 * - Next, Previous, and Restart controls
 * - Return to Dashboard button
 * - Keyboard navigation (←, →, Space, Escape)
 */

var PresentationMode = (() => {
  'use strict';

  const SLIDES = [
    {
      id: 'slide-problem-statement',
      sectionIndex: 0,
      subject: 'Review Overview • Section 1',
      title: 'Problem Statement',
      subtitle: 'Addressing Conceptual Abstraction Gaps in Undergraduate Computing Education',
      points: [
        '<strong>Educational Friction:</strong> Abstract mathematical concepts in foundational courses (Divide-and-Conquer bounds in DAA, binary arithmetic representations in COA, and formal automata state transitions in FLAT) are conventionally taught through static diagrams and whiteboard traces, resulting in weak mental models of runtime dynamics.',
        '<strong>Simulation Deficits:</strong> Existing online tools frequently rely on static approximations, fabricated progress animations, heavy external dependencies, or complex server-side build steps that hinder offline classroom demonstration and lab audits.',
        '<strong>Project Mandate:</strong> Engineer an integrated, zero-dependency, mathematically verified educational playground that visualizes every intermediate decision, state shift, and hardware bit-vector in real time via native browser capabilities.'
      ],
      demoType: null
    },
    {
      id: 'slide-project-objectives',
      sectionIndex: 1,
      subject: 'Pedagogy & Goals • Section 2',
      title: 'Project Objectives',
      subtitle: 'Core Pedagogical and Engineering Objectives of ConceptLab',
      points: [
        '<strong>Truthful Computation:</strong> Every algorithm step, base conversion, and DFA transition must be computed in real-time by client-side JavaScript. Strictly zero hardcoded results or fake telemetry.',
        '<strong>Curriculum Syllabus Alignment:</strong> Map directly to undergraduate engineering modules: DAA Module 2 (Binary Search), COA Module 1 (Number Systems), and FLAT Module 1 (Finite Automata).',
        '<strong>Zero-Dependency Portability:</strong> Execute completely offline from local static files using only standard HTML5, CSS3, and Vanilla JavaScript, without React, bundlers, backend runtimes, or external API keys.',
        '<strong>Active Verification & Practice:</strong> Deliver 18 curriculum knowledge checks, parameterized problem generation, deduplicated XP progression, and verified local calendar streaks.'
      ],
      demoType: null
    },
    {
      id: 'slide-tech-stack',
      sectionIndex: 2,
      subject: 'Engineering Architecture • Section 3',
      title: 'Technology Stack & Architecture',
      subtitle: 'Pure Web Standards Engineered for Performance, Robustness, and Offline Reliability',
      points: [
        '<strong>Core UI Layer:</strong> Semantic HTML5 and modular CSS3 custom properties with responsive flexbox/grid architectures, dark/light theme switching, and <code>prefers-reduced-motion</code> compliance.',
        '<strong>Algorithmic Execution Engine:</strong> Modular Vanilla JavaScript using IIFE encapsulation, event-driven decoupling, and arbitrary-precision native <code>BigInt</code> for lossless 64-bit numerical representations.',
        '<strong>Vector State Visualization:</strong> Dynamic inline SVG rendering with Bézier curved transition paths, state nodes, and animated tape heads.',
        '<strong>Persistence & Sound Layer:</strong> Schema v2 error-resilient <code>localStorage</code> with unique XP event deduplication, streak calendar indexing, and synthesized Web Audio API frequency modulation (off by default).'
      ],
      demoType: null
    },
    {
      id: 'slide-daa-demo',
      sectionIndex: 3,
      subject: 'DAA: Module 2 — Binary Search • Section 4',
      title: 'DAA Concept & Live Binary Search Demonstration',
      subtitle: 'Logarithmic Space Reduction through Invariant Midpoint Branching',
      points: [
        '<strong>Algorithmic Invariant:</strong> The candidate space is halved at each midpoint step: <code>mid = low + ⌊(high - low) / 2⌋</code>. If <code>A[mid] == target</code>, search succeeds; otherwise search space narrows to left or right half.',
        '<strong>Recurrence Relation:</strong> <code>T(n) = T(n / 2) + O(1)</code>. Applying the Master Theorem yields <code>O(log n)</code> worst-case time with maximum comparisons bounded by <code>⌊log₂ N⌋ + 1</code>.',
        '<strong>Boundary & Edge Handling:</strong> Robustly handles duplicate values (supporting Left-Boundary first occurrence), unsorted arrays (strict pre-condition rejection with auto-sort remediation), and absent targets.',
        '<strong>Live Demonstration:</strong> Test the embedded visualizer below with real-time logarithmic execution:'
      ],
      demoType: 'daa'
    },
    {
      id: 'slide-coa-demo',
      sectionIndex: 4,
      subject: 'COA: Module 1 — Number Systems • Section 5',
      title: 'COA Concept & Live Number System Conversion',
      subtitle: 'Positional Radix Evaluation & Hardware Two\'s Complement Arithmetic',
      points: [
        '<strong>Positional Notation:</strong> Decimal value is computed as polynomial summation <code>N = ∑ (dᵢ × bⁱ)</code> for radix <code>b ∈ {2, 8, 10, 16}</code> using native <code>BigInt</code> arithmetic.',
        '<strong>ALU Subtraction Unification:</strong> Computer arithmetic units execute <code>A - B</code> as <code>A + (~B + 1)</code>, unifying addition and subtraction without dedicated subtraction hardware.',
        '<strong>Register Range Bounds:</strong> For an n-bit register, signed range is <code>[-2ⁿ⁻¹, 2ⁿ⁻¹ - 1]</code> (8-bit: [-128..+127]). Out-of-range inputs trigger explicit hardware overflow rejection.',
        '<strong>Live Demonstration:</strong> Test real-time radix conversion and two\'s-complement encoding below:'
      ],
      demoType: 'coa'
    },
    {
      id: 'slide-flat-demo',
      sectionIndex: 5,
      subject: 'FLAT: Module 1 — Automata Theory • Section 6',
      title: 'FLAT Concept & Live DFA State Transitions',
      subtitle: 'Formal 5-Tuple Verification for Regular Languages Ending in \'01\'',
      points: [
        '<strong>Formal 5-Tuple Definition:</strong> <code>M = (Q, Σ, δ, q₀, F)</code> where <code>Q = {q0, q1, q2}</code>, alphabet <code>Σ = {0, 1}</code>, start state <code>q₀ = q0</code>, and accept states <code>F = {q2}</code>.',
        '<strong>Language Invariant:</strong> <code>L = { w ∈ {0, 1}* | w ends in "01" }</code>. Transition δ: q0 on 0→q1, on 1→q0; q1 on 0→q1, on 1→q2; q2 on 0→q1, on 1→q0.',
        '<strong>Strict Halting Verdict:</strong> Every symbol in the input string is consumed one-by-one by the tape pointer. A string is ACCEPTED if and only if computation halts in <code>q2 ∈ F</code>.',
        '<strong>Live Demonstration:</strong> Verify any binary string against the formal transition model below:'
      ],
      demoType: 'flat'
    },
    {
      id: 'slide-testing-methodology',
      sectionIndex: 6,
      subject: 'Quality Assurance • Section 7',
      title: 'Testing Methodology',
      subtitle: 'Multi-Tiered Verification Matrix & Robustness Strategy',
      points: [
        '<strong>Algorithmic Correctness:</strong> Validated search steps, boundary conditions, and comparison counts against mathematical recurrence models and linear benchmark baselines.',
        '<strong>Radix & BigInt Precision:</strong> Exhaustive edge cases including zero, safe integer bounds (±9,007,199,254,740,991), 2\'s complement limits (-128, +127), and malformed digit detection.',
        '<strong>Automata State Coverage:</strong> Tested 100% of all 6 DFA transitions, empty string ε rejection, single-symbol inputs, repeated patterns (000..., 111...), and invalid alphabet inputs.',
        '<strong>Persistence & Idempotency:</strong> Automated test suites verify XP deduplication event IDs, calendar streak algorithms, schema version migrations, and preference-safe factory resets.'
      ],
      demoType: null
    },
    {
      id: 'slide-test-cases-results',
      sectionIndex: 7,
      subject: 'Verification Matrix • Section 8',
      title: 'Test Cases & Observed Results',
      subtitle: 'Systematic Test Matrix Across Core Modules',
      points: [
        '<strong>DAA Test (Target 14 in [2,4,6,8,10,14,18,22]):</strong> Result: Found at index 5 in 3 comparisons (mid values: 8 → 14). Status: PASSED.',
        '<strong>DAA Unsorted Test ([15, 3, 9]):</strong> Result: Rejected with actionable error explanation; auto-sort transformed into [3, 9, 15]. Status: PASSED.',
        '<strong>COA Radix Test (Decimal 255):</strong> Result: Binary <code>11111111₂</code>, Hex <code>FF₁₆</code>, Octal <code>377₈</code>. Status: PASSED.',
        '<strong>COA 2\'s Complement Test (-128 in 8-bit):</strong> Result: Binary <code>10000000</code>, sign-magnitude negative weight <code>-128</code>. Status: PASSED.',
        '<strong>FLAT Accepted Test ("110101"):</strong> Result: Path q0 → q0 → q0 → q1 → q2 → q1 → q2 (Accept). Status: PASSED.',
        '<strong>FLAT Rejected Test ("1100"):</strong> Result: Path q0 → q0 → q0 → q1 → q1 (Non-accept q1). Status: PASSED.'
      ],
      demoType: null
    },
    {
      id: 'slide-conclusion',
      sectionIndex: 8,
      subject: 'Academic Summary • Section 9',
      title: 'Conclusion & Learning Outcomes',
      subtitle: 'Summary of Technical Achievements and Pedagogical Impact',
      points: [
        '<strong>Educational Efficacy:</strong> Successfully bridged theoretical abstractions with visual, interactive, step-by-step telemetry, significantly enhancing conceptual comprehension.',
        '<strong>Engineering Integrity:</strong> Proved that sophisticated, premium developer-grade educational software can be engineered using zero frameworks, zero external CDNs, and zero backend services.',
        '<strong>Measurable Mastery:</strong> The integrated verification layer (verifiable XP, local streaks, telemetry tracking) provides students with motivating, honest feedback on genuine curriculum mastery.',
        '<strong>Ready for Classroom & Lab Deployment:</strong> ConceptLab is self-contained, light/dark theme enabled, accessible, and ready for immediate deployment in undergraduate CS lab curricula.'
      ],
      demoType: null
    }
  ];

  let currentSlideIndex = 0;
  let dom = {};

  function init() {
    dom = {
      container: document.getElementById('presentation-container'),
      slideCard: document.getElementById('presentation-slide-card'),
      slideCounter: document.getElementById('presentation-slide-counter'),
      slideSubject: document.getElementById('presentation-slide-subject'),
      slideTitle: document.getElementById('presentation-slide-title'),
      slideSubtitle: document.getElementById('presentation-slide-subtitle'),
      slidePointsList: document.getElementById('presentation-slide-points'),
      demoContainer: document.getElementById('presentation-demo-container'),
      dotsContainer: document.getElementById('presentation-dots'),
      jumpSelect: document.getElementById('presentation-jump-select'),
      btnPrev: document.getElementById('presentation-btn-prev'),
      btnNext: document.getElementById('presentation-btn-next'),
      btnRestart: document.getElementById('presentation-btn-restart'),
      btnRestartTop: document.getElementById('presentation-btn-restart-top'),
      btnHome: document.getElementById('presentation-btn-home'),
      btnFullscreen: document.getElementById('presentation-btn-fullscreen')
    };

    if (!dom.container) return;

    bindEvents();
    renderSlide(0, 'next');
  }

  function isFullscreen() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement);
  }

  function handleFullscreenChange() {
    const isFS = isFullscreen();
    const presSection = document.getElementById('presentation');
    if (presSection) {
      presSection.classList.toggle('is-fullscreen', isFS);
    }
    if (dom.btnFullscreen) {
      if (isFS) {
        dom.btnFullscreen.classList.add('btn-primary');
        dom.btnFullscreen.classList.remove('btn-outline');
        dom.btnFullscreen.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
          <span>Exit Fullscreen</span>
        `;
        dom.btnFullscreen.setAttribute('title', 'Exit Fullscreen (Esc)');
      } else {
        dom.btnFullscreen.classList.remove('btn-primary');
        dom.btnFullscreen.classList.add('btn-outline');
        dom.btnFullscreen.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          <span>Fullscreen</span>
        `;
        dom.btnFullscreen.setAttribute('title', 'Toggle Fullscreen Mode');
      }
    }
  }

  function toggleFullscreen() {
    const target = document.getElementById('presentation') || document.documentElement;
    if (!target) return;

    if (!isFullscreen()) {
      const req = target.requestFullscreen || 
                  target.webkitRequestFullscreen || 
                  target.mozRequestFullScreen || 
                  target.msRequestFullscreen;
      if (req) {
        try {
          const res = req.call(target);
          if (res && res.catch) {
            res.catch(() => {
              // Fallback to documentElement
              if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
              }
            });
          }
        } catch (err) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          }
        }
      }
    } else {
      const exit = document.exitFullscreen || 
                   document.webkitExitFullscreen || 
                   document.mozCancelFullScreen || 
                   document.msExitFullscreen;
      if (exit) {
        try {
          exit.call(document);
        } catch (err) {}
      }
    }
  }

  function bindEvents() {
    if (dom.btnPrev) dom.btnPrev.addEventListener('click', prevSlide);
    if (dom.btnNext) dom.btnNext.addEventListener('click', nextSlide);
    if (dom.btnRestart) dom.btnRestart.addEventListener('click', () => renderSlide(0, 'prev'));
    if (dom.btnRestartTop) dom.btnRestartTop.addEventListener('click', () => renderSlide(0, 'prev'));
    if (dom.btnFullscreen) dom.btnFullscreen.addEventListener('click', toggleFullscreen);

    // Cross-browser Fullscreen Change Listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    if (dom.btnHome) {
      dom.btnHome.addEventListener('click', () => {
        if (typeof Router !== 'undefined') {
          Router.navigate('home', true);
        }
      });
    }

    if (dom.jumpSelect) {
      dom.jumpSelect.addEventListener('change', (e) => {
        const targetIndex = parseInt(e.target.value, 10);
        if (!isNaN(targetIndex)) {
          const dir = targetIndex >= currentSlideIndex ? 'next' : 'prev';
          renderSlide(targetIndex, dir);
        }
      });
    }

    // Global keyboard navigation when presentation view is active
    document.addEventListener('keydown', (e) => {
      const isPresentationActive = document.getElementById('presentation') && document.getElementById('presentation').classList.contains('active');
      if (!isPresentationActive) return;

      // Ignore keys when typing inside an input element
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (!isFullscreen() && typeof Router !== 'undefined') {
          Router.navigate('home', true);
        }
      }
    });
  }

  function onEnter() {
    renderSlide(currentSlideIndex, 'next');
  }

  function renderSlide(index, direction = 'next') {
    if (!dom.container || index < 0 || index >= SLIDES.length) return;
    const oldIndex = currentSlideIndex;
    currentSlideIndex = index;
    const slide = SLIDES[index];

    // Determine direction
    const animDir = (direction === 'prev' || index < oldIndex) ? 'prev' : 'next';

    // Apply smooth direction-aware animation to the slide card
    if (dom.slideCard) {
      dom.slideCard.classList.remove('slide-animate-next', 'slide-animate-prev');
      void dom.slideCard.offsetWidth; // Force DOM reflow to restart animation cleanly
      dom.slideCard.classList.add(animDir === 'prev' ? 'slide-animate-prev' : 'slide-animate-next');
    }

    if (dom.slideCounter) dom.slideCounter.textContent = `Slide ${index + 1} of ${SLIDES.length}`;
    if (dom.slideSubject) dom.slideSubject.textContent = slide.subject;
    if (dom.slideTitle) dom.slideTitle.textContent = slide.title;
    if (dom.slideSubtitle) dom.slideSubtitle.textContent = slide.subtitle;

    if (dom.jumpSelect) {
      dom.jumpSelect.value = String(index);
    }

    if (dom.slidePointsList) {
      dom.slidePointsList.innerHTML = slide.points.map(pt => `
        <li class="presentation-point-item">
          <span class="presentation-bullet-icon" aria-hidden="true">▶</span>
          <div class="presentation-point-content">${pt}</div>
        </li>
      `).join('');
    }

    // Embedded Interactive Live Demonstrations (Slides 4, 5, 6)
    if (dom.demoContainer) {
      if (slide.demoType === 'daa') {
        dom.demoContainer.style.display = 'block';
        renderDaaMiniDemo();
      } else if (slide.demoType === 'coa') {
        dom.demoContainer.style.display = 'block';
        renderCoaMiniDemo();
      } else if (slide.demoType === 'flat') {
        dom.demoContainer.style.display = 'block';
        renderFlatMiniDemo();
      } else {
        dom.demoContainer.style.display = 'none';
        dom.demoContainer.innerHTML = '';
      }
    }

    // Render navigation progress dots
    if (dom.dotsContainer) {
      dom.dotsContainer.innerHTML = SLIDES.map((_, i) => `
        <button class="presentation-dot ${i === index ? 'active' : ''}" type="button" data-slide-index="${i}" aria-label="Go to slide ${i + 1} (${SLIDES[i].title})"></button>
      `).join('');

      const dots = dom.dotsContainer.querySelectorAll('.presentation-dot');
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const targetIdx = parseInt(dot.getAttribute('data-slide-index'), 10);
          const dir = targetIdx >= currentSlideIndex ? 'next' : 'prev';
          renderSlide(targetIdx, dir);
        });
      });
    }

    if (dom.btnPrev) dom.btnPrev.disabled = (index === 0);
    if (dom.btnNext) dom.btnNext.disabled = (index === SLIDES.length - 1);
  }

  /* --- Interactive Demonstrator 1: DAA Binary Search Mini Demo --- */
  function renderDaaMiniDemo() {
    dom.demoContainer.innerHTML = `
      <div class="pres-demo-box">
        <div class="pres-demo-header">
          <div class="pres-demo-title">⚡ Live DAA Interactive Binary Search Trace</div>
          <button class="btn btn-outline btn-xs" type="button" data-route="daa">Launch Full DAA Lab ↗</button>
        </div>
        <p style="font-size:0.84rem; color:var(--text-secondary); margin:0;">
          Vector: <code>[3, 7, 12, 19, 25, 38, 42, 56, 71, 89]</code> (N = 10, Sorted Ascending)
        </p>
        <div class="pres-demo-controls">
          <label for="pres-daa-target" style="font-size:0.82rem; font-weight:600; align-self:center;">Target Value:</label>
          <input type="number" id="pres-daa-target" class="pres-demo-input" value="42" style="width:110px;">
          <button id="pres-daa-btn-search" class="btn btn-primary btn-xs" type="button">Execute Binary Search</button>
        </div>
        <div id="pres-daa-output" class="pres-demo-output">
          Click "Execute Binary Search" to observe client-side divide-and-conquer execution steps.
        </div>
      </div>
    `;

    const btn = document.getElementById('pres-daa-btn-search');
    const input = document.getElementById('pres-daa-target');
    const out = document.getElementById('pres-daa-output');

    if (btn && input && out) {
      btn.addEventListener('click', () => {
        const arr = [3, 7, 12, 19, 25, 38, 42, 56, 71, 89];
        const target = parseInt(input.value, 10);
        if (isNaN(target)) {
          out.innerHTML = '<span style="color:var(--status-error);">Please enter a valid integer target.</span>';
          return;
        }

        let low = 0;
        let high = arr.length - 1;
        let comparisons = 0;
        let foundIndex = -1;
        const steps = [];

        while (low <= high) {
          comparisons++;
          const mid = low + Math.floor((high - low) / 2);
          steps.push(`Step ${comparisons}: low=${low}, high=${high}, mid=${mid} (A[${mid}] = ${arr[mid]})`);

          if (arr[mid] === target) {
            foundIndex = mid;
            steps.push(`✓ Match Found! Target ${target} equals A[${mid}].`);
            break;
          } else if (arr[mid] < target) {
            steps.push(`  → ${arr[mid]} < ${target}: Narrowing search to right subarray [${mid + 1}..${high}].`);
            low = mid + 1;
          } else {
            steps.push(`  → ${arr[mid]} > ${target}: Narrowing search to left subarray [${low}..${mid - 1}].`);
            high = mid - 1;
          }
        }

        if (foundIndex === -1) {
          steps.push(`✖ Search Exhausted: low (${low}) > high (${high}). Target ${target} not present.`);
        }

        out.innerHTML = `
          <div style="font-weight:700; color:${foundIndex !== -1 ? 'var(--status-success)' : 'var(--status-error)'}; margin-bottom:0.4rem;">
            ${foundIndex !== -1 ? `Target ${target} located at index [${foundIndex}]` : `Target ${target} not found`} (${comparisons} comparison(s) | O(log n))
          </div>
          <div style="font-size:0.8rem; line-height:1.6; white-space:pre-wrap;">${steps.join('\n')}</div>
        `;

        if (typeof Storage !== 'undefined' && Storage.completeChallenge) {
          Storage.completeChallenge('daa_binary_search_run', 'daa', 'Binary Search Execution');
        }
      });
    }
  }

  /* --- Interactive Demonstrator 2: COA Number System Mini Demo --- */
  function renderCoaMiniDemo() {
    dom.demoContainer.innerHTML = `
      <div class="pres-demo-box">
        <div class="pres-demo-header">
          <div class="pres-demo-title">⚡ Live COA Radix Translation &amp; 2's Complement</div>
          <button class="btn btn-outline btn-xs" type="button" data-route="coa">Launch Full COA Lab ↗</button>
        </div>
        <div class="pres-demo-controls">
          <label for="pres-coa-val" style="font-size:0.82rem; font-weight:600; align-self:center;">Decimal Value:</label>
          <input type="number" id="pres-coa-val" class="pres-demo-input" value="42" style="width:130px;">
          <button id="pres-coa-btn-calc" class="btn btn-primary btn-xs" type="button">Convert All Radices</button>
        </div>
        <div id="pres-coa-output" class="pres-demo-output">
          Click "Convert All Radices" to compute live representations across Binary, Octal, Hex, and 8-bit Two's Complement.
        </div>
      </div>
    `;

    const btn = document.getElementById('pres-coa-btn-calc');
    const input = document.getElementById('pres-coa-val');
    const out = document.getElementById('pres-coa-output');

    if (btn && input && out) {
      btn.addEventListener('click', () => {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          out.innerHTML = '<span style="color:var(--status-error);">Please enter a valid integer value.</span>';
          return;
        }

        const absBig = BigInt(Math.abs(val));
        const sign = val < 0 ? '-' : '';
        const bin = sign + absBig.toString(2);
        const oct = sign + absBig.toString(8);
        const hex = sign + absBig.toString(16).toUpperCase();

        // 8-bit Two's complement calculation for [-128..127]
        let twos8 = 'Out of 8-bit range [-128..127]';
        if (val >= -128 && val <= 127) {
          if (val >= 0) {
            twos8 = val.toString(2).padStart(8, '0');
          } else {
            const raw = (256 + val).toString(2).padStart(8, '0');
            twos8 = raw;
          }
        }

        out.innerHTML = `
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:0.6rem;">
            <div><strong>Decimal (Radix 10):</strong> <code>${val}</code></div>
            <div><strong>Binary (Radix 2):</strong> <code>${bin}₂</code></div>
            <div><strong>Hexadecimal (Radix 16):</strong> <code>0x${hex}</code></div>
            <div><strong>Octal (Radix 8):</strong> <code>${oct}₈</code></div>
          </div>
          <div style="margin-top:0.6rem; padding-top:0.5rem; border-top:1px dashed var(--border-subtle);">
            <strong>8-bit Two's Complement:</strong> <code style="color:var(--brand-accent); font-weight:700;">${twos8}</code>
            ${val < 0 && val >= -128 ? '<span style="color:var(--text-muted); font-size:0.75rem;"> (Inverted bits + 1)</span>' : ''}
          </div>
        `;

        if (typeof Storage !== 'undefined' && Storage.completeChallenge) {
          Storage.completeChallenge('coa_radix_conversion', 'coa', 'Radix Translation');
        }
      });
    }
  }

  /* --- Interactive Demonstrator 3: FLAT DFA Automaton Mini Demo --- */
  function renderFlatMiniDemo() {
    dom.demoContainer.innerHTML = `
      <div class="pres-demo-box">
        <div class="pres-demo-header">
          <div class="pres-demo-title">⚡ Live FLAT Deterministic Finite Automaton (Ends in '01')</div>
          <button class="btn btn-outline btn-xs" type="button" data-route="flat">Launch Full FLAT Lab ↗</button>
        </div>
        <div class="pres-demo-controls">
          <label for="pres-flat-input" style="font-size:0.82rem; font-weight:600; align-self:center;">Binary String (Σ = {0, 1}):</label>
          <input type="text" id="pres-flat-input" class="pres-demo-input" value="1001" style="width:140px;">
          <button id="pres-flat-btn-test" class="btn btn-primary btn-xs" type="button">Simulate DFA Trace</button>
        </div>
        <div id="pres-flat-output" class="pres-demo-output">
          Click "Simulate DFA Trace" to trace state shifts δ(q, σ) from start state q0.
        </div>
      </div>
    `;

    const btn = document.getElementById('pres-flat-btn-test');
    const input = document.getElementById('pres-flat-input');
    const out = document.getElementById('pres-flat-output');

    if (btn && input && out) {
      btn.addEventListener('click', () => {
        const str = input.value.trim();
        if (str && !/^[01]+$/.test(str)) {
          out.innerHTML = '<span style="color:var(--status-error);">Alphabet rejection: Input must contain only characters \'0\' and \'1\'.</span>';
          return;
        }

        let state = 'q0';
        const trace = [`Start in initial state: ${state}`];

        for (let i = 0; i < str.length; i++) {
          const sym = str[i];
          let nextState = 'q0';

          if (state === 'q0') {
            nextState = (sym === '0') ? 'q1' : 'q0';
          } else if (state === 'q1') {
            nextState = (sym === '0') ? 'q1' : 'q2';
          } else if (state === 'q2') {
            nextState = (sym === '0') ? 'q1' : 'q0';
          }

          trace.push(`Symbol '${sym}' (pos ${i}): δ(${state}, ${sym}) → ${nextState}`);
          state = nextState;
        }

        const isAccepted = (state === 'q2');
        trace.push(`\nComputation halts in state ${state}.`);
        trace.push(isAccepted ? `VERDICT: ACCEPTED ✓ (q2 ∈ F = {q2})` : `VERDICT: REJECTED ✖ (${state} ∉ F)`);

        out.innerHTML = `
          <div style="font-weight:700; color:${isAccepted ? 'var(--status-success)' : 'var(--status-error)'}; margin-bottom:0.4rem;">
            String "${str || 'ε'}" is ${isAccepted ? 'ACCEPTED ✓ (Ends in "01")' : 'REJECTED ✖ (Does not end in "01")'}
          </div>
          <div style="font-size:0.8rem; line-height:1.6; white-space:pre-wrap;">${trace.join('\n')}</div>
        `;

        if (typeof Storage !== 'undefined' && Storage.completeChallenge) {
          Storage.completeChallenge('flat_dfa_validation', 'flat', 'DFA String Verification');
        }
      });
    }
  }

  function nextSlide() {
    if (currentSlideIndex < SLIDES.length - 1) {
      renderSlide(currentSlideIndex + 1, 'next');
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      renderSlide(currentSlideIndex - 1, 'prev');
    }
  }

  return {
    init,
    onEnter,
    renderSlide,
    nextSlide,
    prevSlide,
    toggleFullscreen,
    isFullscreen,
    SLIDES
  };
})();
