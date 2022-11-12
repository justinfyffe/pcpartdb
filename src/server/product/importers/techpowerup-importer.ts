import axios from 'axios';
import * as cheerio from 'cheerio';

export async function importFromTechPowerUp(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const gpuName = $('dt:contains("GPU Name")')
    .siblings('dd')
    .first()
    .text()
    .trim();

  console.log(gpuName);
}
