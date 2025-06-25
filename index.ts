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
  const name = req.body.name; // フォームから送信された名前を取得
  const ageString = req.body.age; // フォームから送信された年齢を文字列として取得

  // 年齢が入力されている場合のみ数値に変換する
  const age = ageString ? parseInt(ageString, 10) : null;

  // nameが空の場合は何もしない
  if (!name) {
    return res.redirect('/');
  }

  // ageが入力されていて、かつ数値でない場合はエラー
  if (ageString && (age === null || isNaN(age))) {
    console.error('年齢は数値でなければなりません。');
    return res.status(400).send('年齢は数値でなければなりません。');
  }

  // データベースに新しいユーザーを作成
  const newUser = await prisma.user.create({
    data: { 
      name, 
      // ageがnullでない場合のみデータに含める
      ...(age !== null && { age })
    },
  });
  console.log('新しいユーザーを追加しました:', newUser);

  res.redirect('/'); // ユーザー追加後、一覧ページにリダイレクト
});

// サーバーを指定したポートで起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});