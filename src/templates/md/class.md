---
title: JavaScriptの初歩の初歩
layout: src/templates/layout.pug
---

# JavaScript の初歩の初歩

## はじめに

この文書は，JavaScript 入門のための簡単な introduction です．

### JavaScript はどうやって作られた？

JavaScript は，古の Netscape 社のエンジニアであるブレンダン・アイク氏が開発しました．
開発当時は LiveScript と名乗っていて，同じ頃に開発された Java 言語が流行しそうだと感じた経営者が，LiveScript の名称を JavaScript に変更させました．
つまり，Java と JavaScript の間には何の関係もありません．
なお，略称は JS（ジェイエス）とよぶのが普通です．
決して「ジャヴァスク」とは呼びません．

その後，MicroSoft 社の InternetExplorer にも採用されました．
しかし，ブラウザ戦争が勃発したため，各ベンダーは javascript の独自拡張を繰り返し，互換性が低いものとなってしまいました．
そこで，ISO や IEEE などで JavaScript を規格として定めようとする動きが始まりました．
最終的に，ECMA（欧州発の情報通信システム分野における国際的な標準化団体）によって規格化され，正式な企画名は EcmaScript と呼ばれています．
バージョンアップが繰り返され，現在では~~EcmaScript2015 が定められており，それに続く EcmaScript2016 も話し合いが続けられています．~~EcmaScript2016 の仕様が決定されました．

### JavaScript はどこで動く？

基本的に Web ブラウザの上で動かしますが，最近では Node.js や Rhino のようにブラウザ以外で動作させる環境が出てきています．
Web ブラウザ上で動作させるためのインタープリタは，ブラウザごとに様々な実装があります．
例えば Firefox では SpiderMonkey と呼ばれるエンジン（インタープリタなどを含めた実行環境のこと）を搭載しています．
その他の実装を以下に示します．

| ブラウザ | 開発元             | JS エンジン  |
| :------- | :----------------- | :----------- |
| Firefox  | Mozzila            | SpiderMonkey |
| Chrome   | Google             | V8           |
| Safari   | Apple              | Nitro        |
| Edge     | Microsoft          | Chakra       |
| Node.js  | ライアン・ダール氏 | V8           |

## JavaScript の基本文法

javascript はオブジェクト指向言語の考え方と関数型言語の考え方を取り入れています．
しかし，ここで言うオブジェクト指向言語は，Java などで採用されている Class-Instance の構造とは異なります．
ちょっと強引な解釈ですが，JavaScript では全てがオブジェクト（Instance）であり，新たに作成するオブジェクトは元となるオブジェクトの株分けのような存在となります．

はい，訳が分からないですよね．

難しい話は置いておきましょう．
ここで重要なのは，Java などでは int 型や double 型，その他のクラスで構成される型がありましたが，JavaScript ではそれら全てがオブジェクトです．
例えば以下のコードを見てください．

```javascript runnable editable
//コンソールにHello, Worldと表示します
// 事前にJavaScriptコンソールを開いておいてください

console.log("Hello, World");
```

上記コードのみで，Hello,World を表示できます．
C や Java と異なり，面倒な宣言（クラスやメソッド定義のためのおまじない）などは不要です．
なんとなく，楽そうというイメージが伝われば幸いです．

続いて，もう少し JavaScript らしいコードを見てみましょう．

```javascript runnable editable
// aに色々代入する例

var a = [];
a.push(5);
a.push(3.2);
a.push("hoge");
console.log(a);
```

1 行目の「var」ですが，これは JavaScript の変数宣言です．
型は代入するオブジェクトによって決まるので，とにかく何でもかんでも var で宣言します．
右辺の「[]」ですが，これは空の配列を表しています．
JavaScript では全てがオブジェクトであり，配列には全てのオブジェクトを代入できます．

2 行目から 4 行目は順に，整数，小数を含む数値，文字列を配列に入れています．
push は，配列の末尾にカッコ内のオブジェクトを代入するというメソッドです．

### 変数に代入できるもの

それでは続いて，関数を定義してみましょう．

```javascript runnable editable
// plus関数を定義する例

function plus(x, y) {
    return x + y;
}
console.log(plus(2, 5));
```

上記コードの 1 行目で関数 plus を定義しています．
内容は，2 つのパラメータ x と y を足して返すだけの簡単な関数です．
この例では 1 行に書きましたが，通常は複数行に分けて書きます．

2 行目で plus を使って足し算を行い，表示しています．

続いて，同じような働きをする以下の様な書き方を見てみましょう．

```javascript runnable editable
// 無名関数の定義の例

var plus2 = function(x, y) {
    return x + y;
};
console.log(plus2(2, 5));
```

上記コードでは，1 行目の右辺で無名関数を定義しています．
無名関数とは，function と括弧の間にあるはずの関数名がない，名前の無い関数です．
しかし，名前が無いと使うことができないので，上記のように左辺の plus2 に代入しています．
実は，JavaScript にとっては，関数もオブジェクトなので，上記のように変数に代入できます．

そのように定義した無名関数は，代入された変数名を使って 2 行目のように普通の関数と同じように実行できます．

### 無名関数の使いドコロ

結局変数に代入して名前をつけるなら，名前有りの関数を定義すればよいのではないか？と思う人もいると思います．
その疑問は正しいです．

ですが，JavaScript のような関数型言語においては，無名関数を使用する場面はたくさんあります．
いきなり難しい例を出して混乱するといけないので，肩慣らしから入ります．

```javascript runnable editable
// 無名関数を返す関数の例

function times_define(x) {
    return function(y) {
        return x * y;
    };
}
var times = times_define(2);
console.log(times(5));
```

上記コードは，1 行目で times_define に倍率 x を渡すことで，パラメータを x 倍する関数を返してくれる関数を定義しています．
そして 2 行目で 2 倍する関数を定義し，変数 times に代入します．
3 行目は実際に関数 times を使用して計算をする例です．

参考までに，1 行目の中で返される関数は，無名関数です．
動作の変わる関数を定義して，その後の処理を簡単にするために使われることが有ります．

名前有り関数で同じようなことをしたくても，名前有り関数は JS エンジンが実行前に全ソースコードをチェックして，実行される前に定義されてしまうため，このような使い方はできません．
なお，1 行目の例は無名関数を直接返していますが，一旦変数に代入してから返すことも可能です．

### 無名関数のもっと普通の使いドコロ

さて，もっと実践的な使い方を見てみましょう．
今度は，Web ページのボタンの処理の書き方です．
以下のようなコードにより，id が btn1 のボタンが定義されているとします．

```html hl
<button id="btn1">押してね</button>
```

<button id="btn1">押してね</button>

```javascript runnable editable
// ボタンにアクションを定義する例1

var btn = document.getElementById("btn1");
btn.addEventListener("click", function(event) {
    console.log("ボタンが押された");
});
```

このように書いておくと，ボタンが押されたらコンソールに"ボタンが押された"と表示します．
1 行目の document.getElementById は，第 1 パラメータで与えられた id の要素を取得する関数です．
2 行目の addEventListener は，btn で表される要素にイベント処理を追加する関数です．
この例では，クリックされた場合の処理を追加しています．

これまでに JavaScript のサンプルを見て何気なく使ってきた人がいるかもしれませんが，これも立派な無名関数です．
もう少し説明すると，コンソールに表示するという無名関数を定義して，addEventListener 関数の第 2 パラメータとして渡しています．
例によって，無名関数を変数に代入しておくと，以下の様な記述も可能です．

<button id="btn2">押してね</button>

```javascript runnable editable
// ボタンにアクションを定義する例2

var btn_func = function() {
    console.log("ボタンが押された");
};
var btn = document.getElementById("btn2");
btn.addEventListener("click", function(event) {
    btn_func();
});
```

## クラス定義

元々 JavaScript にはクラスという概念はありませんでした．
しかし，それでは不便だということで EcmaScript2015 からクラスの概念が導入されました．
（実は EcmaScript2015 の 1 つか 2 つ前の企画策定の段階でクラスの導入が叫ばれていたのですが，反対派によって握りつぶされたという苦い経緯が有ります）

クラスの書き方の例を示します．

```javascript once editable
// クラス定義の例

class foo {
    constructor(x) {
        this.x = x;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    incX() {
        this.x++;
    }
}

var f = new foo(5);
console.log(f.getX()); // => 5
f.incX();
console.log(f.getX()); // => 6
```

上記コードの文法を Java と比較すると，違う点がいくつか目立ちます．

1. コンストラクタが constructor である
2. インスタンス変数の宣言がない（this.x が初めて出てきた時点で作られる）
3. メソッドの返り値の型を指定しない（そもそも型を気にしない言語なので）

それ以外は，プライベートインスタンス変数が存在しないこと以外はだいたい同じように使えます．

### this とイベント処理とラムダ式

ここまで分かったら，クラスを作成して，ボタンがクリックされたら何か処理を行うようにしたくなりますよね？
ところがここで落とし穴があります．
もう少し細かく言うと，イベント処理に落とし穴があります．

クラスの中で以下のようにイベント処理を記述したとします．
クラス定義のサンプルから増えているのは 4,5 行目です．
ボタンが押されたら x を増やすという処理を付け加えたつもりです．

<button id="btn3">押してね</button>

```javascript runnable editable
// thisが想定外の挙動をする例
class foo {
    constructor(x) {
        this.x = x;
        var btn = document.getElementById("btn3");
        btn.addEventListener("click", function(event) {
            this.incX();
        });
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    incX() {
        this.x++;
    }
}
```

しかし，上記コードではクリック時にエラーが発生します．
解説すると，addEventListener 内では「this はイベントが発生したオブジェクト」を指します．
つまり，この例ではボタンです．
ボタンに incX という関数が定義されていることはないので，ここでエラーとなります．
なぜこのような作りになっているのかという経緯を説明すると長くなるのでカットします．

ここで以下のようにラムダ式を使うと想定通りの結果になります．
コンストラクタのみ書きます．

```javascript hl editable
  constructor( x ) {
    this.x = x;
    var btn = document.getElementById( 'btn1' );
    btn.addEventListener( 'click', ( event ) => { this.incX(); } );
  }
```

ラムダ式というのは，無名関数を完結に記述する文法と説明されることが多いのですが，JavaScript ではその意味が異なります．
まずはラムダ式の文法を見ていきましょう．

丸括弧内に受け取るパラメータ名を列挙します．
上記の例では 1 つですが，複数書くことも可能です．

次に「=>」を書きます．
一節によるとこの記号が λ に似ていると言われています．

続いて実行する処理を書きます．
上記の例では 1 行ですが，当然複数にまたがった処理を記述することも可能です．

文法の確認のため，以前の例をラムダ式を使って書いてみます．

```javascript runnable editable
var times_define = x => {
    return y => x * y;
};
var times = times_define(2);
console.log(times(5));
```

1 行目の中カッコ内でラムダ式（y => x _ y）によって定義された無名関数を返すという処理「return y => x _ y;」を書いています．
括弧がないのは省略形です．

そして，定義された処理を含むラムダ式を定義して，times_define に代入しています．

と言うわけで，無名関数の省略形として使うこともできるラムダ式です．
さて，無名関数とラムダ式で何が異なるかというと，「無名関数内の this は，無名関数が実行されるときに this である」のに対して「ラムダ式内の this は，ラムダ式が定義されているときの this である」ことが最大の違いです．
つまり，「this に関して苦労したくなければラムダ式を使え」ということになります．

ちょっとややこしく感じるかもしれませんが，そういうものだと思ってください．

## Canvas を使おう

あまり基礎ばかり説明しても嫌になってしまうので，基礎確認のための応用編に入ります．
ここでは，HTML5 で定められた描画のための要素である Canvas 要素を使って，お絵描きをします．

```html hl
<canvas id="canvas1" width="400" height="400"></canvas>
```

<canvas id="canvas1" width="400" height="400"></canvas>

```javascript runnable
// canvas要素の取得

var element = document.getElementById("canvas1");
var context = element.getContext("2d");
```

上記のように HTML 内で Canvas 要素を定義しておきます．
続いて，JavaScript の 1 行目のように要素を取得し，2 行目のようにグラフィックコンテキストを取得します．
グラフィックコンテキストとは，描画する対象を表すオブジェクトです．
以後，このグラフィックコンテキストに対して線を書くなどのメソッドを使用します．

### JavaScript の実行時にエラーが発生！？

上記をファイルにしたものを以下に示します．
これまで特に説明してきませんでしたが，JavaScript のプログラムは HTML の中に記述できます．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <script>
            var element = document.getElementById("canvas1");
            var context = element.getContext("2d");
        </script>
    </head>
    <body>
        <canvas id="canvas1" width="400" height="400"></canvas>
    </body>
</html>
```

<canvas id="canvas1" width="400" height="400"></canvas>

さて，Web ブラウザで上記ファイルを読み込むと・・・エラーが発生します．
何故かと言うと，このような書き方をすると，Web ブラウザ内で Canvas などの要素を配置する前にプログラムが実行されてしまい，「'canvas1'なんて無いよ！」とエラーになってしまいます．

そこで，ちょっと面倒ですが以下のように記述します．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <script>
            window.addEventListener("load", function() {
                var element = document.getElementById("canvas1");
                var context = element.getContext("2d");
            });
        </script>
    </head>
    <body>
        <canvas id="canvas1" width="400" height="400"></canvas>
    </body>
</html>
```

大きく違うのは 7 行目です．
この行は，window に対して，「このページン関する全ての準備が整ったら第 2 パラメータで与えられた関数を実行せよ」という意味を持ちます．

次に，実際に描画する処理を加えたソースを示します．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <script>
            window.addEventListener("load", function() {
                var element = document.getElementById("canvas1");
                var context = element.getContext("2d");
                element.addEventListener("click", ev => {
                    var rect = ev.target.getBoundingClientRect();
                    x = ev.clientX - rect.left;
                    y = ev.clientY - rect.top;
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(x + 1, y + 1);
                    context.stroke();
                });
            });
        </script>
    </head>
    <body>
        <canvas id="canvas1" width="400" height="400"></canvas>
    </body>
</html>
```

基本的には Canvas 要素に対してクリックのイベントを付けてあげて，そのイベント処理の中で座標を取得して点を打っています．

Canvas に描画するメソッドを以下に示します．

| メソッド  | 意味               |
| :-------- | :----------------- |
| beginPath | 描画開始           |
| moveTo    | 描画開始座標を設定 |
| lineTo    | 線を描画           |
| stroke    | 実際に描画         |

## クラス化

さて，上記ソースはお世辞にも見やすいとは言えません．
見やすくするためにやることは 2 つあります．

1. JavaScript を HTML とは別ファイルにする
2. プログラムの見通しを良くするためにクラス化する

と言うことで，まずは 1 からやってみましょう．

### まずは JS を別ファイルに

HTML ファイルから外部 JavaScript を読み込むためには以下の 6 行目のように書きます．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <script src="test1.js"></script>
    </head>
    <body>
        <canvas id="canvas1" width="400" height="400"></canvas>
    </body>
</html>
```

これにより，HTML は文書構造のみを記述でき，何が書かれているか分かりやすくなりました．
このように，JavaScript や CSS などは外部ファイルとして書きましょう．

### クラス化してみる

次にプログラム本体に手を入れ，クラス化します．
クラス名は Drawing にしておきます．
メソッドはコンストラクタ，イベントの設定（set_event），点描画（drawPoint）の 3 つです．
クラス化したことに伴い，このように処理を細分化することで，メンテナンスや再利用が容易になります．

```javascript hl
class Drawing {
    constructor(element) {
        this.element = element;
        this.context = element.getContext("2d");
    }
    set_event() {
        this.element.addEventListener("click", ev => {
            var rect = ev.target.getBoundingClientRect();
            var x = ev.clientX - rect.left;
            var y = ev.clientY - rect.top;
            drawPoint(x, y);
        });
    }
    drawPoint(x, y) {
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x + 1, y + 1);
        this.context.stroke();
    }
}

window.addEventListener("load", () => {
    var element = document.getElementById("canvas1");
    var draw = new Drawing(element);
    draw.set_event();
});
```

## あとがき

Web ブラウザ上で実行できるので，誰もが開発環境を揃えられるという点は JavaScript の利点です．
その割にあまり学習用に使われていないのは，クラス指向ではなかったことや文法が曖昧であるためだと思います．
しかし，EcmaScript2015 になってクラスやラムダ式が導入されたので，今後はどんどん使われていくと思います．
