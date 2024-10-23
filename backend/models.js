function createRule(ruleString) {

    const operators = ['AND', 'OR'];
    const regex = /(\w+)\s*(>|<|=)\s*([\w'"]+)|(\bAND\b|\bOR\b)/gi;
    const stack = [];
    const output = [];
  
    let match;
    while ((match = regex.exec(ruleString)) !== null) {
      if (match[4]) {
        while (stack.length && (stack[stack.length - 1] === 'AND' || match[4] === 'OR')) {
          output.push(stack.pop());
        }
        stack.push(match[4]);
      } else {
        output.push({ type: 'operand', field: match[1], operator: match[2], value: match[3].replace(/['"]/g, '') });
      }
    }
  
    while (stack.length) {
      output.push(stack.pop());
    }
  
    return buildAst(output);
  }
  
  function buildAst(output) {
    const stack = [];
    output.forEach(token => {
      if (token.type === 'operand') {
        stack.push(token);
      } else {
        const right = stack.pop();
        const left = stack.pop();
        stack.push({ type: 'operator', operator: token, left, right });
      }
    });
    return stack[0];
  }
  
  function combineRules(rules) {
    return rules.reduce((combined, rule) => ({
      type: 'operator',
      operator: 'AND',
      left: combined,
      right: rule
    }));
  }
  function evaluateRule(ast, data) {
    console.log('Evaluating AST:', JSON.stringify(ast, null, 2));
    console.log('Data:', data);
  
    if (ast.type === 'operand') {
      const { field, operator, value } = ast;
      const fieldValue = data[field];
  
      console.log(`Evaluating: ${fieldValue} ${operator} ${value}`);
  
      switch (operator) {
        case '>':
          return Number(fieldValue) > Number(value);
        case '<':
          return Number(fieldValue) < Number(value);
        case '=':
          return fieldValue == value; 
        default:
          throw new Error('Invalid operator');
      }
    } else if (ast.type === 'operator') {
      const { operator, left, right } = ast;
  
      console.log(`Operator: ${operator}`);
      console.log('Left:', JSON.stringify(left, null, 2));
      console.log('Right:', JSON.stringify(right, null, 2));
  
      if (operator === 'AND') {
        return evaluateRule(left, data) && evaluateRule(right, data);
      } else if (operator === 'OR') {
        return evaluateRule(left, data) || evaluateRule(right, data);
      } else {
        throw new Error('Invalid operator');
      }
    } else {
      throw new Error('Unknown node type');
    }
  }
  
  
  
  module.exports = { createRule, combineRules, evaluateRule };