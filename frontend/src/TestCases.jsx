import React, { useState } from 'react';
import axios from 'axios';


function TestCases() {
  const [testResults, setTestResults] = useState([]);

  const testCases = [
    {
      description: 'Create individual rules and verify their AST representation',
      request: { rule: '((age > 30 AND department == "Sales") OR (age < 25 AND department == "Marketing")) AND (salary > 50000 OR experience > 5)' },
      endpoint: '/create_rule',
    },
    {
      description: 'Combine rules and ensure the resulting AST reflects the combined logic',
      request: { rules: [
        '((age > 30 AND department == "Sales") OR (age < 25 AND department == "Marketing")) AND (salary > 50000 OR experience > 5)',
        '((age > 30 AND department == "Marketing")) AND (salary > 20000 OR experience > 5)'
      ] },
      endpoint: '/combine_rules',
    },
    {
      description: 'Evaluate rule for different scenarios',
      request: { 
        ast: {
          type: 'operator',
          left: {
            type: 'operator',
            left: { type: 'operand', value: ['age', '>', 30] },
            right: { type: 'operand', value: ['department', '==', 'Sales'] },
            value: 'AND'
          },
          right: { type: 'operand', value: ['salary', '>', 50000] },
          value: 'AND'
        },
        data: { age: 35, department: 'Sales', salary: 60000, experience: 3 }
      },
      endpoint: '/evaluate_rule',
    },
  ];

  const runTests = async () => {
    const results = [];
    for (const testCase of testCases) {
      try {
        const response = await axios.post(`https://rule-engine-8vi2.onrender.com${testCase.endpoint}`, testCase.request);
        results.push({ description: testCase.description, result: JSON.stringify(response.data, null, 2) });
      } catch (err) {
        results.push({ description: testCase.description, result: err.response.data.error });
      }
    }
    setTestResults(results);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button onClick={runTests} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200 mb-4">Run Test Cases</button>
      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-md border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-700">{result.description}</h4>
            <pre className="bg-gray-100 p-2 mt-2 rounded text-sm text-gray-600 overflow-auto">{result.result}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestCases;