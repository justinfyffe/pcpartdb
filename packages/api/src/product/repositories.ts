import { Injectable } from '@nestjs/common';
import {
  ProductAutocompleteRepository as BaseProductAutocompleteRepository,
  ProductBenchmarkRepository as BaseProductBenchmarkRepository,
  ProductFieldsRepository as BaseProductFieldsRepository,
  ProductGameFpsRepository as BaseProductGameFpsRepository,
  ProductImageRepository as BaseProductImageRepository,
  ProductRanksRepository as BaseProductRanksRepository,
  ProductRepository as BaseProductRepository,
  ProductSourceRepository as BaseProductSourceRepository,
  ProductUpdateRepository as BaseProductUpdateRepository,
  RelatedProductRepository as BaseRelatedProductRepository,
} from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class ProductRepository extends BaseProductRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class ProductBenchmarkRepository extends BaseProductBenchmarkRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class ProductFieldsRepository extends BaseProductFieldsRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class ProductGameFpsRepository extends BaseProductGameFpsRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class ProductRanksRepository extends BaseProductRanksRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class ProductImageRepository extends BaseProductImageRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class ProductSourceRepository extends BaseProductSourceRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class RelatedProductRepository extends BaseRelatedProductRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class ProductAutocompleteRepository extends BaseProductAutocompleteRepository {
  constructor(db: Database) {
    super(db);
  }
}

@Injectable()
export class ProductUpdateRepository extends BaseProductUpdateRepository {
  constructor(db: Database) {
    super(db);
  }
}
