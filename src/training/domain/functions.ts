import { v4 as uuidv4 } from 'uuid';
import { Result } from '../../shared/types';
import { Training, TrainingId, TrainingSchema } from './types';

// === ID生成 ===
export const createTrainingId = (): TrainingId => uuidv4() as TrainingId;

// === 研修作成関数 ===
export const createTraining = (data: {
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  capacity: number;
}): Result<Training> => {
  const now = new Date();
  
  const training = {
    id: createTrainingId(),
    title: data.title,
    description: data.description,
    dateTime: data.dateTime,
    location: data.location,
    capacity: data.capacity,
    registeredCount: 0,
    status: { type: 'DRAFT' as const, createdAt: now },
    createdAt: now,
    updatedAt: now
  };

  // Zodスキーマ検証（過去の日時チェックを含む）
  const result = TrainingSchema.safeParse(training);
  
  return result.success
    ? { success: true, value: result.data }
    : { success: false, error: result.error.errors[0]?.message || 'Invalid training' };
};