require('module-alias/register');
import { getTechPowerUpGpuUrls } from '@scrapers/techpowerup';

async function main() {
  await getTechPowerUpGpuUrls();
}
main();
