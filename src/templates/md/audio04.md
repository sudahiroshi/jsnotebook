---
title: 音を加工する
layout: src/templates/layout.pug
---

# 音を加工する

## はじめに

アナログシンセサイザーや FM 音源の仕組みを簡単に説明し，実際に音を合成します．まずは以下のプログラムを実行して，AudioContext の初期化を行ってから，以降のプログラムを実行してください．

このページで使われている単語の一覧を示します．

| 単語         | フルスペル                   | 意味                               |
| ------------ | ---------------------------- | ---------------------------------- |
| オシレータ   | Oscilator                    | 発振器                             |
| オペレータ   | Operator                     | 発振器の FM 音源用語               |
| LFO          | Low Frequency Oscilator      | 低周波発振器                       |
| VCO          | Voltage Controlled Oscilator | 発振器のアナログシンセサイザー用語 |
| VCF          | Voltage Controlled Filter    | フィルター回路                     |
| VCA          | Voltage Controlled Amplifier | 音量調整回路                       |
| EG           | Envelope Generator           | 振幅を時間変化させる回路           |
| キャリア     | Carrier                      | FM 音源における発振器              |
| モジュレータ | Modulator                    | キャリアの周波数を変化させる発振器 |

```javascript once editable
// はじめに1回だけ実行してください
window.AudioContext = window.webkitAudioContext || window.AudioContext;
var audioCtx = new AudioContext();
```

## ビブラートを作る

オシレータノードの出力を，別のオシレータノードの周波数として入力することが可能です．この機能を使い，1 つ目のオシレータから数 Hz の周波数を発生させることで，ビブラートを作ることが可能です．

そのために，オシレータを以下の図のように接続します．図中の`lfo`と`vco1`がオシレータで，lfo により 2Hz で発信している信号を，vco1 の周波数入力として扱います．

<img src="./img/audio04-01.png" width="80%" />

これをプログラムで書くと以下のように鳴ります．

```javascript sandbox editable
// オシレータを2つ作ってビブラートを再現する

// LFO関係
var lfo = audioCtx.createOscillator();
lfo.frequency.value = 2;

var gainLfo = audioCtx.createGain();
gainLfo.gain.value = 1;

// VCO1関係
var vco1 = audioCtx.createOscillator();
vco1.frequency.value = 440;
vco1.type = "sawtooth";

var gainVco1 = audioCtx.createGain();
gainVco1.gain.value = 0.3;

// 接続
lfo.connect(gainLfo);
gainLfo.connect(vco1.frequency);
vco1.connect(gainVco1);
gainVco1.connect(audioCtx.destination);

// 音を出す
lfo.start();
vco1.start();

// 音を止める
setTimeout(function() {
    lfo.stop();
    vco1.stop();
}, 3000);
```

## FM 音源の元を再現

FM 音源とは，ビブラートを作るための 1 つ目のオシレータの周波数を，誤って高い周波数にしたことから生まれたと言われ，80〜90 年台のパソコンやシンセサイザー，2000 年前後の携帯電話でおなじみの方式です．

FM 音源では，通常 2〜4 個のオシレータ（FM 音源の世界ではオペレータと呼ばれる）を接続して音を作ります．ここでは以下のように 2 つのオペレータを直列に繋ぎ，lfo の周波数を 1320Hz，log のゲインを 1500 としています．これを vco1 の周波数入力に繋いで音を作っています．

<img src="./img/audio04-02.png" width="80%" />

以下のプログラムを実行してみてください．その後，lfo の周波数や gainLfo のゲインを変更して実行してください．

```javascript sandbox editable
// オシレータを2つ作ってLFOの周波数を上げるとFM音源の元になる

// LFO関係（注：Modulatorと呼ばれている）
var lfo = audioCtx.createOscillator();
lfo.frequency.value = 1320;

var gainLfo = audioCtx.createGain();
gainLfo.gain.value = 1500;

// VCO1関係（注：Carrierと呼ばれている）
var vco1 = audioCtx.createOscillator();
vco1.frequency.value = 440;
vco1.type = "sine";

var gainVco1 = audioCtx.createGain();
gainVco1.gain.value = 0.9;

// 接続
lfo.connect(gainLfo);
gainLfo.connect(vco1.frequency);
vco1.connect(gainVco1);
gainVco1.connect(audioCtx.destination);

// 音を出す
lfo.start();
vco1.start();

// 音を止める
setTimeout(function() {
    lfo.stop();
    vco1.stop();
}, 3000);
```

## Feedback を持つ FM 音源

オペレータを 2 つ重ねることで，高周波数成分を持つ波形を合成できますが，別のやり方としてあるオペレータの出力を同オペレータの周波数入力につなげることで複雑な波形を作り出すことが可能です．以下のプログラムで行っています．

実際には，以下の図のように，lfo で 880Hz の周波数を作り，gainFeedback を通じて lfo の周波数入力に接続しています．lfo の出力は gainLfo で増幅され，vco1 の周波数入力に繋いでいます．

<img src="./img/audio04-03.png" width="80%" />

以下のプログラムを実行してみてください．その後，lfo の周波数や gainFeedback と gainLfo のゲインを変更して実行してください．

```javascript sandbox editable
// オシレータを2つ作ってLFOの周波数を上げるとFM音源の元になる

// LFO関係（注：FM音源ではModulatorと呼ばれている）
var lfo = audioCtx.createOscillator();
lfo.frequency.value = 440 * 2;

var gainLfo = audioCtx.createGain();
gainLfo.gain.value = 800;

// Feedback関係
var gainFb = audioCtx.createGain();
gainFb.gain.value = 200;

// VCO1関係（注：FM音源ではCarrierと呼ばれている）
var vco1 = audioCtx.createOscillator();
vco1.frequency.value = 440;
vco1.type = "sine";

var gainVco1 = audioCtx.createGain();
gainVco1.gain.value = 0.9;

// 接続
lfo.connect(gainLfo);
lfo.connect(gainFb);
gainFb.connect(lfo.frequency);
gainLfo.connect(vco1.frequency);
vco1.connect(gainVco1);
gainVco1.connect(audioCtx.destination);

// 音を出す
lfo.start();
vco1.start();

// 音を止める
setTimeout(function() {
    lfo.stop();
    vco1.stop();
}, 3000);
```

## エンベロープを付ける

シンセサイザーの仕組みを模すことで様々な音を作ることができますが，実際の楽器音は鳴り始めから鳴り終わるまでに音量が刻々と変化します．この音量の変化を作る仕組みは VCA やエンベロープと呼ばれています．

具体的には，以下の図の Attack，Decay，Release の時間と Sustain レベルを定めています．
<img src="./img/audio04-05.png" width="80%" />

そのために，gainVcf を追加し，このゲインを時間変化させます．なお，さらに複雑な音をだすために各オペレータの出力にエンベロープを設定することがあります．

<img src="./img/audio04-04.png" width="80%" />

次のプログラムを実行してください．その後，音を鳴らしている下にある，gainVcf の各種パラメータを調整してみてください．

```javascript sandbox editable
// エンベロープの設定

// LFO関係（注：FM音源ではModulatorと呼ばれている）
var lfo = audioCtx.createOscillator();
lfo.frequency.value = 223;

var gainLfo = audioCtx.createGain();
gainLfo.gain.value = 0.8;

// Feedback関係
var gainFb = audioCtx.createGain();
gainFb.gain.value = 200;

// VCO1関係（注：FM音源ではCarrierと呼ばれている）
var vco1 = audioCtx.createOscillator();
vco1.frequency.value = 220;
vco1.type = "sine";

var gainVco1 = audioCtx.createGain();
gainVco1.gain.value = 0.8;

var gainVcf = audioCtx.createGain();
gainVcf.gain.value = 1;

// 接続
lfo.connect(gainLfo);
lfo.connect(gainFb);
gainFb.connect(lfo.frequency);
gainLfo.connect(gainVcf);
vco1.connect(gainVco1);
gainVco1.connect(gainVcf);
gainVcf.connect(audioCtx.destination);

// 音を出す
lfo.start();
vco1.start();

// エンベロープ設定
var now = audioCtx.currentTime;
var volume = 1;
var attack = 0.0; // attackに要する時間 [sec]
var decay = 0.2; // decayする時間 [sec]
var sustain = 0.8; // sustainレベル
var release = 0.5; // キーオフしてからの時間 [sec]

gainVcf.gain.cancelScheduledValues(0);
gainVcf.gain.setValueAtTime(0.0, now);
gainVcf.gain.linearRampToValueAtTime(volume, now + attack);
gainVcf.gain.linearRampToValueAtTime(sustain * volume, now + attack + decay);
gainVcf.gain.linearRampToValueAtTime(0.0, now + attack + decay + release);

// 音を止める
setTimeout(function() {
    lfo.stop();
    vco1.stop();
}, 3000);
```

## アナログシンセサイザーのオシレータ構成

アナログシンセサイザーでは，複数の VCO を組み合わせ，片方の周波数を微妙にずらし（デチューンと呼ばれています）合成して複雑な波形を作り出していました．以下のプログラムでは，vco2 の音を若干低くして，vco1 の音と合成しています．

オシレータの接続は以下の図のようになります．lfo の出力を vco1 と vco2 の周波数入力に繋いでいます．

<img src="./img/audio04-06.png" width="80%">

プログラム中では，`vco2.detune.value = -30`としています．この値の単位は「セント」と呼ばれ，100 になると半音上がります．

```javascript sandbox editable
// アナログシンセイサイザー的な音作り：オシレータを3つ作ってビブラートを再現する

// LFO関係
var lfo = audioCtx.createOscillator();
lfo.frequency.value = 2;

var gainLfo = audioCtx.createGain();
gainLfo.gain.value = 1;

// VCO1関係
var vco1 = audioCtx.createOscillator();
vco1.frequency.value = 440;
vco1.type = "sawtooth";

var gainVco1 = audioCtx.createGain();
gainVco1.gain.value = 0.3;

// VCO2関係
var vco2 = audioCtx.createOscillator();
vco2.frequency.value = 440;
vco2.type = "sawtooth";
vco2.detune.value = -30;

var gainVco2 = audioCtx.createGain();
gainVco2.gain.value = 0.3;

// 接続
lfo.connect(gainLfo);
gainLfo.connect(vco1.frequency);
gainLfo.connect(vco2.frequency);
vco1.connect(gainVco1);
vco2.connect(gainVco2);
gainVco1.connect(audioCtx.destination);
gainVco2.connect(audioCtx.destination);

// 音を出す
lfo.start();
vco1.start();
vco2.start();

// 音を止める
setTimeout(function() {
    lfo.stop();
    vco1.stop();
    vco2.stop();
}, 3000);
```

## Lowpass フィルタ

WebAudioAPI では，ローパスフィルタやハイパスフィルタ，バンドパスフィルタなどを使用できます．これらはまとめて`BiquadFilterNode`と呼ばれています．

オシレータの接続は以下のとおりです．vcf に`BiquadFilterNode`によるローパスフィルターを設定し，高周波数成分をカットします．

<img src="./img/audio04-07.png" width="80%">

以下のプログラムは，10kHz 以下の音を通すように設定しています．

```javascript sandbox editable
// Lowpassフィルターを使う

// LFO関係
var lfo = audioCtx.createOscillator();
lfo.frequency.value = 2;

var gainLfo = audioCtx.createGain();
gainLfo.gain.value = 1;

// VCO1関係
var vco1 = audioCtx.createOscillator();
vco1.frequency.value = 440;
vco1.type = "sawtooth";

var gainVco1 = audioCtx.createGain();
gainVco1.gain.value = 0.3;

// VCO2関係
var vco2 = audioCtx.createOscillator();
vco2.frequency.value = 440;
vco2.type = "sawtooth";
vco2.detune.value = -10;

var gainVco2 = audioCtx.createGain();
gainVco2.gain.value = 0.3;

// VCF関係
var vcf = audioCtx.createBiquadFilter();
vcf.frequency.value = 10000;

var gainVcf = audioCtx.createGain();
gainVcf.gain.value = 0.5;

// 接続
lfo.connect(gainLfo);
gainLfo.connect(vco1.frequency);
gainLfo.connect(vco2.frequency);
gainLfo.connect(vco2.detune);
vco1.connect(gainVco1);
vco2.connect(gainVco2);
gainVco1.connect(vcf);
gainVco2.connect(vcf);
vcf.connect(gainVcf);
gainVcf.connect(audioCtx.destination);

// 音を出す
lfo.start();
vco1.start();
vco2.start();

// 音を止める
setTimeout(function() {
    lfo.stop();
    vco1.stop();
    vco2.stop();
}, 3000);
```

## エンベロープを付ける

アナログシンセイサイザーのような構成にしても，エンベロープを付けることができます．オシレータの構成は 1 つ上と同じです．ここで gainVcf にエンベロープの設定を行っています．

<img src="./img/audio04-07.png" width="80%">

```javascript sandbox editable
// エンベロープを付ける

// LFO関係
var lfo = audioCtx.createOscillator();
lfo.frequency.value = 2;

var gainLfo = audioCtx.createGain();
gainLfo.gain.value = 1;

// VCO1関係
var vco1 = audioCtx.createOscillator();
vco1.frequency.value = 440;
vco1.type = "sawtooth";

var gainVco1 = audioCtx.createGain();
gainVco1.gain.value = 0.3;

// VCO2関係
var vco2 = audioCtx.createOscillator();
vco2.frequency.value = 440;
vco2.type = "sawtooth";
vco2.detune.value = -10;

var gainVco2 = audioCtx.createGain();
gainVco2.gain.value = 0.3;

// VCF関係
var vcf = audioCtx.createBiquadFilter();
vcf.frequency.value = 10000;

var gainVcf = audioCtx.createGain();
var volume = 0.5;
gainVcf.gain.value = volume;

// 接続
lfo.connect(gainLfo);
gainLfo.connect(vco1.frequency);
gainLfo.connect(vco2.frequency);
gainLfo.connect(vco2.detune);
vco1.connect(gainVco1);
vco2.connect(gainVco2);
gainVco1.connect(vcf);
gainVco2.connect(vcf);
vcf.connect(gainVcf);
gainVcf.connect(audioCtx.destination);

// 音を出す
lfo.start();
vco1.start();
vco2.start();

// エンベロープ設定
var now = audioCtx.currentTime;
var attack = 0.1; // attackに要する時間 [sec]
var decay = 0.3; // decayする時間 [sec]
var sustain = 0.2; // sustainレベル
var release = 0.5; // キーオフしてからの時間 [sec]

gainVcf.gain.cancelScheduledValues(0);
gainVcf.gain.setValueAtTime(0.0, now);
gainVcf.gain.linearRampToValueAtTime(volume, now + attack);
gainVcf.gain.linearRampToValueAtTime(sustain * volume, now + attack + decay);
gainVcf.gain.linearRampToValueAtTime(0.0, now + attack + decay + release);

// 音を止める
setTimeout(function() {
    lfo.stop();
    vco1.stop();
    vco2.stop();
}, 3000);
```

</div>
