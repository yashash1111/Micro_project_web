/**
 * ConceptLab — Computer Science Concepts Playground
 * Verified Practice Arena Question Bank (js/quiz-questions.js)
 * 
 * 42 comprehensively verified pedagogical questions:
 * - 14 DAA questions (9 MCQs + 5 Subjective)
 * - 14 COA questions (9 MCQs + 5 Subjective)
 * - 14 FLAT questions (9 MCQs + 5 Subjective)
 * 
 * Covering all 6 pedagogical stages:
 * Fundamentals -> Understanding -> Application -> Tracing -> Analysis -> Challenge
 * Across all 3 difficulty tiers: Beginner, Intermediate, Advanced.
 * 
 * Zero external dependencies. Pure Vanilla JavaScript.
 */

var QuizQuestions = (() => {
  'use strict';

  const SUBJECTS = {
    daa: {
      id: 'daa',
      name: 'Design & Analysis of Algorithms',
      shortName: 'DAA',
      title: 'Algorithms & Problem-Solving',
      description: 'Master binary search divide-and-conquer mechanics, comparison bounds, boundary conditions, and asymptotic complexity.',
      objectives: [
        'Understand monotonic order invariants and divide-and-conquer principles',
        'Calculate exact worst-case comparison counts ⌊log₂ n⌋ + 1',
        'Prevent integer overflow in midpoint pointer calculation',
        'Analyze leftmost vs standard binary search for duplicate elements',
        'Understand O(log n) time and O(1) space complexity bounds'
      ],
      accentColor: '#38bdf8'
    },
    coa: {
      id: 'coa',
      name: 'Computer Organization & Architecture',
      shortName: 'COA',
      title: 'Number Systems & Machine Representation',
      description: 'Master positional radix conversion, arbitrary-precision BigInt arithmetic, two\'s complement calculation, and hardware overflow.',
      objectives: [
        'Apply positional polynomial expansion across bases 2, 8, 10, and 16',
        'Convert decimals using the repeated division algorithm',
        'Derive signed magnitude, one\'s complement, and two\'s complement',
        'Compute negative weights using the algebraic MSB formula',
        'Detect signed hardware arithmetic overflow using carry-in/carry-out'
      ],
      accentColor: '#f59e0b'
    },
    flat: {
      id: 'flat',
      name: 'Formal Languages & Automata Theory',
      shortName: 'FLAT',
      title: 'Finite Automata & Formal Languages',
      description: 'Explore Deterministic Finite Automata (DFA), 5-tuple specifications, state transition matrices, and language acceptance invariants.',
      objectives: [
        'Understand the formal DFA 5-tuple M = (Q, Σ, δ, q0, F)',
        'Trace multi-symbol binary strings through state transitions',
        'Evaluate acceptance conditions strictly at the end of input strings',
        'Analyze state memory invariants for regular languages ending in 01',
        'Understand language limits, pumping lemma intuition, and state minimality'
      ],
      accentColor: '#ec4899'
    }
  };

  const QUESTIONS = [
    // =========================================================================
    // SUBJECT 1: DAA — ALGORITHMS AND PROBLEM-SOLVING (14 QUESTIONS)
    // =========================================================================

    // DAA 1: MCQ — Fundamentals (Beginner)
    {
      id: 'daa-q1',
      subject: 'daa',
      topic: 'Binary Search Prerequisites',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'fundamentals',
      question: 'What is the fundamental precondition that an array must satisfy before Binary Search can be correctly applied?',
      points: 5,
      hints: [
        'Think about how binary search decides whether to move left or right after checking the middle element.',
        'If elements were in random positions, could comparing against the midpoint tell you where the target is located?'
      ],
      options: [
        'All elements in the array must be distinct positive integers.',
        'The array elements must be arranged in monotonic (sorted) order.',
        'The array size must be an exact power of two (e.g. 2, 4, 8, 16, 32).',
        'The array must be dynamically allocated as a linked list structure.'
      ],
      correctIndex: 1,
      explanation: 'Binary Search fundamentally relies on the sorted (monotonic) order invariant. When the target is compared with A[mid], the sorted property guarantees that if target < A[mid], the target cannot possibly exist anywhere in the right subarray, allowing that entire half to be safely discarded.',
      optionExplanations: {
        0: 'Incorrect. Binary search fully supports duplicate values, negative integers, and zero; elements do not need to be distinct or positive.',
        2: 'Incorrect. Binary search works on arrays of any positive integer length N; power-of-two sizing is never required.',
        3: 'Incorrect. Binary search requires O(1) random-access indexing A[mid], which is efficient on contiguous arrays but O(n) on standard linked lists.'
      }
    },

    // DAA 2: MCQ — Understanding (Beginner)
    {
      id: 'daa-q2',
      subject: 'daa',
      topic: 'Divide-and-Conquer Halving',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'understanding',
      question: 'How does Binary Search achieve its logarithmic time complexity O(log n)?',
      points: 5,
      hints: [
        'Consider how much of the array remains candidate after each single comparison.',
        'Repeatedly dividing a number by 2 leads to what mathematical function?'
      ],
      options: [
        'By discarding approximately half of the remaining search interval with every single midpoint comparison.',
        'By scanning both ends of the array simultaneously toward the middle using two pointers.',
        'By creating a pre-computed hash lookup table in memory during each search iteration.',
        'By sorting the array in-place while executing the search.'
      ],
      correctIndex: 0,
      explanation: 'Binary Search uses the Divide-and-Conquer paradigm. Each comparison of the target against the midpoint element eliminates either the left half (if target > A[mid]) or the right half (if target < A[mid]). Halving the candidate size N at each step leads to a recurrence relation of T(n) = T(n/2) + O(1), which solves to O(log₂ n).',
      optionExplanations: {
        1: 'Incorrect. Scanning from both ends is a two-pointer linear scan taking O(n) time, not binary search.',
        2: 'Incorrect. Binary search does not construct hash tables; it operates directly on the sorted in-place array with O(1) extra memory.',
        3: 'Incorrect. The array is assumed to be already sorted. Re-sorting would take O(n log n) time.'
      }
    },

    // DAA 3: Subjective — Fundamentals (Beginner)
    {
      id: 'daa-q3',
      subject: 'daa',
      topic: 'Unsorted Array Failure Mechanism',
      difficulty: 'beginner',
      type: 'subjective',
      learningStage: 'fundamentals',
      question: 'Explain why applying binary search to an unsorted array (such as [14, 3, 22, 8, 5]) can fail to find a target that actually exists in the array.',
      points: 5,
      hints: [
        'Consider searching for target 5 in [14, 3, 22, 8, 5]. What is the initial midpoint?',
        'What decision does the algorithm make based on that comparison, and where does target 5 actually reside?'
      ],
      constraints: 'Explain the midpoint comparison, the order invariant, and why the algorithm can falsely report that an element is missing.',
      placeholder: 'Explain the order invariant, what happens when comparing with the midpoint in an unsorted array, and how target elements get mistakenly discarded...',
      rubric: [
        {
          id: 'daa3-r1',
          label: 'Identifies lack of monotonic sorted order',
          points: 2,
          keywords: ['sorted', 'order', 'monotonic', 'unsorted']
        },
        {
          id: 'daa3-r2',
          label: 'Explains midpoint comparison gives false directional assumption',
          points: 2,
          keywords: ['mid', 'midpoint', 'direction', 'half', 'discard', 'eliminate', 'left', 'right']
        },
        {
          id: 'daa3-r3',
          label: 'Concludes target is mistakenly pruned leading to false negative',
          points: 1,
          keywords: ['false', 'negative', 'miss', 'not found', 'fail']
        }
      ],
      modelAnswer: 'Binary search fundamentally relies on the sorted order invariant: if target < A[mid], the target is mathematically guaranteed to exist only to the left of mid. In an unsorted array like [14, 3, 22, 8, 5], comparing target 5 with midpoint A[2] = 22 indicates 5 < 22, so binary search discards the right half [8, 5]. However, the target 5 is actually located in that discarded right half! Because the elements are not ordered, the midpoint comparison provides zero directional guarantee, causing the algorithm to prune the correct subarray and incorrectly report that the element is absent.',
      explanation: 'Without monotonic ordering, the relation target < A[mid] tells you nothing about where elements smaller than A[mid] are located.',
      stepByStep: [
        'Step 1: Identify that binary search assumes monotonic order to eliminate one half of candidate elements.',
        'Step 2: Trace target 5 vs mid A[2]=22: 5 < 22 directs search leftwards, pruning [8, 5].',
        'Step 3: Recognize that the target 5 was in the pruned right half, producing a false negative.'
      ]
    },

    // DAA 4: MCQ — Application (Intermediate)
    {
      id: 'daa-q4',
      subject: 'daa',
      topic: 'Worst-Case Comparisons Calculation',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'application',
      question: 'In the worst-case scenario, what is the exact maximum number of comparisons performed by binary search on a sorted array of N = 1000 elements?',
      points: 5,
      hints: [
        'The formula for maximum comparisons in binary search is ⌊log₂ N⌋ + 1.',
        'Find the highest power of 2 that is less than or equal to 1000: 2⁹ = 512, 2¹⁰ = 1024.'
      ],
      options: [
        '9 comparisons',
        '10 comparisons',
        '11 comparisons',
        '500 comparisons'
      ],
      correctIndex: 1,
      explanation: 'The maximum comparison count in worst-case binary search is given by ⌊log₂ N⌋ + 1. For N = 1000: 2⁹ = 512 ≤ 1000 < 1024 = 2¹⁰, so log₂(1000) ≈ 9.965. ⌊9.965⌋ + 1 = 9 + 1 = 10 comparisons.',
      optionExplanations: {
        0: 'Incorrect. 9 comparisons would only be sufficient for arrays up to N = 511.',
        2: 'Incorrect. 11 comparisons is required once N reaches 1024 (2¹⁰), since ⌊log₂ 1024⌋ + 1 = 10 + 1 = 11.',
        3: 'Incorrect. 500 comparisons is the average case for linear search on 1000 elements, not binary search.'
      }
    },

    // DAA 5: Subjective — Application (Intermediate)
    {
      id: 'daa-q5',
      subject: 'daa',
      topic: 'Midpoint Arithmetic Overflow',
      difficulty: 'intermediate',
      type: 'subjective',
      learningStage: 'application',
      question: 'In programming languages with fixed-width 32-bit signed integers (e.g. C, C++, Java), why can the formula mid = (low + high) / 2 produce a bug when low and high are large, and what is the standard overflow-safe formula?',
      points: 5,
      hints: [
        'Consider an array with 1.5 billion elements where low and high are both around 1.2 billion.',
        'What is the maximum positive value a 32-bit signed integer can hold (2³¹ - 1 = 2,147,483,647)?'
      ],
      constraints: 'Explain signed integer overflow and provide the mathematically equivalent safe midpoint formula.',
      placeholder: 'Explain 32-bit signed integer overflow (low + high exceeding 2^31 - 1), how it wraps to negative, and write the safe formula...',
      rubric: [
        {
          id: 'daa5-r1',
          label: 'Explains sum low + high exceeding 32-bit signed limit (2³¹ - 1)',
          points: 2,
          keywords: ['overflow', '2^31', '2147483647', 'sum', 'limit', 'exceed']
        },
        {
          id: 'daa5-r2',
          label: 'Explains wrap-around to negative value causing out-of-bounds error',
          points: 1,
          keywords: ['negative', 'wrap', 'out of bounds', 'crash', 'index']
        },
        {
          id: 'daa5-r3',
          label: 'Provides safe formula: low + (high - low) / 2 or bit shift',
          points: 2,
          keywords: ['low + (high - low)', 'low + (high-low)', '>>> 1', 'shift']
        }
      ],
      modelAnswer: 'When low and high are large integers (for instance, each exceeding 1.1 billion), their sum (low + high) exceeds 2³¹ - 1 (2,147,483,647), which is the maximum value representable by a 32-bit signed integer. In two\'s complement arithmetic, this overflow causes the value to wrap around into a negative number. Dividing by 2 then produces a negative midpoint index, resulting in an array index out-of-bounds crash. The standard overflow-safe formula is:\n\nmid = low + (high - low) / 2\n\nAlternatively, in languages supporting unsigned shifts: mid = (low + high) >>> 1.',
      explanation: 'Subtracting low from high guarantees the intermediate difference (high - low) never exceeds the array bounds, completely eliminating overflow.',
      stepByStep: [
        'Step 1: Note that 32-bit signed integer addition overflows beyond 2,147,483,647.',
        'Step 2: Show that low + high produces a negative wrapped number, causing negative index errors.',
        'Step 3: Prove algebraically that low + (high - low) / 2 produces identical quotient while keeping all intermediates bounded.'
      ]
    },

    // DAA 6: MCQ — Tracing (Intermediate)
    {
      id: 'daa-q6',
      subject: 'daa',
      topic: 'Step-by-Step Midpoint Tracing',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'tracing',
      question: 'Consider the sorted array A = [3, 8, 12, 17, 24, 30, 45, 51, 63] with N = 9 (indices 0 to 8). When searching for target 30 using standard binary search, which sequence of indices are evaluated as midpoint?',
      points: 5,
      hints: [
        'Step 1: low = 0, high = 8. What is mid = ⌊(0 + 8)/2⌋? Compare A[mid] with 30.',
        'Step 2: If A[mid] < 30, update low = mid + 1 and compute new mid.'
      ],
      options: [
        'Indices 4, then 6, then 5',
        'Indices 4, then 7, then 5',
        'Indices 0, then 4, then 5',
        'Indices 3, then 6, then 5'
      ],
      correctIndex: 0,
      explanation: 'Tracing:\n- Step 1: low = 0, high = 8 -> mid = ⌊(0 + 8)/2⌋ = 4. A[4] = 24. Since 24 < 30, search space moves right: low = mid + 1 = 5.\n- Step 2: low = 5, high = 8 -> mid = ⌊(5 + 8)/2⌋ = 6. A[6] = 45. Since 45 > 30, search space moves left: high = mid - 1 = 5.\n- Step 3: low = 5, high = 5 -> mid = ⌊(5 + 5)/2⌋ = 5. A[5] = 30 == 30. Match found at index 5!\nThe evaluated midpoint indices are 4, 6, 5.',
      optionExplanations: {
        1: 'Incorrect. Index 7 would mean mid was calculated incorrectly from (5 + 8)/2.',
        2: 'Incorrect. Index 0 is the start pointer, not the midpoint.',
        3: 'Incorrect. Index 3 is ⌊(0+7)/2⌋, but the initial high is 8.'
      }
    },

    // DAA 7: Subjective — Tracing (Intermediate)
    {
      id: 'daa-q7',
      subject: 'daa',
      topic: 'Unsuccessful Search Tracing',
      difficulty: 'intermediate',
      type: 'subjective',
      learningStage: 'tracing',
      question: 'Trace the iterative binary search algorithm searching for target value 15 in array A = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] (N = 10, indices 0 to 9). State the low, high, mid, and A[mid] for each step, and explain why the search terminates.',
      points: 5,
      hints: [
        'Array indices are 0 to 9. Initial: low = 0, high = 9, mid = 4, A[4] = 16.',
        'Target 15 < 16, so high becomes 3. Trace until low > high.'
      ],
      constraints: 'List each step with low, high, mid, A[mid] and state the final condition where the loop terminates.',
      placeholder: 'Step 1: low=0, high=9, mid=4, A[4]=16...\nStep 2: ...\nTermination: ...',
      rubric: [
        {
          id: 'daa7-r1',
          label: 'Step 1: low=0, high=9, mid=4, A[4]=16 (15 < 16 => high=3)',
          points: 1,
          keywords: ['0', '9', '4', '16']
        },
        {
          id: 'daa7-r2',
          label: 'Step 2: low=0, high=3, mid=1, A[1]=5 (15 > 5 => low=2)',
          points: 1,
          keywords: ['3', '1', '5']
        },
        {
          id: 'daa7-r3',
          label: 'Step 3: low=2, high=3, mid=2, A[2]=8 (15 > 8 => low=3)',
          points: 1,
          keywords: ['2', '8']
        },
        {
          id: 'daa7-r4',
          label: 'Step 4: low=3, high=3, mid=3, A[3]=12 (15 > 12 => low=4)',
          points: 1,
          keywords: ['12', '4']
        },
        {
          id: 'daa7-r5',
          label: 'Termination: low = 4 > high = 3, loop halts with target absent',
          points: 1,
          keywords: ['low > high', '4 > 3', 'terminat', 'not found', 'absent']
        }
      ],
      modelAnswer: 'Complete Step Trace for target 15 in A = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]:\n\n- Step 1: low = 0, high = 9. mid = ⌊(0 + 9)/2⌋ = 4. A[4] = 16. Since target 15 < 16, update high = mid - 1 = 3.\n- Step 2: low = 0, high = 3. mid = ⌊(0 + 3)/2⌋ = 1. A[1] = 5. Since target 15 > 5, update low = mid + 1 = 2.\n- Step 3: low = 2, high = 3. mid = ⌊(2 + 3)/2⌋ = 2. A[2] = 8. Since target 15 > 8, update low = mid + 1 = 3.\n- Step 4: low = 3, high = 3. mid = ⌊(3 + 3)/2⌋ = 3. A[3] = 12. Since target 15 > 12, update low = mid + 1 = 4.\n\nTermination: Now low = 4 and high = 3. The loop continuation condition (low <= high) is false because low > high. The search interval is completely exhausted, and the algorithm halts reporting target 15 is absent in 4 comparisons.',
      explanation: 'Whenever low exceeds high, the search interval has collapsed to size 0, proving the target cannot exist in the array.',
      stepByStep: [
        'Step 1: low=0, high=9, mid=4, A[4]=16. 15 < 16 => high=3.',
        'Step 2: low=0, high=3, mid=1, A[1]=5. 15 > 5 => low=2.',
        'Step 3: low=2, high=3, mid=2, A[2]=8. 15 > 8 => low=3.',
        'Step 4: low=3, high=3, mid=3, A[3]=12. 15 > 12 => low=4.',
        'Step 5: Termination check: low (4) > high (3) halts with target absent.'
      ]
    },

    // DAA 8: MCQ — Analysis (Advanced)
    {
      id: 'daa-q8',
      subject: 'daa',
      topic: 'Space Complexity Analysis',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'analysis',
      question: 'Why does standard iterative binary search have an auxiliary space complexity of O(1), whereas standard recursive binary search requires O(log n) auxiliary space?',
      points: 5,
      hints: [
        'Think about what happens in the computer memory stack during function recursion.',
        'How many function stack activation records are open at maximum recursion depth?'
      ],
      options: [
        'Iterative search allocates dynamic heap arrays, while recursion uses fixed hardware registers.',
        'Iterative search only maintains three scalar variables (low, high, mid) in-place, whereas recursive calls allocate a new stack frame for each halving level up to depth ⌊log₂ n⌋ + 1.',
        'Recursive search creates deep copies of the subarray halves on each call level.',
        'Iterative search has O(log n) auxiliary space because of loop counter variables.'
      ],
      correctIndex: 1,
      explanation: 'Iterative binary search reuses the existing low, high, and mid scalar variables in place, requiring only O(1) auxiliary memory. In recursive binary search, each recursive call places a new activation record (stack frame) onto the call stack to remember local variables and return addresses. Since the maximum recursion depth is ⌊log₂ n⌋ + 1, the call stack consumes O(log n) auxiliary space.',
      optionExplanations: {
        0: 'Incorrect. Iterative search uses no dynamic heap allocation.',
        2: 'Incorrect. Standard recursive binary search passes the array by reference/pointer and only slices in flawed implementations.',
        3: 'Incorrect. Loop counters in iterative search are constant O(1) scalars.'
      }
    },

    // DAA 9: Subjective — Analysis (Advanced)
    {
      id: 'daa-q9',
      subject: 'daa',
      topic: 'Duplicate Elements & Left-Boundary Search',
      difficulty: 'advanced',
      type: 'subjective',
      learningStage: 'analysis',
      question: 'In a sorted array with duplicate elements such as [1, 3, 5, 5, 5, 5, 8, 10] searching for target 5, explain how standard binary search differs from left-boundary (first occurrence) binary search when A[mid] == target.',
      points: 5,
      hints: [
        'What does standard binary search do as soon as it hits a match?',
        'If you want the earliest occurrence of a duplicate, in which direction must you continue searching?'
      ],
      constraints: 'Explain the difference in termination behavior, pointer updates upon matching, and the guarantee provided by left-boundary search.',
      placeholder: 'Standard binary search terminates immediately on A[mid] == target, which can return any index...\nLeft-boundary search records the match and sets high = mid - 1...',
      rubric: [
        {
          id: 'daa9-r1',
          label: 'Explains standard search halts immediately at any duplicate index',
          points: 2,
          keywords: ['standard', 'halts', 'terminat', 'any', 'first match hit']
        },
        {
          id: 'daa9-r2',
          label: 'Explains left-boundary search records candidate and searches left (high = mid - 1)',
          points: 2,
          keywords: ['high = mid - 1', 'record', 'left', 'earlier', 'candidate']
        },
        {
          id: 'daa9-r3',
          label: 'Concludes left-boundary guarantees first occurrence index (index 2)',
          points: 1,
          keywords: ['first', 'leftmost', 'guarantee', 'index 2']
        }
      ],
      modelAnswer: 'In sorted arrays with duplicates like [1, 3, 5, 5, 5, 5, 8, 10]:\n\n1. Standard Binary Search halts immediately as soon as A[mid] == target is encountered. If mid initially lands on index 3 or 4, it immediately returns that index. Standard search provides no guarantee whether it found the first, middle, or last duplicate.\n\n2. Left-Boundary (First Occurrence) Search does not halt when A[mid] == target. Instead, it records the current mid index as the best known match so far, and deliberately updates high = mid - 1. This forces the search interval into the left half to check if earlier duplicates exist. It continues until low > high, mathematically guaranteeing that the returned index is the very first (leftmost) occurrence (index 2).',
      explanation: 'Continuing the search to the left ensures no earlier instance of the duplicate is missed.',
      stepByStep: [
        'Step 1: Contrast halting conditions: standard search halts immediately on A[mid] == target.',
        'Step 2: Contrast interval update: leftmost search stores candidate index and shifts high = mid - 1.',
        'Step 3: Conclude that leftmost search exhaustively checks earlier indices, guaranteeing the first duplicate.'
      ]
    },

    // DAA 10: MCQ — Challenge (Advanced)
    {
      id: 'daa-q10',
      subject: 'daa',
      topic: 'Binary Search on Solution Space',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'challenge',
      question: 'When using binary search to compute the integer square root ⌊√X⌋ of an integer X ≥ 0, what mathematical property enables binary search to be applied even though no physical array is stored in memory?',
      points: 5,
      hints: [
        'Think of the domain [0, X] as a virtual sequence of numbers.',
        'As m increases from 0 to X, does m² ever decrease?'
      ],
      options: [
        'The function f(m) = m² is monotonically non-decreasing for all m ≥ 0, allowing the virtual search interval [0, X] to be halved at each step.',
        'The CPU automatically caches all square root values in an internal lookup array.',
        'Binary search works on non-monotonic functions as long as they are continuous.',
        'Square roots are rational numbers for all positive integers.'
      ],
      correctIndex: 0,
      explanation: 'Binary search does not require a pre-allocated array in memory; it applies to any monotonic predicate P(m). Because f(m) = m² is strictly non-decreasing for m ≥ 0, comparing m² against X provides the exact same directional guarantee: if m² > X, then for all k ≥ m, k² > X must also hold, allowing the entire upper interval [m, X] to be discarded.',
      optionExplanations: {
        1: 'Incorrect. Hardware does not pre-populate square root arrays for arbitrary integers.',
        2: 'Incorrect. If a function is non-monotonic, halving the interval risks discarding valid solutions.',
        3: 'Incorrect. Square roots of non-perfect squares are irrational.'
      }
    },

    // DAA 11: MCQ — Fundamentals (Beginner)
    {
      id: 'daa-q11',
      subject: 'daa',
      topic: 'Best-Case Time Complexity',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'fundamentals',
      question: 'What is the best-case time complexity of binary search, and under what exact condition does it occur?',
      points: 5,
      hints: [
        'What is the very first element the algorithm inspects?',
        'What happens if that element happens to be the target?'
      ],
      options: [
        'O(log n) when the target is at index 0.',
        'O(1) when the target matches the initial midpoint A[⌊(low + high)/2⌋] on the first comparison.',
        'O(n) when the target is absent from the array.',
        'O(1) only when the array contains exactly one element.'
      ],
      correctIndex: 1,
      explanation: 'Binary search evaluates A[mid] on its very first iteration. If target == A[mid], the algorithm halts and returns immediately after 1 comparison, yielding a best-case time complexity of O(1).',
      optionExplanations: {
        0: 'Incorrect. Target at index 0 requires worst-case O(log n) steps to reach.',
        2: 'Incorrect. Target absent takes O(log n) steps, never O(n).',
        3: 'Incorrect. Best case occurs in any array size N whenever the target is at the first midpoint.'
      }
    },

    // DAA 12: MCQ — Application (Intermediate)
    {
      id: 'daa-q12',
      subject: 'daa',
      topic: 'Asymptotic Scaling Power',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'application',
      question: 'If the size of a sorted array increases from N = 1,000 to N = 1,000,000 (a 1,000-fold increase in data), approximately how many additional comparisons are required by worst-case binary search?',
      points: 5,
      hints: [
        'Calculate log₂(1000) and log₂(1,000,000).',
        'Recall that 2¹⁰ ≈ 1,000 and 2²⁰ ≈ 1,000,000.'
      ],
      options: [
        'Approximately 10 additional comparisons',
        'Approximately 100 additional comparisons',
        'Approximately 1,000 additional comparisons',
        'Approximately 500,000 additional comparisons'
      ],
      correctIndex: 0,
      explanation: 'For N = 1,000: log₂(1000) ≈ 10 comparisons. For N = 1,000,000: log₂(10⁶) = log₂(10³) + log₂(10³) ≈ 10 + 10 = 20 comparisons. Thus, multiplying the input data by 1,000 requires only 10 additional comparisons (from 10 to 20)!',
      optionExplanations: {
        1: 'Incorrect. That would imply O(√n) scaling.',
        2: 'Incorrect. Linear search would increase by 999,000 comparisons, but binary search increases logarithmically.',
        3: 'Incorrect. 500,000 is linear search average comparisons.'
      }
    },

    // DAA 13: Subjective — Challenge (Advanced)
    {
      id: 'daa-q13',
      subject: 'daa',
      topic: 'Ternary Search vs Binary Search Comparison',
      difficulty: 'advanced',
      type: 'subjective',
      learningStage: 'challenge',
      question: 'Ternary search divides the search space into 3 parts using two midpoints m1 and m2, reducing the search space to 1/3 per step. Explain mathematically why binary search is generally preferred over ternary search for searching sorted arrays.',
      points: 5,
      hints: [
        'Compare the number of comparisons made per iteration in ternary search vs binary search.',
        'Compute 2 * log₃(n) using the change of base rule: log₃(n) = log₂(n) / log₂(3).'
      ],
      constraints: 'Provide the comparison count per iteration and compare the total asymptotic operations.',
      placeholder: 'Ternary search divides into 3 parts using 2 comparisons per iteration...\nMathematically: 2 * log3(n) = 2 * (log2 n / 1.585) ≈ 1.26 * log2(n)...',
      rubric: [
        {
          id: 'daa13-r1',
          label: 'Identifies ternary search requires 2 comparisons per iteration',
          points: 2,
          keywords: ['2 comparisons', 'two comparisons', 'two midpoints', 'm1', 'm2']
        },
        {
          id: 'daa13-r2',
          label: 'Calculates 2 * log₃(n) ≈ 1.26 * log₂(n)',
          points: 2,
          keywords: ['1.26', 'log3', 'log_3', 'log2', 'base']
        },
        {
          id: 'daa13-r3',
          label: 'Concludes binary search performs ~26% fewer comparisons in worst case',
          points: 1,
          keywords: ['fewer', 'faster', 'better', 'preferred', '26%']
        }
      ],
      modelAnswer: 'Although ternary search reduces the search interval to N/3 in each iteration, it requires two comparisons per iteration (comparing target against A[m1] and then A[m2]) to determine which third contains the target. Mathematically, the worst-case comparison count for ternary search is:\n\n2 × log₃(n) = 2 × (log₂(n) / log₂(3)) ≈ 2 × (log₂(n) / 1.585) ≈ 1.262 log₂(n)\n\nIn contrast, binary search makes only 1 comparison per iteration to reduce the interval by half, taking 1.0 log₂(n) comparisons in the worst case. Therefore, ternary search actually performs approximately 26% more comparisons overall than binary search, while also having more branch mispredictions on modern CPUs.',
      explanation: 'Reducing the interval to 1/3 is not worth doubling the comparisons per loop.',
      stepByStep: [
        'Step 1: Count comparisons per step: Binary search does 1 comparison, Ternary search does 2.',
        'Step 2: Express worst-case comparisons in base 2: Ternary = 2 × log₃ n ≈ 1.26 × log₂ n.',
        'Step 3: Conclude Binary search performs ~26% fewer comparisons in the worst case.'
      ]
    },

    // DAA 14: MCQ — Analysis (Advanced)
    {
      id: 'daa-q14',
      subject: 'daa',
      topic: 'Comparison-Based Lower Bound',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'analysis',
      question: 'In the comparison-based search model, what is the theoretical information-theoretic lower bound for searching an element in a sorted array of N elements?',
      points: 5,
      hints: [
        'Consider a decision tree where each node represents a comparison A[i] ?= target.',
        'How many total possible outcomes exist (indices 0 to N-1, plus "not found")?'
      ],
      options: [
        'Ω(1)',
        'Ω(log n)',
        'Ω(n)',
        'Ω(n log n)'
      ],
      correctIndex: 1,
      explanation: 'Any comparison-based search algorithm can be modeled as a binary decision tree. For an array of size N, there are N + 1 possible outcomes (target found at index 0, 1, ..., N-1, or target not found). A binary tree with L leaves must have a minimum height of ⌈log₂ L⌉. Therefore, the minimum height is ⌈log₂(N + 1)⌉ = Ω(log n). This proves that binary search is asymptotically optimal.',
      optionExplanations: {
        0: 'Incorrect. Ω(1) is only achievable in average-case direct hashing with O(n) space, not comparison-based searching.',
        2: 'Incorrect. Ω(n) is the lower bound for unsorted arrays.',
        3: 'Incorrect. Ω(n log n) is the lower bound for comparison sorting, not searching.'
      }
    },

    // =========================================================================
    // SUBJECT 2: COA — NUMBER SYSTEMS & MACHINE REPRESENTATION (14 QUESTIONS)
    // =========================================================================

    // COA 1: MCQ — Fundamentals (Beginner)
    {
      id: 'coa-q1',
      subject: 'coa',
      topic: 'Positional Radix Place-Values',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'fundamentals',
      question: 'In a positional number system with radix (base) r, what is the exact mathematical place value (weight) of the digit at position i (where position 0 is immediately left of the radix point)?',
      points: 5,
      hints: [
        'In decimal (base 10), position 0 is 10⁰ = 1, position 1 is 10¹ = 10, position 2 is 10² = 100.',
        'How does this generalize to any radix r?'
      ],
      options: [
        'r × i',
        'rⁱ',
        'r / i',
        'iʳ'
      ],
      correctIndex: 1,
      explanation: 'In any positional number system with base r, each digit d_i contributes d_i × rⁱ to the total value. The weight at position i is rⁱ. For fractional positions to the right of the radix point, negative powers r⁻¹, r⁻², etc. are used.',
      optionExplanations: {
        0: 'Incorrect. r × i is a linear multiple, which would give weights 0, 10, 20 in decimal instead of 1, 10, 100.',
        2: 'Incorrect. Division by position does not represent positional notation.',
        3: 'Incorrect. The base is the constant base of exponentiation, not the exponent.'
      }
    },

    // COA 2: MCQ — Understanding (Beginner)
    {
      id: 'coa-q2',
      subject: 'coa',
      topic: 'Radix Alphabet Validity',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'understanding',
      question: 'Which of the following numbers contains an INVALID digit according to its specified radix (base)?',
      points: 5,
      hints: [
        'A base r number system only permits digits in the range 0 to r - 1.',
        'What digits are permitted in Octal (base 8)? What about Decimal (base 10)?'
      ],
      options: [
        '(10110)₂',
        '(752)₈',
        '(38A)₁₀',
        '(F4C)₁₆'
      ],
      correctIndex: 2,
      explanation: 'In decimal (base 10), allowable digits are strictly 0 through 9. The symbol \'A\' represents value 10 in hexadecimal and is completely invalid in base 10.',
      optionExplanations: {
        0: 'Incorrect. Binary allows digits {0, 1}; (10110)₂ is fully valid.',
        1: 'Incorrect. Octal allows digits {0, 1, 2, 3, 4, 5, 6, 7}; (752)₈ is fully valid.',
        3: 'Incorrect. Hexadecimal allows digits {0–9, A–F}; (F4C)₁₆ is fully valid.'
      }
    },

    // COA 3: Subjective — Fundamentals (Beginner)
    {
      id: 'coa-q3',
      subject: 'coa',
      topic: 'Positional Polynomial Expansion',
      difficulty: 'beginner',
      type: 'subjective',
      learningStage: 'fundamentals',
      question: 'Convert the hexadecimal number (2E)₁₆ to its decimal equivalent using positional polynomial expansion. Write down the explicit formula with weights and compute the final decimal value.',
      points: 5,
      hints: [
        'Hexadecimal is base 16. What decimal value does the letter \'E\' represent?',
        'Position 1 has weight 16¹, and position 0 has weight 16⁰.'
      ],
      constraints: 'State the numerical value of \'E\', write the polynomial formula, and compute the final sum.',
      placeholder: 'Hexadecimal base r = 16. E = 14...\nExpansion: (2 * 16^1) + (14 * 16^0) = ...',
      rubric: [
        {
          id: 'coa3-r1',
          label: 'Identifies hex digit \'E\' as decimal 14',
          points: 1,
          keywords: ['E = 14', 'e = 14', '14']
        },
        {
          id: 'coa3-r2',
          label: 'Sets up polynomial: 2 × 16¹ + 14 × 16⁰',
          points: 2,
          keywords: ['2 * 16^1', '2*16', '14 * 16^0', '14*1', '16^1', '16^0']
        },
        {
          id: 'coa3-r3',
          label: 'Calculates intermediate values: 32 + 14',
          points: 1,
          keywords: ['32', '14']
        },
        {
          id: 'coa3-r4',
          label: 'Concludes with exact decimal result 46',
          points: 1,
          keywords: ['46']
        }
      ],
      modelAnswer: 'Conversion of (2E)₁₆ to Decimal:\n\n1. Identify radix r = 16 and symbol values:\n   - Position 1: digit \'2\' = 2\n   - Position 0: digit \'E\' = 14 (since A=10, B=11, C=12, D=13, E=14)\n\n2. Set up positional polynomial expansion:\n   Value = (2 × 16¹) + (14 × 16⁰)\n\n3. Evaluate terms:\n   Value = (2 × 16) + (14 × 1) = 32 + 14 = 46₁₀.\n\nFinal Decimal Result: 46.',
      explanation: 'Each hexadecimal digit corresponds to powers of 16. Evaluating powers and adding gives the exact decimal quantity.',
      stepByStep: [
        'Step 1: Identify radix 16 and digit weights: digit 2 at position 1 (16¹), digit E at position 0 (16⁰).',
        'Step 2: Convert symbol E to its decimal value: 14.',
        'Step 3: Multiply and sum: (2 × 16) + (14 × 1) = 32 + 14 = 46.'
      ]
    },

    // COA 4: MCQ — Application (Intermediate)
    {
      id: 'coa-q4',
      subject: 'coa',
      topic: 'Repeated Division Algorithm',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'application',
      question: 'When converting decimal 45 to binary using the repeated division by 2 algorithm, what sequence of remainders is produced from first division to last division, and how is the final binary number read?',
      points: 5,
      hints: [
        '45 / 2 = 22 R 1, 22 / 2 = 11 R 0...',
        'Are remainders read from first to last (top to bottom) or last to first (bottom to top)?'
      ],
      options: [
        'Remainders: 1, 0, 1, 1, 0, 1; read from last to first as 101101₂',
        'Remainders: 0, 1, 1, 0, 1, 1; read from first to last as 011011₂',
        'Remainders: 1, 1, 1, 0, 0, 1; read from last to first as 100111₂',
        'Remainders: 1, 0, 0, 1, 1, 0; read from first to last as 100110₂'
      ],
      correctIndex: 0,
      explanation: 'Repeated division of 45 by 2:\n- 45 ÷ 2 = 22 remainder 1 (LSB)\n- 22 ÷ 2 = 11 remainder 0\n- 11 ÷ 2 = 5 remainder 1\n- 5 ÷ 2 = 2 remainder 1\n- 2 ÷ 2 = 1 remainder 0\n- 1 ÷ 2 = 0 remainder 1 (MSB)\nThe sequence of remainders generated from first to last is 1, 0, 1, 1, 0, 1. Because the first remainder generated corresponds to weight 2⁰ (LSB) and the last to the highest power (MSB), the remainders are read in reverse (last to first) as 101101₂.',
      optionExplanations: {
        1: 'Incorrect. The first division 45 ÷ 2 yields remainder 1, not 0.',
        2: 'Incorrect. 45 in binary is 32 + 8 + 4 + 1 = 101101₂, not 100111₂.',
        3: 'Incorrect. Remainders must be read in reverse (bottom-up), not top-down.'
      }
    },

    // COA 5: Subjective — Application (Intermediate)
    {
      id: 'coa-q5',
      subject: 'coa',
      topic: 'Two\'s Complement Derivation',
      difficulty: 'intermediate',
      type: 'subjective',
      learningStage: 'application',
      question: 'Calculate the 8-bit two\'s complement representation of decimal number -17. Show all three steps: 8-bit positive binary magnitude, one\'s complement (bit inversion), and addition of 1.',
      points: 5,
      hints: [
        'Step 1: Write +17 in 8-bit binary (16 + 1 = 00010001₂).',
        'Step 2: Flip every 0 to 1 and every 1 to 0 to get one\'s complement.',
        'Step 3: Add 1 to the result.'
      ],
      constraints: 'Display the full 8-bit binary string at each stage.',
      placeholder: 'Step 1: +17 in 8-bit = 00010001...\nStep 2: One\'s complement = ...\nStep 3: Add 1 = ...',
      rubric: [
        {
          id: 'coa5-r1',
          label: 'Step 1: Writes +17 in 8-bit binary: 00010001₂',
          points: 1,
          keywords: ['00010001', '16+1']
        },
        {
          id: 'coa5-r2',
          label: 'Step 2: Inverts all bits to obtain one\'s complement: 11101110₂',
          points: 2,
          keywords: ['11101110', 'invert', 'flip', 'one\'s']
        },
        {
          id: 'coa5-r3',
          label: 'Step 3: Adds 1 to obtain 11101111₂',
          points: 1,
          keywords: ['11101111', '+ 1', 'add 1']
        },
        {
          id: 'coa5-r4',
          label: 'Confirms MSB is 1 indicating negative signed value',
          points: 1,
          keywords: ['msb', 'sign', 'negative', 'bit 7']
        }
      ],
      modelAnswer: 'Derivation of -17 in 8-bit Two\'s Complement:\n\n1. Find 8-bit positive binary magnitude (+17):\n   17 = 16 + 1 = 00010001₂.\n\n2. Invert all bits (One\'s Complement):\n   ~00010001₂ = 11101110₂.\n\n3. Add 1 to the one\'s complement (Two\'s Complement):\n     11101110₂\n   + 00000001₂\n   ------------\n     11101111₂.\n\nFinal 8-bit Result: 11101111₂ (MSB is 1, indicating negative).',
      explanation: 'Two\'s complement allows negative numbers to be added with standard binary adder hardware without special sign circuitry.',
      stepByStep: [
        'Step 1: Write positive magnitude +17 in 8-bit binary: 00010001₂.',
        'Step 2: Invert all bits to form one\'s complement: 11101110₂.',
        'Step 3: Add 1 to get two\'s complement: 11101111₂.'
      ]
    },

    // COA 6: MCQ — Tracing (Intermediate)
    {
      id: 'coa-q6',
      subject: 'coa',
      topic: 'Hexadecimal to Binary Nibble Grouping',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'tracing',
      question: 'What is the binary representation of hexadecimal 0x3B9 using direct 4-bit nibble substitution?',
      points: 5,
      hints: [
        'Hexadecimal is base 16 = 2⁴, so each hex digit maps to exactly 4 binary bits.',
        'Convert 3, B (11), and 9 individually into 4-bit nibbles.'
      ],
      options: [
        '0011 1011 1001',
        '0011 1010 1001',
        '0010 1011 1001',
        '0100 1100 1001'
      ],
      correctIndex: 0,
      explanation: 'Direct 4-bit nibble mapping:\n- Digit \'3\' = 0011₂\n- Digit \'B\' (decimal 11) = 8 + 2 + 1 = 1011₂\n- Digit \'9\' = 8 + 1 = 1001₂\nCombining nibbles gives: 0011 1011 1001₂.',
      optionExplanations: {
        1: 'Incorrect. Nibble 1010₂ is \'A\' (decimal 10), not \'B\'.',
        2: 'Incorrect. Nibble 0010₂ is 2, not 3.',
        3: 'Incorrect. Nibble 0100₂ is 4, not 3.'
      }
    },

    // COA 7: Subjective — Tracing (Intermediate)
    {
      id: 'coa-q7',
      subject: 'coa',
      topic: 'Algebraic Negative Weight Verification',
      difficulty: 'intermediate',
      type: 'subjective',
      learningStage: 'tracing',
      question: 'Given the 8-bit signed two\'s complement binary byte 10000101₂, calculate its decimal value using the algebraic place-value method where the MSB (bit 7) has negative weight -2⁷ = -128 and all other bits have standard positive weights 2ⁱ.',
      points: 5,
      hints: [
        'Bit weights for 8 bits: -128, +64, +32, +16, +8, +4, +2, +1.',
        'Which bits are set to 1 in 10000101₂? (Bits 7, 2, and 0).'
      ],
      constraints: 'List the active bit weights and compute the algebraic sum.',
      placeholder: 'Weights: bit 7 = -128, bit 2 = +4, bit 0 = +1...\nSum: -128 + ... = ...',
      rubric: [
        {
          id: 'coa7-r1',
          label: 'Identifies MSB bit 7 weight as -128',
          points: 2,
          keywords: ['-128', 'bit 7']
        },
        {
          id: 'coa7-r2',
          label: 'Identifies positive bit weights: bit 2 = 4, bit 0 = 1',
          points: 1,
          keywords: ['4', '1', '2^2', '2^0']
        },
        {
          id: 'coa7-r3',
          label: 'Calculates algebraic sum: -128 + 4 + 1',
          points: 1,
          keywords: ['-128 + 4 + 1', '-128 + 5']
        },
        {
          id: 'coa7-r4',
          label: 'Concludes final decimal value is -123',
          points: 1,
          keywords: ['-123']
        }
      ],
      modelAnswer: 'In 8-bit Two\'s Complement, the bit weights are:\nBit 7: -2⁷ = -128\nBit 6: +2⁶ = +64\nBit 5: +2⁵ = +32\nBit 4: +2⁴ = +16\nBit 3: +2³ = +8\nBit 2: +2² = +4\nBit 1: +2¹ = +2\nBit 0: +2⁰ = +1\n\nFor 10000101₂:\n- Bit 7 is 1: 1 × (-128) = -128\n- Bit 2 is 1: 1 × 4 = 4\n- Bit 0 is 1: 1 × 1 = 1\n\nAlgebraic Sum:\nValue = -128 + 4 + 1 = -128 + 5 = -123₁₀.',
      explanation: 'The algebraic weight method directly evaluates two\'s complement binary without requiring double negation.',
      stepByStep: [
        'Step 1: Assign algebraic weights: MSB (bit 7) has negative weight -2⁷ = -128.',
        'Step 2: Assign positive weights to remaining bits: bit 2 has weight 4, bit 0 has weight 1.',
        'Step 3: Sum all active terms: -128 + 4 + 1 = -123₁₀.'
      ]
    },

    // COA 8: MCQ — Analysis (Advanced)
    {
      id: 'coa-q8',
      subject: 'coa',
      topic: 'Signed Range Asymmetry',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'analysis',
      question: 'In an n-bit two\'s complement system, why is the range of representable integers asymmetric: [-2ⁿ⁻¹, +2ⁿ⁻¹ - 1]?',
      points: 5,
      hints: [
        'How many total unique bit patterns exist with n bits (2ⁿ)?',
        'Which sign group (positive or negative) does zero belong to?'
      ],
      options: [
        'Because zero is represented with MSB = 0 (000...0), consuming one of the positive combinations, leaving 2ⁿ⁻¹ - 1 positive values while negative numbers have no zero counterpart.',
        'Because hardware ALU adders cannot calculate +2ⁿ⁻¹ without parity errors.',
        'Because negative numbers reserve an extra parity bit for error detection.',
        'Because the sign bit cannot be inverted during subtraction.'
      ],
      correctIndex: 0,
      explanation: 'An n-bit word provides 2ⁿ unique bit combinations. Half of these (2ⁿ⁻¹ patterns, where MSB = 0) represent non-negative numbers. Because zero (000...0) is assigned to this non-negative half, only 2ⁿ⁻¹ - 1 patterns remain for strictly positive values [1 to 2ⁿ⁻¹ - 1]. In contrast, all 2ⁿ⁻¹ patterns where MSB = 1 represent strictly negative values [-1 to -2ⁿ⁻¹], creating an asymmetric range where the negative magnitude extends 1 further than the positive maximum.',
      optionExplanations: {
        1: 'Incorrect. The ALU handles arithmetic fine; the limit is purely combinatorial bit allocation.',
        2: 'Incorrect. Two\'s complement does not add parity bits to numbers.',
        3: 'Incorrect. Subtraction inverts bits freely via one\'s complement and adder carry-in.'
      }
    },

    // COA 9: Subjective — Analysis (Advanced)
    {
      id: 'coa-q9',
      subject: 'coa',
      topic: 'Signed Arithmetic Overflow Detection',
      difficulty: 'advanced',
      type: 'subjective',
      learningStage: 'analysis',
      question: 'Explain why adding two positive 8-bit signed two\'s complement numbers +70 (01000110₂) and +65 (01000001₂) produces a negative result in standard 8-bit hardware, and state the hardware overflow condition based on carry bits.',
      points: 5,
      hints: [
        'What is 70 + 65? Does that value fit within the 8-bit signed maximum [+127]?',
        'Look at the carry into the sign bit (MSB) vs the carry out of the sign bit.'
      ],
      constraints: 'Show the binary addition, explain the sign flip, and state the XOR carry rule V = Cin ⊕ Cout.',
      placeholder: '70 + 65 = 135, which exceeds +127...\nBinary addition: 01000110 + 01000001 = 10000111 (-121)...\nCarry rule: ...',
      rubric: [
        {
          id: 'coa9-r1',
          label: 'Identifies 70 + 65 = 135 exceeds 8-bit signed limit of +127',
          points: 2,
          keywords: ['135', '127', 'exceed', 'overflow']
        },
        {
          id: 'coa9-r2',
          label: 'Shows binary addition yields 10000111₂ (MSB becomes 1, value -121)',
          points: 1,
          keywords: ['10000111', '-121']
        },
        {
          id: 'coa9-r3',
          label: 'States hardware overflow rule: carry into MSB != carry out of MSB (Cin ⊕ Cout = 1)',
          points: 2,
          keywords: ['carry in', 'carry out', 'cin', 'cout', 'xor', 'c7', 'c8']
        }
      ],
      modelAnswer: '1. Numerical Overflow:\n   The mathematical sum of +70 + 65 is +135. However, the maximum positive integer representable in 8-bit signed two\'s complement is +2⁷ - 1 = +127. Since 135 > 127, the result overflows the register capacity.\n\n2. Binary Addition:\n     01000110 (+70)\n   + 01000001 (+65)\n   ------------\n     10000111 (-121 in 8-bit two\'s complement)\n   The sum of two positive numbers (MSB = 0) resulted in a negative number (MSB = 1).\n\n3. Hardware Overflow Condition:\n   Hardware ALU detects signed overflow using the XOR of the carry into the sign bit (C_in) and the carry out of the sign bit (C_out):\n   V = C_in ⊕ C_out\n   Here, a carry is generated into bit 7 (C_in = 1), but no carry is generated out of bit 7 (C_out = 0). Thus V = 1 ⊕ 0 = 1, triggering the CPU Overflow Flag (OF = 1).',
      explanation: 'Overflow in two\'s complement occurs if and only if two numbers of like sign are added and produce a result with the opposite sign.',
      stepByStep: [
        'Step 1: Check mathematical sum: 70 + 65 = 135, exceeding 8-bit signed maximum +127.',
        'Step 2: Add binary operands: 01000110 + 01000001 = 10000111₂ (-121), showing sign flip from positive to negative.',
        'Step 3: Evaluate hardware condition: Carry-in to MSB is 1, Carry-out is 0. Since 1 ⊕ 0 = 1, overflow flag is set.'
      ]
    },

    // COA 10: MCQ — Challenge (Advanced)
    {
      id: 'coa-q10',
      subject: 'coa',
      topic: 'Two\'s Complement Minimum Negation',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'challenge',
      question: 'In an 8-bit two\'s complement system, what is the result of attempting to negate the minimum negative value -128 (10000000₂)?',
      points: 5,
      hints: [
        'Apply the two\'s complement negation algorithm: flip all bits and add 1.',
        '~10000000₂ = 01111111₂. Now add 1.'
      ],
      options: [
        '+128 (01111111₂)',
        '-128 (10000000₂) because +128 cannot be represented in 8-bit signed format (hardware overflow)',
        '0 (00000000₂)',
        '+127 with carry flag set'
      ],
      correctIndex: 1,
      explanation: 'Applying the two\'s complement algorithm to -128 (10000000₂):\n1. Invert bits: ~10000000₂ = 01111111₂ (+127)\n2. Add 1: 01111111₂ + 1 = 10000000₂\nThe result is 10000000₂, which is -128 again! Because the positive range ends at +127, +128 cannot be represented in 8-bit signed two\'s complement, causing an arithmetic overflow where negating -128 returns -128.',
      optionExplanations: {
        0: 'Incorrect. 01111111₂ is +127, not +128.',
        2: 'Incorrect. The sum 01111111 + 1 does not equal zero.',
        3: 'Incorrect. The bit sum produces 10000000₂, not 01111111₂.'
      }
    },

    // COA 11: MCQ — Fundamentals (Beginner)
    {
      id: 'coa-q11',
      subject: 'coa',
      topic: 'Octal Triad Mapping',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'fundamentals',
      question: 'Why can any octal (base 8) number be converted directly to binary by translating each octal digit into exactly 3 binary bits?',
      points: 5,
      hints: [
        'What is the relationship between the bases 2 and 8?',
        'How many distinct values can 3 bits represent?'
      ],
      options: [
        'Because 8 = 2³, so each octal digit (0–7) corresponds one-to-one with the 8 permutations of 3 binary bits (000₂ to 111₂).',
        'Because octal numbers cannot exceed 3 in value.',
        'Because 3 is the only odd prime factor of 8.',
        'Because the ASCII standard specifies 3 bits for octal characters.'
      ],
      correctIndex: 0,
      explanation: 'Because 8 is an exact power of two (8 = 2³), there is a bijection between each single octal digit (0 to 7) and a 3-bit binary triad (000₂ to 111₂). For example, (57)₈ translates directly to 101 111₂.',
      optionExplanations: {
        1: 'Incorrect. Octal digits range from 0 to 7.',
        2: 'Incorrect. 3 is not a prime factor of 8 (8 = 2³).',
        3: 'Incorrect. ASCII uses 7 or 8 bits, which is unrelated to radix conversion.'
      }
    },

    // COA 12: MCQ — Application (Intermediate)
    {
      id: 'coa-q12',
      subject: 'coa',
      topic: 'Signed Magnitude Drawbacks',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'application',
      question: 'Which major architectural drawback of Signed Magnitude representation does Two\'s Complement successfully solve?',
      points: 5,
      hints: [
        'What does Signed Magnitude do with +0 (00000000) vs -0 (10000000)?',
        'How does a CPU perform subtraction in two\'s complement?'
      ],
      options: [
        'Signed Magnitude cannot represent negative numbers at all.',
        'Signed Magnitude has dual representations for zero (+0 and -0) and requires separate, complex hardware circuitry for addition and subtraction.',
        'Signed Magnitude is limited to 4 bits maximum by physics.',
        'Signed Magnitude requires floating-point hardware.'
      ],
      correctIndex: 1,
      explanation: 'In Signed Magnitude, 00000000 represents +0 and 10000000 represents -0. This dual-zero redundancy complicates comparison logic (e.g. testing x == 0). Furthermore, adding signed magnitude numbers requires checking signs, comparing magnitudes, and routing through separate adder and subtractor circuits. Two\'s complement has a single zero representation (00000000) and allows subtraction (A - B) to use the identical addition circuit (A + ~B + 1).',
      optionExplanations: {
        0: 'Incorrect. Signed magnitude represents negative numbers using the MSB.',
        2: 'Incorrect. Signed magnitude can be used with any word width.',
        3: 'Incorrect. Signed magnitude is an integer representation.'
      }
    },

    // COA 13: Subjective — Challenge (Advanced)
    {
      id: 'coa-q13',
      subject: 'coa',
      topic: 'Arbitrary Precision BigInt vs Floating-Point',
      difficulty: 'advanced',
      type: 'subjective',
      learningStage: 'challenge',
      question: 'Explain why standard JavaScript Number produces inaccurate results when converting large integers like 2⁵³ + 1, and explain how JavaScript BigInt ensures mathematical exactness for arbitrarily large values.',
      points: 5,
      hints: [
        'JavaScript Number uses IEEE 754 double precision format.',
        'How many bits are allocated for the significand (mantissa)? What is Number.MAX_SAFE_INTEGER?'
      ],
      constraints: 'Discuss IEEE 754 64-bit float format, mantissa precision limits (53 bits), and how BigInt manages heap memory.',
      placeholder: 'JavaScript Number uses IEEE 754 64-bit float with 53-bit mantissa (MAX_SAFE_INTEGER = 2^53 - 1)...\nBeyond 2^53, adjacent integers cannot be distinguished...\nBigInt stores arbitrary digits in heap arrays...',
      rubric: [
        {
          id: 'coa13-r1',
          label: 'Identifies JavaScript Number as IEEE 754 double precision float with 53-bit mantissa',
          points: 2,
          keywords: ['ieee 754', 'floating', 'mantissa', 'significand', '53']
        },
        {
          id: 'coa13-r2',
          label: 'Identifies Number.MAX_SAFE_INTEGER (2⁵³ - 1) as threshold where precision loss occurs',
          points: 1,
          keywords: ['2^53', 'safe_integer', '9007199254740991']
        },
        {
          id: 'coa13-r3',
          label: 'Explains BigInt uses dynamic heap memory to represent unbounded integer precision',
          points: 2,
          keywords: ['bigint', 'heap', 'arbitrary', 'exact', 'unbounded', 'precision']
        }
      ],
      modelAnswer: '1. Inaccuracy in Standard Number:\n   In JavaScript, standard numbers are 64-bit IEEE 754 double-precision floating-point numbers. They allocate 1 bit for sign, 11 bits for exponent, and 53 bits (52 explicitly stored) for the significand (mantissa). Because the mantissa has only 53 bits of precision, integers can only be represented safely up to 2⁵³ - 1 (Number.MAX_SAFE_INTEGER = 9,007,199,254,740,991). Beyond 2⁵³, the step between consecutive representable numbers becomes 2 (or greater). Therefore, 2⁵³ + 1 cannot be represented and is rounded down to 2⁵³, losing precision.\n\n2. Exactness with BigInt:\n   JavaScript BigInt (e.g. 2n**53n + 1n) does not use floating-point representation. Instead, it implements arbitrary-precision arithmetic by storing digits across dynamically allocated arrays in heap memory. As numbers grow larger, BigInt automatically allocates additional heap blocks, allowing exact representation of integers with thousands of bits without rounding errors.',
      explanation: 'BigInt is essential in computer architecture tools to avoid rounding machine words larger than 53 bits.',
      stepByStep: [
        'Step 1: Explain IEEE 754 float: 53-bit mantissa bounds integer precision to Number.MAX_SAFE_INTEGER (2⁵³ - 1).',
        'Step 2: Show that 2⁵³ + 1 rounds to 2⁵³ due to insufficient mantissa bits.',
        'Step 3: Contrast with BigInt: dynamic heap allocation enables exact arbitrary-precision representations without rounding.'
      ]
    },

    // COA 14: MCQ — Analysis (Advanced)
    {
      id: 'coa-q14',
      subject: 'coa',
      topic: 'Sign Extension Invariant',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'analysis',
      question: 'To convert an 8-bit two\'s complement negative integer to a 16-bit word without altering its signed decimal value, what operation must the processor perform?',
      points: 5,
      hints: [
        'Consider -5 in 8-bit: 11111011₂. What must the upper 8 bits become in 16-bit to preserve value -5?',
        'If you padded with zeros, what would happen to the sign?'
      ],
      options: [
        'Zero extension: fill the upper 8 bit positions with zeros (00000000₂).',
        'Sign extension: replicate the sign bit (MSB) into all 8 newly added upper bit positions.',
        'One\'s complement extension: invert the existing 8 bits and append 1s.',
        'Multiply the 8-bit word by 256 using an arithmetic shift left.'
      ],
      correctIndex: 1,
      explanation: 'In two\'s complement, extending word width requires Sign Extension. The MSB (sign bit) is replicated across all newly added upper bit positions. For example, -5 in 8-bit is 11111011₂ (MSB is 1). Replicating \'1\' into the upper 8 bits yields 11111111 11111011₂, which evaluates to -32768 + 32763 = -5 in 16-bit. Padding with zeros would convert it into a large positive number (+251).',
      optionExplanations: {
        0: 'Incorrect. Zero extension is used for unsigned numbers; for negative signed numbers it destroys the value.',
        2: 'Incorrect. One\'s complement extension is not a hardware operation.',
        3: 'Incorrect. Shifting left by 8 multiplies the value by 256 rather than preserving it.'
      }
    },

    // =========================================================================
    // SUBJECT 3: FLAT — FINITE AUTOMATA & FORMAL LANGUAGES (14 QUESTIONS)
    // =========================================================================

    // FLAT 1: MCQ — Fundamentals (Beginner)
    {
      id: 'flat-q1',
      subject: 'flat',
      topic: 'Formal DFA 5-Tuple Definition',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'fundamentals',
      question: 'In formal language theory, a Deterministic Finite Automaton (DFA) is defined mathematically as a 5-tuple M = (Q, Σ, δ, q₀, F). What does the component δ represent?',
      points: 5,
      hints: [
        'Q is the set of states, Σ is the alphabet, q₀ is start state, F is accept states.',
        'What function maps a current state and input symbol to the next state?'
      ],
      options: [
        'The input alphabet of permitted symbols.',
        'The transition function δ: Q × Σ → Q mapping a state and an input symbol to a unique next state.',
        'The set of final accepting states F.',
        'The language recognized by the automaton.'
      ],
      correctIndex: 1,
      explanation: 'In the formal 5-tuple M = (Q, Σ, δ, q₀, F), δ is the transition function δ: Q × Σ → Q. It takes the current state q ∈ Q and an input symbol a ∈ Σ, and outputs a single deterministic next state q\' ∈ Q.',
      optionExplanations: {
        0: 'Incorrect. The input alphabet is represented by Σ (Sigma).',
        2: 'Incorrect. The set of accept states is represented by F.',
        3: 'Incorrect. The language recognized is denoted by L(M).'
      }
    },

    // FLAT 2: MCQ — Understanding (Beginner)
    {
      id: 'flat-q2',
      subject: 'flat',
      topic: 'Determinism Invariant',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'understanding',
      question: 'What fundamental rule distinguishes a Deterministic Finite Automaton (DFA) from a Non-Deterministic Finite Automaton (NFA)?',
      points: 5,
      hints: [
        'Think about how many choices the machine has when reading a symbol in a given state.',
        'Can a DFA transition without consuming an input symbol (ε-move)?'
      ],
      options: [
        'A DFA can recognize non-regular languages, while an NFA can only recognize regular languages.',
        'For every state q ∈ Q and every alphabet symbol a ∈ Σ, a DFA has exactly one defined transition, with zero spontaneous ε-transitions.',
        'A DFA can have an infinite number of states, whereas NFAs must be finite.',
        'A DFA processes strings in reverse order.'
      ],
      correctIndex: 1,
      explanation: 'In a DFA, the transition function δ is a deterministic total function Q × Σ → Q. For every state and symbol pair, there is exactly one next state. In an NFA, δ maps to the power set P(Q) (allowing 0, 1, or multiple next states) and may include ε-transitions (moves without consuming input). Both DFAs and NFAs recognize the exact same class of languages (regular languages).',
      optionExplanations: {
        0: 'Incorrect. Both DFAs and NFAs recognize exactly the regular languages (they are equivalent in computational power).',
        2: 'Incorrect. Both DFAs and NFAs have a finite set of states Q.',
        3: 'Incorrect. Both read strings from left to right.'
      }
    },

    // FLAT 3: Subjective — Fundamentals (Beginner)
    {
      id: 'flat-q3',
      subject: 'flat',
      topic: 'Acceptance Condition & Halting State Invariant',
      difficulty: 'beginner',
      type: 'subjective',
      learningStage: 'fundamentals',
      question: 'For a DFA recognizing the language L = {w ∈ {0, 1}* | w ends in \'01\'} with initial state q0 and accept set F = {q2}, explain the exact condition required for any input string w to be declared ACCEPTED.',
      points: 5,
      hints: [
        'Does visiting q2 midway through the string guarantee acceptance if subsequent characters are read?',
        'When is the acceptance decision evaluated?'
      ],
      constraints: 'Explain the sequential consumption of the string, the halting state, and why visiting q2 earlier does not guarantee acceptance.',
      placeholder: 'Computation begins at q0 and consumes each symbol...\nAcceptance is evaluated ONLY after the entire string is read...\nIf halting state belongs to F = {q2}...',
      rubric: [
        {
          id: 'flat3-r1',
          label: 'States computation starts at initial state q0 and consumes symbols sequentially',
          points: 1,
          keywords: ['q0', 'start', 'initial', 'sequential', 'symbol']
        },
        {
          id: 'flat3-r2',
          label: 'States the entire string must be fully consumed',
          points: 1,
          keywords: ['entire', 'whole', 'all symbols', 'consumed', 'end of string']
        },
        {
          id: 'flat3-r3',
          label: 'Explains acceptance requires halting state to belong to F = {q2}',
          points: 2,
          keywords: ['halt', 'q2', 'final', 'accept state', 'f', 'belongs to f']
        },
        {
          id: 'flat3-r4',
          label: 'Notes visiting q2 earlier does not accept if later transitions leave q2',
          points: 1,
          keywords: ['earlier', 'midway', 'leave', 'subsequent', '010']
        }
      ],
      modelAnswer: 'For a DFA to accept an input string w:\n\n1. Computation begins at initial state q₀.\n2. The input string is consumed strictly one symbol at a time from left to right, transitioning according to δ(current_state, symbol).\n3. The entire input string must be completely consumed.\n4. Once all symbols are processed, the automaton halts in a final halting state q_halt.\n5. Acceptance Rule: The string w is ACCEPTED if and only if q_halt ∈ F = {q₂}.\n\nCrucially, visiting accept state q₂ earlier during computation (for example, on prefix \'01\' in string \'010\') does NOT mean the string is accepted. If subsequent symbols transition the automaton out of q₂ (such as on the final \'0\' transitioning to q₁), the string is REJECTED because acceptance is evaluated strictly at the end of input.',
      explanation: 'A DFA has no checkpointing or rollback; acceptance depends entirely on the state occupied after reading the final symbol.',
      stepByStep: [
        'Step 1: Start at initial state q₀ and consume string w symbol by symbol according to δ.',
        'Step 2: Read until end of input is reached; identify halting state q_halt.',
        'Step 3: Evaluate accept condition: accept iff q_halt ∈ F; prior visits to F do not guarantee acceptance.'
      ]
    },

    // FLAT 4: MCQ — Application (Intermediate)
    {
      id: 'flat-q4',
      subject: 'flat',
      topic: 'Empty String Acceptance Evaluation',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'application',
      question: 'Given the DFA for binary strings ending in \'01\' with start state q₀ and accept state set F = {q₂}, is the empty string ε accepted or rejected, and why?',
      points: 5,
      hints: [
        'What transitions execute when the input string contains zero characters (length = 0)?',
        'In which state does computation halt on input ε?'
      ],
      options: [
        'Accepted, because the empty string vacuously satisfies all suffix conditions.',
        'Rejected, because zero transitions are executed and the automaton halts in initial state q₀, which is not in F = {q₂}.',
        'Accepted, because all initial states in DFAs are automatic accept states.',
        'Rejected, because DFAs are not permitted to accept the empty string by definition.'
      ],
      correctIndex: 1,
      explanation: 'On input string ε (length 0), no characters exist to be read, so zero transitions execute. The automaton halts immediately in its start state q₀. Since q₀ ∉ F = {q₂}, the empty string ε is rejected. Furthermore, the empty string has length 0 and cannot end in the 2-symbol suffix \'01\'.',
      optionExplanations: {
        0: 'Incorrect. Vacuous satisfaction does not apply; ε does not contain characters \'01\'.',
        2: 'Incorrect. Start states are only accept states if explicitly included in F.',
        3: 'Incorrect. DFAs can accept ε if q₀ ∈ F (e.g. strings containing an even number of 0s).'
      }
    },

    // FLAT 5: Subjective — Application (Intermediate)
    {
      id: 'flat-5-subj',
      subject: 'flat',
      topic: 'State Role Invariants in DFA Design',
      difficulty: 'intermediate',
      type: 'subjective',
      learningStage: 'application',
      question: 'Detail the pedagogical meaning or \'memory invariant\' of each of the three states q0, q1, q2 in the DFA designed to accept binary strings ending in \'01\'.',
      points: 5,
      hints: [
        'What suffix does state q1 remember? What about q2?',
        'If the machine is in q0, what was the most recent symbol?'
      ],
      constraints: 'Explain the specific suffix or memory represented by q0, q1, and q2.',
      placeholder: 'State q0 represents...\nState q1 represents...\nState q2 represents...',
      rubric: [
        {
          id: 'flat5-r1',
          label: 'q0 represents base state: no relevant suffix matched (last symbol was 1 or start)',
          points: 2,
          keywords: ['q0', 'base', 'start', '1', 'no suffix', 'reset']
        },
        {
          id: 'flat5-r2',
          label: 'q1 represents candidate state: most recent symbol read was \'0\'',
          points: 2,
          keywords: ['q1', '0', 'zero', 'candidate', 'first symbol', 'suffix 0']
        },
        {
          id: 'flat5-r3',
          label: 'q2 represents accept state: most recent two symbols read were \'01\'',
          points: 1,
          keywords: ['q2', '01', 'accept', 'ends in 01', 'match']
        }
      ],
      modelAnswer: 'Memory Invariants for DFA M recognizing strings ending in \'01\':\n\n- State q₀ (Base / Reset state): Represents that no useful suffix has been matched. The string is either empty, or the most recent symbol processed was \'1\' (e.g. \'...11\'). From q₀, seeing a \'1\' loops to q₀, while seeing a \'0\' advances to q₁.\n\n- State q₁ (Candidate Suffix \'0\' state): Represents that the most recent symbol processed was \'0\'. This is the necessary first character of the desired \'01\' suffix. If another \'0\' arrives, it remains in q₁ (since the most recent symbol is still \'0\'); if a \'1\' arrives, it advances to accept state q₂.\n\n- State q₂ (Accept Suffix \'01\' state): Represents that the string currently terminates in the required suffix \'01\'. If another \'0\' arrives, it transitions to q₁ (the new suffix is \'0\'); if \'1\' arrives, it resets to q₀ (the new suffix is \'11\', losing the \'01\' match).',
      explanation: 'Finite automata simulate memory by partitioning the set of all prefixes into equivalence states.',
      stepByStep: [
        'Step 1: Define q₀ invariant: reset state where last symbol was 1 or string is empty.',
        'Step 2: Define q₁ invariant: candidate state remembering last symbol was 0.',
        'Step 3: Define q₂ invariant: accept state remembering last two symbols were 01.'
      ]
    },

    // FLAT 6: MCQ — Tracing (Intermediate)
    {
      id: 'flat-q6',
      subject: 'flat',
      topic: 'Step-by-Step State Sequence Tracing',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'tracing',
      question: 'Given the DFA transition rules:\nδ(q₀, 0) = q₁,  δ(q₀, 1) = q₀\nδ(q₁, 0) = q₁,  δ(q₁, 1) = q₂\nδ(q₂, 0) = q₁,  δ(q₂, 1) = q₀\nWhat is the exact sequence of states visited when processing string \'1001\' starting from q₀?',
      points: 5,
      hints: [
        'Start at q₀. Trace each character \'1\', then \'0\', then \'0\', then \'1\'.',
        'Count the number of transitions: an input of length 4 visits 5 states total.'
      ],
      options: [
        'q₀ → q₀ → q₁ → q₁ → q₂',
        'q₀ → q₁ → q₁ → q₂ → q₂',
        'q₀ → q₀ → q₁ → q₂ → q₀',
        'q₀ → q₁ → q₀ → q₁ → q₂'
      ],
      correctIndex: 0,
      explanation: 'Step-by-step trace for string \'1001\':\n1. Initial state: q₀\n2. Read \'1\': δ(q₀, 1) = q₀\n3. Read \'0\': δ(q₀, 0) = q₁\n4. Read \'0\': δ(q₁, 0) = q₁\n5. Read \'1\': δ(q₁, 1) = q₂\n\nThe sequence of states visited is: q₀ → q₀ → q₁ → q₁ → q₂. Because q₂ ∈ F, \'1001\' is accepted.',
      optionExplanations: {
        1: 'Incorrect. The first symbol is \'1\', which keeps the automaton in q₀, not q₁.',
        2: 'Incorrect. The third transition reads \'0\' from q₁, which loops to q₁, not q₂.',
        3: 'Incorrect. The second symbol is \'0\', which leads to q₁, not q₁ followed by q₀.'
      }
    },

    // FLAT 7: Subjective — Tracing (Intermediate)
    {
      id: 'flat-q7',
      subject: 'flat',
      topic: 'Unaccepted String Tracing',
      difficulty: 'intermediate',
      type: 'subjective',
      learningStage: 'tracing',
      question: 'Provide a complete mathematical trace for the string \'1010\' through the DFA for strings ending in \'01\'. List each transition δ(current_state, symbol) = next_state, state the halting state, and give the final acceptance verdict.',
      points: 5,
      hints: [
        'Trace characters \'1\', \'0\', \'1\', \'0\' starting from q₀.',
        'What state does the final \'0\' transition to from q₂?'
      ],
      constraints: 'List all 4 transitions with state names, identify the halting state, and state ACCEPTED or REJECTED.',
      placeholder: 'Start: q0\nStep 1: δ(q0, 1) = q0...\nStep 2: ...\nHalting state: ...\nVerdict: ...',
      rubric: [
        {
          id: 'flat7-r1',
          label: 'Step 1: δ(q0, 1) = q0',
          points: 1,
          keywords: ['δ(q0, 1) = q0', 'q0, 1', 'q0 -> q0']
        },
        {
          id: 'flat7-r2',
          label: 'Step 2: δ(q0, 0) = q1',
          points: 1,
          keywords: ['δ(q0, 0) = q1', 'q0, 0', 'q0 -> q1']
        },
        {
          id: 'flat7-r3',
          label: 'Step 3: δ(q1, 1) = q2',
          points: 1,
          keywords: ['δ(q1, 1) = q2', 'q1, 1', 'q1 -> q2']
        },
        {
          id: 'flat7-r4',
          label: 'Step 4: δ(q2, 0) = q1',
          points: 1,
          keywords: ['δ(q2, 0) = q1', 'q2, 0', 'q2 -> q1']
        },
        {
          id: 'flat7-r5',
          label: 'Identifies halting state q1 ∉ F and concludes REJECTED',
          points: 1,
          keywords: ['q1', 'rejected', 'not accepted', '∉ f']
        }
      ],
      modelAnswer: 'Mathematical Trace for string \'1010\':\n\n- Start State: q₀\n- Step 1: Read \'1\' -> δ(q₀, 1) = q₀\n- Step 2: Read \'0\' -> δ(q₀, 0) = q₁\n- Step 3: Read \'1\' -> δ(q₁, 1) = q₂\n- Step 4: Read \'0\' -> δ(q₂, 0) = q₁\n\nHalting Evaluation:\nThe entire string has been consumed and the automaton halts in state q₁. Since q₁ ∉ F = {q₂}, the string \'1010\' is REJECTED (it ends in \'10\', not \'01\').',
      explanation: 'Even though the automaton entered accept state q₂ at step 3, reading the final \'0\' moved it to q₁, correctly rejecting the string.',
      stepByStep: [
        'Step 1: Start at q₀. On symbol 1: δ(q₀, 1) = q₀.',
        'Step 2: On symbol 0: δ(q₀, 0) = q₁.',
        'Step 3: On symbol 1: δ(q₁, 1) = q₂ (accept state entered).',
        'Step 4: On symbol 0: δ(q₂, 0) = q₁ (leaves accept state).',
        'Step 5: Input exhausted; halts in q₁ ∉ F, resulting in string REJECTION.'
      ]
    },

    // FLAT 8: MCQ — Analysis (Advanced)
    {
      id: 'flat-q8',
      subject: 'flat',
      topic: 'Acceptance Invariant After Intermediate Match',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'analysis',
      question: 'When processing input string \'010\', the automaton enters accept state q₂ after reading \'01\', but reading the final \'0\' transitions to q₁. Why is \'010\' rejected?',
      points: 5,
      hints: [
        'Does a DFA "remember" that it once was in an accept state earlier?',
        'Does the language require strings CONTAINING 01 or ENDING IN 01?'
      ],
      options: [
        'Because the automaton halts with an error upon reading \'0\' in state q₂.',
        'Because DFA acceptance is evaluated strictly on the halting state occupied after the entire string is consumed; halting in q₁ ∉ F causes rejection.',
        'Because all strings of odd length are automatically rejected by regular grammars.',
        'Because state q₂ is an absorbing trap state.'
      ],
      correctIndex: 1,
      explanation: 'A DFA does not have historical memory of past states. The formal acceptance criteria is w ∈ L(M) ⟺ δ*(q₀, w) ∈ F. After processing all symbols of \'010\', the extended transition function yields δ*(q₀, \'010\') = q₁. Because q₁ is not an element of F = {q₂}, the string is rejected.',
      optionExplanations: {
        0: 'Incorrect. δ(q₂, 0) = q₁ is a valid, well-defined transition in the DFA.',
        2: 'Incorrect. Regular languages have no restriction regarding odd string lengths; \'101\' is odd length and accepted.',
        3: 'Incorrect. If q₂ were an absorbing trap state, \'010\' would have been accepted.'
      }
    },

    // FLAT 9: Subjective — Analysis (Advanced)
    {
      id: 'flat-q9',
      subject: 'flat',
      topic: 'Finite Memory Limits & Pumping Lemma',
      difficulty: 'advanced',
      type: 'subjective',
      learningStage: 'analysis',
      question: 'Explain why a DFA can easily recognize the language L = {w | w ends in 01}, but cannot recognize the language Leq = {0ⁿ 1ⁿ | n ≥ 0}.',
      points: 5,
      hints: [
        'How many states does our DFA for \'01\' need? Is the required memory bounded or unbounded?',
        'What would a machine need to count in order to verify that the number of 0s equals the number of 1s in 0ⁿ 1ⁿ?'
      ],
      constraints: 'Contrast the bounded sliding window memory of DFAs with the unbounded counting requirement of 0ⁿ 1ⁿ (Pigeonhole Principle / Pumping Lemma).',
      placeholder: 'A DFA has a strictly finite set of states (bounded memory)...\nFor strings ending in 01, it only needs to remember the last 2 symbols...\nFor 0^n 1^n, n can be arbitrarily large, requiring unbounded counting...',
      rubric: [
        {
          id: 'flat9-r1',
          label: 'Explains DFA has strictly finite number of states k (bounded memory)',
          points: 2,
          keywords: ['finite', 'memory', 'states', 'bounded', 'k states']
        },
        {
          id: 'flat9-r2',
          label: 'Explains \'ends in 01\' requires remembering only last 2 symbols (finite window)',
          points: 1,
          keywords: ['window', 'last 2', 'suffix', 'sliding', '2 symbols']
        },
        {
          id: 'flat9-r3',
          label: 'Explains 0ⁿ 1ⁿ requires unbounded counting exceeding finite state capacity (Pigeonhole Principle / Pumping Lemma)',
          points: 2,
          keywords: ['count', 'unbounded', 'pigeonhole', 'pumping lemma', 'arbitrary n']
        }
      ],
      modelAnswer: '1. Why L = {w | w ends in 01} is Regular:\n   To verify that a string ends in \'01\', an automaton only needs to remember a finite sliding window of the most recent 2 symbols. This requires only 3 states (q₀, q₁, q₂) to represent the current suffix status. Because the memory requirement is strictly bounded and constant, a DFA easily recognizes it.\n\n2. Why Leq = {0ⁿ 1ⁿ | n ≥ 0} is Non-Regular:\n   A DFA has a fixed, finite number of states |Q| = k. In Leq, the number of leading zeros n can be arbitrarily large. To ensure the subsequent number of ones matches n exactly, the machine must count and store n. By the Pigeonhole Principle, on any input string 0ᵏ where k > |Q|, the DFA must enter the same state twice, creating a loop. By the Pumping Lemma, this loop can be pumped, causing the automaton to incorrectly accept strings like 0ⁿ⁺ᵖ 1ⁿ where 0s and 1s are unequal. Because a finite state machine lacks unbounded stack or memory, it cannot recognize 0ⁿ 1ⁿ.',
      explanation: 'DFAs cannot count arbitrarily high because they have no external stack or tape.',
      stepByStep: [
        'Step 1: Contrast memory models: DFAs have fixed, finite state capacity |Q| = k.',
        'Step 2: Show suffix matching only requires remembering the latest 2 symbols (sliding window).',
        'Step 3: Apply Pigeonhole Principle / Pumping Lemma to 0ⁿ 1ⁿ: unbounded counting exceeds finite state memory, proving non-regularity.'
      ]
    },

    // FLAT 10: MCQ — Challenge (Advanced)
    {
      id: 'flat-q10',
      subject: 'flat',
      topic: 'State Minimality (Myhill-Nerode)',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'challenge',
      question: 'Can any valid DFA recognizing the language L = {w ∈ {0, 1}* | w ends in 01} be constructed with fewer than 3 states?',
      points: 5,
      hints: [
        'Consider the Myhill-Nerode Theorem regarding distinguishable string prefixes.',
        'Can the prefixes ε, \'0\', and \'01\' share the same state without causing errors?'
      ],
      options: [
        'Yes, an NFA converted to DFA always uses 2 states.',
        'No, because the string prefixes ε, \'0\', and \'01\' are pairwise distinguishable under the Myhill-Nerode relation, proving that 3 states is minimal.',
        'Yes, by combining the start state q₀ and accept state q₂ into a single state.',
        'Yes, if the alphabet is binary, Shannon\'s theorem bounds states to 2.'
      ],
      correctIndex: 1,
      explanation: 'Under the Myhill-Nerode theorem, two strings x and y are distinguishable with respect to language L if there exists a distinguishing suffix z such that xz ∈ L and yz ∉ L (or vice versa).\n- ε and \'0\' are distinguished by z = \'1\': ε1 = \'1\' ∉ L, but 01 = \'01\' ∈ L.\n- \'0\' and \'01\' are distinguished by z = \'1\': 01 = \'01\' ∈ L, but 011 = \'011\' ∉ L.\n- ε and \'01\' are distinguished by z = ε: ε ∉ L, but 01 ∈ L.\nBecause these 3 prefixes are pairwise distinguishable, every DFA recognizing L must have at least 3 distinct states. Therefore, the 3-state DFA is mathematically minimal.',
      optionExplanations: {
        0: 'Incorrect. NFA subset construction can expand states up to 2^k, not reduce below minimal DFA bounds.',
        2: 'Incorrect. If q₀ and q₂ were merged, the empty string ε would be accepted.',
        3: 'Incorrect. Shannon\'s theorem applies to channel coding, not state minimality.'
      }
    },

    // FLAT 11: MCQ — Fundamentals (Beginner)
    {
      id: 'flat-q11',
      subject: 'flat',
      topic: 'Complement Language Construction',
      difficulty: 'beginner',
      type: 'mcq',
      learningStage: 'fundamentals',
      question: 'Given a DFA M = (Q, Σ, δ, q₀, F) recognizing language L, what simple modification to M produces a DFA that recognizes the complement language L\' = Σ* \\ L?',
      points: 5,
      hints: [
        'In a DFA, every input string halts in exactly one state.',
        'How do you invert the decision for every state?'
      ],
      options: [
        'Reverse the direction of all transition arrows in δ.',
        'Invert the set of accept states: replace F with Q \\ F (non-accept states become accept states, and accept states become non-accept).',
        'Add ε-transitions between all states.',
        'Replace the start state q₀ with the accept state.'
      ],
      correctIndex: 1,
      explanation: 'Because a DFA is deterministic and its transition function δ is total (every string follows a unique path that halts in exactly one state q), any string that halted in an accept state (q ∈ F) should now be rejected, and any string that halted in a non-accept state (q ∉ F) should now be accepted. Thus, swapping F with Q \\ F creates the exact complement automaton M\'.',
      optionExplanations: {
        0: 'Incorrect. Reversing transitions produces an NFA that recognizes the reversed language Lᴿ.',
        2: 'Incorrect. Adding ε-moves violates determinism.',
        3: 'Incorrect. Changing start states produces an entirely different, arbitrary language.'
      }
    },

    // FLAT 12: MCQ — Application (Intermediate)
    {
      id: 'flat-q12',
      subject: 'flat',
      topic: 'Transition Matrix Completeness',
      difficulty: 'intermediate',
      type: 'mcq',
      learningStage: 'application',
      question: 'In a DFA with an alphabet of Σ = {0, 1} and a state set of 4 states, how many total transition entries must be defined in its transition table?',
      points: 5,
      hints: [
        'In a DFA, δ is a total function Q × Σ → Q.',
        'Multiply the number of states |Q| by the alphabet size |Σ|.'
      ],
      options: [
        '4 entries',
        '8 entries',
        '16 entries',
        '2 entries'
      ],
      correctIndex: 1,
      explanation: 'In a DFA, the transition function δ must be defined for every state q ∈ Q on every alphabet symbol a ∈ Σ. Therefore, the transition matrix has exactly |Q| × |Σ| = 4 × 2 = 8 entries. If any entry were missing, the automaton would be incomplete and non-deterministic on that symbol.',
      optionExplanations: {
        0: 'Incorrect. 4 entries would mean only 1 symbol per state is defined.',
        2: "Incorrect. 16 is |Q|², which is for state-pair matrices, not transition tables.",
        3: 'Incorrect. 2 is only the alphabet size.'
      }
    },

    // FLAT 13: Subjective — Challenge (Advanced)
    {
      id: 'flat-q13',
      subject: 'flat',
      topic: 'Substring vs Suffix Trap State Comparison',
      difficulty: 'advanced',
      type: 'subjective',
      learningStage: 'challenge',
      question: 'Compare a DFA designed for strings containing the substring \'01\' anywhere with our DFA for strings ending in \'01\'. Explain how the outgoing transitions from accept state q2 must differ between the two machines.',
      points: 5,
      hints: [
        'In a "contains substring" DFA, once \'01\' has been encountered, can any future symbol invalidate acceptance?',
        'In an "ending in" DFA, can reading another symbol after \'01\' invalidate acceptance?'
      ],
      constraints: 'Explain the difference between self-loops (trap accept states) and suffix resetting transitions.',
      placeholder: 'For strings CONTAINING 01: once q2 is reached, the condition is met permanently, so q2 has self-loops...\nFor strings ENDING IN 01: acceptance can be lost if a new symbol arrives...',
      rubric: [
        {
          id: 'flat13-r1',
          label: 'Explains for \'containing 01\', q2 has self-loops δ(q2, 0) = q2 and δ(q2, 1) = q2 (trap/absorbing accept state)',
          points: 2,
          keywords: ['containing', 'self loop', 'loop', 'q2', 'trap', 'absorb']
        },
        {
          id: 'flat13-r2',
          label: 'Explains for \'ending in 01\', transitions from q2 must leave to track updated suffix: δ(q2, 0)=q1, δ(q2, 1)=q0',
          points: 2,
          keywords: ['ending in', 'leave', 'reset', 'q1', 'q0', 'suffix']
        },
        {
          id: 'flat13-r3',
          label: 'Contrasts permanent acceptance (monotonic) vs transient acceptance',
          points: 1,
          keywords: ['permanent', 'transient', 'lost', 'future']
        }
      ],
      modelAnswer: 'The key architectural difference lies in whether the accept state q₂ is an absorbing (trap) state or a transient state:\n\n1. Strings Containing \'01\':\n   Once the substring \'01\' has appeared anywhere in the input, the acceptance requirement is permanently satisfied. No future symbols can ever invalidate this fact. Therefore, accept state q₂ is an absorbing (trap) accept state with self-loops on all symbols: δ(q₂, 0) = q₂ and δ(q₂, 1) = q₂.\n\n2. Strings Ending in \'01\':\n   The acceptance condition is transient because it depends strictly on the most recent two characters. Reading an additional symbol can invalidate the suffix: if \'0\' arrives after \'01\', the new suffix is \'0\', requiring transition to q₁ (δ(q₂, 0) = q₁); if \'1\' arrives, the new suffix is \'11\', requiring a full reset to q₀ (δ(q₂, 1) = q₀).',
      explanation: 'Substrings create trap accept states; suffixes require continuous tracking transitions.',
      stepByStep: [
        'Step 1: Explain "Contains 01": condition is permanently satisfied, so accept state q₂ has absorbing self-loops on all symbols.',
        'Step 2: Explain "Ending in 01": condition is transient and depends strictly on the final two symbols.',
        'Step 3: Contrast outgoing transitions: in "ending in", reading 0 transitions to q₁ and reading 1 resets to q₀.'
      ]
    },

    // FLAT 14: MCQ — Analysis (Advanced)
    {
      id: 'flat-q14',
      subject: 'flat',
      topic: 'Regular Language Closure Properties',
      difficulty: 'advanced',
      type: 'mcq',
      learningStage: 'analysis',
      question: 'Regular languages recognized by Deterministic Finite Automata are mathematically proven to be closed under which of the following sets of operations?',
      points: 5,
      hints: [
        'Think about Boolean operations (AND, OR, NOT) and string concatenation / Kleene star.',
        'Can you build cross-product DFAs for union and intersection?'
      ],
      options: [
        'Union, Intersection, Complement, Concatenation, and Kleene Star (*).',
        'Union and Intersection only, but not Complement.',
        'Concatenation only, but not Union or Intersection.',
        'Regular languages are not closed under any algebraic operations.'
      ],
      correctIndex: 0,
      explanation: 'Regular languages form a Boolean algebra and are closed under all major formal operations:\n1. Complement: swapping accept and non-accept states.\n2. Union and Intersection: product automaton construction M₁ × M₂.\n3. Concatenation and Kleene Star: standard Thompson / subset NFA-to-DFA conversions.\nTherefore, regular languages are closed under Union, Intersection, Complement, Concatenation, and Kleene Star (*).',
      optionExplanations: {
        1: 'Incorrect. Regular languages are closed under complement by inverting accept states.',
        2: 'Incorrect. Product automata easily prove closure under union and intersection.',
        3: 'Incorrect. Regular languages have the strongest closure properties of all language families in the Chomsky hierarchy.'
      }
    }
  ];

  // Helper Functions

  function getAllQuestions() {
    return QUESTIONS;
  }

  function getSubjects() {
    return Object.values(SUBJECTS);
  }

  function getSubject(id) {
    return SUBJECTS[id] || null;
  }

  function getQuestionsBySubject(subjectId) {
    if (!subjectId || subjectId === 'all') return QUESTIONS;
    return QUESTIONS.filter(q => q.subject === subjectId);
  }

  function filterQuestions(subjectId, difficulty, format) {
    let pool = QUESTIONS;

    if (subjectId && subjectId !== 'all') {
      pool = pool.filter(q => q.subject === subjectId);
    }

    if (difficulty && difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    if (format === 'mcq') {
      pool = pool.filter(q => q.type === 'mcq');
    } else if (format === 'subjective') {
      pool = pool.filter(q => q.type === 'subjective');
    }

    return pool;
  }

  /**
   * Deterministic session builder adhering to Section 3:
   * 1. Fundamentals -> 2. Understanding -> 3. Application -> 4. Tracing -> 5. Analysis -> 6. Challenge
   * For Mixed: Q1(MCQ Fund), Q2(MCQ Under), Q3(Subj Fund/Under), Q4(MCQ App), Q5(Subj App),
   *            Q6(MCQ Trace), Q7(Subj Trace), Q8(MCQ Ana), Q9(Subj Ana), Q10(Challenge)
   */
  function buildSessionQuestions(subjectId, difficulty = 'all', format = 'mixed', count = 10) {
    // 1. Get filtered candidate pool
    const subjectPool = getQuestionsBySubject(subjectId);

    // If difficulty is specified, try to filter, but if too few, fall back gracefully
    let eligiblePool = subjectPool;
    if (difficulty && difficulty !== 'all') {
      const diffFiltered = subjectPool.filter(q => q.difficulty === difficulty);
      if (diffFiltered.length >= 4) {
        eligiblePool = diffFiltered;
      }
    }

    const selected = [];
    const usedIds = new Set();

    function pickNext(typeFilter, stageFilter) {
      // Find matching question
      const match = eligiblePool.find(q => {
        if (usedIds.has(q.id)) return false;
        if (typeFilter && q.type !== typeFilter) return false;
        if (stageFilter) {
          if (Array.isArray(stageFilter)) {
            if (!stageFilter.includes(q.learningStage)) return false;
          } else if (q.learningStage !== stageFilter) {
            return false;
          }
        }
        return true;
      });

      if (match) {
        usedIds.add(match.id);
        selected.push(match);
        return true;
      }

      // Fallback 1: match type only in stage order
      const fallbackType = eligiblePool.find(q => {
        if (usedIds.has(q.id)) return false;
        if (typeFilter && q.type !== typeFilter) return false;
        return true;
      });

      if (fallbackType) {
        usedIds.add(fallbackType.id);
        selected.push(fallbackType);
        return true;
      }

      // Fallback 2: any unused in eligible pool
      const anyUnused = eligiblePool.find(q => !usedIds.has(q.id));
      if (anyUnused) {
        usedIds.add(anyUnused.id);
        selected.push(anyUnused);
        return true;
      }

      return false;
    }

    if (format === 'mixed') {
      // Exact deterministic Mixed sequence from Section 3
      pickNext('mcq', 'fundamentals'); // Q1
      pickNext('mcq', 'understanding'); // Q2
      pickNext('subjective', ['fundamentals', 'understanding']); // Q3
      pickNext('mcq', 'application'); // Q4
      pickNext('subjective', 'application'); // Q5
      pickNext('mcq', 'tracing'); // Q6
      pickNext('subjective', 'tracing'); // Q7
      pickNext('mcq', 'analysis'); // Q8
      pickNext('subjective', 'analysis'); // Q9
      pickNext(null, 'challenge'); // Q10

      // If count > 10, fill in remaining
      while (selected.length < count && usedIds.size < eligiblePool.length) {
        pickNext(null, null);
      }
    } else if (format === 'mcq') {
      const mcqs = eligiblePool.filter(q => q.type === 'mcq');
      const stages = ['fundamentals', 'understanding', 'application', 'tracing', 'analysis', 'challenge'];
      stages.forEach(st => {
        mcqs.filter(q => q.learningStage === st).forEach(q => {
          if (selected.length < count && !usedIds.has(q.id)) {
            usedIds.add(q.id);
            selected.push(q);
          }
        });
      });
      // Fill remaining
      mcqs.forEach(q => {
        if (selected.length < count && !usedIds.has(q.id)) {
          usedIds.add(q.id);
          selected.push(q);
        }
      });
    } else if (format === 'subjective') {
      const subjs = eligiblePool.filter(q => q.type === 'subjective');
      const stages = ['fundamentals', 'understanding', 'application', 'tracing', 'analysis', 'challenge'];
      stages.forEach(st => {
        subjs.filter(q => q.learningStage === st).forEach(q => {
          if (selected.length < count && !usedIds.has(q.id)) {
            usedIds.add(q.id);
            selected.push(q);
          }
        });
      });
      // Fill remaining
      subjs.forEach(q => {
        if (selected.length < count && !usedIds.has(q.id)) {
          usedIds.add(q.id);
          selected.push(q);
        }
      });
    }

    return selected;
  }

  /**
   * Transparent, honest subjective evaluation against configured rubric
   */
  function evaluateSubjectiveAnswer(question, userText) {
    if (!question || question.type !== 'subjective' || !Array.isArray(question.rubric)) {
      return {
        score: 0,
        maxScore: question ? (question.points || 5) : 5,
        percentage: 0,
        criteriaResults: [],
        passedCount: 0,
        totalCriteria: 0
      };
    }

    const text = (userText || '').toLowerCase();
    const criteriaResults = [];
    let earnedPoints = 0;
    let maxPoints = 0;
    let passedCount = 0;

    question.rubric.forEach(crit => {
      maxPoints += crit.points;

      // Deterministic check based on keywords and patterns
      let passed = false;
      if (Array.isArray(crit.keywords) && crit.keywords.length > 0) {
        // At least one keyword group matched
        passed = crit.keywords.some(kw => {
          const cleanKw = kw.toLowerCase();
          return text.includes(cleanKw);
        });
      } else if (typeof crit.check === 'function') {
        passed = crit.check(text);
      }

      if (passed) {
        earnedPoints += crit.points;
        passedCount++;
      }

      criteriaResults.push({
        id: crit.id,
        label: crit.label,
        points: passed ? crit.points : 0,
        maxPoints: crit.points,
        passed
      });
    });

    // Ensure score does not exceed question points
    const questionMax = question.points || maxPoints;
    const finalScore = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * questionMax) : 0;
    const percentage = questionMax > 0 ? Math.round((finalScore / questionMax) * 100) : 0;

    return {
      score: finalScore,
      maxScore: questionMax,
      percentage,
      criteriaResults,
      passedCount,
      totalCriteria: question.rubric.length
    };
  }

  const api = {
    getAllQuestions,
    getSubjects,
    getSubject,
    getQuestionsBySubject,
    filterQuestions,
    buildSessionQuestions,
    evaluateSubjectiveAnswer
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  return api;
})();
