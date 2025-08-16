import { z } from 'zod';

// const createSchema = z.object({

//     name: z.string().min(1, 'Name is required'),
//     description: z.string().optional(),

// });

// const updateSchema = z.object({

//     name: z.string().optional(),
//     description: z.string().optional(),

// });
const createSchema = z.object({
  courseId: z.string().min(1, 'CourseId is required'),
  rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating cannot exceed 5'),
});

const updateSchema = z.object({
  rating: z.number().min(0).max(5).optional(),
});

export const ReviewValidation = {
createSchema,
updateSchema,
};