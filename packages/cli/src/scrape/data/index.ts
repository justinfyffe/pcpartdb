import { getGpuData } from './gpu-data';
import { getSourceModel } from './source-model';

export type ScrapeDataCommandArgs = {
  model?: string;
  count?: string;
  offset?: string;
};

export async function scrapeDataCommandHandler(args: ScrapeDataCommandArgs) {
  console.log(`Scraping data with args=${JSON.stringify(args)}`);

  const { model } = args;

  const offset = args.offset != null ? Number(args.offset) : 0;
  const count = args.count != null ? Number(args.count) : 10;

  // Get source model
  console.log('Getting Source Model');
  const sourceModel = await getSourceModel(model);

  // Fetch data
  console.log('Building GPU Data');
  await getGpuData(sourceModel, offset, count);
}
