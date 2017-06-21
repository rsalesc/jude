function noChecking(code) {
    return code;
}

function javaChecking(code) {
    const originalCode = (" " + code).slice(1);

    const re_package = /\bpackage\s+([^.;]+(?:\.[^.;]+)*?);/gm;
    const re_class = /\bpublic\s+(?:strictfp\s+)?(?:(?:abstract|final)\s+)?(?:strictfp\s+)?class\s+([_a-zA-Z\$][_0-9a-zA-z\$]*?)\b/gm;
    const re_main = /\bpublic\s+(?:strictfp\s+)?(?:(?:abstract|final)\s+)?(?:strictfp\s+)?class\s+Main\b/gm;

    // do not handle multichar escape sequences
    const re_string = /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/gm; 
    const re_comment = /\/\*[\s\S]*?\*\//gm;
    const re_inline = /\/\/.*?$/gm;
    const re_unicode = /\\u([0-9a-fA-F]{4})/gm;

    let aux = code.replace(re_comment, "").replace(re_string, "").replace(re_inline, "")
        .replace(re_unicode, "");
    if(!re_main.test(aux))
        throw new Error("your Java code should have a Main public class as an entry point");
    if(re_package.test(aux))
        throw new Error("you should not declare package in your Java code");

    return originalCode;
}

module.exports = {
    "CPP": noChecking,
    "C": noChecking,
    "Java": javaChecking,
    "Py2": noChecking,
    "Py3": noChecking
};