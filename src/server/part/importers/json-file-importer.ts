import { Context } from '@server/shared/context';
import * as fileUtils from '@server/shared/utils/file-utils';
import { ImportPartsResponse, Part } from '@shared/part';
import * as fs from 'fs/promises';
import { partRepository } from '../part-repository';

export async function importFromJsonFile(file: string, ctx: Context) {
  const filePath = fileUtils.uploadsPath(file);

  const json: Part[] = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  await fileUtils.remove(filePath);

  const parts = await processImport(json, ctx);
  return { parts } as ImportPartsResponse;
}

async function processImport(parts: Part[], ctx: Context) {
  const ret: Part[] = [];

  for (const part of parts) {
    const foundPart = await partRepository.find({ slug: part.slug }, ctx);

    if (foundPart) {
      ret.push({ ...part, id: foundPart.id, images: foundPart.images });
    } else {
      ret.push({ ...part, id: undefined });
    }
  }

  return ret;
}
