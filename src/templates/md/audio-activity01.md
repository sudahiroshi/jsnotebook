---
title: 鍵盤のひな形を作る
layout: src/templates/layout.pug
---

# 鍵盤のひな形を作る

## はじめに

このページでは，実際に`.htmlファイル`と`.jsファイル`を作成して，単独のページを作る手順を説明します．目指すのは，ピアノの鍵盤を画面に表示して，クリックによって音を鳴らすことです．

## ボタンにアクションを定義する

まずは，ボタンがクリックされたら何か処理をするプログラムを書いてみましょう．まずは以下のように HTML でボタンが定義されているものとします．

```html hl
<button id="button1">クリックしてね</button>
```

次に，ボタンがクリックされた場合に処理を行うプログラムの例を示します．JavaScript では「○○ されたら〜〜する」というプログラムを書く際，`addEventListener`を使用します．

書式は，「要素.addEventListener( イベント名, やること )」です．要素とは，HTML 内にあるオブジェクトのことで，ここでは「button1」という id を持つオブジェクトを`document.getElementById`で取得しています．ID 以外にもタグ名やクラス名で取得することも可能ですが，処理が煩雑になるので ID で取得するものとします．

イベント名には「click」を指定しています．他にも「マウスが要素に乗った or 離れた」や「マウスのボタンが押下された」などのイベントを使うことができます．旧来の書き方で`onClick`を使う方法もありますが，この方法では複数のイベントを登録できないため現在は`addEventListener`を使う方法が主流です．

「やること」は setTimeout と同様，function を定義して与えます．このような関数は一般的に無名関数と呼ばれています．以下のプログラムでは，単純にコンソールに表示をしています．

<button id="button1">クリックしてね</button>

```javascript once editable console
// 先にこの枠内のプログラムを実行し，その後上にあるボタンをクリックしてください．
var btn = document.getElementById("button1"); // IDがbutton1の要素を取得し変数btnに入れる
btn.addEventListener("click", function(event) {
    // btnにアクションを記述する
    console.log("ボタンがクリックされた"); // 表示
});
```

## ボタンがクリックされたら音を鳴らす

前節では単純に表示をするのみでしたが，もっと複雑なプログラムを実行することも可能です．例えば音を鳴らしたい場合，無名関数内で音を鳴らすプログラムを記述すれば良いです．ただし，WebAudioAPI の制限で AudioContext オブジェクトの生成回数が制限されているため，この部分は最初に 1 回だけ実行する（＝ボタンのアクション内には書かない）ようにします．

```html hl
<button id="button2">音を鳴らします</button>
```

<button id="button2">音を鳴らします</button>

```javascript once editable
// 先のこの枠内のプログラムを実行し，その後上にあるボタンをクリックしてください．
// コンテクストの初期化
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();

var btn = document.getElementById("button2"); // IDがbutton2の要素を取得し変数btnに入れる
btn.addEventListener("click", function(event) {
    // btnにアクションを記述する

    // 単純なSin波を鳴らす例
    var oscNode = audioCtx.createOscillator();
    oscNode.connect(audioCtx.destination);
    oscNode.start();
    setTimeout(function() {
        oscNode.stop();
    }, 1000);
});
```

この例では単純な Sin 波を鳴らすのみですが，音色や音量を変えたり，三角波にするなど自由に改変できます．

## 3 つのキー（ドレミ）を作る

多くのキーを持つ鍵盤を作る前に，まずは 3 つのキーを持つ鍵盤（といっても単なるボタンの並び）を作ってみましょう．ここで問題となるのが，アクションのプログラムで，ボタン毎に異なる周波数を設定する必要があります．コピー＆ペーストでほぼ同じコードを並べるのは美しくないですし，キーが増えた場合に破綻するので，処理の部分をクラス化しましょう．

作成したクラスの例を以下に示します．JavaScript ではコンストラクタは`constructor`という名前のメソッドです．コンストラクタ内で使用している変数`this.freq`と`this.time`は，他の言語で言うインスタンス変数（メンバー変数）です．

HTML 上では，以下のように 3 つのボタンが有ることを想定します．

```html hl
<button id="code_c">ド</button>
<button id="code_d">レ</button>
<button id="code_e">ミ</button>
```

まだボタンをクリックしても何も起きません．下のプログラムを実行後にクリックしてください．

<button id="code_c">ド</button>
<button id="code_d">レ</button>
<button id="code_e">ミ</button>

```javascript once editable
// 先のこの枠内のプログラムを実行し，その後上にあるボタンをクリックしてください．

// コンテクストの初期化
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();

// クラスOscの定義
class Osc {
    // コンストラクタ
    constructor(freq, time) {
        this.freq = freq; // 周波数
        this.time = time; // 鳴る時間
    }

    // 実際に音を作り鳴らすメソッド
    play() {
        // 単純なSin波を鳴らす例
        var oscNode = audioCtx.createOscillator();
        oscNode.frequency.value = this.freq; // 周波数の設定
        oscNode.connect(audioCtx.destination);
        oscNode.start();
        setTimeout(function() {
            oscNode.stop();
        }, this.time);
    }
}

var code_c = document.getElementById("code_c");
code_c.addEventListener("click", function(event) {
    new Osc(440 * Math.pow(2, -9 / 12), 1000).play();
});

var code_d = document.getElementById("code_d");
code_d.addEventListener("click", function(event) {
    new Osc(440 * Math.pow(2, -7 / 12), 1000).play();
});

var code_e = document.getElementById("code_e");
code_e.addEventListener("click", function(event) {
    new Osc(440 * Math.pow(2, -5 / 12), 1000).play();
});
```

## 実際にファイルを作ってみよう

前節の内容から作成した HTML5 に準拠した HTML ファイルを以下に示します．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>鍵盤もどき</title>
        <script src="keyboard.js"></script>
    </head>
    <body>
        <button id="code_c">ド</button> <button id="code_d">レ</button>
        <button id="code_e">ミ</button>
    </body>
</html>
```

後は script タグで指定している`keyboard.js`に前節のプログラムを入れれば動きそうな気もしますが，ここでもう 1 つ落とし穴が存在し，エラーが発生します．何故かと言うと，単純に JavaScript を記述すると，Web ブラウザ内で button などの要素を配置する前にプログラムが実行されてしまい，「'code_c'なんて無いよ！」とエラーになってしまいます．

それを避けるために，HTML 内の要素を参照する部分を「ページがロードされたら」というイベントのアクションに記述します．文法的には以下のように記述します．

```javascript hl
// 要素に関係ないプログラムを書く部分

// 要素に関係するプログラムを書く部分
window.addEventListener("load", function() {});
```

よって，鍵盤のプログラムは以下のようになります．コンテクストの初期化やクラス定義は要素に関係ないので`load`イベントの外に書いています．書式的にはこれらの処理を`load`イベント内に書いても正常に動作しますが，あとで読みづらく鳴るので外に出しています．

実際に，HTML ファイルと JS ファイルをテキストエディタで作成して，Web ブラウザで表示させてみてください．

```javascript hl
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();

// クラスOscの定義
class Osc {
    // コンストラクタ
    constructor(freq, time) {
        this.freq = freq; // 周波数
        this.time = time; // 鳴る時間
    }

    // 実際に音を作り鳴らすメソッド
    play() {
        // 単純なSin波を鳴らす例
        var oscNode = audioCtx.createOscillator();
        oscNode.frequency.value = this.freq; // 周波数の設定
        oscNode.connect(audioCtx.destination);
        oscNode.start();
        setTimeout(function() {
            oscNode.stop();
        }, this.time);
    }
} // ここまでOscクラス

// ここからloadイベント
window.addEventListener("load", function() {
    var code_c = document.getElementById("code_c");
    code_c.addEventListener("click", function(event) {
        new Osc(440 * Math.pow(2, -9 / 12), 1000).play();
    });

    var code_d = document.getElementById("code_d");
    code_d.addEventListener("click", function(event) {
        new Osc(440 * Math.pow(2, -7 / 12), 1000).play();
    });

    var code_e = document.getElementById("code_e");
    code_e.addEventListener("click", function(event) {
        new Osc(440 * Math.pow(2, -5 / 12), 1000).play();
    });
});
```
