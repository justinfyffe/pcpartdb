import { Model, PartialModelObject, Transaction } from 'objection';
import { openDatabase } from './database';

export interface RepositoryConfig {
  transaction?: Transaction;
}

export abstract class Repository<TModel extends Model, TEntity> {
  protected db = openDatabase();

  abstract mapFromRow(row: TModel): TEntity;
  abstract mapToRow(entity: TEntity): PartialModelObject<TModel>;
}
