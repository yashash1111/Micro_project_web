# FLAT Laboratory Report: Deterministic Finite Automaton (DFA) String Validator

**Course / Subject:** Formal Languages and Automata Theory (FLAT)  
**Academic Syllabus Mapping:** Module 1 — Finite Automata, Regular Languages & State Transition Systems  
**Module Identifier:** `FLAT-203 • Module 1`  
**Software Component:** Automata Playground (`index.html#flat`, `js/flat.js`)  
**Architecture:** Pure Client-Side HTML5 / CSS3 / Vanilla JavaScript / Interactive SVG Vector Graphics

---

## 1. Problem Statement & Academic Objectives

### 1.1 Problem Statement
In theoretical computer science, a **Deterministic Finite Automaton (DFA)** is the formal mathematical model characterizing Type-3 (Regular) languages within the Chomsky Hierarchy. A DFA reads an input string symbol-by-symbol, transitioning through internal state configurations without external memory or backtracking. 

Key pedagogical challenges faced by students include:
1. Understanding the formal 5-tuple definition $M = (Q, \Sigma, \delta, q_0, F)$ and state semantics.
2. Comprehending that string acceptance is determined **strictly upon halting after consuming the entire string**, not merely visiting an accepting state midway.
3. Visualizing how self-loops, forward jumps, and fallback transitions maintain regular language invariants.
4. Tracking the read-head tape pointer across discrete clock cycles.

### 1.2 Educational Objectives
- Construct an interactive, visually animated DFA demonstrator recognizing the regular language:
  $$L = \{ w \in \{0, 1\}^* \mid w \text{ ends with the substring '01'} \}$$
- Render an interactive, dynamic SVG state diagram with curved Bézier transition paths, self-loops, and glowing active nodes and edges.
- Implement an animated **Input Tape Pointer Reader** tracking each consumed symbol.
- Maintain a **Transition Matrix (State Table)** highlighting the active state row and input symbol column at every step.
- Enforce formal theoretical rigor: evaluate acceptance only after the entire string is read ($q_{\text{final}} \in F$).

---

## 2. Formal Mathematical Automaton Definition

A Deterministic Finite Automaton is formally specified by a 5-tuple:
$$M = (Q, \Sigma, \delta, q_0, F)$$

### 2.1 The 5 Components
1. **Finite Set of States ($Q$):**
   $$Q = \{ q_0, q_1, q_2 \}$$
   - **$q_0$ (Start / Reset State):** Initial state; represents that the string currently has no relevant matching suffix (either at start or following a symbol `1` that reset the search).
   - **$q_1$ (Trailing '0' State):** The most recently consumed symbol is `0` (potential prefix of the target suffix `'01'`).
   - **$q_2$ (Accept / Target Match State):** The string currently ends in the complete target sequence `'01'`.
2. **Alphabet ($\Sigma$):**
   $$\Sigma = \{ 0, 1 \}$$
3. **Start / Initial State ($q_0$):**
   $$q_0 \in Q$$
4. **Set of Accept / Final States ($F$):**
   $$F = \{ q_2 \} \subseteq Q$$
5. **Transition Function ($\delta: Q \times \Sigma \to Q$):**
   Defined by the transition mapping:

| Current State ($q$) | Input Symbol '0' | Input Symbol '1' | Transition Semantics & Invariant Rationale |
| :---: | :---: | :---: | :--- |
| **$q_0$** (Start) | $q_1$ | $q_0$ | On `0`: advances toward target; on `1`: loops in $q_0$ (no progress). |
| **$q_1$** | $q_1$ | $q_2$ | On `0`: stays in $q_1$ (last symbol is still `0`); on `1`: completes `'01'` moving to accept state $q_2$. |
| **$q_2$** (Accept) | $q_1$ | $q_0$ | On `0`: breaks `'01'` but leaves trailing `0` $\implies q_1$; on `1`: breaks `'01'` completely $\implies q_0$. |

### 2.2 Formal Language Acceptance & Extended Transition Function
The extended transition function $\hat{\delta}: Q \times \Sigma^* \to Q$ describes the state reached after processing a string $w$:
$$\hat{\delta}(q, \varepsilon) = q$$
$$\hat{\delta}(q, w a) = \delta(\hat{\delta}(q, w), a) \quad \text{for } w \in \Sigma^*, a \in \Sigma$$

#### Acceptance Invariant:
A string $w \in \Sigma^*$ belongs to $L(M)$ if and only if:
$$\hat{\delta}(q_0, w) \in F$$

- **Crucial Theoretical Nuance:** Visiting $q_2$ during intermediate steps does **not** accept the string if subsequent symbols move the machine out of $q_2$.
- **Empty String ($\varepsilon$):** $\hat{\delta}(q_0, \varepsilon) = q_0 \notin F \implies$ **Rejected**.
- **Single Symbols:** $\hat{\delta}(q_0, '0') = q_1 \notin F$ (Rejected); $\hat{\delta}(q_0, '1') = q_0 \notin F$ (Rejected).

---

## 3. Implementation Details & Architecture

### 3.1 Modular Structure (`js/flat.js`)
The `FlatLab` component is organized as follows:
- **`DFA_SPEC` Definition**: Explicit mapping of states, alphabet, start state, accept set, and transition table lookup `DFA_SPEC.transitions[state][sym]`. Strictly zero regex cheating.
- **`computeDfaTrace(inputStr)`**: Simulates symbol-by-symbol consumption and records an array of transition step records:
  $$\{ \text{stepNum}, \text{fromState}, \text{symbol}, \text{toState}, \text{isIntermediateAccept}, \text{isFinalStep} \}$$
- **Interactive SVG Vector Diagram**: Renders the complete 3-state transition graph using native SVG markup:
  - Directed curved cubic/quadratic Bézier paths (`<path d="...">`).
  - Circular self-loops on $q_0$ (symbol 1) and $q_1$ (symbol 0).
  - Double concentric boundary circles for final state $q_2$.
  - Dynamic active glow on the currently active state circle (`pulseRingEmerald`) and active transition path.
- **Input Tape Visualizer**: Displays discrete character cells with an animated read-head marker (`▲`) highlighting the current symbol.
- **State Transition Matrix**: Live table highlighting the active state row and symbol column during execution.
- **Playback Controls**: Step Forward, Step Back, Play / Pause with speed control, and Reset.

---

## 4. Screenshot Placeholders

```
+----------------------------------------------------------------------------------------------------+
|                                      SCREENSHOT PLACEHOLDER 1                                      |
|                                                                                                    |
|  Caption: FLAT Automata Playground — Interactive SVG State Diagram with Active State & Edge Glow   |
|  Path: screenshots/flat_svg_state_diagram.png                                                      |
|                                                                                                    |
|  [ SVG Graph: (q0) --0--> (q1) --1--> ((q2)) | Active Node: q2 (Accept) | Edge q1->q2 glowing ]    |
|  [ Self-Loops: q0 (1), q1 (0) | Return Edges: q2->q1 (0), q2->q0 (1) ]                             |
+----------------------------------------------------------------------------------------------------+
```

```
+----------------------------------------------------------------------------------------------------+
|                                      SCREENSHOT PLACEHOLDER 2                                      |
|                                                                                                    |
|  Caption: FLAT Input Tape Pointer and Live Step-by-Step Transition Execution Table                 |
|  Path: screenshots/flat_tape_and_trace.png                                                         |
|                                                                                                    |
|  [ Tape: [1] [1] [0] [1] [0] [1] | Head Pointer: ▲ on cell 5 ('1') ]                              |
|  [ Step 6: δ(q1, '1') -> q2 | Halting in Accept State q2 ∈ F | Banner: ACCEPTED ✓ ]                |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. Test Cases & Empirical Results

The following test suite was executed against the actual JavaScript implementation. All 6 transitions and language membership rules were verified.

### 5.1 Verification of All 6 DFA State Transitions
| Test ID | Starting State | Input Symbol | Expected Next State | Actual State Produced | Verification |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **TRANS-1** | $q_0$ | `'0'` | $q_1$ | $q_1$ | **PASS** |
| **TRANS-2** | $q_0$ | `'1'` | $q_0$ | $q_0$ | **PASS** |
| **TRANS-3** | $q_1$ | `'0'` | $q_1$ | $q_1$ | **PASS** |
| **TRANS-4** | $q_1$ | `'1'` | $q_2$ | $q_2$ (Accept) | **PASS** |
| **TRANS-5** | $q_2$ | `'0'` | $q_1$ | $q_1$ | **PASS** |
| **TRANS-6** | $q_2$ | `'1'` | $q_0$ | $q_0$ | **PASS** |

### 5.2 Language Membership & Edge Case Test Suite
| Test ID | Input String ($w$) | Full State Transition Sequence | Halting State | Formal Verdict | Status |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **FLAT-01** | `"01"` | $q_0 \xrightarrow{0} q_1 \xrightarrow{1} q_2$ | $q_2$ | **ACCEPTED** | **PASS** |
| **FLAT-02** | `"101"` | $q_0 \xrightarrow{1} q_0 \xrightarrow{0} q_1 \xrightarrow{1} q_2$ | $q_2$ | **ACCEPTED** | **PASS** |
| **FLAT-03** | `"11001"` | $q_0 \xrightarrow{1} q_0 \xrightarrow{1} q_0 \xrightarrow{0} q_1 \xrightarrow{0} q_1 \xrightarrow{1} q_2$ | $q_2$ | **ACCEPTED** | **PASS** |
| **FLAT-04** | `"0001"` | $q_0 \xrightarrow{0} q_1 \xrightarrow{0} q_1 \xrightarrow{0} q_1 \xrightarrow{1} q_2$ | $q_2$ | **ACCEPTED** | **PASS** |
| **FLAT-05** | `"110101"` | $q_0 \xrightarrow{1} q_0 \xrightarrow{1} q_0 \xrightarrow{0} q_1 \xrightarrow{1} q_2 \xrightarrow{0} q_1 \xrightarrow{1} q_2$ | $q_2$ | **ACCEPTED** | **PASS** |
| **FLAT-06** | `""` (Empty $\varepsilon$) | $q_0$ (zero transitions) | $q_0$ | **REJECTED** | **PASS** |
| **FLAT-07** | `"0"` | $q_0 \xrightarrow{0} q_1$ | $q_1$ | **REJECTED** | **PASS** |
| **FLAT-08** | `"1"` | $q_0 \xrightarrow{1} q_0$ | $q_0$ | **REJECTED** | **PASS** |
| **FLAT-09** | `"0000"` | $q_0 \xrightarrow{0} q_1 \xrightarrow{0} q_1 \xrightarrow{0} q_1 \xrightarrow{0} q_1$ | $q_1$ | **REJECTED** | **PASS** |
| **FLAT-10** | `"1111"` | $q_0 \xrightarrow{1} q_0 \xrightarrow{1} q_0 \xrightarrow{1} q_0 \xrightarrow{1} q_0$ | $q_0$ | **REJECTED** | **PASS** |
| **FLAT-11** | `"010"` | $q_0 \xrightarrow{0} q_1 \xrightarrow{1} q_2 \xrightarrow{0} q_1$ | $q_1$ | **REJECTED** | **PASS** |
| **FLAT-12** | `"011"` | $q_0 \xrightarrow{0} q_1 \xrightarrow{1} q_2 \xrightarrow{1} q_0$ | $q_0$ | **REJECTED** | **PASS** |
| **FLAT-13** | `"1010"` | $q_0 \xrightarrow{1} q_0 \xrightarrow{0} q_1 \xrightarrow{1} q_2 \xrightarrow{0} q_1$ | $q_1$ | **REJECTED** | **PASS** |
| **FLAT-14** | `"abc"` | Rejection before simulation: Alphabet $\Sigma = \{0, 1\}$ | N/A | **REJECTED** | **PASS** |

---

## 6. Conclusion & Pedagogical Impact

The FLAT Automata Playground provides computer science students with a mathematically rigorous yet intuitive vehicle for understanding finite-state computation. By synchronizing tape head movements, dynamic vector diagram highlights, and active matrix cell focus, students observe the exact mechanics of regular language recognition and internalize the critical distinction between intermediate state transitions and terminal halting verdicts.
