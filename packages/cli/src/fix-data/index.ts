import { fixData } from './fixData';

export interface FixDataCommandArgs {}

export async function fixDataCommand(_args: FixDataCommandArgs) {
  await fixData();
}
