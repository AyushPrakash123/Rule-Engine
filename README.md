# Rule Engine with Abstract Syntax Tree (AST)

This project is a Rule Engine application that evaluates user-defined rules using an Abstract Syntax Tree (AST) structure. Users can define rules, combine them using logical operators (AND/OR), and evaluate them against input data. The project allows dynamic rule creation and provides a visual representation of the AST using `react-d3-tree`.

## Deployed Application

The Rule Engine application is deployed and can be accessed here: [Rule Engine - Deployed Link](https://rule-engine-opal.vercel.app)


## Features

- Create custom rules in the form of "field operator value" (e.g., `age > 25`).
- Combine multiple rules using logical operators (AND/OR).
- Evaluate combined rules against JSON data.
- Visual representation of the AST structure.
- User-friendly interface with Tailwind CSS styling.

## Technologies Used

- **Frontend:** React, Tailwind CSS, Vite, react-d3-tree
- **Backend:** Node.js, Express
- **Other Tools:** Axios for HTTP requests

## Setup Instructions

### Prerequisites

- Node.js and npm installed.
- Git installed for cloning the repository.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AyushPrakash123/rule-engine-ast.git
   cd rule-engine-ast

Install dependencies:

npm install

Start the server:
```bash
node server.js
```
Start the frontend:
```bash
npm run dev
```

Open the application in your browser at:
```bash
http://localhost:3000
```

Usage
Enter rules in the format field operator value (e.g., age > 18).
Combine rules using the "Combine Rules" button.
Provide JSON data for evaluation in the input box.
Click "Evaluate Rule" to get the result.

Example
Rule: age > 25
Combined Rule: age > 25 AND income < 50000
Data: { "age": 30, "income": 45000 }
Result: true

Design Choices
Abstract Syntax Tree (AST): Used to represent rules and logical combinations.
React with Vite: Fast development and efficient build process.
Tailwind CSS: For styling and responsive UI design.
Node.js & Express: Backend logic for evaluating rules.

Known Issues
Validation is minimal and may need enhancements for complex rules.
Further optimizations are possible for larger datasets.

License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
