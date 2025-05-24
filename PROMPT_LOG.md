## 目標

* 関数型DDD（TypeScript + Zod + fp-ts）を実現する方法をステップバイステップで学ぶ

## 準備
```
CLAUDE.mdにある関数型DDD（TypeScript + Zod + fp-ts）の実行環境となる空のプロジェクトを作成してくださ
い。package.json、tsconfig.json、vite.config.ts、必要なディレクトリ構造、.gitignoreを作成し、npm
installを実行してください。
```

```
src フォルダ構成についてDDDの観点で解説してください。
```

```
zod, fp-ts について簡単に解説してください。
```

```
src/shared/types.tsファイルを作成し、関数型DDDアプリケーション全体で使用する共通の
  型定義を実装してください。

  必要な型：
  1. UUID - 一意識別子のブランド型（string & { readonly _brand: unique symbol }）
  2. Result<T> - 処理結果を表現する判別共用体
     - 成功: { success: true; value: T }
     - 失敗: { success: false; error: string }
  3. AppError - アプリケーションエラーの代数的データ型
     - ValidationError: 検証エラー
     - DomainError: ドメインロジックエラー
  4. AppTaskEither<T> - TaskEither<AppError, T>のエイリアス
  5. エラー生成関数 - validationErrorとdomainError

  fp-tsからTaskEitherをインポートして使用してください。
```

###

```
次のストーリーを実現するための function.create.test.tsのみを生成して
### ストーリー1-1: 研修情報の登録A
│   **As a** 研修管理者
│   **I want to** 新しい研修情報を登録する
│   **So that** 受講者が研修を予約できるようにする
### 受け入れ条件
- 研修タイトル、説明、日時、場所、定員を登録できる

また、テスト1件のみ有効にして他はskipして
```

```
npm test
```


```
次のストーリーを実現するための application.create.test.tsのみを生成して
### ストーリー1-1: 研修情報の登録A
│   **As a** 研修管理者
│   **I want to** 新しい研修情報を登録する
│   **So that** 受講者が研修を予約できるようにする
### 受け入れ条件
- 研修タイトル、説明、日時、場所、定員を登録できる

また、テスト1件のみ有効にして他はskipして
```