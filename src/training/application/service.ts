import { pipe } from 'fp-ts/function';
import { fromEither, chain } from 'fp-ts/TaskEither';
import { Either, left, right } from 'fp-ts/Either';
import { Training, TrainingId } from '../domain/types';
import { createTraining } from '../domain/functions';
import { AppError, AppTaskEither, validationError } from '../../shared/types';

// === リポジトリインターフェース ===
export interface TrainingRepository {
  save(training: Training): AppTaskEither<Training>;
  findById(id: TrainingId): AppTaskEither<Training | null>;
  findAll(): AppTaskEither<readonly Training[]>;
}

// === 純粋関数（Either） ===
const validateAndCreateTraining = (command: {
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  capacity: number;
}): Either<AppError, Training> => {
  const result = createTraining(command);

  return result.success
    ? right(result.value)
    : left(validationError(result.error));
};

// === メインハンドラー ===
export const createTrainingHandler = (repository: TrainingRepository) => {
  return (command: {
    title: string;
    description: string;
    dateTime: Date;
    location: string;
    capacity: number;
  }): AppTaskEither<Training> => {
    return pipe(
      // 1. コマンドから研修を作成（バリデーション含む）
      fromEither(validateAndCreateTraining(command)),

      // 2. リポジトリに保存
      chain((training) => repository.save(training))
    );
  };
};