---
title: 波形を可視化する
layout: src/templates/layout.pug
---

# 波形を可視化する

## はじめに

WebAudioAPI の持つ，アナライザーノードを利用して，信号の波形とスペクトルをグラフとして出力します．

## アナライザーノードの使い方

まずは，前章で鳴らした和音を可視化してみましょう．以下を順番に実行してみてください．

```javascript once editable
// コンテクストの初期化
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
```

描画する要素を変数 g1 と g2 にセットします．描画領域は，このページの一番下にあります．

```javascript once editable
// 描画のための準備
var g1 = document.getElementById("time1").getContext("2d");
var g2 = document.getElementById("freq1").getContext("2d");
```

上のプログラムを実行したら，囲み内を実行してください．囲み内は何度でも実行可能です．

<div class="group01">

オシレータノードとゲインノードの初期化，および周波数と振幅の設定を行います．

```javascript runnable editable
var osc1 = audioCtx.createOscillator();
var osc2 = audioCtx.createOscillator();
var osc3 = audioCtx.createOscillator();

var gainNode = audioCtx.createGain();
gainNode.gain.value = 0.3;

osc1.frequency.value = 440 * Math.pow(2, -9 / 12); // ド：約261.6Hz
osc2.frequency.value = 440 * Math.pow(2, -5 / 12); // ミ：約329.6Hz
osc3.frequency.value = 440 * Math.pow(2, -2 / 12); // ソ：約392.0Hz
osc1.connect(gainNode);
osc2.connect(gainNode);
osc3.connect(gainNode);
gainNode.connect(audioCtx.destination);
```

アナライザーノードを初期化し，FFT を行うサンプル数を設定します．その後，ゲインノード → アナライザーノードを接続します．

```javascript runnable editable
// アナライザーノードの初期化
var analyserNode = audioCtx.createAnalyser();
analyserNode.fftSize = 1024; // FFTを行うサンプル数
gainNode.connect(analyserNode);
```

音を鳴らします．

```javascript runnable editable
// 再生開始
osc1.start();
osc2.start();
osc3.start();
```

音が出ている状態で以下のプログラムを実行すると，グラフが描画されます．この部分は何度でも実行可能です．

```javascript runnable editable
// 時間領域のグラフを描画します．
var timeData = new Uint8Array(1024);

// getByteTimeDomainDataで時間領域のデータを取得
analyserNode.getByteTimeDomainData(timeData);

// CanvasはbeginPath〜strokeの間に描画命令を入れる
// 軸の描画
g1.beginPath();
g1.moveTo(0, 128);
g1.lineTo(512, 128);
g1.moveTo(10, 0);
g1.lineTo(10, 256);
g1.stroke();

// グラフ描画
g1.beginPath();
g1.strokeStyle = "rgb( 100, 10, 10 )";
g1.moveTo(10, 100);
for (var i = 0; i < 1024; i++) {
    g1.lineTo(i / 2 + 10, 256 - timeData[i]);
}
g1.stroke();

// 周波数領域のグラフを描画します．
var freqData = new Uint8Array(512);

// getByteFrequencyDataで周波数領域のデータを取得
analyserNode.getByteFrequencyData(freqData);
g2.beginPath();
g2.moveTo(0, 256);
g2.lineTo(512, 256);
g2.moveTo(10, 0);
g2.lineTo(10, 256);
g2.stroke();

g2.beginPath();
g2.strokeStyle = "rgb( 100, 10, 10 )";
for (var i = 0; i < 51; i++) {
    g2.moveTo(i * 10 + 10, 256);
    g2.lineTo(i * 10 + 10, 256 - freqData[i] / 2.0);
}
g2.stroke();
```

グラフ領域をクリアする場合はこちらを実行してください．

```javascript runnable editable
g1.clearRect(0, 0, 512, 256);
g2.clearRect(0, 0, 512, 266);
```

音を止めます．

```javascript runnable editable
osc1.stop();
osc2.stop();
osc3.stop();
```

</div>
時間領域
<canvas id="time1" width="512" height="256" class="graph01"></canvas>

周波数領域
<canvas id="freq1" width="512" height="266" class="graph02"></canvas>

グラフ領域のクリアとグラフ描画を繰り返し実行することで，スペクトラムアナライザを作ることができます．

</div>
