
var jnsPrint = ( element, string ) => {
	if( element.className.indexOf( 'console' ) != -1 ) {
		 element.innerHTML += string + "<br>";
	}
	console.log( string );
}

var jnsError = ( element, string ) => {
    if( element.className.indexOf( 'console' ) != -1 ) {
    	element.innerHTML += "<span class='err'>" + string + "</span><br>";
    }
}

// Run（実行）ボタンへのイベントを付加するメソッド
var setRun2 = ( div, element ) => {
    div.addEventListener('click', function() {
        output = element.parentNode.lastElementChild;
        var program = element.innerHTML;
//console.log( program ); // デバッグ用
        var script = document.createElement('script');
        script.innerHTML = program
            .replace( /<br>/g, "\r\n" )
            .replace( /&nbsp;/," ")
            .replace( /console.log\(/g, "jnsPrint( output," );
        document.body.appendChild( script );
    });
};

// Run（実行）ボタンへのイベントを付加するメソッドのeval版
// 枠をまたいだ実行に対応していないのでボツ
// 強引に枠を跨いで実行できるように改変
var setRun = function( div, element )  {
    div.addEventListener('click', function() {
        output = element.parentNode.lastElementChild;
        var program = element.innerHTML;
//console.log( program ); // デバッグ用
        var dummyEval = eval;
        var script = program
            .replace( /<br>/g, "\r\n" )
            .replace( /&nbsp;/g," ").replace( /&amp;/g, '&' ).replace( /&lt;/g, '<' ).replace( /&gt;/g, '>'  )
            .replace( /console.log\(/g, "jnsPrint( output," );
/*        if( output.className.indexOf( 'console' ) != -1 ) {
            script = script.replace( /console.log\(/g, "jnsPrint( output," );
        }*/
        try {
            dummyEval( script );
        } catch (e) {
            jnsError( output, e );
            throw( e );
        }
    });
};

// Once（一度だけ実行）ボタンへのイベントを付加するメソッド
var setOnce = ( div, element ) => {
    div.addEventListener('click', function() {
        output = element.parentNode.lastElementChild;
//console.log( output );
        var program = element.innerHTML;
//console.log( program ); // デバッグ用
        var dummyEval = eval;
        //var script = document.createElement('script');
        var script = program
            .replace( /<br>/g, "\r\n" )
            .replace( /&nbsp;/g," ")
            .replace( /console.log\(/g, "jnsPrint( output," );
 //console.log( output );
        try {
            dummyEval( script );
        } catch (e) {
            jnsError( output, e );
            throw( e );
        }
        div.disabled = true;
    });
};

// Sandbox（実行）ボタンへのイベントを付加するメソッド
var setSandbox = ( div, element ) => {
    div.addEventListener('click', function() {
      output = element.parentNode.lastElementChild;
        var program = element.innerHTML;
//console.log( program ); // デバッグ用
        var dummyEval = eval;
        var script = "(function(){" + program
                .replace( /<br>/g, "\r\n" )
                .replace( /&nbsp;/," ")
                .replace( /console.log\(/g, "jnsPrint( output," )
            + "})()";;
        try {
            dummyEval( script );
        } catch (e) {
            jnsError( output, e );
            throw( e );
        }
    });
};

window.addEventListener('load', function() {
    showdown.setFlavor('github');

    output = undefined;
//     console.log = ( value ) =>  {
//         if( output != undefined ) {
//             output.innerHTML += value + "<br>";
//         }
//     }

    // mdタグを拾ってMarkdownへの変換処理をおこなう
    var docs = document.querySelectorAll( 'jsn-md' );
    var conv = new showdown.Converter(  );
    docs.forEach( function( value ) {
        value.innerHTML = conv.makeHtml( value.innerHTML );
        var div = document.createElement('button');
    });

    // &, >, <を置き換える
    var pres = document.querySelectorAll( 'pre code.javascript' );
    pres.forEach( function( value ) {
        let code = value.innerHTML.replace( /&amp;/g, '&' ).replace( /&lt;/g, '<' ).replace( /&gt;/g, '>' );
        value.innerHTML = code;
    });

    // runnableクラスの付いた要素に実行ボタンを付ける
    var pres = document.querySelectorAll( '.runnable' );
    pres.forEach( function( value ) {
        var btn = document.createElement('button');
        btn.textContent = "Run";
        setRun( btn, value );
        btn.contentEditable = false;
        let parent = value.parentNode;
        parent.appendChild( document.createElement('p') );
        parent.appendChild( btn );
        //console.log( value.className );
        if( value.className.indexOf( 'console' ) != -1 ) {
        	con = document.createElement( 'pre' );
        	con.classList.add( 'console' );
        	parent.appendChild( con );
        }
        parent.style.background = "#f8fcfc";
        parent.style.border = "solid 1px #80a0a0";
    });

    // onceクラスの付いた要素に実行ボタンを付ける
    var pres = document.querySelectorAll( '.once' );
    pres.forEach( function( value ) {
        var btn = document.createElement('button');
        btn.textContent = "Once";
        setOnce( btn, value );
        btn.contentEditable = false;
        let parent = value.parentNode;
        parent.appendChild( document.createElement('p') );
        parent.appendChild( btn );
        if( value.className.indexOf( 'console' ) != -1 ) {
        	con = document.createElement( 'pre' );
        	con.classList.add( 'console' );
        	parent.appendChild( con );
        }
        parent.style.background = "#f8fcfc";
        parent.style.border = "solid 1px #80a0a0";
    });

    // sandboxクラスの付いた要素に実行ボタンを付ける
    var pres = document.querySelectorAll( '.sandbox' );
    pres.forEach( function( value ) {
        var btn = document.createElement('button');
        btn.textContent = "Sandbox";
        setSandbox( btn, value );
        btn.contentEditable = false;
        let parent = value.parentNode;
        parent.appendChild( document.createElement('p') );
        parent.appendChild( btn );
        if( value.className.indexOf( 'console' ) != -1 ) {
        	con = document.createElement( 'pre' );
        	con.classList.add( 'console' );
        	parent.appendChild( con );
        }
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
        block.innerHTML = block.innerHTML.replace( /&amp;/g, '&' );
        hljs.highlightBlock( block );
    });
});
