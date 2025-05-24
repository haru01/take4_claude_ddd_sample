import { describe, it, expect } from 'vitest';
import { createTraining, createTrainingId } from '../../../src/training/domain/functions';
import { Training } from '../../../src/training/domain/types';
import { Result } from '../../../src/shared/types';

// ==========================================
// テストユーティリティ
// ==========================================

const defaultTrainingData = {
  title: 'TypeScript関数型プログラミング入門',
  description: 'fp-tsを使った関数型プログラミングの基礎を学びます',
  dateTime: new Date('2099-02-01T10:00:00+09:00'),
  location: 'オンライン',
  capacity: 30
};

const createTrainingWithDefaults = (overrides: Partial<typeof defaultTrainingData> = {}): Result<Training> => {
  return createTraining({ ...defaultTrainingData, ...overrides });
};

// 日付ヘルパー関数
const oneDayBefore = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

const oneDayAfter = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

// カスタムアサーション
const expectValidationError = (input: Partial<typeof defaultTrainingData>, expectedError: string) => {
  const result = createTrainingWithDefaults(input);
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error).toContain(expectedError);
  }
};

const expectSuccess = (input: Partial<typeof defaultTrainingData> = {}) => {
  const result = createTrainingWithDefaults(input);
  expect(result.success).toBe(true);
  return result;
};

// ==========================================
// テスト本体
// ==========================================

describe('研修情報の登録', () => {
  describe('createTraining', () => {
    describe('正常系', () => {
      it('有効な研修情報を登録できる', () => {
        const result = createTrainingWithDefaults();

        expect(result.success).toBe(true);
        if (result.success) {
          const { value } = result;
          expect(value.title).toBe(defaultTrainingData.title);
          expect(value.description).toBe(defaultTrainingData.description);
          expect(value.dateTime).toEqual(defaultTrainingData.dateTime);
          expect(value.location).toBe(defaultTrainingData.location);
          expect(value.capacity).toBe(defaultTrainingData.capacity);
          expect(value.status.type).toBe('DRAFT');
          expect(value.registeredCount).toBe(0);
          expect(value.id).toBeDefined();
          expect(value.createdAt).toBeDefined();
          expect(value.updatedAt).toBeDefined();
        }
      });
    });

    describe('バリデーションエラー', () => {
      describe('タイトルの検証', () => {
        it('空の場合はエラー', () => {
          expectValidationError({ title: '' }, 'タイトル');
        });

        it('100文字超の場合はエラー', () => {
          expectValidationError({ title: 'a'.repeat(101) }, '100文字');
        });
      });

      describe('説明の検証', () => {
        it('空の場合はエラー', () => {
          expectValidationError({ description: '' }, '説明は必須');
        });

        it('1000文字超の場合はエラー', () => {
          expectValidationError({ description: 'a'.repeat(1001) }, '説明は1000文字以内');
        });
      });

      describe('日時の検証', () => {
        it('過去の日時の場合はエラー', () => {
          expectValidationError({ dateTime: oneDayBefore() }, '過去の日時');
        });
      });

      describe('場所の検証', () => {
        it('空の場合はエラー', () => {
          expectValidationError({ location: '' }, '場所は必須');
        });

        it('100文字超の場合はエラー', () => {
          expectValidationError({ location: 'a'.repeat(101) }, '場所は100文字以内');
        });
      });

      describe('定員の検証', () => {
        it('0名の場合はエラー', () => {
          expectValidationError({ capacity: 0 }, '定員は1名以上');
        });

        it('1001名の場合はエラー', () => {
          expectValidationError({ capacity: 1001 }, '定員は1000名以下');
        });
      });
    });

    describe('境界値の正常系', () => {
      describe('文字列フィールドの境界値', () => {
        it('タイトル1文字の場合も登録できる', () => {
          expectSuccess({ title: 'A' });
        });

        it('タイトル100文字の場合も登録できる', () => {
          expectSuccess({ title: 'a'.repeat(100) });
        });

        it('説明1文字の場合も登録できる', () => {
          expectSuccess({ description: 'A' });
        });

        it('説明1000文字の場合も登録できる', () => {
          expectSuccess({ description: 'a'.repeat(1000) });
        });

        it('場所1文字の場合も登録できる', () => {
          expectSuccess({ location: 'A' });
        });

        it('場所100文字の場合も登録できる', () => {
          expectSuccess({ location: 'a'.repeat(100) });
        });
      });

      describe('数値フィールドの境界値', () => {
        it('定員1名の場合も登録できる', () => {
          expectSuccess({ capacity: 1 });
        });

        it('定員1000名の場合も登録できる', () => {
          expectSuccess({ capacity: 1000 });
        });
      });

      describe('日時の境界値', () => {
        it('未来の日時なら登録できる', () => {
          expectSuccess({ dateTime: oneDayAfter() });
        });
      });
    });
  });

  describe('createTrainingId', () => {
    it('一意なIDを生成できる', () => {
      const id1 = createTrainingId();
      const id2 = createTrainingId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });
});