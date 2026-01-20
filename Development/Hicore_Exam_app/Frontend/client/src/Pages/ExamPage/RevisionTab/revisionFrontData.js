const revisionFrontData = {
  Physics: [
    {
      class: "Class 11",
      chapterName: "Units & Measurements",

      /* ---------- FLASHCARDS ---------- */
      flashcards: [
        {
          question: "What are SI units?",
          answer:
            "SI units form the standard system of measurement used in physics.",
        },
        {
          question: "What are break units?",
          answer:
            "SI units form the standard system of measurement used in physics.",
        },
      ],

      /* ---------- FORMULA SHEETS ---------- */
      formulas: [
        {
          title: "Measurement Basics",
          formulas: [
            {
              name: "Measurement Error",
              expression: "Δx = |x_measured − x_true|",
              description:
                "Error is defined as the absolute difference between measured and true value.",
              units: "Same as measured quantity",
              variables:
                "Δx = error, x_measured = measured value, x_true = true value",
            },
            {
              name: "Percentage Error",
              expression: "(Δx / x) × 100",
              description:
                "Percentage error is calculated by dividing absolute error by true value.",
              units: "%",
              variables: "Δx = absolute error, x = true value",
            },
          ],
        },
      ],

      /* ---------- DIAGRAM ---------- */
      diagram: {
        image: "/assets/Revision/units-diagram.png",
        description: "SI units, instruments, and measurement techniques",
      },
    },

    {
      class: "Class 11",
      chapterName: "Motion in a Straight Line",

      flashcards: [
        {
          question: "What is motion in a straight line?",
          answer:
            "Motion along a straight line with constant or variable velocity.",
        },
      ],

      formulas: [
        {
          title: "Kinematics",
          formulas: [
            {
              name: "First Equation of Motion",
              expression: "v = u + at",
              description: "From definition of acceleration: a = (v − u)/t",
              units: "m/s",
              variables:
                "v = final velocity, u = initial velocity, a = acceleration, t = time",
            },
            {
              name: "Second Equation of Motion",
              expression: "s = ut + ½at²",
              description: "Using average velocity multiplied by time.",
              units: "m",
              variables:
                "s = displacement, u = initial velocity, a = acceleration, t = time",
            },
          ],
        },
        {
          title: "Kinematics",
          formulas: [
            {
              name: "First Equation of Motion",
              expression: "v = u + at",
              description: "From definition of acceleration: a = (v − u)/t",
              units: "m/s",
              variables:
                "v = final velocity, u = initial velocity, a = acceleration, t = time",
            },
            {
              name: "Second Equation of Motion",
              expression: "s = ut + ½at²",
              description: "Using average velocity multiplied by time.",
              units: "m",
              variables:
                "s = displacement, u = initial velocity, a = acceleration, t = time",
            },
          ],
        },
      ],

      diagram: {
        image: "/assets/Revision/motion-straight-line.png",
        description: "Graphs of displacement, velocity, and acceleration",
      },
    },

    {
      class: "Class 12",
      chapterName: "Electrostatics",

      flashcards: [
        {
          question: "What is electrostatics?",
          answer: "Electrostatics is the study of electric charges at rest.",
        },
      ],

      formulas: [
        {
          title: "Electrostatic Laws",
          formulas: [
            {
              name: "Coulomb’s Law",
              expression: "F = k q₁q₂ / r²",
              description:
                "Force between two charges is directly proportional to product of charges and inversely proportional to square of distance.",
              units: "Newton (N)",
              variables:
                "F = force, q₁ & q₂ = charges, r = distance between charges",
            },
          ],
        },
      ],

      diagram: {
        image: "/assets/Revision/electrostatics.png",
        description: "Electric field lines and charge interaction",
      },
    },
  ],

  Chemistry: [
    {
      class: "Class 11",
      chapterName: "Atomic Structure",

      flashcards: [
        {
          question: "What is atomic structure?",
          answer:
            "Atomic structure describes the arrangement of electrons, protons, and neutrons.",
        },
      ],

      formulas: [
        {
          title: "Atomic Models",
          formulas: [
            {
              name: "Energy of Electron",
              expression: "Eₙ = −13.6 / n² eV",
              description:
                "Derived from Bohr’s atomic model for hydrogen atom.",
              units: "electron volt (eV)",
              variables: "n = principal quantum number",
            },
          ],
        },
      ],

      diagram: {
        image: "/assets/Revision/atomic-structure.png",
        description: "Bohr model of atom",
      },
    },
  ],

  Biology: [
    {
      class: "Class 11",
      chapterName: "The Living World",

      flashcards: [
        {
          question: "What defines living organisms?",
          answer:
            "Living organisms show growth, reproduction, metabolism, and response to stimuli.",
        },
      ],

      formulas: [],

      diagram: {
        image: "/assets/Revision/living-world.png",
        description: "Hierarchy of biological classification",
      },
    },
  ],
};

export default revisionFrontData;
