import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ParseQueryPipe<Q, T> implements PipeTransform<Q, T> {
  constructor(private parseFunc: (query: Q) => T) {}

  transform(value: Q, _metadata: ArgumentMetadata): T {
    return this.parseFunc(value);
  }
}
