import express from 'express';
// 生成した Prisma Client をインポート
import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ['query'],
});
const app = express();

// 環境変数が設定されていれば、そこからポート番号を取得する。環境変数に設定がなければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定する
app.set('view engine', 'ejs');
// EJSファイルが置かれているディレクトリを 'views' に設定する
app.set('views', './views');

// HTMLのformから送信されたデータを受け取れるように設定する
app.use(express.urlencoded({ extended: true }));

// ルートパス('/')にGETリクエストが来たときの処理
app.get('/', async (req, res) => {
  // データベースから全てのユーザーを取得する
  const users = await prisma.user.findMany();
  // 'index.ejs' ファイルを元にHTMLを生成し、'users' という名前でユーザーデータを渡す
  res.render('index', { users });
});

// '/users' にPOSTリクエストが来たときの処理（フォームからデータが送信されたとき）
app.post('/users', async (req, res) => {
  // フォームの 'name' という名前の入力フィールドの値を取得する
  const name = req.body.name; 
  if (name) {
    // 新しいユーザーをデータベースに作成する
    const newUser = await prisma.user.create({
      data: { name },
    });
    console.log('新しいユーザーを追加しました:', newUser);
  }
  // ユーザー追加後、一覧ページ('/')にリダイレクト（再読み込み）させる
  res.redirect('/');
});

// サーバーを指定したポートで起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});