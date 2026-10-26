# COA Laboratory Report: Number Systems Lab & Hardware Two's Complement Arithmetic

**Course / Subject:** Computer Organization and Architecture (COA)  
**Academic Syllabus Mapping:** Module 1 — Number Systems, Radix Conversions & Machine Integer Representation  
**Module Identifier:** `COA-202 • Module 1`  
**Software Component:** Number Systems Lab (`index.html#coa`, `js/coa.js`)  
**Architecture:** Pure Client-Side HTML5 / CSS3 / Vanilla JavaScript (Native `BigInt` Engine)

---

## 1. Problem Statement & Academic Objectives

### 1.1 Problem Statement
Modern digital computing systems represent and manipulate all information as binary voltage states ($0\text{V} = \text{logic } 0, +V = \text{logic } 1$). However, human software developers and computer engineers communicate numerical values using multiple positional notations, most notably **Decimal (Base 10)**, **Binary (Base 2)**, **Octal (Base 8)**, and **Hexadecimal (Base 16)**. Furthermore, inside central processing unit (CPU) Arithmetic Logic Units (ALUs), signed numbers are encoded using **Two's Complement**, which unifies addition and subtraction into a single adder circuit.

Common instructional challenges include:
1. Converting between non-decimal bases without intermediate decimal roundoff errors.
2. Visualizing how bits correspond to 4-bit nibbles and hexadecimal digits ($2^4 = 16$).
3. Understanding how signed integers are bounded by register bit widths ($[-2^{n-1}, 2^{n-1}-1]$).
4. Verifying why the Most Significant Bit (MSB) in two's complement carries a negative algebraic weight $-2^{n-1}$.

### 1.2 Educational Objectives
- Construct a real-time, 150ms debounced multi-radix converter that translates numbers across Binary, Octal, Decimal, and Hexadecimal simultaneously.
- Eliminate IEEE-754 floating point precision limits using arbitrary-precision native JavaScript `BigInt`.
- Implement a dedicated **Two's Complement Hardware Register Tool** supporting 8-bit, 16-bit, and 32-bit registers with strict algebraic range rejection.
- Display 4-bit nibble grouping and an algebraic bit-weight summation table demonstrating that $\text{Decimal} = -b_{n-1} 2^{n-1} + \sum_{i=0}^{n-2} b_i 2^i$.

---

## 2. Theoretical Number System Principles & Arithmetic Equations

### 2.1 Positional Number Representation
A positional number in radix (base) $b \ge 2$ with $k$ integer digits is formally defined by the polynomial summation:
$$N = \sum_{i=0}^{k-1} d_i \times b^i = d_{k-1} b^{k-1} + d_{k-2} b^{k-2} + \dots + d_1 b^1 + d_0 b^0$$
where each digit $d_i$ satisfies $0 \le d_i < b$.

- **Binary ($b = 2$):** $d_i \in \{0, 1\}$. Positional weights: $2^0=1, 2^1=2, 2^2=4, 2^3=8, \dots$
- **Octal ($b = 8$):** $d_i \in \{0, 1, \dots, 7\}$. Positional weights: $8^0=1, 8^1=8, 8^2=64, \dots$
- **Decimal ($b = 10$):** $d_i \in \{0, 1, \dots, 9\}$. Positional weights: $10^0=1, 10^1=10, 10^2=100, \dots$
- **Hexadecimal ($b = 16$):** $d_i \in \{0, \dots, 9, \text{A}(10), \text{B}(11), \text{C}(12), \text{D}(13), \text{E}(14), \text{F}(15)\}$. Positional weights: $16^0=1, 16^1=16, 16^2=256, \dots$

### 2.2 Algorithm: Repeated Radix Division
To convert a decimal integer $N_{10}$ to target base $b$:
1. Divide $N$ by $b$ to yield integer quotient $Q_0$ and remainder $R_0 = N \bmod b$.
2. The remainder $R_0$ forms the least significant digit (LSD, $d_0$).
3. Recursively repeat $Q_j \div b = Q_{j+1} \text{ R } R_{j+1}$ until quotient $Q = 0$.
4. Collect remainders in reverse order (bottom-to-top):
   $$N_b = (R_m R_{m-1} \dots R_1 R_0)_b$$

### 2.3 Hardware Signed Integer Encodings
In digital hardware architectures with register width $n$ bits:

#### 1. Sign-Magnitude:
- $\text{MSB} = 0 \implies \text{positive}$; $\text{MSB} = 1 \implies \text{negative}$.
- Magnitude stored in remaining $n-1$ bits.
- *Disadvantage:* Two representations of zero ($+0 = 00000000_2, -0 = 10000000_2$), complicating ALU circuitry.

#### 2. One's Complement:
- Negative values formed by bitwise NOT: $\sim X$.
- *Disadvantage:* Dual representation of zero ($00000000_2$ and $11111111_2$); requires end-around carry addition.

#### 3. Two's Complement (Standard CPU Architecture):
- For an $n$-bit register, a negative integer $-X$ is computed as:
  $$-X = (\sim X) + 1 \pmod{2^n}$$
- **Strict Valid Range:**
  $$\text{Range} = \left[ -2^{n-1}, \; 2^{n-1} - 1 \right]$$
  - 8-bit: $[-128, +127]$
  - 16-bit: $[-32768, +32767]$
  - 32-bit: $[-2147483648, +2147483647]$
- **Algebraic Bit-Weight Theorem:**
  The decimal value of an $n$-bit two's complement binary string $b_{n-1} b_{n-2} \dots b_0$ is evaluated by assigning a **negative weight** to the MSB:
  $$\text{Value} = -b_{n-1} 2^{n-1} + \sum_{i=0}^{n-2} b_i 2^i$$

---

## 3. Implementation Details & Architecture

### 3.1 Modular Structure (`js/coa.js`)
The `CoaLab` component features:
- **`debounce(fn, delay)`**: 150ms debouncer prevents DOM thrashing during rapid user typing.
- **`parseInputToDecimal(str, base)`**: Uses native `BigInt` parsing to prevent precision loss on values beyond $2^{53}-1$.
- **`generateSteps(decimalBigInt, base)`**: Generates complete division step objects recording dividend, divisor, quotient, and remainder.
- **`calculateTwosComplement(num, bitWidth)`**: Enforces strict range validation:
  $$\text{if } (\text{num} < \text{minVal} \lor \text{num} > \text{maxVal}) \implies \text{REJECT}$$
  Computes positive padding, one's complement inversion, and addition of 1.
- **`renderNibbleGrid(binStr)`**: Groups binary bits into 4-bit nibbles with 8-4-2-1 positional badges and corresponding hexadecimal digit mappings.
- **`renderBitMatrix(binStr, bitWidth)`**: Renders interactive bit flip-flop cells with MSB sign indicator.
- **Clipboard Integration**: One-click copy buttons for Decimal, Binary, Hex, and Octal with animated "Copied!" feedback pills.

---

## 4. Screenshot Placeholders

```
+----------------------------------------------------------------------------------------------------+
|                                      SCREENSHOT PLACEHOLDER 1                                      |
|                                                                                                    |
|  Caption: COA Multi-Radix Simultaneous Conversion Cards with 4-Bit Nibble Grouping                 |
|  Path: screenshots/coa_multi_radix_cards.png                                                       |
|                                                                                                    |
|  [ Dec: 255 | Bin: 1111 1111 (Nibbles: F F) | Hex: 0xFF | Oct: 0o377 | Positional Powers Table ]   |
+----------------------------------------------------------------------------------------------------+
```

```
+----------------------------------------------------------------------------------------------------+
|                                      SCREENSHOT PLACEHOLDER 2                                      |
|                                                                                                    |
|  Caption: COA Dedicated Two's Complement Hardware Register Tool with Algebraic Verification        |
|  Path: screenshots/coa_twos_complement_tool.png                                                    |
|                                                                                                    |
|  [ 8-Bit Register | Input: -17 | Magnitude: 00010001 | 1's Comp: 11101110 | 2's Comp: 11101111 ]   |
|  [ Algebraic Proof: -128 + 64 + 32 + 0 + 8 + 4 + 2 + 1 = -17 ]                                     |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. Test Cases & Empirical Results

The following test suite was executed against the actual JavaScript implementation. Every conversion was verified mathematically.

| Test ID | Test Scenario | Input Value | Source Radix | Register Width | Expected Result | Actual Empirical Result | Verdict |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- | :---: |
| **COA-01** | Decimal to All | `42` | Base 10 | 8-bit | Bin: `101010`, Hex: `2A`, Oct: `52` | Exact match | **PASS** |
| **COA-02** | Hex to All | `FF` | Base 16 | 8-bit | Dec: `255`, Bin: `11111111`, Oct: `377` | Exact match | **PASS** |
| **COA-03** | Case-Insensitive Hex | `ff` | Base 16 | 8-bit | Dec: `255`, Hex: `FF` | Matches uppercase `FF` | **PASS** |
| **COA-04** | Binary to All | `110101` | Base 2 | 8-bit | Dec: `53`, Hex: `35`, Oct: `65` | Exact match | **PASS** |
| **COA-05** | Octal to All | `77` | Base 8 | 8-bit | Dec: `63`, Bin: `111111`, Hex: `3F` | Exact match | **PASS** |
| **COA-06** | Zero Normalization | `0` | Base 10 | 8-bit | All bases `0`, no `-0` anomaly | Exact match | **PASS** |
| **COA-07** | 8-Bit Min Bound | `-128` | Base 10 | 8-bit | $2's = 10000000_2$, algebraic $=-128$ | Exact match | **PASS** |
| **COA-08** | 8-Bit Max Bound | `127` | Base 10 | 8-bit | $2's = 01111111_2$, algebraic $=+127$ | Exact match | **PASS** |
| **COA-09** | 8-Bit Range Overflow | `128` | Base 10 | 8-bit | Rejected: Exceeds $[ -128 \dots 127 ]$ | Popup error displayed | **PASS** |
| **COA-10** | 8-Bit Range Underflow | `-129` | Base 10 | 8-bit | Rejected: Below $[ -128 \dots 127 ]$ | Popup error displayed | **PASS** |
| **COA-11** | Negative Two's Comp | `-17` | Base 10 | 8-bit | $2's = 11101111_2$, Sum $=-17$ | Exact match | **PASS** |
| **COA-12** | 16-Bit Min Bound | `-32768` | Base 10 | 16-bit | $2's = 1000000000000000_2$ | Exact match | **PASS** |
| **COA-13** | Beyond Safe Integer | `9007199254740992000` | Base 10 | 64-bit | Converted via `BigInt` | Exact match | **PASS** |
| **COA-14** | Malformed Binary | `102` | Base 2 | 8-bit | Rejected: Digit $2 \notin \{0, 1\}$ | Popup error displayed | **PASS** |

---

## 6. Conclusion & Pedagogical Impact

The COA Number Systems Lab transforms dry mathematical conversions into an interactive, visual hardware exploration. By combining multi-radix parallel cards, 4-bit nibble breakdowns, and a dedicated Two's Complement tool with strict range validation and algebraic bit-weight proofs, students master the essential data representations underlying modern CPU architecture.
