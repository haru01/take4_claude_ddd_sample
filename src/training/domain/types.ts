import { z } from 'zod';
import { UUID } from '../../shared/types';

// === ブランド型 ===
export type TrainingId = UUID & { readonly _trainingBrand: unique symbol };

// === Zodスキーマによる型定義 ===
export const TrainingStatusSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('DRAFT'), createdAt: z.date() }),
  z.object({ type: z.literal('PUBLISHED'), publishedAt: z.date() }),
  z.object({ type: z.literal('CANCELLED'), cancelledAt: z.date(), reason: z.string() })
]);

// TrainingIdのZodスキーマ（ブランド型への変換付き）
export const TrainingIdSchema = z.string().uuid().transform((val) => val as TrainingId);

export const createTrainingSchema: (now: Date) => z.ZodObject<{
  id: z.ZodType<TrainingId, any, any>,
  title: z.ZodString,
  description: z.ZodString,
  dateTime: z.ZodEffects<z.ZodDate, Date, Date>,
  location: z.ZodString,
  capacity: z.ZodNumber,
  registeredCount: z.ZodNumber,
  status: typeof TrainingStatusSchema,
  createdAt: z.ZodDate,
  updatedAt: z.ZodDate
}> = (now: Date) => z.object({
  id: TrainingIdSchema,
  title: z.string().min(1, { message: 'タイトルは必須です' }).max(100, { message: 'タイトルは100文字以内で入力してください' }),
  description: z.string().min(1, { message: '説明は必須です' }).max(1000, { message: '説明は1000文字以内で入力してください' }),
  dateTime: z.date().refine((date) => date > now, { message: '過去の日時は指定できません' }),
  location: z.string().min(1, { message: '場所は必須です' }).max(100, { message: '場所は100文字以内で入力してください' }),
  capacity: z.number().int().min(1, { message: '定員は1名以上で設定してください' }).max(1000, { message: '定員は1000名以下で設定してください' }),
  registeredCount: z.number().int().nonnegative(),
  status: TrainingStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

// === 型推論 ===
export type TrainingStatus = z.infer<typeof TrainingStatusSchema>;
export type Training =  z.infer<ReturnType<typeof createTrainingSchema>>;