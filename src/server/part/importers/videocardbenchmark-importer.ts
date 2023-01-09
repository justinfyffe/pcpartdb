import { Benchmark, Benchmarks } from '@shared/benchmark';
import { ImportPartDataResponse } from '@shared/part';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Example: https://www.videocardbenchmark.net/gpu.php?gpu=GeForce+RTX+4090&id=4606
export async function importFromVideoCardBenchmark(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Get Benchmark Values
  const benchmarks: Benchmarks = {
    g3dMark: getG3dMark($),
    g2dMark: getG2dMark($),
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

function getG3dMark($: cheerio.CheerioAPI): Benchmark<number> {
  const g3dMark = $('.speedicon').siblings('span').first().text();
  return { value: Number(g3dMark) };
}

function getG2dMark($: cheerio.CheerioAPI): Benchmark<number> {
  const g2dMark = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Average G2D Mark:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  return { value: Number(g2dMark) };
}
