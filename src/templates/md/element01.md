---
title: 要素を取得する
layout: src/templates/layout.pug
---

# 要素を取得する

## はじめに

このページでは，要素（タグで囲まれた範囲）の取得方法を学習します．

まず，以下のようなタグが有ることを想定します．ここで，枠内の文字列＝`value`内の文字列を取得したいとします．

```html hl
<iput type="text" value="ここが枠内の文字列" id="input01"></input>
```

<input type="text" value="ここが枠内の文字列" id="input01"></input>

そのような場合は，`getElementById`関数を使用して要素を取得し，要素内の`value`の内容を取得するという手順で実行します．

```javascript sandbox editable console
// valueの内容　＝　枠内の文字列を取得します

var value = document.getElementById("input01").value;
console.log(value);
```

同様に`type`の内容を取得するにはどうすれば良いでしょうか？上のプログラムから予想できるとおり，プログラムは以下のようになります．

```javascript sandbox editable console
// typeを取得します
var type = document.getElementById("input01").type;
console.log(type);
```

あまり`type`を取得する場面はないと思いますが，独自のパラメータを付けておいてあとで読み取る際などに役に立ちます．

## 要素または要素群を取得する

以下に，要素または要素群を取得する関数一覧を示します．細かい使用例は次節以降で説明します．

| 関数名                 | 複数 | 意味                             |
| ---------------------- | ---- | -------------------------------- |
| getElementById         |      | id 属性を指定して要素を取得      |
| getElementsByName      | ○    | name 属性を指定して要素を取得    |
| getElementsByClassName | ○    | クラス名を指定して要素を取得     |
| getElementsByTagName   | ○    | タグ名を指定して要素を取得       |
| querySelector          |      | CSS セレクタを指定して要素を取得 |
| querySelectorAll       | ○    | CSS セレクタを指定して要素を取得 |

## 要素を全て取得する

それでは，連続して並んでいる`input`要素を全て取得したい場合はどうすれば良いでしょうか？幾つか手段があるので順に説明します．

例えば以下のような ID が`input02-form`の form 内に 4 つのラジオボタンが有る場合を考えます．ラジオボタンは上から順に value が 1〜4 で，class 名が`input02`，name が`radio02`であるものとします．

```html hl
<form id="input02-form">
    <input
        type="radio"
        value="1"
        class="input02"
        name="radio02"
        checked
    />1番目の選択肢
    <input type="radio" value="2" class="input02" name="radio02" />2番目の選択肢
    <input type="radio" value="3" class="input02" name="radio02" />3番目の選択肢
    <input type="radio" value="4" class="input02" name="radio02" />4番目の選択肢
</form>
```

実際のラジオボタンは以下のようになります．

<form id="input02-form">
<input type="radio" value="1" class="input02"  name="radio02" checked>1番目の選択肢
<input type="radio" value="2" class="input02" name="radio02">2番目の選択肢
<input type="radio" value="3" class="input02" name="radio02">3番目の選択肢
<input type="radio" value="4" class="input02" name="radio02">4番目の選択肢
</form>

ここで，ラジオボタン群を抽出してみたいと思います．

### getElementByTagName を使用する場合

<div class="group01">

幾つかのやり方がありますが，ここでは input タグを抽出したいと思います．

```javascript runnable editable console
// inputタグの要素を全て取得します

var inputElm = document.getElementsByTagName("input");
console.log(inputElm.length + "個の要素を取得しました");
```

しかし，ページ内に存在する他の input タグも一緒に抽出されてしまっています．そこで，以下のようにして 1 つ 1 つの内容を見て，`type=="radio"`の項目を抽出します．ちょっと面倒ですね．

```javascript runnable editable console
// inputElmの中からtypeがradioのものを抽出します

var radios0 = [];
for (var elm of inputElm) {
    if (elm.type == "radio") {
        radios0.push(elm);
    }
}
console.log(radios0.length + "個の要素を取得しました");
console.log("最初の要素のvalueは" + radios0[0].value + "です");
```

</div>

### getElementsByName を使用する場合

通常，input タグの name の内容は他の箇所と別の名称にします．そこで，この情報を使用して要素群を取得する事もできます．

```javascript runnable editable console
// nameがinput02の要素を全て取得します

var radios1 = document.getElementsByName("radio02");
console.log(radios1.length + "個の要素を取得しました");
console.log("最初の要素のvalueは" + radios1[0].value + "です");
```

### querySelector を使用する場合

昔ながらの getElement(s)関係の関数はシンプルで良いのですが，融通がきかないのが欠点でした．そこで，CSS セレクタにマッチする単独の要素を得る`querySelector`と，全要素を得る`querySelectorAll`が実装されました．

querySelectorAll を使用したサンプルを以下に示します．パラメータは CSS セレクタなので，この場合はタグ名が input で，さらに大カッコを使い type が raio の要素のみを抽出しています．

なお，コメントアウトしている行は，タグ名が input で，さらに大カッコを使い name が radio02 の要素のみを抽出しています．コメントの位置を変更して，どちらでも要素軍が取得できていることをご確認ください．

```javarscript runnable editable console
// inputタグでtypeがradioのものを抽出します

var radios2 = document.querySelectorAll( 'input[type="radio"]' );
// var radios2 = document.querySelectorAll( 'input[name="radio02"]' );
console.log( radios2.length + "個の要素を取得しました" );
console.log( "最初の要素のvalueは" + radios2[0].value + "です" );
```

## チェックされている要素を得る

実際の使用例に近い形として，チェックされている要素を取得してみましょう．これには幾つかのやり方があり，ID 付きのタグで囲まれている場合，`class`で指定する場合，`name`で指定する場合などに分けて考えてみたいと思います．

### ID 付き form で囲まれている場合（querySelector 未使用）

```javascript runnable editable console
// IDからform要素を取得→input要素群を取得→checkedを探す
// form内に外のinput要素が存在する場合はinput要素群を取得した後にtypeがradioの要素のみを抽出する必要あり

var element = document.getElementById("input02-form");
var inputs = element.getElementsByTagName("input");
var target = undefined;
for (var elm of inputs) {
    if (elm.checked == true) {
        target = elm;
    }
}
console.log(target.value);
```

### ID 付き form で囲まれている場合（querySelector 使用）

querySelector を使用すると，以下のように書くことができます．今回は Radio ボタン群から抽出したので checked は 1 つしか存在しないという想定のものです．

```javarscript runnable editable console
// idがinput02-formの要素を取得→inputタグtypeがradioでcheckedの付いている要素を抽出

var inputform = document.getElementById('input02-form');
var radios3 = inputform.querySelector( 'input[type="radio"]:checked' );
console.log( radios3.value );
```

### class で指定する場合（querySelector 未使用）

```javascript runnable editable console
// classがinput02の要素を取得→checkedを探す

var inputs = document.getElementsByClassName("input02");
var target = undefined;
for (var elm of inputs) {
    if (elm.checked == true) {
        target = elm;
    }
}
console.log(target.value);
```

### class で指定する場合（querySelector 使用）

```javascript runnable editable console
// classがinput02の要素の内checkedを抽出

var target = document.querySelector(".input02:checked");
console.log(target.value);
```

### name で指定する場合（querySelector 未使用）

```javascript runnable editable console
// nameがradio02の要素を取得→checkedを探す

var inputs = document.getElementsByName("radio02");
var target = undefined;
for (var elm of inputs) {
    if (elm.checked == true) {
        target = elm;
    }
}
console.log(target.value);
```

### name で指定する場合（querySelector 使用）

```javascript runnable editable console
// nameがradio02の要素の内checkedを抽出

var target = document.querySelector('[name="radio02"]:checked');
console.log(target.value);
```

## DOM および DOM ツリーとは？

HTML では，html 要素の中に head 要素と body 要素があり，body 要素の中にページを構成する各要素が格納されています．言い換えると，document をトップとした階層構造になっています．

この階層構造になっている中から，プログラムの動作に必要なデータを取得する必要があり，そのためのインタフェースを DOM（Document Object Model）と呼んでいます．最も原始的な要素の取得方法では，ある要素の下にある要素（子要素）を取得する場合「n 番目の子要素を取得」などのようなプログラムを書くこともできます．しかし，それでは要素が挿入されたり削除されたりした場合に煩雑な処理が必要になるため，上で説明したように ID やクラス名から要素を取得できるようになっています．

また，要素の階層構造は木構造になっているので，一般的に DOM ツリーと呼ばれています．

例えば以下のような HTML ファイルが有ったとします．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>Sample</title>
    </head>
    <body>
        <h1>This is a test.</h1>
        <div id="result1"></div>
        <div id="result2"></div>
        <div id="result3"></div>
    </body>
</html>
```

このとき，body 内の最初の要素を取得したい場合には，以下のように実行します．参考までに要素のことをノードとも呼びます．

「子要素の 0 番目ではないの？」と思うかもしれませんが，0 番目には改行が入っています．違和感があると思いますが，改行も要素として認識されます．

```javascript hl
// body内の最初の要素を取得する

var first = document.body.childNodes[1];
// firstの内容はh1要素となります
```
