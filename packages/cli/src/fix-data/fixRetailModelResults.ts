import { generateGpuSlug, Gpu } from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { retailModelsDataPath } from '../scrape-retail-models/utils';

export async function fixRetailModelResults() {
  const directoryPath = retailModelsDataPath();
  const files = await fsPromises.readdir(directoryPath);
  const jsonFiles = files
    .filter((file) => file.endsWith('.json'))
    .map((file) => retailModelsDataPath(file));

  for (const file of jsonFiles) {
    const retailModelsJson = await fsPromises.readFile(file, 'utf-8');
    const retailModels: Gpu[] = JSON.parse(retailModelsJson);

    for (const retailModel of retailModels) {
      retailModel.slug = generateGpuSlug(
        retailModel.name,
        retailModel.company.value,
      );
    }

    await fsPromises.writeFile(
      file,
      JSON.stringify(retailModels, undefined, 2),
      'utf-8',
    );
  }
}
