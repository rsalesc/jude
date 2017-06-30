function noChecking(code) {
  return code;
}

function javaChecking(code) {
  const originalCode = ` ${code}`.slice(1);

  const rePackage = /\bpackage\s+([^.;]+(?:\.[^.;]+)*?);/gm;
  const reClass = /\bpublic\s+(?:strictfp\s+)?(?:(?:abstract|final)\s+)?(?:strictfp\s+)?class\s+([_a-zA-Z$][_0-9a-zA-z$]*?)\b/gm;
  const reMain = /\bpublic\s+(?:strictfp\s+)?(?:(?:abstract|final)\s+)?(?:strictfp\s+)?class\s+Main\b/gm;

    // do not handle multichar escape sequences
  const reString = /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/gm;
  const reComment = /\/\*[\s\S]*?\*\//gm;
  const reInline = /\/\/.*?$/gm;
  const reUnicode = /\\u([0-9a-fA-F]{4})/gm;

  const aux = code.replace(reComment, "").replace(reString, "").replace(reInline, "")
        .replace(reUnicode, "");
  if (!reMain.test(aux))
    throw new Error("your Java code should have a Main public class as an entry point");
  if (rePackage.test(aux))
    throw new Error("you should not declare package in your Java code");

  return originalCode;
}

module.exports = {
    CPP: noChecking,
    C: noChecking,
    Java: javaChecking,
    Py2: noChecking,
    Py3: noChecking
};
