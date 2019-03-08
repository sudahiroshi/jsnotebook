---
title: 配列の基本
layout: src/templates/layout.pug
---

# 配列の基本

## 配列の初期化

このページでは，配列の基本的な使い方を学習します．

配列とは，まとまったデータを扱うための文法です．
JavaScript には，配列を扱うための Array オブジェクトが用意されています．

C 言語や Java 言語の配列では，「int 型の配列」のように型を定めた上，「初期化時に要素数を決める」という使い方でした．
これに対して JavaScript の Array は特に型を定めることはありませんし，要素数も可変です．
（Array とは別に TypedArray というオブジェエクトが存在し，型と要素数を定めて使用します）

まずは初期化の方法です．

```javascript once editable
// 空の配列を宣言し，arr1とする．

var arr1 = new Array();
```

JavaScript では配列を`[`と`]`で表すことができるので，以下のように書いても空の配列を宣言できます．

```javascript once editable
// 別の書き方

var arr2 = [];
```

内容を表示してみましょう．現状では両配列とも空なので，内容は何も表示されません．

```javascript runnable editable console
// arr1とarr2の内容を表示する

console.log("arr1 :" + arr1);
console.log("arr2 :" + arr2);
```

## 配列への代入

配列の要素に何かを代入する場合，幾つか方法があります．
まずは添字（要素番号）を指定して代入する方法です．

```javascript runnable editable console
// 要素番号を指定して代入する例

arr1[0] = 100;
arr1[1] = 200;
console.log("arr1 :" + arr1);
```

上記プログラムを実行した状態の arr1 を図にすると，以下のようになります．
配列名，要素，要素数，添字の関係を確認しておいてください．

![配列arr1に100と200が追加された様子](./img/arr1-1.svg "arr1")

上の例では数値を代入しましたが，その他のオブジェクトも代入可能です．

```javascript runnable editable console
// 要素番号を指定して数値以外を代入する例

arr1[2] = "文字列";
console.log("arr1 :" + arr1);
```

arr1 に文字列を追加した状態を図にすると，以下のようになります．

![配列arr1に"文字列"が追加された様子](./img/arr1-2.svg "arr1")

しかし，添字で指定するためには，現在の要素数を気にかける必要があり不便です．
そこで，先頭に追加するメソッド`unshift`と，末尾に追加するメソッド`push`が用意されています．

```javascript runnable editable console
// 先頭に"first"を，末尾に"last"を追加する例

arr1.unshift("first");
arr1.push("last");
console.log("arr1 :" + arr1);
```

上記プログラム実行後の arr1 を図にすると，以下のようになります．

![配列arr1の最初と最後に要素を追加した様子](./img/arr1-3.svg "arr1")

## 配列内の要素の取得

次に，配列から特定の要素を取得してみましょう．
ここで言う`取得`とは，配列の内容は変えずに，値を取り出すことを指します．
配列の要素は格納されている変数名に[添え字]を付けることで取得できます．
まずはありがちですが，最初の要素を取得してみましょう．
添字を変更すると好きな要素を取得できるので，変更しながら試してみてください．

```javascript runnable editable console
// 最初の要素を表示する例

console.log("arr1の最初の要素は" + arr1[0]);
```

その前に，要素数を取得してみましょう．
使用するメソッドは`length`です．

```javascript runnable editable console
// 要素数を取得

console.log("arr1の要素数は" + arr1.length);
```

取得した要素数を使用して，最後の要素を表示してみましょう．
注意点として，要素数が例えば 5 だった場合，利用できる添字は 0〜4 の 5 つとなります．
よって，最後の要素を取得したい場合は添字に`arr1.length - 1`を指定してください．

```javascript runnable editable console
// 最後の要素を表示する例

console.log("arr1の最後の要素は" + arr1[arr1.length - 1]);
// arr1.length => 5
// arr1.length - 1 => 4
```

## 全要素に処理を行う

ちょっとサブタイトルが分かりにくいですが，console.log に配列名を指定する方法を使わずに全要素を表示したり，全要素に演算を行うと思ってください．
まず，arr2 の全要素に数値が入っているものとして，その値を 2 倍してみましょう．
まずは arr2 に数値を追加しておきます．

```javascript runnable editable console
// arr2に数値を追加する

arr2.push(100);
arr2.push(200);
arr2.push(250);
arr2.push(150);
console.log(arr2);
```

次に，console.log に配列名を指定せずに，1 つ 1 つの要素を取り出して表示してみます．
この方法はいくつか有るので，順番に説明します．
まずは C 言語や Java 言語と同じような for 文の書き方です．

```javascript runnable editable console
// arr2の全要素を表示（単純なfor文）

for (let i = 0; i < arr2.length; i++) {
    console.log("arr2の" + i + "番目の要素は" + arr2[i] + "です");
}
```

きちんと表示されたと思います．
しかし，上記のような for 文は，ミスが心配なので最近は使う機会が減っています．
次に紹介するのは for-in で，要素数を直接取り扱わないため，安全度が上がっています．

文法的には，arr2 の添字が順番に index に代入され，ループのブロック内で index を使っていくという書き方です．
（※変数名は index でなくても，定義している変数名と使用している変数名が対応していれば良いです）

```javascript runnable editable console
// arr2の全要素を表示（for-in）

for (let index in arr2) {
    console.log("arr2の" + index + "番目の要素は" + arr2[index] + "です");
}
```

これらに対して，実際には「要素番号は要らないから，内容だけ順番に欲しい，できればもっと簡単な方法で．」ことが多いです．
ここで出てくるのが for-of です．
for-in とだいたい同じ書き方ですが，arr2 の要素が順番に item に代入されていきます．
繰り返すブロック内で，直接添字を扱わないため，安全度が上がっています．

```javascript runnable editable console
// arr2の全要素を表示（for-of）

for (let item of arr2) {
    console.log("内容は" + item + "です");
}
```

さらに進んだ書き方が forEach です．
できることは for-of と同じですが，プログラムを読む際に「arr2 の全要素に対して・・・」と読んでいけるのがメリットです．

```javascript runnable editable console
// arr2の全要素を表示（forEach）

arr2.forEach(function(item) {
    console.log("内容は" + item + "です");
});
```

また，forEach を使うと，要素だけでなく添字も取得できます．
そのためには，function の第 2 パラメータを使うようにします．
第 1 パラメータが要素，第 2 パラメータが添え字です．
（※本当は第 3 パラメータも存在するのですが，ここでは省略します）

```javascript runnable editable console
// arr2の全要素を表示（forEachその2）

arr2.forEach(function(item, index) {
    console.log("arr2の" + index + "番目の要素は" + item + "です");
});
```

どの方法を使ってもプログラムを組むことはできますが，各自の理解度と安全性を考慮して，最終的にスマートな方法を使ってください．
個人的には for-of か forEach がお薦めです．

## forEach を使って配列の最大値を求める

ここでは，配列を取り扱う練習として，forEach を使って最大値を求めてみましょう．
（最大値を求める関数が存在しますが，あくまで配列操作の練習として説明します）
考え方としては，暫定的な最大値を記憶する変数と各要素を比較して，要素のほうが大きい場合に暫定最大値を変更することを繰り返します．
言葉で書くと難しいのでプログラムで見ていきましょう．

```javascript runnable editable console
// arr2の最大値を表示する

var interim = arr2[0]; // interimは暫定という意味
// 暫定的な最大値としてarr2の0番目の要素を使用する

arr2.forEach(function(item) {
    // interimとitemを比較して，itemの方が大きかったらinterimにitemを代入
    if (interim < item) interim = item;
});
console.log("最大値は" + interim + "です");
```

arr2 の内容が，[100,200,250,150]だった場合，次の手順でプログラムが実行される．

| 回数     | interim | item | 動作                  |
| -------- | ------- | ---- | --------------------- |
| ループ前 | 100     | -    | -                     |
| 0 回目   | 100     | 100  | 何もしない            |
| 1 回目   | 100     | 200  | interim に 200 を代入 |
| 2 回目   | 200     | 250  | interim に 250 を代入 |
| 3 回目   | 250     | 150  | 何もしない            |

## もっと楽に最大値を求める

以下のようにすることで，もっと楽に最大値を求めることができる．
具体的には Math.max 関数を使う方法です．

```javascript runnable editable console
// 100, 200, 250, 150の最大値を表示する

var max = Math.max(100, 200, 250, 150); // Math.maxは与えられたパラメータから最大値を返す関数
console.log("最大値は" + max + "です");
```

しかし，Math.max 関数は，パラメータとして配列を受け取ることができません．
そこで，配列を展開する文法が役に立ちます．
具体的には以下のように記述します．

```javascript runnable editable console
// arr2の最大値を表示する

var max = Math.max(...arr2); // ...は配列を展開するという文法
console.log("最大値は" + max + "です");
```
