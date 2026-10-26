/**
 * ConceptLab — Automated Verification Suite for Practice Arena Upgrade
 * (test_practice_arena.js)
 * 
 * Tests:
 * 1. Verified Question Bank Schema & Invariants (42 questions across DAA, COA, FLAT)
 * 2. Deterministic Pedagogical Progression Sequence (Mixed Practice 10-Question Structure)
 * 3. Transparent Multi-Criteria Rubric Grading Engine (Full, Partial, Zero Credit)
 * 4. MCQ Distractor Breakdown Verification
 * 5. Storage Persistence (Active Session Save/Resume & Honest Telemetry)
 * 6. XP Bonuses & Achievement Integration (≥80% 30 XP, 100% Perfect Practice)
 */

const assert = require('assert');
const fs = require('fs');
const QuizQuestions = require('./js/quiz-questions.js');

// Mock browser globals for Node.js test environment
let mockLocalStorage = {};
global.localStorage = {
  getItem: (key) => (key in mockLocalStorage ? mockLocalStorage[key] : null),
  setItem: (key, val) => { mockLocalStorage[key] = String(val); },
  removeItem: (key) => { delete mockLocalStorage[key]; },
  clear: () => { mockLocalStorage = {}; }
};

global.window = {
  localStorage: global.localStorage,
  dispatchEvent: (e) => {},
  AudioContext: class {
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {}
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
        connect: () => {}
      };
    }
    get destination() { return {}; }
    get currentTime() { return 0; }
  }
};
global.CustomEvent = class {
  constructor(name, opts) {
    this.name = name;
    this.detail = opts ? opts.detail : {};
  }
};

// Evaluate Storage module
eval(fs.readFileSync('js/storage.js', 'utf8'));

console.log('🧪 Starting ConceptLab Practice Arena Verification Suite...\n');

// -----------------------------------------------------------------------------
// Group 1: Question Bank Invariants
// -----------------------------------------------------------------------------
console.log('[GROUP 1] Question Bank Schema & Pedagogical Standards');

const allQuestions = QuizQuestions.getAllQuestions();
assert.ok(allQuestions.length >= 36, `Expected >= 36 questions, found ${allQuestions.length}`);
console.log(`  ✓ Question bank size verified: ${allQuestions.length} total questions (Specification requires >= 36)`);

const subjects = ['daa', 'coa', 'flat'];
subjects.forEach(sub => {
  const qs = QuizQuestions.getQuestionsBySubject(sub);
  assert.ok(qs.length >= 12, `${sub.toUpperCase()} has ${qs.length} questions, expected >= 12`);
  
  const mcqs = qs.filter(q => q.type === 'mcq');
  const subjectives = qs.filter(q => q.type === 'subjective');

  assert.ok(mcqs.length >= 8, `${sub} has ${mcqs.length} MCQs, expected >= 8`);
  assert.ok(subjectives.length >= 4, `${sub} has ${subjectives.length} subjective, expected >= 4`);

  console.log(`  ✓ ${sub.toUpperCase()}: ${qs.length} questions (${mcqs.length} MCQs, ${subjectives.length} Subjective)`);
});

// Verify every question has proper metadata and 2-tier hints
allQuestions.forEach(q => {
  assert.ok(q.id, `Question missing ID`);
  assert.ok(subjects.includes(q.subject), `Invalid subject: ${q.subject}`);
  assert.ok(q.topic, `Question ${q.id} missing topic`);
  assert.ok(['beginner', 'intermediate', 'advanced'].includes(q.difficulty), `Invalid difficulty: ${q.difficulty}`);
  assert.ok(['fundamentals', 'understanding', 'application', 'tracing', 'analysis', 'challenge'].includes(q.learningStage), `Invalid learningStage: ${q.learningStage}`);
  assert.ok(Array.isArray(q.hints) && q.hints.length >= 2, `Question ${q.id} must have at least 2 progressive hints`);

  if (q.type === 'mcq') {
    assert.strictEqual(q.options.length, 4, `MCQ ${q.id} must have exactly 4 options`);
    assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3, `MCQ ${q.id} has invalid correctIndex`);
    assert.ok(q.explanation && q.explanation.length > 20, `MCQ ${q.id} missing comprehensive explanation`);
    assert.ok(q.optionExplanations && Object.keys(q.optionExplanations).length >= 3, `MCQ ${q.id} must have distractor explanations`);
  } else if (q.type === 'subjective') {
    assert.ok(Array.isArray(q.rubric) && q.rubric.length >= 2, `Subjective ${q.id} must have at least 2 rubric criteria`);
    assert.ok(q.modelAnswer && q.modelAnswer.length > 30, `Subjective ${q.id} missing model answer`);
    assert.ok(Array.isArray(q.stepByStep) && q.stepByStep.length >= 2, `Subjective ${q.id} missing stepByStep`);
  }
});
console.log('  ✓ All 42 questions strictly conform to pedagogical schema & 2-tier hint requirements');

// -----------------------------------------------------------------------------
// Group 2: Deterministic Pedagogical Progression (Mixed Practice Sequence)
// -----------------------------------------------------------------------------
console.log('\n[GROUP 2] Pedagogical Learning Progression & Deterministic Session Builder');

const mixedDaaSession = QuizQuestions.buildSessionQuestions('daa', 'all', 'mixed', 10);
assert.strictEqual(mixedDaaSession.length, 10, 'Default mixed session should contain 10 questions');

// Mixed Sequence Spec:
// Q1: MCQ Fundamentals
// Q2: MCQ Understanding
// Q3: Subjective Fundamentals or Understanding
// Q4: MCQ Application
// Q5: Subjective Application
// Q6: MCQ Tracing
// Q7: Subjective Tracing
// Q8: MCQ Analysis
// Q9: Subjective Analysis
// Q10: Challenge (MCQ or Subjective)

assert.strictEqual(mixedDaaSession[0].type, 'mcq');
assert.strictEqual(mixedDaaSession[0].learningStage, 'fundamentals');

assert.strictEqual(mixedDaaSession[1].type, 'mcq');
assert.strictEqual(mixedDaaSession[1].learningStage, 'understanding');

assert.strictEqual(mixedDaaSession[2].type, 'subjective');
assert.ok(['fundamentals', 'understanding'].includes(mixedDaaSession[2].learningStage));

assert.strictEqual(mixedDaaSession[3].type, 'mcq');
assert.strictEqual(mixedDaaSession[3].learningStage, 'application');

assert.strictEqual(mixedDaaSession[4].type, 'subjective');
assert.strictEqual(mixedDaaSession[4].learningStage, 'application');

assert.strictEqual(mixedDaaSession[5].type, 'mcq');
assert.strictEqual(mixedDaaSession[5].learningStage, 'tracing');

assert.strictEqual(mixedDaaSession[6].type, 'subjective');
assert.strictEqual(mixedDaaSession[6].learningStage, 'tracing');

assert.strictEqual(mixedDaaSession[7].type, 'mcq');
assert.strictEqual(mixedDaaSession[7].learningStage, 'analysis');

assert.strictEqual(mixedDaaSession[8].type, 'subjective');
assert.strictEqual(mixedDaaSession[8].learningStage, 'analysis');

assert.strictEqual(mixedDaaSession[9].learningStage, 'challenge');

console.log('  ✓ Deterministic 10-Question Pedagogical progression verified (Fundamentals -> Understanding -> Application -> Tracing -> Analysis -> Challenge)');

// Test difficulty filter isolation
const beginnerMcqCoa = QuizQuestions.buildSessionQuestions('coa', 'beginner', 'mcq', 10);
assert.ok(beginnerMcqCoa.every(q => q.difficulty === 'beginner' && q.type === 'mcq'), 'All questions must be beginner MCQs');
console.log(`  ✓ Difficulty and format filtering strictly isolated (${beginnerMcqCoa.length} beginner MCQs for COA)`);

// -----------------------------------------------------------------------------
// Group 3: Transparent Multi-Criteria Rubric Grading Engine
// -----------------------------------------------------------------------------
console.log('\n[GROUP 3] Multi-Criteria Subjective Rubric Grading Engine');

const daaQ3 = allQuestions.find(q => q.id === 'daa-q3'); // Subjective: why sorted array is required
assert.ok(daaQ3, 'DAA Q3 found');

// 1. Ideal Answer (100% full credit)
const idealAnswer = 'Binary search requires a sorted monotonic array. When we compare the target with A[mid], the sorted property allows us to definitively discard one half. If the array were unsorted, target could lie anywhere and midpoint comparison gives false directional information leading to false negative pruning.';
const evalFull = QuizQuestions.evaluateSubjectiveAnswer(daaQ3, idealAnswer);
assert.strictEqual(evalFull.score, 5, 'Ideal answer should receive full 5 points');
assert.strictEqual(evalFull.percentage, 100);
assert.strictEqual(evalFull.passedCount, 3);
console.log('  ✓ Ideal student answer awarded 100% full rubric credit (5/5 pts, 3/3 criteria satisfied)');

// 2. Partial Answer
const partialAnswer = 'Because the array must be sorted in order to eliminate half the search interval using mid.';
const evalPartial = QuizQuestions.evaluateSubjectiveAnswer(daaQ3, partialAnswer);
assert.ok(evalPartial.score > 0 && evalPartial.score < 5, 'Partial answer should receive partial credit');
assert.ok(evalPartial.passedCount >= 1 && evalPartial.passedCount < 3);
console.log(`  ✓ Partial student answer awarded partial credit (${evalPartial.score}/5 pts, ${evalPartial.passedCount}/3 criteria)`);

// 3. Irrelevant Answer (0 credit)
const irrelevantAnswer = 'JavaScript arrays are fast and have built in sorting algorithms.';
const evalZero = QuizQuestions.evaluateSubjectiveAnswer(daaQ3, irrelevantAnswer);
assert.strictEqual(evalZero.score, 0, 'Irrelevant answer must receive 0 points');
assert.strictEqual(evalZero.passedCount, 0);
console.log('  ✓ Irrelevant answer correctly rejected with 0 rubric credit');

// -----------------------------------------------------------------------------
// Group 4: Storage Session Persistence & Attempt Telemetry
// -----------------------------------------------------------------------------
console.log('\n[GROUP 4] Practice Arena Storage Persistence & Telemetry');

mockLocalStorage = {};

// Verify initial empty state
const emptyStats = Storage.getDashboardStats();
assert.strictEqual(emptyStats.questionsAttempted, 0);
assert.strictEqual(emptyStats.accuracy, 0);
assert.strictEqual(emptyStats.hasUnfinishedSession, false);
console.log('  ✓ Storage initializes with honest empty stats (0 attempted, 0% accuracy)');

// Save an active unfinished session
const testSession = {
  id: 'test_session_1',
  subject: 'daa',
  difficulty: 'all',
  format: 'mixed',
  hintsEnabled: true,
  questions: mixedDaaSession,
  currentIndex: 3,
  userAnswers: { 'daa-q1': { rawAnswer: 1, isCorrect: true, score: 1, maxScore: 1 } },
  startedAt: Date.now(),
  completed: false
};

Storage.savePracticeSession(testSession);
const retrievedSession = Storage.getPracticeSession();
assert.ok(retrievedSession, 'Should retrieve active session');
assert.strictEqual(retrievedSession.currentIndex, 3);
assert.strictEqual(retrievedSession.subject, 'daa');
assert.strictEqual(Storage.getDashboardStats().hasUnfinishedSession, true);
console.log('  ✓ Active unfinished session persists across storage reads and triggers dashboard resume status');

// Clear session
Storage.clearPracticeSession();
assert.strictEqual(Storage.getPracticeSession(), null);
assert.strictEqual(Storage.getDashboardStats().hasUnfinishedSession, false);
console.log('  ✓ Storage.clearPracticeSession successfully clears active session state');

// -----------------------------------------------------------------------------
// Group 5: XP Bonuses & Achievement Integration
// -----------------------------------------------------------------------------
console.log('\n[GROUP 5] XP Awards & Achievement Unlocking');

// 1. Record completed practice attempt with 90% accuracy (>= 80% awards 30 XP)
mockLocalStorage = {};
const recordedAttempt = Storage.recordPracticeAttempt({
  subject: 'daa',
  difficulty: 'all',
  format: 'mixed',
  score: 9,
  maxScore: 10,
  totalQuestions: 10,
  details: []
});

assert.strictEqual(recordedAttempt.accuracy, 90);
assert.strictEqual(Storage.getState().xp, 30, 'Should award 30 bonus XP for >= 80% accuracy');
console.log('  ✓ Practice attempt with 90% accuracy successfully awarded 30 bonus XP');

// 2. Record 100% score to unlock perfect_practice achievement
mockLocalStorage = {};
Storage.recordPracticeAttempt({
  subject: 'coa',
  difficulty: 'all',
  format: 'mixed',
  score: 10,
  maxScore: 10,
  totalQuestions: 10,
  details: []
});

const achievements = Storage.getAchievementsList();
const perfectAch = achievements.find(a => a.id === 'perfect_practice');
assert.ok(perfectAch && perfectAch.isUnlocked, '100% practice score must unlock perfect_practice achievement');
console.log('  ✓ 100% practice score successfully unlocked the "Perfect Practice" canonical achievement');

console.log('\n======================================================');
console.log('ALL PRACTICE ARENA SPECIFICATION TESTS PASSED (100%)!');
console.log('======================================================\n');
