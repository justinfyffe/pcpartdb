import { RepositoryConfig } from '@server/db/repository';
import { SpecKey } from '@shared/spec';
import { SpecModel, SpecModelPojo } from './spec-model';

export class SpecRepository {
  async saveOne(spec: SpecModelPojo, config?: RepositoryConfig) {
    return await SpecModel.query(config?.trx)
      .insert(spec)
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }

  async saveMultiple(
    productId: number,
    specs: SpecModelPojo[],
    config?: RepositoryConfig,
  ) {
    // Save the specs
    const specsToSave = specs.map((spec) => ({ ...spec, productId }));
    if (specsToSave.length > 0) {
      await SpecModel.query(config?.trx)
        .insert(specsToSave)
        .onConflict(['product_id', 'key'])
        .merge()
        .returning('*');
    }

    // Remove specs that weren't in the list
    const usedKeys = specsToSave.map((review) => review.key!);
    await SpecModel.query(config?.trx)
      .where('productId', productId)
      .whereNotIn('key', usedKeys)
      .delete();
  }

  async findSimilarValue(
    key: SpecKey,
    value: string,
    config?: RepositoryConfig,
  ) {
    const results = await SpecModel.query(config?.trx)
      .distinct('stringValue')
      .where('key', key)
      .andWhere('stringValue', 'ILIKE', `%${value}%`);

    return results.map((spec) => spec.stringValue);
  }
}

export const specRepository = new SpecRepository();
