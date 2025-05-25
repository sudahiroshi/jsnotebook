make_button = ( btn_text, element, console_number, check_console, settlement, editor ) => {
    let btn = document.createElement('button');
    btn.textContent = btn_text;
    let parent = element.parentNode;
    // ボタンの位置調整のためだけのp要素
    //parent.appendChild( document.createElement('p') );
    //parent.appendChild( btn );
    parent.insertBefore( btn, element );

    btn.addEventListener('click', () => {
        //let program = element.innerHTML;
        let program = editor.getValue();
        console.log( {program, console_number} );

        program = program
        .replace( /&nbsp;/g," ")
        .replace( /&lt;/g, "<" )
        .replace( /&gt;/g, ">")
        .replace( /<br>/g, "\r\n" );
        if( check_console ) {
            program = program.replace( /console.log\(/g, "jsnPrint( output[" + console_number + "]," );
        }
        // evalをそのまま使用すると，別の枠に変数の内容を受け渡せないため，ダミーを使用する
        let dummyEval = eval;
        let errOutput = output[ console_number ];

        try {
            dummyEval( program );
        } catch (e) {
            jsnError( errOutput, e );
            throw( e );
        }
        btn.disabled = settlement;
    });
}

class Executable {
    constructor( element, editor ) {
        this.element = element;
        output ||= [];
        output_number ||= 0;
        this.console_number = false;
        this.editor = editor;
    }

    check_console() {
        return ( this.element.className.indexOf('console') != -1 );
    }

    add_console() {
        this.console_number = output_number;
        let parent = this.element.parentNode;
        let con = document.createElement( 'pre' );
        con.classList.add( 'output' );
        parent.insertBefore( con, this.element.nextSibling );
        output.push( con );
        output_number += 1;
    }
}
class Runnable extends Executable{
    add_button() {
        make_button( "Run", this.element, this.console_number, this.check_console(), false, this.editor );
    }
}
class Once extends Executable{
    add_button(){
        make_button( "Once", this.element, this.console_number, this.check_console(), true, this.editor );
    }
}
class Sandbox extends Executable {
    add_button(){
        let btn = document.createElement('button');
        btn.textContent = "Run";
        let parent = this.element.parentNode;
        parent.appendChild( document.createElement('p') );
        parent.appendChild( btn );

        btn.addEventListener('click', () => {
            let program = this.element.innerHTML;
            let script = program;
            if( this.check_console ) {
                script = program.replace( /console.log\(/g, "jsnPrint( output[" + this.console_number + "]," );
            }
            try {
                eval( script );
            } catch (e) {
                jsnError( output, e );
                throw( e );
            }
        });
    }
}
class JSNotebook {
    constructor( markdown, conv ) {
        this.markdown = markdown;
        this.conv = conv;
        this.executable = [];
    }
    md2html() {
        this.markdown.innerHTML = this.conv.makeHtml( this.markdown.innerHTML );
    }
    setup_executable() {
        //console.log(this.markdown);
        let js_code_blocks = this.markdown.querySelectorAll('pre code.javascript');
        let editable_elements = this.markdown.querySelectorAll('.editable');

        require.config({ paths: { vs: "./node_modules/monaco-editor/min/vs" } });
        require(["vs/editor/editor.main"], () => {
            let editor;

            // Process javascript code blocks first
            js_code_blocks.forEach( elm => {
                //console.log(elm);
                elm.textContent = elm.textContent
                .replace( /&nbsp;/g," ")
                .replace( /&lt;/g, "<" )
                .replace( /&gt;/g, ">")
                .replace( /<br>/g, "\r\n" );
                editor = monaco.editor.create(
                    elm.parentNode, // Assuming the parent <pre> should be the editor container
                    {
                        value: elm.textContent,
                        language: "javascript",
                        lineNumbers: true,
                        scrollBeyondLastLine: false,
                        theme: 'vs-light',
                    }
                );
                // Transfer classes from code to pre (editor container)
                elm.parentNode.classList.add(...elm.classList);
                // Remove original code element as Monaco replaces it
                //elm.remove(); // Keep the original element and hide it, or ensure parentNode is correct

                if( elm.classList.contains("runnable") ) {
                    let runnable = new Runnable( elm.parentNode, editor );
                    this.executable.push( runnable );
                    if( elm.classList.contains("console") ) {
                        runnable.add_console();
                    }
                    runnable.add_button();
                }
                if( elm.classList.contains("once") ) {
                    let once = new Once( elm.parentNode, editor );
                    this.executable.push( once );
                    if( elm.classList.contains("console") ) {
                        once.add_console();
                    }
                    once.add_button();
                }
                if( elm.classList.contains("sandbox") ) {
                    let sandbox = new Sandbox( elm.parentNode, editor );
                    this.executable.push( sandbox );
                    if( elm.classList.contains("console") ) {
                        sandbox.add_console();
                    }
                    sandbox.add_button();
                }
                elm.remove(); // remove original code element
            });

            // Process other editable elements
            editable_elements.forEach(elm => {
                // Skip if it's a javascript code block already processed (or its parent)
                // This check assumes that `pre code.javascript` would have its parent `pre` tag made into editor.
                // Or if the editable element itself is the `code` tag.
                if (elm.matches('pre code.javascript') || elm.parentNode.matches('pre code.javascript')) {
                    // This element (or its child) has been processed as a JS code block
                    return;
                }
                // Avoid re-initializing if it's inside an already initialized Monaco editor (e.g. a <pre> tag that contained a js code block)
                if (elm.classList.contains('monaco-editor') || elm.querySelector('.monaco-editor')) {
                    return;
                }
                // Ensure we are not processing children of already processed js_code_blocks' parents
                let isChildOfProcessedJS = false;
                js_code_blocks.forEach(js_elm => {
                    if (js_elm.parentNode.contains(elm) && js_elm.parentNode !== elm) {
                        isChildOfProcessedJS = true;
                    }
                });
                if (isChildOfProcessedJS) return;


                // Determine the language. Default to 'plaintext'.
                // Could be extended to check for other language classes if needed.
                let language = 'plaintext';
                if (elm.classList.contains('html')) language = 'html';
                if (elm.classList.contains('css')) language = 'css';
                // Add more languages as needed

                // Store original display style
                const originalDisplay = elm.style.display;
                // Create a new div for Monaco to attach to, as it replaces the content of the target.
                // Or, if elm is a block element like DIV or PRE, it might work directly.
                // For safety, let's create a container if it's not a PRE.
                let editor_container = elm;
                if (elm.tagName.toLowerCase() !== 'pre') {
                    editor_container = document.createElement('div');
                    // Copy classes and styles if necessary, or handle styling appropriately
                    editor_container.style.height = elm.offsetHeight > 0 ? (elm.offsetHeight + 'px') : '100px'; // Set a default height
                    editor_container.style.width = elm.offsetWidth > 0 ? (elm.offsetWidth + 'px') : '100%';   // Set a default width
                    elm.parentNode.insertBefore(editor_container, elm);
                    elm.style.display = 'none'; // Hide original element
                } else {
                     // if it is a PRE, Monaco will use it. Ensure it has content or Monaco might complain/do nothing.
                    if (elm.textContent.trim() === '') {
                        elm.textContent = '\n'; // Add some content to make it sizeable
                    }
                }


                editor = monaco.editor.create(
                    editor_container,
                    {
                        value: elm.textContent.trim(), // Use textContent for generic elements
                        language: language,
                        lineNumbers: true,
                        scrollBeyondLastLine: false,
                        theme: 'vs-light',
                        automaticLayout: true, // Adjust editor size automatically
                    }
                );

                // If we created a new container, we might need to handle button placement differently
                // For now, let's assume buttons are not needed for generic .editable elements
                // unless they also have .runnable, .once, etc.
                // The existing button logic is tied to js_code_blocks (elm.parentNode being the <pre> tag)

                // If the original element was a pre>code structure, the elm might be the code tag.
                // The monaco editor is created on elm.parentNode in the js specific part.
                // For generic .editable, we are creating it on the element itself (or a new div).
            });
         });
    }
}
const jsnPrint = ( element, string ) => {
	element.innerHTML += string + "<br>";
}

const jsnError = ( element, string ) => {
    if( element.className.indexOf( 'output' ) != -1 ) {
    	element.innerHTML += "<span class='err'>" + string + "</span><br>";
    }
}

window.addEventListener('DOMContentLoaded', function() {
    showdown.setFlavor('github');

    // consoleに相当するオブジェクトを入れておく配列
    // evalするときにグローバル変数でないとエラーになるので，
    // 回避するためにゴチャゴチャしている
    output = [];
    output_number = 0;

    // jsn-mdタグを拾ってMarkdownへの変換処理をおこなう
    var docs = document.querySelectorAll( 'jsn-md' );
    var conv = new showdown.Converter(  );
    docs.forEach( function( markdown ) {
        let jsn = new JSNotebook( markdown, conv );
        jsn.md2html();
        jsn.setup_executable();
    });



    // runnableクラスの付いた要素に実行ボタンを付ける
    var pres = document.querySelectorAll( '.runnable' );
    pres.forEach( function( value ) {
        //console.log( value );
        let parent = value.parentNode;
        parent.style.background = "#f8fcfc";
        parent.style.border = "solid 1px #80a0a0";
    });

    // onceクラスの付いた要素に実行ボタンを付ける
    var pres = document.querySelectorAll( '.once' );
    pres.forEach( function( value ) {
        let parent = value.parentNode;
        parent.style.background = "#f8fcfc";
        parent.style.border = "solid 1px #80a0a0";
    });

    // sandboxクラスの付いた要素に実行ボタンを付ける
    var pres = document.querySelectorAll( '.sandbox' );
    pres.forEach( function( value ) {
        let parent = value.parentNode;
        parent.style.background = "#f8fcfc";
        parent.style.border = "solid 1px #80a0a0";
    });

    // editableクラスの付いた要素を編集可能にする
    // var edit = document.querySelectorAll( '.editable' );
    // edit.forEach( function( value ) {
    //     value.contentEditable = true;
    // });

    // hlクラスの付いた要素にSyntaxHighliteを行う
    var code = document.querySelectorAll( 'pre code.hl, pre code.html' );
    code.forEach( function( block ) {
        block.innerHTML = block.innerHTML.replace( /&amp;/g, '&' ).replace( / /g, '&nbsp;' );
        hljs.highlightBlock( block );
    });

    // Mermaidの要素を修正する
    var code = document.querySelectorAll( 'pre code.mermaid' );
    code.forEach( function(block) {
        block.innerHTML = block.innerHTML.replace( /<br>/g, "\r\n" )
        .replace( /&nbsp;/g," ").replace( /&amp;/g, '&' ).replace( /&lt;/g, '<' ).replace( /&gt;/g, '>'  );
    })
});
