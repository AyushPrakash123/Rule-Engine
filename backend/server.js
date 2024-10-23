const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createRule, combineRules, evaluateRule } = require('./models');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/create_rule', (req, res) => {
  try {
    const ruleString = req.body.rule;
    if (typeof ruleString !== 'string') {
      throw new Error('Invalid rule format');
    }
    const ruleAst = createRule(ruleString);
    res.json({ ast: ruleAst });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/combine_rules', (req, res) => {
  try {
    const rules = req.body.rules;
    if (!Array.isArray(rules) || rules.length < 2) {
      throw new Error('At least two rules are required to combine');
    }
    const combinedAst = combineRules(rules);
    res.json({ ast: combinedAst });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/evaluate_rule', (req, res) => {
  try {
    const { ast, data } = req.body;
    console.log(ast)
    console.log(data)
    if (typeof ast !== 'object' || typeof data !== 'object') {
      throw new Error('Invalid rule or data format');
    }
    const result = evaluateRule(ast, data);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});