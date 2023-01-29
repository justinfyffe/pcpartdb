import {
  GpuBenchmark,
  GpuBenchmarks,
  ImportGpuDataResponse,
} from '@shared/gpus';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Example: https://benchmarks.ul.com/hardware/gpu/NVIDIA%20GeForce%20RTX%204090+review
export async function importFromUlBenchmarks(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Get Benchmark Values
  const benchmarks: GpuBenchmarks = {
    timespyGraphics: getTimeSpyGraphics($),
  };

  // Add Benchmark Key
  Object.keys(benchmarks).forEach((benchmarkKey) => {
    const benchmark = benchmarks[benchmarkKey] as GpuBenchmark;
    if (benchmark == null) {
      return;
    }

    if (benchmark.meta == null) {
      benchmark.meta = {};
    }
    benchmark.meta = { ...benchmark?.meta, benchmarkKey };
  });

  return { gpu: { benchmarks } } as ImportGpuDataResponse;
}

function getTimeSpyGraphics($: cheerio.CheerioAPI): GpuBenchmark<number> {
  const timeSpyGraphics = $('.result-pimp-badge-score-item').first().text();

  return { value: Number(timeSpyGraphics) };
}
