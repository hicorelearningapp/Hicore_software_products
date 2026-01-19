// mockInterviewData.js
const mockInterviewData = {
  questions: [
    {
      id: 1,
      text: "How does the virtual DOM work in React?",
      answer:
        "React's virtual DOM is an in-memory representation of the real DOM. It improves performance by batching and minimizing direct DOM manipulations.",
    },
    {
      id: 2,
      text: "Explain the difference between var, let, and const.",
      answer:
        "`var` is function-scoped and can be redeclared. `let` and `const` are block-scoped. `const` cannot be reassigned.",
    },
    {
      id: 3,
      text: "How do you optimize a slow-loading web page?",
      answer:
        "Optimize assets, use lazy loading, minify CSS/JS, compress images, leverage caching, and use a CDN.",
    },
    {
      id: 4,
      text: "What is the difference between controlled and uncontrolled components in React?",
      answer:
        "Controlled components rely on React state for value, while uncontrolled components use refs and the DOM directly.",
    },
  ],
};

export default mockInterviewData;
