import { z } from 'zod';
import { createBookSchema } from '../dto/book.dto';

export class Book implements z.infer<typeof createBookSchema> {
  id: number;
  name: string;
  author: string;
  description: string;
  cover?: string;
}