import assert from 'assert';
import {parseCode, Parser} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","range":[0,0],"loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}},"expr":""}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a=1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","range":[4,5],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}},"expr":"a"},"init":{"type":"Literal","value":1,"raw":"1","range":[6,7],"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":7}},"expr":"1"},"range":[4,7],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}},"expr":"a=1"}],"kind":"let","range":[0,8],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":8}},"expr":"let a=1;"}],"sourceType":"script","range":[0,8],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":8}},"expr":"let a=1;"}');
    });
});

describe('cose analayzer simple cases', () => {
    it('is analyzing a simple variable declaration with no init value', () => {
        assert.equal(JSON.stringify(Parser(parseCode('let x;'))), '[{"line":1,"type":"VariableDeclaration","name":"x","condition":"","value":""}]');
    });
    it('is analyzing a simple variable declaration with init value', () => {
        assert.equal(JSON.stringify(Parser(parseCode('let x=2;'))), '[{"line":1,"type":"VariableDeclaration","name":"x","condition":"","value":"2"}]');
    });
    it('is analyzing a simple variable declaration with init value as function name', () => {
        assert.equal(JSON.stringify(Parser(parseCode('let x=foo();'))), '[{"line":1,"type":"VariableDeclaration","name":"x","condition":"","value":"foo()"}]');
    });
    it('is analyzing a variable declaration with composed init value', () => {
        assert.equal(JSON.stringify(Parser(parseCode('let x=2+z-4*foo();'))), '[{"line":1,"type":"VariableDeclaration","name":"x","condition":"","value":"2+z-4*foo()"}]');
    });
    it('is analyzing a simple if statement composed out of expression statement', () => {
        assert.equal(JSON.stringify(Parser(parseCode('if(x>2) z=4;'))), '[{"line":1,"type":"IfStatement","name":"","condition":"x>2","value":""},{"line":1,"type":"AssignmentExpression","name":"z","condition":"","value":"4"}]');
    });
});

describe('cose analayzer composed cases', () => {
    it('is analyzing a for statement composed out of assignment statement', () => {
        assert.equal(JSON.stringify(Parser(parseCode('for(let i=0;i<7;i++){z=t;}'))), '[{"line":1,"type":"ForStatement","name":"","condition":"for(let i=0;;i<7;i++)","value":""},{"line":1,"type":"AssignmentExpression","name":"z","condition":"","value":"t"}]');
    });
    it('is analyzing a while statement composed out of assignment statement', () => {
        assert.equal(JSON.stringify(Parser(parseCode('while(true){z=t;}'))), '[{"line":1,"type":"WhileStatement","name":"","condition":"true","value":""},{"line":1,"type":"AssignmentExpression","name":"z","condition":"","value":"t"}]');
    });
    it('is analyzing a while statement composed out of assignment statement', () => {
        assert.equal(JSON.stringify(Parser(parseCode('while(true){z=t; y=x; n=10;}'))), '[{"line":1,"type":"WhileStatement","name":"","condition":"true","value":""},{"line":1,"type":"AssignmentExpression","name":"z","condition":"","value":"t"},{"line":1,"type":"AssignmentExpression","name":"y","condition":"","value":"x"},{"line":1,"type":"AssignmentExpression","name":"n","condition":"","value":"10"}]');
    });
    it('is analyzing a simple function declaration', () => {
        assert.equal(JSON.stringify(Parser(parseCode('function square(x){\n' + 'return x*x;}'))), '[{"line":1,"type":"FunctionDeclaration","name":"square","condition":"","value":""},{"line":1,"type":"Identifier","name":"x","condition":"","value":""},{"line":2,"type":"ReturnStatement","name":"","condition":"","value":"return x*x;"}]');
    });
    it('is analyzing a composed function declaration', () => {
        assert.equal(JSON.stringify(Parser(parseCode('function binarySearch(X, V, n){\n' + '    let low, high, mid;\n' + '    low = 0;\n' + '    high = n - 1;\n' + '    while (low <= high) {\n' + '        mid = (low + high)/2;\n' + '        if (X < V[mid])\n' + '            high = mid - 1;\n' + '        else if (X > V[mid])\n' + '            low = mid + 1;\n' + '        else\n' + '            return mid;\n' + '    }\n' + '    return -1;\n' + '}'))), '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"Identifier","name":"X","condition":"","value":""},{"line":1,"type":"Identifier","name":"V","condition":"","value":""},{"line":1,"type":"Identifier","name":"n","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"low","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"high","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"mid","condition":"","value":""},{"line":3,"type":"AssignmentExpression","name":"low","condition":"","value":"0"},{"line":4,"type":"AssignmentExpression","name":"high","condition":"","value":"n - 1"},{"line":5,"type":"WhileStatement","name":"","condition":"low <= high","value":""},{"line":6,"type":"AssignmentExpression","name":"mid","condition":"","value":"(low + high)/2"},{"line":7,"type":"IfStatement","name":"","condition":"X < V[mid]","value":""},{"line":8,"type":"AssignmentExpression","name":"high","condition":"","value":"mid - 1"},{"line":9,"type":"IfStatement","name":"","condition":"X > V[mid]","value":""},{"line":10,"type":"AssignmentExpression","name":"low","condition":"","value":"mid + 1"},{"line":12,"type":"ReturnStatement","name":"","condition":"","value":"return mid;"},{"line":14,"type":"ReturnStatement","name":"","condition":"","value":"return -1;"}]');
    });
});