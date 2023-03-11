import path from 'path';
import { dataPath } from '../shared/file';

const SCRAPER_DATA_PATH = dataPath('scraper');
const SOURCE_MODELS_PATH = path.join(SCRAPER_DATA_PATH, 'source-models');
const TECHPOWERUP_DATA_PATH = path.join(SCRAPER_DATA_PATH, 'techpowerup');
const UL_BENCHMARKS_DATA_PATH = path.join(SCRAPER_DATA_PATH, 'ul-benchmarks');
const VIDEOCARDBENCHMARKs_DATA_PATH = path.join(
  SCRAPER_DATA_PATH,
  'videocardbenchmarks',
);
