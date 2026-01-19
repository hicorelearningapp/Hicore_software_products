const courseData = {
    "HTML": [
        {"title": "Module 1: Getting Started", "lessons": ["Introduction to HTML", "Editors & Setup", "Structure of a Web Page"]},
        {"title": "Module 2: Text & Formatting", "lessons": ["Headings", "Paragraphs", "Text Formatting Tags"]},
        {"title": "Module 3: Lists & Links", "lessons": ["Ordered & Unordered Lists", "Anchor Tags", "Navigation Links"]},
        {"title": "Module 4: Images & Multimedia", "lessons": ["Image Tags", "Audio & Video", "Embedding Content"]},
        {"title": "Module 5: Forms & Inputs", "lessons": ["Form Tags", "Input Types", "Validation"]},
        {"title": "Module 6: Semantic HTML", "lessons": ["Section, Article, Aside", "Header & Footer", "Using Semantic Tags"]},
        {"title": "Module 7: Tables", "lessons": ["Creating Tables", "Table Attributes", "Advanced Table Styling"]},
        {"title": "Module 8: Iframes & Embeds", "lessons": ["Using Iframes", "Embedding YouTube", "Google Maps Integration"]},
        {"title": "Module 9: Best Practices", "lessons": ["Accessibility", "Clean Code", "SEO Basics"]},
        {"title": "Module 10: Mini Project", "lessons": ["Building a Simple Resume Page"]}
    ],
    "CSS": [
        {"title": "Module 1: Introduction to CSS", "lessons": ["What is CSS?", "Syntax & Selectors", "Types of CSS"]},
        {"title": "Module 2: Colors & Backgrounds", "lessons": ["Color Systems", "Gradients", "Background Images"]},
        {"title": "Module 3: Text & Fonts", "lessons": ["Font Families", "Web Safe Fonts", "Google Fonts"]},
        {"title": "Module 4: Box Model", "lessons": ["Margin & Padding", "Borders", "Box Sizing"]},
        {"title": "Module 5: Flexbox", "lessons": ["Flex Container", "Flex Items", "Alignment & Justification"]},
        {"title": "Module 6: Grid", "lessons": ["Grid Container", "Grid Items", "Grid Template Areas"]},
        {"title": "Module 7: Positioning", "lessons": ["Static", "Relative", "Absolute & Fixed"]},
        {"title": "Module 8: Transitions & Animations", "lessons": ["Transition Property", "Keyframes", "Hover Effects"]}
    ],
    "JavaScript": [
        {"title": "Module 1: JavaScript Basics", "lessons": ["Variables", "Data Types", "Operators"]},
        {"title": "Module 2: Control Structures", "lessons": ["if/else", "Switch", "Loops"]},
        {"title": "Module 3: Functions", "lessons": ["Function Declaration", "Arrow Functions", "Callbacks"]},
        {"title": "Module 4: DOM Manipulation", "lessons": ["Selectors", "Events", "Element Creation"]},
        {"title": "Module 5: Arrays & Objects", "lessons": ["Array Methods", "Object Literals", "Loops in Objects"]},
        {"title": "Module 6: ES6+", "lessons": ["Let & Const", "Template Literals", "Destructuring"]},
        {"title": "Module 7: Async JavaScript", "lessons": ["Promises", "Async/Await", "Fetch API"]},
        {"title": "Module 8: Local Storage", "lessons": ["localStorage API", "Session Storage", "Storage Project"]}
    ],
    "PYTHON": [
        {"title": "Module 1: Basics of Python", "lessons": ["Python Installation", "Syntax", "Variables & Data Types"]},
        {"title": "Module 2: Control Flow", "lessons": ["if Statements", "Loops", "Comprehensions"]},
        {"title": "Module 3: Functions", "lessons": ["Defining Functions", "Arguments", "Return Values"]},
        {"title": "Module 4: Data Structures", "lessons": ["Lists", "Tuples", "Dictionaries & Sets"]},
        {"title": "Module 5: File Handling", "lessons": ["Reading & Writing Files", "With Statements"]},
        {"title": "Module 6: Object-Oriented Programming", "lessons": ["Classes", "Inheritance", "Magic Methods"]},
        {"title": "Module 7: Modules & Packages", "lessons": ["Creating Modules", "Importing", "pip"]},
        {"title": "Module 8: Exception Handling", "lessons": ["Try/Except", "Raising Errors", "Custom Exceptions"]},
        {"title": "Module 9: Final Project", "lessons": ["Basic CRUD App"]}
    ],
    "JAVA": [
        {"title": "Module 1: Introduction to Java", "lessons": ["JDK Installation", "Hello World", "Data Types"]},
        {"title": "Module 2: OOP Concepts", "lessons": ["Classes & Objects", "Inheritance", "Polymorphism"]},
        {"title": "Module 3: Control Flow", "lessons": ["If-Else", "Switch", "Loops"]},
        {"title": "Module 4: Collections", "lessons": ["ArrayList", "HashMap", "Iterators"]},
        {"title": "Module 5: Exception Handling", "lessons": ["Try/Catch", "Throw/Throws", "Custom Exceptions"]},
        {"title": "Module 6: File I/O", "lessons": ["FileReader & Writer", "BufferedReader", "Serialization"]},
        {"title": "Module 7: Multithreading", "lessons": ["Thread Class", "Runnable Interface", "Synchronization"]}
    ],
    "KOTLIN": [
        {"title": "Module 1: Getting Started", "lessons": ["Setup", "Variables", "Functions"]},
        {"title": "Module 2: Control Flow", "lessons": ["if, when", "loops"]},
        {"title": "Module 3: Null Safety", "lessons": ["Nullable types", "Safe Calls"]},
        {"title": "Module 4: Classes and Objects", "lessons": ["Constructors", "Inheritance"]},
        {"title": "Module 5: Collections", "lessons": ["List, Set, Map"]},
        {"title": "Module 6: Coroutines", "lessons": ["Basics", "Suspend", "Launch vs Async"]},
        {"title": "Module 7: Android Integration", "lessons": ["Activity", "UI with XML", "Intents"]}
    ],
    "C": [
        {"title": "Module 1: Basics", "lessons": ["Syntax", "Variables", "Data Types"]},
        {"title": "Module 2: Control Statements", "lessons": ["if-else", "switch", "loops"]},
        {"title": "Module 3: Functions", "lessons": ["Declaration", "Definition", "Recursion"]},
        {"title": "Module 4: Arrays & Strings", "lessons": ["1D, 2D Arrays", "String Functions"]},
        {"title": "Module 5: Pointers", "lessons": ["Pointer Basics", "Pointer Arithmetic", "Pointer to Functions"]},
        {"title": "Module 6: Structures & Unions", "lessons": ["Struct Definition", "Union Basics"]}
    ],
    "CPLUS": [
        {"title": "Module 1: Introduction", "lessons": ["History", "Syntax", "Hello World"]},
        {"title": "Module 2: OOP Concepts", "lessons": ["Class & Object", "Encapsulation", "Inheritance", "Polymorphism"]},
        {"title": "Module 3: Templates", "lessons": ["Function Templates", "Class Templates"]},
        {"title": "Module 4: STL", "lessons": ["Vectors", "Maps", "Algorithms"]}
    ],
    "CSHARP": [
        {"title": "Module 1: Basics", "lessons": ["Syntax", "Variables", "Data Types"]},
        {"title": "Module 2: OOP", "lessons": ["Classes", "Interfaces", "Inheritance"]},
        {"title": "Module 3: Collections", "lessons": ["List", "Dictionary"]},
        {"title": "Module 4: LINQ", "lessons": ["Query Syntax", "Method Syntax"]},
        {"title": "Module 5: Windows Forms", "lessons": ["Form Design", "Controls", "Events"]}
    ],
    "WPF": [
        {"title": "Module 1: Introduction", "lessons": ["What is WPF?", "XAML Basics"]},
        {"title": "Module 2: Layouts", "lessons": ["StackPanel", "Grid", "DockPanel"]},
        {"title": "Module 3: Controls", "lessons": ["Button", "TextBox", "ComboBox"]},
        {"title": "Module 4: Data Binding", "lessons": ["One-way, Two-way", "INotifyPropertyChanged"]},
        {"title": "Module 5: MVVM Pattern", "lessons": ["Model", "View", "ViewModel"]}
    ],
    "Cybersecurity": [
        {"title": "Module 1: Basics", "lessons": ["CIA Triad", "Common Attacks"]},
        {"title": "Module 2: Networking", "lessons": ["OSI Model", "Firewalls", "VPN"]},
        {"title": "Module 3: Cryptography", "lessons": ["Encryption Types", "RSA", "Hashing"]},
        {"title": "Module 4: Ethical Hacking", "lessons": ["Reconnaissance", "Scanning", "Exploitation"]},
        {"title": "Module 5: Cyber Laws", "lessons": ["Compliance", "Privacy Laws"]}
    ],
    "MONGODB": [
        {"title": "Module 1: Basics", "lessons": ["Installation", "Collections vs Tables"]},
        {"title": "Module 2: CRUD", "lessons": ["Create, Read", "Update, Delete"]},
        {"title": "Module 3: Indexing", "lessons": ["Single Field", "Compound Index"]},
        {"title": "Module 4: Aggregation", "lessons": ["Pipeline", "Stages"]},
        {"title": "Module 5: Mongoose (with Node.js)", "lessons": ["Schemas", "Models"]}
    ],
    "NODEJS": [
        {"title": "Module 1: Intro to Node.js", "lessons": ["What is Node?", "Setup", "REPL"]},
        {"title": "Module 2: Modules", "lessons": ["Built-in", "Custom", "npm"]},
        {"title": "Module 3: File System", "lessons": ["Read/Write", "Async/Await"]},
        {"title": "Module 4: Express.js", "lessons": ["Routing", "Middleware", "CRUD API"]},
        {"title": "Module 5: Database Integration", "lessons": ["MongoDB", "Mongoose"]}
    ],
    "ANGULAR": [
        {"title": "Module 1: Basics", "lessons": ["Angular CLI", "App Structure", "Components"]},
        {"title": "Module 2: Data Binding", "lessons": ["Interpolation", "Event Binding", "Two-way Binding"]},
        {"title": "Module 3: Services", "lessons": ["Creating Services", "Dependency Injection"]},
        {"title": "Module 4: Routing", "lessons": ["RouterModule", "Child Routes", "Guards"]},
        {"title": "Module 5: Forms", "lessons": ["Template-driven", "Reactive Forms"]}
    ],
    "MYSQL": [
        {"title": "Module 1: Introduction", "lessons": ["SQL vs NoSQL", "Installation", "Workbench"]},
        {"title": "Module 2: Basic Queries", "lessons": ["SELECT", "INSERT", "UPDATE", "DELETE"]},
        {"title": "Module 3: Joins", "lessons": ["INNER", "LEFT", "RIGHT"]},
        {"title": "Module 4: Constraints", "lessons": ["Primary Key", "Foreign Key", "Unique"]},
        {"title": "Module 5: Stored Procedures", "lessons": ["Functions", "Procedures", "Triggers"]}
    ],
    "XML": [
        {"title": "Module 1: XML Basics", "lessons": ["Syntax", "Elements", "Attributes"]},
        {"title": "Module 2: XML Schema", "lessons": ["DTD", "XSD"]},
        {"title": "Module 3: XPath & XSLT", "lessons": ["XPath Expressions", "Transformations"]}
    ]
}

export default courseData; 
