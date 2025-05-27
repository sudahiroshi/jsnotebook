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
        // Query for '.editable' elements *within the current markdown scope*
        // This prevents re-processing elements if setup_executable is called multiple times on different jsn-md blocks.
        let specific_editable_elements = this.markdown.querySelectorAll('.editable');

        require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs" } });
        require(["vs/editor/editor.main"], (monaco_api) => { // Renamed monaco to monaco_api to avoid conflict if global monaco exists
            let editor;

            // Process javascript code blocks first (specific to jsn-md content)
            js_code_blocks.forEach( elm => {
                // Mark as processed by this specific jsn-md block to avoid generic handling
                elm.dataset.jsnMonacoInitialized = 'true';
                if(elm.parentNode.tagName === 'PRE') {
                     elm.parentNode.dataset.jsnMonacoInitialized = 'true';
                }

                elm.textContent = elm.textContent
                .replace( /&nbsp;/g," ")
                .replace( /&lt;/g, "<" )
                .replace( /&gt;/g, ">")
                .replace( /<br>/g, "\r\n" );
                editor = monaco_api.editor.create(
                    elm.parentNode, 
                    {
                        value: elm.textContent,
                        language: "javascript",
                        lineNumbers: true,
                        scrollBeyondLastLine: false,
                        theme: 'vs-light',
                        automaticLayout: true,
                    }
                );
                elm.parentNode.classList.add(...elm.classList);
                
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
                elm.remove(); 
            });

            // Process other '.editable' elements *within this specific jsn-md block*
            specific_editable_elements.forEach(elm => {
                if (elm.dataset.jsnMonacoInitialized === 'true' || (elm.parentNode.dataset && elm.parentNode.dataset.jsnMonacoInitialized === 'true')) {
                    return; // Already handled by the js_code_blocks loop or is a parent of one
                }
                 // Check if it's a CODE element whose PRE parent was already initialized
                if (elm.tagName === 'CODE' && elm.parentNode.classList.contains('monaco-editor')) {
                    return;
                }
                // Generic check for monaco editor presence
                if (elm.classList.contains('monaco-editor') || elm.querySelector('.monaco-editor') || (elm.parentNode && elm.parentNode.classList.contains('monaco-editor'))) {
                    return;
                }
                
                elm.dataset.jsnMonacoInitialized = 'true'; // Mark as processed

                let language = 'plaintext';
                if (elm.classList.contains('html') || elm.classList.contains('language-html')) language = 'html';
                if (elm.classList.contains('css') || elm.classList.contains('language-css')) language = 'css';
                if (elm.classList.contains('javascript') || elm.classList.contains('language-javascript')) language = 'javascript';

                let editor_container = elm;
                let original_content = elm.textContent; // Default to textContent

                if (elm.tagName.toLowerCase() !== 'pre') {
                    editor_container = document.createElement('div');
                    let height = elm.offsetHeight > 0 ? (elm.offsetHeight + 'px') : '100px';
                    // For textareas, try to get content from value attribute
                    if (elm.tagName.toLowerCase() === 'textarea') {
                        original_content = elm.value;
                        height = elm.style.height || height; // Prefer textarea's explicit height
                    }
                    editor_container.style.height = height;
                    editor_container.style.width = elm.offsetWidth > 0 ? (elm.offsetWidth + 'px') : '100%';
                    elm.parentNode.insertBefore(editor_container, elm);
                    elm.style.display = 'none';
                } else {
                    if (elm.textContent.trim() === '') {
                        elm.textContent = '\n'; 
                    }
                }
                
                monaco_api.editor.create(
                    editor_container,
                    {
                        value: original_content.trim(),
                        language: language,
                        lineNumbers: true,
                        scrollBeyondLastLine: false,
                        theme: 'vs-light',
                        automaticLayout: true,
                    }
                );
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

    output = [];
    output_number = 0;

    var docs = document.querySelectorAll( 'jsn-md' );
    var conv = new showdown.Converter(  );
    docs.forEach( function( markdown_el ) { // Renamed markdown to markdown_el
        let jsn = new JSNotebook( markdown_el, conv );
        jsn.md2html();
        jsn.setup_executable(); // This handles monaco for jsn-md blocks
    });

    // --- New Generic Monaco Initialization Logic ---
    require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs" } });
    require(["vs/editor/editor.main"], (monaco_api) => { 
        let general_editable_elements = document.querySelectorAll('.editable, [contentEditable="true"]');
        general_editable_elements.forEach(elm => {
            if (elm.dataset.jsnMonacoInitialized === 'true' || elm.closest('[data-jsn-monaco-initialized="true"]')) return;
            if (elm.classList.contains('monaco-editor') || elm.querySelector('.monaco-editor')) return;
            if (elm.tagName === 'CODE' && elm.parentNode && elm.parentNode.classList.contains('monaco-editor')) return;
            if (elm.tagName === 'PRE' && elm.querySelector('.monaco-editor')) return;
            if (elm.dataset.genericMonacoInitialized === 'true') return;

            // Check if inside jsn-md and should be skipped by generic handler
            let isInsideJsnMdScope = false;
            let currentAncestor = elm.parentNode;
            while(currentAncestor && currentAncestor !== document.body) {
                if (currentAncestor.tagName === 'JSN-MD') {
                    isInsideJsnMdScope = true;
                    break;
                }
                currentAncestor = currentAncestor.parentNode;
            }
            // If inside a JSN-MD but not picked up by specific jsn-md logic (e.g. not pre code.javascript or .editable within that scope)
            // then it's ambiguous. For now, let's assume generic handler should skip it to be safe.
            // This might need refinement if there are valid cases for generic handling inside jsn-md.
            if (isInsideJsnMdScope) return;


            let language = 'plaintext';
            let langFoundOnCodeChild = false;

            if (elm.tagName === 'PRE') {
                const code_el = elm.querySelector(':scope > code');
                if (code_el) {
                    const codeClassList = code_el.classList;
                    if (codeClassList.contains('language-javascript') || codeClassList.contains('javascript')) {
                        language = 'javascript';
                        langFoundOnCodeChild = true;
                    } else if (codeClassList.contains('language-html') || codeClassList.contains('html')) {
                        language = 'html';
                        langFoundOnCodeChild = true;
                    } else if (codeClassList.contains('language-css') || codeClassList.contains('css')) {
                        language = 'css';
                        langFoundOnCodeChild = true;
                    }
                }
            }

            if (!langFoundOnCodeChild) { // Fallback to checking the element itself
                const elmClassList = elm.classList;
                if (elmClassList.contains('language-javascript') || elmClassList.contains('javascript')) language = 'javascript';
                else if (elmClassList.contains('language-html') || elmClassList.contains('html')) language = 'html';
                else if (elmClassList.contains('language-css') || elmClassList.contains('css')) language = 'css';
            }

            let content = elm.textContent;
            let targetElement = elm;
            let originalElementToHide = null;

            if (elm.tagName === 'CODE' && elm.parentNode.tagName === 'PRE') {
                targetElement = elm.parentNode; 
                if (targetElement.dataset.genericMonacoInitialized === 'true') return;
            } else if (elm.tagName === 'TEXTAREA') {
                content = elm.value;
                let div = document.createElement('div');
                div.style.height = elm.style.height || (elm.offsetHeight > 0 ? elm.offsetHeight + 'px') : '150px'; 
                div.style.width = elm.style.width || (elm.offsetWidth > 0 ? elm.offsetWidth + 'px') : '100%');
                elm.parentNode.insertBefore(div, elm);
                targetElement = div;
                originalElementToHide = elm;
            }
            
            if (targetElement.dataset.genericMonacoInitialized === 'true' || targetElement.classList.contains('monaco-editor') || targetElement.querySelector('.monaco-editor')) {
                return;
            }

            monaco_api.editor.create(targetElement, {
                value: content, // For PRE, textContent is fine. For TEXTAREA, value was used.
                language: language,
                lineNumbers: true,
                scrollBeyondLastLine: false,
                theme: 'vs-light',
                automaticLayout: true,
            });
            targetElement.dataset.genericMonacoInitialized = 'true'; 
            if (originalElementToHide) {
                originalElementToHide.style.display = 'none';
            }
            if(elm.contentEditable === 'true' && elm !== targetElement) {
                 elm.contentEditable = 'false';
            }
        });
    });

    document.querySelectorAll( '.runnable, .once, .sandbox' ).forEach( function( value ) {
        let parent = value.tagName === 'PRE' ? value : (value.parentNode && value.parentNode.tagName === 'PRE' ? value.parentNode : null);
        if (parent && parent.classList.contains('monaco-editor')) { 
             parent.style.background = "#f8fcfc";
             parent.style.border = "solid 1px #80a0a0";
        } else if (value.classList.contains('monaco-editor')) { 
             value.style.background = "#f8fcfc";
             value.style.border = "solid 1px #80a0a0";
        }
    });

    var hl_code = document.querySelectorAll( 'pre code.hl, pre code.html' );
    hl_code.forEach( function( block ) {
        if (block.closest('.monaco-editor')) return;
        block.innerHTML = block.innerHTML.replace( /&amp;/g, '&' ).replace( / /g, '&nbsp;' );
        hljs.highlightBlock( block );
    });

    var mermaid_code = document.querySelectorAll( 'pre code.mermaid' );
    mermaid_code.forEach( function(block) {
        if (block.closest('.monaco-editor')) return;
        block.innerHTML = block.innerHTML.replace( /<br>/g, "\r\n" )
        .replace( /&nbsp;/g," ").replace( /&amp;/g, '&' ).replace( /&lt;/g, '<' ).replace( /&gt;/g, '>'  );
    })
});
