import * as TE from 'fp-ts/TaskEither';
import { Training, TrainingId } from '../domain/types';
import { TrainingRepository } from '../application/service';
import { AppTaskEither } from '../../shared/types';

export class InMemoryTrainingRepository implements TrainingRepository {
  private trainings: Map<string, Training> = new Map();

  save(training: Training): AppTaskEither<Training> {
    this.trainings.set(training.id, training);
    return TE.right(training);
  }

  findById(id: TrainingId): AppTaskEither<Training | null> {
    const training = this.trainings.get(id) || null;
    return TE.right(training);
  }

  findAll(): AppTaskEither<readonly Training[]> {
    const trainings = Array.from(this.trainings.values());
    return TE.right(trainings);
  }

  // テスト用ヘルパーメソッド
  clear() {
    this.trainings.clear();
  }

  size(): number {
    return this.trainings.size;
  }
}