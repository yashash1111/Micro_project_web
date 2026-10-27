# ConceptLab — Computer Science Concepts Playground

> 🚀 **Live Demo:** [https://microprojectweb.netlify.app/](https://microprojectweb.netlify.app/)  
> 📦 **GitHub Repository:** [https://github.com/yashash1111/Micro_project_web.git](https://github.com/yashash1111/Micro_project_web.git)

**ConceptLab** is a developer-grade, zero-dependency educational web application and interactive curriculum workbench engineered using pure standard web technologies (**HTML5**, **CSS3**, and **Vanilla JavaScript**).

ConceptLab delivers authentic, mathematically verified, client-side learning environments across three foundational computer science undergraduate engineering disciplines:

1. **DAA (Design and Analysis of Algorithms):** Binary Search Divide-and-Conquer Visualizer, Left-Boundary duplicate resolution, pseudocode tracer, and live Linear Search $O(n)$ empirical benchmark.
2. **COA (Computer Organization and Architecture):** Multi-Radix (Base 2, 8, 10, 16) parallel converter, 4-bit nibble groupings, arbitrary-precision native `BigInt` arithmetic, and a dedicated signed Two's Complement hardware register tool with strict range validation.
3. **FLAT (Formal Languages and Automata Theory):** Deterministic Finite Automaton (DFA) string validator recognizing $(0+1)^*01$, interactive SVG state diagram with curved Bézier paths and dynamic glow, tape pointer reader, and live transition matrix highlights.

---

## ⚡ Technology Stack & Constraints

- **Core Languages:** Semantic HTML5, Modular CSS3 Custom Properties, Vanilla JavaScript (ES6+).
- **Strictly Zero External Dependencies:** No React, Vue, Angular, jQuery, Bootstrap, Tailwind, Vite, Webpack, or NPM runtime dependencies.
- **No Backend / Database:** Operates 100% client-side inside standard web browsers.
- **Persistence Foundation (Schema v2):** Safe, versioned, error-resilient browser `localStorage` layer (`conceptlab_v2_store`) with in-memory quota fallbacks, JSON schema migration, and unique XP event deduplication.
- **Sound Feedback (Native Web Audio API):** Synthesized polyphonic tones for XP gains, achievements, and errors. Strictly **off by default** and controllable via a topbar toggle.
- **Network Independence:** Fully operational offline. Optional Google Fonts are included purely as progressive enhancements.

---

## 📂 Project Architecture

```
Micro_project_web/
├── index.html              # Main Single-Page Application (SPA) shell
├── css/
│   └── style.css           # Custom CSS design system, dark/light themes, animations
├── js/
│   ├── storage.js          # Persistence Foundation (Schema v2), XP rules, streak & audio
│   ├── animations.js       # Reduced-motion-aware animation helpers & teardown registry
│   ├── router.js           # Hash-based client router (#home, #daa, #coa, #flat, #quiz, #presentation)
│   ├── app.js              # Application orchestrator, theme/audio manager, telemetry & modals
│   ├── daa.js              # Module 1: Binary Search Visualizer & Linear Benchmark
│   ├── coa.js              # Module 2: Radix converter, BigInt math & Two's Complement ALU
│   ├── flat.js             # Module 3: DFA string validator & interactive SVG state machine
│   ├── quiz-questions.js   # Question Bank: 42 verified questions with multi-criteria rubrics
│   ├── quiz.js             # Practice Arena: 5-step assessment engine & session persistence
│   └── presentation.js     # Presentation Mode: 9-slide review deck with embedded live demos
├── reports/
│   ├── DAA-Report.md       # Binary Search mathematical analysis & empirical test report
│   ├── COA-Report.md       # Number systems & Two's Complement arithmetic report
│   └── FLAT-Report.md      # DFA formal definition & transition verification report
├── test_phase2.js          # Automated test suite for Phase 2 core algorithm engines
├── test_phase3.js          # Automated test suite for Phase 3 persistence, XP & presentation
├── test_coa_upgrade.js     # Automated test suite for COA Number System Lab specification
├── test_practice_arena.js  # Automated test suite for Practice Arena assessment engine
└── README.md               # Master system documentation & setup guide
```

---

## 🚀 How to Run the Application Locally

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone https://github.com/yashash1111/Micro_project_web.git
   cd Micro_project_web
   ```

2. Start a lightweight local Python HTTP server:
   ```bash
   python3 -m http.server 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Direct Navigation Hash Routes:
- `http://localhost:8000/#home` — Main Dashboard & Learning Telemetry
- `http://localhost:8000/#daa` — DAA Algorithm Studio (Binary Search)
- `http://localhost:8000/#coa` — COA Number Systems Lab (Radix & Two's Complement)
- `http://localhost:8000/#flat` — FLAT Automata Playground (DFA)
- `http://localhost:8000/#quiz` — Practice Arena & Dynamic Parameterized Problem Generator
- `http://localhost:8000/#presentation` — 9-Slide Classroom & College Review Presentation Deck

---

## 🎓 Subject-Wise Syllabus Mapping

### 1. DAA Lab: Algorithm Studio (`#daa`)
- **Syllabus Mapping:** Module 2 — Divide-and-Conquer Paradigm & Binary Search.
- **Core Concept:** Binary Search operates on a sorted array by calculating $\text{mid} = \text{low} + \lfloor(\text{high} - \text{low}) / 2\rfloor$ and discarding half the candidate space at each comparison.
- **Time Complexity:**
  - Best Case: $\Omega(1)$ (Target located directly at initial midpoint).
  - Average Case: $\Theta(\log n)$ (Internal decision node).
  - Worst Case: $O(\log n)$ (Max $\lfloor \log_2 n \rfloor + 1$ comparisons).
- **Space Complexity:** $O(1)$ Auxiliary space (iterative pointers).
- **Key Features:**
  - Hero search bar with auto-sort ascending button.
  - Standard Search vs Left-Boundary Search (first occurrence).
  - Side-by-side empirical benchmark against **Linear Search $O(n)$**.
  - Line-by-line active pseudocode viewer highlighting during step replay.
  - Multi-speed controls (0.25x to 4x), progress indicator, and step rewind.

### 2. COA Lab: Number System & Machine Representation Lab (`#coa`)
- **Syllabus Mapping:** Module 1 — Number Systems, Radix Conversions & Machine Integer Arithmetic.
- **Core Concept:** Positional notation $N = \sum (d_i \times b^i)$ across Binary ($b=2$), Octal ($b=8$), Decimal ($b=10$), and Hexadecimal ($b=16$).
- **Tabbed Interface Organization:**
  1. **Base Converter:**
     - Simultaneous 4-radix outputs with native `BigInt` arbitrary precision ($> \text{MAX\_SAFE\_INTEGER}$, e.g. $2^{60}$).
     - Zero displayed as `0` in every base; Hexadecimal formatted in uppercase.
     - Strict character & digit validation rejecting invalid inputs (e.g. `102` in binary, `89` in octal, `12A` in decimal).
     - **Swap-Base Button:** Quickly swaps source and target bases and reloads converted values for reverse verification.
     - One-click copy buttons with animated confirmation.
     - 4-bit nibble groupings with 8-4-2-1 BCD positional weights and hardware register bit cells.
  2. **Step-by-Step Explanation:**
     - **Positional Weight Expansion Table:** Shows digit $d_i$, position $i$, weight $b^i$, product, and sum breakdown.
     - **Repeated Radix Division Breakdown:** Shows dividend, divisor, quotient, and remainder at each step with clear bottom-to-top reading explanation for binary, octal, and hex.
     - **Interactive Playback Controls:** Restart, Prev Step, Play/Pause, Next Step, and Show All with active step row highlighting.
  3. **Signed Numbers & Two's Complement:**
     - Support for 8-bit, 16-bit, and 32-bit hardware registers.
     - **Strict Range Validation:** Rejects values outside $[-2^{n-1}, 2^{n-1}-1]$ (e.g., $128$ and $-129$ for 8-bit).
     - Simultaneous comparison of 4 representations: Unsigned Binary, Signed Magnitude, One's Complement, and Two's Complement with valid range boundaries.
     - **4-Step Negative Derivation:** 1) Positive magnitude in $N$ bits, 2) Bitwise inversion (1's complement), 3) Add 1 to LSB, 4) Final $N$-bit result.
     - Exact algebraic verification: $\text{Value} = -b_{n-1} 2^{n-1} + \sum_{i=0}^{n-2} b_i 2^i$.
  4. **Number System Practice Arena:**
     - Interactive practice covering binary/decimal/octal/hex conversions, invalid input detection, unsigned ranges, two's complement, and range boundaries.
     - Immediate feedback, retry mechanism, stats tracking (attempted, correct, accuracy rate, XP).
     - Genuine integration with `Storage.completeChallenge` and centralized XP rules.
     - Procedural dynamic challenge generator for unlimited practice problems.
  5. **Educational Theory Guide:**
     - Beginner-friendly explanations of bits, bytes, binary switching, octal/hex shorthand, positional notation, fixed-width registers, and ALU two's complement arithmetic.

### 3. FLAT Lab: Automata Playground (`#flat`)
- **Syllabus Mapping:** Module 1 — Finite Automata & Regular Languages ($L = \{w \in \{0, 1\}^* \mid w \text{ ends with '01'}\}$).
- **Formal 5-Tuple:** $M = (Q, \Sigma, \delta, q_0, F)$ where $Q = \{q_0, q_1, q_2\}$, $\Sigma = \{0, 1\}$, start state $q_0$, and $F = \{q_2\}$.
- **Key Features:**
  - Interactive SVG State Diagram with curved directed paths, self-loops, active state pulse, and active edge glow.
  - Animated Tape Head Pointer (`▲`) tracking the active symbol being consumed.
  - Real-time State Transition Matrix highlighting active state row and symbol column.
  - **Strict Halting Acceptance:** Verdict is evaluated only after the entire string is read, preventing false early matches.

---

## 🎮 Gamification, Persistence & Audio Engine (Phase 3)

### 1. Centralized XP Rules & Unique Award Protection
Every XP award is tied to a unique `eventId` and verified against the event audit log:
- **DAA Challenge Completion:** 20 XP (`challenge_daa_*`).
- **COA Challenge Completion:** 20 XP (`challenge_coa_*`).
- **FLAT Challenge Completion:** 20 XP (`challenge_flat_*`).
- **Quiz 80%+ Accuracy Bonus:** 30 bonus XP (`quiz_bonus_80_*`).
- **Triple Module Mastery Bonus:** 50 bonus XP upon completing challenges across all three subjects (`all_modules_bonus`).
- **Deduplication Invariant:** Retrying challenges or refreshing never awards duplicate XP for the same unique completion event.

### 2. The 8 Canonical Achievements
| Badge ID | Title | Description | Trigger Requirement |
| :---: | :--- | :--- | :--- |
| `first_steps` | **First Steps** | Complete your first verified challenge | Any 1 completed challenge |
| `algorithm_explorer` | **Algorithm Explorer** | Execute a verified DAA Binary Search trace | Complete DAA search |
| `number_ninja` | **Number Ninja** | Execute a COA radix conversion or two's complement | Complete COA calculation |
| `state_machine_master` | **State Machine Master** | Verify a binary string against the FLAT DFA | Complete FLAT validation |
| `perfect_practice` | **Perfect Practice** | Score 100% on a complete practice quiz | Score 100% (min 3 questions) |
| `consistent_learner` | **Consistent Learner** | Complete five distinct verified challenges | 5 distinct challenge IDs |
| `triple_master` | **Triple Master** | Complete challenges in all three subject modules | DAA + COA + FLAT completed |
| `persistent_learner` | **Persistent Learner** | Complete challenges on 3 distinct calendar dates | 3 local `YYYY-MM-DD` dates |

### 3. Trustworthy Local Date Streaks
- Calculated strictly from browser local clock calendar dates (`YYYY-MM-DD`).
- Streak increments for consecutive days ending today or yesterday. If no activity exists today or yesterday, streak is honestly reported as `0`.
- Displayed with a glowing fire icon (`🔥`) on the Dashboard.

### 4. Native Web Audio API Sound Feedback
- Custom synthesized sound effects for XP awards, achievements, and error alerts.
- **Off by default**; toggled via the speaker icon in the topbar (`#btn-sound-toggle`).
- State persisted in `localStorage` alongside theme settings.

---

## 📽️ College Review Presentation Deck (9 Sections)

Accessible via `/#presentation` or the topbar **"📽️ Present"** button:
1. **Problem Statement:** Pedagogical gaps in abstract computer science instruction.
2. **Project Objectives:** Truthful computation, curriculum mapping, zero external dependencies.
3. **Technology Stack:** Pure web standards, native BigInt, SVG state graphs, Schema v2 persistence.
4. **DAA Concept & Live Demo:** Algorithmic invariants, $O(\log n)$ derivation, with **embedded interactive live binary search**.
5. **COA Concept & Live Demo:** Radix theory, ALU complement arithmetic, with **embedded interactive live number converter**.
6. **FLAT Concept & Live Demo:** Formal 5-tuple, language invariants, with **embedded interactive live DFA simulator**.
7. **Testing Methodology:** Algorithmic verification, edge-case coverage, idempotency checks.
8. **Test Cases & Observed Results:** Complete verification matrix across all three modules.
9. **Conclusion & Learning Outcomes:** Summary of educational efficacy and deployment readiness.

**Controls:** Previous, Next, Progress Dots, Restart, Section Jump Dropdown, Return to Dashboard, and Fullscreen toggle (`F` or button). Keyboard navigation: `←`, `→`, `Space`, `Esc`.

---

## 🧪 Automated Test Verification

ConceptLab includes comprehensive automated unit and integration tests executing under Node.js:

```bash
# Run Phase 2 Algorithm Engine Tests
node test_phase2.js

# Run Phase 3 Persistence, XP & Presentation Tests
node test_phase3.js

# Run COA Number System Lab Verification Suite (All Section 8 test cases)
node test_coa_upgrade.js

# Run Practice Arena Assessment & Pedagogical Verification Suite
node test_practice_arena.js
```

### Verification Results:
- **`test_phase2.js`:** 100% Pass (Binary search edge cases, BigInt conversions, Two's complement range checks, all 6 DFA transitions, parameterized question generator).
- **`test_phase3.js`:** 100% Pass (Schema v2 initialization, XP deduplication, Triple Master 50 XP bonus, 80% quiz bonus, all 8 canonical achievements, calendar streak calculation, safe factory reset preserving preferences, 9 presentation slides).
- **`test_coa_upgrade.js`:** 100% Pass (All Section 8 test cases: Binary 1011→11, Dec 25→11001, Dec 255→FF, Hex FF→255, Octal 17→15, rejections for Binary 102, Octal 89, Dec 12A, Zero in all bases, BigInt 2⁶⁰, 8-bit two's complement of -5→11111011, bounds [-128..+127], rejections for 128 and -129, 16-bit bounds, 32-bit bounds, positional expansion math, and repeated division steps).
- **`test_practice_arena.js`:** 100% Pass (All 42 curriculum questions schema, deterministic 10-question mixed pedagogical sequence, multi-criteria subjective rubric evaluation, and storage session persistence).

---

## ♿ Accessibility & Quality Standards

- **Semantic HTML5:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **Keyboard Navigation:** Full tab order, visible focus rings (`:focus-visible`), shortcut keys (`Ctrl+K` quick jump, arrow keys in presentation mode).
- **Reduced Motion Compliance:** `@media (prefers-reduced-motion: reduce)` automatically softens or disables animations and transitions.
- **Screen Reader Support:** ARIA live regions for telemetry updates, accessible button labels, and semantic SVG titles.
