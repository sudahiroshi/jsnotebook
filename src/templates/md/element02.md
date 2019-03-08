---
title: 要素を作成する
layout: src/templates/layout.pug
---

# 要素を作成する

## はじめに

このページでは，要素の作成方法を学習します．

まず，以下のようなタグが有ることを想定します．この要素内に作成した要素を追加していきます．

```html hl
<div id="base01"></div>
```

<div id="base01" class="group01"></div>

## 文字列を追加する

文字列を追加する場合には，まずテキストノードを作成し，その後目的の要素に追加します．テキストノードを作成するには`createTextNode`という関数を使用します．具体的なプログラムを以下に示します．

```javascript runnable editable
// テキストノードを作成し，base01に追加する

var destination = document.getElementById("base01"); // 追加する先の要素を取得
var textNode = document.createTextNode("追加する文字列"); // 追加する文字列
destination.appendChild(textNode); // 追加します
```

## 改行要素を追加する

次に，改行を含む文字列を追加してみましょう．HTML では改行は br という要素で表されます．要素を追加する場合は，`createElement`という関数を使用します．具体的なプログラムを以下に示します．

```javascript runnable editable console
// 改行を含む文字列をbase01に追加する

var destination = document.getElementById("base01");

var textNode1 = document.createTextNode("改行前の文字列");
destination.appendChild(textNode1);

var br = document.createElement("br"); // 改行要素を作って
destination.appendChild(br); // 追加します

var textNode2 = document.createTextNode("改行後の文字列");
destination.appendChild(textNode2);

console.log(br);
```

## 追加された要素を確認する

ちゃんと追加されたか確認してみましょう．ここでは base01 内の各要素を順に表示します．

```javascript runnable editable console
// 改行を含む文字列をbase01に追加する

var destination = document.getElementById("base01");

for (var elm of destination.childNodes) {
    console.log(elm.data);
}
```

表示結果を見ると，それぞれの文字列が要素に割り当てられているのが分かります．要素として改行がないのは，そもそも改行を追加していないからです．HTML ファイルでは人間が見やすいように改行していますが，上の方のプログラムで追加した要素群には改行が入っていません．

また，undefined と表示されているのは br 要素です．

## リンクを追加する

改行要素では実践的ではないので，次にリンクを追加してみましょう．追加する先の要素がはるか上方になってしまったので，以下のように新たな要素を定義しておきます．

```html hl
<div id="base02"></div>
```

<div id="base02" class="group01"></div>

HTML のリンクを表すタグは a で，以下の例のようにリンク先やリンクテキストも与える必要があります．

```html hl
<a href="http://www.google.co.jp/">グーグルへのリンク</a>
```

まずは a タグを追加してみましょう．まだ上の囲みには目に見える変化はありません．

```javascript runnable editable
// リンクをbase02に追加する

var destination = document.getElementById("base02");

var link = document.createElement("a"); // リンク要素を作って
destination.appendChild(link); // 追加します
```

続けて，a タグにリンクテキストを追加します．上の囲みにテキストが追加されますが，クリックできません．

```javascript runnable editable
// リンクテキストを追加する

var linkText = document.createTextNode("グーグルへのリンク");
link.appendChild(linkText); // 追加します
```

さらにリンク先の情報を追加します．要素にアトリビュート名が存在する場合，アトリビュートへの設定は「要素の変数.アトリビュート名」に代入することで行なえます．リンク先の情報は`href`というアトリビュートに格納する決まりなので以下のように記述します．ここまで終わるとクリックできるようになります．

```javascript runnable editable
// リンクテキストを追加する

link.href = "http://www.google.co.jp/";
```

## アトリビュート

先の例では，アトリビュート`href`に URL を代入しましたが，存在しないアトリビュートに代入することはできません．存在しないアトリビュートを追加する場合は`setAttribute`関数を使用して以下のように記述します．

```javascript runnable editable
// アトリビュートを追加する
// 前節のプログラムを実行した後に以下を実行してください

link.setAttribute("foo", "bar");
```

また，アトリビュートを取得する場合は`getAttributeNode`関数や`attributes` を使用して以下のように記述します．

```javascript runnable editable console
// アトリビュートを取得する

var attr1 = link.getAttributeNode("foo").value;
console.log(attr1);

var attr2 = link.attributes["foo"].value;
console.log(attr2);
```
