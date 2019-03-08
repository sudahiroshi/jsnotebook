# jsnotebook

JS Notebook とは，主に JavaScript の自主学習で使用することを想定した，説明中に挿入されているコードをそのまま実行するノートブックです．説明とソースコードと実行結果を比べながら学習でき，さらにソースコードを編集して違いを見ることもできます．説明の作成には Markdown フォーマットを使用できるので，HTML をべた書きするのと比べて楽に書けると思います．

### デモページ

以下のページで公開しています．

[JS Notebook](https://jsnotebook.sudalab.net/)

### 動作環境

-   Node.js 関連バージョン(ndenv 等の anyenv を使って特定バージョンを導入するのがベターです)
    -   Node.js v10.15.3
    -   npm v6.4.1

#### Node.js(ndenv 系)の導入方法

-   Mac の人: https://qiita.com/tonkotsuboy_com/items/5322d226b6783d25b5df
-   Win の人: https://qiita.com/circled9/items/ed450ff8dbe68025460c
-   それ以外の人: できるっしょ！！！

上記導入後，v10.15.3 のインストールを忘れずに行ってください．

#### npm の導入方法

上記の方法で Node.js を入れれば自動的についてにきます．

### ビルド・利用方法

#### ローカルでの利用方法

コマンドライン等から `npm run serve` を実行するとトランスパイルが実行され，内部で Web server が起動します．
起動後， http://localhost:8000 を開くとアクセス可能です．

内部 Web server を終了する場合，上記コマンドを実行されているコマンドライン上で <kbd>Ctrl</kbd> + <kbd>C</kbd> を押下してください．
または，それに準じた操作をしてください．

#### リモート環境へのデプロイ方法

コマンドライン等から `npm run build:prod` を実行後、dist 以下に html 等が出力されますので、それらのファイルを公開ディレクトリへコピーしてください．

### 技術情報

1. jns-md タグ内を showdown.js で Markdown→HTML の変換を行い，さらに pre タグ内を必要に応じて実行可能にしています．実行可能にする際，Run，once または sandbox ボタンを付けています．
1. Markdown は GFM を想定しています．
1. 実行の必要のない pre タグ内はシンタックスハイライトを行っています．
1. プログラムの実行には，eval を使っています．
1. console.log は文字列置き換えで別の関数に変換し，プログラムの下のコンソール領域へ表示するようにしています．本物のコンソールにも表示されるので，要素などの情報を細かく見たい場合はそちらからどうぞ．

### 使用しているライブラリ

Markdown の変換に showdown.js を使用しています．
[showdownjs/showdown](https://github.com/showdownjs/showdown)

コードハイライトに highlight.js を使用しています．
[highlight.js](https://highlightjs.org/)

### 今後の発展

-   同じ技術でスライド内の JavaScript を実行できるようにすれば，技術的な講演時にライブデモを行うのが簡単になると思います．（必要になるのは極めて稀だと思いますが…）
-   Gist と連携できたら良いですね
-   シンタックスハイライトを行いつつ編集できると良いですね（遠い目）
-   本文の編集機能と保存機能を付けて，Jupyter のようにノートとして使えるよう発展できたら良いですね（遠い目）
-   そうなったら，クラウドファイルサービスと連携したいですね（遠い目）

### 参考

[動的に JS を実行する方法](https://qiita.com/w650/items/adb108649a0e2a86f334)
