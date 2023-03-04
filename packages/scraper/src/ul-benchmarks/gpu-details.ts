import {
  GpuBenchmarks,
  GpuDataSourceKey,
  GpuField,
  ImportGpuDataResponse,
} from '@pcpartdb/shared';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Example: https://benchmarks.ul.com/hardware/gpu/NVIDIA%20GeForce%20RTX%204090+review
export async function importFromUlBenchmarks(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Get Benchmark Values
  const benchmarks: GpuBenchmarks = {
    timespyGraphics: getTimespyGraphics($),
  };

  return { gpu: { benchmarks } } as ImportGpuDataResponse;
}

function getTimespyGraphics($: cheerio.CheerioAPI): GpuField<number> {
  const timespyGraphics = $('.result-pimp-badge-score-item').first().text();

  const value = timespyGraphics ? Number(timespyGraphics) : null;
  return {
    value,
    meta: {
      fieldKey: 'timespyGraphics',
      dataSource: {
        source: GpuDataSourceKey.UlBenchmarks,
        enabled: value != null,
      },
    },
  };
}
