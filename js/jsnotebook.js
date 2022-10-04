make_button = ( btn_text, element, console_number, check_console, settlement ) => {
    let btn = document.createElement('button');
    btn.textContent = btn_text;
    let parent = element.parentNode;
    // ボタンの位置調整のためだけのp要素
    parent.appendChild( document.createElement('p') );
    parent.appendChild( btn );

    btn.addEventListener('click', () => {
        let program = element.innerHTML;

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
    constructor( element ) {
        this.element = element;
        output ||= [];
        output_number ||= 0;
        this.console_number = false;
    }

    check_console() {
        return ( this.element.className.indexOf('console') != -1 );
    }

    add_console() {
        this.console_number = output_number;
        let parent = this.element.parentNode;
        let con = document.createElement( 'pre' );
        con.classList.add( 'console' );
        parent.appendChild( con );
        output.push( con );
        output_number += 1;
    }
}
class Runnable extends Executable{
    add_button() {
        // let btn = document.createElement('button');
        // btn.textContent = "Run";
        // let parent = this.element.parentNode;
        // parent.appendChild( document.createElement('p') );
        // parent.appendChild( btn );
        //parent.appendChild( document.createElement('p').appendChild(btn) )

        make_button( "Run", this.element, this.console_number, this.check_console(), false );

    }
}
class Once extends Executable{
    add_button(){
        // let btn = document.createElement('button');
        // btn.textContent = "Once";
        // let parent = this.element.parentNode;
        // parent.appendChild( document.createElement('p') );
        // parent.appendChild( btn );
        //parent.appendChild( document.createElement('p').appendChild(btn) )

        make_button( "Once", this.element, this.console_number, this.check_console(), true );
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
        let pre_tags = this.markdown.querySelectorAll('pre code.javascript');
        //console.log(pre_tags);
        pre_tags.forEach( elm => {
            elm.textContent = elm.textContent
            .replace( /&nbsp;/g," ")
            .replace( /&lt;/g, "<" )
            .replace( /&gt;/g, ">")
            .replace( /<br>/g, "\r\n" );
            if( elm.className.indexOf( 'runnable') != -1 )   this.executable.push( new Runnable( elm ) );
            else if( elm.className.indexOf( 'once') != -1 )   this.executable.push( new Once( elm ) );
            else if( elm.className.indexOf( 'sandbox') != -1 )   this.executable.push( new Sandbox( elm ) );
         });
        //console.log(this.executable);

        this.executable.forEach( elm => {
            //console.log( elm.check_console() );
            if( elm.check_console() )   elm.add_console();
            elm.add_button();
            //console.log( elm );
        })
    }
}
const jsnPrint = ( element, string ) => {
	if( element.className.indexOf( 'console' ) != -1 ) {
		 element.innerHTML += string + "<br>";
	}
}

const jsnError = ( element, string ) => {
    if( element.className.indexOf( 'console' ) != -1 ) {
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
    var edit = document.querySelectorAll( '.editable' );
    edit.forEach( function( value ) {
        value.contentEditable = true;
    });

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
