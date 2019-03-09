---
title: JS Notebook
layout: src/templates/layout.pug
---

# JS Notebook

JS Notebook とは，主に JavaScript の自主学習で使用することを想定した，説明中に挿入されているコードをそのまま実行するノートブックです．説明とソースコードと実行結果を比べながら学習でき，さらにソースコードを編集して違いを見ることもできます．説明の作成には Markdown フォーマットを使用できるので，HTML をべた書きするのと比べて楽に書けると思います．

## 基本的な記述方法

Markup 言語よりも簡潔に記述したいとの要望が多いことから，技術者の間で徐々に広まりつつあるのが Markdown です．基本的には，`jsn-md`タグ内に Markdown に従って説明文を記述します．Markdown には方言が多いのでお気をつけください．こちらでは Github Flavor という方言（GFM : Github Flavored Markdown と呼ばれています）を採用しています．

Markdown の強みは，表も書きやすいことです．

| 比較           | HTML             | Markdown     |
| -------------- | ---------------- | ------------ |
| 記述量         | 多い             | 少ない       |
| 細かい記述制御 | それなりにできる | 殆どできない |

詳しいことは以下のページなどをご覧ください．
[訳 GitHub Help - GitHub Flavored Markdown](https://qiita.com/qurage/items/a2f3f52c60d7c64b2e08)
[Markdown で行こう！](https://gist.github.com/wate/7072365)

Markdown に慣れるまでは，Markdown に対応したエディタを利用するのが良いと思われます．Atom や SublimeText 用のプラグインが配布されており，編集画面とプレビューをウィンドウの左右に分けて表示できます．（ただし，**方言が異なる**可能性があります．ご了承ください）

## プログラムの記述と実行

ソースコードは，Markdown の流儀に従い，開始と終了の行にバッククオートを 3 個並べます．バッククオートを表示する方法が分からないので，書式についてはソースコードを見てください．バッククオートに続いてタグとして`javascript`と入力しておくと，プログラムと認識してくれます．（なぜか先頭行だけ 1 文字空いてしまいます．原因は調査中です． 1 行目はコメント専用としておくことで回避しても良いかな・・・と思っています）

また，`javascript`に続くタグとして，`runnable`，`once`，`sandbox`を指定可能です．それぞれ，「通常の実行（別の枠まで変数を持ち越す）」「一度だけ実行可能（別の枠まで変数を持ち越す）」「sandbox 内で実行」を意味します．それ以外に，`console`タグを付けておくと，実行ボタンの下にコンソールが付きます．

```javascript runnable console
var x1 = 20;
console.log("x1は" + x1 + "です");
```

同様に，バッククオートに続いて editable を入力しておくと，プログラムを編集可能になります．
編集できる場合は背景色を変更する予定です．
分かりにくいですが，以下のプログラムの数値を変更して Run をクリックしてみてください．

```javascript runnable editable console
// 編集可能です
var x1 = 20;
console.log("x2は" + x1 + "です");
```

実行しないくて良いプログラムには，`hl`タグを付けることで Syntax Highlite を付けることも可能です．残念ながら，`hl`と`runnable`の共存はできません．

```javascript hl
// Syntax Highliteの例
var x3 = 20;
console.log("x3は" + x3 + "です");
```

## 変数を受け継ぐとは？

先に書いた「変数を受け継ぐ」とは，複数のプログラムコード間で変数を共有する機能です．これにより，Canvas や WebAudio など長くなるプログラムを，ステップごとに説明できます．以下の例で説明します．

```javascript runnable editable console
// sinとcosの値を計算する
var theta = 30; // 30°
var r = 100; // 半径100
var x = r * Math.cos((theta / 180) * Math.PI);
var y = r * Math.sin((theta / 180) * Math.PI);
console.log(" x = " + x);
console.log(" y = " + y);
```

上記プログラムは，単純に正弦と余弦を計算するプログラムです．runnable タグを付けているので，別の枠と変数を共有します．例えば，以下のプログラムを実行させてみてください．

```javascript runnable editable console
// 変数を受け継ぎます．必ず上のプログラムを先に実行してください．
console.log("上のプログラムで代入されたxは " + x + "です");
```

x の内容が表示されたと思います．当然，副作用も出てきますが（「2 回実行してはダメ」や「必ず上から順番に実行」など），割り切ることにします．

## タグ一覧

プログラムの記述（バッククオート 3 つによるブロック）に使用できるタグを以下に示します．

| タグ       | 機能                                              |
| ---------- | ------------------------------------------------- |
| javascript | JS のプログラムの記述                             |
| html       | HTML の記述（ただし不等号はエスケープさせること） |
| hl         | SyntaxHighligh を付ける                           |
| runnable   | 実行可能                                          |
| once       | 1 度だけ実行可能                                  |
| sandbox    | 外に副作用を出さずに実行可能                      |
| editable   | 編集可能                                          |
| console    | コンソールを表示                                  |
