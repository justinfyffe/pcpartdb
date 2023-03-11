import { getSourceModel } from './source-model';

export type ScrapeDataCommandArgs = {
  model?: string;
  count?: string;
  offset?: string;
};

export async function scrapeDataCommandHandler(args: ScrapeDataCommandArgs) {
  const { model } = args;
  const count = args.count != null ? Number(args.count) : 10;
  const offset = args.offset != null ? Number(args.offset) : 0;

  // Get source model
  const sourceModel = await getSourceModel(model);

  // Fetch data
  for (let i = offset; i < offset + count; ++i) {
    const sourceData = sourceModel[i];
  }

  // Generate GPUs
}
