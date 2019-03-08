---
title: 鍵盤を増やす
layout: src/templates/layout.pug
---

# 鍵盤を増やす処理を楽にする

## はじめに

このページでは，[audio-activity01](./audio-activity01.html)で示した例を基に，鍵盤の数を増やすことを行います．具体的には，要素内に音程のパラメータを格納し，プログラムではループとイベント処理の設定のみをおｋなうようにします．また，実際に`.htmlファイル`と`.jsファイル`を作成して，単独のページを作る手順を説明します．目指すのは，ピアノの鍵盤を画面に表示して，クリックによって音を鳴らすことです．

## 基本方針

audio-activity01 では，各鍵盤の要素を次のように定義していました．

```html hl
<button id="code_c">ド</button>
```

音程については，プログラム中で指定したので，鍵盤毎に音程を設定するためには鍵盤の数だけ似たようなプログラムが並ぶという構造でした．そこで，鍵盤の要素を次のように定義することにして，そこから音程のパラメータを得るようにします．これにより，プログラムから音階を競ってする部分を削れることになり，最終的にループで表現できるようになります．

具体的な鍵盤の要素の定義は次にようになります．アトリビュート`freq`は音階を表すパラメータです．

```html hl
<button class="code" freq="-9">ド</button>
```

<button class="code" freq="-9">ド</button>

このように，ボタン側に音階のパラメータを持たせ，プログラムから freq の値を取得しましょう．そのためのコードは以下のようになります．

```javascript runnable editable console
var buttons = document.querySelectorAll(".code");
var elm = buttons[0];
var frequency = elm.attributes["freq"].value; // 音階のパラメータ取得
console.log(frequency);
```

音階のパラメータを取得できるようになったので，イベント処理はこの値を使って以下のようにループで表現できます．後は鍵盤の定義を必要な数だけ並べれば良いことになります．

```javascript hl
// ボタンに対するイベント記述

var buttons = document.querySelectorAll(".code");
for (var elm of buttons) {
    let freq = elm.getAttributeNode("freq").value; // 音階のパラメータ取得
    elm.addEventListener("click", function(event) {
        new Osc(440 * Math.pow(freq / 12), 1000).play();
    });
}
```

## 実際にファイルを作ってみよう

前節の内容から作成した HTML5 に準拠した HTML ファイルを以下に示します．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>鍵盤もどき</title>
        <script src="keyboard2.js"></script>
    </head>
    <body>
        <button class="code" freq="-9">ド</button>
        <button class="code" freq="-7">レ</button>
        <button class="code" freq="-5">ミ</button>
    </body>
</html>
```

後は script タグで指定している`keyboard2.js`に，クラスの宣言と前節のプログラムを入れれば動作します．

```javascript once editable
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

console.log("start");

window.addEventListener("load", function() {
    var buttons = document.querySelectorAll(".code");
    console.log(buttons);
    for (var elm of buttons) {
        let freq = elm.getAttributeNode("freq").value;
        elm.addEventListener("click", function(event) {
            new Osc(440.0 * Math.pow(2, freq / 12.0), 1000).play();
        });
    }
});
```

ドレミがきちんと動作したら，HTML ファイルにボタンの定義を増やしてみましょう．

また，別のやり方としてプログラムでボタンを追加していくことも可能です．これまでの内容を組み合わせて挑戦してみてください．
