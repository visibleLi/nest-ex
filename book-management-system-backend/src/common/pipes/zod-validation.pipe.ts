//zod-validation.pipe.ts
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log('Validating value:', value);
    const dataToValidate = value || {};
    const result = this.schema.safeParse(dataToValidate);
    if (!result.success) {
      const issues = result.error.issues;
      const message = issues.reduce((acc: Record<string, string>, issue) => {
        const fileName = issue.path[0];
        acc[fileName] = issue.message;
        return acc;
      }, {});
      throw new BadRequestException(message);
    }
    return result.data;
  }
}
