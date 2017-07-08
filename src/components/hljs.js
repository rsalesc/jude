const hljs = require("highlight.js/lib/highlight");
hljs.registerLanguage("cpp", require("highlight.js/lib/languages/cpp"));
hljs.registerLanguage("python", require("highlight.js/lib/languages/python"));
hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));

export default hljs;
