# TODOファイルをもとにタスクを実行

---
name: run_todo
args:

- name: index
  short: i
  description: TODOのインデックス番号（例: create_training）
  required: true

---

## 使用例

```
/run_todo index=create_training"
/run_todo i=create_training"
```

## 実行内容

TODO-{{index}}.md をもとにタスクを実行します。
完了すれば TODO-{{index}}.md　にチェックをつけます。
