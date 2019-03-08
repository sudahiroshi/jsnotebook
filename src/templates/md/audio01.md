---
title: 音を鳴らす
layout: src/templates/layout.pug
---

# WebAudio を使って音を鳴らす

## はじめに

この文書は，WebAudioAPI の簡単な introduction です．

## 音を鳴らす最低限のプログラム

あれこれ言う前に，まずは音を鳴らしてみましょう．パソコンの音量を下げ気味にして，以下のコードの下にある Run ボタンをクリックしてください．PC と Web ブラウザが対応していれば 1 秒間音が鳴ります．

注意点として，Web ブラウザによって AudioContext の初期化回数が制限されていることです．つまり，以下のコードを何回も実行するとエラーで止まります．

```javascript runnable editable
// 音を出す
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
var oscNode = audioCtx.createOscillator();
oscNode.connect(audioCtx.destination);
oscNode.type = "sine";
oscNode.frequency.setValueAtTime(220, audioCtx.currentTime);
oscNode.start();
setTimeout(function() {
    oscNode.stop();
}, 1000);
```

## 基本的な文法

それでは順番にソースコードを見ながら実行していきましょう．ソースコードの下にある Once や Run ボタンを押すと実行できます．なお，Run ボタンは何回でも実行できる箇所で，Once ボタンは 1 回のみ実行できる箇所です．

WebAudioAPI を使用して音を鳴らすためには，まず AudioContext を作成します．コンテキストとは，元々**文脈**という意味を持っていますが，プログラム用語では**状況によって異なる動作を行うもの**が転じて**制御するための情報**という意味を持ちます．

この AudioContext ですが，Web ブラウザによって名称が若干異なります．元々は Web ブラウザごとに暫定的な仕様に基いて実装されていた際の名残で，将来的に統一されると思われます．現在では，通常の Web ブラウザでは「AudioContext」が用いられ，iOS では「webkitAudioContext」が用いられています．その違いを吸収するコードが 1 行目で，どちらか実装されている方を AudioContext とする方法です．また，window という単語は，グローバル変数を表します．

以下を実行すると，作成されたコンテキストを表示しています．

```javascript once editable console
// WebAudioの初期化
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();

console.log(audioCtx);
```

次にオシレータ（発振回路）を初期化し,変数 oscNode に代入します．ノードとは,WebAudioAPI で使用される，機能を持った部品のことです．WebAudioAPI では音源としてオシレータや配列の内容（サンプリングした波形や合成した波形）を使用できます．

```javascript once editable console
// オシレータの初期化
var oscNode = audioCtx.createOscillator();

console.log(oscNode);
```

続いて，オシレータを出力先（destination）に接続します．ハードウェアを配線することをイメージしてください．

```javascript once editable console
oscNode.connect(audioCtx.destination);
console.log(oscNode);
```

オシレータの発振を開始すると音が鳴ります．

```javascript runnable editable
oscNode.start();
```

放っておくとずっと音が鳴ります．以下のようにしてオシレータを止めましょう．

```javascript runnable editable
oscNode.stop();
```

最初に示したソースコードでは，1 秒後にオシレータの発振を止めるようにしていました．その部分を抜き出すと以下のようになります．

```javascript hl
setTimeout(function() {
    oscNode.stop();
}, 1000);
```

ここで`setTimeout`の文法は，`setTimeout( 関数, 時間 );`となっており，第 2 パラメータで指定された時間経過後に，第 1 パラメータで指定された関数を実行します．第 1 パラメータは，直接関数名を指定するか，`function`で定義した関数を与えることができます．

## sin 波以外の波形の取り扱い

オシレータノードは sin 波以外に矩形波や三角波，ノコギリ波などの波形を扱うことも可能です．オシレータノードは内部的に`type`というパラメータを持っているので，この値を変更することで矩形波などを鳴らすことができます．

| type     | 波形       |
| -------- | ---------- |
| sine     | 正弦波     |
| square   | 矩形波     |
| triangle | 三角波     |
| sawtooth | ノコギリ波 |

```javascript runnable editable
// コメントの位置を変えることで矩形波，三角波，ノコギリ波を鳴らす
var audioCtx = new AudioContext();
var oscNode = audioCtx.createOscillator();
oscNode.connect(audioCtx.destination);
oscNode.type = "square"; // 矩形波
// oscNode.type = "triangle"; // 三角波
// oscNode.type = "sawtooth"; // ノコギリ波
oscNode.start();
setTimeout(function() {
    oscNode.stop();
}, 2000);
```

## 音量を変更するプログラム

WebAudioAPI では，音に様々な加工を施すことができます．まずは**音量を変更する**加工を施してみましょう．以下の例では，音を鳴らし始めて 1 秒後に音量を 1/2 にして，さらに 1 秒後に音を止めます．

```javascript runnable editable
// Max音量：1秒間，1/2音量：1秒間
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
var oscNode = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();
oscNode.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscNode.start();

setTimeout(function() {
    gainNode.gain.value = 0.5;
}, 1000);
setTimeout(function() {
    oscNode.stop();
}, 2000);
```

## 音量を変更する方法

音量を変更するためには，ゲインノードを使用します．WebAudio の各ノードは，ソースノードを除いて接続できます．ここでは，オシレータノード → ゲインノード → 出力という順で接続していきます．

それではプログラムを見ていきましょう．まずはコンテキスト，オシレータノード，ゲインノードを初期化します．ゲインノードは gainNode という変数に格納しています．

```javascript runnable editable
// コンテクスト，オシレータノード，ゲインノードの初期化
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
var oscNode = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();
```

続いて，各ノードを接続していきます．

```javascript runnable editable
// オシレータノード　→　ゲインノード　→　出力
oscNode.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscNode.start();
```

音量を変更したい所で，ゲインノードの持つパラメータ**gain**の**value**を変更します．ここでは 0.5 にしています．

```javascript runnable editable
// 音量を1/2に
gainNode.gain.value = 0.5;
```

放っておくとずっと音が鳴ります．以下のようにしてオシレータを止めましょう．

```javascript runnable editable
oscNode.stop();
```
