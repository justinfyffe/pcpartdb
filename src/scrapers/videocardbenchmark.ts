import { GpuBenchmarks, GpuField, ImportGpuDataResponse } from '@shared/gpus';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Example: https://www.videocardbenchmark.net/gpu.php?gpu=GeForce+RTX+4090&id=4606
export async function importFromVideoCardBenchmark(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Get Benchmark Values
  const benchmarks: GpuBenchmarks = {
    g3dMark: getG3dMark($),
    g2dMark: getG2dMark($),
  };

  return { gpu: { benchmarks } } as ImportGpuDataResponse;
}

function getG3dMark($: cheerio.CheerioAPI): GpuField<number> {
  const g3dMark = $('.speedicon').siblings('span').first().text();
  return { value: Number(g3dMark), meta: { fieldKey: 'g3dMark' } };
}

function getG2dMark($: cheerio.CheerioAPI): GpuField<number> {
  const g2dMark = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Average G2D Mark:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  return { value: Number(g2dMark), meta: { fieldKey: 'g2dMark' } };
}
