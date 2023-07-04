import { yyyyMmDd } from '../../shared/date';
import { getCpuData } from './getCpuData';
import { getSourceModel } from './getSourceModel';

export type ScrapeCpuDataOptions = {
  model?: string;
  count?: string;
  offset?: string;
  file?: string;
  noProxy?: boolean;
};

export async function scrapeCpuData(args: ScrapeCpuDataOptions) {
  console.log(`Scraping data with args=${JSON.stringify(args)}`);

  const { model, noProxy } = args;

  const offset = args.offset != null ? Number(args.offset) : 0;
  const count = args.count != null ? Number(args.count) : 10;

  const start = offset;
  const end = offset + count - 1;
  const file =
    args.file != null ? args.file : `cpus-${yyyyMmDd()}--${start}-${end}.json`;

  // Get source model
  console.log('Getting Source Model');
  const sourceModel = await getSourceModel(model);

  // Fetch data
  console.log('Building CPU Data.');
  await getCpuData({ sourceModel, offset, count, noProxy, file });
  console.log(`Data will be saved to ${file}`);
}
