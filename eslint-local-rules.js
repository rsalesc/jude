"use strict";

const ALLOWED_ASYNC_TYPES = [
    "Function",
    "FunctionExpression",
    "MemberExpression",
    "ArrowFunctionExpression",
    "YieldExpression",
];

function checkSpace(context, node) {
    const source = context.getSourceCode();
    const [identifier, next] = source.getFirstTokens(node, 2);
    return identifier.range[1] === next.range[0];
}

module.exports = {
    'space-after-await': (context) => ({
        AwaitExpression(node) {
            const source = context.getSourceCode();
            const [identifier, next] = source.getFirstTokens(node, 2);
            if(checkSpace(context, node)) {
                context.report({
                    node,
                    message: "Missing space after await",
                    fix(fixer) {
                        return fixer.insertTextAfter(identifier, ' ');
                    }
                });
            }
        }
    }),
    'space-after-async': (context) => ({
        ArrowFunctionExpression(node) {
            if(node.async) {
                if(checkSpace(context, node)) {
                    context.report({
                        node,
                        message: "Missing space after async"
                    });
                }
            }
        }
    }),
    'no-async-as-function': (context) => ({
        CallExpression(node) {
            if(node.callee.name === 'async') {
                context.report({
                    node,
                    message: "Async used as a function",
                    fix(fixer) {
                        if(node.arguments.length !== 1
                        || ALLOWED_ASYNC_TYPES.indexOf(node.arguments[0].type) === -1) 
                            return [];

                        if(node.parent && (node.parent.type == "CallExpression"
                         || node.parent.type == "MemberExpression"
                            && node.parent.property
                            && node.parent.property.type === 'Identifier'
                            && (node.parent.property.name === 'then' || node.parent.property.name === 'catch'))) {

                            return fixer.replaceText(node, `(async ${context.getSourceCode().getText(node.arguments[0])})`);
                        } else {
                            return fixer.replaceText(node, `async ${context.getSourceCode().getText(node.arguments[0])}`);
                        }
                    }
                });
            }
        }
    }),
    'no-await-as-function': (context) => ({
        AwaitExpression(node) {
            const source = context.getSourceCode();

            function awaitableIsSurroundedByBrackets(node) {
                const [_, first] = source.getFirstTokens(node, 2);
                const last = source.getLastToken(node);
                return first.value === '(' && last.value === ')';
            }

            if(awaitableIsSurroundedByBrackets(node)) {
                context.report({
                    node,
                    message: "Await is used as a function",
                    fix(fixer) {
                        return fixer.replaceTextRange([
                            source.getFirstTokens(node, 2)[1].range[0],
                            source.getLastToken(node).range[1]
                        ], source.getText(node.argument));
                    }
                })
            }
        },
        CallExpression(node) {
            if(node.callee.name === 'await') {
                context.report({
                    node,
                    message: "Await is used as a function inside a non-async function"
                });
            }
        }
    })
};