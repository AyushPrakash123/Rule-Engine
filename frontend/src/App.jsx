import React, { useState } from 'react';
import axios from 'axios';
import Tree from 'react-d3-tree';
import './index.css';

function App() {
  const [rule, setRule] = useState('');
  const [rules, setRules] = useState([]);
  const [data, setData] = useState('{}');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [combinedAst, setCombinedAst] = useState(null);

  const createRule = async () => {
    try {
      if (rule.trim() === '') {
        throw new Error(' No rule provided');
      }
      const rulePattern = /^\s*([a-zA-Z_]\w*)\s*(>|<|=)\s*([\w\d]+)\s*$/;
      if (!rulePattern.test(rule.trim())) {
        throw new Error(' Invalid rule format. Expected format: "field operator value"');
      }

      const response = await axios.post('https://rule-engine-8vi2.onrender.com/create_rule', { rule });
      setRules([...rules, response.data.ast]);
      setError('');
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  const combineRules = async () => {
    try {
      if (rules.length < 2) {
        throw new Error(' At least two rules are required to combine');
      }
      const response = await axios.post('https://rule-engine-8vi2.onrender.com/combine_rules', { rules });
      setCombinedAst(response.data.ast);
      setError('');
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  const evaluateRule = async () => {
    try {
      if (!combinedAst || !data || typeof JSON.parse(data) !== 'object') {
        throw new Error(' Invalid rule or data');
      }
      const response = await axios.post('https://rule-engine-8vi2.onrender.com/evaluate_rule', { ast: combinedAst, data: JSON.parse(data) });
      setResult(response.data.result);
      setError('');
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  const handleRuleChange = (e) => setRule(e.target.value);
  const handleDataChange = (e) => setData(e.target.value);

  const renderTree = (ast) => {
    const transformAstToTreeData = (node) => {
      if (!node) return null;
      if (node.type === 'operand') {
        return { name: `${node.field} ${node.operator} ${node.value}` };
      }
      return {
        name: node.value,
        children: [transformAstToTreeData(node.left), transformAstToTreeData(node.right)].filter(Boolean),
      };
    };
    return transformAstToTreeData(ast);
  };

  

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-800 to-gray-900 min-h-screen flex flex-col items-center py-10 text-white">
      <header className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Rule Engine</h1>
        <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={rule}
            onChange={handleRuleChange}
            placeholder="Enter rule"
            className="flex-grow p-2 rounded bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={createRule} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Create Rule</button>
        </div>
        <div className="flex justify-center">
          <button onClick={combineRules} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">Combine Rules</button>
        </div>
        <div className="flex space-x-2">
          <textarea
            value={data}
            onChange={handleDataChange}
            placeholder="Enter JSON data"
            className="flex-grow p-2 rounded bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={evaluateRule} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Evaluate Rule</button>
        </div>
        {result !== null && (<div className="bg-orange-600 p-3 rounded text-center"><span className="font-semibold">Result: </span>{result.toString()}</div>)}
        {error && (<div className="bg-red-800 p-3 rounded text-center"><span className="font-semibold">Error:</span>{error}</div>)}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-center">Rules AST</h2>
          {rules.length > 0 && (
            <div className="w-full h-64 bg-blue-100 rounded overflow-hidden flex justify-center items-center p-4">
              <Tree data={renderTree(rules[rules.length - 1])} 
              translate={{ x: 250, y: 120 }}
              orientation="vertical"/>
            </div>
          )}
          <h2 className="text-xl font-bold mt-8 mb-4 text-center">Combined AST</h2>
          {combinedAst && (
            <div className="w-full h-64 bg-blue-100 rounded overflow-hidden flex justify-center items-center p-4">
              <Tree data={renderTree(combinedAst)} 
              translate={{ x: 250, y: 120 }} 
              orientation="horizontal" />
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
