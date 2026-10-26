/**
 * ConceptLab — Computer Science Concepts Playground
 * Persistence Foundation & Gamification Layer (js/storage.js)
 * 
 * Versioned, safe, error-handled localStorage persistence layer (Schema v2).
 * Manages:
 * - Theme & Sound preference persistence
 * - Centralized XP rules & unique award event protection
 * - Genuine challenge completion & module mastery tracking
 * - Verified quiz attempts and accuracy tracking
 * - 8 curriculum achievements with validation & unlock records
 * - Trustworthy local date streak calculation
 * - Session activity auditing & honest first-time learner states
 * - In-memory fallback and safe reset operations
 * - Native Web Audio API sound feedback (off by default)
 */

var Storage = (() => {
  'use strict';

  const STORAGE_KEY = 'conceptlab_v2_store';
  const LEGACY_STORAGE_KEY = 'conceptlab_v1_store';
  const CURRENT_SCHEMA_VERSION = 2;

  // Centralized XP Rules Specification
  const XP_RULES = {
    DAA_CHALLENGE: 20,
    COA_CHALLENGE: 20,
    FLAT_CHALLENGE: 20,
    QUIZ_80_PERCENT_BONUS: 30,
    ALL_MODULES_BONUS: 50
  };

  // 8 Canonical Achievements Specifications
  const ACHIEVEMENTS_DEF = [
    {
      id: 'first_steps',
      title: 'First Steps',
      desc: 'Complete your first verified challenge in any laboratory module.',
      icon: '🌱',
      subject: 'general'
    },
    {
      id: 'algorithm_explorer',
      title: 'Algorithm Explorer',
      desc: 'Complete a verified DAA Binary Search algorithmic execution.',
      icon: '🔍',
      subject: 'daa'
    },
    {
      id: 'number_ninja',
      title: 'Number Ninja',
      desc: 'Correctly execute a COA radix conversion or two\'s-complement calculation.',
      icon: '🔢',
      subject: 'coa'
    },
    {
      id: 'state_machine_master',
      title: 'State Machine Master',
      desc: 'Correctly verify a binary string against the FLAT DFA state machine.',
      icon: '⚙️',
      subject: 'flat'
    },
    {
      id: 'perfect_practice',
      title: 'Perfect Practice',
      desc: 'Score 100% on a complete conceptual verification check in the Practice Arena.',
      icon: '🎯',
      subject: 'quiz'
    },
    {
      id: 'consistent_learner',
      title: 'Consistent Learner',
      desc: 'Complete five distinct verified challenges across the workbench.',
      icon: '📚',
      subject: 'general'
    },
    {
      id: 'triple_master',
      title: 'Triple Master',
      desc: 'Complete verified challenges in all three subject modules (DAA, COA, FLAT).',
      icon: '🏆',
      subject: 'all'
    },
    {
      id: 'persistent_learner',
      title: 'Persistent Learner',
      desc: 'Complete learning challenges on three distinct local calendar dates.',
      icon: '📅',
      subject: 'general'
    }
  ];

  // In-memory fallback if localStorage is disabled or throws QuotaExceededError
  let memoryStore = null;

  const DEFAULT_STATE = {
    version: CURRENT_SCHEMA_VERSION,
    theme: 'dark', // 'dark' | 'light'
    soundEnabled: false, // off by default
    sidebarCollapsed: false,
    xp: 0,
    xpEvents: [], // { eventId, category, amount, timestamp, reason }
    completedChallenges: [], // { challengeId, subject, timestamp, dateStr, title }
    completedModules: [], // ['daa', 'coa', 'flat']
    quizAttempts: [], // { quizId, score, maxScore, accuracy, timestamp, dateStr }
    unlockedAchievements: [], // { id, title, unlockedAt, eventId }
    recentActivity: [], // { id, labId, title, timestamp, type, dateStr }
    moduleSettings: {
      daa: { speed: 800, lastArray: '2, 4, 6, 8, 10', lastTarget: '8', mode: 'standard' },
      coa: { base: '10', bitWidth: 8, lastValue: '10' },
      flat: { speed: 750, lastString: '1001' }
    }
  };

  /**
   * Helper: Get local calendar date as YYYY-MM-DD
   */
  function getLocalDateString(timestamp = Date.now()) {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Determine if localStorage is accessible
   */
  function isLocalStorageAvailable() {
    try {
      const testKey = '__conceptlab_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  const hasLocalStorage = isLocalStorageAvailable();

  /**
   * Load raw string from storage with legacy migration
   */
  function readRaw() {
    if (hasLocalStorage) {
      try {
        const v2 = window.localStorage.getItem(STORAGE_KEY);
        if (v2) return v2;
        // Check for v1 storage and migrate
        const v1 = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (v1) {
          return v1;
        }
        return memoryStore;
      } catch (e) {
        console.warn('ConceptLab Storage: localStorage read failed, using memory store.', e);
        return memoryStore;
      }
    }
    return memoryStore;
  }

  /**
   * Write raw string to storage
   */
  function writeRaw(jsonStr) {
    if (hasLocalStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, jsonStr);
        return true;
      } catch (e) {
        console.warn('ConceptLab Storage: localStorage write failed (quota exceeded?), falling back to memory store.', e);
        memoryStore = jsonStr;
        return false;
      }
    }
    memoryStore = jsonStr;
    return true;
  }

  /**
   * Migrate older state shapes to current schema v2
   */
  function migrateState(parsed) {
    if (!parsed || typeof parsed !== 'object') {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    let state = { ...DEFAULT_STATE, ...parsed };

    if (!Array.isArray(state.xpEvents)) state.xpEvents = [];
    if (!Array.isArray(state.completedChallenges)) state.completedChallenges = [];
    if (!Array.isArray(state.completedModules)) state.completedModules = [];
    if (!Array.isArray(state.quizAttempts)) state.quizAttempts = [];
    if (!Array.isArray(state.unlockedAchievements)) state.unlockedAchievements = [];
    if (!Array.isArray(state.recentActivity)) state.recentActivity = [];
    if (typeof state.xp !== 'number' || isNaN(state.xp)) state.xp = 0;
    if (typeof state.soundEnabled !== 'boolean') state.soundEnabled = false;
    if (!state.moduleSettings) state.moduleSettings = JSON.parse(JSON.stringify(DEFAULT_STATE.moduleSettings));

    // Ensure all activity items have dateStr
    state.recentActivity.forEach(act => {
      if (!act.dateStr && act.timestamp) {
        act.dateStr = getLocalDateString(act.timestamp);
      }
    });

    // Ensure all challenges have dateStr
    state.completedChallenges.forEach(c => {
      if (!c.dateStr && c.timestamp) {
        c.dateStr = getLocalDateString(c.timestamp);
      }
    });

    state.version = CURRENT_SCHEMA_VERSION;
    return state;
  }

  /**
   * Fetch current state safely
   */
  function getState() {
    const raw = readRaw();
    if (!raw) {
      const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
      writeRaw(JSON.stringify(fresh));
      return fresh;
    }

    try {
      const parsed = JSON.parse(raw);
      return migrateState(parsed);
    } catch (err) {
      console.error('ConceptLab Storage: Corrupted storage state detected. Initializing fresh defaults.', err);
      const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
      writeRaw(JSON.stringify(fresh));
      return fresh;
    }
  }

  /**
   * Save whole state object
   */
  function saveState(state) {
    if (!state || typeof state !== 'object') return false;
    state.version = CURRENT_SCHEMA_VERSION;
    const jsonStr = JSON.stringify(state);
    const success = writeRaw(jsonStr);

    try {
      window.dispatchEvent(new CustomEvent('conceptlab:storage:change', { detail: state }));
    } catch (e) {
      // Non-browser test environments
    }
    return success;
  }

  /**
   * Get specific top-level key
   */
  function get(key, defaultValue = null) {
    const state = getState();
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      return state[key];
    }
    return defaultValue;
  }

  /**
   * Set specific top-level key
   */
  function set(key, value) {
    const state = getState();
    state[key] = value;
    return saveState(state);
  }

  /* ==========================================================================
     Native Web Audio API Sound Synthesizer (Zero external files, Off by default)
     ========================================================================== */
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    return audioCtx;
  }

  function playSound(type) {
    const state = getState();
    if (!state.soundEnabled) return; // Strictly off by default

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const now = ctx.currentTime;
      if (type === 'success' || type === 'xp') {
        // Melodic ascending major chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === 'achievement') {
        // Celebratory triumphant fanfare (C5 -> G5 -> C6)
        const notes = [523.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.15, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.5);
        });
      } else if (type === 'error') {
        // Soft low blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(311.13, now);
        osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Audio playback fails gracefully
    }
  }

  /* ==========================================================================
     XP Award & Event Deduplication Engine
     ========================================================================== */

  /**
   * Award XP with strict unique event ID deduplication
   * Prevents duplicate XP awards for the same unique completion event.
   */
  function awardXP(eventId, amount, reason, category = 'general') {
    if (!eventId || typeof amount !== 'number' || amount <= 0) {
      return { awarded: false, reason: 'Invalid parameters' };
    }

    const state = getState();

    // Check if unique event was already awarded
    const alreadyAwarded = state.xpEvents.some(e => e.eventId === eventId);
    if (alreadyAwarded) {
      return { awarded: false, reason: 'Duplicate event ID: XP already awarded' };
    }

    // Award XP
    state.xp += amount;
    const now = Date.now();
    const eventRecord = {
      eventId,
      category,
      amount,
      reason,
      timestamp: now,
      dateStr: getLocalDateString(now)
    };
    state.xpEvents.unshift(eventRecord);

    recordActivity(category, `Earned +${amount} XP: ${reason}`, 'xp', state);

    // Save and check achievements
    saveState(state);
    checkAndUnlockAchievements();

    // Sound and visual feedback
    playSound('xp');
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('conceptlab:xp:awarded', { 
          detail: { amount, reason, totalXP: state.xp, eventId } 
        }));
      } catch (e) {}
    }

    return { awarded: true, amount, totalXP: state.xp, eventRecord };
  }

  /**
   * Complete a verified learning challenge in DAA, COA, or FLAT
   * Awards 20 XP on first completion and checks for 3-subject mastery bonus (50 XP).
   */
  function completeChallenge(challengeId, subject, title, details = {}) {
    if (!challengeId || !subject) return { success: false };

    const state = getState();
    const now = Date.now();
    const dateStr = getLocalDateString(now);

    const isExisting = state.completedChallenges.some(c => c.challengeId === challengeId);

    // Store in completedChallenges if new
    if (!isExisting) {
      state.completedChallenges.push({
        challengeId,
        subject,
        title: title || challengeId,
        details,
        timestamp: now,
        dateStr
      });
      saveState(state);
    }

    // Award XP if this specific challenge hasn't been awarded before
    const xpEventId = `challenge_${challengeId}`;
    let xpAmount = XP_RULES.DAA_CHALLENGE;
    if (subject === 'coa') xpAmount = XP_RULES.COA_CHALLENGE;
    if (subject === 'flat') xpAmount = XP_RULES.FLAT_CHALLENGE;

    const xpResult = awardXP(xpEventId, xpAmount, `Completed ${subject.toUpperCase()} challenge: ${title || challengeId}`, subject);

    // Check if subject module can be marked complete
    checkModuleCompletion(subject);

    // Check Triple Master: All 3 subject modules have at least 1 completed challenge
    const subjectsCompleted = new Set(getState().completedChallenges.map(c => c.subject));
    if (subjectsCompleted.has('daa') && subjectsCompleted.has('coa') && subjectsCompleted.has('flat')) {
      // Award 50 bonus XP for completing all three subjects
      awardXP('all_modules_bonus', XP_RULES.ALL_MODULES_BONUS, 'Triple Module Mastery: Completed challenges across DAA, COA, and FLAT!', 'all');
    }

    checkAndUnlockAchievements();

    return {
      success: true,
      firstTime: !isExisting,
      xpAwarded: xpResult.awarded ? xpResult.amount : 0
    };
  }

  function checkModuleCompletion(subject) {
    const state = getState();
    if (!state.completedModules.includes(subject)) {
      state.completedModules.push(subject);
      recordActivity(subject, `Completed curriculum laboratory: ${subject.toUpperCase()}`, 'module', state);
      saveState(state);
    }
  }

  /**
   * Record genuine quiz attempt and evaluate 80% accuracy bonus
   */
  function recordQuizAttempt(quizId, score, maxScore) {
    const state = getState();
    const now = Date.now();
    const dateStr = getLocalDateString(now);
    const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    const attempt = {
      quizId,
      score,
      maxScore,
      accuracy,
      timestamp: now,
      dateStr
    };

    state.quizAttempts.unshift(attempt);
    recordActivity('quiz', `Completed ${quizId.toUpperCase()} quiz (${score}/${maxScore} - ${accuracy}%)`, 'quiz', state);
    saveState(state);

    // Bonus XP rule: Completing a subject's quiz with >= 80% accuracy gives 30 bonus XP
    if (accuracy >= 80 && maxScore >= 3) {
      const bonusEventId = `quiz_bonus_80_${quizId}`;
      awardXP(bonusEventId, XP_RULES.QUIZ_80_PERCENT_BONUS, `Quiz Excellence: Scored ${accuracy}% on ${quizId.toUpperCase()} practice quiz!`, 'quiz');
    }

    checkAndUnlockAchievements();
    return attempt;
  }

  /**
   * Record genuine user activity
   */
  function recordActivity(labId, title, type = 'visit', stateObj = null) {
    const state = stateObj || getState();
    if (!Array.isArray(state.recentActivity)) {
      state.recentActivity = [];
    }

    const now = Date.now();
    const entry = {
      id: 'act_' + now + '_' + Math.floor(Math.random() * 1000),
      labId,
      title,
      type,
      timestamp: now,
      dateStr: getLocalDateString(now)
    };

    state.recentActivity.unshift(entry);
    if (state.recentActivity.length > 20) {
      state.recentActivity = state.recentActivity.slice(0, 20);
    }

    if (!stateObj) {
      saveState(state);
    }
    return entry;
  }

  /**
   * Get recent activity list
   */
  function getRecentActivity(limit = 6) {
    const state = getState();
    return (state.recentActivity || []).slice(0, limit);
  }

  /* ==========================================================================
     Achievements Evaluation Engine (All 8 canonical requirements)
     ========================================================================== */

  /**
   * Recompute achievement eligibility strictly from validated completion records
   */
  function checkAndUnlockAchievements() {
    const state = getState();
    const newlyUnlocked = [];

    const existingUnlockedIds = new Set((state.unlockedAchievements || []).map(a => a.id));

    ACHIEVEMENTS_DEF.forEach(def => {
      if (existingUnlockedIds.has(def.id)) return; // Already unlocked

      let eligible = false;
      let triggerEventId = null;

      if (def.id === 'first_steps') {
        // Complete your first verified challenge
        if (state.completedChallenges.length >= 1) {
          eligible = true;
          triggerEventId = state.completedChallenges[0].challengeId;
        }
      } else if (def.id === 'algorithm_explorer') {
        // Complete a DAA challenge
        const daaChallenge = state.completedChallenges.find(c => c.subject === 'daa');
        if (daaChallenge) {
          eligible = true;
          triggerEventId = daaChallenge.challengeId;
        }
      } else if (def.id === 'number_ninja') {
        // Complete a COA challenge
        const coaChallenge = state.completedChallenges.find(c => c.subject === 'coa');
        if (coaChallenge) {
          eligible = true;
          triggerEventId = coaChallenge.challengeId;
        }
      } else if (def.id === 'state_machine_master') {
        // Complete a FLAT challenge
        const flatChallenge = state.completedChallenges.find(c => c.subject === 'flat');
        if (flatChallenge) {
          eligible = true;
          triggerEventId = flatChallenge.challengeId;
        }
      } else if (def.id === 'perfect_practice') {
        // Score 100% on a complete quiz
        const perfectQuiz = state.quizAttempts.find(q => q.maxScore >= 3 && q.score === q.maxScore);
        if (perfectQuiz) {
          eligible = true;
          triggerEventId = `quiz_${perfectQuiz.quizId}_100`;
        }
      } else if (def.id === 'consistent_learner') {
        // Complete five distinct challenges
        const distinctCount = new Set(state.completedChallenges.map(c => c.challengeId)).size;
        if (distinctCount >= 5) {
          eligible = true;
          triggerEventId = 'challenges_5_distinct';
        }
      } else if (def.id === 'triple_master') {
        // Complete challenges in all three subject modules
        const subjects = new Set(state.completedChallenges.map(c => c.subject));
        if (subjects.has('daa') && subjects.has('coa') && subjects.has('flat')) {
          eligible = true;
          triggerEventId = 'all_three_subjects_completed';
        }
      } else if (def.id === 'persistent_learner') {
        // Complete challenges on three distinct local calendar dates
        const distinctDates = new Set(state.completedChallenges.map(c => c.dateStr).filter(Boolean));
        if (distinctDates.size >= 3) {
          eligible = true;
          triggerEventId = 'three_distinct_dates_learned';
        }
      }

      if (eligible) {
        const now = Date.now();
        const record = {
          id: def.id,
          title: def.title,
          desc: def.desc,
          unlockedAt: now,
          unlockedDateStr: getLocalDateString(now),
          eventId: triggerEventId || 'manual_verification'
        };
        state.unlockedAchievements.push(record);
        newlyUnlocked.push(record);
      }
    });

    if (newlyUnlocked.length > 0) {
      saveState(state);
      playSound('achievement');

      // Announce each unlock
      newlyUnlocked.forEach(ach => {
        if (typeof App !== 'undefined' && App.showPopup) {
          App.showPopup({
            type: 'success',
            title: `Achievement Unlocked: ${ach.title}! 🏆`,
            message: `${ach.desc} (Unlocked based on genuine completion history).`,
            badges: [
              { label: 'Achievement', value: ach.title },
              { label: 'Status', value: 'Unlocked' }
            ],
            duration: 6000
          });
        }
      });
    }

    return newlyUnlocked;
  }

  /**
   * Calculate genuine learning streak based on consecutive calendar dates
   */
  function calculateStreak() {
    const state = getState();
    const dates = new Set();

    (state.completedChallenges || []).forEach(c => {
      if (c.dateStr) dates.add(c.dateStr);
    });
    (state.recentActivity || []).forEach(a => {
      if (a.dateStr) dates.add(a.dateStr);
    });

    if (dates.size === 0) return 0;

    // Convert dates to sorted array
    const sortedDates = Array.from(dates).sort().reverse();
    const today = getLocalDateString(Date.now());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate.getTime());

    // If neither today nor yesterday has activity, streak is 0
    if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) {
      return 0;
    }

    let streak = 0;
    let checkDate = new Date();
    // If today has no activity but yesterday does, start checking from yesterday
    if (!sortedDates.includes(today) && sortedDates.includes(yesterday)) {
      checkDate = yesterdayDate;
    }

    while (true) {
      const dateStr = getLocalDateString(checkDate.getTime());
      if (sortedDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get honest Dashboard overview metrics
   */
  function getDashboardStats() {
    const state = getState();
    
    // Total distinct challenges completed
    const distinctChallenges = new Set((state.completedChallenges || []).map(c => c.challengeId)).size;

    // Quiz stats
    let totalQuestionsAttempted = 0;
    let totalCorrectAnswers = 0;
    (state.quizAttempts || []).forEach(q => {
      totalQuestionsAttempted += (q.maxScore || 0);
      totalCorrectAnswers += (q.score || 0);
    });

    const accuracy = totalQuestionsAttempted > 0 
      ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100) 
      : 0;

    // Subject completion status
    const daaDone = (state.completedChallenges || []).some(c => c.subject === 'daa');
    const coaDone = (state.completedChallenges || []).some(c => c.subject === 'coa');
    const flatDone = (state.completedChallenges || []).some(c => c.subject === 'flat');

    const streak = calculateStreak();
    const isNewUser = (state.recentActivity.length === 0 && state.completedChallenges.length === 0 && state.xp === 0);

    return {
      isNewUser,
      totalXP: state.xp,
      completedChallengesCount: distinctChallenges,
      questionsAttempted: totalQuestionsAttempted,
      correctAnswers: totalCorrectAnswers,
      accuracy,
      streak,
      subjectStatus: {
        daa: daaDone,
        coa: coaDone,
        flat: flatDone
      },
      unlockedAchievementsCount: (state.unlockedAchievements || []).length,
      totalAchievementsAvailable: ACHIEVEMENTS_DEF.length,
      soundEnabled: state.soundEnabled
    };
  }

  /**
   * Get all 8 achievements merged with current unlocked status
   */
  function getAchievementsList() {
    const state = getState();
    const unlockedMap = new Map();
    (state.unlockedAchievements || []).forEach(a => {
      unlockedMap.set(a.id, a);
    });

    return ACHIEVEMENTS_DEF.map(def => {
      const unlockedRecord = unlockedMap.get(def.id);
      return {
        ...def,
        isUnlocked: !!unlockedRecord,
        unlockedAt: unlockedRecord ? unlockedRecord.unlockedAt : null,
        unlockedDateStr: unlockedRecord ? (unlockedRecord.unlockedDateStr || getLocalDateString(unlockedRecord.unlockedAt)) : null,
        eventId: unlockedRecord ? unlockedRecord.eventId : null
      };
    });
  }

  /**
   * Reset learning progress while preserving theme and sound settings
   */
  function resetAllProgress() {
    const currentTheme = get('theme', 'dark');
    const currentSound = get('soundEnabled', false);
    const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
    
    // Preserve preferences
    fresh.theme = currentTheme;
    fresh.soundEnabled = currentSound;

    saveState(fresh);
    return true;
  }

  return {
    getState,
    get,
    set,
    awardXP,
    completeChallenge,
    recordQuizAttempt,
    recordActivity,
    getRecentActivity,
    calculateStreak,
    getDashboardStats,
    getAchievementsList,
    checkAndUnlockAchievements,
    resetAllProgress,
    playSound,
    XP_RULES,
    ACHIEVEMENTS_DEF,
    DEFAULT_STATE
  };
})();
