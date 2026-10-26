/**
 * ConceptLab — Computer Science Concepts Playground
 * Upgraded Practice Arena & Conceptual Verification Engine (js/quiz.js)
 * 
 * Implements the full 5-step interactive assessment journey:
 * 1. Practice Dashboard: Real question bank totals, genuine attempt telemetry, XP & achievements.
 * 2. Select a Subject: DAA, COA, FLAT with exact MCQ/Subjective counts & learning objectives.
 * 3. Select Difficulty: Beginner, Intermediate, Advanced, All Levels.
 * 4. Choose Question Format: MCQ Practice, Subjective Practice, or deterministic Mixed Practice.
 * 5. Session Summary & Execution: Progressive 6-stage pedagogy, 2-tier progressive hints,
 *    transparent multi-criteria subjective rubrics, distractor analysis, session persistence,
 *    and comprehensive results review.
 * 
 * Vanilla JavaScript. Zero external dependencies.
 */

var QuizLab = (() => {
  'use strict';

  // State Management
  let currentView = 'dashboard'; // 'dashboard' | 'subject-select' | 'config' | 'session' | 'results'
  let selectedSubject = 'daa'; // 'daa' | 'coa' | 'flat'
  let selectedDifficulty = 'all'; // 'all' | 'beginner' | 'intermediate' | 'advanced'
  let selectedFormat = 'mixed'; // 'mixed' | 'mcq' | 'subjective'
  let hintsEnabled = true;

  let activeSession = null;
  let lastCompletedSession = null;
  let activeReviewFilter = 'all'; // 'all' | 'correct' | 'incorrect'

  // Temporary selection for MCQ before user submits
  let stagedOptionIndex = null;

  // DOM Elements Cache
  let dom = {};

  function init() {
    cacheDomElements();
    bindEventListeners();
    restoreOrCheckActiveSession();
    renderDashboard();
  }

  function onEnter() {
    restoreOrCheckActiveSession();
    if (activeSession && !activeSession.completed) {
      renderDashboard();
    } else if (currentView === 'dashboard') {
      renderDashboard();
    }
  }

  function cacheDomElements() {
    dom = {
      container: document.getElementById('quiz-lab-container'),
      
      // Views
      viewDashboard: document.getElementById('practice-view-dashboard'),
      viewSubjectSelect: document.getElementById('practice-view-subject-select'),
      viewConfig: document.getElementById('practice-view-config'),
      viewSession: document.getElementById('practice-view-session'),
      viewResults: document.getElementById('practice-view-results'),

      // Dashboard View Elements
      resumeCard: document.getElementById('practice-resume-card'),
      resumeTitle: document.getElementById('practice-resume-title'),
      resumeMeta: document.getElementById('practice-resume-meta'),
      btnResume: document.getElementById('practice-btn-resume'),
      btnDiscardSession: document.getElementById('practice-btn-discard-session'),
      statTotal: document.getElementById('practice-stat-total'),
      statAttempted: document.getElementById('practice-stat-attempted'),
      statAccuracy: document.getElementById('practice-stat-accuracy'),
      statXp: document.getElementById('practice-stat-xp'),
      statAchievements: document.getElementById('practice-stat-achievements'),
      btnStartLearning: document.getElementById('practice-btn-start-learning'),
      btnContinueBottom: document.getElementById('practice-btn-continue-bottom'),
      historyList: document.getElementById('practice-history-list'),

      // Subject Select View Elements
      btnBackToDash: document.getElementById('practice-btn-back-to-dash'),

      // Config View Elements
      btnBackToSubjects: document.getElementById('practice-btn-back-to-subjects'),
      configBannerSubject: document.getElementById('config-banner-subject-name'),
      configBannerCount: document.getElementById('config-banner-count'),
      configHintsToggle: document.getElementById('config-hints-toggle'),
      summarySubject: document.getElementById('summary-subject-val'),
      summaryDiff: document.getElementById('summary-diff-val'),
      summaryFormat: document.getElementById('summary-format-val'),
      summaryCount: document.getElementById('summary-count-val'),
      summaryDuration: document.getElementById('summary-duration-val'),
      btnBeginSession: document.getElementById('practice-btn-begin-session'),

      // Session View Elements
      badgeSubject: document.getElementById('session-badge-subject'),
      badgeStage: document.getElementById('session-badge-stage'),
      badgeDifficulty: document.getElementById('session-badge-difficulty'),
      questionCounter: document.getElementById('session-question-counter'),
      pointsPill: document.getElementById('session-points-pill'),
      btnPause: document.getElementById('session-btn-pause'),
      progressBar: document.getElementById('session-progress-bar'),
      questionContainer: document.getElementById('session-question-container'),
      keyboardHintText: document.getElementById('session-keyboard-hint-text'),

      // Results View Elements
      resultsHeroIcon: document.getElementById('results-hero-icon'),
      resultsHeroTitle: document.getElementById('results-hero-title'),
      resultsHeroSubtitle: document.getElementById('results-hero-subtitle'),
      resultsScore: document.getElementById('results-metric-score'),
      resultsAccuracy: document.getElementById('results-metric-accuracy'),
      resultsAccuracySub: document.getElementById('results-metric-accuracy-sub'),
      resultsXp: document.getElementById('results-metric-xp'),
      resultsTime: document.getElementById('results-metric-time'),
      resultsStageBreakdown: document.getElementById('results-stage-breakdown'),
      resultsReviewFeed: document.getElementById('results-review-feed'),
      btnAgain: document.getElementById('results-btn-again'),
      btnDashboard: document.getElementById('results-btn-dashboard'),
      filterAll: document.getElementById('review-filter-all'),
      filterCorrect: document.getElementById('review-filter-correct'),
      filterIncorrect: document.getElementById('review-filter-incorrect'),

      // Pause/Exit Modal Elements
      exitModal: document.getElementById('practice-exit-modal'),
      exitModalStatus: document.getElementById('exit-modal-status-text'),
      modalBtnResume: document.getElementById('practice-modal-btn-resume'),
      modalBtnSaveExit: document.getElementById('practice-modal-btn-save-exit'),
      modalBtnAbandon: document.getElementById('practice-modal-btn-abandon')
    };
  }

  function bindEventListeners() {
    // Navigation / Dashboard
    if (dom.btnStartLearning) {
      dom.btnStartLearning.addEventListener('click', () => switchView('subject-select'));
    }
    if (dom.btnContinueBottom) {
      dom.btnContinueBottom.addEventListener('click', resumeActiveSession);
    }
    if (dom.btnResume) {
      dom.btnResume.addEventListener('click', resumeActiveSession);
    }
    if (dom.btnDiscardSession) {
      dom.btnDiscardSession.addEventListener('click', discardActiveSession);
    }

    // Subject Select
    if (dom.btnBackToDash) {
      dom.btnBackToDash.addEventListener('click', () => switchView('dashboard'));
    }
    const chooseSubjectBtns = document.querySelectorAll('.practice-btn-choose-subject, .subject-select-card');
    chooseSubjectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sub = btn.getAttribute('data-subject');
        if (sub) {
          selectSubject(sub);
        }
      });
    });

    // Config View
    if (dom.btnBackToSubjects) {
      dom.btnBackToSubjects.addEventListener('click', () => switchView('subject-select'));
    }
    const diffButtons = document.querySelectorAll('.difficulty-option-card');
    diffButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        diffButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDifficulty = btn.getAttribute('data-difficulty');
        updateConfigSummary();
      });
    });

    const formatButtons = document.querySelectorAll('.format-option-card');
    formatButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        formatButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedFormat = btn.getAttribute('data-format');
        updateConfigSummary();
      });
    });

    if (dom.configHintsToggle) {
      dom.configHintsToggle.addEventListener('change', () => {
        hintsEnabled = dom.configHintsToggle.checked;
      });
    }

    if (dom.btnBeginSession) {
      dom.btnBeginSession.addEventListener('click', startNewSession);
    }

    // Session View Controls
    if (dom.btnPause) {
      dom.btnPause.addEventListener('click', openExitModal);
    }

    // Modal Controls
    if (dom.modalBtnResume) {
      dom.modalBtnResume.addEventListener('click', closeExitModal);
    }
    if (dom.modalBtnSaveExit) {
      dom.modalBtnSaveExit.addEventListener('click', () => {
        closeExitModal();
        if (activeSession && typeof Storage !== 'undefined') {
          Storage.savePracticeSession(activeSession);
        }
        switchView('dashboard');
      });
    }
    if (dom.modalBtnAbandon) {
      dom.modalBtnAbandon.addEventListener('click', () => {
        closeExitModal();
        discardActiveSession();
      });
    }

    // Results View Controls
    if (dom.btnAgain) {
      dom.btnAgain.addEventListener('click', () => switchView('config'));
    }
    if (dom.btnDashboard) {
      dom.btnDashboard.addEventListener('click', () => switchView('dashboard'));
    }

    // Results Review Filters
    if (dom.filterAll) {
      dom.filterAll.addEventListener('click', () => setReviewFilter('all'));
    }
    if (dom.filterCorrect) {
      dom.filterCorrect.addEventListener('click', () => setReviewFilter('correct'));
    }
    if (dom.filterIncorrect) {
      dom.filterIncorrect.addEventListener('click', () => setReviewFilter('incorrect'));
    }

    // Global Keyboard listener for Session shortcuts
    document.addEventListener('keydown', handleGlobalKeydown);
  }

  function handleGlobalKeydown(e) {
    if (currentView !== 'session' || !activeSession || activeSession.completed) return;

    // Do not trigger shortcuts when typing inside a textarea or text input
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'textarea' || (tag === 'input' && e.target.type === 'text')) {
      if (e.key === 'Escape') {
        openExitModal();
      }
      return;
    }

    const currentQ = activeSession.questions[activeSession.currentIndex];
    const isAnswered = !!activeSession.userAnswers[currentQ.id];

    if (e.key === 'Escape') {
      openExitModal();
      return;
    }

    if (currentQ.type === 'mcq' && !isAnswered) {
      // Keys 1, 2, 3, 4 or A, B, C, D
      let optIdx = -1;
      if (['1', '2', '3', '4'].includes(e.key)) {
        optIdx = parseInt(e.key, 10) - 1;
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        optIdx = e.key.toLowerCase().charCodeAt(0) - 97;
      }

      if (optIdx >= 0 && optIdx < currentQ.options.length) {
        e.preventDefault();
        selectMcqOption(optIdx);
      } else if (e.key === 'Enter' && stagedOptionIndex !== null) {
        e.preventDefault();
        submitMcqAnswer();
      }
    } else if (isAnswered) {
      // Space or ArrowRight or Enter to advance
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        goToNextQuestion();
      }
    }
  }

  // --- View Switching Engine ---

  function switchView(viewName) {
    currentView = viewName;
    const views = [
      dom.viewDashboard,
      dom.viewSubjectSelect,
      dom.viewConfig,
      dom.viewSession,
      dom.viewResults
    ];
    views.forEach(v => {
      if (v) v.style.display = 'none';
    });

    if (viewName === 'dashboard') {
      if (dom.viewDashboard) dom.viewDashboard.style.display = 'block';
      renderDashboard();
    } else if (viewName === 'subject-select') {
      if (dom.viewSubjectSelect) dom.viewSubjectSelect.style.display = 'block';
      renderSubjectSelect();
    } else if (viewName === 'config') {
      if (dom.viewConfig) dom.viewConfig.style.display = 'block';
      renderConfig();
    } else if (viewName === 'session') {
      if (dom.viewSession) dom.viewSession.style.display = 'block';
      renderSession();
    } else if (viewName === 'results') {
      if (dom.viewResults) dom.viewResults.style.display = 'block';
      renderResults();
    }
  }

  // --- Session Persistence & Restoration ---

  function restoreOrCheckActiveSession() {
    if (typeof Storage === 'undefined') return;
    const saved = Storage.getPracticeSession();
    if (saved && Array.isArray(saved.questions) && saved.questions.length > 0 && !saved.completed) {
      activeSession = saved;
    } else {
      activeSession = null;
    }
  }

  function resumeActiveSession() {
    restoreOrCheckActiveSession();
    if (activeSession) {
      selectedSubject = activeSession.subject || 'daa';
      selectedDifficulty = activeSession.difficulty || 'all';
      selectedFormat = activeSession.format || 'mixed';
      hintsEnabled = activeSession.hintsEnabled !== false;
      switchView('session');
    }
  }

  function discardActiveSession() {
    activeSession = null;
    stagedOptionIndex = null;
    if (typeof Storage !== 'undefined') {
      Storage.clearPracticeSession();
    }
    renderDashboard();
    if (typeof App !== 'undefined' && App.showPopup) {
      App.showPopup({
        type: 'info',
        title: 'Session Discarded',
        message: 'Unfinished practice session has been cleared.'
      });
    }
  }

  // --- Step 1: Practice Dashboard Rendering ---

  function renderDashboard() {
    restoreOrCheckActiveSession();

    // Actual bank size
    const allQuestions = typeof QuizQuestions !== 'undefined' ? QuizQuestions.getAllQuestions() : [];
    if (dom.statTotal) dom.statTotal.textContent = String(allQuestions.length || 42);

    // Retrieve genuine telemetry from Storage
    let stats = {
      questionsAttempted: 0,
      accuracy: 0,
      totalXP: 0,
      unlockedAchievementsCount: 0,
      totalAchievementsAvailable: 8
    };

    if (typeof Storage !== 'undefined' && Storage.getDashboardStats) {
      stats = Storage.getDashboardStats();
    }

    if (dom.statAttempted) dom.statAttempted.textContent = String(stats.questionsAttempted);
    if (dom.statAccuracy) dom.statAccuracy.textContent = `${stats.accuracy}%`;
    if (dom.statXp) dom.statXp.textContent = `${stats.totalXP} XP`;
    if (dom.statAchievements) dom.statAchievements.textContent = `${stats.unlockedAchievementsCount} / ${stats.totalAchievementsAvailable}`;

    // Handle Unfinished Session Banner
    if (activeSession && !activeSession.completed) {
      if (dom.resumeCard) dom.resumeCard.style.display = 'flex';
      if (dom.btnContinueBottom) dom.btnContinueBottom.style.display = 'inline-flex';

      const subjectMeta = typeof QuizQuestions !== 'undefined' ? QuizQuestions.getSubject(activeSession.subject) : null;
      const subName = subjectMeta ? subjectMeta.shortName : activeSession.subject.toUpperCase();

      if (dom.resumeTitle) dom.resumeTitle.textContent = `${subName} — ${activeSession.format.toUpperCase()} Practice`;
      if (dom.resumeMeta) {
        const answeredCount = Object.keys(activeSession.userAnswers || {}).length;
        dom.resumeMeta.textContent = `Progress: Question ${activeSession.currentIndex + 1} of ${activeSession.questions.length} • ${answeredCount} answered`;
      }
    } else {
      if (dom.resumeCard) dom.resumeCard.style.display = 'none';
      if (dom.btnContinueBottom) dom.btnContinueBottom.style.display = 'none';
    }

    // Render Recent Practice History
    renderHistoryList();
  }

  function renderHistoryList() {
    if (!dom.historyList) return;

    let attempts = [];
    if (typeof Storage !== 'undefined') {
      const state = Storage.getState();
      attempts = state.practiceAttempts && state.practiceAttempts.length > 0 
        ? state.practiceAttempts 
        : (state.quizAttempts || []);
    }

    if (!attempts || attempts.length === 0) {
      dom.historyList.innerHTML = `
        <div class="practice-empty-state">
          <div class="empty-state-icon">🎯</div>
          <h4 class="empty-state-title">No Practice Attempts Recorded Yet</h4>
          <p class="empty-state-desc">
            Your verified practice history is completely empty. Click <strong>Start Learning</strong> above to choose a subject, take an interactive assessment, and test your conceptual mastery!
          </p>
        </div>
      `;
      return;
    }

    let html = '';
    attempts.slice(0, 5).forEach(att => {
      const sub = (att.subject || att.quizId || 'all').toLowerCase();
      const accuracy = att.accuracy !== undefined ? att.accuracy : (att.maxScore > 0 ? Math.round((att.score / att.maxScore) * 100) : 0);
      const isExcellence = accuracy >= 80;
      const dateStr = att.dateStr || 'Recent';

      html += `
        <div class="practice-history-card">
          <div class="history-card-left">
            <span class="subject-code-tag ${sub}">${sub.toUpperCase()}</span>
            <div class="history-card-details">
              <h5 class="history-card-title">${formatSubjectTitle(sub)} Practice</h5>
              <span class="history-card-meta">${dateStr} • Format: ${att.format || 'Mixed'}</span>
            </div>
          </div>
          <div class="history-card-right">
            <div class="history-score-box">
              <span class="history-score-val font-mono">${att.score} / ${att.maxScore}</span>
              <span class="history-accuracy-pill ${isExcellence ? 'high' : 'normal'}">${accuracy}%</span>
            </div>
          </div>
        </div>
      `;
    });

    dom.historyList.innerHTML = html;
  }

  function formatSubjectTitle(subject) {
    if (subject === 'daa') return 'DAA: Algorithms';
    if (subject === 'coa') return 'COA: Number Systems';
    if (subject === 'flat') return 'FLAT: Automata Theory';
    return subject.toUpperCase();
  }

  // --- Step 2: Subject Selection ---

  function renderSubjectSelect() {
    if (typeof QuizQuestions === 'undefined') return;

    ['daa', 'coa', 'flat'].forEach(subId => {
      const qs = QuizQuestions.getQuestionsBySubject(subId);
      const card = document.querySelector(`.subject-select-card[data-subject="${subId}"]`);
      if (card) {
        const mcqCount = qs.filter(q => q.type === 'mcq').length;
        const subjCount = qs.filter(q => q.type === 'subjective').length;
        const totalCount = qs.length;

        const tallies = card.querySelectorAll('.tally-num');
        if (tallies.length >= 3) {
          tallies[0].textContent = String(mcqCount);
          tallies[1].textContent = String(subjCount);
          tallies[2].textContent = String(totalCount);
        }
      }
    });
  }

  function selectSubject(subjectId) {
    selectedSubject = subjectId;
    switchView('config');
  }

  // --- Steps 3, 4, 5: Configuration & Session Summary ---

  function renderConfig() {
    if (typeof QuizQuestions === 'undefined') return;

    const sub = QuizQuestions.getSubject(selectedSubject);
    if (dom.configBannerSubject && sub) {
      dom.configBannerSubject.textContent = sub.name;
    }
    const allForSubject = QuizQuestions.getQuestionsBySubject(selectedSubject);
    if (dom.configBannerCount) {
      dom.configBannerCount.textContent = `${allForSubject.length} Questions in Bank`;
    }

    updateConfigSummary();
  }

  function updateConfigSummary() {
    if (typeof QuizQuestions === 'undefined') return;

    const sub = QuizQuestions.getSubject(selectedSubject);
    const eligibleQuestions = QuizQuestions.buildSessionQuestions(selectedSubject, selectedDifficulty, selectedFormat, 10);
    const count = eligibleQuestions.length;

    if (dom.summarySubject && sub) dom.summarySubject.textContent = `${sub.shortName} (${sub.title})`;
    if (dom.summaryDiff) {
      dom.summaryDiff.textContent = selectedDifficulty === 'all' ? 'All Levels' : selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
    }
    if (dom.summaryFormat) {
      if (selectedFormat === 'mixed') dom.summaryFormat.textContent = 'Mixed Practice (Deterministic)';
      else if (selectedFormat === 'mcq') dom.summaryFormat.textContent = 'MCQ Practice (Objective)';
      else dom.summaryFormat.textContent = 'Subjective Practice (Rubric)';
    }
    if (dom.summaryCount) {
      dom.summaryCount.textContent = `${count} Question${count !== 1 ? 's' : ''}`;
    }
    if (dom.summaryDuration) {
      const minutes = Math.max(3, Math.round(count * 1.5));
      dom.summaryDuration.textContent = `~${minutes} Mins`;
    }
  }

  // --- Step 5: Start & Run Session ---

  function startNewSession() {
    if (typeof QuizQuestions === 'undefined') return;

    const questions = QuizQuestions.buildSessionQuestions(selectedSubject, selectedDifficulty, selectedFormat, 10);
    if (!questions || questions.length === 0) {
      if (typeof App !== 'undefined' && App.showPopup) {
        App.showPopup({
          type: 'warning',
          title: 'No Questions Found',
          message: 'No questions matched the selected filters. Please choose another difficulty or format.'
        });
      }
      return;
    }

    activeSession = {
      id: 'session_' + Date.now(),
      subject: selectedSubject,
      difficulty: selectedDifficulty,
      format: selectedFormat,
      hintsEnabled: dom.configHintsToggle ? dom.configHintsToggle.checked : true,
      questions: questions,
      currentIndex: 0,
      userAnswers: {},
      revealedHints: {},
      startedAt: Date.now(),
      completed: false
    };

    stagedOptionIndex = null;

    if (typeof Storage !== 'undefined') {
      Storage.savePracticeSession(activeSession);
    }

    switchView('session');
  }

  // --- View 4: Active Session Rendering ---

  function renderSession() {
    if (!activeSession || !activeSession.questions || activeSession.questions.length === 0) {
      switchView('dashboard');
      return;
    }

    const total = activeSession.questions.length;
    const currIdx = activeSession.currentIndex;
    const currentQ = activeSession.questions[currIdx];

    if (!currentQ) {
      finishSession();
      return;
    }

    // Top Header Status
    if (dom.badgeSubject) {
      dom.badgeSubject.className = `subject-code-tag ${activeSession.subject}`;
      dom.badgeSubject.textContent = activeSession.subject.toUpperCase();
    }
    if (dom.badgeStage) {
      const stageName = currentQ.learningStage ? currentQ.learningStage.charAt(0).toUpperCase() + currentQ.learningStage.slice(1) : 'Practice';
      dom.badgeStage.className = `stage-tag ${currentQ.learningStage || 'fundamentals'}`;
      dom.badgeStage.textContent = `Stage ${getStageNumber(currentQ.learningStage)}: ${stageName}`;
    }
    if (dom.badgeDifficulty) {
      dom.badgeDifficulty.className = `difficulty-pill ${currentQ.difficulty}`;
      dom.badgeDifficulty.textContent = currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1);
    }
    if (dom.questionCounter) {
      dom.questionCounter.textContent = `Question ${currIdx + 1} of ${total}`;
    }
    if (dom.pointsPill) {
      const pts = currentQ.points || (currentQ.type === 'mcq' ? 1 : 5);
      dom.pointsPill.textContent = `${pts} Point${pts !== 1 ? 's' : ''}`;
    }
    if (dom.progressBar) {
      const pct = Math.round(((currIdx + 1) / total) * 100);
      dom.progressBar.style.width = `${pct}%`;
    }

    // Render Question Body
    renderQuestionCard(currentQ);

    // Update Keyboard Tip
    if (dom.keyboardHintText) {
      if (currentQ.type === 'mcq') {
        dom.keyboardHintText.innerHTML = `Shortcuts: Press <kbd>1</kbd>–<kbd>4</kbd> or <kbd>A</kbd>–<kbd>D</kbd> to select, <kbd>Enter</kbd> to submit, <kbd>Esc</kbd> to pause.`;
      } else {
        dom.keyboardHintText.innerHTML = `Type your solution thoroughly. Press <kbd>Esc</kbd> to pause session.`;
      }
    }
  }

  function getStageNumber(stage) {
    const stages = ['fundamentals', 'understanding', 'application', 'tracing', 'analysis', 'challenge'];
    const idx = stages.indexOf(stage);
    return idx >= 0 ? idx + 1 : 1;
  }

  function renderQuestionCard(q) {
    if (!dom.questionContainer) return;

    const isAnswered = !!activeSession.userAnswers[q.id];
    const answerRecord = activeSession.userAnswers[q.id] || null;

    let cardHtml = `
      <div class="session-card" id="session-card-${q.id}">
        <!-- Question Meta & Topic -->
        <div class="session-card-header">
          <div class="question-topic-badge">Topic: ${escapeHtml(q.topic || q.subject.toUpperCase())}</div>
          <div class="question-type-badge">${q.type === 'mcq' ? 'Multiple Choice' : 'Subjective Written'}</div>
        </div>

        <!-- Question Prompt -->
        <h3 class="session-question-title">${formatQuestionText(q.question)}</h3>
    `;

    // Progressive Hints Section
    if (activeSession.hintsEnabled && Array.isArray(q.hints) && q.hints.length > 0) {
      const hintState = activeSession.revealedHints[q.id] || { tier1: false, tier2: false };
      cardHtml += `
        <div class="hints-accordion">
          <div class="hint-tier-box">
            <button class="hint-toggle-btn ${hintState.tier1 ? 'revealed' : ''}" type="button" data-hint-tier="1" ${hintState.tier1 ? 'disabled' : ''}>
              <span class="hint-icon">💡</span>
              <span class="hint-btn-text">${hintState.tier1 ? 'Tier 1 Hint (Revealed):' : 'Reveal Tier 1 Hint (Guiding Clue)'}</span>
            </button>
            <div class="hint-content" style="display: ${hintState.tier1 ? 'block' : 'none'};">
              ${escapeHtml(q.hints[0] || '')}
            </div>
          </div>

          ${q.hints[1] ? `
            <div class="hint-tier-box" style="margin-top: 0.5rem;">
              <button class="hint-toggle-btn ${hintState.tier2 ? 'revealed' : ''}" type="button" data-hint-tier="2" ${(!hintState.tier1 || hintState.tier2) ? 'disabled' : ''}>
                <span class="hint-icon">🔑</span>
                <span class="hint-btn-text">${hintState.tier2 ? 'Tier 2 Hint (Revealed):' : 'Reveal Tier 2 Hint (Formula / Key Concept)'}</span>
              </button>
              <div class="hint-content" style="display: ${hintState.tier2 ? 'block' : 'none'};">
                ${escapeHtml(q.hints[1] || '')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // MCQ or Subjective Interface
    if (q.type === 'mcq') {
      cardHtml += renderMcqInterface(q, isAnswered, answerRecord);
    } else {
      cardHtml += renderSubjectiveInterface(q, isAnswered, answerRecord);
    }

    cardHtml += `</div>`;
    dom.questionContainer.innerHTML = cardHtml;

    // Attach Event Handlers for active question
    attachQuestionInteractions(q, isAnswered);
  }

  // --- MCQ Interface ---

  function renderMcqInterface(q, isAnswered, answerRecord) {
    let html = `<div class="mcq-options-container">`;

    q.options.forEach((opt, idx) => {
      let optionClass = 'mcq-option-item';
      let statusIcon = '';

      if (isAnswered) {
        if (idx === q.correctIndex) {
          optionClass += ' is-correct';
          statusIcon = '<span class="status-indicator correct">✓</span>';
        } else if (answerRecord && idx === answerRecord.rawAnswer) {
          optionClass += ' is-wrong';
          statusIcon = '<span class="status-indicator wrong">✗</span>';
        }
      } else if (stagedOptionIndex === idx) {
        optionClass += ' is-staged';
      }

      const disabledAttr = isAnswered ? 'disabled' : '';
      const letter = String.fromCharCode(65 + idx);

      html += `
        <button class="${optionClass}" type="button" data-option-idx="${idx}" ${disabledAttr}>
          <span class="mcq-option-letter">${letter}</span>
          <span class="mcq-option-label">${escapeHtml(opt)}</span>
          ${statusIcon}
        </button>
      `;
    });

    html += `</div>`;

    // MCQ Action Strip (Submit or Next)
    if (!isAnswered) {
      html += `
        <div class="session-card-actions">
          <button id="session-btn-submit-mcq" class="btn btn-primary btn-md" type="button" ${stagedOptionIndex === null ? 'disabled' : ''}>
            <span>Submit Answer</span>
          </button>
        </div>
      `;
    } else {
      // Explanation & Distractor Analysis Box
      const isCorrect = answerRecord && answerRecord.isCorrect;
      html += `
        <div class="feedback-card ${isCorrect ? 'correct' : 'wrong'}">
          <div class="feedback-header">
            <span class="feedback-icon">${isCorrect ? '🎉' : '💡'}</span>
            <h4 class="feedback-title">${isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}</h4>
          </div>
          <div class="feedback-explanation">
            <p><strong>Pedagogical Explanation:</strong></p>
            <p>${formatQuestionText(q.explanation)}</p>
          </div>

          ${renderDistractorBreakdown(q, answerRecord.rawAnswer)}
        </div>

        <div class="session-card-actions">
          <button id="session-btn-next-question" class="btn btn-primary btn-md" type="button">
            <span>${isLastQuestion() ? 'Finish Session 🏁' : 'Next Question ▶'}</span>
          </button>
        </div>
      `;
    }

    return html;
  }

  function renderDistractorBreakdown(q, userSelectedIdx) {
    if (!q.optionExplanations) return '';

    let itemsHtml = '';
    for (let key in q.optionExplanations) {
      const idx = parseInt(key, 10);
      const letter = String.fromCharCode(65 + idx);
      const isUserChoice = (idx === userSelectedIdx);
      itemsHtml += `
        <div class="distractor-item ${isUserChoice ? 'user-chosen' : ''}">
          <span class="distractor-letter">${letter}:</span>
          <span class="distractor-text">${escapeHtml(q.optionExplanations[key])}</span>
        </div>
      `;
    }

    if (!itemsHtml) return '';

    return `
      <div class="distractor-breakdown-box">
        <h5 class="distractor-title">Distractor Analysis (Why other options are incorrect):</h5>
        <div class="distractor-list">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  // --- Subjective Question Interface ---

  function renderSubjectiveInterface(q, isAnswered, answerRecord) {
    let html = `
      <div class="subjective-input-container">
        <!-- Rubric Preview Prompt -->
        <div class="rubric-guidance-pill">
          <span class="rubric-pill-icon">📋</span>
          <span class="rubric-pill-text">Evaluated on: ${q.rubric ? q.rubric.map(r => r.label).join(' • ') : 'Key principles, calculations, and invariants.'}</span>
        </div>

        <div class="subjective-textarea-wrap">
          <textarea id="subjective-textarea" class="subjective-textarea font-sans ${isAnswered ? 'is-submitted' : ''}" 
                    rows="6" placeholder="${escapeHtml(q.placeholder || 'Type your solution thoroughly here. Explain your reasoning and cite key formulas...')}" 
                    ${isAnswered ? 'readonly' : ''}>${isAnswered ? escapeHtml(answerRecord.rawAnswer) : ''}</textarea>
          
          <div class="textarea-counter-row">
            <span id="subjective-char-count" class="char-count-text">0 characters • minimum 20 recommended</span>
            ${q.constraints ? `<span class="constraints-hint font-mono">${escapeHtml(q.constraints)}</span>` : ''}
          </div>
        </div>
    `;

    if (!isAnswered) {
      html += `
        <div class="session-card-actions">
          <button id="session-btn-submit-subjective" class="btn btn-primary btn-md" type="button" disabled>
            <span>Submit Solution &amp; Evaluate Rubric</span>
          </button>
        </div>
      `;
    } else {
      // Rubric Evaluation Result Card
      const evalData = answerRecord.evalResult;
      const score = evalData.score;
      const maxScore = evalData.maxScore;
      const pct = evalData.percentage;
      const isFull = pct === 100;
      const isGood = pct >= 70;

      let verdictClass = isFull ? 'perfect' : (isGood ? 'good' : 'partial');
      let verdictTitle = isFull ? 'Excellent! Full Rubric Credit' : (isGood ? 'Good Solution! Partial Credit' : 'Solution Needs Improvement');

      html += `
        <div class="rubric-results-card ${verdictClass}">
          <div class="rubric-header">
            <div class="rubric-score-badge">
              <span class="score-num font-mono">${score} / ${maxScore}</span>
              <span class="score-pct font-mono">${pct}%</span>
            </div>
            <div class="rubric-verdict-text">
              <h4 class="verdict-title">${verdictTitle}</h4>
              <p class="verdict-sub">${evalData.passedCount} of ${evalData.totalCriteria} criteria satisfied</p>
            </div>
          </div>

          <!-- Criteria Checklist -->
          <div class="rubric-checklist">
            <h5 class="checklist-heading">Rubric Criteria Breakdown:</h5>
            <div class="checklist-items">
      `;

      evalData.criteriaResults.forEach(c => {
        html += `
          <div class="rubric-criterion-row ${c.passed ? 'passed' : 'failed'}">
            <span class="crit-icon">${c.passed ? '✓' : '✗'}</span>
            <span class="crit-label">${escapeHtml(c.label)}</span>
            <span class="crit-points font-mono">${c.passed ? `+${c.points}` : `0`} / ${c.maxPoints} pts</span>
          </div>
        `;
      });

      html += `
            </div>
          </div>

          <!-- Model Answer Callout -->
          <div class="model-answer-callout">
            <div class="model-answer-header">
              <span class="model-icon">📖</span>
              <strong>Model Reference Answer:</strong>
            </div>
            <div class="model-answer-body">
              ${formatQuestionText(q.modelAnswer || q.explanation)}
            </div>
          </div>

          <!-- Step-by-Step Breakdown -->
          ${q.stepByStep && q.stepByStep.length > 0 ? `
            <div class="step-by-step-box">
              <h5 class="steps-title">Step-by-Step Conceptual Breakdown:</h5>
              <ol class="steps-list">
                ${q.stepByStep.map(s => `<li>${formatQuestionText(s)}</li>`).join('')}
              </ol>
            </div>
          ` : ''}
        </div>

        <div class="session-card-actions">
          <button id="session-btn-retry-subjective" class="btn btn-secondary btn-md" type="button" title="Refine your solution and re-evaluate without losing session progress">
            <span>Try Again ↺</span>
          </button>
          <button id="session-btn-next-question" class="btn btn-primary btn-md" type="button">
            <span>${isLastQuestion() ? 'Finish Session 🏁' : 'Next Question ▶'}</span>
          </button>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  // --- Attach Question Event Handlers ---

  function attachQuestionInteractions(q, isAnswered) {
    // Hint Toggles
    const hintButtons = dom.questionContainer.querySelectorAll('.hint-toggle-btn');
    hintButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = parseInt(btn.getAttribute('data-hint-tier'), 10);
        revealHint(q.id, tier);
      });
    });

    if (q.type === 'mcq') {
      if (!isAnswered) {
        const optButtons = dom.questionContainer.querySelectorAll('.mcq-option-item');
        optButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-option-idx'), 10);
            selectMcqOption(idx);
          });
          btn.addEventListener('dblclick', () => {
            const idx = parseInt(btn.getAttribute('data-option-idx'), 10);
            selectMcqOption(idx);
            submitMcqAnswer();
          });
        });

        const submitBtn = document.getElementById('session-btn-submit-mcq');
        if (submitBtn) {
          submitBtn.addEventListener('click', submitMcqAnswer);
        }
      } else {
        const nextBtn = document.getElementById('session-btn-next-question');
        if (nextBtn) {
          nextBtn.addEventListener('click', goToNextQuestion);
        }
      }
    } else {
      // Subjective
      if (!isAnswered) {
        const textarea = document.getElementById('subjective-textarea');
        const submitBtn = document.getElementById('session-btn-submit-subjective');
        const charCounter = document.getElementById('subjective-char-count');

        if (textarea && submitBtn) {
          textarea.addEventListener('input', () => {
            const len = textarea.value.trim().length;
            if (charCounter) {
              charCounter.textContent = `${len} character${len !== 1 ? 's' : ''} • minimum 20 recommended`;
            }
            submitBtn.disabled = (len === 0);
          });

          submitBtn.addEventListener('click', () => {
            const text = textarea.value.trim();
            if (text) {
              submitSubjectiveAnswer(q, text);
            }
          });
        }
      } else {
        const retryBtn = document.getElementById('session-btn-retry-subjective');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            // Remove answered state for this question to allow rewriting
            delete activeSession.userAnswers[q.id];
            if (typeof Storage !== 'undefined') {
              Storage.savePracticeSession(activeSession);
            }
            renderSession();
          });
        }

        const nextBtn = document.getElementById('session-btn-next-question');
        if (nextBtn) {
          nextBtn.addEventListener('click', goToNextQuestion);
        }
      }
    }
  }

  function revealHint(questionId, tier) {
    if (!activeSession.revealedHints[questionId]) {
      activeSession.revealedHints[questionId] = { tier1: false, tier2: false };
    }
    if (tier === 1) activeSession.revealedHints[questionId].tier1 = true;
    if (tier === 2) activeSession.revealedHints[questionId].tier2 = true;

    if (typeof Storage !== 'undefined') {
      Storage.savePracticeSession(activeSession);
    }
    renderSession();
  }

  function selectMcqOption(idx) {
    stagedOptionIndex = idx;
    const optButtons = dom.questionContainer.querySelectorAll('.mcq-option-item');
    optButtons.forEach(btn => {
      const btnIdx = parseInt(btn.getAttribute('data-option-idx'), 10);
      if (btnIdx === idx) {
        btn.classList.add('is-staged');
      } else {
        btn.classList.remove('is-staged');
      }
    });

    const submitBtn = document.getElementById('session-btn-submit-mcq');
    if (submitBtn) submitBtn.disabled = false;
  }

  function submitMcqAnswer() {
    if (stagedOptionIndex === null || !activeSession) return;

    const currQ = activeSession.questions[activeSession.currentIndex];
    const isCorrect = (stagedOptionIndex === currQ.correctIndex);
    const pts = currQ.points || 1;

    activeSession.userAnswers[currQ.id] = {
      rawAnswer: stagedOptionIndex,
      isCorrect: isCorrect,
      score: isCorrect ? pts : 0,
      maxScore: pts,
      percentage: isCorrect ? 100 : 0,
      attemptedAt: Date.now()
    };

    stagedOptionIndex = null;

    if (typeof Storage !== 'undefined') {
      Storage.savePracticeSession(activeSession);
    }

    renderSession();
  }

  function submitSubjectiveAnswer(q, userText) {
    if (!activeSession || typeof QuizQuestions === 'undefined') return;

    const evalResult = QuizQuestions.evaluateSubjectiveAnswer(q, userText);

    activeSession.userAnswers[q.id] = {
      rawAnswer: userText,
      isCorrect: evalResult.percentage >= 60,
      score: evalResult.score,
      maxScore: evalResult.maxScore,
      percentage: evalResult.percentage,
      evalResult: evalResult,
      attemptedAt: Date.now()
    };

    if (typeof Storage !== 'undefined') {
      Storage.savePracticeSession(activeSession);
    }

    renderSession();
  }

  function isLastQuestion() {
    if (!activeSession) return true;
    return activeSession.currentIndex >= activeSession.questions.length - 1;
  }

  function goToNextQuestion() {
    if (!activeSession) return;
    if (isLastQuestion()) {
      finishSession();
    } else {
      activeSession.currentIndex++;
      stagedOptionIndex = null;
      if (typeof Storage !== 'undefined') {
        Storage.savePracticeSession(activeSession);
      }
      renderSession();
    }
  }

  // --- Step 5: Finish Session & Calculate Results ---

  function finishSession() {
    if (!activeSession) return;

    activeSession.completed = true;
    const questions = activeSession.questions;
    let totalScore = 0;
    let totalMaxScore = 0;
    let correctCount = 0;

    // Track stages breakdown
    const stageMap = {
      fundamentals: { total: 0, earned: 0 },
      understanding: { total: 0, earned: 0 },
      application: { total: 0, earned: 0 },
      tracing: { total: 0, earned: 0 },
      analysis: { total: 0, earned: 0 },
      challenge: { total: 0, earned: 0 }
    };

    const details = [];

    questions.forEach(q => {
      const ans = activeSession.userAnswers[q.id];
      const maxPts = q.points || (q.type === 'mcq' ? 1 : 5);
      totalMaxScore += maxPts;

      const stage = q.learningStage || 'fundamentals';
      if (!stageMap[stage]) stageMap[stage] = { total: 0, earned: 0 };
      stageMap[stage].total += maxPts;

      if (ans) {
        totalScore += ans.score;
        stageMap[stage].earned += ans.score;
        if (ans.isCorrect) correctCount++;

        details.push({
          questionId: q.id,
          type: q.type,
          stage: q.learningStage,
          score: ans.score,
          maxScore: ans.maxScore,
          isCorrect: ans.isCorrect
        });
      } else {
        details.push({
          questionId: q.id,
          type: q.type,
          stage: q.learningStage,
          score: 0,
          maxScore: maxPts,
          isCorrect: false
        });
      }
    });

    const accuracy = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - activeSession.startedAt) / 1000));
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const timeStr = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

    // Record verified attempt into Storage layer
    let recordedRecord = null;
    if (typeof Storage !== 'undefined' && Storage.recordPracticeAttempt) {
      recordedRecord = Storage.recordPracticeAttempt({
        subject: activeSession.subject,
        difficulty: activeSession.difficulty,
        format: activeSession.format,
        score: totalScore,
        maxScore: totalMaxScore,
        accuracy: accuracy,
        totalQuestions: questions.length,
        details: details
      });
    }

    lastCompletedSession = {
      ...activeSession,
      results: {
        score: totalScore,
        maxScore: totalMaxScore,
        accuracy: accuracy,
        correctCount: correctCount,
        totalQuestions: questions.length,
        timeStr: timeStr,
        stageMap: stageMap
      }
    };

    activeSession = null;
    stagedOptionIndex = null;

    if (typeof Storage !== 'undefined') {
      Storage.clearPracticeSession();
    }

    switchView('results');
  }

  // --- View 5: Results View Rendering ---

  function renderResults() {
    if (!lastCompletedSession || !lastCompletedSession.results) {
      switchView('dashboard');
      return;
    }

    const res = lastCompletedSession.results;
    const isExcellence = res.accuracy >= 80;
    const isPerfect = res.accuracy === 100;

    if (dom.resultsHeroIcon) {
      dom.resultsHeroIcon.textContent = isPerfect ? '🏆' : (isExcellence ? '🎉' : '🎯');
    }
    if (dom.resultsHeroTitle) {
      dom.resultsHeroTitle.textContent = isPerfect ? 'Perfect Score! 100% Mastery' : (isExcellence ? 'Outstanding Work! Session Completed' : 'Session Completed!');
    }
    if (dom.resultsHeroSubtitle) {
      dom.resultsHeroSubtitle.textContent = isExcellence
        ? 'You have demonstrated solid conceptual grasp and earned verified Practice XP!'
        : 'Good effort! Review the detailed question explanations and model answers below to strengthen your fundamentals.';
    }

    if (dom.resultsScore) dom.resultsScore.textContent = `${res.score} / ${res.maxScore}`;
    if (dom.resultsAccuracy) dom.resultsAccuracy.textContent = `${res.accuracy}%`;
    if (dom.resultsAccuracySub) {
      dom.resultsAccuracySub.textContent = isExcellence ? 'Bonus XP Awarded (+30)' : 'Review Recommended';
      dom.resultsAccuracySub.style.color = isExcellence ? 'var(--status-success)' : 'var(--accent-coa)';
    }
    if (dom.resultsXp) {
      dom.resultsXp.textContent = isExcellence ? '+30 XP' : '+0 XP';
    }
    if (dom.resultsTime) dom.resultsTime.textContent = res.timeStr;

    // Render Stage Breakdown
    renderStageBreakdown(res.stageMap);

    // Render Review Feed
    setReviewFilter('all');
  }

  function renderStageBreakdown(stageMap) {
    if (!dom.resultsStageBreakdown || !stageMap) return;

    const stages = [
      { key: 'fundamentals', label: '1. Fundamentals' },
      { key: 'understanding', label: '2. Understanding' },
      { key: 'application', label: '3. Application' },
      { key: 'tracing', label: '4. Tracing' },
      { key: 'analysis', label: '5. Analysis' },
      { key: 'challenge', label: '6. Challenge' }
    ];

    let html = '';
    stages.forEach(s => {
      const data = stageMap[s.key] || { total: 0, earned: 0 };
      const pct = data.total > 0 ? Math.round((data.earned / data.total) * 100) : 0;
      const cls = pct >= 80 ? 'high' : (pct >= 50 ? 'med' : 'low');

      html += `
        <div class="stage-metric-box">
          <div class="stage-metric-header">
            <span class="stage-name">${s.label}</span>
            <span class="stage-pct font-mono ${cls}">${pct}%</span>
          </div>
          <div class="stage-track">
            <div class="stage-fill ${cls}" style="width: ${pct}%;"></div>
          </div>
          <span class="stage-sub font-mono">${data.earned} / ${data.total} pts</span>
        </div>
      `;
    });

    dom.resultsStageBreakdown.innerHTML = html;
  }

  function setReviewFilter(filter) {
    activeReviewFilter = filter;

    [dom.filterAll, dom.filterCorrect, dom.filterIncorrect].forEach(f => {
      if (f) f.classList.remove('active');
    });

    if (filter === 'all' && dom.filterAll) dom.filterAll.classList.add('active');
    if (filter === 'correct' && dom.filterCorrect) dom.filterCorrect.classList.add('active');
    if (filter === 'incorrect' && dom.filterIncorrect) dom.filterIncorrect.classList.add('active');

    renderReviewFeed();
  }

  function renderReviewFeed() {
    if (!dom.resultsReviewFeed || !lastCompletedSession) return;

    const questions = lastCompletedSession.questions;
    const userAnswers = lastCompletedSession.userAnswers;

    let totalCorrect = 0;
    let totalIncorrect = 0;

    questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans && ans.isCorrect) totalCorrect++;
      else totalIncorrect++;
    });

    if (dom.filterAll) dom.filterAll.textContent = `All (${questions.length})`;
    if (dom.filterCorrect) dom.filterCorrect.textContent = `Correct (${totalCorrect})`;
    if (dom.filterIncorrect) dom.filterIncorrect.textContent = `Needs Review (${totalIncorrect})`;

    let html = '';

    questions.forEach((q, idx) => {
      const ans = userAnswers[q.id];
      const isCorrect = ans && ans.isCorrect;

      if (activeReviewFilter === 'correct' && !isCorrect) return;
      if (activeReviewFilter === 'incorrect' && isCorrect) return;

      const earnedPts = ans ? ans.score : 0;
      const maxPts = q.points || (q.type === 'mcq' ? 1 : 5);

      html += `
        <div class="review-item-card ${isCorrect ? 'is-correct' : 'is-wrong'}">
          <div class="review-item-header">
            <div class="review-q-left">
              <span class="review-q-num font-mono">Q${idx + 1}</span>
              <span class="subject-code-tag ${q.subject}">${q.subject.toUpperCase()}</span>
              <span class="stage-tag ${q.learningStage}">${q.learningStage}</span>
            </div>
            <div class="review-q-right">
              <span class="review-score-pill font-mono ${isCorrect ? 'correct' : 'wrong'}">
                ${earnedPts} / ${maxPts} pts
              </span>
            </div>
          </div>

          <h4 class="review-q-title">${formatQuestionText(q.question)}</h4>

          <!-- User Response vs Correct Response -->
          <div class="review-comparison-box">
            <div class="comparison-row">
              <strong class="comp-label">Your Response:</strong>
              <div class="comp-val font-sans ${isCorrect ? 'val-correct' : 'val-wrong'}">
                ${q.type === 'mcq' 
                  ? (ans ? `${String.fromCharCode(65 + ans.rawAnswer)}: ${escapeHtml(q.options[ans.rawAnswer])}` : 'Not Answered') 
                  : (ans ? escapeHtml(ans.rawAnswer) : 'Not Answered')}
              </div>
            </div>

            ${!isCorrect ? `
              <div class="comparison-row" style="margin-top: 0.5rem;">
                <strong class="comp-label">Expected Solution:</strong>
                <div class="comp-val font-sans val-correct">
                  ${q.type === 'mcq' 
                    ? `${String.fromCharCode(65 + q.correctIndex)}: ${escapeHtml(q.options[q.correctIndex])}` 
                    : formatQuestionText(q.modelAnswer || q.explanation)}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Explanation -->
          <div class="review-explanation-box">
            <strong>Pedagogical Explanation:</strong>
            <p>${formatQuestionText(q.explanation)}</p>
          </div>
        </div>
      `;
    });

    if (!html) {
      html = `<div class="review-empty-message">No questions matched the "${activeReviewFilter}" filter.</div>`;
    }

    dom.resultsReviewFeed.innerHTML = html;
  }

  // --- Modal Helpers ---

  function openExitModal() {
    if (!dom.exitModal || !activeSession) return;
    const answered = Object.keys(activeSession.userAnswers || {}).length;
    const total = activeSession.questions.length;
    if (dom.exitModalStatus) {
      dom.exitModalStatus.textContent = `Completed ${answered} of ${total} questions. Current position: Question ${activeSession.currentIndex + 1}.`;
    }
    dom.exitModal.style.display = 'flex';
  }

  function closeExitModal() {
    if (dom.exitModal) dom.exitModal.style.display = 'none';
  }

  // --- Formatting Utilities ---

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatQuestionText(text) {
    if (!text) return '';
    let clean = escapeHtml(text);
    clean = clean.replace(/`([^`]+)`/g, '<code class="font-mono">$1</code>');
    clean = clean.replace(/\n/g, '<br>');
    return clean;
  }

  // Backward compatibility dummy to prevent external callers from breaking
  function generateDynamicProblem() {
    startNewSession();
  }

  const api = {
    init,
    onEnter,
    switchView,
    startNewSession,
    resumeActiveSession,
    discardActiveSession,
    generateDynamicProblem
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  return api;
})();
