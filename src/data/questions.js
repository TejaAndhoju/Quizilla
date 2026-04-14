export const questions = [
  // DSA
  {
    id: 'q1',
    category: 'DSA',
    difficulty: 'easy',
    text: 'What is the time complexity of searching for an element in a balanced Binary Search Tree?',
    codeSnippet: null,
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctIndex: 2
  },
  {
    id: 'q2',
    category: 'DSA',
    difficulty: 'medium',
    text: 'Which data structure is typically used to implement Breadth-First Search (BFS)?',
    codeSnippet: null,
    options: ['Stack', 'Queue', 'Priority Queue', 'Tree'],
    correctIndex: 1
  },
  {
    id: 'q3',
    category: 'DSA',
    difficulty: 'hard',
    text: 'In a hash table using open addressing with linear probing, clustering can be a problem. Which of these reduces clustering?',
    codeSnippet: null,
    options: ['Double hashing', 'Larger element sizes', 'Using a smaller array', 'Sequential hashing'],
    correctIndex: 0
  },
  
  // React
  {
    id: 'q4',
    category: 'React',
    difficulty: 'easy',
    text: 'Which hook should you use to execute side effects in a functional component?',
    codeSnippet: null,
    options: ['useState', 'useEffect', 'useSideEffect', 'useMemo'],
    correctIndex: 1
  },
  {
    id: 'q5',
    category: 'React',
    difficulty: 'medium',
    text: 'What is the output of the following React snippet if state `count` is initially 0?',
    codeSnippet: `setCount(count + 1);
setCount(count + 1);
console.log(count);`,
    options: ['0', '1', '2', 'Undefined'],
    correctIndex: 0 // count is logged synchronously before re-render
  },
  
  // JavaScript
  {
    id: 'q6',
    category: 'JavaScript',
    difficulty: 'medium',
    text: 'What will the following code output?',
    codeSnippet: `console.log(typeof null);`,
    options: ['null', 'undefined', 'object', 'number'],
    correctIndex: 2
  },
  {
    id: 'q7',
    category: 'JavaScript',
    difficulty: 'hard',
    text: 'What is the result of `[] + []` in JavaScript?',
    codeSnippet: null,
    options: ['[]', '"" (empty string)', '0', 'NaN'],
    correctIndex: 1
  },
  
  // Python
  {
    id: 'q8',
    category: 'Python',
    difficulty: 'easy',
    text: 'Which collection is ordered, changeable, and allows duplicate members in Python?',
    codeSnippet: null,
    options: ['List', 'Tuple', 'Set', 'Dictionary'],
    correctIndex: 0
  },
  {
    id: 'q9',
    category: 'Python',
    difficulty: 'medium',
    text: 'What is the output of the following code?',
    codeSnippet: `x = [1, 2, 3]
y = x
y[0] = 4
print(x[0])`,
    options: ['1', '2', '3', '4'],
    correctIndex: 3
  },

  // C++
  {
    id: 'q10',
    category: 'C++',
    difficulty: 'medium',
    text: 'What will happen if we try to compile the following code?',
    codeSnippet: `int a = 10;
int &b = a;
int c = 20;
&b = c;`,
    options: [
      'Compiles successfully, b now refers to c',
      'Compiler error: cannot reassign reference',
      'Runtime error',
      'b becomes 20, but still refers to a'
    ],
    correctIndex: 1
  }
];

export const categories = ['DSA', 'React', 'JavaScript', 'Python', 'C++'];
