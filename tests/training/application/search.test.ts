import { describe, it, expect, beforeEach } from 'vitest';
import { createTrainingHandler, getAllTrainingsHandler } from '../../../src/training/application/service';
import { InMemoryTrainingRepository } from '../../../src/training/infrastructure/repository';
import { Training } from '../../../src/training/domain/types';

describe('研修検索（アプリケーション層）', () => {
  let repository: InMemoryTrainingRepository;
  let createHandler: ReturnType<typeof createTrainingHandler>;
  let getAllHandler: ReturnType<typeof getAllTrainingsHandler>;

  beforeEach(() => {
    repository = new InMemoryTrainingRepository();
    createHandler = createTrainingHandler(repository);
    getAllHandler = getAllTrainingsHandler(repository);
  });

  describe('ストーリー2-1: 研修の検索A', () => {
    describe('すべての研修一覧を取得できる', () => {
      it('研修が存在しない場合、空の配列を返す', async () => {
        // Act
        const result = await getAllHandler()();

        // Assert
        expect(result._tag).toBe('Right');
        if (result._tag === 'Right') {
          expect(result.right).toEqual([]);
        }
      });

      it('複数の研修が存在する場合、すべての研修を返す', async () => {
        // Arrange
        const commands = [
          {
            title: 'TypeScript関数型プログラミング入門',
            description: 'fp-tsを使った関数型プログラミングの基礎を学びます',
            dateTime: new Date('2099-03-01T10:00:00+09:00'),
            location: 'オンライン',
            capacity: 30
          },
          {
            title: 'ドメイン駆動設計実践',
            description: 'DDDの実践的な実装方法を学びます',
            dateTime: new Date('2099-03-02T14:00:00+09:00'),
            location: '会議室A',
            capacity: 20
          },
          {
            title: 'Clean Architecture入門',
            description: 'Clean Architectureの基本概念と実装を学びます',
            dateTime: new Date('2099-03-03T13:00:00+09:00'),
            location: 'オンライン',
            capacity: 25
          }
        ];

        // 研修を作成
        for (const command of commands) {
          const result = await createHandler(command)();
          expect(result._tag).toBe('Right');
        }

        // Act
        const result = await getAllHandler()();

        // Assert
        expect(result._tag).toBe('Right');
        if (result._tag === 'Right') {
          const trainings = result.right;
          
          // 研修数の確認
          expect(trainings).toHaveLength(3);
          
          // 各研修の基本情報が含まれていることを確認
          const titles = trainings.map(t => t.title);
          expect(titles).toContain('TypeScript関数型プログラミング入門');
          expect(titles).toContain('ドメイン駆動設計実践');
          expect(titles).toContain('Clean Architecture入門');
          
          // 各研修が正しい構造を持っていることを確認
          trainings.forEach(training => {
            expect(training).toMatchObject({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              dateTime: expect.any(Date),
              location: expect.any(String),
              capacity: expect.any(Number),
              status: { type: 'DRAFT' },
              registeredCount: 0,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date)
            });
          });
        }
      });

      it('異なる状態の研修も含めてすべて取得できる', async () => {
        // Arrange
        // DRAFT状態の研修を作成
        const draftCommand = {
          title: 'DRAFT研修',
          description: 'ドラフト状態の研修',
          dateTime: new Date('2099-04-01T10:00:00+09:00'),
          location: 'オンライン',
          capacity: 10
        };
        
        const draftResult = await createHandler(draftCommand)();
        expect(draftResult._tag).toBe('Right');

        // 将来的に他の状態の研修を追加する場合のプレースホルダー
        // 例: PUBLISHED, CANCELLED などの状態の研修

        // Act
        const result = await getAllHandler()();

        // Assert
        expect(result._tag).toBe('Right');
        if (result._tag === 'Right') {
          const trainings = result.right;
          expect(trainings).toHaveLength(1);
          expect(trainings[0]?.status.type).toBe('DRAFT');
        }
      });

      it('研修情報の完全性を確認', async () => {
        // Arrange
        const command = {
          title: 'テスト研修',
          description: '詳細な説明文',
          dateTime: new Date('2099-05-01T15:30:00+09:00'),
          location: '東京本社 会議室B',
          capacity: 15
        };

        const createResult = await createHandler(command)();
        expect(createResult._tag).toBe('Right');

        let createdTraining: Training | null = null;
        if (createResult._tag === 'Right') {
          createdTraining = createResult.right;
        }

        // Act
        const result = await getAllHandler()();

        // Assert
        expect(result._tag).toBe('Right');
        if (result._tag === 'Right' && createdTraining) {
          const trainings = result.right;
          expect(trainings).toHaveLength(1);
          
          const retrieved = trainings[0];
          expect(retrieved).toEqual(createdTraining);
          
          // 個別フィールドの確認
          expect(retrieved?.title).toBe(command.title);
          expect(retrieved?.description).toBe(command.description);
          expect(retrieved?.dateTime).toEqual(command.dateTime);
          expect(retrieved?.location).toBe(command.location);
          expect(retrieved?.capacity).toBe(command.capacity);
        }
      });
    });
  });
});