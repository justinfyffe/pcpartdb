import { fixData } from './fixData';
import { fixRetailModelResults } from './fixRetailModelResults';

export interface FixDataCommandArgs {}

export async function fixDataCommand(_args: FixDataCommandArgs) {
  await fixData();
}
