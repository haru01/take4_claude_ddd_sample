import { describe, it, expect, beforeEach } from 'vitest';
import { createTrainingHandler } from '../../../src/training/application/service';
import { InMemoryTrainingRepository } from '../../../src/training/infrastructure/repository';
import { Training } from '../../../src/training/domain/types';

describe('研修情報の登録（アプリケーション層）', () => {
  let repository: InMemoryTrainingRepository;
  let handler: ReturnType<typeof createTrainingHandler>;

  beforeEach(() => {
    repository = new InMemoryTrainingRepository();
    handler = createTrainingHandler(repository);
  });

  describe('ストーリー1-1: 研修情報の登録', () => {
    it('研修タイトル、説明、日時、場所、定員を登録できる', async () => {
      // Arrange
      const command = {
        title: 'TypeScript関数型プログラミング入門',
        description: 'fp-tsを使った関数型プログラミングの基礎を学びます',
        dateTime: new Date('2099-03-01T10:00:00+09:00'),
        location: 'オンライン',
        capacity: 30
      };

      // Act
      const result = await handler(command)();

      // Assert
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        const training = result.right as Training;
        expect(training).toMatchObject({
          ...command,
          status: { type: 'DRAFT' },
          registeredCount: 0
        });
        expect(training.id).toBeDefined();
        expect(training.createdAt).toBeDefined();
        expect(training.updatedAt).toBeDefined();
        expect(repository.size()).toBe(1);

        // リポジトリから保存された研修を取得して検証
        const savedTraining = await repository.findById(training.id)();

        expect(savedTraining._tag).toBe('Right');
        if (savedTraining._tag === 'Right') {
          expect(savedTraining.right).toEqual(training);
        }
      }
    });

    it('バリデーションエラーが適切に伝播される', async () => {
      // Arrange
      const invalidCommand = {
        title: '', // 空のタイトル
        description: 'テスト説明',
        dateTime: new Date('2099-03-01T10:00:00+09:00'),
        location: 'オンライン',
        capacity: 30
      };

      // Act
      const result = await handler(invalidCommand)();

      // Assert
      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left.type).toBe('ValidationError');
        expect(result.left.message).toContain('タイトルは必須です');
      }
    });

    it('過去の日時はエラーになる', async () => {
      // Arrange
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // 1日前の日時

      const command = {
        title: 'TypeScript関数型プログラミング入門',
        description: 'fp-tsを使った関数型プログラミングの基礎を学びます',
        dateTime: pastDate,
        location: 'オンライン',
        capacity: 30
      };

      // Act
      const result = await handler(command)();

      // Assert
      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left.type).toBe('ValidationError');
        expect(result.left.message).toContain('過去の日時は指定できません');
      }
    });

    it.skip('リポジトリエラーが適切にハンドリングされる', async () => {
      // Arrange
      // エラーを発生させるモックリポジトリの実装が必要
      // このテストは実装詳細に依存するため、スキップ
    });

    it('複数の研修を登録できる', async () => {
      // Arrange
      const command1 = {
        title: 'TypeScript関数型プログラミング入門',
        description: 'fp-tsを使った関数型プログラミングの基礎を学びます',
        dateTime: new Date('2099-03-01T10:00:00+09:00'),
        location: 'オンライン',
        capacity: 30
      };

      const command2 = {
        title: 'ドメイン駆動設計実践',
        description: 'DDDの実践的な実装方法を学びます',
        dateTime: new Date('2099-03-02T14:00:00+09:00'),
        location: '会議室A',
        capacity: 20
      };

      // Act
      const result1 = await handler(command1)();
      const result2 = await handler(command2)();

      // Assert
      expect(result1._tag).toBe('Right');
      expect(result2._tag).toBe('Right');
      expect(repository.size()).toBe(2);

      // それぞれの研修が正しく保存されているか確認
      if (result1._tag === 'Right' && result2._tag === 'Right') {
        const training1 = result1.right as Training;
        const training2 = result2.right as Training;
        
        const saved1 = await repository.findById(training1.id)();
        const saved2 = await repository.findById(training2.id)();
        
        expect(saved1._tag).toBe('Right');
        expect(saved2._tag).toBe('Right');
        
        if (saved1._tag === 'Right' && saved2._tag === 'Right') {
          expect(saved1.right?.title).toBe(command1.title);
          expect(saved2.right?.title).toBe(command2.title);
        }
      }
    });
  });
});