const quizData = {
  html: {
    Beginner: [
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Text Machine Language",
          "Hyperlink and Text Markup Language",
          "Home Tool Markup Language",
        ],
        answer: "Hyper Text Markup Language",
      },
      {
        question: "Choose the correct HTML element for the largest heading:",
        options: ["<h6>", "<h1>", "<heading>", "<head>"],
        answer: "<h1>",
      },
      {
        question: "Which HTML element is used to define a paragraph?",
        options: ["<section>", "<p>", "<para>", "<text>"],
        answer: "<p>",
      },
    ],
    Intermediate: [
      {
        question: "What is the correct HTML element for inserting a line break?",
        options: ["<break>", "<lb>", "<br>", "<line>"],
        answer: "<br>",
      },
      {
        question: "Which tag is used to define a clickable link?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        answer: "<a>",
      },
      {
        question: "Which attribute specifies an image source?",
        options: ["src", "href", "alt", "data"],
        answer: "src",
      },
    ],
    Advanced: [
      {
        question: "Which HTML5 element defines navigation links?",
        options: ["<navigate>", "<nav>", "<menu>", "<section>"],
        answer: "<nav>",
      },
      {
        question: "Which input type defines a control for selecting a number?",
        options: ["number", "num", "integer", "value"],
        answer: "number",
      },
      {
        question: "Which tag is used for embedding a video?",
        options: ["<video>", "<media>", "<movie>", "<embed>"],
        answer: "<video>",
      },
    ],
  },

  javascript: {
    Beginner: [
      {
        question: "Which keyword declares a variable in JavaScript?",
        options: ["let", "var", "const", "All of the above"],
        answer: "All of the above",
      },
      {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["//", "/*", "<!--", "#"],
        answer: "//",
      },
      {
        question: "What is the output of: typeof null?",
        options: ["null", "undefined", "object", "number"],
        answer: "object",
      },
    ],
    Intermediate: [
      {
        question: "Which method converts JSON string to object?",
        options: [
          "JSON.toObject()",
          "JSON.parse()",
          "JSON.stringify()",
          "JSON.convert()",
        ],
        answer: "JSON.parse()",
      },
      {
        question: "Which of these is a JavaScript framework?",
        options: ["React", "Django", "Laravel", "Flask"],
        answer: "React",
      },
      {
        question: "What will '2' + 2 evaluate to?",
        options: ["4", "'4'", "'22'", "error"],
        answer: "'22'",
      },
    ],
    Advanced: [
      {
        question: "Which keyword is used for asynchronous programming?",
        options: ["async", "await", "defer", "Both async and await"],
        answer: "Both async and await",
      },
      {
        question: "What does 'this' refer to in a class method?",
        options: [
          "Global object",
          "Current instance of the class",
          "Parent class",
          "Window object",
        ],
        answer: "Current instance of the class",
      },
      {
        question: "Which feature allows destructuring of objects?",
        options: ["Destructuring assignment", "Spread operator", "Cloning", "Binding"],
        answer: "Destructuring assignment",
      },
    ],
  },
};

export default quizData;
