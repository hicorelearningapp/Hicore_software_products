export const lessonData = {
  week1: {
    numberSeries: {
      title: 'Number Series',
      heading: 'Master the Pattern: Number Series',
      lesson: [
        {
          heading: 'Introduction to Number Series',
          subheadings: [
            {
              subheading: 'What is a Number Series?',
              content: [
                {
                  type: 'paragraph',
                  text: 'A Number Series is a sequence of numbers that follows a specific logical pattern or rule.',
                },
                {
                  type: 'list',
                  items: [
                    'Identify the rule that governs the progression',
                    'Predict the next number, find a missing number, or detect an incorrect number',
                  ],
                },
                { type: 'heading', level: 4, text: 'Example:' },
                {
                  type: 'paragraph',
                  text: 'Question\n2, 4, 6, 8, ?',
                },
                {
                  type: 'ans',
                  heading: 'Pattern:',
                  content: 'Add 2 → Answer: 10',
                },
                { type: 'heading', level: 4, text: 'Step-by-Step Analysis' },
                {
                  type: 'list',
                  items: [
                    'Observe the Series: 2, 4, 6, 8, ?',
                    'Look at the Difference Between Numbers:\n 4 − 2 = 2\n 6 − 4 = 2\n 8 − 6 = 2',
                    'Pattern Detected:\n • The same number (+2) is being added each time\n • This is an Arithmetic Progression',
                    'Apply the Pattern:\n 8 + 2 = 10',
                  ],
                },
                {
                  type: 'tiprow',
                  quickTip: [
                    'Always check for simple addition or subtraction first when solving number series.',
                    'If no constant difference is found, try multiplication, squares, cubes, or alternating patterns.',
                  ],
                  didYouKnow: [
                    'Number series is one of the most common topics in competitive exams.',
                    'Spotting the pattern early can save you valuable time during timed tests.',
                  ],
                },
              ],
              quiz: {
                heading: 'Quiz: Introduction to Number Series',
                description: 'A quick quiz to check your understanding.',
                questions: [
                  {
                    id: 1,
                    question: 'What is the next number in the series: 3, 5, 7, 9, ?',
                    options: ['10', '11', '12', '13'],
                    correctAnswer: '11',
                    explanation: 'The pattern is adding 2 to the previous number.',
                  },
                ],
              },
              timedTest: {
                heading: 'Timed Test: Introduction to Number Series',
                description: 'Test your speed.',
                durationMinutes: 1,
                questions: [
                  {
                    id: 1,
                    question: 'What is the next number in the series: 3, 5, 7, 9, ?',
                    options: ['10', '11', '12', '13'],
                    answer: '11',
                  },
                ],
              },
            },
            {
              subheading: 'Types of Patterns in Competitive Exams',
              content: [
                {
                  type: 'table',
                  headers: ['Pattern Type', 'Example', 'Rule'],
                  rows: [
                    ['Arithmetic', '3, 6, 9, 12, ?', '+3'],
                    ['Geometric', '2, 4, 8, 16, ?', '×2'],
                    ['Squares', '1, 4, 9, 16, ?', 'n² pattern'],
                    ['Cubes', '1, 8, 27, 64, ?', 'n³ pattern'],
                    ['Alternating', '2, 4, 3, 6, 4, ?', '+2, −1 repeating'],
                    ['Fibonacci', '0, 1, 1, 2, 3, 5, ?', 'Sum of previous two numbers'],
                    ['Difference Series', '5, 8, 13, 20, ?', '+3, +5, +7 → Increasing difference'],
                    ['Wrong Term', '3, 6, 12, 24, 50', 'Identify the one that breaks the rule'],
                    ['Missing Term', '2, ?, 6, 8', 'Fill the blank by spotting the logic'],
                  ],
                },
                {
                  type: 'tiprow',
                  quickTip: [
                    'If the difference between terms is constant, it’s an arithmetic series.',
                    'These are the easiest number series types to solve in exams!',
                  ],
                  didYouKnow: [
                    'Number series questions are among the highest scoring problems if you identify the pattern quickly.',
                  ],
                },
              ],
              quiz: {
                heading: 'Quiz: Types of Patterns',
                description: 'Identify the pattern type from the examples.',
                questions: [
                  {
                    id: 2,
                    question: 'What type of series is 1, 4, 9, 16, ?',
                    options: ['Arithmetic', 'Geometric', 'Squares', 'Cubes'],
                    correctAnswer: 'Squares',
                    explanation: 'The series consists of the squares of consecutive natural numbers (1², 2², 3², 4²).',
                  },
                ],
              },
              timedTest: {
                heading: 'Timed Test: Types of Patterns',
                description: 'Test your ability to classify patterns quickly.',
                durationMinutes: 1,
                questions: [
                  {
                    id: 2,
                    question: 'What type of series is 1, 4, 9, 16, ?',
                    options: ['Arithmetic', 'Geometric', 'Squares', 'Cubes'],
                    answer: 'Squares',
                  },
                ],
              },
            },
          ],
        },
        {
          heading: 'Arithmetic Series',
          subheadings: [
            {
              subheading: 'Constant addition/subtraction',
              content: [
                {
                  type: 'paragraph',
                  text: 'An arithmetic series is a sequence where the difference between consecutive terms is constant. This constant value is called the common difference (d).',
                },
                { type: 'heading', level: 4, text: 'Example:' },
                { type: 'list', items: ['Series: 5, 9, 13, 17, ?'] },
                {
                  type: 'paragraph',
                  text: 'The common difference is 9 - 5 = 4. To find the next term, we add 4 to the last term: 17 + 4 = 21.',
                },
                {
                  type: 'tiprow',
                  quickTip: ['Arithmetic series are the simplest type of number series.', 'Check differences first when solving.'],
                  didYouKnow: ['Arithmetic progressions are widely used in aptitude exams and real-world problems like installment payments.'],
                },
              ],
              quiz: {
                heading: 'Quiz: Arithmetic Series',
                description: 'Test your knowledge of arithmetic series.',
                questions: [
                  {
                    id: 3,
                    question: 'Identify the missing number: 5, 10, ?, 20, 25',
                    options: ['12', '18', '15', '16'],
                    correctAnswer: '15',
                    explanation: 'This is an arithmetic series with a common difference of 5.',
                  }
                ],
              },
              timedTest: {
                heading: 'Timed Test: Arithmetic Series',
                description: 'Test your speed on arithmetic series.',
                durationMinutes: 2,
                questions: [
                  {
                    id: 3,
                    question: 'Identify the missing number: 5, 10, ?, 20, 25',
                    options: ['12', '18', '15', '16'],
                    answer: '15',
                  }
                ],
              },
            },
            {
              subheading: 'Linear progression',
              content: [
                {
                  type: 'paragraph',
                  text: 'Because the series increases or decreases by a constant amount, it exhibits linear growth. If you were to plot the terms, they would form a straight line.',
                },
                {
                  type: 'tiprow',
                  quickTip: ['Visualizing arithmetic series on a graph helps spot the straight-line growth.', 'Use common difference to extend the series quickly.'],
                  didYouKnow: ['Linear growth is the foundation of simple interest problems in banking exams.'],
                },
              ],
              quiz: {
                heading: 'Quiz: Linear Progression',
                description: 'A quiz on the linear nature of arithmetic series.',
                questions: [
                  {
                    id: 4,
                    question: 'The graph of an arithmetic series forms a:',
                    options: ['Straight line', 'Parabola', 'Hyperbola', 'Circle'],
                    correctAnswer: 'Straight line',
                    explanation: 'The constant addition or subtraction of the common difference results in a straight line when plotted on a graph.',
                  },
                ],
              },
              timedTest: {
                heading: 'Timed Test: Linear Progression',
                description: 'Test your understanding of linear progression.',
                durationMinutes: 1,
                questions: [
                  {
                    id: 4,
                    question: 'The graph of an arithmetic series forms a:',
                    options: ['Straight line', 'Parabola', 'Hyperbola', 'Circle'],
                    answer: 'Straight line',
                  },
                ],
              },
            },
          ],
        },
        {
          heading: 'Geometric Series',
          subheadings: [
            {
              subheading: 'Constant multiplication/division',
              content: [
                {
                  type: 'paragraph',
                  text: 'A geometric series is a sequence where each term is obtained by multiplying or dividing the previous term by a fixed number called the common ratio (r).',
                },
                {
                  type: 'tiprow',
                  quickTip: ['Look for multiplication or division if differences are not constant.', 'Ratios are key for spotting geometric progressions.'],
                  didYouKnow: ['Geometric progressions are used in compound interest, population growth, and doubling problems.'],
                },
              ],
              quiz: {
                heading: 'Quiz: Geometric Series',
                description: 'Test your knowledge of geometric series.',
                questions: [
                  {
                    id: 5,
                    question: 'Find the next number: 2, 6, 18, 54, ?',
                    options: ['108', '162', '216', '154'],
                    correctAnswer: '162',
                    explanation: 'The common ratio is 3. 54 * 3 = 162.',
                  },
                ],
              },
              timedTest: {
                heading: 'Timed Test: Geometric Series',
                description: 'Test your speed on geometric series.',
                durationMinutes: 2,
                questions: [
                  {
                    id: 5,
                    question: 'Find the next number: 2, 6, 18, 54, ?',
                    options: ['108', '162', '216', '154'],
                    answer: '162',
                  },
                ],
              },
            },
            {
              subheading: 'Exponential growth patterns',
              content: [
                {
                  type: 'paragraph',
                  text: 'Geometric series often model exponential growth where values increase rapidly over time.',
                },
                {
                  type: 'tiprow',
                  quickTip: ['If numbers are growing very fast, check for powers like squares, cubes, or exponents.', 'Divide consecutive terms to check ratio.'],
                  didYouKnow: ['Exponential growth patterns are applied in finance, computing, and biology (e.g., bacteria growth).'],
                },
              ],
              quiz: {
                heading: 'Quiz: Exponential Growth',
                description: 'A quiz on the exponential nature of geometric series.',
                questions: [
                  {
                    id: 6,
                    question: 'What is the common ratio in the series: 3, 9, 27, 81, ?',
                    options: ['2', '3', '6', '9'],
                    correctAnswer: '3',
                    explanation: 'Each term is 3 times the previous one.',
                  },
                ],
              },
              timedTest: {
                heading: 'Timed Test: Exponential Growth',
                description: 'Test your understanding of exponential patterns.',
                durationMinutes: 1,
                questions: [
                  {
                    id: 6,
                    question: 'What is the common ratio in the series: 3, 9, 27, 81, ?',
                    options: ['2', '3', '6', '9'],
                    answer: '3',
                  },
                ],
              },
            },
          ],
        },
        {
          heading: 'Square & Cube Series',
          subheadings: [
            {
              subheading: 'Perfect squares and cubes',
              content: [
                {
                  type: 'paragraph',
                  text: 'Some series are based on perfect squares (1, 4, 9, 16, …) or perfect cubes (1, 8, 27, 64, …).',
                },
                {
                  type: 'tiprow',
                  quickTip: ['Check whether numbers are squares or cubes of natural numbers.', 'These often appear in exams as missing term questions.'],
                  didYouKnow: ['Recognizing square and cube patterns quickly saves time in competitive tests.'],
                },
              ],
              quiz: {
                heading: 'Quiz: Squares and Cubes',
                description: 'Test your knowledge of square and cube series.',
                questions: [
                  {
                    id: 7,
                    question: 'What is the next number in the series: 1, 8, 27, 64, ?',
                    options: ['81', '100', '125', '144'],
                    correctAnswer: '125',
                    explanation: 'This is a cube series (1³, 2³, 3³, 4³, 5³).',
                  },
                ],
              },
              timedTest: {
                heading: 'Timed Test: Squares and Cubes',
                description: 'Test your speed on square and cube series.',
                durationMinutes: 2,
                questions: [
                  {
                    id: 7,
                    question: 'What is the next number in the series: 1, 8, 27, 64, ?',
                    options: ['81', '100', '125', '144'],
                    answer: '125',
                  },
                ],
              },
            },
            {
              subheading: 'Differences of squares/cubes',
              content: [
                {
                  type: 'paragraph',
                  text: 'In some cases, the series may use differences of consecutive squares (e.g., 1, 3, 5, 7, …) or cubes.',
                },
                {
                  type: 'tiprow',
                  quickTip: ['When numbers grow oddly, check for differences of squares or cubes.', 'Subtract consecutive terms to see the pattern.'],
                  didYouKnow: ['Difference of squares often forms the basis of trick questions in reasoning exams.'],
                },
              ],
              quiz: {
                heading: 'Quiz: Differences of Powers',
                description: 'A quiz on series with differences of powers.',
                questions: [
                  {
                    id: 8,
                    question: 'What is the next number in the series: 10, 14, 23, 39, ?',
                    options: ['60', '64', '68', '72'],
                    correctAnswer: '64',
                    explanation: 'The differences are squares: 4, 9, 16. The next difference is 25. 39 + 25 = 64.',
                  },
                ],
              },
              timedTest: {
                heading: 'Timed Test: Differences of Powers',
                description: 'Test your ability to solve complex difference series.',
                durationMinutes: 2,
                questions: [
                  {
                    id: 8,
                    question: 'What is the next number in the series: 10, 14, 23, 39, ?',
                    options: ['60', '64', '68', '72'],
                    answer: '64',
                  },
                ],
              },
            },
          ],
        },
      ],
      quiz: {
        heading: 'Number Series Final Quiz',
        description: 'A comprehensive quiz covering all topics in Number Series.',
        questions: [
          {
            id: 9,
            question: 'Find the next number: 1, 1, 2, 3, 5, 8, ?',
            options: ['11', '12', '13', '14'],
            correctAnswer: '13',
            explanation: 'This is the Fibonacci series, where each number is the sum of the two preceding ones.',
          },
          {
            id: 10,
            question: 'Identify the wrong term: 4, 9, 16, 25, 30, 36',
            options: ['9', '25', '30', '36'],
            correctAnswer: '30',
            explanation: 'The series consists of squares of natural numbers (2², 3², 4², 5², 6²). 30 is not a perfect square.',
          },
        ],
      },
      timedTest: {
        heading: 'Number Series Final Timed Test',
        description: 'A comprehensive timed test covering all topics in Number Series.',
        durationMinutes: 5,
        questions: [
          {
            id: 9,
            question: 'Find the next number: 1, 1, 2, 3, 5, 8, ?',
            options: ['11', '12', '13', '14'],
            answer: '13',
          },
          {
            id: 10,
            question: 'Identify the wrong term: 4, 9, 16, 25, 30, 36',
            options: ['9', '25', '30', '36'],
            answer: '30',
          },
        ],
      },
    },
  },
};