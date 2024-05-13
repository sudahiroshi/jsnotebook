(function () {
    'use strict';
  
    //!editor
  
    const {basicSetup} = CM["codemirror"];
    const {EditorView, keymap} = CM["@codemirror/view"];
    const {indentWithTab} = CM["@codemirror/commands"];
    const {javascript} = CM["@codemirror/lang-javascript"];
  
    const doc = `if (true) {
    console.log("okay")
  } else {
    console.log("oh no")
  }
  `;
  
    new EditorView({
      doc,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript()
      ],
      parent: document.querySelector("#editor")
    });
  
  })();