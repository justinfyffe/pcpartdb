import { getGpuData } from './getGpuData';
import { getSourceModel } from './getSourceModel';

export type ScrapeDataCommandArgs = {
  model?: string;
  count?: string;
  offset?: string;
  file?: string;
  proxy?: boolean;
};

export async function scrapeDataCommand(args: ScrapeDataCommandArgs) {
  console.log(`Scraping data with args=${JSON.stringify(args)}`);

  const { model, proxy } = args;

  const offset = args.offset != null ? Number(args.offset) : 0;
  const count = args.count != null ? Number(args.count) : 10;

  const start = offset;
  const end = offset + count - 1;
  const file = args.file != null ? args.file : `gpus-${start}-${end}.json`;

  // Get source model
  console.log('Getting Source Model');
  const sourceModel = await getSourceModel(model);

  // Fetch data
  console.log(`Building GPU Data. Data will be saved to ${file}`);
  await getGpuData({ sourceModel, offset, count, proxy, file });
}
