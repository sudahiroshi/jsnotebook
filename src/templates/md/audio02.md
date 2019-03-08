---
title: 和音を作る
layout: src/templates/layout.pug
---

# WebAudio で和音を作る

## はじめに

WebAudioAPI の持つ sin 波を使って，様々な音を合成してみましょう．

## 和音を鳴らそう

和音を鳴らすためには，オシレータノードを複数作成し，それぞれに異なる周波数を設定して鳴らします．簡単なサンプルを以下に示します．このサンプルでは，ド・ミ・ソの和音を 2 秒間鳴らします．

※ここでは 12 平均律を採用しています．細かく調整したい方は周波数を微調整してください．

```javascript runnable editable
// オシレータを3つ作ってドミソの和音を鳴らす

window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
var osc1 = audioCtx.createOscillator();
var osc2 = audioCtx.createOscillator();
var osc3 = audioCtx.createOscillator();
osc1.frequency.value = 440 * Math.pow(2, -9 / 12); // ド：約261.6Hz
osc2.frequency.value = 440 * Math.pow(2, -5 / 12); // ミ：約329.6Hz
osc3.frequency.value = 440 * Math.pow(2, -2 / 12); // ソ：約392.0Hz
osc1.connect(audioCtx.destination);
osc2.connect(audioCtx.destination);
osc3.connect(audioCtx.destination);

osc1.start();
osc2.start();
osc3.start();
setTimeout(function() {
    osc1.stop();
    osc2.stop();
    osc3.stop();
}, 2000);
```

それではプログラムを分割していきます．

<div class="group01">

まずはコンテクスト，オシレータノード 3 個を初期化します．

```javascript runnable editable
// コンテクストとオシレータノード3個の初期化

window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
var osc1 = audioCtx.createOscillator();
var osc2 = audioCtx.createOscillator();
var osc3 = audioCtx.createOscillator();
```

次に，各オシレータにそれぞれ異なる周波数を設定します．周波数の設定は，オシレータの持つ frequency という変数の値を変更します．

```javascript runnable editable console
// f = 440 * 2^(d/12)で計算しています
osc1.frequency.value = 440 * Math.pow(2, -9 / 12); // ド：約261.6Hz
console.log(osc1.frequency.value + "Hz");
osc2.frequency.value = 440 * Math.pow(2, -5 / 12); // ミ：約329.6Hz
console.log(osc2.frequency.value + "Hz");
osc3.frequency.value = 440 * Math.pow(2, -2 / 12); // ソ：約392.0Hz
console.log(osc3.frequency.value + "Hz");
```

続いてオシレータノードを出力先に接続します．

```javascript runnable editable
osc1.connect(audioCtx.destination);
osc2.connect(audioCtx.destination);
osc3.connect(audioCtx.destination);
```

鳴らします．

```javascript runnable editable
osc1.start();
osc2.start();
osc3.start();
```

放っておくとずっと音が鳴ります．以下のようにして止めましょう．

```javascript runnable editable
osc1.stop();
osc2.stop();
osc3.stop();
```

</div>

## 矩形波を合成する

オシレータノードをゲインノードに接続して音量を調整することも可能です．また，各オシレータノードを別々のゲインノードに接続すれば，周波数ごとの音量を調整可能です．つまり，矩形波や三角波を合成することも簡単に行なえます．

矩形波を合成するためには，「f(m) = 1/m sin( mπ )：ただし m=2n+1 とする」を計算し，足し合わせれば良いです．それをプログラムにしたものを以下に示します．そこで，オシレータノードとゲインノードを配列 osc と amp に格納します．

```javascript runnable editable
// 矩形波を合成する

var audioCtx = new AudioContext();
var number = 20; // 20個の周波数について計算する
var osc = new Array(number); // 20個分のオシレータノード
var amp = new Array(number); // 20個分のゲインノード
for (var i = 0; i < number; i++) {
    osc[i] = audioCtx.createOscillator(); // オシレータノードの初期化
    amp[i] = audioCtx.createGain(); // ゲインノードの初期化

    // オシレータノード20個　→　ゲインノード20個　→　出力先
    osc[i].connect(amp[i]);
    amp[i].connect(audioCtx.destination);
}

// 周波数と振幅を調整して矩形波にする
for (var i = 0; i < number; i++) {
    var j = i * 2 + 1; // 周波数と振幅のためのパラメータ
    osc[i].frequency.value = 440 * j; // 周波数
    amp[i].gain.value = 1.0 / j; // 振幅
}

for (var i = 0; i < number; i++) {
    osc[i].start();
}

setTimeout(function() {
    for (var i = 0; i < number; i++) {
        osc[i].stop();
    }
}, 2000);
```

それでは分割してみていきます．

<div class="group01">

まずはコンテクストとオシレータノード，ゲインノードの初期化です．続けて，オシレータノード → ゲインノード → 出力先の接続を行います．

20 個分の周波数を合成するため，配列を使用しています．JavaScript では，配列の宣言に new Array( 要素数)を使用します．

```javascript runnable editable
// 矩形波を合成する

window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
var number = 20; // 20個の周波数について計算する
var osc = new Array(number); // 20個分のオシレータノード
var amp = new Array(number); // 20個分のゲインノード
for (var i = 0; i < number; i++) {
    osc[i] = audioCtx.createOscillator(); // オシレータノードの初期化
    amp[i] = audioCtx.createGain(); // ゲインノードの初期化

    // オシレータノード20個　→　ゲインノード20個　→　出力先
    osc[i].connect(amp[i]);
    amp[i].connect(audioCtx.destination);
}
```

続いて f(m) = 1/m sin( mπ )：ただし m=2n+1 とする」を順次計算します．具体的には周波数と振幅を設定します．

```javascript runnable editable
// 周波数と振幅を調整して矩形波にする

for (var i = 0; i < number; i++) {
    var j = i * 2 + 1; // 周波数と振幅のためのパラメータ
    osc[i].frequency.value = 440 * j; // 周波数
    amp[i].gain.value = 1.0 / j; // 振幅
}
```

再生します．

```javascript runnable editable
for (var i = 0; i < number; i++) {
    osc[i].start();
}
```

止めます．

```javascritp runnable editable
for( var i=0; i< number; i++ ) { osc[i].stop(); }
```

</div>

## 楽器音を合成する

楽器音を構成するスペクトルは一般的に複雑ですが，おおよその音色で良ければ単純なスペクトルで表すことが可能です．ここでは，以下の 4 つの楽器音（に近い音）を合成してみましょう．

| 楽器         | 特徴                             |
| ------------ | -------------------------------- |
| バイオリン   | 高い周波数成分まで含まれる       |
| フルート     | 低めの周波数成分のみで構成される |
| クラリネット | 奇数倍音で構成される             |
| ピアノ       | 偶数倍音で構成される             |

```javascript once editable
// ここは1回だけ実行してください
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
```

次に，合成音を作成します．下の枠内は，上から順に実行してください．何度も実行して音の違いを確認してください．

<div class = "group01">

基準となる音を合成します．

```javascript runnable editable
// 事前準備
var number = 20; // 20個の周波数について計算する
var osc = new Array(number); // 20個分のオシレータノード
var amp = new Array(number); // 20個分のゲインノード
for (var i = 1; i < number; i++) {
    osc[i] = audioCtx.createOscillator(); // オシレータノードの初期化
    amp[i] = audioCtx.createGain(); // ゲインノードの初期化
    osc[i].frequency.value = 440 * i; // 周波数
    amp[i].gain.value = 1.0 / i; // 振幅

    // オシレータノード20個　→　ゲインノード20個　→　出力先
    osc[i].connect(amp[i]);
    amp[i].connect(audioCtx.destination);
}
```

下の枠内は，どれか 1 つだけ実行してください．for 文のパラメータを変更することでそれぞれの楽器に必要な周波数のみを残しています．

または 1 つも実行しなければバイオリンの音になります．

<div class = "group02">
```javascript runnable editable
// 偶数成分をカット：クラリネットのような音色
for( var i=2; i< number; i+=2 ) {
  amp[i].gain.value = 0;
}
```

```javascript runnable editable
// 奇数成分をカット：ピアノのような音色
for (var i = 3; i < number; i += 2) {
    amp[i].gain.value = 0;
}
```

```javascript runnable editable
// 高周波数成分をカット：フルートのような音色
for (var i = 6; i < number; i++) {
    amp[i].gain.value = 0;
}
```

</div>

音を鳴らします．

```javascript runnable editable
for (var i = 1; i < number; i++) {
    osc[i].start();
}
```

止めます．

```javascript runnable editable
for (var i = 1; i < number; i++) {
    osc[i].stop();
}
```

</div>
