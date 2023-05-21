import { scratchPad } from './scratchPad';

export interface ScratchPadCommandArgs {}

export async function fixDataCommand(_args: ScratchPadCommandArgs) {
  await scratchPad();
}
