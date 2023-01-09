import { Benchmark, Benchmarks } from '@shared/benchmark';
import { ImportPartDataResponse } from '@shared/part';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Example: https://benchmarks.ul.com/hardware/gpu/NVIDIA%20GeForce%20RTX%204090+review
export async function importFromUlBenchmarks(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Get Benchmark Values
  const benchmarks: Benchmarks = {
    timeSpyGraphics: getTimeSpyGraphics($),
  };

  // Add Benchmark Key
  Object.keys(benchmarks).forEach((benchmarkKey) => {
    if (benchmarks[benchmarkKey] == null) {
      return;
    }

    if (benchmarks[benchmarkKey].metadata == null) {
      benchmarks[benchmarkKey].metadata = {};
    }
    benchmarks[benchmarkKey].metadata = {
      ...benchmarks[benchmarkKey]?.metadata,
      benchmarkKey,
    };
  });

  return { part: { benchmarks } } as ImportPartDataResponse;
}

function getTimeSpyGraphics($: cheerio.CheerioAPI): Benchmark<number> {
  const timeSpyGraphics = $('.result-pimp-badge-score-item').first().text();

  return { value: Number(timeSpyGraphics) };
}
