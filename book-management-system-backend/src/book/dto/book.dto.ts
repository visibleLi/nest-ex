import { z } from 'zod';

// 基础图书模式
export const bookSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({
      required_error: '书名是必填项', // 字段不存在时的错误
      invalid_type_error: '书名必须是字符串', // 类型错误时的提示
    })
    .trim()
    .min(1, '书名不能为空'),

  author: z
    .string({
      required_error: '作者是必填项',
      invalid_type_error: '作者必须是字符串',
    })
    .trim()
    .min(1, '作者不能为空'),

  description: z
    .string({
      required_error: '描述是必填项',
      invalid_type_error: '描述必须是字符串',
    })
    .trim()
    .min(1, '描述不能为空'),

  // cover: z
  //   .string({
  //     required_error: '封面是必填项',
  //     invalid_type_error: '封面必须是字符串',
  //   })
  //   .trim()
  //   .min(1, '封面不能为空'),
});

// 创建图书 DTO
export const createBookSchema = bookSchema.omit({ id: true }); //去掉id

// 更新图书 DTO
//export const updateBookSchema = bookSchema.partial(); //生成可选
export const updateBookSchema = bookSchema;

// 类型定义
export type Book = z.infer<typeof bookSchema>;
export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
