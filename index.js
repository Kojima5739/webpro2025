// node:httpモジュールをインポートする。これはNode.jsに標準で入っているWebサーバー機能じゃ。
import { createServer } from 'node:http';

// 環境変数 PORT が設定されていればその値を、なければ 8888 をポート番号として使う。
const PORT = process.env.PORT || 8888;

// createServer メソッドでサーバーを作成する。
// このサーバーはリクエストがあるたびに、引数に渡した関数を実行する。
const server = createServer((req, res) => {
  // リクエストのURLをパースして、パス名やクエリパラメータを取得しやすくする。
  const url = new URL(req.url, `http://${req.headers.host}`);

  // レスポンスヘッダーに文字コードをUTF-8として設定する。日本語が文字化けしないようにするためじゃ。
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // URLのパス名によって処理を分岐する。
  if (url.pathname === '/') {
    console.log("ルートパス (/) へのリクエストじゃな");
    // ステータスコード200（成功）を返し、「こんにちは！」という文字列を送る。
    res.statusCode = 200;
    res.end('こんにちは！');
  } else if (url.pathname === '/ask') {
    console.log("/ask へのリクエストじゃな");
    // URLのクエリパラメータから 'q' の値を取得する。
    const question = url.searchParams.get('q');
    // ステータスコード200（成功）を返し、質問内容を含んだ文字列を送る。
    res.statusCode = 200;
    res.end(`Your question is '${question}'`);
  } else {
    console.log("未定義のパスへのリクエストじゃな");
    // それ以外のパスへのアクセスには、404 Not Found（見つからない）エラーを返す。
    res.statusCode = 404;
    res.end('ページが見つかりません');
  }
});

// 指定したポートでリクエストの待ち受けを開始する。
server.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動したぞ。 http://localhost:${PORT}/ で確認じゃ。`);
});