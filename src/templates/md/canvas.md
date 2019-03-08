---
title: CanvasAPIの使い方
layout: src/templates/layout.pug
---

# CanvasAPI の使い方

## Canvas を使おう

あまり基礎ばかり説明しても嫌になってしまうので，基礎確認のための応用編に入ります．ここでは，HTML5 で定められた描画のための要素である Canvas 要素を使って，お絵描きをします．まず，下記のように HTML 内で Canvas 要素を定義しておきます．

```html hl
<canvas id="canvas1" width="400" height="400"></canvas>
```

```javascript sandbox console editable
// canvas要素の取得
var element = document.getElementById("canvas1");
var context = element.getContext("2d");
console.log(context);
```

続いて，JavaScript の 1 行目のように要素を取得し，2 行目のようにグラフィックコンテキストを取得します．グラフィックコンテキストとは，描画する対象を表すオブジェクトです．以後，このグラフィックコンテキストに対して線を書くなどのメソッドを使用します．なお，パラメータの 2d ですが，他には 3D グラフィックス描画のための webgl が定義されています．

### JavaScript の実行時にエラーが発生！？

上記をファイルにしたものを以下に示します．
これまで特に説明してきませんでしたが，JavaScript のプログラムは HTML の中に記述できます．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <script>
            var element = document.getElementById("canvas1");
            var context = element.getContext("2d");
        </script>
    </head>
    <body>
        <canvas id="canvas1" width="400" height="400"></canvas>
    </body>
</html>
```

さて，Web ブラウザで上記ファイルを読み込むと・・・エラーが発生します．何故かと言うと，このような書き方をすると，Web ブラウザ内で Canvas などの要素を配置する前にプログラムが実行されてしまい，「'canvas1'なんて無いよ！」とエラーになってしまいます．

そこで，ちょっと面倒ですが以下のように記述します．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <script>
            window.addEventListener("load", function() {
                var element = document.getElementById("canvas1");
                var context = element.getContext("2d");
            });
        </script>
    </head>
    <body>
        <canvas id="canvas1" width="400" height="400"></canvas>
    </body>
</html>
```

大きく違うのは 7 行目です．
この行は，window に対して，「このページに関する全ての準備が整ったら第 2 パラメータで与えられた関数を実行せよ」という意味を持ちます．

## 直線の描画

文法だけ見ていてもつまらないので，実際に描画してみましょう．Canvas に描画するメソッドを以下に示します．実行すると，プログラムの下にある canvas 要素に直線が描かれます．

| メソッド  | 意味               |
| :-------- | :----------------- |
| beginPath | 描画開始           |
| moveTo    | 描画開始座標を設定 |
| lineTo    | 線を描画           |
| stroke    | 実際に描画         |

まずは context を作成します．

```javascript runnable console editable
// canvas要素の取得
var element = document.getElementById("canvas1");
var context = element.getContext("2d");
console.log(context);
```

その後，任意の描画を行います．座標を変更して，様々な線を描いてみてください．

```javascript runnable editable
// 直線の描画（上にある「canvas要素の取得」を実行してから，ここを実行してください）
context.beginPath();
context.moveTo(0, 0);
context.lineTo(400, 400);
context.stroke();
```

<canvas id="canvas1" width="400" height="400"></canvas>

beginPath〜stroke までの間に，多数の描画メソッドを入れることも可能です．

```javascript runnable editable
// 多数の直線の描画（上にある「canvas要素の取得」を実行してから，ここを実行してください）
context.beginPath();
for (var i = 0; i < 400; i += 4) {
    context.moveTo(i, 0);
    context.lineTo(400 - i, 400);
}
context.stroke();
```

## マウスクリックで描画してみよう

次に，マウスでクリックした座標に点を描画してみましょう．クリックした座標を取得するためには，おなじみの`addEventListener`を使用して，概ね以下のように記述します．

```javascript hl
// canvas要素の取得
var element = document.getElementById("canvas1");
var context = element.getContext("2d");

element.addEventListener("click", ev => {
    // ここで描画する
});
```

ここで，変数 ev に座標の情報が格納されています．なぜこんなにたくさんの変数が用意されているかというと，ページがスクロールされた際に，画面上の座標が欲しい場合や，ページ内の相対的な座標が欲しい場合など，プログラム中で必要とする値が様々であるためです．

| 変数名  | 意味                                                 |
| ------- | ---------------------------------------------------- |
| clientX | ブラウザの描画領域の左上を原点とした X 座標          |
| clientY | ブラウザの描画領域の左上を原点とした Y 座標          |
| pageX   | ページ全体でのマウスの X 座標                        |
| pageY   | ページ全体でのマウスの Y 座標                        |
| screenX | ディスプレイの左上を原点とした X 座標                |
| screenY | ディスプレイの左上を原点とした Y 座標                |
| offsetX | 要素の左上を原点とした X 座標 （正式な規格ではない） |
| offsetY | 要素の左上を原点とした Y 座標 （正式な規格ではない） |
| layerX  | offsetX の代わりに規格化しようとしたが頓挫           |
| layerY  | offsetY の代わりに規格化しようとしたが頓挫           |

結局のところ，要素内の相対的な座標を取得したい場合は以下のようにして計算することが，現実的な解です．getBoundingClientRect は，要素の座標を取得する関数です．

```javascript hl
// クリックされた座標の取得（上にある「canvas要素の取得」を実行してから，ここを実行してください）
element.addEventListener("click", ev => {
    var rect = ev.target.getBoundingClientRect();
    var x = ev.clientX - rect.left;
    var y = ev.clientY - rect.top; // ここで描画する
});
```

それでは実際にマウスクリックによる描画を実現してみましょう．まずは要素を取得して context を作成します．続いて，canvas の下にあるプログラムを実行し，その後 canvas をクリックしてみてください．

```javascript runnable editable console
// canvas要素の取得
var element2 = document.getElementById("canvas2");
var context2 = element2.getContext("2d");
console.log(context2);
```

<canvas id="canvas2" width="400" height="400"></canvas>

```javascript runnable editable
// マウスイベントの記述（上にある「canvas要素の取得」を実行してから，ここを実行してください）
element2.addEventListener("click", ev => {
    var rect = ev.target.getBoundingClientRect();
    var x = ev.clientX - rect.left;
    var y = ev.clientY - rect.top;
    context2.beginPath();
    context2.moveTo(x, y);
    context2.lineTo(x + 1, y + 1);
    context2.stroke();
});
```

## クラス化

さて，上記ソースはお世辞にも見やすいとは言えません．見やすくするためにやることは 2 つあります．

1. JavaScript を HTML とは別ファイルにする
2. プログラムの見通しを良くするためにクラス化する

と言うことで，まずは 1 からやってみましょう．

### まずは JS を別ファイルに

HTML ファイルから外部 JavaScript を読み込むためには以下の 6 行目のように書きます．

```html hl
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <script src="test1.js"></script>
    </head>
    <body>
        <canvas id="canvas1" width="400" height="400"></canvas>
    </body>
</html>
```

これにより，HTML は文書構造のみを記述でき，何が書かれているか分かりやすくなりました．
このように，JavaScript や CSS などは外部ファイルとして書きましょう．

### クラス化してみる

次にプログラム本体に手を入れ，クラス化します．クラス名は`Drawing`にしておきます．メソッドはコンストラクタ（`constructor`），イベントの設定（`set_event`），点描画（`drawPoint`）の 3 つです．クラス化したことに伴い，このように処理を細分化することで，メンテナンスや再利用が容易になります．

```javascript hl
class Drawing {
    // コンストラクタ（JavaScriptではconstructorという名前のメソッド）
    constructor(element) {
        this.element = element;
        this.context = element.getContext("2d");
    }

    // イベントの設定
    set_event() {
        this.element.addEventListener("click", ev => {
            var rect = ev.target.getBoundingClientRect();
            var x = ev.clientX - rect.left;
            var y = ev.clientY - rect.top;
            this.drawPoint(x, y);
        });
    }

    // 点を描画する
    drawPoint(x, y) {
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x + 1, y + 1);
        this.context.stroke();
    }
}

window.addEventListener("load", () => {
    var element = document.getElementById("canvas1");
    var draw = new Drawing(element);
    draw.set_event();
});
```

上記プログラムは，実際にファイルを作成して確かめてみてください．
