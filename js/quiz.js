/**
 * ConceptLab — Computer Science Concepts Playground
 * Practice Arena & Concept Quizzes (js/quiz.js)
 * 
 * Interactive conceptual knowledge checks for DAA, COA, and FLAT.
 * Features:
 * - 18 comprehensive curriculum questions (6 DAA, 6 COA, 6 FLAT)
 * - Mix of Multiple Choice Questions (MCQ) and Numeric/Text Entry Questions
 * - Real Dynamic Parameterized Problem Generator with instant JS computation
 * - Immediate explanatory feedback and retry support
 * - Genuine stats audit: Attempted, Correct, Accuracy % (prevents double-scoring)
 * - Zero external dependencies. Pure Vanilla JavaScript.
 */

var QuizLab = (() => {
  'use strict';

  const STATIC_QUESTIONS = [
    // --- DAA QUESTIONS ---
    {
      id: 'daa-q1',
      category: 'daa',
      categoryLabel: 'DAA: Algorithms',
      type: 'mcq',
      question: 'Why does Binary Search strictly require the input array to be sorted?',
      options: [
        'Because sorting reduces the space complexity from O(n) to O(1).',
        'Because the algorithm relies on comparing the target with the midpoint to definitively eliminate one entire half of the search interval.',
        'Because unsorted arrays cannot be addressed by index pointers in JavaScript.',
        'Because binary search builds a binary search tree in memory requiring pre-sorted values.'
      ],
      correctIndex: 1,
      explanation: 'Binary Search uses Divide-and-Conquer: if target < A[mid], the sorted property guarantees the target cannot exist anywhere to the right of mid, safely discarding that half.'
    },
    {
      id: 'daa-q2',
      category: 'daa',
      categoryLabel: 'DAA: Algorithms',
      type: 'mcq',
      question: 'What is the maximum number of comparisons Binary Search performs on an array of N = 1024 elements in the worst case?',
      options: [
        '10 comparisons',
        '11 comparisons',
        '512 comparisons',
        '1024 comparisons'
      ],
      correctIndex: 1,
      explanation: 'Worst-case comparisons formula is ⌊log₂ N⌋ + 1. For N = 1024, log₂(1024) = 10, so 10 + 1 = 11 comparisons maximum.'
    },
    {
      id: 'daa-q3',
      category: 'daa',
      categoryLabel: 'DAA: Algorithms',
      type: 'input',
      question: 'In an array of size N = 64, what is the exact maximum number of comparisons in the worst case (⌊log₂ N⌋ + 1)?',
      placeholder: 'Enter integer (e.g. 7)...',
      correctAnswer: '7',
      explanation: 'For N = 64, ⌊log₂ 64⌋ + 1 = 6 + 1 = 7 comparisons maximum in the worst case.'
    },
    {
      id: 'daa-q4',
      category: 'daa',
      categoryLabel: 'DAA: Algorithms',
      type: 'mcq',
      question: 'Given array [2, 4, 4, 4, 6, 8] with target 4, what is the behavior of standard binary search vs left-boundary search?',
      options: [
        'Standard search guarantees returning index 1, while left-boundary search returns index 3.',
        'Standard search halts at any matching midpoint (returning any index where A[mid]==4), while left-boundary search continues leftwards to guarantee the first index (1).',
        'Both modes always return index 0.',
        'Standard search rejects arrays with duplicate values.'
      ],
      correctIndex: 1,
      explanation: 'Standard binary search terminates immediately on encountering A[mid]==target. Left-boundary search records the match and shifts high = mid - 1 to guarantee returning the leftmost occurrence.'
    },
    {
      id: 'daa-q5',
      category: 'daa',
      categoryLabel: 'DAA: Algorithms',
      type: 'input',
      question: 'Given sorted array [3, 7, 12, 19, 25, 31, 44] with 7 elements (indices 0 to 6), what is the initial midpoint index calculated as ⌊(0 + 6) / 2⌋?',
      placeholder: 'Enter index integer...',
      correctAnswer: '3',
      explanation: 'mid = ⌊(low + high) / 2⌋ = ⌊(0 + 6) / 2⌋ = ⌊3.0⌋ = 3, which references element 19.'
    },
    {
      id: 'daa-q6',
      category: 'daa',
      categoryLabel: 'DAA: Algorithms',
      type: 'mcq',
      question: 'What is the auxiliary space complexity of iterative binary search?',
      options: [
        'O(n) auxiliary space',
        'O(log n) auxiliary space due to call stack',
        'O(1) auxiliary space because it only maintains low, mid, and high pointers',
        'O(n log n) auxiliary space'
      ],
      correctIndex: 2,
      explanation: 'Iterative binary search uses only constant additional memory O(1) for storing pointer variables (low, mid, high).'
    },

    // --- COA QUESTIONS ---
    {
      id: 'coa-q1',
      category: 'coa',
      categoryLabel: 'COA: Computer Organization',
      type: 'mcq',
      question: 'Why is 2\'s Complement universally preferred over Sign-Magnitude in CPU ALU arithmetic?',
      options: [
        '2\'s complement allows negative numbers to have two different representations for zero (+0 and -0).',
        '2\'s complement allows unified adder hardware circuits to perform both addition and subtraction without dedicated subtractors.',
        '2\'s complement doubles the total addressable physical memory bandwidth.',
        '2\'s complement requires fewer bits per byte than standard binary encoding.'
      ],
      correctIndex: 1,
      explanation: 'In 2\'s complement, A - B is computed as A + (~B + 1) using identical addition circuitry, eliminating duplicate representations of zero and simplifying ALU design.'
    },
    {
      id: 'coa-q2',
      category: 'coa',
      categoryLabel: 'COA: Computer Organization',
      type: 'mcq',
      question: 'In an 8-bit signed 2\'s complement hardware register, what is the valid numerical range of representable integers?',
      options: [
        '0 to +255',
        '-127 to +127',
        '-128 to +127',
        '-256 to +255'
      ],
      correctIndex: 2,
      explanation: 'For an n-bit signed system, the range is [-2^(n-1), 2^(n-1) - 1]. For 8-bit: -2^7 = -128 up to +2^7 - 1 = +127.'
    },
    {
      id: 'coa-q3',
      category: 'coa',
      categoryLabel: 'COA: Computer Organization',
      type: 'input',
      question: 'What is the 2-digit Hexadecimal representation of the 8-bit binary byte 11110000?',
      placeholder: 'Enter 2 hex characters (e.g. F0)...',
      correctAnswer: 'F0',
      caseInsensitive: true,
      explanation: 'Nibble 1: 1111₂ = 15 = F₁₆; Nibble 2: 0000₂ = 0 = 0₁₆. Combined: F0₁₆.'
    },
    {
      id: 'coa-q4',
      category: 'coa',
      categoryLabel: 'COA: Computer Organization',
      type: 'input',
      question: 'What is the Decimal magnitude of the binary byte 00001101 (summing 8 + 4 + 1)?',
      placeholder: 'Enter decimal integer...',
      correctAnswer: '13',
      explanation: 'Positional weights: 2³·1 + 2²·1 + 2¹·0 + 2⁰·1 = 8 + 4 + 0 + 1 = 13.'
    },
    {
      id: 'coa-q5',
      category: 'coa',
      categoryLabel: 'COA: Computer Organization',
      type: 'mcq',
      question: 'Why does the signed 8-bit Two\'s Complement range extend to -128 on the negative side, but only +127 on the positive side?',
      options: [
        'Because negative numbers consume less silicon on the CPU die.',
        'Because 0 is encoded with a leading sign bit of 0, which consumes one of the 128 positive bit patterns (0 to 127).',
        'Because the carry bit is discarded on negative overflow.',
        'Because 128 is a prime number.'
      ],
      correctIndex: 1,
      explanation: 'An 8-bit register has 256 distinct patterns. Patterns with MSB=0 represent 0 to 127 (128 values). Patterns with MSB=1 represent -128 to -1 (128 values). Thus 0 shares the non-negative space.'
    },
    {
      id: 'coa-q6',
      category: 'coa',
      categoryLabel: 'COA: Computer Organization',
      type: 'input',
      question: 'In an 8-bit signed two\'s complement register, what is the exact binary encoding for the integer -1?',
      placeholder: 'Enter 8 bits (e.g. 11111111)...',
      correctAnswer: '11111111',
      cleanSpaces: true,
      explanation: '|-1| = 00000001. Inverting bits gives 11111110. Adding 1 gives 11111111₂. (-128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = -1).'
    },

    // --- FLAT QUESTIONS ---
    {
      id: 'flat-q1',
      category: 'flat',
      categoryLabel: 'FLAT: Automata Theory',
      type: 'mcq',
      question: 'For the DFA language L = { w ∈ {0, 1}* | w ends in "01" }, why is state q0 reached from state q2 on input symbol "1"?',
      options: [
        'Because receiving a \'1\' after "01" produces a suffix of "1", destroying the requirement that the last two symbols must be "01".',
        'Because all DFAs must reset to their start state after encountering any accept state.',
        'Because the transition function δ(q2, 1) is undefined in a deterministic automaton.',
        'Because state q2 can only transition to state q1.'
      ],
      correctIndex: 0,
      explanation: 'If the string ends in "01" (state q2) and reads \'1\', the new string ends in "011". Its longest relevant suffix matching the target "01" is neither "01" nor "0", so the machine resets to q0.'
    },
    {
      id: 'flat-q2',
      category: 'flat',
      categoryLabel: 'FLAT: Automata Theory',
      type: 'mcq',
      question: 'In formal language theory, what distinguishes a Deterministic Finite Automaton (DFA) from an NFA?',
      options: [
        'A DFA accepts infinite-length languages while an NFA can only accept finite sets.',
        'For every state and input symbol, a DFA has exactly one unique transition, and does not permit ε-moves.',
        'DFAs require an external memory stack whereas NFAs use registers.',
        'DFAs can accept non-regular context-free languages.'
      ],
      correctIndex: 1,
      explanation: 'By definition, a DFA\'s transition function is δ: Q × Σ → Q, meaning for every state-symbol pair there is exactly one deterministic next state, with no ambiguity and no ε (empty) transitions.'
    },
    {
      id: 'flat-q3',
      category: 'flat',
      categoryLabel: 'FLAT: Automata Theory',
      type: 'input',
      question: 'For the language of binary strings ending in "01", will the string "11001" be ACCEPTED or REJECTED?',
      placeholder: 'Type accepted or rejected...',
      correctAnswer: 'accepted',
      caseInsensitive: true,
      explanation: 'The string "11001" has suffix "01", and terminates in accept state q2. Therefore it is ACCEPTED.'
    },
    {
      id: 'flat-q4',
      category: 'flat',
      categoryLabel: 'FLAT: Automata Theory',
      type: 'input',
      question: 'What is the halting state of this DFA when processing the empty string ε (0 transitions)?',
      placeholder: 'Enter state name (e.g. q0)...',
      correctAnswer: 'q0',
      caseInsensitive: true,
      explanation: 'Before processing any characters, the DFA is initialized in start state q0. Because q0 ∉ F, the empty string is rejected.'
    },
    {
      id: 'flat-q5',
      category: 'flat',
      categoryLabel: 'FLAT: Automata Theory',
      type: 'mcq',
      question: 'For a DFA with 3 states Q = {q0, q1, q2} and alphabet Σ = {0, 1}, how many total transitions must exist in the transition function δ?',
      options: [
        '3 transitions',
        '5 transitions',
        '6 transitions (|Q| × |Σ| = 3 × 2)',
        '9 transitions'
      ],
      correctIndex: 2,
      explanation: 'In a complete DFA, every state has exactly one outgoing transition for each symbol in Σ. Total transitions = |Q| × |Σ| = 3 × 2 = 6 transitions.'
    },
    {
      id: 'flat-q6',
      category: 'flat',
      categoryLabel: 'FLAT: Automata Theory',
      type: 'input',
      question: 'What is the halting state of the DFA after processing the string "1010"? (Trace: q0 → q0 → q1 → q2 → ?)',
      placeholder: 'Enter state name (e.g. q1)...',
      correctAnswer: 'q1',
      caseInsensitive: true,
      explanation: 'Trace: δ(q0, 1)=q0, δ(q0, 0)=q1, δ(q1, 1)=q2, δ(q2, 0)=q1. Halts in state q1 (ending in 0, not 01).'
    }
  ];

  let questions = [...STATIC_QUESTIONS];
  let currentCategory = 'all';
  let currentIndex = 0;
  let userAnswers = {}; // questionId -> answer
  let answeredQuestions = new Set(); // tracks questionId answered to prevent double scoring
  let score = 0;
  let totalAttempted = 0;

  let dom = {};

  function init() {
    dom = {
      container: document.getElementById('quiz-lab-container'),
      categoryFilterGroup: document.getElementById('quiz-category-filters'),
      cardContainer: document.getElementById('quiz-card-container'),
      scoreBadge: document.getElementById('quiz-score-badge'),
      progressText: document.getElementById('quiz-progress-text'),
      btnPrev: document.getElementById('quiz-btn-prev'),
      btnNext: document.getElementById('quiz-btn-next'),
      btnRetry: document.getElementById('quiz-btn-retry'),
      btnReset: document.getElementById('quiz-btn-reset'),
      btnDynamic: document.getElementById('quiz-btn-dynamic'),
      statAttempted: document.getElementById('quiz-stat-attempted'),
      statCorrect: document.getElementById('quiz-stat-correct'),
      statAccuracy: document.getElementById('quiz-stat-accuracy'),
      statTotal: document.getElementById('quiz-stat-total')
    };

    if (!dom.container) return;

    bindEvents();
    renderCurrentQuestion();
    updateStatsHUD();
  }

  function bindEvents() {
    if (dom.categoryFilterGroup) {
      dom.categoryFilterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-category]');
        if (btn) {
          const cat = btn.getAttribute('data-category');
          setCategory(cat);
        }
      });
    }

    if (dom.btnPrev) dom.btnPrev.addEventListener('click', handlePrev);
    if (dom.btnNext) dom.btnNext.addEventListener('click', handleNext);
    if (dom.btnRetry) dom.btnRetry.addEventListener('click', handleRetry);
    if (dom.btnReset) dom.btnReset.addEventListener('click', handleReset);
    if (dom.btnDynamic) dom.btnDynamic.addEventListener('click', generateDynamicProblem);
  }

  function onEnter() {
    renderCurrentQuestion();
    updateStatsHUD();
  }

  function getFilteredQuestions() {
    if (currentCategory === 'all') return questions;
    return questions.filter(q => q.category === currentCategory);
  }

  function setCategory(cat) {
    currentCategory = cat;
    currentIndex = 0;

    const pills = dom.categoryFilterGroup.querySelectorAll('.quiz-filter-pill');
    pills.forEach(p => {
      if (p.getAttribute('data-category') === cat) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    renderCurrentQuestion();
  }

  function handlePrev() {
    if (currentIndex > 0) {
      currentIndex--;
      renderCurrentQuestion();
    }
  }

  function handleNext() {
    const list = getFilteredQuestions();
    if (currentIndex < list.length - 1) {
      currentIndex++;
      renderCurrentQuestion();
    }
  }

  function handleRetry() {
    const list = getFilteredQuestions();
    const q = list[currentIndex];
    if (!q) return;

    delete userAnswers[q.id];
    // Re-render question in fresh state
    renderCurrentQuestion();
  }

  function handleReset() {
    questions = [...STATIC_QUESTIONS];
    userAnswers = {};
    answeredQuestions.clear();
    score = 0;
    totalAttempted = 0;
    currentIndex = 0;
    renderCurrentQuestion();
    updateStatsHUD();

    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Quiz Practice Reset! 🔄',
        message: 'Scores, attempts, and question state have been reset.'
      });
    }
  }

  /**
   * Real Parameterized Dynamic Problem Generator
   * Generates mathematical and automata questions with real-time computed answers!
   */
  function generateDynamicProblem() {
    const activeCat = (currentCategory === 'all') 
      ? ['daa', 'coa', 'flat'][Math.floor(Math.random() * 3)] 
      : currentCategory;

    let newQ = null;
    const dynamicId = `dyn-${Date.now()}`;

    if (activeCat === 'daa') {
      // Dynamic DAA: Random array size N between 50 and 2000
      const N = Math.floor(Math.random() * 1950) + 50;
      const worstCase = Math.floor(Math.log2(N)) + 1;
      newQ = {
        id: dynamicId,
        category: 'daa',
        categoryLabel: 'DAA: Dynamic Parameterized',
        type: 'input',
        isDynamic: true,
        question: `[Generated] For an array of size N = ${N}, calculate the exact worst-case maximum comparisons in Binary Search using ⌊log₂ N⌋ + 1:`,
        placeholder: 'Enter integer...',
        correctAnswer: String(worstCase),
        explanation: `For N = ${N}: log₂(${N}) ≈ ${Math.log2(N).toFixed(3)}. ⌊log₂ ${N}⌋ + 1 = ${Math.floor(Math.log2(N))} + 1 = ${worstCase} comparisons maximum.`
      };
    } else if (activeCat === 'coa') {
      // Dynamic COA: Random integer between 5 and 250
      const dec = Math.floor(Math.random() * 245) + 5;
      const hex = dec.toString(16).toUpperCase();
      newQ = {
        id: dynamicId,
        category: 'coa',
        categoryLabel: 'COA: Dynamic Parameterized',
        type: 'input',
        isDynamic: true,
        question: `[Generated] Convert decimal integer ${dec} into Hexadecimal notation (Base 16):`,
        placeholder: 'Enter hex value (e.g. 1A, FF)...',
        correctAnswer: hex,
        caseInsensitive: true,
        explanation: `Decimal ${dec} ÷ 16 = ${Math.floor(dec / 16)} remainder ${dec % 16} (${hex.slice(-1)}). Result: 0x${hex}.`
      };
    } else {
      // Dynamic FLAT: Random binary string of length 4 to 6
      const len = Math.floor(Math.random() * 3) + 4;
      let binStr = '';
      for (let i = 0; i < len; i++) {
        binStr += Math.random() < 0.5 ? '0' : '1';
      }
      const endsIn01 = binStr.endsWith('01');
      newQ = {
        id: dynamicId,
        category: 'flat',
        categoryLabel: 'FLAT: Dynamic Parameterized',
        type: 'input',
        isDynamic: true,
        question: `[Generated] For language L = { w | w ends in "01" }, determine if binary string "${binStr}" will be ACCEPTED or REJECTED:`,
        placeholder: 'Type accepted or rejected...',
        correctAnswer: endsIn01 ? 'accepted' : 'rejected',
        caseInsensitive: true,
        explanation: `String "${binStr}" ends with "${binStr.slice(-2)}". Because it ${endsIn01 ? 'ends in "01"' : 'does NOT end in "01"'}, the automaton halts in state ${endsIn01 ? 'q2 (Accept)' : (binStr.endsWith('0') ? 'q1' : 'q0')} and is ${endsIn01 ? 'ACCEPTED' : 'REJECTED'}.`
      };
    }

    questions.unshift(newQ);
    currentIndex = 0;
    renderCurrentQuestion();
    updateStatsHUD();

    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'success',
        title: 'Dynamic Problem Generated! ⚡',
        message: `Created a brand-new parameterized ${activeCat.toUpperCase()} question with live JS verification.`,
        badges: [
          { label: 'Category', value: activeCat.toUpperCase() },
          { label: 'Dynamic Mode', value: 'Live Math' }
        ]
      });
    }
  }

  function renderCurrentQuestion() {
    const list = getFilteredQuestions();
    if (list.length === 0) {
      dom.cardContainer.innerHTML = `
        <div class="empty-state">
          <h4>No Questions Available</h4>
          <p>No questions found in this category.</p>
        </div>
      `;
      return;
    }

    if (currentIndex >= list.length) currentIndex = list.length - 1;
    if (currentIndex < 0) currentIndex = 0;

    const q = list[currentIndex];
    const isAnswered = (userAnswers[q.id] !== undefined);
    const userAnswer = userAnswers[q.id];

    // Update navigation controls
    if (dom.btnPrev) dom.btnPrev.disabled = (currentIndex === 0);
    if (dom.btnNext) dom.btnNext.disabled = (currentIndex === list.length - 1);
    if (dom.progressText) dom.progressText.textContent = `Question ${currentIndex + 1} of ${list.length}`;
    if (dom.btnRetry) dom.btnRetry.style.display = isAnswered ? 'inline-flex' : 'none';

    let cardHtml = `
      <div class="quiz-card" id="quiz-card-${q.id}">
        <div class="quiz-card-header">
          <span class="quiz-category-tag ${q.category}">
            ${q.categoryLabel}
          </span>
          ${q.isDynamic ? '<span class="badge-tag-success">⚡ Dynamic Generated</span>' : ''}
          <span class="quiz-qnum">#${currentIndex + 1}</span>
        </div>

        <h3 class="quiz-question-title">${q.question}</h3>
    `;

    if (q.type === 'mcq') {
      cardHtml += `<div class="quiz-options-list">`;
      q.options.forEach((opt, idx) => {
        let optCls = 'quiz-option-btn';
        if (isAnswered) {
          if (idx === q.correctIndex) {
            optCls += ' is-correct';
          } else if (idx === userAnswer) {
            optCls += ' is-wrong';
          }
        }

        const disabledAttr = isAnswered ? 'disabled' : '';
        cardHtml += `
          <button class="${optCls}" type="button" data-option-index="${idx}" ${disabledAttr}>
            <span class="quiz-option-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="quiz-option-text">${opt}</span>
          </button>
        `;
      });
      cardHtml += `</div>`;
    } else if (q.type === 'input') {
      let isCorrect = false;
      if (isAnswered) {
        isCorrect = evaluateInputAnswer(userAnswer, q);
      }

      cardHtml += `
        <div class="quiz-input-section" style="margin-top: 1rem;">
          <div class="input-with-button" style="max-width: 480px;">
            <input id="quiz-text-answer" class="input-control font-mono ${isAnswered ? (isCorrect ? 'is-valid' : 'is-invalid') : ''}" 
                   type="text" placeholder="${q.placeholder || 'Enter your answer...'}" 
                   value="${isAnswered ? userAnswer : ''}" 
                   ${isAnswered ? 'disabled' : ''} autocomplete="off">
            ${!isAnswered ? '<button id="quiz-btn-submit-input" class="btn btn-primary" type="button">Submit</button>' : ''}
          </div>
        </div>
      `;
    }

    // Explanation banner
    if (isAnswered) {
      let isCorrect = false;
      if (q.type === 'mcq') {
        isCorrect = (userAnswer === q.correctIndex);
      } else {
        isCorrect = evaluateInputAnswer(userAnswer, q);
      }

      cardHtml += `
        <div class="quiz-explanation-box ${isCorrect ? 'correct' : 'wrong'}">
          <div class="explanation-title">
            ${isCorrect ? '✓ Correct Answer!' : '✖ Incorrect Answer'}
          </div>
          <p class="explanation-text">${q.explanation}</p>
        </div>
      `;
    }

    cardHtml += `</div>`;
    dom.cardContainer.innerHTML = cardHtml;

    // Attach option listeners
    if (q.type === 'mcq' && !isAnswered) {
      const optionBtns = dom.cardContainer.querySelectorAll('.quiz-option-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const optIdx = parseInt(btn.getAttribute('data-option-index'), 10);
          handleAnswerSelect(q, optIdx);
        });
      });
    } else if (q.type === 'input' && !isAnswered) {
      const submitBtn = document.getElementById('quiz-btn-submit-input');
      const inputEl = document.getElementById('quiz-text-answer');
      if (submitBtn && inputEl) {
        submitBtn.addEventListener('click', () => {
          const val = inputEl.value.trim();
          if (val) handleAnswerSelect(q, val);
        });
        inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const val = inputEl.value.trim();
            if (val) handleAnswerSelect(q, val);
          }
        });
      }
    }
  }

  function evaluateInputAnswer(userVal, q) {
    if (!userVal) return false;
    let cleanUser = userVal.trim();
    let cleanCorrect = q.correctAnswer.trim();

    if (q.cleanSpaces) {
      cleanUser = cleanUser.replace(/\s+/g, '');
      cleanCorrect = cleanCorrect.replace(/\s+/g, '');
    }

    if (q.caseInsensitive) {
      return cleanUser.toLowerCase() === cleanCorrect.toLowerCase();
    }
    return cleanUser === cleanCorrect;
  }

  function handleAnswerSelect(q, answer) {
    userAnswers[q.id] = answer;

    let isCorrect = false;
    if (q.type === 'mcq') {
      isCorrect = (answer === q.correctIndex);
    } else {
      isCorrect = evaluateInputAnswer(answer, q);
    }

    // Only update total attempted and score if this question hasn't been answered before
    if (!answeredQuestions.has(q.id)) {
      answeredQuestions.add(q.id);
      totalAttempted++;
      if (isCorrect) score++;

      // Record verified quiz progress into persistent storage (Schema v2)
      if (typeof Storage !== 'undefined' && Storage.recordQuizAttempt) {
        const subjectTag = (currentCategory === 'all') ? (q.category || 'all') : currentCategory;
        Storage.recordQuizAttempt(subjectTag, score, totalAttempted);
      }
    }

    renderCurrentQuestion();
    updateStatsHUD();

    if (typeof App !== 'undefined' && App.showPopup) {
      if (isCorrect) {
        App.showPopup({
          type: 'success',
          title: 'Correct Answer! 🎉',
          message: 'Excellent conceptual grasp! Review the explanation below.'
        });
      } else {
        App.showPopup({
          type: 'error',
          title: 'Not Quite! 💡',
          message: 'Incorrect answer. Review the concept breakdown or click Retry.'
        });
      }
    }
  }

  function updateStatsHUD() {
    if (dom.scoreBadge) {
      dom.scoreBadge.textContent = `Score: ${score} / ${totalAttempted}`;
    }
    if (dom.statAttempted) {
      dom.statAttempted.textContent = String(totalAttempted);
    }
    if (dom.statCorrect) {
      dom.statCorrect.textContent = String(score);
    }
    if (dom.statAccuracy) {
      const acc = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;
      dom.statAccuracy.textContent = `${acc}%`;
    }
    if (dom.statTotal) {
      dom.statTotal.textContent = `${questions.length}`;
    }
  }

  return {
    init,
    onEnter,
    generateDynamicProblem
  };
})();
