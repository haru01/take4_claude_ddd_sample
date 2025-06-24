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

次の実装のアプリケーション層のハンドラーとテストを実装して
## 2. 研修検索
### ストーリー2-1: 研修の検索A
**As a** 受講者
**I want to** 研修を条件で検索する
**So that** 自分に適した研修を見つけられる

#### 受け入れ条件
- すべての研修一覧を取得できる


1_SP.mdの受け入れ条件を満たすテストを実施しているかを確認したいです。sear
  ch.test.ts,create.test.ts,
  function.create.test.tsを境界値分析の観点で抜け漏れがないか調べて


```
types.tsの createTrainingSchema 日付を受け取って
dateTime のバリデーションしていますが、
やっぱりやめて過去の日付かどうかの判断はfunction側で行いたいです。
修正して
```

```
次を実装を行いたいです。まずはfunctionのテストのみを
### ストーリー1-2-B: 研修情報の更新
**As a** 研修管理者
**I want to** 研修情報を更新する
**So that** 最新の情報を受講者に提供できる

#### 受け入れ条件
- 既存の研修情報（タイトル、説明、日時、場所、定員）を編集できる
- 研修をドラフトから募集中にできる
```



- 研修を募集中から開催済みにできる
- 研修をドラフト、募集中から中止にできる
- 中止の際は中止理由が必須である

次のストーリーをステップバイステップで作成するためのTODO.mdを作成して。コードは書かないで
### ストーリー1-1: 研修情報の登録A
**As a** 研修管理者
**I want to** 新しい研修情報を登録する
**So that** 受講者が研修を予約できるようにする

#### 受け入れ条件
- 研修タイトル、説明、日時、場所、定員を登録できる
