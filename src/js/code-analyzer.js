import * as esprima from 'esprima';
export {parseCode,Parser};

let elements = [];

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true,range:true},function(node){node['expr']= codeToParse.substring(node.range[0],node.range[1]);});
};

/*------------------------------------------------------------------------------- Function Declaration ---------------------------------------------------------------------------------------------------------------------------------------------------*/

const parseFunction = (functionToParse) => {
    elements.push({line:functionToParse.loc.start.line,type:functionToParse.type,name:functionToParse.id.expr,condition:'',value:''});
    for(let p=0 ; p<functionToParse.params.length ; p++)
        elements.push({line:functionToParse.params[p].loc.start.line,type:functionToParse.params[p].type,name:functionToParse.params[p].expr,condition:'',value:''});
    Parse[functionToParse.body.type](functionToParse.body);
};

/*------------------------------------------------------------------------------- Variable Declaration ---------------------------------------------------------------------------------------------------------------------------------------------------*/
const parseVariable = (variableToParse) => {
    for(let dec=0 ; dec<(variableToParse.declarations).length ; dec++){
        if(((variableToParse.declarations)[dec]).init==null)
            elements.push({line:((variableToParse.declarations)[dec]).id.loc.start.line, type:variableToParse.type,name:((variableToParse.declarations)[dec]).id.name, condition:'',value:''});
        else elements.push({line:((variableToParse.declarations)[dec]).id.loc.start.line, type:variableToParse.type,name:((variableToParse.declarations)[dec]).id.name, condition:'',value:((variableToParse.declarations)[dec]).init.expr});
    }
};

/*------------------------------------------------------------------------------- Expression Statement ---------------------------------------------------------------------------------------------------------------------------------------------------*/
const parseExpression = (expressionToParse) => {
    //elements.push({line:expressionToParse.loc.start.line,type:expressionToParse.type,name:'',condition:'',value:''});
    Parse[expressionToParse.expression.type](expressionToParse.expression);
};
/*------------------------------------------------------------------------------- Assignment Statement ---------------------------------------------------------------------------------------------------------------------------------------------------*/

const parseAssignment = (assignmentToParse) => {
    elements.push({line:assignmentToParse.loc.start.line,type:assignmentToParse.type,name:assignmentToParse.left.expr,condition:'',value:assignmentToParse.right.expr});
};
/*------------------------------------------------------------------------------- If Statement -----------------------------------------------------------------------------------------------------------------------------------------------------------*/
const parseIf = (ifToParse) => {
    elements.push({line:ifToParse.test.loc.start.line,type:ifToParse.type,name:'',condition:ifToParse.test.expr,value:''});
    Parse[ifToParse.consequent.type](ifToParse.consequent);
    if (ifToParse.alternate!=null)
        Parse[ifToParse.alternate.type](ifToParse.alternate);
};
/*------------------------------------------------------------------------------- Block Statement ---------------------------------------------------------------------------------------------------------------------------------------------------*/
const parseBlock = (blockToParse)=>{
    //elements.push({line:blockToParse.loc.start.line,type:blockToParse.type,name:'',condition:'',value:''});
    for(let exp=0 ; exp<(blockToParse.body).length ; exp++)
        Parse[blockToParse.body[exp].type](blockToParse.body[exp]);
};
/*------------------------------------------------------------------------------- While Statement --------------------------------------------------------------------------------------------------------------------------------------------------------*/
const parseWhile = (whileToParse) => {
    elements.push({line:whileToParse.test.loc.start.line,type:whileToParse.type,name:'',condition:whileToParse.test.expr,value:''});
    Parse[whileToParse.body.type](whileToParse.body);
};
/*------------------------------------------------------------------------------- For Statement ----------------------------------------------------------------------------------------------------------------------------------------------------------*/
const parseFor = (forToParse) => {
    elements.push({line:forToParse.test.loc.start.line, type:forToParse.type ,name:'',condition:'for('.concat(forToParse.init.expr,';',forToParse.test.expr,';',forToParse.update.expr,(')')),value:''});
    Parse[forToParse.body.type](forToParse.body);
};
/*------------------------------------------------------------------------------- Return Parser ---------------------------------------------------------------------------------------------------------------------------------------------------*/
const parseReturn =(returnToParse) =>{
    elements.push({line:returnToParse.loc.start.line, type:returnToParse.type ,name:'',condition:'',value:returnToParse.expr});
};

/*------------------------------------------------------------------------------- Main Parser ---------------------------------------------------------------------------------------------------------------------------------------------------*/

const Parse = {
    'FunctionDeclaration': parseFunction,
    'VariableDeclaration': parseVariable,
    'ExpressionStatement': parseExpression,
    'AssignmentExpression': parseAssignment,
    'IfStatement': parseIf,
    'BlockStatement':parseBlock,
    'WhileStatement': parseWhile,
    'ForStatement': parseFor,
    'ReturnStatement': parseReturn
};

const Parser = (parsedCode) => {
    elements=[];
    parsedCode.body.forEach(e => Parse[e.type](e));
    return elements;
};


