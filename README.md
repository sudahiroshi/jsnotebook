jsnotebook
===============

JS Notebookとは，主にJavaScriptの自主学習で使用することを想定した，説明中に挿入されているコードをそのまま実行するノートブックです．説明とソースコードと実行結果を比べながら学習でき，さらにソースコードを編集して違いを見ることもできます．説明の作成にはMarkdownフォーマットを使用できるので，HTMLをべた書きするのと比べて楽に書けると思います．

### デモページ
以下のページで公開しています．

[JS Notebook](https://jsnotebook.sudalab.net/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/b2ac7bfb-6dc4-4651-8f3f-68a8f44e5a6a/deploy-status)](https://app.netlify.com/sites/jsnotebook/deploys)

### 技術情報

1. jns-mdタグ内をshowdown.jsでMarkdown→HTMLの変換を行い，さらにpreタグ内を必要に応じて実行可能にしています．実行可能にする際，Run，onceまたはsandboxボタンを付けています．
1. MarkdownはGFMを想定しています．
1. 実行の必要のないpreタグ内はシンタックスハイライトを行っています．
1. プログラムの実行には，evalを使っています．
1. console.logは文字列置き換えで別の関数に変換し，プログラムの下のコンソール領域に表示するようにしています．本物のコンソールにも表示されるので，要素などの情報を細かく見たい場合はそちらからどうぞ．

### 使用しているライブラリ
Markdownの変換にshowdown.jsを使用しています．
[showdownjs/showdown](https://github.com/showdownjs/showdown)

コードハイライトにhighlite.jsを使用しています．
[highlight.js](https://highlightjs.org/)

### 今後の発展

- 同じ技術でスライド内のJavaScriptを実行できるようにすれば，技術的な講演時にライブデモを行うのが簡単になると思います．（必要になるのは極めて稀だと思いますが・・・）
- Gistと連携できたら良いですね
- シンタックスハイライトを行いつつ編集できると良いですね（遠い目）
- 本文の編集機能と保存機能を付けて，Jupyterのようにノートとして使えるよう発展できたら良いですね（遠い目）
- そうなったら，クラウドファイルサービスと連携したいですね（遠い目）

### 参考
[動的にJSを実行する方法](https://qiita.com/w650/items/adb108649a0e2a86f334)
