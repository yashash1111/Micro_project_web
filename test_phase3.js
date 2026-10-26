/**
 * ConceptLab — Automated Test Suite for Phase 3
 * Validates:
 * 1. Schema v2 Persistence & State Management
 * 2. XP Award Deduplication & Centralized Rules
 * 3. Challenge Completions & Triple Module 50 XP Bonus
 * 4. Quiz 80% Bonus & Perfect Practice 100% Achievement
 * 5. All 8 Canonical Achievements Verification Logic
 * 6. Calendar Streak Calculation (Local Time)
 * 7. Safe Factory Reset (Preserving Theme & Sound Preferences)
 * 8. Presentation Mode 9 Slides & Embedded Demo Invariants
 */

const assert = require('assert');
const fs = require('fs');

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
const storageCode = fs.readFileSync('js/storage.js', 'utf8');
eval(storageCode);

// Evaluate Presentation module
const presCode = fs.readFileSync('js/presentation.js', 'utf8');
eval(presCode);

console.log('🧪 Starting ConceptLab Phase 3 Automated Verification Suite...\n');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    mockLocalStorage = {};
    if (typeof Storage !== 'undefined' && Storage.resetAllProgress) {
      Storage.resetAllProgress();
    }
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✖ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

// -----------------------------------------------------------------------------
// Group 1: Storage Schema v2 & Centralized XP Rules
// -----------------------------------------------------------------------------
console.log('Group 1: Storage Schema v2 & XP Deduplication');

test('Storage initializes with Schema Version 2 and default state', () => {
  mockLocalStorage = {};
  const state = Storage.getState();
  assert.strictEqual(state.version, 2, 'Schema version should be 2');
  assert.strictEqual(state.xp, 0, 'Initial XP must be 0');
  assert.strictEqual(state.soundEnabled, false, 'Sound must be off by default');
  assert.deepStrictEqual(state.completedChallenges, [], 'Initial challenges must be empty');
});

test('XP Award rules match exact pedagogical specification', () => {
  assert.strictEqual(Storage.XP_RULES.DAA_CHALLENGE, 20);
  assert.strictEqual(Storage.XP_RULES.COA_CHALLENGE, 20);
  assert.strictEqual(Storage.XP_RULES.FLAT_CHALLENGE, 20);
  assert.strictEqual(Storage.XP_RULES.QUIZ_80_PERCENT_BONUS, 30);
  assert.strictEqual(Storage.XP_RULES.ALL_MODULES_BONUS, 50);
});

test('awardXP strictly prevents duplicate awards for identical eventId', () => {
  mockLocalStorage = {};
  const res1 = Storage.awardXP('unique_test_event_1', 20, 'First verified run', 'daa');
  assert.strictEqual(res1.awarded, true, 'First attempt must succeed');
  assert.strictEqual(Storage.getState().xp, 20, 'XP must increment to 20');

  // Attempt duplicate award
  const res2 = Storage.awardXP('unique_test_event_1', 20, 'Duplicate attempt', 'daa');
  assert.strictEqual(res2.awarded, false, 'Duplicate award must be rejected');
  assert.strictEqual(Storage.getState().xp, 20, 'XP must remain 20');
});

// -----------------------------------------------------------------------------
// Group 2: Challenge Completions & Triple Module Mastery Bonus
// -----------------------------------------------------------------------------
console.log('\nGroup 2: Challenge Completions & Triple Mastery');

test('completeChallenge awards 20 XP for DAA and registers achievement trigger', () => {
  mockLocalStorage = {};
  const res = Storage.completeChallenge('daa_binary_search_run', 'daa', 'Binary Search');
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.firstTime, true);
  assert.strictEqual(res.xpAwarded, 20);
  assert.strictEqual(Storage.getState().xp, 20);

  // Check achievement unlock: first_steps & algorithm_explorer
  const unlocked = Storage.getState().unlockedAchievements.map(a => a.id);
  assert.ok(unlocked.includes('first_steps'), 'Should unlock first_steps');
  assert.ok(unlocked.includes('algorithm_explorer'), 'Should unlock algorithm_explorer');
});

test('Completing all three subjects awards 50 bonus XP (Triple Master)', () => {
  mockLocalStorage = {};
  Storage.completeChallenge('daa_test', 'daa', 'DAA Test');
  assert.strictEqual(Storage.getState().xp, 20);

  Storage.completeChallenge('coa_test', 'coa', 'COA Test');
  assert.strictEqual(Storage.getState().xp, 40);

  // When flat completes, DAA + COA + FLAT are all present -> triggers 20 XP + 50 bonus XP = 70 XP increase!
  Storage.completeChallenge('flat_test', 'flat', 'FLAT Test');
  assert.strictEqual(Storage.getState().xp, 40 + 20 + 50, 'Total XP should be 110 (20 + 20 + 20 + 50 bonus)');

  const unlocked = Storage.getState().unlockedAchievements.map(a => a.id);
  assert.ok(unlocked.includes('triple_master'), 'Should unlock triple_master achievement');
});

// -----------------------------------------------------------------------------
// Group 3: Quiz Attempts, Accuracy Bonuses & Achievements
// -----------------------------------------------------------------------------
console.log('\nGroup 3: Quiz Telemetry & Accuracy Bonuses');

test('Quiz attempt with accuracy >= 80% awards 30 bonus XP', () => {
  mockLocalStorage = {};
  // 5 out of 5 questions correct = 100% accuracy
  const attempt = Storage.recordQuizAttempt('daa', 5, 5);
  assert.strictEqual(attempt.accuracy, 100);
  assert.strictEqual(Storage.getState().xp, 30, 'Should award 30 bonus XP');

  // Check perfect_practice achievement
  const unlocked = Storage.getState().unlockedAchievements.map(a => a.id);
  assert.ok(unlocked.includes('perfect_practice'), 'Should unlock perfect_practice achievement for 100% quiz');
});

test('Quiz attempt with accuracy < 80% does NOT award bonus XP', () => {
  mockLocalStorage = {};
  // 2 out of 5 = 40%
  const attempt = Storage.recordQuizAttempt('coa', 2, 5);
  assert.strictEqual(attempt.accuracy, 40);
  assert.strictEqual(Storage.getState().xp, 0, 'No bonus XP for < 80%');
});

test('Retaking quiz does not award duplicate 30 XP bonus', () => {
  mockLocalStorage = {};
  Storage.recordQuizAttempt('daa', 5, 5);
  assert.strictEqual(Storage.getState().xp, 30);

  // Retake same quiz with 100%
  Storage.recordQuizAttempt('daa', 5, 5);
  assert.strictEqual(Storage.getState().xp, 30, 'Duplicate quiz bonus must be deduplicated');
});

// -----------------------------------------------------------------------------
// Group 4: Canonical Achievements Evaluation
// -----------------------------------------------------------------------------
console.log('\nGroup 4: All 8 Canonical Achievements');

test('Consistent Learner unlocks after 5 distinct challenges', () => {
  mockLocalStorage = {};
  Storage.completeChallenge('c1', 'daa', 'Challenge 1');
  Storage.completeChallenge('c2', 'daa', 'Challenge 2');
  Storage.completeChallenge('c3', 'coa', 'Challenge 3');
  Storage.completeChallenge('c4', 'coa', 'Challenge 4');
  assert.strictEqual(Storage.getState().unlockedAchievements.some(a => a.id === 'consistent_learner'), false);

  Storage.completeChallenge('c5', 'flat', 'Challenge 5');
  assert.strictEqual(Storage.getState().unlockedAchievements.some(a => a.id === 'consistent_learner'), true);
});

test('getAchievementsList returns all 8 canonical achievements with locked/unlocked state', () => {
  mockLocalStorage = {};
  const list = Storage.getAchievementsList();
  assert.strictEqual(list.length, 8, 'There must be exactly 8 canonical achievements');
  const ids = list.map(a => a.id);
  const expected = [
    'first_steps',
    'algorithm_explorer',
    'number_ninja',
    'state_machine_master',
    'perfect_practice',
    'consistent_learner',
    'triple_master',
    'persistent_learner'
  ];
  assert.deepStrictEqual(ids, expected);
});

// -----------------------------------------------------------------------------
// Group 5: Calendar Streak Calculation & Factory Reset
// -----------------------------------------------------------------------------
console.log('\nGroup 5: Calendar Streak & Safe Reset');

test('Streak is calculated honestly based on local calendar dates', () => {
  mockLocalStorage = {};
  // When no activity exists, streak is 0
  assert.strictEqual(Storage.calculateStreak(), 0);

  // Add challenge today
  Storage.completeChallenge('streak_test', 'daa', 'Streak Check');
  assert.strictEqual(Storage.calculateStreak(), 1);
});

test('resetAllProgress clears progress while preserving user theme and sound preferences', () => {
  mockLocalStorage = {};
  Storage.set('theme', 'light');
  Storage.set('soundEnabled', true);
  Storage.completeChallenge('ch_1', 'daa', 'Test');
  assert.strictEqual(Storage.getState().xp, 20);

  Storage.resetAllProgress();

  const resetState = Storage.getState();
  assert.strictEqual(resetState.xp, 0, 'XP should reset to 0');
  assert.strictEqual(resetState.completedChallenges.length, 0, 'Challenges should reset');
  assert.strictEqual(resetState.theme, 'light', 'Theme preference MUST be preserved');
  assert.strictEqual(resetState.soundEnabled, true, 'Sound preference MUST be preserved');
});

// -----------------------------------------------------------------------------
// Group 6: Presentation Mode Invariants
// -----------------------------------------------------------------------------
console.log('\nGroup 6: Presentation Mode Invariants');

test('Presentation Mode contains all 9 required curriculum review slides', () => {
  assert.strictEqual(PresentationMode.SLIDES.length, 9, 'Must have exactly 9 presentation slides');
  const subjects = PresentationMode.SLIDES.map(s => s.title);
  assert.ok(subjects[0].includes('Problem Statement'));
  assert.ok(subjects[1].includes('Project Objectives'));
  assert.ok(subjects[2].includes('Technology Stack'));
  assert.ok(subjects[3].includes('DAA Concept'));
  assert.ok(subjects[4].includes('COA Concept'));
  assert.ok(subjects[5].includes('FLAT Concept'));
  assert.ok(subjects[6].includes('Testing Methodology'));
  assert.ok(subjects[7].includes('Test Cases'));
  assert.ok(subjects[8].includes('Conclusion'));
});

test('Slides 4, 5, 6 configure embedded interactive demonstrators', () => {
  assert.strictEqual(PresentationMode.SLIDES[3].demoType, 'daa', 'Slide 4 must embed DAA demo');
  assert.strictEqual(PresentationMode.SLIDES[4].demoType, 'coa', 'Slide 5 must embed COA demo');
  assert.strictEqual(PresentationMode.SLIDES[5].demoType, 'flat', 'Slide 6 must embed FLAT demo');
});

console.log(`\n========================================`);
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
